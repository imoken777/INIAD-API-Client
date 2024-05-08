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
