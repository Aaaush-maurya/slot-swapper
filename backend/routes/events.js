const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// GET /api/events - get user's events
router.get('/', auth, async (req, res) => {
  const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
  res.json(events);
});

// POST /api/events - create event
router.post('/', auth, async (req, res) => {
  try {
    const { title, startTime, endTime } = req.body;
    const ev = await Event.create({ title, startTime, endTime, owner: req.user._id });
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Could not create event' });
  }
});

// PUT /api/events/:id - update event (including status)
router.put('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    const { title, startTime, endTime, status } = req.body;
    if (title !== undefined) ev.title = title;
    if (startTime !== undefined) ev.startTime = startTime;
    if (endTime !== undefined) ev.endTime = endTime;
    if (status !== undefined) ev.status = status;
    await ev.save();
    res.json(ev);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Could not update event' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    if (!ev.owner.equals(req.user._id)) return res.status(403).json({ message: 'Not authorized' });
    await ev.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Could not delete' });
  }
});

module.exports = router;
