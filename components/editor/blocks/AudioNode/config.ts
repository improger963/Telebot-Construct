import { BlockConfig, ZodSchema } from '../../../../types';
import AudioNode from './AudioNode';
import AudioSettings from './AudioSettings';
import { AudioIcon } from '../../../icons/AudioIcon';

// Mock Zod for schema definition
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({ url: (_msg: string) => ({}) }) }),
};

export const audioBlockConfig: BlockConfig = {
  type: 'audioNode',
  name: 'Аудио',
  icon: AudioIcon,
  color: 'bg-brand-rose',
  component: AudioNode,
  settingsComponent: AudioSettings,
  initialData: { url: '' },
  validationSchema: z.object({
    url: z.string().min(1, 'Audio URL or file is required'),
  }),
};
