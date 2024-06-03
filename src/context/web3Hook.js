import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
    useEthersSigner,
    useEthersProvider,
  } from "@utils/ethersAdapter";

  import {
    fromWei,
    toWei,
  } from "@utils/utils";
import { ABI, CONFIG } from "@utils/config";

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

    const signer = useEthersSigner(chain?.id ?? CONFIG.CHAIN_ID);
    const provider = useEthersProvider(chain?.id ?? CONFIG.CHAIN_ID);

    const { address } = useAccount();

    useEffect(() => {
        getProtocolOwner();
        updateUserInfo();
        const intVal = setInterval(() => {
          updateUserInfo();
        }, 3 * 60 * 1000); // 3 mins
        return (() => clearInterval(intVal))
      }, [address]);

    const updateUserInfo = async () => {
        await updateGlobalInfo();
        if (address) {
          const promise1 = getEthBalance();
          const promise2 = getTokenBalance();
          const promise3 = getTokenAllowance();
          const promise4 = getUserBond();
          const promise5 = getUIData();
          setLoading(true);
          await Promise.all([promise1, promise2, promise3, promise4, promise5]);
          setLoading(false);
        } else {
          setTokenBalance(0);
          setTokenAllowance(0);
          setUserBond(null);
          setUserData(null);
        }
    };
        
    const buyToken = async (uplineAddress, bondType, ethAmount) => {
        try {
          setPending(true);
          setTxType(TX_TYPE.BUY);
          const contract = new ethers.Contract(
            CONFIG.PROTOCOL_CONTRACT,
            ABI.PROTOCOL,
            signer
          );
          const params = [uplineAddress, bondType];
          const transaction = {
            from: address,
            to: CONFIG.PROTOCOL_CONTRACT,
            data: contract.interface.encodeFunctionData("buy", params),
            value: toWei(ethAmount),
          };
    
          await provider.estimateGas(transaction);
          const tx = await contract.buy(uplineAddress, bondType, {
            value: toWei(ethAmount),
          });
          toast.success(
            "Transaction has successfully entered the blockchain! Waiting for enough confirmations..."
          );
          await tx.wait();
          await updateUserInfo();
          toast.success(
            <span>
              Successfully bonded the token.{" "}
              <a
                className="text-blue-500"
                href={`${CONFIG.CHAIN_SCAN}${tx?.hash}`}
                target="_blank"
                rel="noreferrer"
              >
                View on scan
              </a>
            </span>
          );
        } catch (err) {
          console.log(err);
          const { error } = decodeError(err);
          toast.error(error);
        } finally {
          setTxType(TX_TYPE.NONE);
          setPending(false);
        }
      };

/*************************  Read Function   ****************************/
    
    const getEthBalance = async () => {
      try {
        if (!provider) return;
        const balance = await provider.getBalance(address);
        setEthBalance(fromWei(balance))
      } catch(err) {
        console.log(err)
      }
    }

    const getTokenBalance = async () => {
      try {
        const contract = new ethers.Contract(
          CONFIG.SAM_CONTRACT,
          ABI.SAM,
          provider
        );
        const result = await contract.balanceOf(address);
        setTokenBalance(fromWei(result));
      } catch (err) {
        console.log(err);
      }
    };

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

   const getProtocolOwner = async () => {
      try {
        const contract = new ethers.Contract(
          CONFIG.PROTOCOL_CONTRACT,
          ABI.PROTOCOL,
          provider
        );
        const result = await contract.owner();
        setOwner(result);
      } catch (err) {
        console.log(err);
      }
   };

   const getTokenLiquidity = async () => {
      try {
        const contract = new ethers.Contract(
          CONFIG.PROTOCOL_CONTRACT,
          ABI.PROTOCOL,
          provider
        );
        const result = await contract.getTokenLiquidity();
        setEthReserve(fromWei(result?.liquidityETH));
        setTokenReserve(fromWei(result?.liquidityERC20));
      } catch (err) {
        console.log(err);
      }
   };

   const getTokenBalanceByAddress = async (addr) => {
    try {
      const contract = new ethers.Contract(
        CONFIG.SAM_CONTRACT,
        ABI.SAM,
        provider
      );
      const result = await contract.balanceOf(addr);
      return fromWei(result);
    } catch(err) {
      console.log(err)
    }
   };

   const getUIData = async () => {
    try {
      if (!address) return;
      const contract = new ethers.Contract(
        CONFIG.PROTOCOL_CONTRACT,
        ABI.PROTOCOL,
        provider
      );
      const result = await contract.getUIData(address);
      const r = result[0];
      const data = {
        upline: r.upline,
        refLevel: r.refLevel,
        bondsNumber: r.bondsNumber,
        totalInvested: parseFloat(fromWei(r.totalInvested)),
        liquidityCreated: parseFloat(fromWei(r.liquidityCreated)),
        totalRefReward: parseFloat(fromWei(r.totalRefReward)),
        totalRebonded: parseFloat(fromWei(r.totalRebonded)),
        totalSold: parseFloat(fromWei(r.totalSold)),
        totalClaimed: parseFloat(fromWei(r.totalClaimed)),
        refTurnover: parseFloat(fromWei(r.refTurnover)),
        userAvailableAmount: parseFloat(fromWei(result.userTokensBalance)),
        userHoldBonus: ((Number(result.userHoldBonus) / 10000) * 100).toFixed(2),
        userLiquidityBonus: ((Number(result.userLiquidityBonus) / 10000) * 100).toFixed(2),
        globalLiquidityBonus: ((Number(result.globalLiquidityBonus) / 10000) * 100).toFixed(2),
        bondTypeStatus: {
          0: result[5][0],
          1: result[5][1],
          2: result[5][2],
          3: result[5][3],
        },
        referralsNumber: parseFloat(r.refsNumber),
        referrals: r.refs,
      };
      setBondActivations(result?.bondActivations?.slice(0, 4))
      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const tokenToUsd = (tokenAmount) => {
    return !tokenAmount || !pricePLS ? "0.00" : Number(tokenAmount)* pricePLS;
  }

  const tokenToCoin = (tokenAmount) => {
    return !tokenAmount || tokenReserve <= 0 || Number(tokenAmount) < 0.1 
    ? "0.0000"
    : (Number(tokenAmount) * ethReserve) / tokenReserve;
  } 

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
    getTokenLiquidity,
    tokenToUsd,
    tokenToCoin,
    getTokenBalanceByAddress,
    buyToken,
    getUIData,
    }
}