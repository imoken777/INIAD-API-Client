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
  return {
    status: statusInfo.status,
    description: statusInfo.description,
    temperature: data.find((item) => item.sensorType === 'temperature')?.value ?? null,
    humidity: data.find((item) => item.sensorType === 'humidity')?.value ?? null,
    illuminance: data.find((item) => item.sensorType === 'illuminance')?.value ?? null,
    airPressure: data.find((item) => item.sensorType === 'airpressure')?.value ?? null,
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
    cardIDm: argCardIDm,
    removeCount: responseData.removed_count ?? null,
  };
};
