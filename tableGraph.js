// currtrigger = -10;
var xValues = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
var logValues = [
  0, 12.8, 25.7, 38.4, 51.0, 63.5, 75.9, 87.8, 98.9, 109.1, 119.2,
];
var count = 0;
let ebg = 0;
let slope = 0;
const set = new Set();
let trigger = 0;
let flag = 0;
setTimeout(() => {
  fillTable();
}, 3800);

const range = document.getElementById("range");

range.addEventListener("input", (event) => {
  if (sessionStorage.getItem("circuitComplete") == "true") {
    const newIndex = event.target.value;
    sessionStorage.setItem("newIndex", newIndex);
  } else {
    alert("Complete the circuit first");
  }
});

var currarrgraph = [];
var voltarrgraph = [];
let rowCountIndex = 0;

document.getElementById("addtable").addEventListener("click", addTable);

function addTable() {
  if (sessionStorage.getItem("circuitComplete") === "true") {
    let srno = document.getElementsByClassName("srno")[rowCountIndex];
    let current = document.getElementsByClassName("curr")[rowCountIndex];
    let voltage = document.getElementsByClassName("voltage")[rowCountIndex];

    let curr = parseFloat(sessionStorage.getItem("current"));
    let volt = parseFloat(sessionStorage.getItem("voltage"));

    currarrgraph.push(curr);
    voltarrgraph.push(volt);

    srno.value = rowCountIndex + 1;
    current.value = curr;
    voltage.value = volt;
    rowCountIndex++;

    myChart.data.labels.push(curr);
    myChart.data.datasets[0].data.push({ x: curr, y: volt });
    myChart.update();
  } else {
    alert("Complete the circuit first");
  }
}


function fillTable() {
  let lastProcessedSno = -1;

  const filltableintrval = setInterval(() => {
    const rowData = JSON.parse(localStorage.getItem("rowData"));

    if (
      rowData &&
      rowData.tempc &&
      rowData.sno > lastProcessedSno &&
      rowData.sno < 10
    ) {
      lastProcessedSno = rowData.sno;

      const parsedCurr = parseFloat(rowData.curr);
      const parsedVolt = parseFloat(rowData.volt);

      let srno = document.getElementsByClassName("srno")[rowData.sno];
      let cur = document.getElementsByClassName("curr")[rowData.sno];
      let volt = document.getElementsByClassName("voltage")[rowData.sno];

      if (srno) srno.textContent = rowData.sno + 1;
      if (cur) cur.textContent = parsedCurr;
      if (volt) volt.textContent = parsedVolt;

      currarrgraph.push(parsedCurr);
      voltarrgraph.push(parsedVolt);

      myChart.data.labels.push(parsedCurr);
      myChart.data.datasets[0].data.push({ x: parsedCurr, y: parsedVolt });

      if (myChart.data.datasets[0].data.length > 10) {
        myChart.data.datasets[0].data.shift();
        myChart.data.labels.shift();
      }

      if (rowData.sno % 2 === 0 || rowData.sno >= 9) {
        myChart.update("none");
      }
    }

    if (rowData && rowData.sno === 9) {
      clearInterval(filltableintrval);
    }
  }, 500);
}

const ctx = document.getElementById("myChart").getContext("2d");

