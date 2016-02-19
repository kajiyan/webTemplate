# webTemplate

## コマンド一覧
### $ gulp
altJS(bobel or coffee), CSSメタ言語(sass), HTMLテンプレートエンジン(swig) のwatch を開始する  
http://localhost:3000 で `${result.ROOT}${result.APPLICATION}/`（デフォルトは application 以下）が表示される


### $ gulp doc
`${SETTING.CORE}${SETTING.ALT_JS}/${key}/**/*.${SETTING.ALT_JS_ATTRIBUTE}` にJsDocが  
記述されていればドキュメントを`${result.ROOT}${result.DOCS}/`（デフォルトは doc/） 以下に書き出す


### $ gulp build
setting.js に指定されているTARGET の altJS(bobel or coffee), CSSメタ言語(sass), HTMLテンプレートエンジン(swig)を  
一括で`${result.ROOT}${result.APPLICATION}/` （デフォルトは application/） 以下にコンパイルする

#### options

  $ gulp build --ENV -m PRODUCTION  
  $ gulp build --ENV -m DEBUG  
  $ gulp build --ENV -m DEBUG_LOCAL

---