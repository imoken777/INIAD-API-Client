interface StatusInfo {
  readonly status: "success" | "fail" | "error";
  readonly description: string;
}

export type LockerApiResponse = StatusInfo & {
  name?: string;
  floor?: number;
};

export type LockerInfo = StatusInfo & {
  readonly lockerAddress: string | null;
  readonly lockerFloor: number | null;
};

export type ICCardInfo = StatusInfo & {
  readonly icCardId: string | null;
  readonly icCardComment: string | null;
};

export type SensorData = {
  readonly sensor_type: string;
  readonly value: number | null;
};

export type RoomApiResponse = StatusInfo & {
  data: SensorData[];
};

export type RoomStatus = StatusInfo & {
  readonly temperature: number | null;
  readonly humidity: number | null;
  readonly illuminance: number | null;
  readonly airPressure: number | null;
};
