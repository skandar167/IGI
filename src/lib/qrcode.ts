import QRCode from 'qrcode';

export async function generateQrDataUrl(text: string, options?: { width?: number; margin?: number; darkColor?: string; lightColor?: string }): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: options?.width || 300,
      margin: options?.margin ?? 2,
      color: {
        dark: options?.darkColor || '#0f172a',
        light: options?.lightColor || '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Error generating QR data URL:', err);
    return '';
  }
}

export async function generateQrSvg(text: string, options?: { width?: number; margin?: number }): Promise<string> {
  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      width: options?.width || 300,
      margin: options?.margin ?? 2,
      errorCorrectionLevel: 'M',
    });
    return svg;
  } catch (err) {
    console.error('Error generating QR SVG:', err);
    return '';
  }
}

export function getAssetScanUrl(assetId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  return `${baseUrl}/assets/${assetId}`;
}
