import { BlockConfig, ZodSchema } from '../../../../types';
import ImageNode from './ImageNode';
import ImageSettings from './ImageSettings';
import { ImageIcon } from '../../../icons/ImageIcon';

// Mock Zod for schema definition
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({ url: (_msg: string) => ({}) }) }),
};

export const imageBlockConfig: BlockConfig = {
  type: 'imageNode',
  name: 'Image',
  icon: ImageIcon,
  color: 'bg-brand-rose',
  component: ImageNode,
  settingsComponent: ImageSettings,
  initialData: { url: '', caption: '' },
  validationSchema: z.object({
    url: z.string().min(1, 'Image URL or file is required').url("Must be a valid URL"),
    caption: z.string(),
  }),
};