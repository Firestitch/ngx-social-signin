import { Observable, of } from 'rxjs';

import { Provider } from '../enums';
import { SocialUser } from '../interfaces';

import { SigninProvider } from './signin-provider';


export class AppleSigninProvider extends SigninProvider {

  constructor(
    private _clientId: string,
  ) {
    super();
  }

  public get valid(): boolean {
    return !!this._clientId;
  }

  public get color(): string {
    return '#080808';
  }

  public get provider(): Provider {
    return Provider.Apple;
  }

  public get oauthUrl(): string {
    return 'https://appleid.apple.com/auth/authorize';
  }

  public get oauthClientId(): string {
    return this._clientId;
  }

  public getScopes(): string[] {
    return [
      'email',
      'openid',
    ];
  }

  public initialize(): Observable<void> {
    return of();
  }

  public getLoginStatus(): Observable<SocialUser> {
    return of(null);
  }

  public signIn(): Observable<SocialUser> {
    return of(null);
  }

  public signOut(): Observable<void> {
    return of();
  }

  public revokeAccessToken(): Observable<void> {
    return of();
  }

  public getAccessToken(): Observable<string> {
    return of('');
  }
}
