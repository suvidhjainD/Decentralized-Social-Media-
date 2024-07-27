// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Social {   
    //advertise
    //loyalty funds 
    //add loyal followers
    //incentives
    //add post
    //like a post
    //comment a post

    struct Post{
        uint postId;
        address author;
        string content;
        uint likes;
        string[] comments;
    }

    struct Advertisements{
        uint advertisementId;
        address author;
        string content;
        uint count;
    }

    struct Account {
        address author;
        address[] loyalAddress;
        uint rewards;
        uint loyaltyRewards; //this reward is used to ditribute rewards among the loyals
        
    }

    event postAdded(uint postId,address author); 
    event postLiked(uint postId,address likedBy);
    event advertisementAdded(uint advertisementId,address author);
    event commentsAdded(uint postId,string comment);
    event loyalsAdded(address author);

    mapping(uint => mapping(address => bool)) public likesMapping;
    Post[] public posts;
    Advertisements[] ads;
    uint public nextPostId;
    uint public nextadvertisementId;

    function addPost(string memory _content) public {
         posts.push(Post({postId:nextPostId, author:msg.sender, content:_content, likes:0, comments:new string[](0)}));
         emit postAdded(nextPostId, msg.sender);
         nextPostId++;
    }

    function addAdvertisement(string memory _content,uint count) payable  public {
         ads.push(Advertisements(nextadvertisementId,msg.sender,_content,count));
         emit advertisementAdded(nextadvertisementId, msg.sender);
         nextadvertisementId++;
    }

    function likePost(uint _postId) public {
        require(_postId < posts.length, "Post does not exist");
        require(!likesMapping[_postId][msg.sender], "Already liked");
        
        posts[_postId].likes++;
        likesMapping[_postId][msg.sender] = true;
        emit postLiked(_postId, msg.sender);
    } 
    function addComments(uint _postId,string memory _content) public {
         require(_postId < posts.length, "Post does not exist");
        posts[_postId].comments.push(_content);
        emit commentsAdded(_postId, _content);
    }
    function renderAds(uint advertisementid,address receipentId) public returns (Advertisements memory){
        require(advertisementid < ads.length, "Advertisement does not exist");
        require(ads[advertisementid].count > 0, "No remaining ads");
        
        //rewards of 50% goes to the receipent 
        ads[advertisementid].count--;
        return ads[advertisementid];
     
        
    }
    
    
}