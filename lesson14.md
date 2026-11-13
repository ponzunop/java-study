<div style="background: linear-gradient(135deg, #1b5e20 0%, #43a047 50%, #ffb300 100%); color: white; padding: 26px; border-radius: 12px; margin-bottom: 20px;">
  <div style="font-size: 0.9em; color: #e8f5e9; font-weight: bold;">Java実践カリキュラム ― 第14回（最終回） / 全14回</div>
  <h1 style="margin: 6px 0 10px 0; color: #ffffff; border: none;">🚀 第14回：ビルドツール（Maven）と Spring Boot 入門・総まとめ</h1>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em; margin-right: 8px;">⏱ 目安時間：3.5〜4時間</span>
  <span style="background: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 20px; font-size: 0.85em;">📖 最終回：Maven / pom.xml / Spring Boot / DI / 卒業制作</span>
</div>

---

## 🎯 0. 今日のゴールと時間配分

これまで `javac -cp ...` で手動コンパイルし、`WEB-INF/lib` にJARを手作業で並べてきました。しかし実際の開発現場では、ライブラリ管理・コンパイル・テスト実行・パッケージ化を1コマンドで自動化する **ビルドツール（Maven / Gradle）** と、Java Web開発のデファクトスタンダードである **Spring Boot** を使います。
最終回では、第1回〜第13回で身につけた知識（クラス・MVC・DAO・JDBC・JSON API・JUnit）が **Maven と Spring Boot の世界でどう繋がるか** を完全整理します！

| 時間目安 | パート | 内容 |
| :--- | :--- | :--- |
| **0:00〜0:45** | <span style="color: #1b5e20; font-weight: bold;">Part 1：ビルドツール Maven と `pom.xml` の仕組み</span> | 依存ライブラリ自動取得、標準ディレクトリ構成、`mvn test` |
| **0:45〜1:45** | <span style="color: #1565c0; font-weight: bold;">Part 2：Spring Boot 入門（Servlet/JSPとの対応表）</span> | `@SpringBootApplication`, `@RestController`, `@GetMapping`, DI（依存性注入） |
| **1:45〜2:30** | <span style="color: #e65100; font-weight: bold;">Part 3：Spring Boot 版「MyKakeibo」コード比較</span> | 第10回〜第12回のServletコードがどれだけ短く整理されるか体験する |
| **2:30〜3:20** | <span style="color: #2e7d32; font-weight: bold;">Part 4：総合卒業演習（設計と機能拡張チャレンジ）</span> | Maven構成・Spring Controller・テストを組み立てよう |
| **3:20〜3:50** | <span style="color: #6a1b9a; font-weight: bold;">Part 5：最終回 総合確認テスト（10問）</span> | 全14回の総仕上げを10問で突破しよう！ |

---

## 📦 Part 1：Maven と標準プロジェクト構成

**Maven（メイヴン）** はプロジェクトの設定ファイル **`pom.xml`** に必要なライブラリ（SQLite JDBC や JUnit 5、Spring Boot など）を書いておくだけで、インターネットから自動ダウンロードしてコンパイル・テストまで行ってくれるツールです。

### 🐧 Ubuntuでの導入と基本コマンド

```bash
sudo apt update && sudo apt install -y maven
mvn -version

# よく使う3大コマンド
mvn compile   # ソースコードをコンパイル
mvn test      # src/test/java 以下の JUnit テストをすべて自動実行
mvn package   # 配布可能な .jar / .war ファイルを target/ に生成
```

### Mavenの標準フォルダ構成（世界共通ルール）

```text
mykakeibo-boot/
├── pom.xml                       ← 依存ライブラリとビルド設定
└── src/
    ├── main/
    │   ├── java/                 ← Javaプログラム本体 (Controller, Model, DAO)
    │   └── resources/            ← 設定ファイル (application.properties), templates/
    └── test/
        └── java/                 ← JUnit テストコード
```

---

## 🌱 Part 2：Spring Boot と Servlet/JSP の対応関係

Spring Boot を学ぶとき、皆さんが第6回〜第13回で作った Servlet/JSP 版の経験がそのまま武器になります！

| これまでの自作構成（Servlet/JSP） | Spring Boot での姿 | 役割（実は同じ！） |
| :--- | :--- | :--- |
| `@WebServlet("/app")` + `HttpServlet` | `@Controller` / `@RestController` | HTTPリクエストを受け取る受付（Controller） |
| `doGet(...)` / `doPost(...)` | `@GetMapping("/app")` / `@PostMapping("/app")` | GET / POST の振り分け |
| `req.getParameter("price")` | メソッド引数 `@RequestParam int price` | フォーム値・クエリの取得（自動数値変換付き！） |
| `new KakeiboDAO()` | **DI（依存性注入）**：コンストラクタ引数＋`@Repository` | 必要な部品をSpringが自動で渡してくれる |
| `res.setContentType("application/json")` | `@RestController` でオブジェクトを `return` するだけ | 自動で JSON 文字列に変換して返す！ |
| 外部Tomcatへの手動配置 (`webapps/`) | 組み込みTomcat（`java -jar app.jar` だけで起動） | サーバー準備が不要に！ |

