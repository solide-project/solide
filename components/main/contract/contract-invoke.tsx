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
            // Reorder params
            let params: any[] = [];
            methodInfo.inputs.forEach((input: any) => {
                let value = args[method][input.name] || "";  
                if (input.type.includes("int")) {
                    value = parseInt(value);
                } 

                params.push(value);
            });

            if (methodInfo.outputs && methodInfo.outputs.length > 0) {
                result = await contractMethod(...params);

                if (methodInfo.outputs[0].type.includes("int")) {
                    result = result.toString() as BigNumber;
                } else {
                    result = result as string;
                }

                setRet({ ...ret, [method]: result });
            } else {
                await contractMethod(...params);
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
        <div className="overflow-y-auto pb-16 flex flex-col gap-4" style={{ height: "90vh" }}>
            {abi.filter(m => m.type === "constructor").map((abi, index) => {
                return (
                    <div key={index}>
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
                                    </div>
                                )
                            })}

                            <div className="py-1 text-center">
                                {ret[abi.name] !== undefined && ret[abi.name]}
                            </div>
                        </div>
                    </div>
                )
            })}

            {abi.filter(m => m.type === "function").map((abi, index) => {
                return (
                    <div key={index}>
                        <Button size="sm" disabled={(canInvoke &&
                            Object.keys(args[abi.name] || {}).length === abi.inputs.length)
                            ? false : true}
                            onClick={() => invokeContract(abi.name)}>
                            {abi.name} {`( ${(abi.inputs && abi.inputs.length > 0) ? "..." : ""} )`}
                        </Button>

                        <div>
                            {abi.inputs.map((input: any, abiIndex: number) => {
                                return (
                                    <div key={abiIndex} className="flex items-center space-x-2">
                                        <div>{input.name}</div>
                                        <Input placeholder={input.type}
                                            onChange={(e) => handleArgChange(abi.name, input.name, e.target.value)} />
                                    </div>
                                )
                            })}

                            <div className="py-1">
                                {ret[abi.name] !== undefined && ret[abi.name].toString()}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}