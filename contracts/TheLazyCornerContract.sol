// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/** 
  * @title The Lazy Corner Contract
  * @author Idoia Rojo Lázaro
  * @dev Contract for selling and bying notes
*/

contract TheLazyCornerContract {

  using SafeMath for uint256;

  bool private theLazyCornerIsClosed = false;
  address payable private admin;

  constructor(){
    admin = payable(msg.sender);
  }

  Note[] public notesArr;
  User[] public usersArr;
  bool locked = false;

  // List of notes indexed by note hash
  mapping(bytes32 => uint) private notesHashes;

  // List of notes indexed by ifps hash
  mapping(bytes32 => bytes32) private IPFSHashes;

  // List of users indexed by address
  mapping(address => User) private users;

  // List of all note purchase tokens
  // Each note(noteHash) has a collection of buyers' accessTokens(addr -> accessToken)
  mapping(bytes32 => mapping(address => bytes32)) private purchaseTokens;

  // List of notes bought by buyers
  mapping(address => bytes32[]) private boughtNotes;

  // List of notes owned by sellers
  mapping(address => bytes32[]) private ownedNotes;


  // STRUCTS

  // User -> buyer or seller
  // Buy -> All buyers can buy notes
  // Sell -> Just approved sellers can sell notes
  struct User{
    uint id; // id - 1 -> position of user in array
    address userAddr;
    bool seller; // Note owner
    bool isSellerApproved; // Is approved to sell
    uint8 exits;  // is registered
  }

  struct Note{
    bytes32 noteHash; // note id hash
    bytes32 IPFSHash; // note ipfs reference
    uint id; // id - 1 -> position of note in array
    address payable owner; 
    uint256 price; // price in tokens
    uint120 purchaseCount; // number of notes purchases
    uint8 exits;
    bool isApproved; // approved for sale
    string title;
    string description;
    string author;
  }

  // EVENTS
  event UserCreated(string message, address userAddress, bool isSeller);
  event UserRemoved(string message);
  event UserSellerApproved(string message);

  event NoteAdded(string message, bytes32 indexed noteHash, string title, string author);
  event NoteRemoved(string message);
  event NotePriceUpdated(string message, uint256 price);
  event NoteBought(string message, bytes32 indexed noteHash, address indexed buyer, address seller);


  // MODIFIERS
  /** 
    * @dev Checks if caller is role admin
    * @param userAddress Address of user
  */
  modifier isAdmin(address userAddress){
    require(userAddress == admin, "Is not admin");
    _;
  }

  /** 
    * @dev Checks if thelazycorner(market) is open - circuit breaker
  */
  modifier theLazyCornerIsOpen(){
    require(theLazyCornerIsClosed == false, "Notesmarket is closed by admin" );
    _;
  }
  
  /** 
    * @dev Checks if the user exists
    * @param userAddress Address of user
  */
  modifier userExists(address userAddress){
    require(users[userAddress].exits == 1, "User doesn't exist" );
    _;
  }

  /** 
    * @dev Checks if is the admin or a user that exists
    * @param userAddress Address of user, noteHash hash of the note
  */
  modifier isUserOrAdmin(address userAddress){
     require(users[userAddress].exits == 1 || userAddress == admin, "User doesn't exist" );
    _;
  }

  /** 
    * @dev Checks if the user is the admin or the owner of the note
    * @param userAddress Address of user, noteHash hash of the note
    * @param noteHash hash of the note
  */
  modifier isNoteOwnerOrAdmin(address userAddress, bytes32 noteHash){
    uint noteId = notesHashes[noteHash];
    require(userAddress == admin || userAddress == notesArr[noteId - 1].owner, "Is not admin nor the note owner");
    _;
  }
  
  /** 
    * @dev Checks if a user is approved to sell notes
    * @param userAddress Address of user, noteHash hash of the note
  */
  modifier canSellNotes(address userAddress){
    require(users[userAddress].seller && users[userAddress].isSellerApproved, "User can't sell notes");
    _;
  }
    
  /** 
    * @dev Checks if the note exists
    * @param noteHash hash of the note
  */
  modifier doesNoteExist(bytes32 noteHash){
    require(notesHashes[noteHash] != 0, "Note doesn't exist");
    uint noteId = notesHashes[noteHash];
    require(notesArr[noteId - 1].id != 0, "Note doesn't exist");
    _;
  }

  /** 
    * @dev Checks if the note has not been purchased
    * @param noteHash hash of the note
  */
  modifier notPurchased(bytes32 noteHash){
    uint noteId = notesHashes[noteHash];
    require(notesArr[noteId - 1].purchaseCount == 0, "Note has been purchased");
    _;
  }

  /** 
    * @dev Checks if a user has sufficient funds to buy a note
    * @param price Price of the note
  */
  modifier sufficientFunds(uint price){
    require(price <= msg.sender.balance, "Insufficient funds");
    _;
  }

  /** 
    * @dev Refunds with excess money to buyer after payment
    * @param price Price of the note
  */
  modifier returnExcess(uint price) {
    //refund them after pay for note
    _;
    // Silent failure if "there is no leftover to refund to buyer"
      if(msg.value > price){ 
        require(!locked, "Reentrant call detected!");
        locked = true;
        uint amountToRefund = msg.value - price;
        
        (bool success, ) = payable(msg.sender).call{value: amountToRefund}("");
        require(success);
        locked = false;
      }        
  }

  // FUNCTIONS

  /* NoteMarket */
      
  /** 
    * @dev Toggle contract status(open/close), just the admin can do it(Circuit breaker)
  */
  function changeTheLazyCornerStatus() isAdmin(msg.sender) external{
    theLazyCornerIsClosed = !theLazyCornerIsClosed;
  }

  /* Users */
  /** 
    * @dev Register of a new user
    * @param isSeller Is seller or buyer?
  */
  function addUser(bool isSeller) theLazyCornerIsOpen external{
    require(users[msg.sender].exits == 0, "User already registered");

    User memory user;
    user.id = usersArr.length + 1;
    user.userAddr = msg.sender;
    user.seller = isSeller;
    user.isSellerApproved = false; // Is approved to sell
    user.exits = 1;
  
    users[msg.sender] = user;
    usersArr.push(user);

    emit UserCreated("User successfully created", msg.sender, isSeller);
  }

  /** 
    * @dev Delete a user that exists, and delete all of its notes
  */
  function removeUser() userExists(msg.sender) external{
    if(users[(msg.sender)].seller){
      bytes32[] memory hashes = ownedNotes[msg.sender];

      for (uint i = 0; i < hashes.length; i++) {
        removeNote(hashes[i]);
      }
      delete ownedNotes[msg.sender];
    }
    delete users[msg.sender];

    emit UserRemoved("User successfully deleted");
  }

  /** 
    * @dev Get info of a user, just if it's the user itself or the admin
  */
  function getUser() isUserOrAdmin(msg.sender) view external returns(bool _authStatus, bool _isSeller, bool _isAdmin, bool _isSellerApproved){
      _authStatus = true;
      _isSeller = users[msg.sender].seller;
      _isSellerApproved = users[msg.sender].isSellerApproved;
      if(msg.sender == admin) _isAdmin = true;
  }

  /** 
    * @dev Approve a seller to sell notes and receive payments, just the admin can do it
    * @param userAddress Address of user, noteHash hash of the note
  */
  function approveSeller(address userAddress) theLazyCornerIsOpen isAdmin(msg.sender) userExists(userAddress) external{
    if(users[userAddress].seller){
      User storage user = users[userAddress];
      user.isSellerApproved = true;
      usersArr[user.id - 1].isSellerApproved = true;
      emit UserSellerApproved("User seller is approved for sell");
    }else{
      revert("User is not a seller");
    }
  }

  /** 
    * @dev Admin fetches users using filters, max 50 results // TO-DO pagination
    * @return _users array of users
    */
  function getAllUsers() isAdmin(msg.sender) view external returns (User[] memory _users){
    require(usersArr.length < 50 , "Can not fetch more than 50 results");

    _users = usersArr;
    return _users;
  }

  /* Notes */
  /** 
    * @dev Create a new note
    * @param _IPFShash Hash of the file(note) uploaded to IPFS
    * @param _title Title of the note
    * @param _description Description of the note
    * @param _author Author of the note
    * @param _price Price of the note (eth)
    */
  function addNote(bytes32 _IPFShash, string memory _title, string memory _description, string memory _author, uint256 _price) 
    theLazyCornerIsOpen userExists(msg.sender) canSellNotes(msg.sender) external{

    bytes32 _noteHash = IPFSHashes[_IPFShash];
    uint _noteId = notesHashes[_noteHash];
    require(_noteId == 0, "Note already exists");

    uint newNoteId = notesArr.length + 1;

    _noteHash = keccak256(abi.encodePacked(newNoteId));

    notesHashes[_noteHash] = newNoteId;
    IPFSHashes[_IPFShash] = _noteHash;
    ownedNotes[msg.sender].push(_noteHash);

    Note memory note;
    
    note.noteHash = _noteHash;
    note.IPFSHash = _IPFShash;
    note.id = newNoteId;
    note.owner = payable(msg.sender);
    note.price = _price; // wei
    note.purchaseCount = 0;
    note.exits = 1;
    note.title = _title;
    note.description = _description;
    note.author = _author;
    note.isApproved = true;

    notesArr.push(note);

    emit NoteAdded("Note successfully created", _noteHash, _title, _author);
  }

  /** 
    * @dev Delete an existing note
    * @param noteHash Hash of the note
    */
  function removeNote(bytes32 noteHash) doesNoteExist(noteHash) notPurchased(noteHash) isNoteOwnerOrAdmin(msg.sender, noteHash) public{
    delete notesHashes[noteHash];
    emit NoteRemoved("User successfully deleted");
  }

  /** 
    * @dev Buyer buy a note, only if the market is open
    * @param noteHash Hash of the note
    */
  function buyNote(bytes32 noteHash) theLazyCornerIsOpen userExists(msg.sender) doesNoteExist(noteHash) sufficientFunds(notesArr[notesHashes[noteHash] - 1].price) returnExcess(notesArr[notesHashes[noteHash] - 1].price) payable external {
    
    uint noteId = notesHashes[noteHash];
    Note memory note = notesArr[noteId - 1];
    
    address payable seller = note.owner;
    
    uint commissionFunds = note.price.div(100);
    uint paymentToSeller = note.price.sub(commissionFunds);
    bytes32 accessToken = generateAccessToken(msg.sender, note.IPFSHash);
    // store access token
    purchaseTokens[noteHash][msg.sender] = accessToken;
    // keep note purchase
    boughtNotes[msg.sender].push(noteHash);
    note.purchaseCount ++;
    notesArr[noteId - 1].purchaseCount = note.purchaseCount;

    (bool successSellerPayment, ) = seller.call{value: paymentToSeller}("");
    require(successSellerPayment, "Failed to send payment to seller");
    (bool successAdminPayment, ) = admin.call{value: commissionFunds}("");
    require(successAdminPayment, "Failed to send commission to admin");
    
    emit NoteBought("note bought", noteHash, msg.sender, seller);

  }

  /** 
    * @dev Admin fetches notes using filters, max 50 results // TO-DO pagination
    */
  function getAllNotes() userExists(msg.sender) view external returns (Note[] memory){
    require(notesArr.length < 50 , "Can not fetch more than 50 results");

    Note[] memory _notes;
    _notes = notesArr;
    return _notes;
  }

  /** 
    * @dev Fetch all of the notes that the buyer bought
    */
  function getMyPurchasedNotes() userExists(msg.sender) view public returns(bytes32[] memory _boughtNotes){
    _boughtNotes = boughtNotes[msg.sender];
  }

  /** 
  * @dev Fetch all of the notes that the seller uploaded, just if it's a seller
  */
  function getMyUploadedNotes() canSellNotes(msg.sender) userExists(msg.sender) view external returns(bytes32[] memory _ownedNotes){
    _ownedNotes = ownedNotes[msg.sender];
    for(uint i=0; i < _ownedNotes.length; i++){
      // exclude the leftover hashes in state array map ownedNotes
      if(notesHashes[_ownedNotes[i]] == 0){
        delete _ownedNotes[i];
      }
    }
  }

  /** 
    * @dev Generate access token to verify that the buyer bought a note, before providing access to the file
    * @param userAddr Address of user
    * @param IPFShash Hash of the file(note) uploaded to IPFS
    */
  function generateAccessToken(address userAddr, bytes32 IPFShash) private pure returns(bytes32) { //isAdmin(msg.sender)
    bytes32 salt = "S}7#%*SD30o7D";
    bytes32 accessToken = keccak256(abi.encodePacked(userAddr, IPFShash, salt));
    return accessToken;
  }
  
}
