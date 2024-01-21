import { Entity, ethereum } from '@graphprotocol/graph-ts';
import {
  TransmuterBuffer,
  TransmuterBufferRefreshStrategiesEvent,
  TransmuterBufferRegisterAssetEvent,
  TransmuterBufferRoleAdminChangedEvent,
  TransmuterBufferRoleGrantedEvent,
  TransmuterBufferRoleRevokedEvent,
  TransmuterBufferSetAlchemistEvent,
  TransmuterBufferSetFlowRateEvent,
  TransmuterBufferSetSourceEvent,
  TransmuterBufferSetAmoEvent,
  TransmuterBufferSetDivertToAmoEvent,
  TransmuterBufferSetTransmuterEvent,
} from '../generated/schema';
import {
  RefreshStrategies,
  RegisterAsset,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  SetAlchemist,
  SetAmo,
  SetFlowRate,
  SetSource,
} from '../generated/TransmuterBuffer_alETH/TransmuterBuffer';
import { SetDivertToAmo, SetTransmuter } from '../generated/TransmuterBuffer_alUSD/TransmuterBuffer';
import { createEvent, getOrCreateUnderlyingToken } from '../utils/entities';

function getOrCreateTransmuterBuffer(event: ethereum.Event): TransmuterBuffer {
  let entity = TransmuterBuffer.load(event.address.toHex());

  if (!entity) {
    entity = new TransmuterBuffer(event.address.toHex());
    entity.save();
  }

  return entity;
}

function createTransmuterBufferEvent<TEvent extends Entity>(event: ethereum.Event): TEvent {
  const contract = getOrCreateTransmuterBuffer(event);
  const entity = createEvent<TEvent>(event);
  entity.setString('contract', contract.id);

  return entity;
}

export function handleRefreshStrategies(event: RefreshStrategies): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferRefreshStrategiesEvent>(event);
  entity.save();
}

export function handleRegisterAsset(event: RegisterAsset): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferRegisterAssetEvent>(event);
  entity.transmuter = event.params.transmuter;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferRoleAdminChangedEvent>(event);
  entity.newAdminRole = event.params.newAdminRole;
  entity.previousAdminRole = event.params.previousAdminRole;
  entity.role = event.params.role;
  entity.save();
}

export function handleRoleGranted(event: RoleGranted): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferRoleGrantedEvent>(event);
  entity.account = event.params.account;
  entity.role = event.params.role;
  entity.sender = event.params.sender;
  entity.save();
}

export function handleRoleRevoked(event: RoleRevoked): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferRoleRevokedEvent>(event);
  entity.account = event.params.account;
  entity.role = event.params.role;
  entity.sender = event.params.sender;
  entity.save();
}

export function handleSetAlchemist(event: SetAlchemist): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferSetAlchemistEvent>(event);
  entity.alchemist = event.params.alchemist;
  entity.save();
}

export function handleSetFlowRate(event: SetFlowRate): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferSetFlowRateEvent>(event);
  entity.flowRate = event.params.flowRate;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();
}

export function handleSetSource(event: SetSource): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferSetSourceEvent>(event);
  entity.flag = event.params.flag;
  entity.source = event.params.source;
  entity.save();
}

export function handleSetTransmuter(event: SetTransmuter): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferSetTransmuterEvent>(event);
  entity.underlyingToken = event.params.underlyingToken;
  entity.transmuter = event.params.transmuter;
  entity.save();
}

export function handleSetAmo(event: SetAmo): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferSetAmoEvent>(event);
  let underlyingToken = getOrCreateUnderlyingToken(event.params.underlyingToken);
  entity.underlyingToken = underlyingToken.id;
  entity.amo = event.params.amo;
  entity.save();
}

export function handleSetDivertToAmo(event: SetDivertToAmo): void {
  const entity = createTransmuterBufferEvent<TransmuterBufferSetDivertToAmoEvent>(event);
  let underlyingToken = getOrCreateUnderlyingToken(event.params.underlyingToken);
  entity.underlyingToken = underlyingToken.id;
  entity.divert = event.params.divert;
  entity.save();
}
