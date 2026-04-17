export type InstallmentBankId = "TBC Bank" | "Bank of Georgia" | "Credo";

export type InstallmentBankInfo = {
  id: InstallmentBankId;
  nameKa: string;
  nameEn: string;
  shortName: string;
  accentClass: string;
  panelClass: string;
  badgeClass: string;
};

export const INSTALLMENT_BANKS: InstallmentBankInfo[] = [
  {
    id: "TBC Bank",
    nameKa: "თიბისი ბანკი",
    nameEn: "TBC Bank",
    shortName: "TBC",
    accentClass: "border-[#00a3e0]/25 bg-[#ecf9ff] hover:border-[#00a3e0]/50 hover:bg-[#e0f5ff]",
    panelClass: "border-[#00a3e0]/22 bg-[#ecf9ff]",
    badgeClass: "bg-[#00a3e0] text-white"
  },
  {
    id: "Bank of Georgia",
    nameKa: "საქართველოს ბანკი",
    nameEn: "Bank of Georgia",
    shortName: "BOG",
    accentClass: "border-[#ff6a00]/25 bg-[#fff5eb] hover:border-[#ff6a00]/50 hover:bg-[#ffefe0]",
    panelClass: "border-[#ff6a00]/22 bg-[#fff5eb]",
    badgeClass: "bg-[#ff6a00] text-white"
  },
  {
    id: "Credo",
    nameKa: "კრედო ბანკი",
    nameEn: "Credo Bank",
    shortName: "Credo",
    accentClass: "border-[#f2b705]/25 bg-[#fffbea] hover:border-[#f2b705]/50 hover:bg-[#fff5d1]",
    panelClass: "border-[#f2b705]/22 bg-[#fffbea]",
    badgeClass: "bg-[#f2b705] text-slate-950"
  }
];

export function getInstallmentBankInfo(bankId: string) {
  return INSTALLMENT_BANKS.find((bank) => bank.id === bankId) ?? INSTALLMENT_BANKS[0];
}
