// "use server"

// import setupMethods from 'solc/wrapper';

let soljson: any, alloc: any, version, solidityCompile, reset: any
const cache: any = {}

const copyToCString = (str: any, ptr: any) => {
    const length = soljson.lengthBytesUTF8(str)
    const buffer = alloc(length + 1)
    soljson.stringToUTF8(str, buffer, length + 1)
    soljson.setValue(ptr, buffer, '*')
}

const callbackHandler = (f: any) =>
    (context: any, kind: any, data: any, contents: any, error: any) => {
        console.log(context, kind, data, contents, error)
        const result = f(soljson.UTF8ToString(kind), soljson.UTF8ToString(data))
        if (result.contents) {
            copyToCString(result.contents, contents)
        }
        if (result.error) {
            copyToCString(result.error, error)
        }
    }


self.onmessage = function ({ data }) {

    delete (self as any).Module;
    (self as any).Module = undefined;

    (self as any).importScripts(`https://binaries.soliditylang.org/wasm/soljson-${data.version}.js`)
    // // const compiler = setupMethods(self)
    // // console.log(compiler)
    // // importScripts("https://binaries.soliditylang.org/wasm/soljson-v0.8.7+commit.e28d00a7.js");

    const ctx: Worker = self as any;
    soljson = ctx.Module;
    // const compile = soljson.cwrap('solidity_compile', 'string', ['string', 'number']);
    const version = soljson.cwrap('solidity_version', 'string', [])
    alloc = soljson.cwrap('solidity_alloc', 'number', ['number'])
    reset = soljson.cwrap('solidity_reset', null, [])

    const fn = callbackHandler((kind: any, data: any) => {
        console.log(kind, data)
        if (kind === 'source' && cache[data]) {
            return { contents: cache[data] }
        }
        // auto cache
        fetch(data)
            .then((resp) => resp.text())
            .then((contents) => Object.assign(cache, { [data]: contents }))
        return { error: `not cached: ${data}` }
    })

    const cb = soljson.addFunction(fn, 'viiiii')
    const compile = soljson.cwrap('solidity_compile', 'string', ['string', 'number'])
    const output = JSON.parse(compile(JSON.stringify(data.input), cb))
    soljson.removeFunction(cb)
    reset()
    console.log(output)
    postMessage({
        errors: [{
            component: "custom",
            errorCode: version(),
            formattedMessage: JSON.stringify({}),
            message: "Internal error while compiling.",
            severity: "error",
            sourceLocation: [],
            type: "CustomError"
        }]
    });
};

