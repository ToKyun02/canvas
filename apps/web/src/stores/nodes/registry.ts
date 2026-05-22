import type { NodeDefinition } from './types';
import { textNodeDefinition } from './text/definition';

export const NODE_DEFINITIONS = {
  text: textNodeDefinition,
} as const satisfies Record<string, NodeDefinition>;

export type NodeType = keyof typeof NODE_DEFINITIONS;
export type NodeTool = (typeof NODE_DEFINITIONS)[NodeType]['tool'];

export const TOOL_TO_NODE: Record<NodeTool, NodeDefinition> = {
  text: textNodeDefinition,
};

export function getNodeDefinition(tool: NodeTool): NodeDefinition {
  const definition = TOOL_TO_NODE[tool];
  if (!definition) {
    throw new Error(`Unknown node tool: ${tool}`);
  }
  return definition;
}

export function isNodeTool(tool: string): tool is NodeTool {
  return tool in TOOL_TO_NODE;
}

export function getNodeDefinitionByType(type: string): NodeDefinition | undefined {
  return NODE_DEFINITIONS[type as NodeType];
}
