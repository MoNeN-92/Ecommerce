import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const runtime = "edge";

const OG_SIZE = {
  width: 1200,
  height: 630
};

function clamp(value: string, max: number) {
  if (value.length <= max) {
    return value;
  }

  return `${value.slice(0, max - 1)}…`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") === "en" ? "en" : "ka";
  const title = clamp(searchParams.get("title") || SITE_NAME, 90);
  const description = clamp(
    searchParams.get("description") ||
      (locale === "ka"
        ? "ტექნიკა, აქსესუარები და ონლაინ შეძენა საქართველოს ბაზრისთვის."
        : "Electronics, accessories, and online shopping for the Georgian market."),
    150
  );
  const eyebrow =
    searchParams.get("eyebrow") ||
    (locale === "ka" ? "TechStore Georgia" : "TechStore Georgia");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(185,139,82,0.28), transparent 34%), linear-gradient(135deg, #f7f1e8 0%, #ffffff 48%, #eef3fb 100%)",
          color: "#0f172a",
          fontFamily: "serif",
          padding: "28px"
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 32,
            border: "1px solid rgba(15,23,42,0.08)",
            background: "rgba(255,255,255,0.82)",
            boxShadow: "0 24px 80px rgba(15,23,42,0.08)",
            padding: "64px 72px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                alignSelf: "flex-start",
                padding: "12px 18px",
                borderRadius: 999,
                background: "rgba(185,139,82,0.12)",
                color: "#9a6f3a",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase"
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 18,
                maxWidth: 920
              }}
            >
              <div
                style={{
                  fontSize: 68,
                  lineHeight: 1.02,
                  fontWeight: 700,
                  letterSpacing: "-0.04em"
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 30,
                  lineHeight: 1.45,
                  color: "#475569",
                  maxWidth: 820
                }}
              >
                {description}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 24,
              color: "#475569"
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#9a6f3a"
                }}
              />
              {locale === "ka" ? "ონლაინ მაღაზია საქართველოში" : "Online store in Georgia"}
            </div>
            <div style={{ fontWeight: 700, color: "#0f172a" }}>{SITE_NAME}</div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
