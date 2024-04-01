import type {
  AllCardSignageLinks,
  AllCardSignageLinksApiResponse,
  LockerApiResponse,
  LockerInfo,
  RoomApiResponse,
  RoomStatus,
  StatusInfo,
} from './types';

export const parseToLockerInfo = (response: LockerApiResponse): LockerInfo => {
  return {
    status: response.status,
    description: response.description,
    lockerAddress: response.name ?? null,
    lockerFloor: response.floor ?? null,
  };
};

export const parseToRoomStatus = (
  statusInfo: StatusInfo,
  response: RoomApiResponse,
): RoomStatus => {
  let temp: number | null = null;
  let hum: number | null = null;
  let illum: number | null = null;
  let airPres: number | null = null;

  // レスポンスデータをループして各センサー値を更新
  response.forEach((item) => {
    switch (item.sensorType) {
      case 'temperature':
        temp = item.value;
        break;
      case 'humidity':
        hum = item.value;
        break;
      case 'illuminance':
        illum = item.value;
        break;
      case 'airpressure':
        airPres = item.value;
        break;
    }
  });

  return {
    ...statusInfo,
    temperature: temp,
    humidity: hum,
    illuminance: illum,
    airPressure: airPres,
  };
};

export const parseToAllCardSignageLinks = (
  response: AllCardSignageLinksApiResponse,
): AllCardSignageLinks => {
  return {
    status: response.status,
    description: response.description,
    links: response.links ?? [],
  };
};
