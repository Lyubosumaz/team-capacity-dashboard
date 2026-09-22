import type { FC } from "react";
import { LoginPageClient } from "@/components/auth/LoginPageClient";
import { withFirebasePage } from "@/common/withFirebasePage/withFirebasePage";

const LoginPage: FC = async () =>
  withFirebasePage("Sign in", async () => <LoginPageClient />);

export default LoginPage;
