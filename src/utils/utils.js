import { useMediaQuery } from "@mui/material";
import { isEmpty } from "validator";
import Web3 from 'web3';

export const IsMobile = () => {
    return useMediaQuery('(max-width:1023px)');
}

export const numberWithCommas = (x, digits = 3) => {
    if (isEmpty(x)) return '0';
    return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export const formatDateTime = (time) => {
    return formatDateFn(time * 1000, "MMM dd, yyyy, h:mm a");
}
  
export const getUtcNow = () => {
    const now = new Date();
    return now.getTime();
}

export function fromWei(amount, decimal = 18) {
    amount = ethers.utils.formatUnits(amount, decimal)
    if (typeof amount === 'string') {
      amount = Number(amount)
    }
    return isNaN(amount) ? 0 : amount
  }
  
export const getReferralAddr = () => {
    const referral = window.localStorage.getItem('ref');
    if (isValidAddress(referral)) {
      return referral;
    } else {
      return DEFAULT_REFERRAL_ADDR;
    }
}

export const isValidAddress = (addr) => {
  return ethers.utils.isAddress(addr);
}

export const copyToClipboard = (data) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(data);
  } else {
    var textField = document.createElement('textarea')
    textField.innerText = data;
    textField.style.position = "fixed";
    textField.style.left = "-999999px";
    textField.style.top = "-999999px";
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }
}

export const makeShort = (text, len = 5) => {
  return text.substring(0, len) + "...." + text.substring(text.length - len.length)
}