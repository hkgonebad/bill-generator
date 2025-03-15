import { Metadata } from "next";
import SignInForm from "./signin-form";

export const metadata: Metadata = {
  title: "Sign In - Bill Generator",
  description: "Sign in to your Bill Generator account",
};

export default function SignInPage() {
  return <SignInForm />;
}
