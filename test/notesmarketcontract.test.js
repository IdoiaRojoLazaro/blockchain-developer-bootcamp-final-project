let BN = web3.utils.BN;
const NotesMarketContract = artifacts.require('NotesMarketContract');
let catchRevert = require('./exceptionsHelpers.js').catchRevert;

contract('NotesMarketContract', function (accounts) {
  let instance;
  const admin_commission = 10;
  const admin = accounts[0];
  const publisher_1 = accounts[1];
  const publisher_2 = accounts[2];
  const reader_1 = accounts[3];
  const reader_2 = accounts[4];

  var noteOne = {
    IPFShash:
      '0x077e6a913a751f6cebd283470a0ab47ecff2e3e80c2dc089f031f909cd617df1',
    hash: '',
    title: 'The Big Mouth',
    author: 'Ether Dev',
    price: 1500,
    commission: 10
  };

  beforeEach(async () => {
    instance = await NotesMarketContract.new(admin_commission, { from: admin });
  });

  it('Should revert an operation if contract has been desactivated by circuit breaker', async () => {
    await instance.changeNotesMarketStatus({ from: admin });
    await catchRevert(instance.addUser(false, { from: reader_1 }));
  });

  it('Should add a new note with all details', async () => {
    let addUser = await instance.addUser(true, { from: publisher_1 });
    assert.equal(
      addUser.logs[0].event,
      'UserCreated',
      'user creation emitted right event'
    );
    console.log(addUser.logs[0]);

    let approveSeller = await instance.approveSeller(publisher_1, {
      from: admin
    });
    assert.equal(
      approveSeller.logs[0].event,
      'UserSellerApproved',
      'seller approval emitted right event'
    );

    let newNote = await instance.addNote(
      noteOne.IPFShash,
      noteOne.title,
      noteOne.author,
      noteOne.price,
      noteOne.commission,
      { from: publisher_1 }
    );
    assert.equal(
      newNote.logs[0].event,
      'NoteAdded',
      'new note call emitted right event'
    );
  });

  it('Should revert if a reader (not seller) tries to add a new book', async () => {
    await instance.addUser(true, { from: reader_1 });
    await catchRevert(
      instance.addNote(
        noteOne.IPFShash,
        noteOne.title,
        noteOne.author,
        noteOne.price,
        noteOne.commission,
        { from: reader_1 }
      )
    );
  });

  it('Should revert when duplicate note IPFS is added', async () => {
    await instance.addUser(true, { from: publisher_1 });

    await instance.approveSeller(publisher_1, { from: admin });
    await instance.addNote(
      noteOne.IPFShash,
      noteOne.title,
      noteOne.author,
      noteOne.price,
      noteOne.commission,
      { from: publisher_1 }
    );
    await catchRevert(
      instance.addNote(
        noteOne.IPFShash,
        noteOne.title,
        noteOne.author,
        noteOne.price,
        noteOne.commission,
        { from: publisher_1 }
      )
    );
  });
});
