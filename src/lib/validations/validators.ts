import { z } from "zod";

export const addFriendValidator = z.object({
  email: z.string().email(),
});

export const messagesValidator = z.object({
  id: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  text: z.string(),
  timestamp: z.number(),
});

export const messageArrayValidator = z.array(messagesValidator);

export type AddFriendFormType = z.infer<typeof addFriendValidator>;
export type Message = z.infer<typeof messagesValidator>;
