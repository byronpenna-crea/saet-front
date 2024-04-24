import {TabsComponent} from "../tabs.component";
import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TabItemComponent} from "../../tab-item/tab-item.component";

export default {
  title: "Information tab",
  component: TabsComponent,
  decorators: [
    moduleMetadata({
      declarations: [TabItemComponent],
      imports: [StorybookPrimeNgModule,BrowserAnimationsModule]
    })
  ]
} as Meta;

const Template: Story<TabsComponent> = (args: TabsComponent) => ({
  component: TabsComponent,
  props: args
});

export const Primary = Template.bind({});
Primary.args = {
  isActive: true,
  label: [
    "Nombre completo:",
    "NIE:",
    "Fecha de nacimiento:",
    "Dirección:",
    "Teléfono:",
    "Correo electrónico"
  ],
  value: [
    "Carlos José Mejía Hernandez",
    "1234567890",
    "23/12/2010",
    "Montes de San Bartolo 3, Pasaje 60, Casa 45, Soyapango, San Salvador",
    "7453-6789",
    "1234567890@clases.edu.sv"
  ],
  legend: "Datos personales del estudiante"
}
