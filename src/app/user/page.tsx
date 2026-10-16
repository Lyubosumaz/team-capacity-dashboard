import { UserPageClient } from "@/views/user/UserPageClient";
import { FirebaseGate } from "@/components/firebase/FirebaseGate";

const UserPage = () => (
  <FirebaseGate feature="Account">
    <UserPageClient />
  </FirebaseGate>
);

export default UserPage;
