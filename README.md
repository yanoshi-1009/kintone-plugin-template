# kintone-plugin-template

## English

### Overview

This project provides a template for building kintone plugins using [esbuild](https://esbuild.github.io/) and modern frontend tools. You can easily build, bundle, and serve your JavaScript/CSS for kintone plugin development.

### Key tools & libraries included

- **Build**: [esbuild](https://esbuild.github.io/)
- **Plugin packaging**: [@kintone/cli](https://github.com/kintone/js-sdk/tree/main/packages/cli) (`cli-kintone`)
- **kintone API client**: [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client)
- **kintone UI**: [kintone-ui-component](https://kintone-ui-component.netlify.app/)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Date utility**: [dayjs](https://day.js.org/)
- **Linter**: [eslint](https://eslint.org/) + [@cybozu/eslint-config](https://github.com/cybozu/eslint-config)
- **Formatter**: [prettier](https://prettier.io/)
- **Type checking**: [TypeScript](https://www.typescriptlang.org/) v7 (native)

### Prerequisites

- Node.js (v26 or later)
- pnpm (v11 or later)
- [mise](https://mise.jdx.dev/) (recommended, for managing the versions above)
- [mkcert](https://github.com/FiloSottile/mkcert) (for generating a locally-trusted development certificate)

#### Managing Node.js and pnpm with mise

[`mise.toml`](./mise.toml) pins the required versions, so a single command installs both:

```bash
mise install
```

The versions are not just a suggestion. `devEngines` in `package.json` sets `onFail: "error"`, so pnpm aborts rather than warns when the active Node.js or pnpm version does not satisfy the range.

Every script under `scripts/` is a `.ts` file executed directly by Node.js through its native type stripping — there is no transpile step, which is why Node.js v26+ is required.

#### Install mkcert (one-time setup per machine)

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
pnpm run init
```

> Use `pnpm run init`, not `pnpm init` — the latter is pnpm's own built-in command and would overwrite `package.json`.

This script ([`scripts/init.ts`](./scripts/init.ts)):

- Creates the `.cert` directory and a locally-trusted certificate via `mkcert`
- Installs dependencies with `pnpm install`
- Generates `private.ppk`, the private key that determines your plugin ID
- Removes template-only files (`renovate.json`) if present

### TypeScript Setup (v7 native)

Type checking runs on **TypeScript v7**, the native (Go) compiler, which is dramatically faster than the JavaScript implementation.

Because of this, the two TypeScript entries in `package.json` are aliased and look inverted at first glance:

```json
"@typescript/native": "npm:typescript@7.0.2",
"typescript": "npm:@typescript/typescript6@6.0.2"
```

| Command | Actual package                  | Purpose                                                             |
| ------- | ------------------------------- | ------------------------------------------------------------------- |
| `tsc`   | `typescript@7.0.2` (native)     | Type check in `build:dev` / `build:prod`                            |
| `tsc6`  | `@typescript/typescript6@6.0.2` | Tooling that needs the TypeScript JavaScript API, and as a fallback |

The `typescript` **package name** is deliberately mapped to the v6 (JavaScript) implementation. The reasons:

- Tools such as typescript-eslint (used internally by `@cybozu/eslint-config`) do not invoke `tsc` as a command. They `import` the `typescript` package and drive the compiler through its **JavaScript API** — `ts.createProgram()`, the AST types, and so on.
- What the v7 native package ships is a Go binary. Its root entry point only returns a version string, and the sole programmatic surface it offers is a new API under `@typescript/native/unstable/*` — explicitly marked unstable and shaped differently from the classic one. The traditional `typescript` API is not included.
- Pointing the `typescript` package name at v7 would therefore break every tool that relies on that API.

In short: **the CLI type check runs on the fast v7, while the API that tools import stays on v6.** The two are kept side by side on purpose.

> **Future cleanup:** once v7 offers a stable compiler API and typescript-eslint and friends support it, this split becomes unnecessary. At that point the setup can be tidied up as follows:
>
> - Collapse the two `package.json` entries back into a single `"typescript": "7.x.x"`
> - Remove `@typescript/native` and the `tsc6` fallback described below
> - Revisit `js/ts.experimental.useTsgo` in `.vscode/settings.json` (the `experimental` prefix is expected to be dropped)

If you run into a v7-specific problem, you can type check with the v6 compiler instead:

```bash
pnpm exec tsc6 --noEmit
```

#### Editor (VS Code)

[`.vscode/settings.json`](./.vscode/settings.json) enables the native language server so the editor matches the CLI:

```json
{
  "js/ts.experimental.useTsgo": true
}
```

This requires a VS Code version that supports the native TypeScript language server. Older versions simply ignore the setting and fall back to the JavaScript-based server.

`tsc --noEmit` only covers `src/` (see `include` in [`tsconfig.json`](./tsconfig.json)). [`scripts/tsconfig.json`](./scripts/tsconfig.json) exists so your editor type checks the build scripts correctly — they need Node.js types and `.ts` import extensions, which the browser-facing root config deliberately excludes.

### Generating Type Definitions

Generate TypeScript type definitions for your kintone app fields:

```bash
pnpm exec kintone-dts-gen --base-url https://***.cybozu.com -u <username> -p <password> --app-id <appId> --type-name <appName> -o "./src/common/types/fields.d.ts"
```

`src/common/types/fields.d.ts` is already wired into the `files` array of [`tsconfig.json`](./tsconfig.json), so the generated types are picked up without further configuration.

### The two manifests

A plugin loads its assets from different locations per mode, so two manifests are tracked and `cli-kintone plugin pack` is simply pointed at whichever one applies (the file name does not matter — inside the zip it always becomes `manifest.json`). Neither file is rewritten by a build, so an interrupted build can never leave your working tree in a half-swapped state.

| File                 | Used by      | `desktop` / `mobile` / `config` js & css            |
| -------------------- | ------------ | --------------------------------------------------- |
| `manifest.json`      | `build:dev`  | `https://localhost:9000/appPage/desktop/desktop.js` |
| `manifest.prod.json` | `build:prod` | `dist/appPage/desktop/desktop.js`                   |

`icon` and `config.html` are relative paths in both files — the kintone manifest schema requires that and rejects https URLs, so they are packed into the zip in either mode. Keep the remaining fields (`version`, `name`, `description`, `required_params`, …) in sync between the two.

The dev server URL appears in both `manifest.json` and `scripts/esbuild/build.ts`. If you change the host or port, change it in both places.

### Usage

#### Development Mode (with local server)

```bash
pnpm build:dev
```

- Runs the TypeScript type check (`tsc --noEmit`) before anything else
- Packages `dist/plugin.zip` from `manifest.json` (in this mode the zip contains only the icon and `config.html`, since the js/css are fetched over HTTPS)
- Starts a local HTTPS server at [https://localhost:9000](https://localhost:9000) and rebuilds on request

> **Warning:** the plugin ID is derived from `private.ppk`, and kintone applies an uploaded plugin to every app using that ID immediately. A development zip references `https://localhost:9000`, so uploading one over a released plugin breaks it for all users. Keep development uploads to a separate kintone environment.

#### Production Build

```bash
pnpm build:prod
```

- Runs the TypeScript type check (`tsc --noEmit`) before anything else
- Outputs minified, bundled files to the `dist` directory (no source maps)
- Packages the plugin as `dist/plugin.zip` from `manifest.prod.json`

#### Plugin Upload

```bash
pnpm upload
```

- Uploads `dist/plugin.zip` to your kintone environment using `cli-kintone`, watching the file for changes

#### Lint & Format

```bash
pnpm lint        # Check with ESLint
pnpm lint:fix    # Check with ESLint and auto-fix
pnpm format      # Format with Prettier
```

Paths excluded from formatting are listed in [`.prettierignore`](./.prettierignore).

### Directory Structure

```text
src/
  eslint.config.js      # ESLint config scoped to src/ (kintone global)
  appPage/
    desktop/
      desktop.ts        # Entry point for the desktop app page
      desktop.css       # Entry point for the desktop CSS
    mobile/
      mobile.ts         # Entry point for the mobile app page
      mobile.css        # Entry point for the mobile CSS
  configPage/
    config.ts           # Entry point for the plugin settings page
    config.html         # Markup for the plugin settings page
    config.css          # Entry point for the settings page CSS
    components/         # UI parts specific to the settings page
  common/               # Shared across all three surfaces
    api/                # Wrappers for @kintone/rest-api-client
    components/         # UI parts built with kintone-ui-component
    constants/
      config.ts         # Class names, DOM ids and other constants
    i18n/               # i18next setup and translation resources
    styles/
      common.css        # Rules shared by the three CSS entry points
    types/
      fields.d.ts       # kintone app field types (generated by @kintone/dts-gen)
    utils/              # Pure utility functions (e.g. dayjs wrappers)
  image/
    icon.png            # Plugin icon
dist/                   # Build output, including plugin.zip
scripts/
  init.ts               # Initialization script
  tsconfig.json         # tsconfig for the build scripts (editor support)
  esbuild/
    build.ts            # esbuild build script
    plugins/
      serve-mode-plugin.ts
.cert/                  # Locally-trusted certificate (generated)
  private.key
  private.cert
.vscode/
  settings.json         # Enables the native TypeScript language server (useTsgo)
manifest.json           # Plugin manifest for development (dev server URLs)
manifest.prod.json      # Plugin manifest for production (dist/ paths)
private.ppk             # Plugin private key — determines the plugin ID (git-ignored)
eslint.config.js        # ESLint configuration (project root)
prettier.config.ts      # Prettier configuration
.prettierignore         # Paths excluded from Prettier
tsconfig.json
mise.toml               # Node.js / pnpm version pinning for mise
pnpm-workspace.yaml     # pnpm project settings (allowBuilds, etc.)
```

> **Scaling tip:** A plugin runs in three separate contexts, so the top level of `src/` is split by surface (`appPage`, `configPage`) to match the manifest one-to-one, and everything shared lives under `common/`. For small-to-medium plugins, writing event handlers directly in `desktop.ts` / `mobile.ts` is recommended. If a file grows large, split handlers into an `events/` directory next to it (e.g. `appPage/desktop/events/index-show.ts`) and re-export them from the entry point.
>
> **CSS handling:** CSS is intentionally kept as a separate entry point rather than imported from TypeScript. kintone loads a plugin's stylesheets in `<head>` before scripts run, which prevents the Flash of Unstyled Content (FOUC) that would occur with JavaScript-based style injection at runtime. The manifest also declares desktop, mobile and config CSS independently, so three separate outputs are required — put anything they share in `common/styles/common.css`, which esbuild inlines at build time.

---

## 日本語

### 概要

このプロジェクトは、[esbuild](https://esbuild.github.io/) とモダンなフロントエンドツールを使った kintone プラグイン開発用のテンプレートです。JavaScript/CSS のビルド・バンドル・サーブを簡単に行えます。

### 含まれる主なツール・ライブラリ

- **ビルド**: [esbuild](https://esbuild.github.io/)
- **プラグインのパッケージング**: [@kintone/cli](https://github.com/kintone/js-sdk/tree/main/packages/cli)（`cli-kintone`）
- **kintone API クライアント**: [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client)
- **kintone UI**: [kintone-ui-component](https://kintone-ui-component.netlify.app/)
- **多言語対応**: [i18next](https://www.i18next.com/)
- **日付ユーティリティ**: [dayjs](https://day.js.org/)
- **リンター**: [eslint](https://eslint.org/) + [@cybozu/eslint-config](https://github.com/cybozu/eslint-config)
- **フォーマッター**: [prettier](https://prettier.io/)
- **型チェック**: [TypeScript](https://www.typescriptlang.org/) v7（native）

### 前提条件

- Node.js（v26以上）
- pnpm（v11以上）
- [mise](https://mise.jdx.dev/)（推奨。上記バージョンの管理用）
- [mkcert](https://github.com/FiloSottile/mkcert)（ブラウザに信頼されたローカル開発用証明書を生成するために必要）

#### mise による Node.js / pnpm のバージョン管理

[`mise.toml`](./mise.toml) に必要なバージョンを固定しているため、1コマンドで両方インストールできます。

```bash
mise install
```

このバージョン指定は推奨ではなく必須です。`package.json` の `devEngines` が `onFail: "error"` を指定しているため、Node.js / pnpm のバージョンが条件を満たさない場合、pnpm は警告ではなくエラーで停止します。

`scripts/` 配下のスクリプトはすべて `.ts` ファイルを Node.js のネイティブな型ストリッピングで直接実行しています。トランスパイル工程がないため、Node.js v26 以上が必要です。

#### mkcert のインストール（マシンごとに1回だけ実行）

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
pnpm run init
```

> `pnpm init` ではなく `pnpm run init` を使ってください。前者は pnpm の組み込みコマンドで、`package.json` を上書きしてしまいます。

このスクリプト（[`scripts/init.ts`](./scripts/init.ts)）は以下を行います。

- `.cert` ディレクトリと `mkcert` によるローカル信頼済み証明書を作成します
- `pnpm install` で依存パッケージをインストールします
- プラグイン ID を決定する秘密鍵 `private.ppk` を生成します
- テンプレート専用ファイル（`renovate.json`）が存在すれば削除します

### TypeScript の構成（v7 native）

型チェックは **TypeScript v7**（Go 実装の native コンパイラ）で実行します。JavaScript 実装に比べて劇的に高速です。

そのため `package.json` の TypeScript 関連の 2 エントリは、一見すると逆に見えるエイリアス構成になっています。

```json
"@typescript/native": "npm:typescript@7.0.2",
"typescript": "npm:@typescript/typescript6@6.0.2"
```

| コマンド | 実際のパッケージ                | 用途                                                                  |
| -------- | ------------------------------- | --------------------------------------------------------------------- |
| `tsc`    | `typescript@7.0.2`（native）    | `build:dev` / `build:prod` での型チェック                             |
| `tsc6`   | `@typescript/typescript6@6.0.2` | TypeScript の JavaScript API を必要とするツール、およびフォールバック |

`typescript` という**パッケージ名**を意図的に v6（JavaScript 実装）に割り当てています。理由は次のとおりです。

- typescript-eslint（`@cybozu/eslint-config` が内部で利用）などのツールは `tsc` をコマンドとして呼び出しません。`typescript` パッケージを `import` し、**JavaScript API**（`ts.createProgram()` や AST の型など）を通じてコンパイラを操作します。
- v7 の native パッケージが提供するのは Go のバイナリです。ルートのエントリポイントはバージョン文字列を返すだけで、プログラムから使える API は `@typescript/native/unstable/*` 配下の新 API のみ。明示的に unstable とされており、従来の API とは形が異なります。従来の `typescript` API は含まれていません。
- したがって `typescript` というパッケージ名を v7 に向けると、その API に依存するツールがすべて壊れます。

つまり、**CLI の型チェックは高速な v7 で走らせ、ツールが import する API は v6 のまま**という構成を意図的に併存させています。

> **将来の後片付け:** v7 が安定したコンパイラ API を提供し、typescript-eslint などが対応した時点で、この分割は不要になります。そのときは次のように整理できます。
>
> - `package.json` の 2 エントリを `"typescript": "7.x.x"` の 1 つに戻す
> - `@typescript/native` と後述の `tsc6` フォールバックを削除する
> - `.vscode/settings.json` の `js/ts.experimental.useTsgo` を見直す（`experimental` の接頭辞が外れる見込み）

v7 固有の問題に遭遇した場合は、v6 のコンパイラで型チェックできます。

```bash
pnpm exec tsc6 --noEmit
```

#### エディタ（VS Code）

[`.vscode/settings.json`](./.vscode/settings.json) で native の言語サーバーを有効化し、エディタと CLI の挙動を揃えています。

```json
{
  "js/ts.experimental.useTsgo": true
}
```

native の TypeScript 言語サーバーに対応した VS Code が必要です。古いバージョンではこの設定は無視され、JavaScript 実装の言語サーバーにフォールバックします。

`tsc --noEmit` の対象は `src/` のみです（[`tsconfig.json`](./tsconfig.json) の `include` を参照）。[`scripts/tsconfig.json`](./scripts/tsconfig.json) は、ビルドスクリプトをエディタが正しく型チェックできるようにするためのものです。これらは Node.js の型と `.ts` 拡張子付き import を必要としますが、ブラウザ向けのルート設定では意図的に除外しています。

### 型定義の生成

kintone アプリのフィールドに対する TypeScript の型定義を生成します。

```bash
pnpm exec kintone-dts-gen --base-url https://***.cybozu.com -u <username> -p <password> --app-id <appId> --type-name <appName> -o "./src/common/types/fields.d.ts"
```

`src/common/types/fields.d.ts` は [`tsconfig.json`](./tsconfig.json) の `files` 配列に登録済みなので、生成した型は追加設定なしで読み込まれます。

### 2 つの manifest

プラグインはモードによって参照先が変わるため、manifest を 2 つ管理し、`cli-kintone plugin pack` に該当するファイルを渡すだけにしています（ファイル名は問われません。zip 内では必ず `manifest.json` になります）。どちらのファイルもビルドで書き換えないため、ビルドを中断しても作業ツリーが半端な状態で残ることはありません。

| ファイル             | 使う側       | `desktop` / `mobile` / `config` の js・css          |
| -------------------- | ------------ | --------------------------------------------------- |
| `manifest.json`      | `build:dev`  | `https://localhost:9000/appPage/desktop/desktop.js` |
| `manifest.prod.json` | `build:prod` | `dist/appPage/desktop/desktop.js`                   |

`icon` と `config.html` はどちらのファイルでも相対パスです。kintone の manifest スキーマがこの 2 つに相対パスを要求し、https URL を受け付けないためで、どちらのモードでも zip に同梱されます。残りのフィールド（`version`・`name`・`description`・`required_params` など）は 2 ファイル間で揃えてください。

開発サーバーの URL は `manifest.json` と `scripts/esbuild/build.ts` の両方に登場します。ホストやポートを変える場合は両方を直してください。

### 使い方

#### 開発モード（ローカルサーバー付き）

```bash
pnpm build:dev
```

- 最初に TypeScript の型チェック（`tsc --noEmit`）を実行します
- `manifest.json` から `dist/plugin.zip` をパッケージします（このモードでは js/css は HTTPS 経由で取得されるため、zip にはアイコンと `config.html` のみが入ります）
- [https://localhost:9000](https://localhost:9000) でローカル HTTPS サーバーを起動し、リクエストごとに再ビルドします

> **警告:** プラグイン ID は `private.ppk` から決まり、kintone はアップロードされたプラグインを同じ ID を使うすべてのアプリに即時適用します。開発ビルドの zip は `https://localhost:9000` を参照するため、公開済みプラグインに上書きアップロードすると全利用者の環境が壊れます。開発用のアップロードは検証用の kintone 環境に限定してください。

#### 本番ビルド

```bash
pnpm build:prod
```

- 最初に TypeScript の型チェック（`tsc --noEmit`）を実行します
- `dist` ディレクトリに minify 済みのバンドルを出力します（source map なし）
- `manifest.prod.json` からプラグインを `dist/plugin.zip` としてパッケージします

#### プラグインのアップロード

```bash
pnpm upload
```

- `cli-kintone` を使って `dist/plugin.zip` を kintone 環境にアップロードします（ファイルの変更を監視し続けます）

#### リント & フォーマット

```bash
pnpm lint        # ESLint でチェック
pnpm lint:fix    # ESLint でチェックし自動修正
pnpm format      # Prettier でフォーマット
```

フォーマット対象外のパスは [`.prettierignore`](./.prettierignore) に記載しています。

### ディレクトリ構成

```text
src/
  eslint.config.js      # src/ 用の ESLint 設定（kintone グローバル）
  appPage/
    desktop/
      desktop.ts        # デスクトップのアプリ画面のエントリポイント
      desktop.css       # デスクトップの CSS のエントリポイント
    mobile/
      mobile.ts         # モバイルのアプリ画面のエントリポイント
      mobile.css        # モバイルの CSS のエントリポイント
  configPage/
    config.ts           # プラグイン設定画面のエントリポイント
    config.html         # プラグイン設定画面のマークアップ
    config.css          # 設定画面の CSS のエントリポイント
    components/         # 設定画面固有の UI パーツ
  common/               # 3 つの画面で共有するコード
    api/                # @kintone/rest-api-client のラッパー
    components/         # kintone-ui-component による UI パーツ
    constants/
      config.ts         # クラス名・DOM の id などの定数
    i18n/               # i18next の設定と翻訳リソース
    styles/
      common.css        # 3 つの CSS エントリポイントで共有するルール
    types/
      fields.d.ts       # kintone アプリのフィールド型（@kintone/dts-gen が生成）
    utils/              # 純粋なユーティリティ関数（dayjs のラッパーなど）
  image/
    icon.png            # プラグインのアイコン
dist/                   # ビルド成果物（plugin.zip を含む）
scripts/
  init.ts               # 初期化スクリプト
  tsconfig.json         # ビルドスクリプト用の tsconfig（エディタ支援）
  esbuild/
    build.ts            # esbuild のビルドスクリプト
    plugins/
      serve-mode-plugin.ts
.cert/                  # ローカル信頼済み証明書（生成物）
  private.key
  private.cert
.vscode/
  settings.json         # native の TypeScript 言語サーバーを有効化（useTsgo）
manifest.json           # 開発用の manifest（開発サーバーの URL）
manifest.prod.json      # 本番用の manifest（dist/ パス）
private.ppk             # プラグインの秘密鍵。プラグイン ID を決定（git 管理外）
eslint.config.js        # ESLint 設定（プロジェクトルート）
prettier.config.ts      # Prettier 設定
.prettierignore         # Prettier の対象外パス
tsconfig.json
mise.toml               # mise 用の Node.js / pnpm バージョン固定
pnpm-workspace.yaml     # pnpm のプロジェクト設定（allowBuilds など）
```

> **規模が大きくなったら:** プラグインは 3 つの独立した実行コンテキストを持つため、`src/` の最上位は manifest と 1 対 1 に対応する画面単位（`appPage`・`configPage`）で分割し、共有するものはすべて `common/` に置いています。小〜中規模のプラグインなら、イベントハンドラーは `desktop.ts` / `mobile.ts` に直接書くことを推奨します。ファイルが大きくなってきたら、隣に `events/` ディレクトリを作ってハンドラーを分割し（例: `appPage/desktop/events/index-show.ts`）、エントリポイントから再エクスポートしてください。
>
> **CSS の扱い:** CSS は TypeScript から import せず、意図的に独立したエントリポイントとして扱っています。kintone はプラグインのスタイルシートをスクリプト実行前に `<head>` で読み込むため、実行時に JavaScript でスタイルを注入した場合に起きる FOUC（Flash of Unstyled Content）を防げます。また manifest はデスクトップ・モバイル・設定画面の CSS を個別に宣言するため、出力を 3 本に分ける必要があります。共有するルールは `common/styles/common.css` に置けば、esbuild がビルド時にインライン化します。
