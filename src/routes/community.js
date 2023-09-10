const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const authenticateJWT = require('../middleware/authMiddleware');

// Define controller functions
const {
  getAllCommunities,
  createCommunity,
  getCommunityMembers,
  addCommunityMember,
  removeCommunityMember,
} = communityController;

// Routes
router.get('/all', authenticateJWT, getAllCommunities);
router.post('/create', authenticateJWT, createCommunity);
router.get('/:communityId/members', authenticateJWT, getCommunityMembers);
router.post('/:communityId/add-member', authenticateJWT, addCommunityMember);
router.delete('/:communityId/remove-member/:memberId', authenticateJWT, removeCommunityMember);

module.exports = router;
