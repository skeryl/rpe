(function() {
  const RPEs = {
    RPE: {
      "10": {
        REPS: {
          "1": 1,
          "2": 0.96,
          "3": 0.92,
          "4": 0.89,
          "5": 0.86,
          "6": 0.84,
          "7": 0.81,
          "8": 0.79,
          "9": 0.76,
          "10": 0.74,
          "11": 0.71,
          "12": 0.69
        }
      },
      "9": {
        REPS: {
          "1": 0.96,
          "2": 0.92,
          "3": 0.89,
          "4": 0.86,
          "5": 0.84,
          "6": 0.81,
          "7": 0.79,
          "8": 0.76,
          "9": 0.74,
          "10": 0.71,
          "11": 0.69,
          "12": 0.66
        }
      },
      "8": {
        REPS: {
          "1": 0.92,
          "2": 0.89,
          "3": 0.86,
          "4": 0.84,
          "5": 0.81,
          "6": 0.79,
          "7": 0.76,
          "8": 0.74,
          "9": 0.71,
          "10": 0.68,
          "11": 0.66,
          "12": 0.63
        }
      },
      "7": {
        REPS: {
          "1": 0.89,
          "2": 0.86,
          "3": 0.84,
          "4": 0.81,
          "5": 0.79,
          "6": 0.76,
          "7": 0.74,
          "8": 0.71,
          "9": 0.68,
          "10": 0.65,
          "11": 0.63,
          "12": 0.6
        }
      },
      "6": {
        REPS: {
          "1": 0.86,
          "2": 0.83,
          "3": 0.8,
          "4": 0.78,
          "5": 0.75,
          "6": 0.73,
          "7": 0.7,
          "8": 0.67,
          "9": 0.65,
          "10": 0.62,
          "11": 0.6,
          "12": 0.57
        }
      }
    }
  };

  function validateWeight(inputRow, errors) {
    const input = inputRow.querySelector("input");
    const inputValue = input.value;
    if (inputValue.length > 0 && inputValue <= 0) {
      errors.push([input.getAttribute("id"), "Weight must be above 0"]);
    }
  }

  function validateRPE(inputRow, errors) {
    const input = inputRow.querySelector("input");
    const inputValue = input.value;
    if (inputValue.length > 0 && inputValue < 6) {
      errors.push([input.getAttribute("id"), "RPE must be 6 or above"]);
    } else if (inputValue.length > 0 && inputValue > 10) {
      errors.push([input.getAttribute("id"), "RPE must be 10 or below"]);
    }
  }

  function validateReps(inputRow, errors) {
    const input = inputRow.querySelector("input");
    const inputValue = input.value;
    if (inputValue.length > 0 && inputValue <= 0) {
      errors.push([input.getAttribute("id"), "Reps must be above 0"]);
    } else if (inputValue.length > 0 && inputValue > 12) {
      errors.push([
        input.getAttribute("id"),
        "Sorry, this calculator only goes up to 12 reps"
      ]);
    }
  }

  function sanitizeAndGetInputErrors() {
    const errors = [];
    const inputRows = document.querySelectorAll(".input-row");
    const inputRowsArr = [...inputRows];
    inputRowsArr.forEach(function(inputRow) {
      if (inputRow.className.indexOf("weight") > 0) {
        validateWeight(inputRow, errors);
      } else if (inputRow.className.indexOf("rpe") > 0) {
        validateRPE(inputRow, errors);
      } else if (inputRow.className.indexOf("reps") > 0) {
        validateReps(inputRow, errors);
      }
    });

    return errors;
  }

  function clearAllErrors() {
    const inputRows = document.querySelectorAll(".input-row");
    const inputRowArr = [...inputRows];
    inputRowArr.forEach(function(inputRow) {
      inputRow.classList.remove("error");
      inputRow.querySelector(".error").innerHTML = "";
    });
  }

  function displayErrors(errors) {
    errors.forEach(function([divName, errorText]) {
      const inputRow = `.input-row.${divName}`;
      document.querySelector(inputRow).classList.add("error");
      document.querySelector(`${inputRow} .error`).innerHTML = errorText;
    });
  }

  function roundToFloat(value, round) {
    var result = Math.round(value / round) * round;
    if (round % 1 === 0) {
      return result.toFixed(0);
    } else if (round % 0.5 === 0) {
      return result.toFixed(1);
    } else {
      return result.toFixed(2);
    }
  }

  function inputsEventHandler() {
    const desiredRPE = document.querySelector("input#desired-rpe").value;
    const desiredReps = document.querySelector("input#desired-reps").value;
    const givenRPE = document.querySelector("input#given-rpe").value;
    const givenReps = document.querySelector("input#given-reps").value;
    const givenWeight = document.querySelector("input#given-weight").value;

    clearAllErrors();
    const errors = sanitizeAndGetInputErrors();

    if (errors.length > 0) {
      displayErrors(errors);
      return false;
    }

    const haveAllGivens = givenWeight && givenRPE && givenReps;

    document.querySelector("input#desired-reps").disabled = !haveAllGivens;
    document.querySelector("input#desired-rpe").disabled = !haveAllGivens;
    const desiredWeightEl = document.querySelector("#solved-weight");
    const e1RMEl = document.querySelector("#e1RM");
    const ninetyFivePEl = document.querySelector("#ninetyFiveP");
    const eightyFivePEl = document.querySelector("#eightyFiveP");
    const eightyPEl = document.querySelector("#eightyP");
    const seventyFivePEl = document.querySelector("#seventyFiveP");
    const sixtyFivePEl = document.querySelector("#sixtyFiveP");

    if (haveAllGivens) {
      const givenRPEDecimal = RPEs["RPE"][givenRPE]["REPS"][givenReps];
      const estimated1RM = givenWeight / givenRPEDecimal;

      const roundingValue = Number.parseFloat(document.querySelector("select#rounding").value);

      e1RMEl.innerHTML = roundToFloat(estimated1RM, roundingValue);
      ninetyFivePEl.innerHTML = roundToFloat(estimated1RM * 0.95, roundingValue);
      eightyFivePEl.innerHTML = roundToFloat(estimated1RM * 0.85, roundingValue);
      eightyPEl.innerHTML = roundToFloat(estimated1RM * 0.8, roundingValue);
      seventyFivePEl.innerHTML = roundToFloat(estimated1RM * 0.75, roundingValue);
      sixtyFivePEl.innerHTML = roundToFloat(estimated1RM * 0.65, roundingValue);

      if (desiredRPE && desiredReps) {
        const desiredRPEDecimal = RPEs["RPE"][desiredRPE]["REPS"][desiredReps];
        desiredWeightEl.innerHTML = roundToFloat(
          parseInt(estimated1RM * desiredRPEDecimal), roundingValue
        );
      } else {
        desiredWeightEl.innerHTML = "...";
      }
    } else {
      ninetyFivePEl.innerHTML = "...";
      eightyFivePEl.innerHTML = "..."
      eightyPEl.innerHTML = "..."
      seventyFivePEl.innerHTML = "...";
      sixtyFivePEl.innerHTML = "...";
    }
  }

  const inputs = document.querySelectorAll("input");
  const inputsArr = [...inputs];
  inputsArr.forEach(function(input) {
    input.addEventListener("input", e => inputsEventHandler(), false);
  });
  const roundingSelect = document.querySelector("select#rounding");
  roundingSelect.addEventListener("change", e => inputsEventHandler(), false);
})();
