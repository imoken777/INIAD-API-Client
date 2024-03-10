import axios, { Axios, AxiosResponse } from "axios";

export interface lockerInfo {
  readonly status: string;
  readonly description: string;
  readonly lockerAddress: string | null;
  readonly lockerFloor: number | null;
}

export interface icCardInfo {
  readonly status: string;
  readonly description: string;
  readonly icCardId: string | null;
  readonly icCardComment: string | null;
}

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

class INIADAPIClient {
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

  public async getLockerInfo(): Promise<lockerInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/locker`;

    try {
      const response = await axios.get(requestUrl, { headers });
      const data = handleErrors(response);

      if (data.status === "error") {
        throw {
          status: data.status,
          statusText: data.description,
        };
      }

      return {
        status: "success",
        description: "Succeeded getting locker information",
        lockerAddress: data.name,
        lockerFloor: data.floor,
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

  public async openLocker(): Promise<lockerInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/locker/open`;

    try {
      const response = await axios.post(requestUrl, null, { headers });
      const data = handleErrors(response);

      if (data.status === "error") {
        throw {
          status: data.status,
          statusText: data.description,
        };
      }

      return {
        status: "success",
        description: "Succeeded opening locker",
        lockerAddress: data.name,
        lockerFloor: data.floor,
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

  public async getICCardsInfo(): Promise<icCardInfo> {
    const headers = { Authorization: this.authHeader };
    const requestUrl = `${this.baseUrl}/iccards`;

    try {
      const response = await axios.get(requestUrl, { headers });
      const data = handleErrors(response);

      if (data.status === "error") {
        throw {
          status: data.status,
          statusText: data.description,
        };
      }

      return {
        status: "success",
        description: "Succeeded getting IC card information",
        icCardId: data[0].uid,
        icCardComment: data[0].comment,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 503) {
        return {
          status: "success",
          description: "Below is dummy data for test purposes",
          icCardId: "XXXXXXXXXXXXXXXX",
          icCardComment: "dummy comment",
        };
      } else {
        throw error;
      }
    }
  }
}
