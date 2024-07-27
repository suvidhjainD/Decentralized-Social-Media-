import { useEffect, useState } from "react";

import { SocialContractAddress } from "../config";
import checkTx from "../utils/checkTransaction";
import { ethers } from "ethers";
import Social from "../utils/SocialContract.json";
import DetailedPost from "./DetailedPost";
import { useNavigate, useParams } from "react-router";
import defaultAd from "../defaultAd.png";

const RenderAds = () => {
  const [Ad, setAd] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  console.log(params);

  const renderAds = async () => {
    try {
      if (localStorage.getItem("author") == localStorage.getItem("id")) {
        throw new Error(
          "No ads can be rendered if the content owner is himself"
        );
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

        let allPosts = await SocialContract.renderAds(
          params.recepientId,
          params.postid
        );
        console.log(allPosts);

        SocialContract.addListener("AdvertisementRendered", (ad) => {
          console.log(ad);
          setAd({
            content: ad.content,
            imageUrl: ad.imageUrl,
          });
        });
      } else {
        throw new Error("No ads");
      }
    } catch (error) {
      console.log(error.code);

      if (error.code === "ACTION_REJECTED") {
        navigate("/");
      }
      alert(error);

      setAd({
        content: "Post Advertisement in this Platform for 0.0001 eth/view",
        count: null,
        imageUrl: defaultAd,
      });
    }
  };

  useEffect(() => {
    renderAds();
  }, []);

  return (
    <div className="mx-auto min-h-screen  bg-black text-white h-fit flex justify-center items-center">
      {!Ad && (
        <h1 className=" font-semibold">
          Complete the transaction to view the full Post
        </h1>
      )}
      {Ad && <DetailedPost advertisement={Ad} />}
    </div>
  );
};

export default RenderAds;
