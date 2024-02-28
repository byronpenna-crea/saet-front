import { Component } from '@angular/core';
enum Status {
  VALIDATED = "Validado",
  PENDING = "Pendiente"
}
type StepRow = Record<string, Status>;
interface icolsType {
  field: string;
  header: string;
}
interface iStep {
  name: string;
  status: Status;
}
@Component({
  selector: 'app-status-table',
  templateUrl: './status-table.component.html',
  styleUrls: ['./status-table.component.css']
})
export class StatusTableComponent {

  /*steps:iStep[] = [
    {
      name: "COR especialista en psicologia",
      status: Status.VALIDATED
    },
    {
      name: "COR especialista en Pedagogía",
      status: Status.VALIDATED
    },
    {
      name: "COR especialista en Habla y lenguaje",
      status: Status.PENDING
    },
    {
      name: "Coordinador(a) del COR",
      status: Status.VALIDATED
    }
  ];*/
  steps: StepRow[];
  status:Status[] = [
    Status.VALIDATED,
    Status.VALIDATED,
    Status.PENDING,
    Status.VALIDATED,
  ];
  cols:icolsType[] = [];
  constructor() {
    const stepData: iStep[] = [
      { name: "COR especialista en psicologia", status: Status.VALIDATED },
      { name: "COR especialista en Pedagogía", status: Status.VALIDATED },
      { name: "COR especialista en Habla y lenguaje", status: Status.PENDING },
      { name: "Coordinador(a) del COR", status: Status.VALIDATED }
    ];

    // Crear un objeto único para steps que contenga cada estado como propiedad
    const stepsRow = stepData.reduce((acc, curr) => ({
      ...acc,
      [curr.name]: curr.status
    }), {});

    this.steps = [stepsRow];
    this.cols = stepData.map(step => ({ field: step.name, header: step.name }));
    console.log(this.steps);
  }
}
