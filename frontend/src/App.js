import { useState } from "react";
import { ethers } from "ethers";
import Social from "./utils/SocialContract.json";
import { SocialContractAddress } from "./config";
import { useEffect } from "react";
import LandingPage from "./components/LandingPage";
import "./App.css";
import { Button } from "@chakra-ui/react";
import AccountHead from "./components/AccountHead";
import Feed from "./components/Feed";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  async function checkIsConnected() {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      console.log(`You're connected to: ${accounts[0]}`);
      setIsConnected(true);
    } else {
      console.log("Metamask is not connected");
      setIsConnected(false);
    }
  }

  useEffect(() => {
    checkIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      console.log(ethereum);

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log(chainId);
      console.log("Connected to chain: " + chainId);
      const sepoliaChainId = "0xaa36a7";

      if (chainId !== sepoliaChainId) {
        alert("You are not connected to the sepolia test net");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found Account", accounts[0]);
      setIsConnected(true);
      localStorage.setItem("id", accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  return (
    <div>
      {!isConnected && (
        <div className=" flex min-h-screen justify-center items-center flex-col gap-2 bg-black">
          <LandingPage connect={connectWallet} />
        </div>
      )}
      {isConnected && (
        <div className=" flex justify-center  flex-col gap-2 bg-black p-4 ">
          <AccountHead account={currentAccount} userOptions={true} />
          <Feed />
        </div>
      )}
    </div>
  );
}

export default App;
