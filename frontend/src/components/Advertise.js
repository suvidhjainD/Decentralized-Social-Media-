import { useRef } from "react";
import { ethers } from "ethers";
import Social from "../utils/SocialContract.json";
import { SocialContractAddress } from "../config";
import AccountHead from "./AccountHead";
import { Heading } from "@chakra-ui/react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from "react";

const Advertise = () => {
  const contentRef = useRef("");
  const countRef = useRef(0);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [imageUpload, setImageUpload] = useState(null);

  const uploadFile = async (imageup) => {
    const imageRef = ref(storage, `images/${imageup.name}`);
    uploadBytes(imageRef, imageup).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url);
      });
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(contentRef.current.value);
    console.log(countRef.current.value);

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

        // struct Account {
        //     address payable author;
        //     address payable[] loyalAddress;
        //     uint rewards;
        //     uint loyaltyRewards;
        // }
        const amount = (Number(countRef.current.value) * 0.0001).toFixed(4);
        // console.log(amount.toFixed(4));
        const txn = {
          // same as ticketPrice in the smart contract
          value: ethers.parseEther(String(amount)),
        };
        let allPosts = await SocialContract.addAdvertisement(
          contentRef.current.value,
          countRef.current.value,
          imageUrl,
          txn
        );
        console.log(allPosts);

        SocialContract.addListener("AdvertisementAdded", () => {
          window.location.reload();
        });
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" h-screen flex p-5 flex-col gap-5 bg-black">
      <AccountHead />
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-4 items-center w-full p-4  bg-gray-800 rounded-md"
      >
        <Heading className="text-white font-semibold">
          Add advertisement
        </Heading>
        <p className="text-white font-semibold">
          One Advertisement Costs 0.001Eth ,We suggest using an advertisement
          image with a banner-like ratio.
        </p>
        <textarea
          type="text"
          rows={10}
          placeholder="Enter AD content..."
          className="w-full p-2 bg-transparent text-white border-b-2 focus:outline-none"
          ref={contentRef}
        />
        <input
          type="number"
          placeholder="count"
          ref={countRef}
          className="w-full p-2 bg-transparent  text-white border-b-2 focus:outline-none"
        />
        <input
          type="file"
          onChange={async (event) => {
            // setImageUpload(event.target.files[0]);
            await uploadFile(event.target.files[0]);
          }}
          className="w-full"
        />
        {imageUrl && (
          <button
            type="submit"
            className="w-full p-2 bg-white text-black rounded-md"
          >
            Advertise
          </button>
        )}
      </form>
    </div>
  );
};

export default Advertise;
