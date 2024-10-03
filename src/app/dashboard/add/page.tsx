import AddFriendForm from "@/components/AddFriendForm";
import { FC } from "react";

const AddFriend: FC = () => {
  return (
    <main className="pt-8">
      <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
      <AddFriendForm />
    </main>
  );
};
export default AddFriend;
