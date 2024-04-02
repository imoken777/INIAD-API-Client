import type {
  AllCardSignageLinks,
  AllCardSignageLinksApiResponse,
  CardSignageLink,
  CardSignageLinkApiResponse,
  DeleteCardSignageLink,
  DeleteCardSignageLinkApiResponse,
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

export const parseToRoomStatus = (statusInfo: StatusInfo, data: RoomApiResponse): RoomStatus => {
  let temp: number | null = null;
  let hum: number | null = null;
  let illum: number | null = null;
  let airPres: number | null = null;

  // レスポンスデータをループして各センサー値を更新
  data.forEach((item) => {
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

export const parseToCardSignageLink = (
  statusInfo: StatusInfo,
  data: CardSignageLinkApiResponse,
): CardSignageLink => {
  return {
    status: statusInfo.status,
    description: statusInfo.description,
    cardIDm: data.idm ?? null,
    url: data.url ?? null,
    displaySeconds: data.display_seconds ?? null,
  };
};

export const parseToAllCardSignageLinks = (
  statusInfo: StatusInfo,
  data: AllCardSignageLinksApiResponse,
): AllCardSignageLinks => {
  return {
    status: statusInfo.status,
    description: statusInfo.description,
    links: data.map((item) => ({
      cardIDm: item.idm ?? null,
      url: item.url ?? null,
      displaySeconds: item.display_seconds ?? null,
    })),
  };
};

export const parseToDeleteCardSignageLink = (
  statusInfo: StatusInfo,
  argCardIDm: string,
  responseData: DeleteCardSignageLinkApiResponse,
): DeleteCardSignageLink => {
  return {
    status: statusInfo.status,
    description: statusInfo.description,
    cardIDm: argCardIDm ?? null,
    removeCount: responseData.removed_count ?? null,
  };
};
