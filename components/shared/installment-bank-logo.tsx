import { cn } from "@/lib/utils";
import { getInstallmentBankInfo, type InstallmentBankId } from "@/lib/installment-banks";

function TbcLogo() {
  return (
    <svg viewBox="0 0 160 40" className="h-10 w-auto" aria-hidden="true">
      <rect width="160" height="40" rx="12" fill="#00A3E0" />
      <text x="18" y="26" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="1.6">
        TBC BANK
      </text>
    </svg>
  );
}

function BogLogo() {
  return (
    <svg viewBox="0 0 180 40" className="h-10 w-auto" aria-hidden="true">
      <rect width="180" height="40" rx="12" fill="#FF6A00" />
      <circle cx="24" cy="20" r="11" fill="#fff" opacity="0.95" />
      <text x="45" y="25" fill="#fff" fontSize="16" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.4">
        BANK OF GEORGIA
      </text>
    </svg>
  );
}

function CredoLogo() {
  return (
    <svg viewBox="0 0 150 40" className="h-10 w-auto" aria-hidden="true">
      <rect width="150" height="40" rx="12" fill="#F2B705" />
      <text x="18" y="25" fill="#122033" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.8">
        CREDO BANK
      </text>
    </svg>
  );
}

export function InstallmentBankLogo({
  bankId,
  className
}: {
  bankId: InstallmentBankId;
  className?: string;
}) {
  const bank = getInstallmentBankInfo(bankId);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[1rem] border border-white/60 bg-white/80 p-1 shadow-[0_10px_24px_rgba(15,23,42,0.06)]",
        className
      )}
      aria-label={bank.nameEn}
      title={bank.nameEn}
    >
      {bank.id === "TBC Bank" ? <TbcLogo /> : null}
      {bank.id === "Bank of Georgia" ? <BogLogo /> : null}
      {bank.id === "Credo" ? <CredoLogo /> : null}
    </div>
  );
}
