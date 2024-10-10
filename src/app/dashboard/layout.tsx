import Chats from "@/components/Chats";
import FriendRequestsCount from "@/components/FriendRequestsCount";
import SignOutButton from "@/components/SignOutButton";
import getFriendsByUserId from "@/helper/getFriendsByUserId";
import fetchRedis from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { UserId } from "@/types/next-auth";
import { Send, UserPlus } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export const metadata = {
  title: "Dashboard",
  description: "Your dashboard",
};

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: ReactNode;
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: <UserPlus className="h-4 w-4" />,
  },
];

interface LayoutProps {
  children: ReactNode;
}

const layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const unSeenFriendRequestsCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_requests`
    )) as UserId[]
  ).length;

  const friends = (await getFriendsByUserId(session.user.id)) as User[];

  return (
    <div className="w-full flex h-screen">
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Send className="h-8 w-auto text-indigo-600" />
        </Link>

        <div className="text-xs font-semibold leading-6 text-gray-400">
          Your chats
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col">
            <li>
              <Chats userId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 mt-7">
                Overview
              </div>

              <ul role="list" className="mt-2 space-y-2">
                {sidebarOptions.map((option) => {
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          {option.Icon}
                        </span>

                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li className="mt-2">
              <FriendRequestsCount
                userId={session.user.id}
                initialUnseenRequestCount={unSeenFriendRequestsCount}
              />
            </li>

            <li className="mt-auto flex items-center">
              <div className="flex items-center gap-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Your profile picture"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="sr-only">Your profile</span>
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
                <SignOutButton className="h-full aspect-square" />
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <aside className="max-h-screen container px-6 py-16 md:py-12 w-full">
        {children}
      </aside>
    </div>
  );
};

export default layout;
