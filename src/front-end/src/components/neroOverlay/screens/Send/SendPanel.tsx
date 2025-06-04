import React, { useState, useContext, useEffect } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { PaymasterPanel } from '@/components/features/paymaster'
import { TokenSelect } from '@/components/features/token'
import { SendDetail } from '@/components/screens/Send'
import { Button } from '@/components/ui/buttons'
import { AmountInput, ToInput, TokenSelectInput } from '@/components/ui/inputs'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { SendContext } from '@/contexts'
import { useScreenManager, usePaymasterContext } from '@/hooks'
import { Token, screens } from '@/types'
import { validateAmount } from '@/utils'

const SendPanel: React.FC = () => {
  const { navigateTo } = useScreenManager()
  const {
    recipientAddress,
    setRecipientAddress,
    clearRecipientAddress,
    selectedToken,
    setSelectedToken,
    clearSelectedToken,
    setBalance,
    clearBalance,
    isTransferEnabled,
  } = useContext(SendContext)!
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [isSendDetailOpen, setIsSendDetailOpen] = useState(false)
  const { clearToken, selectedMode, isPaymentSelected } = usePaymasterContext()
  const [inputAmount, setInputAmount] = useState('')
  const [isValidAmount, setIsValidAmount] = useState(false)

  useEffect(() => {
    setInputAmount('')
    setIsValidAmount(false)
  }, [selectedToken])

  useEffect(() => {
    const isValid = validateAmount(inputAmount, selectedToken.balance, selectedToken.decimals)
    setIsValidAmount(isValid)
  }, [inputAmount, selectedToken])

  const handleSelectToken = (token: Token) => {
    setSelectedToken({
      symbol: token.symbol,
      balance: token.balance,
      contractAddress: token.contractAddress,
      isNative: token.isNative,
      type: 'ERC-20',
      decimals: token.decimals,
      name: token.name,
    })
    setBalance(token.balance)
    setInputAmount('0')
    setIsTokenModalOpen(false)
  }

  const handleHomeClick = () => {
    clearToken()
    clearRecipientAddress()
    clearSelectedToken()
    clearBalance()
    navigateTo(screens.HOME)
  }

  const isTransferReady =
    isTransferEnabled && isValidAmount && selectedMode?.value !== undefined && isPaymentSelected

  if (isTokenModalOpen) {
    return (
      <TokenSelect onClose={() => setIsTokenModalOpen(false)} onSelectToken={handleSelectToken} />
    )
  }

  if (isSendDetailOpen) {
    return <SendDetail />
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-4 sm:px-6'>
        <div className='flex flex-col flex-grow'>
          <div className='w-full bg-white rounded-md border border-border-primary p-4 sm:p-6 mt-2 min-h-[480px] relative'>
            <h2 className='text-xl text-center text-text-secondary mb-4 sm:mb-6'>Send</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <ToInput
                recipientAddress={recipientAddress}
                setRecipientAddress={setRecipientAddress}
                variant='send'
              />
              
              <TokenSelectInput
                selectedToken={selectedToken}
                onOpenModal={() => setIsTokenModalOpen(true)}
                variant='send'
              />
              
              <AmountInput
                inputAmount={inputAmount}
                setInputAmount={setInputAmount}
                setBalance={setBalance}
                selectedToken={selectedToken}
                variant='send'
              />
              
              <div className="py-2">
                <label className='block text-text-secondary text-sm mb-1'>Total</label>
                <div className='text-lg font-medium text-text-primary'>
                  {inputAmount && selectedToken.symbol
                    ? `${inputAmount} ${selectedToken.symbol}`
                    : 'Please enter amount and token'}
                </div>
              </div>
              
              <PaymasterPanel />
            </div>
            
            {/* Action buttons - responsive positioning */}
            <div className='flex justify-between items-center mt-6 sm:mt-8 pt-4 border-t border-gray-100'>
              <Button
                onClick={handleHomeClick}
                variant='text'
                icon={AiFillCaretLeft}
                iconPosition='left'
                className='flex items-center text-sm text-text-primary hover:text-blue-600 transition-colors'
              >
                Back
              </Button>
              <Button
                onClick={() => setIsSendDetailOpen(true)}
                disabled={!isTransferReady}
                variant={isTransferReady ? 'primary' : 'secondary'}
                className={`px-6 py-2 text-sm font-medium ${
                  isTransferReady 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default SendPanel
