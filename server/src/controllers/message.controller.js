import Message from '../models/Message.js'
import Chatroom from '../models/Chatroom.js';

export const saveMessage = async (messageData) => {
    const {chatRoomId , senderId , encryptedText } = messageData;
    try {
        const newMessage = new Message({
            chatRoomId: chatRoomId,
            senderId : senderId,
            encryptedText : encryptedText
        });
        await newMessage.save();
        await Chatroom.findByIdAndUpdate(chatRoomId,{
            lastMessage: newMessage._id,
        });

        const populatedMessage = await Message.findById(newMessage._id)
                                                                      .populate('senderId' , 'username publicKey avatarUrl')
                                                                      .exec();
                                                        
    
        return populatedMessage;
    } catch (error) {
        console.error('Error saving message: ',error);
    }
};