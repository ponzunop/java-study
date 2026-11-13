(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.JavaQuestStages = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return [
  {
    "id": 1,
    "lessonFile": "../lesson01.md",
    "title": "第1章：開発環境と変数・演算の草原",
    "subtitle": "JDK・mainメソッド・基本データ型・キーボード入力",
    "areaName": "始まりのコンパイル草原",
    "story": "Javaの旅はここから始まる！`javac` でソースコードを翻訳し、`java` で実行する魔法を身につけて、最初の「お小遣い計算機」を起動しよう。",
    "monster": {
      "name": "セミコロン忘れスライム",
      "title": "構文エラーの初級魔物",
      "emoji": "🟢",
      "color": "#22c55e",
      "maxHp": 100,
      "intro": "「文の終わりに `;` を付け忘れると、コンパイルを通さないぞ！」",
      "defeat": "「ぐぬぬ… `javac` と `int` 型を完璧に使いこなすとは…！」"
    },
    "badge": {
      "id": "badge_01",
      "name": "コンパイルの証",
      "icon": "⚔️"
    },
    "tips": [
      {
        "title": "コンパイルと実行",
        "code": "javac KakeiboStart.java\njava KakeiboStart",
        "note": "ファイル名と public class 名は大文字小文字まで一致させる。実行時は .class を付けない！"
      },
      {
        "title": "基本の4つの型",
        "code": "int price = 1280;\ndouble tax = 0.1;\nString item = \"ランチ\";\nboolean isPaid = true;",
        "note": "整数は int、小数は double、文字列は先頭大文字の String。"
      },
      {
        "title": "演算と代入",
        "code": "balance += 500; // 加算代入\nint avg = (int)(total * 1.08);",
        "note": "整数同士の除算は小数点以下が切り捨てられる。文字列連結の左結合にも注意。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_01_1",
        "title": "最初のクラスと main メソッドを修復せよ",
        "description": "お小遣い計算機を起動する `KakeiboStart.java` の空欄 [1] と [2] に入る正しいキーワードを選ぼう。",
        "codeTemplate": "public [1] KakeiboStart {\n    public static void [2](String[] args) {\n        int income = 5000;\n        System.out.println(\"収入: \" + income);\n    }\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "class",
              "def",
              "function",
              "struct"
            ],
            "answer": "class"
          },
          {
            "label": "[2]",
            "options": [
              "main",
              "start",
              "run",
              "init"
            ],
            "answer": "main"
          }
        ],
        "hint": "Javaの設計図は class で宣言し、プログラムは main メソッドから始まります。",
        "explanation": "Javaは `public class クラス名` の中に `public static void main(String[] args)` を書くことで実行できます。"
      },
      {
        "id": "q_01_2",
        "title": "税込計算のキャストとセミコロン",
        "description": "1000円の支出に消費税10%（1.1倍）を掛けて整数 `int` として保存するコードを完成させよう。",
        "codeTemplate": "int price = 1000;\nint total = [1](price * 1.1)[2]",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "(int)",
              "(double)",
              "int",
              "(String)"
            ],
            "answer": "(int)"
          },
          {
            "label": "[2]",
            "options": [
              ";",
              ":",
              ".",
              ","
            ],
            "answer": ";"
          }
        ],
        "hint": "小数の計算結果を int 変数に入れるには強制型変換（キャスト）が必要です。",
        "explanation": "`(int)(price * 1.1);` と書くことで double の結果を int に切り捨て変換し、文末に `;` を付けます。"
      }
    ],
    "codePuzzle": {
      "id": "p_01",
      "title": "Javaプログラムの実行ステップ順",
      "description": "最初のJavaプログラムを書いて画面に結果が出るまでの正しい手順順に並べ替えよう。",
      "steps": [
        "KakeiboStart.java ファイルを作成する",
        "public class KakeiboStart の中に main メソッドを書く",
        "javac KakeiboStart.java でバイトコードにコンパイルする",
        "java KakeiboStart でプログラムを実行する"
      ],
      "hint": "まずソースファイルを書き、javac で翻訳してから java で実行します。",
      "explanation": "Javaは「記述 → javac（コンパイル） → java（実行）」の流れで動きます。"
    },
    "questions": [
      {
        "id": "L01_Q01",
        "no": 1,
        "topic": "ファイル名とクラス名のルール",
        "prompt": "`public class KakeiboStart { ... }` で始まるプログラムを保存するとき、正しいファイル名はどれですか？",
        "choices": {
          "A": "`kakeibostart.java`",
          "B": "`KakeiboStart.class`",
          "C": "`KakeiboStart.java`",
          "D": "何でもよい"
        },
        "answer": "C",
        "explanation": "クラス名と大文字・小文字まで一致させ、拡張子を `.java` にします（`KakeiboStart.java`）。"
      },
      {
        "id": "L01_Q02",
        "no": 2,
        "topic": "コンパイルと実行のコマンド",
        "prompt": "`TestApp.java` をコンパイルし、その後実行するためのコマンドの組み合わせとして正しいものはどれですか？",
        "choices": {
          "A": "コンパイル：`java TestApp.java` ／ 実行：`javac TestApp`",
          "B": "コンパイル：`javac TestApp.java` ／ 実行：`java TestApp`",
          "C": "コンパイル：`javac TestApp.java` ／ 実行：`java TestApp.class`",
          "D": "コンパイル：`compile TestApp.java` ／ 実行：`run TestApp`"
        },
        "answer": "B",
        "explanation": "コンパイルは `javac ファイル名.java`、実行は拡張子なしの `java クラス名` です。"
      },
      {
        "id": "L01_Q03",
        "no": 3,
        "topic": "メソッドの役割",
        "prompt": "Javaプログラムを実行したとき、一番最初に呼び出されて処理がスタートする特別なメソッドの名前はどれですか？",
        "choices": {
          "A": "`start`",
          "B": "`class`",
          "C": "`system`",
          "D": "`main`"
        },
        "answer": "D",
        "explanation": "Javaプログラムは `main` メソッドから処理が始まります。"
      },
      {
        "id": "L01_Q04",
        "no": 4,
        "topic": "画面出力の違い",
        "prompt": "以下のプログラムを実行したとき、画面にどのように表示されますか？\n```java\nSystem.out.print(\"収入：\");\nSystem.out.println(5000);\nSystem.out.println(\"円\");\n```",
        "choices": {
          "A": "3行に分かれて表示される",
          "B": "1行目に`収入：5000`、2行目に`円`と表示される",
          "C": "1行で`収入：5000円`と表示される",
          "D": "1行目に`収入：`、2行目に`5000円`と表示される"
        },
        "answer": "B",
        "explanation": "`print` は改行せず、`println` は表示後に改行します。"
      },
      {
        "id": "L01_Q05",
        "no": 5,
        "topic": "データ型の選択",
        "prompt": "①金額（`1280`などの整数）、②消費税率（`0.1`などの小数）、③費目名（`\"食費\"`などの文字列）を保存するデータ型の正しい組み合わせはどれですか？",
        "choices": {
          "A": "① `int` ／ ② `double` ／ ③ `String`",
          "B": "① `double` ／ ② `int` ／ ③ `string`（小文字）",
          "C": "① `String` ／ ② `double` ／ ③ `int`",
          "D": "① `int` ／ ② `boolean` ／ ③ `String`"
        },
        "answer": "A",
        "explanation": "整数は `int`、小数は `double`、文字列は先頭大文字の `String` です。"
      },
      {
        "id": "L01_Q06",
        "no": 6,
        "topic": "変数の代入と更新",
        "prompt": "以下のコードを実行したあと、画面に表示される数値はいくつですか？\n```java\nint balance = 3000;\nbalance = 2000;\nbalance += 500;\nSystem.out.println(balance);\n```",
        "choices": {
          "A": "`3000`",
          "B": "`5500`",
          "C": "`2500`",
          "D": "`2000`"
        },
        "answer": "C",
        "explanation": "`balance = 2000;` で上書きされたあと、`+= 500` で500が足されて `2500` になります。"
      },
      {
        "id": "L01_Q07",
        "no": 7,
        "topic": "整数同士の割り算と余り",
        "prompt": "`int a = 10; int b = 4;` のとき、`System.out.println((a / b) + \"と\" + (a % b));` の出力結果はどれですか？",
        "choices": {
          "A": "`2.5と0`",
          "B": "`2と2`",
          "C": "`2.5と2`",
          "D": "`3と2`"
        },
        "answer": "B",
        "explanation": "整数同士の割り算 `10 / 4` は切り捨てで `2`、余り `10 % 4` は `2` です。"
      },
      {
        "id": "L01_Q08",
        "no": 8,
        "topic": "文字列連結と計算の優先順位",
        "prompt": "`System.out.println(\"支払額：\" + 100 + 200 + \"円\");` の出力結果はどれですか？",
        "choices": {
          "A": "`支払額：300円`",
          "B": "`支払額：100200円`",
          "C": "`支払額：100+200円`",
          "D": "エラーになる"
        },
        "answer": "B",
        "explanation": "左から順番に文字列連結されるため `\"支払額：100200円\"` になります。足し算するには `(100 + 200)` とカッコで囲みます。"
      },
      {
        "id": "L01_Q09",
        "no": 9,
        "topic": "型変換・キャスト",
        "prompt": "`int price = 100;` に `1.08` を掛けて小数点以下を切り捨てた整数を `int total` に入れる正しい書き方はどれですか？",
        "choices": {
          "A": "`int total = price * 1.08;`",
          "B": "`int total = (double)(price * 1.08);`",
          "C": "`int total = (int)(price * 1.08);`",
          "D": "`int total = int(price * 1.08);`"
        },
        "answer": "C",
        "explanation": "小数を整数に変換するには `(int)` キャスト演算子を使います。"
      },
      {
        "id": "L01_Q10",
        "no": 10,
        "topic": "文の区切りと構文ルール",
        "prompt": "Javaのソースコードを書く際のルールとして、**間違っているもの**はどれですか？",
        "choices": {
          "A": "クラスやメソッドの範囲は波カッコ `{` と `}` で囲む。",
          "B": "文（命令）の終わりには、必ずコロン `:` を付ける。",
          "C": "`//` を書くと、その行の後ろの部分はコメントとして無視される。",
          "D": "英字の大文字と小文字は厳密に区別される。"
        },
        "answer": "B",
        "explanation": "文の終わりに付けるのはコロン `:` ではなく、**セミコロン `;`** です。"
      }
    ]
  },
  {
    "id": 2,
    "lessonFile": "../lesson02.md",
    "title": "第2章：分岐・ループ・配列の迷宮",
    "subtitle": "if / switch / for / while / 配列による集計",
    "areaName": "繰り返し条件の迷宮",
    "story": "1件だけの計算から、複数日分の支出をまとめて扱う段階へ！条件分岐とループ、そして連続ロッカー「配列」の力で迷宮を踏破しよう。",
    "monster": {
      "name": "無限ループ・ゴースト",
      "title": "終了条件を狂わせる亡霊",
      "emoji": "👻",
      "color": "#8b5cf6",
      "maxHp": 110,
      "intro": "「`=` と `==` や、文字列の `==` 比較でバグの迷宮へ誘ってやる…！」",
      "defeat": "「`.equals()` と `array.length` を見抜くとは恐るべし…！」"
    },
    "badge": {
      "id": "badge_02",
      "name": "配列ループの秘宝",
      "icon": "🧭"
    },
    "tips": [
      {
        "title": "文字列と数値の比較",
        "code": "if (price >= 1000 && price < 5000)\nif (category.equals(\"食費\"))",
        "note": "Stringの中身比較は == ではなく .equals() を使う。「かつ」は &&、「または」は ||。"
      },
      {
        "title": "for文とwhile文",
        "code": "for (int i = 0; i < prices.length; i++) {\n    sum += prices[i];\n}",
        "note": "配列の添字は 0 から length - 1 まで。ループ脱出は break;。"
      },
      {
        "title": "switch文と配列宣言",
        "code": "int[] prices = {450, 1200, 300};\n// prices.length は 3",
        "note": "配列の要素数はカッコなしの .length で取得する。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_02_1",
        "title": "文字列判定と論理演算を修正せよ",
        "description": "費目が \"食費\" であり、かつ金額が1000円以上のときに警告を出す条件文を完成させよう。",
        "codeTemplate": "if (category.[1](\"食費\") [2] price >= 1000) {\n    System.out.println(\"食費が高めです！\");\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "equals",
              "==",
              "same",
              "match"
            ],
            "answer": "equals"
          },
          {
            "label": "[2]",
            "options": [
              "&&",
              "||",
              "&|",
              "and"
            ],
            "answer": "&&"
          }
        ],
        "hint": "文字列の中身比較はメソッドを使い、「かつ」は論理AND演算子を使います。",
        "explanation": "`String` の中身比較は `.equals(...)`、「かつ」は `&&` を使います。"
      },
      {
        "id": "q_02_2",
        "title": "配列の合計ループを完成させよ",
        "description": "配列 `expenses` の全要素を合計する `for` 文を完成させよう。",
        "codeTemplate": "int sum = 0;\nfor (int i = 0; i < expenses.[1]; i++) {\n    sum += [2];\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "length",
              "length()",
              "size()",
              "count"
            ],
            "answer": "length"
          },
          {
            "label": "[2]",
            "options": [
              "expenses[i]",
              "expenses",
              "i",
              "expenses[0]"
            ],
            "answer": "expenses[i]"
          }
        ],
        "hint": "配列の長さはフィールド `length` で取得し、i番目の要素は `[i]` で参照します。",
        "explanation": "配列は `expenses.length`（カッコなし）、要素アクセスは `expenses[i]` です。"
      }
    ],
    "codePuzzle": {
      "id": "p_02",
      "title": "配列の合計を計算するコード組み立て",
      "description": "支出配列 `prices` の合計をループで計算して出力する正しい行順に並べよう。",
      "steps": [
        "int[] prices = {500, 1200, 800};",
        "int sum = 0;",
        "for (int i = 0; i < prices.length; i++) {",
        "    sum += prices[i];",
        "}",
        "System.out.println(\"合計: \" + sum);"
      ],
      "hint": "配列と合計用変数を最初に用意し、for ループで加算してから最後に出力します。",
      "explanation": "ループの前に `sum = 0` を初期化し、ループ終了後に結果を表示します。"
    },
    "questions": [
      {
        "id": "L02_Q01",
        "no": 1,
        "topic": "等しいかどうかの比較",
        "prompt": "変数 `int balance` の中身が `0` と等しいかどうかを判定する `if` 文の条件式として、正しいものはどれですか？",
        "choices": {
          "A": "`if (balance = 0)`",
          "B": "`if (balance == 0)`",
          "C": "`if (balance != 0)`",
          "D": "`if (balance === 0)`"
        },
        "answer": "B",
        "explanation": "`=` 1つは代入になってしまいます。等しいかどうかの比較には `==` を使います。"
      },
      {
        "id": "L02_Q02",
        "no": 2,
        "topic": "文字列の比較",
        "prompt": "`String item = \"食費\";` の中身が `\"食費\"` と一致するか判定する書き方として、最も適切なものはどれですか？",
        "choices": {
          "A": "`if (item.equals(\"食費\"))`",
          "B": "`if (item = \"食費\")`",
          "C": "`if (item >= \"食費\")`",
          "D": "`if (equals(item, \"食費\"))`"
        },
        "answer": "A",
        "explanation": "文字列（`String`）の中身が同じか比較するときは `文字列変数.equals(\"比較文字\")` を使います。"
      },
      {
        "id": "L02_Q03",
        "no": 3,
        "topic": "論理演算子",
        "prompt": "「金額 `price` が 1000以上 **かつ（なおかつ）** 5000未満」を表す条件式はどれですか？",
        "choices": {
          "A": "`1000 <= price < 5000`",
          "B": "`price >= 1000 || price < 5000`",
          "C": "`price >= 1000 && price < 5000`",
          "D": "`price >= 1000 &| price < 5000`"
        },
        "answer": "C",
        "explanation": "「A かつ B」は `&&` でつなぎます（数学のように `1000 <= price < 5000` とは書けません）。"
      },
      {
        "id": "L02_Q04",
        "no": 4,
        "topic": "if - else if の動き",
        "prompt": "`int x = 80;` のとき、以下のコードを実行すると画面に何が表示されますか？\n```java\nif (x >= 100) {\n    System.out.println(\"A\");\n} else if (x >= 50) {\n    System.out.println(\"B\");\n} else if (x >= 70) {\n    System.out.println(\"C\");\n} else {\n    System.out.println(\"D\");\n}\n```",
        "choices": {
          "A": "`B` だけ表示される",
          "B": "`B` と `C` が表示される",
          "C": "`C` だけ表示される",
          "D": "`D` が表示される"
        },
        "answer": "A",
        "explanation": "`if - else if` 文は上から順番に判定し、**最初に `true` になった1箇所だけ**を実行して全体の分岐を抜けます。`x >= 50` が `true` になるため `B` だけが表示されます。"
      },
      {
        "id": "L02_Q05",
        "no": 5,
        "topic": "for文の繰り返し回数",
        "prompt": "`for (int i = 0; i < 5; i++) { System.out.print(\"*\"); }` を実行すると、`*` は何個表示されますか？",
        "choices": {
          "A": "4個",
          "B": "5個",
          "C": "6個",
          "D": "無限に表示される"
        },
        "answer": "B",
        "explanation": "`i` が `0, 1, 2, 3, 4` の計5回繰り返されるため、`*` は5個表示されます。"
      },
      {
        "id": "L02_Q06",
        "no": 6,
        "topic": "ループの中断",
        "prompt": "`while` 文や `for` 文の途中で、繰り返し処理を強制的に終了してループの外へ抜けるために使うキーワードはどれですか？",
        "choices": {
          "A": "`stop;`",
          "B": "`exit;`",
          "C": "`return;`",
          "D": "`break;`"
        },
        "answer": "D",
        "explanation": "ループを途中で脱出するときは `break;` を使います。"
      },
      {
        "id": "L02_Q07",
        "no": 7,
        "topic": "配列の生成と添字",
        "prompt": "`int[] scores = new int[4];` と宣言したとき、使える要素の番号（添字）の組み合わせとして正しいものはどれですか？",
        "choices": {
          "A": "`scores[1]` 〜 `scores[4]`",
          "B": "`scores[0]` 〜 `scores[4]`",
          "C": "`scores[0]` 〜 `scores[3]`",
          "D": "`scores[1]` 〜 `scores[3]`"
        },
        "answer": "C",
        "explanation": "添字は `0` から始まるため、要素数4の配列は `[0], [1], [2], [3]` が使えます。"
      },
      {
        "id": "L02_Q08",
        "no": 8,
        "topic": "配列の初期化と要素の取得",
        "prompt": "`String[] days = {\"月\", \"火\", \"水\", \"木\"};` のとき、`System.out.println(days[2]);` を実行すると何が表示されますか？",
        "choices": {
          "A": "`月`",
          "B": "`火`",
          "C": "`水`",
          "D": "`木`"
        },
        "answer": "C",
        "explanation": "`days[0]`が`\"月\"`、`days[1]`が`\"火\"`、`days[2]`が`\"水\"`です。"
      },
      {
        "id": "L02_Q09",
        "no": 9,
        "topic": "配列の要素数の取得",
        "prompt": "配列 `int[] prices` に何個のデータが入っているか（配列の長さ）を取得する書き方はどれですか？",
        "choices": {
          "A": "`prices.size`",
          "B": "`prices.count()`",
          "C": "`prices.length`",
          "D": "`length(prices)`"
        },
        "answer": "C",
        "explanation": "配列の要素数は `配列名.length` で取得できます。"
      },
      {
        "id": "L02_Q10",
        "no": 10,
        "topic": "配列とfor文による合計計算",
        "prompt": "配列 `int[] nums = {10, 20, 30};` の合計を求める以下のコードの空欄 `[  ?  ]` に入る正しい式はどれですか？\n```java\nint sum = 0;\nfor (int i = 0; i < nums.length; i++) {\n    sum += [  ?  ];\n}\n```",
        "choices": {
          "A": "`i`",
          "B": "`nums`",
          "C": "`nums[i]`",
          "D": "`nums.length`"
        },
        "answer": "C",
        "explanation": "`i` 番目のロッカーの中身を取り出すには `nums[i]` と書きます。"
      }
    ]
  },
  {
    "id": 3,
    "lessonFile": "../lesson03.md",
    "title": "第3章：クラスとメソッドの設計塔",
    "subtitle": "class / new / カプセル化 / コンストラクタ",
    "areaName": "設計図の古代塔",
    "story": "【最重要回】ばらばらだった変数を1つの設計図 `KakeiboItem` クラスにまとめ、フィールドを `private` で守るオブジェクト指向の極意を習得せよ！",
    "monster": {
      "name": "カプセル破壊ゴーレム",
      "title": "不正なマイナス金額をねじ込む巨兵",
      "emoji": "🗿",
      "color": "#ef4444",
      "maxHp": 120,
      "intro": "「フィールドを public のままにしておけば、いつでも -99999円 に書き換えてやるぞ！」",
      "defeat": "「`private` とセッターの防衛線…完璧な設計図だ！」"
    },
    "badge": {
      "id": "badge_03",
      "name": "設計図の賢者章",
      "icon": "🏛️"
    },
    "tips": [
      {
        "title": "クラスとインスタンス",
        "code": "KakeiboItem item = new KakeiboItem(\"食費\", 800);",
        "note": "class が設計図、new で作られる実体がインスタンス。"
      },
      {
        "title": "カプセル化 (private / getter / setter)",
        "code": "private int price;\npublic int getPrice() { return this.price; }\npublic void setPrice(int price) {\n    if (price >= 0) this.price = price;\n}",
        "note": "フィールドは private にして、メソッド経由で安全に読み書きする。"
      },
      {
        "title": "コンストラクタ",
        "code": "public KakeiboItem(String category, int price) {\n    this.category = category;\n    this.price = price;\n}",
        "note": "クラス名と同じ名前で戻り値の型（voidも不要）を書かない特別なメソッド。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_03_1",
        "title": "KakeiboItem のカプセル化を実装せよ",
        "description": "金額フィールドを外部から直接書き換えられないように守り、コンストラクタで初期化するコードを完成させよう。",
        "codeTemplate": "public class KakeiboItem {\n    [1] int price;\n    public KakeiboItem(int price) {\n        [2].price = price;\n    }\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "private",
              "public",
              "static",
              "void"
            ],
            "answer": "private"
          },
          {
            "label": "[2]",
            "options": [
              "this",
              "self",
              "super",
              "new"
            ],
            "answer": "this"
          }
        ],
        "hint": "クラス外から隠すアクセス修飾子と、自分自身のインスタンスを指すキーワードを選びます。",
        "explanation": "`private` でフィールドを守り、引数とフィールド名が同じときは `this.price` で区別します。"
      },
      {
        "id": "q_03_2",
        "title": "戻り値のあるメソッドを定義せよ",
        "description": "税込み金額（1.1倍した整数）を計算して呼び出し元に返すメソッドを完成させよう。",
        "codeTemplate": "public [1] calcTaxIncluded() {\n    [2] (int)(this.price * 1.1);\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "int",
              "void",
              "String",
              "return"
            ],
            "answer": "int"
          },
          {
            "label": "[2]",
            "options": [
              "return",
              "print",
              "output",
              "send"
            ],
            "answer": "return"
          }
        ],
        "hint": "整数を呼び出し元に返すメソッドには戻り値の型 `int` と `return` 文が必要です。",
        "explanation": "値を返すメソッドでは戻り値の型（`int`）を宣言し、`return` で結果を返します。"
      }
    ],
    "codePuzzle": {
      "id": "p_03",
      "title": "カプセル化されたクラスの生成と利用",
      "description": "`KakeiboItem` インスタンスを `new` し、価格を更新して取得する正しい流れに並べよう。",
      "steps": [
        "KakeiboItem item = new KakeiboItem(\"食費\", 800);",
        "item.setPrice(950);",
        "int current = item.getPrice();",
        "System.out.println(current);"
      ],
      "hint": "まず new で実体を作り、setter で変更したあとに getter で値を取り出します。",
      "explanation": "コンストラクタで初期化したインスタンスに対してメソッドを呼び出します。"
    },
    "questions": [
      {
        "id": "L03_Q01",
        "no": 1,
        "topic": "クラスとインスタンスの関係",
        "prompt": "「クラス」と「インスタンス」の関係を例えた説明として、最も適切なものはどれですか？",
        "choices": {
          "A": "クラスは「変数」であり、インスタンスは「配列」である。",
          "B": "クラスは「設計図（たい焼きの型）」であり、インスタンスはそこから作られた「実体（焼けたたい焼き）」である。",
          "C": "クラスは1つしか作れないが、インスタンスはプログラム中に1個しか存在できない。",
          "D": "インスタンスからクラスを生成する。"
        },
        "answer": "B",
        "explanation": "クラスは「設計図」、そこから `new` で作られた実体が「インスタンス」です。"
      },
      {
        "id": "L03_Q02",
        "no": 2,
        "topic": "インスタンスの生成",
        "prompt": "`Kakeibo` というクラスから `k` という名前のインスタンス（オブジェクト）を新しく生成する正しいコードはどれですか？",
        "choices": {
          "A": "`Kakeibo k = Kakeibo();`",
          "B": "`new Kakeibo = k;`",
          "C": "`Kakeibo k = new Kakeibo();`",
          "D": "`class Kakeibo k = new();`"
        },
        "answer": "C",
        "explanation": "`クラス名 変数名 = new クラス名();` の形でインスタンスを生成します。"
      },
      {
        "id": "L03_Q03",
        "no": 3,
        "topic": "フィールドとメソッドへのアクセス",
        "prompt": "インスタンス `item` が持つ `price` フィールドや `show()` メソッドを使うときに、間に挟む記号はどれですか？",
        "choices": {
          "A": "コロン `:`（`item:show()`）",
          "B": "ドット `.`（`item.show()`）",
          "C": "ハイフン `-`（`item-show()`）",
          "D": "スラッシュ `/`（`item/show()`）"
        },
        "answer": "B",
        "explanation": "ドット `.` を使って `インスタンス名.フィールド名` や `インスタンス名.メソッド名()` とアクセスします。"
      },
      {
        "id": "L03_Q04",
        "no": 4,
        "topic": "戻り値がないメソッドの宣言",
        "prompt": "メソッドが処理を行うだけで、呼び出し元に値を一切返さない（`return 値;` がない）場合、メソッド名の前に書くキーワードはどれですか？",
        "choices": {
          "A": "`null`",
          "B": "`empty`",
          "C": "`void`",
          "D": "`int`"
        },
        "answer": "C",
        "explanation": "戻り値がない場合は `void` を指定します。"
      },
      {
        "id": "L03_Q05",
        "no": 5,
        "topic": "引数と戻り値の型",
        "prompt": "以下のメソッドを呼び出したとき、戻ってくる値の型は何ですか？\n```java\nString createMessage(int price) {\n    return \"金額は\" + price + \"円です\";\n}\n```",
        "choices": {
          "A": "`int` 型",
          "B": "`String` 型",
          "C": "`void` 型",
          "D": "`boolean` 型"
        },
        "answer": "B",
        "explanation": "メソッド名の直前に書かれている `String` が戻り値の型です（引数の `int` と混同しないよう注意！）。"
      },
      {
        "id": "L03_Q06",
        "no": 6,
        "topic": "複数の引数",
        "prompt": "メソッドに `int a` と `int b` の2つの引数を受け取らせたい場合、メソッド定義のカッコ内の正しい書き方はどれですか？",
        "choices": {
          "A": "`(int a, b)`",
          "B": "`(int a; int b)`",
          "C": "`(int a, int b)`",
          "D": "`(a: int, b: int)`"
        },
        "answer": "C",
        "explanation": "引数が複数ある場合は、カンマ `,` で区切ってそれぞれに型と変数名を書きます。"
      },
      {
        "id": "L03_Q07",
        "no": 7,
        "topic": "カプセル化とアクセス修飾子",
        "prompt": "クラスの外からフィールドを直接書き換えられないように保護（隠蔽）するために、フィールド宣言の前に付けるキーワードはどれですか？",
        "choices": {
          "A": "`public`",
          "B": "`private`",
          "C": "`secret`",
          "D": "`static`"
        },
        "answer": "B",
        "explanation": "`private` を付けると、そのクラスの内部からしか直接アクセスできなくなります。"
      },
      {
        "id": "L03_Q08",
        "no": 8,
        "topic": "コンストラクタのルール",
        "prompt": "`Item` クラスのコンストラクタを定義する際のルールとして、**正しいもの**はどれですか？",
        "choices": {
          "A": "メソッド名を `initItem` にし、戻り値に `void` を書く。",
          "B": "メソッド名をクラス名と同じ `Item` にし、戻り値の型は何も書かない。",
          "C": "メソッド名を `constructor` にする。",
          "D": "コンストラクタは引数を1つも受け取ることができない。"
        },
        "answer": "B",
        "explanation": "コンストラクタは「クラス名と完全に同じ名前」にし、「戻り値の型（`void`含む）を書かない」のがルールです。"
      },
      {
        "id": "L03_Q09",
        "no": 9,
        "topic": "`this` キーワードの意味",
        "prompt": "クラス内のメソッドやコンストラクタで書かれる `this.price = price;` の `this` が表しているものは何ですか？",
        "choices": {
          "A": "親クラスのこと",
          "B": "メインメソッドのこと",
          "C": "いま処理している「このインスタンス自身」のこと",
          "D": "新しく別のインスタンスを作ること"
        },
        "answer": "C",
        "explanation": "`this` は「このインスタンス自身」を指します。引数名 `price` とフィールド名 `this.price` を区別するときによく使います。"
      },
      {
        "id": "L03_Q10",
        "no": 10,
        "topic": "オーバーロード：Lesson 9 対応",
        "prompt": "同じクラスの中に、**「同じ名前だけれど、引数の個数や型が違うメソッド（またはコンストラクタ）」**を複数定義することを何と呼びますか？",
        "choices": {
          "A": "オーバーロード（多重定義）",
          "B": "オーバーライド",
          "C": "カプセル化",
          "D": "キャスト"
        },
        "answer": "A",
        "explanation": "引数の型や個数が異なれば、同じ名前のメソッドやコンストラクタを複数作ることができます。これを**オーバーロード**と呼びます（『やさしいJava』Lesson 9参照）。"
      }
    ]
  },
  {
    "id": 4,
    "lessonFile": "../lesson04.md",
    "title": "第4章：継承と標準ライブラリの森",
    "subtitle": "Integer.parseInt / contains / extends / interface",
    "areaName": "継承とAPIの密林",
    "story": "Javaが最初から用意している強力な標準クラス群と、親クラスの能力を引き継ぐ `extends`・共通ルール `interface` を武器に密林を抜けよう！",
    "monster": {
      "name": "文字列型ミミック",
      "title": "数値と文字を混同させる擬態魔物",
      "emoji": "👾",
      "color": "#a855f7",
      "maxHp": 120,
      "intro": "「\"1000\" + \"200\" = \"1000200\" だ！数値に変換できまい！」",
      "defeat": "「`Integer.parseInt` と `extends` / `implements` を自在に操るとは…！」"
    },
    "badge": {
      "id": "badge_04",
      "name": "継承の紋章",
      "icon": "🧬"
    },
    "tips": [
      {
        "title": "String と数値変換",
        "code": "int n = Integer.parseInt(\"3500\");\nboolean hit = title.contains(\"弁当\");\nString[] cols = line.split(\",\");",
        "note": "parseInt・contains・split はWebアプリでも毎日使う3大メソッド！"
      },
      {
        "title": "継承とオーバーライド",
        "code": "class PointExpense extends KakeiboItem {\n    @Override\n    public String getSummary() { ... }\n}",
        "note": "継承は extends、インターフェース実装は implements。親コンストラクタ呼び出しは super(...)。"
      },
      {
        "title": "インターフェース",
        "code": "public interface CsvExportable {\n    String toCsv();\n}",
        "note": "「このメソッドを必ず持つ」という共通の契約（ルール）を定義する。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_04_1",
        "title": "CSV行データの分解と数値変換",
        "description": "カンマ区切り文字列 `\"食費,850\"` を分割し、金額を `int` 型に変換しよう。",
        "codeTemplate": "String line = \"食費,850\";\nString[] parts = line.[1](\",\");\nint price = [2](parts[1]);",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "split",
              "cut",
              "divide",
              "slice"
            ],
            "answer": "split"
          },
          {
            "label": "[2]",
            "options": [
              "Integer.parseInt",
              "(int)",
              "String.toInt",
              "Int.parse"
            ],
            "answer": "Integer.parseInt"
          }
        ],
        "hint": "文字列を指定文字で配列に分けるメソッドと、文字列を整数に変える標準メソッドを使います。",
        "explanation": "`split(\",\")` で配列に分割し、`Integer.parseInt(parts[1])` で `int` に変換します。"
      },
      {
        "id": "q_04_2",
        "title": "クラスの継承とインターフェース実装",
        "description": "`KakeiboItem` を継承し、`CsvExportable` ルールを実装するクラス宣言を完成させよう。",
        "codeTemplate": "public class PointItem [1] KakeiboItem [2] CsvExportable {\n    // ...\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "extends",
              "implements",
              "inherits",
              "super"
            ],
            "answer": "extends"
          },
          {
            "label": "[2]",
            "options": [
              "implements",
              "extends",
              "uses",
              "interface"
            ],
            "answer": "implements"
          }
        ],
        "hint": "親クラスの継承が先、インターフェースの実装が後です。",
        "explanation": "クラスの継承は `extends`、インターフェースの実装は `implements` を使います。"
      }
    ],
    "codePuzzle": {
      "id": "p_04",
      "title": "CSV1行データのパース処理",
      "description": "カンマ区切り文字列から金額を取り出し、2倍にして表示する正しい順に並べよう。",
      "steps": [
        "String line = \"ランチ,750\";",
        "String[] cols = line.split(\",\");",
        "int price = Integer.parseInt(cols[1]);",
        "System.out.println(price * 2);"
      ],
      "hint": "split で配列に分解してから、2番目要素（cols[1]）を parseInt します。",
      "explanation": "文字列のままでは掛け算できないため、split → parseInt → 計算の順に行います。"
    },
    "questions": [
      {
        "id": "L04_Q01",
        "no": 1,
        "topic": "文字列から整数への変換",
        "prompt": "文字列 `\"3500\"` を計算可能な `int` 型の整数 `3500` に変換するメソッドはどれですか？",
        "choices": {
          "A": "`String.toInt(\"3500\")`",
          "B": "`Integer.parseInt(\"3500\")`",
          "C": "`(int)\"3500\"`",
          "D": "`Int.valueOf(\"3500\")`"
        },
        "answer": "B",
        "explanation": "`Integer.parseInt(文字列)` はWebアプリ開発で最もよく使う変換メソッドの1つです。"
      },
      {
        "id": "L04_Q02",
        "no": 2,
        "topic": "文字列の部分一致検索",
        "prompt": "文字列 `String title = \"コンビニ弁当\";` の中に `\"弁当\"` という文字が含まれているか判定するメソッドはどれですか？",
        "choices": {
          "A": "`title.contains(\"弁当\")`",
          "B": "`title.has(\"弁当\")`",
          "C": "`title.find(\"弁当\")`",
          "D": "`title.search(\"弁当\")`"
        },
        "answer": "A",
        "explanation": "`文字列.contains(\"検索語\")` で特定の文字列が含まれるか（`true`/`false`）を調べられます。"
      },
      {
        "id": "L04_Q03",
        "no": 3,
        "topic": "クラスの継承キーワード",
        "prompt": "親クラス `Parent` を継承して子クラス `Child` を作るときの正しい宣言はどれですか？",
        "choices": {
          "A": "`class Child implements Parent`",
          "B": "`class Child super Parent`",
          "C": "`class Child extends Parent`",
          "D": "`class Child inherits Parent`"
        },
        "answer": "C",
        "explanation": "クラスの継承には `extends`（拡張する）を使います。"
      },
      {
        "id": "L04_Q04",
        "no": 4,
        "topic": "継承できる親クラスの数",
        "prompt": "Javaにおいて、1つの子クラスが同時に `extends` で直接継承できる親クラスの数はいくつまでですか？（単一継承の原則）",
        "choices": {
          "A": "1つだけ",
          "B": "2つまで",
          "C": "何個でも無制限",
          "D": "継承はできない"
        },
        "answer": "A",
        "explanation": "Javaのクラス継承（`extends`）は**1つの親クラスだけ**（単一継承）というルールがあります（インターフェースは何個でも実装可能です）。"
      },
      {
        "id": "L04_Q05",
        "no": 5,
        "topic": "親クラスのコンストラクタ呼び出し",
        "prompt": "子クラスのコンストラクタの中で、親クラスのコンストラクタを呼び出すために使うキーワードはどれですか？",
        "choices": {
          "A": "`this(...)`",
          "B": "`parent(...)`",
          "C": "`base(...)`",
          "D": "`super(...)`"
        },
        "answer": "D",
        "explanation": "親クラス（スーパークラス）のコンストラクタは `super(...)` で呼び出します。"
      },
      {
        "id": "L04_Q06",
        "no": 6,
        "topic": "アクセス修飾子 `protected`",
        "prompt": "フィールドに `protected` を付けた場合、アクセスできる範囲として正しいものはどれですか？",
        "choices": {
          "A": "どのクラスからも一切アクセスできない。",
          "B": "同じクラス内、同じパッケージ内、および**継承した子クラス（サブクラス）**からアクセスできる。",
          "C": "自分自身のクラス内からしかアクセスできない。",
          "D": "インターフェースからしかアクセスできない。"
        },
        "answer": "B",
        "explanation": "`protected` は子クラスからのアクセスを許可したいときに使います。"
      },
      {
        "id": "L04_Q07",
        "no": 7,
        "topic": "オーバーライド",
        "prompt": "親クラスで定義されているメソッドを、子クラス側で同じ名前・同じ引数で定義し直して処理内容を上書きすることを何と呼びますか？",
        "choices": {
          "A": "オーバーロード",
          "B": "オーバーライド",
          "C": "キャスト",
          "D": "カプセル化"
        },
        "answer": "B",
        "explanation": "親のメソッドを子クラスで上書き再定義することを**オーバーライド**と呼びます。"
      },
      {
        "id": "L04_Q08",
        "no": 8,
        "topic": "インターフェースの実装キーワード",
        "prompt": "`Printable` というインターフェースを `Receipt` クラスに実装するときの正しい宣言はどれですか？",
        "choices": {
          "A": "`class Receipt extends Printable`",
          "B": "`class Receipt interface Printable`",
          "C": "`class Receipt implements Printable`",
          "D": "`class Receipt uses Printable`"
        },
        "answer": "C",
        "explanation": "インターフェースの実装には `implements` を使います。"
      },
      {
        "id": "L04_Q09",
        "no": 9,
        "topic": "インターフェースのルール",
        "prompt": "インターフェースを `implements` したクラスが必ず守らなければならないルールは何ですか？",
        "choices": {
          "A": "フィールドを1つも持ってはいけない。",
          "B": "インターフェースで宣言されている抽象メソッドをすべて実装（中身を記述）しなければならない。",
          "C": "コンストラクタを作ってはいけない。",
          "D": "1つのクラスにつき1つのインターフェースしか `implements` できない。"
        },
        "answer": "B",
        "explanation": "インターフェースで約束されたメソッドをすべて実装しないとコンパイルエラーになります（ちなみにインターフェースはカンマ区切りで複数同時に実装できます）。"
      },
      {
        "id": "L04_Q10",
        "no": 10,
        "topic": "クラス変数・クラスメソッド `static`：Lesson 9・10 対応",
        "prompt": "`Integer.parseInt(...)` や `LocalDate.now()` のように、`new` でインスタンスを作らなくても `クラス名.メソッド名()` で直接呼び出せるメソッドには、定義時にどのキーワードが付いていますか？",
        "choices": {
          "A": "`final`",
          "B": "`abstract`",
          "C": "`static`",
          "D": "`private`"
        },
        "answer": "C",
        "explanation": "`static` が付いたメソッド（クラスメソッド）は、インスタンスを生成せずに `クラス名.メソッド名()` で直接呼び出せます。"
      }
    ]
  },
  {
    "id": 5,
    "lessonFile": "../lesson05.md",
    "title": "第5章：例外処理とArrayListの火山",
    "subtitle": "try-catch / ArrayList / 拡張for文 / ファイル入出力",
    "areaName": "ヌルポと例外の火山",
    "story": "前半戦のクライマックス！何件でも増減できる `ArrayList` と、エラーからアプリを守る `try-catch` を習得し、コンソール版家計簿を完成させよう。",
    "monster": {
      "name": "ヌルポ・マグマドラゴン",
      "title": "NullPointerException を吐く炎竜",
      "emoji": "🐉",
      "color": "#f97316",
      "maxHp": 130,
      "intro": "「数字以外の文字や `null` を投げ込んでプログラムを即死させてやる！」",
      "defeat": "「`try-catch` と `ArrayList` で完全に受け止められたか…見事だ！」"
    },
    "badge": {
      "id": "badge_05",
      "name": "コンソール制覇の盾",
      "icon": "🛡️"
    },
    "tips": [
      {
        "title": "try-catch 例外処理",
        "code": "try {\n    int n = Integer.parseInt(input);\n} catch (NumberFormatException e) {\n    System.out.println(\"数字を入力してください\");\n}",
        "note": "finally ブロックは例外の有無に関わらず必ず実行される。"
      },
      {
        "title": "ArrayList と拡張for文",
        "code": "ArrayList<KakeiboItem> list = new ArrayList<>();\nlist.add(item);\nfor (KakeiboItem it : list) { ... }",
        "note": "要素数は .size()、取得は .get(i)、削除は .remove(i)。"
      },
      {
        "title": "ファイル読み書きと null チェック",
        "code": "if (text != null && !text.isEmpty()) { ... }",
        "note": "null に対してメソッドを呼ぶと NullPointerException が発生する。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_05_1",
        "title": "数値変換エラーを try-catch で防げ",
        "description": "ユーザーが誤って文字列を入力してもクラッシュしない例外処理を完成させよう。",
        "codeTemplate": "[1] {\n    int amount = Integer.parseInt(input);\n} [2] (NumberFormatException e) {\n    System.out.println(\"数値を入力してください\");\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "try",
              "check",
              "test",
              "attempt"
            ],
            "answer": "try"
          },
          {
            "label": "[2]",
            "options": [
              "catch",
              "except",
              "error",
              "handle"
            ],
            "answer": "catch"
          }
        ],
        "hint": "エラーが起きそうな処理を囲むブロックと、発生した例外を受け止めるブロックです。",
        "explanation": "Javaの例外処理は `try { ... } catch (例外型 e) { ... }` の構文を使います。"
      },
      {
        "id": "q_05_2",
        "title": "ArrayList の追加と件数取得",
        "description": "`ArrayList<String>` に品目を追加し、登録件数を表示するコードを完成させよう。",
        "codeTemplate": "ArrayList<String> items = new ArrayList<>();\nitems.[1](\"コーヒー\");\nSystem.out.println(\"件数: \" + items.[2]());",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "add",
              "push",
              "append",
              "insert"
            ],
            "answer": "add"
          },
          {
            "label": "[2]",
            "options": [
              "size",
              "length",
              "count",
              "len"
            ],
            "answer": "size"
          }
        ],
        "hint": "ArrayList への追加は add()、要素数の取得は配列の length とは異なるメソッドです。",
        "explanation": "`ArrayList` は `list.add(...)` で末尾に追加し、`list.size()` で要素数を取得します。"
      }
    ],
    "codePuzzle": {
      "id": "p_05",
      "title": "安全な数値入力とリスト追加（try-catch）",
      "description": "文字列を数値に変換し、失敗しても落ちずに `ArrayList` へ登録するコード順を組み立てよう。",
      "steps": [
        "ArrayList<Integer> list = new ArrayList<>();",
        "try {",
        "    int val = Integer.parseInt(input);",
        "    list.add(val);",
        "} catch (NumberFormatException e) {",
        "    System.out.println(\"数値エラー\");",
        "}"
      ],
      "hint": "リストを準備し、try の中で変換と追加、catch でエラー処理を書きます。",
      "explanation": "変換成功時だけ `list.add(val)` が実行され、不正入力時は `catch` に移ります。"
    },
    "questions": [
      {
        "id": "L05_Q01",
        "no": 1,
        "topic": "例外処理の構文",
        "prompt": "エラー（例外）が発生するかもしれない処理を囲むブロックと、例外が発生したときに受け止めて対処するブロックの組み合わせとして正しいものはどれですか？",
        "choices": {
          "A": "`if` と `else`",
          "B": "`try` と `catch`",
          "C": "`check` と `error`",
          "D": "`do` と `while`"
        },
        "answer": "B",
        "explanation": "`try` で囲み、例外が起きたら `catch` で捕まえて処理します。"
      },
      {
        "id": "L05_Q02",
        "no": 2,
        "topic": "finallyブロックの役割",
        "prompt": "`try - catch - finally` 構文において、`finally` ブロックの中に書かれた処理はいつ実行されますか？",
        "choices": {
          "A": "例外が発生したときだけ実行される。",
          "B": "例外が発生しなかったときだけ実行される。",
          "C": "例外の発生有無にかかわらず、最後に必ず実行される。",
          "D": "コンパイル時だけ実行される。"
        },
        "answer": "C",
        "explanation": "`finally` は例外が起きても起きなくても最後に必ず実行されます。"
      },
      {
        "id": "L05_Q03",
        "no": 3,
        "topic": "数値変換時の例外クラス",
        "prompt": "`Integer.parseInt(\"あいう\")` を実行したときに発生する例外（エラー）の名前はどれですか？",
        "choices": {
          "A": "`NumberFormatException`",
          "B": "`ArrayIndexOutOfBoundsException`",
          "C": "`NullPointerException`",
          "D": "`IOException`"
        },
        "answer": "A",
        "explanation": "数字の形式（NumberFormat）が正しくないときに発生する例外です。"
      },
      {
        "id": "L05_Q04",
        "no": 4,
        "topic": "ArrayListの特徴",
        "prompt": "通常の配列（`String[]` など）と比べたときの `ArrayList` の最大の特徴はどれですか？",
        "choices": {
          "A": "最初に決めた個数から絶対に変更できない。",
          "B": "データの追加や削除に合わせて、要素数（サイズ）を後から自由に変更できる。",
          "C": "数値しか入れることができない。",
          "D": "ループ処理で使えない。"
        },
        "answer": "B",
        "explanation": "`ArrayList` は後から何件でもデータを追加・削除できる可変長のリストです。"
      },
      {
        "id": "L05_Q05",
        "no": 5,
        "topic": "ArrayListへのデータ追加メソッド",
        "prompt": "`ArrayList<String> list = new ArrayList<>();` の末尾に `\"食費\"` というデータを追加するメソッドはどれですか？",
        "choices": {
          "A": "`list.put(\"食費\");`",
          "B": "`list.push(\"食費\");`",
          "C": "`list.add(\"食費\");`",
          "D": "`list.insert(\"食費\");`"
        },
        "answer": "C",
        "explanation": "`add(要素)` メソッドで末尾に追加します。"
      },
      {
        "id": "L05_Q06",
        "no": 6,
        "topic": "ArrayListからのデータ取得メソッド",
        "prompt": "`ArrayList` である `list` から、先頭（0番目）の要素を取り出す正しい書き方はどれですか？",
        "choices": {
          "A": "`list[0]`",
          "B": "`list.get(0)`",
          "C": "`list.take(0)`",
          "D": "`list.first()`"
        },
        "answer": "B",
        "explanation": "`ArrayList` では `[0]` ではなく `get(0)` メソッドで要素を取得します。"
      },
      {
        "id": "L05_Q07",
        "no": 7,
        "topic": "ArrayListの要素数の取得",
        "prompt": "`ArrayList` である `list` に現在何件のデータが入っているかを取得するメソッドはどれですか？",
        "choices": {
          "A": "`list.length`",
          "B": "`list.size()`",
          "C": "`list.count()`",
          "D": "`list.max()`"
        },
        "answer": "B",
        "explanation": "配列は `.length` ですが、`ArrayList` は `.size()` メソッドを使います。"
      },
      {
        "id": "L05_Q08",
        "no": 8,
        "topic": "ArrayListからの要素削除",
        "prompt": "`list` の `2` 番目の要素を削除して間を詰めるメソッドはどれですか？",
        "choices": {
          "A": "`list.delete(2);`",
          "B": "`list.clear(2);`",
          "C": "`list.remove(2);`",
          "D": "`list.drop(2);`"
        },
        "answer": "C",
        "explanation": "`remove(インデックス番号)` で指定位置の要素を削除できます。"
      },
      {
        "id": "L05_Q09",
        "no": 9,
        "topic": "拡張for文の書き方",
        "prompt": "`ArrayList<KakeiboRecord> records` の要素を先頭から1つずつ変数 `r` に取り出してループする「拡張for文」の正しい書き方はどれですか？",
        "choices": {
          "A": "`for (KakeiboRecord r : records) { ... }`",
          "B": "`for (records : KakeiboRecord r) { ... }`",
          "C": "`for (int r in records) { ... }`",
          "D": "`for (KakeiboRecord r = records) { ... }`"
        },
        "answer": "A",
        "explanation": "`for (要素の型 変数名 : リスト名)` の順番で書きます。"
      },
      {
        "id": "L05_Q10",
        "no": 10,
        "topic": "NullPointerException の原因",
        "prompt": "実務やWebアプリ開発で最もよく遭遇する例外の1つである **`NullPointerException`（ヌルポ）** は、どんなときに発生しますか？",
        "choices": {
          "A": "0で割り算をしたとき",
          "B": "中身が空っぽ（`null`：何もインスタンスが入っていない状態）の変数に対して、`.equals()` や `.length()` などのメソッドを呼び出そうとしたとき",
          "C": "セミコロン `;` を忘れたとき",
          "D": "ファイル名を間違えたとき"
        },
        "answer": "B",
        "explanation": "変数の中身が `null`（空っぽ）なのにメソッドを呼ぼうとすると `NullPointerException` が発生します。後半のServlet開発でもよく出会うので覚えておきましょう！"
      }
    ]
  },
  {
    "id": 6,
    "lessonFile": "../lesson06.md",
    "title": "第6章：Webの仕組みとServlet港",
    "subtitle": "HTTP / Tomcat 10 / HttpServlet / doGet & @WebServlet",
    "areaName": "HTTPリクエストの港町",
    "story": "いよいよ後半戦・Webアプリ編へ出航！ブラウザとTomcatサーバーがやり取りするHTTPの仕組みと、最初の `HttpServlet` を動かそう。",
    "monster": {
      "name": "404 ノットファウンド海賊",
      "title": "URLマッピングを狂わせる海賊",
      "emoji": "🏴‍☠️",
      "color": "#06b6d4",
      "maxHp": 130,
      "intro": "「`@WebServlet` のURLや `jakarta.servlet` を間違えて 404 エラーの海に沈めてやる！」",
      "defeat": "「`doGet` と `PrintWriter` の連携…完璧な航海だ！」"
    },
    "badge": {
      "id": "badge_06",
      "name": "Servlet航海士の羅針盤",
      "icon": "⚓"
    },
    "tips": [
      {
        "title": "Servletの基本構造（Tomcat 10）",
        "code": "@WebServlet(\"/hello\")\npublic class HelloKakeiboServlet extends HttpServlet {\n    protected void doGet(HttpServletRequest req, HttpServletResponse res)\n            throws ServletException, IOException {\n        res.setContentType(\"text/html; charset=UTF-8\");\n        PrintWriter out = res.getWriter();\n    }\n}",
        "note": "Tomcat 10 は jakarta.servlet.* パッケージを使う。doGet が GET リクエストを処理する。"
      },
      {
        "title": "HTTPステータスコード",
        "code": "200 OK / 404 Not Found / 500 Internal Server Error",
        "note": "404はURL未発見、500はJava側の例外エラーを意味する。"
      },
      {
        "title": "コンテキストルート",
        "code": "http://localhost:8080/mykakeibo/hello",
        "note": "アプリ名（mykakeibo）と @WebServlet(\"/hello\") が結合される。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_06_1",
        "title": "Servlet の URL 割り当てと継承",
        "description": "`/kakeibo` でアクセスでき、文字化けせずにHTMLを返す Servlet を完成させよう。",
        "codeTemplate": "[1](\"/kakeibo\")\npublic class HelloKakeiboServlet extends [2] {\n    protected void doGet(HttpServletRequest req, HttpServletResponse res)\n            throws ServletException, IOException {\n        res.setContentType(\"text/html; charset=UTF-8\");\n    }\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "@WebServlet",
              "@Route",
              "@UrlMapping",
              "@GetMapping"
            ],
            "answer": "@WebServlet"
          },
          {
            "label": "[2]",
            "options": [
              "HttpServlet",
              "WebServlet",
              "ServletPage",
              "JspBase"
            ],
            "answer": "HttpServlet"
          }
        ],
        "hint": "URLパスを結びつけるアノテーションと、WebServletが継承する親クラスを選びます。",
        "explanation": "`@WebServlet(\"/パス\")` でURLを指定し、`HttpServlet` を継承します。"
      },
      {
        "id": "q_06_2",
        "title": "ブラウザへHTMLを書き出す準備",
        "description": "レスポンスから出力用ライター `PrintWriter` を取得して文字を出力しよう。",
        "codeTemplate": "res.setContentType(\"text/html; charset=UTF-8\");\nPrintWriter out = res.[1]();\nout.[2](\"<h1>MyKakeibo</h1>\");",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "getWriter",
              "getOutput",
              "createWriter",
              "openStream"
            ],
            "answer": "getWriter"
          },
          {
            "label": "[2]",
            "options": [
              "println",
              "writeLine",
              "send",
              "echo"
            ],
            "answer": "println"
          }
        ],
        "hint": "HttpServletResponse からテキスト出力ストリームを取り出すメソッド名を確認しよう。",
        "explanation": "`res.getWriter()` で `PrintWriter` を取得し、`out.println(...)` でHTMLを返します。"
      }
    ],
    "codePuzzle": {
      "id": "p_06",
      "title": "ServletがHTMLレスポンスを返す流れ",
      "description": "`doGet` メソッド内で文字コード設定からHTML出力までの正しいコード順に並べよう。",
      "steps": [
        "res.setContentType(\"text/html; charset=UTF-8\");",
        "PrintWriter out = res.getWriter();",
        "out.println(\"<h1>MyKakeibo</h1>\");",
        "out.println(\"<p>起動成功！</p>\");"
      ],
      "hint": "必ず getWriter() を呼ぶ前に setContentType で UTF-8 を指定します。",
      "explanation": "`setContentType` を `getWriter()` の前に書かないと文字化けの原因になります。"
    },
    "questions": [
      {
        "id": "L06_Q01",
        "no": 1,
        "topic": "リクエストとレスポンス",
        "prompt": "WebブラウザからWebサーバーに対して「このページを見せてください」と要求を送ることを何と呼びますか？",
        "choices": {
          "A": "HTTPレスポンス",
          "B": "HTTPリクエスト",
          "C": "コンパイル",
          "D": "デプロイ"
        },
        "answer": "B",
        "explanation": "ブラウザからの要求が「HTTPリクエスト」、サーバーからの返事が「HTTPレスポンス」です。"
      },
      {
        "id": "L06_Q02",
        "no": 2,
        "topic": "Servletを動かすサーバーソフト",
        "prompt": "Javaで作られたServletやJSPを動かすために使われる、代表的なWebアプリケーションサーバー（Servletコンテナ）の名前はどれですか？",
        "choices": {
          "A": "Apache Tomcat",
          "B": "Microsoft Excel",
          "C": "Scanner",
          "D": "ArrayList"
        },
        "answer": "A",
        "explanation": "Tomcatは世界中で最も広く使われているJava Webサーバー（Servletコンテナ）です。"
      },
      {
        "id": "L06_Q03",
        "no": 3,
        "topic": "Servletの親クラス",
        "prompt": "Web用のServletクラスを作成するとき、`extends` キーワードを使って継承する親クラスはどれですか？",
        "choices": {
          "A": "`WebClass`",
          "B": "`HttpServlet`",
          "C": "`JavaServer`",
          "D": "`HtmlWriter`"
        },
        "answer": "B",
        "explanation": "`public class XxxServlet extends HttpServlet` のように `HttpServlet` を継承します。"
      },
      {
        "id": "L06_Q04",
        "no": 4,
        "topic": "URLマッピングのアノテーション",
        "prompt": "ブラウザから `http://localhost:8080/アプリ名/kakeibo` というURLでアクセスされたときにそのServletが動くよう、クラス宣言の直前に書くアノテーション（目印）はどれですか？",
        "choices": {
          "A": "`@Override(\"/kakeibo\")`",
          "B": "`@Url(\"/kakeibo\")`",
          "C": "`@WebServlet(\"/kakeibo\")`",
          "D": "`@HttpGet(\"/kakeibo\")`"
        },
        "answer": "C",
        "explanation": "`@WebServlet(\"/URLパターン\")` で、どのURLとどのServletを結びつけるかを指定します。"
      },
      {
        "id": "L06_Q05",
        "no": 5,
        "topic": "ブラウザでURLを開いたときに呼ばれるメソッド",
        "prompt": "ブラウザのアドレスバーにURLを入力したり、リンク（`<a href=\"...\">`）をクリックしてアクセスしたとき、Servletの中で自動的に呼び出されるメソッドはどれですか？",
        "choices": {
          "A": "`main` メソッド",
          "B": "`doGet` メソッド",
          "C": "`start` メソッド",
          "D": "`run` メソッド"
        },
        "answer": "B",
        "explanation": "通常のページ閲覧（GETリクエスト）では `doGet` メソッドが呼び出されます。"
      },
      {
        "id": "L06_Q06",
        "no": 6,
        "topic": "doGetメソッドの2つの引数",
        "prompt": "`protected void doGet(HttpServletRequest request, HttpServletResponse response)` の2つの引数の役割として、正しい組み合わせはどれですか？",
        "choices": {
          "A": "`request`：ブラウザからの要求情報 ／ `response`：ブラウザへの応答送信用",
          "B": "`request`：ブラウザへの応答送信用 ／ `response`：ブラウザからの要求情報",
          "C": "両方ともエラー処理用",
          "D": "両方ともファイル保存用"
        },
        "answer": "A",
        "explanation": "`request` から送られてきたデータを取り出し、`response` を使ってブラウザへ画面を返します。"
      },
      {
        "id": "L06_Q07",
        "no": 7,
        "topic": "文字化け防止とコンテンツタイプの設定",
        "prompt": "Servletから日本語を含むHTMLをブラウザに返すとき、文字化けを防ぐために `response.getWriter()` の**前**に実行するコードはどれですか？",
        "choices": {
          "A": "`response.setContentType(\"text/html; charset=UTF-8\");`",
          "B": "`System.out.println(\"UTF-8\");`",
          "C": "`request.close();`",
          "D": "`response.setLanguage(\"Japanese\");`"
        },
        "answer": "A",
        "explanation": "「今から返すデータはHTML形式で、文字コードはUTF-8ですよ」とブラウザに伝える設定です。"
      },
      {
        "id": "L06_Q08",
        "no": 8,
        "topic": "ブラウザへHTMLを出力するストリーム",
        "prompt": "Servletの中で `PrintWriter out = response.getWriter();` を取得したあと、ブラウザへHTMLの文字列を出力するにはどう書きますか？",
        "choices": {
          "A": "`System.out.println(\"<h1>家計簿</h1>\");`",
          "B": "`out.println(\"<h1>家計簿</h1>\");`",
          "C": "`request.println(\"<h1>家計簿</h1>\");`",
          "D": "`scanner.println(\"<h1>家計簿</h1>\");`"
        },
        "answer": "B",
        "explanation": "`response.getWriter()` で取得した `out` に対して `out.println(...)` を呼ぶと、ブラウザにHTMLが送られます（`System.out.println` はサーバーの裏側のログに出るだけです）。"
      },
      {
        "id": "L06_Q09",
        "no": 9,
        "topic": "Webアプリのディレクトリ構造",
        "prompt": "JavaのWebアプリケーションにおいて、コンパイル済みの `.class` ファイルを配置する決まりになっているフォルダはどこですか？",
        "choices": {
          "A": "`WEB-INF/classes` フォルダ",
          "B": "`WEB-INF/html` フォルダ",
          "C": "デスクトップ直下",
          "D": "`public_html` フォルダ"
        },
        "answer": "A",
        "explanation": "`WEB-INF/classes` の中にコンパイルした `.class` ファイルを置くと、Tomcatが自動的に読み込んでくれます。"
      },
      {
        "id": "L06_Q10",
        "no": 10,
        "topic": "静的ページと動的ページの違い",
        "prompt": "普通の `.html` ファイル（静的ページ）と比べたときの、Servlet（動的ページ）の最大の特徴はどれですか？",
        "choices": {
          "A": "文字の色を変えられない。",
          "B": "アクセスされるたびにJavaプログラムが計算や判定を行い、状況や日時・データに応じた異なるHTML画面を生成して返せる。",
          "C": "ブラウザで見ることができない。",
          "D": "インターネットに繋がっていないと動かない。"
        },
        "answer": "B",
        "explanation": "Javaの計算結果やデータベース・ファイルの中身に応じて動的に画面を作れるのがServletの強みです。"
      }
    ]
  },
  {
    "id": 7,
    "lessonFile": "../lesson07.md",
    "title": "第7章：JSPとフォーム送信の城塞",
    "subtitle": "JSPタグ / GET・POST / getParameter / 文字化け対策",
    "areaName": "フォーム送信の城塞",
    "story": "ServletにHTMLをベタ書きする時代は終わり！画面はJSP、処理はServletへと役割を分担し、ブラウザフォームから家計簿データを送信しよう。",
    "monster": {
      "name": "文字化けガーゴイル",
      "title": "POSTパラメータを化けさせる石像",
      "emoji": "🦇",
      "color": "#3b82f6",
      "maxHp": 130,
      "intro": "「`setCharacterEncoding` や `name` 属性を忘れて、日本語を文字化けさせてやる！」",
      "defeat": "「`<%= %>` と `request.getParameter` を使いこなすとは…！」"
    },
    "badge": {
      "id": "badge_07",
      "name": "JSP連携の鍵",
      "icon": "🗝️"
    },
    "tips": [
      {
        "title": "JSPの3大タグ",
        "code": "<%@ page contentType=\"text/html; charset=UTF-8\" %>\n<% int x = 10; %>\n<%= x %>",
        "note": "<%@ %> はページ設定、<% %> はJava処理、<%= %> は値の出力（末尾 ; 不要）。"
      },
      {
        "title": "HTMLフォームとPOST",
        "code": "<form action=\"receive\" method=\"post\">\n  <input type=\"text\" name=\"itemName\">\n</form>",
        "note": "登録・更新などデータを送るときは URL に値が見えない POST を使う。"
      },
      {
        "title": "Servletでの受取と文字化け対策",
        "code": "req.setCharacterEncoding(\"UTF-8\");\nString name = req.getParameter(\"itemName\");\nint price = Integer.parseInt(req.getParameter(\"price\"));",
        "note": "getParameter の戻り値は常に String なので数値は parseInt する。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_07_1",
        "title": "JSP で変数 total を画面出力せよ",
        "description": "JSP の中で Java 変数 `total` の値を HTML として出力し、フォーム送信先を指定しよう。",
        "codeTemplate": "<p>合計金額：[1] total %> 円</p>\n<form action=\"entry\" method=\"[2]\">",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "<%=",
              "<%",
              "<%@",
              "${"
            ],
            "answer": "<%="
          },
          {
            "label": "[2]",
            "options": [
              "post",
              "send",
              "push",
              "submit"
            ],
            "answer": "post"
          }
        ],
        "hint": "値を出力する式タグは `=` が付き、データ登録のHTTPメソッドは GET ではなく POST です。",
        "explanation": "JSPの式タグは `<%= 変数 %>`、データ登録フォームは `method=\"post\"` を使います。"
      },
      {
        "id": "q_07_2",
        "title": "Servlet で日本語パラメータを安全に受け取れ",
        "description": "`name=\"title\"` の入力値を受け取る前に、日本語の文字化け対策を行おう。",
        "codeTemplate": "req.[1](\"UTF-8\");\nString title = req.[2](\"title\");",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "setCharacterEncoding",
              "setContentType",
              "setCharset",
              "encodeUtf8"
            ],
            "answer": "setCharacterEncoding"
          },
          {
            "label": "[2]",
            "options": [
              "getParameter",
              "getAttribute",
              "getInput",
              "readParam"
            ],
            "answer": "getParameter"
          }
        ],
        "hint": "リクエストボディの文字コード設定メソッドと、フォーム値取得メソッドを選びます。",
        "explanation": "`req.setCharacterEncoding(\"UTF-8\")` のあとに `req.getParameter(\"項目名\")` を呼びます。"
      }
    ],
    "codePuzzle": {
      "id": "p_07",
      "title": "POSTフォームデータの安全な受信手順",
      "description": "`doPost` で日本語の品名と金額を受け取る正しい順番を組み立てよう。",
      "steps": [
        "req.setCharacterEncoding(\"UTF-8\");",
        "String title = req.getParameter(\"title\");",
        "String priceStr = req.getParameter(\"price\");",
        "int price = Integer.parseInt(priceStr);"
      ],
      "hint": "一番最初にリクエストの文字コード設定を行い、そのあとパラメータを取り出して数値変換します。",
      "explanation": "`getParameter` より前に `setCharacterEncoding(\"UTF-8\")` を実行するのが鉄則です。"
    },
    "questions": [
      {
        "id": "L07_Q01",
        "no": 1,
        "topic": "JSPの特徴",
        "prompt": "Servletと比較したときのJSP（JavaServer Pages）の特徴として、最も適切なものはどれですか？",
        "choices": {
          "A": "HTMLファイルの中にJavaのコードや変数を埋め込んで、画面（見た目）を簡単に作ることができる。",
          "B": "画面を一切表示できない。",
          "C": "ブラウザではなく黒い画面（コンソール）にしか出力できない。",
          "D": "HTMLタグを使うことができない。"
        },
        "answer": "A",
        "explanation": "JSPはHTMLをベースにしてJavaを埋め込めるため、Web画面（View）の作成に最適です。"
      },
      {
        "id": "L07_Q02",
        "no": 2,
        "topic": "JSPで変数の値を出力するタグ",
        "prompt": "JSPファイルの中で、Javaの変数 `totalPrice` の値をHTML上に表示（出力）したいとき、正しい書き方はどれですか？",
        "choices": {
          "A": "`<% totalPrice %>`",
          "B": "`<%= totalPrice %>`",
          "C": "`<%@ totalPrice %>`",
          "D": "`${ totalPrice; }`"
        },
        "answer": "B",
        "explanation": "`<%= 変数名 %>`（式タグ）を使うと、その場所に変数の値が出力されます（末尾の `;` は不要です）。"
      },
      {
        "id": "L07_Q03",
        "no": 3,
        "topic": "HTMLフォームの送信先と送信方式",
        "prompt": "`<form action=\"register\" method=\"post\">` と書いたとき、送信ボタンを押すとどうなりますか？",
        "choices": {
          "A": "`post` というURLに対して `register` 方式で送信される。",
          "B": "`register` というURLに対して `POST` リクエストで送信される。",
          "C": "何も送信されない。",
          "D": "自動的に `doGet` メソッドだけが呼ばれる。"
        },
        "answer": "B",
        "explanation": "`action` 属性が送信先URL、`method` 属性がHTTPメソッド（GET/POST）を表します。"
      },
      {
        "id": "L07_Q04",
        "no": 4,
        "topic": "POST送信を受け取るServletのメソッド",
        "prompt": "`<form method=\"post\">` で送信されたデータをServletで受け取って処理する場合、オーバーライドすべきメソッドはどれですか？",
        "choices": {
          "A": "`doGet`",
          "B": "`doPost`",
          "C": "`doForm`",
          "D": "`main`"
        },
        "answer": "B",
        "explanation": "`method=\"post\"` のフォーム送信は、Servletの `doPost` メソッドで受け取ります。"
      },
      {
        "id": "L07_Q05",
        "no": 5,
        "topic": "入力欄の名前属性",
        "prompt": "`<input type=\"text\" [  ?  ]=\"itemName\">` のように、Servlet側で値を取り出すための「キーの名前」を指定するHTML属性はどれですか？",
        "choices": {
          "A": "`id`",
          "B": "`class`",
          "C": "`name`",
          "D": "`value`"
        },
        "answer": "C",
        "explanation": "HTMLの `<input>` や `<select>` には必ず `name=\"名前\"` を付けることで、サーバーへ値が送られます。"
      },
      {
        "id": "L07_Q06",
        "no": 6,
        "topic": "リクエストパラメータの取得メソッド",
        "prompt": "フォームの `<input type=\"text\" name=\"memo\">` に入力された文字列を、Servletの `request` オブジェクトから取り出す正しいコードはどれですか？",
        "choices": {
          "A": "`request.get(\"memo\")`",
          "B": "`request.getParameter(\"memo\")`",
          "C": "`request.getInput(\"memo\")`",
          "D": "`response.getParameter(\"memo\")`"
        },
        "answer": "B",
        "explanation": "`request.getParameter(\"name属性の名前\")` で入力値を取得します。"
      },
      {
        "id": "L07_Q07",
        "no": 7,
        "topic": "`getParameter` の戻り値の型",
        "prompt": "`<input type=\"number\" name=\"price\">` に `1500` と入力して送信されたとき、`request.getParameter(\"price\")` の戻り値の型は何ですか？",
        "choices": {
          "A": "`int` 型",
          "B": "`double` 型",
          "C": "`String` 型",
          "D": "`boolean` 型"
        },
        "answer": "C",
        "explanation": "HTML側が `type=\"number\"` であっても、`getParameter` で受け取る値は常に `String`（文字列）です。計算には `Integer.parseInt` を使います。"
      },
      {
        "id": "L07_Q08",
        "no": 8,
        "topic": "送信データの文字化け防止",
        "prompt": "フォームから送信された日本語（`\"食費\"` など）が文字化けしないように、`request.getParameter(...)` を呼ぶ前に記述するコードはどれですか？",
        "choices": {
          "A": "`request.setCharacterEncoding(\"UTF-8\");`",
          "B": "`request.setLanguage(\"UTF-8\");`",
          "C": "`System.setUTF8();`",
          "D": "`out.setEncoding(\"UTF-8\");`"
        },
        "answer": "A",
        "explanation": "リクエストの読み取り文字コードを `UTF-8` に指定します。"
      },
      {
        "id": "L07_Q09",
        "no": 9,
        "topic": "GETとPOSTの使い分け",
        "prompt": "家計簿アプリで「新しい収支データを登録する」「データを削除する」といった、サーバー側のデータを変更する処理に向いている送信方式はどれですか？",
        "choices": {
          "A": "`GET`",
          "B": "`POST`",
          "C": "`LINK`",
          "D": "`SHOW`"
        },
        "answer": "B",
        "explanation": "データの登録・更新・削除には `POST`、画面の閲覧や検索には `GET` を使うのがWebの基本ルールです。"
      },
      {
        "id": "L07_Q10",
        "no": 10,
        "topic": "パラメータが存在しない場合の値",
        "prompt": "フォームに存在しない名前や、まだ送信されていない状態で `request.getParameter(\"keyword\")` を呼び出すと、何が返ってきますか？",
        "choices": {
          "A": "`\"0\"`（文字列のゼロ）",
          "B": "`null`",
          "C": "`\"エラー\"` という文字列",
          "D": "コンパイルエラーになる"
        },
        "answer": "B",
        "explanation": "指定されたパラメータが送られてきていない場合は `null` が返ります。"
      }
    ]
  },
  {
    "id": 8,
    "lessonFile": "../lesson08.md",
    "title": "第8章：MVCモデルとスコープの神殿",
    "subtitle": "Model / View / Controller / スコープ / Forward & Redirect",
    "areaName": "MVC三神殿",
    "story": "第3回の `KakeiboItem` と第5回の `ArrayList` がWebの世界で融合する！MVCモデルとスコープ・フォワードの仕組みで神殿を攻略せよ。",
    "monster": {
      "name": "スコープ消失スフィンクス",
      "title": "Redirectでデータを消す謎の魔獣",
      "emoji": "🦁",
      "color": "#ec4899",
      "maxHp": 140,
      "intro": "「`request` スコープに入れた荷物をリダイレクトで消滅させてやろう！」",
      "defeat": "「Forward と Redirect、そして型キャストの違いを完全に理解しているな…！」"
    },
    "badge": {
      "id": "badge_08",
      "name": "MVCアーキテクトの印",
      "icon": "💎"
    },
    "tips": [
      {
        "title": "MVCの3役割",
        "code": "Model: KakeiboItem (データ・計算)\nView: JSP (画面表示)\nController: Servlet (受付・制御)",
        "note": "役割を分担することで変更に強いコードになる。"
      },
      {
        "title": "スコープとフォワード",
        "code": "req.setAttribute(\"items\", list);\nreq.getRequestDispatcher(\"/WEB-INF/list.jsp\").forward(req, res);",
        "note": "同じリクエスト内でJSPへデータを渡すときは setAttribute + forward を使う。"
      },
      {
        "title": "JSPでのデータ受け取り",
        "code": "ArrayList<KakeiboItem> items =\n    (ArrayList<KakeiboItem>) request.getAttribute(\"items\");",
        "note": "getAttribute の戻り値は Object 型なので元の型へキャストが必要。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_08_1",
        "title": "Servlet から JSP へリストを渡してフォワードせよ",
        "description": "リクエストスコープに `items` という名前で `list` を預け、`app.jsp` へフォワードしよう。",
        "codeTemplate": "req.[1](\"items\", list);\nreq.getRequestDispatcher(\"/WEB-INF/app.jsp\").[2](req, res);",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "setAttribute",
              "setParameter",
              "putData",
              "addScope"
            ],
            "answer": "setAttribute"
          },
          {
            "label": "[2]",
            "options": [
              "forward",
              "redirect",
              "send",
              "jump"
            ],
            "answer": "forward"
          }
        ],
        "hint": "スコープにデータを預けるメソッドと、サーバー内部でJSPへ処理を引き継ぐメソッドを選びます。",
        "explanation": "`req.setAttribute(名前, 値)` で預け、`getRequestDispatcher(...).forward(req, res)` でJSPへ渡します。"
      },
      {
        "id": "q_08_2",
        "title": "JSP でスコープからリストを取り出せ",
        "description": "`request` スコープに預けられた `ArrayList<KakeiboItem>` を取り出してキャストしよう。",
        "codeTemplate": "ArrayList<KakeiboItem> items =\n    ([1]) request.[2](\"items\");",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "ArrayList<KakeiboItem>",
              "String",
              "KakeiboItem",
              "Object"
            ],
            "answer": "ArrayList<KakeiboItem>"
          },
          {
            "label": "[2]",
            "options": [
              "getAttribute",
              "getParameter",
              "fetchData",
              "readScope"
            ],
            "answer": "getAttribute"
          }
        ],
        "hint": "`getAttribute` は `Object` 型を返すため、元のリスト型へのキャストが必要です。",
        "explanation": "`(ArrayList<KakeiboItem>) request.getAttribute(\"items\")` で安全に元の型に戻せます。"
      }
    ],
    "codePuzzle": {
      "id": "p_08",
      "title": "MVCコントローラのフォワード処理",
      "description": "データをリクエストスコープに預けて JSP へ画面表示を引き継ぐ正しい順に並べよう。",
      "steps": [
        "ArrayList<KakeiboItem> list = createSampleList();",
        "req.setAttribute(\"items\", list);",
        "RequestDispatcher rd = req.getRequestDispatcher(\"/WEB-INF/app.jsp\");",
        "rd.forward(req, res);"
      ],
      "hint": "リスト準備 → スコープに格納 → Dispatcher取得 → forward実行 の順です。",
      "explanation": "`forward` 後はレスポンスがJSPに移るため、その前に `setAttribute` を完了させます。"
    },
    "questions": [
      {
        "id": "L08_Q01",
        "no": 1,
        "topic": "MVCモデルの役割分担",
        "prompt": "MVCモデルにおいて、**M（Model）・V（View）・C（Controller）**にそれぞれ対応するJavaの要素の組み合わせとして、最も適切なものはどれですか？",
        "choices": {
          "A": "M：データや計算ロジックを持つJavaクラス ／ V：画面表示を行うJSP ／ C：要求を受け取り全体を制御するServlet",
          "B": "M：JSP ／ V：Servlet ／ C：HTML",
          "C": "M：ブラウザ ／ V：Tomcat ／ C：キーボード",
          "D": "すべてJSPだけで行う"
        },
        "answer": "A",
        "explanation": "Model（Javaクラス）、View（JSP）、Controller（Servlet）の3つに分けることで、整理された保守しやすいWebアプリになります。"
      },
      {
        "id": "L08_Q02",
        "no": 2,
        "topic": "フォワードの役割",
        "prompt": "Servletで処理を行ったあと、サーバー内部でJSPに処理を転送（バトンタッチ）して画面を表示させる仕組みを何と呼びますか？",
        "choices": {
          "A": "コンパイル",
          "B": "フォワード（Forward）",
          "C": "ループ",
          "D": "キャスト"
        },
        "answer": "B",
        "explanation": "ServletからJSPへ内部で処理を引き継ぐことを**フォワード**と呼びます。"
      },
      {
        "id": "L08_Q03",
        "no": 3,
        "topic": "フォワードのコード",
        "prompt": "Servletから `/WEB-INF/list.jsp` へフォワードする正しいコードはどれですか？",
        "choices": {
          "A": "`request.getRequestDispatcher(\"/WEB-INF/list.jsp\").forward(request, response);`",
          "B": "`System.out.println(\"/WEB-INF/list.jsp\");`",
          "C": "`request.getParameter(\"/WEB-INF/list.jsp\");`",
          "D": "`new ListJsp();`"
        },
        "answer": "A",
        "explanation": "`RequestDispatcher` を取得して `.forward(request, response)` を呼び出します。"
      },
      {
        "id": "L08_Q04",
        "no": 4,
        "topic": "リダイレクトの役割",
        "prompt": "`POST` でデータを登録したあとに `response.sendRedirect(\"mvcKakeibo\");` でリダイレクトを行う主な理由は何ですか？",
        "choices": {
          "A": "文字の色を赤くするため",
          "B": "ブラウザの更新（再読み込み）ボタンを押したときに、同じデータが二重に登録されてしまうのを防ぐため",
          "C": "プログラムを終了させるため",
          "D": "コンパイルをやり直すため"
        },
        "answer": "B",
        "explanation": "POSTのあとにリダイレクト（GETへ誘導）するパターンは **PRG（Post-Redirect-Get）パターン** と呼ばれ、二重送信防止の定番テクニックです。"
      },
      {
        "id": "L08_Q05",
        "no": 5,
        "topic": "スコープへのデータの保存",
        "prompt": "リクエストスコープやセッションスコープに `\"balance\"` という名前で変数 `balance` のデータを保存（格納）するメソッドはどれですか？",
        "choices": {
          "A": "`setAttribute(\"balance\", balance)`",
          "B": "`getAttribute(\"balance\")`",
          "C": "`getParameter(\"balance\")`",
          "D": "`add(\"balance\", balance)`"
        },
        "answer": "A",
        "explanation": "`setAttribute(\"名前\", 値)` でスコープにデータを預けます。"
      },
      {
        "id": "L08_Q06",
        "no": 6,
        "topic": "スコープからのデータの取得",
        "prompt": "JSP側で、リクエストスコープに保存された `\"balance\"` という名前のデータを取り出すメソッドはどれですか？",
        "choices": {
          "A": "`request.setAttribute(\"balance\")`",
          "B": "`request.getAttribute(\"balance\")`",
          "C": "`request.remove(\"balance\")`",
          "D": "`request.close(\"balance\")`"
        },
        "answer": "B",
        "explanation": "`getAttribute(\"名前\")` で取り出します（取り出す際は元の型へキャストします）。"
      },
      {
        "id": "L08_Q07",
        "no": 7,
        "topic": "リクエストスコープとセッションスコープの寿命の違い",
        "prompt": "「1回のリクエスト〜レスポンスが終わると消えるスコープ」と、「ページを移動してもブラウザを閉じるまでデータが残るスコープ」の正しい組み合わせはどれですか？",
        "choices": {
          "A": "1回で消える：リクエストスコープ ／ ページ移動しても残る：セッションスコープ",
          "B": "1回で消える：セッションスコープ ／ ページ移動しても残る：リクエストスコープ",
          "C": "どちらも永久に消えない",
          "D": "どちらも1回で消える"
        },
        "answer": "A",
        "explanation": "1画面限りのデータはリクエストスコープ、複数リクエストにまたがるデータはセッションスコープを使います。"
      },
      {
        "id": "L08_Q08",
        "no": 8,
        "topic": "セッションオブジェクトの取得",
        "prompt": "Servletの中で `HttpSession`（セッションスコープ）を取得する正しいコードはどれですか？",
        "choices": {
          "A": "`HttpSession session = new HttpSession();`",
          "B": "`HttpSession session = request.getSession();`",
          "C": "`HttpSession session = response.getWriter();`",
          "D": "`HttpSession session = System.getSession();`"
        },
        "answer": "B",
        "explanation": "`request.getSession()` で現在のユーザーのセッションを取得できます。"
      },
      {
        "id": "L08_Q09",
        "no": 9,
        "topic": "JSPを `WEB-INF` フォルダの中に置く理由",
        "prompt": "MVCモデルでは、JSPファイルを `/WEB-INF/kakeibo_mvc.jsp` のように `WEB-INF` フォルダの中に置くことがよくあります。その理由は何ですか？",
        "choices": {
          "A": "ブラウザからJSPのURLを直接開かれるのを防ぎ、必ずController（Servlet）を経由してアクセスさせるため",
          "B": "ファイルサイズを小さくするため",
          "C": "日本語を使えるようにするため",
          "D": "画像を表示させないため"
        },
        "answer": "A",
        "explanation": "`WEB-INF` 内のファイルはブラウザから直接URL指定で開けないため、Servletで計算準備をしてからフォワードする安全な設計になります。"
      },
      {
        "id": "L08_Q10",
        "no": 10,
        "topic": "JSPで自作クラスを使うための宣言",
        "prompt": "JSPファイルの中で、`model` パッケージにある `KakeiboItem` クラスや `java.util.ArrayList` を使うために、JSPの先頭に書くインポート宣言はどれですか？",
        "choices": {
          "A": "`<%@ page import=\"java.util.ArrayList, model.KakeiboItem\" %>`",
          "B": "`<script src=\"KakeiboItem.java\"></script>`",
          "C": "`<link rel=\"import\" href=\"KakeiboItem\">`",
          "D": "`include KakeiboItem;`"
        },
        "answer": "A",
        "explanation": "JSPでは `<%@ page import=\"...\" %>` を使ってJavaクラスをインポートします。"
      }
    ]
  },
  {
    "id": 9,
    "lessonFile": "../lesson09.md",
    "title": "第9章：DAOと永続化の地下金庫",
    "subtitle": "データ永続化 / DAOパターン / CSV保存 / PRGパターン",
    "areaName": "永続化の地下金庫",
    "story": "サーバーを再起動するとデータが消えてしまう弱点を克服せよ！`KakeiboDAO` と CSV永続化、さらに二重送信を防ぐ PRG パターンを実装しよう。",
    "monster": {
      "name": "揮発メモリ・リッチ",
      "title": "再起動でデータを消し去る死霊術師",
      "emoji": "💀",
      "color": "#78716c",
      "maxHp": 140,
      "intro": "「メモリ上の ArrayList など、サーバー再起動一発で消滅する運命よ！」",
      "defeat": "「DAO と CSV永続化、さらに PRG リダイレクトまで…データは不滅となった！」"
    },
    "badge": {
      "id": "badge_09",
      "name": "永続化の黄金鍵",
      "icon": "💾"
    },
    "tips": [
      {
        "title": "DAOパターン",
        "code": "public class KakeiboDAO {\n    public ArrayList<KakeiboItem> findAll() { ... }\n    public void saveAll(ArrayList<KakeiboItem> list) { ... }\n}",
        "note": "データ読み書き処理を DAO クラスに集約し、Servlet をすっきりさせる。"
      },
      {
        "title": "IDによる削除とPRGパターン",
        "code": "// POST処理後にリダイレクトしてF5二重送信を防止\nres.sendRedirect(req.getContextPath() + \"/app\");",
        "note": "Post-Redirect-Get（PRG）パターンにより、更新ボタンによる二重登録を防げる。"
      },
      {
        "title": "CSV1行への変換",
        "code": "public String toCsvString() {\n    return id + \",\" + date + \",\" + type + \",\" + category + \",\" + title + \",\" + price;\n}",
        "note": "カンマ区切りで保存し、読み込み時は split(\",\") で復元する。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_09_1",
        "title": "PRGパターンで二重登録を防止せよ",
        "description": "`doPost` で登録・削除処理を完了したあと、GET画面へリダイレクトするコードを完成させよう。",
        "codeTemplate": "dao.add(newItem);\nres.[1](req.getContextPath() + \"/app\");",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "sendRedirect",
              "forward",
              "setAttribute",
              "getWriter"
            ],
            "answer": "sendRedirect"
          }
        ],
        "hint": "ブラウザに「指定URLへGETでアクセスし直して」と指示するメソッドです。",
        "explanation": "POST処理後に `res.sendRedirect(...)` を使うことで、F5更新による二重送信を防げます（PRGパターン）。"
      },
      {
        "id": "q_09_2",
        "title": "KakeiboItem を CSV文字列に変換せよ",
        "description": "CSVファイルに保存するための `toCsvString()` メソッドを完成させよう。",
        "codeTemplate": "public String toCsvString() {\n    return id + \"[1]\" + date + \"[1]\" + category + \"[1]\" + price;\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              ",",
              ";",
              "|",
              ":"
            ],
            "answer": ","
          }
        ],
        "hint": "CSV（Comma-Separated Values）は各項目を特定の1文字で区切ります。",
        "explanation": "CSV形式では各フィールドをカンマ `,` で連結して1行の文字列として保存します。"
      }
    ],
    "codePuzzle": {
      "id": "p_09",
      "title": "DAO永続化とPRGパターンによる登録処理",
      "description": "新規明細を保存し、リロード二重送信を防ぐPRGリダイレクトまでの順に並べよう。",
      "steps": [
        "KakeiboItem item = new KakeiboItem(date, type, cat, title, price);",
        "dao.insert(item);",
        "res.sendRedirect(req.getContextPath() + \"/app\");"
      ],
      "hint": "モデル生成 → DAOで保存 → sendRedirect でGET画面へ飛ばす、の3ステップです。",
      "explanation": "POST処理でDBやCSVに保存したあと `sendRedirect` するのが PRG パターンです。"
    },
    "questions": [
      {
        "id": "L09_Q01",
        "no": 1,
        "topic": "データの永続化の意味",
        "prompt": "「データの永続化（Persistence）」とはどういうことですか？",
        "choices": {
          "A": "プログラムやサーバーを再起動してもデータが消えないように、ファイルやデータベースなどの記憶装置に保存すること",
          "B": "無限ループでプログラムを止めないこと",
          "C": "変数の名前を長くすること",
          "D": "画面の色を固定すること"
        },
        "answer": "A",
        "explanation": "データをファイルやDBに保存して、プログラム終了後も失われないようにすることを永続化と呼びます。"
      },
      {
        "id": "L09_Q02",
        "no": 2,
        "topic": "DAOパターンの役割",
        "prompt": "Webアプリケーション設計における **DAO（Data Access Object）** の役割として、最も適切なものはどれですか？",
        "choices": {
          "A": "HTMLのデザイン（CSS）を整える専門クラス",
          "B": "ファイルやデータベースに対するデータの取得・保存・削除などの読み書き処理を専門に担当するクラス",
          "C": "ブラウザそのものを動かすクラス",
          "D": "エラー画面だけを表示するクラス"
        },
        "answer": "B",
        "explanation": "データアクセス処理をDAOにまとめることで、Servletのコードがシンプルで読みやすくなります。"
      },
      {
        "id": "L09_Q03",
        "no": 3,
        "topic": "CSVファイルの形式",
        "prompt": "CSV（Comma-Separated Values）ファイルでは、1行の中の複数のデータ項目（日付、費目、品名、金額など）を何の記号で区切って保存しますか？",
        "choices": {
          "A": "カンマ `,`",
          "B": "ピリオド `.`",
          "C": "クエスチョン `?`",
          "D": "アットマーク `@`"
        },
        "answer": "A",
        "explanation": "Comma-Separated Values の名前の通り、カンマ `,` で値を区切ります。"
      },
      {
        "id": "L09_Q04",
        "no": 4,
        "topic": "CSVの1行を配列に分解するメソッド",
        "prompt": "ファイルから読み込んだ1行の文字列 `String line = \"1,食費,弁当,600\";` をカンマで区切って配列 `String[] parts` に分割するメソッドはどれですか？",
        "choices": {
          "A": "`line.cut(\",\")`",
          "B": "`line.split(\",\")`",
          "C": "`line.divide(\",\")`",
          "D": "`line.parse(\",\")`"
        },
        "answer": "B",
        "explanation": "`split(\",\")` でカンマの位置ごとに分割された配列を取得できます。"
      },
      {
        "id": "L09_Q05",
        "no": 5,
        "topic": "ファイルの1行読み込みメソッド",
        "prompt": "`BufferedReader br` を使って、テキストファイルから1行分の文字列を読み込むメソッドはどれですか？",
        "choices": {
          "A": "`br.readLine()`",
          "B": "`br.nextInt()`",
          "C": "`br.getParameter()`",
          "D": "`br.println()`"
        },
        "answer": "A",
        "explanation": "`readLine()` で1行ずつ文字列として読み込みます（『やさしいJava』Lesson 14参照）。"
      },
      {
        "id": "L09_Q06",
        "no": 6,
        "topic": "ファイルの終端判定",
        "prompt": "`BufferedReader` の `readLine()` メソッドでファイルを最後まで読み切ったとき（もう次の行がないとき）、戻り値として何が返ってきますか？",
        "choices": {
          "A": "`\"END\"` という文字列",
          "B": "`null`",
          "C": "`0`",
          "D": "`\"false\"`"
        },
        "answer": "B",
        "explanation": "ファイルの終端に達すると `null` が返るため、`while ((line = br.readLine()) != null)` が定番のイディオムです。"
      },
      {
        "id": "L09_Q07",
        "no": 7,
        "topic": "画面に見せずに値を送信するHTMLタグ",
        "prompt": "削除ボタンを押したときに、画面上には表示させずに「どのIDの行を削除するか（`id=5`）」というデータをフォームから一緒に送信したい場合、使うべき `<input>` の `type` はどれですか？",
        "choices": {
          "A": "`type=\"text\"`",
          "B": "`type=\"password\"`",
          "C": "`type=\"hidden\"`",
          "D": "`type=\"submit\"`"
        },
        "answer": "C",
        "explanation": "`type=\"hidden\"` はブラウザ画面には表示されず、送信時に `name` と `value` のペアをサーバーへ送ることができます。"
      },
      {
        "id": "L09_Q08",
        "no": 8,
        "topic": "1つのServletで追加と削除を振り分ける工夫",
        "prompt": "1つのServletの `doPost` メソッドで「新規追加」と「削除」の両方を受け付けたい場合、どのような方法で処理を分岐させるのが一般的ですか？",
        "choices": {
          "A": "フォームに `<input type=\"hidden\" name=\"action\" value=\"delete\">` のような識別用パラメータを入れて送り、Servlet側で `request.getParameter(\"action\")` の値を調べて分岐する",
          "B": "乱数でランダムに分岐する",
          "C": "分岐することは絶対にできない",
          "D": "`main` メソッドを2つ作る"
        },
        "answer": "A",
        "explanation": "`action` パラメータ（`\"add\"` や `\"delete\"`）を使って処理を切り替えるのはWeb開発の定番手法です。"
      },
      {
        "id": "L09_Q09",
        "no": 9,
        "topic": "CSV保存時のカンマ対策",
        "prompt": "ユーザーが品名に `\"パン,牛乳\"` のようにカンマ `,` を入力してしまうと、CSV読み込み時の `split(\",\")` で項目数がずれてしまいます。これを防ぐ簡単な対策はどれですか？",
        "choices": {
          "A": "`name.replace(\",\", \"、\")` のように、保存前に半角カンマを読点や別の文字に置き換える",
          "B": "品名を入力させないようにする",
          "C": "金額を0円にする",
          "D": "対策する方法はない"
        },
        "answer": "A",
        "explanation": "`String.replace(\"置換前\", \"置換後\")` を使うことで、区切り文字の衝突を簡単に防げます。"
      },
      {
        "id": "L09_Q10",
        "no": 10,
        "topic": "try-with-resources構文",
        "prompt": "`try (BufferedReader br = new BufferedReader(...)) { ... }` のように、`try` の直後の丸カッコ `()` の中でファイルストリームを開くと、どんなメリットがありますか？",
        "choices": {
          "A": "ファイルの読み込み速度が100倍になる",
          "B": "`try` ブロックを抜けたときに、自動的に `br.close()`（ファイルを閉じる処理）が呼ばれて閉じ忘れを防げる",
          "C": "コンパイルが不要になる",
          "D": "例外が絶対に発生しなくなる"
        },
        "answer": "B",
        "explanation": "Java 7以降で導入された `try-with-resources` 文で、ファイルの閉じ忘れ（リソースリーク）を確実に防げます。"
      }
    ]
  },
  {
    "id": 10,
    "lessonFile": "../lesson10.md",
    "title": "第10章：MyKakeibo魔王城（Web基礎完成）",
    "subtitle": "絞り込み検索 / バリデーション / XSS対策 / アプリ完成",
    "areaName": "基礎完成・MyKakeibo城",
    "story": "ついに最終決戦！検索機能・サーバー側バリデーション・XSS対策を施し、全10回の知識を結集して「MyKakeibo Webアプリ」を完成させよう！",
    "monster": {
      "name": "脆弱性魔王・バグキング",
      "title": "XSSと不正入力を操る最終ボス",
      "emoji": "👑",
      "color": "#eab308",
      "maxHp": 160,
      "intro": "「`<script>` タグやマイナス金額を送り込んで MyKakeibo を乗っ取ってやるぞ！」",
      "defeat": "「おおお…！バリデーション・XSSエスケープ・MVC・DAO すべてが完璧だ！君こそJavaマスターだ！」"
    },
    "badge": {
      "id": "badge_10",
      "name": "MyKakeibo マスター王冠",
      "icon": "👑"
    },
    "tips": [
      {
        "title": "絞り込み検索ロジック",
        "code": "if (keyword != null && !keyword.isEmpty()) {\n    if (!item.getTitle().contains(keyword)) continue;\n}",
        "note": "条件に合わないものを continue でスキップして検索結果を絞り込む。"
      },
      {
        "title": "サーバー側バリデーション",
        "code": "if (price <= 0) {\n    errorMsg = \"金額は1円以上を入力してください\";\n}",
        "note": "HTMLの required 属性だけでなく、Servlet側でも必ず数値・空文字を検証する。"
      },
      {
        "title": "XSS（クロスサイトスクリプティング）対策",
        "code": "private String escapeHtml(String s) {\n    return s.replace(\"&\", \"&amp;\")\n            .replace(\"<\", \"&lt;\")\n            .replace(\">\", \"&gt;\");\n}",
        "note": "ユーザー入力値をそのままHTML出力せず、エスケープ処理を行う。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_10_1",
        "title": "XSS攻撃を防ぐHTMLエスケープを完成させよ",
        "description": "悪意ある `<script>` タグを無害化する `escapeHtml` メソッドの空欄を埋めよう。",
        "codeTemplate": "public static String escapeHtml(String s) {\n    if (s == null) return \"\";\n    return s.replace(\"&\", \"&amp;\")\n            .replace(\"<\", \"[1]\")\n            .replace(\">\", \"[2]\");\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "&lt;",
              "&gt;",
              "&quot;",
              ""
            ],
            "answer": "&lt;"
          },
          {
            "label": "[2]",
            "options": [
              "&gt;",
              "&lt;",
              "&amp;",
              "/"
            ],
            "answer": "&gt;"
          }
        ],
        "hint": "`<` は less than、`>` は greater than を表すHTML実体参照に置き換えます。",
        "explanation": "`<` を `&lt;`、`>` を `&gt;` に変換することで、ブラウザがスクリプトとして実行するのを防ぎます。"
      },
      {
        "id": "q_10_2",
        "title": "サーバー側バリデーションとキーワード検索",
        "description": "金額が0以下ならエラーとし、検索キーワードが品名に含まれるかを判定するコードを完成させよう。",
        "codeTemplate": "if (price [1] 0) {\n    errors.add(\"金額は1円以上で入力してください\");\n}\nif (item.getTitle().[2](keyword)) {\n    result.add(item);\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "<=",
              ">",
              "==",
              "!="
            ],
            "answer": "<="
          },
          {
            "label": "[2]",
            "options": [
              "contains",
              "equals",
              "indexOf",
              "find"
            ],
            "answer": "contains"
          }
        ],
        "hint": "0円以下を弾く比較演算子と、部分一致を boolean で返す String メソッドを選びます。",
        "explanation": "`price <= 0` で0以下を弾き、`contains(keyword)` で品名への部分一致を判定します。"
      }
    ],
    "codePuzzle": {
      "id": "p_10",
      "title": "バリデーション＆検索フィルタの実行順",
      "description": "入力金額をチェックし、エラーがなければリストを検索して画面へ渡す流れを組み立てよう。",
      "steps": [
        "if (price <= 0) { errors.add(\"1円以上を入力\"); }",
        "String safeTitle = escapeHtml(title);",
        "ArrayList<KakeiboItem> filtered = dao.search(keyword);",
        "req.setAttribute(\"items\", filtered);"
      ],
      "hint": "入力検証 → XSSエスケープ → 検索実行 → 結果をスコープへ格納、の順です。",
      "explanation": "検証と無害化を済ませてから安全なデータを扱い、Viewへ渡します。"
    },
    "questions": [
      {
        "id": "L10_Q01",
        "no": 1,
        "topic": "検索フォームのHTTPメソッド",
        "prompt": "家計簿の「費目での絞り込み」や「キーワード検索」のように、サーバーのデータを書き換えずに条件に合う一覧を表示するフォームには、`GET` と `POST` のどちらを使うのが適切ですか？",
        "choices": {
          "A": "`GET`",
          "B": "`POST`",
          "C": "どちらでも動かない",
          "D": "`DELETE`"
        },
        "answer": "A",
        "explanation": "検索や絞り込みはURLに条件が含まれ、ブックマークやリセットも簡単な `GET` リクエストで作るのが基本です。"
      },
      {
        "id": "L10_Q02",
        "no": 2,
        "topic": "空文字のチェック",
        "prompt": "ユーザーが入力した文字列 `String name` の前後の空白を取り除いたうえで、中身が空っぽ（0文字）かどうかを判定するメソッドの組み合わせはどれですか？",
        "choices": {
          "A": "`name.trim().isEmpty()`",
          "B": "`name.split().length()`",
          "C": "`name.parseInt()`",
          "D": "`name.close()`"
        },
        "answer": "A",
        "explanation": "`trim()` で前後のスペースを除去し、`isEmpty()` で空文字かどうかを判定します。"
      },
      {
        "id": "L10_Q03",
        "no": 3,
        "topic": "XSS対策・HTMLエスケープ",
        "prompt": "ユーザーが入力した文字列をHTML画面に出力するとき、`<` を `&lt;`、`>` を `&gt;` に変換して悪意のあるスクリプト実行を防ぐセキュリティ対策を何と呼びますか？",
        "choices": {
          "A": "コンパイル",
          "B": "HTMLエスケープ（サニタイジング：無害化）",
          "C": "キャスト",
          "D": "オーバーライド"
        },
        "answer": "B",
        "explanation": "HTMLの特殊文字をエスケープすることで、XSS（クロスサイト・スクリプティング）攻撃を防ぎます。"
      },
      {
        "id": "L10_Q04",
        "no": 4,
        "topic": "数値の3桁カンマ区切りフォーマット",
        "prompt": "金額 `30000` を `\"30,000\"` のように3桁ごとのカンマ区切り文字列に整形するJavaの標準メソッドはどれですか？",
        "choices": {
          "A": "`String.format(\"%,d\", 30000)`",
          "B": "`Integer.parseInt(\"30000\")`",
          "C": "`Math.random()`",
          "D": "`30000.split(\",\")`"
        },
        "answer": "A",
        "explanation": "`String.format(\"%,d\", 整数)` を使うと、簡単に3桁カンマ区切りの文字列が作れます。"
      },
      {
        "id": "L10_Q05",
        "no": 5,
        "topic": "三項演算子：条件演算子",
        "prompt": "JSPやJavaコードでよく使われる `item.isIncome() ? \"+\" : \"-\"` という式（条件演算子・三項演算子）は、どういう意味ですか？",
        "choices": {
          "A": "`item.isIncome()` が `true` なら `\"+\"` に、`false` なら `\"-\"` になる（`if-else` を1行で書いたもの）",
          "B": "常に `\"+\"` になる",
          "C": "エラーが発生したときだけ `\"-\"` になる",
          "D": "ループを終了する"
        },
        "answer": "A",
        "explanation": "`条件式 ? 真のときの値 : 偽のときの値` は『やさしいJava』Lesson 5でも紹介されている条件演算子で、JSPの表示切り替えで大活躍します。"
      },
      {
        "id": "L10_Q06",
        "no": 6,
        "topic": "クラスとインスタンスの総復習",
        "prompt": "`KakeiboItem item = new KakeiboItem(1, \"2026-10-17\", \"支出\", \"食費\", \"弁当\", 650);` の1行で呼び出されている、`KakeiboItem` クラスの特別な初期化メソッドを何と呼びますか？",
        "choices": {
          "A": "メインメソッド",
          "B": "コンストラクタ",
          "C": "インターフェース",
          "D": "サーブレット"
        },
        "answer": "B",
        "explanation": "`new` と同時に呼ばれてフィールドを初期化するメソッドは**コンストラクタ**です。"
      },
      {
        "id": "L10_Q07",
        "no": 7,
        "topic": "カプセル化の総復習",
        "prompt": "`KakeiboItem` クラスのフィールド（`amount` や `name`）を `private` にし、`getAmount()` や `getName()` といった `public` メソッド経由で値を取得させる設計手法を何と呼びますか？",
        "choices": {
          "A": "カプセル化",
          "B": "無限ループ",
          "C": "リダイレクト",
          "D": "ポリモーフィズム"
        },
        "answer": "A",
        "explanation": "データを `private` で守り、公開されたメソッド（Getter/Setter）経由で扱うことを**カプセル化**と呼びます。"
      },
      {
        "id": "L10_Q08",
        "no": 8,
        "topic": "コレクションとループの総復習",
        "prompt": "`ArrayList<KakeiboItem> allList` の中から、「費目が `\"食費\"` のデータだけ」を抜き出して新しいリスト `result` を作りたいとき、使う制御文の組み合わせはどれですか？",
        "choices": {
          "A": "`for` 文（または拡張for文）の中に `if (item.getCategory().equals(\"食費\"))` を書いて `result.add(item)` する",
          "B": "`switch` 文だけを使う",
          "C": "`try-catch` だけを使う",
          "D": "配列の添字 `[0]` だけを見る"
        },
        "answer": "A",
        "explanation": "リストの全件を `for` で走査し、`if` で条件を満たすものだけを新しいリストに `add` するのがフィルタリングの基本アルゴリズムです。"
      },
      {
        "id": "L10_Q09",
        "no": 9,
        "topic": "MVCとDAOの総復習",
        "prompt": "完成した「MyKakeibo」アプリにおける4つの登場人物の役割として、**間違っているもの**はどれですか？",
        "choices": {
          "A": "`KakeiboItem`（Model）：家計簿1件分のデータと判定メソッドを持つクラス",
          "B": "`KakeiboDAO`（DAO）：CSVファイルへの保存・読み込み・検索・削除を担当するクラス",
          "C": "`MyKakeiboAppServlet`（Controller）：ブラウザからのリクエストを受け取り、DAOを呼んで計算し、JSPへフォワードするクラス",
          "D": "`app.jsp`（View）：データベースやCSVファイルを直接書き換えるだけで、HTML画面は一切出力しないファイル"
        },
        "answer": "D",
        "explanation": "`app.jsp`（View）は、Servletから渡されたデータを綺麗なHTML画面としてブラウザに出力する役割を担います。"
      },
      {
        "id": "L10_Q10",
        "no": 10,
        "topic": "今後のステップアップに向けて",
        "prompt": "この全10回で学んだ「Javaの基礎・オブジェクト指向（クラス／メソッド／継承／コレクション）」と「Webの基礎（HTTP／Servlet／JSP／MVC／DAO）」は、現在もっとも使われているフレームワーク **Spring Boot** やデータベース連携（**JDBC / SQL**）に進むときにどう役立ちますか？",
        "choices": {
          "A": "Spring Bootでも裏側ではまったく同じ「MVCモデル」「クラス・メソッド・リスト」「リクエストとレスポンス」の仕組みで動いているため、今回学んだ基礎がそのまま強力な土台になる！",
          "B": "まったく関係がない",
          "C": "変数やクラスはもう使われない",
          "D": "HTMLは今後使われない"
        },
        "answer": "A",
        "explanation": "Servlet/JSPとMVC・DAOの基礎を自分の手で書いた経験があると、Spring Bootなどの最新フレームワークを学んだときに「なぜこう書くのか」が驚くほど深く理解できます！"
      }
    ]
  },
  {
    "id": 11,
    "lessonFile": "../lesson11.md",
    "title": "第11章：SQLとJDBCの地下データベース",
    "subtitle": "SQLite / JDBC / PreparedStatement / SQLインジェクション対策",
    "areaName": "リレーショナル地下神殿",
    "story": "CSV保存の限界を超えろ！SQLとJDBCの力を手に入れ、`PreparedStatement` でSQLインジェクションを封じながらSQLiteデータベースへ進化させよう。",
    "monster": {
      "name": "SQLインジェクション・ワーム",
      "title": "文字列連結SQLを狙う寄生虫",
      "emoji": "🪱",
      "color": "#14b8a6",
      "maxHp": 150,
      "intro": "「`WHERE title = '` + 入力値 でSQLを書けば、`OR '1'='1` で全データを奪ってやるぞ！」",
      "defeat": "「`?` プレースホルダと `try-with-resources` …完全に防がれたか！」"
    },
    "badge": {
      "id": "badge_11",
      "name": "JDBC守護者の石板",
      "icon": "🗄️"
    },
    "tips": [
      {
        "title": "SQLのCRUD 4命令",
        "code": "SELECT * FROM kakeibo_items WHERE category = ?;\nINSERT INTO kakeibo_items (title, price) VALUES (?, ?);\nUPDATE kakeibo_items SET price = ? WHERE id = ?;\nDELETE FROM kakeibo_items WHERE id = ?;",
        "note": "UPDATEとDELETEには必ず WHERE を付ける！"
      },
      {
        "title": "PreparedStatementとtry-with-resources",
        "code": "try (Connection conn = DriverManager.getConnection(url);\n     PreparedStatement ps = conn.prepareStatement(sql)) {\n    ps.setString(1, category);\n    ResultSet rs = ps.executeQuery();\n}",
        "note": "プレースホルダ `?` の番号は 1 から始まる。"
      },
      {
        "title": "executeQuery と executeUpdate",
        "code": "ResultSet rs = ps.executeQuery();   // SELECT用\nint rows = ps.executeUpdate();    // INSERT/UPDATE/DELETE用",
        "note": "検索は executeQuery()、更新系は executeUpdate() を使い分ける。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_11_1",
        "title": "SQLインジェクションを防ぐ PreparedStatement",
        "description": "品名 `title` と金額 `price` を安全に `INSERT` する JDBC コードを完成させよう。",
        "codeTemplate": "String sql = \"INSERT INTO kakeibo_items (title, price) VALUES ([1], ?)\";\ntry (Connection conn = DriverManager.getConnection(dbUrl);\n     PreparedStatement ps = conn.prepareStatement(sql)) {\n    ps.setString(1, title);\n    ps.setInt(2, price);\n    ps.[2]();\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "?",
              "$1",
              ":title",
              "%s"
            ],
            "answer": "?"
          },
          {
            "label": "[2]",
            "options": [
              "executeUpdate",
              "executeQuery",
              "runSql",
              "commitQuery"
            ],
            "answer": "executeUpdate"
          }
        ],
        "hint": "JDBCのプレースホルダ記号と、INSERT/UPDATE/DELETE用の実行メソッドを選びます。",
        "explanation": "JDBCでは `?` をプレースホルダに使い、更新系SQLは `ps.executeUpdate()` で実行します。"
      },
      {
        "id": "q_11_2",
        "title": "ResultSet からデータを1行ずつ取り出す",
        "description": "`SELECT` の結果セットから全件をループで読み取るコードを完成させよう。",
        "codeTemplate": "while (rs.[1]()) {\n    int id = rs.[2](\"id\");\n    String title = rs.getString(\"title\");\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "next",
              "hasNext",
              "read",
              "move"
            ],
            "answer": "next"
          },
          {
            "label": "[2]",
            "options": [
              "getInt",
              "getInteger",
              "readInt",
              "intValue"
            ],
            "answer": "getInt"
          }
        ],
        "hint": "ResultSet のカーソルを1行進めるメソッドと、整数列を取り出すメソッドです。",
        "explanation": "`while (rs.next())` で行を進め、`rs.getInt(\"列名\")` で整数値を取得します。"
      }
    ],
    "codePuzzle": {
      "id": "p_11",
      "title": "JDBCによる安全なSELECT検索手順",
      "description": "`PreparedStatement` を使ってデータベースから検索結果を取り出す正しいコード順に並べよう。",
      "steps": [
        "String sql = \"SELECT id, title, price FROM kakeibo_items WHERE category = ?\";",
        "PreparedStatement ps = conn.prepareStatement(sql);",
        "ps.setString(1, \"食費\");",
        "ResultSet rs = ps.executeQuery();",
        "while (rs.next()) { System.out.println(rs.getString(\"title\")); }"
      ],
      "hint": "SQL文字列を用意 → prepareStatement → `?` に値をセット → executeQuery → rs.next() で読み取り。",
      "explanation": "必ず `executeQuery()` を呼ぶ前に `ps.setString(1, ...)` でパラメータを設定します。"
    },
    "questions": [
      {
        "id": "L11_Q01",
        "no": 1,
        "topic": "SQLの基本操作CRUD",
        "prompt": "データベースの4大基本操作「CRUD」において、データの「取得（検索）」と「更新」に対応するSQL命令の組み合わせはどれですか？",
        "choices": {
          "A": "取得：`GET` ／ 更新：`CHANGE`",
          "B": "取得：`SELECT` ／ 更新：`UPDATE`",
          "C": "取得：`FIND` ／ 更新：`MODIFY`",
          "D": "取得：`READ` ／ 更新：`ALTER`"
        },
        "answer": "B",
        "explanation": "CRUD は Create=`INSERT`, Read=`SELECT`, Update=`UPDATE`, Delete=`DELETE` です。"
      },
      {
        "id": "L11_Q02",
        "no": 2,
        "topic": "WHERE句の役割",
        "prompt": "`DELETE FROM kakeibo_items;` のように `WHERE` 句を付けずに `DELETE` 文を実行するとどうなりますか？",
        "choices": {
          "A": "1件も削除されない",
          "B": "最新の1件だけが削除される",
          "C": "テーブル内の全データが削除されてしまう",
          "D": "コンパイルエラーになる"
        },
        "answer": "C",
        "explanation": "`WHERE` 句を忘れるとテーブルの全行が削除されるため、`DELETE` / `UPDATE` 時は必ず条件を確認します。"
      },
      {
        "id": "L11_Q03",
        "no": 3,
        "topic": "JDBCの接続とリソース管理",
        "prompt": "JDBCで取得した `Connection`、`PreparedStatement`、`ResultSet` を使い終わったあとに必ず自動的に `close()` するためのJava構文はどれですか？",
        "choices": {
          "A": "`try-with-resources`（`try (Connection conn = ...) { ... }`）",
          "B": "`switch-case`",
          "C": "`do-while`",
          "D": "`implements Closeable`"
        },
        "answer": "A",
        "explanation": "`try (...)` の丸カッコ内で開いた `Connection` 等は、ブロック終了時に自動で `close()` されます。"
      },
      {
        "id": "L11_Q04",
        "no": 4,
        "topic": "executeQuery と executeUpdate の使い分け",
        "prompt": "`SELECT` 文を実行するときに使うメソッドと、`INSERT` / `UPDATE` / `DELETE` 文を実行するときに使うメソッドの正しい組み合わせはどれですか？",
        "choices": {
          "A": "SELECT：`executeUpdate()` ／ INSERT等：`executeQuery()`",
          "B": "SELECT：`executeQuery()` ／ INSERT等：`executeUpdate()`",
          "C": "どちらも `runSql()` を使う",
          "D": "どちらも `printSql()` を使う"
        },
        "answer": "B",
        "explanation": "結果を返す `SELECT` は `executeQuery()`、件数を更新する `INSERT`/`UPDATE`/`DELETE` は `executeUpdate()` を使います。"
      },
      {
        "id": "L11_Q05",
        "no": 5,
        "topic": "SQLインジェクション対策",
        "prompt": "Webフォームから受け取った検索文字をSQL文に安全に埋め込むための正しい方法はどれですか？",
        "choices": {
          "A": "`String sql = \"SELECT * FROM kakeibo_items WHERE title = '\" + title + \"'\";` と文字列連結する",
          "B": "`PreparedStatement` の `?`（プレースホルダ）を使い、`ps.setString(1, title)` で値をセットする",
          "C": "HTMLのフォームを `method=\"get\"` にする",
          "D": "CSSで入力欄を隠す"
        },
        "answer": "B",
        "explanation": "`PreparedStatement` の `?` プレースホルダを使うことで、SQLインジェクション攻撃を根本から防げます。"
      },
      {
        "id": "L11_Q06",
        "no": 6,
        "topic": "ResultSetの読み取り",
        "prompt": "`ResultSet rs = ps.executeQuery();` で取得した結果表から、1行ずつデータを取り出しながら最後までループする正しい書き方はどれですか？",
        "choices": {
          "A": "`while (rs.next()) { ... }`",
          "B": "`for (int i = 0; i < rs.length; i++) { ... }`",
          "C": "`if (rs.hasMore()) { ... }`",
          "D": "`while (rs.readLine()) { ... }`"
        },
        "answer": "A",
        "explanation": "`rs.next()` は次の行へカーソルを進め、データがあれば `true`、終わりに達したら `false` を返します。"
      },
      {
        "id": "L11_Q07",
        "no": 7,
        "topic": "プレースホルダの番号",
        "prompt": "`INSERT INTO kakeibo_items (title, price) VALUES (?, ?)` において、2番目の `?` に整数変数 `amount` を設定する正しいコードはどれですか？",
        "choices": {
          "A": "`ps.setInt(1, amount);`",
          "B": "`ps.setInt(2, amount);`",
          "C": "`ps.setString(2, amount);`",
          "D": "`ps.addParam(\"price\", amount);`"
        },
        "answer": "B",
        "explanation": "JDBCのプレースホルダ番号は `0` ではなく **`1` から**始まります。2番目は `ps.setInt(2, amount)` です。"
      },
      {
        "id": "L11_Q08",
        "no": 8,
        "topic": "DAOパターンの利点",
        "prompt": "保存先をCSVファイル（`KakeiboDAO`）からSQLiteデータベース（`KakeiboJdbcDAO`）へ切り替える際、DAOパターンで設計しておくとどのようなメリットがありますか？",
        "choices": {
          "A": "データアクセス処理がDAOに分離されているため、JSPやServletの画面・制御ロジックへの修正を最小限に抑えられる",
          "B": "HTMLタグを書かなくてよくなる",
          "C": "Javaのコンパイルが不要になる",
          "D": "JavaScriptを使わずにCSSだけでDB接続できる"
        },
        "answer": "A",
        "explanation": "データ永続化の仕組みをDAOに閉じ込める（疎結合にする）ことで、保守性・拡張性が大きく向上します。"
      },
      {
        "id": "L11_Q09",
        "no": 9,
        "topic": "主キーとAUTO INCREMENT",
        "prompt": "テーブル定義で `id INTEGER PRIMARY KEY AUTOINCREMENT` と指定すると、`INSERT` 時にどうなりますか？",
        "choices": {
          "A": "毎回プログラム側でランダムな文字を作る必要がある",
          "B": "データベースが重複しない連番の `id` を自動的に採番してくれる",
          "C": "`id` がすべて `0` になる",
          "D": "1件しか登録できなくなる"
        },
        "answer": "B",
        "explanation": "主キー（PRIMARY KEY）に自動採番を設定すると、一意の番号をDB側が安全に割り当てます。"
      },
      {
        "id": "L11_Q10",
        "no": 10,
        "topic": "トランザクションの意味",
        "prompt": "銀行の振込処理のように「出金と入金をセットで行い、片方が失敗したら両方取り消す」仕組みをデータベース用語で何と呼びますか？",
        "choices": {
          "A": "トランザクション管理（`commit` / `rollback`）",
          "B": "カプセル化",
          "C": "キャスト変換",
          "D": "ポリモーフィズム"
        },
        "answer": "A",
        "explanation": "複数の処理を「すべて成功（`commit`）」か「すべて取り消し（`rollback`）」にまとめる仕組みがトランザクションです。"
      }
    ]
  },
  {
    "id": 12,
    "lessonFile": "../lesson12.md",
    "title": "第12章：HashMap・Stream・JSON APIの通信塔",
    "subtitle": "HashMap / ラムダ式 / Stream API / JSON & fetch()",
    "areaName": "非同期JSON通信塔",
    "story": "`HashMap` で費目別合計を一瞬で集計し、Stream API でリストを自在に加工！さらに JSON を返す REST API でブラウザと非同期通信しよう。",
    "monster": {
      "name": "同期ブロッキング・サイクロプス",
      "title": "毎回ページ全体を再読込させる単眼巨人",
      "emoji": "👁️",
      "color": "#8b5cf6",
      "maxHp": 150,
      "intro": "「HTML丸ごと再生成しか知らぬ者よ、JSONとStreamの洗練された力に耐えられるか！」",
      "defeat": "「`HashMap` と `stream().filter().mapToInt().sum()` …完璧なデータ処理だ！」"
    },
    "badge": {
      "id": "badge_12",
      "name": "Stream通信の宝珠",
      "icon": "📡"
    },
    "tips": [
      {
        "title": "HashMap で費目別集計",
        "code": "Map<String, Integer> totals = new HashMap<>();\ntotals.put(cat, totals.getOrDefault(cat, 0) + price);",
        "note": "getOrDefault(key, 0) を使うと初回登録時の null チェックが不要になる。"
      },
      {
        "title": "Stream API で1行集計",
        "code": "int sum = items.stream()\n    .filter(i -> \"支出\".equals(i.getType()))\n    .mapToInt(KakeiboItem::getPrice)\n    .sum();",
        "note": "filter → mapToInt → sum のパイプラインでループを簡潔に書ける。"
      },
      {
        "title": "JSONレスポンス",
        "code": "res.setContentType(\"application/json; charset=UTF-8\");\nres.getWriter().printf(\"{\\\"balance\\\": %d}\", balance);",
        "note": "JSONキーと文字列は必ずダブルクォート \" で囲む。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_12_1",
        "title": "Stream API で支出合計を1文で計算せよ",
        "description": "`items` から `\"支出\"` だけを抜き出し、金額の合計を計算する Stream を完成させよう。",
        "codeTemplate": "int total = items.stream()\n    .[1](i -> \"支出\".equals(i.getType()))\n    .mapToInt(KakeiboItem::getPrice)\n    .[2]();",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "filter",
              "where",
              "select",
              "find"
            ],
            "answer": "filter"
          },
          {
            "label": "[2]",
            "options": [
              "sum",
              "total",
              "addAll",
              "count"
            ],
            "answer": "sum"
          }
        ],
        "hint": "条件で絞り込む中間操作と、intストリームを合計する終端操作を選びます。",
        "explanation": "`filter(...)` で要素を絞り込み、`mapToInt(...)` のあとに `.sum()` で合計を求めます。"
      },
      {
        "id": "q_12_2",
        "title": "HashMap の getOrDefault と JSON Content-Type",
        "description": "費目別マップに安全に加算する処理と、JSONを返すレスポンス設定を完成させよう。",
        "codeTemplate": "int prev = map.[1](cat, 0);\nmap.put(cat, prev + price);\nres.setContentType(\"[2]; charset=UTF-8\");",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "getOrDefault",
              "getOrZero",
              "fetch",
              "find"
            ],
            "answer": "getOrDefault"
          },
          {
            "label": "[2]",
            "options": [
              "application/json",
              "text/json",
              "application/javascript",
              "text/html"
            ],
            "answer": "application/json"
          }
        ],
        "hint": "キーが無いときに既定値を返す Map メソッドと、JSONの正式な MIME タイプを選びます。",
        "explanation": "`getOrDefault(cat, 0)` で null を防ぎ、JSON API の MIME タイプは `application/json` です。"
      }
    ],
    "codePuzzle": {
      "id": "p_12",
      "title": "JSON API サーブレットのレスポンス組み立て",
      "description": "`HashMap` で集計した結果を JSON としてブラウザへ返す正しい順に並べよう。",
      "steps": [
        "res.setContentType(\"application/json; charset=UTF-8\");",
        "int expense = items.stream().mapToInt(KakeiboItem::getPrice).sum();",
        "String json = \"{\\\"expense\\\": \" + expense + \"}\";",
        "res.getWriter().println(json);"
      ],
      "hint": "Content-Type を設定し、Stream で集計して JSON文字列を作り、PrintWriter で書き出します。",
      "explanation": "JSON出力前に `application/json` を設定し、集計値をJSON形式にして送信します。"
    },
    "questions": [
      {
        "id": "L12_Q01",
        "no": 1,
        "topic": "HashMapの特徴",
        "prompt": "`ArrayList` と比較したときの `HashMap<String, Integer>` の特徴として最も適切なものはどれですか？",
        "choices": {
          "A": "「`\"食費\"` → `1500`」のように「キー（名前）」と「値」のペアでデータを管理し、キーを指定して高速に取り出せる",
          "B": "数値の添字 `[0]` でしかアクセスできない",
          "C": "同じキーで何度も値を保存すると値が自動的に足し算される",
          "D": "HTMLファイルの中でしか使えない"
        },
        "answer": "A",
        "explanation": "`HashMap` はキーと値（Key-Value）の対応でデータを管理し、費目別の集計などで大活躍します。"
      },
      {
        "id": "L12_Q02",
        "no": 2,
        "topic": "getOrDefaultの役割",
        "prompt": "`int cur = map.getOrDefault(\"食費\", 0);` を実行したとき、マップに `\"食費\"` というキーがまだ存在しない場合、`cur` には何が入りますか？",
        "choices": {
          "A": "`null`（NullPointerExceptionになる）",
          "B": "`0`",
          "C": "`-1`",
          "D": "エラーで止まる"
        },
        "answer": "B",
        "explanation": "`getOrDefault(key, defaultValue)` はキーが存在しない場合に第2引数の既定値（ここでは `0`）を返します。"
      },
      {
        "id": "L12_Q03",
        "no": 3,
        "topic": "HashSetの特徴",
        "prompt": "登録されている費目名の一覧から「重複を除いた一意な費目リスト」を作りたいとき、重複を自動的に排除してくれるコレクションはどれですか？",
        "choices": {
          "A": "`ArrayList<String>`",
          "B": "`HashSet<String>`",
          "C": "`int[]`",
          "D": "`Scanner`"
        },
        "answer": "B",
        "explanation": "`Set`（`HashSet`）は要素の重複を許さないコレクションです。"
      },
      {
        "id": "L12_Q04",
        "no": 4,
        "topic": "Stream APIのfilter",
        "prompt": "`items.stream().filter(i -> i.getPrice() >= 1000)` の `filter` が行っている処理はどれですか？",
        "choices": {
          "A": "金額をすべて1000に変更する",
          "B": "金額が1000以上の要素だけを抽出して次の処理へ流す",
          "C": "リストを逆順に並べ替える",
          "D": "リストから要素を完全に削除して空にする"
        },
        "answer": "B",
        "explanation": "`filter` は条件式が `true` になる要素だけを通過させ、元のリスト自体は破壊しません。"
      },
      {
        "id": "L12_Q05",
        "no": 5,
        "topic": "メソッド参照とラムダ式",
        "prompt": "`item -> item.getPrice()` と同じ意味になるJavaの「メソッド参照」の書き方はどれですか？",
        "choices": {
          "A": "`KakeiboItem::getPrice`",
          "B": "`KakeiboItem->getPrice`",
          "C": "`KakeiboItem.getPrice()`",
          "D": "`@KakeiboItem.getPrice`"
        },
        "answer": "A",
        "explanation": "`クラス名::メソッド名` と書くことで、簡潔なメソッド参照が書けます。"
      },
      {
        "id": "L12_Q06",
        "no": 6,
        "topic": "JSONの基本形式",
        "prompt": "REST API でよく使われる JSON 形式として**正しい構文**はどれですか？",
        "choices": {
          "A": "`{'income': 5000, 'expense': 1200}`（シングルクォート）",
          "B": "`{\"income\": 5000, \"expense\": 1200}`（キーと文字列をダブルクォートで囲む）",
          "C": "`<income>5000</income>`",
          "D": "`income=5000; expense=1200;`"
        },
        "answer": "B",
        "explanation": "JSON仕様ではキー名も文字列値も必ずダブルクォート `\"` で囲みます。"
      },
      {
        "id": "L12_Q07",
        "no": 7,
        "topic": "Content-Typeの設定",
        "prompt": "ServletからHTMLではなくJSONデータを返すとき、`res.setContentType(...)` に指定する正しいMIMEタイプはどれですか？",
        "choices": {
          "A": "`\"text/html; charset=UTF-8\"`",
          "B": "`\"application/json; charset=UTF-8\"`",
          "C": "`\"text/csv; charset=UTF-8\"`",
          "D": "`\"image/png\"`"
        },
        "answer": "B",
        "explanation": "JSONレスポンスには `application/json; charset=UTF-8` を指定します。"
      },
      {
        "id": "L12_Q08",
        "no": 8,
        "topic": "ブラウザ側のfetch API",
        "prompt": "JavaScript の `fetch(\"api/summary\")` を使ってサーバーと非同期通信する最大のメリットは何ですか？",
        "choices": {
          "A": "ページ全体を再読み込み（画面遷移）せずに、画面の一部のデータやグラフだけを滑らかに更新できる",
          "B": "Javaサーバーを起動しなくてもデータベースが動くようになる",
          "C": "SQLインジェクションが自動で見つかる",
          "D": "CSSファイルが不要になる"
        },
        "answer": "A",
        "explanation": "`fetch()` による非同期通信（SPA/Ajax的更新）により、ページ再読み込みなしの快適なUIが作れます。"
      },
      {
        "id": "L12_Q09",
        "no": 9,
        "topic": "Optional と orElse",
        "prompt": "`items.stream().mapToInt(KakeiboItem::getPrice).average().orElse(0.0)` で最後の `.orElse(0.0)` を付ける理由は何ですか？",
        "choices": {
          "A": "リストが0件だった場合に「値なし」でエラーになるのを防ぎ、既定値 `0.0` を受け取るため",
          "B": "平均値を必ず0にするため",
          "C": "整数に変換するため",
          "D": "例外を強制発生させるため"
        },
        "answer": "A",
        "explanation": "`average()` は結果が空かもしれないため `OptionalDouble` を返します。`.orElse(0.0)` で安全に取り出せます。"
      },
      {
        "id": "L12_Q10",
        "no": 10,
        "topic": "RESTfulなHTTPメソッド",
        "prompt": "Web APIの設計において、データの「取得」「新規作成」「更新」「削除」にそれぞれ対応するHTTPメソッドの組み合わせとして一般的なものはどれですか？",
        "choices": {
          "A": "取得：`GET` ／ 新規作成：`POST` ／ 更新：`PUT`（または`PATCH`） ／ 削除：`DELETE`",
          "B": "すべて `GET` だけを使う",
          "C": "取得：`DELETE` ／ 削除：`GET`",
          "D": "更新：`PRINT` ／ 作成：`CLASS`"
        },
        "answer": "A",
        "explanation": "HTTPメソッドの意味（GET/POST/PUT/DELETE）をCRUD操作に対応させるのがREST APIの基本設計です。"
      }
    ]
  },
  {
    "id": 13,
    "lessonFile": "../lesson13.md",
    "title": "第13章：JUnit単体テストと品質保証の砦",
    "subtitle": "JUnit 5 / @Test / assertThrows / 境界値テスト / スタックトレース",
    "areaName": "品質保証のテスト砦",
    "story": "アプリが大きくなるほどデグレード（先祖返りバグ）の恐怖が迫る！JUnit 5 自動テストの鎧をまとい、どんな変更にも耐える品質を手に入れよう。",
    "monster": {
      "name": "デグレード・キメラ",
      "title": "修正のたびに別機能を壊す混沌の魔獣",
      "emoji": "🧪",
      "color": "#ef4444",
      "maxHp": 160,
      "intro": "「手作業のテストなどどうせ忘れる！1箇所直せば別のバグを生んでやるぞ！」",
      "defeat": "「`@Test` と `assertThrows`、さらに境界値テストまで…完全な自動防衛網だ！」"
    },
    "badge": {
      "id": "badge_13",
      "name": "JUnit品質の盾",
      "icon": "🧪"
    },
    "tips": [
      {
        "title": "JUnit 5 の基本形（AAAパターン）",
        "code": "@Test\nvoid testCalcBalance() {\n    // Arrange & Act & Assert\n    assertEquals(1500, calcBalance(3000, 1500));\n}",
        "note": "assertEquals(期待値, 実際の値) の順で渡す。"
      },
      {
        "title": "例外スローの検証",
        "code": "assertThrows(IllegalArgumentException.class, () -> {\n    item.setPrice(-100);\n});",
        "note": "異常系は assertThrows で「意図通りエラーになること」を自動検証する。"
      },
      {
        "title": "境界値テストとスタックトレース",
        "code": "// 1円以上が正常なら、境界の 0 と 1 を必ずテスト！",
        "note": "スタックトレースは1行目の例外名と、自分のクラス名・行番号から追う。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_13_1",
        "title": "JUnit 5 で正常系・異常系テストを実装せよ",
        "description": "残高計算が一致することと、マイナス金額で例外が飛ぶことを検証するテストを完成させよう。",
        "codeTemplate": "[1]\nvoid testPriceValidation() {\n    [2](IllegalArgumentException.class, () -> {\n        new KakeiboItem(\"食費\", -1);\n    });\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "@Test",
              "@Run",
              "@Before",
              "@Check"
            ],
            "answer": "@Test"
          },
          {
            "label": "[2]",
            "options": [
              "assertThrows",
              "assertEquals",
              "assertTrue",
              "expectError"
            ],
            "answer": "assertThrows"
          }
        ],
        "hint": "テストメソッドを表すアノテーションと、例外発生を検証するアサーションメソッドを選びます。",
        "explanation": "`@Test` でテストを宣言し、`assertThrows(例外.class, () -> ...)` で例外発生を検証します。"
      },
      {
        "id": "q_13_2",
        "title": "不正金額を弾く防御的メソッド",
        "description": "0円以下が渡されたときに `IllegalArgumentException` を投げるセッターを完成させよう。",
        "codeTemplate": "public void setPrice(int price) {\n    if (price <= 0) {\n        [1] new [2](\"1円以上を指定してください\");\n    }\n    this.price = price;\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "throw",
              "throws",
              "return",
              "catch"
            ],
            "answer": "throw"
          },
          {
            "label": "[2]",
            "options": [
              "IllegalArgumentException",
              "NullPointerException",
              "IOException",
              "ExceptionBase"
            ],
            "answer": "IllegalArgumentException"
          }
        ],
        "hint": "メソッド内部で例外インスタンスを発生させるキーワードと、引数不正を表す標準例外クラスです。",
        "explanation": "`throw new IllegalArgumentException(...)` で不正な引数を即座に検出できます（メソッド宣言は `throws`、送出は `throw`）。"
      }
    ],
    "codePuzzle": {
      "id": "p_13",
      "title": "JUnit テストケースの AAA パターン構築",
      "description": "`@BeforeEach` の準備から `@Test` の AAA（Arrange → Act → Assert）までの正しい順に並べよう。",
      "steps": [
        "@BeforeEach void setUp() { list = new ArrayList<>(); }",
        "@Test void testAddItem() {",
        "    KakeiboItem item = new KakeiboItem(\"食費\", 500);",
        "    list.add(item);",
        "    assertEquals(1, list.size());",
        "}"
      ],
      "hint": "@BeforeEach で初期化 → @Test 開始 → Arrange(生成) → Act(追加) → Assert(件数検証) → 閉じカッコ。",
      "explanation": "テストの前準備を `@BeforeEach` に置き、テスト本体を準備・実行・検証の順で書きます。"
    },
    "questions": [
      {
        "id": "L13_Q01",
        "no": 1,
        "topic": "単体テストの目的",
        "prompt": "JUnitなどを使って自動化された「単体テスト（Unit Test）」を書く最大のメリットは何ですか？",
        "choices": {
          "A": "コードを修正・機能追加したあとも、既存のロジックが壊れていないかを1コマンドで瞬時に確認できる",
          "B": "HTMLの見た目が自動で綺麗になる",
          "C": "データベースが不要になる",
          "D": "Javaファイルが自動的にPythonへ変換される"
        },
        "answer": "A",
        "explanation": "自動テスト（回帰テスト）があることで、安心して機能追加やコード改善ができます。"
      },
      {
        "id": "L13_Q02",
        "no": 2,
        "topic": "JUnitのテストメソッド指定",
        "prompt": "JUnit 5 で「このメソッドをテストケースとして実行してほしい」と目印を付けるアノテーションはどれですか？",
        "choices": {
          "A": "`@Run`",
          "B": "`@Test`",
          "C": "`@Check`",
          "D": "`@Assert`"
        },
        "answer": "B",
        "explanation": "JUnitではテスト対象メソッドに `@Test` アノテーションを付けます。"
      },
      {
        "id": "L13_Q03",
        "no": 3,
        "topic": "assertEqualsの引数順",
        "prompt": "JUnit の `assertEquals(a, b)` では、一般的に第1引数 `a` と第2引数 `b` にそれぞれ何を渡しますか？",
        "choices": {
          "A": "第1引数：実際の結果（actual）／ 第2引数：期待値（expected）",
          "B": "第1引数：期待値（expected）／ 第2引数：実際の結果（actual）",
          "C": "どちらもテストの名前を渡す",
          "D": "どちらも `null` を渡す"
        },
        "answer": "B",
        "explanation": "JUnitの `assertEquals(expected, actual)` は「期待値, 実際の値」の順で渡します。失敗時のメッセージも分かりやすくなります。"
      },
      {
        "id": "L13_Q04",
        "no": 4,
        "topic": "例外発生のテスト",
        "prompt": "「金額に `-100` を渡したら `IllegalArgumentException` が発生するはずだ」という異常系テストを書くときに使うアサーションはどれですか？",
        "choices": {
          "A": "`assertThrows(IllegalArgumentException.class, () -> ...)`",
          "B": "`assertNull(...)`",
          "C": "`try { ... } catch (Exception e) {}` だけで何もしない",
          "D": "`System.exit(1)`"
        },
        "answer": "A",
        "explanation": "`assertThrows` を使うと、指定した例外が投げられなければテスト失敗（FAIL）として検出できます。"
      },
      {
        "id": "L13_Q05",
        "no": 5,
        "topic": "スタックトレースの読み方",
        "prompt": "コンソールに数十行のスタックトレース（エラーログ）が出力されたとき、自分のコードのどこに原因があるか特定する最も効率的な見方はどれですか？",
        "choices": {
          "A": "一番下の行だけを読む",
          "B": "1行目の「例外の種類とメッセージ」を確認し、続いて `at ...` の中から自分が作成したクラス名・行番号を探す",
          "C": "エラーが出たらPCを再起動する",
          "D": "ランダムにコードを削除してみる"
        },
        "answer": "B",
        "explanation": "1行目の例外名＋原因メッセージと、`at 自分のクラス名(ファイル名:行番号)` を確認するのが鉄則です。"
      },
      {
        "id": "L13_Q06",
        "no": 6,
        "topic": "境界値テストの考え方",
        "prompt": "「金額は `1` 円以上を受け付け、`0` 円以下はエラーとする」という仕様をテストするとき、境界値テストとして最も重要な入力値の組み合わせはどれですか？",
        "choices": {
          "A": "`-1000` と `100000` だけ",
          "B": "`0`（エラーになる最大の値）と `1`（正常になる最小の値）",
          "C": "`\"あいうえお\"` だけ",
          "D": "`500` だけ"
        },
        "answer": "B",
        "explanation": "バグは「`>` と `>=` の間違い」など境界付近に潜みやすいため、`0` と `1` のテストが不可欠です。"
      },
      {
        "id": "L13_Q07",
        "no": 7,
        "topic": "IllegalArgumentExceptionの役割",
        "prompt": "メソッドの引数に「ありえない不正な値（マイナス金額や空文字など）」が渡されたときに投げるのが適切なJava標準例外はどれですか？",
        "choices": {
          "A": "`IllegalArgumentException`",
          "B": "`FileNotFoundException`",
          "C": "`OutOfMemoryError`",
          "D": "`ArithmeticException`"
        },
        "answer": "A",
        "explanation": "不正な引数（Illegal Argument）を知らせる標準例外が `IllegalArgumentException` です。"
      },
      {
        "id": "L13_Q08",
        "no": 8,
        "topic": "@BeforeEachの役割",
        "prompt": "テストクラス内で `@BeforeEach` を付けたメソッドは、いつ実行されますか？",
        "choices": {
          "A": "クラス内のすべてのテストが終わったあとに1回だけ",
          "B": "各 `@Test` メソッドが実行される直前に毎回実行される（テスト同士が互いに影響しないよう初期化する）",
          "C": "テストが失敗したときだけ実行される",
          "D": "手動で呼び出さない限り実行されない"
        },
        "answer": "B",
        "explanation": "テスト間の独立性を保つため、`@BeforeEach` で毎回クリーンな状態を用意します。"
      },
      {
        "id": "L13_Q09",
        "no": 9,
        "topic": "AAAパターン",
        "prompt": "読みやすいテストコードを書く基本構成「AAAパターン」の3つのステップの正しい並びはどれですか？",
        "choices": {
          "A": "Arrange（準備） → Act（実行） → Assert（検証）",
          "B": "Add → Alter → Abort",
          "C": "Ask → Answer → Archive",
          "D": "Array → Attribute → Action"
        },
        "answer": "A",
        "explanation": "Arrange（準備）→ Act（実行）→ Assert（検証）で書くと誰が見ても意図が明確になります。"
      },
      {
        "id": "L13_Q10",
        "no": 10,
        "topic": "テストとリファクタリング",
        "prompt": "テストコードが揃っている状態で、外部から見た動作を変えずにコード内部の読みやすさや構造を整理・改善する作業を何と呼びますか？",
        "choices": {
          "A": "リファクタリング（Refactoring）",
          "B": "デプロイ（Deploy）",
          "C": "シリアライズ（Serialize）",
          "D": "コンパイルエラー（Compile Error）"
        },
        "answer": "A",
        "explanation": "自動テストを安全網にして内部設計を綺麗に保つ作業をリファクタリングと呼びます。"
      }
    ]
  },
  {
    "id": 14,
    "lessonFile": "../lesson14.md",
    "title": "第14章：Maven ＆ Spring Boot 大聖堂（最終決戦）",
    "subtitle": "Maven / pom.xml / Spring Boot / @RestController / DI",
    "areaName": "Spring Boot 天空聖堂",
    "story": "ついに全14回の最終章！手動コンパイルを卒業し、Maven と Spring Boot の世界で「これまで学んだすべてが1つに繋がる瞬間」を体感せよ！",
    "monster": {
      "name": "レガシーモノリス魔王",
      "title": "依存地獄と密結合を司る真のラスボス",
      "emoji": "🏆",
      "color": "#f59e0b",
      "maxHp": 180,
      "intro": "「手作業のJAR配置と密結合コードのまま、現代の開発現場へ進めると思うなよ！」",
      "defeat": "「Mavenの `pom.xml`、DI、そして `@RestController` …君は真のJavaエンジニアとなった！」"
    },
    "badge": {
      "id": "badge_14",
      "name": "Javaフルスタック勇者王冠",
      "icon": "🏆"
    },
    "tips": [
      {
        "title": "Maven 3大コマンド",
        "code": "mvn compile   // コンパイル\nmvn test      // JUnit全テスト実行\nmvn package   // 実行可能JAR作成",
        "note": "依存ライブラリは pom.xml に書いて自動管理する。"
      },
      {
        "title": "Spring Boot Controller",
        "code": "@RestController\n@RequestMapping(\"/api/kakeibo\")\npublic class KakeiboController {\n    @GetMapping\n    public List<KakeiboItem> list() { return repo.findAll(); }\n}",
        "note": "オブジェクトを return するだけで自動的にJSONレスポンスになる。"
      },
      {
        "title": "DI（依存性注入）",
        "code": "private final KakeiboRepository repo;\npublic KakeiboController(KakeiboRepository repo) {\n    this.repo = repo;\n}",
        "note": "new を自分で書かずコンストラクタ経由で受け取ることで、テスト時に差し替えやすくなる。"
      }
    ],
    "codingQuests": [
      {
        "id": "q_14_1",
        "title": "Spring Boot の REST Controller を完成させよ",
        "description": "JSONを返す Controller 宣言と、GETリクエストのマッピングを完成させよう。",
        "codeTemplate": "[1]\npublic class KakeiboController {\n    [2](\"/api/kakeibo\")\n    public List<KakeiboItem> list(@RequestParam(required = false) String keyword) {\n        return repo.search(keyword);\n    }\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "@RestController",
              "@WebServlet",
              "@JspPage",
              "@Entity"
            ],
            "answer": "@RestController"
          },
          {
            "label": "[2]",
            "options": [
              "@GetMapping",
              "@DoGet",
              "@SelectMapping",
              "@UrlRoute"
            ],
            "answer": "@GetMapping"
          }
        ],
        "hint": "JSONを返すControllerクラス用アノテーションと、HTTP GETを受け取るメソッド用アノテーションです。",
        "explanation": "`@RestController` と `@GetMapping` を使うと、Servletの `doGet` や JSON変換を自動処理してくれます。"
      },
      {
        "id": "q_14_2",
        "title": "DI（コンストラクタ注入）の実装",
        "description": "密結合な `new KakeiboRepository()` をやめ、Spring の DI で依存を受け取るコンストラクタを完成させよう。",
        "codeTemplate": "private final KakeiboRepository repo;\npublic [1]([2] repo) {\n    this.repo = repo;\n}",
        "blanks": [
          {
            "label": "[1]",
            "options": [
              "KakeiboController",
              "void",
              "inject",
              "init"
            ],
            "answer": "KakeiboController"
          },
          {
            "label": "[2]",
            "options": [
              "KakeiboRepository",
              "String",
              "HttpServlet",
              "Object"
            ],
            "answer": "KakeiboRepository"
          }
        ],
        "hint": "コンストラクタはクラス名と同じ名前で、受け取りたい部品の型を引数に書きます。",
        "explanation": "コンストラクタの引数に `KakeiboRepository repo` を書くと、Spring が自動でインスタンスを注入してくれます。"
      }
    ],
    "codePuzzle": {
      "id": "p_14",
      "title": "Spring Boot コントローラの処理フロー",
      "description": "DIされたリポジトリを使って検索・保存する `@RestController` の構造を正しい順に並べよう。",
      "steps": [
        "@RestController",
        "public class KakeiboController {",
        "    private final KakeiboRepository repo;",
        "    public KakeiboController(KakeiboRepository repo) { this.repo = repo; }",
        "    @GetMapping(\"/api/items\") public List<KakeiboItem> all() { return repo.findAll(); }",
        "}"
      ],
      "hint": "クラスアノテーション → クラス宣言 → finalフィールド → コンストラクタ(DI) → @GetMappingメソッド → 閉じカッコ。",
      "explanation": "フィールドを `private final` にしてコンストラクタで注入するのが Spring Boot 推奨のベストプラクティスです。"
    },
    "questions": [
      {
        "id": "L14_Q01",
        "no": 1,
        "topic": "Mavenの設定ファイル",
        "prompt": "Mavenプロジェクトにおいて、使用するライブラリ（依存関係）やJavaバージョン、ビルド設定を記述する設定ファイルの名前はどれですか？",
        "choices": {
          "A": "`package.json`",
          "B": "`pom.xml`",
          "C": "`requirements.txt`",
          "D": "`build.sh`"
        },
        "answer": "B",
        "explanation": "Mavenでは `pom.xml`（Project Object Model）に依存関係やビルド設定を記述します。"
      },
      {
        "id": "L14_Q02",
        "no": 2,
        "topic": "Mavenのテスト実行コマンド",
        "prompt": "Mavenプロジェクトで、`src/test/java` 配下にある JUnit テストを一括実行するコマンドはどれですか？",
        "choices": {
          "A": "`mvn test`",
          "B": "`mvn check`",
          "C": "`java test`",
          "D": "`javac --test`"
        },
        "answer": "A",
        "explanation": "`mvn test` でプロジェクト内の単体テストを一括実行できます。"
      },
      {
        "id": "L14_Q03",
        "no": 3,
        "topic": "Mavenの標準ディレクトリ構成",
        "prompt": "Mavenの標準構成において、アプリケーション本体のJavaソースコード（`KakeiboItem.java` など）を配置するフォルダはどれですか？",
        "choices": {
          "A": "`src/main/java`",
          "B": "`src/test/java`",
          "C": "`WEB-INF/lib`",
          "D": "`target/classes`"
        },
        "answer": "A",
        "explanation": "本番コードは `src/main/java`、テストコードは `src/test/java` に配置するのがMavenの標準規約です。"
      },
      {
        "id": "L14_Q04",
        "no": 4,
        "topic": "Spring Bootのアノテーション：JSON API",
        "prompt": "Spring Bootで、メソッドの戻り値（`List<KakeiboItem>` など）を自動的にJSONへ変換してレスポンスとして返すControllerクラスに付けるアノテーションはどれですか？",
        "choices": {
          "A": "`@WebServlet`",
          "B": "`@RestController`",
          "C": "`@Entity`",
          "D": "`@Override`"
        },
        "answer": "B",
        "explanation": "`@RestController` を使うと、戻り値のオブジェクトやリストが自動的にJSONへシリアライズされます。"
      },
      {
        "id": "L14_Q05",
        "no": 5,
        "topic": "GETとPOSTのルーティング",
        "prompt": "Spring MVC / Spring Boot で、HTTPの `GET` リクエストと `POST` リクエストをそれぞれ受け取るメソッドに付けるアノテーションの組み合わせはどれですか？",
        "choices": {
          "A": "GET：`@GetMapping` ／ POST：`@PostMapping`",
          "B": "GET：`@DoGet` ／ POST：`@DoPost`",
          "C": "GET：`@Select` ／ POST：`@Insert`",
          "D": "GET：`@Read` ／ POST：`@Write`"
        },
        "answer": "A",
        "explanation": "`@GetMapping` と `@PostMapping` でHTTPメソッドごとの処理を簡潔に記述できます。"
      },
      {
        "id": "L14_Q06",
        "no": 6,
        "topic": "DI：依存性注入のメリット",
        "prompt": "クラス内部で直接 `new KakeiboDAO()` と書かず、コンストラクタ経由で外から部品（依存オブジェクト）を受け取る **DI（Dependency Injection）** を使う主なメリットは何ですか？",
        "choices": {
          "A": "テスト時に本物のDBの代わりにモック（テスト用ダミー）へ差し替えやすく、変更に強い設計になる",
          "B": "クラスを1つも作らなくてよくなる",
          "C": "Javaの変数型がすべて `var` になる",
          "D": "HTMLを書かなくても自動でデザインが生成される"
        },
        "answer": "A",
        "explanation": "部品の生成と結合を外部（DIコンテナ）に任せることで、結合度が下がり単体テストが圧倒的に書きやすくなります。"
      },
      {
        "id": "L14_Q07",
        "no": 7,
        "topic": "@RequestParamの役割",
        "prompt": "URLのクエリ `/search?keyword=弁当` から `\"弁当\"` をメソッドの引数 `String keyword` で受け取るために使うSpringのアノテーションはどれですか？",
        "choices": {
          "A": "`@RequestParam`",
          "B": "`@RequestBody`",
          "C": "`@PathVariable`",
          "D": "`@Autowired`"
        },
        "answer": "A",
        "explanation": "クエリ文字列やフォームのパラメータ受け取りには `@RequestParam` を使います（JSONボディには `@RequestBody`）。"
      },
      {
        "id": "L14_Q08",
        "no": 8,
        "topic": "組み込みTomcatの特徴",
        "prompt": "従来のServlet構成では自分でTomcatをインストールして `webapps/` に配置していましたが、Spring Bootではどう変わりますか？",
        "choices": {
          "A": "Tomcatがアプリの中に組み込まれているため、`java -jar` で1ファイルのままWebサーバーを起動できる",
          "B": "ブラウザの拡張機能だけでサーバーが動く",
          "C": "HTTP通信を使わなくなる",
          "D": "SQLiteしか使えなくなる"
        },
        "answer": "A",
        "explanation": "組み込みサーバー（Embedded Tomcat）により、クラウドやDockerへのデプロイも極めて簡単になります。"
      },
      {
        "id": "L14_Q09",
        "no": 9,
        "topic": "3層アーキテクチャの責務分離",
        "prompt": "Webアプリケーションを「Presentation（Controller/View）」「Business Logic（Service/Model）」「Data Access（DAO/Repository）」の3層に分ける目的として最も適切なものはどれですか？",
        "choices": {
          "A": "画面表示・業務ルール・DB操作の責務を分離し、変更やテストをしやすくするため",
          "B": "ファイル数を増やして難しく見せるため",
          "C": "コンパイル時間を長くするため",
          "D": "CSSを動かなくするため"
        },
        "answer": "A",
        "explanation": "関心事の分離（Separation of Concerns）により、UI変更やDB移行時の影響範囲を局所化できます。"
      },
      {
        "id": "L14_Q10",
        "no": 10,
        "topic": "全14回の総括",
        "prompt": "基礎構文・オブジェクト指向・Web(Servlet/JSP)・DB(JDBC/SQL)・JSON API・JUnitテスト・Maven/Spring Boot を通して、これからのJava開発で最も大切な姿勢はどれですか？",
        "choices": {
          "A": "小さく動かして検証し（MEP/単体テスト）、責務ごとにクラスを分けて（MVC/DAO）、公式ドキュメントやエラーログ（スタックトレース）を読みながら改善を続けること",
          "B": "1000行の処理をすべて1つの `main` メソッドに書くこと",
          "C": "エラーが出たら原因を読まずに毎回最初から作り直すこと",
          "D": "テストも入力チェックも一切書かないこと"
        },
        "answer": "A",
        "explanation": "基礎概念・設計・テスト・エラー読解の積み重ねが、どんなフレームワークでも通用するエンジニア力になります！"
      }
    ]
  }
];
});
