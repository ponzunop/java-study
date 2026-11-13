<div style="background: linear-gradient(135deg, #4527a0 0%, #7e57c2 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
  <div style="font-size: 0.9em; color: #ede7f6; font-weight: bold;">Java実践カリキュラム ― 第12回 / 全14回</div>
  <h1 style="margin: 6px 0 10px 0; color: #ffffff; border: none;">📡 第12回：HashMap・Stream APIとJSON REST API入門</h1>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em; margin-right: 8px;">⏱ 目安時間：3.5〜4時間</span>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em;">📖 発展編：HashMap / ラムダ式 / Stream API / JSON API &amp; fetch()</span>
</div>

---

## 🎯 0. 今日のゴールと時間配分

これまでのカリキュラムでは `ArrayList` だけを使ってきましたが、Java実務では「費目名ごとに合計金額をまとめる」ときに **`HashMap<String, Integer>`** を、「リストから条件抽出・集計する」ときに **Stream API とラムダ式** を頻繁に使います。さらに現代のWebアプリでは、サーバーはHTMLではなく **JSONデータ** を返し、ブラウザ側の JavaScript (`fetch`) で画面を書き換える **REST API方式** が主流です。
第12回では、費目別集計と明細の編集(UPDATE)、そしてJSONを返すAPIサーブレットを実装します！

| 時間目安 | パート | 内容 |
| :--- | :--- | :--- |
| **0:00〜0:45** | <span style="color: #4527a0; font-weight: bold;">Part 1：`HashMap` と `HashSet` の活用</span> | キーと値のペアで費目別集計を1発で計算する |
| **0:45〜1:40** | <span style="color: #1565c0; font-weight: bold;">Part 2：ラムダ式と Stream API 入門</span> | `stream().filter(...).mapToInt(...).sum()` でスマートな集計 |
| **1:40〜2:30** | <span style="color: #c62828; font-weight: bold;">Part 3：JSON APIサーブレットと `fetch()` 連携</span> | `application/json` レスポンスと非同期通信、編集(UPDATE)導線 |
| **2:30〜3:20** | <span style="color: #2e7d32; font-weight: bold;">Part 4：実践演習（費目別レポート＆JSON API）</span> | 費目別合計APIと編集フォームを実装しよう |
| **3:20〜3:50** | <span style="color: #6a1b9a; font-weight: bold;">Part 5：第12回 確認テスト（10問）</span> | Map・Stream・JSON APIの知識を10問でチェック！ |

---

## 🗺️ Part 1：`HashMap<K, V>` で費目別の合計金額を集計しよう

`ArrayList` が「番号（0, 1, 2…）で管理するロッカー」なら、**`HashMap<キー型, 値型>`** は「名前（`"食費"`, `"交通費"`…）をラベルにして値を出し入れする辞書」です！

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> categoryTotals = new HashMap<>();

for (KakeiboItem item : items) {
    if ("支出".equals(item.getType())) {
        String cat = item.getCategory();
        int current = categoryTotals.getOrDefault(cat, 0);
        categoryTotals.put(cat, current + item.getPrice());
    }
}

for (Map.Entry<String, Integer> entry : categoryTotals.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue() + "円");
}
```

- `put(key, value)`：キーと値を登録（既存キーなら上書き）
- `getOrDefault(key, 0)`：キーが未登録なら `0` を返し、`NullPointerException` を防ぐ超便利メソッド！
- `containsKey(key)`：そのキーが登録済みか調べる

---

## ⚡ Part 2：ラムダ式と Stream API でスマートに集計する

Java 8 以降で標準となった **Stream API** を使うと、`for` 文や `if` 文を何行も書かずにデータの抽出・変換・集計ができます。

```java
// 例1：「支出」のみの合計金額を1文で算出
int totalExpense = items.stream()
    .filter(item -> "支出".equals(item.getType()))
    .mapToInt(item -> item.getPrice())
    .sum();

// 例2：5000円以上の高額支出だけをリストに抽出
List<KakeiboItem> highItems = items.stream()
    .filter(item -> item.getPrice() >= 5000)
    .collect(Collectors.toList());
