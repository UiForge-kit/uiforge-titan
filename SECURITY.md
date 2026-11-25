# Security policy

## Supported versions

Only the latest release of Titan receives security fixes.

## Reporting a vulnerability

Do not open a public issue. Use the "Report a vulnerability" button in the Security tab of this repository (GitHub private vulnerability reporting). Include what you found, how to reproduce it and the version you tested.

We reply as soon as we can and will tell you when a fix is released. We are happy to credit you if you want.

## What counts

- A flaw in code that ships in this repository and that an application built from it would inherit.
- A vulnerable dependency we can fix by upgrading.

## What does not count

Titan is a front-end template with demo data. These are by design and documented in the README: simulated sign-in and permissions, data kept in `localStorage`, mock API responses, and a partial Content-Security-Policy. Wire real authentication, server-side authorization and validation before production.
