<div style="background: linear-gradient(135deg, #283593 0%, #5c6bc0 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
  <div style="font-size: 0.9em; color: #e8eaf6; font-weight: bold;">Java実践カリキュラム ― 第7回 / 全10回</div>
  <h1 style="margin: 6px 0 10px 0; color: #ffffff; border: none;">📨 第7回：JSPとフォーム送信！ブラウザから家計簿データを送る</h1>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em; margin-right: 8px;">⏱ 目安時間：3.5〜4時間</span>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em;">📖 『やさしいJava』対応：Lesson 10（文字列変換）・Web応用編</span>
</div>

---

## 🎯 0. 今日のゴールと時間配分

第6回でServletを作ってブラウザに表を出しましたが、`out.println("<tr><td>...");` と何十行もJavaの中にHTMLを書くのは少し大変でしたよね。
そこで登場するのが、**HTMLの中に直接Javaのコードや変数を埋め込める「JSP（JavaServer Pages）」**です！
さらに第7回では、ブラウザの入力フォーム（テキストボックスやセレクトボックス）から**「日付・費目・品名・金額」をサーバーへ送信し、Servletで受け取って計算する仕組み**をマスターします！

| 時間目安 | パート | 内容 |
| :--- | :--- | :--- |
| **0:00〜0:45** | <span style="color: #283593; font-weight: bold;">Part 1：JSP（JavaServer Pages）の基本</span> | `out.println` 地獄からの解放！HTMLの中にJavaを書く `<% %>` と `<%= %>` |
| **0:45〜1:35** | <span style="color: #1565c0; font-weight: bold;">Part 2：HTMLフォームとGET / POST送信</span> | `<form>` タグ、`name` 属性、`GET` と `POST` の使い分け |
| **1:35〜2:20** | <span style="color: #2e7d32; font-weight: bold;">Part 3：`request.getParameter` で値を受け取る</span> | ブラウザから届いた文字列を受け取り、`Integer.parseInt` で計算する |
| **2:20〜3:20** | <span style="color: #6a1b9a; font-weight: bold;">Part 4：実践演習（家計簿の入力フォーム＆登録確認）</span> | 3つの演習課題で「ブラウザから家計簿データを入力・送信する画面」を作る |
| **3:20〜3:50** | <span style="color: #c62828; font-weight: bold;">Part 5：第7回 確認テスト（10問）</span> | JSPとフォーム送信・パラメータ取得の知識を10問でチェック！ |

---

## 📄 Part 1：JSP（JavaServer Pages）の基本

### 1-1. ServletとJSPの得意分野の違い
- **Servlet（`.java`）**：**「Javaのプログラム」**の中にHTMLを書く 👉 **計算やデータ処理・制御が得意！**（画面を作るのは苦手）
- **JSP（`.jsp`）**：**「HTMLファイル」**の中にJavaを埋め込む 👉 **綺麗なWeb画面（デザイン）を作るのが得意！**（かつコンパイル作業が不要で、保存してブラウザを更新するだけで動く！）

### 1-2. JSPの3つの魔法のタグ

JSPファイル（拡張子 `.jsp`）では、以下の3つの記号を使ってHTMLの中にJavaを書きます。

<div style="background: #e8eaf6; border-left: 5px solid #283593; padding: 14px; border-radius: 6px; margin: 16px 0; color: #1a237e;">
  <ol style="margin: 0; padding-left: 20px; color: #1e293b;">
    <li><strong style="color: #283593;"><code>&lt;%@ page contentType="text/html; charset=UTF-8" %&gt;</code>（ページディレクティブ）</strong><br>
      JSPファイルの1行目に書く「このページはUTF-8のHTMLですよ」という宣言です。</li>
    <li style="margin-top: 8px;"><strong style="color: #1565c0;"><code>&lt;% Javaのコード; %&gt;</code>（スクリプトレット）</strong><br>
      変数の宣言や <code>for</code> 文、<code>if</code> 文など、通常のJavaコードを自由に書けるエリアです。</li>
    <li style="margin-top: 8px;"><strong style="color: #d32f2f;"><code>&lt;%= 変数や式 %&gt;</code>（式タグ：セミコロン不要！）</strong><br>
      変数の値や計算結果を、その場所のHTMLに<strong>ポンと表示（出力）</strong>します。</li>
  </ol>
