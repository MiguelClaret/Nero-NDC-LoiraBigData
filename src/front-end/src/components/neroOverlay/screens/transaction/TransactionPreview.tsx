import React, { useState, useEffect } from 'react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { TransactionDetailCard } from '@/components/ui/cards'
import { LoadingScreen } from '@/components/ui/feedback'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { useConfig, useScreenManager } from '@/hooks'
import { TransactionPreviewProps, screens } from '@/types'

const TransactionPreview: React.FC<TransactionPreviewProps> = ({
  from,
  to,
  networkFee,
  gasTokenSymbol,
  onClose,
  onConfirm,
  onReset,
  children,
  title = 'Send Detail',
}) => {
  const { navigateTo } = useScreenManager()
  const { networkType } = useConfig()
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [userOpResult, setUserOpResult] = useState(false)

  // Check if gas is being calculated - improved logic
  const isCalculatingGas = networkFee === 'Calculating...'
  const shouldDisableConfirm = loading || completed

  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => {
        setCompleted(false)
        if (onReset) onReset()
        navigateTo(screens.ACTIVITY)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [completed, navigateTo, onReset])

  const handleConfirm = async () => {
    if (!onConfirm) return

    try {
      setLoading(true)
      const result = await onConfirm()
      setUserOpResult(result)
      setLoading(false)
      setCompleted(true)
    } catch (err) {
      console.error('Transaction confirmation failed:', err)
      setUserOpResult(false)
      setLoading(false)
      setCompleted(true)
    }
  }

  const getConfirmButtonLabel = () => {
    if (loading) return 'Processing...'
    if (isCalculatingGas && networkFee === 'Calculating...') return 'Calculating Gas...'
    return 'Confirm Send'
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto relative px-4 sm:px-6'>
        <div className='flex flex-col flex-grow'>
          <div className='w-full bg-white rounded-md border border-border-primary p-4 sm:p-6 mt-2 min-h-[400px]'>
            <h2 className='text-lg sm:text-xl text-center text-text-secondary mb-4 sm:mb-6'>{title}</h2>
            
            <div className="mb-6">
              <TransactionDetailCard
                from={from}
                to={to}
                networkFee={networkFee}
                gasTokenSymbol={gasTokenSymbol}
                networkType={networkType}
              >
                {children}
              </TransactionDetailCard>
            </div>
            
            {/* Show warning if gas calculation is taking too long */}
            {isCalculatingGas && networkFee === 'Calculating...' && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  ⏳ Estimating transaction fee... This may take a moment.
                </p>
              </div>
            )}
            
            {/* Custom Action Buttons - Mobile Optimized */}
            <div className="mt-auto">
              <div className='flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mt-6 pt-4 border-t border-gray-200'>
                {/* Back Button */}
                <button
                  onClick={onClose}
                  className='flex items-center justify-center sm:justify-start text-sm text-black hover:text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors min-h-[48px] font-medium border border-gray-300'
                  style={{ touchAction: 'manipulation' }}
                >
                  <AiFillCaretLeft className='mr-2' />
                  Back
                </button>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirm}
                  disabled={shouldDisableConfirm}
                  className={`py-3 px-8 rounded-lg font-medium text-base min-h-[48px] transition-all ${
                    shouldDisableConfirm
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg active:bg-green-800'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {getConfirmButtonLabel()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {(loading || completed) && (
        <LoadingScreen
          message={loading ? 'Processing transaction...' : 'Transaction completed'}
          isCompleted={completed}
          userOpResult={userOpResult}
        />
      )}
    </CommonContainerPanel>
  )
}

export default TransactionPreview
