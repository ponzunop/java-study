(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JavaQuestEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEY = 'java_quest_mykakeibo_save_v1';
  const BASE_MAX_HP = 100;

  const SHOP_ITEMS = [
    {
      id: 'potion',
      name: '回復ポーション',
      icon: '🧪',
      price: 40,
      desc: 'バトル中に自分のHPを 35 回復する',
    },
    {
      id: 'scan50',
      name: '50/50スキャン',
      icon: '🔍',
      price: 60,
      desc: '現在の問題で不正解の選択肢を 2つ 除外する',
    },
    {
      id: 'charm2x',
      name: 'クリティカルお守り',
      icon: '🧿',
      price: 80,
      desc: 'この問題に正解すると、ダメージと獲得EXPが 2倍 になる',
    },
  ];

  function expNeededForLevel(level) {
    return 80 + (level - 1) * 40;
  }

  function createInitialState() {
    return {
      playerName: 'Java見習い勇者',
      level: 1,
      exp: 0,
      coins: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      maxCombo: 0,
      clearedStages: [],
      stageStars: {},
      stageBestScores: {},
      solvedQuests: [],
      solvedPuzzles: [],
      wrongQuestionIds: [],
      unlockedBadges: [],
      inventory: {
        potion: 1,
        scan50: 1,
        charm2x: 0,
      },
      soundEnabled: true,
    };
  }

  function normalizeInventory(rawInv) {
    const src = rawInv && typeof rawInv === 'object' ? rawInv : {};
    const out = {};
    for (const item of SHOP_ITEMS) {
      const val = Number(src[item.id]);
      out[item.id] = Number.isFinite(val) && val > 0 ? Math.floor(val) : 0;
    }
    return out;
  }

  function normalizeState(raw) {
    const base = createInitialState();
    if (!raw || typeof raw !== 'object') return base;
    return {
      ...base,
      ...raw,
      clearedStages: Array.isArray(raw.clearedStages) ? [...new Set(raw.clearedStages)] : [],
      stageStars: raw.stageStars && typeof raw.stageStars === 'object' ? { ...raw.stageStars } : {},
      stageBestScores: raw.stageBestScores && typeof raw.stageBestScores === 'object' ? { ...raw.stageBestScores } : {},
      solvedQuests: Array.isArray(raw.solvedQuests) ? [...new Set(raw.solvedQuests)] : [],
      solvedPuzzles: Array.isArray(raw.solvedPuzzles) ? [...new Set(raw.solvedPuzzles)] : [],
      wrongQuestionIds: Array.isArray(raw.wrongQuestionIds) ? [...new Set(raw.wrongQuestionIds)] : [],
      unlockedBadges: Array.isArray(raw.unlockedBadges) ? [...new Set(raw.unlockedBadges)] : [],
      inventory: raw.inventory ? normalizeInventory(raw.inventory) : { ...base.inventory },
    };
  }

  function calcMaxHp(level) {
    return BASE_MAX_HP + (Math.max(1, level) - 1) * 10;
  }

  function calcComboMultiplier(combo) {
    if (combo >= 8) return 2.0;
    if (combo >= 5) return 1.6;
    if (combo >= 3) return 1.3;
    if (combo >= 2) return 1.15;
    return 1.0;
  }

  function calcDamageToMonster(combo, monsterMaxHp, totalQuestions) {
    const baseDamage = Math.ceil(monsterMaxHp / Math.max(1, totalQuestions));
    const bonus = combo >= 3 ? Math.ceil(baseDamage * 0.25) : 0;
    return baseDamage + bonus;
  }

  function calcDamageToPlayer(stageId) {
    return 16 + Math.min(12, Math.floor((stageId - 1) / 2) * 2);
  }

  function applyAnswerResult(battleState, isCorrect, stageId) {
    const next = { ...battleState };
    const hadCharm = Boolean(next.charmActive);
    next.charmActive = false;
    next.eliminatedChoices = [];
    next.answeredCount += 1;

    if (isCorrect) {
      next.correctCount += 1;
      next.combo += 1;
      if (next.combo > next.maxBattleCombo) {
        next.maxBattleCombo = next.combo;
      }
      const mult = calcComboMultiplier(next.combo);
      const charmFactor = hadCharm ? 2 : 1;
      const earnedExp = Math.round((18 + stageId * 3) * mult) * charmFactor;
      const earnedCoins = Math.round((10 + stageId * 2) * mult);
      const damage = calcDamageToMonster(next.combo, next.monsterMaxHp, next.totalQuestions) * charmFactor;
      next.monsterHp = Math.max(0, next.monsterHp - damage);
      next.earnedExp += earnedExp;
      next.earnedCoins += earnedCoins;
      return {
        battleState: next,
        damageDealt: damage,
        damageTaken: 0,
        earnedExp,
        earnedCoins,
        multiplier: mult,
        criticalCharm: hadCharm,
      };
    }

    next.combo = 0;
    const damageTaken = calcDamageToPlayer(stageId);
    next.playerHp = Math.max(0, next.playerHp - damageTaken);
    return {
      battleState: next,
      damageDealt: 0,
      damageTaken,
      earnedExp: 4,
      earnedCoins: 0,
      multiplier: 1.0,
      criticalCharm: false,
    };
  }

  function addExpAndCoins(playerState, gainedExp, gainedCoins) {
    const next = normalizeState(playerState);
    next.exp += Math.max(0, gainedExp);
    next.coins += Math.max(0, gainedCoins);
    let leveledUp = 0;

    while (next.exp >= expNeededForLevel(next.level)) {
      next.exp -= expNeededForLevel(next.level);
      next.level += 1;
      leveledUp += 1;
    }

    return { state: next, leveledUp };
  }

  function calcStars(correctCount, totalQuestions, remainingHp, maxHp) {
    if (totalQuestions <= 0) return 0;
    const accuracy = correctCount / totalQuestions;
    if (remainingHp <= 0 || accuracy < 0.6) return 0;
    if (accuracy >= 0.9 && remainingHp >= maxHp * 0.6) return 3;
    if (accuracy >= 0.8) return 2;
    return 1;
  }

  function recordStageClear(playerState, stageId, correctCount, totalQuestions, remainingHp, maxHp, maxBattleCombo, badgeId) {
    const next = normalizeState(playerState);
    const stars = calcStars(correctCount, totalQuestions, remainingHp, maxHp);
    const prevStars = next.stageStars[stageId] || 0;
    const prevBest = next.stageBestScores[stageId] || 0;

    if (stars > 0 && !next.clearedStages.includes(stageId)) {
      next.clearedStages.push(stageId);
    }
    if (stars > prevStars) {
      next.stageStars[stageId] = stars;
    }
    if (correctCount > prevBest) {
      next.stageBestScores[stageId] = correctCount;
    }
    if (maxBattleCombo > next.maxCombo) {
      next.maxCombo = maxBattleCombo;
    }
    if (stars > 0 && badgeId && !next.unlockedBadges.includes(badgeId)) {
      next.unlockedBadges.push(badgeId);
    }

    return { state: next, stars };
  }

  function updateQuestionTracking(playerState, questionId, isCorrect) {
    const next = normalizeState(playerState);
    next.totalAnswered += 1;
    if (isCorrect) {
      next.totalCorrect += 1;
      next.wrongQuestionIds = next.wrongQuestionIds.filter((id) => id !== questionId);
    } else if (!next.wrongQuestionIds.includes(questionId)) {
      next.wrongQuestionIds.push(questionId);
    }
    return next;
  }

  function recordQuestSolved(playerState, questId, bonusExp, bonusCoins) {
    const next = normalizeState(playerState);
    const isFirstSolve = !next.solvedQuests.includes(questId);
    if (isFirstSolve) {
      next.solvedQuests.push(questId);
      return addExpAndCoins(next, bonusExp, bonusCoins);
    }
    return { state: next, leveledUp: 0 };
  }

  function recordPuzzleSolved(playerState, puzzleId, bonusExp, bonusCoins) {
    const next = normalizeState(playerState);
    const isFirstSolve = !next.solvedPuzzles.includes(puzzleId);
    if (isFirstSolve) {
      next.solvedPuzzles.push(puzzleId);
      return addExpAndCoins(next, bonusExp, bonusCoins);
    }
    return { state: next, leveledUp: 0 };
  }

  function buyShopItem(playerState, itemId) {
    const next = normalizeState(playerState);
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) {
      return { ok: false, state: next, reason: '存在しないアイテムです。' };
    }
    if (next.coins < item.price) {
      return { ok: false, state: next, reason: `コインが不足しています（必要: ${item.price} G）。` };
    }
    next.coins -= item.price;
    next.inventory[itemId] = (next.inventory[itemId] || 0) + 1;
    return { ok: true, state: next, item };
  }

  function useBattleItem(playerState, battleState, itemId, options) {
    const nextState = normalizeState(playerState);
    const nextBattle = { ...battleState };
    const opts = options || {};

    if (!nextState.inventory[itemId] || nextState.inventory[itemId] <= 0) {
      return { ok: false, state: nextState, battleState: nextBattle, reason: '所持数が0です。ショップで購入してください。' };
    }

    if (itemId === 'potion') {
      if (nextBattle.playerHp >= nextBattle.playerMaxHp) {
        return { ok: false, state: nextState, battleState: nextBattle, reason: 'HPはすでに満タンです。' };
      }
      const before = nextBattle.playerHp;
      nextBattle.playerHp = Math.min(nextBattle.playerMaxHp, nextBattle.playerHp + 35);
      nextState.inventory.potion -= 1;
      return {
        ok: true,
        state: nextState,
        battleState: nextBattle,
        message: `🧪 回復ポーション使用！HPが ${nextBattle.playerHp - before} 回復した！`,
      };
    }

    if (itemId === 'scan50') {
      const existing = Array.isArray(nextBattle.eliminatedChoices) ? nextBattle.eliminatedChoices : [];
      if (existing.length > 0) {
        return { ok: false, state: nextState, battleState: nextBattle, reason: 'この問題ではすでに50/50スキャンを使用済みです。' };
      }
      const wrongKeys = ['A', 'B', 'C', 'D'].filter((k) => k !== opts.correctAnswer);
      if (wrongKeys.length < 2) {
        return { ok: false, state: nextState, battleState: nextBattle, reason: 'スキャンできる選択肢がありません。' };
      }
      const picked = wrongKeys.slice(0, 2);
      nextBattle.eliminatedChoices = picked;
      nextState.inventory.scan50 -= 1;
      return {
        ok: true,
        state: nextState,
        battleState: nextBattle,
        message: `🔍 50/50スキャン発動！不正解の選択肢（${picked.join(', ')}）を除外した！`,
      };
    }

    if (itemId === 'charm2x') {
      if (nextBattle.charmActive) {
        return { ok: false, state: nextState, battleState: nextBattle, reason: 'すでにクリティカルお守りが発動中です。' };
      }
      nextBattle.charmActive = true;
      nextState.inventory.charm2x -= 1;
      return {
        ok: true,
        state: nextState,
        battleState: nextBattle,
        message: '🧿 クリティカルお守り発動！この問題の正解時ダメージ＆EXPが2倍！',
      };
    }

    return { ok: false, state: nextState, battleState: nextBattle, reason: '不明なアイテムです。' };
  }

  function isStageUnlocked(playerState, stageId) {
    if (stageId <= 1) return true;
    return playerState.clearedStages.includes(stageId - 1);
  }

  function getTitleForLevel(level) {
    if (level >= 20) return 'Javaフルスタック勇者';
    if (level >= 15) return '伝説のMyKakeiboアーキテクト';
    if (level >= 10) return 'Webアプリ騎士団長';
    if (level >= 7) return 'オブジェクト指向の賢者';
    if (level >= 4) return 'Java冒険者';
    return 'Java見習い勇者';
  }

  function calcOverallProgress(playerState, totalStages, totalQuests, totalPuzzles) {
    const cleared = playerState.clearedStages.length;
    const solved = playerState.solvedQuests.length;
    const solvedPuzzles = Array.isArray(playerState.solvedPuzzles) ? playerState.solvedPuzzles.length : 0;
    const stars = Object.values(playerState.stageStars).reduce((sum, s) => sum + s, 0);
    const maxStars = totalStages * 3;
    const accuracy = playerState.totalAnswered > 0
      ? Math.round((playerState.totalCorrect / playerState.totalAnswered) * 100)
      : 0;
    return {
      cleared,
      totalStages,
      solved,
      totalQuests,
      solvedPuzzles,
      totalPuzzles: totalPuzzles || 0,
      stars,
      maxStars,
      accuracy,
    };
  }

  return {
    STORAGE_KEY,
    BASE_MAX_HP,
    SHOP_ITEMS,
    expNeededForLevel,
    createInitialState,
    normalizeState,
    calcMaxHp,
    calcComboMultiplier,
    calcDamageToMonster,
    calcDamageToPlayer,
    applyAnswerResult,
    addExpAndCoins,
    calcStars,
    recordStageClear,
    updateQuestionTracking,
    recordQuestSolved,
    recordPuzzleSolved,
    buyShopItem,
    useBattleItem,
    isStageUnlocked,
    getTitleForLevel,
    calcOverallProgress,
  };
});
