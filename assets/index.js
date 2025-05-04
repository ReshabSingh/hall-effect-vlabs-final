document.addEventListener('DOMContentLoaded', function() {
    const svgObject = document.getElementById('main-svg');
    const slider = document.getElementById('current-range');
    const hallEffectSlider = document.getElementById('hall-range');
    const dropdown = document.getElementById('effect-dropdown');

    svgObject.addEventListener('load', function() {
        setTimeout(() => { 
            const svgDoc = svgObject.contentDocument;
            if (!svgDoc) {
                console.error("SVG contentDocument is not accessible.");
                return;
            }

            // Initialize text elements
            const gaussMeterText = svgDoc.getElementById('tspan4');
            const hallEffectText = svgDoc.getElementById('tspan3');
            
            if (!gaussMeterText || !hallEffectText) {
                console.error("Required text elements not found in the SVG.");
                return;
            }

            // Set initial values
            gaussMeterText.textContent = "0.000";
            hallEffectText.textContent = "0.000";

            // Define measurement values
            const magneticFieldValues = [550, 1130, 1720, 2300, 2880, 3450, 4030, 4600, 5180, 5750];
            const hallEffectValues = [28.75, 43.13, 57.17, 71.89, 86.26, 100.64, 115.02, 129.04, 143.77];

            // Function to update Magnetic Field readings
            function updateMagneticField(sliderValue) {
                const maxSliderValue = parseFloat(slider.max);
                const minSliderValue = parseFloat(slider.min);
                const index = Math.round(((sliderValue - minSliderValue) / (maxSliderValue - minSliderValue)) * (magneticFieldValues.length - 1));
                gaussMeterText.textContent = magneticFieldValues[index].toFixed(0);
            }

            // Function to update Hall Effect readings
            function updateHallEffect(sliderValue) {
                const maxSliderValue = parseFloat(slider.max);
                const minSliderValue = parseFloat(slider.min);
                const index = Math.round(((sliderValue - minSliderValue) / (maxSliderValue - minSliderValue)) * (hallEffectValues.length - 1));
                hallEffectText.textContent = hallEffectValues[index].toFixed(2);
            }

            // Add event listener for slider
            if (slider) {
                slider.addEventListener('input', function() {
                    const sliderValue = parseFloat(this.value);
                    updateMagneticField(sliderValue);
                    updateHallEffect(sliderValue);
                });
            }

            // Handle dropdown selection to show/hide sliders
            dropdown.addEventListener('change', function() {
                if (dropdown.value === 'MagneticField') {
                    slider.style.display = 'block';
                    hallEffectSlider.style.display = 'none';
                } else if (dropdown.value === 'HallEffect') {
                    slider.style.display = 'none';
                    hallEffectSlider.style.display = 'block';
                }
            });

            // Initial visibility based on current dropdown selection
            if (dropdown.value === 'MagneticField') {
                slider.style.display = 'block';
                hallEffectSlider.style.display = 'none';
            } else if (dropdown.value === 'HallEffect') {
                slider.style.display = 'none';
                hallEffectSlider.style.display = 'block';
            }

            // Example: Change the color of an element with id 'exampleElement'
            const exampleElement = svgDoc.getElementById('exampleElement');
            if (exampleElement) {
                exampleElement.setAttribute('fill', 'red');
            }

            // Add click listeners with more interactivity
            const clickableElement = svgDoc.getElementById('your-element-id');
            if (clickableElement) {
                clickableElement.style.cursor = 'pointer';

                // Add hover effects
                clickableElement.addEventListener('mouseover', function() {
                    this.style.opacity = '0.8';
                });

                clickableElement.addEventListener('mouseout', function() {
                    this.style.opacity = '1';
                });

                // Click event with custom message
                clickableElement.addEventListener('click', function() {
                    const elementId = this.id;
                    const elementType = this.tagName;
                    alert(`Clicked ${elementType} with ID: ${elementId}`);
                });
            }
        }, 100); // Short delay to ensure loading
    });
});


// 0->one 1->two 2->three 3->four

