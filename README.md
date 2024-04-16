# Alchemix Subgraph

## Quickstart

```bash
# Boot docker containers (wait until graph-node is ready)
docker-compose up -d

# Install node dependencies
yarn install

# Deploy subgraph
yarn codegen
yarn deploy
```

## Deploying to Goldsky

# to deploy on goldsky

```bash
# use api key in login prompt
goldsky login

yarn codegen
yarn build

# change the version number otherwise it will overwrite existing subgraph
# current goldsky plan has 3 subgraph limit so may need to delete older version before deploying
goldsky subgraph deploy alchemix-mainnet/1.0.0 --path ./build

```
