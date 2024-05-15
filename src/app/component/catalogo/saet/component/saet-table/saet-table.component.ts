import { Component, Input, OnInit } from '@angular/core';

export interface TableColumn<T> {
  key: keyof T;
  header: string;
}

@Component({
  selector: 'app-saet-table',
  templateUrl: './saet-table.component.html',
  styleUrls: ['./saet-table.component.css']
})
export class SaetTableComponent<T> implements OnInit {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];

  ngOnInit() {
  }
}
