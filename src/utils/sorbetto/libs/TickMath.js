import { ethers } from "ethers";
import { CheckTick } from "@/utils/sorbetto/libs/TicksValidation";
import { MAX_TICK, MAX_VALUE_HEX } from "@/utils/sorbetto/libs/Constants";

const GetSqrtRatioAtTick = (tick) => {
    if(!CheckTick(tick)) throw new Error("[GetSqrtRatioAtTick] Error CheckTick error");;
    // ReSharper disable once IntVariableOverflowInUncheckedContext
    let absTick = +tick < 0 ? tick * -1 : +tick;

    if (+absTick > +MAX_TICK) throw new Error("[GetSqrtRatioAtTick] Error absTick > MAX_TICK");

    let ratio = (absTick & 1) != 0
        ? ethers.BigNumber.from("0xfffcb933bd6fad37aa2d162d1a594001")
        : ethers.BigNumber.from("0x100000000000000000000000000000000");

    if ((absTick & 0x2) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xfff97272373d413259a46990580e213a"))).shr(128);
    if ((absTick & 0x4) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xfff2e50f5f656932ef12357cf3c7fdcc"))).shr(128);
    if ((absTick & 0x8) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xffe5caca7e10e4e61c3624eaa0941cd0"))).shr(128);
    if ((absTick & 0x10) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xffcb9843d60f6159c9db58835c926644"))).shr(128);
    if ((absTick & 0x20) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xff973b41fa98c081472e6896dfb254c0"))).shr(128);
    if ((absTick & 0x40) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xff2ea16466c96a3843ec78b326b52861"))).shr(128);
    if ((absTick & 0x80) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xfe5dee046a99a2a811c461f1969c3053"))).shr(128);
    if ((absTick & 0x100) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xfcbe86c7900a88aedcffc83b479aa3a4"))).shr(128);
    if ((absTick & 0x200) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xf987a7253ac413176f2b074cf7815e54"))).shr(128);
    if ((absTick & 0x400) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xf3392b0822b70005940c7a398e4b70f3"))).shr(128);
    if ((absTick & 0x800) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xe7159475a2c29b7443b29c7fa6e889d9"))).shr(128);
    if ((absTick & 0x1000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xd097f3bdfd2022b8845ad8f792aa5825"))).shr(128);
    if ((absTick & 0x2000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0xa9f746462d870fdf8a65dc1f90e061e5"))).shr(128);
    if ((absTick & 0x4000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x70d869a156d2a1b890bb3df62baf32f7"))).shr(128);
    if ((absTick & 0x8000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x31be135f97d08fd981231505542fcfa6"))).shr(128);
    if ((absTick & 0x10000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x9aa508b5b7a84e1c677de54f3e99bc9"))).shr(128);
    if ((absTick & 0x20000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x5d6af8dedb81196699c329225ee604"))).shr(128);
    if ((absTick & 0x40000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x2216e584f5fa1ea926041bedfe98"))).shr(128);
    if ((absTick & 0x80000) != 0) ratio = (ratio.mul(ethers.BigNumber.from("0x48a170391f7dc42444e8fa2"))).shr(128);

    if (+tick > 0) ratio = ethers.BigNumber.from(MAX_VALUE_HEX).div(ratio);

    // this divides by 1<<32 rounding up to go from a Q128.128 to a Q128.96.
    // we then downcast because we know the result always fits within 160 bits due to our tick input constraint
    // we round up in the division so getTickAtSqrtRatio of the output price is always consistent

    const Q32 = ethers.BigNumber.from("1").shl(32);

    return ratio.shr(32).add((ratio.mod(Q32).eq(ethers.BigNumber.from("0")) ? ethers.BigNumber.from("0") : ethers.BigNumber.from("1")));
}

export { GetSqrtRatioAtTick }