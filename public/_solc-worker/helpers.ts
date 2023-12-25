export const createCompileInput = (sources: any, options: any = {}): string => {
    const CompileInput = {
      language: 'Solidity',
      sources: sources,
      settings: {
        ...options,
        // viaIR: true,
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    };
    return JSON.stringify(CompileInput);
  }