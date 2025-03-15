import { Metadata } from "next";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Register - Bill Generator",
  description: "Create an account for Bill Generator",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
