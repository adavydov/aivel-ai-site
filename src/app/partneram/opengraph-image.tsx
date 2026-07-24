import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Партнёрство Aivel для владельцев бухгалтерских компаний";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#000000",
          color: "#ffffff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: "0.08em" }}>AIVEL</span>
          <span style={{ width: 96, height: 8, background: "#1f5cff" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ color: "#8eabff", fontSize: 22, fontWeight: 700 }}>
            ПАРТНЁРАМ
          </span>
          <span style={{ maxWidth: 1000, fontSize: 74, lineHeight: 0.96, fontWeight: 700, letterSpacing: "-0.045em" }}>
            Расти без найма. Стать финансовым партнёром для клиента.
          </span>
        </div>
      </div>
    ),
    size,
  );
}
