# localFocus

A minimalist Pomodoro/Focus timer as a desktop and Android app.

> "See time, not just read it."

## Features

- **Pomodoro Timer** with start, pause, reset
- **Time presets**: 25, 15, 10, 5 minutes
- **Visual progress** as an animated circle
- **Desktop app** (macOS, Windows, Linux) via Tauri
- **Android app** via Tauri

## Download

Download the app for your platform directly from **[GitHub Releases](https://github.com/MrGlauby/LocalFocus/releases)**.

### Platforms

| Platform | File | Installation |
|----------|------|-------------|
| **macOS (Apple Silicon)** | `localFocus.app.tar.gz` | Extract and drag app to Applications folder |
| **macOS (Intel)** | `localFocus.app.tar.gz` | Extract and drag app to Applications folder |
| **Windows** | `localFocus.msi` | Run the MSI installer |
| **Linux** | `localFocus.AppImage` | `chmod +x localFocus.AppImage` then run it |
| **Linux (Debian/Ubuntu)** | `localFocus.deb` | `sudo dpkg -i localFocus.deb` |
| **Android** | `localFocus.apk` | Install APK (enable unknown sources) |

### Android

1. Download the APK file
2. On your device: **Settings > Security > Unknown Sources** and enable it
3. Open the APK file and install

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://v2.tauri.app/start/prerequisites/)

### Start development server

```bash
# Frontend
pnpm dev

# Tauri desktop app
pnpm tauri dev

# Tests
pnpm test
```

### Build

```bash
# Build desktop app
pnpm tauri build

# Frontend only (static export)
pnpm build
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Desktop**: Tauri 2 (Rust)
- **Testing**: Vitest, @testing-library/react
- **Build**: Static Export + Tauri Bundle

## Security

See [SECURITY.md](SECURITY.md) for details on security measures and responsible disclosure.

## License

MIT
