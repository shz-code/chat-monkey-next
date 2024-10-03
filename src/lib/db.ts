import { Redis } from "@upstash/redis";

const getRedisCredentials = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || url.length === 0) throw new Error("Missing Redis Url");
  if (!token || token.length === 0) throw new Error("Missing Redis Token");

  return { url, token };
};

export const db = new Redis({
  url: getRedisCredentials().url,
  token: getRedisCredentials().token,
});
