import { utils } from 'ethers';
import { JsonFragment, JsonFragmentType } from '@ethersproject/abi';

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export function formatJson(fragment: utils.Fragment) {
  const json = JSON.parse(fragment.format(utils.FormatTypes.json));
  return sanitizeFragmentJson(json as Mutable<JsonFragment>);
}

function sanitizeParamJson(param: Mutable<JsonFragmentType>, parent: string) {
  param.name = param.name ?? '';
  if (param.components) {
    param.internalType = param.internalType ?? `struct ${parent.charAt(0).toUpperCase()}${parent.slice(1)}Output`;
    param.components = param.components.map((component, index) => sanitizeParamJson(component, `${parent}${index}`));
  } else {
    param.internalType = param.internalType ?? param.type;
  }

  return param;
}

function sanitizeFragmentJson(fragment: Mutable<JsonFragment>) {
  const name = (fragment.name = fragment.name ?? '');
  if (fragment.inputs) {
    fragment.inputs = fragment.inputs.map((input) => sanitizeParamJson(input, name));
  }

  if (fragment.outputs) {
    fragment.outputs = fragment.outputs.map((output) => sanitizeParamJson(output, name));
  }

  return fragment;
}

function formatParams(params: utils.ParamType[]) {
  return params.map((param) => `${param.indexed ? 'indexed ' : ''}${param.type}`).join(',');
}

export function eventDeclaration(input: utils.EventFragment | JsonFragment | string) {
  const fragment = utils.EventFragment.from(input);
  const handler = `handle${fragment.name}`;
  const event = `${fragment.name}(${formatParams(fragment.inputs)})`;

  return { event, handler };
}
