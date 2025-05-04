var rowData = { sno: 0, curr: 0, volts: 0 };
sessionStorage.setItem("rowData", JSON.stringify(rowData));
sessionStorage.setItem("fullScreen", false);
// sessionStorage.setItem("newIndex", 0);


sessionStorage.setItem("circuitComplete", true);

function filldata(srno, volt, curr) {
    rowData = { srno: 0, volt: 0, curr: 0 };
    sessionStorage.setItem("rowData", JSON.stringify(rowData));
    rowData.srno = srno;
    rowData.volt = volt;
    rowData.curr = curr;
    console.log(srno);
    sessionStorage.setItem("rowData", JSON.stringify(rowData));
  }
  
  
  //ye wala code range ke sath ke lia hai
  
  setTimeout(() => {
    rangeSelector();
  }, 200);
const voltarr = [0, 12.8, 25.7, 38.4, 51.0, 63.5, 75.9, 87.8, 98.9, 109.1, 119.2];
const curarrforward = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  // const currreverse = [1, 1, 1, 0, 0.4, 0.7, 2.3, 15.5, 15.8, 25, 35.9];
  
  function rangeSelector() {
    newIndexinterval = setInterval(() => {
      
  
      let newIndex = sessionStorage.getItem("newIndex"); // Retrieve newIndex
      newIndex = Math.floor(newIndex / 10); // Map to range [1, 10]
      
      if(newIndex == 0){
        let volttext = document.getElementById("tspan18");
        let currtext = document.getElementById("tspan16");
        volttext.textContent = "0.000";
        currtext.textContent = "0.000";
      }

      // Ensure newIndex stays within bounds of the array
      if (newIndex < 0 || newIndex > 10) {
        console.error("newIndex out of range");
        
        return; // Skip this iteration if out of bounds
      }
  
      let volttext = document.getElementById("tspan18");
      let currtext = document.getElementById("tspan16");

      // let currtext = document.getElementById("curr");
      volttext.textContent = voltarr[newIndex - 1];
      currtext.textContent = "1.000"

      sessionStorage.setItem("current", curarrforward[newIndex-1]);
      sessionStorage.setItem("voltage", voltarr[newIndex - 1]);
    }, 500);
  }


