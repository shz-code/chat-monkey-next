import { z } from "zod";
import fetchRedis from "./redis";

const getUserById = async (userId: string) => {
  try {
    const { userId: validatedId } = z
      .object({ userId: z.string() })
      .parse({ userId });

    const result = (await fetchRedis("get", `user:${validatedId}`)) as string;
    const friend = JSON.parse(result) as User;

    return friend;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Error fetching friend: ", error.message);
    }
  }
};

export default getUserById;
