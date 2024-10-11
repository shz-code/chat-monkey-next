"use client";
import { pusherClient } from "@/lib/pusher";
import { chatLinkConstructor, toPusherKey } from "@/lib/utilities";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast";

interface ChatsProps {
  userId: string;
  friends: User[];
}

const Chats: FC<ChatsProps> = ({ userId, friends }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${userId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${userId}:friends`));

    const newFriendHandler = () => {
      router.refresh();
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatLinkConstructor(message.senderId, userId)}`;

      if (shouldNotify) {
        toast.custom((t) => (
          <CustomToast t={t} userId={userId} message={message} />
        ));

        setUnseenMessages((prev) => [...prev, message]);
      }
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${userId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${userId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, userId]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {friends.sort().map((friend) => {
        const chatCount = unseenMessages.filter(
          (msg) => msg.senderId === friend.id
        ).length;
        return (
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatLinkConstructor(userId, friend.id)}`}
              className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              {friend.name}
              {chatCount > 0 && (
                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {chatCount}
                </div>
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
export default Chats;
