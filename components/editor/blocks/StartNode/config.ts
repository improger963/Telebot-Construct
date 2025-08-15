import { BlockConfig, ZodSchema } from '../../../../types';
import StartNode from './StartNode';
import StartSettings from './StartSettings';
import { StartIcon } from '../../../icons/StartIcon';

// Mock Zod for schema definition - in a real app, you'd import 'z'
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
};

export const startBlockConfig: BlockConfig = {
  type: 'startNode',
  name: 'Start',
  icon: StartIcon,
  color: 'bg-brand-green', // Not used in sidebar, but good for consistency
  component: StartNode,
  settingsComponent: StartSettings,
  initialData: { label: 'Start' },
  validationSchema: z.object({}),
};