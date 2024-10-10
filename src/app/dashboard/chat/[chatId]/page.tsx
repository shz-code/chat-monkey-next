import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import getUserById from "@/helper/getUserById";
import fetchRedis from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { messageArrayValidator } from "@/lib/validations/validators";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    chatId: string;
  };
}

const getChatMessages = async (chatId: string) => {
  try {
    const data = (await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1
    )) as string[];

    const dbMessages = data.map((message) => JSON.parse(message) as Message);

    const reversedDbMessages = dbMessages.reverse();
    const messages = messageArrayValidator.parse(
      reversedDbMessages
    ) as Message[];

    return messages;
  } catch (error) {
    notFound();
  }
};

const page = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  if (user.id != userId2 && user.id != userId1) notFound();

  const friendId = user.id === userId1 ? userId2 : userId1;
  const friend = (await getUserById(friendId)) as User;

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image
                fill
                referrerPolicy="no-referrer"
                src={friend.image}
                alt={`${friend.name} profile picture`}
                className="rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-gray-700 mr-3 font-semibold">
                {friend.name}
              </span>
            </div>

            <span className="text-sm text-gray-600">{friend.email}</span>
          </div>
        </div>
      </div>
      <Messages
        // chatId={chatId}
        friendImage={friend.image}
        userImage={session.user.image}
        userId={session.user.id}
        initialMessages={initialMessages}
      />
      <ChatInput friend={friend} chatId={chatId} />
    </div>
  );
};

export default page;
