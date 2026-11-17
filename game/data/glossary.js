(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JavaQuestGlossary = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TERMS = [
    {
      id: 'compile',
      term: 'コンパイル',
      reading: 'compile / コンパイラ (javac)',
      category: '基礎・実行',
      stage: '第1章',
      short: '人間が書いたJavaのプログラム（.java）を、コンピュータが読める専用の言葉（バイトコード .class）に翻訳する作業のこと。',
      detail:
        '私たちが書いた日本語・英語に近いプログラムは、そのままではコンピュータが直接理解できません。そこで「javac」という翻訳機を使って機械向けの言葉に一括変換します。セミコロン忘れなどの文法ミスがあると、この時点で「コンパイルエラー」として教えてくれます。',
      example: 'javac KakeiboStart.java  // .java を .class に翻訳！',
      aliases: ['コンパイル', 'コンパイラ', 'javac'],
    },
    {
      id: 'source_code',
      term: 'ソースコード',
      reading: 'Source Code (.java)',
      category: '基礎・実行',
      stage: '第1章',
      short: '人間が読み書きできるプログラミング言語で書かれたテキストファイルのこと。',
      detail:
        'Javaでは拡張子を「.java」にして保存します。料理でいえば「レシピの文字データ」にあたり、これをコンパイル（翻訳）してプログラムを動かします。',
      example: 'Sample1.java',
      aliases: ['ソースコード', 'ソースファイル'],
    },
    {
      id: 'bytecode',
      term: 'バイトコード',
      reading: 'Bytecode (.class)',
      category: '基礎・実行',
      stage: '第1章',
      short: 'コンパイルによって生成される、Java仮想マシン（JVM）専用の中間ファイル。',
      detail:
        '特定のパソコン（WindowsやMacやUbuntu）専用ではなく、JVMが読める共通の命令書に変換されたものです。このおかげで「一度書けばどこでも動く」が実現できます。',
      example: 'javac Sample1.java → Sample1.class が生成される',
      aliases: ['バイトコード', 'クラスファイル'],
    },
    {
      id: 'jdk',
      term: 'JDK',
      reading: 'Java Development Kit',
      category: '基礎・実行',
      stage: '第1章',
      short: 'Javaプログラムを「作って・翻訳して・動かす」ための道具が一式入った開発キット。',
      detail:
        '翻訳機（javac）、実行エンジン（java）、便利な標準部品集などがすべてセットになっています。Ubuntuでは「sudo apt install default-jdk」で入れられます。',
      example: 'javac -version  // JDKが入っているか確認',
      aliases: ['JDK'],
    },
    {
      id: 'jvm',
      term: 'JVM',
      reading: 'Java Virtual Machine（Java仮想マシン）',
      category: '基礎・実行',
      stage: '第1章',
      short: 'コンパイル後のバイトコード（.class）を読み取って実際に動かす「仮想のコンピュータ」。',
      detail:
        'Windows・Mac・UbuntuなどOSごとの違いをJVMが吸収してくれるため、同じJavaのバイトコードがどのパソコンでも同じように動作します。',
      example: 'java Sample1  // JVMを起動して実行！',
      aliases: ['JVM', 'Java仮想マシン'],
    },
    {
      id: 'main_method',
      term: 'mainメソッド',
      reading: 'public static void main(String[] args)',
      category: '基礎・実行',
      stage: '第1章',
      short: 'Javaプログラムを実行したとき、一番最初にスタートする「玄関（開始地点）」のメソッド。',
      detail:
        'どんなに長いプログラムでも、Javaはまずこの main メソッドの1行目から順番に実行を始めます。綴りを1文字でも変えると起動できなくなります。',
      example: 'public static void main(String[] args) { ... }',
      aliases: ['mainメソッド', 'main メソッド'],
    },
    {
      id: 'variable',
      term: '変数・データ型',
      reading: 'Variable / Data Type',
      category: '基礎・実行',
      stage: '第1章',
      short: 'データを入れておく「名前付きの箱」と、その箱に入るデータの種類（整数・小数・文字など）の決まり。',
      detail:
        'Javaでは箱を作るときに「何専用の箱か（型）」を先に決めます。整数は int、小数は double、文字列は String（先頭大文字）、真偽値は boolean を使います。',
      example: 'int price = 980;\nString name = "ランチ";',
      aliases: ['データ型', '基本データ型', '変数'],
    },
    {
      id: 'cast',
      term: 'キャスト（型変換）',
      reading: 'Cast',
      category: '基礎・実行',
      stage: '第1章',
      short: 'ある型の値を、別の型へ強制的に変換すること。',
      detail:
        'たとえば小数（double）の計算結果を整数の箱（int）に入れたいとき、そのままでは小数点以下が消えて危険なためエラーになります。前に「(int)」を付けて「切り捨てていいから整数にして！」と明示します。',
      example: 'int taxIncluded = (int)(1000 * 1.1); // 1100',
      aliases: ['キャスト', '型変換'],
    },
    {
      id: 'branch',
      term: '条件分岐',
      reading: 'if / else / switch',
      category: '構文・制御',
      stage: '第2章',
      short: '「もし〇〇ならAをする、そうでなければBをする」のように条件によって動きを分ける仕組み。',
      detail:
        '数値の一致は「==」ですが、文字列（String）の中身が同じか比べるときは「.equals("文字")」を使うのがJavaの重要ルールです！',
      example: 'if (balance < 0) { System.out.println("赤字！"); }',
      aliases: ['条件分岐', 'if文', 'switch文'],
    },
    {
      id: 'loop',
      term: '繰り返し（ループ）',
      reading: 'for / while',
      category: '構文・制御',
      stage: '第2章',
      short: '同じような処理をコンピュータに何度も自動で繰り返させる仕組み。',
      detail:
        '「10回繰り返す」など回数が決まっているときは for文、「0が入力されるまで続ける」など終了条件で繰り返すときは while文 を使います。途中で抜けるときは break; を使います。',
      example: 'for (int i = 0; i < 5; i++) { ... }',
      aliases: ['繰り返し', 'ループ', 'for文', 'while文', '拡張for文'],
    },
    {
      id: 'array',
      term: '配列',
      reading: 'Array (型[])',
      category: '構文・制御',
      stage: '第2章',
      short: '同じ種類のデータを連続で並べて管理できる「番号付きのロッカー」。',
      detail:
        'ロッカーの番号（添字・インデックス）は「0番」から始まります。3個分の配列を作った場合、使える番号は 0, 1, 2 です。要素数は「配列名.length」で取得します。',
      example: 'int[] prices = {1200, 480, 650};\n// prices[0] は 1200',
      aliases: ['配列'],
    },
    {
      id: 'class',
      term: 'クラス',
      reading: 'class（設計図）',
      category: 'オブジェクト指向',
      stage: '第3章',
      short: '関連する「データ（フィールド）」と「処理（メソッド）」をひとまとめにした設計図（たい焼きの型）。',
      detail:
        'Javaではすべてのプログラムをクラスの中に書きます。設計図そのものにはまだ具体的なデータは入っておらず、「new」を使って実体（インスタンス）を作ってから使います。',
      example: 'class KakeiboItem { String name; int price; }',
      aliases: ['クラス'],
    },
    {
      id: 'instance',
      term: 'インスタンス',
      reading: 'Instance / Object (new)',
      category: 'オブジェクト指向',
      stage: '第3章',
      short: 'クラス（設計図）から「new」を使って実際にメモリ上に生み出した実体（焼けたたい焼き1個1個）。',
      detail:
        '1つの「KakeiboItemクラス（設計図）」から、「ランチの明細」「電車代の明細」のように何個でも別々のインスタンスを作ることができます。',
      example: 'KakeiboItem item = new KakeiboItem("食費", 850);',
      aliases: ['インスタンス', 'オブジェクト'],
    },
    {
      id: 'method',
      term: 'メソッド',
      reading: 'Method',
      category: 'オブジェクト指向',
      stage: '第3章',
      short: 'クラスの中に定義する「具体的なお仕事・機能」のまとまり。',
      detail:
        '自動販売機に例えると、お金（引数）を入れると中で処理が行われてジュース（戻り値）が出てくる仕組みです。何度も使う計算や表示処理をメソッドにするとスッキリします。',
      example: 'int calcTax(int price) { return (int)(price * 1.1); }',
      aliases: ['メソッド'],
    },
    {
      id: 'argument_return',
      term: '引数と戻り値',
      reading: 'ひきすう / もどりち (return / void)',
      category: 'オブジェクト指向',
      stage: '第3章',
      short: 'メソッドに渡す「材料」が引数、処理後に「return」で返ってくる「結果」が戻り値。',
      detail:
        '「戻り値」を返さずに画面表示などをして終わるメソッドには、戻り値の型の場所に「void（空っぽ）」と書きます。',
      example: 'int add(int a, int b) { return a + b; }\nvoid show() { ... }',
      aliases: ['引数', '戻り値'],
    },
    {
      id: 'constructor',
      term: 'コンストラクタ',
      reading: 'Constructor',
      category: 'オブジェクト指向',
      stage: '第3章',
      short: '「new」でインスタンスを作った瞬間に自動で1回だけ動く、初期設定専用のメソッド。',
      detail:
        '①名前をクラス名と完全に同じにする、②戻り値の型（voidも含む）を書かない、という2つのルールがあります。フィールドの初期値をセットするのに使います。',
      example: 'public KakeiboItem(String name, int price) {\n  this.name = name;\n  this.price = price;\n}',
      aliases: ['コンストラクタ'],
    },
    {
      id: 'encapsulation',
      term: 'カプセル化',
      reading: 'Encapsulation (private / Getter / Setter)',
      category: 'オブジェクト指向',
      stage: '第3章',
      short: 'フィールドを「private」にして外から勝手に書き換えられないように守り、専用の窓口メソッド経由で扱う設計法。',
      detail:
        '「金額に -9999円 を直接入れられる」といった事故を防ぐため、データは private で鍵をかけ、値を読む getPrice()（Getter）や設定する setPrice()（Setter）だけを公開します。',
      example: 'private int price;\npublic int getPrice() { return this.price; }',
      aliases: ['カプセル化', 'Getter', 'Setter', 'getter', 'setter'],
    },
    {
      id: 'inheritance',
      term: '継承',
      reading: 'Inheritance (extends / super)',
      category: 'オブジェクト指向',
      stage: '第4章',
      short: '親クラスのフィールドやメソッドを、子クラスが「extends」でそのまま引き継いで拡張する仕組み。',
      detail:
        '「収入」と「支出」の共通部分を親クラス「Record」にまとめておけば、子クラスで同じコードを何度も書かずに済みます。親のコンストラクタを呼ぶときは「super(...)」を使います。',
      example: 'class IncomeRecord extends Record { ... }',
      aliases: ['継承', 'extends', 'スーパークラス', 'サブクラス'],
    },
    {
      id: 'override',
      term: 'オーバーライド',
      reading: 'Override（上書き再定義）',
      category: 'オブジェクト指向',
      stage: '第4章',
      short: '親クラスから引き継いだメソッドを、子クラス側で同じ名前・引数のまま自分専用の動きに書き換えること。',
      detail:
        '同じ名前の「オーバーロード（同じクラス内で引数の違う同名メソッドを作ること）」と混同しやすいので注意！上書き目印として「@Override」を上に書きます。',
      example: '@Override\npublic int getBalanceEffect() { return -this.amount; }',
      aliases: ['オーバーライド', 'オーバーロード'],
    },
    {
      id: 'interface',
      term: 'インターフェース',
      reading: 'interface / implements',
      category: 'オブジェクト指向',
      stage: '第4章',
      short: '「このメソッドを必ず持っています」という共通のルール（規格書）を定めたもの。',
      detail:
        'USB規格のように、中身のないメソッド名だけを宣言しておき、クラス側で「implements インターフェース名」と書くことでそのルールの実装を約束させます。',
      example: 'interface Searchable { boolean matches(String kw); }',
      aliases: ['インターフェース', 'implements'],
    },
    {
      id: 'exception',
      term: '例外処理',
      reading: 'Exception (try-catch)',
      category: '例外・コレクション',
      stage: '第5章',
      short: '実行中の予期せぬエラー（例外）でアプリが強制終了しないよう、「try-catch」で受け止めて対処する仕組み。',
      detail:
        '「try { 危険な処理 } catch (例外型 e) { エラー時の対処 }」の形を書きます。数字以外を Integer.parseInt すると NumberFormatException などが起きます。',
      example: 'try { int n = Integer.parseInt(s); } catch (NumberFormatException e) { ... }',
      aliases: ['例外処理', 'try-catch', '例外'],
    },
    {
      id: 'nullpointer',
      term: 'NullPointerException',
      reading: 'ヌルポインタ例外（通称：ぬるぽ）',
      category: '例外・コレクション',
      stage: '第5章',
      short: '中身が空っぽ（null）の変数に対して「.equals()」や「.length()」などのメソッドを呼ぶと起きる超頻出エラー。',
      detail:
        '「箱の中にまだ何も実体が入っていないのに、お仕事を頼もうとした」ときに発生します。使う前に「if (str != null)」でチェックするのが鉄則です。',
      example: 'if (keyword != null && keyword.contains("食費")) { ... }',
      aliases: ['NullPointerException', 'ヌルポ'],
    },
    {
      id: 'arraylist',
      term: 'ArrayList',
      reading: 'アレイリスト（コレクション）',
      category: '例外・コレクション',
      stage: '第5章',
      short: '通常の配列と違い、あとから何件でもデータを追加（add）・削除（remove）できる伸び縮み自在のリスト。',
      detail:
        '配列の「.length」ではなく「.size()」で件数を調べ、「.get(i)」で要素を取り出します。Web家計簿の明細一覧でも主役として活躍します。',
      example: 'ArrayList<String> list = new ArrayList<>();\nlist.add("食費");',
      aliases: ['ArrayList', 'コレクション'],
    },
    {
      id: 'http',
      term: 'HTTPリクエスト・レスポンス',
      reading: 'HTTP Request / Response',
      category: 'Web・Servlet・JSP',
      stage: '第6章',
      short: 'ブラウザからサーバーへの「要求（リクエスト）」と、サーバーからブラウザへの「返事（レスポンス）」のやり取り。',
      detail:
        'Webアプリはこのキャッチボールで動いています。Servletの「doGet(request, response)」の2つの引数は、まさにこの要求と返事の窓口です。',
      example: 'ブラウザ ──リクエスト(URL)──▶ サーバー ──レスポンス(HTML)──▶ ブラウザ',
      aliases: ['HTTPリクエスト', 'HTTPレスポンス', 'HTTP', 'リクエスト', 'レスポンス'],
    },
    {
      id: 'tomcat',
      term: 'Tomcat',
      reading: 'Apache Tomcat（トムキャット）',
      category: 'Web・Servlet・JSP',
      stage: '第6章',
      short: 'Javaで作られたServletやJSPをブラウザ向けに動かすためのWebアプリケーションサーバー。',
      detail:
        '普通のHTMLはファイルを開くだけで見られますが、Javaが動くWeb画面（Servlet/JSP）はTomcatという専用エンジンの中で動かします。',
      example: 'http://localhost:8080/mykakeibo/',
      aliases: ['Tomcat', 'トムキャット'],
    },
    {
      id: 'servlet',
      term: 'Servlet',
      reading: 'サーブレット (HttpServlet)',
      category: 'Web・Servlet・JSP',
      stage: '第6章',
      short: 'Webサーバー上で動き、ブラウザからのリクエストを受け取ってJavaの処理や計算を行うクラス。',
      detail:
        '「HttpServlet」を継承して作り、「@WebServlet("/url")」でどのURLを担当するかを指定します。受け取りやデータ処理の司令塔（Controller）が得意です。',
      example: '@WebServlet("/hello")\npublic class HelloServlet extends HttpServlet { ... }',
      aliases: ['Servlet', 'サーブレット', 'HttpServlet'],
    },
    {
      id: 'jsp',
      term: 'JSP',
      reading: 'JavaServer Pages (.jsp)',
      category: 'Web・Servlet・JSP',
      stage: '第7章',
      short: 'HTMLファイルの中に「<%= 変数 %>」のようにJavaを埋め込んで、綺麗なWeb画面を作る技術。',
      detail:
        'Servletの中に何十行もHTMLを書くのは大変なので、見た目のデザインはJSPに任せます。コンパイル不要で保存するだけですぐ反映されます。',
      example: '<p>残高：<%= balance %>円</p>',
      aliases: ['JSP'],
    },
    {
      id: 'get_post',
      term: 'GET と POST',
      reading: 'HTTPメソッド (doGet / doPost)',
      category: 'Web・Servlet・JSP',
      stage: '第7章',
      short: '画面閲覧や検索に使う「GET」と、データの登録・更新・削除に使う「POST」の2つの送信方式。',
      detail:
        'GETはURLの後ろに条件が見える（?keyword=食費）ためブックマーク向き。POSTは封筒に入れて送るため大量データや登録・削除処理に向いています。',
      example: '<form action="app" method="post">...</form>',
      aliases: ['doGet', 'doPost', 'GET', 'POST'],
    },
    {
      id: 'mvc',
      term: 'MVCモデル',
      reading: 'Model / View / Controller',
      category: 'Web設計・永続化',
      stage: '第8章',
      short: 'アプリを「データ(Model)」「画面(View)」「司令塔(Controller)」の3つに役割分担する王道設計。',
      detail:
        'Javaクラス（KakeiboItem）がModel、JSPがView、ServletがControllerを担当します。役割を分けることでプログラムが整理され、修正しやすくなります。',
      example: 'Browser → Servlet(C) → Model(M) → JSP(V)',
      aliases: ['MVCモデル', 'MVC'],
    },
    {
      id: 'forward_redirect',
      term: 'フォワードとリダイレクト',
      reading: 'Forward / Redirect',
      category: 'Web設計・永続化',
      stage: '第8章',
      short: 'サーバー内部でJSPに画面表示をバトンタッチするのがフォワード、ブラウザに別URLへの再アクセスを指示するのがリダイレクト。',
      detail:
        '登録処理（POST）のあとにフォワードするとF5更新で二重登録が起きてしまうため、登録後はリダイレクト（PRGパターン）でGETへ誘導するのが定石です。',
      example: 'request.getRequestDispatcher("/WEB-INF/app.jsp").forward(req, res);\nresponse.sendRedirect("app");',
      aliases: ['フォワード', 'リダイレクト', 'PRGパターン'],
    },
    {
      id: 'scope',
      term: 'スコープ',
      reading: 'リクエストスコープ / セッションスコープ',
      category: 'Web設計・永続化',
      stage: '第8章',
      short: 'ServletからJSPへデータを渡すための「共有荷物置き場」（setAttribute / getAttribute）。',
      detail:
        '1回の画面表示で消えるのが「リクエストスコープ（request）」、ページを移動してもブラウザを閉じるまで残るのが「セッションスコープ（session）」です。',
      example: 'request.setAttribute("balance", 30000);',
      aliases: ['スコープ', 'リクエストスコープ', 'セッションスコープ', 'setAttribute', 'getAttribute'],
    },
    {
      id: 'dao',
      term: 'DAOパターン',
      reading: 'Data Access Object / 永続化',
      category: 'Web設計・永続化',
      stage: '第9章',
      short: 'CSVファイルやデータベースへの「保存・読み込み・削除」だけを専門に担当するクラス設計のこと。',
      detail:
        '保存処理をDAO（KakeiboDAO）に切り出しておくと、保存先をCSVからデータベースに変えてもServletやJSPをほとんど修正せずに済みます。',
      example: 'ArrayList<KakeiboItem> list = dao.findAll();',
      aliases: ['DAOパターン', 'DAO', '永続化'],
    },
    {
      id: 'validation',
      term: 'バリデーション',
      reading: 'Validation（入力値検証）',
      category: 'Web設計・永続化',
      stage: '第10章',
      short: '空文字やマイナス金額などの不正な入力をサーバー側でチェックして弾く仕組み。',
      detail:
        'HTMLの required だけでは開発者ツール等で書き換えられてしまうため、必ずJava（Servlet）側でも中身をチェックします。',
      example: 'if (name == null || name.trim().isEmpty() || amount <= 0) { ... }',
      aliases: ['バリデーション'],
    },
    {
      id: 'xss',
      term: 'XSS対策（HTMLエスケープ）',
      reading: 'クロスサイトスクリプティング',
      category: 'Web設計・永続化',
      stage: '第10章',
      short: '入力欄に悪意ある <script> タグなどを混ぜる攻撃を防ぐため、< や > を無害な文字（&lt; 等）に変換すること。',
      detail:
        'ユーザーの入力値をそのままJSPのHTMLに出力するとスクリプトが動いてしまう危険があります。必ずエスケープしてから画面に表示します。',
      example: 'name.replace("<", "&lt;").replace(">", "&gt;")',
      aliases: ['XSS', 'HTMLエスケープ', 'サニタイジング'],
    },
    {
      id: 'sql_jdbc',
      term: 'SQL と JDBC',
      reading: 'RDB / PreparedStatement / SQLインジェクション',
      category: 'DB・API・実務発展',
      stage: '第11章',
      short: 'データベースを操作する言語がSQL、JavaからDBへ接続する標準窓口がJDBC。',
      detail:
        'SQLの文字列を「+」で結合すると危険な攻撃（SQLインジェクション）を受けるため、必ず「?」プレースホルダを使う PreparedStatement を利用します。',
      example: 'PreparedStatement ps = conn.prepareStatement("SELECT * FROM kakeibo WHERE id = ?");',
      aliases: ['SQL', 'JDBC', 'PreparedStatement', 'SQLインジェクション', 'CRUD'],
    },
    {
      id: 'stream_json',
      term: 'Stream API と JSON',
      reading: 'ラムダ式 / REST API',
      category: 'DB・API・実務発展',
      stage: '第12章',
      short: 'リストの絞り込みや集計を1行で書けるのがStream API、Webでデータをやり取りする共通書式がJSON。',
      detail:
        'HashMapやStream APIを使うと費目別合計などが簡潔に書けます。またHTMLの代わりにJSONを返すと、画面再読込なしの非同期更新ができます。',
      example: 'list.stream().filter(i -> !i.isIncome()).mapToInt(KakeiboItem::getAmount).sum();',
      aliases: ['Stream API', 'JSON', 'HashMap', 'ラムダ式', 'REST API'],
    },
    {
      id: 'junit',
      term: 'JUnit（単体テスト）',
      reading: 'Unit Test / @Test / assertEquals',
      category: 'DB・API・実務発展',
      stage: '第13章',
      short: 'メソッドが正しく動くかを自動で検証するテストの仕組み。コード修正時の先祖返りバグ（デグレード）を防ぎます。',
      detail:
        '「準備(Arrange) → 実行(Act) → 検証(Assert)」のAAAパターンでテストを書き、想定外の入力（境界値やマイナス値）もテストします。',
      example: '@Test\nvoid testTax() { assertEquals(1100, calcTax(1000)); }',
      aliases: ['JUnit', '単体テスト', 'デグレード'],
    },
    {
      id: 'spring_boot',
      term: 'Maven と Spring Boot / DI',
      reading: 'ビルドツール / 依存性注入',
      category: 'DB・API・実務発展',
      stage: '第14章',
      short: 'ライブラリ管理とビルドを自動化するツールがMaven、実務のJava Web開発の主流フレームワークがSpring Boot。',
      detail:
        'Mavenの pom.xml に必要な部品を書くだけで自動取得・コンパイル・テストができます。Spring BootのDI（依存性注入）は必要なDAOやServiceを自動で繋いでくれます。',
      example: '@RestController\npublic class KakeiboController { ... }',
      aliases: ['Maven', 'Spring Boot', 'DI', '依存性注入', 'pom.xml'],
    },
  ];

  // Build lookup index sorted by alias length descending so longer specific terms match first
  const ALIAS_RULES = [];
  for (const entry of TERMS) {
    const allNames = [entry.term, ...(entry.aliases || [])];
    const seen = new Set();
    for (const rawAlias of allNames) {
      if (!rawAlias || seen.has(rawAlias)) continue;
      seen.add(rawAlias);
      ALIAS_RULES.push({ alias: rawAlias, entry });
    }
  }
  ALIAS_RULES.sort((a, b) => b.alias.length - a.alias.length);

  function getTermById(id) {
    return TERMS.find((t) => t.id === id) || null;
  }

  function findTermsInText(text) {
    const src = String(text || '');
    if (!src) return [];
    const found = [];
    const seenIds = new Set();

    for (const rule of ALIAS_RULES) {
      if (seenIds.has(rule.entry.id)) continue;
      if (isAsciiWord(rule.alias)) {
        const re = new RegExp(`(?<![A-Za-z0-9_])${escapeRegex(rule.alias)}(?![A-Za-z0-9_])`);
        if (re.test(src)) {
          seenIds.add(rule.entry.id);
          found.push(rule.entry);
        }
      } else if (src.includes(rule.alias)) {
        seenIds.add(rule.entry.id);
        found.push(rule.entry);
      }
    }
    return found;
  }

  function isAsciiWord(str) {
    return /^[A-Za-z0-9_. -]+$/.test(str);
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Highlight glossary terms ONLY in plain-text segments outside HTML tags, <pre>, <code>, <a>, <button>, <summary>
  function annotateHtmlWithGlossary(html) {
    const src = String(html || '');
    if (!src) return '';

    const tokenRe = /(<pre\b[\s\S]*?<\/pre>|<code\b[\s\S]*?<\/code>|<a\b[\s\S]*?<\/a>|<button\b[\s\S]*?<\/button>|<summary\b[\s\S]*?<\/summary>|<[^>]+>)/gi;
    const parts = src.split(tokenRe);
    const linkedCounts = Object.create(null);

    // Build combined regex from aliases (top safe aliases)
    const patternStrings = ALIAS_RULES.map((r) => {
      const esc = escapeRegex(r.alias);
      return isAsciiWord(r.alias) ? `(?<![A-Za-z0-9_])${esc}(?![A-Za-z0-9_])` : esc;
    });
    const combinedRe = new RegExp(`(${patternStrings.join('|')})`, 'g');
    const aliasToEntry = new Map();
    for (const r of ALIAS_RULES) {
      if (!aliasToEntry.has(r.alias)) aliasToEntry.set(r.alias, r.entry);
    }

    return parts
      .map((part) => {
        if (!part) return '';
        if (part.startsWith('<')) return part;
        return part.replace(combinedRe, (match) => {
          const entry = aliasToEntry.get(match);
          if (!entry) return match;
          // Limit auto-linking noise: highlight each term up to 2 times in a single block
          const count = linkedCounts[entry.id] || 0;
          if (count >= 2) return match;
          linkedCounts[entry.id] = count + 1;
          return `<button type="button" class="glossary-inline" data-glossary-id="${escapeHtml(entry.id)}" title="${escapeHtml(entry.short)}">${match}</button>`;
        });
      })
      .join('');
  }

  return {
    TERMS,
    getTermById,
    findTermsInText,
    annotateHtmlWithGlossary,
  };
});
