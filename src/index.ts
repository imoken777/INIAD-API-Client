import axios from 'axios';
import {
  parseToAllCardSignageLinks,
  parseToCardSignageLink,
  parseToDeleteCardSignageLink,
  parseToLockerInfo,
  parseToRoomStatus,
} from './parser';
import type {
  AllCardSignageLinks,
  AllCardSignageLinksApiResponse,
  CardSignageLink,
  CardSignageLinkApiResponse,
  DeleteCardSignageLink,
  DeleteCardSignageLinkApiResponse,
  ICCardInfo,
  LockerApiResponse,
  LockerInfo,
  RoomApiResponse,
  RoomStatus,
  StatusInfo,
} from './types';
import { dummyDescription, handleErrors, makeBasicAuth, validateCardIDm } from './utils';

export class EduIotApiClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(baseUrl: string, userId: string, password: string) {
    this.baseUrl = baseUrl;
    this.authHeader = makeBasicAuth(userId, password);
  }

  public async getLockerInfo(): Promise<LockerInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/locker`;

    try {
      const response = await axios.get<LockerApiResponse>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<LockerApiResponse>(response);

      return parseToLockerInfo({
        status: 'success',
        description: 'Succeeded getting locker information',
        name: responseData.name,
        floor: responseData.floor,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return parseToLockerInfo({
            status: 'dummy',
            description: dummyDescription,
            name: '32XXXX',
            floor: 3,
          });
        }
      }
      throw error;
    }
  }

  public async openLocker(): Promise<LockerInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/locker/open`;

    try {
      const response = await axios.post<LockerApiResponse>(requestUrl, null, {
        headers,
      });
      const responseData = handleErrors<LockerApiResponse>(response);

      return parseToLockerInfo({
        status: 'success',
        description: 'Succeeded opening locker',
        name: responseData.name,
        floor: responseData.floor,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return parseToLockerInfo({
            status: 'dummy',
            description: dummyDescription,
            name: '32XXXX',
            floor: 3,
          });
        }
      }
      throw error;
    }
  }

  public async getICCardsInfo(): Promise<ICCardInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/iccards`;

    try {
      const response = await axios.get(requestUrl, { headers });
      const responseData = handleErrors(response);

      return {
        status: 'success',
        description: 'Succeeded getting IC card information',
        cardIDm: responseData[0].uid,
        icCardComment: responseData[0].comment,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return {
            status: 'dummy',
            description: dummyDescription,
            cardIDm: 'XXXXXXXXXXXXXXXX',
            icCardComment: 'dummy comment',
          };
        }
      }
      throw error;
    }
  }

  public async registerICCard(cardIDm: string, comment: string) {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const headers = {
      Authorization: this.authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const requestUrl = `${this.baseUrl}/iccards`;

    try {
      const data = new URLSearchParams();
      data.append('uid', validatedCardIDm);
      data.append('comment', comment);

      const response = await axios.post(requestUrl, data, { headers });
      handleErrors(response);

      return {
        status: 'success',
        description: 'Succeeded registering IC card',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return {
            status: 'dummy',
            description: dummyDescription,
          };
        }
      }
      throw error;
    }
  }

  public async deleteICCard(cardIDm: string, comment: string) {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const headers = {
      Authorization: this.authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const requestUrl = `${this.baseUrl}/iccards/1`;
    try {
      const data = new URLSearchParams();
      data.append('uid', validatedCardIDm);
      data.append('comment', comment);
      const response = await axios.delete(requestUrl, { headers, data });
      handleErrors(response);

      return {
        status: 'success',
        description: 'Succeeded deleting IC card',
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          return {
            status: 'dummy',
            description: dummyDescription,
          };
        }
      }
      throw error;
    }
  }

  public async getRoomStatus(roomNumber: number): Promise<RoomStatus> {
    const sensors = ['temperature', 'humidity', 'illuminance', 'airpressure'];
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/sensors/${roomNumber}?sensor_type=${sensors.join('+')}`;

    try {
      const response = await axios.get<RoomApiResponse>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<RoomApiResponse>(response);
      const successStatusInfo: StatusInfo = {
        status: 'success',
        description: 'Succeeded getting room status',
      };
      return parseToRoomStatus(successStatusInfo, responseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          const dummyStatusInfo: StatusInfo = {
            status: 'dummy',
            description: dummyDescription,
          };
          const dummyResponse: RoomApiResponse = [
            { roomNumber, sensorType: 'temperature', value: 30.9 },
            { roomNumber, sensorType: 'humidity', value: 55.5 },
            { roomNumber, sensorType: 'illuminance', value: 100 },
            { roomNumber, sensorType: 'airpressure', value: 1006 },
          ];
          return parseToRoomStatus(dummyStatusInfo, dummyResponse);
        }
      }
      throw error;
    }
  }
}

export class SignageApiClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(baseUrl: string, userId: string, password: string) {
    this.baseUrl = baseUrl;
    this.authHeader = makeBasicAuth(userId, password);
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを返す関数
  public async getContentByCardIDm(cardIDm: string): Promise<CardSignageLink> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards/${validatedCardIDm}`;

    const response = await axios.get<CardSignageLinkApiResponse>(requestUrl, {
      headers,
    });
    const responseData = handleErrors<CardSignageLinkApiResponse>(response);

    const successInfo: StatusInfo = {
      status: 'success',
      description: 'Succeeded getting content by cardIDm',
    };
    return parseToCardSignageLink(successInfo, responseData);
  }

  //ユーザのカードIDmとサイネージで表示するコンテンツの紐づけの一覧を返す関数
  public async getAllCardIDmAndContentList(): Promise<AllCardSignageLinks> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards`;

    const response = await axios.get<AllCardSignageLinksApiResponse>(requestUrl, {
      headers,
    });
    const responseData = handleErrors<AllCardSignageLinksApiResponse>(response);

    const successInfo: StatusInfo = {
      status: 'success',
      description: 'Succeeded getting all cardIDm and content list',
    };
    return parseToAllCardSignageLinks(successInfo, responseData);
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを登録または更新する関数
  public async upsertContentByCardIDm(
    cardIDm: string,
    contentUrl: string,
    displaySeconds: number,
  ): Promise<CardSignageLink> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const headers = {
      Authorization: this.authHeader,
      'Content-Type': 'application/json',
    };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards/${validatedCardIDm}`;
    const data = { url: contentUrl, display_seconds: displaySeconds };

    const response = await axios.put<CardSignageLinkApiResponse>(requestUrl, data, {
      headers,
    });
    const responseData = handleErrors(response);

    return {
      status: 'success',
      description: 'Content registered or updated successfully by cardIDm',
      cardIDm: responseData.idm,
      url: responseData.url,
      displaySeconds: responseData.display_seconds,
    };
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを削除する関数
  public async deleteContentByCardIDm(cardIDm: string): Promise<DeleteCardSignageLink> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards/${validatedCardIDm}`;

    const response = await axios.delete<DeleteCardSignageLinkApiResponse>(requestUrl, { headers });

    const responseData = handleErrors<DeleteCardSignageLinkApiResponse>(response);

    const statusInfo: StatusInfo = {
      status: 'success',
      description: 'Content deleted successfully by cardIDm',
    };
    return parseToDeleteCardSignageLink(statusInfo, validatedCardIDm, responseData);
  }
}
