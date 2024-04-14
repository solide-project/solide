declare global {
	interface Worker {
		Module: any;
	}
}

function browserSolidityCompiler() {
	const ctx: Worker = self as any;

	ctx.addEventListener('message', ({ data }) => {
		if (data === 'fetch-compiler-versions') {
			fetch('https://binaries.soliditylang.org/bin/list.json').then(response => response.json()).then(result => {
				postMessage(result)
			})
		} else {
			importScripts(data.version);
			const soljson = ctx.Module;
			// console.log(soljson)
			const compile = soljson.cwrap('solidity_compile', 'string', ['string', 'number']);

			try {
				const output = JSON.parse(compile(data.input))
				console.log(output)
			} catch (e) {
				console.log(e)
			}
			postMessage({ errors: [{
				component: "custom",
				errorCode: "0",
				formattedMessage: data.version,
				message: "Internal error while compiling.",
				severity: "error",
				sourceLocation: [],
				type: "CustomError"
			}] })
			// postMessage(output)
			// if ('_solidity_compile' in soljson) {
			// 	const compile = soljson.cwrap('solidity_compile', 'string', ['string', 'number']);
			// 	const output = JSON.parse(compile(data.input))
			// 	console.log(output)
			// 	postMessage(output)
			// } else {
			// 	console.log("Error")
			// 	postMessage({ error: 'Compiler version not found' })
			// }
		}
	});
}

// if (window !== self) {
// 	browserSolidityCompiler();
// }

export { browserSolidityCompiler }

function importScripts(version: any) {
	throw new Error("Function not implemented.");
}
