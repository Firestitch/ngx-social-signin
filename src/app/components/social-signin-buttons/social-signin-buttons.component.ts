import {
  ChangeDetectionStrategy, Component, Input, OnInit,
} from '@angular/core';


import { SigninProvider } from '../../providers';
import { FsSocialSignin } from '../../services';


@Component({
  selector: 'fs-social-signin-buttons',
  templateUrl: './social-signin-buttons.component.html',
  styleUrls: ['./social-signin-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsSocialSigninButtonsComponent implements OnInit {

  @Input() public width: string;
  @Input() public redirectUri: string | URL;

  public signinProviders: SigninProvider[];

  constructor(
    private _signinService: FsSocialSignin,
  ){}

  public ngOnInit(): void {
    this.signinProviders = this._signinService.signinProviders;
  }

}
