import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Define custom network
const polkadotHubTestnet = {
  id: 420420422,
  name: 'Polkadot Hub TestNet',
  nativeCurrency: {
    name: 'PAS',
    symbol: 'PAS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-passet-hub-eth-rpc.polkadot.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout-passet-hub.parity-testnet.parity.io/',
    },
  },
  testnet: true,
}

// Get projectId from https://cloud.reown.com
const projectId = '5ab64d8ffed5ad84e4720bc662c0812d'

// Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [polkadotHubTestnet],
  projectId,
  ssr: true,
})

// Export the network for use in components
export { polkadotHubTestnet }

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [polkadotHubTestnet],
  projectId,
  features: {
    analytics: false,
    email: false,
    socials: false,
    emailShowWallets: false,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': 'rgba(255,255,255,1)',
    '--w3m-color-mix-strength': 0,
    '--w3m-accent': '255, 255, 255',
    '--w3m-background': '255, 255, 255',
    '--w3m-overlay': '255, 255, 255',
    '--w3m-container': '255, 255, 255',
    '--w3m-text-primary': '0, 0, 0',
    '--w3m-text-secondary': '100, 100, 100',
    '--w3m-border': '200, 200, 200',
    '--w3m-shadow': '0, 0, 0',
  } as any,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
})