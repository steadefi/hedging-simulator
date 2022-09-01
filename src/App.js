import "./App.css";
import Leverage from "./components/leverage";
import Pair from "./components/pair";
// import Tigger from "./components/trigger";
import MultipleTrigger from "./components/multiTrigger";
import StartDate from "./components/startDatePicker";
import EndDate from "./components/endDatePicker";
import ClickButton from "./components/button";
import ResultTable from "./components/table";
import InputBoxDebt from "./components/inputBoxDebt";
import InputBoxDelta from "./components/inputBoxDelta";
import InputBoxTime from "./components/inputBoxTime";
import "chartjs-adapter-moment";
//-----------------------------------
import { useState } from "react";
import LineChart from "./components/LineChart";
import { ChartData } from "./Data";
import Calculations from "./Cal";
import { Chart } from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(annotationPlugin, zoomPlugin);
var data = require("./data.json");

function App() {
  const [tokenPair, settokenPair] = useState("");
  const [leverage, setleverage] = useState();
  const [trigger_option, settrigger_option] = useState([]);
  const [triggerDebt, settriggerDebt] = useState();
  const [triggerDelta, settriggerDelta] = useState();
  const [triggerTime, settriggerTime] = useState();

  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  const [minStartDate, setminStartDate] = useState("");
  const [minEndDate, setminEndDate] = useState("");

  const [tableData, setTableData] = useState({});
  const [options, setOption] = useState({
    scales: {
      x: {
        type: "time",
      },
      y: {
        type: "linear",
      },
    },
    responsive: true,
    plugins: {
      // title: {
      //   display: true,
      //   text: "AVAX Chart",
      // },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
      legend: {
        labels: {
          font: {
            size: 22,
          },
        },
      },
      // tooltip: {
      //   enabled: true,
      //   callbacks: {
      //     labelColor: function (context) {
      //       return {
      //         borderColor: "rgb(0, 0, 255)",
      //         backgroundColor: "rgb(255, 0, 0)",
      //         borderWidth: 2,
      //         borderDash: [2, 2],
      //         borderRadius: 2,
      //       };
      //     },
      //     labelTextColor: function (context) {
      //       return "white";
      //     },
      //   },
      // },
    },
  });
  const [chartData, setChartData] = useState({
    // Need to add option for scale and axies
    type: "line",
    labels: ChartData.map((data) => data.date),
    datasets: [
      {
        type: "line",
        label: "Token price",
        yAxesGroup: "y1Axes",
        data: ChartData.map((data) => data.TokenPrice),
        backgroundColor: ["rgba(0, 0, 0, 0.5)"],
        borderColor: "gray",
        borderWidth: 1,
      },
    ],
  });
  //-----------------------------------
  const handleButtonChange = async () => {
    let [result, table, rebalanceList] = await Calculations(
      tokenPair,
      leverage,
      trigger_option,
      triggerDebt,
      triggerDelta,
      triggerTime,
      startDate,
      endDate
    );
    setOption({
      responsive: true,
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
        legend: {
          labels: {
            font: {
              size: 22,
            },
          },
        },
        autocolors: false,
        annotation: {
          annotations: rebalanceList, // issue, so comment now
        },
        // title: {
        //   display: true,
        //   text: "AVAX Chart",
        // },
      },
      scales: {
        y: {
          type: "linear",
          position: "left",
          ticks: {
            beginAtZero: true,
            color: ["rgba(75,192,192,1)"],
            // fontSize: 22,
          },
          grid: { display: true },
        },
        y1: {
          type: "linear",
          position: "right",
          ticks: {
            beginAtZero: true,
            color: ["rgba(0, 0, 0, 0.5)"],
            // fontSize: 22,
            // stepSize: 1000,
          },
          grid: { display: false },
        },
        x: {
          type: "time",
          ticks: {
            beginAtZero: true,
            // steps: 1000,
            autoSkip: true,
            maxTicksLimit: 20,
            fontSize: 22,
          },
        },
      },
    });

    setChartData({
      // Need to add option for scale and axies
      type: "line",
      labels: result.map((data) => data.date),
      datasets: [
        {
          type: "line",
          label: "ROI",
          yAxisID: "y",
          data: result.map((data) => data.amount),
          backgroundColor: ["rgba(75,192,192,1)"],
          borderColor: ["rgba(75,192,192,1)"],
          borderWidth: 1,
        },
        {
          type: "line",
          label: "Token price",
          yAxisID: "y1",
          data: result.map((data) => data.TokenPrice),
          backgroundColor: ["rgba(0, 0, 0, 0.5)"],
          borderColor: "gray",
          borderWidth: 1,
          hidden: true,
        },
      ],
    });
    console.log(table);
    setTableData(table[0]);
  };
  //-----------------------------------3
  const handlePairChange = (event) => {
    console.log(event.target.value);
    settokenPair(event.target.value);
    let startDate = new Date(data[event.target.value][0]["TimeStamp"] * 1000);
    setminStartDate(startDate);
    let endDate = new Date(
      data[event.target.value][data[event.target.value].length - 1][
        "TimeStamp"
      ] * 1000
    );
    setminEndDate(endDate);
    setstartDate(data[event.target.value][0]["TimeStamp"]);
    setendDate(
      data[event.target.value][data[event.target.value].length - 1]["TimeStamp"]
    );
  };
  const handleLeverageChange = (event) => {
    console.log(event.target.value);
    setleverage(event.target.value);
  };
  const handleTiggerChange = (event) => {
    console.log(event.target.value);
    settrigger_option(event.target.value);
  };

  const handleTiggerInputDebtChange = (event) => {
    console.log(event.target.value);
    settriggerDebt(event.target.value);
  };

  const handleTiggerInputDeltaChange = (event) => {
    console.log(event.target.value);
    settriggerDelta(event.target.value);
  };
  const handleTiggerInputTimeChange = (event) => {
    console.log(event.target.value);
    settriggerTime(event.target.value);
  };

  const handleStartChange = (date) => {
    let new_date = (new Date(date) * 1000) / 1000000;
    setstartDate(new_date);
  };

  const handleEndChange = (date) => {
    let new_date = (new Date(date) * 1000) / 1000000;
    setendDate(new_date);
  };

  return (
    <div
      className="App"
      style={{
        // alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Pair variant="contained" onChange={handlePairChange} value={tokenPair} />
      <Leverage
        variant="contained"
        onChange={handleLeverageChange}
        value={leverage}
      />
      {/* <Tigger onChange={handleTiggerChange} value={trigger_option} /> */}
      <MultipleTrigger onChange={handleTiggerChange} value={trigger_option} />
      <InputBoxDebt
        onChange={handleTiggerInputDebtChange}
        value={triggerDebt}
        // helpText={helpText}
      ></InputBoxDebt>
      <InputBoxDelta
        onChange={handleTiggerInputDeltaChange}
        value={triggerDelta}
      ></InputBoxDelta>
      <InputBoxTime
        onChange={handleTiggerInputTimeChange}
        value={triggerTime}
      ></InputBoxTime>
      <StartDate
        onChanged={handleStartChange}
        min={minStartDate}
        max={minEndDate}
      />
      <EndDate
        onChanged={handleEndChange}
        min={minStartDate}
        max={minEndDate}
      />

      <ClickButton onClick={handleButtonChange} />
      <div>
        <ResultTable tableData={tableData} />
      </div>
      <div>
        <LineChart
          chartData={chartData}
          options={options}
          style={{ width: 2000, height: 2000 }}
        />
      </div>
    </div>
  );
}

export default App;
