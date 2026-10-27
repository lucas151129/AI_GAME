const grid = document.getElementById('gameGrid');
const count = document.getElementById('gameCount');
const legacyNotice = document.getElementById('legacyNotice');

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function makeLiveCard(game) {
  const card = el('a', 'game-card is-live');
  card.href = game.path;
  card.setAttribute('aria-label', `進入${game.title}`);

  const cover = el('div', 'game-cover');
  const image = document.createElement('img');
  image.src = game.preview;
  image.alt = `${game.title}遊戲畫面`;
  image.loading = 'lazy';
  cover.append(image);
  cover.append(el('span', 'game-badge', 'LIVE'));

  const body = el('div', 'game-body');
  body.append(el('p', 'game-kicker', game.kicker));
  body.append(el('h3', 'game-title', game.title));
  body.append(el('p', 'game-desc', game.description));

  const tags = el('ul', 'game-tags');
  for (const tag of game.tags || []) tags.append(el('li', '', tag));
  body.append(tags);

  const foot = el('div', 'game-foot');
  foot.append(el('span', 'game-meta', game.meta));
  const cta = el('span', 'game-cta', game.cta || '進入實驗室');
  cta.insertAdjacentHTML(
    'beforeend',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  );
  foot.append(cta);
  body.append(foot);
  card.append(cover, body);
  return card;
}

function makeSoonCard(game, index) {
  const card = el('article', 'game-card is-soon');
  card.append(el('span', 'soon-index', String(index + 1).padStart(2, '0')));
  card.append(el('h3', 'soon-title', game.title));
  card.append(el('p', 'soon-desc', game.description));

  const tags = el('ul', 'game-tags');
  for (const tag of game.tags || []) tags.append(el('li', '', tag));
  card.append(tags);
  card.append(el('span', 'soon-status', game.meta || '籌備中'));
  return card;
}

function showLoadError() {
  count.textContent = '遊戲庫暫時無法載入';
  const message = el('p', 'load-error');
  message.append(document.createTextNode('無法讀取遊戲清單。你仍可直接前往 '));
  const link = el('a', '', '星際工坊');
  link.href = './games/starforge/';
  message.append(link, document.createTextNode('。'));
  grid.append(message);
}

async function loadGames() {
  try {
    const response = await fetch('./games.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const games = Array.isArray(data.games) ? data.games : [];
    const live = games.filter((game) => game.status === 'live');
    const soon = games.filter((game) => game.status !== 'live');

    count.textContent = `${String(live.length).padStart(2, '0')} 個遊戲上線 · ${String(soon.length).padStart(2, '0')} 個實驗室籌備中`;
    grid.replaceChildren();

    for (const game of games) {
      if (game.status === 'live') grid.append(makeLiveCard(game));
    }
    soon.forEach((game, index) => grid.append(makeSoonCard(game, live.length + index)));
  } catch (error) {
    showLoadError();
  }
}

const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.matchMedia('(display-mode: fullscreen)').matches ||
  navigator.standalone === true;

if (isStandalone && legacyNotice) {
  legacyNotice.hidden = false;
}

loadGames();