</div>

### 1-3. 初めてのJSPを作ってみよう（`mykakeibo/hello.jsp`）
JSPはコンパイル（`javac`）しなくても、`mykakeibo/` フォルダ直下に置くだけでTomcatが自動で動かしてくれます！

```jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<%
    // ここはJavaの世界！第1回〜第5回とまったく同じように書けます
    String userName = "ハルキ";
    int budget = 30000;
    int spent = 12400;
    int remain = budget - spent;
%>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>初めてのJSP家計簿</title>
</head>
<body style="font-family: sans-serif; padding: 24px;">
    <h1 style="color: #283593;">📒 <%= userName %>さんの家計簿ダッシュボード</h1>
    <p>今月の予算：<strong><%= budget %>円</strong></p>
    <p>これまでの支出：<strong><%= spent %>円</strong></p>
    <p>残り使えるお金：<strong style="color: #d32f2f; font-size: 1.4em;"><%= remain %>円</strong></p>
</body>
</html>
```

---

## 📮 Part 2：HTMLフォームと `GET` / `POST` 送信

コンソール版では `Scanner` でキーボード入力を受け取りましたが、Webアプリでは HTML の **`<form>`（フォーム）タグ** を使ってブラウザからデータを送信します。

```mermaid
flowchart LR
    subgraph Browser["💻 ブラウザの入力フォーム (<form action='add' method='post'>)"]
        I1["品名：<input type='text' name='itemName'> 👉 入力値: 'ランチ'"]
        I2["金額：<input type='number' name='price'> 👉 入力値: '850'"]
        Btn["[登録する] ボタン (<button type='submit'>)"]
    end

    Browser -->|"POST送信 (/add)<br/>itemName=ランチ & price=850"| Servlet["☕ AddServlet の doPost(...)<br/>String name = request.getParameter(\"itemName\");<br/>int price = Integer.parseInt(request.getParameter(\"price\"));"]
```

### 2-1. `GET` 送信と `POST` 送信の違い（超重要！）

| 送信方法 | 特徴 | 呼び出されるServletメソッド | 家計簿アプリでの使いどころ |
| :---: | :--- | :---: | :--- |
| <span style="color: #1565c0; font-weight: bold;">`GET`</span> | 送るデータがURLの後ろ（`?keyword=食費`）にくっついて見える。 | **`doGet(...)`** | **ページの表示、キーワード検索、費目絞り込み** |
| <span style="color: #d32f2f; font-weight: bold;">`POST`</span> | 送るデータがURLに見えず、封筒（リクエストボディ）に入って送られる。 | **`doPost(...)`** | **家計簿データの登録・更新・削除、パスワード送信** |

---

## 📥 Part 3：Servletでフォームのデータを受け取る

フォームの各入力欄に付けた **`name="〇〇"`** の名前を指定して、Servlet側で **`request.getParameter("〇〇")`** を呼ぶと、入力された文字を取り出せます！

<div style="background: #ffebee; border-left: 5px solid #d32f2f; padding: 14px; border-radius: 6px; margin: 16px 0; color: #b71c1c;">
  <strong>⚠️ Webアプリ開発の2大鉄則！</strong><br>
  1. <code>request.getParameter(...)</code> を呼ぶ<strong>前</strong>に、必ず <strong><code>request.setCharacterEncoding("UTF-8");</code></strong> を書く！（これを忘れると送信された日本語が「???」に文字化けします）<br>
  2. <code>request.getParameter(...)</code> の戻り値は<strong>すべて <code>String</code>（文字列）</strong>です！金額として足し算・引き算したいときは、第4回で学んだ <strong><code>Integer.parseInt(...)</code></strong> で <code>int</code> に変換しましょう！
