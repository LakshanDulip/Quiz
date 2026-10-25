# QuizHub performance update — 2.0.1

## Changes

- Home no longer waits for the science and maths question banks (2,151,181 bytes of source JSON combined). Question data downloads when a subject is selected. This is a reduction in eager data loading, not a measured network transfer or timing improvement.
- Concurrent selections share one subject download. Failures show a Sinhala retry action. Slow previous navigations cannot overwrite the current page.
- Service worker installation caches the app shell without downloading all questions or depending on third-party font servers. Previously opened subjects remain available from the runtime cache offline; unopened subjects need an internet connection. Firebase authentication and multiplayer still require their external services.
- Offline reads prefer newer runtime content over the installation snapshot. Cache maintenance preserves unrelated apps' caches, keeps background writes alive, and tolerates cache quota failures on successful network reads.
- Revalidate mutable HTML/data and update metadata; reuse static image assets. Vercel configuration changes require deployment to Vercel (or equivalent configuration on the actual host).
- Defer multiplayer fingerprint and QR scripts, preconnect font origins, enable mobile zoom, remove the duplicate home title, and use a passive touch listener.
- Version metadata and update checks use 2.0.1, with a new service worker cache namespace.

## Validation

`node --test tests/optimization.test.cjs` — nine regression tests for lazy loading, request deduplication, retry, navigation races, installation, offline freshness, cache ownership, quota failures and background writes.

All 8 executable inline scripts in both HTML pages plus sw.js were syntax checked. Run the tests from the repository root with Node.js 18 or newer.

Browser visual QA, Lighthouse measurements, Firebase sign-in, and multiplayer end-to-end checks have not been completed. Chromium download was unavailable in this environment. Before deploying, open both pages on desktop and mobile; check both subjects, a direct quiz link, answer submission, retry after network failure, previously visited subjects offline, authentication and a two-player session. Live deployment has not been performed.

## Apply

The ZIP contains the complete repository source with these changes. Copy its files into your checkout, review the diff, run the tests, then commit on a feature branch and deploy through your normal workflow. Preserve existing host environment settings. No credentials, Firebase rules or account configuration have been changed.
