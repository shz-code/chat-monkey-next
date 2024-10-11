"use client";
import axios, { AxiosError } from "axios";
import { Send } from "lucide-react";
import { FC, useRef, useState } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./ui/Button";

interface ChatInputProps {
  friend: User;
  chatId: string;
}
const ChatInput: FC<ChatInputProps> = ({ friend, chatId }) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
    } catch (error) {
      if (error instanceof AxiosError) toast.error(error.response?.data);
      else toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
      textAreaRef.current?.focus();
    }
  };
  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
        <TextareaAutosize
          ref={textAreaRef}
          className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
          onKeyDown={(e) => {
            if (e.key == "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${friend.name}`}
        />
        <div
          onClick={() => textAreaRef.current?.focus()}
          className="py-2"
          aria-hidden="true"
        >
          <div className="py-px">
            <div className="h-9"></div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button onClick={sendMessage} type="submit" isLoading={isLoading}>
              {!isLoading && <Send size={18} />} Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatInput;
