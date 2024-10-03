import { addFriendValidator } from "@/lib/validations/validators";

export const POST = async (req: Request) => {
  const { email } = await req.json();

  const { email: validatedEmail } = addFriendValidator.parse({ email });

  return new Response("Hello from Next.js!");
};