wireTerminalCheck = [
    { one: false, two: false },
    { three: false, four: false },
    { five: false, thirteen: false },
    { fourteen: false, thirteen: false },
    { fifteen: false, thirteen: false },
    { sixteen: false, thirteen: false },
  ];
  
  terminalMap = {
    0: "one",
    1: "two",
    2: "three",
    3: "four",
    4: "five",
    5: "six",
    6: "seven",
    7: "eight",
    8: "nine",
    9: "ten",
    10: "eleven",
    11: "twelve",
    12: "thirteen",
    13: "fourteen",
    14: "fifteen",
    15: "sixteen",
    16: "seventeen",
    17: "eighteen",
    18: "nineteen",
    19: "twenty",
    20: "twentyone",
    21: "twentytwo",
    22: "twentythree",
    23: "twentyfour",
    24: "twentyfive",
    25: "twentysix",
    26: "twentyseven",
  };
  
  var xValues = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360];
  
  sequenceNum = 0;
  
  var rowData = { sno: 0, curr: 0, volts: 0 };
  sessionStorage.setItem("rowData", JSON.stringify(rowData));
  sessionStorage.setItem("fullScreen", false);
  sessionStorage.setItem("newIndex", 0);
  
  var btnPressed = [false, false];
  
  setTimeout(() => {
    enablingSequence(sequenceNum);
  }, 2000);
  
  function enablingSequence(sequenceNum) {
    sessionStorage.setItem("circuitComplete",false)
    if(document.querySelector(".forward")){
      sessionStorage.setItem("type",false);
    }else{
      sessionStorage.setItem("type",true);
    }
  
    if (sequenceNum <= wireTerminalCheck.length) {
      for (var key in wireTerminalCheck[sequenceNum]) {
        elem = document.getElementsByClassName(key)[0];
        elem.style.stroke = "#FFFF00";
        elem.style.animationName = "pulse";
        elem.style.opacity = "1";
      }
    }
  }
  
  function trial(componentSom) {
    componentSomMap = terminalMap[componentSom];
    for (var key in wireTerminalCheck[sequenceNum])
      if (key == componentSomMap) wireTerminalCheck[sequenceNum][key] = true;
  
    elem = document.getElementsByClassName(componentSomMap)[0];
    elem.style.animationName = "none";
    elem.style.stroke = "none";
    // console.log(checkPair())
    dum = checkPair(sequenceNum);
    // console.log(dum)
    if (dum) {
      wireName = "wire" + (sequenceNum + 1);
      document.getElementById(wireName).style.transition = "display 10s";
      document.getElementById(wireName).style.display = "block";
      ++sequenceNum;
      if (sequenceNum < wireTerminalCheck.length) {
        enablingSequence(sequenceNum);
        // console.log('here')
      } else {
        // console.log('here')
        // replacement();
      }
    }
  }
  
  function checkPair(sequenceNum) {
    count = 0;
    for (var key in wireTerminalCheck[sequenceNum])
      if (wireTerminalCheck[sequenceNum][key] == true) count++;
    // console.log(count, 'count')
    if (count == 2) return true;
    return false;
  }
  
  // function keyPut() {
  //   document.getElementById("key1").style.animation = "none";
  //   document.getElementById("key1").onclick = function () {};
  //   document.getElementById("keyBase1").onclick = function () {};
  // }
  
  // function replacement() {
  //   // document.getElementById("black-board").classList.add("hidden");
  //   // document.getElementById("table-board").classList.add("replacement");
  
  //   document.getElementById("on-off-btn").style.stroke = "yellow";
  //   document.getElementById("on-off-btn").style.strokeWidth = "0.25%";
  //   document.getElementById("on-off-btn").onclick = function () {
  //     checkbtnPressed(0);
  //   };
  
    // document.getElementById("key1").style.display = "block";
    // document.getElementById("key1").classList.add("key-up-down");
    // document.getElementById("key1").onclick = function () {
    //   checkbtnPressed(1);
    //   keyPut();
    // };
    // document.getElementById("keyBase1").onclick = function () {
    //   checkbtnPressed(1);
    //   keyPut();
    // };
    // sessionStorage.setItem("fullScreen", true);
    // sessionStorage.setItem("circuitComplete",true)
  // }
  
  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function checkbtnPressed(btnNum) {
    // btnPressed[btnNum] = true;
    // if (btnNum == 0) {
    //   console.log("check btn called")
    //   // document.getElementById("on-off-btn").textContent = "03.00";
    //   // document.getElementById("volt").textContent = "00.36";
    //   document.getElementById("on-off-btn").style.stroke = "red";
    // document.getElementById("on-off-btn").style.strokeWidth = "1.25%";
    sessionStorage.setItem("circuitComplete",true)
    }
    // if (btnPressed[0] && btnPressed[1]) {
      
    //   sessionStorage.setItem("circuitComplete",true)
  
    //   // if(document.querySelector(".forward")){
    //   //   // startWorkingForward();
    //   // }
    //   // else{
    //   //   // startWorkingReverse();
    //   // }
    // }

  
  // function keyOp(){
  //     document.getElementById('key1').style.display = "none"
  //     document.getElementById('key2').style.animation = "none"
  //     document.getElementById('key2').onclick = function(){}
  //     document.getElementById('keyBase2').onclick = function(){}
  // }
  
 
  
  
    // alert("reverse ka data hai dont worry bhai"
  
  
