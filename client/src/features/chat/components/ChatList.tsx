import React , {useState , useEffect } from 'react';
import { getMyChatRooms } from '../../../services/chat.services';
import { ChatRoom } from '../../../types/chat.types';
import { useAuth } from '../../../context/AuthProvider';


export const ChatList = () => {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState<string | null>(null);
    const {logout} = useAuth();


    useEffect (() => {
        const fetchChatRooms = async () => {
            try {
                const rooms = await getMyChatRooms();
                setChatRooms(rooms);

            } catch (error) {
                setError('Failed to fetch chat rooms.');
            }
            finally{
                setLoading(false);
            }
        };
        fetchChatRooms();
    },[]);

    return (
       <div className="w-1/4 bg-gray-100 border-r border-gray-300 flex flex-col">
      <div className="p-4 border-b border-gray-300 flex justify-between items-center">
        <h2 className="text-xl font-bold">Chats</h2>
        <button onClick={logout} className="bg-red-500 text-white text-sm font-bold py-1 px-3 rounded">
          Logout
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading && <p className="p-4">Loading chats...</p>}
        {error && <p className="p-4 text-red-500">{error}</p>}
        {!loading && chatRooms.length === 0 && (
          <p className="p-4 text-gray-500">No chats yet. Start a new conversation!</p>
        )}
        {chatRooms.map((room) => (
          <div key={room._id} className="p-4 border-b border-gray-200 hover:bg-gray-200 cursor-pointer">
            <p className="font-semibold">{room.participants.map(p => p.username).join(', ')}</p>
            <p className="text-sm text-gray-600 truncate">
              {room.lastMessage ? '...' : 'No messages yet'}
            </p>
          </div>
        ))}
      </div>
    </div>
    );
};