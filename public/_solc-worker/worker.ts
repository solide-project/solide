// import setupMethods from 'solc/wrapper';

self.onmessage = async function ({ data }) {
    
    postMessage({
        errors: [{
            component: "custom",
            errorCode: JSON.stringify({}),
            formattedMessage: JSON.stringify({}),
            message: "Internal error while compiling.",
            severity: "error",
            sourceLocation: [],
            type: "CustomError"
        }]
    });
};

