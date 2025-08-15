import { BlockConfig, ZodSchema } from '../../../../types';
import DatabaseNode from './DatabaseNode';
import DatabaseSettings from './DatabaseSettings';
import { DatabaseIcon } from '../../../icons/DatabaseIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const databaseBlockConfig: BlockConfig = {
  type: 'databaseNode',
  name: 'База данных',
  icon: DatabaseIcon,
  color: 'bg-slate-500',
  component: DatabaseNode,
  settingsComponent: DatabaseSettings,
  initialData: { 
    action: 'GET',
    key: '',
    value: '',
    resultVariable: 'db_data'
  },
  validationSchema: z.object({
    action: z.string(),
    key: z.string().min(1, 'Key cannot be empty'),
  }),
};
