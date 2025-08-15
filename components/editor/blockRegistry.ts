import { BlockConfig } from '../../types';
import { messageBlockConfig } from './blocks/MessageNode/config';
import { inputBlockConfig } from './blocks/InputNode/config';
import { conditionBlockConfig } from './blocks/ConditionNode/config';
import { startBlockConfig } from './blocks/StartNode/config';

// A map for quick access by block type, used in SettingsPanel and BotEditorPage
export const blockRegistry: Record<string, BlockConfig> = {
  [startBlockConfig.type]: startBlockConfig,
  [messageBlockConfig.type]: messageBlockConfig,
  [inputBlockConfig.type]: inputBlockConfig,
  [conditionBlockConfig.type]: conditionBlockConfig,
};

// An array for convenient iteration, used in the Sidebar
export const blockConfigs = Object.values(blockRegistry);