</div>

### 3-1. フォーム（`form_sample.jsp`）と受取Servlet（`ReceiveServlet.java`）

#### ① 入力画面：`mykakeibo/form_sample.jsp`
```jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>支出の入力</title></head>
<body style="font-family: sans-serif; padding: 24px;">
    <h2>📝 新しい支出を入力してください</h2>
    <!-- action="receive" は「/receive のServletへ送る」、method="post" は「POST方式で送る」 -->
    <form action="receive" method="post">
        <p>費目：
            <select name="category">
                <option value="食費">食費</option>
                <option value="交通費">交通費</option>
                <option value="交際費">交際費</option>
                <option value="その他">その他</option>
            </select>
        </p>
        <p>品名：<input type="text" name="itemName" required></p>
        <p>金額：<input type="number" name="price" required> 円</p>
        <button type="submit">登録する</button>
    </form>
</body>
</html>
```

#### ② 受取処理：`mykakeibo/WEB-INF/src/ReceiveServlet.java`
```java
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/receive")
public class ReceiveServlet extends HttpServlet {

    // form の method="post" で送られてくるので、doPost メソッドをオーバーライドする！
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // ① 受け取るデータの文字化け防止（最優先！）
        request.setCharacterEncoding("UTF-8");

        // ② input や select の name="..." を指定して値を取り出す
        String category = request.getParameter("category");
        String itemName = request.getParameter("itemName");
        String priceStr = request.getParameter("price");

        // ③ 金額の文字列を int に変換して税込（10%）も計算してみる
        int price = Integer.parseInt(priceStr);
        int taxIncluded = (int)(price * 1.1);

        // ④ 確認画面を出力する
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.println("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>登録完了</title></head>");
        out.println("<body style='font-family: sans-serif; padding: 24px;'>");
        out.println("<h2 style='color: #2e7d32;'>✅ 以下の内容で受け付けました！</h2>");
        out.println("<ul>");
        out.println("  <li>費目：" + category + "</li>");
        out.println("  <li>品名：" + itemName + "</li>");
        out.println("  <li>金額：" + price + "円（税込10%換算：" + taxIncluded + "円）</li>");
        out.println("</ul>");
        out.println("<p><a href='form_sample.jsp'>👈 続けて入力する</a></p>");
        out.println("</body></html>");
    }
}
```

---

## 🛠️ Part 4：実践演習（自分の手で書いてみよう！）

### 🟢 【演習1】JSPのループで「1〜12月の年間貯金シミュレーション表」を作ろう（難易度：★☆☆）
**作成ファイル名：`mykakeibo/saving_plan.jsp`**

JSPの `<% for (...) { %>` と `<%= ... %>` を使って、毎月 `15,000` 円ずつ貯金したときの「1ヶ月目〜12ヶ月目の累計貯金額」を表（`<table>`）で表示するJSPファイルを作成してください。

<details>
<summary>👉 演習1の解答例を見る</summary>

```jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<%
    int monthlySaving = 15000;
%>
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>年間貯金シミュレーション</title></head>
<body style="font-family: sans-serif; padding: 24px;">
    <h2>💰 毎月 <%= monthlySaving %>円 貯金シミュレーション</h2>
    <table border="1" style="border-collapse: collapse; width: 320px;">
        <tr style="background: #e8eaf6;">
            <th>経過月</th>
            <th>累計貯金額</th>
        </tr>
        <% for (int month = 1; month <= 12; month++) { %>
            <tr>
                <td style="padding: 6px; text-align: center;"><%= month %>ヶ月目</td>
                <td style="padding: 6px; text-align: right; font-weight: bold;">
                    <%= (monthlySaving * month) %> 円
                </td>
            </tr>
        <% } %>
    </table>
</body>
</html>
```
</details>

---

### 🟡 【演習2】ブラウザで動く「割り勘計算フォーム＆結果画面」を作ろう（難易度：★★☆）
**作成ファイル名：`mykakeibo/warikan.jsp`（1つのJSPで入力も計算も行うパターン）**

