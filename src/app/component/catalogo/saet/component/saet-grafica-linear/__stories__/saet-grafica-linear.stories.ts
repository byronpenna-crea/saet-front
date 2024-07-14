import {moduleMetadata, Story} from "@storybook/angular";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {SaetGraficaLinearComponent} from "../saet-grafica-linear.component";

export default {
  title: "Grafica linear",
  component: SaetGraficaLinearComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, NgxChartsModule],
    }),
  ]
}
const Template: Story<SaetGraficaLinearComponent> = (args: SaetGraficaLinearComponent) => ({
  component: SaetGraficaLinearComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  multi: [
    {
      name: 'Casos abordados por sexo-femenino',
      series: [
        { name: 'ENE', value: 20 },
        { name: 'FEB', value: 30 },
        { name: 'MAR', value: 25 },
        { name: 'ABR', value: 40 },
        { name: 'MAY', value: 50 },
        { name: 'JUN', value: 70 },
        { name: 'JUL', value: 60 },
        { name: 'AGO', value: 65 },
        { name: 'SEP', value: 55 },
        { name: 'OCT', value: 70 },
        { name: 'NOV', value: 75 },
        { name: 'DIC', value: 80 }
      ]
    }
  ],
  view: [700, 400],
};
