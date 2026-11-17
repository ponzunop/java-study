import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const Engine = require('../engine.js');
const STAGES = require('../data/stages.js');
const Glossary = require('../data/glossary.js');
const Markdown = require('../markdown.js');

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

test('markdown renderer converts README.md and all 14 lesson files without raw markdown headings or fences', () => {
  const rootDir = path.resolve(__dirname, '../..');
  const files = ['README.md'];
  for (let i = 1; i <= 14; i += 1) {
    files.push(`lesson${String(i).padStart(2, '0')}.md`);
  }

  for (const file of files) {
    const raw = fs.readFileSync(path.join(rootDir, file), 'utf8');
    const html = Markdown.renderMarkdown(raw);
    assert.ok(html.length > 500, `${file} rendered output too short`);
    assert.ok(!/<p class="lecture-p">#{1,4}\s/.test(html), `Raw heading found in ${file}`);
    assert.ok(!/<p class="lecture-p">```/.test(html), `Raw code fence found in ${file}`);
    assert.ok(!/<p class="lecture-p">\|.*\|/.test(html), `Raw table pipe found in ${file}`);
    assert.ok(html.includes('<pre class="lecture-code">'), `Expected code block in ${file}`);
  }
});

test('markdown renderer handles details blocks containing code fences and tables', () => {
  const sample = [
    '<details>',
    '<summary>解答を見る</summary>',
    '',
    '```java',
    'int x = 10;',
    '```',
    '',
    '| A | B |',
    '| :--- | :--- |',
    '| 1 | 2 |',
    '</details>',
  ].join('\n');

  const html = Markdown.renderMarkdown(sample);
  assert.ok(html.includes('<details class="lecture-details">'));
  assert.ok(html.includes('<summary>解答を見る</summary>'));
  assert.ok(html.includes('<pre class="lecture-code"><code>int x = 10;</code></pre>'));
  assert.ok(html.includes('<table class="lecture-table">'));
});

test('glossary contains compile and core terms, matches text, and safely annotates HTML without breaking tags', () => {
  const compileTerm = Glossary.getTermById('compile');
  assert.ok(compileTerm);
  assert.equal(compileTerm.term, 'コンパイル');
  assert.ok(compileTerm.short.includes('翻訳'));

  const ids = new Set();
  for (const term of Glossary.TERMS) {
    assert.ok(term.id && term.term && term.short && term.detail);
    assert.ok(!ids.has(term.id), `Duplicate glossary id: ${term.id}`);
    ids.add(term.id);
  }

  const matched = Glossary.findTermsInText('javac でソースコードをコンパイルしてクラスを作る');
  assert.ok(matched.some((t) => t.id === 'compile'));
  assert.ok(matched.some((t) => t.id === 'class'));

  const inputHtml = '<p>まずコンパイルします。</p><pre class="code-block"><code>javac コンパイル</code></pre>';
  const annotated = Glossary.annotateHtmlWithGlossary(inputHtml);
  assert.ok(annotated.includes('data-glossary-id="compile"'));
  assert.ok(annotated.includes('<pre class="code-block"><code>javac コンパイル</code></pre>'));
});
