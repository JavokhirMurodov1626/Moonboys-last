import { fetchInfo, createTable } from "./fetchInfo.js";
const spreadsheetId = "1L1d8BfLaiJVwKOkPV5NQshfH21hdZCcN6kQTJ5dpFnY";
const sheetUsers = "users";
const commonData = "common_data";

let hamburgerIcon = document.querySelector("#nav-icon4");
let hamburgerMenu = document.querySelector(".navbar-menu");
let linkItems = document.querySelectorAll(".navbar-menu .link-item");
let clipBoardBtn = document.querySelector(".referal-link");
let tooltiptext = document.querySelector(".referal-link .tooltiptext");
let daysSlot = document.querySelector(".time-table .days-slot");
let hoursSlot = document.querySelector(".time-table .hours-slot");
let minutesSlot = document.querySelector(".time-table .minutes-slot");
let secondsSlot = document.querySelector(".time-table .seconds-slot");

hamburgerIcon.addEventListener("click", () => {
  hamburgerIcon.classList.toggle("open");
  hamburgerMenu.classList.toggle("open");
  if (!hamburgerMenu.classList.contains("open")) {
    document.documentElement.style.overflowY = "auto";
  } else {
    document.documentElement.style.overflowY = "hidden";
  }
});

linkItems.forEach((item) => {
  item.addEventListener("click", () => {
    hamburgerIcon.classList.remove("open");
    hamburgerMenu.classList.remove("open");
    document.documentElement.style.overflowY = "auto";
  });
});
//clipboard

clipBoardBtn.addEventListener("click", () => {
  let copyText = document.getElementById("copied-link");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  tooltiptext.innerHTML = "Copied!";
});

// creating table dynamically
fetchInfo(spreadsheetId, sheetUsers).then((res) => createTable(res));

// updating information
let firstPlaceId = document.querySelector(".first-place .grid-content__top");
let firstPlacePrice = document.querySelector(".first-place .amount");
let secondPlaceId = document.querySelector(".second-place .grid-content__top");
let secondPlacePrice = document.querySelector(".second-place .amount");
let thirdPlaceId = document.querySelector(".third-place .grid-content__top");
let thirdPlacePrice = document.querySelector(".third-place .amount");

let price = document.querySelector(".prices-left-amount");

let countDownDate;

fetchInfo(spreadsheetId, commonData).then((res) => {
  firstPlaceId.innerHTML = res.data[0].first_place_id;
  firstPlacePrice.innerHTML = res.data[0].first_place_price;
  secondPlaceId.innerHTML = res.data[0].second_place_id;
  secondPlacePrice.innerHTML = res.data[0].second_place_price;
  thirdPlaceId.innerHTML = res.data[0].third_place_id;
  thirdPlacePrice.innerHTML = res.data[0].third_place_price;

  price.innerHTML = res.data[0].price;

  const countDownDateStr = res.data[0].count_down;
  const countDownDateParts = countDownDateStr.match(/\d+/g);

  if (countDownDateParts.length === 6) {
    const year = parseInt(countDownDateParts[0]);
    const month = parseInt(countDownDateParts[1]);
    const day = parseInt(countDownDateParts[2]);
    const hour = parseInt(countDownDateParts[3]);
    const minute = parseInt(countDownDateParts[4]);
    const second = parseInt(countDownDateParts[5]);

    countDownDate = new Date(year, month, day, hour, minute, second).getTime();
  } else {
    console.log("Invalid date string format.");
  }
});

//setting countDown

// Update the count down every 1 second
let x = setInterval(function () {
  // Get today's date and time
  let now = new Date().getTime();
  let distance;
  // Find the distance between now and the count down date
  if (countDownDate > now) {
    distance = countDownDate - now;
  } else {
    distance = 0;
  }

  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  daysSlot.innerHTML = days;
  hoursSlot.innerHTML = hours;
  minutesSlot.innerHTML = minutes;
  secondsSlot.innerHTML = seconds;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);