1つのJSPファイルの中に `<form action="warikan.jsp" method="get">` を作り、合計金額（`total`）と人数（`people`）が送信されてきたときだけ、その下に「1人あたりの金額」と「余り」を計算して表示してください。
- ※ヒント：最初にページを開いたときはまだ送信されていないため、`request.getParameter("total")` は `null` になります。`if (totalStr != null)` のときだけ計算結果を表示しましょう！

<details>
<summary>👉 演習2の解答例を見る</summary>

```jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<%
    String totalStr = request.getParameter("total");
    String peopleStr = request.getParameter("people");
%>
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Web割り勘計算機</title></head>
<body style="font-family: sans-serif; padding: 24px;">
    <h2>🍽️ Web割り勘計算機</h2>
    <form action="warikan.jsp" method="get">
        合計金額：<input type="number" name="total" required> 円 ／
        参加人数：<input type="number" name="people" min="1" required> 人
        <button type="submit">計算する</button>
    </form>

    <% if (totalStr != null && peopleStr != null) {
        int total = Integer.parseInt(totalStr);
        int people = Integer.parseInt(peopleStr);
        int perPerson = total / people;
        int remainder = total % people;
    %>
        <div style="margin-top: 20px; background: #e8f5e9; padding: 16px; border-radius: 8px;">
            <h3>📊 計算結果（合計 <%= total %>円 ÷ <%= people %>人）</h3>
            <p>・1人あたりの支払額：<strong style="font-size: 1.3em; color: #2e7d32;"><%= perPerson %>円</strong></p>
            <p>・割り切れない端数 ：<strong><%= remainder %>円</strong></p>
        </div>
    <% } %>
</body>
</html>
```
</details>

---

### 🔴 【演習3】ミニ家計簿 Web版 Ver.2（収支区分・日付・費目・品名・金額の入力と判定）（難易度：★★★）
**作成ファイル名：`mykakeibo/entry_form.jsp` と `mykakeibo/WEB-INF/src/EntryCheckServlet.java`**

1. **`entry_form.jsp`**：以下の5項目を `POST` 送信するフォームを作成する。
   - 収支区分（ラジオボタン `name="type"`：`"収入"` または `"支出"`）
   - 日付（`<input type="date" name="date">`）
   - 費目（`<select name="category">`：食費、交通費、日用品、給料・お小遣い、その他）
   - 品名・内容（`<input type="text" name="name">`）
   - 金額（`<input type="number" name="amount">`）
2. **`EntryCheckServlet.java`（URL：`/entryCheck`）**：
   - `doPost` で5項目を受け取り、もし金額にマイナスや不正な文字が入っていたら `try-catch` でエラーメッセージを表示する。
   - 正しければ、収入なら緑色のカード、支出なら赤色のカードで登録確認画面を表示する。

<details>
<summary>👉 演習3の解答例を見る</summary>

**① `mykakeibo/entry_form.jsp`**
```jsp
<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.time.LocalDate" %>
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>家計簿データ登録</title></head>
<body style="font-family: sans-serif; padding: 24px; background: #f5f7fa;">
    <div style="background: white; padding: 24px; border-radius: 10px; max-width: 500px; margin: auto;">
        <h2 style="color: #283593;">📒 家計簿データの入力</h2>
        <form action="entryCheck" method="post">
            <p><strong>収支区分：</strong>
                <label><input type="radio" name="type" value="支出" checked> 🔴 支出</label>
                <label style="margin-left: 12px;"><input type="radio" name="type" value="収入"> 🟢 収入</label>
            </p>
            <p><strong>日付：</strong>
                <input type="date" name="date" value="<%= LocalDate.now() %>" required>
            </p>
            <p><strong>費目：</strong>
                <select name="category">
                    <option value="食費">食費</option>
                    <option value="交通費">交通費</option>
                    <option value="日用品">日用品</option>
                    <option value="給料・お小遣い">給料・お小遣い</option>
                    <option value="その他">その他</option>
                </select>
            </p>
            <p><strong>品名・内容：</strong><br>
                <input type="text" name="name" placeholder="例：スーパー買い物" style="width: 90%; padding: 6px;" required>
            </p>
            <p><strong>金額（円）：</strong><br>
                <input type="number" name="amount" min="1" placeholder="例：1500" style="width: 90%; padding: 6px;" required>
            </p>
            <button type="submit" style="background: #283593; color: white; padding: 10px 24px; border: none; border-radius: 6px; cursor: pointer;">
                送信して確認する
            </button>
        </form>
    </div>
</body>
</html>
```

