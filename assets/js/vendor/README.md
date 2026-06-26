# assets/js/vendor — third-party code, self-hosted

This directory holds vendored third-party JavaScript that is served from our own
origin instead of a CDN. Self-hosting is the project's standing convention for
third-party assets (see the self-hosted WOFF2 fonts in `partials/_boilerplate.html`):
it removes a third-party origin from the attack surface, keeps the
Content-Security-Policy at `script-src 'self'` with no allowlisted CDN, and drops a
runtime dependency on CDN uptime. Same-origin delivery also makes Subresource
Integrity (SRI) unnecessary — the file is part of our own deploy.

## xlsx-populate.min.js

| | |
|---|---|
| **Library** | [xlsx-populate](https://github.com/dtjohnson/xlsx-populate) |
| **Version** | `1.21.0` (pinned) |
| **File** | `browser/xlsx-populate.min.js` from the npm package |
| **License** | MIT |
| **Used by** | `assets/js/seguimiento.js` (Excel export on `pages/recursos/seguimiento.html`), via the `window.XlsxPopulate` UMD global |
| **Source of truth** | npm registry (`registry.npmjs.org`) — the same artifact cdnjs mirrors |
| **size** | 642 319 bytes |
| **SHA-384 (SRI)** | `sha384-YnsK3VaaV54M5EcU58Pt9SdJqzL0iZpQzQAcav+18Kgn5tbwk16y/3g6FpT2d83h` |
| **SHA-256 (hex)** | `33aa41e75cffc90385888e3541526efd1bc30846f84b85f875e9ced122c14b86` |

This replaces the former `https://cdnjs.cloudflare.com/ajax/libs/xlsx-populate/1.21.0/xlsx-populate.min.js`
`<script>`, which loaded without SRI (a supply-chain exposure: OWASP A06 — Vulnerable
and Outdated Components / A08 — Software and Data Integrity Failures).

### How to update / re-verify the bytes

```sh
# Pull the authentic, version-pinned artifact from the npm registry:
npm pack xlsx-populate@1.21.0
tar xzf xlsx-populate-1.21.0.tgz
cp package/browser/xlsx-populate.min.js assets/js/vendor/xlsx-populate.min.js

# Confirm the bytes match the recorded hashes:
openssl dgst -sha256 assets/js/vendor/xlsx-populate.min.js
printf 'sha384-'; openssl dgst -sha384 -binary assets/js/vendor/xlsx-populate.min.js | openssl base64 -A; echo
```

If the version is bumped, update the version, hashes and size in this table in the
same commit.
