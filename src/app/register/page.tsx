import type { FC } from "react";
import { RegisterPageClient } from "@/components/auth/RegisterPageClient";
import { withFirebasePage } from "@/common/withFirebasePage/withFirebasePage";

const RegisterPage: FC = async () =>
  withFirebasePage("Registration", async () => <RegisterPageClient />);

export default RegisterPage;
