<p align="center">
  <h2 align="center">Solide IDE</h2>
  <p align="center">
    <img src="https://therealsujitk-vercel-badge.vercel.app/?app=solide" alt="Vercel Deploy">
  </p>
  <p align="center"><b>Lightweight Smart Contract IDE</b></p>
  <p align="center">Comprehensive intuitive integrated development environment tailored for load smart contract from various blockchain and repositories</p>
</p>

## About Solide

Solide is an open-source Solidity Integrated Development Environment (IDE) and Knowledge Hub designed to empower developers, educators, and blockchain enthusiasts in their journey of smart contract development and exploration. This repository serves as the home for the Solide IDE.

## Remix Clone?

Solide tries distinguishes itself from similar online IDEs, notably the Remix IDE from Ethereum, by positioning itself as more than just a IDE tool. While both Solide and Remix serve as online IDEs, Solide takes a unique approach by prioritizing accessible learning and fostering an interactive environment for both developers and non-developers interested in smart contract exploration. Solide is designed to be lightweight and seamlessly integratable, offering flexibility in deployment across various environments, tutorials, and demonstrations. The innovative aspect of Solide lies in its expertise in creating an interactive learning environment from any Github Repository or various chains. By embedding the IDE in any web-based application, Solide consolidates educational content and tutorials within the development environment, enhancing the learning journey. However, Solide goes beyond having IDE functionalities, rather also a dedicated space for blockchain and protocols. As Solide continues to expand and grow its collection of smart contracts, it maintains its commitment to being a unique and comprehensive solution that stands out in the realm of online IDEs.

## Features 🌟

- **EVM Programming**: See the EVM Programming documentation for more information.

- **Aspect Programming**: See the Aspect Programming documentation for more information.

## Getting Started

To experience Solide, visit our [Doc (Coming Soon)](#). You can also check out the Solide IDE and Knowledge Hub at [solide-dapp.vercel.app](https://solide-dapp.vercel.app/).

## Examples 🏗️

Explore these contract hubs and interactive demos:

- [Chainlink Token on Ethereum](https://solidewidget.azurewebsites.net/address/1/0x514910771af9ca656af840dff83e8264ecf986ca)
- [Aave Pool on Ethereum](http://localhost:3001/address/1/0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2)
- [Aave Pool Source on GitHub](https://github.com/aave/aave-v3-core/blob/master/contracts/protocol/pool/Pool.sol)
- [TokenPaymaster.sol from @account-abstraction/contracts](https://solidewidget.azurewebsites.net/?url=https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/samples/TokenPaymaster.sol)
- [Aspect IDE](https://solidewidget.azurewebsites.net/aspect)

## Getting Started
To run Solide locally, follow these steps:

### Clone the Repository
First, clone the Solide repository to your local machine using Git:
```bash
git clone https://github.com/solide-project/solide
```

### Install Dependencies
Navigate into the cloned repository directory and install the required npm packages:
```bash
cd solide
npm install
```

### Install Smart Contract Libraries
Next, install the support smart contracts for loading smart contract dependencies and remappings:
```bash
cd public/_contracts
npm install --legacy-peer-deps
npm run start
```

### Configure Environment Variables
Create a `.env.local` file in the root directory of the project and use the following template to fill in the required variables:
```plaintext
ETHERSCAN_API_KEY=
POLYSCAN_API_KEY=
OPTIMISTICSCAN_API_KEY=
FTMSCAN_API_KEY=
ARBISCAN_API_KEY=
NOVAARBISCAN_API_KEY=
BSCSCAN_API_KEY=
BASESCAN_API_KEY=
LINEASCAN_API_KEY=
MOONBEAM_API_KEY=
MOONRIVER_API_KEY=
CELOSCAN_API_KEY=
GNOSISSCAN_API_KEY=
CRONOSSCAN_API_KEY=
SCROLLSCAN_API_KEY=
BTTCSCAN_API_KEY=
WEMIXSCAN_API_KEY=
BLASTSCAN_API_KEY=
FRAXSCAN_API_KEY=
ZKEVM_POLYSCAN_API_KEY=

GITHUB_API_KEY=
  
SIGNER_WALLET=
TRON_WALLET=
```

- **Explorers API Keys**: Fill in the respective API keys for explorers like Etherscan, Polyscan, etc., which are required for loading contracts on selected chains.
- **Github API Key**: Optional but necessary when the rate limit for GitHub API requests is reached
- **Solidity DB Service**: To use this service, request a TRON address to be added to the Solidity Registry and set `TRON_WALLET` as the private key to store smart contract information. Email solide-project@proton.me for the request.

### Running Solide
After configuring the environment variables, start the Solide IDE:
```bash
npm start
```

This command will launch the Solide IDE in your default web browser.

## Contribution Guidelines

We welcome contributions from the community to enhance Solide further. If you have suggestions, bug reports, or want to contribute code, please follow our [Contribution Guidelines](link-to-contribution-guidelines).

## Community and Support

Join the Solide community for discussions, support, and collaboration. Visit our [Discord channel (Coming Soon)](#) to connect with fellow developers and enthusiasts.

## License

Solide is released under the [MIT License](link-to-license). Feel free to use, modify, and distribute Solide for your projects.

---


Note: Solide is a community-driven project aimed at fostering openness, collaboration, and innovation in the blockchain development domain. Your feedback and contributions are highly valued. Let's build the future of smart contract development together!

Support us by starring this Repository and following us on [X](https://twitter.com/SolideProject)! 😊