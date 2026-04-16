"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/ka/account";

  const submit = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    if (result?.error) {
      setError("Invalid credentials");
      return;
    }

    router.push(result?.url ?? callbackUrl);
    router.refresh();
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-8 shadow-soft">
      <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
      <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button onClick={submit} className="w-full">Sign in</Button>
      <div className="border-t border-border pt-4 text-center text-sm text-slate-600">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-primary transition hover:opacity-80">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
