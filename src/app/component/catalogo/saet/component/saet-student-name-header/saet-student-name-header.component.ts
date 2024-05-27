import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-saet-student-name-header',
  templateUrl: './saet-student-name-header.component.html',
  styleUrls: ['./saet-student-name-header.component.css']
})
export class SaetStudentNameHeaderComponent {
  @Input() name:string = "";
}
