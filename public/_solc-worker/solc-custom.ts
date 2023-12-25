"use client";

import { browserSolidityCompiler } from './worker'
import { createCompileInput } from './helpers'

const worker = new Worker(URL.createObjectURL(new Blob([`(${browserSolidityCompiler})()`], { type: 'module' })));

export const solidityCompiler = async ({ version, sources, options }: { version: string; sources: any; options?: { optimizer?: { enabled: boolean; runs: number } } }) => {
    const input = createCompileInput(sources, options)
    console.log("Calling postMessage", sources)
    return new Promise((resolve, reject) => {
        worker.postMessage({ input, version })
        worker.onmessage = function ({ data }) {
            resolve(data);
        };
        worker.onerror = reject;
    });
}

export const getCompilerVersions = async () => {
    return new Promise((resolve, reject) => {
        worker.postMessage('fetch-compiler-versions')
        worker.onmessage = function ({ data }) {
            resolve(data);
        };
        worker.onerror = reject;
    });
}