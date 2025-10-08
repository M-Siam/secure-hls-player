export default async function handler(req, res) {
  const referer = req.headers.referer || '';
  const origin = req.headers.origin || '';
  const host = req.headers.host;

  // ✅ Allow if:
  // - Request comes from our own Vercel site, OR
  // - It's a direct navigation (no referer) but from our domain
  const allowed =
    referer.includes(host) ||
    origin.includes(host) ||
    referer === '' && ( // direct visit
      req.headers['sec-fetch-site'] === 'none' ||
      req.headers['sec-fetch-mode'] === 'navigate'
    );

  if (!allowed) {
    console.log('Blocked request:', { referer, origin, host });
    return res.status(403).json({ error: 'Access denied' });
  }

  const ORIGINAL_M3U8 = 'https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8';

  try {
    const response = await fetch(ORIGINAL_M3U8);
    if (!response.ok) {
      console.error('Original stream returned:', response.status);
      return res.status(502).json({ error: 'Upstream stream error' });
    }

    res.status(200).json({ url: ORIGINAL_M3U8 });
  } catch (err) {
    console.error('Fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}
