import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const useSigningWeb3Client = () => {
    const [ethBalance, setEthBalance] = useState(0);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [tokenAllowance, setTokenAllowance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pending, setPending] = useState(false);
    const [txType, setTxType] = useState(TX_TYPE.NONE);
    const [ethReserve, setEthReserve] = useState(0);
    const [tokenReserve, setTokenReserve] = useState(0);
    const [userBond, setUserBond] = useState();
    const [userData, setUserData] = useState();
    const [owner, setOwner] = useState();
    const [globalLiquidityBonus, setGlobalLiquidityBonus] = useState(0);
    const [bondActivations, setBondActivations] = useState([
      true,
      false,
      false,
      false,
    ]);
  
    const getTokensAmount = async (ethAmount) => {
        try {
          const contract = new ethers.Contract(
            CONFIG.PROTOCOL_CONTRACT,
            ABI.PROTOCOL,
            provider
          );
          const result = await contract.getTokensAmount(toWei(ethAmount));
          return fromWei(result);
        } catch (err) {
          console.log(err);
        }
      };
      
    return {
            loading,
    pending,
    txType,
    address,
    owner,
    ethBalance,
    tokenBalance,
    tokenAllowance,
    ethReserve,
    tokenReserve,
    userBond,
    userData,
    bondActivations,
    globalLiquidityBonus,
    getTokensAmount,
    }
}