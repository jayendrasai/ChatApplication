//This service will handle all API calls related to chat rooms

import api from '../lib/axios';
import {ChatRoom} from '../types/chat.types'

export const getMyChatRooms = async (): Promise<ChatRoom[]> => {
    const {data} = await api.get('api/chatroom/');
    return data;
};