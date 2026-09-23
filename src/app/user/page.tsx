import type { FC } from "react";
import { UserPageClient } from "@/components/user/UserPageClient";
import { FirebaseGate } from "@/common/FirebaseGate/FirebaseGate";

const UserPage: FC = () => (
  <FirebaseGate feature="Account">
    <UserPageClient />
  </FirebaseGate>
);

export default UserPage;
