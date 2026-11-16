遅刻バナナ PWA準備パッケージ

内容
- index.html: 既存アプリ。画面・機能は残し、サーバー通信部分をWorker経由に変更。
- manifest.webmanifest / sw.js: PWA設定とアプリ本体のキャッシュ。
- icons/: 元の遅刻バナナのアイコンから作成したPWA用画像。
- worker.js: Cloudflare Worker用の中継コード。受け取った /exec URL を設定済み。
- config.js: 公開後のWorker URLを入れる設定ファイル（現在は仮URL）。

重要
1. このパッケージはまだ公開完了ではありません。
2. config.js の仮URLを、Worker公開後に発行される実際のURLへ差し替える必要があります。
3. index.html等はHTTPS対応の静的ホスティングへ配置します。Apps ScriptのHTML画面自体にmanifestを足すだけでは、通常のPWAとしてのService Worker配信にならないためです。
4. Apps Script側の既存Code.gsやスプレッドシートは変更していません。
5. 既存HTMLの画面・機能は維持し、gasRequestの通信方法だけをgoogle.script.runからWorker経由のfetchへ切り替えています。
6. APIは既存GASの30,000文字上限を維持しています。プロフィール画像の既存サイズ制限も変更していません。

公開前の確認が必要です。まずWorkerを公開し、そのURLをconfig.jsへ設定してから静的ホスティングへ配置します。
