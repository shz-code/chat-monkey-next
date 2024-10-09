import fetchRedis from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
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
      `chats:${chatId}:`,
      0,
      -1
    )) as string[];
    console.log(data);

    // let messages = data.reverse();
    // messages = messageArrayValidator.parse(messages);

    // console.log(messages);
  } catch (error) {
    console.log(error);

    notFound();
  }
};

const page = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--");

  // console.log(user.id, userId1);

  if (user.id != userId2 && user.id != userId1) notFound();

  const friendId = user.id === userId1 ? userId2 : userId1;
  const friend = (await fetchRedis("get", `user:${friendId}`)) as User;

  const initialMessages = await getChatMessages(chatId);

  return <div>page</div>;
};

export default page;
