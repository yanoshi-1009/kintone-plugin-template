# kintone-customization-private

## 前提

- Live Server を導入していること
  - https://127.0.0.1:5500で設定していること

## 準備

1. 秘密鍵の作成
   openssl genpkey -out private.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048 
2. webpack.config 内のパッケージプラグイン名の変更

## 手順

1. `npm run build:dev-watch` でパッケージング
2. 生成されたプラグイン(開発用)を kintone へアップロード
3. コーディング
   - ファイル変更は webpack の watch で監視され適宜変換、バンドルが行われる
   - 2 でアップロードしたプラグイン live server を CDN 形式で参照しているため、再バンドルの内容は自動で反映される
4. テストが終了次第実ファイルを含む用に manifest.prod.json を書き換え manifest.json にし、 `npm run build:dev` or `npm run build:prod` でパッケージング
