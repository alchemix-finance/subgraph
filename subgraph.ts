import { createAlchemist } from './sources/Alchemist';
import { createTransmuter } from './sources/Transmuter';
import { createTransmuterBuffer } from './sources/TransmuterBuffer';

function fromDeployment(artifact: string): string {
  return require(`./artifacts/localhost/${artifact}.json`).address;
}

const block = 13263419;

export default {
  specVersion: '0.0.4',
  description: 'Alchemix Subgraph',
  repository: 'https://github.com/alchemix-finance/subgraph',
  schema: {
    file: './schema.graphql',
  },
  dataSources: [
    createAlchemist('AlchemistV2_alUSD', fromDeployment('AlchemistV2_alUSD'), block),
    createAlchemist('AlchemistV2_alETH', fromDeployment('AlchemistV2_alETH'), block),
    createTransmuter('TransmuterV2_DAI', fromDeployment('TransmuterV2_DAI'), block),
    createTransmuter('TransmuterV2_USDC', fromDeployment('TransmuterV2_USDC'), block),
    createTransmuter('TransmuterV2_USDT', fromDeployment('TransmuterV2_USDT'), block),
    createTransmuter('TransmuterV2_ETH', fromDeployment('TransmuterV2_ETH'), block),
    createTransmuterBuffer('TransmuterBuffer_alUSD', fromDeployment('TransmuterBuffer_alUSD'), block),
    createTransmuterBuffer('TransmuterBuffer_alETH', fromDeployment('TransmuterBuffer_alETH'), block),
  ],
};
