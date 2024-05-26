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

    const handleBond = async () => {
        if (!address) {
          toast.warn("Please connect wallet");
          return;
        }
        if (fromAmount <= 0) {
          toast.warn("Please input the amount");
          return;
        }
        if (fromAmount < MIN_BOND_ETH) {
          toast.warn(
            "Bond: Minimum amount to bond is " +
              numberWithCommas(MIN_BOND_ETH) +
              " PLS"
          );
          return;
        }
        if (ethBalance > 0 && fromAmount > ethBalance) {
          toast.warn("Bond: Insufficient PLS balance");
          return;
        }
        if (Number(userData?.bondsNumber) + 1 > BOND_LIMIT) {
          toast.warn("Bond: You have reached bonds limit");
          return;
        }
        const refAddr = getReferralAddr();
        await buyToken(refAddr, bondType, fromAmount);
        setFromAmount("");
      };
    
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
                <div className="flex flex-col gap-4 px-6 py-6">
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
                    disabled={pending && txType === TX_TYPE.BUY}
                    onClick={handleBond}
                >
                    {pending && txType === TX_TYPE.BUY ? (
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
                        {address ? "Get tokens" : "Connect"}
                    </span>
                    )}
                </Button>
                <div className="flex items-start gap-2">
                    <Icon
                    icon="fluent:info-24-filled"
                    className="w-9 h-9 p-0 text-app-color"
                    />
                    <p className="text-gray-400 font-extralight text-sm tracking-wide py-2">
                    Upon the completion of the vesting period, you will receive{" "}
                    <span className="text-app-color font-semibold">+30%</span> in
                    tokens to the amount of your initial bond.
                    </p>
                </div>
                        </div>
                            </div>
                </div>
    )
}

export default Bondig;