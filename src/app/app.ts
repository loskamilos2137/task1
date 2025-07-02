import { Component } from '@angular/core';
import { ElementsTableComponent } from './elements-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ElementsTableComponent],
  template: `
    <main>
      <app-elements-table></app-elements-table>
    </main>
  `,
  styles: [],
})
export class AppComponent {
  title = 'angular-signal-store-table';
}