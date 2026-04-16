import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="container-shell py-16">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">Create account</h1>
        <p className="text-slate-600">Guest checkout is available, but accounts unlock order history and saved addresses.</p>
        <RegisterForm />
      </div>
    </div>
  );
}