const myChart = new Chart(ctx, {
  type: "scatter",
  data: {
    labels: [],
    datasets: [{
      label: "Voltage vs Current",
      data: [],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
      showLine: true, // Draw connecting line
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Current (mA)"
        },
        type: "linear",
        position: "bottom"
      },
      y: {
        title: {
          display: true,
          text: "Voltage (V)"
        },
        beginAtZero: true,
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  }
});


// Add event listener to the "Calculate Slope" button

document.querySelector(".calcslope").addEventListener("click", calslope);
function calslope() {
  let x1, x2, y1, y2;
  let slopevalue = document.querySelector(".slopev");
  document.querySelector(".svalue").style.display = "block";
  x1 = xValues[1];
  x2 = xValues[4];

  y1 = logValues[1];
  y2 = logValues[4];

  slope = (y2 - y1) / (x2 - x1);
  slopevalue.innerHTML = slope.toFixed(4);
  // document.querySelector(".ebg").style.display = "block";
}

async function downloadGraph() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  // Set background color
  doc.setFillColor(0, 123, 255); // Blue color (RGB)
  doc.rect(10, 5, 190, 10, "F");
  // Add a header with black text
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255); // Set text color to black
  doc.setFontSize(20); // Set font size for the header
  doc.text("Graph", 75, 12);

  const chartImage = myChart.toBase64Image();

  doc.addImage(chartImage, "PNG", 25, 150, 150, 120);
}

async function downloadGraphAndObservations() {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 5, 190, 10, "F");
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Observations Table", 75, 12); // Add text at x=10, y=10

    const tableCanvas = await html2canvas(document.querySelector("#table1"), {
      scale: 2,
    });
    const tableImgData = tableCanvas.toDataURL("image/png");
    doc.addImage(tableImgData, "PNG", 15, 17, 180, 120);

    // Add the graph
    const chartImage = myChart.toBase64Image();
    // doc.addPage();

    // //Add the graph head
    // Set background color
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 140, 190, 10, "F");
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Graph", 95, 147); // Add text at x=10, y=10

    doc.addImage(chartImage, "PNG", 25, 150, 150, 120);

    doc.addPage();
    //calculation page
    //Add the labels
    doc.setFillColor(0, 123, 255); // Blue color (RGB)
    doc.rect(10, 5, 190, 10, "F");
    // Add a header with black text
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255); // Set text color to black
    doc.setFontSize(20); // Set font size for the header
    doc.text("Calculation", 75, 12);

    document.querySelector(".calcbtn").style.display = "none";
    const calc = await html2canvas(document.querySelector(".formula"), {
      scale: 2,
    });
    const calcimg = calc.toDataURL("image/png");
    doc.addImage(calcimg, "PNG", 15, 17, 180, 80);

    // Save the PDF
    doc.save("observations_and_graph.pdf");
    document.querySelector(".calcbtn").style.display = "block";
  } catch (error) {
    console.log(error.message);
    if (error.message === "Incomplete or corrupt PNG file") {
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "Please complete the calculation using the Graph",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  }
}

// Add event listener to the download button
document
  .getElementById("download")
  .addEventListener("click", downloadGraphAndObservations);
document
  .getElementById("downloadgraph")
  .addEventListener("click", downloadGraph);
// document
//   .getElementById("inlineFormSelectPref")
//   .addEventListener("change", function () {
//     var contentUrl = this.value;
//     document.getElementById("main-svg").data = contentUrl;
//     // localStorage.setItem("diodetype", contentUrl);
//   });

function clearTableInputs() {
  //chart
  myChart.data.datasets.forEach((dataset) => {
  dataset.data = [];
  });
  // Update the chart to reflect the changes
  myChart.update();

  // Get the table
  const table = document.getElementById("table1");

  // Get all input elements within the table
  const inputs = table.getElementsByTagName("input");

  // Loop through each input and clear its value
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
  }
}

function updateValue(value) {
  const min = 10;
  const max = 100;
  const newMin = 0;
  const newMax = 18;

  const mapped = ((value - min) * (newMax - newMin)) / (max - min) + newMin;
  document.getElementById("sliderValue").textContent = Math.round(mapped);
  
}


// Function to update the value based on the slider input

setInterval(() => {
  if(sessionStorage.getItem("circuitComplete") == "false") {
    document.getElementById("sliderValue2").textContent = "0.000";
  }else {
    document.getElementById("sliderValue2").textContent = sessionStorage.getItem("voltage");
  }
}, 100);

//  function updateValue1() {
//     document.getElementById("sliderValue2").textContent = sessionStorage.getItem("voltage");
//   }
//   updateValue1();