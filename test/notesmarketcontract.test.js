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
  var noteTwo = {
    IPFShash:
      '0x077e6a913a751f6cebd283470a0ab47ecff2e3e80c2dc089f031f909cd617df2',
    hash: '',
    title: 'bliblbib',
    author: 'Curlyyyy',
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

  it('Should revert if a reader (not seller) tries to add a new note', async () => {
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

  it('Should return list of notes available', async () => {
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

    await instance.addNote(
      noteTwo.IPFShash,
      noteTwo.title,
      noteTwo.author,
      noteTwo.price,
      noteTwo.commission,
      { from: publisher_1 }
    );

    // instance
    //   .getAvailableNotes(10, 0, { from: publisher_1 })
    //   .then((res) => console.log(res));
    // await catchRevert(instance.getAvailableNotes(1, 10, { from: publisher_1 }));
    await instance
      .getAllNotes({ from: publisher_1 })
      .then((res) => console.log(res));
    //await catchRevert(instance.getAllNotes({ from: publisher_1 }));
  });

  it('...should charge required fee for note and refund excess', async () => {
    //add seller
    await instance.addUser(true, { from: publisher_1 });
    //add reader
    await instance.addUser(false, { from: reader_1 });

    await instance.approveSeller(publisher_1, { from: admin });
    let newNote = await instance.addNote(
      noteOne.IPFShash,
      noteOne.title,
      noteOne.author,
      noteOne.price,
      noteOne.commission,
      { from: publisher_1 }
    );
    let newNoteHash = newNote.logs[0].args.noteHash;
    //console.log(newNote.logs);

    let ownedNotes = await instance.getOwnedNotes({ from: publisher_1 });
    assert(ownedNotes.length, 1, 'publisher owned notes count must be 1');

    //initial balances
    let reader_1BalanceBefore = await web3.eth.getBalance(reader_1);
    let adminBalanceBefore = await web3.eth.getBalance(admin);
    let publisher_1BalanceBefore = await web3.eth.getBalance(publisher_1);

    let noteBought = await instance.buyNote(newNoteHash, {
      from: reader_1,
      value: 2500
    });
    //console.log(noteBought.logs);
    assert(
      noteBought.logs[0].event,
      'NoteBought',
      'must emit NoteBought after successful purchase'
    );

    // final balances
    let publisher_1BalanceAfter = await web3.eth.getBalance(publisher_1);
    let reader_1BalanceAfter = await web3.eth.getBalance(reader_1);
    let adminBalanceAfter = await web3.eth.getBalance(admin);

    let commissionFee = new BN(noteOne.price)
      .mul(new BN(noteOne.commission * 100))
      .div(new BN(10000));
    let paymentToSeller = new BN(noteOne.price).sub(new BN(commissionFee));

    //console.log('sent: ', 2500, 'price: ', noteOne.price, 'commission: ', commissionFee, 'sellerPayment: ', paymentToSeller);

    let purchasedNotes = await instance.getMyPurchasedNotes({ from: reader_1 });
    assert(purchasedNotes.length, 1, 'reader purchased notes count must be 1');

    assert.equal(
      new BN(publisher_1BalanceAfter).toString(),
      new BN(publisher_1BalanceBefore).add(paymentToSeller).toString(),
      "publisher_1's balance should be increased by price of note minus commission"
    );

    assert.equal(
      new BN(adminBalanceAfter).toString(),
      new BN(adminBalanceBefore).add(commissionFee).toString(),
      "noteshop's balance should be increased by commission fee of note"
    );

    assert.isBelow(
      Number(reader_1BalanceAfter),
      Number(new BN(reader_1BalanceBefore).sub(new BN(noteOne.price))),
      "reader_1's balance should be decreased by price of note and gas cost"
    );
  });
});
