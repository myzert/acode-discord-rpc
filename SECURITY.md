# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| < 1.2   | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability or potential token leak within this project, please do **NOT** open a public issue.

Instead, please report it privately:
1. Contact the maintainer via GitHub Security Advisory or direct message on GitHub ([@myzert](https://github.com/myzert)).
2. Provide a clear description of the issue, steps to reproduce, and potential impact.
3. You will receive an acknowledgment within 48 hours, followed by a remediation timeline.

---

## Token Safety & Best Practices

1. **Local Storage Only:**
   Your Discord account token is exclusively stored within Acode's local and private device storage (`localStorage`). It is **never** transmitted to any third-party server, proxy, or repository.

2. **Never Commit Credentials:**
   Never hardcode or push configuration files containing authentication credentials (e.g., `.env`) to public repositories.

3. **Discord Terms of Service Notice:**
   Using user tokens for self-bot automated presence connections exists outside Discord's official OAuth2 Bot API. While Rich Presence spoofing is widely used by tools like Kizzy and PreMiD, we recommend exercising discretion or testing on a secondary account if you have concerns regarding account standing.
