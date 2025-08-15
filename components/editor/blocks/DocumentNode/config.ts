import { BlockConfig, ZodSchema } from '../../../../types';
import DocumentNode from './DocumentNode';
import DocumentSettings from './DocumentSettings';
import { DocumentIcon } from '../../../icons/DocumentIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({ url: (_msg: string) => ({}) }) }),
};

export const documentBlockConfig: BlockConfig = {
  type: 'documentNode',
  name: 'Документ',
  icon: DocumentIcon,
  color: 'bg-brand-rose',
  component: DocumentNode,
  settingsComponent: DocumentSettings,
  initialData: { url: '', caption: '' },
  validationSchema: z.object({
    url: z.string().min(1, 'Document URL or file is required'),
    caption: z.string(),
  }),
};
