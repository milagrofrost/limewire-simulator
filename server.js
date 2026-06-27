const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, 'public');

const sessions = new Map();
const games = new Map();

const highscore = [
  { rank: 1, user: 'KazaaKing', score: 9999 },
  { rank: 2, user: 'NapsterKid', score: 8000 },
  { rank: 3, user: 'BearShareFan', score: 7200 },
  { rank: 4, user: 'GnutellaGuru', score: 6500 },
  { rank: 5, user: 'WinMXWizard', score: 6100 },
  { rank: 6, user: 'FrostWireKid', score: 5800 },
  { rank: 7, user: 'LocalPlayer', score: 3200 }
];

const baseResults = [
  ['sg-outshined', 'clean', 'hash-sg-001', 'Soundgarden - Outshined', 'mp3', 4852, 'T3 or Higher', '128'],
  ['sg-black-hole-sun', 'clean', 'hash-sg-002', 'Soundgarden - Black Hole Sun', 'mp3', 4968, 'T3 or Higher', '128'],
  ['sg-spoonman-a', 'clean', 'hash-sg-003', 'Soundgarden - Spoonman', 'mp3', 3864, 'T3 or Higher', '128'],
  ['sg-pretty-noose', 'clean', 'hash-sg-004', 'Soundgarden - Pretty Noose', 'mp3', 3961, 'T3 or Higher', '128'],
  ['sg-rusty-cage', 'clean', 'hash-sg-005', 'Johnny Cash - Rusty Cage (Soundgarden Cover)', 'mp3', 2690, 'T1', '128'],
  ['sg-fell-on-black-days', 'clean', 'hash-sg-006', 'Soundgarden - Fell On Black Days', 'mp3', 4732, 'T3 or Higher', '192'],
  ['sg-burden', 'clean', 'hash-sg-007', 'Soundgarden - Burden In My Hand', 'mp3', 5240, 'Cable', '192'],
  ['sg-day-i-tried', 'clean', 'hash-sg-008', 'Soundgarden - The Day I Tried To Live', 'mp3', 7487, 'T3 or Higher', '192'],
  ['numb-clean', 'clean', 'hash-numb-001', 'Linkin Park - Numb.mp3', 'mp3', 4300, 'T3', '192'],
  ['bring-clean', 'clean', 'hash-bring-002', 'Evanescence - Bring Me To Life.mp3', 'mp3', 5200, 'Cable', '256'],
  ['virus-a', 'virus', 'hash-virus-006', 'Soundgarden - Full Discography 320kbps.mp3.exe', 'exe', 640, 'T3', '320'],
  ['virus-b', 'virus', 'hash-virus-007', 'Metallica - One [RARE LIVE] mp3.scr', 'scr', 420, 'Cable', '128']
];

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

function sendJson(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body)
  });
  res.end(body);
}

function sendText(res, status, value) {
  res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(value);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      const params = new URLSearchParams(raw);
      resolve(Object.fromEntries(params.entries()));
    });
    req.on('error', reject);
  });
}

function getUser(email) {
  const safeEmail = email || 'test@example.com';
  if (!sessions.has(safeEmail)) {
    sessions.set(safeEmail, {
      id: `local-user-${Buffer.from(safeEmail).toString('hex').slice(0, 8)}`,
      email: safeEmail,
      created: new Date().toISOString().slice(0, 10),
      permanent_score: 0,
      highscore: 0,
      user_score_rank: 999
    });
  }
  return sessions.get(safeEmail);
}

function updateUserRank(user) {
  const scores = [...highscore.map(row => row.score), user.highscore].sort((a, b) => b - a);
  user.user_score_rank = scores.indexOf(user.highscore) + 1;
}

function stableHash(value) {
  let hash = 2166136261;
  const input = String(value || '');
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seedText) {
  let seed = stableHash(seedText) || 1;
  return function rand() {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) / 4294967296);
  };
}

function pick(rand, values) {
  return values[Math.floor(rand() * values.length)];
}

function slug(value) {
  return String(value || 'file')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 36) || 'file';
}

function titleLooksLikeMusic(title) {
  return /\.(mp3|wma|wav|m3u)(\.|$)/i.test(title) ||
    / - |song|album|live|acoustic|remix|radio|edit|lyrics|rip|kbps|discography|track/i.test(title);
}