---

## 💻 Part 3：Spring Boot 版 `KakeiboController` を見てみよう

第10回〜第12回で何十行も書いていたServletが、Spring Bootではこんなにシンプルになります。

```java
@RestController
@RequestMapping("/api/kakeibo")
public class KakeiboController {

    private final KakeiboRepository repository;

    // DI（依存性注入）：Springが自動で Repository を渡してくれる
    public KakeiboController(KakeiboRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<KakeiboItem> list(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return repository.findByCategory(category);
        }
        return repository.findAll();
    }

    @PostMapping
    public KakeiboItem create(@RequestBody KakeiboItem item) {
        if (item.getPrice() <= 0) {
            throw new IllegalArgumentException("金額は1円以上を指定してください");
        }
        return repository.save(item);
    }
}
```

<div style="background: #e8f5e9; border-left: 5px solid #2e7d32; padding: 14px; border-radius: 6px; margin: 16px 0; color: #1b5e20;">
  <strong>💡 なぜここまで基礎から順に学んだのか？</strong><br>
  最初からSpring Bootだけを使うと、裏で何が起きているか分からずエラー時に詰まりがちです。しかし皆さんは <code>javac</code>、クラスとインスタンス、<code>ArrayList</code>/<code>HashMap</code>、HTTPのGET/POST、Servlet/JSP、MVC、DAO、JDBC、JUnitを自分の手で動かしてきました。だからこそ Spring Boot の「魔法」の正体がすべて見抜けるのです！
</div>

---

## 🛠️ Part 4：総合卒業演習（ステップアップチャレンジ）

### 🟢 【演習1】`pom.xml` に JUnit 5 の依存関係を読み解こう（難易度：★☆☆）
Maven の `<dependencies>` の中に `<dependency>` を追加するときに必要な3要素（`groupId`, `artifactId`, `version`）の意味を確認しましょう。

### 🟡 【演習2】`@GetMapping` と `@RequestParam` で検索エンドポイントを設計しよう（難易度：★★☆）
`/api/kakeibo/search?keyword=弁当` のようなリクエストを受け取り、`keyword` を使って一覧を絞り込む Controller メソッドを書いてみましょう。

### 🔴 【演習3】あなただけの「MyKakeibo」拡張アイデアを実装しよう（難易度：★★★）
月ごとの予算アラート機能、CSVエクスポートボタン、費目別の棒グラフ表示（Chart.js + `/api/summary`）など、学んだ技術を使ってオリジナル機能を追加してみましょう！

---

## 📝 Part 5：最終回 総合確認テスト（全10問）

**第1問（Mavenの設定ファイル）**
Mavenプロジェクトにおいて、使用するライブラリ（依存関係）やJavaバージョン、ビルド設定を記述する設定ファイルの名前はどれですか？
- **A.** `package.json` ／ **B.** `pom.xml` ／ **C.** `requirements.txt` ／ **D.** `build.sh`

**第2問（Mavenのテスト実行コマンド）**
Mavenプロジェクトで、`src/test/java` 配下にある JUnit テストを一括実行するコマンドはどれですか？
- **A.** `mvn test` ／ **B.** `mvn check` ／ **C.** `java test` ／ **D.** `javac --test`

**第3問（Mavenの標準ディレクトリ構成）**
Mavenの標準構成において、アプリケーション本体のJavaソースコード（`KakeiboItem.java` など）を配置するフォルダはどれですか？
- **A.** `src/main/java` ／ **B.** `src/test/java` ／ **C.** `WEB-INF/lib` ／ **D.** `target/classes`

**第4問（Spring Bootのアノテーション：JSON API）**
Spring Bootで、メソッドの戻り値（`List<KakeiboItem>` など）を自動的にJSONへ変換してレスポンスとして返すControllerクラスに付けるアノテーションはどれですか？
- **A.** `@WebServlet` ／ **B.** `@RestController` ／ **C.** `@Entity` ／ **D.** `@Override`

**第5問（GETとPOSTのルーティング）**
Spring MVC / Spring Boot で、HTTPの `GET` リクエストと `POST` リクエストをそれぞれ受け取るメソッドに付けるアノテーションの組み合わせはどれですか？
- **A.** GET：`@GetMapping` ／ POST：`@PostMapping`
- **B.** GET：`@DoGet` ／ POST：`@DoPost`
- **C.** GET：`@Select` ／ POST：`@Insert`
- **D.** GET：`@Read` ／ POST：`@Write`

**第6問（DI：依存性注入のメリット）**
クラス内部で直接 `new KakeiboDAO()` と書かず、コンストラクタ経由で外から部品（依存オブジェクト）を受け取る **DI（Dependency Injection）** を使う主なメリットは何ですか？
- **A.** テスト時に本物のDBの代わりにモック（テスト用ダミー）へ差し替えやすく、変更に強い設計になる
- **B.** クラスを1つも作らなくてよくなる
- **C.** Javaの変数型がすべて `var` になる
- **D.** HTMLを書かなくても自動でデザインが生成される

