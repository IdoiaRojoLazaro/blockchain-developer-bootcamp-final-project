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

  constructor(uint8 minCommission){
    admin = payable(msg.sender);
    notesMarketMinCommission = minCommission;
  }

  Note[] private notesArr;

  uint8 private notesMarketMinCommission;

  // List of notes indexed by note hash -> numerical id
  mapping(bytes32 => uint) private notesHashes;

  // List of notes indexed by ifps hash -> note id hash
  mapping(bytes32 => bytes32) private IPFSHashes;

  // List of users indexed by address
  mapping(address => User) private users;
  uint public usersCount;

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
      // percentage 0-100 commission to store
      // 10000th (10% -> 1000) to keep 2dp
    uint16 commission;
    uint8 exits;
    bool isApproved; // approved for sale
  }

  // EVENTS
  event UserCreated(string message, address userAddress, bool isNoteOwner);
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

  modifier validCommission(uint8 commission){
    require(commission >=0 && commission <= 100, "Commission must be between 0 and 100");
    require(commission >= notesMarketMinCommission, "Commission is set too low");
    _;
  }


  // FUNCTIONS

  /* NoteMarket */

  function changeNotesMarketStatus() isAdmin(msg.sender) external{
    notesMarketIsClosed = !notesMarketIsClosed;
  }

  /* Users */
  
  function addUser(bool noteOwner) notesMarketIsOpen external{
    require(users[msg.sender].exits == 0, "User already registered");

    bool isSellerApproved = false;
    uint8 exists = 1;

    users[msg.sender] = User(msg.sender, noteOwner, isSellerApproved, exists);
    usersCount ++;

    emit UserCreated("User successfully created", msg.sender, noteOwner);
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

  function getUser() isUserOrAdmin(msg.sender) view external returns(bool _authStatus, bool _isSeller, bool _isAdmin){
      _authStatus = true;
      _isSeller = users[msg.sender].seller;
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

  /* Notes */

  function addNote(bytes32 _IPFShash, string memory _title, string memory _author, uint256 _price, uint8 _commission) 
    userExists(msg.sender) canSellNotes(msg.sender) validCommission(_commission) external{

    bytes32 _noteHash = IPFSHashes[_IPFShash];
    uint _noteId = notesHashes[_noteHash];
    require(_noteId == 0, "Note already exists");

    bool isApproved;

    if(_commission >= notesMarketMinCommission){
      isApproved = true;
    }

    uint commission = uint16(100).mul(_commission);
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
    note.price = _price;
    note.purchaseCount = 0;
    note.commission = uint16(commission);
    note.exits = 1;
    note.isApproved = isApproved;

    notesArr.push(note);

    emit NoteAdded("Note successfully created", _noteHash, _title, _author);
  }

  function removeNote(bytes32 noteHash) doesNoteExist(noteHash) notPurchased(noteHash) isNoteOwnerOrAdmin(msg.sender, noteHash) public{
    delete notesHashes[noteHash];
    emit NoteRemoved("User successfully deleted");
  }


}
