import { Button, Heading } from "@chakra-ui/react";

const LandingPage = (props) => {
  return (
    <div className="flex gap-5 w-full h-screen items-center">
      <div className="text-white w-1/2 mx-2 p-5 rounded-md flex flex-col gap-4 justify-center  ">
        <h1 className=" text-custom text-5xl font-black">CreatorCraft</h1>
        <p className=" text-lg font-semibold ">
          "Elevate creators with our Web3 dApp! Decentralized platform
          empowering artists, writers, and innovators. Join us in
          revolutionizing content creation!"
        </p>
        <Button onClick={props.connect} className=" raleway-bold  w-full ">
          Connect Wallet
        </Button>
      </div>
      <div className="flex flex-col w-1/2 mx-2 p-5 gap-4">
        <p className="text-white text-lg bg-slate-800 p-4 rounded-md">
          Decentralized Data Ownership: Take control of your data and content
          securely stored on the blockchain. No more worries about data breaches
          or censorship. Your creations, your rules.
        </p>
        <p className="text-white text-lg bg-red-800 p-4 rounded-md">
          Affordable Advertising: Say goodbye to hefty advertising fees. With
          CreatorCraft's decentralized advertising system, reaching your
          audience is easier and more cost-effective than ever before. Promote
          your content directly to your target audience without intermediaries.
        </p>
        <p className="text-white text-lg bg-slate-800 p-4 rounded-md">
          Fair Compensation: Say hello to fair compensation. CreatorCraft
          ensures that creators receive their rightful share of revenue
          generated from their content. No more exploitation or unfair
          profit-sharing. Your hard work deserves to be rewarded.
        </p>
        <p className="text-white text-lg bg-red-800 p-4 rounded-md">
          User Empowerment: Give your users the freedom to support their
          favorite creators. With CreatorCraft's built-in reward system, users
          can directly contribute to the success of their beloved creators.
          Empower your fans and foster a stronger creator-fan relationship.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
