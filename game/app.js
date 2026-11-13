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
    const progress = Engine.calcOverallProgress(state, STAGES.length, totalQuests);
    const neededExp = Engine.expNeededForLevel(state.level);
    const pct = Math.min(100, Math.round((state.exp / neededExp) * 100));

    document.getElementById('player-title').textContent = Engine.getTitleForLevel(state.level);
    document.getElementById('player-level').textContent = `Lv.${state.level}`;
    document.getElementById('exp-bar-fill').style.width = `${pct}%`;
    document.getElementById('exp-text').textContent = `${state.exp} / ${neededExp} EXP`;
    document.getElementById('hud-cleared').textContent = `${progress.cleared} / ${progress.totalStages}章`;
    document.getElementById('hud-stars').textContent = `★ ${progress.stars} / ${progress.maxStars}`;
    document.getElementById('hud-quests').textContent = `${progress.solved} / ${progress.totalQuests}`;
    document.getElementById('hud-accuracy').textContent = `正答率 ${progress.accuracy}%`;
    document.getElementById('hud-coins').textContent = `${state.coins} G`;
    document.getElementById('hud-combo').textContent = `最大コンボ ${state.maxCombo}`;
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
    else if (currentView === 'review') renderReviewView();
    else if (currentView === 'survival') renderSurvivalView();
    else if (currentView === 'badges') renderBadgesView();
  }

  function renderStars(count) {
    return '★'.repeat(count) + '☆'.repeat(3 - count);
  }

  function renderMapView() {
    const cards = STAGES.map((stage) => {
      const unlocked = unlockAllMode || Engine.isStageUnlocked(state, stage.id);
      const cleared = state.clearedStages.includes(stage.id);
      const stars = state.stageStars[stage.id] || 0;
      const best = state.stageBestScores[stage.id] || 0;
      const questsDone = stage.codingQuests.filter((q) => state.solvedQuests.includes(q.id)).length;

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
          <div style="display:flex;justify-content:space-between;font-size:0.82rem;color:#cbd5e1;">
            <span>クイズ最高: <strong>${best} / ${stage.questions.length}</strong></span>
            <span>コード修復: <strong>${questsDone} / ${stage.codingQuests.length}</strong></span>
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
          <h2>🗺️ Java Quest 冒険マップ（全10章）</h2>
          <p class="muted">各章のモンスターをクイズバトルで倒し、コード修復クエストで「MyKakeibo Webアプリ」を完成させよう！</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-accent btn-sm" id="banner-quick-start">⚡ 第${Math.min(10, state.clearedStages.length + 1)}章へすぐ挑戦</button>
        </div>
      </section>
      <div class="stage-grid">${cards}</div>
    `;

    mainEl.querySelectorAll('[data-action="open-briefing"]').forEach((btn) => {
      btn.addEventListener('click', () => openBriefing(Number(btn.dataset.stage)));
    });
    const quickBtn = document.getElementById('banner-quick-start');
    if (quickBtn) {
      quickBtn.addEventListener('click', () => {
        const nextStage = Math.min(10, state.clearedStages.length + 1);
        openBriefing(nextStage);
      });
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
      // Fisher-Yates shuffle
      for (let i = allPool.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [allPool[i], allPool[j]] = [allPool[j], allPool[i]];
      }
      questions = allPool.slice(0, 10);
      stageId = 5;
      title = '⏱️ 全10章 ランダム10問試験';
      monster = {
        name: 'ランダム試験キメラ',
        title: '全章から出題する試練の魔獣',
        emoji: '🦁',
        maxHp: 130,
        intro: '「全100問の中からランダムに10問を出題するぞ！」',
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
      lastFeedback: null,
      finished: false,
      lastResult: null,
    };

    render();
  }

  function handleChoice(choiceKey) {
    if (!activeBattle || activeBattle.lastFeedback || activeBattle.finished) return;
    const q = activeBattle.questions[activeBattle.index];
    const isCorrect = choiceKey === q.answer;

    const outcome = Engine.applyAnswerResult(activeBattle, isCorrect, q.stageId || activeBattle.stageId);
    activeBattle = outcome.battleState;

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
            ? `🎉 ステージクリア！獲得スター: ${renderStars(res.stars)}（次のステージとコード修復に挑戦しよう！）`
            : '💀 惜しくも敗北…！60%以上の正答＆HP残存でステージクリアです。チートシートを見て再挑戦しよう！'
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
              ${b.mode === 'stage' ? `<button class="btn btn-accent" id="btn-go-quests">💻 この章のコード修復へ</button>` : ''}
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
      document.getElementById('btn-back-map').addEventListener('click', () => setActiveTab('map'));
      return;
    }

    const q = b.questions[b.index];
    const playerPct = Math.round((b.playerHp / b.playerMaxHp) * 100);
    const monsterPct = Math.round((b.monsterHp / b.monsterMaxHp) * 100);
    const fb = b.lastFeedback;
    const hitMonsterClass = fb && fb.isCorrect ? 'hit' : '';
    const hitPlayerClass = fb && !fb.isCorrect ? 'hit' : '';

    const choicesHtml = ['A', 'B', 'C', 'D']
      .map((key) => {
        let cls = 'choice-btn';
        if (fb) {
          if (key === fb.correct) cls += ' correct';
          else if (key === fb.selected && !fb.isCorrect) cls += ' wrong';
        }
        return `
          <button class="${cls}" data-choice="${key}" ${fb ? 'disabled' : ''}>
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
                ? `⚔️ 正解！モンスターに ${fb.damageDealt} ダメージ！（+${fb.earnedExp} EXP / +${fb.earnedCoins} G）`
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
          <div class="choices-grid">${choicesHtml}</div>
          ${feedbackHtml}
        </div>
      </section>
    `;

    document.getElementById('btn-flee').addEventListener('click', () => setActiveTab('map'));
    mainEl.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', () => handleChoice(btn.dataset.choice));
    });
    const nextBtn = document.getElementById('btn-next-turn');
    if (nextBtn) nextBtn.addEventListener('click', nextTurn);
  }

  function renderQuestsView() {
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
          <h2>💻 コード修復クエスト（全20問）</h2>
          <p class="muted">各章の演習で扱う Java / JSP コードの空欄を埋めて、家計簿アプリを完成させよう！</p>
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
    mainEl.innerHTML = `
      <section class="section-banner">
        <div>
          <h2>⏱️ 全10章 ランダム10問試験</h2>
          <p class="muted">第1回〜第10回の全100問からランダムに10問が出題される総合実力テストです。</p>
        </div>
      </section>
      <div class="battle-shell" style="text-align:center;padding:34px 20px;">
        <div style="font-size:3rem;">🦁</div>
        <h3>全100問シャッフルバトル</h3>
        <p class="muted" style="margin-bottom:18px;">
          基礎構文・オブジェクト指向・Servlet/JSP・MVC・DAO・セキュリティまで満遍なく出題されます。
        </p>
        <button class="btn btn-accent btn-lg" id="btn-start-survival">🔥 ランダム10問に挑戦！</button>
      </div>
    `;
    document.getElementById('btn-start-survival').addEventListener('click', () => startBattle('survival'));
  }

  function renderBadgesView() {
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
          <p class="muted">各章のモンスターを倒すとバッジが解放されます。全10章制覇を目指そう！</p>
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
    if (window.confirm('セーブデータ（レベル・スター・獲得バッジ・正答履歴）を初期化しますか？')) {
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
