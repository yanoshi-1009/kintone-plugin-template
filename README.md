# kintone-customization-template

## English

### Overview

This project provides a template for customizing kintone using [esbuild](https://esbuild.github.io/) and modern frontend tools. You can easily build, bundle, and serve your JavaScript/CSS for kintone customization.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- OpenSSL (for generating a local development certificate)

### Initial Setup

Before starting development, generate a self-signed SSL certificate for the local HTTPS server:

```bash
mkdir .cert && openssl req -x509 -newkey rsa:4096 -keyout .cert/private.key -out .cert/private.cert -days 9999 -nodes -subj /CN=127.0.0.1
```

This will create `.cert/private.key` and `.cert/private.cert` for local HTTPS.

### Installation

```bash
npm install
openssl genrsa -traditional -out plugin.key
```

### Usage

#### Development Mode (with local server & watch)

```bash
npm run build:dev
```

- Starts a local HTTPS server at https://localhost:9000/
- Watches for file changes and rebuilds automatically

#### Production Build

```bash
npm run build:prod
```

- Outputs bundled files to the `dist` directory

### Directory Structure (example)

```text
src/
  appPage/
    desktop/
      desktop.js
      desktop.css
    mobile/
      mobile.js
      mobile.css
  configPage/
    config.js
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

開発を始める前に、ローカルHTTPSサーバー用の自己署名証明書を作成してください：

```bash
mkdir .cert && openssl req -x509 -newkey rsa:4096 -keyout .cert/private.key -out .cert/private.cert -days 9999 -nodes -subj /CN=127.0.0.1
```

これにより `.cert/private.key` と `.cert/private.cert` が作成されます。

### インストール

```bash
npm install
openssl genrsa -traditional -out plugin.key
```

### 使い方

#### 開発モード（ローカルサーバー＆ウォッチ付き）

```bash
npm run build:dev
```

- https://localhost:9000/ でローカルHTTPSサーバーが起動します
- ファイル変更を監視し、自動で再ビルドします

#### 本番ビルド

```bash
npm run build:prod
```

- `dist` ディレクトリにバンドル済みファイルが出力されます

### ディレクトリ構成（例）

```text
src/
  appPage/
    desktop/
      desktop.js
      desktop.css
    mobile/
      mobile.js
      mobile.css
  configPage/
    config.js
    config.html
    config.css
  css/
  html/
  image/
  js/
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