**第7問（@RequestParamの役割）**
URLのクエリ `/search?keyword=弁当` から `"弁当"` をメソッドの引数 `String keyword` で受け取るために使うSpringのアノテーションはどれですか？
- **A.** `@RequestParam` ／ **B.** `@RequestBody` ／ **C.** `@PathVariable` ／ **D.** `@Autowired`

**第8問（組み込みTomcatの特徴）**
従来のServlet構成では自分でTomcatをインストールして `webapps/` に配置していましたが、Spring Bootではどう変わりますか？
- **A.** Tomcatがアプリの中に組み込まれているため、`java -jar` で1ファイルのままWebサーバーを起動できる
- **B.** ブラウザの拡張機能だけでサーバーが動く
- **C.** HTTP通信を使わなくなる
- **D.** SQLiteしか使えなくなる

**第9問（3層アーキテクチャの責務分離）**
Webアプリケーションを「Presentation（Controller/View）」「Business Logic（Service/Model）」「Data Access（DAO/Repository）」の3層に分ける目的として最も適切なものはどれですか？
- **A.** 画面表示・業務ルール・DB操作の責務を分離し、変更やテストをしやすくするため
- **B.** ファイル数を増やして難しく見せるため
- **C.** コンパイル時間を長くするため
- **D.** CSSを動かなくするため

**第10問（全14回の総括）**
基礎構文・オブジェクト指向・Web(Servlet/JSP)・DB(JDBC/SQL)・JSON API・JUnitテスト・Maven/Spring Boot を通して、これからのJava開発で最も大切な姿勢はどれですか？
- **A.** 小さく動かして検証し（MEP/単体テスト）、責務ごとにクラスを分けて（MVC/DAO）、公式ドキュメントやエラーログ（スタックトレース）を読みながら改善を続けること
- **B.** 1000行の処理をすべて1つの `main` メソッドに書くこと
- **C.** エラーが出たら原因を読まずに毎回最初から作り直すこと
- **D.** テストも入力チェックも一切書かないこと

<details>
<summary>✅ 確認テスト（全10問）の解答と解説を見る</summary>

| 問題 | 正解 | 解説 |
| :---: | :---: | :--- |
| **第1問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | Mavenでは `pom.xml`（Project Object Model）に依存関係やビルド設定を記述します。 |
| **第2問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `mvn test` でプロジェクト内の単体テストを一括実行できます。 |
| **第3問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 本番コードは `src/main/java`、テストコードは `src/test/java` に配置するのがMavenの標準規約です。 |
| **第4問** | <span style="color: #d32f2f; font-weight: bold;">B</span> | `@RestController` を使うと、戻り値のオブジェクトやリストが自動的にJSONへシリアライズされます。 |
| **第5問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | `@GetMapping` と `@PostMapping` でHTTPメソッドごとの処理を簡潔に記述できます。 |
| **第6問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 部品の生成と結合を外部（DIコンテナ）に任せることで、結合度が下がり単体テストが圧倒的に書きやすくなります。 |
| **第7問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | クエリ文字列やフォームのパラメータ受け取りには `@RequestParam` を使います（JSONボディには `@RequestBody`）。 |
| **第8問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 組み込みサーバー（Embedded Tomcat）により、クラウドやDockerへのデプロイも極めて簡単になります。 |
| **第9問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 関心事の分離（Separation of Concerns）により、UI変更やDB移行時の影響範囲を局所化できます。 |
| **第10問** | <span style="color: #d32f2f; font-weight: bold;">A</span> | 基礎概念・設計・テスト・エラー読解の積み重ねが、どんなフレームワークでも通用するエンジニア力になります！ |

</details>

---

<div style="background: #e8f5e9; border: 2px solid #2e7d32; padding: 20px; border-radius: 12px; margin-top: 28px; text-align: center; color: #1b5e20;">
  <h2 style="margin-top: 0; color: #2e7d32;">🎓 全14回カリキュラム完走、おめでとうございます！</h2>
  <p style="margin-bottom: 0; color: #1e293b;">
    Javaの基本文法から始まり、オブジェクト指向・Servlet/JSP・SQL/JDBC・JSON API・JUnitテスト・Maven/Spring Boot入門まで完走しました！<br>
    ゲームアプリ（<code>./run_game.sh</code>）のランダム試験やコード構築パズルにも挑戦して、知識を一生モノのスキルに定着させましょう！
  </p>
</div>

<div style="display: flex; justify-content: space-between; margin-top: 20px;">
  <a href="./lesson13.md">👈 第13回へ戻る</a>
  <a href="./README.md" style="font-weight: bold; color: #0d47a1;">🏠 カリキュラム目次トップへ戻る</a>
</div>
