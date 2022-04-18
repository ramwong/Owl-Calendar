import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // In browser and metamask is running
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // On server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/36d64c099c50404692eb8be07f68db77" // for testing 
    // "https://mainnet.infura.io/v3/36d64c099c50404692eb8be07f68db77"  // for production
  );
  web3 = new Web3(provider);
}

export default web3;
