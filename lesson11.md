<div style="background: linear-gradient(135deg, #00695c 0%, #26a69a 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 20px;">
  <div style="font-size: 0.9em; color: #e0f2f1; font-weight: bold;">Java実践カリキュラム ― 第11回 / 全14回</div>
  <h1 style="margin: 6px 0 10px 0; color: #ffffff; border: none;">🗄️ 第11回：データベース連携！SQLとJDBCで本格的な永続化</h1>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em; margin-right: 8px;">⏱ 目安時間：3.5〜4時間</span>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em;">📖 発展編：RDB・SQL入門・JDBC・SQLインジェクション対策</span>
</div>

---

## 🎯 0. 今日のゴールと時間配分

第9回〜第10回では `KakeiboDAO` に CSVファイル保存を実装しましたが、CSVには「件数が増えると全件書き直しが遅い」「1行だけ更新（UPDATE）しづらい」「複数人同時アクセスで壊れやすい」という限界があります。
第11回では、実務のWebアプリで必須となる **リレーショナルデータベース（SQLite）と SQL・JDBC（Java Database Connectivity）** を学び、Servlet や JSP をほとんど変えずに `KakeiboDAO` の保存先をデータベースへアップグレードします！

| 時間目安 | パート | 内容 |
| :--- | :--- | :--- |
| **0:00〜0:45** | <span style="color: #00695c; font-weight: bold;">Part 1：なぜCSVからデータベース（SQL）へ進むのか？</span> | テーブル構造、CRUD（SELECT/INSERT/UPDATE/DELETE）の基礎 |
| **0:45〜1:40** | <span style="color: #1565c0; font-weight: bold;">Part 2：JDBCの基本と `PreparedStatement`</span> | `DriverManager`, `Connection`, `PreparedStatement`, `ResultSet`, `try-with-resources` |
| **1:40〜2:25** | <span style="color: #c62828; font-weight: bold;">Part 3：DB版 `KakeiboDAO` の実装とセキュリティ</span> | SQLインジェクションを防ぐ `?` プレースホルダの仕組み |
| **2:25〜3:20** | <span style="color: #2e7d32; font-weight: bold;">Part 4：実践演習（SQLite + JDBC 版 MyKakeibo）</span> | テーブル作成・全件取得・登録・更新(`UPDATE`)・削除の実装 |
| **3:20〜3:50** | <span style="color: #6a1b9a; font-weight: bold;">Part 5：第11回 確認テスト（10問）</span> | SQL・JDBC・セキュリティの知識を10問でチェック！ |

---

## 📊 Part 1：SQLの基本（CRUD：4つの基本操作）

データベースでは、データを Excel の表のような **テーブル（Table）** として管理します。家計簿テーブル `kakeibo_items` のイメージは次の通りです。

| id (主キー) | entry_date | entry_type | category | title | price |
| :---: | :---: | :---: | :---: | :--- | :---: |
| 1 | 2026-10-15 | 収入 | 給料 | アルバイト代 | 35000 |
| 2 | 2026-10-16 | 支出 | 食費 | カフェランチ | 950 |

テーブルを操作するための標準言語が **SQL** です。基本となる4つの命令（**CRUD**）を覚えましょう。

```sql
-- 1. テーブル作成 (Create Table)
CREATE TABLE IF NOT EXISTS kakeibo_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_date TEXT NOT NULL,
    entry_type TEXT NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    price INTEGER NOT NULL
);

-- 2. 登録 (Create / INSERT)
INSERT INTO kakeibo_items (entry_date, entry_type, category, title, price)
VALUES ('2026-10-17', '支出', '食費', 'コンビニ弁当', 650);

-- 3. 検索・取得 (Read / SELECT)
SELECT id, entry_date, entry_type, category, title, price
FROM kakeibo_items
WHERE category = '食費'
ORDER BY id DESC;

-- 4. 更新 (Update / UPDATE)
UPDATE kakeibo_items SET price = 700, title = '特製弁当' WHERE id = 2;

-- 5. 削除 (Delete / DELETE)
DELETE FROM kakeibo_items WHERE id = 2;
```

---

