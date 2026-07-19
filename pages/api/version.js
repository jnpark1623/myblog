// Reports the exact commit that the currently-live deployment was built from,
// so a deploy can be verified end-to-end (push -> live) instead of guessing
// whether a change failed to deploy or just isn't reflected yet.
//
// Vercel injects VERCEL_GIT_COMMIT_SHA at build time. Locally it is unset, so
// this returns "local". No-store so edge/browser caches never mask the value.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(200).json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    ref: process.env.VERCEL_GIT_COMMIT_REF || null,
    env: process.env.VERCEL_ENV || 'development',
  })
}
