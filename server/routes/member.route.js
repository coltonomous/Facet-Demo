const express = require('express');
const router = express.Router();

const member_controller = require('../controllers/member.controller');

// Create, read, update, and delete user objects
router.post('/', member_controller._member_add);
router.get('/:email_string', member_controller.member_search);

module.exports = router;