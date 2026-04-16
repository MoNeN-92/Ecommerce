"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type AdminDeleteButtonProps = {
  endpoint: string;
  confirmMessage: string;
  label: string;
  deletingLabel: string;
  fallbackError: string;
  className?: string;
};

export function AdminDeleteButton({
  endpoint,
  confirmMessage,
  label,
  deletingLabel,
  fallbackError,
  className
}: AdminDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading || !window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        window.alert(data?.message ?? fallbackError);
        setLoading(false);
        return;
      }

      router.refresh();
    } catch {
      window.alert(fallbackError);
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  return (
    <Button type="button" variant="danger" onClick={handleDelete} disabled={loading} className={className}>
      {loading ? deletingLabel : label}
    </Button>
  );
}
