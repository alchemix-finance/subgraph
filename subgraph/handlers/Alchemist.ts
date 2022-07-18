import { BigInt, Entity, ethereum } from '@graphprotocol/graph-ts';
import {
  Alchemist,
  AlchemistAddUnderlyingTokenEvent,
  AlchemistAddYieldTokenEvent,
  AlchemistAdminUpdatedEvent,
  AlchemistApproveMintEvent,
  AlchemistApproveWithdrawEvent,
  AlchemistBurnEvent,
  AlchemistCreditUnlockRateUpdatedEvent,
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
  CreditUnlockRateUpdated,
  Harvest1,
  Repay1,
  Liquidate1,
  Liquidate2,
} from '../generated/AlchemistV2_alETH/Alchemist';
import { ERC20 as ERC20Contract } from '../generated/AlchemistV2_alETH/ERC20';
import {
  createEvent,
  getOrCreateAccount,
  getOrCreateAlchemistBalance,
  getOrCreateAlchemistBalanceHistory,
  getOrCreateYieldToken,
  getOrCreateAlchemistTVL,
  getOrCreateAlchemistTVLHistory,
  getOrCreateAlchemistGlobalDebt,
  getOrCreateAlchemistGlobalDebtHistory,
  getOrCreateDebtToken,
} from '../utils/entities';

