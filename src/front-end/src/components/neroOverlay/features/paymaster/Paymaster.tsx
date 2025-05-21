import React, { useEffect } from 'react'
import { FaGift } from 'react-icons/fa'
import { GoArrowSwitch } from 'react-icons/go'
import { MdAdsClick } from 'react-icons/md'
import { PaymentOption, TokenList, ErrorDisplay } from './components'
import { TokenIcon } from '@/components/features/token'
import { usePaymasterUI } from '@/hooks'
import { PAYMASTER_MODE } from '@/types/Paymaster'

const PaymasterPanel: React.FC = () => {
  const {
    screen,
    isFlipped,
    setIsFlipped,
    localError,
    isLoading,
    error,
    supportedTokens,
    sponsorshipInfo,
    selectedToken,
    isSponsoredSelected,
    scrollContainerRef,
    fetchTokens,
    handleRetry,
    handleTokenClick,
    scrollLeft,
    scrollRight,
    handleSelectPaymentType,
    handleBackToSelection,
    setSponsoredGas,
    setTokenPayment,
    selectedMode,
  } = usePaymasterUI()

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  if (isLoading && !localError) return <div>Loading supported tokens...</div>

  if (error || localError) {
    return <ErrorDisplay error={localError || error} onRetry={handleRetry} />
  }

  if (screen === 'selection') {
    return (
      <div className='w-full bg-white rounded-xl flex flex-col space-y-2 p-1 relative'>
        <div className='absolute top-2 right-2 z-10'>
          <GoArrowSwitch
            className='text-xl text-gray-500 hover:text-gray-700 cursor-pointer transition-transform duration-300 hover:rotate-180'
            onClick={() => setIsFlipped(!isFlipped)}
          />
        </div>

        <div className='text-sm text-text-secondary'>Select Payment Method</div>

        <div className="flex flex-col gap-2 mt-2">
          {/* Sponsored Gas Option */}
          <PaymentOption
            isSelected={selectedMode.value === PAYMASTER_MODE.FREE_GAS}
            isDisabled={!sponsorshipInfo.freeGas}
            onClick={() => {
              if (sponsorshipInfo.freeGas) setSponsoredGas()
            }}
            icon={
              <FaGift
                className={`text-xs ${
                  selectedMode.value === PAYMASTER_MODE.FREE_GAS
                    ? 'text-white scale-110'
                    : sponsorshipInfo.freeGas
                      ? 'text-white'
                      : 'text-gray-400'
                }`}
              />
            }
            title='Sponsored Gas'
            subtitle={
              sponsorshipInfo.freeGas
                ? 'Free transactions available'
                : 'Sponsored transactions not available'
            }
            rightIcon={sponsorshipInfo.freeGas ? <MdAdsClick className='text-md' /> : undefined}
          />

          {/* ERC-20 Pré-pagamento */}
          <PaymentOption
            isSelected={selectedMode.value === PAYMASTER_MODE.PRE_FUND}
            isDisabled={supportedTokens.length === 0}
            onClick={() => {
              if (supportedTokens.length > 0) setTokenPayment(supportedTokens[0]?.token, PAYMASTER_MODE.PRE_FUND)
            }}
            icon={
              <TokenIcon
                tokenAddress={supportedTokens[0]?.token}
                symbol={supportedTokens[0]?.symbol}
                size='xs'
                isNative={supportedTokens[0]?.type === 'native'}
              />
            }
            title='Pay with Token (Pré-pagamento)'
            subtitle={
              supportedTokens.length > 0
                ? `${supportedTokens.length} tokens available`
                : 'No tokens available'
            }
            rightIcon={supportedTokens.length > 0 ? <MdAdsClick className='text-md' /> : undefined}
          />

          {/* ERC-20 Pós-pagamento */}
          <PaymentOption
            isSelected={selectedMode.value === PAYMASTER_MODE.POST_FUND}
            isDisabled={supportedTokens.length === 0}
            onClick={() => {
              if (supportedTokens.length > 0) setTokenPayment(supportedTokens[0]?.token, PAYMASTER_MODE.POST_FUND)
            }}
            icon={
              <TokenIcon
                tokenAddress={supportedTokens[0]?.token}
                symbol={supportedTokens[0]?.symbol}
                size='xs'
                isNative={supportedTokens[0]?.type === 'native'}
              />
            }
            title='Pay with Token (Pós-pagamento)'
            subtitle={
              supportedTokens.length > 0
                ? `${supportedTokens.length} tokens available`
                : 'No tokens available'
            }
            rightIcon={supportedTokens.length > 0 ? <MdAdsClick className='text-md' /> : undefined}
          />
        </div>
      </div>
    )
  }

  return (
    <TokenList
      tokens={supportedTokens}
      selectedToken={selectedToken}
      scrollContainerRef={scrollContainerRef}
      onTokenClick={handleTokenClick}
      onScrollLeft={scrollLeft}
      onScrollRight={scrollRight}
      onBackClick={handleBackToSelection}
    />
  )
}

export default PaymasterPanel