## 🔌 Part 2：JDBCの基本と `try-with-resources`

Javaからデータベースに接続するための標準APIが **JDBC（Java Database Connectivity）** です。Ubuntu環境では軽量な **SQLite** と JDBCドライバJAR（`sqlite-jdbc`）を使うとサーバー設定不要で動かせます。

### 🐧 Ubuntuでの準備（SQLiteとJDBCドライバの配置）

```bash
sudo apt update && sudo apt install -y sqlite3
mkdir -p /home/miyakawaharuki/java学習/mykakeibo/WEB-INF/lib
# sqlite-jdbc-3.x.x.jar を WEB-INF/lib/ に配置すれば javac / Tomcat から自動認識されます
```

### JDBCの4大クラス／インターフェース

1. **`Connection`**：データベースへの接続回線そのもの
2. **`PreparedStatement`**：SQL文を安全に組み立てて実行するオブジェクト
3. **`ResultSet`**：`SELECT` で取得した検索結果の表を1行ずつ読み取るカーソル
4. **`try-with-resources`**：接続や結果セットを自動で `close()` してリソース漏れを防ぐ構文

```java
String url = "jdbc:sqlite:/home/miyakawaharuki/java学習/kakeibo.db";
String sql = "SELECT id, entry_date, entry_type, category, title, price FROM kakeibo_items ORDER BY id DESC";

try (Connection conn = DriverManager.getConnection(url);
     PreparedStatement ps = conn.prepareStatement(sql);
     ResultSet rs = ps.executeQuery()) {

    while (rs.next()) {
        int id = rs.getInt("id");
        String title = rs.getString("title");
        int price = rs.getInt("price");
        System.out.println(id + ": " + title + " (" + price + "円)");
    }
}
```

<div style="background: #ffebee; border-left: 5px solid #c62828; padding: 14px; border-radius: 6px; margin: 16px 0; color: #b71c1c;">
  <strong>🛡️ 超重要：SQLインジェクション対策は <code>?</code> プレースホルダ一択！</strong><br>
  <code>"SELECT * FROM kakeibo_items WHERE title = '" + keyword + "'"</code> のように文字列連結でSQLを作ると、悪意ある入力（<code>' OR '1'='1</code> など）で全データが漏洩・破壊される <strong>SQLインジェクション攻撃</strong> を受けます。<br>
  必ず <code>PreparedStatement</code> で <code>WHERE title = ?</code> と書き、<code>ps.setString(1, keyword)</code> で値をバインドしましょう！
</div>

---

## 🛠️ Part 3：DB版 `KakeiboDAO` の設計（DAOパターンの威力）

第9回で「DAOに分けておけば、保存先を変えてもServletを直さずに済む」と学びました。今まさにその威力を体験できます！

```java
package dao;

import model.KakeiboItem;
import java.sql.*;
import java.util.ArrayList;

public class KakeiboJdbcDAO {
    private final String dbUrl;

    public KakeiboJdbcDAO(String dbPath) {
        this.dbUrl = "jdbc:sqlite:" + dbPath;
        initTable();
    }

    private void initTable() {
        String sql = "CREATE TABLE IF NOT EXISTS kakeibo_items ("
                + "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                + "entry_date TEXT NOT NULL, "
                + "entry_type TEXT NOT NULL, "
                + "category TEXT NOT NULL, "
                + "title TEXT NOT NULL, "
                + "price INTEGER NOT NULL)";
        try (Connection conn = DriverManager.getConnection(dbUrl);
             Statement st = conn.createStatement()) {
            st.execute(sql);
        } catch (SQLException e) {
            throw new RuntimeException("テーブル初期化エラー", e);
        }
    }

    public void insert(KakeiboItem item) {
        String sql = "INSERT INTO kakeibo_items (entry_date, entry_type, category, title, price) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(dbUrl);
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, item.getDate());
            ps.setString(2, item.getType());
            ps.setString(3, item.getCategory());
            ps.setString(4, item.getTitle());
            ps.setInt(5, item.getPrice());
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException("登録エラー", e);
        }
    }

    public ArrayList<KakeiboItem> findAll() {
        ArrayList<KakeiboItem> list = new ArrayList<>();
        String sql = "SELECT id, entry_date, entry_type, category, title, price FROM kakeibo_items ORDER BY id DESC";
        try (Connection conn = DriverManager.getConnection(dbUrl);
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new KakeiboItem(
                    rs.getInt("id"),
                    rs.getString("entry_date"),
                    rs.getString("entry_type"),
                    rs.getString("category"),
                    rs.getString("title"),
                    rs.getInt("price")
                ));
            }
        } catch (SQLException e) {
            throw new RuntimeException("一覧取得エラー", e);
        }
        return list;
    }
}
```

