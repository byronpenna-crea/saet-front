import {RichtextComponent} from "../richtext.component";
import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {StatusTableComponent} from "../../status-table/status-table.component";

export default {
  title: 'Richtext',
  component: RichtextComponent,
  decorators:[
    moduleMetadata({
      imports: [StorybookPrimeNgModule]
    })
  ]
} as Meta;
const Template: Story<RichtextComponent> = (args: RichtextComponent) => ({
  component: RichtextComponent,
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  text: "textooooo "
}
