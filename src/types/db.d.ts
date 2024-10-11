interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}

interface Chat {
  id: string;
  messages: Message[];
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

interface ExtendedMessage extends Message {
  senderImage: string;
  senderName: string;
}
