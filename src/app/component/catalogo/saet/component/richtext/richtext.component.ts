import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  styleUrls: ['./richtext.component.css']
})
export class RichtextComponent implements OnChanges{
  @Input() text: string = "";

  ngOnChanges(changes: SimpleChanges) {
    if (changes["text"]) {
      console.log('Text has changed:', changes["text"].currentValue);
    }
  }
}
