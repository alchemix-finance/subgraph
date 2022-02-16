import { ethereum } from '@graphprotocol/graph-ts';
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
} from '../generated/schema';
import {
  RefreshStrategies,
  RegisterAsset,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  SetAlchemist,
  SetFlowRate,
  SetSource,
} from '../generated/TransmuterBuffer/TransmuterBuffer';
import { uniqueEventId } from '../utils/id';
import { getOrCreateTransaction } from '../utils/transaction';

function getOrCreateTransmuterBuffer(event: ethereum.Event): TransmuterBuffer {
  let entity = TransmuterBuffer.load(event.address.toHex());

  if (!entity) {
    entity = new TransmuterBuffer(event.address.toHex());
    entity.save();
  }

  return entity;
}

export function handleRefreshStrategies(event: RefreshStrategies): void {
  const contract = getOrCreateTransmuterBuffer(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterBufferRefreshStrategiesEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRegisterAsset(event: RegisterAsset): void {
  const contract = getOrCreateTransmuterBuffer(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterBufferRegisterAssetEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  const contract = getOrCreateTransmuterBuffer(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterBufferRoleAdminChangedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRoleGranted(event: RoleGranted): void {
  const contract = getOrCreateTransmuterBuffer(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterBufferRoleGrantedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRoleRevoked(event: RoleRevoked): void {
  const contract = getOrCreateTransmuterBuffer(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterBufferRoleRevokedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleSetAlchemist(event: SetAlchemist): void {
  const contract = getOrCreateTransmuterBuffer(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterBufferSetAlchemistEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleSetFlowRate(event: SetFlowRate): void {
  const contract = getOrCreateTransmuterBuffer(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterBufferSetFlowRateEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleSetSource(event: SetSource): void {
  const contract = getOrCreateTransmuterBuffer(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterBufferSetSourceEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}
