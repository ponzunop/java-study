<div style="background: linear-gradient(135deg, #b71c1c 0%, #e53935 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
  <div style="font-size: 0.9em; color: #ffebee; font-weight: bold;">Java実践カリキュラム ― 第13回 / 全14回</div>
  <h1 style="margin: 6px 0 10px 0; color: #ffffff; border: none;">🧪 第13回：JUnit単体テストとバグに強い例外・デバッグ技術</h1>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em; margin-right: 8px;">⏱ 目安時間：3.5〜4時間</span>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em;">📖 発展編：JUnit 5 / アサーション / スタックトレース読解 / 例外設計</span>
</div>

---

## 🎯 0. 今日のゴールと時間配分

機能が増えたアプリほど、「1箇所直したら別の機能が壊れた（デグレード）」という事故が起きやすくなります。毎回ブラウザを開いて手作業で確認するのは大変です。
第13回では、プロのJavaエンジニアが必ず書く **自動単体テスト（JUnit 5）**、正しいエラー設計（`IllegalArgumentException` 等）、そしてエラー発生時の **スタックトレースの読み方・ログ出力** を身につけ、壊れにくい「MyKakeibo」を育てます！

| 時間目安 | パート | 内容 |
| :--- | :--- | :--- |
| **0:00〜0:45** | <span style="color: #b71c1c; font-weight: bold;">Part 1：なぜ自動テスト（JUnit）を書くのか？</span> | 手動確認の限界と単体テスト（Unit Test）の仕組み |
| **0:45〜1:40** | <span style="color: #1565c0; font-weight: bold;">Part 2：JUnit 5 の基本（`@Test`, `assertEquals`, `assertThrows`）</span> | 期待値と実行結果を自動比較するテストコードの書き方 |
| **1:40〜2:25** | <span style="color: #e65100; font-weight: bold;">Part 3：スタックトレース読解と適切な例外設計</span> | エラーログのどこを見るか、`throw new IllegalArgumentException(...)` |
| **2:25〜3:20** | <span style="color: #2e7d32; font-weight: bold;">Part 4：実践演習（`KakeiboItemTest` と境界値テスト）</span> | 正常系・異常系（0円・マイナス・空文字）のテストケースを書く |
| **3:20〜3:50** | <span style="color: #6a1b9a; font-weight: bold;">Part 5：第13回 確認テスト（10問）</span> | テスト・例外・デバッグ技術を10問でチェック！ |

---

## 🧪 Part 1 & 2：JUnit 5 による単体テストの書き方

**単体テスト（Unit Test）** とは、クラスやメソッド単位で「入力に対して正しい出力が返るか」「不正な入力時に期待通り例外を投げるか」をプログラム自身に自動検証させる仕組みです。

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class KakeiboItemTest {

    @Test
    void testCalculateBalance() {
        // 準備 (Arrange)
        int income = 30000;
        int expense = 12500;

        // 実行 (Act)
        int balance = KakeiboCalculator.calcBalance(income, expense);

        // 検証 (Assert)：期待値 17500 と一致するか
        assertEquals(17500, balance);
    }

    @Test
    void testNegativePriceThrowsException() {
        // マイナス金額を渡したときに IllegalArgumentException が発生することを検証
        assertThrows(IllegalArgumentException.class, () -> {
            new KakeiboItem(1, "2026-10-17", "支出", "食費", "弁当", -500);
        });
    }
}
```

### よく使うJUnitアノテーション・アサーション

- `@Test`：このメソッドがテストケースであることを示すアノテーション
- `@BeforeEach`：各テストメソッドの実行前に毎回呼ばれる初期化メソッド（テスト用DAOの準備など）
- `assertEquals(期待値, 実際の値)`：値が一致することを確認
- `assertTrue(条件)` / `assertFalse(条件)`：真偽値を確認
- `assertThrows(例外.class, () -> ...)`：不正入力時に想定した例外が発生することを確認

---

## 🔍 Part 3：スタックトレースの読み方と例外スロー設計

エラーが起きたときにターミナルに出る長い赤文字（**スタックトレース**）は、バグの場所を教えてくれる宝の地図です！

```text
java.lang.NumberFormatException: For input string: "abc"
    at java.base/java.lang.NumberFormatException.forInputString(NumberFormatException.java:67)
    at java.base/java.lang.Integer.parseInt(Integer.java:668)
    at MyKakeiboAppServlet.doPost(MyKakeiboAppServlet.java:42)
