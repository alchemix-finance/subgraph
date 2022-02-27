import { BigInt, Entity, ethereum } from '@graphprotocol/graph-ts';
import {
  Alchemist,
  AlchemistAddUnderlyingTokenEvent,
  AlchemistAddYieldTokenEvent,
  AlchemistAdminUpdatedEvent,
  AlchemistApproveMintEvent,
  AlchemistApproveWithdrawEvent,
  AlchemistBurnEvent,
  AlchemistDepositEvent,
  AlchemistDonateEvent,
  AlchemistHarvestEvent,
  AlchemistKeeperSetEvent,
  AlchemistLiquidateEvent,
  AlchemistLiquidationLimitUpdatedEvent,
  AlchemistMaximumExpectedValueUpdatedEvent,
  AlchemistMaximumLossUpdatedEvent,
  AlchemistMinimumCollateralizationUpdatedEvent,
  AlchemistMintEvent,
  AlchemistMintingLimitUpdatedEvent,
  AlchemistPendingAdminUpdatedEvent,
  AlchemistProtocolFeeReceiverUpdatedEvent,
  AlchemistProtocolFeeUpdatedEvent,
  AlchemistRepayEvent,
  AlchemistRepayLimitUpdatedEvent,
  AlchemistSentinelSetEvent,
  AlchemistSnapEvent,
  AlchemistTokenAdapterUpdatedEvent,
  AlchemistTransmuterUpdatedEvent,
  AlchemistUnderlyingTokenEnabledEvent,
  AlchemistWithdrawEvent,
  AlchemistYieldTokenEnabledEvent,
} from '../generated/schema';
import {
  Alchemist as AlchemistContract,
  AddUnderlyingToken,
  AddYieldToken,
  AdminUpdated,
  ApproveMint,
  ApproveWithdraw,
  Burn,
  Deposit,
  Donate,
  Harvest,
  KeeperSet,
  Liquidate,
  LiquidationLimitUpdated,
  MaximumExpectedValueUpdated,
  MaximumLossUpdated,
  MinimumCollateralizationUpdated,
  Mint,
  MintingLimitUpdated,
  PendingAdminUpdated,
  ProtocolFeeReceiverUpdated,
  ProtocolFeeUpdated,
  Repay,
  RepayLimitUpdated,
  SentinelSet,
  Snap,
  TokenAdapterUpdated,
  TransmuterUpdated,
  UnderlyingTokenEnabled,
  Withdraw,
  YieldTokenEnabled,
} from '../generated/AlchemistV2_alETH/Alchemist';
import {
  createEvent,
  getOrCreateAccount,
  getOrCreateAlchemistDeposit,
  getOrCreateAlchemistDepositHistory,
} from '../utils/entities';

function getOrCreateAlchemist(event: ethereum.Event): Alchemist {
  let entity = Alchemist.load(event.address.toHex());

  if (!entity) {
    entity = new Alchemist(event.address.toHex());
    entity.save();
  }

  return entity;
}

function createAlchemistEvent<TEvent extends Entity>(event: ethereum.Event): TEvent {
  const contract = getOrCreateAlchemist(event);
  const entity = createEvent<TEvent>(event);
  entity.setString('contract', contract.id);

  return entity;
}

export function handleAddUnderlyingToken(event: AddUnderlyingToken): void {
  const entity = createAlchemistEvent<AlchemistAddUnderlyingTokenEvent>(event);
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();
}

export function handleAddYieldToken(event: AddYieldToken): void {
  const entity = createAlchemistEvent<AlchemistAddYieldTokenEvent>(event);
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}

export function handleAdminUpdated(event: AdminUpdated): void {
  const entity = createAlchemistEvent<AlchemistAdminUpdatedEvent>(event);
  entity.admin = event.params.admin;
  entity.save();
}

export function handleApproveMint(event: ApproveMint): void {
  const entity = createAlchemistEvent<AlchemistApproveMintEvent>(event);
  entity.amount = event.params.amount;
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.save();
}

