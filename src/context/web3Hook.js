import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
    useEthersSigner,
    useEthersProvider,
  } from "@utils/ethersAdapter";

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
          // const web3 = new Web3(CONFIG.CHAIN_RPC);
          // const contract = new web3.eth.Contract(ABI.PROTOCOL, CONFIG.PROTOCOL_CONTRACT);
          // let result = await contract.methods.getTokenLiquidity().call();
          // setEthReserve(fromWei(result?.liquidityETH));
          // setTokenReserve(fromWei(result?.liquidityERC20));
          // ethers 
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
    buyToken,
    }
}