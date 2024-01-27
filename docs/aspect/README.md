# Solide Aspect IDE

## Use Case Summary

The Aspect IDE by Solide enables an easy learning and development environment tailored for Artela's Aspect programming. The project acts as a gateway, welcoming developers of all skill levels and providing them with a streamlined process for creating new Aspect contracts or importing existing ones, enhancing their ability to interact seamlessly with Aspect contracts.

The lightweight Aspect IDE can support a full range of features and use cases including,

- **Aspect Programming Development:** Straightforward approach to building, compiling, deploying, binding, and upgrading Aspect contracts, ensuring an efficient and user-friendly development process.
- **Extension of Solide EVM IDE:** Solide's Ethereum Virtual Machine (EVM) IDE, thereby simplifying Aspect smart contract development. Developers can easily deploy and interact with both EVM smart contracts and Aspect contracts within a unified environment.
- **Loading Existing Aspects from Open Source Repositories:** As mention, the IDE allows developers to access and load existing Aspect contracts from open-source repositories. This feature promotes collaboration, sharing of Aspect templates, and the utilization of secure and widely-used Aspects.
- **Integration as a Widget in dApps and Web-Based Applications:** The Aspect IDE can be embedded in dApps or web based application. This allows integration of Aspect based development anyone on the web.

## Team Members and Roles

Team Member 1: [Peter Tran - Core Dev]

## Problem Addressed

To address the challenges in smart contract development and enhance the user experience of Aspect programming, the proposed solution involves the implementation of an IDE tailored for Aspect programming. Currently approach is the need of installing requirements packages and the command-line interface (CLI), which can be intimidating for new developers and this is where an online IDE with Aspect designed editor and Aspect features into a single application, offering a more user-friendly and efficient development environment.

For new developers entering the realm of Aspect programming, the IDE simplifies the onboarding process by eliminating the need to download multiple packages and CLI tools. By providing a centralized platform with a straightforward and effective user interface, the IDE streamlines the building, deploying, and binding of Aspect contracts. This not only accelerates the learning curve for newcomers but also ensures a seamless and cohesive development experience.

## Project Design

### Overview

#### 1. Aspect IDE

![Solide-IDE](/docs/aspect//images/apsect-ide.png)

Additional info (Going from left to right):
- First Component: **File Explorer** where you can view the entire source.
- Second Component: **Sidebar**, allowing closing and revealing the other components for IDE. This effect makes it easier for development. As you see the Artela Icon at the bottom of sidebar to indicate that Metamask is connected to the Artela RPC (Make to switch to Artela Betanet or Livenet).
- Third Component: **IDE editor**, allowing for Assemblyscript programming with libraries imported such as `@artela/aspect-lib`, `as-proto`, etc.
- Fourth Component: **Aspect deployment Tab**, is designed to deploy or upgrade an the Compile Aspect. 
- Fifth Component: **Smart contract Tab**, is designed for EVM smart contract related features, such as binding to a deployed Aspect, and loading all available Aspect.

#### 2. Aspect Tab

![Solide-IDE](/docs/aspect//images/apsect-deploy.png)

Additional info (Focused on Fourth Component):
- In the Aspect Tab, after successfully compiling an Aspect, you can access features such as downloading the `.wasm` file.
- For deployment, the IDE supports additional parameters necessary for deployment, including selecting relevant joints and adding the Key Pair parameters for properties.
- Developers will be prompted to sign a Metamask transaction for deployment, and once the transaction is confirmed, the Aspect address will be displayed in the input next to the deploy button.
- Note this is also where you can upgrade an Aspect for a smart contract

#### 3. Smart Contract Tab

![Solide-IDE](/docs/aspect//images/apsect-evm.png)

Additional info (Focused on Fifth Component):
- In the Smart Contract Tab, you can load an EVM smart contract on Artela. This will be the contract that the Aspect Address will bind to (if click on *bind*)
- Developers also have the option to load the smart contract's bound aspects (if any). In the image above, the smart contract is bounded to a single Aspect (*version 1*)
### Implementation

The IDE is created by Next and compilation is done by the AssemblyScript compiler.
- IDE (Client side): dApp frontend where developer can code and build an Aspect
	- `@artela/web3`: For Aspect related task
- Compiler (Server side): Compile the Aspect and return a `.wasm` file if successful. Any fail to compile, with return an array of `error`.
	- `asc`: For compilation
## Value to the Artela Ecosystem

The concept of Aspect programming is a feature that can be used in the Artela EVM ecosystem. Currently, the sole method involves downloading their suite of packages. An online IDE tailored for Aspect development simplifies the onboarding process for developers.

Another instance is the of integrating the Aspect IDE into applications allows us to inject similar to CodePen. Developers interested in understanding Aspect can interactively demo it without the need for installations. This approach simplifies and streamlines Aspect programming, bringing significant value to Artela. Here we are using the Aspect IDE in another application to showcase the Aspect with a Tutorial or a Guide below to help and guide developers unders the smart contract. You can see the demo here: [Aspect Contracts](https://solide-dapp.vercel.app/aspect)

![Solide-IDE](/docs/aspect//images/apsect-dapp.png)

Furthermore, the proposed IDE is envisioned as an open-source platform, fostering continuous improvement and community involvement. Developers can contribute by implementing plugins and features related to Aspect programming, encouraging collaboration and ensuring the IDE evolves to meet the dynamic needs of the Aspect development community. In essence, the solution aims to offer a comprehensive, accessible, and community-driven development environment for Aspect programming in the realm of smart contract development..

## Future
- Creation of Documentation to help developers navigate the Aspect IDE
## How to Use

- New Aspect IDE https://solidewidget.azurewebsites.net/aspect
- Load Aspect from GitHub: https://solidewidget.azurewebsites.net/aspect?url=https://github.com/artela-network/aspect-tooling/blob/main/packages/testcases/aspect/guard-by-trace.ts
- (This is a Existing Solide Project) Load Verified smart contract on Artela Betanet: https://solidewidget.azurewebsites.net/address/11822/0xc23Ecb9a9D3B9087bDb7ba063A2bD2509194Ba0d 