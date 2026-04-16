export async function createManualCheckout({
  orderId,
  baseUrl,
  locale
}: {
  orderId: string;
  baseUrl: string;
  locale: "ka" | "en";
}) {
  return {
    url: `${baseUrl}/${locale}/order-confirmation/${orderId}`,
    externalId: null
  };
}
