import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Provider } from '../../enums';
import { SocialUser } from '../../interfaces';
import { SigninProvider } from '../../providers';
import { FsSocialSignin } from '../../services';
import { MatAnchor } from '@angular/material/button';
import { FsSocialSigninLogoComponent } from '../social-signin-logo/social-signin-logo.component';


@Component({
    selector: 'fs-social-signin-button',
    templateUrl: './social-signin-button.component.html',
    styleUrls: ['./social-signin-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatAnchor, FsSocialSigninLogoComponent],
})
export class FsSocialSigninButtonComponent implements OnInit, OnDestroy {

  public signinProvider: SigninProvider;

  @Input() public provider: Provider;
  @Input() public width: string;
  @Input() public redirectUri: string | URL;
  @Input() public label = 'Continue with {provider}';

  @Output() public signedIn = new EventEmitter<SocialUser>();

  public buttonLabel;
  public backgroundColor: string;

  private _destroy$ = new Subject();

  constructor(
    private _signinService: FsSocialSignin,
  ){}

  public ngOnInit(): void {
    this.signinProvider = this._signinService.getSigninProvider(this.provider);
    this.buttonLabel = this.label.replace('{provider}', this.signinProvider.name);
    this.backgroundColor = this.signinProvider.color;
    this.signinProvider
      .initialize()
      .subscribe();
  }

  public get link(): string {
    if(!this.redirectUri) {
      this.redirectUri = new URL(window.location.origin);
    }

    if(this.redirectUri instanceof URL) {
      this.redirectUri = this.redirectUri.toString();
    }

    return this._signinService.getSigninProvider(this.provider)
      .getOAuthUrl(this.redirectUri)
      .url;
  }

  public clicked() {
    this._signinService.getSigninProvider(this.provider)
      .signIn()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((socialUser: SocialUser) => {
        this.signedIn.emit(socialUser);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
