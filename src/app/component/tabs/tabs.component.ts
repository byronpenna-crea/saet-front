import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
export interface TabRowItem {
  label: string;
  value: string;
}
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnChanges{
  @Input() label:string[] = [];
  @Input() value:string[] = [];
  @Input() legend:string = "";
  @Input() background:string = "red";
  tabRow: TabRowItem[] = []

  ngOnChanges(changes: SimpleChanges) {
    this.fillTabRow();
  }

  private fillTabRow():void {
    this.tabRow = [];
    const maxLength = Math.max(this.label.length, this.value.length);
    for (let i = 0; i < maxLength; i++){
      this.tabRow.push({
        label: this.label[i] || '',
        value: this.value[i] || ''
      })
    }
  }
}
