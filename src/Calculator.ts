export type EvalModelKey = "dividendB" | "dividendPs" | "cashFlowB" | "cashFlowPs" | "earningsB" | "earningsPs"| "salesB" | "salesPs";
export type EvalModel = { value: EvalModelKey; label: string; marketCap?: boolean; };

export type CalcResult = {
    growthRate: number[];
    growthData: number[];
    growthDataPv: number[];
    terminalValue: number;
    terminalValueDiscounted: number;
    presentValueSum: number;
  }

export class IntrincValueData  {
    /**
     * Initialize the object
     * @param value The value per share, ex Earnings per share or Cashflow per share
     * @param growthRate The percentage of growth rate, ex 1 or 10 etc..
     * @param years The years where apply the simulation
     * @param discountRate Discount rate
     * @param finalMultiple The final multiple expeted at the end, ex if working with EPS the PE
     */
    constructor(value: number, growthRate: number, years=10, discountRate=10, finalMultiple = 15){
        this.Years = years;
        this.Value = value;
        this.GrowthRate = growthRate;
        this.DiscountRate = discountRate;
        this.GrowthDecline = 0;
        this.FinalMultiple = finalMultiple;
        this.Compound = false;
    }
    // model: EvalModelKey;
    shares?: number|null;
    Value: number;
    Years: number;
    Compound: boolean;
    DiscountRate: number;
    fairValueWeigth?: number;
    GrowthRate: number;
    GrowthDecline: number;
    FinalMultiple: number;
}
/**
 * Calculate the present value of the given value
 * @param value 
 * @param years 
 * @param discountRate 
 * @returns 
 */
export const presentValue = (value: number, years: number, discountRate: number): number => {
    return value * Math.pow((1 + discountRate / 100), (years) * -1);
}
/**
 * 
 * @param calcData 
 * @returns 
 */
export const calcIntrinsicValuePerShare = (calcData: IntrincValueData): CalcResult => {
    
    const data: number[] = [];
    const growthRate: number[] = [];
    const dataCompound: number[] = [];
    let lastValue: number = (calcData.Value as number);
    let lastGrowth: number = calcData.GrowthRate;
    // let terminalValue: number = 0;
    for (let y = 0; y < calcData.Years; y++) {
      lastValue = lastValue * (1 + lastGrowth / 100);
      data[y] = lastValue;
      growthRate[y] = lastGrowth;
      // dataCompound[y] = (lastValue * (1+ calcData.discountRate/100));
      if (calcData.Compound) {
        dataCompound[y] = presentValue(lastValue, y + 1, calcData.DiscountRate);
        //terminalValue += lastValue;
      }
      lastGrowth = lastGrowth - (lastGrowth * (calcData.GrowthDecline / 100));
    }
    const terminalValue = data[calcData.Years - 1] * calcData.FinalMultiple;
    const terminalValueDiscounted = presentValue(terminalValue, calcData.Years, calcData.DiscountRate);
    const presentValueSum = terminalValueDiscounted + (dataCompound.length > 0 ? dataCompound.reduce((p, c) => p + c) : 0);
    // console.log(data, terminalValue, dataCompound, terminalValueDiscounted, presentValueSum);
    // setCalcValue(presentValueSum);
    return {
      growthData: data,
      growthRate,
      growthDataPv: dataCompound,
      terminalValue,
      terminalValueDiscounted,
      presentValueSum
    }
  }