function isExecutableExt(ext) {
  return ['exe', 'scr', 'pif', 'vbs', 'bat', 'com', 'cmd'].includes(String(ext || '').toLowerCase());
}

function isArchiveExt(ext) {
  return ['zip', 'rar'].includes(String(ext || '').toLowerCase());
}

function riskForRow(row) {
  const title = String(row.title || '');
  const ext = String(row.ext || '').toLowerCase();
  const size = Number(row.size) || 0;
  const bitrate = String(row.bitrate || '').trim();
  let risk = Number(row.risk);
  if (!Number.isFinite(risk)) risk = 20;

  if (isExecutableExt(ext) && titleLooksLikeMusic(title)) risk = Math.max(risk, 90);
  if (/\.(mp3|wma|wav|m4a)\.(exe|scr|pif|vbs|bat|com|cmd)$/i.test(title)) risk = Math.max(risk, 95);
  if (ext === 'mp3' && size < 1000) risk = Math.max(risk, 70);
  if (ext === 'mp3' && size >= 1000 && size < 2000) risk = Math.max(risk, 50);
  if (ext === 'mp3' && size >= 3000 && size <= 8000 && ['96', '128', '160', '192', '256', '320'].includes(bitrate)) risk = Math.min(risk, 25);
  if ((ext === 'mp3' || ext === 'wma') && !bitrate) risk = Math.max(risk, 35);
  if (isArchiveExt(ext)) risk = Math.max(risk, 55);
  if (/NO VIRUS|KEYGEN|CRACK|CODEC|DOWNLOADER|INSTALLER|TOOLBAR/i.test(title)) risk = Math.max(risk, 90);
  return Math.max(0, Math.min(100, Math.round(risk)));
}

function classifyRow(row, rand) {
  const ext = String(row.ext || '').toLowerCase();
  const title = String(row.title || '');
  const size = Number(row.size) || 0;
  const risk = riskForRow(row);

  if (isExecutableExt(ext) || /\.(mp3|wma|wav|m4a)\.(exe|scr|pif|vbs|bat|com|cmd)$/i.test(title)) return 'virus';
  if (/NO VIRUS|KEYGEN|CRACK|CODEC|DOWNLOADER|INSTALLER|TOOLBAR/i.test(title)) return 'virus';
  if (ext === 'mp3' && size < 1000) return rand() > 0.5 ? 'junk' : 'fake';
  if (isArchiveExt(ext)) return risk > 70 ? 'fake' : 'junk';
  if (['txt', 'jpg', 'm3u'].includes(ext)) return 'junk';
  if (risk <= 30 && ['mp3', 'wma', 'wav'].includes(ext)) return 'clean';
  if (risk >= 85) return 'virus';
  return risk >= 55 ? 'fake' : 'junk';
}

function normalizeRows(rows, query, source) {
  const seen = new Set();
  const normalized = [];

  rows.slice(0, 30).forEach((row, index) => {
    let title = String(row.title || row.name || `${query || 'unknown'}_${index + 1}.mp3`).slice(0, 120);
    const rand = createRng(`${title}:${index}:${source}`);
    const rawExt = String(row.ext || '').toLowerCase().replace(/^\./, '').split('.').filter(Boolean).pop();
    let ext = ['mp3', 'wma', 'wav', 'txt', 'jpg', 'm3u', 'zip', 'rar', 'exe', 'scr', 'pif', 'vbs', 'bat', 'com', 'cmd'].includes(rawExt)
      ? rawExt
      : 'mp3';

    if (isExecutableExt(ext) && !/\.(mp3|wma|wav|m4a)\.(exe|scr|pif|vbs|bat|com|cmd)$/i.test(title) && titleLooksLikeMusic(title)) {
      title = title.replace(/\.(exe|scr|pif|vbs|bat|com|cmd|mp3|wma|wav|m4a)$/i, '') + `${pick(rand, ['.mp3', '.wma', '.m4a'])}.${ext}`;
    }

    const candidate = {
      id: String(row.id || `row-${source}-${slug(title)}-${index + 1}`).slice(0, 80),
      h: String(row.h || `hash-${source}-${stableHash(`${title}:${index}`).toString(16)}`).slice(0, 80),
      title,
      ext,
      size: Number(row.size) || (isExecutableExt(ext) ? 420 + index * 37 : 3000 + index * 271),
      speed: ['Modem', 'Cable', 'DSL', 'T1', 'T3', 'T3 or Higher'].includes(row.speed) ? row.speed : pick(rand, ['Cable', 'DSL', 'T1', 'T3', 'T3 or Higher']),
      bitrate: String(row.bitrate || '').trim(),
      risk: Number(row.risk),
      reason: String(row.reason || '').slice(0, 120)
    };

    candidate.risk = riskForRow(candidate);
    const requestedVar = ['clean', 'junk', 'fake', 'virus'].includes(row.var) ? row.var : '';
    candidate.var = requestedVar || classifyRow(candidate, rand);
    if (candidate.var === 'clean' && candidate.risk > 40) candidate.var = candidate.risk > 75 ? 'fake' : 'junk';
    if (candidate.var === 'virus') candidate.risk = Math.max(candidate.risk, 90);
    if (!candidate.reason) candidate.reason = reasonForRow(candidate);

    const key = candidate.title.toLowerCase().replace(/[^a-z0-9]+/g, '');
    if (!seen.has(key)) {
      seen.add(key);
      normalized.push(candidate);
    }
  });

  return normalized.slice(0, 25);
}

