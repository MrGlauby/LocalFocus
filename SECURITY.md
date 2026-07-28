# Security Documentation – localFocus

Dieses Dokument beschreibt alle Sicherheitsmaßnahmen im Projekt localFocus.

---

## Inhaltsverzeichnis

1. [Architektur-Überblick](#1-architektur-überblick)
2. [Environment-Variablen & Secrets](#2-environment-variablen--secrets)
3. [Content Security Policy (CSP)](#3-content-security-policy-csp)
4. [Service Worker Sicherheit](#4-service-worker-sicherheit)
5. [Tauri Desktop App](#5-tauri-desktop-app)
6. [API Routes](#6-api-routes)
7. [Dependencies & Audit](#7-dependencies--audit)
8. [Open Source Sicherheit](#8-open-source-sicherheit)
9. [Checklist vor Release](#9-checklist-vor-release)

---

## 1. Architektur-Überblick

```
┌─────────────────────────────────────────────────┐
│  Frontend (Next.js Static Export)               │
│  - Kein Server-seitiger Code im Build           │
│  - Nur Client-seitige Komponenten               │
├─────────────────────────────────────────────────┤
│  Service Worker (sw.js)                         │
│  - Push Notifications                           │
│  - Offline-Support                              │
├─────────────────────────────────────────────────┤
│  API Route (app/api/push/route.ts)              │
│  - Server-seitig, nur mit VAPID-Keys            │
│  - Kein Zugriff auf Secrets im Frontend         │
├─────────────────────────────────────────────────┤
│  Tauri Desktop (Rust Backend)                   │
│  - CSP-geschützt                                │
│  - Minimale Permissions                         │
└─────────────────────────────────────────────────┘
```

**Sicherheitsvorteil:** Static Export (`output: "export"`) bedeutet:
- Kein Node.js Server nötig
- Keine Server-seitigen Secrets im Runtime
- Kleinere Angriffsfläche

---

## 2. Environment-Variablen & Secrets

### Regeln

| Variable | Speicherort | Zugänglichkeit |
|----------|-------------|----------------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | `.env` | Client + Server |
| `VAPID_PRIVATE_KEY` | `.env` | **Nur Server** |

### Wichtige Prinzipien

1. **`.env` niemals committen** – Bereits in `.gitignore` enthalten
2. **`.env.example` verwenden** – Für Contributer ohne echte Werte
3. **Keine Secrets im Frontend-Code** – Alles mit `NEXT_PUBLIC_` Prefix ist im Bundle sichtbar
4. **Git-History bereinigen** – Falls `.env` versehentlich committed wurde:

```bash
# Prüfen ob .env jemals committed wurde
git log --all --full-history -- .env

# Falls ja: Bereinigen
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch .env' \
  --prune-empty --tag-name-filter cat -- --all
```

### Für Contributer

```bash
# Kopiere die Beispiel-Datei
cp .env.example .env

# Füge deine Keys ein (nur für lokale Entwicklung)
```

---

## 3. Content Security Policy (CSP)

### Aktuelle Konfiguration (`tauri.conf.json`)

```json
{
  "security": {
    "csp": {
      "default-src": "'self'",
      "style-src": "'self'",
      "script-src": "'self'"
    }
  }
}
```

### Was das bedeutet

| Directive | Wert | Effekt |
|-----------|------|--------|
| `default-src` | `'self'` | Nur Ressourcen von eigener Domain |
| `style-src` | `'self'` | Nur CSS-Dateien von eigener Domain |
| `script-src` | `'self'` | Nur JS-Dateien von eigener Domain |

### Verboten (durch CSP)

- Inline-Scripts (`<script>alert(1)</script>`)
- Externe Scripts (CDNs, Tracker)
- Inline Styles mit `'unsafe-inline'` (bewusst entfernt)
- Fremde Images, Fonts, Connections

---

## 4. Service Worker Sicherheit

### Datei: `public/sw.js`

#### Validierung

```javascript
// JSON-Parsing mit Try/Catch
try {
  data = event.data.json();
} catch {
  return; // Fehlerhafte Daten werden ignoriert
}

// Pflichtfelder prüfen
if (typeof data.title !== "string" || typeof data.body !== "string") return;
```

#### Was nicht erlaubt ist

- Kein `console.log` in Production
- Keine unbekannten Properties in Notification-Options
- Keine externen URLs in Notification-Daten

#### Notification-Struktur

```javascript
{
  title: "string",  // Erforderlich
  body: "string",   // Erforderlich
  icon: "string"    // Optional, Default: "/icon.png"
}
```

---

## 5. Tauri Desktop App

### Permissions (Berechtigungen)

```json
{
  "permissions": ["core:default"]
}
```

**Prinzip der minimalen Berechtigung:** Nur das Nötigste ist erlaubt.

### Fenster-Sicherheit

```json
{
  "windows": [{
    "title": "localFocus",
    "resizable": true,
    "fullscreen": false
  }]
}
```

### Rust Backend

- Keine externen HTTP-Calls
- Keine Dateisystem-Zugriffe (außer Tauri-interne)
- Nur `tauri-plugin-log` für Debug-Logging

---

## 6. API Routes

### Push Notification Endpoint

**Datei:** `app/api/push/route.ts`

```
POST /api/push
```

#### Request Body

```json
{
  "subscription": { "endpoint": "...", "keys": { "p256dh": "...", "auth": "..." } },
  "payload": { "title": "Timer finished", "body": "25 minutes are up" }
}
```

#### Sicherheitsmaßnahmen

1. **Input-Validierung** – Prüfe ob `subscription` und `payload` existieren
2. **VAPID-Authentifizierung** – Nur mit gültigen Keys
3. **Server-seitig** – Private Keys nie im Client
4. **Error-Handling** – Keine internen Details im Response

#### Fehler-Codes

| Code | Bedeutung |
|------|-----------|
| 400 | Fehlende Parameter |
| 500 | VAPID-Keys nicht konfiguriert |
| 500 | Push-Versand fehlgeschlagen |

---

## 7. Dependencies & Audit

### Regelmäßiger Audit

```bash
# Vollständiger Audit
pnpm audit

# Nur kritische/schwere Issues
pnpm audit --audit-level=high
```

### Automatisierung

In `package.json` hinzufügen:

```json
{
  "scripts": {
    "security:check": "pnpm audit --audit-level=high"
  }
}
```

### Bekannte Abhängigkeiten

| Paket | Version | Sicherheit |
|-------|---------|------------|
| next | 16.2.11 | ✅ Aktuell |
| react | 19.2.4 | ✅ Aktuell |
| tauri | 2.11.3 | ✅ Aktuell |
| web-push | 3.6.7 | ✅ Aktuell |

---

## 8. Open Source Sicherheit

### Dateien die NICHT committed werden dürfen

- `.env` (echte Werte)
- `node_modules/`
- `src-tauri/target/`
- `src-tauri/gen/`
- `*.pem`, `*.key`

### Für Contributer

1. **Fork & Clone**
2. **`.env.example` kopieren** → `.env`
3. **Eigene Keys eintragen**
4. **Nie echte Keys committen**

### Security Policy

Siehe `SECURITY.md` für:
- Verantwortungsvolle Vulnerability-Meldung
- Response-Zeiten
- Scope

---

## 9. Checklist vor Release

### Vor jedem Release

- [ ] `pnpm audit` – Keine kritischen Issues
- [ ] `.env` nicht im Repository
- [ ] `.env.example` aktuell
- [ ] VAPID-Keys rotiert (falls nötig)
- [ ] CSP konfiguriert (kein `'unsafe-inline'`)
- [ ] Service Worker validiert Eingaben
- [ ] Keine `console.log` in Production-Code
- [ ] Tauri Permissions minimal
- [ ] Git-History bereinigt (falls .env committed)

### Vor jedem Deployment

- [ ] Build ohne Warnings (`pnpm build`)
- [ ] Lint ohne Errors (`pnpm lint`)
- [ ] Tests bestanden (`pnpm test`)
- [ ] Environment-Variablen gesetzt (Production)

---

## Kontakt

Bei Sicherheitsfragen: [your@email.com]
