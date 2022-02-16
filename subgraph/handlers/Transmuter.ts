import { ethereum } from '@graphprotocol/graph-ts';
import {
  Transmuter,
  TransmuterAccountAddedEvent,
  TransmuterAccountRemovedEvent,
  TransmuterAdminUpdatedEvent,
  TransmuterClaimEvent,
  TransmuterDepositEvent,
  TransmuterExchangeEvent,
  TransmuterPauseUpdatedEvent,
  TransmuterPendingAdminUpdatedEvent,
  TransmuterRoleAdminChangedEvent,
  TransmuterRoleGrantedEvent,
  TransmuterRoleRevokedEvent,
  TransmuterWhitelistDisabledEvent,
  TransmuterWhitelistEnabledEvent,
  TransmuterWithdrawEvent,
} from '../generated/schema';
import {
  AccountAdded,
  AccountRemoved,
  AdminUpdated,
  Claim,
  Deposit,
  Exchange,
  PauseUpdated,
  PendingAdminUpdated,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  WhitelistDisabled,
  WhitelistEnabled,
  Withdraw,
} from '../generated/Transmuter/Transmuter';
import { uniqueEventId } from '../utils/id';
import { getOrCreateTransaction } from '../utils/transaction';

function getOrCreateTransmuter(event: ethereum.Event): Transmuter {
  let entity = Transmuter.load(event.address.toHex());

  if (!entity) {
    entity = new Transmuter(event.address.toHex());
    entity.save();
  }

  return entity;
}

export function handleAccountAdded(event: AccountAdded): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterAccountAddedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleAccountRemoved(event: AccountRemoved): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterAccountRemovedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleAdminUpdated(event: AdminUpdated): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterAdminUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleClaim(event: Claim): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterClaimEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleDeposit(event: Deposit): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterDepositEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleExchange(event: Exchange): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterExchangeEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handlePauseUpdated(event: PauseUpdated): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterPauseUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handlePendingAdminUpdated(event: PendingAdminUpdated): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterPendingAdminUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterRoleAdminChangedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRoleGranted(event: RoleGranted): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterRoleGrantedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRoleRevoked(event: RoleRevoked): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterRoleRevokedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleWhitelistDisabled(event: WhitelistDisabled): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterWhitelistDisabledEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleWhitelistEnabled(event: WhitelistEnabled): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterWhitelistEnabledEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleWithdraw(event: Withdraw): void {
  const contract = getOrCreateTransmuter(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new TransmuterWithdrawEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}
