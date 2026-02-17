
$(function () {

  var bdt = '<%=BDT%>'



});

// This function is used to populate different service IDs and descriptions.
function ServiceId() {
  var DbCr
  var modId

  document.getElementById("divPhSign").style.display = 'none'
  window.document.all['divPayeeDtls'].style.display = "none"

  if (((vMode == "REC") || (vMode == "PAY")) && (window.document.frmTrans.Mfgpaydt.Rows > 1) && (mode != "MODIFY")) {

    alert("Only one Cash Transaction allowed at a time." + "\n" +
      "Post already entered data.")
    return;
  }

  if (window.document.frmTrans.tranmode(0).checked == true) {
    DbCr = "Dbt"
  }
  else if (window.document.frmTrans.tranmode(1).checked == true) {
    DbCr = "Cdt"
  }
  else if (window.document.frmTrans.tranmode(2).checked == true) {
    // Checking for clearingtype - selected or not 
    if ((window.document.frmTrans.cmdcleartype.value == "Select") ||
      (window.document.frmTrans.cmdcleartype.value == "")) {
      alert("Select ClearingType")
      return;
    }
    DbCr = "Clg"
  }
  modId = window.document.frmTrans.txtModId.value.toUpperCase()

  st = "Service|" + DbCr + "|" + modId
  // window.showModalDialog("/GEN/TranList.aspx" + "?" + "st=" + st)
}

// Making visible true or false based on service id selected.
function ServiceCode(kstr) {
  var strSer
  strSer = kstr.split("-----")
  window.document.frmTrans.txtServiceId.value = strSer[1]
  window.document.frmTrans.txtServiceName.value = strSer[0]
  ServiceIdDivs()
}

//This function was written to send parameters values to List form to get various modules
//and it displays modules only when Mfgpaydt(flexgrid) rows <2 or if the mode is MODIFY.

function Tellermodule() {
  var bdt = $("#Hidden_BDT").val();
  var selectedModule = $("#SelectedModule").val();
  var transMode = $("#TransactionMode").val();

  if (bdt.toUpperCase() == "TRUE")
    return;

  if ((selectedModule == 'CLG') && (transMode == 'Clearing'))
  {
    if ((window.document.frmTrans.cmdcleartype.value == "Select") || (window.document.frmTrans.cmdcleartype.value == "")) {
      bankingAlert("Please select Clearing Type.")
      window.document.frmTrans.cmdcleartype.focus()
      return;
    }
  }

  if (((vMode == "REC") || (vMode == "PAY")) && (window.document.frmTrans.Mfgpaydt.Rows > 1) && (mode != "MODIFY")) {
    bankingAlert("Only one Cash Transaction allowed at a time." + "\n" + "Post already entered data.")
    return;
  }

  if ((window.document.frmTrans.txtbranchcode.value == "") || (window.document.frmTrans.txtcurrencycode.value == "")) {
    return;
  }

  if (eval(window.document.frmTrans.txtServiceId.value) == "2") {
    stmod = "TellermoduleID";
    stbr = window.document.frmTrans.txtbranchcode.value.toUpperCase()
    var strServiceId = window.document.frmTrans.txtServiceId.value
    kstr = stmod + "|" + stbr + "|" + strServiceId

    if (window.document.frmTrans.tranmode[2].checked == false) {
      window.document.frmTrans.chkCheque.checked = false
    }
    window.showModalDialog('<%="http://" & session("moduledir")& "/DEPOSITS/"%>' + "List.aspx" + "?" + "st=" + kstr)
  }
  else {
    stmod = "Tellermodule";
    stbr = window.document.frmTrans.txtbranchcode.value.toUpperCase()
    kstr = stmod + "|" + stbr
    if (window.document.frmTrans.tranmode[2].checked == false) {
      window.document.frmTrans.chkCheque.checked = false
    }
    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
  }
}
