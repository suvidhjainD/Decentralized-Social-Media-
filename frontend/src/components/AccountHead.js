import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Social from "../utils/SocialContract.json";
import { SocialContractAddress } from "../config";
import { useNavigate } from "react-router";
import { Heading, Button } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";

const AccountHead = (props) => {
  console.log(props);
  const navigate = useNavigate();
  const [acccountDetails, setAccount] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

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
          avatar: allPosts?.avatar,
          username: allPosts.username,
        };
        console.log(result);
        setAccount(result);
        setIsLoading(false);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      navigate("/addaccount");
    }
  };

  useEffect(() => {
    getAccountDetails();
  }, []);

  return (
    <div className="text-white font-xl flex ">
      {isLoading && <p>Loading ...</p>}

      {!isLoading && (
        <div className="flex items-center gap-3 w-full justify-between bg-red-950 p-4 rounded-md ">
          <div className="flex gap-2 items-center">
            <Avatar src={acccountDetails?.avatar} />
            <h1 className=" font-bold">{acccountDetails?.username}</h1>
          </div>
          <div className="flex gap-4">
            {props.userOptions ? (
              <Button
                onClick={() => {
                  navigate("/useroptions");
                }}
                variant="unstyled"
                className=" font-light  ease-in transition-all duration-150 hover:underline hover:underline-offset-4 "
              >
                Settings
              </Button>
            ) : (
              <Button
                onClick={() => {
                  navigate("/");
                }}
                variant="unstyled"
                className=" font-light  ease-in transition-all duration-150 hover:underline hover:underline-offset-4"
              >
                Feed
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountHead;
