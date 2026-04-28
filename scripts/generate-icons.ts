import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error("Missing GEMINI_API_KEY in .env.local");

const ai = new GoogleGenAI({ apiKey: API_KEY });

const ICONS = [
  {
    name: "candle",
    prompt:
      "Ultra-high quality illustration: a single majestic white candle with a luminous golden flame that flickers with life, rich molten wax drips, warm amber and gold light radiates outward creating a dramatic halo effect, deep midnight navy blue background with subtle texture, masterful oil painting technique meets modern digital art, dramatic chiaroscuro lighting, photorealistic flame detail, no text, perfect square composition, 8K quality, award-winning art",
  },
  {
    name: "puzzle",
    prompt:
      "Ultra-high quality artwork: an infinite grid of precisely arranged luminous golden dots on a deep obsidian black background, viewed from above like a vast city of lights at night, some clusters of dots glow intensely bright creating patterns like constellations, depth and perspective creating a sense of endless scale, each dot has a soft bloom light effect, cinematic atmosphere, epic scale, no text, perfect square, 8K quality, breathtaking digital art",
  },
  {
    name: "challenge",
    prompt:
      "Ultra-high quality illustration: an ornate ceremonial badge or seal with intricate Star of David integrated into geometric mandala patterns, pure golden metallic finish with mirror-like reflections, rays of divine light bursting outward from center in all directions, deep dark navy background, jewelry-level detail with filigree work, sacred geometry, majestic and spiritual, no text, perfect square composition, 8K quality, ultra detailed",
  },
  {
    name: "community",
    prompt:
      "Ultra-high quality illustration: seven human silhouettes standing in a sacred circle, each holding a glowing candle, the individual flames merge into a unified golden aura that fills the space between them, warm amber light creates long dramatic shadows, deep dark background, painterly and spiritual atmosphere, watercolor washes meet digital precision, sense of unity and togetherness, no text, perfect square composition, 8K quality, emotionally powerful",
  },
  {
    name: "camera",
    prompt:
      "Ultra-high quality illustration: a vintage brass and leather film camera viewed from front, the circular lens glows with intense warm golden light as if capturing something sacred, intricate mechanical details engraved on the body, dark walnut and midnight blue background, fine etching and engraving illustration style, dramatic single light source, craftsmanship and artistry, no text, perfect square composition, 8K quality, museum quality illustration",
  },
  {
    name: "heart",
    prompt:
      "Ultra-high quality artwork: a perfect heart shape formed entirely from hundreds of tiny individually glowing golden candle flames, each flame unique and flickering, the collective light creates a warm radiating aura around the heart shape, deep midnight blue to black background, the heart appears to float and pulse with warmth, painterly digital art with incredible detail in each tiny flame, ethereal and deeply moving, no text, perfect square composition, 8K quality",
  },
];

const OUT_DIR = path.join(process.cwd(), "public", "icons");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function generateIcon(name: string, prompt: string): Promise<void> {
  console.log(`⏳ Generating: ${name}...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: { inlineData?: { mimeType?: string; data?: string } }) => p.inlineData?.mimeType?.startsWith("image/"));
    if (!imagePart?.inlineData?.data) throw new Error("No image in response");

    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    const outPath = path.join(OUT_DIR, `${name}.png`);
    fs.writeFileSync(outPath, buffer);
    console.log(`✅ ${name}.png saved (${Math.round(buffer.length / 1024)}KB)`);
  } catch (err) {
    console.error(`❌ Failed to generate ${name}:`, (err as Error).message);
  }
}

async function main() {
  console.log("🕯️  Generating icons for אור לעם ישראל...\n");
  for (const icon of ICONS) {
    await generateIcon(icon.name, icon.prompt);
    // Pause between requests to avoid rate limiting
    await new Promise((r) => setTimeout(r, 1200));
  }
  console.log("\n🎉 Done! Icons saved to public/icons/");
}

main().catch(console.error);