function reasonForRow(row) {
  if (row.var === 'virus') return 'Executable or malware-like file disguised as music.';
  if (row.ext === 'mp3' && row.size < 1000) return 'Tiny MP3 is likely a preview, ringtone, fake, or corrupt file.';
  if (isArchiveExt(row.ext)) return 'Archive pretending to be music collection; historically risky.';
  if (['txt', 'jpg', 'm3u'].includes(row.ext)) return 'Non-audio result mixed into music search.';
  if (row.var === 'clean') return 'Plausible audio extension, size, and bitrate.';
  return 'Questionable LimeWire-style result.';
}

function legacyRows(query) {
  const q = String(query || '').trim();
  const lower = q.toLowerCase();
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'of', 'in', 'on', 'all']);
  const terms = lower
    .split(/\s+/)
    .map(term => term.replace(/[^a-z0-9]/g, ''))
    .filter(term => term && !stopWords.has(term));
  const filtered = baseResults.filter(row => {
    const title = row[3].toLowerCase();
    return terms.length === 0 || terms.every(term => title.includes(term));
  });
  return filtered.map(([id, variant, h, title, ext, size, speed, bitrate]) => ({
    id,
    var: variant,
    h,
    title,
    ext,
    size,
    speed,
    bitrate
  }));
}

