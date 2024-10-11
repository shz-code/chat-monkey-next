import fetchRedis from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utilities";
import { messagesValidator } from "@/lib/validations/validators";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export const POST = async (req: Request) => {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const [userId1, userId2] = chatId.split("--");
    if (session.user.id != userId1 && session.user.id != userId2)
      return new Response("Unauthorized", { status: 400 });

    const friendId = session.user.id === userId1 ? userId2 : userId1;

    const isFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      friendId
    )) as 1 | 0;
    if (!isFriend) return new Response("Unauthorized", { status: 400 });

    // Send Message
    const timestamp = Date.now();

    const messageData: Message = {
      id: nanoid(),
      timestamp,
      text,
      senderId: session.user.id,
      receiverId: friendId,
    };

    const message = messagesValidator.parse(messageData);

    // Pusher
    await pusherServer.trigger(
      toPusherKey(`chat:${chatId}`),
      "incoming_message",
      message
    );

    // Save to db
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new Response("ok");
  } catch (error) {
    if (error instanceof Error)
      return new Response(error.message, { status: 500 });

    return new Response("Invalid Request", { status: 400 });
  }
};
