import { environment } from '../../../../../src/app/environments/environment';
import { StatusTableComponent } from '../status-table.component';

export default {
  title: 'Status table',
  component: StatusTableComponent,
};

export const Primary = () => ({
  component: StatusTableComponent,
  props: {

  },
});
