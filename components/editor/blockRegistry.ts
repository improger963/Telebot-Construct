import { BlockConfig } from '../../types';
import { messageBlockConfig } from './blocks/MessageNode/config';
import { inputBlockConfig } from './blocks/InputNode/config';
import { conditionBlockConfig } from './blocks/ConditionNode/config';
import { startBlockConfig } from './blocks/StartNode/config';
import { inlineKeyboardBlockConfig } from './blocks/InlineKeyboardNode/config';
import { imageBlockConfig } from './blocks/ImageNode/config';
import { delayBlockConfig } from './blocks/DelayNode/config';
import { buttonInputBlockConfig } from './blocks/ButtonInputNode/config';
import { randomMessageBlockConfig } from './blocks/RandomMessageNode/config';
import { switchBlockConfig } from './blocks/SwitchNode/config';

// A map for quick access by block type, used in SettingsPanel and BotEditorPage
export const blockRegistry: Record<string, BlockConfig> = {
  [startBlockConfig.type]: startBlockConfig,
  [messageBlockConfig.type]: messageBlockConfig,
  [randomMessageBlockConfig.type]: randomMessageBlockConfig,
  [inputBlockConfig.type]: inputBlockConfig,
  [buttonInputBlockConfig.type]: buttonInputBlockConfig,
  [conditionBlockConfig.type]: conditionBlockConfig,
  [switchBlockConfig.type]: switchBlockConfig,
  [imageBlockConfig.type]: imageBlockConfig,
  [delayBlockConfig.type]: delayBlockConfig,
  [inlineKeyboardBlockConfig.type]: inlineKeyboardBlockConfig,
};

// An array for convenient iteration, used in the Sidebar
export const blockConfigs = Object.values(blockRegistry);