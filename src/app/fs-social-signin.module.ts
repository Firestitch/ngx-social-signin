import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsSocialSigninButtonComponent } from './components/social-signin-button/social-signin-button.component';
import { FsSocialSigninButtonsComponent } from './components';


@NgModule({
  imports: [
    CommonModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  declarations: [
    FsSocialSigninButtonComponent,
    FsSocialSigninButtonsComponent,
  ],
  exports: [
    FsSocialSigninButtonComponent,
    FsSocialSigninButtonsComponent,
  ],
})
export class FsSocialSigninModule {
}
