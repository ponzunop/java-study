(function () {
  'use strict';

  const STAGES = window.JavaQuestStages || [];
  const Engine = window.JavaQuestEngine;

  let state = loadState();
  let currentView = 'map';
  let unlockAllMode = false;
  let activeBattle = null;
  let briefingStageId = null;
  let audioCtx = null;
  const puzzleSessions = {};

  const mainEl = document.getElementById('main-content');
  const modalEl = document.getElementById('briefing-modal');

  function loadState() {
    try {
      const raw = localStorage.getItem(Engine.STORAGE_KEY);
      return raw ? Engine.normalizeState(JSON.parse(raw)) : Engine.createInitialState();
    } catch (_) {
      return Engine.createInitialState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(Engine.STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      // Ignore storage errors in restricted contexts
    }
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderRichText(rawText) {
    const parts = String(rawText).split(/(```[\s\S]*?```)/g);
    return parts
      .map((part) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const inner = part.replace(/^```[a-zA-Z0-9_-]*\n?/, '').replace(/\n?```$/, '');
          return `<pre class="code-block"><code>${escapeHtml(inner)}</code></pre>`;
        }
        let html = escapeHtml(part);
        html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\n/g, '<br />');
        return html;
      })
      .join('');
  }

  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function playTone(type) {
    if (!state.soundEnabled) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hit') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.start(now);
        osc.stop(now + 0.16);
      } else if (type === 'miss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'win') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        osc.frequency.setValueAtTime(783.99, now + 0.18);
        osc.frequency.setValueAtTime(1046.5, now + 0.27);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (_) {
      // Ignore audio errors
    }
  }

  function updateHud() {
    const totalQuests = STAGES.reduce((sum, s) => sum + s.codingQuests.length, 0);
    const totalPuzzles = STAGES.filter((s) => Boolean(s.codePuzzle)).length;
    const progress = Engine.calcOverallProgress(state, STAGES.length, totalQuests, totalPuzzles);
    const neededExp = Engine.expNeededForLevel(state.level);
    const pct = Math.min(100, Math.round((state.exp / neededExp) * 100));
    const inv = state.inventory || { potion: 0, scan50: 0, charm2x: 0 };

    document.getElementById('player-title').textContent = Engine.getTitleForLevel(state.level);
    document.getElementById('player-level').textContent = `Lv.${state.level}`;
    document.getElementById('exp-bar-fill').style.width = `${pct}%`;
    document.getElementById('exp-text').textContent = `${state.exp} / ${neededExp} EXP`;
    document.getElementById('hud-cleared').textContent = `${progress.cleared} / ${progress.totalStages}章`;
    document.getElementById('hud-stars').textContent = `★ ${progress.stars} / ${progress.maxStars}`;
    document.getElementById('hud-quests').textContent = `${progress.solved} / ${progress.totalQuests}`;
    document.getElementById('hud-puzzles').textContent = `パズル ${progress.solvedPuzzles} / ${progress.totalPuzzles}`;
    document.getElementById('hud-accuracy').textContent = `正答率 ${progress.accuracy}%`;
    document.getElementById('hud-combo').textContent = `最大コンボ ${state.maxCombo}`;
    document.getElementById('hud-coins').textContent = `${state.coins} G`;
    document.getElementById('hud-items').textContent = `🧪${inv.potion || 0} 🔍${inv.scan50 || 0} 🧿${inv.charm2x || 0}`;
    document.getElementById('weak-count-badge').textContent = String(state.wrongQuestionIds.length);
    document.getElementById('btn-sound').textContent = state.soundEnabled ? '🔊 効果音 ON' : '🔇 効果音 OFF';
    document.getElementById('btn-unlock-all').textContent = unlockAllMode ? '🔓 全章解放中' : '🔒 順次進行中';
  }

  function setActiveTab(viewName) {
    currentView = viewName;
    activeBattle = null;
    document.querySelectorAll('.nav-tab').forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.view === viewName);
    });
    render();
  }

  function render() {
    updateHud();
    if (activeBattle) {
      renderBattle();
      return;
    }
    if (currentView === 'map') renderMapView();
    else if (currentView === 'quests') renderQuestsView();
    else if (currentView === 'puzzles') renderPuzzlesView();
    else if (currentView === 'shop') renderShopView();
    else if (currentView === 'review') renderReviewView();
    else if (currentView === 'survival') renderSurvivalView();
    else if (currentView === 'badges') renderBadgesView();
  }

  function renderStars(count) {
    return '★'.repeat(count) + '☆'.repeat(3 - count);
  }

  function renderMapView() {
    const totalStages = STAGES.length;
    const nextStageNum = Math.min(totalStages, state.clearedStages.length + 1);
    const cards = STAGES.map((stage) => {
      const unlocked = unlockAllMode || Engine.isStageUnlocked(state, stage.id);
      const cleared = state.clearedStages.includes(stage.id);
      const stars = state.stageStars[stage.id] || 0;
      const best = state.stageBestScores[stage.id] || 0;
      const questsDone = stage.codingQuests.filter((q) => state.solvedQuests.includes(q.id)).length;
      const puzzleDone = stage.codePuzzle && state.solvedPuzzles.includes(stage.codePuzzle.id);

      return `
        <article class="stage-card ${cleared ? 'cleared' : ''} ${!unlocked ? 'locked' : ''}">
          <div class="stage-top">
            <span class="stage-chip">STAGE ${stage.id} ・ ${escapeHtml(stage.areaName)}</span>
            <span class="stars" title="獲得スター">${renderStars(stars)}</span>
          </div>
          <div>
            <h3>${escapeHtml(stage.title)}</h3>
            <p class="muted">${escapeHtml(stage.subtitle)}</p>
          </div>
          <div class="monster-preview">
            <span class="monster-emoji">${stage.monster.emoji}</span>
            <div>
              <strong>${escapeHtml(stage.monster.name)}</strong>
              <p class="muted" style="font-size:0.78rem;">${escapeHtml(stage.monster.title)}（HP ${stage.monster.maxHp}）</p>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:#cbd5e1;gap:6px;flex-wrap:wrap;">
            <span>クイズ: <strong>${best}/${stage.questions.length}</strong></span>
            <span>修復: <strong>${questsDone}/${stage.codingQuests.length}</strong></span>
            <span>パズル: <strong>${puzzleDone ? '✅' : '0/1'}</strong></span>
          </div>
          <div class="stage-actions">
            <button class="btn btn-primary" data-action="open-briefing" data-stage="${stage.id}" ${!unlocked ? 'disabled' : ''}>
              ${!unlocked ? '🔒 前章クリアで解放' : cleared ? '⚔️ 再挑戦 / 予習' : '⚔️ 挑戦する'}
            </button>
            <a href="${escapeHtml(stage.lessonFile)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">📖 講義</a>
          </div>
        </article>
      `;
    }).join('');

    mainEl.innerHTML = `
      <section class="section-banner">
        <div>
          <h2>🗺️ Java Quest 冒険マップ（全${totalStages}章）</h2>
          <p class="muted">第1〜10章で家計簿Webアプリを完成させ、第11〜14章で SQL/JDBC・Stream/JSON API・JUnit・Maven/Spring Boot を攻略しよう！</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-accent btn-sm" id="banner-quick-start">⚡ 第${nextStageNum}章へすぐ挑戦</button>
        </div>
      </section>
      <div class="stage-grid">${cards}</div>
    `;

    mainEl.querySelectorAll('[data-action="open-briefing"]').forEach((btn) => {
      btn.addEventListener('click', () => openBriefing(Number(btn.dataset.stage)));
    });
    const quickBtn = document.getElementById('banner-quick-start');
    if (quickBtn) {
      quickBtn.addEventListener('click', () => openBriefing(nextStageNum));
    }
  }

  function openBriefing(stageId) {
    const stage = STAGES.find((s) => s.id === stageId);
    if (!stage) return;
    briefingStageId = stageId;

    document.getElementById('briefing-area').textContent = `STAGE ${stage.id} ・ ${stage.areaName}`;
    document.getElementById('briefing-title').textContent = stage.title;
    document.getElementById('briefing-subtitle').textContent = stage.subtitle;
    document.getElementById('briefing-lesson-link').href = stage.lessonFile;

    const tipsHtml = stage.tips
      .map(
        (tip) => `
        <div class="tip-card">
          <strong>📌 ${escapeHtml(tip.title)}</strong>
          <pre class="code-block"><code>${escapeHtml(tip.code)}</code></pre>
          <p class="muted">${renderRichText(tip.note)}</p>
        </div>
      `
      )
      .join('');

    document.getElementById('briefing-body').innerHTML = `
      <p>${renderRichText(stage.story)}</p>
      <div class="monster-preview" style="margin: 14px 0;">
        <span class="monster-emoji">${stage.monster.emoji}</span>
        <div>
          <strong>出現モンスター: ${escapeHtml(stage.monster.name)}</strong>
          <p class="muted">${renderRichText(stage.monster.intro)}</p>
        </div>
      </div>
      <h3 style="margin:14px 0 8px;">⚡ バトル前の要点チートシート</h3>
      ${tipsHtml}
    `;

    modalEl.classList.remove('hidden');
  }

  function closeBriefing() {
    modalEl.classList.add('hidden');
  }

  function startBattle(mode, options) {
    closeBriefing();
    const maxHp = Engine.calcMaxHp(state.level);
    const totalStages = STAGES.length;
    const totalAllQuestions = STAGES.reduce((sum, s) => sum + s.questions.length, 0);
    let questions = [];
    let title = '';
    let monster = null;
    let stageId = 1;
    let badgeId = null;

    if (mode === 'stage') {
      const stage = STAGES.find((s) => s.id === options.stageId);
      stageId = stage.id;
      title = stage.title;
      monster = stage.monster;
      badgeId = stage.badge.id;
      questions = stage.questions.map((q) => ({ ...q, stageId: stage.id }));
    } else if (mode === 'review') {
      const pool = [];
      STAGES.forEach((s) => {
        s.questions.forEach((q) => {
          if (state.wrongQuestionIds.includes(q.id)) {
            pool.push({ ...q, stageId: s.id });
          }
        });
      });
      questions = pool.slice(0, 10);
      title = '⚡ 弱点特訓アリーナ';
      monster = {
        name: 'ミス記憶ファントム',
        title: '間違えた問題の集合体',
        emoji: '🔮',
        maxHp: Math.max(80, questions.length * 15),
        intro: '「過去に間違えた問題を、今度こそ撃破してみせよ！」',
        defeat: '「見事だ！弱点は完全に克服された！」',
      };
    } else if (mode === 'survival') {
      const allPool = [];
      STAGES.forEach((s) => {
        s.questions.forEach((q) => allPool.push({ ...q, stageId: s.id }));
      });
      questions = shuffleArray(allPool).slice(0, 10);
      stageId = 7;
      title = `⏱️ 全${totalStages}章 ランダム10問試験`;
      monster = {
        name: 'ランダム試験キメラ',
        title: '全章から出題する試練の魔獣',
        emoji: '🦁',
        maxHp: 140,
        intro: `「全${totalAllQuestions}問の中からランダムに10問を出題するぞ！」`,
        defeat: '「どんな問題にも対応できる実力、お見事！」',
      };
    }

    activeBattle = {
      mode,
      stageId,
      badgeId,
      title,
      monster,
      questions,
      index: 0,
      playerHp: maxHp,
      playerMaxHp: maxHp,
      monsterHp: monster.maxHp,
      monsterMaxHp: monster.maxHp,
      answeredCount: 0,
      correctCount: 0,
      combo: 0,
      maxBattleCombo: 0,
      earnedExp: 0,
      earnedCoins: 0,
      totalQuestions: questions.length,
      eliminatedChoices: [],
      charmActive: false,
      itemNotice: null,
      lastFeedback: null,
      finished: false,
      lastResult: null,
    };

    render();
  }

  function handleUseBattleItem(itemId) {
    if (!activeBattle || activeBattle.lastFeedback || activeBattle.finished) return;
    const q = activeBattle.questions[activeBattle.index];
    const res = Engine.useBattleItem(state, activeBattle, itemId, { correctAnswer: q.answer });
    if (!res.ok) {
      activeBattle.itemNotice = `⚠️ ${res.reason}`;
      render();
      return;
    }
    state = res.state;
    activeBattle = res.battleState;
    activeBattle.itemNotice = res.message;
    saveState();
    playTone('hit');
    render();
  }

  function handleChoice(choiceKey) {
    if (!activeBattle || activeBattle.lastFeedback || activeBattle.finished) return;
    if (Array.isArray(activeBattle.eliminatedChoices) && activeBattle.eliminatedChoices.includes(choiceKey)) {
      return;
    }
    const q = activeBattle.questions[activeBattle.index];
    const isCorrect = choiceKey === q.answer;

    const outcome = Engine.applyAnswerResult(activeBattle, isCorrect, q.stageId || activeBattle.stageId);
    activeBattle = outcome.battleState;
    activeBattle.itemNotice = null;

    state = Engine.updateQuestionTracking(state, q.id, isCorrect);
    const expRes = Engine.addExpAndCoins(state, outcome.earnedExp, outcome.earnedCoins);
    state = expRes.state;
    saveState();

    playTone(isCorrect ? 'hit' : 'miss');

    activeBattle.lastFeedback = {
      selected: choiceKey,
      correct: q.answer,
      isCorrect,
      explanation: q.explanation,
      damageDealt: outcome.damageDealt,
      damageTaken: outcome.damageTaken,
      earnedExp: outcome.earnedExp,
      earnedCoins: outcome.earnedCoins,
      criticalCharm: outcome.criticalCharm,
      leveledUp: expRes.leveledUp,
    };

    render();
  }

  function nextTurn() {
    if (!activeBattle) return;
    const isLast = activeBattle.index + 1 >= activeBattle.questions.length;
    const playerDefeated = activeBattle.playerHp <= 0;

    if (isLast || playerDefeated) {
      finishBattle();
      return;
    }

    activeBattle.index += 1;
    activeBattle.lastFeedback = null;
    activeBattle.eliminatedChoices = [];
    activeBattle.itemNotice = null;
    render();
  }

  function finishBattle() {
    activeBattle.finished = true;
    const { mode, stageId, correctCount, totalQuestions, playerHp, playerMaxHp, maxBattleCombo, badgeId } = activeBattle;
    let stars = Engine.calcStars(correctCount, totalQuestions, playerHp, playerMaxHp);

    if (mode === 'stage') {
      const res = Engine.recordStageClear(
        state,
        stageId,
        correctCount,
        totalQuestions,
        playerHp,
        playerMaxHp,
        maxBattleCombo,
        badgeId
      );
      state = res.state;
      stars = res.stars;
      saveState();
    }

    if (stars > 0) playTone('win');

    activeBattle.lastResult = {
      stars,
      cleared: stars > 0,
      accuracy: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0,
    };
    render();
  }

  function renderBattle() {
    const b = activeBattle;
    if (b.finished) {
      const res = b.lastResult;
      const stageClearedMsg =
        b.mode === 'stage'
          ? res.cleared
            ? `🎉 ステージクリア！獲得スター: ${renderStars(res.stars)}（コード修復やパズルにも挑戦しよう！）`
            : '💀 惜しくも敗北…！60%以上の正答＆HP残存でステージクリアです。ショップのアイテムやチートシートも活用しよう！'
          : res.cleared
          ? '🎉 特訓クリア！この調子でJavaスキルを定着させよう！'
          : '💪 終了！間違えた問題は「弱点特訓アリーナ」に記録されました。';

      mainEl.innerHTML = `
        <section class="battle-shell">
          <div class="result-summary">
            <span class="stage-chip">${escapeHtml(b.title)}</span>
            <div class="result-stars">${b.mode === 'stage' ? renderStars(res.stars) : res.cleared ? '🏆' : '📚'}</div>
            <h2>${res.cleared ? 'BATTLE VICTORY!' : 'DEFEAT... TRY AGAIN!'}</h2>
            <p class="muted">${escapeHtml(res.cleared ? b.monster.defeat : b.monster.intro)}</p>
            <p style="margin:14px 0;">${escapeHtml(stageClearedMsg)}</p>
            <div class="hud-stats" style="justify-content:center;margin:18px 0;">
              <div class="stat-pill"><span class="stat-label">正答数</span><strong>${b.correctCount} / ${b.totalQuestions} (${res.accuracy}%)</strong></div>
              <div class="stat-pill"><span class="stat-label">最大コンボ</span><strong>${b.maxBattleCombo}</strong></div>
              <div class="stat-pill"><span class="stat-label">獲得EXP</span><strong>+${b.earnedExp} EXP</strong></div>
              <div class="stat-pill"><span class="stat-label">獲得コイン</span><strong>+${b.earnedCoins} G</strong></div>
            </div>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button class="btn btn-primary" id="btn-retry-battle">🔄 もう一度戦う</button>
              ${b.mode === 'stage' ? `<button class="btn btn-accent" id="btn-go-quests">💻 コード修復へ</button>` : ''}
              ${b.mode === 'stage' ? `<button class="btn btn-success" id="btn-go-puzzles">🧩 パズルへ</button>` : ''}
              <button class="btn btn-ghost" id="btn-back-map">🗺️ マップへ戻る</button>
            </div>
          </div>
        </section>
      `;

      document.getElementById('btn-retry-battle').addEventListener('click', () => {
        startBattle(b.mode, { stageId: b.stageId });
      });
      const qBtn = document.getElementById('btn-go-quests');
      if (qBtn) qBtn.addEventListener('click', () => setActiveTab('quests'));
      const pBtn = document.getElementById('btn-go-puzzles');
      if (pBtn) pBtn.addEventListener('click', () => setActiveTab('puzzles'));
      document.getElementById('btn-back-map').addEventListener('click', () => setActiveTab('map'));
      return;
    }

    const q = b.questions[b.index];
    const playerPct = Math.round((b.playerHp / b.playerMaxHp) * 100);
    const monsterPct = Math.round((b.monsterHp / b.monsterMaxHp) * 100);
    const fb = b.lastFeedback;
    const hitMonsterClass = fb && fb.isCorrect ? 'hit' : '';
    const hitPlayerClass = fb && !fb.isCorrect ? 'hit' : '';
    const inv = state.inventory || { potion: 0, scan50: 0, charm2x: 0 };
    const eliminated = Array.isArray(b.eliminatedChoices) ? b.eliminatedChoices : [];

    const itemButtonsHtml = !fb
      ? `
        <div class="battle-items-bar">
          <span class="battle-items-label">🎒 アイテム:</span>
          ${Engine.SHOP_ITEMS.map((item) => {
            const count = inv[item.id] || 0;
            const disabled =
              count <= 0 ||
              (item.id === 'potion' && b.playerHp >= b.playerMaxHp) ||
              (item.id === 'scan50' && eliminated.length > 0) ||
              (item.id === 'charm2x' && b.charmActive);
            return `
              <button class="item-use-btn" data-use-item="${item.id}" ${disabled ? 'disabled' : ''} title="${escapeHtml(item.desc)}">
                ${item.icon} ${escapeHtml(item.name)} (<strong>${count}</strong>)
              </button>
            `;
          }).join('')}
          ${b.charmActive ? '<span class="combo-badge">🧿 ダメージ&EXP 2倍中!</span>' : ''}
        </div>
        ${b.itemNotice ? `<div class="item-notice">${escapeHtml(b.itemNotice)}</div>` : ''}
      `
      : '';

    const choicesHtml = ['A', 'B', 'C', 'D']
      .map((key) => {
        const isEliminated = eliminated.includes(key);
        let cls = 'choice-btn';
        if (isEliminated && !fb) cls += ' eliminated';
        if (fb) {
          if (key === fb.correct) cls += ' correct';
          else if (key === fb.selected && !fb.isCorrect) cls += ' wrong';
        }
        return `
          <button class="${cls}" data-choice="${key}" ${fb || isEliminated ? 'disabled' : ''}>
            <span class="choice-key">${key}</span>
            <span>${renderRichText(q.choices[key])}</span>
          </button>
        `;
      })
      .join('');

    const feedbackHtml = fb
      ? `
        <div class="feedback-panel ${fb.isCorrect ? 'ok' : 'ng'}">
          <div class="feedback-title">
            ${
              fb.isCorrect
                ? `⚔️ 正解！モンスターに ${fb.damageDealt} ダメージ！（+${fb.earnedExp} EXP / +${fb.earnedCoins} G）${fb.criticalCharm ? ' 🧿2倍!' : ''}`
                : `💥 不正解… ${fb.damageTaken} ダメージを受けた！（正解: ${fb.correct}）`
            }
            ${fb.leveledUp > 0 ? ' 🌟 LEVEL UP!' : ''}
          </div>
          <div>${renderRichText(fb.explanation)}</div>
          <div style="margin-top:12px;text-align:right;">
            <button class="btn btn-primary" id="btn-next-turn">
              ${b.index + 1 >= b.totalQuestions || b.playerHp <= 0 ? '🏁 結果を見る' : '➡️ 次の問題へ (Enter)'}
            </button>
          </div>
        </div>
      `
      : '';

    mainEl.innerHTML = `
      <section class="battle-shell">
        <div class="battle-header">
          <div>
            <span class="stage-chip">${escapeHtml(b.title)}</span>
            <span style="margin-left:8px;font-weight:700;">Turn ${b.index + 1} / ${b.totalQuestions}</span>
            ${b.combo >= 2 ? `<span class="combo-badge">🔥 ${b.combo} COMBO (x${Engine.calcComboMultiplier(b.combo)})</span>` : ''}
          </div>
          <button class="btn btn-ghost btn-sm" id="btn-flee">🏃 撤退して戻る</button>
        </div>

        <div class="combatants">
          <div class="combatant-box">
            <div class="combatant-row">
              <div class="sprite-box ${hitPlayerClass}">🧑‍💻</div>
              <div>
                <strong>${escapeHtml(Engine.getTitleForLevel(state.level))}</strong>
                <div class="muted" style="font-size:0.8rem;">Lv.${state.level} ・ 連続コンボ ${b.combo}</div>
              </div>
            </div>
            <div class="hp-bar-wrap">
              <div class="hp-label"><span>HP</span><span>${b.playerHp} / ${b.playerMaxHp}</span></div>
              <div class="hp-bar"><div class="hp-fill player" style="width:${playerPct}%"></div></div>
            </div>
          </div>

          <div class="combatant-box">
            <div class="combatant-row">
              <div class="sprite-box ${hitMonsterClass}">${b.monster.emoji}</div>
              <div>
                <strong>${escapeHtml(b.monster.name)}</strong>
                <div class="muted" style="font-size:0.8rem;">${escapeHtml(b.monster.title)}</div>
              </div>
            </div>
            <div class="hp-bar-wrap">
              <div class="hp-label"><span>MONSTER HP</span><span>${b.monsterHp} / ${b.monsterMaxHp}</span></div>
              <div class="hp-bar"><div class="hp-fill monster" style="width:${monsterPct}%"></div></div>
            </div>
            <div class="dialogue-box">${renderRichText(fb ? (fb.isCorrect ? '「くっ…！その知識、本物か…！」' : '「甘いぞ！構文や仕組みを見直せ！」') : b.monster.intro)}</div>
          </div>
        </div>

        <div class="question-card">
          <div class="question-meta">
            <span>第${q.no}問：${escapeHtml(q.topic)}</span>
            <span>キー操作: A/B/C/D または 1/2/3/4</span>
          </div>
          <div class="question-prompt">${renderRichText(q.prompt)}</div>
          ${itemButtonsHtml}
          <div class="choices-grid">${choicesHtml}</div>
          ${feedbackHtml}
        </div>
      </section>
    `;

    document.getElementById('btn-flee').addEventListener('click', () => setActiveTab('map'));
    mainEl.querySelectorAll('[data-use-item]').forEach((btn) => {
      btn.addEventListener('click', () => handleUseBattleItem(btn.dataset.useItem));
    });
    mainEl.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', () => handleChoice(btn.dataset.choice));
    });
    const nextBtn = document.getElementById('btn-next-turn');
    if (nextBtn) nextBtn.addEventListener('click', nextTurn);
  }

  function renderQuestsView() {
    const totalQuests = STAGES.reduce((sum, s) => sum + s.codingQuests.length, 0);
    const sections = STAGES.map((stage) => {
      const questsHtml = stage.codingQuests
        .map((quest) => {
          const solved = state.solvedQuests.includes(quest.id);
          const formattedCode = escapeHtml(quest.codeTemplate).replace(/\[(\d+)\]/g, '<span class="blank-slot">[$1]</span>');
          const selectsHtml = quest.blanks
            .map(
              (b, idx) => `
              <label style="display:inline-flex;align-items:center;gap:6px;">
                <strong>${escapeHtml(b.label)}</strong>
                <select class="blank-select" data-quest="${quest.id}" data-blank="${idx}">
                  <option value="">-- 選択 --</option>
                  ${b.options.map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
                </select>
              </label>
            `
            )
            .join('');

          return `
            <div class="quest-card ${solved ? 'solved' : ''}" id="quest-${quest.id}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                <div>
                  <span class="stage-chip">STAGE ${stage.id}</span>
                  <strong style="margin-left:8px;">${escapeHtml(quest.title)}</strong>
                </div>
                <span>${solved ? '✅ 修復済み' : '🛠️ 未修復 (+35 EXP / +25 G)'}</span>
              </div>
              <p class="muted" style="margin-top:6px;">${renderRichText(quest.description)}</p>
              <pre class="code-block"><code>${formattedCode}</code></pre>
              <div class="blank-row">${selectsHtml}</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
                <button class="btn btn-primary btn-sm" data-check-quest="${stage.id}:${quest.id}">🔨 コードを実行判定</button>
                <button class="btn btn-ghost btn-sm" data-hint-quest="${quest.id}">💡 ヒント</button>
              </div>
              <div id="quest-msg-${quest.id}" style="margin-top:10px;"></div>
            </div>
          `;
        })
        .join('');

      return `
        <div style="margin-bottom:24px;">
          <h3 style="margin:0 0 10px;color:#7dd3fc;">${escapeHtml(stage.title)}</h3>
          ${questsHtml}
        </div>
      `;
    }).join('');

    mainEl.innerHTML = `
      <section class="section-banner">
        <div>
          <h2>💻 コード修復クエスト（全${totalQuests}問）</h2>
          <p class="muted">各章の演習で扱う Java / JSP / SQL / JUnit / Spring Boot コードの空欄を埋めて、アプリを完成させよう！</p>
        </div>
      </section>
      ${sections}
    `;

    mainEl.querySelectorAll('[data-hint-quest]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.hintQuest;
        let quest = null;
        STAGES.forEach((s) => {
          const found = s.codingQuests.find((q) => q.id === qId);
          if (found) quest = found;
        });
        if (!quest) return;
        const msgEl = document.getElementById(`quest-msg-${qId}`);
        msgEl.innerHTML = `<div class="feedback-panel">💡 <strong>ヒント:</strong> ${renderRichText(quest.hint)}</div>`;
      });
    });

    mainEl.querySelectorAll('[data-check-quest]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [sidStr, qId] = btn.dataset.checkQuest.split(':');
        const stage = STAGES.find((s) => s.id === Number(sidStr));
        const quest = stage.codingQuests.find((q) => q.id === qId);
        const selects = Array.from(document.querySelectorAll(`[data-quest="${qId}"]`));
        const allCorrect = quest.blanks.every((b, idx) => selects[idx] && selects[idx].value === b.answer);
        const msgEl = document.getElementById(`quest-msg-${qId}`);

        if (allCorrect) {
          const wasSolved = state.solvedQuests.includes(qId);
          const res = Engine.recordQuestSolved(state, qId, 35, 25);
          state = res.state;
          saveState();
          updateHud();
          playTone('win');
          const card = document.getElementById(`quest-${qId}`);
          if (card) card.classList.add('solved');
          msgEl.innerHTML = `
            <div class="feedback-panel ok">
              <div class="feedback-title">✅ コンパイル＆テスト成功！${wasSolved ? '' : ' (+35 EXP / +25 G)'}${res.leveledUp > 0 ? ' 🌟 LEVEL UP!' : ''}</div>
              <div>${renderRichText(quest.explanation)}</div>
            </div>
          `;
        } else {
          playTone('miss');
          msgEl.innerHTML = `
            <div class="feedback-panel ng">
              <div class="feedback-title">❌ 空欄が一致しません</div>
              <div class="muted">ヒントも参考に、もう一度キーワードを確認してみよう。</div>
            </div>
          `;
        }
      });
    });
  }

  function ensurePuzzleSession(puzzle, forceReset) {
    if (!puzzleSessions[puzzle.id] || forceReset) {
      const items = puzzle.steps.map((text, idx) => ({ key: `${puzzle.id}_${idx}`, text }));
      puzzleSessions[puzzle.id] = {
        pool: shuffleArray(items),
        chosen: [],
        feedback: null,
      };
    }
    return puzzleSessions[puzzle.id];
  }

  function renderPuzzlesView() {
    const puzzleStages = STAGES.filter((s) => Boolean(s.codePuzzle));
    const cardsHtml = puzzleStages
      .map((stage) => {
        const p = stage.codePuzzle;
        const solved = state.solvedPuzzles.includes(p.id);
        const session = ensurePuzzleSession(p, false);

        const poolHtml =
          session.pool.length > 0
            ? session.pool
                .map(
                  (item) => `
                <button class="puzzle-step-btn" data-puzzle-add="${p.id}:${item.key}">
                  <span>${escapeHtml(item.text)}</span>
                  <span style="color:#38bdf8;font-size:0.75rem;">＋ 追加</span>
                </button>
              `
                )
                .join('')
            : '<p class="muted" style="font-size:0.82rem;">すべての行を選択済みです。右側の組み立て欄を確認して判定しよう！</p>';

        const chosenHtml =
          session.chosen.length > 0
            ? session.chosen
                .map(
                  (item, idx) => `
                <button class="puzzle-step-btn selected-step" data-puzzle-remove="${p.id}:${item.key}">
                  <span style="display:flex;align-items:center;gap:8px;">
                    <span class="puzzle-step-index">${idx + 1}</span>
                    <span>${escapeHtml(item.text)}</span>
                  </span>
                  <span style="color:#f87171;font-size:0.75rem;">✕ 戻す</span>
                </button>
              `
                )
                .join('')
            : '<p class="muted" style="font-size:0.82rem;">左の候補から、正しい実行順になるように行をクリックしてください。</p>';

        return `
          <div class="puzzle-card ${solved ? 'solved' : ''}" id="puzzle-${p.id}">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
              <div>
                <span class="stage-chip">STAGE ${stage.id}</span>
                <strong style="margin-left:8px;">${escapeHtml(p.title)}</strong>
              </div>
              <span>${solved ? '✅ クリア済み' : '🧩 未クリア (+40 EXP / +30 G)'}</span>
            </div>
            <p class="muted" style="margin-top:6px;">${renderRichText(p.description)}</p>
            <div class="puzzle-columns">
              <div class="puzzle-pane">
                <div class="puzzle-pane-title">📦 コード部品（クリックで追加）</div>
                <div class="puzzle-step-list">${poolHtml}</div>
              </div>
              <div class="puzzle-pane">
                <div class="puzzle-pane-title">🧱 組み立てた順序（クリックで戻す）</div>
                <div class="puzzle-step-list">${chosenHtml}</div>
              </div>
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
              <button class="btn btn-primary btn-sm" data-puzzle-check="${p.id}" ${session.chosen.length !== p.steps.length ? 'disabled' : ''}>✅ 順番を判定する</button>
              <button class="btn btn-ghost btn-sm" data-puzzle-reset="${p.id}">🔄 シャッフルしてやり直す</button>
              <button class="btn btn-ghost btn-sm" data-puzzle-hint="${p.id}">💡 ヒント</button>
            </div>
            <div style="margin-top:10px;">${session.feedback || ''}</div>
          </div>
        `;
      })
      .join('');

    mainEl.innerHTML = `
      <section class="section-banner">
        <div>
          <h2>🧩 コード構築パズル（全${puzzleStages.length}問）</h2>
          <p class="muted">プログラムやSQLの「処理の正しい順番」を組み立てて、ロジックの流れを体で覚えよう！</p>
        </div>
      </section>
      ${cardsHtml}
    `;

    mainEl.querySelectorAll('[data-puzzle-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [pid, key] = btn.dataset.puzzleAdd.split(':');
        const session = puzzleSessions[pid];
        const idx = session.pool.findIndex((i) => i.key === key);
        if (idx >= 0) {
          const [picked] = session.pool.splice(idx, 1);
          session.chosen.push(picked);
          session.feedback = null;
          renderPuzzlesView();
        }
      });
    });

    mainEl.querySelectorAll('[data-puzzle-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [pid, key] = btn.dataset.puzzleRemove.split(':');
        const session = puzzleSessions[pid];
        const idx = session.chosen.findIndex((i) => i.key === key);
        if (idx >= 0) {
          const [picked] = session.chosen.splice(idx, 1);
          session.pool.push(picked);
          session.feedback = null;
          renderPuzzlesView();
        }
      });
    });

    mainEl.querySelectorAll('[data-puzzle-reset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.puzzleReset;
        const stage = puzzleStages.find((s) => s.codePuzzle.id === pid);
        if (stage) {
          ensurePuzzleSession(stage.codePuzzle, true);
          renderPuzzlesView();
        }
      });
    });

    mainEl.querySelectorAll('[data-puzzle-hint]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.puzzleHint;
        const stage = puzzleStages.find((s) => s.codePuzzle.id === pid);
        if (!stage) return;
        puzzleSessions[pid].feedback = `<div class="feedback-panel">💡 <strong>ヒント:</strong> ${renderRichText(stage.codePuzzle.hint)}</div>`;
        renderPuzzlesView();
      });
    });

    mainEl.querySelectorAll('[data-puzzle-check]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.puzzleCheck;
        const stage = puzzleStages.find((s) => s.codePuzzle.id === pid);
        if (!stage) return;
        const p = stage.codePuzzle;
        const session = puzzleSessions[pid];
        const isCorrect =
          session.chosen.length === p.steps.length &&
          p.steps.every((stepText, idx) => session.chosen[idx].text === stepText);

        if (isCorrect) {
          const wasSolved = state.solvedPuzzles.includes(pid);
          const res = Engine.recordPuzzleSolved(state, pid, 40, 30);
          state = res.state;
          saveState();
          updateHud();
          playTone('win');
          session.feedback = `
            <div class="feedback-panel ok">
              <div class="feedback-title">🎉 正解！正しいアルゴリズム順です！${wasSolved ? '' : ' (+40 EXP / +30 G)'}${res.leveledUp > 0 ? ' 🌟 LEVEL UP!' : ''}</div>
              <div>${renderRichText(p.explanation)}</div>
            </div>
          `;
        } else {
          playTone('miss');
          session.feedback = `
            <div class="feedback-panel ng">
              <div class="feedback-title">❌ 順番が正しくありません</div>
              <div class="muted">初期化・事前設定・実行・後処理の順番を見直してみよう！</div>
            </div>
          `;
        }
        renderPuzzlesView();
      });
    });
  }

  function renderShopView(noticeHtml) {
    const inv = state.inventory || { potion: 0, scan50: 0, charm2x: 0 };
    const cardsHtml = Engine.SHOP_ITEMS.map((item) => {
      const owned = inv[item.id] || 0;
      const canBuy = state.coins >= item.price;
      return `
        <article class="shop-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="shop-icon">${item.icon}</span>
            <span class="shop-price">${item.price} G</span>
          </div>
          <div>
            <h3 style="margin:0 0 4px;">${escapeHtml(item.name)}</h3>
            <p class="muted">${escapeHtml(item.desc)}</p>
          </div>
          <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:10px;padding-top:8px;">
            <span class="muted">所持数: <strong style="color:#fff;">${owned}個</strong></span>
            <button class="btn btn-accent btn-sm" data-buy-item="${item.id}" ${!canBuy ? 'disabled' : ''}>
              ${canBuy ? '🛒 購入する' : 'コイン不足'}
            </button>
          </div>
        </article>
      `;
    }).join('');

    mainEl.innerHTML = `
      <section class="section-banner">
        <div>
          <h2>🛒 冒険者アイテムショップ</h2>
          <p class="muted">バトルやクエストで稼いだコイン（G）を使って、ボス戦を有利に進めるアイテムを購入しよう！</p>
        </div>
        <div class="stat-pill">
          <span class="stat-label">現在の所持コイン</span>
          <strong>${state.coins} G</strong>
        </div>
      </section>
      ${noticeHtml || ''}
      <div class="shop-grid">${cardsHtml}</div>
    `;

    mainEl.querySelectorAll('[data-buy-item]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = Engine.buyShopItem(state, btn.dataset.buyItem);
        if (!res.ok) {
          playTone('miss');
          renderShopView(`<div class="feedback-panel ng" style="margin-bottom:16px;">❌ ${escapeHtml(res.reason)}</div>`);
          return;
        }
        state = res.state;
        saveState();
        updateHud();
        playTone('hit');
        renderShopView(
          `<div class="feedback-panel ok" style="margin-bottom:16px;">✅ <strong>${escapeHtml(res.item.name)}</strong> を1個購入しました！（残り ${state.coins} G）</div>`
        );
      });
    });
  }

  function renderReviewView() {
    const count = state.wrongQuestionIds.length;
    mainEl.innerHTML = `
      <section class="section-banner">
        <div>
          <h2>⚡ 弱点特訓アリーナ</h2>
          <p class="muted">バトルで間違えた問題だけが自動的に集まります。正解すると弱点リストから消去されます！</p>
        </div>
      </section>
      <div class="battle-shell" style="text-align:center;padding:34px 20px;">
        <div style="font-size:3rem;">🔮</div>
        <h3>現在の弱点問題数：${count} 問</h3>
        <p class="muted" style="margin-bottom:18px;">
          ${count === 0 ? '素晴らしい！現在、未克服の弱点問題はありません。各章のバトルやランダム試験に挑戦しよう！' : '最大10問ずつ弱点モンスターに挑戦して、知識の穴を完全に埋めよう！'}
        </p>
        <button class="btn btn-primary btn-lg" id="btn-start-review" ${count === 0 ? 'disabled' : ''}>
          ⚔️ 弱点バトルを開始する
        </button>
      </div>
    `;
    const btn = document.getElementById('btn-start-review');
    if (btn && count > 0) {
      btn.addEventListener('click', () => startBattle('review'));
    }
  }

  function renderSurvivalView() {
    const totalStages = STAGES.length;
    const totalQuestions = STAGES.reduce((sum, s) => sum + s.questions.length, 0);
    mainEl.innerHTML = `
      <section class="section-banner">
        <div>
          <h2>⏱️ 全${totalStages}章 ランダム10問試験</h2>
          <p class="muted">第1回〜第${totalStages}回の全${totalQuestions}問からランダムに10問が出題される総合実力テストです。</p>
        </div>
      </section>
      <div class="battle-shell" style="text-align:center;padding:34px 20px;">
        <div style="font-size:3rem;">🦁</div>
        <h3>全${totalQuestions}問シャッフルバトル</h3>
        <p class="muted" style="margin-bottom:18px;">
          基礎構文・OOP・Servlet/JSP・MVC・DAO・SQL/JDBC・Stream/JSON API・JUnit・Spring Boot まで満遍なく出題されます。
        </p>
        <button class="btn btn-accent btn-lg" id="btn-start-survival">🔥 ランダム10問に挑戦！</button>
      </div>
    `;
    document.getElementById('btn-start-survival').addEventListener('click', () => startBattle('survival'));
  }

  function renderBadgesView() {
    const totalStages = STAGES.length;
    const badgesHtml = STAGES.map((stage) => {
      const unlocked = state.unlockedBadges.includes(stage.badge.id);
      const stars = state.stageStars[stage.id] || 0;
      return `
        <div class="badge-card ${unlocked ? '' : 'locked'}">
          <div class="badge-icon">${stage.badge.icon}</div>
          <strong>${escapeHtml(stage.badge.name)}</strong>
          <p class="muted" style="font-size:0.8rem;margin:4px 0;">Stage ${stage.id}: ${escapeHtml(stage.monster.name)}</p>
          <div class="stars">${renderStars(stars)}</div>
        </div>
      `;
    }).join('');

    mainEl.innerHTML = `
      <section class="section-banner">
        <div>
          <h2>🏆 図鑑・バッジコレクション</h2>
          <p class="muted">各章のモンスターを倒すとバッジが解放されます。全${totalStages}章制覇を目指そう！</p>
        </div>
      </section>
      <div class="badge-grid">${badgesHtml}</div>
    `;
  }

  // Event listeners
  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab.dataset.view));
  });

  document.getElementById('briefing-close').addEventListener('click', closeBriefing);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeBriefing();
  });

  document.getElementById('briefing-start-battle').addEventListener('click', () => {
    if (briefingStageId) startBattle('stage', { stageId: briefingStageId });
  });

  document.getElementById('btn-sound').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    updateHud();
  });

  document.getElementById('btn-unlock-all').addEventListener('click', () => {
    unlockAllMode = !unlockAllMode;
    render();
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    if (window.confirm('セーブデータ（レベル・スター・獲得バッジ・正答履歴・アイテム）を初期化しますか？')) {
      state = Engine.createInitialState();
      saveState();
      setActiveTab('map');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!activeBattle || activeBattle.finished) return;
    const keyMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', a: 'A', b: 'B', c: 'C', d: 'D' };
    const k = e.key.toLowerCase();
    if (!activeBattle.lastFeedback && keyMap[k]) {
      handleChoice(keyMap[k]);
    } else if (activeBattle.lastFeedback && e.key === 'Enter') {
      nextTurn();
    }
  });

  render();
})();
