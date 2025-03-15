export function convertNumberToWords(amount: number): string {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const convertLessThanOneThousand = (num: number): string => {
    if (num === 0) {
      return "";
    }

    if (num < 20) {
      return ones[num];
    }

    const ten = Math.floor(num / 10) % 10;
    const one = num % 10;

    return ten > 0 ? tens[ten] + (one > 0 ? "-" + ones[one] : "") : ones[one];
  };

  const convertLessThanOneLakh = (num: number): string => {
    if (num === 0) {
      return "";
    }

    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;

    const thousandStr = thousand > 0 ? convertLessThanOneThousand(thousand) + " Thousand " : "";
    const remainderStr = remainder > 0 ? convertLessThanOneThousand(remainder) : "";

    return thousandStr + remainderStr;
  };

  const convertLessThanOneCrore = (num: number): string => {
    if (num === 0) {
      return "";
    }

    const lakh = Math.floor(num / 100000);
    const remainder = num % 100000;

    const lakhStr = lakh > 0 ? convertLessThanOneThousand(lakh) + " Lakh " : "";
    const remainderStr = remainder > 0 ? convertLessThanOneLakh(remainder) : "";

    return lakhStr + remainderStr;
  };

  if (amount === 0) {
    return "Zero Rupees Only";
  }

  // Handle the whole part
  const wholePart = Math.floor(amount);
  const decimalPart = Math.round((amount - wholePart) * 100);

  let result = "";

  if (wholePart > 0) {
    const crore = Math.floor(wholePart / 10000000);
    const remainder = wholePart % 10000000;

    const croreStr = crore > 0 ? convertLessThanOneThousand(crore) + " Crore " : "";
    const remainderStr = remainder > 0 ? convertLessThanOneCrore(remainder) : "";

    result = croreStr + remainderStr + "Rupees";
  }

  // Handle the decimal part
  if (decimalPart > 0) {
    result += " and " + convertLessThanOneThousand(decimalPart) + " Paise";
  }

  return result + " Only";
}
