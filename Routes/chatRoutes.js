const express = require('express');
const { accessChat, fetchChats } = require('../Controller/chatControllers');

const router = express.Router();

router.post("/chat", accessChat);
router.get("/chats", fetchChats);

module.exports = router;