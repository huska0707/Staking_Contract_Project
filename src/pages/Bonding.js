import { useMemo, useState } from "react";
import { numberWithCommas, getReferralAddr, fromWei } from "@utils/utils";

const Bondig = () => {
    const [bondType, setBondType] = useState(0);
    const [fromAmount, setFromAmount] = useState("");
    const { pricePLS } = useApiContext();
    const {
      loading,
      pending,
      txType,
      address,
      ethBalance,
      tokenBalance,
      ethReserve,
      tokenReserve,
      bondActivations,
      userBond,
      userData,
      buyToken,
      // withdrawToken,
    } = useWeb3Context();
    return (
        <div className="container mx-auto px-4 sm:px-8">
            <div className="block rounded-2xl w-full max-w-[600px] mx-auto bg-white text-center shadow-card dark:bg-[#161F3E] z-50 mt-8">
                <div className="px-6 pt-8 pb-6 dark:text-neutral-50 text-4xl font-bold">
                    Bond SAM
                </div>
                <div className="flex flex-col px-6 py-2 gap-4 text-left">
                <div className="flex flex-col">
                    <p className="dark:text-neutral-50 mb-2">New Bond</p>
                    <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-6 py-2 h-[90px]">
                    <div className="flex flex-col justify-center items-start w-[calc(100%-80px)]">
                        <input
                        name="from"
                        type="number"
                        className="w-full dark:text-neutral-50 font-semibold text-2xl bg-transparent focus-visible:outline-none"
                        placeholder="0.0"
                        value={fromAmount}
                        onChange={handleChange}
                        autoFocus
                        ></input>
                        <span className="text-gray-400 font-light">
                        ${numberWithCommas(fromAmountInUSD, 6)}
                        </span>
                    </div>
                    <div className="flex flex-col justify-center items-end min-w-[80px]">
                        <div className="flex items-center gap-2">
                        <img src="assets/pls.png" alt="pls" width="36" height="36" />
                        <span className="text-app-color text-2xl font-bold">PLS</span>
                        </div>
                        <span className="text-gray-400 font-light truncate">
                        Balance: {numberWithCommas(ethBalance)}
                        </span>
                    </div>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Icon
                    icon="mingcute:down-fill"
                    className="w-10 h-10 text-white p-2 rounded-full bg-app-color"
                    />
                </div>
                <div className="flex flex-col">
                    <div className="flex justify-between bg-[#FFF7E7] dark:bg-[#0B122C] border border-app-color dark:border-[#0d183f] border-opacity-20 px-6 py-2 h-[90px]">
                    <input
                        className="w-[calc(100%-80px)] dark:text-neutral-50 font-semibold text-2xl bg-transparent focus-visible:outline-none"
                        placeholder="0.0"
                        value={numberWithCommas(toAmount, 4)}
                        readOnly
                    ></input>
                    <div className="flex flex-col justify-center items-end min-w-[80px]">
                        <div className="flex items-center gap-2">
                        <img src="assets/sam.png" alt="pls" width="36" height="36" />
                        <span className="text-app-color text-2xl font-bold">SAM</span>
                        </div>
                        <span className="text-gray-400 font-light truncate">
                        Balance: {numberWithCommas(tokenBalance)}
                        </span>
                    </div>
                    </div>
                </div>
                <div className="flex justify-center gap-2 dark:text-neutral-50">
                    <span>1 SAM</span>
                    <span>=</span>
                    <span className="text-app-color">
                    {numberWithCommas(samInPLS, 6)} PLS
                    </span>
                </div>
                <div className="flex flex-wrap justify-between">
                    {BOND_FREEZE_PERIODS.map((val, index) => (
                    <AnimButton
                        text={`${val} Days`}
                        key={index}
                        className="min-w-[120px]"
                        active={bondType === index}
                        disabled={!bondActivations[index]}
                        onClick={() => setBondType(index)}
                    />
                    ))}
                </div>
                </div>
            </div>

        </div>
    )
}

export default Bondig;