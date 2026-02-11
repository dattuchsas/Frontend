
/************* Basic Fields Validations *************/

function ValidateEmail(emailField) {
  debugger;
  if (emailField.value != "") {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (reg.test(emailField) == false) {
      bankingAlert('Please enter valid email address.');
      emailField.value = '';
      emailField.trigger('focus');
      return false;
    }
    return true;
  }
}

function ValidateGSTIN(gstField) {
  debugger;
  if (gstField != "") {
    if (eval(gstField.length) != 15) {
      bankingAlert("Enter Valid GST IN");
      gstField = '';
      gstField.trigger('focus');
    }
  }
}

function ValidateCKYCID(ckycField) {
  debugger;
  if (ckycField != "") {
    if (eval(ckycField.length) != 14) {
      bankingAlert("Enter Valid CKYCID");
      ckycField = '';
      ckycField.trigger('focus');
    }
  }
}

function ValidateAadhaar(aadhaarNumber, branchCode) {
  debugger;
  if (aadhaarNumber == "") {
    bankingAlert("Enter Valid Aadhaar Id");
    if (eval(aadhaarNumber.length) != 12) {
      aadhaarNumber = '';
      aadhaarNumber.trigger('focus');
    }
  }
  else {
    var st = "GETAADHARUIDTLS" + "|" + aadhaarNumber + "|" + branchCode;
    var result = AjaxGet('/GetDetails/GetAadhaarDetails?aadhaarNumber=' + st, true);
    if (result != "0") {
      var stVal = result.split("|");
      var stCus = stVal[0].split("~");
      bankingAlert("This AADHAR card have already Customerid :" + stCus[0] + " and Name :" + stCus[1]);
      aadhaarNumber = '';
      aadhaarNumber.trigger('focus');
      return;
    }
  }
}

function ValidatePANNumber(panNumber, branchCode) {
  if (panNumber == "") {
    bankingAlert("Please Enter PAN Number");
    return;
  }
  else {
    if ((panNumber.length == "10") && (panNumber.substring(0, 10)).match("[(/).]+")) {
      bankingAlert("Not a valid PAN Number");
      panNumber = '';
      panNumber.trigger('');
      return;
    }
    else {
      if (panNumber.length == "10") {
        if ((panNumber.substring(0, 5)).match(/^[a-zA-Z]+$/) && (panNumber.substring(5, 9)).match(/^[0-9]+$/) && (panNumber.substring(9, 10)).match(/^[a-zA-Z]+$/)) {
          var st = "GETPANDTLS" + "|" + panNumber.toUpperCase() + "|" + branchCode;
          var result = AjaxGet('/GetDetails/GetPANDetails?panNumber=' + st, true);
          if (result != "0") {
            var stVal = result.split("|");
            var stCus = stVal[0].split("~");
            bankingAlert("This Pan card have already Customerid :" + stCus[0] + " and Name :" + stCus[1]);
            panNumber = '';
            panNumber.trigger('');
            return;
          }
        }
        else {
          bankingAlert("Not a valid PAN Number");
          panNumber = '';
          panNumber.trigger('');
          return;
        }
      }
      else {
        bankingAlert("Not a valid PAN Number")
        panNumber = '';
        panNumber.trigger('');
        return;
      }
    }
  }
}


/************* Ajax Calls *************/

function AjaxGetPromise(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'GET',
      success: resolve,
      error: reject
    });
  });
}

async function FetchData(url) {
  try {
    const response = await AjaxGetPromise(url);
    console.log(response); // now response has the data
  } catch (err) {
    console.error(err);
  }
}


/************* Others *************/

function DateCheck(obj) {
  var dt, arrDt;
  if (obj.value == "")
    return;

  dt = obj;
  dt = dt.toUpperCase();
  arrDt = dt.split("-")
  if (eval(arrDt[0].length) != 2)
    arrDt = dt.split("/")

  if (eval(arrDt[0].length) == 2) {
    switch (arrDt[1]) {
      case "JAN": arrDt[1] = "01";
        break;
      case "Jan": arrDt[1] = "01";
        break;
      case "FEB": arrDt[1] = "02";
        break;
      case "Feb": arrDt[1] = "02";
        break;
      case "MAR": arrDt[1] = "03";
        break;
      case "Mar": arrDt[1] = "03";
        break;
      case "APR": arrDt[1] = "04";
        break;
      case "Apr": arrDt[1] = "04";
        break;
      case "MAY": arrDt[1] = "05";
        break;
      case "May": arrDt[1] = "05";
        break;
      case "JUN": arrDt[1] = "06";
        break;
      case "Jun": arrDt[1] = "06";
        break;
      case "JUL": arrDt[1] = "07";
        break;
      case "Jul": arrDt[1] = "07";
        break;
      case "AUG": arrDt[1] = "08";
        break;
      case "Aug": arrDt[1] = "08";
        break;
      case "SEP": arrDt[1] = "09";
        break;
      case "Sep": arrDt[1] = "09";
        break;
      case "OCT": arrDt[1] = "10";
        break;
      case "Oct": arrDt[1] = "10";
        break;
      case "NOV": arrDt[1] = "11";
        break;
      case "Nov": arrDt[1] = "11";
        break;
      case "DEC": arrDt[1] = "12";
        break;
      case "Dec": arrDt[1] = "12";
        break;
    }

    dt = arrDt[0] + arrDt[1] + arrDt[2]
    obj = dt;
  }
  formatDate(obj)
}

