import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt = "PT. Arkana Tunas Persada, mitra solusi IT dan pengadaan barang"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  const [icon, bold, regular] = await Promise.all([
    readFile(join(process.cwd(), "app/icon.svg"), "base64"),
    readFile(join(process.cwd(), "assets/fonts/Geist-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #2D4451 0%, #3D5A6C 100%)",
          color: "white",
          fontFamily: "Geist",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "rgba(93,184,186,0.14)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/svg+xml;base64,${icon}`}
            width={84}
            height={84}
            alt=""
            style={{ borderRadius: 20, border: "2px solid rgba(255,255,255,0.18)" }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 32, fontWeight: 700 }}>PT. Arkana Tunas Persada</span>
            <span style={{ fontSize: 22, color: "#B4E0E3" }}>arkanacorp.id</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>Mitra Solusi IT &amp;</span>
          <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "#5DB8BA" }}>
            Pengadaan Barang
          </span>
          <span style={{ marginTop: 18, fontSize: 34, color: "rgba(255,255,255,0.88)" }}>
            untuk Pemerintah dan Perusahaan di Seluruh Indonesia
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 24, color: "rgba(255,255,255,0.7)" }}>
          <div style={{ width: 48, height: 4, borderRadius: 4, background: "#5DB8BA" }} />
          Pengadaan IT, infrastruktur, dan pengembangan software. Berbasis di Bandung.
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: bold, weight: 700, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
      ],
    }
  )
}
