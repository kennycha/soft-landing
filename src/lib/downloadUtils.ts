import { zipSync, strToU8 } from 'fflate';
import type { LandingPageConfig } from './toml';
import { useAssetStore } from './assetStore';
import { extractImagePaths } from './imageResolver';

type FileMap = Record<string, Uint8Array>;

type ViteManifest = Record<
  string,
  {
    file: string;
    src?: string;
    isEntry?: boolean;
    css?: string[];
    assets?: string[];
    imports?: string[];
  }
>;

/** Load and parse manifest.json to find viewer entry files */
export async function loadViewerManifest(
  manifestUrl = './.vite/manifest.json'
): Promise<ViteManifest> {
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(`Failed to load manifest: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to load manifest.json, using development mode fallback', error);
    throw new Error('Manifest not found. Please build the project first with "pnpm build"');
  }
}

/** Collect all viewer-related files from the manifest */
export async function collectViewerFiles(
  manifest: ViteManifest
): Promise<{ files: FileMap; jsPath: string; cssPaths: string[] }> {
  // Find the viewer entry in the manifest
  const viewerEntry = Object.values(manifest).find(
    (entry) => entry.isEntry && entry.src?.includes('src/viewer/index.html')
  );

  console.log('Manifest entries:', Object.keys(manifest));
  console.log('Found viewer entry:', viewerEntry);

  if (!viewerEntry) {
    throw new Error(
      'Viewer entry not found in manifest. Make sure the build includes the viewer entry.'
    );
  }

  const urls = new Set<string>();

  // Recursively collect all files related to the viewer entry
  const visitEntry = (entry: typeof viewerEntry) => {
    if (!entry) return;

    // Add main file (with base path)
    if (entry.file) urls.add('/soft-landing/' + entry.file);

    // Add CSS files (with base path)
    entry.css?.forEach((css) => urls.add('/soft-landing/' + css));

    // Add asset files (with base path)
    entry.assets?.forEach((asset) => urls.add('/soft-landing/' + asset));

    // Recursively visit imported modules
    entry.imports?.forEach((importId) => {
      const importedEntry = manifest[importId];
      if (importedEntry) {
        visitEntry(importedEntry);
      }
    });
  };

  visitEntry(viewerEntry);

  // Fetch all files
  const files: FileMap = {};
  const fetchPromises = Array.from(urls).map(async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      // Remove base path and leading slash for zip paths
      const relativePath = url.replace(/^\/soft-landing\//, '');
      files[relativePath] = new Uint8Array(arrayBuffer);
    } catch (error) {
      console.warn(`Failed to fetch ${url}:`, error);
    }
  });

  await Promise.all(fetchPromises);

  // Extract JS and CSS paths for HTML generation
  const allPaths = Array.from(urls).map((u) => u.replace(/^\/soft-landing\//, ''));

  const jsPath =
    allPaths.find((p) => p.startsWith('js/') && p.includes('viewer')) ||
    allPaths.find((p) => p.startsWith('js/')) ||
    '';

  const cssPaths = allPaths.filter((p) => p.startsWith('css/'));

  console.log('Collected files:', allPaths);
  console.log('JS path:', jsPath);
  console.log('CSS paths:', cssPaths);

  return { files, jsPath, cssPaths };
}

/** Generate index.html with injected config */
export function generateIndexHtml(
  config: LandingPageConfig,
  jsPath: string,
  cssPaths: string[]
): string {
  const cssLinks = cssPaths
    .map((path) => `<link rel="stylesheet" href="./${path}">`)
    .join('\n    ');

  const configJson = JSON.stringify(config, null, 2);

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${config.metadata?.title || 'Landing Page'}</title>
    <meta name="description" content="${config.metadata?.description || 'A beautiful landing page'}" />
    <link rel="icon" type="image/x-icon" href="${config.metadata?.favicon || ''}">
    ${cssLinks}
  </head>
  <body>
    <div id="root"></div>
    <script>window.__CONFIG__ = ${configJson};</script>
    <script type="module" src="./${jsPath}"></script>
  </body>
</html>`;
}

/** Create and download the zip file */
export function downloadZip(files: FileMap, filename: string): void {
  try {
    const zipped = zipSync(files, { level: 6 });
    const blob = new Blob([zipped], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to create zip:', error);
    throw new Error('Failed to create zip file');
  }
}

/** Update asset paths in config to use relative paths */
function updateAssetPaths(config: LandingPageConfig): LandingPageConfig {
  const updated = JSON.parse(JSON.stringify(config)) as LandingPageConfig;

  // Update hero image
  if (updated.hero?.imageUrl) {
    updated.hero.imageUrl = updated.hero.imageUrl.replace(/^assets\//, './assets/');
  }

  // Update feature images
  if (updated.features?.items) {
    updated.features.items.forEach((item) => {
      if (item.imageUrl) {
        item.imageUrl = item.imageUrl.replace(/^assets\//, './assets/');
      }
    });
  }

  // Update social proof logos
  if (updated.socialProof?.logoUrls) {
    updated.socialProof.logoUrls = updated.socialProof.logoUrls.map((url) =>
      url.replace(/^assets\//, './assets/')
    );
  }

  // Update footer logo
  if (updated.footer?.logoUrl) {
    updated.footer.logoUrl = updated.footer.logoUrl.replace(/^assets\//, './assets/');
  }

  // Update testimonial avatars
  if (updated.testimonials?.items) {
    updated.testimonials.items.forEach((item) => {
      if (item.avatarUrl) {
        item.avatarUrl = item.avatarUrl.replace(/^assets\//, './assets/');
      }
    });
  }

  return updated;
}

/** Include user assets (images) in the zip */
async function includeUserAssets(config: LandingPageConfig): Promise<FileMap> {
  const assets: FileMap = {};
  const assetStore = useAssetStore.getState();
  const imagePaths = extractImagePaths(config);

  // Find assets that are actually used in the config
  const usedAssets = assetStore.assets.filter((asset) => imagePaths.includes(asset.path));

  // Add each used asset to the zip
  for (const asset of usedAssets) {
    try {
      const response = await fetch(asset.dataUrl);
      const arrayBuffer = await response.arrayBuffer();

      // Store in assets/ folder within zip
      const filename = asset.path.replace('assets/', '');
      assets[`assets/${filename}`] = new Uint8Array(arrayBuffer);
    } catch (error) {
      console.warn(`Failed to include asset ${asset.path}:`, error);
    }
  }

  return assets;
}

/** Main function to download the landing page */
export async function downloadLandingPage(config: LandingPageConfig): Promise<void> {
  try {
    // Load manifest and collect viewer files
    const manifest = await loadViewerManifest();
    const { files: viewerFiles, jsPath, cssPaths } = await collectViewerFiles(manifest);

    if (!jsPath) {
      throw new Error('No JavaScript entry point found for viewer');
    }

    // Include user-uploaded assets
    const userAssets = await includeUserAssets(config);

    // Debug: log which assets were included
    console.log('User assets included:', Object.keys(userAssets));
    console.log('Extracted image paths:', extractImagePaths(config));

    // Update config to use relative paths for assets
    const updatedConfig = updateAssetPaths(config);

    // Generate index.html with updated config
    const indexHtml = generateIndexHtml(updatedConfig, jsPath, cssPaths);

    // Combine all files
    const allFiles: FileMap = {
      ...viewerFiles,
      ...userAssets,
      'index.html': strToU8(indexHtml),
    };

    // Generate README
    const readme = generateReadme(config, Object.keys(userAssets));
    allFiles['README.md'] = strToU8(readme);

    // Create filename from config
    const filename = `${config.metadata?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'landing_page'}.zip`;

    // Download the zip
    downloadZip(allFiles, filename);
  } catch (error) {
    console.error('Failed to download landing page:', error);

    // Show user-friendly error message
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    alert(`Failed to download: ${message}`);
    throw error;
  }
}

/** Generate README file content */
function generateReadme(config: LandingPageConfig, assetPaths: string[]): string {
  const hasAssets = assetPaths.length > 0;
  const assetsList = hasAssets
    ? `\n## Assets included:\n${assetPaths.map((path) => `- ${path}`).join('\n')}\n`
    : '';

  return `# ${config.metadata?.title || 'Landing Page'}

This is your generated landing page from Soft Landing.

## Files included:
- index.html - Your complete landing page
- js/ - JavaScript files
- css/ - Stylesheet files${hasAssets ? '\n- assets/ - Image assets used in your landing page' : ''}
${assetsList}
## How to use:
1. Upload all files to any web hosting service (maintaining the folder structure)
2. Or open index.html directly in a web browser
3. The page is self-contained with all styles and scripts included

## Hosting suggestions:
- Netlify: Drag and drop the ZIP file or individual files
- Vercel: Upload via their dashboard  
- GitHub Pages: Commit to a repository
- Any web hosting service that supports HTML files

${hasAssets ? '**Note**: Make sure to upload the assets folder along with other files to preserve image references.\n' : ''}
Generated with Soft Landing - https://soft-landing.dev
`;
}
