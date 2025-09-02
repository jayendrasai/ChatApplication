import { User } from "./user.types";

// // This interface defines the shape of a single Message object
export interface Message {
  _id: string;
  chatroomId: string;
  sender: User; // RENAMED: from senderId to sender to match component usage and backend population
  encryptedText: string;
  text?: string; // ADDED: Optional field to hold the decrypted message for the UI
  status?: "sent" | "delivered" | "read";
  type?: "text" | "image" | "file";
  createdAt: string;
  updatedAt?: string;
}
// This interface defines the shape of a ChatRoom object
export interface ChatRoom {
  _id: string;
  participants: User[]; // Assumes participant details will be populated
  type: "one_to_one" | "group";
  lastMessage?: Message; // The last message can be optional
  unreadCount?: { [userId: string]: number }; // Represents a Map in TS
  groupname?: string;
  groupicon?: string;
  status?: "active" | "blocked";
  blockedBy?: string;
  mutedBy?: string[];
  archivedBy?: string[];
  createdAt: string;
  updatedAt?: string;
}


// export interface BackendMessage {
//   _id: string;
//   chatroomId: string;
//   sender: User;
//   encryptedText: {
//     ciphertext: string;
//     nonce: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// // 3. Extends BackendMessage to include the decrypted message text for the UI.
// // This is the type used to display messages to the user.
// export interface UIMessage extends BackendMessage {
//   text: string; // The decrypted message
//   status: "sent" | "delivered" | "read";
//   type?: "text" | "image" | "file";
// }

// // 4. Defines the shape of a ChatRoom object.
// export interface ChatRoom {
//   _id: string;
//   participants: User[];
//   type: "one_to_one" | "group";
//   lastMessage: UIMessage; // The last message, which has been decrypted for display
//   unreadCount: { [userId: string]: number };
//   groupname?: string;
//   groupicon?: string;
//   status?: "active" | "blocked";
//   blockedBy?: string;
//   mutedBy?: string[];
//   archivedBy: string[];
//   createdAt: string;
//   updatedAt: string;
// }