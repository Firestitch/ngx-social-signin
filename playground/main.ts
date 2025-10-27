import { enableProdMode, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FsSocialSignin, GoogleSigninProvider, FacebookSigninProvider, AppleSigninProvider, SocialSigninConfig } from '../src/public_api';
import { of } from 'rxjs';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, FsLabelModule, FsStoreModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), ToastrModule.forRoot({ preventDuplicates: true })),
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
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

