import { utils } from 'ethers';
import { JsonFragment } from '@ethersproject/abi';

function formatParams(params: utils.ParamType[]) {
  return params.map((param) => `${param.indexed ? 'indexed ' : ''}${param.type}`).join(',');
}

export function eventDeclaration(input: utils.EventFragment | JsonFragment | string) {
  const fragment = utils.EventFragment.from(input);
  const handler = `handle${fragment.name}`;
  const event = `${fragment.name}(${formatParams(fragment.inputs)})`;

  return { event, handler };
}

export function deploymentAddress(artifact: string): string {
  return require(`../../artifacts/localhost/${artifact}.json`).address;
}
