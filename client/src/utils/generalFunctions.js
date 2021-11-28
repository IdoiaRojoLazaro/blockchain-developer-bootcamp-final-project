const cropAccountString = stringAccount =>
  `${stringAccount.slice(0, 5)}...${stringAccount.slice(-5)}`;

export { cropAccountString };
