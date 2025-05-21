import React, { useState } from 'react'
import { CiPower } from 'react-icons/ci'
import {
  IoChevronUpOutline,
  IoSettingsOutline,
  IoHomeOutline,
  IoArrowBackSharp,
  IoArrowForwardSharp,
  IoCloseOutline,
} from 'react-icons/io5'
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md'
import NEROIcon from '@/assets/NERO-icon.png'
import { useResetContexts, useScreenManager, useActiveWallet } from '@/hooks'
import { ToggleWalletVisibilityButtonProps, screens } from '@/types'

const ToggleWalletVisibilityButton: React.FC<ToggleWalletVisibilityButtonProps> = ({
  onClick,
  isWalletPanel,
}) => {
  const activeWallet = useActiveWallet();
  const { navigateTo } = useScreenManager()
  const { resetAllContexts } = useResetContexts()
  const [showButtons, setShowButtons] = useState<boolean>(true)

  const handleNavigation = (action: () => void) => {
    if (!isWalletPanel) {
      onClick()
    }
    resetAllContexts()
    action()
  }

  const handleDisconnect = async () => {
    resetAllContexts();
    if (activeWallet?.logout) {
      console.log("Calling global logout from overlay button...");
      activeWallet.logout();
    } else {
      console.warn("Global logout function not found in context. Attempting direct disconnect (if applicable).");
    }
    navigateTo(screens.HOME);
  }

  return (
    <div
      className={`w-12 ${showButtons ? 'h-[500px]' : 'h-[100px]'} bg-white/90 backdrop-blur-sm border border-slate-200 shadow-md rounded-lg flex flex-col items-center transition-all duration-300`}
    >
      <div className='flex-1 flex flex-col items-center gap-6 pt-4'>
        <div className='w-8 h-8'>
          <img src={NEROIcon} alt='nero' className='w-full h-full' />
        </div>

        {showButtons && (
          <>
            <button
              onClick={() => handleNavigation(() => navigateTo(screens.HOME))}
              className='w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors'
            >
              <IoHomeOutline size={20} />
            </button>

            <button
              onClick={() => handleNavigation(() => navigateTo(screens.SEND))}
              className='w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors'
            >
              <IoArrowBackSharp size={24} style={{ transform: 'rotate(135deg)' }} />
            </button>

            <button
              onClick={() => handleNavigation(() => navigateTo(screens.MULTISEND))}
              className='w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors'
            >
              <MdKeyboardDoubleArrowLeft size={24} style={{ transform: 'rotate(135deg)' }} />
            </button>

            <button
              onClick={() => handleNavigation(() => navigateTo(screens.RECEIVE))}
              className='w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors'
            >
              <IoArrowForwardSharp size={24} style={{ transform: 'rotate(135deg)' }} />
            </button>

            <button
              onClick={() => handleNavigation(() => navigateTo(screens.SETTING))}
              className='w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors'
            >
              <IoSettingsOutline size={24} />
            </button>

            <button
              onClick={onClick}
              className='w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors'
            >
              <IoCloseOutline size={24} />
            </button>
          </>
        )}
      </div>

      <div className='pb-4 flex flex-col gap-4'>
        <button
          onClick={() => setShowButtons((prev) => !prev)}
          className={`w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors transform ${
            !showButtons ? 'rotate-180' : ''
          }`}
        >
          <IoChevronUpOutline size={24} />
        </button>
        {showButtons && (
          <button
            onClick={handleDisconnect}
            className='w-8 h-8 flex items-center justify-center text-green-500 hover:text-green-700 transition-colors'
          >
            <CiPower size={24} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ToggleWalletVisibilityButton
