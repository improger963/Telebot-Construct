import { BlockConfig, ZodSchema } from '../../../../types';
import MiniAppNode from './MiniAppNode';
import MiniAppSettings from './MiniAppSettings';
import { WebAppIcon } from '../../../icons/WebAppIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({ url: (_msg: string) => ({}) }) }),
};

export const miniAppBlockConfig: BlockConfig = {
  type: 'miniAppNode',
  name: 'Mini App',
  icon: WebAppIcon,
  color: 'bg-brand-blue',
  component: MiniAppNode,
  settingsComponent: MiniAppSettings,
  initialData: {
    url: 'https://yourapp.com/mini',
    buttonText: 'Открыть приложение',
    title: 'Наше крутое приложение'
  },
  validationSchema: z.object({
    url: z.string().min(1, 'URL is required').url("Must be a valid URL"),
    buttonText: z.string().min(1, 'Button text is required'),
    title: z.string().min(1, 'App title is required'),
  }),
};
