import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inp: ClassValue[]) => {
  return twMerge(clsx(...inp));
};

export const chatLinkConstructor = (id1: string, id2: string) => {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
};

export const toPusherKey = (key: string) => {
  return key.split(":").join("__");
};
