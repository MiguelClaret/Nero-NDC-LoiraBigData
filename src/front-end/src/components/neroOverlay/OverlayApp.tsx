import React, { useContext } from 'react'
import CustomConnectButton from '../features/connect/CustomConnectButton'
import ScreenRenderer from './ScreenRenderer'
import { SendUserOpContext } from '@/contexts'
import { useScreenManager } from '@/hooks'
import type { Screen } from '@/types'

interface OverlayAppProps {
  mode?: 'sidebar' | 'button'
}

const OverlayApp: React.FC<OverlayAppProps> = ({ mode = 'sidebar' }) => {
  const { isWalletPanel } = useContext(SendUserOpContext)!
  const { currentScreen } = useScreenManager()

  if (mode === 'sidebar') {
    return (
      <div
        className={`fixed transition-transform duration-300 ease-in-out transform ${
          isWalletPanel ? 'translate-x-0' : '-translate-x-[350px]'
        }`} 
        style={{ left: 0, top: '50px' }}
      >
        <div className='absolute -right-12'>
          <CustomConnectButton mode={mode} />
        </div>
        <div className='bg-bg-primary rounded-md' style={{ width: '350px' }}>
          {isWalletPanel && <ScreenRenderer currentScreen={currentScreen as Screen} />}
        </div>
      </div>
    )
  }

  // button mode: anchor at top-left
  return (
    <div>
      <div className='flex justify-start'>
        <CustomConnectButton mode={mode} />
      </div>
      {isWalletPanel && (
        <div className='fixed' style={{ left: 0, top: '100px', width: '350px' }}>
          <div className='bg-bg-primary rounded-md'>
            <ScreenRenderer currentScreen={currentScreen as Screen} />
          </div>
        </div>
      )}
    </div>
  )
}

export default OverlayApp 