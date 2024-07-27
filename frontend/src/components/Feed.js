import { ethers } from "ethers";
import Social from "../utils/SocialContract.json";
import { SocialContractAddress } from "../config";
import { useEffect, useState, useRef } from "react";
import checkTx from "../utils/checkTransaction";
import { useNavigate } from "react-router";
import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Input,
  Heading,
  Button,
  Image,
  Textarea,
  Avatar,
} from "@chakra-ui/react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Feed = () => {
  const [imageUpload, setImageUpload] = useState();
  const [imageUrl, setImageUrl] = useState(undefined);
  const [posts, setPosts] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef();
  const headlineRef = useRef();

  const getAllPosts = async () => {
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

        let allPosts = await SocialContract.getPosts();
        const result = [];
        for (let i = 0; i < allPosts.length; i++) {
          console.log(allPosts[i]);
          result.push({
            id: allPosts[i].postId,
            imageUrl: allPosts[i].imageUrl,
            headline: allPosts[i].headline,
            comments: allPosts[i].comments,
            username: allPosts[i].username,
            content: allPosts[i].content,
            author: allPosts[i].author,
            likes: allPosts[i].likes,
            comments: allPosts[i].comments,
          });
        }
        console.log(result);
        setPosts(result);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const uploadFile = async (imageup) => {
    const imageRef = ref(storage, `images/${imageup.name}`);
    const snapshot = await uploadBytes(imageRef, imageup);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    setImageUrl(downloadUrl);
  };

  const addPost = async (e) => {
    console.log("Adding post");
    e?.preventDefault();
    try {
      if (
        headlineRef.current.value.trim() === "" ||
        contentRef.current.value.trim() === ""
      ) {
        throw new Error("Please enter a headline and content");
      }
      const { ethereum } = window;

      if (ethereum) {
        const web3Provider = new ethers.BrowserProvider(ethereum);
        const signer = await web3Provider.getSigner();
        const SocialContract = await new ethers.Contract(
          SocialContractAddress,
          Social.abi,
          signer
        );
        await SocialContract.addPost(
          contentRef.current.value,
          headlineRef.current.value,
          imageUrl
        );
        SocialContract.addListener("PostAdded", () => {
          getAllPosts();
        });
        // console.log(allPosts.hash);
        // const res = checkTx(allPosts.hash, onPosting);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log("add post error");
      console.log(error);
    }
  };

  const onPosting = () => {
    alert("Successfully Posted");
    setIsPosting(false);
    headlineRef.current.value = "";
    contentRef.current.value = "";
    getAllPosts();
  };

  useEffect(() => {
    getAllPosts();
    getInteractions();
  }, []);

  const renderPost = (id, author) => {
    localStorage.setItem("author", author);
    navigate(`/${id}/${author}`);
  };

  const getInteractions = async () => {
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
        let allPosts = await SocialContract.getInteractions();
        console.log(allPosts);
        const result = [];
        for (let i = 0; i < allPosts.length; i++) {
          const account = await SocialContract.getUser(allPosts[i].user);
          console.log(account);
          result.push({
            imageUrl: account.avatar,
            username: account.username,
            user: allPosts[i].user,
            score: Number(allPosts[i].score),
          });
        }
        console.log(result);
        result.sort((a, b) => b.score - a.score);
        setInteractions(result);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" w-full p-5 flex justify-center gap-10 ">
      <div className=" overflow-y-scroll heightCustom scrollBarNone w-1/2">
        {posts.reverse().map((post) => {
          return (
            <div
              className="my-4 scale-100  transition-all ease-in duration-200 cursor-pointer w-full"
              onClick={renderPost.bind(null, post.id, post.author)}
            >
              <Card className="p-2">
                <Heading size="md" className="p-2 text-gray-800 rounded-md">
                  {post.username + " - " + post.author}
                </Heading>
                <Image
                  src={post.imageUrl}
                  className=" w-full h-96 object-cover rounded-md"
                />
                <CardBody>
                  <Heading className=" text-lg">{post.headline}</Heading>
                  <div className="flex gap-2">
                    <Text pt="3" fontSize="sm">
                      {post.likes + " Likes"}
                    </Text>
                    <Text pt="3" fontSize="sm">
                      {post.comments.length + " Comments"}
                    </Text>
                  </div>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
      <div
        className=" flex flex-col w-1/2 self-end gap-5  heightCustom justify-between
      "
      >
        <div className="p-2 border-solid border-whites border-2 rounded-md h-96 overflow-y-scroll scrollBarNone">
          <h1 className="my-2 text-lg text-white font-bold">
            Top Interactions!!
          </h1>
          {interactions.map((interaction) => {
            return (
              <div className=" bg-gray-800 p-2 rounded-md my-1">
                <div className="flex gap-2 my-1 items-center">
                  <Avatar size={"xs"} src={interaction.imageUrl} />
                  <h1 className="text-white text-base font-bold">
                    {interaction.username}
                  </h1>
                </div>

                <p className="text-red-300 font-semibold text-sm">
                  {interaction.user}
                </p>
                <p className="text-white text-sm">
                  {"Score : " + interaction.score}
                </p>
              </div>
            );
          })}
        </div>
        <form onSubmit={addPost}>
          <Heading className="text-white my-2">Whats on your mind??</Heading>
          <Input
            type="text"
            placeholder="Enter Headline"
            ref={headlineRef}
            className=" text-white p-2 h-50 w-96 my-2 "
          />
          <Textarea
            rows={4}
            type="text"
            placeholder="content"
            ref={contentRef}
            className=" text-white p-2 h-50 w-96 my-2 "
          />
          <input
            type="file"
            placeholder="content"
            onChange={async (e) => {
              setImageUpload(e.target.files[0]);
              await uploadFile(e.target.files[0]);
            }}
          />

          {imageUrl && (
            <Button
              // disabled={true}
              type="submit"
              className="bg-white"
              // disabled={imageUrl === undefined ? true : false}
            >
              Add Post
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Feed;
