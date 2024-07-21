import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.css'],
})
export class TabItemComponent {
  @Input() label: string = '';
  @Input() text: string = '';
  @Input() marginTop: string = '15px';
}