function proceduralSearchResults(query) {
  const q = String(query || 'unknown').trim() || 'unknown';
  const rand = createRng(q);
  const cleanBase = legacyRows(q).filter(row => row.var === 'clean');
  const queryTitle = q.replace(/\b\w/g, char => char.toUpperCase());
  const resultCount = 17 + Math.floor(rand() * 6);
  const cleanCount = Math.max(9, Math.floor(resultCount * (0.5 + rand() * 0.1)));
  const junkCount = Math.max(4, Math.floor(resultCount * (0.2 + rand() * 0.1)));
  const virusCount = Math.max(2, resultCount - cleanCount - junkCount);
  const rows = [];

  for (let i = 0; i < cleanCount; i++) {
    const base = cleanBase[i] || {
      title: pick(rand, [
        `${queryTitle}.mp3`,
        `${queryTitle} [${pick(rand, ['128kbps', '192kbps', '320kbps'])}].mp3`,
        `${queryTitle} (Radio Edit).mp3`,
        `${queryTitle} live.mp3`,
        `${queryTitle} acoustic.mp3`,
        `0${(i % 9) + 1} - ${queryTitle}.mp3`,
        `${q.toLowerCase().replace(/\s+/g, '_')}.mp3`,
        `${queryTitle} ${pick(rand, ['NapsterRip', 'Kazaa', 'LimeWireRip', 'BearShare', 'CD Rip', 'remix'])}.mp3`
      ]),
      ext: 'mp3',
      size: 3000 + Math.floor(rand() * 6200),
      speed: pick(rand, ['Cable', 'DSL', 'T1', 'T3', 'T3 or Higher']),
      bitrate: pick(rand, ['96', '128', '160', '192', '256', '320'])
    };
    const bitrate = base.bitrate || pick(rand, ['96', '128', '160', '192', '256', '320']);
    let title = base.title.replace(/\.(exe|scr|zip|rar)$/i, '').replace(/\.mp3$/i, '');
    if (!/kbps/i.test(title) && rand() > 0.62) {
      title += ` [${bitrate}kbps]`;
    }
    rows.push({
      id: `clean-${slug(q)}-${i + 1}`,
      var: 'clean',
      h: `hash-clean-${stableHash(`${q}:clean:${i}`).toString(16)}`,
      title: title + '.mp3',
      ext: 'mp3',
      size: base.size,
      speed: base.speed || 'T3 or Higher',
      bitrate,
      risk: 5 + Math.floor(rand() * 20),
      reason: 'Plausible music file size and bitrate.'
    });
  }

  const junkTemplates = [
    () => [`${queryTitle} ringtone.mp3`, 'mp3', 180 + Math.floor(rand() * 720), pick(rand, ['Modem', 'Cable', 'DSL']), '96', 'Tiny MP3 is likely ringtone or preview.'],
    () => [`${queryTitle} preview.mp3`, 'mp3', 260 + Math.floor(rand() * 900), pick(rand, ['Cable', 'DSL']), '96', 'Small preview-like file.'],
    () => [`${queryTitle} lyrics.txt`, 'txt', 3 + Math.floor(rand() * 25), pick(rand, ['Modem', 'Cable', 'DSL']), '', 'Lyrics text file mixed into audio search.'],
    () => [`${queryTitle} album cover.jpg`, 'jpg', 80 + Math.floor(rand() * 500), pick(rand, ['Cable', 'DSL', 'T1']), '', 'Cover art, not audio.'],
    () => [`${queryTitle}.m3u`, 'm3u', 2 + Math.floor(rand() * 8), pick(rand, ['Modem', 'Cable']), '', 'Playlist file, not music data.'],
    () => [`${queryTitle} corrupted.mp3`, 'mp3', 2200 + Math.floor(rand() * 2200), pick(rand, ['Cable', 'DSL', 'T1']), '', 'Missing bitrate and corrupt label.'],
    () => [`${queryTitle} Complete Discography.zip`, 'zip', 28000 + Math.floor(rand() * 90000), pick(rand, ['DSL', 'T1', 'T3']), '', 'Large archive is tempting but suspicious.']
  ];

  for (let i = 0; i < junkCount; i++) {
    const [title, ext, size, speed, bitrate, reason] = pick(rand, junkTemplates)();
    const risk = ext === 'mp3' && size < 1000 ? 65 + Math.floor(rand() * 20) : 35 + Math.floor(rand() * 35);
    rows.push({
      id: `junk-${slug(q)}-${i + 1}`,
      var: risk > 60 ? 'fake' : 'junk',
      h: `hash-junk-${stableHash(`${q}:junk:${i}:${title}`).toString(16)}`,
      title,
      ext,
      size,
      speed,
      bitrate,
      risk,
      reason
    });
  }

  const baitPrefixes = ['NEW', 'FULL', 'REAL', 'HQ', 'RARE', 'UNRELEASED', 'NoSurvey', 'FAST', 'Xx'];
  const baitSuffixes = ['FREE', 'WORKING', 'FINAL', 'NO VIRUS', '100%', '2024', 'REPACK', 'ULTRA', 'HOT', 'zZz'];
  const extByType = ['exe', 'scr', 'pif', 'vbs', 'bat', 'com', 'cmd'];
  const separators = ['__', '--', '_-_', '..', '~~', '[]', '++', ' '];
  const musicBait = ['full_album', 'discography', 'live', 'acoustic', 'rare_demo', 'unreleased', 'radio_edit', 'lyrics', '320kbps', 'remaster'];
  const wrappers = ['mp3', 'HQ', '128kbps', '320kbps', 'CDRip', 'NapsterRip', 'LimeWireRip'];

  for (let i = 0; i < virusCount; i++) {
    const sep = pick(rand, separators);
    const ext = pick(rand, extByType);
    const queryBits = q
      .split(/\s+/)
      .filter(Boolean)
      .map(part => rand() > 0.5 ? part.toUpperCase() : part.replace(/\b\w/g, char => char.toUpperCase()))
      .join(pick(rand, ['_', '-', '.']));
    const fakeMusicExt = rand() > 0.45 ? '.mp3' : pick(rand, ['.mp3', '.wma', '.m4a']);
    const title = [
      pick(rand, baitPrefixes),
      queryBits || 'unknown_artist',
      pick(rand, musicBait),
      pick(rand, wrappers),
      Math.floor(100 + rand() * 9900),
      pick(rand, baitSuffixes)
    ].join(sep).replace(/\s+/g, pick(rand, ['_', '.', '-'])) + `${fakeMusicExt}.${ext}`;

    rows.push({
      id: `virus-${slug(q)}-${i + 1}`,
      var: 'virus',
      h: `hash-virus-${stableHash(`${q}:virus:${i}:${title}`).toString(16)}`,
      title,
      ext,
      size: Math.floor(48 + rand() * 1400),
      speed: pick(rand, ['T3 or Higher', 'T3', 'T1', 'Cable', 'DSL']),
      bitrate: pick(rand, ['', '128', '192', '256', '320']),
      risk: 90 + Math.floor(rand() * 11),
      reason: 'Executable malware trap disguised as music.'
    });
  }

  return normalizeRows(rows, q, 'procedural')
    .map(row => ({ row, sort: rand() }))
    .sort((a, b) => a.sort - b.sort)
    .map(item => item.row);
}

