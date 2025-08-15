import { BlockConfig, ZodSchema } from '../../../../types';
import StickerNode from './StickerNode';
import StickerSettings from './StickerSettings';
import { StickerIcon } from '../../../icons/StickerIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({ url: (_msg: string) => ({}) }) }),
};

export const stickerBlockConfig: BlockConfig = {
  type: 'stickerNode',
  name: 'Стикер',
  icon: StickerIcon,
  color: 'bg-brand-rose',
  component: StickerNode,
  settingsComponent: StickerSettings,
  initialData: { url: '' },
  validationSchema: z.object({
    url: z.string().min(1, 'Sticker URL or file is required'),
  }),
};
