import { Component } from '@angular/core';
import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { SiginButtonComponent } from '../signin-button/signin-button.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, SiginButtonComponent]
})
export class ExamplesComponent {
  public config = environment;
}
