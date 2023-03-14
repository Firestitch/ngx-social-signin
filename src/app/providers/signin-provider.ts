import { EventEmitter } from '@angular/core';

import { Observable, of } from 'rxjs';

import { SocialUser } from '../interfaces/social-user';
import { Provider } from '../enums';
import { OAuthUrl } from '../classes';


export abstract class SigninProvider {

  public readonly changeUser?: EventEmitter<SocialUser>;

  protected _initialized = false;

  public refreshToken?(): Observable<SocialUser>;

  public loadScript(
    id: string,
    src: string,
    parentElement = null,
  ): Observable<void> {

    if(this._initialized) {
      return of();
    }

    return new Observable((observer) => {
      // get document if platform is only browser
      if (typeof document !== 'undefined' && !document.getElementById(id)) {
        const signInJS = document.createElement('script');

        signInJS.async = true;
        signInJS.src = src;
        signInJS.onload = () => {
          this._initialized = true;
          observer.next();
          observer.complete();
        };
        signInJS.onerror = () => {
          observer.error();
        };

        if (!parentElement) {
          parentElement = document.head;
        }

        parentElement.appendChild(signInJS);
      }
    });
  }

  public getOAuthUrl(redirectUri: string, state?: string, scope?: string[]): OAuthUrl {
    scope = scope ? scope : this.getScopes();

    const stateData: any = {
      provider: this.PROVIDER,
      redirectUri,
    };

    if(state) {
      stateData.data = state;
    }

    return new OAuthUrl(
      this.OAUTH_URL,
      this.OAUTH_CLIENT_ID,
      redirectUri,
      btoa(JSON.stringify(stateData)),
      scope,
    );
  }

  public get name(): string {
    return this.PROVIDER.charAt(0).toUpperCase() + this.PROVIDER.slice(1);
  }

  public abstract initialize(autoLogin?: boolean): Observable<void>;
  public abstract getLoginStatus(): Observable<SocialUser>;
  public abstract signIn(signInOptions?: object): Observable<SocialUser>;
  public abstract signOut(revoke?: boolean): Observable<void>;
  public abstract getAccessToken(): Observable<string>;
  public abstract revokeAccessToken(): Observable<void>;
  public abstract getScopes(): string[];
  public abstract get PROVIDER(): Provider;
  public abstract get OAUTH_URL(): string;
  public abstract get OAUTH_CLIENT_ID(): string;
}
