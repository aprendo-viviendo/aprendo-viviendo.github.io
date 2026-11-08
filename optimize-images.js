const path = require("node:path");
const sharp = require("sharp");

const [logoPath, portraitPath] = process.argv.slice(2);
if (!logoPath || !portraitPath || process.argv.length !== 4) {
  console.error("Usage: node optimize-images.js <logo.jpg> <portrait.jpg>");
  process.exit(1);
}

const assets = path.join(__dirname, "assets");

async function optimize() {
  await require("node:fs/promises").mkdir(assets, { recursive: true });

  const logo = (size) => sharp(logoPath).rotate().resize(size, size, { fit: "cover" });
  await logo(80).webp({ quality: 75 }).toFile(path.join(assets, "logo.webp"));
  await logo(80).jpeg({ quality: 75, mozjpeg: true }).toFile(path.join(assets, "logo.jpg"));
  await logo(400).webp({ quality: 80 }).toFile(path.join(assets, "logo-hero.webp"));
  await logo(400).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(assets, "logo-hero.jpg"));

  for (const [name, width] of [["small", 600], ["medium", 900], ["large", 1200]]) {
    await sharp(portraitPath).rotate().resize({ width }).webp({ quality: 78 })
      .toFile(path.join(assets, `carlos-en-cocina-${name}.webp`));
  }
  await sharp(portraitPath).rotate().resize({ width: 1200 }).jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(assets, "carlos-en-cocina.jpg"));
}

optimize().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
