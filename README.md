# kintone-plugin-template

## English

### Overview

This project provides a template for building kintone plugins using [esbuild](https://esbuild.github.io/) and modern frontend tools. You can easily build, bundle, and serve your JavaScript/CSS for kintone plugin development.

### Key tools & libraries included

- **Build**: [esbuild](https://esbuild.github.io/)
- **kintone API client**: [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client)
- **kintone UI**: [kintone-ui-component](https://kintone-ui-component.netlify.app/)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Date utility**: [dayjs](https://day.js.org/)
- **Linter**: [eslint](https://eslint.org/) + [@cybozu/eslint-config](https://github.com/cybozu/eslint-config)
- **Formatter**: [prettier](https://prettier.io/)
- **Type checking**: [TypeScript](https://www.typescriptlang.org/)

### Prerequisites

- Node.js (v24 or later)
- pnpm (v10 or later)
- [mkcert](https://github.com/FiloSottile/mkcert) (for generating a locally-trusted development certificate)

**Install mkcert (one-time setup per machine):**

```bash
# macOS
brew install mkcert
mkcert -install

# Windows (Chocolatey)
choco install mkcert
mkcert -install

# Windows (Scoop)
scoop bucket add extras
scoop install mkcert
mkcert -install
```

### Initial Setup

```bash
pnpm init
```

- Creates the `.cert` directory and self-signed certificate
- Installs dependencies
- Generates `private.ppk` for the plugin
- Removes unnecessary files (`renovate.json`, `.gitkeep`)

### Usage

#### Development Mode (with local server & watch)

```bash
pnpm build:dev
```

- Starts a local HTTPS server at https://localhost:9000/
- Watches for file changes and rebuilds automatically
- If `manifest.dev.json` exists, it will automatically rename `manifest.json` to `manifest.prod.json` and `manifest.dev.json` to `manifest.json` before build

#### Production Build

```bash
pnpm build:prod
```

- Outputs bundled files to the `dist` directory
- Packages the plugin as `dist/plugin.zip`
- If `manifest.prod.json` exists, it will automatically rename `manifest.json` to `manifest.dev.json` and `manifest.prod.json` to `manifest.json` before build

#### Plugin Upload

```bash
pnpm upload
```

- Uploads `dist/plugin.zip` to your kintone environment using `cli-kintone`

### Directory Structure (example)

```text
src/
  appPage/
    desktop/
      desktop.ts
      desktop.css
    mobile/
      mobile.ts
      mobile.css
  common/
    components/
    config/
    helpers/
    i18n/
    types/
  configPage/
    config.ts
    config.html
    config.css
  image/
dist/
scripts/
  esbuild/
    build.ts
    plugins/
  init.ts
  build-dev.ts
  build-prod.ts
  upload.ts
.cert/
  private.key
  private.cert
private.ppk
```

---

## 日本語

### 概要

このプロジェクトは、[esbuild](https://esbuild.github.io/) とモダンなフロントエンドツールを使った kintone プラグイン開発用のテンプレートです。JavaScript/CSS のビルド・バンドル・サーブを簡単に行えます。

### 含まれる主なツール・ライブラリ

- **ビルド**: [esbuild](https://esbuild.github.io/)
- **kintone API クライアント**: [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client)
- **kintone UI**: [kintone-ui-component](https://kintone-ui-component.netlify.app/)
- **多言語対応**: [i18next](https://www.i18next.com/)
- **日付ユーティリティ**: [dayjs](https://day.js.org/)
- **リンター**: [eslint](https://eslint.org/) + [@cybozu/eslint-config](https://github.com/cybozu/eslint-config)
- **フォーマッター**: [prettier](https://prettier.io/)
- **型チェック**: [TypeScript](https://www.typescriptlang.org/)

### 前提条件

- Node.js（v24以上）
- pnpm（v10以上）
- [mkcert](https://github.com/FiloSottile/mkcert)（ブラウザに信頼されたローカル開発用証明書を生成するために必要）

**mkcert のインストール（マシンごとに1回だけ実行）:**

```bash
# macOS
brew install mkcert
mkcert -install

# Windows (Chocolatey)
choco install mkcert
mkcert -install

# Windows (Scoop)
scoop bucket add extras
scoop install mkcert
mkcert -install
```

### 初期セットアップ

```bash
pnpm init
```

- `.cert` ディレクトリと自己署名証明書を作成します
- 依存パッケージをインストールします
- プラグイン用の `private.ppk` を生成します
- 不要ファイル（`renovate.json`, `.gitkeep`）を削除します

### 使い方

#### 開発モード（ローカルサーバー＆ウォッチ付き）

```bash
pnpm build:dev
```

- https://localhost:9000/ でローカルHTTPSサーバーが起動します
- ファイル変更を監視し、自動で再ビルドします
- `manifest.dev.json` が存在する場合は `manifest.json` → `manifest.prod.json`、`manifest.dev.json` → `manifest.json` に自動で切り替わります

#### 本番ビルド

```bash
pnpm build:prod
```

- `dist` ディレクトリにバンドル済みファイルが出力されます
- プラグインが `dist/plugin.zip` としてパッケージされます
- `manifest.prod.json` が存在する場合は `manifest.json` → `manifest.dev.json`、`manifest.prod.json` → `manifest.json` に自動で切り替わります

#### プラグインのアップロード

```bash
pnpm upload
```

- `dist/plugin.zip` を kintone 環境にアップロードします（`cli-kintone` を利用）

### ディレクトリ構成（例）

```text
src/
  appPage/
    desktop/
      desktop.ts
      desktop.css
    mobile/
      mobile.ts
      mobile.css
  common/
    components/
    config/
    helpers/
    i18n/
    types/
  configPage/
    config.ts
    config.html
    config.css
  image/
dist/
scripts/
  esbuild/
    build.ts
    plugins/
  init.ts
  build-dev.ts
  build-prod.ts
  upload.ts
.cert/
  private.key
  private.cert
private.ppk
```
