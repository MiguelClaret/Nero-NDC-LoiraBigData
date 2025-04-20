import { useState } from 'react'
import { ethers } from 'ethers'
import abi from '../abi/abiAgri.json'
import { initSmartWallet } from '../walletClient'
import { CONTRACTS } from '../config/contractsConfig'

export function useAgriFinance() {
  const [loading, setLoading] = useState(false)

  const getContract = async () => {
    const smartWallet = await initSmartWallet()
    return new ethers.Contract(CONTRACTS.AgriFinance.address, abi, smartWallet)
  }

  const contributeToFund = async (harvestId, valueInEther) => {
    setLoading(true)
    try {
      const contract = await getContract()
      const tx = await contract.contribute(harvestId, {
        value: ethers.parseEther(valueInEther)
      })
      await tx.wait()
      return true
    } catch (err) {
      console.error("Error contributing to fund:", err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateReputation = async (producerAddress, score) => {
    setLoading(true)
    try {
      const contract = await getContract()
      const tx = await contract.updateReputation(producerAddress, score)
      await tx.wait()
      return true
    } catch (err) {
      console.error("Error updating reputation:", err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getReputation = async (producerAddress) => {
    try {
      const contract = await getContract()
      const score = await contract.getReputation(producerAddress)
      return score.toString()
    } catch (err) {
      console.error("Error fetching reputation:", err)
      return "0"
    }
  }

  const rechargePaymaster = async (valueInEther) => {
    setLoading(true)
    try {
      const contract = await getContract()
      const tx = await contract.rechargePaymaster({
        value: ethers.parseEther(valueInEther)
      })
      await tx.wait()
      return true
    } catch (err) {
      console.error("Error recharging paymaster:", err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getPaymasterBalance = async () => {
    try {
      const contract = await getContract()
      const balance = await contract.getPaymasterBalance()
      return ethers.formatEther(balance)
    } catch (err) {
      console.error("Error fetching paymaster balance:", err)
      return "0"
    }
  }

  const distributeReimbursement = async (harvestId, investors, values) => {
    setLoading(true)
    try {
      const contract = await getContract()
      const tx = await contract.distributeReimbursement(harvestId, investors, values)
      await tx.wait()
      return true
    } catch (err) {
      console.error("Error distributing reimbursement:", err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const consumePaymaster = async (valueInEther) => {
    setLoading(true)
    try {
      const contract = await getContract()
      const wei = ethers.parseEther(valueInEther)
      const tx = await contract.consumePaymaster(wei)
      await tx.wait()
      return true
    } catch (err) {
      console.error("Error consuming paymaster:", err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    contributeToFund,
    updateReputation,
    getReputation,
    rechargePaymaster,
    getPaymasterBalance,
    distributeReimbursement,
    consumePaymaster
  }
}
