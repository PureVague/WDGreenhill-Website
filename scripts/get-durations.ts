import { parseFile } from "music-metadata";
import { readdirSync } from "fs";
import { join } from "path";

async function main() {
  const audioDir = join(process.cwd(), "public", "audio");
  const files = readdirSync(audioDir)
    .filter(f => f.endsWith(".mp3"))
    .sort();

  for (const file of files) {
    const fullPath = join(audioDir, file);
    const meta = await parseFile(fullPath, { duration: true });
    const dur = Math.round(meta.format.duration ?? 0);
    console.log(`${file}: ${dur}s`);
  }
}

main();
