import { moduleMetadata, Story } from '@storybook/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {
  Direction,
  SaetGraficaBarrasComponent,
} from '../saet-grafica-barras.component';
import { ButtonStyle } from '../../saet-button/saet-button.component';

export default {
  title: 'Grafica barras',
  component: SaetGraficaBarrasComponent,
  decorators: [
    moduleMetadata({
      imports: [BrowserAnimationsModule, NgxChartsModule],
    }),
  ],
  argTypes: {
    mode: {
      control: 'select',
      options: {
        Vertical: Direction.VERTICAL,
        Landscape: Direction.LANDSCAPE,
      },
    },
  },
};
const Template: Story<SaetGraficaBarrasComponent> = (
  args: SaetGraficaBarrasComponent
) => ({
  component: SaetGraficaBarrasComponent,
  props: args,
});
export const Default = Template.bind({});
export const Vertical = Template.bind({});
export const Horizontal = Template.bind({});

Default.args = {
  single: [
    { name: 'La Paz', value: 30 },
    { name: 'Cuscatlán', value: 40 },
    { name: 'Morazán', value: 40 },
    { name: 'La Unión', value: 50 },
    { name: 'Santa Ana', value: 60 },
    { name: 'San Vicente', value: 50 },
    { name: 'San Miguel', value: 50 },
    { name: 'Chalatenango', value: 30 },
    { name: 'Cabañas', value: 50 },
    { name: 'Sonsonate', value: 60 },
    { name: 'La Libertad', value: 60 },
    { name: 'San Salvador', value: 80 },
  ],
  yAxisLabel: '',
  xAxisLabel: '',
  view: [700, 400],
  gradient: false,
  showLegend: true,
  colorScheme: '#5AA454',
  mode: Direction.VERTICAL,
};
Horizontal.args = {
  single: [
    { name: 'La Paz', value: 30 },
    { name: 'Cuscatlán', value: 40 },
    { name: 'Morazán', value: 40 },
    { name: 'La Unión', value: 50 },
    { name: 'Santa Ana', value: 60 },
    { name: 'San Vicente', value: 50 },
    { name: 'San Miguel', value: 50 },
    { name: 'Chalatenango', value: 30 },
    { name: 'Cabañas', value: 50 },
    { name: 'Sonsonate', value: 60 },
    { name: 'La Libertad', value: 60 },
    { name: 'San Salvador', value: 80 },
  ],
  yAxisLabel: '',
  xAxisLabel: '',
  view: [700, 400],
  gradient: false,
  showLegend: true,
  colorScheme: '#5AA454',
  mode: Direction.LANDSCAPE,
};
Vertical.args = {
  single: [
    { name: 'La Paz', value: 30 },
    { name: 'Cuscatlán', value: 40 },
    { name: 'Morazán', value: 40 },
    { name: 'La Unión', value: 50 },
    { name: 'Santa Ana', value: 60 },
    { name: 'San Vicente', value: 50 },
    { name: 'San Miguel', value: 50 },
    { name: 'Chalatenango', value: 30 },
    { name: 'Cabañas', value: 50 },
    { name: 'Sonsonate', value: 60 },
    { name: 'La Libertad', value: 60 },
    { name: 'San Salvador', value: 80 },
  ],
  yAxisLabel: '',
  xAxisLabel: '',
  view: [700, 400],
  gradient: false,
  showLegend: true,
  colorScheme: '#5AA454',
  mode: Direction.VERTICAL,
};
