import type { FC } from "react";
import { UserPageClient } from "@/components/user/UserPageClient";
import { withFirebasePage } from "@/common/withFirebasePage/withFirebasePage";

const UserPage: FC = async () =>
  withFirebasePage("Account", async () => <UserPageClient />);

export default UserPage;
