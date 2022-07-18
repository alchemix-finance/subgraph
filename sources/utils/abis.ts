import { utils } from 'ethers';
import { JsonFragment } from '@ethersproject/abi';

type Event = utils.EventFragment | JsonFragment | string;

function formatParams(params: utils.ParamType[]) {
  return params.map((param) => `${param.indexed ? 'indexed ' : ''}${param.type}`).join(',');
}

function eventHandler(name: string, reserved: string[] = []) {
  let handler = name;
  let suffix = 0;

  while (reserved.includes(handler)) {
    handler = `${name}${++suffix}`;
  }

  return handler;
}

function eventDeclaration(input: Event, reserved: string[] = []) {
  const fragment = utils.EventFragment.from(input);
  const handler = eventHandler(`handle${fragment.name}`, reserved);
  const event = `${fragment.name}(${formatParams(fragment.inputs)})`;

  return { event, handler };
}

export function eventDeclarations(input: Event[]) {
  const reserved: string[] = [];

  return input.reduce<{ event: string; handler: string }[]>((carry, current) => {
    const item = eventDeclaration(current, reserved);
    reserved.push(item.handler);

    return carry.concat(item);
  }, []);
}

export function deploymentAddress(artifact: string): string {
  return require(`../../v2-contracts/deployments/mainnet/${artifact}.json`).address;
}
