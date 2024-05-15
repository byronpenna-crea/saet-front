import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {SaetTableComponent} from "../saet-table.component";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Saet table',
  component: SaetTableComponent,
  decorators:[
    moduleMetadata({
      imports: [StorybookPrimeNgModule,BrowserAnimationsModule]
    })
  ]
} as Meta
interface SampleInterface {
  Nie: string;
  primerNombre: string;
  primerApellido: string;
}
const Template: Story<SaetTableComponent<SampleInterface>> = (args: SaetTableComponent<SampleInterface>) => ({
  component: SaetTableComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  columns: [
    {key: "Nie", header: "NIE"},
    {key: "primerApellido", header: "Primer Apellido"},
    {key: "primerNombre", header: "Primer Nombre"},
  ],
  data: [
    { Nie: "1234",primerApellido: "Peña", primerNombre: "Byron" }
  ]
}
