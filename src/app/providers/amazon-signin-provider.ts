import { Observable, of } from 'rxjs';

import { Provider } from '../enums';
import { SocialUser } from '../interfaces';

import { SigninProvider } from './signin-provider';

declare let amazon: any; let window: any;


export class AmazonSigninProvider extends SigninProvider {

  constructor(
    private _clientId: string,
    private _initOptions: any = {
      scope: 'profile',
      scope_data: {
        profile: { essential: false },
      },
      redirect_uri: location.origin,
    },
  ) {
    super();
  }

  public get PROVIDER(): Provider {
    return Provider.Amazon;
  }

  public get OAUTH_URL(): string {
    return 'https://www.amazon.com';
  }

  public get OAUTH_CLIENT_ID(): string {
    return this._clientId;
  }

  public getScopes(): string[] {
    return [
      'email',
      'public_profile',
    ];
  }

  public initialize(): Observable<void> {
    return of();
    // let amazonRoot = null;
    // if (document) {
    //   amazonRoot = document.createElement('div');
    //   amazonRoot.id = 'amazon-root';
    //   document.body.appendChild(amazonRoot);
    // }

    // window.onAmazonLoginReady = () => {
    //   amazon.Login.setClientId(this._clientId);
    // };

    // return this.loadScript(
    //   'amazon-login-sdk',
    //   'https://assets.loginwithamazon.com/sdk/na/login1.js',
    //   amazonRoot,
    // );
  }

  public getLoginStatus(): Observable<SocialUser> {
    return new Observable((observer) => {
      const token = this._retrieveToken();

      if (token) {
        amazon.Login.retrieveProfile(token, (response) => {
          if (response.success) {
            const user: SocialUser = {
              id: response.profile.CustomerId,
              name: response.profile.Name,
              email: response.profile.PrimaryEmail,
              response: response.profile,
            };

            observer.next(user);
            observer.complete();
          } else {
            observer.error(response.error);
          }
        });
      } else {
        observer.error(`No user is currently logged in with ${Provider.Amazon}`);
      }
    });
  }

  public signIn(signInOptions?: any): Observable<SocialUser> {
    const options = { ...this._initOptions, ...signInOptions };

    return new Observable((observer) => {
      amazon.Login.authorize(options, (authResponse) => {
        if (authResponse.error) {
          observer.error(authResponse.error);
        } else {
          amazon.Login.retrieveProfile(
            authResponse.access_token,
            (response) => {
              const user: SocialUser = {
                id: response.profile.CustomerId,
                name: response.profile.Name,
                email: response.profile.PrimaryEmail,
                response: response.profile,
                authToken: authResponse.access_token,
              };

              this._persistToken(authResponse.access_token);

              observer.next(user);
              observer.complete();
            },
          );
        }
      });
    });
  }

  public signOut(): Observable<void> {
    return new Observable((observer) => {
      amazon.Login.logout();

      this._clearToken();
      observer.next();
      observer.complete();
    });
  }

  public revokeAccessToken(): Observable<void> {
    return of();
  }

  public getAccessToken(): Observable<string> {
    return of('');
  }

  private _persistToken(token: string): void {
    localStorage.setItem(`${Provider.Amazon}_token`, token);
  }

  private _retrieveToken(): string {
    return localStorage.getItem(`${Provider.Amazon}_token`);
  }

  private _clearToken(): void {
    localStorage.removeItem(`${Provider.Amazon}_token`);
  }
}
