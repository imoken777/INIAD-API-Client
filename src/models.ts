export type LockerInfo = {
  readonly status: string;
  readonly description: string;
  readonly lockerAddress: string | null;
  readonly lockerFloor: number | null;
};

export type ICCardInfo = {
  readonly status: string;
  readonly description: string;
  readonly icCardId: string | null;
  readonly icCardComment: string | null;
};

export type SensorData = {
  readonly sensor_type: string;
  readonly value: number | null;
};

export type ApiResponse = {
  readonly status: string;
  readonly description: string;
  data: SensorData[];
};

export type RoomStatus = {
  readonly status: string;
  readonly description: string;
  readonly temperature: number | null;
  readonly humidity: number | null;
  readonly illuminance: number | null;
  readonly airPressure: number | null;
};
