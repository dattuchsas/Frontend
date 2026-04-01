
/************* Basic Fields Validations *************/

function ValidateEmail(emailField) {
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
  if (gstField != "") {
    if (eval(gstField.length) != 15) {
      bankingAlert("Enter Valid GST IN");
      gstField = '';
      gstField.trigger('focus');
    }
  }
}

function ValidateCKYCID(ckycField) {
  if (ckycField != "") {
    if (eval(ckycField.length) != 14) {
      bankingAlert("Enter Valid CKYCID");
      ckycField = '';
      ckycField.trigger('focus');
    }
  }
}

function ValidateAadhaar(aadhaarNumber, branchCode) {
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

function EncodeInput(input) {
  return btoa(input);
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


/************* Others *************/

function CalculateAgeByDOB() {
}

function CalculateDOBByAge() {
}

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
  $("#mandatoryFieldsAlert").text(response);
  $("#mandatoryFieldsAlert").removeClass('d-none');
}

function bankingModal(response) {
  $("#errorMessage").text(response);
  $("#errorModal").modal('show');
}

function precision(number, pr) {
  var i, j, k, n, m, v;
  var textvalue = number;
  if (number) {
    if (isNaN(number)) {
      bankingAlert("Invalid Amount.");
      number = "";
      return number;
    }
  }
  if (pr.length == 0) {
    p = 2;
  }
  else {
    p = eval(pr);
  }
  j = 0;
  k = 0;
  n = 0;
  if (textvalue == "") {
    number = "0.00";
    return number;
  }
  for (i = 1; i < eval(p); i++) {
    j = j + "0";
  }
  m = "." + j;
  if (textvalue != "") {
    var dotindex = textvalue.indexOf('.');
    if (dotindex == -1) {
      number = eval(textvalue) + m;
      if (number > 9999999999999.999) {
        bankingAlert("Value too large");
        number = "";
      }
      else if (number == 0) {
        number = "0" + m;
      }
      return number;
    }
    else if (dotindex > -1) {
      var dotafterchars = textvalue.substring(dotindex + 1);
      k = dotafterchars.length;
      if (k < p) {
        t = eval(p) - eval(k);
        for (i = 0; i < t - 1; i++) {
          n = n + "0";
        }
        number = eval(textvalue);
        number = number + n;
        if (number > 9999999999999.999) {
          bankingAlert("Value too large");
          number = "";
        }
        else if (number == 0) {
          number = "0" + m;
        }
        return number;
      }
      else {
        number = textvalue.substr(0, dotindex) + textvalue.substr(dotindex, p + 1)
        if (number > 9999999999999.999) {
          bankingAlert("Value too large");
          number = "";
        }
        else if (number == 0) {
          number = "0" + m;
        }
        return number;
      }
    }
  }
}

function gridPrecision(number, pr) {

  var i, j = 0, k = 0, n = 0, m, v
  if (pr.length == 0) {
    p = 2;
  }
  else {
    p = pr;
  }

  var textvalue = number;
  if (textvalue == "") {
    number = "0.00";
    return number;
  }
  for (i = 1; i < p; i++) {
    j = j + "0";
  }
  m = "." + j;
  if (textvalue != "") {
    var dotindex = textvalue.indexOf('.');
    if (dotindex == -1) {
      number = textvalue + m;
      return number;
    }
    else if (dotindex > -1) {
      var dotafterchars = textvalue.substring(dotindex + 1);
      k = dotafterchars.length;
      if (k < p) {
        t = eval(p) - eval(k);
        for (i = 0; i < t - 1; i++) {
          n = n + "0";
        }
        number = textvalue + n;
        return number;
      }
      else {
        number = textvalue.substr(0, dotindex) + textvalue.substr(dotindex, p + 1);
        return number;
      }
    }
  }
}

function AmountInWords(decAmount) {
  var sUnits = new Array(20);
  var sTens = new Array(8);
  var sHundreds = new Array(6);
  var sAmount;
  var i, iLenAmount, iDecPart, iIntegerPart;

  sUnits[1] = '';
  sUnits[2] = 'One';
  sUnits[3] = 'Two';
  sUnits[4] = 'Three';
  sUnits[5] = 'Four';
  sUnits[6] = 'Five';
  sUnits[7] = 'Six';
  sUnits[8] = 'Seven';
  sUnits[9] = 'Eight';
  sUnits[10] = 'Nine';
  sUnits[11] = 'Ten';
  sUnits[12] = 'Eleven';
  sUnits[13] = 'Twelve';
  sUnits[14] = 'Thirteen';
  sUnits[15] = 'Fourteen';
  sUnits[16] = 'Fifteen';
  sUnits[17] = 'Sixteen';
  sUnits[18] = 'Seventeen';
  sUnits[19] = 'Eighteen';
  sUnits[20] = 'Ninteen';
  sTens[1] = 'Twenty';
  sTens[2] = 'Thirty';
  sTens[3] = 'Forty';
  sTens[4] = 'Fifty';
  sTens[5] = 'Sixty';
  sTens[6] = 'Seventy';
  sTens[7] = 'Eighty';
  sTens[8] = 'Ninety';
  sHundreds[1] = 'Hundred';
  sHundreds[2] = 'Thousand';
  sHundreds[3] = 'Lakh';
  sHundreds[4] = 'Crore';
  sHundreds[5] = 'Arab';
  sHundreds[6] = 'Kharab';

  if (decAmount == 10000000000000) {
    decAmount = 9999999999999.99;
  }
  if (decAmount == 0) {
    return "";
  }

  iDecPart = (decAmount - Math.round(decAmount)) * 100;
  iDecPart = Math.round(iDecPart);

  //Because Math.round results .50,.52,.53.......98,.99 in negative values

  if (iDecPart < 0) {
    iDecPart = 100 + iDecPart;
  }

  if (iDecPart == 0) {
    decAmount = decAmount;
  }
  else {
    decAmount = Math.round(decAmount - (iDecPart / 100));
  }

  iLenAmount = ((String)(decAmount)).length;

  if (iLenAmount == 1) {
    var index = parseInt(decAmount) + 1;
    sAmount = sUnits[index];
  }
  else {
    for (i = iLenAmount; i > 0; i--) {
      if (i == 13 || i == 12) {
        iIntegerPart = parseInt(decAmount / 100000000000);
        decAmount = parseInt(decAmount % 100000000000);
        if (iIntegerPart == 0) {
          sAmount = sAmount;
        }
        else {
          if (iIntegerPart < 20) {
            sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[6] + " ";
          }
          else {
            sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[6] + " ";
          }
        }
      }
      else if (i == 11 || i == 10) {
        iIntegerPart = parseInt(decAmount / 1000000000);
        decAmount = parseInt(decAmount % 1000000000);
        if (iIntegerPart == 0) {
          sAmount = sAmount;
        }
        else {
          if (iIntegerPart < 20) {
            if (sAmount == null) {
              sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[5] + " ";
            }
            else {
              sAmount = sAmount + " " + sUnits[iIntegerPart + 1] + " " + sHundreds[5] + " ";
            }
          }
          else {
            if (sAmount == null) {
              sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[5] + " ";
            }
            else {
              sAmount = sAmount + " " + sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[5] + " ";
            }
          }
        }
      }
      else if (i == 9 || i == 8) {
        iIntegerPart = parseInt(decAmount / 10000000);
        decAmount = parseInt(decAmount % 10000000);
        if (iIntegerPart == 0) {
          sAmount = sAmount;
        }
        else {
          if (iIntegerPart < 20) {
            if (sAmount == null) {
              sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[4] + " ";
            }
            else {
              sAmount = sAmount + " " + sUnits[iIntegerPart + 1] + " " + sHundreds[4] + " ";
            }
          }
          else {
            if (sAmount == null) {
              sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[4] + " ";
            }
            else {
              sAmount = sAmount + " " + sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[4] + " ";
            }
          }
        }
      }
      else if (i == 7 || i == 6) {
        iIntegerPart = parseInt(decAmount / 100000);
        decAmount = (decAmount % 100000);
        if (iIntegerPart == 0) {
          sAmount = sAmount;
        }
        else {
          if (iIntegerPart < 20) {
            if (sAmount == null) {
              sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[3] + " ";
            }
            else {
              sAmount = sAmount + " " + sUnits[iIntegerPart + 1] + " " + sHundreds[3] + " ";
            }
          }
          else {
            if (sAmount == null) {
              sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[3] + " ";
            }
            else {
              sAmount = sAmount + " " + sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[3] + " ";
            }
          }
        }
      }
      else if (i == 5 || i == 4) {
        iIntegerPart = parseInt(decAmount / 1000);
        decAmount = (decAmount % 1000);
        if (iIntegerPart == 0) {
          sAmount = sAmount;
        }
        else {
          if (iIntegerPart < 20) {
            if (sAmount == null) {
              sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[2] + " ";
            }
            else {
              sAmount = sAmount + " " + sUnits[iIntegerPart + 1] + " " + sHundreds[2] + " ";
            }
          }
          else {
            if (sAmount == null) {
              sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[2] + " ";
            }
            else {
              sAmount = sAmount + " " + sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[2] + " ";
            }
          }
        }
      }
      else if (i == 3) {
        iIntegerPart = parseInt(decAmount / 100);
        decAmount = (decAmount % 100);
        if (iIntegerPart == 0) {
          sAmount = sAmount;
        }
        else {
          var index;
          index = parseInt(iIntegerPart) + 1;
          if (sAmount == null) {
            sAmount = sUnits[index] + " " + sHundreds[1] + " ";
          }
          else {
            sAmount = sAmount + " " + sUnits[index] + " " + sHundreds[1] + " ";
          }
        }
      }
      else if (i == 2) {
        decAmount = parseInt(eval(decAmount));
        if (decAmount < 20) {
          var index = parseInt(decAmount) + 1;
          if (sAmount == null) {
            sAmount = sUnits[index];
          }
          else {
            sAmount = sAmount + " " + sUnits[index];
          }
        }
        else {
          var a = parseInt(((decAmount / 10) - 1));
          var b = (decAmount % 10) + 1;
          if (sAmount == null) {
            sAmount = sTens[a] + " " + sUnits[b];
          }
          else {
            sAmount = sAmount + " " + sTens[a] + " " + sUnits[b];
          }
        }
      }
    }
  }
  if (iDecPart == 0) {
    //sAmount = "Rs. " + sAmount;
    sAmount = sAmount;
  }
  else if (sAmount == "") {
    sAmount = "Paise ";
  }
  else {
    //sAmount = "Rs. "+sAmount+" And Paise";
    sAmount = sAmount + " And Paise";
  }

  if (iDecPart < 20) {
    sAmount = sAmount + " " + sUnits[iDecPart + 1] + " ";
  }
  else {
    var fi = parseInt(((iDecPart / 10) - 1));
    var fii = parseInt((iDecPart % 10)) + 1;
    sAmount = sAmount + " " + sTens[fi] + " " + sUnits[fii] + " ";
  }
  sAmount = sAmount;
  return sAmount;
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

function AjaxGet(url, data, callback) {

}
