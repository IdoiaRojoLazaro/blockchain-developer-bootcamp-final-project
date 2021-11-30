const cropAccountString = (stringAccount) =>
  `${stringAccount.slice(0, 5)}...${stringAccount.slice(-5)}`;

const noteIsBought = (note, notesBought) =>
  notesBought.filter((item) => item === note.noteHash).length > 0;

export { cropAccountString, noteIsBought };
