import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Engine = require('../engine.js');
const STAGES = require('../data/stages.js');

test('stages data contains all 10 lessons, 100 quiz questions, and 20 coding quests', () => {
  assert.equal(STAGES.length, 10);

  let totalQuestions = 0;
  let totalQuests = 0;
  const questionIds = new Set();
  const questIds = new Set();

  for (let i = 0; i < STAGES.length; i += 1) {
    const stage = STAGES[i];
    assert.equal(stage.id, i + 1);
    assert.ok(stage.title.length > 0);
    assert.ok(stage.monster && stage.monster.name);
    assert.ok(stage.badge && stage.badge.id);
    assert.ok(Array.isArray(stage.tips) && stage.tips.length >= 3);
    assert.equal(stage.questions.length, 10);
    assert.equal(stage.codingQuests.length, 2);

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

  assert.equal(totalQuestions, 100);
  assert.equal(totalQuests, 20);
});

test('applyAnswerResult updates combo, HP, and EXP accurately', () => {
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

  const missRes = Engine.applyAnswerResult(battle, false, 1);
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
  state = Engine.updateQuestionTracking(state, 'L01_Q02', false);
  assert.deepEqual(state.wrongQuestionIds, ['L01_Q02']);
  assert.equal(state.totalAnswered, 1);
  assert.equal(state.totalCorrect, 0);

  state = Engine.updateQuestionTracking(state, 'L01_Q02', true);
  assert.deepEqual(state.wrongQuestionIds, []);
  assert.equal(state.totalAnswered, 2);
  assert.equal(state.totalCorrect, 1);
});

test('recordQuestSolved grants first-time bonus only once', () => {
  let state = Engine.createInitialState();
  const r1 = Engine.recordQuestSolved(state, 'q_01_1', 35, 25);
  state = r1.state;
  assert.equal(state.coins, 25);
  assert.deepEqual(state.solvedQuests, ['q_01_1']);

  const r2 = Engine.recordQuestSolved(state, 'q_01_1', 35, 25);
  assert.equal(r2.state.coins, 25);
});
