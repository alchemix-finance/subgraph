import { Address, Entity, ethereum, BigInt } from '@graphprotocol/graph-ts';
import {
  ThreePoolAssetManager,
  ThreePoolAssetManagerAdminUpdatedEvent,
  ThreePoolAssetManagerBurnMetaPoolTokensEvent,
  ThreePoolAssetManagerBurnThreePoolTokensEvent,
  ThreePoolAssetManagerClaimRewardsEvent,
  ThreePoolAssetManagerDepositMetaPoolTokensEvent,
  ThreePoolAssetManagerMetaPoolSlippageUpdatedEvent,
  ThreePoolAssetManagerMintMetaPoolTokensEvent,
  ThreePoolAssetManagerMintThreePoolTokensEvent,
  ThreePoolAssetManagerOperatorUpdatedEvent,
  ThreePoolAssetManagerPendingAdminUpdatedEvent,
  ThreePoolAssetManagerReclaimThreePoolAssetEvent,
  ThreePoolAssetManagerRewardReceiverUpdatedEvent,
  ThreePoolAssetManagerThreePoolSlippageUpdatedEvent,
  ThreePoolAssetManagerTransmuterBufferUpdatedEvent,
  ThreePoolAssetManagerWithdrawMetaPoolTokensEvent,
} from '../generated/schema';
import {
  BurnMetaPoolTokens,
  BurnThreePoolTokens,
  ClaimRewards,
  DepositMetaPoolTokens,
  MintMetaPoolTokens,
  MintMetaPoolTokens1,
  ReclaimThreePoolAsset,
  WithdrawMetaPoolTokens,
} from '../generated/ThreePoolAssetManager_alUSD/ThreePoolAssetManager';
import {
  AdminUpdated,
  MetaPoolSlippageUpdated,
  MintThreePoolTokens,
  MintThreePoolTokens1,
  OperatorUpdated,
  PendingAdminUpdated,
  RewardReceiverUpdated,
  ThreePoolSlippageUpdated,
  TransmuterBufferUpdated,
} from '../generated/ThreePoolAssetManager_alUSD/ThreePoolAssetManager';
import { CONVEX_TOKEN, CURVE_TOKEN, META_POOL_ASSETS, THREE_POOL_ASSETS } from '../utils/constants';
import {
  createEvent,
  getOrCreateThreePoolAssetManagerMetaPoolTokenBalanceHistory,
  getOrCreateThreePoolAssetManagerRewardsHistory,
  getOrCreateThreePoolAssetManagerThreePoolTokenBalanceHistory,
  getOrCreateThreePoolAssetManagerTokenBalance,
  getOrCreateUnderlyingToken,
} from '../utils/entities';

function getOrCreateThreePoolAssetManager(event: ethereum.Event): ThreePoolAssetManager {
  let entity = ThreePoolAssetManager.load(event.address.toHex());

  if (!entity) {
    entity = new ThreePoolAssetManager(event.address.toHex());
    entity.save();
  }

  return entity;
}

function createThreePoolAssetManagerEvent<TEvent extends Entity>(event: ethereum.Event): TEvent {
  const contract = getOrCreateThreePoolAssetManager(event);
  const entity = createEvent<TEvent>(event);
  entity.setString('contract', contract.id);

  return entity;
}

export function handleAdminUpdated(event: AdminUpdated): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerAdminUpdatedEvent>(event);
  entity.admin = event.params.admin;
  entity.save();
}

export function handlePendingAdminUpdated(event: PendingAdminUpdated): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerPendingAdminUpdatedEvent>(event);
  entity.pendingAdmin = event.params.pendingAdmin;
  entity.save();
}

export function handleOperatorUpdated(event: OperatorUpdated): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerOperatorUpdatedEvent>(event);
  entity.operator = event.params.operator;
  entity.save();
}

export function handleRewardReceiverUpdated(event: RewardReceiverUpdated): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerRewardReceiverUpdatedEvent>(event);
  entity.rewardReceiver = event.params.rewardReceiver;
  entity.save();
}

export function handleTransmuterBufferUpdated(event: TransmuterBufferUpdated): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerTransmuterBufferUpdatedEvent>(event);
  entity.transmuterBuffer = event.params.transmuterBuffer;
  entity.save();
}

export function handleThreePoolSlippageUpdated(event: ThreePoolSlippageUpdated): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerThreePoolSlippageUpdatedEvent>(event);
  entity.threePoolSlippage = event.params.threePoolSlippage;
  entity.save();
}

export function handleMetaPoolSlippageUpdated(event: MetaPoolSlippageUpdated): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerMetaPoolSlippageUpdatedEvent>(event);
  entity.metaPoolSlippage = event.params.metaPoolSlippage;
  entity.save();
}

export function handleMintThreePoolTokens(event: MintThreePoolTokens): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerMintThreePoolTokensEvent>(event);
  entity.amounts = event.params.amounts;
  entity.mintedThreePoolTokens = event.params.mintedThreePoolTokens;
  entity.save();
}

export function handleMintThreePoolTokens1(event: MintThreePoolTokens1): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerMintThreePoolTokensEvent>(event);
  entity.asset = event.params.asset;
  entity.amount = event.params.amount;
  entity.mintedThreePoolTokens = event.params.mintedThreePoolTokens;
  entity.save();
}

