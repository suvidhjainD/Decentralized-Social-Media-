import { ethers } from "ethers";
import Social from "../utils/SocialContract.json";
import { SocialContractAddress } from "../config";
import { useNavigate } from "react-router";
import AccountHead from "./AccountHead";
import { useState, useEffect } from "react";

const UserOptions = () => {
  const [acccountDetails, setAccount] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleWithDraw = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        const SocialContract = new ethers.Contract(
          SocialContractAddress,
          Social.abi,
          signer
        );
        await SocialContract.withdrawRewards();

        SocialContract.addListener("RewardsWithdrawn", () => {
          alert("RewardsWithdrawn");
          getAccountDetails();
        });
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      alert("Error: " + error);
    }
  };

  const handleDistributeLoyalty = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        const SocialContract = new ethers.Contract(
          SocialContractAddress,
          Social.abi,
          signer
        );
        let res = await SocialContract.distributeLoyaltyRewards();

        SocialContract.addListener("LoyaltyRewardsDistributed", () => {
          alert("LoyaltyRewardsDistributed");
          getAccountDetails();
        });
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);

      alert("Error: " + "No Creators added");
    }
  };

  const getAccountDetails = async () => {
    setIsLoading(true);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        const SocialContract = new ethers.Contract(
          SocialContractAddress,
          Social.abi,
          signer
        );
        let allPosts = await SocialContract.getUser(localStorage.getItem("id"));
        console.log(allPosts);
        const loyals = [];
        for (let i = 0; i < allPosts.loyalAddress.length; i++) {
          loyals.push(allPosts.loyalAddress[i]);
        }

        const result = {
          author: allPosts.author,
          loyalAddress: loyals,
          rewards: allPosts.rewards,
          loyaltyRewards: allPosts.loyaltyRewards,
        };
        console.log(result);
        setAccount(result);
        setIsLoading(false);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      alert("Error: " + error);
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, []);

  const withdrawownerfunds = async () => {
    // withdrawAllFunds
    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        const SocialContract = new ethers.Contract(
          SocialContractAddress,
          Social.abi,
          signer
        );
        let allPosts = await SocialContract.withdrawAllFunds();

        SocialContract.addListener("AllFundsWithdrawn", () => {
          alert("AllFundsWithdrawn");
        });
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      alert("Error: " + error);
    }
  };

  const handleAddLoyals = () => {
    navigate("/addloyal");
  };
  return (
    <div className="w-full flex flex-col gap-5 bg-black text-white h-screen p-5 ">
      <AccountHead userOptions={false} />
      <p className="p-3 border-white border-solid border-b-2 text-white   font-bold">
        {"Rewards : " + acccountDetails?.rewards + " wei"}
      </p>
      <p className="p-3 border-white border-solid border-b-2 text-white   font-bold">
        {"Creator Funds : " + acccountDetails?.loyaltyRewards + " wei"}
      </p>
      <button
        onClick={() => {
          navigate("/advertise");
        }}
        className=" p-3 bg-white text-black rounded-md  font-semibold"
      >
        Advertise
      </button>
      <button
        onClick={handleWithDraw}
        className="p-3 bg-white text-black rounded-md  font-semibold"
      >
        WidthDraw
      </button>
      <button
        onClick={handleAddLoyals}
        className="  p-3 bg-white text-black rounded-md  font-semibold"
      >
        Add Creators
      </button>
      <button
        onClick={handleDistributeLoyalty}
        className="  p-3 bg-white text-black rounded-md  font-semibold"
      >
        Distribute Creator Funds
      </button>
      <button
        onClick={withdrawownerfunds}
        className="  p-3 bg-red-500 text-black rounded-md  font-semibold"
      >
        Withdraw Owner Funds
      </button>
    </div>
  );
};

export default UserOptions;
