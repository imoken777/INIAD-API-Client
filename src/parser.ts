import type {
  AllCardSignageLinks,
  AllCardSignageLinksApiResponse,
  LockerApiResponse,
  LockerInfo,
  RoomApiResponse,
  RoomStatus,
} from './types';

export const parseToLockerInfo = (response: LockerApiResponse): LockerInfo => {
  return {
    status: response.status,
    description: response.description,
    lockerAddress: response.name ?? null,
    lockerFloor: response.floor ?? null,
  };
};

export const parseToRoomStatus = (response: RoomApiResponse): RoomStatus => {
  return {
    status: response.status,
    description: response.description,
    temperature: response.data?.find((data) => data.sensorType === 'temperature')?.value ?? null,
    humidity: response.data?.find((data) => data.sensorType === 'humidity')?.value ?? null,
    illuminance: response.data?.find((data) => data.sensorType === 'illuminance')?.value ?? null,
    airPressure: response.data?.find((data) => data.sensorType === 'airPressure')?.value ?? null,
  };
};

export const parseToAllCardSignageLinks = (
  response: AllCardSignageLinksApiResponse
): AllCardSignageLinks => {
  return {
    status: response.status,
    description: response.description,
    links: response.links ?? [],
  };
};