**② `mykakeibo/WEB-INF/src/EntryCheckServlet.java`**
```java
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/entryCheck")
public class EntryCheckServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();

        String type = request.getParameter("type");
        String date = request.getParameter("date");
        String category = request.getParameter("category");
        String name = request.getParameter("name");
        String amountStr = request.getParameter("amount");

        out.println("<!DOCTYPE html><html><head><meta charset='UTF-8'><title>登録確認</title></head>");
        out.println("<body style='font-family: sans-serif; padding: 24px;'>");

        try {
            int amount = Integer.parseInt(amountStr);
            boolean isIncome = "収入".equals(type);
            String bgColor = isIncome ? "#e8f5e9" : "#ffebee";
            String textColor = isIncome ? "#2e7d32" : "#c62828";
            String sign = isIncome ? "＋" : "－";

            out.println("<div style='background: " + bgColor + "; border-left: 6px solid " + textColor + "; padding: 20px; border-radius: 8px; max-width: 500px;'>");
            out.println("<h2 style='color: " + textColor + "; margin-top: 0;'>【" + type + "】登録データを受け付けました</h2>");
            out.println("<p>📅 日付：" + date + "</p>");
            out.println("<p>🏷️ 費目：" + category + "</p>");
            out.println("<p>📝 品名：" + name + "</p>");
            out.println("<p style='font-size: 1.4em; font-weight: bold; color: " + textColor + ";'>💰 金額：" + sign + amount + "円</p>");
            out.println("</div>");
        } catch (NumberFormatException e) {
            out.println("<p style='color: red;'>⚠️ エラー：金額が正しく入力されていません。</p>");
        }

        out.println("<p style='margin-top: 16px;'><a href='entry_form.jsp'>👈 入力フォームへ戻る</a></p>");
        out.println("</body></html>");
    }
}
```
</details>

---

## 📝 Part 5：第7回 確認テスト（全10問）

目標は **8問以上正解** です！

**第1問（JSPの特徴）**
Servletと比較したときのJSP（JavaServer Pages）の特徴として、最も適切なものはどれですか？
- **A.** HTMLファイルの中にJavaのコードや変数を埋め込んで、画面（見た目）を簡単に作ることができる。
- **B.** 画面を一切表示できない。
- **C.** ブラウザではなく黒い画面（コンソール）にしか出力できない。
- **D.** HTMLタグを使うことができない。

**第2問（JSPで変数の値を出力するタグ）**
JSPファイルの中で、Javaの変数 `totalPrice` の値をHTML上に表示（出力）したいとき、正しい書き方はどれですか？
- **A.** `<% totalPrice %>`
- **B.** `<%= totalPrice %>`
- **C.** `<%@ totalPrice %>`
- **D.** `${ totalPrice; }`

**第3問（HTMLフォームの送信先と送信方式）**
`<form action="register" method="post">` と書いたとき、送信ボタンを押すとどうなりますか？
- **A.** `post` というURLに対して `register` 方式で送信される。
- **B.** `register` というURLに対して `POST` リクエストで送信される。
- **C.** 何も送信されない。
- **D.** 自動的に `doGet` メソッドだけが呼ばれる。

**第4問（POST送信を受け取るServletのメソッド）**
`<form method="post">` で送信されたデータをServletで受け取って処理する場合、オーバーライドすべきメソッドはどれですか？
- **A.** `doGet` ／ **B.** `doPost` ／ **C.** `doForm` ／ **D.** `main`

