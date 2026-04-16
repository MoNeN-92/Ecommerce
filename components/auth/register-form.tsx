"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", locale: "ka" });
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setError("Registration failed");
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false
    });

    router.push("/ka/account");
    router.refresh();
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-8 shadow-soft">
      <Input placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
      <Input placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      <Input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
      <Input placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button onClick={submit} className="w-full">Create account</Button>
    </div>
  );
}
