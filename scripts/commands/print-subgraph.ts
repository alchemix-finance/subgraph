import yaml from 'js-yaml';

export const command = 'print-subgraph';
export const description = 'Prints the generated subgraph.yaml';

export async function handler() {
  const subgraph = require('../../manifest.ts');
  process.stdout.write(yaml.dump(subgraph, { lineWidth: 120 }));
}
