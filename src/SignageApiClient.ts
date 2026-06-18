import {
  parseToAllCardSignageLinks,
  parseToCardSignageLink,
  parseToDeleteCardSignageLink,
} from './parser';

import type {
  AllCardSignageLinksApiResponse,
  CardSignageLinkApiResponse,
  DeleteCardSignageLinkApiResponse,
} from './types/internal';
import type {
  AllCardSignageLinks,
  CardSignageLink,
  DeleteCardSignageLink,
  StatusInfo,
} from './types/public';
import { fetchJson, handleErrors, makeBasicAuth, validateCardIDm } from './utils';

export class SignageApiClient {
  private baseProxyUrl: string;

  private authHeader: string;

  constructor(userId: string, password: string, baseProxyUrl?: string) {
    this.baseProxyUrl =
      baseProxyUrl ?? 'https://proxy-iniad-signage-api.imoken27.workers.dev';
    this.authHeader = makeBasicAuth(userId, password);
  }

  private makeRequestUrl(pathname: string): string {
    return new URL(pathname, this.baseProxyUrl).toString();
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを返す関数
  public async getContentByCardIDm(cardIDm: string): Promise<CardSignageLink> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const requestUrl = `/api/v1/signage/cards/${validatedCardIDm}`;

    const response = await fetchJson<CardSignageLinkApiResponse>(
      this.makeRequestUrl(requestUrl),
      this.authHeader,
    );
    const responseData = handleErrors<CardSignageLinkApiResponse>(response);

    const successInfo: StatusInfo = {
      status: 'success',
      description: 'Succeeded getting content by cardIDm',
    };
    return parseToCardSignageLink(successInfo, responseData);
  }

  //ユーザのカードIDmとサイネージで表示するコンテンツの紐づけの一覧を返す関数
  public async getAllCardIDmAndContentList(): Promise<AllCardSignageLinks> {
    const requestUrl = '/api/v1/signage/cards';

    const response = await fetchJson<AllCardSignageLinksApiResponse>(
      this.makeRequestUrl(requestUrl),
      this.authHeader,
    );
    const responseData = handleErrors<AllCardSignageLinksApiResponse>(response);

    const successInfo: StatusInfo = {
      status: 'success',
      description: 'Succeeded getting all cardIDm and content list',
    };
    return parseToAllCardSignageLinks(successInfo, responseData);
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを登録または更新する関数
  public async upsertContentByCardIDm(
    cardIDm: string,
    contentUrl: string,
    displaySeconds: number,
  ): Promise<CardSignageLink> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const data = { url: contentUrl, display_seconds: displaySeconds };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const requestUrl = `/api/v1/signage/cards/${validatedCardIDm}`;

    const response = await fetchJson<CardSignageLinkApiResponse>(
      this.makeRequestUrl(requestUrl),
      this.authHeader,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: config.headers,
      },
    );
    const responseData = handleErrors(response);

    const successInfo: StatusInfo = {
      status: 'success',
      description: 'Content registered or updated successfully by cardIDm',
    };

    return parseToCardSignageLink(successInfo, responseData);
  }

  //カードIDmに紐づくサイネージで表示するコンテンツを削除する関数
  public async deleteContentByCardIDm(cardIDm: string): Promise<DeleteCardSignageLink> {
    const validatedCardIDm = validateCardIDm(cardIDm);
    const requestUrl = `/api/v1/signage/cards/${validatedCardIDm}`;

    const response = await fetchJson<DeleteCardSignageLinkApiResponse>(
      this.makeRequestUrl(requestUrl),
      this.authHeader,
      {
        method: 'DELETE',
      },
    );

    const responseData = handleErrors<DeleteCardSignageLinkApiResponse>(response);

    const statusInfo: StatusInfo = {
      status: 'success',
      description: 'Content deleted successfully by cardIDm',
    };
    return parseToDeleteCardSignageLink(statusInfo, validatedCardIDm, responseData);
  }
}
