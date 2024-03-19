export interface StatusInfo {
  readonly status: 'success' | 'error' | 'dummy';
  readonly description: string;
}

export type ValidatedCardIDm = string & { readonly __brand: unique symbol };

export type LockerApiResponse = StatusInfo & {
  name?: string;
  floor?: number;
};

export type LockerInfo = StatusInfo & {
  readonly lockerAddress: string | null;
  readonly lockerFloor: number | null;
};

export type ICCardInfo = StatusInfo & {
  readonly cardIDm: string | null;
  readonly icCardComment: string | null;
};

export type SensorData = {
  readonly sensorType: string;
  readonly value: number | null;
};

export type RoomApiResponse = StatusInfo & {
  data?: SensorData[];
};

export type RoomStatus = StatusInfo & {
  readonly temperature: number | null;
  readonly humidity: number | null;
  readonly illuminance: number | null;
  readonly airPressure: number | null;
};

export type CardSignageLink<IncludeStatusInfo = true> = IncludeStatusInfo extends true
  ? StatusInfo & {
      readonly cardIDm: string;
      readonly url: string;
      readonly displaySeconds: number;
    }
  : {
      readonly cardIDm: string;
      readonly url: string;
      readonly displaySeconds: number;
    };

export type AllCardSignageLinksApiResponse = StatusInfo & {
  readonly links?: CardSignageLink<false>[];
};

export type AllCardSignageLinks = StatusInfo & {
  readonly links: CardSignageLink<false>[];
};
