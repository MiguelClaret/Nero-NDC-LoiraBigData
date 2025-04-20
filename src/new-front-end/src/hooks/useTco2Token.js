import { useState } from 'react'
import { ethers } from 'ethers'
import abi from '../abi/abiTco2.json'
import { initSmartWallet } from '../walletClient'
import { CONTRACTS } from '../config/contractsConfig'

export function useTCO2Token() {
  const [loading, setLoading] = useState(false)

  const getContract = async () => {
    const smartWallet = await initSmartWallet()
    return new ethers.Contract(CONTRACTS.TCO2Token.address, abi, smartWallet)
  }

  const mintTCO2 = async (to, amount) => {
    setLoading(true)
    try {
      const contract = await getContract()
      const tx = await contract.mint(to, amount)
      await tx.wait()
      return true
    } catch (err) {
      console.error('Error minting TCO2:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const burnTCO2 = async (amount) => {
    setLoading(true)
    try {
      const contract = await getContract()
      const tx = await contract.burn(amount)
      await tx.wait()
      return true
    } catch (err) {
      console.error('Error burning TCO2:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getTCO2Balance = async (walletAddress) => {
    try {
      const contract = await getContract()
      const balance = await contract.balanceOf(walletAddress)
      return ethers.formatUnits(balance, 18)
    } catch (err) {
      console.error('Error fetching balance:', err)
      return "0"
    }
  }

  return {
    mintTCO2,
    burnTCO2,
    getTCO2Balance,
    loading
  }
}
