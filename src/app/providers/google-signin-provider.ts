import { EventEmitter } from '@angular/core';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, skip, take, tap } from 'rxjs/operators';

import { OAuthUrl } from '../classes';
import { Provider } from '../enums';
import { SocialUser } from '../interfaces';

import { SigninProvider } from './signin-provider';

declare let google: any;

export interface GoogleInitOptions {
  /**
   * enables the One Tap mechanism, and makes auto-login possible
   */
  oneTapEnabled?: boolean;
  /**
   * list of permission scopes to grant in case we request an access token
   */
  scopes?: string | string[];
 /**
  * This attribute sets the DOM ID of the container element. If it's not set, the One Tap prompt is displayed in the top-right corner of the window.
  */
  prompt_parent_id?: string;

  /**
   * Optional, defaults to 'select_account'.
   * A space-delimited, case-sensitive list of prompts to present the
   * user.
   * Possible values are:
   * empty string The user will be prompted only the first time your
   *     app requests access. Cannot be specified with other values.
   * 'none' Do not display any authentication or consent screens. Must
   *     not be specified with other values.
   * 'consent' Prompt the user for consent.
   * 'select_account' Prompt the user to select an account.
   */
  prompt?: '' | 'none' | 'consent' | 'select_account';
}

const defaultInitOptions: GoogleInitOptions = {
  oneTapEnabled: true,
};

export class GoogleSigninProvider extends SigninProvider {

  public readonly changeUser = new EventEmitter<SocialUser | null>();

  private readonly _socialUser = new BehaviorSubject<SocialUser | null>(null);
  private readonly _accessToken = new BehaviorSubject<string | null>(null);
  private readonly _receivedAccessToken = new EventEmitter<string>();
  private _tokenClient;

  constructor(
    private _clientId: string,
    private readonly _initOptions?: GoogleInitOptions,
  ) {
    super();

    // this._initOptions = { ...defaultInitOptions, ...this._initOptions };

    // // emit changeUser events but skip initial value from behaviorSubject
    // this._socialUser.pipe(skip(1)).subscribe(this.changeUser);

    // // emit receivedAccessToken but skip initial value from behaviorSubject
    // this._accessToken.pipe(skip(1)).subscribe(this._receivedAccessToken);
  }

  public get PROVIDER(): Provider {
    return Provider.Google;
  }

  public initialize(autoLogin?: boolean): Observable<void> {
    return of();
    // return this.loadScript(
    //   Provider.Google,
    //   'https://accounts.google.com/gsi/client',
    // )
    //   .pipe(
    //     tap(() => {
    //       google.accounts.id.initialize({
    //         client_id: this._clientId,
    //         auto_select: autoLogin,
    //         callback: ({ credential }) => {
    //           const socialUser = this._createSocialUser(credential);
    //           this._socialUser.next(socialUser);

    //         },
    //         prompt_parent_id: this._initOptions?.prompt_parent_id,
    //         itp_support: this._initOptions.oneTapEnabled,
    //       });

    //       if (this._initOptions.oneTapEnabled) {
    //         this._socialUser
    //           .pipe(filter((user) => user === null))
    //           .subscribe(() => {
    //             google.accounts.id.prompt();
    //           });
    //       }

    //       if (this._initOptions.scopes) {
    //         const scope =
    //               this._initOptions.scopes instanceof Array
    //                 ? this._initOptions.scopes.filter((s) => s).join(' ')
    //                 : this._initOptions.scopes;

    //         this._tokenClient = google.accounts.oauth2.initTokenClient({
    //           client_id: this._clientId,
    //           scope,
    //           prompt : this._initOptions.prompt,
    //           callback: (tokenResponse) => {
    //             if (tokenResponse.error) {
    //               this._accessToken.error({
    //                 code: tokenResponse.error,
    //                 description: tokenResponse.error_description,
    //                 uri: tokenResponse.error_uri,
    //               });
    //             } else {
    //               this._accessToken.next(tokenResponse.access_token);
    //             }
    //           },
    //         });
    //       }
    //     }),
    //   );
  }

  public get OAUTH_URL(): string {
    return 'https://accounts.google.com/o/oauth2/v2/auth';
  }

  public get OAUTH_CLIENT_ID(): string {
    return this._clientId;
  }

  public getScopes(): string[] {
    return [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
    ];
  }

  public getLoginStatus(): Observable<SocialUser> {
    return new Observable((observer) => {
      if (this._socialUser.value) {
        observer.next(this._socialUser.value);
        observer.complete();
      } else {
        observer.error(`No user is currently logged in with ${Provider.Google}`);
      }
    });
  }

  public refreshToken(): Observable<SocialUser> {
    return new Observable((observer) => {
      google.accounts.id.revoke(this._socialUser.value.id, (response) => {
        if (response.error) {
          observer.error(response.error);
        } else {
          observer.next(this._socialUser.value);
          observer.complete();
        }
      });
    });
  }

  public getAccessToken(): Observable<string> {
    if (!this._tokenClient) {
      if (this._socialUser.value) {
        return throwError('No token client was instantiated, you should specify some scopes.');
      }

      return throwError('You should be logged-in first.');

    }

    this._tokenClient.requestAccessToken({
      hint: this._socialUser.value?.email,
    });

    return this._receivedAccessToken
      .pipe(
        take(1),
      );
  }

  public revokeAccessToken(): Observable<void> {
    return new Observable((observer) => {
      if (!this._tokenClient) {
        observer.error('No token client was instantiated, you should specify some scopes.');
      } else if (!this._accessToken.value) {
        observer.error('No access token to revoke');
      } else {
        google.accounts.oauth2.revoke(this._accessToken.value, () => {
          this._accessToken.next(null);
          observer.next();
          observer.complete();
        });
      }
    });
  }

  public signIn(): Observable<SocialUser> {
    google.accounts.id.prompt((notification) => {
      debugger;
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {

      }
    });


    return throwError(
      'You should not call this method directly for Google, use "<asl-google-signin-button>" wrapper ' +
        'or generate the button yourself with "google.accounts.id.renderButton()" ' +
        '(https://developers.google.com/identity/gsi/web/guides/display-button#javascript)',
    );
  }

  public signOut(): Observable<void> {
    google.accounts.id.disableAutoSelect();
    this._socialUser.next(null);

    return of();
  }

  private _createSocialUser(idToken: string): SocialUser {
    const payload = this._decodeJwt(idToken);

    return {
      idToken,
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      photoUrl: payload.picture,
      firstName: payload['given_name'],
      lastName: payload['family_name'],
    };

  }

  private _decodeJwt(idToken: string): Record<string, string | undefined> {
    const base64Url = idToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(function (c) {
          return `%${  (`00${  c.charCodeAt(0).toString(16)}`).slice(-2)}`;
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  }
}
