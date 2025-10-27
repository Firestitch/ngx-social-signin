import {
  ChangeDetectionStrategy, Component, Input,
} from '@angular/core';

import { Provider } from '../../enums';


@Component({
    selector: 'fs-social-signin-logo',
    templateUrl: './social-signin-logo.component.html',
    styleUrls: ['./social-signin-logo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FsSocialSigninLogoComponent {

  @Input() public provider: Provider;
  @Input() public width = '20px';
  @Input() public theme = 'white';

}
