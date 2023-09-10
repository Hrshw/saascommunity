const Community = require('../models/Community');
const User = require('../models/User');
const communityController = require('../controllers/communityController');

exports.getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json({ communities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const newCommunity = new Community({ name, adminUserId: req.userId });
    await newCommunity.save();
    res.status(201).json({ message: 'Community created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getCommunityMembers = async (req, res) => {
  try {
    const { communityId } = req.params;

    // Find the community by ID
    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if the current user is a member of the community or an admin
    if (community.adminUserId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Find members of the community
    const members = await User.find({ _id: { $in: community.members } });
    res.status(200).json({ members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addCommunityMember = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { userId } = req.body;

    // Check if the current user is the admin of the community
    const community = await Community.findById(communityId);

    if (!community || community.adminUserId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Check if the user to be added exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the user as a member
    community.members.push(userId);
    await community.save();

    res.status(201).json({ message: 'User added as a member' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.removeCommunityMember = async (req, res) => {
  try {
    const { communityId, memberId } = req.params;

    // Check if the current user is the admin of the community
    const community = await Community.findById(communityId);

    if (!community || community.adminUserId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Remove the member from the community
    community.members.pull(memberId);
    await community.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Controller function to add a user as a member to a community
exports.addMemberToCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { name } = req.body;
    // Check if the user to be added exists
    const user = await User.findOne({ name });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already a member of the community
    const existingMember = await CommunityMember.findOne({ communityId, userId: user._id });

    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of the community' });
    }

    // Add the user as a member
    const newMember = new CommunityMember({ userId: user._id, communityId });
    await newMember.save();

    res.status(201).json({ message: 'User added as a member' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
