# web template :rabbit:

## Overview
Pug + PostCSS + webpack v4 (TypeScript) 

* [**Pug**](https://pugjs.org/api/getting-started.html)

* [**PostCSS**](https://github.com/postcss/postcss)
  * [stylelint](https://stylelint.io/)
  * [postcss-import](https://github.com/postcss/postcss-import)
  * [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties)
  * [postcss-simple-vars](https://github.com/postcss/postcss-simple-vars)
  * [postcss-calc](https://github.com/postcss/postcss-calc)
  * [postcss-easings](https://github.com/postcss/postcss-easings)
  * [postcss-extend](https://www.npmjs.com/package/postcss-extend)
  * [postcss-mixins](https://github.com/postcss/postcss-mixins)
  * [postcss-nested](https://github.com/postcss/postcss-nested)
  * [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
  * [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
  * [postcss-discard-duplicates](https://www.npmjs.com/package/postcss-discard-duplicates)
  * [postcss-sorting](https://github.com/hudochenkov/postcss-sorting)
  * [css-mqpacker](https://github.com/hail2u/node-css-mqpacker)
  * [cssnano](https://github.com/cssnano/cssnano)
  * [postcss-reporter](https://github.com/postcss/postcss-reporter)

* [**webpack v4**](https://webpack.js.org/)
  * [TypeScript](https://www.typescriptlang.org/) 拡張子 `.ts`, `.tsx` に適応
    * [TSLint](https://palantir.github.io/tslint/)  拡張子 `.ts`, `.tsx` に適応
  * [ESLint](https://eslint.org/) 拡張子 `.js`, `.jsx` に適応
  * [prettier](https://github.com/prettier/prettier)  拡張子 `.js`, `.jsx`, `.ts`, `.tsx` に適応
  
## Install

* **Note: Node のバージョンは10.15.0, NPM は6.7.0で開発**

### Install yarn

yarn を使うので下記に従いyarn インストールしてください。

**for mac**

```bash
$ npm install yarn
```

or

```bash
$ brew install yarn
```

**for windows**

[Use installer](https://yarnpkg.com/lang/en/docs/install/#windows-tab)

<br>

### Install dependencies.

依存モジュールをインストール。

```bash
$ yarn install
```

**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn) for some reason, try `npm install`.

<br>

## Run

下記のコマンドを実行して [http://localhost:8080](http://localhost:8080) にブラウザにアクセスすればデバックできます。  
CSS を静的ファイルとして書き出しません、CSSModule などで開発する場合はこちらを推奨します。

```bash
$ yarn run dev
```

下記のコマンドの場合、CSSを静的ファイルとして書き出します。

```bash
$ yarn run watch
```

<br>

## Build

納品ファイルを生成。

### 開発サーバー向け

```bash
$ yarn run build-dev
```

### 本番サーバー向け

```bash
$ yarn run build
```

{環境名}-htdocsフォルダ内に納品ファイルが生成されます。

<br>


## Libraries

### CSS
* [**sanitize.css**](https://github.com/csstools/sanitize.css)

### JS
