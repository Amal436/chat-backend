const catchAsyncError = require("../Middleware/catchAsyncError");
const Chat = require("../Models/chatModel");
const Message = require("../Models/messageModel");
const User = require("../Models/userModal");
const ErrorHandler = require("../Utils/ErrorHandler");

exports.sendMessage = catchAsyncError(async (req, res, next) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return next(new ErrorHandler("Something went wrong while sending the message", 400));
    }

    var newMessage = {
        sender: '64464ce9a7918bce5dce5a24',
        content: content,
        chat: chatId
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name email',
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });

        res.json(message);
    } catch (error) {
        return next(new ErrorHandler("Error occured", 500));
    }
})

exports.allMessages = catchAsyncError(async (req, res, next) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name email").populate("chat");

        res.json(messages);
    } catch (error) {
        return next(new ErrorHandler("Error occured", 500));
    }
})

exports.deleteMessage = catchAsyncError(async (req, res, next) => {
    const { id } = req.body;

    const result = await Message.deleteOne({ _id: id });
    if (result.deletedCount !== 1) {
        return next(new ErrorHandler("message not found with this id", 404));
    }
    res.status(200).json({
        success: true,
        message: "message deleted successfully"
    })
})