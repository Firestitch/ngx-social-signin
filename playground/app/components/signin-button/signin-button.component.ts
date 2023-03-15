import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FsMessage } from '@firestitch/message';
import { FsSocialSignin, Provider, Providers } from '@firestitch/social-signin';


@Component({
  selector: 'app-signin-button',
  templateUrl: './signin-button.component.html',
  styleUrls: ['./signin-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiginButtonComponent {

  public Provider = Provider;
  public Providers = Providers;

  constructor(
    private _socialSignin: FsSocialSignin,
    private _message: FsMessage,
  ) {
    if(this._socialSignin.hasOAuthResponse){
      const response = this._socialSignin.oAuthResponse;
      this._message.success(`The ${response.provider} OAuth code has been dected ${response.code}`);
    }
  }

}
