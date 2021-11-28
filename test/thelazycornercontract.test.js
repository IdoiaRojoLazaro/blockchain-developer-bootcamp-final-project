let BN = web3.utils.BN;
const TheLazyCornerContract = artifacts.require('TheLazyCornerContract');
let catchRevert = require('./exceptionsHelpers.js').catchRevert;

contract('TheLazyCornerContract', function (accounts) {
  let instance;
  const admin = accounts[0];
  const seller_1 = accounts[1];
  const seller_2 = accounts[2];
  const buyer_1 = accounts[3];
  const buyer_2 = accounts[4];

  var noteOne = {
    IPFShash:
      '0x077e6a913a751f6cebd283470a0ab47ecff2e3e80c2dc089f031f909cd617df1',
    hash: '',
    title: 'The Big Mouth',
    description: 'neoiw ieoi doiewj ioewjow',
    author: 'Ether Dev',
    price: 2
  };
  var noteTwo = {
    IPFShash:
      '0x077e6a913a751f6cebd283470a0ab47ecff2e3e80c2dc089f031f909cd617df2',
    hash: '',
    title: 'bliblbib',
    description: 'neoiw ieoi doiewje jweonewoe ewiweoije eoieoiew ioewjow',
    author: 'Curlyyyy',
    price: 1800
  };

  beforeEach(async () => {
    instance = await TheLazyCornerContract.new({ from: admin });
  });

  it('Should revert an operation if contract has been desactivated by circuit breaker', async () => {
    await instance.changeTheLazyCornerStatus({ from: admin });
    await catchRevert(instance.addUser(false, { from: buyer_1 }));
  });

  it('Should add a new note with all details', async () => {
    let addUser = await instance.addUser(true, { from: seller_1 });
    assert.equal(
      addUser.logs[0].event,
      'UserCreated',
      'user creation emitted right event'
    );

    let approveSeller = await instance.approveSeller(seller_1, {
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
      noteOne.description,
      noteOne.author,
      noteOne.price,
      { from: seller_1 }
    );
    assert.equal(
      newNote.logs[0].event,
      'NoteAdded',
      'new note call emitted right event'
    );
  });

  it('Should revert if a buyer (not seller) tries to add a new note', async () => {
    await instance.addUser(false, { from: buyer_1 });
    await catchRevert(
      instance.addNote(
        noteOne.IPFShash,
        noteOne.title,
        noteOne.description,
        noteOne.author,
        noteOne.price,
        { from: buyer_1 }
      )
    );
  });

  it('Should revert if a admin tries to approve a buyer (not seller)', async () => {
    await instance.addUser(false, { from: buyer_1 });
    await catchRevert(instance.approveSeller(buyer_1, { from: admin }));
  });

  it('Should revert when duplicate note IPFS is added', async () => {
    await instance.addUser(true, { from: seller_1 });

    await instance.addNote(
      noteOne.IPFShash,
      noteOne.title,
      noteOne.description,
      noteOne.author,
      noteOne.price,
      { from: seller_1 }
    );
    await catchRevert(
      instance.addNote(
        noteOne.IPFShash,
        noteOne.title,
        noteOne.description,
        noteOne.author,
        noteOne.price,
        { from: seller_1 }
      )
    );
  });

  it('Should return list of notes available', async () => {
    await instance.addUser(true, { from: seller_1 });

    await instance.approveSeller(seller_1, { from: admin });
    await instance.addNote(
      noteOne.IPFShash,
      noteOne.title,
      noteOne.description,
      noteOne.author,
      noteOne.price,
      { from: seller_1 }
    );

    await instance.addNote(
      noteTwo.IPFShash,
      noteTwo.title,
      noteTwo.description,
      noteTwo.author,
      noteTwo.price,
      { from: seller_1 }
    );

    await instance.getAllNotes({ from: seller_1 });
  });

  it('Should return list of users registered', async () => {
    await instance.addUser(true, { from: seller_1 });
    await instance.addUser(false, { from: buyer_1 });
    await instance.addUser(true, { from: seller_2 });
    await instance.addUser(false, { from: buyer_2 });

    await instance.approveSeller(seller_1, { from: admin });

    //await instance.getAllUsers({ from: admin }).then((res) => console.log(res));
    let users = await instance.getAllUsers({ from: admin });

    assert.equal(users.length, 4, 'Users length must be 4');
    assert.equal(users[3].id, 4, 'Users id must be incrementing');
    assert.equal(
      users[0].isSellerApproved,
      true,
      'Seller must be shown as approved'
    );
    assert.equal(
      users[2].isSellerApproved,
      false,
      'Seller must be shown as not approved'
    );
    assert.equal(
      users[1].seller,
      false,
      'Buyer must have seller attr as false'
    );

    //assert.equal(usersPage1.length, 3, 'Users length page 1 must be 3');

    // let usersPage2 = await instance.getAllUsers(3, { from: admin });
    // assert.equal(usersPage2.length, 1, 'Users length page 2 must be 1');
  });

  it('...should charge required fee for note and refund excess', async () => {
    //add seller
    await instance.addUser(true, { from: seller_1 });
    //add buyer
    await instance.addUser(false, { from: buyer_1 });

    await instance.approveSeller(seller_1, { from: admin });
    let newNote = await instance.addNote(
      noteOne.IPFShash,
      noteOne.title,
      noteOne.description,
      noteOne.author,
      noteOne.price,
      { from: seller_1 }
    );
    let newNoteHash = newNote.logs[0].args.noteHash;

    let ownedNotes = await instance.getOwnedNotes({ from: seller_1 });
    assert(ownedNotes.length, 1, 'seller owned notes count must be 1');

    //initial balances
    let buyer_1BalanceBefore = await web3.eth.getBalance(buyer_1);
    let adminBalanceBefore = await web3.eth.getBalance(admin);
    let seller_1BalanceBefore = await web3.eth.getBalance(seller_1);
    // console.log('----- **** ----');
    // console.log(newNote);
    // console.log(buyer_1BalanceBefore);

    let noteBought = await instance.buyNote(newNoteHash, {
      from: buyer_1,
      value: noteOne.price
    });
    //console.log(noteBought.logs);
    assert(
      noteBought.logs[0].event,
      'NoteBought',
      'must emit NoteBought after successful purchase'
    );

    // final balances
    let seller_1BalanceAfter = await web3.eth.getBalance(seller_1);
    let buyer_1BalanceAfter = await web3.eth.getBalance(buyer_1);
    let adminBalanceAfter = await web3.eth.getBalance(admin);
    //console.log(seller_1BalanceAfter, buyer_1BalanceAfter, adminBalanceAfter);

    let commissionFee = new BN(noteOne.price).div(new BN(100));
    let paymentToSeller = new BN(noteOne.price).sub(new BN(commissionFee));
    //console.log(commissionFee, paymentToSeller);

    //console.log('sent: ', 2500, 'price: ', noteOne.price, 'commission: ', commissionFee, 'sellerPayment: ', paymentToSeller);

    let purchasedNotes = await instance.getMyPurchasedNotes({ from: buyer_1 });
    let allNotes = await instance.getAllNotes({ from: seller_1 });
    //console.log('****************');
    //console.log(allNotes[0].purchaseCount);
    assert(purchasedNotes.length, 1, 'buyer purchased notes count must be 1');
    assert.equal(
      allNotes[0].purchaseCount,
      1,
      'note purchaseCount must increase by 1'
    );

    assert.equal(
      new BN(seller_1BalanceAfter).toString(),
      new BN(seller_1BalanceBefore).add(paymentToSeller).toString(),
      "seller_1's balance should be increased by price of note minus commission"
    );

    assert.equal(
      new BN(adminBalanceAfter).toString(),
      new BN(adminBalanceBefore).add(commissionFee).toString(),
      "notes shop's balance should be increased by commission fee of note"
    );

    assert.isBelow(
      Number(buyer_1BalanceAfter),
      Number(new BN(buyer_1BalanceBefore).sub(new BN(noteOne.price))),
      "buyer_1's balance should be decreased by price of note and gas cost"
    );
  });
});