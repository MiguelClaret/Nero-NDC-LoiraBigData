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
      <div className='mx-auto px-4 sm:px-6 py-4'>
        <div className='flex flex-col'>
          <div className='w-full bg-white rounded-md border border-gray-200 p-4 sm:p-6 mt-2'>
            <h2 className='text-xl sm:text-2xl text-center text-slate-700 mb-4 sm:mb-6'>Receive Funds</h2>
            
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm sm:text-md font-medium mb-1'>Wallet Address</label>
              {displayAddress && (
                <div className="bg-gray-50 p-3 rounded-md flex items-center justify-between break-all">
                  <span className="text-xs sm:text-sm text-slate-800 font-mono mr-2">{displayAddress}</span>
                  <CopyButton textToCopy={displayAddress} variant="icon" />
                </div>
              )}
              {!displayAddress && <p className="text-sm text-gray-500">Wallet address not available.</p>}
            </div>

            <label className='block text-gray-700 text-sm sm:text-md font-medium mt-5 mb-2'>QR Code</label>
            <div className='flex justify-center mb-4'>
              <div className='w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center border border-gray-300 bg-white p-2 rounded-md'>
                {displayAddress ? (
                  <QRCode value={displayAddress} size={180} includeMargin={true} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Address not available
                  </div>
                )}
              </div>
            </div>

            <div className='flex items-center justify-start mt-6 sm:mt-8'>
              <button
                onClick={handleHomeClick}
                className='flex items-center text-sm text-blue-600 hover:text-blue-700 py-2 px-3 rounded-md hover:bg-blue-50 transition-colors duration-150'
              >
                <AiFillCaretLeft className='mr-1' />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </CommonContainerPanel>
  )
}

export default ReceivePanel
