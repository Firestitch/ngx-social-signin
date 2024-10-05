import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { OAuthUrl } from '../classes';
import { Provider } from '../enums';
import { SocialUser } from '../interfaces';

import { SigninProvider } from './signin-provider';

declare let FB: any;


export class FacebookSigninProvider extends SigninProvider {

  public static readonly PROVIDER = Provider.Facebook;

  private _requestOptions = {
    scope: 'email,public_profile',
    locale: 'en_US',
    fields: 'name,email,picture,first_name,last_name',
    version: 'v10.0',
  };

  constructor(private _facebookAppId: string, initOptions?: any) {
    super();

    this._requestOptions = {
      ...this._requestOptions,
      ...initOptions,
    };
  }

  public get PROVIDER(): Provider {
    return Provider.Facebook;
  }

  public get OAUTH_URL(): string {
    return 'https://www.facebook.com/v16.0/dialog/oauth';
  }

  public get OAUTH_CLIENT_ID(): string {
    return this._facebookAppId;
  }

  public initialize(): Observable<void> {
    return of();
    // return this.loadScript(
    //   FacebookSigninProvider.PROVIDER,
    //   `//connect.facebook.net/${this._requestOptions.locale}/sdk.js`,
    // )
    //   .pipe(
    //     tap(() => {
    //       FB.init({
    //         appId: this._facebookAppId,
    //         autoLogAppEvents: true,
    //         cookie: true,
    //         xfbml: true,
    //         version: this._requestOptions.version,
    //       });
    //     }),
    //   );
  }

  public getScopes(): string[] {
    return [
      'email',
      'public_profile',
    ];
  }

  public getLoginStatus(): Observable<SocialUser> {
    return new Observable((observer) => {
      FB.getLoginStatus((response: any) => {
        if (response.status === 'connected') {
          const authResponse = response.authResponse;
          FB.api(`/me?fields=${this._requestOptions.fields}`, (fbUser: any) => {
            const user: SocialUser = {
              id: fbUser.id,
              name: fbUser.name,
              email: fbUser.email,
              photoUrl:
              `https://graph.facebook.com/${
                fbUser.id
              }/picture?type=normal&access_token=${
                authResponse.accessToken}`,
              firstName: fbUser.first_name,
              lastName: fbUser.last_name,
              authToken: authResponse.accessToken,
              response: fbUser,
            };

            observer.next(user);
            observer.complete();
          });
        } else {
          observer.error(`No user is currently logged in with ${FacebookSigninProvider.PROVIDER}`);
        }
      });
    });
  }

  public signIn(signInOptions?: any): Observable<SocialUser> {
    const options = { ...this._requestOptions, ...signInOptions };

    return new Observable((observer) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          const authResponse = response.authResponse;
          FB.api(`/me?fields=${options.fields}`, (fbUser: any) => {
            const user: SocialUser = {
              id: fbUser.id,
              name: fbUser.name,
              email: fbUser.email,
              photoUrl: `https://graph.facebook.com/${fbUser.id}/picture?type=normal&access_token=${authResponse.accessToken}`,
              firstName: fbUser.first_name,
              lastName: fbUser.last_name,
              authToken: authResponse.accessToken,
              response: fbUser,
              provider: Provider.Facebook,
            };

            observer.next(user);
            observer.complete();
          });
        } else {
          observer.error('User cancelled login or did not fully authorize.');
        }
      }, options);
    });
  }

  public signOut(): Observable<void> {
    return new Observable((observer) => {
      FB.logout((response: any) => {
        observer.next(null);
        observer.complete();
      });
    });
  }

  public revokeAccessToken(): Observable<void> {
    return of();
  }

  public getAccessToken(): Observable<string> {
    return of('');
  }
}