export function handleApproveWithdraw(event: ApproveWithdraw): void {
  const entity = createAlchemistEvent<AlchemistApproveWithdrawEvent>(event);
  entity.amount = event.params.amount;
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}

export function handleBurn(event: Burn): void {
  const entity = createAlchemistEvent<AlchemistBurnEvent>(event);
  entity.amount = event.params.amount;
  entity.recipient = event.params.recipient;
  entity.sender = event.params.sender;
  entity.save();
}

export function handleDeposit(event: Deposit): void {
  const entity = createAlchemistEvent<AlchemistDepositEvent>(event);
  entity.amount = event.params.amount;
  entity.recipient = event.params.recipient;
  entity.sender = event.params.sender;
  entity.yieldToken = event.params.yieldToken;
  entity.save();

  const alchemist = getOrCreateAlchemist(event);
  const account = getOrCreateAccount(event.params.recipient);
  const deposit = getOrCreateAlchemistDeposit(account, alchemist);

  // TODO: The shares should be added to the event.
  const contract = AlchemistContract.bind(event.address);
  const position = contract.positions(event.params.recipient, event.params.yieldToken);
  const shares = position.value0;
  const change = shares.minus(deposit.shares);

  deposit.shares = shares;
  deposit.save();

  getOrCreateAlchemistDepositHistory(deposit, change, event);
}

export function handleDonate(event: Donate): void {
  const entity = createAlchemistEvent<AlchemistDonateEvent>(event);
  entity.amount = event.params.amount;
  entity.sender = event.params.sender;
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}

export function handleHarvest(event: Harvest): void {
  const entity = createAlchemistEvent<AlchemistHarvestEvent>(event);
  entity.maximumLoss = event.params.maximumLoss;
  entity.totalHarvested = event.params.totalHarvested;
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}

export function handleKeeperSet(event: KeeperSet): void {
  const entity = createAlchemistEvent<AlchemistKeeperSetEvent>(event);
  entity.flag = event.params.flag;
  entity.sentinel = event.params.sentinel;
  entity.save();
}

export function handleLiquidate(event: Liquidate): void {
  const entity = createAlchemistEvent<AlchemistLiquidateEvent>(event);
  entity.owner = event.params.owner;
  entity.shares = event.params.shares;
  entity.yieldToken = event.params.yieldToken;
  entity.save();

  const alchemist = getOrCreateAlchemist(event);
  const account = getOrCreateAccount(event.params.owner);
  const deposit = getOrCreateAlchemistDeposit(account, alchemist);
  deposit.shares = deposit.shares.minus(event.params.shares);
  deposit.save();

  const change = event.params.shares.times(BigInt.fromI32(-1));
  getOrCreateAlchemistDepositHistory(deposit, change, event);
}

export function handleLiquidationLimitUpdated(event: LiquidationLimitUpdated): void {
  const entity = createAlchemistEvent<AlchemistLiquidationLimitUpdatedEvent>(event);
  entity.blocks = event.params.blocks;
  entity.maximum = event.params.maximum;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();
}

export function handleMaximumExpectedValueUpdated(event: MaximumExpectedValueUpdated): void {
  const entity = createAlchemistEvent<AlchemistMaximumExpectedValueUpdatedEvent>(event);
  entity.maximumExpectedValue = event.params.maximumExpectedValue;
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}

export function handleMaximumLossUpdated(event: MaximumLossUpdated): void {
  const entity = createAlchemistEvent<AlchemistMaximumLossUpdatedEvent>(event);
  entity.maximumLoss = event.params.maximumLoss;
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}

export function handleMinimumCollateralizationUpdated(event: MinimumCollateralizationUpdated): void {
  const entity = createAlchemistEvent<AlchemistMinimumCollateralizationUpdatedEvent>(event);
  entity.minimumCollateralization = event.params.minimumCollateralization;
  entity.save();
}

export function handleMint(event: Mint): void {
  const entity = createAlchemistEvent<AlchemistMintEvent>(event);
  entity.amount = event.params.amount;
  entity.owner = event.params.owner;
  entity.recipient = event.params.recipient;
  entity.save();
}

