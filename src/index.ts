import axios from 'axios';
import {
  parseToAllCardSignageLinks,
  parseToAllICCardInfo,
  parseToCardSignageLink,
  parseToDeleteCardSignageLink,
  parseToICCardInfo,
  parseToLockerInfo,
  parseToRoomStatus,
} from './parser';
import type {
  AllCardSignageLinks,
  AllCardSignageLinksApiResponse,
  AllICCardApiResponse,
  AllICCardInfo,
  CardSignageLink,
  CardSignageLinkApiResponse,
  DeleteCardSignageLink,
  DeleteCardSignageLinkApiResponse,
  ICCardInfo,
  ICCardInfoApiResponse,
  LockerApiResponse,
  LockerInfo,
  RoomApiResponse,
  RoomStatus,
  StatusInfo,
} from './types';
import { dummyDescription, handleErrors, makeBasicAuth, validateCardIDm } from './utils';

export class EduIotApiClient {
  private axiosInstance;

  constructor(baseUrl: string, userId: string, password: string) {
    const authHeader = makeBasicAuth(userId, password);
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: authHeader,
      },
    });
  }

  public async getLockerInfo(): Promise<LockerInfo> {
    const requestUrl = '/locker';

    try {
      const response = await this.axiosInstance.get<LockerApiResponse>(requestUrl);
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
    const requestUrl = '/locker/open';

    try {
      const response = await this.axiosInstance.post<LockerApiResponse>(requestUrl, null);
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

  public async getAllICCardsInfo(): Promise<AllICCardInfo> {
    const requestUrl = '/iccards';

    try {
      const response = await this.axiosInstance.get<AllICCardApiResponse>(requestUrl);
      const responseData = handleErrors<AllICCardApiResponse>(response);

      const successInfo: StatusInfo = {
        status: 'success',
        description: 'Succeeded getting all IC card information',
      };
      return parseToAllICCardInfo(successInfo, responseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          const dummyInfo: StatusInfo = {
            status: 'dummy',
            description: dummyDescription,
          };
          const dummyData: AllICCardApiResponse = [
            { id: 1, uid: 'XXXXXXXXXXXXXXXX', comment: 'dummy comment' },
          ];
          return parseToAllICCardInfo(dummyInfo, dummyData);
        }
      }
      throw error;
    }
  }

  public async registerICCard(cardIDm: string, comment: string): Promise<ICCardInfo> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    const requestUrl = '/iccards';

    try {
      const data = new URLSearchParams();
      data.append('uid', validatedCardIDm);
      data.append('comment', comment);

      const response = await this.axiosInstance.post<ICCardInfoApiResponse>(
        requestUrl,
        data,
        config,
      );
      const responseData = handleErrors<ICCardInfoApiResponse>(response);

      const successInfo: StatusInfo = {
        status: 'success',
        description: 'Succeeded registering IC card',
      };

      return parseToICCardInfo(successInfo, responseData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 503) {
          const dummyInfo: StatusInfo = {
            status: 'dummy',
            description: dummyDescription,
          };
          const dummyData: ICCardInfoApiResponse = {
            id: 1,
            uid: 'XXXXXXXXXXXXXXXX',
            comment: 'dummy comment',
          };

          return parseToICCardInfo(dummyInfo, dummyData);
        }
      }
      throw error;
    }
  }

  public async deleteICCard(cardIDm: string, comment: string): Promise<StatusInfo> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const data = new URLSearchParams();
    data.append('uid', validatedCardIDm);
    data.append('comment', comment);
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    };
    //TODO: 本当に/1でいいのか確認
    const requestUrl = '/iccards/1';
    try {
      const response = await this.axiosInstance.delete(requestUrl, config);
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
    const requestUrl = `/sensors/${roomNumber}?sensor_type=${sensors.join('+')}`;

    try {
      const response = await this.axiosInstance.get<RoomApiResponse>(requestUrl);
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
  private axiosInstance;

  constructor(baseUrl: string, userId: string, password: string) {
    const authHeader = makeBasicAuth(userId, password);
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: authHeader,
      },
    });
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを返す関数
  public async getContentByCardIDm(cardIDm: string): Promise<CardSignageLink> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const requestUrl = `/api/v1/signage/cards/${validatedCardIDm}`;

    const response = await this.axiosInstance.get<CardSignageLinkApiResponse>(requestUrl);
    const responseData = handleErrors<CardSignageLinkApiResponse>(response);

    const successInfo: StatusInfo = {
      status: 'success',
      description: 'Succeeded getting content by cardIDm',
    };
    return parseToCardSignageLink(successInfo, responseData);
  }

  //ユーザのカードIDmとサイネージで表示するコンテンツの紐づけの一覧を返す関数
  public async getAllCardIDmAndContentList(): Promise<AllCardSignageLinks> {
    const requestUrl = '/api/v1/signage/cards';

    const response = await this.axiosInstance.get<AllCardSignageLinksApiResponse>(requestUrl);
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
    const data = { url: contentUrl, display_seconds: displaySeconds };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const requestUrl = `/api/v1/signage/cards/${validatedCardIDm}`;

    const response = await this.axiosInstance.put<CardSignageLinkApiResponse>(
      requestUrl,
      data,
      config,
    );
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
    const requestUrl = `/api/v1/signage/cards/${validatedCardIDm}`;

    const response = await this.axiosInstance.delete<DeleteCardSignageLinkApiResponse>(requestUrl);

    const responseData = handleErrors<DeleteCardSignageLinkApiResponse>(response);

    const statusInfo: StatusInfo = {
      status: 'success',
      description: 'Content deleted successfully by cardIDm',
    };
    return parseToDeleteCardSignageLink(statusInfo, validatedCardIDm, responseData);
  }
}
