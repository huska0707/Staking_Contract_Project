import { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Icon } from "@iconify/react";
import ReactLoading from "react-loading";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip as ReactTooltip } from "react-tooltip";
import useApiContext from "@context/ApiContext";
import useWeb3Context from "@context/web3Context";
import {
  numberWithCommas,
  withRound,
  fromWei,
  getUtcNow,
  makeShort,
  copyToClipboard,
} from "@utils/utils";
import { toast } from "react-toastify";

const Staking = () => {
    const {
        loading,
        pending,
        txType,
        address,
        ethBalance,
        ethReserve,
        tokenReserve,
        globalLiquidityBonus,
        userBond,
        userData,
        tokenToUsd,
        tokenToCoin,
        stake,
        getUIData,
      } = useWeb3Context();
    const { pricePLS } = useApiContext();
    const navigate = useNavigate();
    const [ethAmount, setEthAmount] = useState(0);
    const [bondIdx, setBondIdx] = useState(-1);
    const [isRebond, setRebond] = useState(false);
    const [isSell, setSell] = useState(false);
    const [isClaim, setClaim] = useState(false);

    return (
        <div className="flex flex-col container mx-auto z-50 dark:text-neutral-50 mb-auto">
            <div className="px-6 pt-8 pb-6 text-4xl font-bold text-white">
            Stake SAM
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex flex-col gap-3 w-full lg:w-1/3">
                <div className="flex flex-col gap-[13px] rounded-2xl w-full h-fit mx-auto bg-white text-center dark:bg-[#161F3E] shadow-card px-6 py-4">
                    <div className="w-full h-20 mt-3">
                    <SelectBond
                        options={userBond?.bonds}
                        pricePLS={pricePLS}
                        tokenReserve={tokenReserve}
                        ethReserve={ethReserve}
                        onChange={handleChange}
                    />
                    </div>
                    <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-4 py-3 h-20">
                    <div className="flex flex-col w-[calc(100%-60px)] justify-start items-stretch">
                        <input
                        className="w-full  font-semibold text-2xl bg-transparent focus-visible:outline-none"
                        readOnly
                        value={ethAmount}
                        ></input>
                        <span className="text-gray-400 font-light text-left">
                        ${numberWithCommas(tokenToUsd(ethAmount), 6)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-end gap-2">
                        <img src="assets/pls.png" alt="pls" width="32" height="32" />
                        <span className="text-app-color text-2xl font-bold">PLS</span>
                        </div>
                        <span className="text-gray-400 font-light whitespace-nowrap">
                        Balance: {numberWithCommas(ethBalance)}
                        </span>
                    </div>
                    </div>

                    <div className="flex justify-center items-center gap-2 ">
                    <img src="assets/sam.png" alt="pls" width="30" height="30" />
                    <span>1 SAM</span>
                    <span>=</span>
                    <span className="text-app-color">
                        {numberWithCommas(tokenToCoin(1), 6)} PLS
                    </span>
                    </div>
                    <div className="w-full py-3">
                    <Button
                        variant="contained"
                        sx={{
                        width: "100%",
                        borderRadius: "100px",
                        fontSize: "20px",
                        backgroundSize: "150% 100%",
                        backgroundImage:
                            "linear-gradient(210deg, #00eaff 0%, #0080ff 25%, #8000ff 60%, #e619e6 84%, #f00 100%)",
                        transition: "all .4s ease-in-out",
                        "&:hover": {
                            backgroundPosition: "100% 0",
                            transition: "all .4s ease-in-out",
                        },
                        "&:disabled": {
                            opacity: "0.6",
                        },
                        }}
                        disabled={pending && txType === TX_TYPE.STAKE}
                        onClick={handleStake}
                    >
                        {pending && txType === TX_TYPE.STAKE ? (
                        <div className="flex items-center gap-2">
                            <ReactLoading
                            color="#fff"
                            type="spin"
                            width={25}
                            height={25}
                            className="transition"
                            />
                            <span className="text-white">PENDING...</span>
                        </div>
                        ) : (
                        <span className="text-white">
                            {bondIdx >= 0 ? "Stake" : "Buy a bond"}
                        </span>
                        )}
                    </Button>
                    </div>
                </div>
                </div>
            </div>
        </div>

    )
}

export default Staking