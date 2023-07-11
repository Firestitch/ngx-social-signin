import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Provider } from '../enums';
import { FS_SOCIAL_SIGNIN_CONFIG } from '../injectors';
import { SigninProvider } from '../providers/signin-provider';
import { SocialSigninConfig } from '../interfaces';


@Injectable({ providedIn: 'root' })
export class FsSocialSignin {

  private _signinProviders: Map<Provider, SigninProvider> = new Map();

  constructor(
    @Inject(FS_SOCIAL_SIGNIN_CONFIG) private _config: SocialSigninConfig,
  ) {
    this._initialize(this._config);
  }

  public get hasOAuthResponse(): boolean {
    return !!this.oAuthResponse;
  }

  public get oAuthResponse(): { provider: string; code: string; redirectUri: string } {
    const url = new URL(window.location.href);

    if(url.searchParams.has('code')) {
      try {

        const state = JSON.parse(atob(url.searchParams.get('state'))) || {};
        const provider = state.provider;

        if(provider) {
          return {
            ...state,
            code: url.searchParams.get('code'),
          };
        }
      } catch(e) {}
    }

    return null;
  }

  public get signinProviders(): SigninProvider[] {
    return Array.from(this._signinProviders.values());
  }

  public get hasSigninProviders(): boolean {
    return this.signinProviders.length !== 0;
  }

  public getSigninProvider(provider: Provider): SigninProvider {
    if(!this._signinProviders.has(provider)) {
      throw new Error(`Failed to get the ${provider} signin provider`);
    }

    return this._signinProviders.get(provider);
  }

  public initialize(provider: Provider): Observable<void> {
    return this
      .getSigninProvider(provider)
      .initialize();
  }

  // /**
  //  * A method used to sign out the currently loggen in user.
  //  *
  //  * @param revoke Optional parameter to specify whether a hard sign out is to be performed
  //  * @returns A `Promise` that resolves if the operation is successful, rejects otherwise
  //  */
  // public signOut(revoke: boolean = false): Observable<void> {
  //   if (!this._user) {
  //     return throwError(FsSocialSignin.ERR_NOT_LOGGED_IN);
  //   }

  //   return this._providers.get(this._user.provider)
  //     .signOut(revoke)
  //     .pipe(
  //       finalize(() => {
  //         this._setUser(null);
  //       }),
  //     );
  // }

  // private _setUser(user: SocialUser | null, provider?: Provider) {
  //   if (user && provider) {
  //     user.provider = provider;
  //   }

  //   this._user = user;
  //   this._authState.next(user);
  //}

  private _initialize(config: SocialSigninConfig) {
    config.providers
      .forEach((signinProvider: SigninProvider) => {
        this._signinProviders.set(
          signinProvider.PROVIDER,
          signinProvider,
        );
      });
  }
}
