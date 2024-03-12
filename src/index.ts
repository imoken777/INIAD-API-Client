import axios, { AxiosResponse } from "axios";
import { ApiResponse, ICCardInfo, LockerInfo, RoomStatus } from "models";

function handleErrors(response: AxiosResponse) {
  if (response.status >= 500 && response.status <= 599) {
    let error = {
      status: response.status,
      statusText: response.statusText,
    };
    throw error;
  }
  return response.data;
}

export class INIADAPIClient {
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
        description: "Succeeded getting locker information",
        lockerAddress: responseData.name,
        lockerFloor: responseData.floor,
      };
    } catch (error: unknown) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;

        if (error.response?.status === 503) {
          return {
            status: "success",
            description: "Below is dummy data for test purposes",
            lockerAddress: "32XXXX",
            lockerFloor: 3,
          };
        }
      }
      return {
        status: "fail",
        description: `[Error] ${errorDescription}`,
        lockerAddress: null,
        lockerFloor: null,
      };
    }
  }

  public async openLocker(): Promise<LockerInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/locker/open`;

    try {
      const response = await axios.post(requestUrl, null, { headers });
      const responseData = handleErrors(response);

      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }

      return {
        status: "success",
        description: "Succeeded opening locker",
        lockerAddress: responseData.name,
        lockerFloor: responseData.floor,
      };
    } catch (error: unknown) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;

        if (error.response?.status === 503) {
          return {
            status: "success",
            description: "Below is dummy data for test purposes",
            lockerAddress: "32XXXX",
            lockerFloor: 3,
          };
        }
      }
      return {
        status: "fail",
        description: `[Error] ${errorDescription}`,
        lockerAddress: null,
        lockerFloor: null,
      };
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
        status: "fail",
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
        status: "fail",
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
        status: "fail",
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
      const response = await axios.get<ApiResponse>(requestUrl, { headers });
      const responseData: ApiResponse = handleErrors(response);
      if (responseData.status === "error") {
        throw {
          status: responseData.status,
          statusText: responseData.description,
        };
      }

      const retrievedSensors = responseData.data.reduce((acc, cur) => {
        acc[cur.sensor_type] = cur.value || null;
        return acc;
      }, {} as Record<string, number | null>);

      return {
        status: "success",
        description: "Succeeded getting room status",
        temperature: retrievedSensors.temperature,
        humidity: retrievedSensors.humidity,
        illuminance: retrievedSensors.illuminance,
        airPressure: retrievedSensors.airpressure,
      };
    } catch (error) {
      let errorDescription = "Unknown error";
      if (axios.isAxiosError(error)) {
        errorDescription = error.message;
        if (error.response?.status === 503) {
          return {
            status: "success",
            description: "Below is dummy data for test purposes",
            illuminance: 100,
            humidity: 55.5,
            airPressure: 1006,
            temperature: 30.9,
          };
        }
      }
      return {
        status: "fail",
        description: `[Error] ${errorDescription}`,
        illuminance: null,
        humidity: null,
        airPressure: null,
        temperature: null,
      };
    }
  }
}
