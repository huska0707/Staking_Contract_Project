import { useMediaQuery } from "@mui/material";
import { isEmpty } from "validator";
import Web3 from 'web3';

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
  
export const getReferralAddr = () => {
    const referral = window.localStorage.getItem('ref');
    if (isValidAddress(referral)) {
      return referral;
    } else {
      return DEFAULT_REFERRAL_ADDR;
    }
}