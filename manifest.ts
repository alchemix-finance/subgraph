import 'dotenv/config';

import { createAlchemist } from './sources/Alchemist';
import { createTransmuter } from './sources/Transmuter';
import { createTransmuterBuffer } from './sources/TransmuterBuffer';
import { createErc20 } from './sources/ERC20';

export default {
  specVersion: '0.0.4',
  description: 'Alchemix Subgraph',
  repository: 'https://github.com/alchemix-finance/subgraph',
  schema: {
    file: './schema.graphql',
  },
  dataSources: [
    createErc20('ERC20'),
    createAlchemist('AlchemistV2_alUSD'),
    createAlchemist('AlchemistV2_alETH'),
    createTransmuter('TransmuterV2_DAI'),
    createTransmuter('TransmuterV2_USDC'),
    createTransmuter('TransmuterV2_USDT'),
    createTransmuter('TransmuterV2_ETH'),
    createTransmuterBuffer('TransmuterBuffer_alUSD'),
    createTransmuterBuffer('TransmuterBuffer_alETH'),
  ],
};
