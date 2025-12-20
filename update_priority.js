require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');

  // Update all tasks to have priority if not set
  await Task.updateMany({ priority: { $exists: false } }, { $set: { priority: 0 } });

  console.log('Updated existing tasks with priority field');
  mongoose.connection.close();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
