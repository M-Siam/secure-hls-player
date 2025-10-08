// Vercel Serverless Function (runs on every request)
export default async function handler(req, res) {
  // 🔒 Only allow requests from your own Vercel site
  const referer = req.headers.referer || '';
  const host = req.headers.host;
  
  // Allow only if coming from your deployed Vercel site
  if (!referer.includes(host)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const ORIGINAL_M3U8 = 'https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8';

  try {
    const response = await fetch(ORIGINAL_M3U8);
    if (!response.ok) throw new Error('Stream down');

    let m3u8 = await response.text();

    // Optional: add fake token to .ts URLs (makes scraping slightly harder)
    m3u8 = m3u8.replace(/\.ts/g, '.ts?token=protected');

    // Return as JSON so frontend can use it securely
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      url: ORIGINAL_M3U8 + '?ref=protected' // simple obfuscation
    });
  } catch (err) {
    console.error('Stream error:', err);
    res.status(500).json({ error: 'Stream unavailable' });
  }
}
