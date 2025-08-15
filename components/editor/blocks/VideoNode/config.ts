import { BlockConfig, ZodSchema } from '../../../../types';
import VideoNode from './VideoNode';
import VideoSettings from './VideoSettings';
import { VideoIcon } from '../../../icons/VideoIcon';

// Mock Zod for schema definition
const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({ url: (_msg: string) => ({}) }) }),
};

export const videoBlockConfig: BlockConfig = {
  type: 'videoNode',
  name: 'Видео',
  icon: VideoIcon,
  color: 'bg-brand-rose',
  component: VideoNode,
  settingsComponent: VideoSettings,
  initialData: { url: '', caption: '' },
  validationSchema: z.object({
    url: z.string().min(1, 'Video URL or file is required'),
    caption: z.string(),
  }),
};
