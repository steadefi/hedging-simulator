import { compose } from "@mui/system";

var data = require("./data.json");

// //----------------------------------------------------------------------------------------------------
// let token_pair = "AVAXUSDC";
// const leverage = 3;
// const trigger_option = 2;
// const start_date = 1647518400;
// const end_date = 1655712000;
//----------------------------------------------------------------------------------------------------

const interval = 60 * 60; // hourly data

// Need to spit by "/"
// let base_token = "AVAX";
// let quote_token = "USDC";
// Need to set the base and quote for interest rate data array

//----------------------------------------------------------------------------------------------------
const principal = 1000;
let rf_rate = 0.0001;
//----------------------------------------------------------------------------------------------------

const Tigger = {
  Debt_ratio: 0,
  Net_delta: 1,
  Time_based: 2,
  //   Price_based: 3,
};

let debt_ratio_threshold = null;
let net_delta_threshold = null;
let time_based_interval = null;
// const price_based_par_threshold = 0.2; // TBD
//----------------------------------------------------------------------------------------------------
function getStandardDeviation(array) {
  if (!array || array.length === 0) {
    return 0;
  }
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}

function createData(Return, APY, Sharpe, Drawdown, frequency) {
  return { Return, APY, Sharpe, Drawdown, frequency };
}
//======================================== Start =======================================================
export default function Calculations(
  token_pair,
  leverage,
  trigger_option,
  triggerDebt,
  triggerDelta,
  triggerTime,
  start_date,
  end_date
) {
  // function calculations() {
  let baseToken = token_pair.split("U");
  // const debt_ratio_threshold = 0.4;
  // const net_delta_threshold = 0.65;
  // const time_based_interval = 60 * 60 * 8;
  //--------------------------------- Load data -----------------------------------------------------
  let base_token_price = {};
  let quote_token_price = {};
  let interest_base_par = {};
  let interest_quote_par = {};
  let yield_position_par = {};
  let roi_list = [];

  for (let i = 0; i < data[token_pair].length - 1; i++) {
    let date = data[token_pair][i]["TimeStamp"];
    base_token_price[date] = data[token_pair][i][`${baseToken[0]}_Price`];
    quote_token_price[date] = data[token_pair][i][`USDC_Price`];
    interest_base_par[date] = data[token_pair][i][`${baseToken[0]}_Interest`];
    interest_quote_par[date] = data[token_pair][i][`USDC_Interest`];
    yield_position_par[date] = data[token_pair][i][`Yield`];
  }

  //------------------------- Borrowed amount for DN position ------------------------------------------
  let DN_split_base = null;
  let DN_split_quote = null;

  if (leverage == 3) {
    DN_split_base = 0.75;
    DN_split_quote = 0.25;
  } else if (leverage == 2) {
    DN_split_base = 1;
    DN_split_quote = 0;
  } else if (leverage == 1) {
    DN_split_base = 0;
    DN_split_quote = 0;
  }
  let borrowed_amount = principal * (leverage - 1);

  //----------------------------------------------------------------------------------------------------

  let data_list_2 = [];
  let id = 1;
  // For t = 0:
  //---------------------------------------- Debt ------------------------------------------------------
  let debt_base_usd_amount = DN_split_base * borrowed_amount;
  let debt_quote_usd_amount = DN_split_quote * borrowed_amount;
  //----------------------------------------------------------------------------------------------------
  let debt_base_token_amount =
    debt_base_usd_amount / base_token_price[start_date];
  let debt_quote_token_amount =
    debt_quote_usd_amount / quote_token_price[start_date];
  //----------------------------------------------------------------------------------------------------
  let debt_position_usd_amount = debt_base_usd_amount + debt_quote_usd_amount;
  //------------------------------------- Asset --------------------------------------------------------
  let asset_base_usd_amount = DN_split_base * borrowed_amount;
  let asset_quote_usd_amount = principal + DN_split_quote * borrowed_amount;
  //----------------------------------------------------------------------------------------------------
  let aave_deposit = 0;
  if (leverage == 1) {
    aave_deposit = principal / 2;
    debt_base_usd_amount = principal / 2;
    debt_quote_usd_amount = 0;
    debt_base_token_amount =
      debt_base_usd_amount / base_token_price[start_date];
    asset_base_usd_amount = debt_base_usd_amount;
    asset_quote_usd_amount = principal / 2;
  }
  //----------------------------------------------------------------------------------------------------
  let asset_base_token_amount =
    asset_base_usd_amount / base_token_price[start_date];
  let asset_quote_token_amount =
    asset_quote_usd_amount / quote_token_price[start_date];
  //----------------------------------------------------------------------------------------------------
  let portfolio_position_usd_amount =
    asset_base_usd_amount + asset_quote_usd_amount;
  //--------------------------------------- Other data -------------------------------------------------
  let k = asset_base_token_amount * asset_quote_token_amount; // constant product
  let equity_usd_amount =
    portfolio_position_usd_amount - debt_position_usd_amount;
  let leverage_ratio = portfolio_position_usd_amount / equity_usd_amount;
  //----------------------------------------- Push -----------------------------------------------------
  roi_list.push(equity_usd_amount);
  data_list_2.push({
    id: 1,
    date: new Date(start_date * 1000),
    amount: equity_usd_amount,
    TokenPrice: base_token_price[start_date],
  });
  id = id + 1;
  let rebalancePoint = [];
  //========================================= Looping ==================================================
  for (let i = 1; i < (end_date - start_date) / interval; i++) {
    let t = i * 3600;
    debt_base_token_amount =
      debt_base_token_amount * (1 + interest_base_par[start_date + t]); // " + t " >> current token price
    debt_quote_token_amount =
      debt_quote_token_amount * (1 + interest_quote_par[start_date + t]);
    //----------------------------------------------------------------------------------------------------
    debt_position_usd_amount =
      debt_base_token_amount * base_token_price[start_date + t] +
      debt_quote_token_amount * quote_token_price[start_date + t];
    //----------------------------------------------------------------------------------------------------
    let yield_position_usd =
      yield_position_par[start_date + t] * portfolio_position_usd_amount;

    asset_base_token_amount =
      Math.sqrt(k / base_token_price[start_date + t]) +
      yield_position_usd / 2 / base_token_price[start_date + t];

    asset_quote_token_amount =
      Math.sqrt(k * base_token_price[start_date + t]) +
      yield_position_usd / 2 / quote_token_price[start_date + t];

    k = asset_base_token_amount * asset_quote_token_amount;
    //----------------------------------------- renew ---------------------------------------------------------
    portfolio_position_usd_amount =
      asset_base_token_amount * base_token_price[start_date + t] +
      asset_quote_token_amount * quote_token_price[start_date + t];
    let net_delta =
      portfolio_position_usd_amount / 2 / base_token_price[start_date + t] -
      debt_base_token_amount;

    equity_usd_amount =
      portfolio_position_usd_amount -
      debt_position_usd_amount +
      aave_deposit * (1 + interest_quote_par[start_date + t]);
    leverage_ratio = portfolio_position_usd_amount / equity_usd_amount;
    //================================== Rebalance trigger ===========================================
    let lock = 0;
    // if (trigger_option == Tigger.Debt_ratio) {
    if (trigger_option.includes(Tigger.Debt_ratio)) {
      if (triggerDebt == undefined) {
        triggerDebt = 65;
      }
      debt_ratio_threshold = triggerDebt / 100;
    }
    // else if (trigger_option == Tigger.Net_delta) {
    else if (trigger_option.includes(Tigger.Net_delta)) {
      if (triggerDelta == undefined) {
        triggerDelta = 0.3;
      }
      net_delta_threshold = triggerDelta;
    }
    // else if (trigger_option == Tigger.Time_based) {
    else if (trigger_option.includes(Tigger.Time_based)) {
      if (triggerTime == undefined) {
        triggerTime = 8;
      }
      time_based_interval = triggerTime * 60 * 60;
    }
    // Tigger 0: Debt_ratio
    //----------------------------------------------------------------------------------------------------
    // chaneg to LTV ratio threshold
    // if (trigger_option == Tigger.Debt_ratio) {
    if (trigger_option.includes(Tigger.Debt_ratio)) {
      let debt_ratio = debt_position_usd_amount / portfolio_position_usd_amount;
      // rebalance debt ratio

      // Case 1: Borrow more
      // if (debt_ratio < debt_ratio_threshold) {}

      // Case 2: Repay some debt
      if (debt_ratio > debt_ratio_threshold) {
        debt_base_token_amount = debt_base_token_amount + net_delta;
        debt_quote_token_amount =
          debt_quote_token_amount -
          net_delta * base_token_price[start_date + t];
        //----------------------------------------------------------------------------------------------------
        debt_position_usd_amount =
          debt_base_token_amount * base_token_price[start_date + t] +
          debt_quote_token_amount * quote_token_price[start_date + t];
        //----------------------------------------------------------------------------------------------------
        equity_usd_amount =
          portfolio_position_usd_amount -
          debt_position_usd_amount +
          aave_deposit * (1 + interest_quote_par[start_date + t]);
        //----------------------------------------------------------------------------------------------------
        lock = 1;
      }
    }
    //----------------------------------------------------------------------------------------------------
    // Tigger 1: Net_delta
    //----------------------------------------------------------------------------------------------------
    // if (trigger_option == Tigger.Net_delta) {
    if (trigger_option.includes(Tigger.Net_delta)) {
      // Long - short, token-term, base token
      if (net_delta > net_delta_threshold) {
        //abs ??
        debt_base_token_amount = debt_base_token_amount + net_delta;
        debt_quote_token_amount =
          debt_quote_token_amount -
          net_delta * base_token_price[start_date + t];
        //----------------------------------------------------------------------------------------------------
        debt_position_usd_amount =
          debt_base_token_amount * base_token_price[start_date + t] +
          debt_quote_token_amount * quote_token_price[start_date + t];
        //----------------------------------------------------------------------------------------------------
        equity_usd_amount =
          portfolio_position_usd_amount -
          debt_position_usd_amount +
          aave_deposit * (1 + interest_quote_par[start_date + t]);
        //----------------------------------------------------------------------------------------------------
        lock = 1;
      }
    }
    //----------------------------------------------------------------------------------------------------
    // Tigger 2: Time_based
    //----------------------------------------------------------------------------------------------------
    // if (trigger_option == Tigger.Time_based) {
    if (trigger_option.includes(Tigger.Time_based)) {
      if (t % time_based_interval == 0) {
        debt_base_token_amount = debt_base_token_amount + net_delta;
        debt_quote_token_amount =
          debt_quote_token_amount -
          net_delta * base_token_price[start_date + t];

        debt_position_usd_amount =
          debt_base_token_amount * base_token_price[start_date + t] +
          debt_quote_token_amount * quote_token_price[start_date + t];

        equity_usd_amount =
          portfolio_position_usd_amount -
          debt_position_usd_amount +
          aave_deposit * (1 + interest_quote_par[start_date + t]);
        //----------------------------------------------------------------------------------------------------
        lock = 1;
      }
    }

    if (lock == 1) {
      rebalancePoint.push({
        type: "point",
        xValue: new Date((start_date + t) * 1000),
        yValue: equity_usd_amount,
        backgroundColor: "rgba(255, 99, 132, 0.25)",
      });
    }

    lock = 0;
    //----------------------------------------- Push -----------------------------------------------------

    roi_list.push(equity_usd_amount);
    data_list_2.push({
      id: id,
      date: new Date((start_date + t) * 1000),
      amount: equity_usd_amount,
      TokenPrice: base_token_price[start_date + t],
    });
    id = id + 1;
  }

  let rebalanceList = {};

  for (i = 1; i < rebalancePoint.length; i++) {
    rebalanceList[`point${i}`] = rebalancePoint[i];
  }

  //------------------------------------- Table data calculation ----------------------------------------------------
  // 1.Return
  var ROI = roi_list[roi_list.length - 1];
  var returnROI = (((ROI - principal) / principal) * 100).toFixed(3);

  // 2.APY
  // get time period * hourly year
  let period = (end_date - start_date) / 60 / 60 / 24;
  let dailyReturn = returnROI / 100 / period;
  // let APY = (((1 + dailyReturn / 365) ** 365 - 1) * 100).toFixed(3);
  let APY = (((1 + dailyReturn) ** 365 - 1) * 100).toFixed(3);

  // 3.Sharpe Ratio
  let hourly_to_daily_ma_return = [];
  let adjusted_hourly_to_daily_ma_return = [];
  for (let i = 0; i < roi_list.length - 24; i++) {
    hourly_to_daily_ma_return.push(roi_list[i + 24] / roi_list[i] - 1);
  }
  for (let i = 0; i < hourly_to_daily_ma_return.length; i++) {
    adjusted_hourly_to_daily_ma_return.push(
      hourly_to_daily_ma_return[i] - rf_rate
    );
  }
  let average =
    hourly_to_daily_ma_return.reduce((a, b) => a + b, 0) /
    hourly_to_daily_ma_return.length;
  let standDeviation = getStandardDeviation(adjusted_hourly_to_daily_ma_return);
  let sharpeRatio = ((average * Math.sqrt(365)) / standDeviation).toFixed(3);

  // 4. Max drawdown
  var maxDrawdown, dif;
  var peak = 0;
  var n = roi_list.length;
  for (var i = 1; i < n; i++) {
    dif = roi_list[peak] - roi_list[i];
    peak = dif < 0 ? i : peak;
    maxDrawdown = maxDrawdown > dif ? maxDrawdown : dif;
  }
  maxDrawdown = ((maxDrawdown / principal) * 100).toFixed(3);

  // 5. Rebalance frequency
  let frequency = Object.keys(rebalanceList).length;
  //------------------------------------ Turn into Table data ------------------------------------------
  const tableData = [
    createData(returnROI, APY, sharpeRatio, maxDrawdown, frequency),
  ];
  // console.log(data_list_2, tableData, rebalanceList);
  //----------------------------------------------------------------------------------------------------
  return [data_list_2, tableData, rebalanceList]; // return graoh + table data
}
