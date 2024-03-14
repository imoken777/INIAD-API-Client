import axios from "axios";
import {
  AllCardSignageLinks,
  CardSignageLink,
  ICCardInfo,
  LockerApiResponse,
  LockerInfo,
  RoomApiResponse,
  RoomStatus,
} from "./types";
import { parseToLockerInfo, parseToRoomStatus } from "./parser";
import { handleErrors } from "./utils";

export class eduIotApiClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(baseUrl: string, userId: string, password: string) {
    this.baseUrl = baseUrl;
    this.authHeader = this.makeBasicAuth(userId, password);
  }

  private makeBasicAuth(userId: string, password: string): string {
    const token = `${userId}:${password}`;
    const hash = btoa(token);
    return `Basic ${hash}`;
  }

  public async getLockerInfo(): Promise<LockerInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/locker`;

    try {
      const response = await axios.get<LockerApiResponse>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<LockerApiResponse>(response);

      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }

      return parseToLockerInfo({
        status: "success",
        description: "Succeeded getting locker information",
        name: responseData.name,
        floor: responseData.floor,
      });
    } catch (error: unknown) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;

        if (error.response?.status === 503) {
          return parseToLockerInfo({
            status: "success",
            description: "Below is dummy data for test purposes",
            name: "32XXXX",
            floor: 3,
          });
        }
      }
      return parseToLockerInfo({
        status: "error",
        description: `[Error] ${errorDescription}`,
      });
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

      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }

      return parseToLockerInfo({
        status: "success",
        description: "Succeeded opening locker",
        name: responseData.name,
        floor: responseData.floor,
      });
    } catch (error: unknown) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;

        if (error.response?.status === 503) {
          return parseToLockerInfo({
            status: "success",
            description: "Below is dummy data for test purposes",
            name: "32XXXX",
            floor: 3,
          });
        }
      }
      return parseToLockerInfo({
        status: "error",
        description: `[Error] ${errorDescription}`,
      });
    }
  }

  public async getICCardsInfo(): Promise<ICCardInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/iccards`;

    try {
      const response = await axios.get(requestUrl, { headers });
      const responseData = handleErrors(response);

      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }

      return {
        status: "success",
        description: "Succeeded getting IC card information",
        icCardId: responseData[0].uid,
        icCardComment: responseData[0].comment,
      };
    } catch (error) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;

        if (error.response?.status === 503) {
          return {
            status: "success",
            description: "Below is dummy data for test purposes",
            icCardId: "XXXXXXXXXXXXXXXX",
            icCardComment: "dummy comment",
          };
        }
      }
      return {
        status: "error",
        description: `[Error] ${errorDescription}`,
        icCardId: null,
        icCardComment: null,
      };
    }
  }

  public async registerICCard(uid: string, comment: string) {
    const headers = {
      Authorization: this.authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const requestUrl = `${this.baseUrl}/iccards`;

    try {
      const data = new URLSearchParams();
      data.append("uid", uid);
      data.append("comment", comment);

      const response = await axios.post(requestUrl, data, { headers });
      const responseData = handleErrors(response);

      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }

      return {
        status: "success",
        description: "Succeeded registering IC card",
      };
    } catch (error) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;

        if (error.response?.status === 503) {
          return {
            status: "success",
            description: "This is dummy message for registration IC card",
          };
        }
      }
      return {
        status: "error",
        description: `[Error] ${errorDescription}`,
      };
    }
  }

  public async deleteICCard(uid: string, comment: string) {
    const headers = {
      Authorization: this.authHeader,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const requestUrl = `${this.baseUrl}/iccards/1`;
    try {
      const data = new URLSearchParams();
      data.append("uid", uid);
      data.append("comment", comment);
      const response = await axios.delete(requestUrl, { headers, data });
      const responseData = handleErrors(response);
      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }
      return {
        status: "success",
        description: "Succeeded deleting IC card",
      };
    } catch (error) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;
        if (error.response?.status === 503) {
          return {
            status: "success",
            description: "This is dummy message for deleting IC card",
          };
        }
      }
      return {
        status: "error",
        description: `[Error] ${errorDescription}`,
      };
    }
  }

  public async getRoomStatus(roomNumber: number): Promise<RoomStatus> {
    let sensors = ["temperature", "humidity", "illuminance", "airpressure"];
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${
      this.baseUrl
    }/sensors/${roomNumber}?sensor_type=${sensors.join("+")}`;

    try {
      const response = await axios.get<RoomApiResponse>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<RoomApiResponse>(response);
      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }

      return parseToRoomStatus({
        status: "success",
        description: "Succeeded getting room status",
        data: responseData.data,
      });
    } catch (error) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;
        if (error.response?.status === 503) {
          return parseToRoomStatus({
            status: "success",
            description: "Below is dummy data for test purposes",
            data: [
              { sensorType: "temperature", value: 30.9 },
              { sensorType: "humidity", value: 55.5 },
              { sensorType: "illuminance", value: 100 },
              { sensorType: "airPressure", value: 1006 },
            ],
          });
        }
      }
      return parseToRoomStatus({
        status: "error",
        description: `[Error] ${errorDescription}`,
      });
    }
  }
}

export class signageApiClient {
  private baseUrl: string;
  private authHeader: string;

  constructor(baseUrl: string, userId: string, password: string) {
    this.baseUrl = baseUrl;
    this.authHeader = this.makeBasicAuth(userId, password);
  }

  private makeBasicAuth(userId: string, password: string): string {
    const token = `${userId}:${password}`;
    const hash = btoa(token);
    return `Basic ${hash}`;
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを返す関数
  public async getContentByCardIdm(cardIdm: number): Promise<CardSignageLink> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards/${cardIdm}`;

    try {
      const response = await axios.get<CardSignageLink>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<CardSignageLink>(response);

      return {
        status: "success",
        description: "Succeeded getting content by cardIdm",
        idm: responseData.idm,
        url: responseData.url,
        displaySeconds: responseData.displaySeconds,
      };
    } catch (error) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;
      }
      return {
        status: "error",
        description: `[Error] ${errorDescription}`,
        idm: 0,
        url: "",
        displaySeconds: 0,
      };
    }
  }
  //ログインユーザのカードIDmとサイネージで表示するコンテンツの紐づけの一覧を返す関数
  public async getAllCardIdmAndContentList(): Promise<AllCardSignageLinks> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/api/v1/signage/cards`;

    try {
      const response = await axios.get<AllCardSignageLinks>(requestUrl, {
        headers,
      });
      const responseData = handleErrors<AllCardSignageLinks>(response);

      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }

      return {
        status: "success",
        description: "Succeeded getting all cardIdm and content list",
        links: responseData.links,
      };
    } catch (error) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;
      }
      return {
        status: "error",
        description: `[Error] ${errorDescription}`,
      };
    }
  }
}
