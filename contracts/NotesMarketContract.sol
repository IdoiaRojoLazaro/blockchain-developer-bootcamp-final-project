// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/// @title NotesMarketContract
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Contract for selling and bying notes market

/**
@title 
 */
contract NotesMarketContract {

  using SafeMath for uint256;
    using SafeMath for uint16;

  bool private notesMarketIsClosed = false;
  address payable private admin;

  constructor(){
    admin = payable(msg.sender);
  }

  Note[] public notesArr;
  User[] public usersArr;

  // List of notes indexed by note hash -> numerical id
  mapping(bytes32 => uint) private notesHashes;

  // List of notes indexed by ifps hash -> note id hash
  mapping(bytes32 => bytes32) private IPFSHashes;

  // List of users indexed by address
  mapping(address => User) private users;

  // List of all note purchase tokens
  // for each note(noteHash), there is a collection of buyers' accessTokens(add -> accessToken)
  mapping(bytes32 => mapping(address => bytes32)) private purchaseTokens;

  // List of notes bought by users
  mapping(address => bytes32[]) private boughtNotes;

  // List of notes owned by users
  mapping(address => bytes32[]) private ownedNotes;


  // STRUCTS

  // User -> buyer and/or seller
  // Buy -> All users can buy notes
  // Sell -> Just approved users can sell notes
  struct User{
    address userAddr;
    bool seller; // Note owner
    bool isSellerApproved; // Is approved to sell
    uint8 exits;  
  }

  struct Note{
    bytes32 noteHash; // note id hash
    bytes32 IPFSHash; // note ipfs reference
    uint id; // id - 1 -> position of bote in dynamic array
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
  modifier isAdmin(address userAddress){
    require(userAddress == admin, "Is not admin");
    _;
  }
  
  modifier notesMarketIsOpen(){
    require(notesMarketIsClosed == false, "Notesmarket is closed by admin" );
    _;
  }

  modifier userExists(address userAddress){
    require(users[userAddress].exits == 1, "User doesn't exist" );
    _;
  }

  modifier isUserOrAdmin(address userAddress){
     require(users[userAddress].exits == 1 || userAddress == admin, "User doesn't exist" );
    _;
  }

  modifier isNoteOwnerOrAdmin(address userAddress, bytes32 noteHash){
    uint noteId = notesHashes[noteHash];
    require(userAddress == admin || userAddress == notesArr[noteId - 1].owner, "Is not admin nor the note owner");
    _;
  }

  modifier doesNoteExist(bytes32 noteHash){
    require(notesHashes[noteHash] != 0, "Note doesn't exist");
    uint noteId = notesHashes[noteHash];
    require(notesArr[noteId - 1].id != 0, "Note doesn't exist");
    _;
  }

  modifier notPurchased(bytes32 noteHash){
    uint noteId = notesHashes[noteHash];
    require(notesArr[noteId - 1].purchaseCount == 0, "Note has been purchased");
    _;
  }

  modifier canSellNotes(address userAddress){
    require(users[userAddress].seller && users[userAddress].isSellerApproved, "User can't sell notes");
    _;
  }

  modifier sufficientFunds(uint price){
    require(price <= msg.sender.balance, "insufficient funds");
    _;
  }


  // FUNCTIONS

  /* NoteMarket */

  function changeNotesMarketStatus() isAdmin(msg.sender) external{
    notesMarketIsClosed = !notesMarketIsClosed;
  }

  /* Users */
  
  function addUser(bool isSeller) notesMarketIsOpen external{
    require(users[msg.sender].exits == 0, "User already registered");

    User memory user;

    user.userAddr = msg.sender;
    user.seller = isSeller;
    user.isSellerApproved = false; // Is approved to sell
    user.exits = 1;
  
    users[msg.sender] = user;
    usersArr.push(user);

    emit UserCreated("User successfully created", msg.sender, isSeller);
  }

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

  function getUser() isUserOrAdmin(msg.sender) view external returns(bool _authStatus, bool _isSeller, bool _isAdmin, bool _isSellerApproved){
      _authStatus = true;
      _isSeller = users[msg.sender].seller;
      _isSellerApproved = users[msg.sender].isSellerApproved;
      if(msg.sender == admin) _isAdmin = true;
  }


  function approveSeller(address userAddress) notesMarketIsOpen isAdmin(msg.sender) userExists(userAddress) external{
    if(users[userAddress].seller){
      User storage user = users[userAddress];
      user.isSellerApproved = true;
      emit UserSellerApproved("User seller is approved for sell");
    }else{
      revert("User is not a seller");
    }
  }

  function getAllUsers() isAdmin(msg.sender) view external returns (User[] memory){
    User[] memory _users;
    _users = usersArr;
    return _users;
  }

  /* Notes */

  function addNote(bytes32 _IPFShash, string memory _title, string memory _description, string memory _author, uint256 _price) 
    userExists(msg.sender) canSellNotes(msg.sender) external{

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

  function removeNote(bytes32 noteHash) doesNoteExist(noteHash) notPurchased(noteHash) isNoteOwnerOrAdmin(msg.sender, noteHash) public{
    delete notesHashes[noteHash];
    emit NoteRemoved("User successfully deleted");
  }

  function getAllNotes() userExists(msg.sender) view external returns (Note[] memory){
    Note[] memory _notes;
    _notes = notesArr;
    return _notes;
  }

  function buyNote(bytes32 noteHash) notesMarketIsOpen userExists(msg.sender) doesNoteExist(noteHash) sufficientFunds(notesArr[notesHashes[noteHash] - 1].price) payable external {
    uint noteId = notesHashes[noteHash];
    Note memory note = notesArr[noteId - 1];
    
    address payable seller = note.owner;
    
    uint commissionFunds = note.price.div(100);
    uint paymentToSeller = note.price.sub(commissionFunds);
    //bytes32 accessToken = generateAccessToken(msg.sender, note.IPFSHash);
    // store access token
    //purchaseTokens[noteHash][msg.sender] = accessToken;
    // keep note purchase
    boughtNotes[msg.sender].push(noteHash);
    note.purchaseCount ++;
    notesArr[noteId - 1].purchaseCount = note.purchaseCount;

    seller.transfer(paymentToSeller);
    admin.transfer(commissionFunds);
    
    emit NoteBought("note bought", noteHash, msg.sender, seller);

  }

  function getMyPurchasedNotes() userExists(msg.sender) view public returns(bytes32[] memory _boughtNotes){
    _boughtNotes = boughtNotes[msg.sender];
  }

  function generateAccessToken(address userAddr, bytes32 IPFShash) private pure returns(bytes32) { //isAdmin(msg.sender)
    bytes32 salt = "S}7#%*SD30o7D";
    bytes32 accessToken = keccak256(abi.encodePacked(userAddr, IPFShash, salt));
    return accessToken;
  }

  function getOwnedNotes() canSellNotes(msg.sender) userExists(msg.sender) view external returns(bytes32[] memory _ownedNotes){
    _ownedNotes = ownedNotes[msg.sender];
    for(uint i=0; i < _ownedNotes.length; i++){
      // exclude the leftover hashes in state array map ownedNotes
      if(notesHashes[_ownedNotes[i]] == 0){
        delete _ownedNotes[i];
      }
    }
  }

  
}
