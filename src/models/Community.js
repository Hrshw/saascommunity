const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Community', communitySchema);
