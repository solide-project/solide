"use client";

import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ContractInvokeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    setConstructorArgs: Function;
    contract: ethers.Contract | undefined;
    abi: any[];
}

export function ContractInvoke({
    setConstructorArgs,
    contract,
    abi
}: ContractInvokeProps) {
    const [canInvoke, setCanInvoke] = useState<boolean>(false);

    useEffect(() => {
        setCanInvoke(contract ? true : false)
    }, [contract]);

    const [args, setArgs] = useState<any>({})
    const [ret, setRet] = useState<any>({})
    const handleArgChange = (method: string, name: string, value: string) => {
        const newArgs = { ...args };

        if (!newArgs[method]) {
            newArgs[method] = {};
        }

        newArgs[method][name] = value;
        setArgs(newArgs);
    }

    const invokeContract = async (method: string) => {
        if (!contract) return;

        const methodInfo = abi
            .filter(m => m.type === "function")
            .find(n => n.name === method);

        const contractMethod = contract[method];
        let result: any = undefined;
        try {
            if (methodInfo.outputs && methodInfo.outputs.length > 0) {
                result = await contractMethod();

                if (methodInfo.outputs[0].type === "uint256") {
                    result = result.toString() as BigNumber;
                } else {
                    result = result as string;
                }

                setRet({ ...ret, [method]: result });
            } else {
                await contractMethod();
            }
        } catch (error: any) {
            setRet({ ...ret, [method]: error.toString() });
            console.error(error);
        }
    }

    const handleSetConstructorArgs = (e: any, index: number) => {
        setConstructorArgs((prev: any) => {
            const newArgs = [...prev];
            newArgs[index] = e.target.value;
            return newArgs;
        })
    }

    return (
        <div className="overflow-y-scroll pb-32" style={{ height: "90vh" }}>
            {abi.filter(m => m.type === "constructor").map((abi, index) => {
                return (
                    <div key={index} className="py-2">
                        <Button variant="destructive" size="sm" disabled={true}>
                            constructor
                        </Button>

                        <div>
                            {abi.inputs.map((input: any, index: number) => {
                                return (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div>{input.name}</div>
                                        <Input placeholder={input.type}
                                            onChange={(e) => handleSetConstructorArgs(e, index)} />
                                        {/* {JSON.stringify(inputs)} */}
                                    </div>
                                )
                            })}

                            <div className="py-1">
                                {ret[abi.name] !== undefined && ret[abi.name]}
                            </div>
                        </div>
                    </div>
                )
            })}

            {abi.filter(m => m.type === "function").map((abi, index) => {
                return (
                    <div key={index} className="py-2">
                        <Button size="sm" disabled={(canInvoke &&
                            Object.keys(args[abi.name] || {}).length === abi.inputs.length)
                            ? false : true}
                            onClick={() => invokeContract(abi.name)}>
                            {abi.name}
                        </Button>

                        <div>
                            {abi.inputs.map((input: any, abiIndex: number) => {
                                return (
                                    <div key={abiIndex} className="flex items-center space-x-2">
                                        <div>{input.name}</div>
                                        <Input placeholder={input.type}
                                            onChange={(e) => handleArgChange(abi.name, input.name, e.target.value)} />
                                        {/* {JSON.stringify(inputs)} */}
                                    </div>
                                )
                            })}

                            <div className="py-1">
                                {ret[abi.name] !== undefined && ret[abi.name]}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}