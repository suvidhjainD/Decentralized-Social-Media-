import { useRef } from "react";
import Web3 from "web3";
import { SocialContractAddress } from "../config";
import checkTx from "../utils/checkTransaction";
import { ethers } from "ethers";
import Social from "../utils/SocialContract.json";
import AccountHead from "./AccountHead";
import { Button, Heading, Input } from "@chakra-ui/react";

const AddLoyal = () => {
  const addressRef = useRef();

  const isValidAddress = (adr) => {
    try {
      const web3 = new Web3();
      web3.utils.toChecksumAddress(adr);
      return true;
    } catch (e) {
      return false;
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const address = addressRef.current.value;
    if (!isValidAddress(address)) {
      alert("Invalid Address");
      return;
    }

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
        let res = await SocialContract.addLoyal(address);
        console.log(res);
        //   AccountAdded : event
        SocialContract.addListener("LoyalAdded", () => {
          alert("Loyals Added");
        });
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }

    addressRef.current.value = "";
    addressRef.current.focus();
  };

  return (
    <div>
      <form
        onSubmit={submitHandler}
        className=" flex p-5 flex-col gap-5 bg-black "
      >
        <AccountHead />
        <div className="bg-gray-800 p-4 rounded-md">
          <Heading className="text-white my-1">Add Creators</Heading>
          <p className="text-white font-semibold">
            Enter the address of Creator you want to share the advertisement
            rewards with !! , these addresses will get rewards when u perform
            DistributeCreatorFunds function.
          </p>
          <Input
            type="text"
            placeholder="Enter Loyal Address"
            ref={addressRef}
            className="my-4 p-2 bg-transparent  text-white border-b-2 focus:outline-none "
          />
          <Button type="submit">Add Address</Button>
        </div>
      </form>
    </div>
  );
};

export default AddLoyal;
