"use client";

import { X } from "lucide-react";
import { InstallmentBankLogo } from "@/components/shared/installment-bank-logo";
import { Button } from "@/components/ui/button";
import { INSTALLMENT_BANKS } from "@/lib/installment-banks";

export function InstallmentBankModal({
  locale,
  open,
  onClose,
  onSelect
}: {
  locale: "ka" | "en";
  open: boolean;
  onClose: () => void;
  onSelect: (bankId: string) => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-[2rem] border border-black/[0.06] bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.24)] sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a6f3a]">
              {locale === "ka" ? "ონლაინ განვადება" : "Online installments"}
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">
              {locale === "ka" ? "აირჩიეთ სასურველი ბანკი" : "Choose your preferred bank"}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {locale === "ka"
                ? "შემდეგ ეტაპზე შეგეძლებათ განვადების ვადისა და შეკვეთის დეტალების დაზუსტება."
                : "On the next step you can review the installment period and order details."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label={locale === "ka" ? "დახურვა" : "Close"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          {INSTALLMENT_BANKS.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => onSelect(bank.id)}
              className={`flex w-full items-center gap-4 rounded-[1.6rem] border p-4 text-left transition ${bank.accentClass}`}
            >
              <InstallmentBankLogo bankId={bank.id} className="shrink-0" />
              <div className="min-w-0">
                <p className="text-base font-semibold text-slate-950">{locale === "ka" ? bank.nameKa : bank.nameEn}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {locale === "ka"
                    ? "გადადით განვადების განაცხადის გაგრძელებაზე"
                    : "Continue to the installment request flow"}
                </p>
              </div>
              <div className={`ml-auto hidden rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] sm:block ${bank.badgeClass}`}>
                {bank.shortName}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            {locale === "ka" ? "გაუქმება" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