export function handleBurnThreePoolTokens(event: BurnThreePoolTokens): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerBurnThreePoolTokensEvent>(event);
  entity.asset = event.params.asset;
  entity.amount = event.params.amount;
  entity.withdrawn = event.params.withdrawn;
  entity.save();

  const threePoolAssetManager = getOrCreateThreePoolAssetManager(event);
  const threePoolToken = getOrCreateUnderlyingToken(Address.fromString(THREE_POOL_ASSETS[event.params.asset]));
  const token = getOrCreateThreePoolAssetManagerTokenBalance(threePoolAssetManager, threePoolToken);
  token.amount = token.amount.minus(event.params.amount);
  token.save();

  getOrCreateThreePoolAssetManagerThreePoolTokenBalanceHistory(
    token,
    event.params.amount.times(BigInt.fromI32(-1)),
    event,
  );
}

export function handleMintMetaPoolTokens(event: MintMetaPoolTokens): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerMintMetaPoolTokensEvent>(event);
  entity.amounts = event.params.amounts;
  entity.mintedThreePoolTokens = event.params.mintedThreePoolTokens;
  entity.save();
}

export function handleMintMetaPoolTokens1(event: MintMetaPoolTokens1): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerMintMetaPoolTokensEvent>(event);
  entity.asset = event.params.asset;
  entity.amount = event.params.amount;
  entity.minted = event.params.minted;
  entity.save();
}

export function handleBurnMetaPoolTokens(event: BurnMetaPoolTokens): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerBurnMetaPoolTokensEvent>(event);
  entity.asset = event.params.asset;
  entity.amount = event.params.amount;
  entity.withdrawn = event.params.withdrawn;
  entity.save();

  const threePoolAssetManager = getOrCreateThreePoolAssetManager(event);
  const metaPoolToken = getOrCreateUnderlyingToken(Address.fromString(META_POOL_ASSETS[event.params.asset]));
  const token = getOrCreateThreePoolAssetManagerTokenBalance(threePoolAssetManager, metaPoolToken);
  token.amount = token.amount.minus(event.params.amount);
  token.save();

  getOrCreateThreePoolAssetManagerMetaPoolTokenBalanceHistory(
    token,
    event.params.amount.times(BigInt.fromI32(-1)),
    event,
  );
}

export function handleWithdrawMetaPoolTokens(event: WithdrawMetaPoolTokens): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerWithdrawMetaPoolTokensEvent>(event);
  entity.amount = event.params.amount;
  entity.success = event.params.success;
  entity.save();

  const threePoolAssetManager = getOrCreateThreePoolAssetManager(event);
  const metaPoolToken = getOrCreateUnderlyingToken(Address.fromString(META_POOL_ASSETS[1]));
  const token = getOrCreateThreePoolAssetManagerTokenBalance(threePoolAssetManager, metaPoolToken);
  token.amount = token.amount.plus(event.params.amount);
  token.save();

  getOrCreateThreePoolAssetManagerMetaPoolTokenBalanceHistory(token, event.params.amount, event);
}

export function handleDepositMetaPoolTokens(event: DepositMetaPoolTokens): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerDepositMetaPoolTokensEvent>(event);
  entity.amount = event.params.amount;
  entity.success = event.params.success;
  entity.save();

  const threePoolAssetManager = getOrCreateThreePoolAssetManager(event);
  const metaPoolToken = getOrCreateUnderlyingToken(Address.fromString(META_POOL_ASSETS[1]));
  const token = getOrCreateThreePoolAssetManagerTokenBalance(threePoolAssetManager, metaPoolToken);
  token.amount = token.amount.minus(event.params.amount);
  token.save();

  getOrCreateThreePoolAssetManagerMetaPoolTokenBalanceHistory(
    token,
    event.params.amount.times(BigInt.fromI32(-1)),
    event,
  );
}

export function handleClaimRewards(event: ClaimRewards): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerClaimRewardsEvent>(event);
  entity.success = event.params.success;
  entity.amountCurve = event.params.amountCurve;
  entity.amountConvex = event.params.amountConvex;
  entity.save();

  const threePoolAssetManager = getOrCreateThreePoolAssetManager(event);
  const curveToken = getOrCreateUnderlyingToken(Address.fromString(CURVE_TOKEN));
  const curveState = getOrCreateThreePoolAssetManagerTokenBalance(threePoolAssetManager, curveToken);
  const convexToken = getOrCreateUnderlyingToken(Address.fromString(CONVEX_TOKEN));
  const convexState = getOrCreateThreePoolAssetManagerTokenBalance(threePoolAssetManager, convexToken);
  curveState.amount = curveState.amount.plus(event.params.amountCurve);
  convexState.amount = convexState.amount.plus(event.params.amountConvex);
  curveState.save();
  convexState.save();

  getOrCreateThreePoolAssetManagerRewardsHistory(
    curveState,
    convexState,
    event.params.amountCurve,
    event.params.amountConvex,
    event,
  );
}

export function handleReclaimThreePoolAsset(event: ReclaimThreePoolAsset): void {
  const entity = createThreePoolAssetManagerEvent<ThreePoolAssetManagerReclaimThreePoolAssetEvent>(event);
  entity.asset = event.params.asset;
  entity.amount = event.params.amount;
  entity.save();

  const threePoolAssetManager = getOrCreateThreePoolAssetManager(event);
  const threePoolToken = getOrCreateUnderlyingToken(Address.fromString(THREE_POOL_ASSETS[event.params.asset]));
  const token = getOrCreateThreePoolAssetManagerTokenBalance(threePoolAssetManager, threePoolToken);
  token.amount = token.amount.minus(event.params.amount);
  token.save();

  getOrCreateThreePoolAssetManagerThreePoolTokenBalanceHistory(
    token,
    event.params.amount.times(BigInt.fromI32(-1)),
    event,
  );
}
