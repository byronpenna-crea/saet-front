import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-saet-tab-buttons',
  templateUrl: './saet-tab-buttons.component.html',
  styleUrls: ['./saet-tab-buttons.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SaetTabButtonsComponent {
  @Input() readOnly: boolean = false;
}
