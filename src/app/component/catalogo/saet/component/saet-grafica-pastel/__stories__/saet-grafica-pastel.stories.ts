
import {SaetGraficaPastelComponent} from "../saet-grafica-pastel.component";
import {moduleMetadata, Story} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from "@swimlane/ngx-charts";

export default {
  title: "Grafica pastel",
  component: SaetGraficaPastelComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, NgxChartsModule],
    }),
  ]
}
const Template: Story<SaetGraficaPastelComponent> = (args: SaetGraficaPastelComponent) => ({
  component: SaetGraficaPastelComponent,
  props: args,
});

export const Default = Template.bind({});
export const moreData = Template.bind({});
Default.args = {
  single: [
    { name: 'Estudiantes', value: 215 },
    { name: 'Padres', value: 72 },
    { name: 'Docentes', value: 241 }
  ],

  view: [700, 400],
  gradient: false,
  showLegend: false
};

moreData.args = {
  single: [
    { name: 'Ahuachapán', value: 15 },
    { name: 'Usulután', value: 13 },
    { name: 'Sonsonate', value: 8 },
    { name: 'Cuscatlán', value: 3 },

    { name: 'La Paz', value: 3 },
    { name: 'La Unión', value: 3 },
    { name: 'La Libertad', value: 3 },
    { name: 'San Vicente', value: 3 },
    { name: 'Morazán', value: 3 },
    { name: 'San Miguel', value: 3 },
    { name: 'San Salvador', value: 3 },
    { name: 'Santa Ana', value: 3 },
    { name: 'Chalatenango', value: 3 },
    { name: 'Cabañas', value: 3 },
  ],

  view: [700, 400],
  gradient: false,
  showLegend: false
};

