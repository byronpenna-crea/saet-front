import { Component, Input, ViewEncapsulation } from '@angular/core';

export interface ITabButton {
  text: string;
  href?: string;
  readOnly: boolean;
  testId?: string;
  selected: boolean;
  onClick?: () => void;
}
@Component({
  selector: 'app-saet-tab-buttons',
  templateUrl: './saet-tab-buttons.component.html',
  styleUrls: ['./saet-tab-buttons.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SaetTabButtonsComponent {
  @Input() readOnly: boolean = false;
  @Input() tabs: ITabButton[] = [];

  handleClick(event: Event, tab: ITabButton) {
    if (tab.readOnly || tab.onClick) {
      event.preventDefault();
    }

    if (tab.onClick) {
      tab.onClick();
    }
  }
}
