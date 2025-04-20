import HarvestManagerABI from '../abi/abiHarvest.json'
import TCO2TokenABI from '../abi/abiTco2.json'
import NFTComboABI from '../abi/abiNft.json'
import AgriFinanceABI from '../abi/abiAgri.json'

export const CONTRACTS = {
  harvestManager: {
    address: '0x0fC5025C764cE34df352757e82f7B5c4Df39A836', //
    abi: HarvestManagerABI,
  },
  tco2Token: {
    address: '0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3',
    abi: TCO2TokenABI,
  },
  nftCombo: {
    address: '0xddaAd340b0f1Ef65169Ae5E41A8b10776a75482d',
    abi: NFTComboABI,
  },
  agriFinance: {
    address: '0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99',
    abi: AgriFinanceABI,
  },
}
