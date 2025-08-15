import { BlockConfig, ZodSchema } from '../../../../types';
import DelayNode from './DelayNode';
import DelaySettings from './DelaySettings';
import { DelayIcon } from '../../../icons/DelayIcon';

// Mock Zod for schema definition
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  number: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const delayBlockConfig: BlockConfig = {
  type: 'delayNode',
  name: 'Delay',
  icon: DelayIcon,
  color: 'bg-gray-500',
  component: DelayNode,
  settingsComponent: DelaySettings,
  initialData: { seconds: 1 },
  validationSchema: z.object({
    seconds: z.number().min(0, 'Delay must be a positive number'),
  }),
};