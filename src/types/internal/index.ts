export type ValidatedCardIDm = string & { readonly __brand: unique symbol };

export type LockerApiResponse = {
  readonly name?: string;
  readonly floor?: number;
};

export type ICCardInfoApiResponse = {
  readonly id?: number;
  readonly uid?: string;
  readonly comment?: string;
};
export type AllICCardApiResponse = Array<ICCardInfoApiResponse>;

export type RoomApiResponse = Array<{
  readonly room_num?: number;
  readonly sensor_type?: 'temperature' | 'humidity' | 'illuminance' | 'airpressure';
  readonly value?: number | null;
}>;

export type CardSignageLinkApiResponse = {
  readonly idm?: string;
  readonly url?: string;
  readonly display_seconds?: number;
};
export type AllCardSignageLinksApiResponse = Array<CardSignageLinkApiResponse>;

export type DeleteCardSignageLinkApiResponse = {
  readonly message?: string;
  readonly removed_count?: number;
};
