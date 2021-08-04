import axios from "./node_modules/@bundled-es-modules/axios/axios.js";
import { DataTable } from "./node_modules/simple-datatables/dist/module/index.js";

const myTable = document.querySelector("#myTable");
let tBodyEl = document.querySelector("tbody");
let storageArrPrev = [];
let storageArrCurr = [];
let flag = true;

callAxios();
let Interval = setInterval(() => {
  callAxios();
}, 10000);

function callAxios() {
  const response = axios
    .get("https://api.coincap.io/v2/assets")
    .then((response) => {
      if (flag === true) {
        localStorage.setItem("memoryArray", response.data.data);
        createTableBody(response.data.data);
        flag = false;
      } else {
        storageArrPrev = localStorage.getItem("memoryArray");
        createTableBody(response.data.data);
        checkChanges();
        localStorage.setItem("memoryArray", response.data.data);
      }
      const dataTable = new DataTable(myTable);
      return response.data.data;
    })
    .catch((err) => console.log(err));
}

const createTableBody = (data) => {
  tBodyEl.innerHTML = "";
  let trEl = "";
  for (const iterator of data) {
    const {
      rank,
      name,
      priceUsd,
      marketCapUsd,
      vwap24Hr,
      supply,
      volumeUsd24Hr,
      changePercent24Hr,
      symbol,
    } = iterator;
    const arr = [
      rank,
      name,
      priceUsd,
      marketCapUsd,
      vwap24Hr,
      supply,
      volumeUsd24Hr,
      changePercent24Hr,
      symbol,
    ];

    storageArrCurr.push(arr);

    trEl = "";
    let tdEl = "";

    for (let i = 0; i < arr.length; i++) {
      let num;
      let key = arr[i];
      switch (i) {
        case 0:
          tdEl += `<td>${key}</td>`;
          break;
        case 1:
          tdEl += `<td><img class src="https://assets.coincap.io/assets/icons/${arr[8].toLowerCase()}@2x.png">
                <div> 
                <span>${key}</span>
                <span>${arr[8]}</span>
                </div></td>`;
          break;
        case 2:
          num = toBorM(key);
          num = toDollar(num);
          tdEl += `<td>${num}</td>`;
          break;
        case 3:
          num = toBorM(key);
          num = toDollar(num);
          tdEl += `<td>${num}</td>`;
          break;
        case 4:
          num = toBorM(key);
          num = toDollar(num);
          tdEl += `<td>${num}</td>`;
          break;
        case 5:
          num = toBorM(key);
          tdEl += `<td>${num}</td>`;
          break;
        case 6:
          num = toBorM(key);
          num = toDollar(num);
          tdEl += `<td>${num}</td>`;
          break;
        case 7:
          num = percent(key);
          tdEl += `<td>${num}</td>`;
          break;
        default:
          break;
      }
      // if ()
      trEl = `<tr id="color${arr[0]}">${tdEl}</tr>`;
    }
    tBodyEl.innerHTML += trEl;
  }
};

function toDollar(num) {
  return `${parseFloat(num)}`;
}

function toBorM(num) {
  num = parseFloat(num);
  if (num >= 1000000000) {
    num /= 1000000000;
    return `${num.toFixed(2)}b`;
  } else if (num >= 1000000) {
    num /= 1000000;
    return `${num.toFixed(2)}m`;
  } else {
    return `${num.toFixed(2)}`;
  }
}

function percent(num) {
  return `${parseFloat(num).toFixed(2)}%`;
}

const checkChanges = () => {
  let temp;
  for (let i = 0; i < storageArrCurr.length - 1; i++) {
    for (let j = 0; j < storageArrCurr[i].length - 1; j++) {
      if (j != 1) {
        if (storageArrCurr[i][j] > storageArrPrev[i][j]) {
          temp = document.querySelector(`#color${storageArrCurr[i][0]}`);
          temp.className = "green";
          console.log(temp);
        } else if (storageArrCurr[i][j] < storageArrPrev[i][j]) {
          temp = document.querySelector(`#color${storageArrCurr[i][0]}`);
          temp.className = "red";
        } else {
          temp = document.querySelector(`#color${storageArrCurr[i][0]}`);
          temp.className = "";
        }
      }
    }
  }
};