function getOrCreateAlchemist(event: ethereum.Event): Alchemist {
  let entity = Alchemist.load(event.address.toHex());

  if (!entity) {
    entity = new Alchemist(event.address.toHex());
    const alchemistContract = AlchemistContract.bind(event.address);
    let debtToken = getOrCreateDebtToken(alchemistContract.debtToken());
    entity.debtToken = debtToken.id;
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

  let alchemist = getOrCreateAlchemist(event);
  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(event.params.amount);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
}

export function handleCreditUnlockRateUpdated(event: CreditUnlockRateUpdated): void {
  const entity = createAlchemistEvent<AlchemistCreditUnlockRateUpdatedEvent>(event);
  entity.yieldToken = event.params.yieldToken;
  entity.blocks = event.params.blocks;
  entity.save();
}

export function handleDonate(event: Donate): void {
  const entity = createAlchemistEvent<AlchemistDonateEvent>(event);
  entity.amount = event.params.amount;
  entity.sender = event.params.sender;
  entity.yieldToken = event.params.yieldToken;
  entity.save();

  let alchemist = getOrCreateAlchemist(event);
  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(event.params.amount);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
}

export function handleHarvest(event: Harvest): void {
  const entity = createAlchemistEvent<AlchemistHarvestEvent>(event);
  const account = getOrCreateAccount(event.transaction.from);
  const accountDebt = account.debt;

  entity.minimumAmountOut = event.params.minimumAmountOut;
  entity.totalHarvested = event.params.totalHarvested;
  entity.yieldToken = event.params.yieldToken;
  entity.save();

  let alchemist = getOrCreateAlchemist(event);
  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(accountDebt);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
}

export function handleHarvest1(event: Harvest1): void {
  const entity = createAlchemistEvent<AlchemistHarvestEvent>(event);
  entity.minimumAmountOut = event.params.minimumAmountOut;
  entity.totalHarvested = event.params.totalHarvested;
  entity.yieldToken = event.params.yieldToken;
  entity.save();

  let alchemist = getOrCreateAlchemist(event);
  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(event.params.credit);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
}

export function handleKeeperSet(event: KeeperSet): void {
  const entity = createAlchemistEvent<AlchemistKeeperSetEvent>(event);
  entity.flag = event.params.flag;
  entity.sentinel = event.params.sentinel;
  entity.save();
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

  let alchemist = getOrCreateAlchemist(event);
  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.plus(event.params.amount);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
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
  const account = getOrCreateAccount(event.transaction.from);
  const accountDebt = account.debt;

  entity.amount = event.params.amount;
  entity.recipient = event.params.recipient;
  entity.sender = event.params.sender;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();

  let alchemist = getOrCreateAlchemist(event);
  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(accountDebt);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
}

export function handleRepay1(event: Repay1): void {
  const entity = createAlchemistEvent<AlchemistRepayEvent>(event);
  entity.amount = event.params.amount;
  entity.recipient = event.params.recipient;
  entity.sender = event.params.sender;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();

  let alchemist = getOrCreateAlchemist(event);
  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(event.params.credit);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
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

export function handleYieldTokenEnabled(event: YieldTokenEnabled): void {
  const entity = createAlchemistEvent<AlchemistYieldTokenEnabledEvent>(event);
  entity.enabled = event.params.enabled;
  entity.yieldToken = event.params.yieldToken;
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
  const yieldToken = getOrCreateYieldToken(event.params.yieldToken);
  const balance = getOrCreateAlchemistBalance(account, alchemist, yieldToken);

  // TODO: The shares should be added to the event.
  const alchemistContract = AlchemistContract.bind(event.address);
  const position = alchemistContract.positions(event.params.recipient, event.params.yieldToken);
  const shares = position.value0;
  const pps = alchemistContract.getUnderlyingTokensPerShare(event.params.yieldToken);
  const ytp = alchemistContract.getYieldTokenParameters(event.params.yieldToken);
  const underlyingValue = shares.times(pps).div(BigInt.fromI32(10).pow(ytp.decimals as u8));
  const balChange = shares.minus(balance.shares);

  balance.shares = shares;
  balance.underlyingValue = underlyingValue;
  balance.save();

  getOrCreateAlchemistBalanceHistory(balance, balChange, event);

  const yieldTokenContract = ERC20Contract.bind(event.params.yieldToken);
  const yieldTokenBalance = yieldTokenContract.balanceOf(event.address);
  const yieldTokenParams = alchemistContract.getYieldTokenParameters(event.params.yieldToken);
  const totalUnderlyingValue = yieldTokenParams.totalShares
    .times(pps)
    .div(BigInt.fromI32(10).pow(yieldTokenParams.decimals as u8));
  const tvl = getOrCreateAlchemistTVL(alchemist, yieldToken, yieldTokenBalance, totalUnderlyingValue);
  const amountChange = yieldTokenBalance.minus(tvl.amount);
  const underlyingValueChange = totalUnderlyingValue.minus(tvl.underlyingValue);

  tvl.amount = yieldTokenBalance;
  tvl.underlyingValue = totalUnderlyingValue;
  tvl.save();

  getOrCreateAlchemistTVLHistory(tvl, amountChange, underlyingValueChange, event);
}

export function handleWithdraw(event: Withdraw): void {
  const entity = createAlchemistEvent<AlchemistWithdrawEvent>(event);
  entity.owner = event.params.owner;
  entity.recipient = event.params.recipient;
  entity.shares = event.params.shares;
  entity.yieldToken = event.params.yieldToken;
  entity.save();

  const alchemistContract = AlchemistContract.bind(event.address);
  const alchemist = getOrCreateAlchemist(event);
  const account = getOrCreateAccount(event.params.owner);
  const yieldToken = getOrCreateYieldToken(event.params.yieldToken);
  const deposit = getOrCreateAlchemistBalance(account, alchemist, yieldToken);
  deposit.shares = deposit.shares.minus(event.params.shares);
  const pps = alchemistContract.getUnderlyingTokensPerShare(event.params.yieldToken);
  deposit.underlyingValue = deposit.shares.times(pps);
  deposit.save();

  const change = event.params.shares.times(BigInt.fromI32(-1));
  getOrCreateAlchemistBalanceHistory(deposit, change, event);

  const yieldTokenContract = ERC20Contract.bind(event.params.yieldToken);
  const yieldTokenBalance = yieldTokenContract.balanceOf(event.address);
  const yieldTokenParams = alchemistContract.getYieldTokenParameters(event.params.yieldToken);
  const totalUnderlyingValue = yieldTokenParams.totalShares
    .times(pps)
    .div(BigInt.fromI32(10).pow(yieldTokenParams.decimals as u8));
  const tvl = getOrCreateAlchemistTVL(alchemist, yieldToken, yieldTokenBalance, totalUnderlyingValue);
  const amountChange = tvl.amount.minus(yieldTokenBalance);
  const underlyingValueChange = tvl.underlyingValue.minus(totalUnderlyingValue);

  tvl.amount = yieldTokenBalance;
  tvl.underlyingValue = totalUnderlyingValue;
  tvl.save();

  getOrCreateAlchemistTVLHistory(tvl, amountChange, underlyingValueChange, event);
}

export function handleLiquidate(event: Liquidate): void {
  const entity = createAlchemistEvent<AlchemistLiquidateEvent>(event);
  entity.owner = event.params.owner;
  entity.shares = event.params.shares;
  entity.yieldToken = event.params.yieldToken;
  entity.save();

  const alchemistContract = AlchemistContract.bind(event.address);
  const alchemist = getOrCreateAlchemist(event);
  const account = getOrCreateAccount(event.params.owner);
  const yieldToken = getOrCreateYieldToken(event.params.yieldToken);
  const deposit = getOrCreateAlchemistBalance(account, alchemist, yieldToken);
  const accountDebt = account.debt;
  deposit.shares = deposit.shares.minus(event.params.shares);
  const pps = alchemistContract.getUnderlyingTokensPerShare(event.params.yieldToken);
  deposit.underlyingValue = deposit.shares.times(pps);
  deposit.save();

  const change = event.params.shares.times(BigInt.fromI32(-1));
  getOrCreateAlchemistBalanceHistory(deposit, change, event);

  const yieldTokenContract = ERC20Contract.bind(event.params.yieldToken);
  const yieldTokenBalance = yieldTokenContract.balanceOf(event.address);
  const yieldTokenParams = alchemistContract.getYieldTokenParameters(event.params.yieldToken);
  const totalUnderlyingValue = yieldTokenParams.totalShares
    .times(pps)
    .div(BigInt.fromI32(10).pow(yieldTokenParams.decimals as u8));
  const tvl = getOrCreateAlchemistTVL(alchemist, yieldToken, yieldTokenBalance, totalUnderlyingValue);
  const amountChange = tvl.amount.minus(yieldTokenBalance);
  const underlyingValueChange = tvl.underlyingValue.minus(totalUnderlyingValue);

  tvl.amount = yieldTokenBalance;
  tvl.underlyingValue = totalUnderlyingValue;
  tvl.save();

  getOrCreateAlchemistTVLHistory(tvl, amountChange, underlyingValueChange, event);

  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(accountDebt);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
}

export function handleLiquidate1(event: Liquidate1): void {
  const entity = createAlchemistEvent<AlchemistLiquidateEvent>(event);
  entity.owner = event.params.owner;
  entity.shares = event.params.shares;
  entity.yieldToken = event.params.yieldToken;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();

  const alchemistContract = AlchemistContract.bind(event.address);
  const alchemist = getOrCreateAlchemist(event);
  const account = getOrCreateAccount(event.params.owner);
  const yieldToken = getOrCreateYieldToken(event.params.yieldToken);
  const deposit = getOrCreateAlchemistBalance(account, alchemist, yieldToken);
  const accountDebt = account.debt;
  deposit.shares = deposit.shares.minus(event.params.shares);
  const pps = alchemistContract.getUnderlyingTokensPerShare(event.params.yieldToken);
  deposit.underlyingValue = deposit.shares.times(pps);
  deposit.save();

  const change = event.params.shares.times(BigInt.fromI32(-1));
  getOrCreateAlchemistBalanceHistory(deposit, change, event);

  const yieldTokenContract = ERC20Contract.bind(event.params.yieldToken);
  const yieldTokenBalance = yieldTokenContract.balanceOf(event.address);
  const yieldTokenParams = alchemistContract.getYieldTokenParameters(event.params.yieldToken);
  const totalUnderlyingValue = yieldTokenParams.totalShares
    .times(pps)
    .div(BigInt.fromI32(10).pow(yieldTokenParams.decimals as u8));
  const tvl = getOrCreateAlchemistTVL(alchemist, yieldToken, yieldTokenBalance, totalUnderlyingValue);
  const amountChange = tvl.amount.minus(yieldTokenBalance);
  const underlyingValueChange = tvl.underlyingValue.minus(totalUnderlyingValue);

  tvl.amount = yieldTokenBalance;
  tvl.underlyingValue = totalUnderlyingValue;
  tvl.save();

  getOrCreateAlchemistTVLHistory(tvl, amountChange, underlyingValueChange, event);

  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(accountDebt);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
}

export function handleLiquidate2(event: Liquidate2): void {
  const entity = createAlchemistEvent<AlchemistLiquidateEvent>(event);
  entity.owner = event.params.owner;
  entity.shares = event.params.shares;
  entity.yieldToken = event.params.yieldToken;
  entity.underlyingToken = event.params.underlyingToken;
  entity.save();

  const alchemistContract = AlchemistContract.bind(event.address);
  const alchemist = getOrCreateAlchemist(event);
  const account = getOrCreateAccount(event.params.owner);
  const yieldToken = getOrCreateYieldToken(event.params.yieldToken);
  const deposit = getOrCreateAlchemistBalance(account, alchemist, yieldToken);
  deposit.shares = deposit.shares.minus(event.params.shares);
  const pps = alchemistContract.getUnderlyingTokensPerShare(event.params.yieldToken);
  deposit.underlyingValue = deposit.shares.times(pps);
  deposit.save();

  const change = event.params.shares.times(BigInt.fromI32(-1));
  getOrCreateAlchemistBalanceHistory(deposit, change, event);

  const yieldTokenContract = ERC20Contract.bind(event.params.yieldToken);
  const yieldTokenBalance = yieldTokenContract.balanceOf(event.address);
  const yieldTokenParams = alchemistContract.getYieldTokenParameters(event.params.yieldToken);
  const totalUnderlyingValue = yieldTokenParams.totalShares
    .times(pps)
    .div(BigInt.fromI32(10).pow(yieldTokenParams.decimals as u8));
  const tvl = getOrCreateAlchemistTVL(alchemist, yieldToken, yieldTokenBalance, totalUnderlyingValue);
  const amountChange = tvl.amount.minus(yieldTokenBalance);
  const underlyingValueChange = tvl.underlyingValue.minus(totalUnderlyingValue);

  tvl.amount = yieldTokenBalance;
  tvl.underlyingValue = totalUnderlyingValue;
  tvl.save();

  getOrCreateAlchemistTVLHistory(tvl, amountChange, underlyingValueChange, event);

  let alchDebt = getOrCreateAlchemistGlobalDebt(alchemist);
  let newTotalDebt = alchDebt.debt.minus(event.params.credit);
  alchDebt.debt = newTotalDebt;
  alchDebt.save();

  getOrCreateAlchemistGlobalDebtHistory(alchDebt, event);
}
