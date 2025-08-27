import React from 'react';
import {ChatList} from '../components/ChatList';

export const ChatPage = () => {
    return (
         <div className="h-screen w-screen flex">
      <ChatList />
      <div className="flex-1 flex items-center justify-center bg-gray-200">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    </div>
    );
};