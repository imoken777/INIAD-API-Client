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

export const parseToLockerInfo = (statusInfo: StatusInfo, data: LockerApiResponse): LockerInfo => {
  return {
    status: statusInfo.status,
    description: statusInfo.description,
    lockerAddress: data.name ?? null,
    lockerFloor: data.floor ?? null,
  };
};

export const parseToICCardInfo = (
  statusInfo: StatusInfo,
  data: ICCardInfoApiResponse,
): ICCardInfo => {
  return {
    status: statusInfo.status,
    description: statusInfo.description,
    cardIDm: data.uid,
    icCardComment: data.comment,
  };
};

export const parseToAllICCardInfo = (
  statusInfo: StatusInfo,
  data: AllICCardApiResponse,
): AllICCardInfo => {
  return {
    status: statusInfo.status,
    description: statusInfo.description,
    cards: data.map((item) => ({
      cardIDm: item.uid,
      icCardComment: item.comment,
    })),
  };
};

export const parseToRoomStatus = (statusInfo: StatusInfo, data: RoomApiResponse): RoomStatus => {
  return {
    status: statusInfo.status,
    description: statusInfo.description,
    temperature: data.find((item) => item.sensor_type === 'temperature')?.value ?? null,
    humidity: data.find((item) => item.sensor_type === 'humidity')?.value ?? null,
    illuminance: data.find((item) => item.sensor_type === 'illuminance')?.value ?? null,
    airPressure: data.find((item) => item.sensor_type === 'airpressure')?.value ?? null,
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
