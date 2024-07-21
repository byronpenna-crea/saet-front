import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export enum StepStatus {
  VALIDATED = 'Validado',
  PENDING = 'Pendiente',
}

interface icolsType {
  field: string;
  header: string;
}
export interface iStep {
  name: string;
  status: StepStatus;
}
@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css'],
})
export class StatusTableComponent implements OnChanges {
  @Input() stepData: iStep[] = [];
  steps: Record<string, StepStatus>[] = [];
  cols: icolsType[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stepData']) {
      this.processStepData();
    }
  }

  private processStepData() {
    const stepsRow = this.stepData.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.name]: curr.status,
      }),
      {}
    );
    this.steps = [stepsRow];
    this.cols = this.stepData.map(step => ({
      field: step.name,
      header: step.name,
    }));
  }
}
