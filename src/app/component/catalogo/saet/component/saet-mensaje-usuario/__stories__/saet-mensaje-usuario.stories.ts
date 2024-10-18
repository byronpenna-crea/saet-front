import { SaetButtonComponent } from '../../saet-button/saet-button.component';
import { moduleMetadata, Story } from '@storybook/angular';
import { StorybookPrimeNgModule } from '../../../../../../storybook-config/storybook-prime-ng.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SaetMensajeUsuarioComponent } from '../saet-mensaje-usuario.component';

export default {
  title: 'saet-mensaje-usuario',
  component: SaetMensajeUsuarioComponent,
  decorators: [
    moduleMetadata({
      imports: [StorybookPrimeNgModule, BrowserAnimationsModule],
    }),
  ],
};
const Template: Story<SaetMensajeUsuarioComponent> = (
  args: SaetMensajeUsuarioComponent
) => ({
  component: SaetMensajeUsuarioComponent,
  props: {
    ...args,
  },
});
export const Primary = Template.bind({});
