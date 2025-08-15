import { BlockConfig, ZodSchema } from '../../../../types';
import InputNode from './InputNode';
import InputSettings from './InputSettings';
import { InputIcon } from '../../../icons/InputIcon';

// Mock Zod for schema definition - in a real app, you'd import 'z'
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({}) }),
};


export const inputBlockConfig: BlockConfig = {
  type: 'inputNode',
  name: 'Text Input',
  icon: InputIcon,
  color: 'bg-brand-purple',
  component: InputNode,
  settingsComponent: InputSettings,
  initialData: { question: 'What is your name?', variableName: 'name' },
  validationSchema: z.object({
    question: z.string().min(1, 'Question cannot be empty'),
    variableName: z.string().min(1, 'Variable name cannot be empty'),
  }),
};