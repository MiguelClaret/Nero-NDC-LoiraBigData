import { ethers } from 'ethers'
import { BundlerJsonRpcProvider, Presets, UserOperationBuilder } from 'userop'
import { ERC4337 } from '@account-abstraction/utils'
import type { BigNumberish, BytesLike } from 'ethers'
import type { IPresetBuilderOpts, UserOperationMiddlewareFn } from 'userop'
import { ERC20_ABI, ERC721_ABI } from '@/constants/abi'
import SimpleAccountFactoryAbi from '@/abis/SimpleAccountFactory.json'
import IEntryPointAbi from '@/abis/IEntryPoint.json'
import SimpleAccountAbi from '@/abis/SimpleAccount.json'

const { getGasPrice, estimateUserOperationGas, EOASignature } = Presets.Middleware

export class SimpleAccount extends UserOperationBuilder {
  private signer: ethers.Signer
  private provider: ethers.providers.JsonRpcProvider
  private entryPoint: ethers.Contract
  private factory: ethers.Contract
  private initCode: string
  proxy: ethers.Contract

  private constructor(signer: ethers.Signer, rpcUrl: string, opts?: IPresetBuilderOpts) {
    super()
    this.signer = signer
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    this.entryPoint = new ethers.Contract(
      opts?.entryPoint || ERC4337.EntryPoint,
      // @ts-ignore
      IEntryPointAbi,
      this.provider,
    )
    this.factory = new ethers.Contract(
      opts?.factory || ERC4337.SimpleAccount.Factory,
      // @ts-ignore
      SimpleAccountFactoryAbi.abi,
      this.provider,
    )
    this.initCode = '0x'
    this.proxy = new ethers.Contract(ethers.constants.AddressZero, SimpleAccountAbi.abi, this.provider)
  }

  private resolveAccount: UserOperationMiddlewareFn = async (ctx) => {
    ctx.op.nonce = await this.entryPoint.getNonce(ctx.op.sender, 0)
    const nonceBN = ethers.BigNumber.from(ctx.op.nonce)
    ctx.op.initCode = nonceBN.eq(0) ? this.initCode : '0x'
  }

  public static async init(
    signer: ethers.Signer,
    rpcUrl: string,
    opts?: IPresetBuilderOpts,
  ): Promise<SimpleAccount> {
    const instance = new SimpleAccount(signer, rpcUrl, opts)

    const address = await instance.signer.getAddress()

    try {
      instance.initCode = await ethers.utils.hexConcat([
        instance.factory.address,
        instance.factory.interface.encodeFunctionData('createAccount', [
          address,
          ethers.BigNumber.from(opts?.salt ?? 0),
        ]),
      ])

      await instance.entryPoint.callStatic.getSenderAddress(instance.initCode)
      throw new Error('getSenderAddress: unexpected result')
    } catch (error: any) {
      const addr = error?.errorArgs?.sender
      if (!addr) {
        throw error
      }

      instance.proxy = new ethers.Contract(addr, SimpleAccountAbi.abi, instance.provider)
    }

    const base = instance
      .useDefaults({
        sender: instance.proxy.address,
        signature: await instance.signer.signMessage(
          ethers.utils.arrayify(ethers.utils.keccak256('0xdead')),
        ),
      })
      .useMiddleware(instance.resolveAccount)
      .useMiddleware(getGasPrice(instance.provider))

    const withPM = opts?.paymasterMiddleware
      ? base.useMiddleware(opts.paymasterMiddleware)
      : base.useMiddleware(estimateUserOperationGas(instance.provider))

    return withPM.useMiddleware(EOASignature(instance.signer))
  }

  async checkUserOp(opHash: string) {
    let recipe = await this.provider.send('eth_getUserOperationReceipt', [opHash])
    if (recipe.success) {
      return true
    }
    return false
  }

  execute(to: string, value: BigNumberish, data: BytesLike) {
    return this.setCallData(this.proxy.interface.encodeFunctionData('execute', [to, value, data]))
  }

  executeBatch(to: Array<string>, data: Array<BytesLike>) {
    return this.setCallData(this.proxy.interface.encodeFunctionData('executeBatch', [to, data]))
  }

  erc20transfer(contractaddress: string, to: string, value: BigNumberish) {
    const erc20 = new ethers.Contract(contractaddress, ERC20_ABI, this.provider)
    const approve = {
      to: contractaddress,
      value: ethers.constants.Zero,
      data: erc20.interface.encodeFunctionData('approve', [to, value]),
    }
    const send = {
      to: contractaddress,
      value: ethers.constants.Zero,
      data: erc20.interface.encodeFunctionData('transfer', [to, value]),
    }
    return this.executeBatch([approve.to, send.to], [approve.data, send.data])
  }

  erc721transfer(contractAddress: string, to: string, tokenId: BigNumberish) {
    const erc721 = new ethers.Contract(contractAddress, ERC721_ABI, this.provider)
    const transfer = {
      to: contractAddress,
      value: ethers.constants.Zero,
      data: erc721.interface.encodeFunctionData('transferFrom', [this.proxy.address, to, tokenId]),
    }
    return this.executeBatch([transfer.to], [transfer.data])
  }
}
