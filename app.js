const agents = [
  { name: 'OMEGA', role: '総合司令官・全体管理', icon: 'Ω', color: 'omega', level: 12, xp: 68, status: 'ワールド管理中', statusType: 'active' },
  { name: 'NOVA', role: 'アイデア・企画担当', icon: '✦', color: 'nova', level: 8, xp: 42, status: 'アイデアを構想中', statusType: 'active' },
  { name: 'ATLAS', role: 'プログラミング担当', icon: '⌘', color: 'atlas', level: 10, xp: 76, status: 'チームに参加中', statusType: 'active' },
  { name: 'GENIUS', role: '推論・問題解決担当', icon: '✧', color: 'genius', level: 7, xp: 31, status: '待機中', statusType: 'idle' },
  { name: 'PIXEL', role: '画像・デザイン担当', icon: '◈', color: 'pixel', level: 9, xp: 55, status: 'デザインを制作中', statusType: 'active' },
  { name: 'ORION', role: '情報検索・調査担当', icon: '✳', color: 'orion', level: 6, xp: 24, status: '待機中', statusType: 'idle' },
  { name: 'GUARDIAN', role: 'セキュリティ担当', icon: '⬡', color: 'guardian', level: 8, xp: 49, status: '待機中', statusType: 'idle' },
  { name: 'TESTER', role: '動作確認・バグ修正担当', icon: '✓', color: 'tester', level: 5, xp: 18, status: '待機中', statusType: 'idle' },
  { name: 'EVOLVE', role: 'AIの成長・改善担当', icon: '↗', color: 'evolve', level: 4, xp: 12, status: '学習中', statusType: 'active' },
  { name: 'CHATTER', role: '雑談・コミュニケーション担当', icon: '☻', color: 'chatter', level: 6, xp: 37, status: '待機中', statusType: 'idle' }
];

const views = {
  dashboard: 'コマンドセンター', agents: 'AIエージェント', world: 'AIワールド',
  teams: 'チーム制作', chats: 'AIチャット', activity: 'アクティビティ', settings: '設定'
};

const list = document.getElementById('agentList');
const search = document.getElementById('agentSearch');
const emptyState = document.getElementById('emptyState');
const toast = document.getElementById('toast');
let toastTimer;

function renderAgents(query = '') {
  const normalized = query.trim().toLocaleLowerCase('ja');
  const visible = agents.filter(agent => `${agent.name} ${agent.role} ${agent.status}`.toLocaleLowerCase('ja').includes(normalized));
  list.innerHTML = visible.map(agent => `
    <article class="agent-row">
      <div class="agent-avatar ${agent.color}">${agent.icon}<span class="avatar-status ${agent.statusType}"></span></div>
      <div class="agent-main"><div class="agent-name-line"><h3>${agent.name}</h3><span class="level-tag">LVL ${String(agent.level).padStart(2, '0')}</span></div><p>${agent.role}</p><div class="xp-track" aria-label="次のレベルまで経験値 ${agent.xp}%"><span style="width:${agent.xp}%"></span></div></div>
      <div class="agent-state"><span class="state-dot ${agent.statusType}"></span>${agent.status}</div>
      <button class="row-more" aria-label="${agent.name} の詳細" data-agent="${agent.name}">···</button>
    </article>`).join('');
  emptyState.classList.toggle('hidden', visible.length > 0);
  list.classList.toggle('hidden', visible.length === 0);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2800);
}

function setView(view) {
  const title = views[view] || views.dashboard;
  document.getElementById('breadcrumbCurrent').textContent = title;
  document.querySelectorAll('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  closeMobileMenu();
  if (view === 'dashboard') {
    document.querySelector('.welcome-row h1').innerHTML = 'コマンドセンター<span class="heading-period">.</span>';
    document.querySelector('.welcome-subtitle').textContent = 'チームの現在地を確認して、次のクリエイションへ。';
    return;
  }
  if (view === 'agents') {
    document.querySelector('.welcome-row h1').innerHTML = 'AIエージェント<span class="heading-period">.</span>';
    document.querySelector('.welcome-subtitle').textContent = 'ワールドを支える10体のエージェント。';
    document.getElementById('agentsPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  document.querySelector('.welcome-row h1').innerHTML = `${title}<span class="heading-period">.</span>`;
  document.querySelector('.welcome-subtitle').textContent = 'この機能は今後の開発ステージで追加されます。';
  showToast(`${title} は今後のステージで実装予定です`);
}

document.querySelectorAll('[data-view]').forEach(button => {
  button.addEventListener('click', () => setView(button.dataset.view));
});
search.addEventListener('input', event => renderAgents(event.target.value));
document.getElementById('filterButton').addEventListener('click', () => showToast('ステータスフィルターは次のステージで追加予定です'));
document.getElementById('exploreButton').addEventListener('click', () => {
  document.getElementById('agentsPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  search.focus({ preventScroll: true });
});
document.getElementById('quickStartButton').addEventListener('click', () => showToast('プロジェクト作成はチーム制作ステージで追加予定です'));
document.getElementById('agentList').addEventListener('click', event => {
  const button = event.target.closest('[data-agent]');
  if (button) showToast(`${button.dataset.agent} のプロフィールはエージェント管理ステージで利用可能になります`);
});

document.getElementById('themeToggle').addEventListener('click', () => {
  const light = document.body.classList.toggle('light-theme');
  localStorage.setItem('omega-theme', light ? 'light' : 'dark');
  document.getElementById('themeToggle').textContent = light ? '☾' : '☼';
  document.getElementById('themeToggle').setAttribute('aria-label', light ? 'ダークモードに切り替え' : 'ライトモードに切り替え');
});
if (localStorage.getItem('omega-theme') === 'light') {
  document.body.classList.add('light-theme');
  document.getElementById('themeToggle').textContent = '☾';
  document.getElementById('themeToggle').setAttribute('aria-label', 'ダークモードに切り替え');
}

const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('mobileOverlay');
function closeMobileMenu() { sidebar.classList.remove('open'); overlay.classList.remove('visible'); }
document.getElementById('menuToggle').addEventListener('click', () => { sidebar.classList.toggle('open'); overlay.classList.toggle('visible'); });
overlay.addEventListener('click', closeMobileMenu);

document.getElementById('todayLabel').textContent = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }).format(new Date());
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); search.focus(); }
  if (event.key === 'Escape') closeMobileMenu();
});
renderAgents();
