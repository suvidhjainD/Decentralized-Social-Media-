// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Social {   
    struct Post {
        uint postId;
        address author;
        string username;
        string headline;
        string content;
        string imageUrl;
        uint likes;
        string[] comments;
    }

    struct Advertisement {
        uint advertisementId;
        address author;
        string content;
        string imageUrl;
        uint count;
    }

    struct interactionObject{
        uint score;
        address user;
    }

    struct Account {
        address payable author;
        address payable[] loyalAddress;
        string username;
        string avatar;
        uint rewards;
        uint loyaltyRewards;
    }

    event PostAdded(uint postId, address author); 
    event PostLiked(uint postId, address likedBy);
    event AdvertisementAdded(uint advertisementId, address author);
    event CommentsAdded(uint postId, string comment);
    event LoyalAdded(address author);
    event AdvertisementRendered(Advertisement Ad);
    event RewardsWithdrawn(address account, uint amount);
    event LoyaltyRewardsDistributed(address account, uint amount);
    event AccountAdded();
    event AllFundsWithdrawn();

    mapping(uint => mapping(address => bool)) public likesMapping;
    Post[] public posts;
    Advertisement[] public ads;
    mapping(address => Account) public accounts;
    uint public nextPostId;
    uint public nextAdvertisementId;
    string[] usernameList;
    uint ownerRewards = 0;
    mapping(address => interactionObject[]) public interactions;


   function addAccount(address payable _author, string memory _username, string memory _avatar) public {
    require(accounts[_author].author == address(0), "Account already exists");
    require(!usernameExists(_username), "Username already exists");

    accounts[_author] = Account(_author, new address payable[](0), _username, _avatar, 0, 0);
    usernameList.push(_username); // Add username to the list
    emit AccountAdded();
}

function usernameExists(string memory _username) internal view returns (bool) {
    for (uint i = 0; i < usernameList.length; i++) {
        if (keccak256(bytes(usernameList[i])) == keccak256(bytes(_username))) {

            return true;
        }
    }
    return false;
}

    function addPost(string memory _content,string memory _headline,string memory _imageUrl) public {
        string memory _username = accounts[msg.sender].username;
        posts.push(Post({postId: nextPostId, author: msg.sender,username:_username,headline:_headline, content: _content, imageUrl:_imageUrl,likes: 0, comments: new string[](0) }));
        emit PostAdded(nextPostId, msg.sender);           
        nextPostId++;
    }

   function addAdvertisement(string memory _content, uint _count,string memory _imageUrl) payable public {
    require(msg.value == _count * 0.0001 ether, "Incorrect Ether value for advertisement");
    ads.push(Advertisement({advertisementId: nextAdvertisementId, author: msg.sender, content: _content, count: _count,imageUrl: _imageUrl}));
    emit AdvertisementAdded(nextAdvertisementId, msg.sender);
    nextAdvertisementId++;
}


    function likePost(uint _postId) public {
        require(_postId < posts.length, "Post does not exist");
        require(!likesMapping[_postId][msg.sender], "Already liked");

        posts[_postId].likes++;
        likesMapping[_postId][msg.sender] = true;

          if(msg.sender != posts[_postId].author)
        {
            uint flag = 0;
        for(uint i =0;i < interactions[posts[_postId].author].length;i++){
            if(interactions[posts[_postId].author][i].user == msg.sender){
               interactions[posts[_postId].author][i].score += 2;
                flag = 1;
            }
        }
        if(flag == 0){
            interactions[posts[_postId].author].push(interactionObject({user: msg.sender, score:2}));
        }}

        emit PostLiked(_postId, msg.sender);
    }

    function isLiked(uint _postId) public view returns (bool) {
            return likesMapping[_postId][msg.sender];
    }

   function unlikePost(uint _postId) public {
        require(_postId < posts.length, "Post does not exist");
        require(likesMapping[_postId][msg.sender], "Cannot unlike");

        posts[_postId].likes--;
        likesMapping[_postId][msg.sender] = false;
    }


    function addComments(uint _postId, string memory _content) public {
        require(_postId < posts.length, "Post does not exist");
        posts[_postId].comments.push(_content);
        emit CommentsAdded(_postId, _content);

    
        
        if(msg.sender != posts[_postId].author)
        {
            uint flag = 0;
        for(uint i =0;i < interactions[posts[_postId].author].length;i++){
            if(interactions[posts[_postId].author][i].user == msg.sender){
               interactions[posts[_postId].author][i].score += 3;
                flag = 1;
            }
        }
        if(flag == 0){
            interactions[posts[_postId].author].push(interactionObject({user: msg.sender, score:3}));
        }}

    }

    function renderAds(address _recipientId,uint _postId)  public returns (Advertisement memory) {
        // require(_advertisementId < ads.length, "Advertisement does not exist");
        // require(ads[_advertisementId].count > 0, "No remaining ads");
        if(msg.sender != posts[_postId].author)
       {
         uint anotherflag = 0;
        for(uint i =0;i < interactions[posts[_postId].author].length;i++){
            if(interactions[posts[_postId].author][i].user == msg.sender){
               interactions[posts[_postId].author][i].score += 1;
                anotherflag = 1;
            }
        }
        if(anotherflag == 0){
            interactions[posts[_postId].author].push(interactionObject({user: msg.sender, score:1}));
        }


       }
        
        uint _advertisementId = 0;
        bool flag = false;
        for(uint i = 0; i < ads.length; i++){
            if(ads[i].author == msg.sender) continue;
            if(ads[i].count > 0 ) {
                _advertisementId = i;
                flag = true;
                break;
            }
        }
        if(!flag) revert("No Ads");

        uint adRevenue = 100000000000000 wei;
        uint reward = adRevenue / 2; // Calculate reward (50% of ad revenue)
        uint loyaltyReward = adRevenue / 5; // Calculate loyalty reward (20% of ad revenue)
        uint ownerReward = adRevenue - reward - loyaltyReward;

        // Update recipient's rewards
        accounts[_recipientId].rewards += reward;
        // Store loyalty rewards
        accounts[_recipientId].loyaltyRewards += loyaltyReward;

        ownerRewards = ownerRewards + ownerReward;

        // Update contract's rewards (remaining 30%)
        accounts[address(this)].rewards += adRevenue - reward - loyaltyReward;

        // Decrement ad count
        ads[_advertisementId].count--;
       
    emit AdvertisementRendered(ads[_advertisementId]);
        return ads[_advertisementId];
    }
    