**第5問（入力欄の名前属性）**
`<input type="text" [  ?  ]="itemName">` のように、Servlet側で値を取り出すための「キーの名前」を指定するHTML属性はどれですか？
- **A.** `id` ／ **B.** `class` ／ **C.** `name` ／ **D.** `value`

**第6問（リクエストパラメータの取得メソッド）**
フォームの `<input type="text" name="memo">` に入力された文字列を、Servletの `request` オブジェクトから取り出す正しいコードはどれですか？
- **A.** `request.get("memo")`
- **B.** `request.getParameter("memo")`
- **C.** `request.getInput("memo")`
- **D.** `response.getParameter("memo")`

**第7問（`getParameter` の戻り値の型）**
`<input type="number" name="price">` に `1500` と入力して送信されたとき、`request.getParameter("price")` の戻り値の型は何ですか？
- **A.** `int` 型 ／ **B.** `double` 型 ／ **C.** `String` 型 ／ **D.** `boolean` 型

**第8問（送信データの文字化け防止）**
フォームから送信された日本語（`"食費"` など）が文字化けしないように、`request.getParameter(...)` を呼ぶ前に記述するコードはどれですか？
- **A.** `request.setCharacterEncoding("UTF-8");`
- **B.** `request.setLanguage("UTF-8");`
- **C.** `System.setUTF8();`
- **D.** `out.setEncoding("UTF-8");`

**第9問（GETとPOSTの使い分け）**
家計簿アプリで「新しい収支データを登録する」「データを削除する」といった、サーバー側のデータを変更する処理に向いている送信方式はどれですか？
- **A.** `GET` ／ **B.** `POST` ／ **C.** `LINK` ／ **D.** `SHOW`

**第10問（パラメータが存在しない場合の値）**
フォームに存在しない名前や、まだ送信されていない状態で `request.getParameter("keyword")` を呼び出すと、何が返ってきますか？
- **A.** `"0"`（文字列のゼロ）
- **B.** `null`
- **C.** `"エラー"` という文字列
- **D.** コンパイルエラーになる

<details>
<summary>✅ 確認テスト（全10問）の解答と解説を見る</summary>

| 問題 | 正解 | 解説 |
| :---: | :---: | :--- |
| **第1問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | JSPはHTMLをベースにしてJavaを埋め込めるため、Web画面（View）の作成に最適です。 |
| **第2問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `<%= 変数名 %>`（式タグ）を使うと、その場所に変数の値が出力されます（末尾の `;` は不要です）。 |
| **第3問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `action` 属性が送信先URL、`method` 属性がHTTPメソッド（GET/POST）を表します。 |
| **第4問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `method="post"` のフォーム送信は、Servletの `doPost` メソッドで受け取ります。 |
| **第5問** | <span style="color: #d32f2f; font-weight: bold;">C</span> | HTMLの `<input>` や `<select>` には必ず `name="名前"` を付けることで、サーバーへ値が送られます。 |
| **第6問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `request.getParameter("name属性の名前")` で入力値を取得します。 |
| **第7問** | <span style="color: #d32f2f; font-weight: bold;">C</span> | HTML側が `type="number"` であっても、`getParameter` で受け取る値は常に `String`（文字列）です。計算には `Integer.parseInt` を使います。 |
| **第8問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | リクエストの読み取り文字コードを `UTF-8` に指定します。 |
| **第9問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | データの登録・更新・削除には `POST`、画面の閲覧や検索には `GET` を使うのがWebの基本ルールです。 |
| **第10問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | 指定されたパラメータが送られてきていない場合は `null` が返ります。 |

</details>

---
<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <a href="./lesson06.md">👈 第6回へ戻る</a>
  <a href="./README.md">🏠 カリキュラム目次</a>
  <a href="./lesson08.md" style="font-weight: bold; color: #283593;">👉 第8回：MVCモデルとスコープ！一覧表示と合計金額の自動計算へ進む</a>
</div>
