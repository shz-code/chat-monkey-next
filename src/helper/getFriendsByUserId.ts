import { z } from "zod";
import fetchRedis from "./redis";

const getFriendsByUserId = async (userId: string) => {
  try {
    const { userId: validatedId } = z
      .object({ userId: z.string() })
      .parse({ userId });

    const result = (await fetchRedis(
      "smembers",
      `user:${validatedId}:friends`
    )) as string[];

    const friends = await Promise.all(
      result.map(async (id) => {
        const friend = (await fetchRedis("get", `user:${id}`)) as string;
        return JSON.parse(friend) as User;
      })
    );
    return friends;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Error fetching friend: ", error.message);
    }
  }
};

export default getFriendsByUserId;
