const mongoose = require('mongoose');

const communityMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community', // Reference to the Community model
    required: true,
  },
});

const CommunityMember = mongoose.model('CommunityMember', communityMemberSchema);

module.exports = CommunityMember;
