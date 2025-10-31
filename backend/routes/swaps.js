const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const mongoose = require('mongoose');

/**
 * GET /api/swappable-slots
 * Returns all slots from other users marked as SWAPPABLE
 */
router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const slots = await Event.find({ status: 'SWAPPABLE', owner: { $ne: req.user._id } }).populate('owner', 'name email');
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/swap-request
 * body: { mySlotId, theirSlotId }
 */
router.post('/swap-request', auth, async (req, res) => {
  const { mySlotId, theirSlotId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [mySlot, theirSlot] = await Promise.all([
      Event.findById(mySlotId).session(session),
      Event.findById(theirSlotId).session(session)
    ]);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Slot not found' });
    }
    if (!mySlot.owner.equals(req.user._id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'You do not own mySlot' });
    }
    if (mySlot.status !== 'SWAPPABLE' || theirSlot.status !== 'SWAPPABLE') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Both slots must be SWAPPABLE' });
    }

    // Create swap request
    const swapReq = await SwapRequest.create([{
      fromUser: req.user._id,
      toUser: theirSlot.owner,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      status: 'PENDING'
    }], { session });

    // Set both slots to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save({ session });
    await theirSlot.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await SwapRequest.findById(swapReq[0]._id)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('mySlot')
      .populate('theirSlot');

    res.json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/swap-response/:id
 * body: { accepted: true/false }
 */
router.post('/swap-response/:id', auth, async (req, res) => {
  const { accepted } = req.body;
  const requestId = req.params.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const swapReq = await SwapRequest.findById(requestId).session(session);
    if (!swapReq) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Swap request not found' });
    }

    // Only the toUser (owner of theirSlot) can accept/reject
    if (!swapReq.toUser.equals(req.user._id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (swapReq.status !== 'PENDING') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Request already handled' });
    }

    const mySlot = await Event.findById(swapReq.mySlot).session(session);
    const theirSlot = await Event.findById(swapReq.theirSlot).session(session);
    if (!mySlot || !theirSlot) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Slots not found' });
    }

    if (accepted) {
      // swap owners and set statuses back to BUSY
      const tmpOwner = mySlot.owner;
      mySlot.owner = theirSlot.owner;
      theirSlot.owner = tmpOwner;
      mySlot.status = 'BUSY';
      theirSlot.status = 'BUSY';
      swapReq.status = 'ACCEPTED';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await swapReq.save({ session });
    } else {
      // rejected: reset slots to SWAPPABLE
      mySlot.status = 'SWAPPABLE';
      theirSlot.status = 'SWAPPABLE';
      swapReq.status = 'REJECTED';
      await mySlot.save({ session });
      await theirSlot.save({ session });
      await swapReq.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    const populated = await SwapRequest.findById(requestId)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .populate('mySlot')
      .populate('theirSlot');

    res.json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET incoming/outgoing requests for the authenticated user
 */
router.get('/requests', auth, async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ toUser: req.user._id }).populate('fromUser', 'name email').populate('mySlot theirSlot');
    const outgoing = await SwapRequest.find({ fromUser: req.user._id }).populate('toUser', 'name email').populate('mySlot theirSlot');
    res.json({ incoming, outgoing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
