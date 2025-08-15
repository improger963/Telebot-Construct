import { BlockConfig, ZodSchema } from '../../../../types';
import CrmNode from './CrmNode';
import CrmSettings from './CrmSettings';
import { CrmIcon } from '../../../icons/CrmIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  array: (_element: any) => ({}),
};

export const crmBlockConfig: BlockConfig = {
  type: 'crmNode',
  name: 'Интеграция с CRM',
  icon: CrmIcon,
  color: 'bg-slate-500',
  component: CrmNode,
  settingsComponent: CrmSettings,
  initialData: { 
    mappings: [
        { crmField: 'Name', variableName: 'name' },
        { crmField: 'Email', variableName: 'email' },
        { crmField: 'Phone', variableName: 'phone' },
    ]
  },
  validationSchema: z.object({
    mappings: z.array(z.object({})),
  }),
};
