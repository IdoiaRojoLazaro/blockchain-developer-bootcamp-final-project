# blockchain-developer-bootcamp-final-project
My blockchain developer bootcamp final project

# The lazy corner
## About
This DApp is a market place where seller can upload their notes, and buyer can buy it. Above all, it is designed for notes on oppositions exam, where having good notes makes a big difference, and there is a clear market niche. The idea is to provide a secure platform to interchange notes, and ensure that the studious owner of the great notes receive something in exchange. Nerd days are over.

### Public interface on Netlify: 
[The Lazy Corner](https://thelazycorner.netlify.app/)
### Public Ethereum address for NFT: 
`0xc4c0582aC4982a4f35fCe1FeEADa3b5e3c44cC17`
## Directory structure
    .
    ├── client                           # Frontend react client application
    ├── contracts                        # Contract solidity code
    ├── migrations              
    ├── test                             # Solidity testing
    ├── avoiding_common_attacks.md       # Design patterns documentation
    ├── design_pattern_decisions.md      # Security decisions against common attacks
    └── README.md

## Setup App
### Prerequisites
To run the DApp locally, you will need:
* Node v14.17.0 
* Truffle v5.4.19
* Ganache-cli v6.12.2
* HDWallet provider `npm i @truffle/hdwallet-provider`
* Openzeppelin libary `npm i @openzeppelin/contracts`
* .env file `npm i dotenv`
* Metamask installed in your browser
### Run Smart Contract
Available in the contracts folder:
* Navigate to root folder
* Install all dependencies `npm install`
* Compile contracts `truffle compile`
* Compile and deploy contracts locally `truffle migrate --network develop` (`ganache cli`)
* Compile and deploy contracts mumbai `truffle migrate --network mumbai`
* Compile and deploy contracts and test `truffle test`

### Run client locally
Go to `client` folder and create a `.env` file. You will need to add this environment variables with its corresponding value:
```
REACT_APP_CONTRACT_ADDR =
REACT_APP_PINATA_API_KEY =
REACT_APP_PINATA_SECRET_API_KEY =
REACT_APP_IPFS_GATEAWAY = https://ipfs.io/ipfs/
```

To run the DApp locally:
* Navigate to client folder `cd /client` 
* Install all dependencies `npm install` 
* To build the frontend app `npm run build` 
* To start the app locally `npm start`
* Open web browser on [localhost:3000/](http://localhost:3000/)

### Flow
1. `ganache-cli`
2. Run client locally (see upside)
3. Add first account provided by ganache to metamask (will be admin account), and **Sign up as Seller** with the admin account in the [login](http://localhost:3000/login)
4. Repeat the process with another account, to create a seller
5. Repeat the process with another account, to create a buyer **Sign up as Buyer**
6. Return to the admin account(change account on metamask and refresh page), and approve the seller from the Admin home page 
7. Return to the seller account, and **create a note**
8. Return to the buyer account, and click on the new note, **buy** the note

### Result:
- Admin home page: there should be a table with two users (the seller (**Approved**), the buyer)
- Seller home page: there should be the note created
- Buyer home page: 
    * There should be the note created on **All notes** tab, there should be the note bought  
    * There should be the note bought on **Notes Bought** tab, with button **See** that opens the PDF with the file uploaded to the note


## Screencast

### Seller registers, admin approves seller: https://youtu.be/Ss4rM23EriI
### Seller creates note. Buyer registers and buy note: https://youtu.be/8gsyq7Hr8mM
