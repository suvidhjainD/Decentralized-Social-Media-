import { useNavigate } from "react-router";
import { SocialContractAddress } from "../config";
// import checkTx from "../utils/checkTransaction";
import { ethers } from "ethers";
import Social from "../utils/SocialContract.json";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";
import { Button, Heading, Input } from "@chakra-ui/react";

const AddAccount = () => {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  const uploadFile = async (imageUp) => {
    const imageRef = ref(storage, `images/${imageUp.name}`);
    uploadBytes(imageRef, imageUp).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url);
      });
    });
  };

  const addAccount = async (e) => {
    e.preventDefault();

    try {
      if (username.trim() == null) {
        throw new Error("Username cannot be empty");
      }
      const { ethereum } = window;

      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        const SocialContract = new ethers.Contract(
          SocialContractAddress,
          Social.abi,
          signer
        );
        let allPosts = await SocialContract.addAccount(
          localStorage.getItem("id"),
          username,
          imageUrl
        );
        console.log(allPosts);
        SocialContract.addListener("AccountAdded", (ad) => {
          navigate("/");
        });
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form onSubmit={addAccount} className="bg-black h-screen flex flex-col p-5">
      <Heading className="text-white my-1">Add Account</Heading>
      <p className="text-white font-semibold">
        This holds the mappings of your username and avatar to the address
      </p>
      <Input
        type="text"
        placeholder="Enter Username"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        className="p-2 mt-4 text-white"
      />
      <input
        type="file"
        onChange={async (event) => {
          await uploadFile(event.target.files[0]);
        }}
      />
      {imageUrl && (
        <Button className=" bg-white" type="submit">
          Add account
        </Button>
      )}
    </form>
  );
};

export default AddAccount;
