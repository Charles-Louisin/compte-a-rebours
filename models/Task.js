const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['front', 'back']
  },
  description: {
    type: String,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Task', taskSchema);
