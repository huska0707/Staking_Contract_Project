import { useMediaQuery } from "@mui/material";
import { isEmpty } from "validator";
import Web3 from 'web3';

export const numberWithCommas = (x, digits = 3) => {
    if (isEmpty(x)) return '0';
    return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}