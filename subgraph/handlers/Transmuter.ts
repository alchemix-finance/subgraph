import { Bytes, BigInt, Entity, ethereum } from '@graphprotocol/graph-ts';
import {
  Transmuter,
  TransmuterAdminUpdatedEvent,
  TransmuterClaimEvent,
  TransmuterDepositEvent,
  TransmuterExchangeEvent,
  TransmuterPausedEvent,
  TransmuterPendingAdminUpdatedEvent,
  TransmuterRoleAdminChangedEvent,
  TransmuterRoleGrantedEvent,
  TransmuterRoleRevokedEvent,
  TransmuterWithdrawEvent,
} from '../generated/schema';
import {
  AdminUpdated,
  Claim,
  Deposit,
  Exchange,
  Paused,
  PendingAdminUpdated,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Withdraw,
  Transmuter as TransmuterContract,
} from '../generated/TransmuterV2_DAI/Transmuter';
import {
  createEvent,
  getOrCreateTransmuterBalance,
  getOrCreateAccount,
  getOrCreateTransmuterBalanceHistory,
  getOrCreateDebtToken,
} from '../utils/entities';

function getOrCreateTransmuter(event: ethereum.Event): Transmuter {
  let entity = Transmuter.load(event.address.toHex());

  if (!entity) {
    entity = new Transmuter(event.address.toHex());
    let transmuter = TransmuterContract.bind(event.address);
    let debtTokenAddress = transmuter.syntheticToken();
    let debtToken = getOrCreateDebtToken(debtTokenAddress);
    entity.debtToken = debtToken.id;
    let underlyingTokenAddress = transmuter.underlyingToken();
    let underlyingToken = getOrCreateDebtToken(underlyingTokenAddress);
    entity.underlyingToken = underlyingToken.id;
    entity.save();
  }

  return entity;
}

function createTransmuterEvent<TEvent extends Entity>(event: ethereum.Event): TEvent {
  const contract = getOrCreateTransmuter(event);
  const entity = createEvent<TEvent>(event);
  entity.setString('contract', contract.id);

  return entity;
}

export function handleAdminUpdated(event: AdminUpdated): void {
  const entity = createTransmuterEvent<TransmuterAdminUpdatedEvent>(event);
  entity.admin = event.params.admin;
  entity.save();
}

export function handleClaim(event: Claim): void {
  const entity = createTransmuterEvent<TransmuterClaimEvent>(event);
  entity.amount = event.params.amount;
  entity.recipient = event.params.recipient;
  entity.sender = event.params.sender;
  entity.save();

  const transmuter = getOrCreateTransmuter(event);
  const account = getOrCreateAccount(event.params.sender);
  const balance = getOrCreateTransmuterBalance(transmuter, account);
  balance.balance = balance.balance.minus(event.params.amount);
  balance.save();

  getOrCreateTransmuterBalanceHistory(balance, event.params.amount.times(BigInt.fromI32(-1)), event);
}

export function handleDeposit(event: Deposit): void {
  const entity = createTransmuterEvent<TransmuterDepositEvent>(event);
  entity.amount = event.params.amount;
  entity.owner = event.params.owner;
  entity.sender = event.params.sender;
  entity.save();

  const transmuter = getOrCreateTransmuter(event);
  const account = getOrCreateAccount(event.params.owner);
  const balance = getOrCreateTransmuterBalance(transmuter, account);
  balance.balance = balance.balance.plus(event.params.amount);
  balance.save();

  getOrCreateTransmuterBalanceHistory(balance, event.params.amount, event);
}

export function handleExchange(event: Exchange): void {
  const entity = createTransmuterEvent<TransmuterExchangeEvent>(event);
  entity.amount = event.params.amount;
  entity.sender = event.params.sender;
  entity.save();
}

export function handlePaused(event: Paused): void {
  const entity = createTransmuterEvent<TransmuterPausedEvent>(event);
  entity.flag = event.params.flag;
  entity.save();
}

export function handlePendingAdminUpdated(event: PendingAdminUpdated): void {
  const entity = createTransmuterEvent<TransmuterPendingAdminUpdatedEvent>(event);
  entity.pendingAdmin = event.params.pendingAdmin;
  entity.save();
}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {
  const entity = createTransmuterEvent<TransmuterRoleAdminChangedEvent>(event);
  entity.newAdminRole = event.params.newAdminRole;
  entity.previousAdminRole = event.params.previousAdminRole;
  entity.role = event.params.role;
  entity.save();
}

export function handleRoleGranted(event: RoleGranted): void {
  const entity = createTransmuterEvent<TransmuterRoleGrantedEvent>(event);
  entity.account = event.params.account;
  entity.role = event.params.role;
  entity.sender = event.params.sender;
  entity.save();
}

export function handleRoleRevoked(event: RoleRevoked): void {
  const entity = createTransmuterEvent<TransmuterRoleRevokedEvent>(event);
  entity.account = event.params.account;
  entity.role = event.params.role;
  entity.sender = event.params.sender;
  entity.save();
}

export function handleWithdraw(event: Withdraw): void {
  const entity = createTransmuterEvent<TransmuterWithdrawEvent>(event);
  entity.amount = event.params.amount;
  entity.recipient = event.params.recipient;
  entity.sender = event.params.sender;
  entity.save();

  const transmuter = getOrCreateTransmuter(event);
  const account = getOrCreateAccount(event.params.sender);
  const balance = getOrCreateTransmuterBalance(transmuter, account);
  balance.balance = balance.balance.minus(event.params.amount);
  balance.save();

  getOrCreateTransmuterBalanceHistory(balance, event.params.amount.times(BigInt.fromI32(-1)), event);
}
