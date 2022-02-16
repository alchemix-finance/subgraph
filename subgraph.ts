import { createAlchemist } from './sources/Alchemist';
import { createTransmuter } from './sources/Transmuter';
import { createTransmuterBuffer } from './sources/TransmuterBuffer';

import AlchemistDeployment from './artifacts/localhost/AlchemistV2_alUSD.json';
import TransmuterDeployment from './artifacts/localhost/TransmuterV2_USDC.json';
import TransmuterBufferDeployment from './artifacts/localhost/TransmuterBuffer_alUSD.json';

const block = 13263419;

export default {
  specVersion: '0.0.4',
  description: 'Alchemix Subgraph',
  repository: 'https://github.com/alchemix-finance/subgraph',
  schema: {
    file: './schema.graphql',
  },
  dataSources: [
    createAlchemist(AlchemistDeployment.address, block),
    createTransmuter(TransmuterDeployment.address, block),
    createTransmuterBuffer(TransmuterBufferDeployment.address, block),
  ],
};
