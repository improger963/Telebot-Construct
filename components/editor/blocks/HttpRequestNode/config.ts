import { BlockConfig, ZodSchema } from '../../../../types';
import HttpRequestNode from './HttpRequestNode';
import HttpRequestSettings from './HttpRequestSettings';
import { WebhookIcon } from '../../../icons/WebhookIcon';

const z = {
  object: (shape: any): ZodSchema => ({ _def: { shape }, parse: (data: any) => data }),
  string: (): any => ({ min: (_num: number, _msg: string) => ({ url: (_msg: string) => ({}) }) }),
  array: (_element: any) => ({}),
};

export const httpRequestBlockConfig: BlockConfig = {
  type: 'httpRequestNode',
  name: 'HTTP Запрос',
  icon: WebhookIcon,
  color: 'bg-slate-500',
  component: HttpRequestNode,
  settingsComponent: HttpRequestSettings,
  initialData: { 
    method: 'GET',
    url: 'https://api.example.com/',
    headers: [{key: 'Content-Type', value: 'application/json'}],
    body: '',
    responseVariable: 'api_response'
  },
  validationSchema: z.object({
    url: z.string().min(1, 'URL is required').url("Must be a valid URL"),
    method: z.string(),
  }),
};
