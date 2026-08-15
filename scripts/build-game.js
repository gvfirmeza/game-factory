import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function buildGame(gameId) {
  if (!gameId) {
    console.error('Error: Please specify a game ID. Example: npm run game:build -- tiny-road');
    process.exit(1);
  }

  const gameDir = path.join(rootDir, 'games', gameId);
  const sourceDir = path.join(gameDir, 'source');
  const buildDir = path.join(gameDir, 'build');
  const metadataPath = path.join(gameDir, 'metadata.json');

  console.log(`\n========================================`);
  console.log(`[BUILD] Starting production build for: ${gameId}`);
  console.log(`========================================\n`);

  if (!fs.existsSync(sourceDir)) {
    console.error(`[BUILD FAILED] Source directory not found: ${sourceDir}`);
    process.exit(1);
  }

  // 1. Validate Entry Point
  const indexHtmlPath = path.join(sourceDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error(`[BUILD FAILED] Entry point index.html missing: ${indexHtmlPath}`);
    process.exit(1);
  }
  console.log('✓ Verified entry point (index.html)');

  // 2. Prepare Build Directory
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // 3. Create ZIP Distribution
  const zip = new JSZip();

  function addFolderToZip(folderPath, zipFolder, baseDir) {
    const items = fs.readdirSync(folderPath);
    for (const item of items) {
      const itemPath = path.join(folderPath, item);
      const stat = fs.statSync(itemPath);
      if (stat.isDirectory()) {
        const nextZipFolder = zipFolder ? zipFolder.folder(item) : zip.folder(item);
        addFolderToZip(itemPath, nextZipFolder, baseDir);
      } else {
        let fileData = fs.readFileSync(itemPath);
        if (item.endsWith('.js') || item.endsWith('.html')) {
          let str = fileData.toString('utf8');
          if (str.includes('../../../engine/')) {
            str = str.replace(/\.\.\/\.\.\/\.\.\/engine\//g, './engine/');
            fileData = Buffer.from(str, 'utf8');
          }
          if (str.includes('../manifest.json')) {
            str = str.replace(/\.\.\/manifest\.json/g, './manifest.json');
            fileData = Buffer.from(str, 'utf8');
          }
        }
        if (zipFolder) {
          zipFolder.file(item, fileData);
        } else {
          zip.file(item, fileData);
        }
      }
    }
  }

  // Also include engine files inside bundle if source imports them relative
  const engineDir = path.join(rootDir, 'engine');
  if (fs.existsSync(engineDir)) {
    const engineZipFolder = zip.folder('engine');
    addFolderToZip(engineDir, engineZipFolder, engineDir);
  }

  // Include manifest.json at zip root if present
  const gameManifestPath = path.join(gameDir, 'manifest.json');
  if (fs.existsSync(gameManifestPath)) {
    zip.file('manifest.json', fs.readFileSync(gameManifestPath));
  }

  // Add all source files to zip
  addFolderToZip(sourceDir, null, sourceDir);

  const zipPath = path.join(buildDir, `${gameId}.zip`);
  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  fs.writeFileSync(zipPath, content);
  const zipStats = fs.statSync(zipPath);

  // 4. Validate ZIP Archive
  if (zipStats.size < 1000) {
    console.error(`[BUILD FAILED] Generated ZIP is suspiciously small (${zipStats.size} bytes)`);
    process.exit(1);
  }

  console.log(`✓ Built production ZIP: ${path.relative(rootDir, zipPath)} (${(zipStats.size / 1024).toFixed(1)} KB)`);

  // 5. Update metadata.json
  if (fs.existsSync(metadataPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      meta.status = 'ready';
      meta.build = {
        timestamp: new Date().toISOString(),
        zipFile: `build/${gameId}.zip`,
        sizeBytes: zipStats.size,
        success: true
      };
      if (meta.pipeline) {
        meta.pipeline.build = 'done';
      }
      fs.writeFileSync(metadataPath, JSON.stringify(meta, null, 2), 'utf8');
      console.log('✓ Updated metadata.json (status: ready)');
    } catch (e) {
      console.warn('Warning: Failed to update metadata.json:', e.message);
    }
  }

  console.log(`\n========================================`);
  console.log(`[BUILD SUCCESS] Game ${gameId} successfully packaged!`);
  console.log(`========================================\n`);
}

const gameArg = process.argv[2];
buildGame(gameArg);
