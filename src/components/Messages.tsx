"use client";

import { cn } from "@/lib/utilities";
import { Message } from "@/lib/validations/validators";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useRef, useState } from "react";

interface MessagesProps {
  initialMessages: Message[];
  userId: string;
  userImage: string | null | undefined;
  friendImage: string;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  userId,
  userImage,
  friendImage,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-2 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef}></div>
      {messages.map((message, index) => {
        const isCurrentUser = userId === message.senderId;

        const hasNextMessageFromSender =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div className="chat-message" key={message.id}>
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn("flex flex-col text-base max-w-xs mx-2", {
                  "order-1 items-end": isCurrentUser,
                  "order-2 items-start": !isCurrentUser,
                })}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSender && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSender && !isCurrentUser,
                  })}
                >
                  {message.text}
                  <span className="ml-2 text-xs text-gray-400">
                    {format(message.timestamp, "HH:mm")}
                  </span>
                </span>
              </div>

              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  "as invisible": hasNextMessageFromSender,
                })}
              >
                <Image
                  fill
                  src={isCurrentUser ? (userImage as string) : friendImage}
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Messages;
