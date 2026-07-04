import type { Metadata } from "next";
import Link from "next/link";
import { FriendList } from "@/features/friends/components/FriendList";
import { SendRequestForm } from "@/features/friends/components/SendRequestForm";

export const metadata: Metadata = { title: "Friends — Social" };

export default function FriendsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-h1 font-semibold text-ink">Friends</h1>
        <Link
          href="/friends/requests"
          className="text-body-sm font-medium text-brand-600 hover:underline"
        >
          Requests
        </Link>
      </div>
      <SendRequestForm />
      <FriendList />
    </div>
  );
}
