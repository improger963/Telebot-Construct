import { BlockConfig, ZodSchema } from '../../../../types';
import ConditionNode from './ConditionNode';
import ConditionSettings from './ConditionSettings';
import { ConditionIcon } from '../../../icons/ConditionIcon';

// Mock Zod for schema definition - in a real app, you'd import 'z'
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};

export const conditionBlockConfig: BlockConfig = {
  type: 'conditionNode',
  name: 'Условие',
  icon: ConditionIcon,
  color: 'bg-brand-amber',
  component: ConditionNode,
  settingsComponent: ConditionSettings,
  initialData: { variable: 'userInput', value: 'да' },
  validationSchema: z.object({
    variable: z.string().min(1, 'Variable name cannot be empty'),
    value: z.string().min(1, 'Value cannot be empty'),
  }),
};