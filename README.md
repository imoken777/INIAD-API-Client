## INIAD API Client

![npm](https://img.shields.io/npm/v/iniad-api-client)
![License](https://img.shields.io/badge/license-MIT-green)

INIAD APIの非公式クライアントライブラリです。

本ライブラリは、INIADのアカウントを持つユーザーのみがアクセス可能な[INIAD開発者サイト](https://sites.google.com/iniad.org/developers?pli=1&authuser=0) に準拠しています。そこに記載されている教育用IoT APIとサイネージAPIの利用をサポートします。OpenAI APIには対応していません。

### 特徴

- 簡単アクセス: 専用のメソッドを使用して、APIに簡単かつ直接アクセスできます。
- 型安全なプログラミング: TypeScriptの型定義ファイルを提供しており、開発中に型安全を保証します。
- ダミーデータによる開発サポート: 学外からでも開発を進められるよう、ダミーデータを使用したテストが可能です。

### インストール

npmを使用して簡単にインストールできます。

```sh
npm install iniad-api-client
```

### 使い方

パッケージをインポートして、APIクライアントを初期化します。userIdとpasswordはINIADのアカウント情報です。

#### 設定の注意点

- EduIotApiClientの設定:
  EduIotApiClientを初期化する際に指定するbaseUrlは、INIAD開発者サイト記載のドメイン（例：<https://api.example.org>）までとし、それ以下のパス（例：/api/v1）は含めないでください。これにより、正確なAPIエンドポイントへのアクセスが保証されます。

- SignageApiClientの設定:
  SignageApiClientは、[CORSポリシー](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)を遵守するために、プロキシを経由してAPIへのリクエストを行う必要があります。プロキシのURLはbaseProxyUrlオプショナル引数を通じて設定可能です。もしbaseProxyUrlを指定しない場合は、開発者が用意したデフォルトのプロキシが使用されます。

ソースコードを共有する場合など、それらの情報を直接ソースコードに記述することは推奨されません。環境変数や設定ファイルなどを使用して、それらの情報を外部から取得するようにしてください。

以下はES Modulesを使用した例です。

```typescript
import { EduIotApiClient, SignageApiClient } from 'iniad-api-client';

const userId = process.env.USER_ID;
const password = process.env.PASSWORD;

//baseUrlはINIAD開発者サイト参照（～～.orgまで）
const baseUrl = process.env.BASE_URL;
const iotClient = new EduIotApiClient(userId, password, baseUrl);

// baseProxyUrlは省略可能。省略した場合、デフォルトのproxyが使用される
const baseProxyUrl = process.env.BASE_PROXY_URL;
const signageClient = new SignageApiClient(userId, password, baseProxyUrl);

async function main1() {
  try {
    const res = await iotClient.getLockerInfo();
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}

async function main2() {
  try {
    const res = await signageClient.getAllCardIDmAndContentList();
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}

main1();
main2();
```

### コントリビュート

INIAD API Clientはオープンソースプロジェクトです。バグの報告や機能の提案、プルリクエストなど、コミュニティの貢献を歓迎します。GitHubリポジトリをチェックしてください。

### ライセンス

INIAD API Clientは[MITライセンス](https://github.com/imoken777/INIAD-API-Client/blob/main/LICENSE)の下で公開されています。詳細については、LICENSEファイルを参照してください。