---

## 🛠️ Part 4：実践演習（自分の手で書いてみよう！）

### 🟢 【演習1】`deleteById(int id)` メソッドを実装しよう（難易度：★☆☆）
指定した `id` のレコードを1件削除するメソッドを `KakeiboJdbcDAO` に追加してください。`DELETE FROM kakeibo_items WHERE id = ?` と `ps.executeUpdate()` を使います。

### 🟡 【演習2】明細の金額・品名を更新する `update(KakeiboItem item)` を作ろう（難易度：★★☆）
CSV版では難しかった「既存データの編集（UPDATE）」を `UPDATE kakeibo_items SET category = ?, title = ?, price = ? WHERE id = ?` で実装しましょう。

### 🔴 【演習3】SQLの `LIKE` を使ったキーワード検索 `searchByKeyword(String keyword)`（難易度：★★★）
`WHERE title LIKE ?` に対して `ps.setString(1, "%" + keyword + "%")` をバインドし、DB側で高速に絞り込み検索を行うメソッドを完成させましょう。

---

## 📝 Part 5：第11回 確認テスト（全10問）

**第1問（SQLの基本操作CRUD）**
データベースの4大基本操作「CRUD」において、データの「取得（検索）」と「更新」に対応するSQL命令の組み合わせはどれですか？
- **A.** 取得：`GET` ／ 更新：`CHANGE`
- **B.** 取得：`SELECT` ／ 更新：`UPDATE`
- **C.** 取得：`FIND` ／ 更新：`MODIFY`
- **D.** 取得：`READ` ／ 更新：`ALTER`

**第2問（WHERE句の役割）**
`DELETE FROM kakeibo_items;` のように `WHERE` 句を付けずに `DELETE` 文を実行するとどうなりますか？
- **A.** 1件も削除されない
- **B.** 最新の1件だけが削除される
- **C.** テーブル内の全データが削除されてしまう
- **D.** コンパイルエラーになる

**第3問（JDBCの接続とリソース管理）**
JDBCで取得した `Connection`、`PreparedStatement`、`ResultSet` を使い終わったあとに必ず自動的に `close()` するためのJava構文はどれですか？
- **A.** `try-with-resources`（`try (Connection conn = ...) { ... }`）
- **B.** `switch-case`
- **C.** `do-while`
- **D.** `implements Closeable`

**第4問（executeQuery と executeUpdate の使い分け）**
`SELECT` 文を実行するときに使うメソッドと、`INSERT` / `UPDATE` / `DELETE` 文を実行するときに使うメソッドの正しい組み合わせはどれですか？
- **A.** SELECT：`executeUpdate()` ／ INSERT等：`executeQuery()`
- **B.** SELECT：`executeQuery()` ／ INSERT等：`executeUpdate()`
- **C.** どちらも `runSql()` を使う
- **D.** どちらも `printSql()` を使う

**第5問（SQLインジェクション対策）**
Webフォームから受け取った検索文字をSQL文に安全に埋め込むための正しい方法はどれですか？
- **A.** `String sql = "SELECT * FROM kakeibo_items WHERE title = '" + title + "'";` と文字列連結する
- **B.** `PreparedStatement` の `?`（プレースホルダ）を使い、`ps.setString(1, title)` で値をセットする
- **C.** HTMLのフォームを `method="get"` にする
- **D.** CSSで入力欄を隠す

