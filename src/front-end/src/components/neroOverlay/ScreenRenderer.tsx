import React from 'react';
import { screens, Screen } from '@/types';
import { SendPanel, SendUserOpPanel } from './screens/Send';
import MultiSendPanel from './screens/multiSend/MultiSendPanel';
import MultiSendPreviewPanel from './screens/multiSend/MultiSendPreviewPanel';
import MultiSendConfirmPanel from './screens/multiSend/MultiSendConfirmPanel';
import ReceivePanel from './screens/receive/ReceivePanel';
import SettingPanel from './screens/setting/SettingPanel';
import WalletPanel from './screens/home/WalletPanel';
import ExpandedTabContent from './screens/home/tabContents/ExpandedTabContent';
import TokenIndex from './screens/Token/TokenIndex';
import TokenDetail from '@/components/neroOverlay/features/token/containers/TokenDetail';
import NEROTokenDetail from '@/components/neroOverlay/features/token/containers/NEROTokenDetail';
import NFTDetail from './screens/NFT/NFTDetail';
import NFTTransferPanel from './screens/NFT/TransferPanel';
import NFTTransferPreview from './screens/NFT/NFTTransferPreview';

interface ScreenRendererProps {
  currentScreen: Screen;
}

const ScreenRenderer: React.FC<ScreenRendererProps> = ({ currentScreen }) => {
  switch (currentScreen) {
    case screens.HOME:
      return <WalletPanel />;
    case screens.SEND:
      return <SendPanel />;
    case screens.SENDUSEROP:
      return <SendUserOpPanel />;
    case screens.MULTISEND:
      return <MultiSendPanel />;
    case screens.MULTISENDDETAIL:
      return <MultiSendPreviewPanel />;
    case screens.MULTISENDCONFIRM:
      return <MultiSendConfirmPanel />;
    case screens.RECEIVE:
      return <ReceivePanel />;
    case screens.SETTING:
      return <SettingPanel />;
    case screens.NFT:
      return <ExpandedTabContent tab='NFTs' />;
    case screens.NFTDETAIL:
      return <NFTDetail />;
    case screens.NFTTRANSFER:
      return <NFTTransferPanel />;
    case screens.NFTTRANSFERPREVIEW:
      return <NFTTransferPreview />;
    case screens.TOKEN:
      return <ExpandedTabContent tab='Tokens' />;
    case screens.TOKENINDEX:
      return <TokenIndex />;
    case screens.TOKENDETAIL:
      return <TokenDetail />;
    case screens.NEROTOKENDETAIL:
      return <NEROTokenDetail />;
    case screens.ACTIVITY:
      return <WalletPanel initialTab='Activity' />;
    default:
      return <WalletPanel />;
  }
};

export default ScreenRenderer; 