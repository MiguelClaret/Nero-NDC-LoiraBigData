import { useState } from 'react'
import { ethers } from 'ethers'
import abi from '../abi/abiNft.json'
import { initSmartWallet } from '../walletClient'
import { CONTRACTS } from '../config/contractsConfig'

export function useNFTCombo() {
  const [loading, setLoading] = useState(false)

  const getContract = async () => {
    const smartWallet = await initSmartWallet()
    return new ethers.Contract(CONTRACTS.NFTCombo.address, abi, smartWallet)
  }

  const mintCombo = async ({ to, crop, quantityKg, tco2, status }) => {
    setLoading(true)
    try {
      const contract = await getContract()
      const tx = await contract.mintCombo(to, crop, quantityKg, tco2, status)
      const receipt = await tx.wait()
      const event = receipt.logs.find(log => log.fragment?.name === 'Transfer')
      const tokenId = event?.args?.tokenId || 0
      return tokenId.toString()
    } catch (err) {
      console.error("Error minting NFT Combo:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getMetadata = async (tokenId) => {
    try {
      const contract = await getContract()
      const uri = await contract.tokenURI(tokenId)
      if (uri.startsWith('data:application/json;base64,')) {
        const base64 = uri.replace('data:application/json;base64,', '')
        const json = atob(base64)
        return JSON.parse(json)
      }
      return { uri }
    } catch (err) {
      console.error("Error fetching token metadata:", err)
      return null
    }
  }

  return {
    loading,
    mintCombo,
    getMetadata
  }
}
