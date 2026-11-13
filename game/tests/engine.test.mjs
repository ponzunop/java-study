import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Engine = require('../engine.js');
const STAGES = require('../data/stages.js');

test('stages data contains all 14 lessons, 140 quiz questions, 28 coding quests, and 14 code puzzles', () => {
  assert.equal(STAGES.length, 14);

  let totalQuestions = 0;
  let totalQuests = 0;
  let totalPuzzles = 0;
  const questionIds = new Set();
  const questIds = new Set();
  const puzzleIds = new Set();

  for (let i = 0; i < STAGES.length; i += 1) {
    const stage = STAGES[i];
    assert.equal(stage.id, i + 1);
    assert.ok(stage.title.length > 0);
    assert.ok(stage.monster && stage.monster.name);
    assert.ok(stage.badge && stage.badge.id);
    assert.ok(Array.isArray(stage.tips) && stage.tips.length >= 3);
    assert.equal(stage.questions.length, 10);
    assert.equal(stage.codingQuests.length, 2);
    assert.ok(stage.codePuzzle && Array.isArray(stage.codePuzzle.steps) && stage.codePuzzle.steps.length >= 3);
    assert.ok(!puzzleIds.has(stage.codePuzzle.id), `Duplicate puzzle id: ${stage.codePuzzle.id}`);
    puzzleIds.add(stage.codePuzzle.id);
    totalPuzzles += 1;

    for (const q of stage.questions) {
      totalQuestions += 1;
      assert.ok(!questionIds.has(q.id), `Duplicate question id: ${q.id}`);
      questionIds.add(q.id);
      assert.ok(q.prompt.length > 0);
      assert.deepEqual(Object.keys(q.choices).sort(), ['A', 'B', 'C', 'D']);
      for (const k of ['A', 'B', 'C', 'D']) {
        assert.ok(q.choices[k].length > 0, `Empty choice ${k} in ${q.id}`);
      }
      assert.ok(['A', 'B', 'C', 'D'].includes(q.answer), `Invalid answer in ${q.id}`);
      assert.ok(q.explanation.length > 0, `Empty explanation in ${q.id}`);
    }

    for (const cq of stage.codingQuests) {
      totalQuests += 1;
      assert.ok(!questIds.has(cq.id), `Duplicate quest id: ${cq.id}`);
      questIds.add(cq.id);
      assert.ok(cq.blanks.length >= 1);
      for (const b of cq.blanks) {
        assert.ok(b.options.includes(b.answer), `Answer missing from options in ${cq.id}`);
      }
    }
  }

  assert.equal(totalQuestions, 140);
  assert.equal(totalQuests, 28);
  assert.equal(totalPuzzles, 14);
});

test('applyAnswerResult updates combo, HP, EXP, and charmActive 2x bonus accurately', () => {
  let battle = {
    playerHp: 100,
    playerMaxHp: 100,
    monsterHp: 100,
    monsterMaxHp: 100,
    answeredCount: 0,
    correctCount: 0,
    combo: 0,
    maxBattleCombo: 0,
    earnedExp: 0,
    earnedCoins: 0,
    totalQuestions: 10,
    charmActive: false,
    eliminatedChoices: [],
  };

  for (let i = 0; i < 3; i += 1) {
    const res = Engine.applyAnswerResult(battle, true, 1);
    battle = res.battleState;
    assert.ok(res.damageDealt > 0);
    assert.equal(res.damageTaken, 0);
  }
  assert.equal(battle.combo, 3);
  assert.equal(battle.maxBattleCombo, 3);
  assert.ok(battle.monsterHp < 100);

  // Test charm2x doubling
  const charmedBattle = { ...battle, charmActive: true };
  const charmedRes = Engine.applyAnswerResult(charmedBattle, true, 1);
  assert.equal(charmedRes.criticalCharm, true);
  assert.equal(charmedRes.battleState.charmActive, false);

  const missRes = Engine.applyAnswerResult(charmedRes.battleState, false, 1);
  assert.equal(missRes.battleState.combo, 0);
  assert.ok(missRes.damageTaken > 0);
  assert.ok(missRes.battleState.playerHp < 100);
});

