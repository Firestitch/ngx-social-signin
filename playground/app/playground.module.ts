import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsStoreModule } from '@firestitch/store';

import { of } from 'rxjs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import {
  AppleSigninProvider, FacebookSigninProvider,
  FsSocialSignin,
  FsSocialSigninModule,
  GoogleSigninProvider,
  SocialSigninConfig,
} from '../../src/public_api';

import { AppComponent } from './app.component';
import {
  ExamplesComponent,
} from './components';
import { SiginButtonComponent } from './components/signin-button';
import { AppMaterialModule } from './material.module';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsStoreModule,
    FsExampleModule.forRoot(),
    FsSocialSigninModule,
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    SiginButtonComponent,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (socialSignin: FsSocialSignin) => {
        return () => {
          socialSignin.init({
            providers: [
              new GoogleSigninProvider('46829300559-tjhftg5s3ih3mnuq53pm9540nn5s43r9.apps.googleusercontent.com'),
              new FacebookSigninProvider('197085513672785'),
              new AppleSigninProvider('197085513672785'),
            ],
          } as SocialSigninConfig);

          return of(null);
        };
      },
      deps: [FsSocialSignin],
      multi: true,
    },
  ],
})
export class PlaygroundModule {
}
