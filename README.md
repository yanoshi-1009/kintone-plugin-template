dist/
scripts/
dist/
scripts/

# kintone-customization-template

## English

### Overview

This project provides a template for customizing kintone using [esbuild](https://esbuild.github.io/) and modern frontend tools. You can easily build, bundle, and serve your JavaScript/CSS for kintone customization.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- OpenSSL (for generating a local development certificate)

### Initial Setup

```bash
npm run init
```

- Creates the `.cert` directory and self-signed certificate
- Installs dependencies
- Generates `plugin.key` for the plugin
- Removes unnecessary files (`renovate.json`, `.gitkeep`)

### Usage

#### Development Mode (with local server & watch)

```bash
npm run build:dev
```

- Starts a local HTTPS server at https://localhost:9000/
- Watches for file changes and rebuilds automatically
- If `manifest.prod.json` exists, it will automatically rename `manifest.json` to `manifest.dev.json` and `manifest.prod.json` to `manifest.json` before build

#### Production Build

```bash
npm run build:prod
```

- Outputs bundled files to the `dist` directory
- If `manifest.prod.json` exists, it will automatically rename `manifest.json` to `manifest.dev.json` and `manifest.prod.json` to `manifest.json` before build

#### Plugin Upload

```bash
npm run upload
```

- Uploads `dist/plugin.zip` to your kintone environment using `kintone-plugin-uploader`

#### Remove Unnecessary Files

```bash
npm run delete-renovate-gitkeep
```

- Removes `renovate.json` and `.gitkeep` if they exist

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
    build.mjs
    plugins/
      serve-mode-plugin.mjs
.cert/
  private.key
  private.cert
```

---

## 日本語

### 概要

このプロジェクトは、[esbuild](https://esbuild.github.io/) とモダンなフロントエンドツールを使った kintone カスタマイズ用のテンプレートです。JavaScript/CSS のビルド・バンドル・サーブを簡単に行えます。

### 前提条件

- Node.js（推奨: v18以上）
- npm または yarn
- OpenSSL（ローカル開発用証明書の作成に必要）

### 初期セットアップ

```bash
npm run init
```

- `.cert` ディレクトリと自己署名証明書を作成します
- 依存パッケージをインストールします
- プラグイン用の `plugin.key` を生成します
- 不要ファイル（`renovate.json`, `.gitkeep`）を削除します

### 使い方

#### 開発モード（ローカルサーバー＆ウォッチ付き）

```bash
npm run build:dev
```

- https://localhost:9000/ でローカルHTTPSサーバーが起動します
- ファイル変更を監視し、自動で再ビルドします
- `manifest.prod.json` が存在する場合は `manifest.json` → `manifest.dev.json`、`manifest.prod.json` → `manifest.json` に自動で切り替わります

#### 本番ビルド

```bash
npm run build:prod
```

- `dist` ディレクトリにバンドル済みファイルが出力されます
- `manifest.prod.json` が存在する場合は `manifest.json` → `manifest.dev.json`、`manifest.prod.json` → `manifest.json` に自動で切り替わります

#### プラグインのアップロード

```bash
npm run upload
```

- `dist/plugin.zip` を kintone 環境にアップロードします（`kintone-plugin-uploader` を利用）

#### 不要ファイルの削除

```bash
npm run delete-renovate-gitkeep
```

- `renovate.json` と `.gitkeep` を削除します

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
    build.mjs
    plugins/
      serve-mode-plugin.mjs
.cert/
  private.key
  private.cert
```
