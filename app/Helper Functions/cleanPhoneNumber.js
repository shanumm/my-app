function cleanPhoneNumber(number) {
  // Remove "+91" if exists
  if (number.startsWith("+91")) {
    number = number.substring(3);
  }

  // Remove all non-numeric characters
  number = number.replace(/\D/g, "");

  return number;
}

export { cleanPhoneNumber };