test('addExpAndCoins handles multi-level ups and recordStageClear awards stars and badges', () => {
  let state = Engine.createInitialState();
  const res = Engine.addExpAndCoins(state, 250, 50);
  state = res.state;
  assert.ok(res.leveledUp >= 2);
  assert.equal(state.coins, 50);

  const clearRes = Engine.recordStageClear(state, 1, 9, 10, 80, 100, 6, 'badge_01');
  state = clearRes.state;
  assert.equal(clearRes.stars, 3);
  assert.ok(state.clearedStages.includes(1));
  assert.ok(state.unlockedBadges.includes('badge_01'));
  assert.equal(Engine.isStageUnlocked(state, 2), true);
  assert.equal(Engine.isStageUnlocked(state, 3), false);
});

test('updateQuestionTracking records and clears wrong questions', () => {
  let state = Engine.createInitialState();
  state = Engine.updateQuestionTracking(state, 'L11_Q02', false);
  assert.deepEqual(state.wrongQuestionIds, ['L11_Q02']);
  assert.equal(state.totalAnswered, 1);
  assert.equal(state.totalCorrect, 0);

  state = Engine.updateQuestionTracking(state, 'L11_Q02', true);
  assert.deepEqual(state.wrongQuestionIds, []);
  assert.equal(state.totalAnswered, 2);
  assert.equal(state.totalCorrect, 1);
});

test('recordQuestSolved and recordPuzzleSolved grant first-time bonus only once', () => {
  let state = Engine.createInitialState();
  const r1 = Engine.recordQuestSolved(state, 'q_11_1', 35, 25);
  state = r1.state;
  assert.equal(state.coins, 25);
  assert.deepEqual(state.solvedQuests, ['q_11_1']);

  const r2 = Engine.recordQuestSolved(state, 'q_11_1', 35, 25);
  assert.equal(r2.state.coins, 25);

  const p1 = Engine.recordPuzzleSolved(state, 'p_14', 40, 30);
  state = p1.state;
  assert.equal(state.coins, 55);
  assert.deepEqual(state.solvedPuzzles, ['p_14']);

  const p2 = Engine.recordPuzzleSolved(state, 'p_14', 40, 30);
  assert.equal(p2.state.coins, 55);
});

test('shop and battle items work with coin checks and inventory consumption', () => {
  let state = Engine.createInitialState();
  // Initial inventory has 1 potion, 1 scan50, 0 charm2x, 0 coins
  const failBuy = Engine.buyShopItem(state, 'charm2x');
  assert.equal(failBuy.ok, false);

  state = Engine.addExpAndCoins(state, 0, 100).state;
  const buyRes = Engine.buyShopItem(state, 'charm2x');
  assert.equal(buyRes.ok, true);
  state = buyRes.state;
  assert.equal(state.coins, 20);
  assert.equal(state.inventory.charm2x, 1);

  let battle = {
    playerHp: 60,
    playerMaxHp: 100,
    eliminatedChoices: [],
    charmActive: false,
  };

  // Potion heals HP
  const healRes = Engine.useBattleItem(state, battle, 'potion');
  assert.equal(healRes.ok, true);
  state = healRes.state;
  battle = healRes.battleState;
  assert.equal(battle.playerHp, 95);
  assert.equal(state.inventory.potion, 0);

  // Scan50 eliminates 2 wrong options
  const scanRes = Engine.useBattleItem(state, battle, 'scan50', { correctAnswer: 'C' });
  assert.equal(scanRes.ok, true);
  state = scanRes.state;
  battle = scanRes.battleState;
  assert.equal(battle.eliminatedChoices.length, 2);
  assert.ok(!battle.eliminatedChoices.includes('C'));

  // Charm2x activates multiplier
  const charmRes = Engine.useBattleItem(state, battle, 'charm2x');
  assert.equal(charmRes.ok, true);
  assert.equal(charmRes.battleState.charmActive, true);
  assert.equal(charmRes.state.inventory.charm2x, 0);
});

test('normalizeState preserves backward compatibility with old v1 saves', () => {
  const legacySave = {
    level: 5,
    coins: 120,
    clearedStages: [1, 2, 2],
    solvedQuests: ['q_01_1'],
  };
  const norm = Engine.normalizeState(legacySave);
  assert.equal(norm.level, 5);
  assert.equal(norm.coins, 120);
  assert.deepEqual(norm.clearedStages, [1, 2]);
  assert.deepEqual(norm.solvedPuzzles, []);
  assert.deepEqual(norm.inventory, { potion: 1, scan50: 1, charm2x: 0 });
});
