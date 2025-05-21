import React from 'react'
import { QRCodeCanvas as QRCode } from 'qrcode.react'
import { AiFillCaretLeft } from 'react-icons/ai'
import { CopyButton } from '@/components/ui/buttons'
import { CommonContainerPanel } from '@/components/ui/layout'
import { BottomNavigation, HeaderNavigation } from '@/components/ui/navigation'
import { useScreenManager } from '@/hooks'
import { useActiveWallet } from '@/hooks/useActiveWallet'
import { screens } from '@/types'
import { truncateAddress } from '@/utils'

const ReceivePanel: React.FC = () => {
  const activeWallet = useActiveWallet();
  const displayAddress = activeWallet?.address;

  const { navigateTo } = useScreenManager()

  const handleHomeClick = () => {
    navigateTo(screens.HOME)
  }

  return (
    <CommonContainerPanel footer={<BottomNavigation />}>
      <HeaderNavigation />
      <div className='mx-auto px-6'>
        <div className='flex flex-col'>
          <div className='w-full h-[400px] bg-white rounded-md border border-gray-200 p-3 mt-2'>
            <h2 className='text-xl text-center text-slate-700 mb-3'>Receive</h2>
            <div className='mb-3'>
              <label className='block text-gray-600 text-md mb-1'>Wallet Address</label>
              {displayAddress && (
                <CopyButton textToCopy={displayAddress} className='flex items-center'>
                  <div className='text-md mr-2 text-slate-800'>{truncateAddress(displayAddress)}</div>
                </CopyButton>
              )}
            </div>
            <label className='block text-gray-600 text-md mt-5 mb-2'>QR Code</label>
            <div className='flex justify-center mb-3'>
              <div className='w-48 h-48 flex items-center justify-center border border-gray-300'>
                {displayAddress && <QRCode value={displayAddress} size={180} />}
              </div>
            </div>

            <div className='flex items-left mt-7'>
              <button
                onClick={handleHomeClick}
                className='flex items-center text-sm text-blue-600 hover:text-blue-800 px-2 rounded-full transition-colors'
              >
                <AiFillCaretLeft className='mr-2' />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default ReceivePanel
