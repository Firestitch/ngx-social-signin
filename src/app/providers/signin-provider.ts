import { EventEmitter } from '@angular/core';

import { Observable, of } from 'rxjs';

import { OAuthUrl } from '../classes';
import { Provider } from '../enums';
import { SocialUser } from '../interfaces/social-user';


export abstract class SigninProvider {

  public abstract get color(): string;
  public abstract get valid(): boolean;

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
          observer.next(null);
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
      provider: this.provider,
      redirectUri,
    };

    if(state) {
      stateData.data = state;
    }

    return new OAuthUrl(
      this.oauthUrl,
      this.oauthClientId,
      redirectUri,
      btoa(JSON.stringify(stateData)),
      scope,
    );
  }

  public get name(): string {
    return this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
  }

  public abstract initialize(autoLogin?: boolean): Observable<void>;
  public abstract getLoginStatus(): Observable<SocialUser>;
  public abstract signIn(signInOptions?: object): Observable<SocialUser>;
  public abstract signOut(revoke?: boolean): Observable<void>;
  public abstract getAccessToken(): Observable<string>;
  public abstract revokeAccessToken(): Observable<void>;
  public abstract getScopes(): string[];
  public abstract get provider(): Provider;
  public abstract get oauthUrl(): string;
  public abstract get oauthClientId(): string;
}
