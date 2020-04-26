import Web3 from "web3";

const getWeb3 = () => new Promise((resolve, reject) => {
    window.addEventListener('load', async () => {
        if (window.ethereum) {
            // Modern DAPP browsers
            const web3 = new Web3(window.ethereum);
            try {
                await window.ethereum.enable(); // Request account access if needed
                resolve(web3); // Acccounts now exposed
            } catch (err) {
                console.error(err);
                reject(err);
            }
        } else if (window.web3) {
            // Legacy DAPP browsers
            const web3 = window.web3; // Use Mist/MetaMask's provider.
            console.log("Injected web3 detected.");
            resolve(web3);
        } else {
            // Fallback to localhost. Use dev console port by default
            const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
            const web3 = new Web3(provider);
            console.log('No Web3 instance injected, using local Web3');
            resolve(web3);
        }
    });
});

export default getWeb3;