**第6問（ResultSetの読み取り）**
`ResultSet rs = ps.executeQuery();` で取得した結果表から、1行ずつデータを取り出しながら最後までループする正しい書き方はどれですか？
- **A.** `while (rs.next()) { ... }`
- **B.** `for (int i = 0; i < rs.length; i++) { ... }`
- **C.** `if (rs.hasMore()) { ... }`
- **D.** `while (rs.readLine()) { ... }`

**第7問（プレースホルダの番号）**
`INSERT INTO kakeibo_items (title, price) VALUES (?, ?)` において、2番目の `?` に整数変数 `amount` を設定する正しいコードはどれですか？
- **A.** `ps.setInt(1, amount);`
- **B.** `ps.setInt(2, amount);`
- **C.** `ps.setString(2, amount);`
- **D.** `ps.addParam("price", amount);`

**第8問（DAOパターンの利点）**
保存先をCSVファイル（`KakeiboDAO`）からSQLiteデータベース（`KakeiboJdbcDAO`）へ切り替える際、DAOパターンで設計しておくとどのようなメリットがありますか？
- **A.** データアクセス処理がDAOに分離されているため、JSPやServletの画面・制御ロジックへの修正を最小限に抑えられる
- **B.** HTMLタグを書かなくてよくなる
- **C.** Javaのコンパイルが不要になる
- **D.** JavaScriptを使わずにCSSだけでDB接続できる

**第9問（主キーとAUTO INCREMENT）**
テーブル定義で `id INTEGER PRIMARY KEY AUTOINCREMENT` と指定すると、`INSERT` 時にどうなりますか？
- **A.** 毎回プログラム側でランダムな文字を作る必要がある
- **B.** データベースが重複しない連番の `id` を自動的に採番してくれる
- **C.** `id` がすべて `0` になる
- **D.** 1件しか登録できなくなる

**第10問（トランザクションの意味）**
銀行の振込処理のように「出金と入金をセットで行い、片方が失敗したら両方取り消す」仕組みをデータベース用語で何と呼びますか？
- **A.** トランザクション管理（`commit` / `rollback`）
- **B.** カプセル化
- **C.** キャスト変換
- **D.** ポリモーフィズム

<details>
<summary>✅ 確認テスト（全10問）の解答と解説を見る</summary>

| 問題 | 正解 | 解説 |
| :---: | :---: | :--- |
| **第1問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | CRUD は Create=`INSERT`, Read=`SELECT`, Update=`UPDATE`, Delete=`DELETE` です。 |
| **第2問** | <span style="color: #d32f2f; font-weight: bold;">C</span> | `WHERE` 句を忘れるとテーブルの全行が削除されるため、`DELETE` / `UPDATE` 時は必ず条件を確認します。 |
| **第3問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `try (...)` の丸カッコ内で開いた `Connection` 等は、ブロック終了時に自動で `close()` されます。 |
| **第4問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | 結果を返す `SELECT` は `executeQuery()`、件数を更新する `INSERT`/`UPDATE`/`DELETE` は `executeUpdate()` を使います。 |
| **第5問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `PreparedStatement` の `?` プレースホルダを使うことで、SQLインジェクション攻撃を根本から防げます。 |
| **第6問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `rs.next()` は次の行へカーソルを進め、データがあれば `true`、終わりに達したら `false` を返します。 |
| **第7問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | JDBCのプレースホルダ番号は `0` ではなく **`1` から**始まります。2番目は `ps.setInt(2, amount)` です。 |
| **第8問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | データ永続化の仕組みをDAOに閉じ込める（疎結合にする）ことで、保守性・拡張性が大きく向上します。 |
| **第9問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | 主キー（PRIMARY KEY）に自動採番を設定すると、一意の番号をDB側が安全に割り当てます。 |
| **第10問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 複数の処理を「すべて成功（`commit`）」か「すべて取り消し（`rollback`）」にまとめる仕組みがトランザクションです。 |

</details>

---
<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <a href="./lesson10.md">👈 第10回へ戻る</a>
  <a href="./README.md">🏠 カリキュラム目次</a>
  <a href="./lesson12.md" style="font-weight: bold; color: #00695c;">👉 第12回：Map・Stream API・JSON APIと編集機能へ進む</a>
</div>
