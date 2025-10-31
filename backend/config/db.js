const mongoose = require('mongoose');

async function connectDB(uri){
    await mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
}

module.exports = connectDB;