function datecheck(obj) {
  var dt, arrDt
  if (obj.value == "")
    return;

  dt = obj.value
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
    obj.value = dt
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
      alert("Enter Date In Valid Date Format");
      obj.value = ""
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
        alert('No Of Days (or) Months Exceeds The Limit');
        obj.value = ""
        obj.focus();
        obj.select();
        return false;
      }
      else if ((len.substring(0, 2) < 1) || (len.substring(2, 4) < 1)) {
        alert('No Of Days (or) Months Not Equal To Zero');
        obj.focus();
        obj.select();
        return false;
      }
      else if (len.substring(4, 8) < 1950) {
        alert('Year Should Not Be Less Than 1950');
        obj.focus();
        obj.select();
        return false;
      }
      else if (len.substring(0, 2) > noDays) {
        alert("Enter DD Value Not More Than " + noDays);
        obj.focus();
        obj.select();
        return false;
      }
      else {
        obj.value = date1;
        copyDtls(obj)
      }
    }
  }
}

function getDays(month, year) {
  var monarr = new Array(12);
  monarr[0] = 31
  monarr[1] = (leapYear(year)) ? 29 : 28
  monarr[2] = 31
  monarr[3] = 30
  monarr[4] = 31
  monarr[5] = 30
  monarr[6] = 31
  monarr[7] = 31
  monarr[8] = 30
  monarr[9] = 31
  monarr[10] = 30
  monarr[11] = 31
  return monarr[month]
}

function copyDtls(obj) {
  var dt, arrDt

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

function leapYear(year) {
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