# web template :rabbit:

## Overview
EJS + PostCSS + webpack v4 (TypeScript) 

* [**EJS**](https://github.com/mde/ejs)
* [**PostCSS**](https://github.com/postcss/postcss)
	* [postcss-import](https://github.com/postcss/postcss-import)
	* [postcss-simple-vars](https://github.com/postcss/postcss-simple-vars)
	* [postcss-extend](https://www.npmjs.com/package/postcss-extend)
	* [postcss-mixins](https://github.com/postcss/postcss-mixins)
	* [postcss-nested](https://github.com/postcss/postcss-nested)
	* [postcss-cssnext](https://github.com/MoOx/postcss-cssnext)
	* [postcss-flexbugs-fixes](https://github.com/luisrudge/postcss-flexbugs-fixes)
	* [postcss-sorting](https://github.com/hudochenkov/postcss-sorting)
	* [css-mqpacker](https://github.com/hail2u/node-css-mqpacker)
	* [postcss-discard-duplicates](https://github.com/ben-eb/postcss-discard-duplicates)
	* [cssnano](https://github.com/cssnano/cssnano)
* [**webpack v4**](https://webpack.js.org/)
	* [TypeScript](https://www.typescriptlang.org/)
	* [ESLint](https://eslint.org/)
		* [prettier](https://github.com/prettier/prettier)
		* [typescript-eslint-parser](https://github.com/eslint/typescript-eslint-parser)
	
## Install

* **Note: Nodeのバージョンは10以上、npmは6.x系が望ましいです。**

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

Run this commands and then open your browser go to [http://localhost:8080](http://localhost:8080)

```bash
$ yarn run watch
```

<br>

## Build

納品ファイルを生成。

### 開発サーバー向け

```bash
$ yarn run build:development
```

### 本番サーバー向け

```bash
$ yarn run build:development
```

{環境名}-htdocsフォルダ内に納品ファイルが生成されます。

<br>


## Libraries

### CSS
* [**sanitize.css**](https://github.com/csstools/sanitize.css)

### JS