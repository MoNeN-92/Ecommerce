export async function createManualCheckout({
  orderId,
  confirmationToken,
  baseUrl,
  locale
}: {
  orderId: string;
  confirmationToken: string;
  baseUrl: string;
  locale: "ka" | "en";
}) {
  return {
    url: `${baseUrl}/${locale}/order-confirmation/${orderId}?token=${confirmationToken}`,
    externalId: null
  };
}
