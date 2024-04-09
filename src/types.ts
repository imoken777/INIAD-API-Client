export interface StatusInfo {
  readonly status: 'success' | 'error' | 'dummy';
  readonly description: string;
}

export type ValidatedCardIDm = string & { readonly __brand: unique symbol };

export type LockerApiResponse = {
  readonly name?: string;
  readonly floor?: number;
};

export type LockerInfo = StatusInfo & {
  readonly lockerAddress: string | null;
  readonly lockerFloor: number | null;
};

export type ICCardInfoApiResponse = {
  readonly id: number;
  readonly uid: string;
  readonly comment: string;
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

export type AllICCardApiResponse = Array<ICCardInfoApiResponse>;

export type AllICCardInfo = StatusInfo & {
  readonly cards: ICCardInfo<false>[];
};

export type RoomApiResponse = Array<{
  readonly roomNumber: number;
  readonly sensorType: string;
  readonly value: number | null;
}>;

export type RoomStatus = StatusInfo & {
  readonly temperature: number | null;
  readonly humidity: number | null;
  readonly illuminance: number | null;
  readonly airPressure: number | null;
};

// APIレスポンス用の型
export type CardSignageLinkApiResponse = {
  readonly idm: string;
  readonly url: string;
  readonly display_seconds: number;
};

// アプリケーション内で使用する型
export type CardSignageLink<IncludeStatusInfo = true> = IncludeStatusInfo extends true
  ? StatusInfo & {
      readonly cardIDm: CardSignageLinkApiResponse['idm'];
      readonly url: CardSignageLinkApiResponse['url'];
      readonly displaySeconds: CardSignageLinkApiResponse['display_seconds'];
    }
  : {
      readonly cardIDm: CardSignageLinkApiResponse['idm'];
      readonly url: CardSignageLinkApiResponse['url'];
      readonly displaySeconds: CardSignageLinkApiResponse['display_seconds'];
    };

// 全カードのリンク情報のAPIレスポンス用の型
export type AllCardSignageLinksApiResponse = Array<CardSignageLinkApiResponse>;

// 全カードのリンク情報のアプリケーション内で使用する型
export type AllCardSignageLinks = StatusInfo & {
  readonly links: CardSignageLink<false>[];
};

export type DeleteCardSignageLinkApiResponse = {
  readonly message: string;
  readonly removed_count: number;
};

export type DeleteCardSignageLink = StatusInfo & {
  readonly cardIDm: string;
  readonly removeCount: number;
};
