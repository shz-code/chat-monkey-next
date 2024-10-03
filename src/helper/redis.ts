const getRedisCredentials = () => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || url.length === 0) throw new Error("Missing Redis Url");
  if (!token || token.length === 0) throw new Error("Missing Redis Token");

  return { url, token };
};

type Command = "get";

const fetchRedis = async (command: Command, ...args: string[]) => {
  const url = `${getRedisCredentials().url}/${command}/${args.join("/")}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getRedisCredentials().token}`,
    },
    // cache: 'no-store'
  });
  if (!response.ok)
    throw new Error(`Error executing Redis command: ${response.statusText}`);

  const data = await response.json();
  return data.result;
};
