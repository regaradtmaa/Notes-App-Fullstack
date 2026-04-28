const express = require('express');
const router = express.Router();
const { getNotes, createNote } = require('../controllers/noteController');

router.get('/:userId', getNotes);
router.post('/', createNote);

module.exports = router;