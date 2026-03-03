# kintone-plugin-template

## English

### Overview

This project provides a template for building kintone plugins using [esbuild](https://esbuild.github.io/) and modern frontend tools. You can easily build, bundle, and serve your JavaScript/CSS for kintone plugin development.

### Prerequisites

- Node.js (v20, v22, or v24)
- pnpm (v10 or later)
- OpenSSL (for generating a local development certificate)

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
    build.mjs
    plugins/
      serve-mode-plugin.mjs
.cert/
  private.key
  private.cert
private.ppk
```

---

## 日本語

### 概要

このプロジェクトは、[esbuild](https://esbuild.github.io/) とモダンなフロントエンドツールを使った kintone プラグイン開発用のテンプレートです。JavaScript/CSS のビルド・バンドル・サーブを簡単に行えます。

### 前提条件

- Node.js（v20, v22, または v24）
- pnpm（v10以上）
- OpenSSL（ローカル開発用証明書の作成に必要）

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
    build.mjs
    plugins/
      serve-mode-plugin.mjs
.cert/
  private.key
  private.cert
private.ppk
```
