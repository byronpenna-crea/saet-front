import {RichtextComponent} from "../../richtext/richtext.component";
import {Meta, moduleMetadata, Story} from "@storybook/angular";
import {StorybookPrimeNgModule} from "../../../../../../storybook-config/storybook-prime-ng.module";
import {SaetAgendarEvaluacionComponent} from "../saet-agendar-evaluacion.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export default {
  title: 'Agendar-evaluacion',
  component: SaetAgendarEvaluacionComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
} as Meta;

const Template: Story<SaetAgendarEvaluacionComponent> = (args: SaetAgendarEvaluacionComponent) => ({
  component: SaetAgendarEvaluacionComponent,
  props: args,
});

export const Primary = Template.bind({});
