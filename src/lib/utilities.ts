import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inp: ClassValue[]) => {
    return twMerge(clsx(...inp));
}