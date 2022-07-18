import 'dotenv/config';

import { createAlchemist } from '../sources/Alchemist';
import { createTransmuter } from '../sources/Transmuter';
import { createTransmuterBuffer } from '../sources/TransmuterBuffer';
import { createMetaPool } from '../sources/MetaPool';
import { createFactoryPool } from '../sources/FactoryPool';

export default {
  specVersion: '0.0.4',
  description: 'Alchemix Subgraph',
  repository: 'https://github.com/alchemix-finance/subgraph',
  schema: {
    file: './schema.graphql',
  },
  dataSources: [
    createAlchemist('AlchemistV2_alUSD'),
    createTransmuter('TransmuterV2_DAI'),
    createTransmuter('TransmuterV2_USDC'),
    createTransmuter('TransmuterV2_USDT'),
    createTransmuterBuffer('TransmuterBuffer_alUSD'),
    // createMetaPool('alUSDMetaPool', 11955332, ''),
  ],
};