```

1. **1行目を見る**：原因となった例外の種類とメッセージ（`NumberFormatException: For input string: "abc"`）
2. **自分の書いたクラス名を探す**：上から順に追い、最初に登場する自分のソースコードと行番号（`MyKakeiboAppServlet.java:42`）を開く！

### 不正な値を弾く防御的プログラミング（`throw`）

コンストラクタやセッターで不正値を受け取ったとき、黙って `0` にするのではなく **`IllegalArgumentException`** を投げる設計にすると、バグにすぐ気付けます。

```java
public void setPrice(int price) {
    if (price <= 0) {
        throw new IllegalArgumentException("金額は1円以上である必要があります: " + price);
    }
    this.price = price;
}
```

---

## 🛠️ Part 4：実践演習（自分の手で書いてみよう！）

### 🟢 【演習1】境界値テストを書こう（難易度：★☆☆）
`price` が `0`、`1`、`-1` の3パターンについて、`1` は成功し、`0` と `-1` は `IllegalArgumentException` になるテストケースを書きましょう（境界のちょうど前後をテストするのを**境界値テスト**と呼びます）。

### 🟡 【演習2】`KakeiboCalculator` の集計ロジックをテストしよう（難易度：★★☆）
収入2件・支出3件のリストを渡したときに、総収入・総支出・残高・空リスト（0件）のときの結果がすべて期待通りになるJUnitテストを作成しましょう。

### 🔴 【演習3】テスト用一時ファイル／DBを使った `KakeiboDAO` のCRUDテスト（難易度：★★★）
`@BeforeEach` でテスト用の一時DB（または一時CSV）を初期化し、`insert` → `findAll` → `update` → `deleteById` の一連の流れが正しく動くことを自動テストで保証しましょう。

---

## 📝 Part 5：第13回 確認テスト（全10問）

**第1問（単体テストの目的）**
JUnitなどを使って自動化された「単体テスト（Unit Test）」を書く最大のメリットは何ですか？
- **A.** コードを修正・機能追加したあとも、既存のロジックが壊れていないかを1コマンドで瞬時に確認できる
- **B.** HTMLの見た目が自動で綺麗になる
- **C.** データベースが不要になる
- **D.** Javaファイルが自動的にPythonへ変換される

**第2問（JUnitのテストメソッド指定）**
JUnit 5 で「このメソッドをテストケースとして実行してほしい」と目印を付けるアノテーションはどれですか？
- **A.** `@Run` ／ **B.** `@Test` ／ **C.** `@Check` ／ **D.** `@Assert`

**第3問（assertEqualsの引数順）**
JUnit の `assertEquals(a, b)` では、一般的に第1引数 `a` と第2引数 `b` にそれぞれ何を渡しますか？
- **A.** 第1引数：実際の結果（actual）／ 第2引数：期待値（expected）
- **B.** 第1引数：期待値（expected）／ 第2引数：実際の結果（actual）
- **C.** どちらもテストの名前を渡す
- **D.** どちらも `null` を渡す

**第4問（例外発生のテスト）**
「金額に `-100` を渡したら `IllegalArgumentException` が発生するはずだ」という異常系テストを書くときに使うアサーションはどれですか？
- **A.** `assertThrows(IllegalArgumentException.class, () -> ...)`
- **B.** `assertNull(...)`
- **C.** `try { ... } catch (Exception e) {}` だけで何もしない
- **D.** `System.exit(1)`

**第5問（スタックトレースの読み方）**
コンソールに数十行のスタックトレース（エラーログ）が出力されたとき、自分のコードのどこに原因があるか特定する最も効率的な見方はどれですか？
- **A.** 一番下の行だけを読む
- **B.** 1行目の「例外の種類とメッセージ」を確認し、続いて `at ...` の中から自分が作成したクラス名・行番号を探す
- **C.** エラーが出たらPCを再起動する
- **D.** ランダムにコードを削除してみる

**第6問（境界値テストの考え方）**
「金額は `1` 円以上を受け付け、`0` 円以下はエラーとする」という仕様をテストするとき、境界値テストとして最も重要な入力値の組み合わせはどれですか？
- **A.** `-1000` と `100000` だけ
- **B.** `0`（エラーになる最大の値）と `1`（正常になる最小の値）
- **C.** `"あいうえお"` だけ
- **D.** `500` だけ

**第7問（IllegalArgumentExceptionの役割）**
メソッドの引数に「ありえない不正な値（マイナス金額や空文字など）」が渡されたときに投げるのが適切なJava標準例外はどれですか？
- **A.** `IllegalArgumentException`
- **B.** `FileNotFoundException`
- **C.** `OutOfMemoryError`
- **D.** `ArithmeticException`

**第8問（@BeforeEachの役割）**
テストクラス内で `@BeforeEach` を付けたメソッドは、いつ実行されますか？
- **A.** クラス内のすべてのテストが終わったあとに1回だけ
- **B.** 各 `@Test` メソッドが実行される直前に毎回実行される（テスト同士が互いに影響しないよう初期化する）
- **C.** テストが失敗したときだけ実行される
- **D.** 手動で呼び出さない限り実行されない

**第9問（AAAパターン）**
読みやすいテストコードを書く基本構成「AAAパターン」の3つのステップの正しい並びはどれですか？
- **A.** Arrange（準備） → Act（実行） → Assert（検証）
- **B.** Add → Alter → Abort
- **C.** Ask → Answer → Archive
- **D.** Array → Attribute → Action

**第10問（テストとリファクタリング）**
テストコードが揃っている状態で、外部から見た動作を変えずにコード内部の読みやすさや構造を整理・改善する作業を何と呼びますか？
- **A.** リファクタリング（Refactoring）
- **B.** デプロイ（Deploy）
- **C.** シリアライズ（Serialize）
- **D.** コンパイルエラー（Compile Error）

<details>
<summary>✅ 確認テスト（全10問）の解答と解説を見る</summary>

| 問題 | 正解 | 解説 |
| :---: | :---: | :--- |
| **第1問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 自動テスト（回帰テスト）があることで、安心して機能追加やコード改善ができます。 |
| **第2問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | JUnitではテスト対象メソッドに `@Test` アノテーションを付けます。 |
| **第3問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | JUnitの `assertEquals(expected, actual)` は「期待値, 実際の値」の順で渡します。失敗時のメッセージも分かりやすくなります。 |
| **第4問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `assertThrows` を使うと、指定した例外が投げられなければテスト失敗（FAIL）として検出できます。 |
| **第5問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | 1行目の例外名＋原因メッセージと、`at 自分のクラス名(ファイル名:行番号)` を確認するのが鉄則です。 |
| **第6問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | バグは「`>` と `>=` の間違い」など境界付近に潜みやすいため、`0` と `1` のテストが不可欠です。 |
| **第7問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 不正な引数（Illegal Argument）を知らせる標準例外が `IllegalArgumentException` です。 |
| **第8問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | テスト間の独立性を保つため、`@BeforeEach` で毎回クリーンな状態を用意します。 |
| **第9問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | Arrange（準備）→ Act（実行）→ Assert（検証）で書くと誰が見ても意図が明確になります。 |
| **第10問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 自動テストを安全網にして内部設計を綺麗に保つ作業をリファクタリングと呼びます。 |

</details>

---
<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <a href="./lesson12.md">👈 第12回へ戻る</a>
  <a href="./README.md">🏠 カリキュラム目次</a>
  <a href="./lesson14.md" style="font-weight: bold; color: #b71c1c;">👉 第14回（最終回）：MavenとSpring Boot入門・総まとめへ進む</a>
</div>