function addLoyal(address payable _loyalAddress) public {
    require(msg.sender == accounts[msg.sender].author, "Only account owner can add loyal followers");
    require(accounts[msg.sender].author != _loyalAddress, "Cannot add yourself as loyal follower");

    bool alreadyExists = false;
    for (uint i = 0; i < accounts[msg.sender].loyalAddress.length; i++) {
        if (accounts[msg.sender].loyalAddress[i] == _loyalAddress) {
            alreadyExists = true;
            break;
        }
    }
    require(!alreadyExists, "Loyal address already exists");

    accounts[msg.sender].loyalAddress.push(_loyalAddress);
    emit LoyalAdded(_loyalAddress);
}

    function withdrawRewards() public {
        uint rewards = accounts[msg.sender].rewards;
        require(accounts[msg.sender].rewards > 0, "No rewards to withdraw");

        payable(msg.sender).transfer(rewards);
        accounts[msg.sender].rewards = 0;
        emit RewardsWithdrawn(msg.sender, rewards);
    }

    function distributeLoyaltyRewards() public {
        uint loyaltyRewards = accounts[msg.sender].loyaltyRewards;
        require(loyaltyRewards > 0, "No loyalty rewards to distribute");

        // Distribute loyalty rewards to loyal followers
        if(accounts[msg.sender].loyalAddress.length == 0) {
            revert("No Loyals Added");
        }
        for (uint i = 0; i < accounts[msg.sender].loyalAddress.length; i++) {
            address loyal = accounts[msg.sender].loyalAddress[i];
            accounts[loyal].rewards += loyaltyRewards / accounts[msg.sender].loyalAddress.length;
        }
        accounts[msg.sender].loyaltyRewards = 0;
        emit LoyaltyRewardsDistributed(msg.sender, loyaltyRewards);
    }

    function getPosts() public view returns (Post[] memory) {
        return posts;
    }

    
    function getPost(uint _postid) public view returns (Post memory) {
       
        return posts[_postid];
    }
    

    function getUser(address acc_id) public view returns (Account memory) {
        require(accounts[acc_id].author == acc_id, "Account doesnt exist");
        return accounts[acc_id];
    }

    function withdrawAllFunds() public {
    // Check if the sender is the contract owner
    require(msg.sender == 0xd9b7062384F7cce39e96C13962f9C79d4c941438, "Only the contract owner can withdraw funds");

    // Ensure there are funds to withdraw
    require(ownerRewards > 0, "No owner funds available for withdrawal");

    // Transfer the entire contract balance to the contract owner
    payable(msg.sender).transfer(ownerRewards);
    emit AllFundsWithdrawn();
}
    function getInteractions() public view returns (interactionObject[] memory)  {
        return interactions[msg.sender];
    }
}