function formatDate(obj) {
  if (obj.value != "") {
    var dateval = obj.value;
    dateval = dateval.replace('-', '');
    dateval = dateval.replace('-', '');
    dateval = dateval.replace('/', '');
    dateval = dateval.replace('/', '');
    len = dateval;
    if (len.length != 8) {
      bankingAlert("Enter Date In Valid Date Format");
      obj = '';
      obj.select();
      return false;
    }
    else {
      dd = len.substring(0, 2);
      dd = dd + '-';
      mm = len.substring(2, 4);
      mm = mm + '-';
      yy = len.substring(4, 8);
      date1 = dd + mm + yy;
      noDays = getDays((len.substring(2, 4) - 1), yy)
      if ((len.substring(0, 2) > 31) || (len.substring(2, 4) > 12)) {
        bankingAlert('No Of Days (or) Months Exceeds The Limit');
        obj = '';
        obj.trigger('focus');
        obj.select();
        return false;
      }
      else if ((len.substring(0, 2) < 1) || (len.substring(2, 4) < 1)) {
        bankingAlert('No Of Days (or) Months Not Equal To Zero');
        obj.trigger('focus');
        obj.select();
        return false;
      }
      else if (len.substring(4, 8) < 1950) {
        bankingAlert('Year Should Not Be Less Than 1950');
        obj.trigger('focus');
        obj.select();
        return false;
      }
      else if (len.substring(0, 2) > noDays) {
        bankingAlert("Enter DD Value Not More Than " + noDays);
        obj.trigger('focus');
        obj.select();
        return false;
      }
      else {
        obj = date1;
        CopyDetails(obj);
      }
    }
  }
}

function GetDays(month, year) {
  var monarr = new Array(12);
  monarr[0] = 31;
  monarr[1] = (LeapYear(year)) ? 29 : 28;
  monarr[2] = 31;
  monarr[3] = 30;
  monarr[4] = 31;
  monarr[5] = 30;
  monarr[6] = 31;
  monarr[7] = 31;
  monarr[8] = 30;
  monarr[9] = 31;
  monarr[10] = 30;
  monarr[11] = 31;
  return monarr[month];
}

function CopyDetails(obj) {
  var dt, arrDt;

  if (obj.value == "")
    return;

  dt = obj.value
  arrDt = dt.split("-")

  switch (arrDt[1]) {
    case "01": arrDt[1] = "JAN";
      break;
    case "02": arrDt[1] = "FEB";
      break;
    case "03": arrDt[1] = "MAR";
      break;
    case "04": arrDt[1] = "APR";
      break;
    case "05": arrDt[1] = "MAY";
      break;
    case "06": arrDt[1] = "JUN";
      break;
    case "07": arrDt[1] = "JUL";
      break;
    case "08": arrDt[1] = "AUG";
      break;
    case "09": arrDt[1] = "SEP";
      break;
    case "10": arrDt[1] = "OCT";
      break;
    case "11": arrDt[1] = "NOV";
      break;
    case "12": arrDt[1] = "DEC";
      break;
  }

  dt = arrDt[0] + "-" + arrDt[1] + "-" + arrDt[2]
  obj.value = dt
}

function LeapYear(year) {
  if (year % 4 == 0) {
    return true;
  }
  else {
    return false;
  }
}

function getDateDiff(strDate1, strDate2) {
  var strArrDate1, strArrDate2
  strArrDate1 = strDate1.split("-")
  strArrDate2 = strDate2.split("-")
  strArrDate1[1] = changeMonth(strArrDate1[1])
  strArrDate2[1] = changeMonth(strArrDate2[1])

  return parseFloat(Date.parse(strArrDate1[0] + " " + strArrDate1[1] + ", " + strArrDate1[2])) - parseFloat(Date.parse(strArrDate2[0] + " " + strArrDate2[1] + ", " + strArrDate2[2]));
}

function changeMonth(str) {
  var strMonth
  str = str.toUpperCase()

  if (str == "JAN")
    strMonth = "January"
  else if (str == "FEB")
    strMonth = "February"
  else if (str == "MAR")
    strMonth = "March"
  else if (str == "APR")
    strMonth = "April"
  else if (str == "MAY")
    strMonth = "May"
  else if (str == "JUN")
    strMonth = "June"
  else if (str == "JUL")
    strMonth = "July"
  else if (str == "AUG")
    strMonth = "August"
  else if (str == "SEP")
    strMonth = "September"
  else if (str == "OCT")
    strMonth = "October"
  else if (str == "NOV")
    strMonth = "November"
  else if (str == "DEC")
    strMonth = "December"

  return strMonth;
}

function bankingAlert(response) {
  debugger;
  $("#mandatoryFieldsAlert").text(response);
  $("#mandatoryFieldsAlert").removeClass('d-none');
}

function bankingModal(response) {
  debugger;
  $("#errorMessage").text(response);
  $("#errorModal").modal('show');
}


/******************* Idle Timeout Logic ******************/
function resetIdleTimer() {
  idleSeconds = 0;
  $('#idleModal').modal('hide');
  clearInterval(countdownInterval);
  updateUITimer();
}

function showWarning() {
  $('#idleModal').modal('show');
  var remaining = warningSeconds;
  $('#countdown').text(formatTime(remaining));
  countdownInterval = setInterval(function () {
    remaining--;
    $('#countdown').text(formatTime(remaining));

    if (remaining <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}

function updateUITimer() {
  var remaining = totalIdleSeconds - idleSeconds;
  $('#uiTimer').text(formatTime(remaining));
}

function formatTime(seconds) {
  var m = Math.floor(seconds / 60);
  var s = seconds % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

function keepAlive() {
  $.get('/Login/KeepAlive')
    .done(function () {
      resetIdleTimer();
    })
    .fail(function () {
      logoutUser();
    });
}

function logoutUser() {
  window.location.href = '/Login/Logout';
  window.close();
}