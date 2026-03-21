const DEFAULT_UPSTASH_KEY = 'wine-watch:hidden-view'

function getUpstashConfig() {
  const baseUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_TOKEN
  const key = process.env.UPSTASH_WINE_WATCH_KEY || DEFAULT_UPSTASH_KEY

  if (!baseUrl || !token) {
    return null
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    token,
    key,
  }
}

async function readSnapshotFromUpstash(config) {
  const response = await fetch(`${config.baseUrl}/get/${encodeURIComponent(config.key)}`, {
    headers: {
      Authorization: `Bearer ${config.token}`,
    },
  })

  const json = await response.json().catch(() => null)

  if (!response.ok || json?.error) {
    throw new Error(json?.error || `Upstash read failed with status ${response.status}`)
  }

  if (!json || typeof json.result !== 'string' || json.result.length === 0) {
    return {
      ok: true,
      generatedAt: null,
      capturedAt: null,
      itemCount: 0,
      items: [],
    }
  }

  return JSON.parse(json.result)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const config = getUpstashConfig()
  if (!config) {
    return res
      .status(500)
      .json({ ok: false, error: 'Upstash credentials are not configured on the server' })
  }

  try {
    const payload = await readSnapshotFromUpstash(config)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    return res.status(200).json(payload)
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message })
  }
}
