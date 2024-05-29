import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-saet-tab',
  templateUrl: './saet-tab.component.html',
  styleUrls: ['./saet-tab.component.css']
})
export class SaetTabComponent {
  @Input() leyend:string = "";
}
