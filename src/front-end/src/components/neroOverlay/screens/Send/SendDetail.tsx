import React, { useState, useEffect, useContext } from 'react'
import { ethers } from 'ethers'
import { parseEther, parseUnits } from 'viem'
import ERC20 from '@/abis/ERC20/ERC20.json'
import { TokenIcon } from '@/components/features/token'
import { TransactionPreview } from '@/components/screens/transaction'
import { SendContext } from '@/contexts'
import {
  useSimpleAccount,
  useAAtransfer,
  useResetContexts,
  useScreenManager,
  usePaymasterContext,
  usePaymasterMode,
} from '@/hooks'
import { useEstimateUserOpFee } from '@/hooks/operation/useEstimateUserOpFee'
import { screens } from '@/types'
import { getSelectedTokenSymbol } from '@/utils'

const SendDetail: React.FC = () => {
  const { navigateTo } = useScreenManager()
  const { resetAllContexts } = useResetContexts()
  const {
    recipientAddress,
    selectedToken,
    balance,
    clearRecipientAddress,
    clearSelectedToken,
    clearBalance,
  } = useContext(SendContext)!
  const [estimatedGasCost, setEstimatedGasCost] = useState<string>('Calculating...')
  const [gasCalculationTimeout, setGasCalculationTimeout] = useState(false)
  const { AAaddress, simpleAccountInstance } = useSimpleAccount()
  const { transfer } = useAAtransfer()
  const {
    paymaster,
    selectedToken: paymasterSelectedToken,
    supportedTokens,
  } = usePaymasterContext()
  const { paymasterModeValue, isFreeGasMode } = usePaymasterMode()
  const { estimateUserOpFee } = useEstimateUserOpFee()

  useEffect(() => {
    const estimateGasCost = async () => {
      if (!recipientAddress || !balance || !AAaddress || AAaddress === '0x') {
        setEstimatedGasCost('0.0001')
        return
      }

      try {
        // Set a timeout for gas calculation (10 seconds)
        const timeoutId = setTimeout(() => {
          console.warn('Gas estimation timed out, using default value')
          setEstimatedGasCost('0.001')
          setGasCalculationTimeout(true)
        }, 10000)

        if (isFreeGasMode) {
          clearTimeout(timeoutId)
          setEstimatedGasCost('0')
          return
        }

        const operations = []
        if (selectedToken.isNative) {
          operations.push({
            contractAddress: recipientAddress,
            abi: ['function receive() payable'],
            function: 'receive',
            params: [],
            value: parseEther(balance),
          })
        } else {
          operations.push({
            contractAddress: selectedToken.contractAddress,
            abi: ERC20,
            function: 'transfer',
            params: [recipientAddress, parseUnits(balance, Number(selectedToken.decimals))],
            value: ethers.constants.Zero,
          })
        }

        const fee = await estimateUserOpFee(
          operations,
          paymaster,
          paymasterSelectedToken || undefined,
          paymasterModeValue,
        )
        
        clearTimeout(timeoutId)
        setEstimatedGasCost(fee || '0.001')
      } catch (error) {
        console.error('Error setting estimated gas cost:', error)
        setEstimatedGasCost('0.001') // Use a reasonable default
      }
    }

    estimateGasCost()
  }, [
    recipientAddress,
    balance,
    AAaddress,
    selectedToken,
    paymaster,
    paymasterSelectedToken,
    paymasterModeValue,
    estimateUserOpFee,
    isFreeGasMode,
  ])

  const executeTransfer = async () => {
    if (!simpleAccountInstance) {
      return Promise.reject('SimpleAccount is not initialized')
    }

    const tokenAddress = selectedToken.isNative
      ? ethers.constants.AddressZero
      : selectedToken.contractAddress

    try {
      const result = await transfer(
        recipientAddress,
        balance,
        tokenAddress,
        paymaster,
        paymasterSelectedToken || undefined,
        paymasterModeValue,
      )
      return result
    } catch (error) {
      console.error('Transfer failed:', error)
      throw error
    }
  }

  const handleClose = () => {
    clearRecipientAddress()
    clearSelectedToken()
    clearBalance()
    navigateTo(screens.HOME)
  }

  const amountContent = (
    <div className="px-2">
      <label className='block text-text-secondary text-sm mb-1'>Amount</label>
      <div className='flex items-center mt-1 mb-3'>
        <TokenIcon
          tokenAddress={selectedToken.contractAddress}
          symbol={selectedToken.symbol}
          isNative={selectedToken.isNative}
          size='md'
          className='mr-3 flex-shrink-0'
          token={selectedToken}
        />
        <div className='flex items-center w-full min-w-0'>
          <div className='text-lg sm:text-xl flex-1 pl-2 overflow-hidden text-ellipsis whitespace-nowrap'>
            {balance} {selectedToken.symbol}
          </div>
        </div>
      </div>
      {gasCalculationTimeout && (
        <div className="text-xs text-yellow-600 mb-2">
          ⚠️ Gas estimation timed out. Using default estimate.
        </div>
      )}
    </div>
  )

  if (!selectedToken || !balance) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading transaction details...</p>
      </div>
    )
  }

  return (
    <TransactionPreview
      from={AAaddress}
      to={recipientAddress}
      networkFee={estimatedGasCost}
      gasTokenSymbol={getSelectedTokenSymbol(paymaster, paymasterSelectedToken, supportedTokens)}
      onClose={handleClose}
      onConfirm={executeTransfer}
      onReset={resetAllContexts}
      title="Confirm Send"
    >
      {amountContent}
    </TransactionPreview>
  )
}

export default SendDetail
