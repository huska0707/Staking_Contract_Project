import { useMemo } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi'
import { providers } from 'ethers'
import { Web3 } from 'web3';

export function walletClientToSigner(walletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}