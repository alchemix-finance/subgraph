import 'dotenv/config';

import { createAlchemist } from './sources/Alchemist';
import { createTransmuter } from './sources/Transmuter';
import { createTransmuterBuffer } from './sources/TransmuterBuffer';
import { createMetaPool } from './sources/MetaPool';
import { createFactoryPool } from './sources/FactoryPool';
import { createThreePoolAssetManager } from './sources/ThreePoolAssetManager';
import { createEthAssetManager } from './sources/EthAssetManager';

export default {
  specVersion: '0.0.4',
  description: 'Alchemix Subgraph',
  repository: 'https://github.com/alchemix-finance/subgraph',
  schema: {
    file: './schema.graphql',
  },
  dataSources: [
    createAlchemist('AlchemistV2_alUSD'),
    createAlchemist('AlchemistV2_alETH'),
    createTransmuter('TransmuterV2_DAI'),
    createTransmuter('TransmuterV2_USDC'),
    createTransmuter('TransmuterV2_USDT'),
    createTransmuter('TransmuterV2_ETH'),
    createTransmuterBuffer('TransmuterBuffer_alUSD'),
    createTransmuterBuffer('TransmuterBuffer_alETH'),
    createMetaPool('alUSDMetaPool', 11955332, '0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c'),
    createFactoryPool('alETHFactoryPool', 13227440, '0xc4c319e2d4d66cca4464c0c2b32c9bd23ebe784e'),
    createThreePoolAssetManager('ThreePoolAssetManager_alUSD', 14543500, '0x9735F7d3Ea56b454b24fFD74C58E9bD85cfaD31B'),
    createEthAssetManager('EthAssetManager', 14573961, '0xe761bf731A06fE8259FeE05897B2687D56933110'),
  ],
};
