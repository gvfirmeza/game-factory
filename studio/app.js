/**
 * Game Studio Frontend Application Logic
 */

let allGames = [];
let currentGame = null;

async function loadGames() {
  const grid = document.getElementById('games-grid');
  grid.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Scanning games directory...</p>
    </div>
  `;

  try {
    const res = await fetch('/api/games');
    const data = await res.json();

    if (data.success && Array.isArray(data.games)) {
      allGames = data.games;
      renderGames(allGames);
      updateMetrics(allGames);
    } else {
      grid.innerHTML = `<div class="loading-state"><p>No games discovered in games/ directory.</p></div>`;
    }
  } catch (err) {
    grid.innerHTML = `<div class="loading-state"><p class="text-danger">Failed to connect to Studio server.</p></div>`;
  }
}

function updateMetrics(games) {
  document.getElementById('metric-total').textContent = games.length;
  const readyCount = games.filter((g) => g.status === 'ready' || g.hasZip).length;
  document.getElementById('metric-ready').textContent = readyCount;
}

function renderGames(games) {
  const grid = document.getElementById('games-grid');
  if (games.length === 0) {
    grid.innerHTML = `
      <div class="loading-state">
        <p>No games found in the repository.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = games
    .map((game) => {
      const statusClass = game.status === 'ready' ? '' : game.status === 'playtesting' ? 'testing' : 'polishing';
      const statusLabel = game.status ? game.status.toUpperCase() : 'READY';
      const thumbSrc = `/games/${game.id}/screenshots/thumbnail.png`;

      return `
      <div class="game-card" data-id="${game.id}">
        <div class="card-thumbnail">
          <img src="${thumbSrc}" alt="${game.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <div class="fallback-thumb" style="display:none;">🎮</div>
          <span class="badge-status ${statusClass}">${statusLabel}</span>
        </div>
        <div class="card-content">
          <div class="card-header-row">
            <h3 class="card-title">${game.title}</h3>
            <span class="badge badge-subtle">v${game.version || '1.0.0'}</span>
          </div>
          <p class="card-desc">${game.description || 'A complete autonomous HTML5 game.'}</p>
          <div class="card-meta">
            <span class="badge">${(game.genre || 'metroidvania').toUpperCase()}</span>
            <span class="badge">${game.orientation === 'landscape' ? '💻 Landscape' : '📱 Portrait'}</span>
          </div>
          <div class="card-actions">
            <button class="btn btn-primary btn-play" onclick="openGameModal('${game.id}', 'play')">
              ▶ Play
            </button>
            <button class="btn btn-secondary btn-build" onclick="openGameModal('${game.id}', 'build')">
              📦 Build
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join('');
}

async function openGameModal(gameId, initialTab = 'play') {
  currentGame = allGames.find((g) => g.id === gameId) || { id: gameId, title: gameId };

  document.getElementById('modal-game-title').textContent = currentGame.title || gameId;
  document.getElementById('modal-game-genre').textContent = (currentGame.genre || 'metroidvania').toUpperCase();
  document.getElementById('modal-game-version').textContent = `v${currentGame.version || '1.0.0'}`;

  // Switch tab
  switchTab(initialTab);

  // Set orientation dynamically
  const isLandscape = currentGame.orientation !== 'portrait';
  const iframeWrapper = document.getElementById('iframe-wrapper');
  if (isLandscape) {
    iframeWrapper.className = 'iframe-wrapper landscape';
    document.getElementById('btn-view-landscape').classList.add('active');
    document.getElementById('btn-view-portrait').classList.remove('active');
  } else {
    iframeWrapper.className = 'iframe-wrapper portrait';
    document.getElementById('btn-view-portrait').classList.add('active');
    document.getElementById('btn-view-landscape').classList.remove('active');
  }

  // Load iframe and focus for instant keyboard control
  const iframe = document.getElementById('game-iframe');
  iframe.src = `/games/${gameId}/source/index.html?t=${Date.now()}`;
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
    } catch (e) {}
  };

  // Direct window link
  const directLink = document.getElementById('btn-open-tab');
  if (directLink) {
    directLink.href = `/games/${gameId}/source/index.html`;
  }

  // Fetch doc details
  try {
    const res = await fetch(`/api/games/${gameId}`);
    const data = await res.json();
    if (data.success) {
      document.getElementById('doc-design-content').textContent =
        data.docs.design || 'No game design document found.';
      document.getElementById('doc-technical-content').textContent =
        data.docs.technical || 'No technical plan found.';
    }
  } catch (e) {}

  // Update build pane state
  const downloadBtn = document.getElementById('btn-download-zip');
  if (currentGame.hasZip) {
    downloadBtn.classList.remove('hidden');
  } else {
    downloadBtn.classList.add('hidden');
  }

  document.getElementById('game-modal').classList.remove('hidden');
}

function closeGameModal() {
  const modal = document.getElementById('game-modal');
  modal.classList.add('hidden');
  const iframe = document.getElementById('game-iframe');
  iframe.src = 'about:blank';
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  document.querySelectorAll('.tab-pane').forEach((pane) => {
    pane.classList.toggle('active', pane.id === `tab-${tabName}`);
  });
}

async function triggerGameBuild() {
  if (!currentGame) return;

  const terminal = document.getElementById('build-log-output');
  const indicator = document.getElementById('build-status-indicator');
  const triggerBtn = document.getElementById('btn-trigger-build');
  const downloadBtn = document.getElementById('btn-download-zip');

  indicator.textContent = 'Building...';
  indicator.style.color = 'var(--accent-warning)';
  triggerBtn.disabled = true;
  terminal.textContent = `[STUDIO] Starting build task for ${currentGame.id}...\n`;

  try {
    const res = await fetch(`/api/games/${currentGame.id}/build`, { method: 'POST' });
    const data = await res.json();

    terminal.textContent = data.logs || 'Build finished.';

    if (data.success) {
      indicator.textContent = 'Build Success';
      indicator.style.color = 'var(--accent-success)';
      downloadBtn.classList.remove('hidden');
      currentGame.hasZip = true;
    } else {
      indicator.textContent = 'Build Failed';
      indicator.style.color = 'var(--accent-danger)';
    }
  } catch (err) {
    terminal.textContent += `\n[ERROR] Connection failed: ${err.message}`;
    indicator.textContent = 'Error';
    indicator.style.color = 'var(--accent-danger)';
  } finally {
    triggerBtn.disabled = false;
  }
}

function downloadZip() {
  if (!currentGame) return;
  window.location.href = `/api/games/${currentGame.id}/download`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadGames();

  document.getElementById('btn-refresh').addEventListener('click', loadGames);
  document.getElementById('modal-close').addEventListener('click', closeGameModal);

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  let isSaveEnabled = true;

  document.getElementById('btn-restart-game').addEventListener('click', () => {
    const iframe = document.getElementById('game-iframe');
    if (currentGame) {
      const saveParam = isSaveEnabled ? '' : '&nosave=1';
      iframe.src = `/games/${currentGame.id}/source/index.html?t=${Date.now()}${saveParam}`;
      iframe.onload = () => {
        try {
          iframe.contentWindow?.focus();
        } catch (e) {}
      };
    }
  });

  const resetBtn = document.getElementById('btn-reset-save');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const iframe = document.getElementById('game-iframe');
      if (currentGame) {
        try {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.localStorage?.clear();
          }
        } catch (e) {}
        try {
          localStorage.removeItem('grove_odyssey_save');
          localStorage.removeItem(`${currentGame.id}_save`);
        } catch (e) {}

        const saveParam = isSaveEnabled ? '' : '&nosave=1';
        iframe.src = `/games/${currentGame.id}/source/index.html?t=${Date.now()}&reset=1${saveParam}`;
        iframe.onload = () => {
          try {
            iframe.contentWindow?.focus();
          } catch (e) {}
        };

        const originalText = resetBtn.textContent;
        resetBtn.textContent = '✓ Cleared!';
        setTimeout(() => {
          resetBtn.textContent = originalText;
        }, 1500);
      }
    });
  }

  const toggleSaveBtn = document.getElementById('btn-toggle-save');
  if (toggleSaveBtn) {
    toggleSaveBtn.addEventListener('click', () => {
      isSaveEnabled = !isSaveEnabled;
      toggleSaveBtn.classList.toggle('active', isSaveEnabled);
      toggleSaveBtn.textContent = isSaveEnabled ? '💾 Save: ON' : '🚫 Save: OFF';
      toggleSaveBtn.title = isSaveEnabled
        ? 'Save persistence enabled (data saved to localStorage/cloud)'
        : 'No-Save mode (ephemeral in-memory play only)';

      const iframe = document.getElementById('game-iframe');
      if (currentGame) {
        const saveParam = isSaveEnabled ? '' : '&nosave=1';
        iframe.src = `/games/${currentGame.id}/source/index.html?t=${Date.now()}${saveParam}`;
        iframe.onload = () => {
          try {
            iframe.contentWindow?.focus();
          } catch (e) {}
        };
      }
    });
  }

  document.getElementById('btn-view-portrait').addEventListener('click', () => {
    document.getElementById('iframe-wrapper').className = 'iframe-wrapper portrait';
    document.getElementById('btn-view-portrait').classList.add('active');
    document.getElementById('btn-view-landscape').classList.remove('active');
  });

  document.getElementById('btn-view-landscape').addEventListener('click', () => {
    document.getElementById('iframe-wrapper').className = 'iframe-wrapper landscape';
    document.getElementById('btn-view-landscape').classList.add('active');
    document.getElementById('btn-view-portrait').classList.remove('active');
  });

  document.getElementById('btn-fullscreen-game').addEventListener('click', () => {
    const iframe = document.getElementById('game-iframe');
    const wrapper = document.getElementById('iframe-wrapper');
    const target = iframe || wrapper;
    if (target.requestFullscreen) {
      target.requestFullscreen();
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    } else if (target.mozRequestFullScreen) {
      target.mozRequestFullScreen();
    } else if (target.msRequestFullscreen) {
      target.msRequestFullscreen();
    }
  });

  document.getElementById('btn-trigger-build').addEventListener('click', triggerGameBuild);
  document.getElementById('btn-download-zip').addEventListener('click', downloadZip);

  // Close modal when clicking on backdrop
  document.getElementById('game-modal').addEventListener('click', (e) => {
    if (e.target.id === 'game-modal') {
      closeGameModal();
    }
  });
});
