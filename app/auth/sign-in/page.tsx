import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">Sign in</h1>
        <p className="text-slate-600">Use the seeded admin credentials or create a new account.</p>
        <SignInForm />
      </div>
    </div>
  );
}
