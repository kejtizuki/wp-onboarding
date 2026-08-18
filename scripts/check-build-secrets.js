/* eslint-disable no-console */
/**
 * Runs before `npm run build`.
 *
 * Create React App inlines every REACT_APP_* variable into the JavaScript it
 * emits. That is harmless on localhost and dangerous in a deployed build — the
 * key ends up readable by anyone who views source on the hosted site.
 *
 * This refuses to produce such a build. Use ALLOW_INLINE_SECRETS=1 only for a
 * local production build you are certain you will not deploy.
 */
const KEY = 'REACT_APP_ANTHROPIC_API_KEY';

if (process.env[KEY] && process.env.ALLOW_INLINE_SECRETS !== '1') {
  console.error(`
┌───────────────────────────────────────────────────────────────────┐
│  BUILD STOPPED — ${KEY} is set.        │
└───────────────────────────────────────────────────────────────────┘

Create React App will inline that key into build/static/js/*.js, where
anyone visiting the deployed site can read it. A leaked Anthropic key can
be used by others and billed to you.

To build for deployment:
  Remove the key from .env.local (or comment it out), then build again.
  Classification will fail open to the "draft" path — the demo still works.

To keep classification on a hosted build:
  Put the key behind a proxy and point ENDPOINT in
  src/onboarding/paths/classifyIntent.js at the proxy instead.

To build locally anyway (NOT for deployment):
  ALLOW_INLINE_SECRETS=1 npm run build
`);
  process.exit(1);
}
