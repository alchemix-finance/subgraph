import { Alchemist } from './sources/Alchemist';
import { Transmuter } from './sources/Transmuter';
import { TransmuterBuffer } from './sources/TransmuterBuffer';

export default {
  specVersion: '0.0.4',
  description: 'Alchemix Subgraph',
  repository: 'https://github.com/alchemix-finance/subgraph',
  schema: {
    file: './schema.graphql',
  },
  dataSources: [Alchemist, Transmuter, TransmuterBuffer],
};
