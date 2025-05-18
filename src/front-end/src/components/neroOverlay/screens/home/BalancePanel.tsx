import React from 'react'
import { useBalance } from 'wagmi'
import { TokenIcon, TokenAmount, TruncatedText } from '@/components/features/token'
import { BalanceBottomNavigation } from '@/components/ui/navigation'
import { useActiveWallet } from '@/hooks/useActiveWallet'
import { BalancePanelProps } from '@/types'
import { formatAndRoundBalance } from '@/utils'
import SimpleAccountFactoryAbi from '@/abis/SimpleAccountFactory.json';
import SimpleAccountAbi from '@/abis/SimpleAccount.json';

const BalancePanel: React.FC<BalancePanelProps> = ({
  showIcon = false,
  showBalanceLabel = true,
}) => {
  const activeWallet = useActiveWallet();
  const displayAddress = activeWallet?.address;

  const { data, isLoading } = useBalance({ address: displayAddress as `0x${string}` | undefined })

  const accountBalance = data?.value ? formatAndRoundBalance(data.value.toString()) : '0'

  return (
    <>
      <div className='bg-white h-31 rounded-md mx-auto border border-gray-200 mt-3'>
        <div className='p-6 mb-2'>
          {showIcon && (
            <div className='flex items-center pb-3'>
              <TokenIcon
                tokenAddress='0x'
                symbol='NERO'
                isNative={true}
                size='sm'
                className='mr-2'
              />
              <TruncatedText text={'NERO'} fontSize='sm' maxWidth='max-w-[200px]' />
            </div>
          )}
          {showBalanceLabel && <p className='text-sm text-gray-600 pb-3'>Balance</p>}
          <div className='flex justify-center'>
            {isLoading ? (
              <p className='text-2xl text-gray-700'>Loading balance...</p>
            ) : (
              <TokenAmount
                amount={accountBalance}
                symbol='NERO'
                amountFontSize='text-4xl'
                symbolClassName='text-2xl text-slate-700'
                containerClassName='break-all'
              />
            )}
          </div>
        </div>
      </div>

      <div className='mx-auto mt-4'>
        <BalanceBottomNavigation />
      </div>
    </>
  )
}

export default BalancePanel
