import React, { useEffect, useState } from 'react'
import { FaGift } from 'react-icons/fa'
import { GoArrowSwitch } from 'react-icons/go'
import { MdAdsClick } from 'react-icons/md'
import { PaymentOption, TokenList, ErrorDisplay } from './components'
import { TokenIcon } from '@/components/features/token'
import { usePaymasterUI } from '@/hooks'
import { approveTokenForPaymaster } from '@/utils/aaUtils'
import { getSimpleAccountBuilder } from '@/userOp/userOpBuilder'
import { sendUserOperation } from '@/userOp/userOpClient'
import { useWalletClient, useAccount } from 'wagmi'

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
  } = usePaymasterUI()

  const { data: walletClient } = useWalletClient()
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!walletClient) {
      console.log("[Paymaster] Wallet não conectada");
    } else {
      console.log("[Paymaster] Wallet conectada:", address);
    }
  }, [walletClient, address]);

  useEffect(() => {
    if (walletClient) {
      fetchTokens();
    }
  }, [fetchTokens, walletClient]);

  const handleApprove = async (tokenAddress: string) => {
    if (!walletClient) {
      alert("Conecte a carteira primeiro.")
      return
    }
    try {
      setLoading(true)
      console.log(`[Paymaster] Aprovando token ${tokenAddress}...`)
      await approveTokenForPaymaster(walletClient, tokenAddress, '1000000000000000000000')
      alert("Token aprovado com sucesso!")
    } catch (error) {
      console.error("[Paymaster] Erro ao aprovar token:", error)
      alert("Erro ao aprovar token")
    } finally {
      setLoading(false)
    }
  }

  const handleSendTransaction = async () => {
    if (!walletClient) {
      alert("Conecte a carteira primeiro.")
      return
    }

    if (!selectedToken) {
      alert("Selecione um token primeiro.")
      return
    }

    try {
      setLoading(true)
      console.log("[Paymaster] Iniciando transação...")

      const builder = await getSimpleAccountBuilder(walletClient, selectedToken)
      const userOperation = await builder.buildOp({
        target: address,
        data: "0x",
        value: "0x0"
      })

      console.log("[Paymaster] Enviando transação para o bundler...")
      const result = await sendUserOperation(userOperation)
      alert(`Transação enviada! Hash: ${result.userOpHash}`)
    } catch (error) {
      console.error("[Paymaster] Erro ao enviar transação:", error)
      alert("Erro ao enviar transação")
    } finally {
      setLoading(false)
    }
  }

  if (isLoading && !localError) return <div>Loading supported tokens...</div>

  if (error || localError) {
    return <ErrorDisplay error={localError || error} onRetry={handleRetry} />
  }

  return (
    <div className='w-full bg-white rounded-xl flex flex-col space-y-2 p-1 relative'>
      <div className='text-sm text-text-secondary'>Selecione o Método de Pagamento</div>

      <TokenList
        tokens={supportedTokens}
        selectedToken={selectedToken}
        scrollContainerRef={scrollContainerRef}
        onTokenClick={(token) => {
          handleTokenClick(token)
          handleApprove(token.token)
        }}
        onScrollLeft={scrollLeft}
        onScrollRight={scrollRight}
        onBackClick={handleBackToSelection}
      />

      <button
        disabled={loading}
        className="mt-4 bg-blue-500 text-white p-2 rounded-md"
        onClick={handleSendTransaction}
      >
        {loading ? "Enviando Transação..." : "Enviar Transação"}
      </button>
    </div>
  )
}

export default PaymasterPanel
