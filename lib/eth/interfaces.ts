export interface DeployedContracts {
  [key: string]: ISmartContract
}

export interface InvokeParam {
  method: string
  args: any[]
  value?: string
  gas?: string
}

export interface ISmartContract {
  contractAddress: string
  abi: any
  call(args: InvokeParam): Promise<any>
  send(args: InvokeParam): Promise<any>
}
