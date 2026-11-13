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
      wrongQuestionIds: [],
      unlockedBadges: [],
      soundEnabled: true,
    };
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
      wrongQuestionIds: Array.isArray(raw.wrongQuestionIds) ? [...new Set(raw.wrongQuestionIds)] : [],
      unlockedBadges: Array.isArray(raw.unlockedBadges) ? [...new Set(raw.unlockedBadges)] : [],
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
    return 16 + Math.min(10, Math.floor((stageId - 1) / 2) * 2);
  }

  function applyAnswerResult(battleState, isCorrect, stageId) {
    const next = { ...battleState };
    next.answeredCount += 1;

    if (isCorrect) {
      next.correctCount += 1;
      next.combo += 1;
      if (next.combo > next.maxBattleCombo) {
        next.maxBattleCombo = next.combo;
      }
      const mult = calcComboMultiplier(next.combo);
      const earnedExp = Math.round((18 + stageId * 3) * mult);
      const earnedCoins = Math.round((10 + stageId * 2) * mult);
      const damage = calcDamageToMonster(next.combo, next.monsterMaxHp, next.totalQuestions);
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

  function isStageUnlocked(playerState, stageId) {
    if (stageId <= 1) return true;
    return playerState.clearedStages.includes(stageId - 1);
  }

  function getTitleForLevel(level) {
    if (level >= 15) return '伝説のMyKakeiboアーキテクト';
    if (level >= 10) return 'Webアプリ騎士団長';
    if (level >= 7) return 'オブジェクト指向の賢者';
    if (level >= 4) return 'Java冒険者';
    return 'Java見習い勇者';
  }

  function calcOverallProgress(playerState, totalStages, totalQuests) {
    const cleared = playerState.clearedStages.length;
    const solved = playerState.solvedQuests.length;
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
      stars,
      maxStars,
      accuracy,
    };
  }

  return {
    STORAGE_KEY,
    BASE_MAX_HP,
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
    isStageUnlocked,
    getTitleForLevel,
    calcOverallProgress,
  };
});
