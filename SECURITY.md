# Security Policy

## Supported Versions

| Version | Supported   |
| ------- | ----------- |
| 1.2.x   | Supported   |
| < 1.2   | Unsupported |

---

## Reporting a Vulnerability

If you discover a security vulnerability or potential credential issue within this project, please do not open a public issue.

Submit vulnerability reports privately:
1. Contact the maintainer via GitHub Security Advisory or direct message on GitHub ([@myzert](https://github.com/myzert)).
2. Provide a detailed summary of the vulnerability, reproduction steps, and potential impact.
3. You will receive an acknowledgment within 48 hours, followed by a remediation timeline.

---

## Token Safety and Best Practices

1. **Sandboxed Local Storage:**
   Your Discord authentication token is saved exclusively within Acode's private local application storage (`localStorage`). It is never transmitted to external third-party servers, intermediate telemetry endpoints, or remote logging services.

2. **Repository Cleanliness and Credential Protection:**
   Never hardcode or push personal authentication credentials or environment files (such as `.env`) to Git repositories. Keep build archives and binaries out of version control by adhering to the repository `.gitignore` specifications.

3. **Discord Platform Notice:**
   Connecting to Discord Gateway via user tokens operates outside Discord's official OAuth2 Bot Application API. Although Rich Presence clients of this type are widely utilized across custom mobile environments, users should remain informed about Discord Terms of Service considerations and exercise appropriate discretion.
