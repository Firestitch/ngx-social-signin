export class OAuthUrl {

  private _responseType = 'code';

  constructor(
    private _oauthUrl: string,
    private _clientId: string,
    private _redirectUri: string,
    private _state: string,
    private _scope: string[],
  ) {}

  public get url(): string {
    const url = new URL(this._oauthUrl);

    url.searchParams.append('client_id', this._clientId);
    url.searchParams.append('redirect_uri', this._redirectUri);

    if(this._scope) {
      url.searchParams.append('scope', this._scope.join(' '));
    }

    url.searchParams.append('response_type', this._responseType);
    url.searchParams.append('state', this._state);

    return url.toString();
  }

}