async function handleApi(req, res, url) {
  const body = req.method === 'POST' ? await parseBody(req) : {};

  if (url.pathname === '/api/login' && req.method === 'POST') {
    const user = getUser(body.email);
    updateUserRank(user);
    sendJson(res, 200, user);
    return;
  }

  if (url.pathname === '/api/start_game' && req.method === 'POST') {
    const id = `local-game-${Date.now().toString(36)}`;
    const email = body.email || 'test@example.com';
    const game = { id, email, score: 0, endTime: nowSeconds() + 60, downloaded: new Set() };
    games.set(id, game);
    sendJson(res, 200, {
      game_id: id,
      started: true,
      status: 'running',
      time_left: 60,
      end_time: game.endTime,
      score: 0
    });
    return;
  }

  if (url.pathname === '/api/search' && req.method === 'POST') {
    sendJson(res, 200, proceduralSearchResults(body.search));
    return;
  }

  if (url.pathname === '/api/confirm_download') {
    const gameId = url.searchParams.get('game_id') || body.game_id;
    const id = url.searchParams.get('id') || body.id;
    const h = url.searchParams.get('h') || body.h;
    const variant = url.searchParams.get('var') || body.var;
    let game = games.get(gameId);

    if (!game) {
      game = {
        id: gameId || 'local-sim-session',
        email: 'simulator@example.local',
        score: 0,
        endTime: nowSeconds() + 3600,
        downloaded: new Set()
      };
      games.set(game.id, game);
    }

    if (variant === 'virus' || String(id).includes('virus')) {
      game.endTime = nowSeconds();
      sendJson(res, 200, {
        game_id: gameId,
        status: 'ended_virus',
        end_time: game.endTime,
        score: 0
      });
      return;
    }

    if (!game.downloaded.has(h)) {
      game.downloaded.add(h);
      game.score += 150;
    }
    game.endTime = Math.max(game.endTime, nowSeconds() + 12);

    const user = getUser(game.email);
    user.highscore = Math.max(user.highscore, game.score);
    updateUserRank(user);

    sendJson(res, 200, {
      game_id: gameId,
      status: 'running',
      end_time: game.endTime,
      score: game.score
    });
    return;
  }

  if (url.pathname === '/api/highscore' && req.method === 'GET') {
    sendJson(res, 200, highscore);
    return;
  }

  if (url.pathname === '/api/send_desktop_link' && req.method === 'POST') {
    sendJson(res, 200, { success: true });
    return;
  }

  sendJson(res, 404, { message: 'Unknown API endpoint.' });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg'
  }[ext] || 'application/octet-stream';
}

function serveStatic(req, res, url) {
  const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      sendText(res, 404, 'Not found');
      return;
    }
    res.writeHead(200, { 'content-type': contentType(filePath) });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (url.pathname.startsWith('/api/')) {
    handleApi(req, res, url).catch(error => {
      console.error(error);
      sendJson(res, 500, { message: 'Local API error.' });
    });
    return;
  }
  serveStatic(req, res, url);
});

server.listen(PORT, () => {
  console.info(`Local LimeWire simulator running at http://localhost:${PORT}`);
});
