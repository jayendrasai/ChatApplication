import { User } from './user.types'

export interface Message {
    _id : string;
    senderId : User;
    encryptedText : string;
    createdAt : string;
}

export interface ChatRoom{
    _id : string;
    participants : User[];
    lastMessage ?: Message;
    updatedAt : string;
    
}