```

- `item -> ...` の形を **ラムダ式（Lambda Expression）** と呼びます（「要素 `item` を受け取って右辺の式を評価する短い関数」という意味）。
- `filter(...)`：条件に合う要素だけを通す
- `mapToInt(...)`：各オブジェクトから `int` 値を取り出す
- `sum()` / `count()` / `collect(...)`：終端操作（結果にまとめる）

---

## 🌐 Part 3：JSON API サーブレットと編集（UPDATE）機能

JSPでHTML全体を返す方法に加え、**JSON（JavaScript Object Notation）** を返すAPIを作ると、ページ全体を再読み込みせずに一覧や集計グラフを更新できます。

```java
@WebServlet("/api/summary")
public class SummaryApiServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("application/json; charset=UTF-8");

        // DAOから取得して費目別合計を集計
        KakeiboDAO dao = new KakeiboDAO();
        ArrayList<KakeiboItem> items = dao.findAll();

        int income = items.stream()
                .filter(i -> "収入".equals(i.getType()))
                .mapToInt(KakeiboItem::getPrice)
                .sum();
        int expense = items.stream()
                .filter(i -> "支出".equals(i.getType()))
                .mapToInt(KakeiboItem::getPrice)
                .sum();

        PrintWriter out = res.getWriter();
        out.printf("{\"income\": %d, \"expense\": %d, \"balance\": %d}%n",
                   income, expense, income - expense);
    }
}
```

### ブラウザ側（JavaScript `fetch()`）からの呼び出し

```javascript
async function refreshSummary() {
  const response = await fetch("api/summary");
  const data = await response.json();
  document.getElementById("balance-view").textContent = data.balance.toLocaleString() + " 円";
}
```

---

## 🛠️ Part 4：実践演習（自分の手で書いてみよう！）

### 🟢 【演習1】`HashMap` で費目別の件数をカウントしよう（難易度：★☆☆）
`Map<String, Integer> countByCategory = new HashMap<>();` を用意し、`getOrDefault(cat, 0) + 1` を使って費目ごとの登録件数を集計しましょう。

### 🟡 【演習2】Stream API で「食費」の平均支出額を求めよう（難易度：★★☆）
`items.stream().filter(...).mapToInt(...).average().orElse(0.0)` を使って、食費1件あたりの平均金額を算出しましょう。

### 🔴 【演習3】既存の明細を編集する `EditServlet`（UPDATE処理）（難易度：★★★）
一覧画面の各行に「編集」リンク（`edit?id=...`）を置き、フォームから変更後の品名・金額を `POST` 送信して `dao.update(...)` で更新し、PRGパターンで一覧へリダイレクトする流れを実装しましょう。

---

## 📝 Part 5：第12回 確認テスト（全10問）

**第1問（HashMapの特徴）**
`ArrayList` と比較したときの `HashMap<String, Integer>` の特徴として最も適切なものはどれですか？
- **A.** 「`"食費"` → `1500`」のように「キー（名前）」と「値」のペアでデータを管理し、キーを指定して高速に取り出せる
- **B.** 数値の添字 `[0]` でしかアクセスできない
- **C.** 同じキーで何度も値を保存すると値が自動的に足し算される
- **D.** HTMLファイルの中でしか使えない

**第2問（getOrDefaultの役割）**
`int cur = map.getOrDefault("食費", 0);` を実行したとき、マップに `"食費"` というキーがまだ存在しない場合、`cur` には何が入りますか？
- **A.** `null`（NullPointerExceptionになる） ／ **B.** `0` ／ **C.** `-1` ／ **D.** エラーで止まる

**第3問（HashSetの特徴）**
登録されている費目名の一覧から「重複を除いた一意な費目リスト」を作りたいとき、重複を自動的に排除してくれるコレクションはどれですか？
- **A.** `ArrayList<String>` ／ **B.** `HashSet<String>` ／ **C.** `int[]` ／ **D.** `Scanner`

**第4問（Stream APIのfilter）**
`items.stream().filter(i -> i.getPrice() >= 1000)` の `filter` が行っている処理はどれですか？
- **A.** 金額をすべて1000に変更する
- **B.** 金額が1000以上の要素だけを抽出して次の処理へ流す
- **C.** リストを逆順に並べ替える
- **D.** リストから要素を完全に削除して空にする

**第5問（メソッド参照とラムダ式）**
`item -> item.getPrice()` と同じ意味になるJavaの「メソッド参照」の書き方はどれですか？
- **A.** `KakeiboItem::getPrice`
- **B.** `KakeiboItem->getPrice`
- **C.** `KakeiboItem.getPrice()`
- **D.** `@KakeiboItem.getPrice`

**第6問（JSONの基本形式）**
REST API でよく使われる JSON 形式として**正しい構文**はどれですか？
- **A.** `{'income': 5000, 'expense': 1200}`（シングルクォート）
- **B.** `{"income": 5000, "expense": 1200}`（キーと文字列をダブルクォートで囲む）
- **C.** `<income>5000</income>`
- **D.** `income=5000; expense=1200;`

**第7問（Content-Typeの設定）**
ServletからHTMLではなくJSONデータを返すとき、`res.setContentType(...)` に指定する正しいMIMEタイプはどれですか？
- **A.** `"text/html; charset=UTF-8"`
- **B.** `"application/json; charset=UTF-8"`
- **C.** `"text/csv; charset=UTF-8"`
- **D.** `"image/png"`

**第8問（ブラウザ側のfetch API）**
JavaScript の `fetch("api/summary")` を使ってサーバーと非同期通信する最大のメリットは何ですか？
- **A.** ページ全体を再読み込み（画面遷移）せずに、画面の一部のデータやグラフだけを滑らかに更新できる
- **B.** Javaサーバーを起動しなくてもデータベースが動くようになる
- **C.** SQLインジェクションが自動で見つかる
- **D.** CSSファイルが不要になる

**第9問（Optional と orElse）**
`items.stream().mapToInt(KakeiboItem::getPrice).average().orElse(0.0)` で最後の `.orElse(0.0)` を付ける理由は何ですか？
- **A.** リストが0件だった場合に「値なし」でエラーになるのを防ぎ、既定値 `0.0` を受け取るため
- **B.** 平均値を必ず0にするため
- **C.** 整数に変換するため
- **D.** 例外を強制発生させるため

**第10問（RESTfulなHTTPメソッド）**
Web APIの設計において、データの「取得」「新規作成」「更新」「削除」にそれぞれ対応するHTTPメソッドの組み合わせとして一般的なものはどれですか？
- **A.** 取得：`GET` ／ 新規作成：`POST` ／ 更新：`PUT`（または`PATCH`） ／ 削除：`DELETE`
- **B.** すべて `GET` だけを使う
- **C.** 取得：`DELETE` ／ 削除：`GET`
- **D.** 更新：`PRINT` ／ 作成：`CLASS`

<details>
<summary>✅ 確認テスト（全10問）の解答と解説を見る</summary>

| 問題 | 正解 | 解説 |
| :---: | :---: | :--- |
| **第1問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `HashMap` はキーと値（Key-Value）の対応でデータを管理し、費目別の集計などで大活躍します。 |
| **第2問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `getOrDefault(key, defaultValue)` はキーが存在しない場合に第2引数の既定値（ここでは `0`）を返します。 |
| **第3問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `Set`（`HashSet`）は要素の重複を許さないコレクションです。 |
| **第4問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `filter` は条件式が `true` になる要素だけを通過させ、元のリスト自体は破壊しません。 |
| **第5問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `クラス名::メソッド名` と書くことで、簡潔なメソッド参照が書けます。 |
| **第6問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | JSON仕様ではキー名も文字列値も必ずダブルクォート `"` で囲みます。 |
| **第7問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | JSONレスポンスには `application/json; charset=UTF-8` を指定します。 |
| **第8問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `fetch()` による非同期通信（SPA/Ajax的更新）により、ページ再読み込みなしの快適なUIが作れます。 |
| **第9問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `average()` は結果が空かもしれないため `OptionalDouble` を返します。`.orElse(0.0)` で安全に取り出せます。 |
| **第10問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | HTTPメソッドの意味（GET/POST/PUT/DELETE）をCRUD操作に対応させるのがREST APIの基本設計です。 |

</details>

---
<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <a href="./lesson11.md">👈 第11回へ戻る</a>
  <a href="./README.md">🏠 カリキュラム目次</a>
  <a href="./lesson13.md" style="font-weight: bold; color: #4527a0;">👉 第13回：JUnit単体テスト・デバッグ技術へ進む</a>
</div>
