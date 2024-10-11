import fetchRedis from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utilities";
import { addFriendValidator } from "@/lib/validations/validators";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();

    const { email: validatedEmail } = addFriendValidator.parse({ email });

    const session = await getServerSession(authOptions);

    if (!session) return new Response("Unauthorized", { status: 401 });

    const idToAdd = (await fetchRedis(
      "get",
      `user:email:${validatedEmail}`
    )) as string;

    if (!idToAdd)
      return new Response("This person does not exist.", { status: 400 });

    if (idToAdd === session.user.id)
      return new Response("You cannot add yourself as a friend", {
        status: 400,
      });

    const isAlreadyAdded = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_requests`,
      session.user.id
    )) as 1 | 0;

    if (isAlreadyAdded)
      return new Response("Already added this user", { status: 400 });

    const isAlreadyFriends = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 1 | 0;

    if (isAlreadyFriends)
      return new Response("Already friends with this user", { status: 400 });

    // Pusher
    await pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_requests`),
      "incoming_requests",
      { senderId: session.user.id, senderEmail: session.user.email }
    );
    // Save to db
    db.sadd(`user:${idToAdd}:incoming_requests`, session.user.id);
    return new Response("OK");
  } catch (error) {
    if (error instanceof ZodError)
      return new Response("Invalid request payload", { status: 422 });
  }

  return new Response("Invalid Request", { status: 400 });
};
