
import {StatusTableComponent, StepStatus} from '../status-table.component';
import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../storybook-config/storybook-prime-ng.module";

export default {
  title: 'Status table',
  component: StatusTableComponent,
  argTypes: {
    stepData: { control: 'array' }
  },
  decorators:[
    moduleMetadata({
      imports: [StorybookPrimeNgModule]
    })
  ]
} as Meta;
const Template: Story<StatusTableComponent> = (args: StatusTableComponent) => ({
  component: StatusTableComponent,
  props: args,
});
export const Primary = Template.bind({});
Primary.args = {
  stepData: [
    { name: "XX", status: StepStatus.VALIDATED },
    { name: "COR especialista en Pedagogía", status: StepStatus.VALIDATED },
    { name: "COR especialista en Habla y lenguaje", status: StepStatus.PENDING },
    { name: "Coordinador(a) del COR", status: StepStatus.VALIDATED }
  ]
}
