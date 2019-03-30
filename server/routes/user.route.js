const express = require('express');
const router = express.Router();

const user_controller = require('../controllers/user.controller');

// Device auth for user creation/ login
router.post('/auth', user_controller.device_auth);

// Create, read, update, and delete user objects
router.post('/', user_controller.user_login);
router.get('/', user_controller.user_details);
router.put('/', user_controller.user_update);
router.delete('/', user_controller.user_delete);

// Add, read, update, and delete relationship to customers
router.post('/customers', user_controller.user_add_customer);
router.get('/customers', user_controller.user_customer_details);
router.delete('/customers', user_controller.user_remove_customer);

// Read and confirm relationship to vendors
router.post('/vendors', user_controller.user_confirm_vendor);
router.put('/vendors', user_controller.user_confirm_vendor_email);
router.get('/vendors', user_controller.user_vendor_details);

module.exports = router;