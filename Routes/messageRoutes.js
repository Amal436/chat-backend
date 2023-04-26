const { sendMessage, allMessages, deleteMessage } = require('../Controller/messagesController');

const express = require('express');

const router = express.Router();

// For sending message
router.post("/message", sendMessage);
// For getting all the messages from  
router.get("/:chatId", allMessages);
// For deleting a message 
router.post("/message/delete",deleteMessage);

module.exports = router;