import { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import Social from "../utils/SocialContract.json";
import { SocialContractAddress } from "../config";
import { useParams } from "react-router";
import AccountHead from "./AccountHead";
import { Heading, Image } from "@chakra-ui/react";

const DetailedPost = (props) => {
  const commentRef = useRef();
  console.log(props);
  const params = useParams();
  const [postDetails, setPostDetails] = useState({});
  const postId = params.postid;

  const getPost = async () => {
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

        let allPosts = await SocialContract.getPost(postId);
        console.log(allPosts);
        const result = {
          author: allPosts.author,
          content: allPosts.content,
          likes: allPosts.likes,
          comments: allPosts.comments,
          imageUrl: allPosts.imageUrl,
          username: allPosts.username,
          headline: allPosts.headline,
        };
        console.log(result);
        setPostDetails(result);
      } else {
        console.log("Ethereum POst doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

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

        const comment = {
          content: commentRef.current.value,
          username: postDetails.username,
        };

        await SocialContract.addComments(postId, JSON.stringify(comment));
        SocialContract.addListener("CommentsAdded", () => {
          getPost();
          commentRef.current.value = "";
        });
      } else {
        console.log("Ethereum POst doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likePost = async () => {
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

        await SocialContract.likePost(postId);
        SocialContract.addListener("PostLiked", () => {
          getPost();
        });
      } else {
        console.log("Ethereum POst doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="h-auto flex-col w-full p-5 flex">
      <AccountHead />
      <div className=" bg-gray-800 p-5 rounded-md my-2">
        <p className="font-semibold text-gray-400">
          {postDetails.username + " - " + postDetails.author}
        </p>
        <Heading>{postDetails.headline}</Heading>
        <div className="flex gap-5 my-3">
          <Image
            src={postDetails.imageUrl}
            className="w-96 h-96 rounded-md object-cover"
          />
          <p className="p-2 font-normal my-2 rounded-md">
            {postDetails.content}
          </p>
        </div>
      </div>

      <div className="flex justify-between font-medium p-2">
        <p>Likes: {postDetails?.likes?.toString()}</p>
        <p>Comments: {postDetails?.comments?.length}</p>
      </div>
      <div className="flex gap-2 items-center p-2">
        <button
          onClick={likePost}
          className="bg-white text-black p-2 rounded-md"
        >
          Like
        </button>
        <form onSubmit={addComment} className="gap-2 flex w-full">
          <input
            type="text"
            placeholder="Add a comment..."
            ref={commentRef}
            className="bg-black border-b-2 border-solid w-full p-2 focus:outline-none"
          />
          <button className="bg-white text-black p-2 rounded-md" type="submit ">
            Send
          </button>
        </form>
      </div>
      <div className="my-2 p-4 font-bold bg-gray-800 rounded-md ">
        <p className="text-gray-400 my-1">#featured</p>
        <div className="flex gap-2 flex-col">
          <Image
            className=" w-96 h-96 rounded-md object-cover"
            src={props.advertisement.imageUrl}
          />
          <h1 className="w-auto p-2 font-medium text-lg ">
            {props.advertisement.content}
          </h1>
        </div>
      </div>
      <div className="p-2 border-solid border-gray-400 border-2 rounded-md mb-10">
        <p className="p-2 text-gray-400 font-semibold">Comments</p>
        {postDetails?.comments?.map((comment) => (
          <div className="bg-gray-800 p-2 rounded-md flex flex-col my-1">
            <p className="font-bold">{JSON.parse(comment)?.username}</p>
            <p>{JSON.parse(comment)?.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedPost;