export function handleMintingLimitUpdated(event: MintingLimitUpdated): void {
  const entity = createAlchemistEvent<AlchemistMintingLimitUpdatedEvent>(event);
  entity.blocks = event.params.blocks;
  entity.maximum = event.params.maximum;
  entity.save();
}

export function handlePendingAdminUpdated(event: PendingAdminUpdated): void {
  const entity = createAlchemistEvent<AlchemistPendingAdminUpdatedEvent>(event);
  entity.pendingAdmin = event.params.pendingAdmin;
  entity.save();
}

export function handleProtocolFeeReceiverUpdated(event: ProtocolFeeReceiverUpdated): void {
  const entity = createAlchemistEvent<AlchemistProtocolFeeReceiverUpdatedEvent>(event);
  entity.protocolFeeReceiver = event.params.protocolFeeReceiver;
  entity.save();
}

export function handleProtocolFeeUpdated(event: ProtocolFeeUpdated): void {
  const entity = createAlchemistEvent<AlchemistProtocolFeeUpdatedEvent>(event);
  entity.protocolFee = event.params.protocolFee;
  entity.save();
}

export function handleRepay(event: Repay): void {
  const entity = createAlchemistEvent<AlchemistRepayEvent>(event);
  entity.amount = event.params.amount;
  entity.recipient = event.params.recipient;
  entity.sender = event.params.sender;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();
}

export function handleRepayLimitUpdated(event: RepayLimitUpdated): void {
  const entity = createAlchemistEvent<AlchemistRepayLimitUpdatedEvent>(event);
  entity.blocks = event.params.blocks;
  entity.maximum = event.params.maximum;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();
}

export function handleSentinelSet(event: SentinelSet): void {
  const entity = createAlchemistEvent<AlchemistSentinelSetEvent>(event);
  entity.flag = event.params.flag;
  entity.sentinel = event.params.sentinel;
  entity.save();
}

export function handleSnap(event: Snap): void {
  const entity = createAlchemistEvent<AlchemistSnapEvent>(event);
  entity.expectedValue = event.params.expectedValue;
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}

export function handleTokenAdapterUpdated(event: TokenAdapterUpdated): void {
  const entity = createAlchemistEvent<AlchemistTokenAdapterUpdatedEvent>(event);
  entity.tokenAdapter = event.params.tokenAdapter;
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}

export function handleTransmuterUpdated(event: TransmuterUpdated): void {
  const entity = createAlchemistEvent<AlchemistTransmuterUpdatedEvent>(event);
  entity.transmuter = event.params.transmuter;
  entity.save();
}

export function handleUnderlyingTokenEnabled(event: UnderlyingTokenEnabled): void {
  const entity = createAlchemistEvent<AlchemistUnderlyingTokenEnabledEvent>(event);
  entity.enabled = event.params.enabled;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();
}

export function handleWithdraw(event: Withdraw): void {
  const entity = createAlchemistEvent<AlchemistWithdrawEvent>(event);
  entity.owner = event.params.owner;
  entity.recipient = event.params.recipient;
  entity.shares = event.params.shares;
  entity.yieldToken = event.params.yieldToken;
  entity.save();

  const alchemist = getOrCreateAlchemist(event);
  const account = getOrCreateAccount(event.params.recipient);
  const deposit = getOrCreateAlchemistDeposit(account, alchemist);
  deposit.shares = deposit.shares.minus(event.params.shares);
  deposit.save();

  const change = event.params.shares.times(BigInt.fromI32(-1));
  getOrCreateAlchemistDepositHistory(deposit, change, event);
}

export function handleYieldTokenEnabled(event: YieldTokenEnabled): void {
  const entity = createAlchemistEvent<AlchemistYieldTokenEnabledEvent>(event);
  entity.enabled = event.params.enabled;
  entity.yieldToken = event.params.yieldToken;
  entity.save();
}
