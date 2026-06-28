# LimeWire Simulator

![LimeWire Simulator screenshot](images/image.png)


A local, self-contained LimeWire-style search and download simulator. It recreates the feel of an early-2000s peer-to-peer client: suspicious search results, unreliable modem-era transfer speeds, bad file hygiene, legal scare screens, seeding guilt, and the occasional fake Windows disaster.

Credit note: this project is a fan recreation inspired by the original LimeWire game that appeared in 2023. It was reconstructed from archived materials and is not affiliated with LimeWire LLC.

The app does not contact LimeWire, Wayback, peers, or any external backend while running. Downloads are UI simulations only. The browser-side API simulator in `public/js/api-simulator.js` replaces the old `/api/*` server calls for static hosting.

## Run

Static hosting:

- Deploy the contents of `public/` to Cloudflare Pages or any static host.
- No Node process, Worker, database, or server API is required.

Local preview with the small convenience server:

```powershell
node server.js
```

Open:

```text
http://localhost:3000/
```

For small displays, compact mode is automatic. You can also force it with:

```text
http://localhost:3000/?compact
```

For kiosk displays with hidden bezel areas, use safe viewport margins. The browser stays fullscreen, unused regions render black, and the simulator lays itself out inside the usable area:

```text
http://localhost:3000/?safeLeft=71&safeRight=71&safeTop=0&safeBottom=0
```

Short aliases like `?left=71&right=71` also work.

## What To Try

Search for a song or artist, select a result, and click **Download**. Searches generate a rotating mix of plausible music files, junk files, tiny previews, fake archives, and executable files disguised as music. Repeating a search does not show every possible permutation at once; results shift over time to feel like new peers are appearing.

Some useful searches:

- `spoonman`
- `numb`
- `bring me to life`
- `metallica one`
- any random song title

## Easter Eggs And Gimmicks

- **Default 100x dial-up acceleration**: by default the simulator speeds up transfers 100x so downloads complete quickly; click the footer `Mode: 100x (accelerated)` link to switch to real-time (slow, dial-up) speeds for an authentic painfully-slow experience.
- **56k modem math**: file sizes are converted into real estimated download times over a 56k line.
- **Shared bandwidth**: multiple active downloads split the same simulated 56k connection instead of each getting its own full speed.
- **Frustrating speed swings**: downloads randomly fluctuate, dip, queue, reconnect, or show `Need More Sources`.
- **Slow search population**: results appear gradually instead of all at once, like an old client finding hosts.
- **Rotating search permutations**: repeated searches draw from different generated title patterns instead of dumping every variant into one list.
- **Bitrate bait**: some titles include `[128kbps]`, `[192kbps]`, `[320kbps]`, and similar labels.
- **Suspicious result types**: searches include junk like lyrics files, cover art, playlists, corrupt MP3s, archives, and disguised executables.
- **Virus payoff waits for completion**: virus mode triggers only after the bad download reaches 100%.
- **Blue screen on virus**: completing a malware-like result shows a fake Windows BSOD.
- **Idle blue screen**: leaving the app alone for roughly 5 to 8 minutes can trigger a generic BSOD.
- **Legal scare screens**: starting too many downloads can trigger either an FBI-style warning or ISP-style cease-and-desist notice.
- **Random legal threshold**: the scare screen can happen after a random limit from 3 to 10 active downloads.
- **Post-download seeding**: clean completed downloads start seeding at slow, uneven upload rates.
- **Right-click to stop seeding**: right-click a seeding row in the Downloads area to stop it.
- **LEECHER shame**: after stopping seeding 3 times, a big `LEECHER!!!!!!!` message scrolls across the screen once.
- **Upload footer**: the footer tracks active seeds and their current upload rate.
- **Compact-window survival**: the LimeWire window stays accessible on small browser windows instead of disappearing.
- **Era-appropriate chrome**: tabs, toolbar buttons, footer icons, legal notices, and the logo use local image assets from `public/img`.
- **Embedded easter-song**: the built-in player will display and play a fixed easter-song title (`You Are a Pirate - LazyTown`) from `public/audio/limewire.mp3` when you hit play.
- **Audio stutter for BSODs**: when a BSOD or crash overlay triggers, the player is intentionally seeked and briefly stuttered/looped for dramatic effect.
- **Typos / leetspeak in bait titles**: some bait/virus results intentionally contain typos, leetspeak, or odd separators to feel like spammy file shares.

## Project Layout

- `server.js` - dependency-free local HTTP server and mock API endpoints.
- `public/index.html` - the simulator shell.
- `public/css/style.game.css` - recovered base LimeWire Game stylesheet. Treat it as the historical/base layer.
- `public/css/local.css` - active local overrides: safe viewport, compact mode, icon overrides, legal notice styling, BSOD styling, and extra simulator effects.
- `public/js/api-simulator.js` - client-side mock API for `/api/login`, `/api/start_game`, `/api/search`, `/api/confirm_download`, `/api/highscore`, and `/api/send_desktop_link` so the app works on static hosts.
- `public/js/client.js` - main browser behavior for search, download simulation, shared 56k bandwidth, seeding, and scoring hooks.
- `public/js/simulator.js` - local setup helpers, safe viewport / compact-screen detection, and search form behavior.
- `public/js/simulator-after.js` - post-load behavior for help, BSODs, idle crashes, legal warning overlays, and the `gameOverPopup` override.
- `public/img/` - runtime image assets used by the interface.

## Maintainer Notes

- The safe viewport system is a first-class layout concept for fullscreen kiosk/PyForma installs. Keep bezel-related layout in `public/js/simulator.js` and `public/css/local.css`; avoid adding one-off `window.innerWidth` / `window.innerHeight` checks elsewhere.
- `public/css/style.game.css` still contains recovered archive-era styles for pages/popups that are not part of the current single-screen simulator. Do not aggressively delete from this file without visual regression testing.
- `public/css/local.css` intentionally overrides the base stylesheet heavily. Compact mode is fragile because it squeezes a fixed-size XP-style app into a much smaller safe viewport.
- `public/js/client.js` is the highest-risk file. It owns old site helpers, search UI, downloads, shared 56k timing, legal triggers, seeding, scoring, and audio player behavior in one global scope.
- `public/js/simulator-after.js` intentionally patches `window.gameOverPopup` so virus downloads show the fake BSOD instead of the old game-over popup.
- `server.js` and `public/js/api-simulator.js` duplicate much of the mock API/search generation. The browser-side API simulator is what matters for Cloudflare Pages/static hosting.
- The debug logs prefixed with `[limewire-audio]` are intentional and useful for mobile/audio issues.

## Future Changes

- Layout, safe viewport, compact mode: start in `public/js/simulator.js` and `public/css/local.css`.
- Search result generation: update `public/js/api-simulator.js` for static hosting, and mirror important changes into `server.js` only if you still rely on server API routes locally.
- Download speed, seeding, legal thresholds, junk/confetti, and shared 56k behavior: edit the simulator state/functions near the top of `public/js/client.js`.
- Help window, legal scare screens, BSOD copy, idle BSOD timing: edit `public/js/simulator-after.js`.
- Audio player, startup sound after BSOD restart, and BSOD stutter: edit the audio section near the bottom of `public/js/client.js`.
- Visual assets: keep images in `public/img/` and audio in `public/audio/`.

## Notes

This is a nostalgia simulator, not a downloader. It does not fetch files, connect to peers, install anything, or call remote services. All “downloads,” warnings, infections, legal notices, and transfer speeds are simulated in the browser.
