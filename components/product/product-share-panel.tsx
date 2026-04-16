"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, MessageCircleMore } from "lucide-react";

type ProductSharePanelProps = {
  locale: "ka" | "en";
  title: string;
  url: string;
};

export function ProductSharePanel({ locale, title, url }: ProductSharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(url);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a6f3a]">
            {locale === "ka" ? "გაზიარება" : "Share"}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {locale === "ka" ? "გააზიარე პროდუქტი" : "Share this product"}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
            {locale === "ka"
              ? "Facebook-ზე ან მესენჯერებში გაგზავნისთვის გამოიყენეთ სწრაფი ბმულები."
              : "Use quick share links for Facebook and messaging apps."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-[#1877f2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1464cf]"
          >
            <Link2 className="h-4 w-4" />
            {locale === "ka" ? "გაზიარება Facebook-ზე" : "Share on Facebook"}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-[#25d366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1faa53]"
          >
            <MessageCircleMore className="h-4 w-4" />
            WhatsApp
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied
              ? locale === "ka"
                ? "ბმული დაკოპირდა"
                : "Link copied"
              : locale === "ka"
                ? "ბმულის კოპირება"
                : "Copy link"}
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-[1.3rem] border border-border bg-slate-50 px-4 py-3 text-sm text-slate-600">
        <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
        <span className="truncate">{shareUrl}</span>
      </div>
    </div>
  );
}
