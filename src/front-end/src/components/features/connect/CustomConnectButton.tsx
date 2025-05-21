import React, { useEffect, useContext, useState } from 'react'
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import {
  WalletConnectSidebar,
  ToggleWalletVisibilityButton,
  WalletConnectRoundedButton,
} from '@/components/features/connect'
import { SendUserOpContext } from '@/contexts'
import { useSignature } from '@/hooks'
import { CustomConnectButtonProps } from '@/types'

const CustomConnectButton: React.FC<CustomConnectButtonProps> = ({ mode }) => {
  const { isWalletPanel, setIsWalletPanel } = useContext(SendUserOpContext)!
  const { AAaddress } = useSignature()
  const [rbkConnected, setRbkConnected] = useState(false)

  useEffect(() => {
    if (!rbkConnected) {
      setIsWalletPanel(false)
    }
  }, [rbkConnected, setIsWalletPanel])

  const renderButton = (openConnectModal: () => void) => (
    <WalletConnectSidebar onClick={openConnectModal} variant='Connect' />
  )

  return (
    <div>
      <RainbowConnectButton.Custom>
        {({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
          const ready = mounted && authenticationStatus !== 'loading'
          const newRbkConnectedStatus = Boolean(
            ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === 'authenticated'),
          )

          useEffect(() => {
            if (rbkConnected !== newRbkConnectedStatus) {
              setRbkConnected(newRbkConnectedStatus)
            }
          }, [newRbkConnectedStatus])

          if (!ready) return null
          if (chain?.unsupported) {
            return <WalletConnectSidebar variant='Connect' onClick={openChainModal} />
          }

          if (mode === 'button') {
            if (rbkConnected) {
              return (
                <WalletConnectRoundedButton
                  onClick={() => setIsWalletPanel(!isWalletPanel)}
                  AAaddress={AAaddress}
                  isConnected={rbkConnected}
                />
              )
            }
            if (!rbkConnected) {
              return (
                <WalletConnectRoundedButton
                  onClick={openConnectModal}
                  AAaddress={AAaddress}
                  isConnected={rbkConnected}
                />
              )
            }
          }

          if (mode === 'sidebar') {
            if (rbkConnected) {
              return (
                <ToggleWalletVisibilityButton
                  onClick={() => setIsWalletPanel(!isWalletPanel)}
                  size={'sm'}
                  isWalletPanel={isWalletPanel}
                />
              )
            }
            if (!rbkConnected) {
              return renderButton(openConnectModal)
            }
          } else {
            return null
          }
        }}
      </RainbowConnectButton.Custom>
    </div>
  )
}

export default CustomConnectButton
