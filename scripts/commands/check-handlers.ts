import fs from 'fs-extra';
import subgraphDefinition from '../../manifests/manifest.eth';

export const command = 'check-handlers';
export const description = 'Verify that every event has a matching handler';

export async function handler() {
  let output: string[] = [];

  for (const source of subgraphDefinition.dataSources) {
    const sourceFile = source.mapping.file;
    const sourceFileContent = await fs.readFile(sourceFile, 'utf8');

    // Find all defined event handlers based on this regex.
    const handlerMatches = sourceFileContent.matchAll(/export function handle(?<handler>[A-Z]\w*)\(/gi);
    const definedHandlers = Array.from(handlerMatches)
      .map((item) => item.groups?.handler)
      .filter(Boolean);

    const expectedHandlers = source.mapping.eventHandlers;

    // We expect a dedicated event handler for each abi event type.
    const missingHandlers = expectedHandlers
      .filter((item) => !definedHandlers.some((inner) => `handle${inner}` === item.handler))
      .map((handler) => handler.handler.replace(/^handle/, ''));

    // Check that there are no unused handlers.
    const unusedHandlers = definedHandlers.filter(
      (item) => !expectedHandlers.some((inner) => inner.handler === `handle${item}`),
    );

    if (!unusedHandlers.length && !missingHandlers.length) {
      continue;
    }

    output.push('========================================');
    output.push(`DATA SOURCE ${source.name}:\n`);

    if (unusedHandlers.length) {
      output.push(`UNUSED: ${unusedHandlers.join(', ')}`);
    }

    if (missingHandlers.length) {
      output.push(`MISSING: ${missingHandlers.join(', ')}`);
    }

    output.push('========================================\n');
  }

  if (output.length) {
    output.forEach((item) => console.log(item));

    process.exit(0);
  }
}
