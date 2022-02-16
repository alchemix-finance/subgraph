import { ethereum } from '@graphprotocol/graph-ts';
import {
  Alchemist,
  AlchemistAccountAddedEvent,
  AlchemistAccountRemovedEvent,
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
  AlchemistWhitelistDisabledEvent,
  AlchemistWhitelistEnabledEvent,
  AlchemistWithdrawEvent,
  AlchemistYieldTokenEnabledEvent,
} from '../generated/schema';
import {
  AccountAdded,
  AccountRemoved,
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
  WhitelistDisabled,
  WhitelistEnabled,
  Withdraw,
  YieldTokenEnabled,
} from '../generated/Alchemist/Alchemist';
import { uniqueEventId } from '../utils/id';
import { getOrCreateTransaction } from '../utils/transaction';

function getOrCreateAlchemist(event: ethereum.Event): Alchemist {
  let entity = Alchemist.load(event.address.toHex());

  if (!entity) {
    entity = new Alchemist(event.address.toHex());
    entity.save();
  }

  return entity;
}

export function handleAccountAdded(event: AccountAdded): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistAccountAddedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleAccountRemoved(event: AccountRemoved): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistAccountRemovedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleAddUnderlyingToken(event: AddUnderlyingToken): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistAddUnderlyingTokenEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleAddYieldToken(event: AddYieldToken): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistAddYieldTokenEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleAdminUpdated(event: AdminUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistAdminUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleApproveMint(event: ApproveMint): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistApproveMintEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleApproveWithdraw(event: ApproveWithdraw): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistApproveWithdrawEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleBurn(event: Burn): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistBurnEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleDeposit(event: Deposit): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistDepositEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleDonate(event: Donate): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistDonateEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleHarvest(event: Harvest): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistHarvestEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleKeeperSet(event: KeeperSet): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistKeeperSetEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleLiquidate(event: Liquidate): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistLiquidateEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleLiquidationLimitUpdated(event: LiquidationLimitUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistLiquidationLimitUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleMaximumExpectedValueUpdated(event: MaximumExpectedValueUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistMaximumExpectedValueUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleMaximumLossUpdated(event: MaximumLossUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistMaximumLossUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleMinimumCollateralizationUpdated(event: MinimumCollateralizationUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistMinimumCollateralizationUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleMint(event: Mint): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistMintEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleMintingLimitUpdated(event: MintingLimitUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistMintingLimitUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handlePendingAdminUpdated(event: PendingAdminUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistPendingAdminUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleProtocolFeeReceiverUpdated(event: ProtocolFeeReceiverUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistProtocolFeeReceiverUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleProtocolFeeUpdated(event: ProtocolFeeUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistProtocolFeeUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRepay(event: Repay): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistRepayEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleRepayLimitUpdated(event: RepayLimitUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistRepayLimitUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleSentinelSet(event: SentinelSet): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistSentinelSetEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleSnap(event: Snap): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistSnapEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleTokenAdapterUpdated(event: TokenAdapterUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistTokenAdapterUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleTransmuterUpdated(event: TransmuterUpdated): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistTransmuterUpdatedEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleUnderlyingTokenEnabled(event: UnderlyingTokenEnabled): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistUnderlyingTokenEnabledEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleWhitelistDisabled(event: WhitelistDisabled): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistWhitelistDisabledEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleWhitelistEnabled(event: WhitelistEnabled): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistWhitelistEnabledEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleWithdraw(event: Withdraw): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistWithdrawEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}

export function handleYieldTokenEnabled(event: YieldTokenEnabled): void {
  const contract = getOrCreateAlchemist(event);
  const transaction = getOrCreateTransaction(event);
  const entity = new AlchemistYieldTokenEnabledEvent(uniqueEventId(event));
  entity.contract = contract.id;
  entity.transaction = transaction.id;
  entity.save();
}
