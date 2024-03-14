## Motivation

With verified and unverified smart contracts and Solide extensive integration of supported chains for Solide IDE. Solide aims to expand and fill in the gap providing accessing and comprehending smart contracts. The inspirations comes from building the open source platform, where Solide really needed to catered for unverified smart contracts in their IDE as a way to provided full transparency and access to smart contracts for developer to understand and explore those that may not be verified. This also give rise to making sure that the unverified smart contracts are in fact what the underlying code should be doing and aids the users interacting with the contract, some information. Through its platform, Solide empowers developers to unravel the intricacies of smart contracts, validating functionality and ensuring alignment with intended purposes, thus paving the way for a more connected and decentralized world.

## What It Does

### Smart contract Deployment

As part of any contract deployment process, projects have the option to utilize the Solidity Database as a means of storing smart contract sources without immediate verification. For example, when deploying contracts through the Solide IDE, all information, including solidity metadata, source code, bytecode, and more, can be seamlessly stored with Glacier. This integration streamlines the deployment process, offering developers a convenient repository for storing contract data while awaiting verification, thereby enhancing transparency and accessibility within the development cycle.

![Solidity-Database](/docs/solidity-db/images/verified-deploy.png)
*A verified smart contract on Ethereum deployed on Polygon (unverified)*

![Solidity-Database](/docs/solidity-db/images/unverified-explorer.png)
*unverified contract deployed*

### Loading unverified smart contract

With their bytecode and source code stored on Glacier, Solide IDE can leverage the decentralized database to retrieve this information, offering a level of transparency and understanding regarding the nature of smart contracts. Through the integration of Solide with the Solidity Database, contracts deployed on the platform can access their source code and associated details, even if they have not yet been verified on-chain. This functionality not only enhances transparency but also provides developers and users with valuable insights into the workings of deployed contracts, fostering trust and facilitating further development and analysis within the Web3 ecosystem.

![Solidity-Database](/docs/solidity-db/images/unverified-deploy.png)
*Loading of unverified contracts into Solide IDE, for interaction and IDE*

*In future roadmaps, we can provide addition features that allow users to verify on the spot given such information.*

## Cross chain smart contracts

Furthermore, interoperability allows for deployments across different chains, enabling smart contracts deployed on other chains to utilize the Solidity Database for matching contract source codes. This cross-chain functionality expands the reach and utility of the Solidity Database, fostering a more interconnected ecosystem where smart contracts deployed across various chains can seamlessly access and verify their corresponding source code information. By facilitating this interoperability, the Solidity Database becomes a central hub for contract transparency and understanding, promoting collaboration and innovation within the decentralized space.

![Solidity-Database](/docs/solidity-db/images/cross-chain.png)
*Contract deployed (unverified) on another chain (Filecoin Testnet) will contain a similar bytecode and hence load the same source code as the unverified contract on Polygon*

## Technology Stack

- Glacier
- Nextjs
- IPFS

## Value to the Glacier

The integration of Solidity Database into the Glacier network can bring a lot of value to both projects, serving as an open-source standard for storing smart contracts and efficiently managing on-chain contract sources awaiting verification. It enables easier verification processes, enhances transparency, and facilitates cross-chain compatibility for accessing unverified smart contracts. Leveraging Glacier's NoSQL database structure, developers gain enhanced querying capabilities, empowering them with streamlined development experiences. Moreover, Solidity Database's establishment of a new storage standard facilitates seamless integration of smart contracts across other projects, fostering a more accessible and interconnected ecosystem. From Glacier's standpoint, this partnership enriches the smart contract landscape, promoting data monetization and reinforcing Glacier's role as a trusted platform within the Web3 community.

## How to use

- Example of Solidity for unverified contracts using Glacier: [Solide](https://solidewidget.azurewebsites.net/address/80001/0x4C0849aC35E3aB10d0c214323b8cc70A2995D5Ab)
- Deploy smart contract with Glacier (Use any Solide that can be load on Solide): [Solide](https://solidewidget.azurewebsites.net/?url=https://github.com/solide-project/solide-guides/blob/master/src/openzeppelin/MintableERC20/MintableERC20.sol)
- Solidity Explorer (COMING SOON)