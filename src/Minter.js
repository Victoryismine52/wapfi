import { useEffect, useState } from "react";
import { ethers, Wallet } from "ethers";

import { 
  connectWallet,
  getCurrentWalletConnected,
  mintNFT
} from "./utils/interact.js";


const contractABI = require('./contract-abi.json');
const contractAddress = "0x3d77FF24d355ae1B46336f2f5d69cA5Fc6c814af";

const isTestnet = false;
const PresentsAddress = "0x122d9373Ea033d094806e0A924F06132356284Bb"

const CreaturesAddress = "0x8C53eD6B01946582750deA74300Edbcb021cA90b";

const URI = isTestnet ? "https://ipfs-nfts.mypinata.cloud/ipfs/QmQmJZ2ZyXdUvXaXh5o7EMYytjwBDXfZU93zCU7ewAAPeZ/" : "https://ipfs-nfts.mypinata.cloud/ipfs/QmTt8Z9qLN6VhVnk3xbLvCk5SgjHkDZNKWoDeHnQypE5PZ/";
const ChainID = isTestnet ? "0x61" : "0x38";  // BSC Mainnet: 0x38 and Testnet 0x61
const ChainName = isTestnet ? "BSC Testnet" : "BSC Mainnet";
const ChainParams = [{
    chainId: ChainID,
    chainName: isTestnet ? 'BSC Testnet' : 'BSC Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: [isTestnet ? 'https://data-seed-prebsc-1-s1.binance.org:8545/': 'https://bsc-dataseed3.binance.org/'],
    blockExplorerUrls: [isTestnet ? 'https://testnet.bscscan.com/' : 'https://bscscan.com/']
  }]


var Signer = false;

function setContracts(signer) {
 const NFT = new ethers.Contract(contractAddress,contractABI,signer);
}



const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [Amount, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
 
  useEffect(async () => { 
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address)
    setStatus(status);

    addWalletListener();
  }, []);
 
  async function WAPFimint() {
    const account = await getCurrentAccount();
    const mint = await window.contract.methods.mintWAPFIDutchAuction(Amount).send({ from: account});
  }

  async function getCurrentAccount() {
    const accounts = await window.web3.eth.getAccounts();
    return accounts[0];
  };


  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Enter an amount between .1 and 2 BNB.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  };



  const connectWalletPressed = async () => { //TODO: implement
   const walletResponse = await connectWallet();
   setStatus(walletResponse.status);
   setWallet(walletResponse.address);
  };

  const onMintPressed = async () => { //TODO: implement
    const { status } = await mintNFT(Amount);
    setStatus(status);
  };

  async function mintClicked() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const NFTcontract = new ethers.Contract(contractAddress,contractABI, signer);
    let amt = Amount;
    let overrides = {
      value: ethers.utils.parseEther(amt),
    };
    let tx = await NFTcontract.mintWAPFIDutchAuction(overrides);
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title"> WAPFi NFT Minter</h1>
      <p>
      WAPFi (Wet Ass Personal Finance) – Is the first token to launch using the Testudo Rising Floor Concept. 
      A portion of each trade goes to a holding account to back the token in BNB. This value can be retrieved by burning a token. 
      Later this year Testudo will be enhancing the contract to enable interest free access to the backing value through staking. 
      Whitelisted members can mint a Wet Ass NFT bellow and once the Mint Period ends they will be able to claim their tokens.
      </p>
      <form>
        <h2>Amount: </h2>
        <input
          type="text"
          placeholder="Please enter an Amount of BNB between 0.1 and 2"
          onChange={(event) => setName(event.target.value)}
        />
      </form>
     {/*  <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <button id="mintButton2" onClick={WAPFimint}>
        Mint NFT 2
      </button> */}
      <button id="mintButton3" onClick={mintClicked}>
        Mint WAPFi NFT and tokens
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Minter;

