import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-saet-loading',
  templateUrl: './saet-loading.component.html',
  styleUrls: ['./saet-loading.component.css']
})
export class SaetLoadingComponent {
  @Input() isLoading:boolean = true;

}
