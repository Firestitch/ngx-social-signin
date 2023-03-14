import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { AppleSigninProvider, FacebookSigninProvider, FsSocialSigninModule, FS_SOCIAL_SIGNIN_CONFIG, GoogleSigninProvider } from '@firestitch/social-signin';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppMaterialModule } from './material.module';
import {
  ExamplesComponent,
} from './components';
import { AppComponent } from './app.component';
import { SiginButtonComponent } from './components/signin-button';


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
      provide: FS_SOCIAL_SIGNIN_CONFIG,
      useFactory: () => {
        return {
          providers: [
            new GoogleSigninProvider('46829300559-tjhftg5s3ih3mnuq53pm9540nn5s43r9.apps.googleusercontent.com'),
            new FacebookSigninProvider('197085513672785'),
            new AppleSigninProvider('197085513672785'),
          ],
        };
      },
    },
  ],
})
export class PlaygroundModule {
}
