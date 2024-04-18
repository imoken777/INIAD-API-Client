export interface StatusInfo {
  readonly status: 'success' | 'error' | 'dummy';
  readonly description: string;
}

export type LockerInfo = StatusInfo & {
  readonly lockerAddress: string | null;
  readonly lockerFloor: number | null;
};

export type ICCardInfo<IncludeStatusInfo = true> = IncludeStatusInfo extends true
  ? StatusInfo & {
      readonly cardIDm: string | null;
      readonly icCardComment: string | null;
    }
  : {
      readonly cardIDm: string | null;
      readonly icCardComment: string | null;
    };

export type AllICCardInfo = StatusInfo & {
  readonly cards: ICCardInfo<false>[];
};

export type RoomStatus = StatusInfo & {
  readonly temperature: number | null;
  readonly humidity: number | null;
  readonly illuminance: number | null;
  readonly airPressure: number | null;
};

export type CardSignageLink<IncludeStatusInfo = true> = IncludeStatusInfo extends true
  ? StatusInfo & {
      readonly cardIDm: string | null;
      readonly url: string | null;
      readonly displaySeconds: number | null;
    }
  : {
      readonly cardIDm: string | null;
      readonly url: string | null;
      readonly displaySeconds: number | null;
    };

export type AllCardSignageLinks = StatusInfo & {
  readonly links: CardSignageLink<false>[];
};

export type DeleteCardSignageLink = StatusInfo & {
  readonly cardIDm: string | null;
  readonly removeCount: number | null;
};
