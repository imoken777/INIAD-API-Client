import { EduIotApiClient } from 'iniad-api-node';

const baseUrl = process.env.BASE_URL;
const userId = process.env.USER_ID;
const password = process.env.PASSWORD;

const iotClient = new EduIotApiClient({ baseUrl, userId, password });

(async () => {
  try {
    const res = await iotClient.getLockerInfo();
    console.log(res.lockerAddress);
  } catch (e) {
    console.error(e);
  }
})();
