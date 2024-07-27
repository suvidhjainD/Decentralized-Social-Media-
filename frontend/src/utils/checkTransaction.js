import Web3 from "web3";
export default async function checkTx(hash, optionalCallback) {
  // Log which tx hash we're checking
  console.log("Waiting for tx " + hash);

  // Set interval to regularly check if we can get a receipt
  let interval = setInterval(async () => {
    const { ethereum } = window;
    let web3 = new Web3(ethereum);
    const trans = web3.eth
      .getTransactionReceipt(hash)
      .then((r) => {
        console.log(r);
        if (optionalCallback) optionalCallback(r);
        clearInterval(interval);
      })
      .catch((error) => {
        return;
      });
  }, 1000);
}
