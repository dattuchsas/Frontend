
//----------------------------------------------------------------------------------
var vUserId, vAppDate, vCounterNo, vCashierId, vBranchCode, vBrNarration, vCurCode, vCurNarration
var vMachineId, vMode, vSubMode, tranNos, flexInsrtYN, pMaxRecPayAmt, MaxLimitAmt
var trnMode, trnDesc, brCode, brDesc, curCode, curDesc, vAbbuser, abbYN, abbApplDt, accnoChng, Amt, mode, Rselect, oldAmt, diff, n = 0
var instr, modid, modeval, chkNull, commtranno, comglcode, commodid, remtype, comgldesc, nullchk, stremval, commaccno, SrvChrgGLcode, SrvChrgGLdesc, SrvChrgAccno, SrvChrgmodid, SrvChrgtranno, SrvChrgAccname
var advrecyn, remadv, rempay, remadvno, remadvdate, remadvamt, advisbybank, advisbybr, remadvfvg, advinstatus, advstat
var natinsdt, natadv, servicecond, scrgridYN
var fxTransYN
var amtval = ""
var scrstr = ""

var issonbnk = ""
var advinstrdate = ""
var balstr = new String()
var strbat = new String()
var stracc = new String()
var vCashGlCode, vCashGldesc, strDenom
//variables for exception transaction handling
var excpMinBal, excpLmtAmt, excpParmAmt, excpChqSrs, excpChqNo, excpChq
var excpEffDt, excpCodes, excpYN, excpAmt, mstTab, excpOverDraft
var strDivs
//Variables used for Parameter values at Account Level
var pMinAmt, pMaxAmt, pMinPrdYrs, pMinPrdMons, pMinPrdDays, pMaxPrdYrs, pMaxPrdMons, pMaxPrdDays
var pCashDrYN, pCashCrYN, pTransDrYN, pTransCrYN, pClgDrYN, pClgCrYN
var pChqVldPrd, pMultplesOf, pChqLength
//Variables used for Parameter values at GL Level
var pIntDrGL, pIntCrGL, pIntAccrGL, pODGL, pIntCompYN, pMiscAcc
//For Deposits
var pDUnitsYN, pDUnitVal, pDPreMatWDYN, pDIntRoundOffTo
var pDLoanonDepYN, pDRenOddAmtYN, pDIntPayPrdcYN, pDIntPrdctyPymnt, pIntPayMethod, pDInstsYN
var CashDenom
var strBatchTran
CashDenom = '<%=session("cashdenomyn")%>'
var cashdenomtally
cashdenomtally = '<%=session("cashdenomtallyyn")%>'
var scts
scts = '<%=strcts%>'
var clgretchgsautoyn1
clgretchgsautoyn1 = '<%=strAutoRetChrgsYN%>'
var clgCommRetChrgsYN1
clgCommRetChrgsYN1 = '<%=strCommRetChrgsYN%>'
var strnparemarks

var clgAbbimpyn = "<%=impClgyn%>"


var strUserCustId
var strApprCustId

var noOfDaysBDT = '<%=noOfDays%>'
//narration




//This function was written to send values to list form for Branch de[tails display, and used to store already selected brach code and description for later use. 
function Tellerbranch() {
  brCode = window.document.frmTrans.txtbranchcode.value.toUpperCase()
  brDesc = window.document.frmTrans.txtbranchdesc.value
  window.document.frmTrans.chkCheque.checked = false
  txtbranchcode_onkeyup()
  st = "Tellerbranch"
  // TODO
  // window.showModalDialog("/GEN/TranList.aspx" + "?" + "st=" + st)
}

function txtbranchcode_onkeyup() {
  // TODO
  //ModuleClear()
  //LnkModClear()
  //ClgModClear()
  window.document.frmTrans.txtbranchdesc.value = ""
}




function fxRateTypes() {
  strpm = "FXRATETYPES"
  // window.document.all['iMsg'].src = "/GEN/minBalChk.aspx?strparam=" + strpm
}

function modeChng(bdt) {
  if (bdt.toUpperCase() == "TRUE")
    return;
  //ModuleClear();
  //Remclear();
  //funloanclear();
  //Cls();
  $("#Module").prop("disabled", false);
}

// This function is used to populate different service IDs and descriptions.


// Making visible true or false based on service id selected.
function ServiceCode(kstr) {
  var strSer
  strSer = kstr.split("-----")
  window.document.frmTrans.txtServiceId.value = strSer[1]
  window.document.frmTrans.txtServiceName.value = strSer[0]
  ServiceIdDivs()
}

// This function was written to send parameters values to List form to get various modules and it displays modules only when Mfgpaydt(flexgrid) rows <2 or if the mode is MODIFY.






function cashGlCode() {
  var kstr = "";
  if (window.document.frmTrans.txtbranchcode.value.length > 0) {
    strpm = "CASHGL" + "~" + window.document.frmTrans.txtbranchcode.value
    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function RecPayLmt() {
  var kstr = "";
  with (window.document.frmTrans) {
    strpm = "RPLMT" + "~" + txtbranchcode.value + "~" +
      txtcurrencycode.value + "~" +
      strsessionflds[0]
    // window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}


function formClear() {
  ModuleClear();//clear module and 
  LnkModClear();
  ClgModClear();
  if (mode != "MODIFY") {
    excpIntValues();
  }
  Remclear();
  funloanclear();
  Cls();
  clearflds()
  ClgClear()
  hdnFldClear()
  Depdivclear()
  chkboxUnCheck()
  grid()
  UnlockControls()
  CashMode()
  forexClear()
  UnLockContAdd()
}





function Cls() {
  window.document.all['ChqDtl'].style.display = "none";
  // window.document.all['divDisp'].style.display="none"
  //  window.document.all['divTempTrans'].style.display="none"
  window.document.all['divFxRate'].style.display = "none"
  if (window.document.frmTrans.chkABB.checked == false) {
    abbApplDt = ""
  }

  window.document.frmTrans.txtAmt.disabled = false

}

//for clearing all divs other than clgdiv if clearing option button is selected for clearing
function clearflds() {

  window.document.frmTrans.txtCLGModId.value = ""
  window.document.frmTrans.txtCLGModDesc.value = ""
  window.document.frmTrans.txtCLGGLcode.value = ""
  window.document.frmTrans.txtCLGGLname.value = ""
  window.document.frmTrans.txtAccNm.value = ""
  window.document.frmTrans.txtCLGAccNo.value = ""
  window.document.frmTrans.txtCLGReason.value = ""
  window.document.frmTrans.txtCLGReasoncode.value = ""
  window.document.frmTrans.txtCLGBankCode.value = ""
  window.document.frmTrans.txtCLGBranch.value = ""
  Cheque()
  window.document.frmTrans.chkCheque.checked = true

}

///function is used for clear the fileds and called on Clear button click 	
function ClgClear() {

  window.document.all.divCrDr.style.display = "block"
  window.document.frmTrans.chkCheque.disabled = false
  window.document.frmTrans.chkCheque.checked = false
  window.document.frmTrans.cmdcleartype.style.display = "none";
  window.document.frmTrans.tranmode[0].disabled = false
  window.document.frmTrans.tranmode[1].disabled = false
  Cheque()
  window.document.frmTrans.tranmode[0].checked = true
  window.document.frmTrans.chkTransDet.disabled = false
  window.document.frmTrans.chkLnkMod.disabled = false
  lnkMod()
  window.document.frmTrans.cmdModId.disabled = false
  window.document.frmTrans.cmdGLCode.disabled = false
  window.document.frmTrans.cmdAccno.disabled = false
  window.document.all.divCLG.style.display = "none"
}

//----------------------------------------------------------------------------------	
function hdnFldClear() {
  window.document.frmTrans.hdnBatchNo.value = ""
  window.document.frmTrans.hdnTranNo.value = ""
  window.document.frmTrans.hdnTranNo2.value = ""
  window.document.frmTrans.hdnTranNo3.value = ""
  window.document.frmTrans.hdnTranNo4.value = ""
  window.document.frmTrans.hiddate.value = ""
  window.document.frmTrans.hidbatchno.value = ""
  window.document.frmTrans.hidtrnno.value = ""

}

//function is used to clear deposits div fields
function Depdivclear() {
  window.document.frmTrans.txtDOpAmt.value = ""
  window.document.frmTrans.txtDCurrAmt.value = ""
  window.document.frmTrans.txtDMatAmt.value = ""
  window.document.frmTrans.txtDCustId.value = ""
  window.document.frmTrans.txtDOpDate.value = ""
  window.document.frmTrans.txtDEffDt.value = ""
  window.document.frmTrans.txtDMatDt.value = ""
  window.document.frmTrans.txtDOpBy.value = ""
  window.document.frmTrans.txtDROI.value = ""
  window.document.frmTrans.txtDOpInstr.value = ""
  window.document.frmTrans.txtDIntAcc.value = ""
  window.document.frmTrans.txtDPaidupto.value = ""
}


//----------------------------------------------------------------------------------
function UnlockControls() {

  window.document.frmTrans.txtServiceId.readOnly = false
  window.document.frmTrans.cmdServiceId.disabled = false

  window.document.frmTrans.txtModId.readOnly = false
  window.document.frmTrans.cmdModId.disabled = false

  window.document.frmTrans.txtGLcode.readOnly = false
  window.document.frmTrans.cmdGLCode.disabled = false

  window.document.frmTrans.txtAccNo.readOnly = false
  window.document.frmTrans.cmdAccno.disabled = false

  window.document.frmTrans.txtAmt.disabled = false

  window.document.frmTrans.dtpEffDate.Enabled = true


  window.document.frmTrans.chkDispAccNo.disabled = false

}





function PopupShow(keycode, ctnBrCode, ctnModid, ctnGlcode, ctnAccNo, pagePath, fieldName, ctnfield, saveorshow) {
  var branchcode = ctnBrCode.value.toUpperCase();
  var moduledID = ctnModid.value;
  var glcode = ctnGlcode;
  var accountnumber = ctnAccNo;
  var formname = pagePath.substring(pagePath.lastIndexOf("/") + 1);
  var fieldname = fieldName;
  var fieldvalue = ctnfield.value;
  strInsert = true;

  kstr = branchcode + "|" + moduledID + "|" + glcode + "|" + accountnumber + "|" + formname + "|" + fieldname + "|" + fieldvalue + "|" + saveorshow

  //alert("kstr= " + kstr)
  if (keycode == "113" && saveorshow == "SHOW") {
    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "frmPopUpList.aspx?" + "data=" + kstr, window, "status:no;" +
      "DialogWidth:420px;DialogHeight:440px;DialogLeft:60px;DialogTop:50px")
  }

  if (saveorshow == "SAVE") {
    window.document.frames['iBatch2'].frmList.action = '<%="http://" & session("moduledir")& "/GEN/"%>' + "frmPopUpList.aspx?" + "data=" + kstr
    window.document.frames['iBatch2'].frmList.method = "post"
    window.document.frames['iBatch2'].frmList.submit()
  }
}


function key(e) {
  strValVin = window.document.frmTrans.txtChqFVG
  kc = e.keyCode ? e.keyCode : e.which;
  PopupShow(kc, window.document.frmTrans.txtbranchcode, window.document.frmTrans.txtModId,
    window.document.frmTrans.txtGLcode.value, window.document.frmTrans.txtAccNo.value, location.pathname,
    "txtChqFVG", window.document.frmTrans.txtChqFVG, "SHOW")
}

function key1(e) {
  strValVin = window.document.frmTrans.txtfavg
  kc = e.keyCode ? e.keyCode : e.which;
  PopupShow(kc, window.document.frmTrans.txtbranchcode, window.document.frmTrans.txtModId,
    "REMGLCODE", "REMACCNO", location.pathname,
    "txtNarran", window.document.frmTrans.txtfavg, "SHOW")
}
var strValVin

function okNarrSave() {
  strValVin = window.document.frmTrans.txtChqFVG
  PopupShow("", window.document.frmTrans.txtbranchcode, window.document.frmTrans.txtModId,
    window.document.frmTrans.txtGLcode.value, window.document.frmTrans.txtAccNo.value, location.pathname,
    "txtChqFVG", window.document.frmTrans.txtChqFVG, "SAVE")
}

function okNarrSave1() {
  strValVin = window.document.frmTrans.txtfavg
  PopupShow("", window.document.frmTrans.txtbranchcode, window.document.frmTrans.txtModId,
    "REMGLCODE", "REMACCNO", location.pathname,
    "txtNarran", window.document.frmTrans.txtfavg, "SAVE")
}

var strInsert = true

function popclose(str) {
  strInsert = false
  strValVin.value = str
}


function getPayeeBank() {
  window.document.frmTrans.txtPayeeBank.value = ""
  window.document.frmTrans.txtPayBnkDesc.value = ""
  window.document.frmTrans.txtPayeeBranch.value = ""
  window.document.frmTrans.txtPayBrDesc.value = ""
  window.document.frmTrans.txtMICRCode.value = ""

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Please Select Branch Code.")
    window.document.frmTrans.txtbranchcode.focus()
  }
  else if (window.document.frmTrans.txtcurrencycode.value == "") {
    alert("Please Currency Code.")
    window.document.frmTrans.txtcurrencycode.focus()
  }
  else {

    if (clgAbbimpyn == "Y") {
      st = "GENOTHERBANKMST~BANKCODE," + "BANKNAME~upper(trim(ourbranchcode))='" + "<%=session("branchcode")%>" + "'~~cmdlstBank~General"
    }
    else {
      st = "GENOTHERBANKMST~BANKCODE," + "BANKNAME~upper(trim(ourbranchcode))='" + window.document.frmTrans.txtbranchcode.value.toUpperCase() + "'~~cmdlstBank~General"
    }

    window.showModalDialog('<%="http://" & session("moduledir")& "/HO/"%>' + "genlist.aspx" + "?" + "st=" + st, window, "status:no;" +
      "DialogWidth:300px;DialogHeight:150px;DialogLeft:190px;DialogTop:210px")
  }
}

function getlistdtls(str) {
  var strArr = str.split("~")
  if (strArr[1] == "cmdlstBank") {
    strVal = strArr[0].split("-----")
    window.document.frmTrans.txtPayeeBank.value = strVal[1]
    window.document.frmTrans.txtPayBnkDesc.value = strVal[0]
    window.document.frmTrans.txtPayeeBranch.focus()

  }
  else if (strArr[1] == "cmdlstInstrBranch") {
    strVal = strArr[0].split("-----")
    window.document.frmTrans.txtPayeeBranch.value = strVal[1]
    window.document.frmTrans.txtPayBrDesc.value = strVal[0]
    window.document.frmTrans.cmdOk.focus()
    var strPrm = "BranchRBICode" + "|" + window.document.frmTrans.txtPayeeBranch.value + "|" + window.document.frmTrans.txtPayeeBank.value
    window.document.all['iBatch1'].src = '<%="http://" & session("moduledir")& "/HO/"%>' + "BankDetails.aspx?strPrm=" + strPrm
  }
}

function getPayeeBranch() {
  window.document.frmTrans.txtPayeeBranch.value = ""
  window.document.frmTrans.txtPayBrDesc.value = ""

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Please Select Branch Code.")
    window.document.frmTrans.txtbranchcode.focus()
  }
  else if (window.document.frmTrans.txtcurrencycode.value == "") {
    alert("Please Currency Code.")
    window.document.frmTrans.txtcurrencycode.focus()
  }
  else if (window.document.frmTrans.txtPayeeBank.value == "") {
    alert("Please Payee Bank Code.")
    window.document.frmTrans.txtPayeeBank.focus()
  }
  else {
    if (clgAbbimpyn == "Y") {
      st = "GENOTHERBRANCHMST~BRANCHCODE,BRANCHNAME~BANKCODE='" + window.document.frmTrans.txtPayeeBank.value + "' and " + "ourbranchcode='" + "<%=session("branchcode")%>" + "'~~cmdlstInstrBranch~General"
    }
    else {
      st = "GENOTHERBRANCHMST~BRANCHCODE,BRANCHNAME~BANKCODE='" + window.document.frmTrans.txtPayeeBank.value + "' and " + "ourbranchcode='" + window.document.frmTrans.txtbranchcode.value.toUpperCase() + "'~~cmdlstInstrBranch~General"
    }

    window.showModalDialog('<%="http://" & session("moduledir")& "/HO/"%>' + "genlist.aspx" + "?" + "st=" + st, window, "status:no;" +
      "DialogWidth:300px;DialogHeight:150px;DialogLeft:190px;DialogTop:210px")
  }
}

function DisplayRBIcode(str) {
  window.document.frmTrans.txtMICRCode.value = str
}

function getBankDesc() {
  window.document.frmTrans.txtPayBnkDesc.value = ""
  window.document.frmTrans.txtPayeeBranch.value = ""
  window.document.frmTrans.txtPayBrDesc.value = ""
  window.document.frmTrans.txtMICRCode.value = ""

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Please Select Branch Code.")
    window.document.frmTrans.txtbranchcode.focus()
  }
  else if (window.document.frmTrans.txtcurrencycode.value == "") {
    alert("Please Currency Code.")
    window.document.frmTrans.txtcurrencycode.focus()
  }
  else {
    if (window.document.frmTrans.txtPayeeBank.value != "") {
      if (clgAbbimpyn == "Y") {
        var st = "GETBANKDESC|" + "<%=session("branchcode")%>" + "*" + window.document.frmTrans.txtPayeeBank.value
      }
      else {
        var st = "GETBANKDESC|" + window.document.frmTrans.txtbranchcode.value + "*" + window.document.frmTrans.txtPayeeBank.value
      }

      window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
    }
  }
}

function bankDesc(str) {
  if (str == "") {
    alert("Bank name Not Found")
  }
  else {
    window.document.frmTrans.txtPayBnkDesc.value = str
    window.document.frmTrans.txtPayeeBranch.focus()
  }
}

function getBranchDesc() {
  window.document.frmTrans.txtPayBrDesc.value = ""

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Please Select Branch Code.")
    window.document.frmTrans.txtbranchcode.focus()
  }
  else if (window.document.frmTrans.txtcurrencycode.value == "") {
    alert("Please Currency Code.")
    window.document.frmTrans.txtcurrencycode.focus()
  }
  else if (window.document.frmTrans.txtPayeeBank.value == "") {
    alert("Please Payee Bank Code.")
    window.document.frmTrans.txtPayeeBank.focus()
  }
  else {
    if (window.document.frmTrans.txtPayeeBranch.value != "") {
      var st = "GETBRANCHDESC|" + window.document.frmTrans.txtPayeeBank.value + "*" + window.document.frmTrans.txtPayeeBranch.value
      window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
    }
  }
}

function branchDesc(str) {
  if (str == "")
    alert("Branch Name name Not Found")
  else
    window.document.frmTrans.txtPayBrDesc.value = str

  window.document.frmTrans.cmdOk.focus()

  var strPrm = "BranchRBICode" + "|" + window.document.frmTrans.txtPayeeBranch.value + "|" + window.document.frmTrans.txtPayeeBank.value
  window.document.all['iBatch1'].src = '<%="http://" & session("moduledir")& "/HO/"%>' + "BankDetails.aspx?strPrm=" + strPrm
}

//testing purpose only---------->


function getDateFormat(str) {
  var arr = str.split("-")
  var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  var i = 0
  for (i; i <= months.length; i++) {
    if (months[i] == arr[1].toUpperCase())
      break;

  }
  i++;
  //alert(arr[0] + "/0" + i+ "/" +  arr[2])
  return new Date("0" + i + "/" + arr[0] + "/" + arr[2])

}

function bdtDateCheck() {
  //alert("raja")
  if (bdt.toUpperCase() == "TRUE") {

    //window.document.all['iGetDtls'].src="../GEN/datecheck.aspx?strVal="+window.document.frmTrans.txtEffDate.value.toUpperCase() + "|"
    //raja
    try {
      var date1 = window.document.frmTrans.txtEffDate.value.toUpperCase()
      var date2 = "<%=vAppdate%>"
      var one_day = 1000 * 60 * 60 * 24
      var date11 = getDateFormat(date1)
      var date12 = getDateFormat(date2)
      var diff_ms = date12.getTime() - date11.getTime()
      diff_no_of_days = Math.round(diff_ms / one_day)
      //alert(diff_no_of_days)
      if ((diff_no_of_days >= 0) && (diff_no_of_days <= noOfDaysBDT)) {

      }
      else {
        alert("Eff. Date should be between '" + '<%=BDTStartDate%>' + "' and '" + date2 + "'");
        window.document.frmTrans.txtEffDate.focus();
      }

    }
    catch (err) {
      alert(err.message)
    }

  }
}

//---------------------------------------------------------------------------------- 
//This function is used to send parameters to List form to get various currency codes and
//descriptions available and also used for storing already selected currency code and
//currency description
function curr() {
  curCode = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
  curDesc = window.document.frmTrans.txtcurrencydesc.value
  window.document.frmTrans.chkCheque.checked = false
  st = "Curr"

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + st, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:520px;DialogTop:170px")
}
//----------------------------------------------------------------------------------

//---------------------------------------------------------------------------------- 
//This function was written to send parameter values to List form to get various modules
function lnkModule() {

  stmod = "LnkModule";
  stbr = window.document.frmTrans.txtbranchcode.value.toUpperCase()
  kstr = stmod + "|" + stbr

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:100px")
}
//----------------------------------------------------------------------------------
//This function displays various moduleids and descriptions,it also clear all lower level
//fields.
function LnkModuleCode(kstr) {
  assign(kstr, window.document.frmTrans.txtLnkModDesc, window.document.frmTrans.txtLnkModId);
  LnkGLClear()
}
//----------------------------------------------------------------------------------
//This function is used to send parameters to List form to display various Glcodes avialabe
//It displays Glcodes based on branchcode and module id.  
function Glcode() {

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Please select Branchcode.")
    window.document.frmTrans.txtbranchcode.focus()
    return;
  }
  if (window.document.frmTrans.txtModId.value == "") {
    alert("Please select Module Id.")
    window.document.frmTrans.txtModId.focus()
    return;
  }

  document.getElementById("divPhSign").style.display = 'none';
  /*telgl="Tellerglcode";
  brcode=window.document.frmTrans.txtbranchcode.value.toUpperCase();
  modid=window.document.frmTrans.txtModId.value.toUpperCase();
  kstr=telgl+"|"+brcode+"|"+modid
  if(modid!="")
  {
    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>'+"TranList.aspx" + "?"+"st="+kstr,window,"status:no;"+
 "DialogWidth:470px;DialogHeight:170px;DialogLeft:200px;DialogTop:200px")
  } */

  telgl = "TellGlaccno"
  brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase();
  modid = window.document.frmTrans.txtModId.value.toUpperCase();
  kstr = telgl + "|" + modid + "|" + brcode

  if (modid != "") {
    window.showModalDialog("../gensbca/ListGlQuery.aspx?st=" + kstr, window, "status:no;" +
      "DialogWidth:500px;DialogHeight:200px;DialogLeft:190px;DialogTop:200px")

  }
}
//----------------------------------------------------------------------------------
//This function is used to send parameters to List form to display various Glcodes avialabe
//It displays Glcodes based on branchcode and module id.  
function lnkGlcode() {
  LnkGl = "LnkGlcode";
  brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase();
  modid = window.document.frmTrans.txtLnkModId.value.toUpperCase();
  kstr = LnkGl + "|" + brcode + "|" + modid
  if (modid != "") {

    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
      "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:120px")
  }
}
//----------------------------------------------------------------------------------
//This function is used to display Glcodes.And it clears all the lower level fields	
function lnkGlcodeid(kstr) {
  assign(kstr, window.document.frmTrans.txtLnkGLname, window.document.frmTrans.txtLnkGLCode)
  LnkAccountClear()
}
//----------------------------------------------------------------------------------



//----------------------------------------------------------------------------------
function ServiceIdDivs() {
  //for clearing outward returns
  //alert("hi")
  window.document.frmTrans.cmdModId.disabled = false
  byBranch.innerHTML = "Issued by Branch"
  byBank.innerHTML = "Issued by Bank"

  if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
    CLGClearDiv()
    paramAcc()
  }
  else if (eval(window.document.frmTrans.txtServiceId.value) == "9") {

    window.document.frmTrans.cmdModId.disabled = true
    window.document.frmTrans.txtModId.value = "REM"
    //if(window.document.frmTrans.tranmode(0).checked==true)
    cntrlOnblur('txtModId')
    divsDisplay("remdr", "M")
    window.document.all.divaccno.style.display = "none"
    byBranch.innerHTML = "Issued on Branch"
    byBank.innerHTML = "Issued on Bank"
    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"


    // RemCanc for DD and BC		
    var st = "REMCANCCHARGES"
    window.document.all['iGetDtls'].src = "../GEN/getDtls.aspx?st=" + st


  }
  else if (eval(window.document.frmTrans.txtServiceId.value) != "2" &&
    window.document.frmTrans.txtModId.value != "SCR") {
    window.document.all.divaccno.style.display = "block"
    window.document.all['divAppName'].style.display = "none";
    window.document.all['divAccCat'].style.display = "none"

  }
  else if (eval(window.document.frmTrans.txtServiceId.value) == "2") {
    window.document.all['divaccno'].style.display = "none";
    window.document.all['divAppName'].style.display = "block";
    window.document.all['divAccCat'].style.display = "block"
    Depdivclear()
  }


}

function round(number, precision) {
  var pair = (number + 'e').split('e')
  var value = Math.round(pair[0] + 'e' + (+pair[1] + precision))
  pair = (value + 'e').split('e')
  return +(pair[0] + 'e' + (+pair[1] - precision))
}

function DispRemCancCharges(str) {

  if (("<%=strRemCancAutoChrgsYN%>" == "Y") && ("<%=strRemCancCommYN%>" == "Y")) {

    var strArr = str.split("|")
    gstPercent = strArr[1]
    CESSPercent = strArr[2]
    window.document.frmTrans.txtremchgsamt.value = strArr[0]

    window.document.frmTrans.txtremgstamt.value = parseFloat(window.document.frmTrans.txtremchgsamt.value) * parseFloat(strArr[1]) * 0.01

    window.document.frmTrans.txtremgstamt.value = Math.round(window.document.frmTrans.txtremgstamt.value)


    window.document.frmTrans.txtremcessamt.value = parseFloat(window.document.frmTrans.txtremchgsamt.value) * parseFloat(strArr[2]) * 0.01
    window.document.frmTrans.txtremcessamt.value = Math.round(window.document.frmTrans.txtremcessamt.value)

  }
  else {
    window.document.frmTrans.txtremchgsamt.value = "0"
    window.document.frmTrans.txtremchgsamt.disabled = true
    window.document.frmTrans.txtremgstamt.value = "0"
    window.document.frmTrans.txtremgstamt.disabled = true
    window.document.frmTrans.txtremcessamt.value = "0"
    window.document.frmTrans.txtremcessamt.disabled = true
  }


  if ("<%=strRemCancGSTYN%>" == "N") {
    window.document.frmTrans.txtremgstamt.value = "0"
    window.document.frmTrans.txtremgstamt.disabled = true
    window.document.frmTrans.txtremcessamt.value = "0"
    window.document.frmTrans.txtremcessamt.disabled = true
  }
  if ("<%=strRemCancCESSYN%>" == "N") {
    window.document.frmTrans.txtremcessamt.value = "0"
    window.document.frmTrans.txtremcessamt.disabled = true
  }

}

function getRemCancGST() {
  if (("<%=strRemCancAutoChrgsYN%>" == "Y") && ("<%=strRemCancCommYN%>" == "Y")) {
    window.document.frmTrans.txtremgstamt.value = parseFloat(window.document.frmTrans.txtremchgsamt.value) * parseFloat(gstPercent) * 0.01
    window.document.frmTrans.txtremgstamt.value = Math.round(window.document.frmTrans.txtremgstamt.value)
    window.document.frmTrans.txtremcessamt.value = parseFloat(window.document.frmTrans.txtremchgsamt.value) * parseFloat(CESSPercent) * 0.01
    window.document.frmTrans.txtremcessamt.value = Math.round(window.document.frmTrans.txtremcessamt.value)

  }
  else {
    window.document.frmTrans.txtremchgsamt.value = "0"
    window.document.frmTrans.txtremchgsamt.disabled = true
    window.document.frmTrans.txtremgstamt.value = "0"
    window.document.frmTrans.txtremgstamt.disabled = true
    window.document.frmTrans.txtremcessamt.value = "0"
    window.document.frmTrans.txtremcessamt.disabled = true

  }
  if ("<%=strRemCancGSTYN%>" == "N") {
    window.document.frmTrans.txtremgstamt.value = "0"
    window.document.frmTrans.txtremgstamt.disabled = true
    window.document.frmTrans.txtremcessamt.value = "0"
    window.document.frmTrans.txtremcessamt.disabled = true

  }
  if ("<%=strRemCancCESSYN%>" == "N") {
    window.document.frmTrans.txtremcessamt.value = "0"
    window.document.frmTrans.txtremcessamt.disabled = true
  }

}

//----------------------------------------------------------------------------------
//---------------------------------suspense start-------------------------------
//This function is used to populate different category codes and descriptions for
//suspense and sundry.
function SuspenseDtls() {

  var Modid, GlCd, prec, catdtls, kstr, Accno, strDisp, scrAmt
  ModId = window.document.frmTrans.txtModId.value.toUpperCase();
  GlCd = window.document.frmTrans.txtGLcode.value.toUpperCase();
  Brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase()
  Curr = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
  Accno = window.document.frmTrans.txtAccNo.value.toUpperCase();
  scrgridYN = ""
  prec = window.document.frmTrans.hpr.value
  //alert("vMode=" + vMode + ", Modid=" + ModId)
  if ((vMode == "TRANS") || (vMode == "PAY")) {
    if ((ModId == "SCR") && (GlCd != "") && (Brcode != "")) {

      kstr = "SUSPENCE"
      catdtls = kstr + "~!~" + ModId + "~!~" + GlCd + "~!~" + Brcode
      //alert("catdtls=" + catdtls)
      window.document.all['iDisp'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "querydisplay.aspx?st=" + catdtls
    }

  }
  else if (vMode == "REC") {
    kstr = "SUSPENCE"
    catdtls = kstr + "~!~" + ModId + "~!~" + GlCd + "~!~" + Brcode
    //alert("catdtls=" + catdtls)
    window.document.all['iDisp'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "querydisplay.aspx?st=" + catdtls


  }

}
//----------------------------------------------------------------------------------
//This function is used to show forms based on conditions
function suspencereturn(kstr) {
  //alert("kstr="+kstr)
  var catdtls, Brcode, GlCd, Curr, Accno
  var scrAmt = 0
  var prec = window.document.frmTrans.hpr.value
  var strDisp = ""

  Brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase();
  GlCd = window.document.frmTrans.txtGLcode.value.toUpperCase();
  Curr = window.document.frmTrans.txtcurrencycode.value.toUpperCase();
  Accno = window.document.frmTrans.txtAccNo.value.toUpperCase();
  scrstr = kstr
  window.document.frmTrans.hidscr.value = ""

  TranMode()

  if (ModId == "SCR") {
    if (window.document.frmTrans.chkDispAccNo.checked == true) {
      var strDisp = "Disposals"
      scrAmt = window.document.frmTrans.txtAmt.value
    }
    else {
      var strDisp = ""
      scrAmt = ""
    }

    //if((kstr=="DR") && (trnMode=="4"))
    if (((kstr == "DR") && (trnMode == "4")) ||
      ((kstr == "DR") && (trnMode == "2"))) {
      catdtls = GlCd + "~!~" + prec + "~!~" + Brcode + "~!~" + Curr + "~!~" + Accno + "~!~" + strDisp + "~!~" + scrAmt
      scrgridYN = "YES"
      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' +
        "scrflex.aspx" + "?" + "catdtls=" + catdtls, window, "status:no;DialogWidth:745px;DialogHeight:210px;DialogLeft:60px;DialogTop:150px")
      return;
    }
    else if (((kstr == "CR") && (trnMode == "3")) ||
      ((kstr == "CR") && (trnMode == "1"))) {

      catdtls = GlCd + "~!~" + prec + "~!~" + Brcode + "~!~" + Curr + "~!~" + Accno + "~!~" + strDisp + "~!~" + scrAmt
      //// This is not a fly page.. It is a window
      scrgridYN = "YES"
      //alert("scrflexcatdtls=" + catdtls)
      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' +
        "scrflex.aspx" + "?" + "catdtls=" + catdtls, window, "status:no;DialogWidth:745px;DialogHeight:210px;DialogLeft:60px;DialogTop:150px")
      return;
    }

  }
}
//----------------------------------------------------------------------------------
//This function is used to store category details
function categorycode(kstr) {

  var strscrdt
  strscrdt = kstr.split('~!~')
  window.document.frmTrans.txtAccNo.value = strscrdt[0]
  window.document.frmTrans.txtAccNm.value = strscrdt[1]

  if (window.document.frmTrans.chkDispAccNo.checked == false) {
    window.document.frmTrans.txtAmt.value = strscrdt[2]
  }

  window.document.frmTrans.hidscr.value = strscrdt[2]
  window.document.frmTrans.hiddate.value = strscrdt[3]
  window.document.frmTrans.hidtrnno.value = strscrdt[4]
  window.document.frmTrans.hidbatchno.value = strscrdt[5]
  scrgridYN = "GRIDYES"

}
//----------------------------------------------------------------------------------
//This function is used to see addtional checks
function OkValidations() {

  /* if(vMode=="REC"){
    var totDen=eval(window.document.frames("idenom").frmDenom.txtTotAmt.value)
    var entAmt=eval(eval(window.document.frmTrans.txtAmt.value)+
           eval(window.document.frmTrans.txtcomm.value))
       alert("Denominations not Tallied")    
   } */

  if (window.document.frmTrans.txtModId.value.toUpperCase() == "SCR") {
    if (scrgridYN == "YES") {
      alert("Amount should be selected from Account Details Grid")
      if (window.document.frmTrans.chkDispAccNo.checked == false) {
        window.document.frmTrans.txtAmt.value = ""
      }
      return false;
    }
    else if (scrgridYN == "GRIDYES") {
      okValid = true
      return true;
    }
  }
}
//----------------------------------------------------------------------------------
// To Check Amount should not be greater than balance amount
function Amountcheck() {

  var hidamt, scramt, ModId, clgGlCd2, clgModId
  hidamt = window.document.frmTrans.hidscr.value
  scramt = window.document.frmTrans.txtAmt.value
  ModId = window.document.frmTrans.txtModId.value;
  clgModId = window.document.frmTrans.txtCLGModId.value.toUpperCase();
  clgGlCd2 = window.document.frmTrans.txtCLGGLcode.value.toUpperCase();

  var overdraft2
  overdraft2 = "<%=ovrdrft%>"

  if (ModId == "SCR") {
    if (scramt) {
      if (((trnMode == "4") && (scrstr == "DR")) || ((trnMode == "3") && (scrstr == "CR"))
        || ((trnMode == "1") && (scrstr == "CR")) || ((trnMode == "2") && (scrstr == "DR"))) {


        if (eval(scramt) > eval(hidamt)) {

          alert("Amount should not be greater than : " + hidamt)
          window.document.frmTrans.txtAmt.value = hidamt
        }

      }
    }
  }
  //-------- for clearing , serviceid ==8, clearbal < 0 
  if (window.document.frmTrans.tranmode[2].checked == true) {
    if (window.document.frmTrans.txtServiceId.value == "8") {

      if (overdraft2 == "N") {
        if ((clgModId == "CC") || (clgModId == "LOAN") || (clgModId == "INV") || ((clgModId == "MISC") && (clgGlCd2.substr(0, 3) == "204"))) {
        }
        else {

          if (window.document.frmTrans.txtretclearbal.value < 0) {
            alert("Clearing Balance Is Less Than Zero , No Transaction Is Posted")
            window.document.frmTrans.txtAmt.value = "0.00"
            return;
          }
        } //((clgModId=="CC") || (clgModId=="LOAN") || (clgModId=="INV") || ((clgModId=="MISC") && (clgGlCd2.substr(0,3)=="204")))
      }
      else {
      } //(overdraft2 == 'N')	
    } //(window.document.frmTrans.txtServiceId.value == "8")
  } //(window.document.frmTrans.tranmode[2].checked==true)
}
//-------------------------------------------------------------------------------------
//------- Cash Debit Cash Credit ---------------------
function cashdrcrcheck() {

  if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC")) {
    var resmaxamt, resmaxamt1
    if ((eval(window.document.frmTrans.txtAmt.value) + eval(window.document.frmTrans.txttotcashcr.value)) > eval(window.document.frmTrans.hdnmaxamt.value)) {
      resmaxamt = confirm("Total Cash Credit Is Crossing " + window.document.frmTrans.hdnmaxamt.value + " , Do You Want To Continue Y/N")
      if (resmaxamt == true) { }
      else {
        window.document.frmTrans.txtAmt.value = "0.00"
        return
      }
    }

    if ((eval(window.document.frmTrans.txtAmt.value) + eval(window.document.frmTrans.txttotcashdr.value)) > eval(window.document.frmTrans.hdnmaxamt.value)) {
      resmaxamt1 = confirm("Total Cash Debit Is Crossing " + window.document.frmTrans.hdnmaxamt.value + " , Do You Want To Continue Y/N")
      if (resmaxamt1 == true) { }
      else {
        window.document.frmTrans.txtAmt.value = "0.00"
        return
      }
    }
  }
}
//------- Cash Debit Cash Credit ---------------------

function CatCode() {
  kstr = "catcode"
  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:90px;DialogTop:120px")

}
//-------------------------------------------------------------------------------------
function CatCodeRtn(results) {
  var result = results.split("-----")
  window.document.frmTrans.txtAccCatCode.value = result[1]
  window.document.frmTrans.txtAccCatDesc.value = result[0]
  AmtNarrClear()
  AccParameters(window.document.frmTrans.txtAccCatCode.value, "CATCODE")
}
//-------------------------------------------------------------------------------------
//function is used to populate account no name in list based on module id,glcode
//and makes visible true or flase of different divs based on conditions
function AccCode() {
  //alert("AccCode()")
  window.document.all['divunits'].style.display = "none"
  window.document.frmTrans.txtUnits.value = ""

  if (window.document.frmTrans.chkDispAccNo.checked == false) {

    if ((window.document.frmTrans.txtServiceId.value == "3") ||
      (window.document.frmTrans.txtServiceId.value == "4")) {
      if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
        alert("Post or Cancel already entered data...")
        return
      }
      if ((window.document.frmTrans.txtModId.value.toUpperCase() == "SB") || (window.document.frmTrans.txtModId.value.toUpperCase() == "CA")) {
        stacc = "Telleraccno";
      }
      else {
        stacc = "DepRenCloseAccno";
      }
    }
    else {
      stacc = "Telleraccno";
    }
  }
  else {
    stacc = "DispAccNo"
  }


  brchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase();
  ModId = window.document.frmTrans.txtModId.value.toUpperCase();
  GlCd = window.document.frmTrans.txtGLcode.value.toUpperCase();
  crCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase();
  serId = window.document.frmTrans.txtServiceId.value
  kstr = stacc + "|" + brchCd + "|" + ModId + "|" + GlCd + "|" + crCd + "|" + serId
  //alert(kstr)
  if ((brchCd.length > 0) && (GlCd.length > 0) && (ModId.length > 0) && (crCd.length > 0))
    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
      "DialogWidth:470px;DialogHeight:200px;DialogLeft:140px;DialogTop:120px")

}
//--------------------------------------------------------------------
//This function is used to populate account numbers and names based on module id, glcode.
function lnkAccCode() {
  if (window.document.frmTrans.txtLnkModId.value == "REM") {
  }
  else {
    stacc = "LnkAccno";
    brchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase();
    ModId = window.document.frmTrans.txtLnkModId.value.toUpperCase();
    GlCd = window.document.frmTrans.txtLnkGLCode.value.toUpperCase();
    crCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase();
    kstr = stacc + "|" + brchCd + "|" + ModId + "|" + GlCd + "|" + crCd
    if ((brchCd.length > 0) && (GlCd.length > 0) && (ModId.length > 0) && (crCd.length > 0))

      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' +
        "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
      "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:80px")
  }
}
//----------------------------------------------------------------------------------	
//This function is used to assign accno and name to textboxex and displays different divs
//based on conditions
function accountid(kstr) {
  var strval;
  var modId = window.document.frmTrans.txtModId.value.toUpperCase()

  //alert("kstr=" + kstr);

  strnew = kstr.split("-----")

  window.document.frmTrans.txtAccNm.value = strnew[0]
  window.document.frmTrans.txtAccNo.value = strnew[1]

  //alert(strnew)

  AmtNarrClear()//TO CLEAR AMOUNT AND NARRATION
  if (modId == "SB" || modId == "CA" || modId == "DEP" || modId == "LOAN" || modId == "CC") {
    AccParameters(window.document.frmTrans.txtAccNo.value, "ACCNO")
  }
  //    chequeClear()
  window.document.frmTrans.txtChqDt.value = '<%=session("Applicationdate")%>'

  if (window.document.frmTrans.chkDispAccNo.checked == true) {
    dispAccChk()
    DispGrid()
  }
  balanceDet()

  if ((vMode == "TRANS") && (window.document.frmTrans.txtModId.value == "DEP") &&
    ((window.document.frmTrans.txtServiceId.value == "3") ||
      (window.document.frmTrans.txtServiceId.value == "4"))) {
    lockControls()
    DepRenClose()
    ModuleClear()
    defaultValues()
  }


  if (window.document.frmTrans.txtModId.value == "LOAN") {
    //alert("hi")
    funloanintdetails(kstr)
  }

  if (window.document.frmTrans.txtModId.value == "SCR") {
    //alet("calling Suspensedetails")
    SuspenseDtls()
  }
  // checking for chequebookYN
  if (modId == "SB" || modId == "CA" || modId == "CC") {
    GetAccDets()
  }

  if ((modId == "LOAN") && (window.document.frmTrans.tranmode[1].checked == true)) {
    //alert("hi1")

    var i;
    for (i = 0; i < 1000; i++) {
    }

    st = window.document.frmTrans.txtbranchcode.value + "|" +
      window.document.frmTrans.txtcurrencycode.value + "|LOAN|" +
      window.document.frmTrans.txtGLcode.value + "|" +
      window.document.frmTrans.txtAccNo.value

    window.document.all['idetails'].src = '<%="http://" & session("moduledir")& "/Loan/"%>' + "loanrenewintcalc.aspx?st=" + st;
  }
}

function calInterest(kstr) {
  if (isNaN(parseFloat(kstr)) == false) {
    window.document.frmTrans.txtIntPendAmt.value = kstr
    precision(window.document.frmTrans.txtIntPendAmt, window.document.frmTrans.hpr.value)
  }
  else {
    window.document.frmTrans.txtIntPendAmt.value = "0"
    precision(window.document.frmTrans.txtIntPendAmt, window.document.frmTrans.hpr.value)
  }
  if (isNaN(parseFloat(window.document.frmTrans.txtloanaccbal.value)) == false) {
    window.document.frmTrans.txtloanaccbal.value = parseFloat(window.document.frmTrans.txtloanaccbal.value) - parseFloat(window.document.frmTrans.txtIntPendAmt.value)
    precision(window.document.frmTrans.txtloanaccbal, window.document.frmTrans.hpr.value)
  }
  else {
    window.document.frmTrans.txtIntPendAmt.value = 0
  }
  precision(window.document.frmTrans.txtloanaccbal, window.document.frmTrans.hpr.value)

  MinPeriodValidation()
  getLoanNPAInt()

  //window.document.frmloanopening.txtpendint.value=kstr
  /*
      window.document.frmloanopening.txtsanctionamt.value = eval(Math.abs(window.document.frmloanopening.txtcurbal.value)) + eval(Math.abs(window.document.frmloanopening.txtpendint.value))
      //alert(window.document.frmloanopening.txtsanctionamt.value)
      DisplayLoanDetails()*/
}

function getLoanNPAInt() {
  st = "GETLOANNPAINT|" + window.document.frmTrans.txtbranchcode.value + "|" +
    window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtModId.value + "|" +
    window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value

  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
}

function popLoanNPAInt(str) {
  window.document.frmTrans.txtNPAIntAmt.value = "0.00"
  var ntp

  ntp = str.split("~")

  window.document.frmTrans.hdnLstcaldate.value = ntp[1]


  if (isNaN(parseFloat(ntp[0])) == false) {
    window.document.frmTrans.txtNPAIntAmt.value = ntp[0]
    precision(window.document.frmTrans.txtNPAIntAmt, window.document.frmTrans.hpr.value)
  }
  else {
    window.document.frmTrans.txtNPAIntAmt.value = "0"
    precision(window.document.frmTrans.txtNPAIntAmt, window.document.frmTrans.hpr.value)
  }
  if (isNaN(parseFloat(window.document.frmTrans.txtloanaccbal.value)) == false) {
    window.document.frmTrans.txtloanaccbal.value = parseFloat(window.document.frmTrans.txtloanaccbal.value) - parseFloat(window.document.frmTrans.txtNPAIntAmt.value)
    precision(window.document.frmTrans.txtloanaccbal, window.document.frmTrans.hpr.value)
  }
  else {
    window.document.frmTrans.txtNPAIntAmt.value = 0
  }
  precision(window.document.frmTrans.txtloanaccbal, window.document.frmTrans.hpr.value)
}

//----------------------------------------------------------------------------------
//This function is used to populate disposal accounts and names
function dispAccChk() {

  kstr = "DISPBATCH" + "~" + window.document.frmTrans.txtbranchcode.value + "~" +
    window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtModId.value + "~" +
    window.document.frmTrans.txtGLcode.value + "~" +
    window.document.frmTrans.txtAccNo.value
  window.document.all['iDisp'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + kstr
}
//----------------------------------------------------------------------------------
//This function is used to check whether the selected account no's batch already exists 
//or not	 	 
function dispBatchCheck(Rslt) {

  if (Rslt != "Proceed") {
    confm = confirm("Disposal Batch No already exists in PipeLine... Do you Want to Continue ?")
    if (confm == true) {
      dispData(Rslt)
      disposal("BatchExits")
    }
    else {

    }
  }
  else {
    disposal("NoBatch")

  }

}
//----------------------------------------------------------------------------------
//This function is used to assign link module account no and name and clears off other
//lower fields	 	 
function lnkAccountId(kstr) {
  var strval;
  strnew = kstr.split("-----")
  window.document.frmTrans.txtLnkAccNm.value = strnew[0]
  window.document.frmTrans.txtLnkAccNo.value = strnew[1]
  LnkAddClear()
}
//----------------------------------------------------------------------------------	 	 	 
//LOANS----------------------y.naveen kumar accountid
//This function is used to checks wether the loan amount exceeds the sanction amount or not
//and also sees loan amount is exceeding the available amount or not
function funloanminamt() {
  var strloanamtstat = true
  {
    //&& (window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text=="principle")
    if ((window.document.frmTrans.txtModId.value == "LOAN") && (window.document.frmTrans.tranmode(0).checked == true) && (window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text.toUpperCase() == "PRINCIPLE")) {
      {
        if (eval(window.document.frmTrans.txtloanavailbal.value) < 0) {
          alert("Allready balance had exceeded sanction amount")
          strloanamtstat = false
          return strloanamtstat
        }
        else if (eval(window.document.frmTrans.txtloanavailbal.value) < eval(window.document.frmTrans.txtAmt.value)) {
          alert("Amount cannot exceed available amount")
          strloanamtstat = false
          return strloanamtstat
        }
        else {
          strloanamtstat = true
          return strloanamtstat
        }
      }
    }
  }
}

//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
//function is used to populate combo box with diffrent loantypes.
function funfillloantrantype(strloantype) {

  var j, k, strVal
  var St = new String()
  var Con = new String()
  var St1 = new String()
  Con = strloantype.substring(1, strloantype.length)
  var option0 = new Option("--Select--", "Select")
  eval("window.document.frmTrans.selloantrans.options[0]=option0")
  strVal = strloantype.split("~")
  k = strVal.length - 1
  for (i = 0; i < k; i++) {
    St1 = Con.split("~")

    var option0 = new Option(St1[i], St1[i])
    window.document.frmTrans.selloantrans.options[i + 1] = option0
  }
}
//----------------------------------------------------------------------------------
function funloantran() {
  strpm = "loantrantype"
  window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
}
//----------------------------------------------------------------------------------
function funinsertloan() {
  var strqry
  strqry = "frmtrans" + "|" + "loanpreference"
  window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "cashloangetdtls.aspx" + "?" + "strqry=" + strqry
}

//----------------------------------------------------------------------------------
function getloandtls(strvals) {
  var strsplit
  strsplit = strvals.split("|")
  {
    if (strsplit[0] == "loanpreference") {
      window.document.frmTrans.hdloandetails.value = strvals.substring(15)
    }
  }
}
//---------------------------------------------------------------------------------- 
function funloanintdetails(strloan) {
  var kstr
  kstr = "frmtrans" + "~" + "loandetails" + "~" + window.document.frmTrans.txtbranchcode.value +
    "~" + window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtAccNo.value + "~" + window.document.frmTrans.txtGLcode.value

  window.document.all['iloandtls'].src = "loaninterestdetails.aspx?kstr=" + kstr;
}
//----------------------------------------------------------------------------------
function funinsertintdtls() {

  {
    if (window.document.frmTrans.txtModId.value != "LOAN") {
      return
    }
  }

  {
    if ((window.document.frmTrans.txtModId.value == "LOAN") &&
      (window.document.frmTrans.tranmode(0).checked == true)) {
      return
    }
  }


  var strloansplit
  inttot = window.document.frmTrans.txtAmt.value

  strloansplit = (window.document.frmTrans.hdloandetails.value).split("|")
  {
    window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = ""
    window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = ""
    window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = ""
    window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = ""
    window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = ""
    window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = ""
  }
  {
    if (window.document.frmTrans.hdloandetails.value != "0" && window.document.frmTrans.hdloandetails.value.length > 0) {
      {

        for (var intcnt = 1; intcnt < 7; intcnt++) {
          {

            if (strloansplit[0] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value < 0) {
              {
                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value))) {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value)
                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value)
                }
                else {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = inttot
                  inttot = eval(inttot) - eval(inttot)
                }
              }
            }
            else if (strloansplit[1] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value < 0) {
              {
                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value))) {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value)
                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value)
                }
                else {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = inttot
                  inttot = eval(inttot) - eval(inttot)
                }
              }
            }
            else if (strloansplit[2] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value < 0) {
              {
                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value))) {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value)
                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value)
                }
                else {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = inttot
                  inttot = eval(inttot) - eval(inttot)
                }
              }
            }
            else if (strloansplit[3] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value < 0) {
              {
                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value))) {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value)
                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value)
                }
                else {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = inttot
                  inttot = eval(inttot) - eval(inttot)
                }
              }
            }
            else if (strloansplit[4] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value < 0) {

              {
                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value))) {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value)
                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value)
                }
                else {
                  window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = inttot
                  inttot = eval(inttot) - eval(inttot)
                }
              }
            }
          }
        }
      }


      {
        if (eval(inttot) > 0) {
          window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = inttot
        }
      }

      {
        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtintamt, window.document.frmTrans.hpr.value)
        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt, window.document.frmTrans.hpr.value)
        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt, window.document.frmTrans.hpr.value)
        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt, window.document.frmTrans.hpr.value)
        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt, window.document.frmTrans.hpr.value)
        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt, window.document.frmTrans.hpr.value)

      }

    }
  }

}
//----------------------------------------------------------------------------------
//This function is used to assign currency code and description and gives an alert
//if user changes currency code after entering some data into flexgrid.	
function currency(kstr) {
  var k
  k = kstr.split("-----")
  window.document.frmTrans.txtcurrencydesc.value = k[0]
  window.document.frmTrans.txtcurrencycode.value = k[1]
  ClearAlert("Cur")
  prn = k[2].length - 1
  window.document.frmTrans.hpr.value = prn
  if (window.document.frmTrans.Mfgpaydt.Rows == 1) {
    sumDrCrDefault()
  }
  if (vMode == "REC") {
    Denom()
  }
}

//----------------------------------------------------------------------------------
//This function is used to assign glcode and descrption and collects different parameters
//based on glcode	

function glaccountid(kstr) {
  //alert("gl result  ="+kstr)
  assign(kstr, window.document.frmTrans.txtGLDesc, window.document.frmTrans.txtGLcode)
  var modID = window.document.frmTrans.txtModId.value.toUpperCase()
  if ((modID == "SB") || (modID == "CA") || (modID == "DEP") || (modID == "CC") || (modID == "LOAN") || (modID == "MISC")) {
    GLParameters()

  }
  AccountClear();

  if ((window.document.frmTrans.txtModId.value == "REM") || (window.document.frmTrans.txtModId.value == "FXREM")) {
    Remclear()
    getremtype()
  }

  if ((window.document.frmTrans.tranmode[2].checked == true) && (window.document.frmTrans.txtModId.value == "REM")) {
    window.document.frmTrans.txtinstrno.focus()
  }

  if ((vMode == "REC") && (window.document.frmTrans.txtModId.value == "LOCKER")) {
    window.document.frmTrans.chkDispAccNo.disabled = false
    window.document.frmTrans.chkDispAccNo.checked = true
  }
  excptionAmt()
}

//---------------------------------------------------------------------------------- 
//--------prsremit 
function issbank() {

  if (window.document.frmTrans.txtGLcode.value.length > 0) {
    gl = window.document.frmTrans.txtGLcode.value.toUpperCase()

    BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
    CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()

    kstr = "issonbnk" + "~" + gl + "~" + BranchCd + "~" + CurCd

    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
      "DialogWidth:270px;DialogHeight:180px;DialogLeft:340px;DialogTop:100px")
  }
  //if(issonbnk==""){
  kstr = "issonbnk";

  //	window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>'+"TranList.aspx" + "?"+"st="+kstr,window,"status:no;"+
  //	"DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:100px")
  //	}

}
//---------------------------------------------------------------------------------- 
function issuedonbnk(kstr) {
  TranMode()

  //Remclear()
  var k

  k = kstr.split("-----")

  if ((trnMode == "4") || (trnMode == "2")) {

    window.document.frmTrans.txtissbrcode.value = ""
    window.document.frmTrans.txtissbrdesc.value = ""
    //alert("ss")
    window.document.frmTrans.txtissbnkcode.value = k[1]
    window.document.frmTrans.txtissbnkdesc.value = k[0]
  }
  else if ((trnMode == "1") || (trnMode == "3")) {
    window.document.frmTrans.txtbybrcode.value = ""
    window.document.frmTrans.txtbybrdesc.value = ""

    window.document.frmTrans.txtbybnkcode.value = k[1]
    window.document.frmTrans.txtbybnkdesc.value = k[0]
  }
}
//----------------------------------------------------------------------------------
function issbrnch() {
  TranMode()
  // alert("trnmode="+trnMode+",  rem type="+ remtype+", issonbnk="+issonbnk)

  BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
  CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()



  if (issonbnk != "") {
    kstr = "issonbr";
    if ((trnMode == "4") || (trnMode == "2")) { bankCode = window.document.frmTrans.txtissbnkcode.value; }
    else if ((trnMode == "3") || (trnMode == "1")) { bankCode = window.document.frmTrans.txtbybnkcode.value; }
    else { bankCode = issonbnk; }

    kstr = kstr + "~" + remtype.toUpperCase() + "~" + bankCode;

    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
      "DialogWidth:270px;DialogHeight:180px;DialogLeft:340px;DialogTop:100px")
  }
  else
    //if ((trnMode=="4") && ( (remtype.toUpperCase()=="DD") || (remtype.toUpperCase()=="MT")|| (remtype.toUpperCase()=="TT") ))
    if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") || (remtype.toUpperCase() == "TT")) {
      if (trnMode == "4") { bankCode = window.document.frmTrans.txtissbnkcode.value; }
      else if (trnMode == "3") { bankCode = window.document.frmTrans.txtbybnkcode.value; }

      kstr = "issonothbr" + "~~" + bankCode;

      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
        "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:100px")
    }
    /*else if ((trnMode=="4") && ( (remtype.toUpperCase()=="ADD") || 
    (remtype.toUpperCase()=="TC") ))*/
    else if ((remtype.toUpperCase() == "ADD") || (remtype.toUpperCase() == "TC")) {

      if (trnMode == "4") { bankCode = window.document.frmTrans.txtissbnkcode.value; }
      else if (trnMode == "3") { bankCode = window.document.frmTrans.txtbybnkcode.value; }

      //kstr="issonothbr"+"~ADD~"+bankCode;
      kstr = "issonothbr" + "~" + remtype.toUpperCase() + "~" + bankCode + "~" + BranchCd + "~" + CurCd
      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
        "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:100px")
    }
}
//----------------------------------------------------------------------------------
function issuedonbr(kstr) {
  //remclrbrclick()

  var k
  k = kstr.split("-----")
  if ((trnMode == "4") || (trnMode == "2")) {
    window.document.frmTrans.txtissbrcode.value = k[1]
    window.document.frmTrans.txtissbrdesc.value = k[0]
  }
  else if ((trnMode == "3") || (trnMode == "1")) {
    window.document.frmTrans.txtbybrcode.value = k[1]
    window.document.frmTrans.txtbybrdesc.value = k[0]
    window.document.frmTrans.txtinstrno.focus()
  }

  var brcode, issbrcode, bybrcode
  brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase()
  issbrcode = window.document.frmTrans.txtissbrcode.value.toUpperCase()
  bybrcode = window.document.frmTrans.txtbybrcode.value.toUpperCase()

  if ((trnMode == "4") || (trnMode == "2")) {
    if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") ||
      (remtype.toUpperCase() == "TT")) {
      if (brcode == issbrcode) {
        alert("Instrument can't be issued on the same Branch")
        window.document.frmTrans.txtissbrcode.value = ""
        window.document.frmTrans.txtissbrdesc.value = ""
        return
      }
    }
    else {
      if ((brcode != issbrcode) && (remtype.toUpperCase() != "ADD")) {
        alert("Instrument can't be issued on Different Branch")
        window.document.frmTrans.txtissbrcode.value = ""
        window.document.frmTrans.txtissbrdesc.value = ""
        return
      }
    }
  } //end of credit trnModes IF Condition

  if ((trnMode == "1") || (trnMode == "3")) {
    if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") ||
      (remtype.toUpperCase() == "TT")) {
      if (brcode == bybrcode) {
        alert("Can't be respond to the Instruments of the same Branch")
        window.document.frmTrans.txtbybrcode.value = ""
        window.document.frmTrans.txtbybrdesc.value = ""
        return
      }
    }
    /*else
    {
      if (brcode!=issbrcode)
      {
        alert("Instrument can't be issued on Different Branch")
        window.document.frmTrans.txtissbrcode.value=""
        window.document.frmTrans.txtissbrdesc.value=""
        return	
      }
    }*/
  } //end of debit trnModes IF Condition

}
//---------------------------------------------------------------------------------- 
function issuedonothbr(kstr) {
  TranMode()
  //remclrbrclick()
  var k
  k = kstr.split("-----")
  if ((trnMode == "4") || (trnMode == "2")) {
    window.document.frmTrans.txtissbrcode.value = k[1]
    window.document.frmTrans.txtissbrdesc.value = k[0]
  }
  else if ((trnMode == "3") || (trnMode == "1")) {
    window.document.frmTrans.txtbybrcode.value = k[1]
    window.document.frmTrans.txtbybrdesc.value = k[0]

  }
}
//----------------------------------------------------------------------------------
function getremtype() {
  var vModId
  if (window.document.frmTrans.txtGLcode.value.length > 0) {
    if (window.document.frmTrans.txtModId.value.toUpperCase() == "REM") {
      vModId = "REM"
    }
    else if (window.document.frmTrans.txtModId.value.toUpperCase() == "FXREM") {
      vModId = "FXREM"
    }
    strpm = vModId + "~" + window.document.frmTrans.txtGLcode.value.toUpperCase();
    window.document.all['iRemParam'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "remtypeflylst.aspx?st=" + strpm

  }
}
//---------------------------------------------------------------------------------- 
function remitype(kstr) {
  if (kstr == "NODATA") {
    alert("No Parameters Specified")
    GLClear()
    return
  }
  issonbnk = ""
  //alert(kstr)
  if (kstr != "NODATA") {
    var ins = kstr.split("~")
    TranMode()
    if ((trnMode == "2") || (trnMode == "4")) {
      //alert('no')
      window.document.frmTrans.txtissbnkcode.value = ins[1]
      window.document.frmTrans.txtissbnkdesc.value = ins[2]
      issonbnk = ins[1]

      /*if( (eval(window.document.frmTrans.txtcomm.value>0)) &&
        (ins[3]=="" || ins[4]=="" ||ins[6]=="") )
      {
          alert("Commission Related Parameters not Specified")
          issonbnk=""
          GLClear()
          return		       
      }*/
      comglcode = ins[3]
      commodid = ins[4]
      comgldesc = ins[5]
      remtype = ins[0]
      commaccno = ins[6]
      SrvChrgAccname = ins[11]
      /*if( (eval(window.document.frmTrans.txtSerivceChrg.value>0)) &&
        (ins[7]=="" || ins[8]=="" ||ins[10]=="") )
      {
          alert("Service Charge Related Parameters not Specified")
          issonbnk=""
          GLClear()
          return		       
      }*/
      SrvChrgGLcode = ins[7]
      SrvChrgmodid = ins[8]
      SrvChrgGLdesc = ins[9]
      SrvChrgAccno = ins[10]


      window.document.frmTrans.txtissbnkcode.disabled = false
      window.document.frmTrans.txtissbrcode.disabled = false
      window.document.frmTrans.cmdissbnl.disabled = false
      window.document.frmTrans.cmdissbrl.disabled = false

      if ((remtype.toUpperCase() == "PO") || (remtype.toUpperCase() == "BC") ||
        (remtype.toUpperCase() == "GC"))//RK WROTE
      {
        window.document.frmTrans.txtissbrcode.value =
          window.document.frmTrans.txtbranchcode.value
        window.document.frmTrans.txtissbrdesc.value =
          window.document.frmTrans.txtbranchdesc.value

        window.document.frmTrans.txtissbnkcode.disabled = true
        window.document.frmTrans.txtissbrcode.disabled = true
        window.document.frmTrans.cmdissbnl.disabled = true
        window.document.frmTrans.cmdissbrl.disabled = true
      }
      if (remtype.toUpperCase() == "DD") {
        window.document.frmTrans.txtissbrcode.value = ""
        window.document.frmTrans.txtissbrdesc.value = ""

        window.document.frmTrans.txtissbnkcode.disabled = true
        window.document.frmTrans.cmdissbnl.disabled = true

      }
    }
    else { // i.e. Tran modes are 1 or 3
      window.document.frmTrans.txtbybnkcode.value = ins[1]
      window.document.frmTrans.txtbybnkdesc.value = ins[2]
      remtype = ins[0]
      issonbnk = ins[1]

      window.document.frmTrans.txtbybnkcode.disabled = false
      window.document.frmTrans.txtbybrcode.disabled = false
      window.document.frmTrans.cmdbybnl.disabled = false
      window.document.frmTrans.cmdbybrl.disabled = false

      if ((remtype.toUpperCase() == "PO") || (remtype.toUpperCase() == "BC") || (remtype.toUpperCase() == "GC")) {
        window.document.frmTrans.txtbybrcode.value =
          window.document.frmTrans.txtbranchcode.value
        window.document.frmTrans.txtbybrdesc.value =
          window.document.frmTrans.txtbranchdesc.value

        window.document.frmTrans.txtbybnkcode.disabled = true
        window.document.frmTrans.txtbybrcode.disabled = true
        window.document.frmTrans.cmdbybnl.disabled = true
        window.document.frmTrans.cmdbybrl.disabled = true
      }
      if (remtype.toUpperCase() == "DD") {
        window.document.frmTrans.txtbybrcode.value = ""
        window.document.frmTrans.txtbybrdesc.value = ""


        window.document.frmTrans.txtbybnkcode.disabled = true
        window.document.frmTrans.cmdbybnl.disabled = true

      }
    }
  }
}
//----------------------------------------------------------------------------------
function Remcheck() {
  nullcheck()

  if (nullchk == "false") {
    alert("Enter all Details")
    window.document.frmTrans.txtinstrdt.value = ""
    return
  }
  var strremchk = reminsert()
  //alert(strremchk)
  if (remtype != "ADD") {
    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "remdebitchknative.aspx?st=" + strremchk
  }
  else if (remtype == "ADD") {
    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "remdebitchk.aspx?st=" + strremchk
  }



}
//----------------------------------------------------------------------------------
function remcheckpay(kstr) {
  var remchstr = kstr.split("|");

  if (remchstr[0] == "ERROR") {
    alert(remchstr[1])
    window.document.frmTrans.txtinstrno.value = ""
    window.document.frmTrans.txtinstrdt.value = ""
    window.document.frmTrans.txtfavgdr.value = ""
    window.document.frmTrans.txtremchgsamt.value = ""
    window.document.frmTrans.txtremgstamt.value = ""
    window.document.frmTrans.txtremcessamt.value = ""
    window.document.frmTrans.txtAmt.value = 0
    precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)
    window.document.frmTrans.txtAmt.disabled = false

    return;
  }

  rempay = remchstr[0].split("~");
  remadv = remchstr[1].split("~");

  //Remittance = Instrument Cancellation
  if (eval(window.document.frmTrans.txtServiceId.value) == "9") {
    window.document.frmTrans.txtfavgdr.value = rempay[0]
    window.document.frmTrans.txtAmt.value = rempay[1]
    precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)
    window.document.frmTrans.txtAmt.disabled = true
    return
  }


  advrecyn = remadv[0]//prs

  if (rempay[0] == "N") {
    if (remadv[0] == "N") {
      //CODE ALTERED BY RADHIKA ON 4 SEP 2008
      //REASON: USER MIGHT DO DEBIT REMITANCE TRANSCTION INSTEAD OF REMITANCE CANCELLATION
      // THIS DECISSION HAD TAKEN TEMPORARLY. WE NEED TO CHANGE THIS.
      //alert("Advice not Received Proceed for Payment.")
      alert("Advice not Received.")
      window.document.frmTrans.txtAmt.value = ""
      window.document.frmTrans.txtfavgdr.value = ""
      window.document.frmTrans.txtAmt.disabled = false
      window.document.frmTrans.dtpinstDate.Enabled = true
      window.document.frmTrans.txtfavgdr.readOnly = false

      //temorary code written on 4 sep 2008
      //remove data from other controls too
      window.document.frmTrans.txtbybnkcode.value = ""
      window.document.frmTrans.txtbybnkdesc.value = ""
      window.document.frmTrans.txtbybrcode.value = ""
      window.document.frmTrans.txtbybrdesc.value = ""
      window.document.frmTrans.txtinstrno.value = ""
      window.document.frmTrans.txtinstrdt.value = ""
      window.document.frmTrans.txtremchgsamt.value = ""
      window.document.frmTrans.txtremgstamt.value = ""
      window.document.frmTrans.txtremcessamt.value = ""

      //end of temorary code written on 4 sep 2008

    }
    else {
      window.document.frmTrans.txtinstrdt.value = remadv[3]    //remadv[12]    
      window.document.frmTrans.txtfavgdr.value = remadv[2]    //remadv[10]    
      window.document.frmTrans.txtAmt.value = remadv[4]    //remadv[7] 
      precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtAmt.disabled = true

      remadvno = remadv[1]
      remadvdate = remadv[5]
      advinstatus = remadv[13]
      advstat = remadv[14]
      advinstrdate = remadv[3]
    }

  }
  else {
    alert("Instrument already paid")
    window.document.frmTrans.txtinstrno.value = ""
    window.document.frmTrans.txtinstrdt.value = ""

  }
}
//----------------------------------------------------------------------------------
function remcheckpaynat(kstr) {

  if (kstr == "StockLost") {
    alert("Instrument under Stock Lost")
    window.document.frmTrans.txtinstrno.value = ""
    window.document.frmTrans.txtinstrdt.value = ""
    return;
  }
  if ((kstr == "NODATA") || (kstr == "TYPEERROR") || (kstr == "DATEERROR") || (kstr == "INSTREXP")
    || (kstr == "INSTR_DT_ERR") || (kstr == "INSTRPAID")) {
    natadv = "N"
    natinsdt = ""

    if (kstr == "NODATA")
      alert("Instrument not Available")
    else if (kstr == "TYPEERROR")
      alert("Unable to get Data from Remitance Type Master")
    else if (kstr == "DATEERROR")
      alert("Unable to get Applicate Date of Issued Branch Code")
    else if (kstr == "INSTREXP")
      alert("Instrument Expired")
    else if (kstr == "INSTR_DT_ERR")
      alert("Given Issue Date is Invalid")
    else if (kstr == "INSTRPAID")
      alert("Instrument already Paid")

    window.document.frmTrans.txtinstrno.value = ""
    window.document.frmTrans.txtinstrdt.value = ""
    window.document.frmTrans.txtAmt.value = ""
    window.document.frmTrans.txtfavgdr.value = ""
    window.document.frmTrans.txtremchgsamt.value = ""
    window.document.frmTrans.txtremgstamt.value = ""
    window.document.frmTrans.txtremcessamt.value = ""
    window.document.frmTrans.txtAmt.disabled = false
    return
  }
  var remnat = kstr.split("~")
  var issueDate = remnat[1]
  var issOnBr = remnat[3]
  var stopayyn = remnat[5]
  var paidyn = remnat[6]
  var dupYN = remnat[7]
  var dupSerNo = remnat[8]
  var reValidate = remnat[9]
  //issOnBr="<%=vBranchCode%>" //rk wrote
  //if (issOnBr.toUpperCase()!=window.document.frmTrans.txtbranchcode.value.toUpperCase()) //rk wrote
  //issue on branch=nativebranch --
  //alert(remtype)
  if ((remtype.toUpperCase() == "PO") || (remtype.toUpperCase() == "BC") || (remtype.toUpperCase() == "GC"))//RK WROTE
  {
    if ((window.document.frmTrans.chkABB.checked == true) && (issOnBr.toUpperCase() == window.document.frmTrans.txtbranchcode.value.toUpperCase())) {
      //alert("hii")
    }
    else {
      if (issOnBr.toUpperCase() != "<%=vBranchCode%>") {
        alert("Instrument not issued on this Branch")
        window.document.frmTrans.txtinstrno.value = ""
        window.document.frmTrans.txtinstrdt.value = ""
        return
      }
    }
  }
  ///for stoppayment-----
  if (stopayyn.toUpperCase() == "Y") {
    alert("Instrument has been marked for Stop Payment")
    window.document.frmTrans.txtinstrno.value = ""
    window.document.frmTrans.txtinstrdt.value = ""
    return
  }
  ///checkink for duplaicte cheque issuing
  if ((dupYN.toUpperCase() == 'Y') && (paidyn != "")) {
    alert(" Duplicate Instrument Issued")
    window.document.frmTrans.txtinstrno.value = ""
    window.document.frmTrans.txtinstrdt.value = ""
    return;
  }
  ////for payment--
  if (paidyn != "") {
    alert("Instrument already paid ")
    window.document.frmTrans.txtinstrno.value = ""
    window.document.frmTrans.txtinstrdt.value = ""
    return
  }
  ///checkink for duplaicte cheque issuing
  if (dupYN.toUpperCase() == 'Y') {
    alert("Amount already paid for Duplicate Instrument")
    window.document.frmTrans.txtinstrno.value = ""
    window.document.frmTrans.txtinstrdt.value = ""
    return;
  }

  natadv = "Y"
  window.document.frmTrans.txtAmt.value = remnat[2]
  precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtAmt.disabled = true
  window.document.frmTrans.txtfavgdr.value = remnat[0]
  window.document.frmTrans.txtinstrdt.value = remnat[1]
  natinsdt = remnat[1]

  strUserCustId = remnat[10]
  strApprCustId = remnat[11]
  var st = "PPhotocust|" + strUserCustId
  window.document.frmTrans.txtPayeeBank.focus()

  window.document.all['iPhotoSign'].src = '<%="http://" & session("moduledir")&"/GENSBCA/"%>' + "GetPhotoSign.aspx?st=" + st
}
//----------------------------------------------------------------------------------
//This function is used to check wether all mandatary fields are filled up or not
function nullcheck() {
  nullchk = "true"
  if ((window.document.frmTrans.txtbybnkcode.value == "") ||
    (window.document.frmTrans.txtbybrcode.value == "") ||
    (window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") ||
    (window.document.frmTrans.txtModId.value == "") ||
    (window.document.frmTrans.txtGLcode.value == "") ||
    (window.document.frmTrans.txtinstrno.value == "")) {
    nullchk = "false"
  }
  else {
    nullchk = "true"
  }
}
//----------------------------------------------------------------------------------
function reminsert() {
  //stremval=""
  var bybrcode, brcode
  if (eval(window.document.frmTrans.txtServiceId.value) == "9") {
    bybrcode = window.document.frmTrans.txtbranchcode.value
    brcode = window.document.frmTrans.txtbybrcode.value
  }
  else {
    bybrcode = window.document.frmTrans.txtbybrcode.value
    brcode = window.document.frmTrans.txtbranchcode.value
  }

  stremval = window.document.frmTrans.txtinstrno.value + "~" +
    window.document.frmTrans.txtbybnkcode.value + "~" +
    bybrcode + "~" + brcode + "~" +
    window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtModId.value + "~" + remtype + "~" +
    window.document.frmTrans.txtinstrdt.value + "~" +
    window.document.frmTrans.txtGLcode.value + "~" + //Remitance GL Code
    eval(window.document.frmTrans.txtServiceId.value)


  /*  stremval=window.document.frmTrans.txtinstrno.value+"~"+
       window.document.frmTrans.txtbybnkcode.value+"~"+
       window.document.frmTrans.txtbybrcode.value+"~"+
       window.document.frmTrans.txtbranchcode.value+"~"+
       window.document.frmTrans.txtcurrencycode.value+"~"+
       window.document.frmTrans.txtModId.value+"~"+remtype+"~"+
       window.document.frmTrans.txtinstrdt.value+"~"
  */

  return stremval;
}
//---------------------------------------------------------------------------------- 
function customerscreen(strbut) {
  st = strbut + "~" + window.document.frmTrans.txtbranchcode.value + "~" + "NON-CUST"

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "custlist.aspx" + "?" + "strbut=" + st, window, "status:no;dialogWidth:490px;dialogHeight:200px;DialogLeft:250px;DialogTop:235px")
}
//----------------------------------------------------------------------------------
function getcustid(strcustid) {
  var strsplit
  strsplit = (strcustid).split("~")
  window.document.frmTrans.txtcustrid.value = strsplit[1]
  window.document.frmTrans.txtcusn.value = strsplit[2]
}

//----------------------------------------------------------------------------------
//function is used to assign branch code and desctiption and also gives an alert if
//user changes branch code after entering some data into flexgrid
function Branchcode(kstr) {
  assign(kstr, window.document.frmTrans.txtbranchdesc, window.document.frmTrans.txtbranchcode)

  var aBrCode
  aBrCode = "<%=session("branchcode")%>"

  if ((window.document.frmTrans.txtbranchcode.value.toUpperCase() !=
    vBranchCode.toUpperCase()) && (window.document.frmTrans.Mfgpaydt.Rows == 1)) {

    window.document.frmTrans.chkABB.checked = true
    window.document.frmTrans.chkDispAccNo.disabled = true
    AbbApplDt()
  }
  else if ((window.document.frmTrans.txtbranchcode.value.toUpperCase() ==
    aBrCode.toUpperCase()) && (window.document.frmTrans.Mfgpaydt.Rows == 1)) {

    window.document.frmTrans.chkABB.checked = false
    window.document.frmTrans.chkDispAccNo.disabled = true

  }

  //AbbApplDtBr() 
  //AbbApplDt()
  //code commented by Radhika on 19 may 2008 and shfted to AbbApplDtRtn method
  //Reason: Without fetching ABB appl date execution is going on 
}
//----------------------------------------------------------------------------------
function AbbApplDtBr() {
  var aBrCode1
  aBrCode1 = "<%=session("branchcode")%>"

  if ((window.document.frmTrans.txtbranchcode.value.length > 0) && (window.document.frmTrans.txtbranchcode.value != aBrCode1) && (window.document.frmTrans.Mfgpaydt.Rows > 1)) {
    if (window.document.frmTrans.Mfgpaydt.TextMatrix(1, 100) == 'N') {
      strpm = "ABBAPPLDATE" + "~" + window.document.frmTrans.txtbranchcode.value
      window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
    }
  }
}

function AbbApplDt() {
  if ((window.document.frmTrans.txtbranchcode.value.length > 0) && (window.document.frmTrans.chkABB.checked == true)) {
    strpm = "ABBAPPLDATE" + "~" + window.document.frmTrans.txtbranchcode.value
    window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }

}
//----------------------------------------------------------------------------------
function AbbApplDtRtn(appDt) {

  if ((appDt != "NOAPPLDT") || (appDt != "")) {
    if (appDt != vAppDate) {
      alert("Application date of selected Branch should same as " +
        "Application date of Logged in User's Branch")

      window.document.frmTrans.txtbranchcode.value = ""
      window.document.frmTrans.txtbranchdesc.value = ""
      window.document.frmTrans.chkABB.checked = false
      window.document.frmTrans.chkDispAccNo.disabled = false
    }
    else {

      abbApplDt = appDt
      window.document.frmTrans.txtEffDate.value = abbApplDt

      //code copied from Branchcode(str) method by Radhika on 19 may 2008 
      //Reason: Without fetching ABB appl date execution is going on 
      ClearAlert("Brn")
      GetBranchParams(window.document.frmTrans.txtbranchcode.value)
    }
  }
  else {
    alert("No Application Date set for this Branch")
    window.document.frmTrans.txtbranchcode.value = ""
    window.document.frmTrans.txtbranchdesc.value = ""
    window.document.frmTrans.chkABB.checked = false
    window.document.frmTrans.chkDispAccNo.disabled = false
  }
}
//----------------------------------------------------------------------------------
//This function displays various moduleids and descriptions,it also clear all lower level
//fields.And makes different divs visible true and false based on condition
function modulecode(kstr) {

  if (bdt.toUpperCase() == "TRUE")
    return
  var strMod = kstr.split("-----")
  window.document.frmTrans.txtModId.value = strMod[1]
  window.document.frmTrans.txtModDesc.value = strMod[0]
  /*if(strMod[0]!="")
  {
    window.document.frmTrans.txtGLcode.focus()
  }*/
  window.document.all['divRemRep'].style.display = "none";

  var modId = window.document.frmTrans.txtModId.value.toUpperCase()
  masterTabYN()
  GLClear()
  funloanclear()

  //make ChequeBook check box false and hide respective Division
  window.document.frmTrans.chkCheque.checked = false;
  Cheque();

  // Below code will work when service id <> 8 i.e other than clearing	
  if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
    return
  }

  fxTransactionYN()
  if (window.document.frmTrans.tranmode(2).checked == true) {
    if (modId == "REM") {
      window.document.frmTrans.chkCheque.checked = false;
    }
    else {
      window.document.frmTrans.chkCheque.checked = true;
    }
    Cheque()
  }


  if ((modId == "REM") &&
    ((window.document.frmTrans.tranmode(0).checked == true) ||
      (window.document.frmTrans.tranmode(2).checked == true))) {
    divsDisplay("remdr", "M")
    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"
  }

  else if ((modId == "REM") &&
    (window.document.frmTrans.tranmode(1).checked == true)) {
    divsDisplay("remcr", "M")
    window.document.all.divComm.style.display = "block";
    window.document.all['divfxRem'].style.display = "block";
    window.document.all['divrembank'].style.display = "block";
    window.document.all['divRemRep'].style.display = "block";

    if ((CashDenom == 'Y') && (vMode == "REC")) {
      window.document.frmTrans.chkRemRepeat.disabled = true
      window.document.frmTrans.txtNoOfRepeat.disabled = true
    }
    else {
      window.document.frmTrans.chkRemRepeat.disabled = false
      window.document.frmTrans.txtNoOfRepeat.disabled = false
    }


  }
  else if ((modId == "FXREM") &&
    (window.document.frmTrans.tranmode(1).checked == true)) {
    divsDisplay("remcr", "M")
    window.document.all.divComm.style.display = "block";
    window.document.all['divfxRem'].style.display = "block";
    window.document.all['divrembank'].style.display = "none";

  }
  // suspence start
  else if (modId == "SCR") {
    divsDisplay("divaccno", "M")

    window.document.all['divcheque'].style.display = "none";
    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |^ Contra Date |>Contra Batch No       |>Contra Tran No       |>Appl's Name |>Cust Id      "
  }
  // Loan end
  else if ((modId == "LOAN") &&
    (window.document.frmTrans.tranmode(0).checked == true)) {

    divsDisplay("loandtls", "M")

    window.document.all['divaccno'].style.display = "block";
    window.document.all.loanintdtls.style.display = "block"
    window.document.frmTrans.selloantrans.style.display = "block";
    funloantran()
    funinsertloan()
    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>                  |>             |>             |>               |>               |>             |>           "
    window.document.frmTrans.Mfgpaydt.TextMatrix(0, 44) = "Loan Trans"
  }
  else if ((modId == "LOAN") &&
    (window.document.frmTrans.tranmode(1).checked == true)) {
    divsDisplay("loandtls", "M")

    window.document.all['divaccno'].style.display = "block";
    window.document.all.loanintdtls.style.display = "block"
    funloantran()
    funinsertloan()
    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Interest Amount |> Charges Amount |> Insurance Amount |>NPA Amount       |>Principalamount       |>Excessamount |>Cust ID      "
  }
  else if (modId == "DEP") {
    divsDisplay("divDepDtls", "M")
    window.document.all['divaccno'].style.display = "block";
    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Opening Amount  |> Current Amount |> Maturity Amount |>Int Accrued       |>Opening Date       |>Effective Date |>Maturity Date  |>Int. Paid Upto |>ROI     "
  }
  else if (modId == "SI" && vMode != "REC") {
    cnfrm = confirm("Do you want to Execute Standing Instructions ?")
    if (cnfrm == true) {
      SIGlcode()
    }
    else {
      window.document.frmTrans.txtModId.value = ""
      window.document.frmTrans.txtModDesc.value = ""
    }
  }
  else {
    //alert("trnsfer")
    divsDisplay("trnsfer", "M")
    window.document.frmTrans.txtpendbal.value = ""
    window.document.all['divaccno'].style.display = "block";
    window.document.all['divcheque'].style.display = "block";
    if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC")) {
      window.document.frmTrans.all.trcctod.style.display = "block"
    }
    else {
      window.document.frmTrans.all.trcctod.style.display = "none"
    }

    if (window.document.frmTrans.txtModId.value == "CC") {
      window.document.frmTrans.all.trcctod1.style.display = "block"
    }
    else {
      window.document.frmTrans.all.trcctod1.style.display = "none"
    }

  }
  ServiceIdDivs()
  //code added by Radhika on 12 May 2008
  //GetModDets()

  if ((modId == "REM") &&
    (window.document.frmTrans.tranmode(1).checked == true)) {
    //alert("1")
  }

}
//----------------------------------------------------------------------------------
function Siglid(siglcode) {
  if (siglcode != "NOGLCODE") {
    sigl = siglcode.split("|")
    window.document.frmTrans.txtGLcode.value = sigl[0]
    window.document.frmTrans.txtGLDesc.value = sigl[1]

    strparam = "SIINSTR" + "~" + window.document.frmTrans.txtbranchcode.value + "~" +
      window.document.frmTrans.txtcurrencycode.value + "~" + "T" + "~" +
      window.document.frmTrans.txtbranchdesc.value + "~" +
      window.document.frmTrans.txtcurrencydesc.value

    window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "standinginstructions.aspx?strparam=" + strparam
  }
  else {
    alert("GL Code is not available")
  }
}

//----------------------------------------------------------------------------------
function SIGlcode() {
  lockControls()
  strpm = "SIGLCODE" + "~" +
    window.document.frmTrans.txtbranchcode.value.toUpperCase() + "~" +
    window.document.frmTrans.txtModId.value.toUpperCase()

  window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  //window.status="Executing Standing Instructions......"

}
//----------------------------------------------------------------------------------
function SIRslt(bNo) {

  var batchNo = ""
  var recsFailed = ""

  var result = bNo.split("~")
  if (result[0] == "SUCESS") {
    batchNo = result[1]
    recsFailed = result[2]
    if (window.document.frmTrans.txtbranchcode.value != "" &&
      window.document.frmTrans.txtcurrencycode.value != "") {
      if (vMode == "TRANS") {
        if (window.document.frmTrans.tranmode(0).checked == true ||
          window.document.frmTrans.tranmode(1).checked == true) {
          modTrn = "('3','4')"
        }
        else if (window.document.frmTrans.tranmode(2).checked == true) {
          modTrn = "('5','6')"
        }
      }
      else if ((vMode == "PAY") || (vMode == "REC")) {
        modTrn = "('1','2')"
      }
      strpm = "BATCH" + "~*~" + window.document.frmTrans.txtbranchcode.value + "~" +
        window.document.frmTrans.txtcurrencycode.value + "~" +
        batchNo + "~" + modTrn
      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "temptranpop.aspx?st=" + strpm

      if (recsFailed == "YES") {
        window.document.frmTrans.chkDispAccNo.checked = true
        DispGrid()
        disposal("NoBatch")
        window.document.frmTrans.mfgDisp.TextMatrix(0, 37) = "SI Acc No"
        window.document.frmTrans.mfgDisp.TextMatrix(0, 38) = "Module"

      }

    }
  }
  else if (result[0] == "NORECORDS") {
    alert("No Pending Standing Instructions found to Execute")
    ModuleClear()
    UnlockControls()
  }
  else {
    alert(bNo)
  }

}
//----------------------------------------------------------------------------------
function divsDisplay(visibleDiv, MainOrAddtional) {

  if (MainOrAddtional.toUpperCase() == "M") {
    divsstring()
  }
  else if (MainOrAddtional.toUpperCase() == "A") {
    divsstringAdd()
  }
  strDivs = strDivs.split("~")
  for (i = 0; i < strDivs.length; i++) {
    if (strDivs[i] == visibleDiv) {

      window.document.all.item(strDivs[i]).style.display = "block"
    }
    else if (strDivs[i] != visibleDiv) {
      window.document.all.item(strDivs[i]).style.display = "none"
    }

  }

}
//----------------------------------------------------------------------------------
function divsstring() {
  strDivs = "trnsfer" + "~" + "divDepDtls" + "~" + "selloantrans" + "~" + "loanintdtls" + "~" +
    "divLnkMod" + "~" + "loandtls" + "~" + "remdr" + "~" + "remcr" + "~" + "divCLG" + "~" +
    "divAccCat" + "~" + "divDenom"

}
//----------------------------------------------------------------------------------
function divsstringAdd() {
  strDivs = "divTempTrans" + "~" + "divDisp" + "~" + "divFxRate"
}
//----------------------------------------------------------------------------------
function DenomDtls() {
  /*if(CashDenom=='N')
  {   window.document.frmTrans.chkDenomDtls.checked=false; 
    return; 
  }*/

  if (vMode == "REC") {
    if (window.document.frmTrans.chkDenomDtls.checked == true) {
      divsDisplay('divDenom', 'M')
      window.document.all.divTempTrans.style.display = "none"
      window.document.all.divDisp.style.display = "none"
      window.document.all.divFxRate.style.display = "none"

    }
    else if (window.document.frmTrans.txtModId.value.toUpperCase() == "REM") {
      divsDisplay('remcr', 'M')
    }
    else if (window.document.frmTrans.txtModId.value.toUpperCase() == "FXREM") {
      divsDisplay("remcr", "M")
      divsDisplay("divFxRate", "A")
      window.document.all['divfxRem'].style.display = "block";
      window.document.all['divrembank'].style.display = "none";
    }
    else if (fxTransYN == "Y") {
      divsDisplay("trnsfer", "M")
      divsDisplay("divFxRate", "A")
    }
    else {
      divsDisplay('trnsfer', 'M')
    }
  }
  if (window.document.frmTrans.txtModId.value == "LOAN") {
    if (window.document.frmTrans.tranmode(1).checked == true) {
      divsDisplay("loandtls", "M")

      window.document.all['divaccno'].style.display = "block";
      window.document.all.loanintdtls.style.display = "block";
      if (window.document.frmTrans.chkDenomDtls.checked == true) {
        window.document.all['divDenom'].style.display = "block";
      }
      else {
        window.document.all['divDenom'].style.display = "none";
      }

    }
  }


}

function ClearTranFields() {
  window.document.frmTrans.txtModId.value = "";
  window.document.frmTrans.txtModDesc.value = "";

  modulecode(window.document.frmTrans.txtModDesc.value + '-----' +
    window.document.frmTrans.txtModId.value.toUpperCase() + '-----')

  window.document.frmTrans.txtChqNo.value = ""
  window.document.frmTrans.txtChqDt.value = ""
  window.document.frmTrans.txtChqFVG.value = ""

}




function GetBranchParams(strBrCode) {
  var strpm = "";
  var strBrid

  strBrid = window.document.frmTrans.txtModId.value.toUpperCase()
  //alert("strBrCode=" + strBrCode)
  if (strBrCode.length > 0) {
    strpm = "CHQVALIDPERIODLENDY" + "~" + strBrCode + "~" + strBrid
    //alert(strpm)
    window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function GetBrChqValidPrd(strval) {
  //alert("returned chq valid period is " + strval)
  strchq = strval.split("~");

  pChqVldPrd = strchq[0]
  pChqLength = strchq[1]
  //alert("pChqLength=" + pChqVldPrd)
}

//function to get cash balance of current user 
function GetCashierBalance() {
  var strpm = "";
  strBrCode = window.document.frmTrans.txtbranchcode.value
  strCurCode = window.document.frmTrans.txtcurrencycode.value
  if ((strBrCode.length > 0) && (strCurCode.length > 0)) {
    strBrCode = "<%=session("branchcode")%>"
    strpm = "BALANCEATCASHIER" + "~" + strBrCode + "~" + strCurCode + "~" + vUserId
    // strpm="BALANCEATCASHIER"+"~"+session("branchcode")+"~"+strCurCode+"~"+vUserId 
    //alert(strpm)
    window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function ReceivedBalanceofCashier(strval) {  // alert(strval)
  //strchq=strval.split("~");
  //alert("cah bal=" + strval)
  vTotAmt = strval
  spnCashBal.innerHTML = strval

}

//function to get next scroll number OF THE CASHIER to issue 
function GetCashierScrlNo() {
  var strpm = "";
  strBrCode = window.document.frmTrans.txtbranchcode.value
  strCurCode = window.document.frmTrans.txtcurrencycode.value
  if ((strBrCode.length > 0) && (strCurCode.length > 0)) {
    strpm = "CASHIERSCROLLNO" + "~" + strBrCode + "~" + strCurCode + "~" + vUserId + "~" + vMode
    //alert(strpm)
    window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function ReceivedCashierScrlNo(strval) {
  //alert("scroll no=" + strval)
  var CashierScrollNo = eval(strval)

  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows - 1
  var Idx

  for (Idx = 1; Idx <= flxRowCnt; Idx++) {
    window.document.frmTrans.Mfgpaydt.TextMatrix(Idx, 57) = CashierScrollNo;
  }
  gridvalues()
}
var bdt = '<%=BDT%>'


//----------------------------------------------------------------------------------
//This function is used to get Cash GL code.
function CshCode(code) {


  var strVal;
  if (code == "NOGLCODE") {
    alert("No GL Code found for Cash" + "\n" + "Transactions cananot be Done")
  }
  else if (code !== "NOGLCODE") {
    strVal = code.split("~");
    vCashGlCode = strVal[0];
    vCashGldesc = strVal[1];

  }

}
//-----------------------------------------------------------------------------------
//function Receipt Limit
function RecLimit(vRLmt) {

  var RecPayAmt = vRLmt.split("~");

  if ((vMode == "REC") && (vSubMode == "")) {
    pMaxRecPayAmt = RecPayAmt[0]
  }
  else if ((vMode == "REC") && (vSubMode == "TREC")) {
    pMaxRecPayAmt = RecPayAmt[2]
  }
  else if (vSubMode == "TPAY") {
    pMaxRecPayAmt = RecPayAmt[3]
  }
  MaxLimitAmt = RecPayAmt[4]
}
//-----------------------------------------------------------------------------------
function RecPayLmtChk() {
  if (window.document.frmTrans.txtbranchcode.value.length > 0 &&
    window.document.frmTrans.txtcurrencycode.value.length > 0 &&
    window.document.frmTrans.txtModId.value.length > 0 &&
    window.document.frmTrans.txtGLcode.value.length > 0 &&
    window.document.frmTrans.txtAccNo.value.length > 0) {
    var LmtAmt = window.document.frmTrans.txtAmt.value
    if (eval(LmtAmt) > eval(pMaxRecPayAmt)) {
      pMaxRecPayAmt = gridprecision(pMaxRecPayAmt, window.document.frmTrans.hpr.value)

      alert("User is not allowed to do <%=vTitle%>" + "\n\n" +
        "Transactions above " + pMaxRecPayAmt);
      window.document.frmTrans.txtAmt.value = ""
      return
    }
    if (vMode == "REC") {
      var cshTotAmt =<%=vTotAmt%> +eval(window.document.frmTrans.txtAmt.value)
      if (eval(cshTotAmt) > eval(MaxLimitAmt)) {
        alert("Cash Limit Exceeded")

      }
    }
  }
}

//-----------------------------------------------------------------------------------  
//Checks for cheques mandatory field values
function Cheque() {

  if (window.document.frmTrans.chkCheque.checked == true) {
    //  window.document.frmTrans.txtChqDt.value=vAppDate;
    //   window.document.frmTrans.DtpChq.value=vAppDate;
    window.document.all['ChqDtl'].style.display = "block";
  }

  if (window.document.frmTrans.chkCheque.checked == false) {
    window.document.all['ChqDtl'].style.display = "none";
    chequeClear()
    window.document.frmTrans.txtChqDt.value = '<%=session("Applicationdate")%>'

    if (mode != "MODIFY") {
      excpChqSrs = ""
      excpChqNo = ""
    }

  }
}

function displayret(kstr) {
  if (kstr == "") {
    return
  }
  balstr = kstr.split("|");
  window.document.frmTrans.txtretclearbal.value = balstr[2];
  precision(window.document.frmTrans.txtretclearbal, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtretaccbal.value = balstr[0];
  precision(window.document.frmTrans.txtretaccbal, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtretpendbal.value = balstr[7];
  precision(window.document.frmTrans.txtretpendbal, window.document.frmTrans.hpr.value)

}
//----------------------------------------------------------------------------------
//This function was written to display account holder details like Current Balance,...
//coming from server page
function display(kstr) {
  //alert("hi = " +kstr )
  if (kstr == "") {
    return
  }
  balstr = kstr.split("|");

  if (window.document.frmTrans.txtModId.value.toUpperCase() == "SCR") {
  }
  else {
    window.document.frmTrans.txtClrBal.value = balstr[2];
  }

  if (balstr[11] != "0") {
    window.document.frmTrans.txtGstin.value = balstr[11];
  }
  else {
    window.document.frmTrans.txtGstin.value = ""
  }

  precision(window.document.frmTrans.txtClrBal, window.document.frmTrans.hpr.value)

  window.document.frmTrans.txtUnClrBal.value = balstr[1];
  if (eval(window.document.frmTrans.txtUnClrBal.value) > 0) {
    lblUnclrbal.href = "#"
  }
  else {
    lblUnclrbal
  }
  precision(window.document.frmTrans.txtUnClrBal, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtNetBal.value = balstr[0];
  precision(window.document.frmTrans.txtNetBal, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtCustId.value = balstr[3];
  window.document.frmTrans.txtOpaBy.value = balstr[4];
  window.document.frmTrans.txtOpInstr.value = balstr[5];
  //alert("hi1")
  if ((window.document.frmTrans.txtModId.value.toUpperCase() == "SB") || (window.document.frmTrans.txtModId.value.toUpperCase() == "CA")) {
    window.document.frmTrans.txtpendbal.value = balstr[7];
    precision(window.document.frmTrans.txtpendbal, window.document.frmTrans.hpr.value)
    window.document.frmTrans.txttotcashdr.value = parseFloat(balstr[8]).toFixed(2);  //cash dr
    window.document.frmTrans.txttotcashcr.value = parseFloat(balstr[9]).toFixed(2);  // cash cr
    window.document.frmTrans.hdnmaxamt.value = parseFloat(balstr[10]).toFixed(2);   //max amt

  }
  if ((window.document.frmTrans.txtModId.value.toUpperCase() == "PL") || (window.document.frmTrans.txtModId.value.toUpperCase() == "MISC") || (window.document.frmTrans.txtModId.value.toUpperCase() == "BILLS")) {
    window.document.frmTrans.txtpendbal.value = balstr[6];
    precision(window.document.frmTrans.txtpendbal, window.document.frmTrans.hpr.value)
  }

  if (window.document.frmTrans.txtModId.value.toUpperCase() == "CC") {
    window.document.frmTrans.txtpendbal.value = balstr[9];
    precision(window.document.frmTrans.txtpendbal, window.document.frmTrans.hpr.value)
    window.document.frmTrans.txttotcashdr.value = parseFloat(balstr[10]).toFixed(2);
    window.document.frmTrans.txttotcashcr.value = parseFloat(balstr[11]).toFixed(2);
    window.document.frmTrans.hdnmaxamt.value = parseFloat(balstr[12]).toFixed(2);//maxamt

  }
  if (window.document.frmTrans.txtModId.value.toUpperCase() == "CC") {
    //	window.document.frmTrans.txtLmtAmt.value=eval(balstr[7]) + eval(balstr[13]);
    window.document.frmTrans.txtLmtAmt.value = eval(balstr[7])
    precision(window.document.frmTrans.txtLmtAmt, window.document.frmTrans.hpr.value)
    window.document.frmTrans.txttodlimit.value = balstr[13];
    //window.document.frmTrans.txtavalimit.value=parseFloat(window.document.frmTrans.txtLmtAmt.value)+parseFloat(window.document.frmTrans.txtClrBal.value)
    window.document.frmTrans.txtavalimit.value = parseFloat(parseFloat(window.document.frmTrans.txtLmtAmt.value) + parseFloat(window.document.frmTrans.txttodlimit.value) + parseFloat(window.document.frmTrans.txtClrBal.value)).toFixed(2);
    window.document.frmTrans.txtLimitExpDt.value = balstr[14];

    if (balstr[15] == "P") {
      window.document.frmTrans.all.spannpadispmsg.innerHTML = ""
    }
    else {
      window.document.frmTrans.all.spannpadispmsg.innerHTML = "Account Is NPA";
    }

  }
  strValues = balstr[3]
  //	alert("hi1")
  window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "msgcnt.aspx?strVal=" + strValues

  {
    if (window.document.frmTrans.txtModId.value.toUpperCase() == "LOAN") {

      window.document.frmTrans.txtloanaccbal.value = balstr[0]
      //alert(window.document.frmTrans.txtloanaccbal.value)
      //alert(window.document.frmTrans.txtIntPendAmt.value)

      if (window.document.frmTrans.tranmode[1].checked == true) {
        if (isNaN(parseFloat(window.document.frmTrans.txtIntPendAmt.value)) == false) {
          window.document.frmTrans.txtloanaccbal.value = parseFloat(window.document.frmTrans.txtloanaccbal.value) - parseFloat(window.document.frmTrans.txtIntPendAmt.value)
        }
        else {
          window.document.frmTrans.txtloanaccbal.value = window.document.frmTrans.txtloanaccbal.value
          window.document.frmTrans.txtIntPendAmt.value = 0
          precision(window.document.frmTrans.txtIntPendAmt, window.document.frmTrans.hpr.value)
        }
        //MinPeriodValidation()	
      }
      precision(window.document.frmTrans.txtloanaccbal, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtloanclearbal.value = balstr[2]
      precision(window.document.frmTrans.txtloanclearbal, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtloanCustId.value = balstr[3]
      //precision(window.document.frmTrans.txtloanCustId,window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtloandisbamt.value = balstr[8]
      precision(window.document.frmTrans.txtloandisbamt, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtloanOpaBy.value = balstr[4]
      window.document.frmTrans.txtloansancamt.value = balstr[7]
      precision(window.document.frmTrans.txtloansancamt, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtloanunclear.value = balstr[1]
      if (eval(window.document.frmTrans.txtloanunclear.value) > 0) {
        lblLoanUnclrbal.href = "#"
      }
      else {
        lblLoanUnclrbal
      }
      precision(window.document.frmTrans.txtloanunclear, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtloanavailbal.value = balstr[7] - balstr[8]
      precision(window.document.frmTrans.txtloanavailbal, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtLpendbal.value = balstr[11]
      precision(window.document.frmTrans.txtLpendbal, window.document.frmTrans.hpr.value)

      if (balstr[12] == "P") {
        window.document.frmTrans.all.spannpadispmsg.innerHTML = ""
      }
      else {
        window.document.frmTrans.all.spannpadispmsg.innerHTML = "Account Is NPA";
      }

      window.document.frmTrans.txtloanintsamt.value = balstr[13]
      precision(window.document.frmTrans.txtloanintsamt, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtloanpendinst.value = balstr[14]

    }
    else if (window.document.frmTrans.txtModId.value == "DEP" &&
      window.document.frmTrans.txtServiceId != "2") {
      Deppopaccnodetails()
    }

  }

  if ((window.document.frmTrans.tranmode(0).checked == true) || (window.document.frmTrans.tranmode(2).checked == true)) {
    var st = "PPhotocust|" + window.document.frmTrans.txtCustId.value
    window.document.all['iPhotoSign'].src = '<%="http://" & session("moduledir")&"/GENSBCA/"%>' + "GetPhotoSign.aspx?st=" + st
  }
  else if (window.document.frmTrans.tranmode(1).checked == true) {
    if (window.document.frmTrans.txtModId.value.toUpperCase() == "SB" || window.document.frmTrans.txtModId.value.toUpperCase() == "CA") {
      SetDrCrLienYN()
    }
  }

}

///start of weekly limit amount 


function ValAmount() {

  var stDayimpYN, stWeekimpYN, stForm


  stWeekimpYN = "<%=impYnWek%>"
  stDayimpYN = "<%=impYnDay%>"

  if ((stWeekimpYN == "Y") && (vMode == "PAY")) {
    if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC") || (window.document.frmTrans.txtModId.value == "DEP") || (window.document.frmTrans.txtModId.value == "LOAN")) {
      var kstr = "";
      vDayCashProced = "true"

      var strAppDt = "<%=session("applicationdate")%>"
      /// module"~"glcode"~"accno"~"amount"~"branchcode"~"applicationdate"~"CashpaidYN
      strpm = "STWEKLMT" + "~" + window.document.frmTrans.txtModId.value + "~" + window.document.frmTrans.txtGLcode.value + "~" + window.document.frmTrans.txtAccNo.value + "~" + window.document.frmTrans.txtAmt.value + "~" + window.document.frmTrans.txtbranchcode.value + "~" + strAppDt + "~" + "N"

      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm

    }
  }
}

function PopWeekpay(sWeekpay) {
  var stPay, stTotweek, stWeekVal


  stTotweek = "0"

  stWeekVal = "<%=WekLmt%>"

  if (sWeekpay != "No Amount") {
    stPay = sWeekpay.split("|")

    for (aCnt = 0; aCnt <= stPay.length - 1; aCnt++) {

      stTotweek = eval(stTotweek) + eval(stPay[aCnt])

    }

    if (stTotweek > stWeekVal) {
      stTotweek = stTotweek + eval(window.document.frmTrans.txtAmt.value)

      if (eval(stTotweek) > eval(stWeekVal)) {
        if (confirm("This customer has crossed Rs." + stWeekVal + "/- cash payment for the week. Do You Want continue Y/N?") == true) {
          if (confirm("Are You Sure") == true) {
            //showdat()
          }
          else {
            window.document.frmTrans.txtAmt.value = ""
            return;
          }
        }
        else {
          window.document.frmTrans.txtAmt.value = ""
          return;
        }
      }
      else {
        //showdat()
      }
    }

    if (stTotweek <= stWeekVal) {

      stTotweek = stTotweek + eval(window.document.frmTrans.txtAmt.value)

      if (eval(stTotweek) > eval(stWeekVal)) {
        if (confirm("This customer has crossing Rs." + stWeekVal + "/- cash payment for the week. Do You Want continue Y/N?") == true) {
          if (confirm("Are You Sure") == true) {
            //showdat()	
          }
          else {
            window.document.frmTrans.txtAmt.value = ""
            return;
          }
        }
        else {
          window.document.frmTrans.txtAmt.value = ""
          return;
        }
      }
      else {
        //ChkDayLmt()
        //showdat()
      }
    }
    /*else
    {
        ChkDayLmt()
    }
    */
  }
}

/// end of weekly amount--


function RDInstalmentCheck() {
  //alert("hi 1 " + window.document.frmTrans.txtUnClrBal.value)
  //alert("hi 2 " + window.document.frmTrans.txtAmt.value)
  if (window.document.frmTrans.txtModId.value == "DEP" &&
    window.document.frmTrans.txtServiceId.value == "1" &&
    window.document.frmTrans.tranmode(1).checked == true) {

    if (eval(window.document.frmTrans.txtAmt.value) % eval(window.document.frmTrans.txtUnClrBal.value) != 0) {
      alert("Credit Amount Should Be In Multipuls Of Instalment Amount(" + window.document.frmTrans.txtUnClrBal.value + ") For RD")
      window.document.frmTrans.txtAmt.value = 0
      precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)
    }
    else {
      RDAmountCheck()
    }

  }

}

function RDAmountCheck() {
  if (window.document.frmTrans.txtModId.value == "DEP" &&
    window.document.frmTrans.txtServiceId.value == "1" &&
    window.document.frmTrans.tranmode(1).checked == true) {
    if (eval(window.document.frmTrans.txtAmt.value) > 0) {
      st = "GETRDAMOUNTCHECK|" + window.document.frmTrans.txtbranchcode.value + "|" +
        window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtModId.value + "|" +
        window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtAmt.value

      window.document.all['iGetDtls'].src = "getDtls1.aspx?st=" + st
    }
  }
}


function popGETRDAMOUNTCHECK(str) {
  //alert(str)
  var strResult10
  if (str == "GREATER") {
    strResult10 = confirm("Application Date Greater Than Maturity Date  Do you want to Continue? ")

    if (confrm == true) {
    }
    else {
      return
    }
  }
  else if (str == "NO") {
    alert("Current Amount Crossed Max Installment Amount")
    window.document.frmTrans.txtAmt.value = "0"
    return
  }
}

//-----------------------------------------------------------------------------------
//This function is used to display deposit account details like current amount,maturity
//amount
function Deppopaccnodetails() {
  //alert("dep")
  window.document.frmTrans.txtDOpAmt.value = balstr[1]
  precision(window.document.frmTrans.txtDOpAmt, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtDCurrAmt.value = balstr[0]
  precision(window.document.frmTrans.txtDCurrAmt, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtDMatAmt.value = balstr[2]
  deprendiffamt = eval(window.document.frmTrans.txtDMatAmt.value) -
    eval(window.document.frmTrans.txtDOpAmt.value)
  precision(window.document.frmTrans.txtDMatAmt, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtDCustId.value = balstr[3]
  window.document.frmTrans.txtDOpDate.value = balstr[4]
  window.document.frmTrans.txtDEffDt.value = balstr[5]
  window.document.frmTrans.txtDMatDt.value = balstr[6]
  window.document.frmTrans.txtDOpBy.value = balstr[7]
  window.document.frmTrans.txtDROI.value = balstr[8]
  window.document.frmTrans.txtDOpInstr.value = balstr[9]
  window.document.frmTrans.txtDIntAcc.value = balstr[10]
  precision(window.document.frmTrans.txtDIntAcc, window.document.frmTrans.hpr.value)
  window.document.frmTrans.txtDPaidupto.value = balstr[11]
  window.document.frmTrans.txtDpendbal.value = balstr[12]
  precision(window.document.frmTrans.txtDpendbal, window.document.frmTrans.hpr.value)

  var strValues = balstr[3]
  window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "msgcnt.aspx?strVal=" + strValues

}

//-----
// This function is used for trim the values

function trim(str) {
  if (str != null) {
    var i;
    for (i = 0; i < str.length; i++) {
      if (str.charAt(i) != " ") {
        str = str.substring(i, str.length);
        break;
      }
    }
    for (i = str.length - 1; i >= 0; i--) {
      if (str.charAt(i) != " ") {
        str = str.substring(0, i + 1);
        break;
      }
    }
    if (str.charAt(0) == " ") {
      return "";
    }
    else {
      return str;
    }
  }
}



//----------------------------------------------------------------------------------
//This function is used to check for mandatory field values. 
function checkNulls(modId, modeval, serId) {
  //for General Mandatory fields
  chkNull = "true"

  if ((window.document.frmTrans.tranmode[2].checked == true) &&
    (window.document.frmTrans.cmdcleartype.selectedIndex < 1)) {
    alert("Please Select Clearing Type")
    chkNull = "false"
    return
  }

  if ((window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") ||
    (window.document.frmTrans.txtModId.value == "") ||
    (window.document.frmTrans.txtGLcode.value == "") ||
    (eval(window.document.frmTrans.txtAmt.value == 0))) {
    chkNull = "false"

    if (window.document.frmTrans.txtbranchcode.value == "") {
      alert("Please enter Branch Code")
      window.document.frmTrans.txtbranchcode.focus()
      return
    }

    if (window.document.frmTrans.txtcurrencycode.value == "") {
      alert("Please enter Currency Code")
      window.document.frmTrans.txtcurrencycode.focus()
      return
    }

    if (window.document.frmTrans.txtModId.value == "") {
      alert("Please enter Module id Code")
      window.document.frmTrans.txtModId.focus()
      return
    }

    if (window.document.frmTrans.txtAmt.value == "") {
      alert("Please enter Amount")
      window.document.frmTrans.txtAmt.focus()
      return
    }



  }

  // for deposit opening categorycode,application name   new


  if ((window.document.frmTrans.tranmode[1].checked == true) && (serId == "2")) {
    str1 = window.document.frmTrans.txtAppName.value
    if ((window.document.frmTrans.txtAccCatCode.value == "") ||
      (trim(str1) == "")) {
      chkNull = "false"
      alert("Please enter Category code")
      window.document.frmTrans.txtAccCatCode.focus()
      return
    }
  }

  // end of new


  //for Account Number

  if ((window.document.frmTrans.tranmode[2].checked == true) || (serId == "2") || (mstTab == "NO") || (modId == "REM")) {

  }
  else {
    if (window.document.frmTrans.txtAccNo.value == "") {
      chkNull = "false"
      alert("Please enter the Accnount Number")
      window.document.frmTrans.txtAccNo.focus()
      return
    }
  }

  //for Cheques
  if (window.document.frmTrans.chkCheque.checked == true) {
    //if((window.document.frmTrans.txtChqSrs.value=="")||
    if ((window.document.frmTrans.txtChqNo.value == "") ||
      (window.document.frmTrans.txtChqDt.value == "")) {
      chkNull = "false"
      if (window.document.frmTrans.txtChqNo.value == "") {
        alert("Please enter Cheque number")
        window.document.frmTrans.txtChqNo.focus()
      }

      if (window.document.frmTrans.txtChqDt.value == "") {
        alert("Please enter Cheque Date")
        window.document.frmTrans.txtChqDt.focus()
      }
      return
    }
  }
  //----------------

  //for outward returns clearing Mandatory fields 
  if ((window.document.frmTrans.tranmode[2].checked == true) &&
    (window.document.frmTrans.txtServiceId.value == "8")) {

    if ((window.document.frmTrans.txtCLGModId.value == "") ||
      (window.document.frmTrans.txtCLGGLcode.value == "") ||
      (window.document.frmTrans.txtCLGBranch.value == "") ||
      (window.document.frmTrans.txtCLGReasoncode.value == "") ||
      (window.document.frmTrans.txtCLGBankCode.value == "")) {
      chkNull = "false"

      if (window.document.frmTrans.txtCLGModId.value == "") {
        alert("Please enter Clearing Module ID")
        window.document.frmTrans.txtCLGModId.focus()
      }

      if (window.document.frmTrans.txtCLGGLcode.value == "") {
        alert("Please enter Clearing GL Code")
        window.document.frmTrans.txtCLGGLcode.focus()
      }

      if (window.document.frmTrans.txtCLGBranch.value == "") {
        alert("Please enter Clearing Branch Code")
        window.document.frmTrans.txtCLGBranch.focus()
      }

      if (window.document.frmTrans.txtCLGReasoncode.value == "") {
        alert("Please enter Clearing Outward Return Reasond code")
        window.document.frmTrans.txtCLGReasoncode.focus()
      }

      if (window.document.frmTrans.txtCLGBankCode.value == "") {
        alert("Please enter Clearing Bank code")
        window.document.frmTrans.txtCLGBankCode.focus()
      }
      return
    }
  }


  //for Loans  
  if ((modId == "LOAN") && (modeval == "3")) {
    if (window.document.frmTrans.selloantrans.value == "Select") {
      chkNull = "false"
      alert("Mandatory fields cannot be Null")
      return
    }
  }

  //for Remittance 

  if (((modId == "REM") && (modeval == "4")) || ((modId == "REM") && (modeval == "2"))) {

    if ((window.document.frmTrans.txtissbnkcode.value == "") ||
      (window.document.frmTrans.txtissbrcode.value == "") ||
      (window.document.frmTrans.txtfavg.value == "")) {
      chkNull = "false"

      if (window.document.frmTrans.txtissbnkcode.value == "") {
        window.document.frmTrans.txtissbnkcode.focus()
        alert("Please enter Issued Bank Code")
      }

      if (window.document.frmTrans.txtissbrcode.value == "") {
        window.document.frmTrans.txtissbrcode.focus()
        alert("Please enter Issued Branch Code")
      }
      return
    }

    if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
      if ((eval(window.document.frmTrans.txtcomm.value) == 0) ||
        (window.document.frmTrans.txtcomm.value == "")) {
        var confrm = confirm("Commission not entered.  Do you want to Continue? ")
        if (confrm == false) {
          chkNull = "false"
          return
        }
      }
    } //end of Commision check

    if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
      if ((eval(window.document.frmTrans.txtSerivceChrg.value) == 0) ||
        (window.document.frmTrans.txtSerivceChrg.value == "")) {
        var confrm = confirm("Service Charge not entered.  Do you want" +
          " to Continue? ")
        if (confrm == false) {
          chkNull = "false"
          return
        }
      }
    } //end of Service Charge check	     
  }
  else if (((modId == "REM") && (modeval == "3")) || ((modId == "REM") && (modeval == "1"))) {
    if ((window.document.frmTrans.txtbybnkcode.value == "") ||
      (window.document.frmTrans.txtbybrcode.value == "") ||
      (window.document.frmTrans.txtinstrno.value == "") ||
      (window.document.frmTrans.txtinstrdt.value == "") ||
      (window.document.frmTrans.txtfavgdr.value == "")) {
      chkNull = "false"

      if (window.document.frmTrans.txtbybnkcode.value == "") {
        alert("Please enter By Bank code")
        window.document.frmTrans.txtbybnkcode.focus()
      }

      if (window.document.frmTrans.txtbybrcode.value == "") {
        alert("Please enter By Branch code")
        window.document.frmTrans.txtbybrcode.focus()
      }

      if (window.document.frmTrans.txtinstrno.value == "") {
        alert("Please enter By Instrument no:")
        window.document.frmTrans.txtinstrno.focus()
      }

      if (window.document.frmTrans.txtfavgdr.value == "") {
        alert("Please enter By Favoring")
        window.document.frmTrans.txtfavgdr.focus()
      }



      return
    }
  }
  //for Forex
  if ((fxTransYN == "Y") && (window.document.frmTrans.chkDispAccNo.checked == false) &&
    (window.document.frmTrans.chkFRateDtls == true)) {

    if ((window.document.frmTrans.txtFCurCode.value == "") ||
      (eval(window.document.frmTrans.txtFAmount.value == 0)) ||
      (eval(window.document.frmTrans.txtFRate.value == 0)) ||
      (window.document.frmTrans.txtFRateRefCode.value == "") ||
      (window.document.frmTrans.cmbFRateType.options
      [window.document.frmTrans.cmbFRateType.selectedIndex].value == "")) {
      chkNull = "false"
      alert("Mandatory fields cannot be Null")
      return
    }
  }
  if ((modId == "FXREM") && ((modeval == "4") || (modeval == "2"))) {

    if ((window.document.frmTrans.txtfavg.value == "")) {
      chkNull = "false"
      alert("Mandatory fields cannot be Null")
      return
    }
    if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
      if ((eval(window.document.frmTrans.txtcomm.value) == 0) ||
        (window.document.frmTrans.txtcomm.value == "")) {
        var confrm = confirm("Commission not entered.  Do you want to Continue? ")
        if (confrm == false) {
          chkNull = "false"
          return
        }
      }
    }//end of commission check

    if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
      if ((eval(window.document.frmTrans.txtSerivceChrg.value) == 0) ||
        (window.document.frmTrans.txtSerivceChrg.value == "")) {
        var confrm = confirm("Service Charge not entered.  Do you want" +
          " to Continue? ")
        if (confrm == false) {
          chkNull = "false"
          return
        }
      }
    }//end of Service Charge check

  }

  if ((vMode == "PAY") && (vSubMode == "")) {
    if (window.document.frmTrans.txtTokenNo.value == "") {
      chkNull = "false"
      if (window.document.frmTrans.txtTokenNo.value == "") {
        alert("Please enter TokenNo")
        window.document.frmTrans.txtTokenNo.focus()
      }
      return
    }
  }

}
//---------------------------------------------------------------------------------- dtpinstDate
//This function is used poplate different module ids and descriptions
function CLGModule() {
  document.getElementById("divPhotoSignature").style.display = 'none';
  stmod = "CLGModule";
  stbr = window.document.frmTrans.txtbranchcode.value
  kstr = stmod + "|" + stbr

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:100px")
}
//----------------------------------------------------------------------------------
//This function is used to assign different module codes to the respective textboxes
//and clears lower level fields.
function CLGModuleCode(kstr) {
  assign(kstr, window.document.frmTrans.txtCLGModDesc, window.document.frmTrans.txtCLGModId);
  ClgGLClear()
}
//---------------------------------------------------------------------------------- 
//This function is used to populate different glcodes and descriptions based on moduleid.
function CLGGlcode() {
  document.getElementById("divPhotoSignature").style.display = 'none';
  if (window.document.frmTrans.txtCLGModId.value == "") {
    alert("Select Module Id")
    return;
  }
  LnkGl = "CLGGlcode";
  brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase();
  modid = window.document.frmTrans.txtCLGModId.value.toUpperCase();
  kstr = LnkGl + "|" + brcode + "|" + modid

  if (modid != "") {
    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
      "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:120px")
  }

}
//----------------------------------------------------------------------------------
//This function is used to assign different glcodes to the respective textboxes.
//And also it clears off the lower level fields.
function CLGGlcodeid(kstr) {
  var strnew = new String()
  strnew = kstr.split("-----")
  window.document.frmTrans.txtCLGGLcode.value = strnew[1]
  window.document.frmTrans.txtCLGGLname.value = strnew[0]
  ClgAccountClear()
}

//----------------------------------------------------------------------------------
//This function is used to populate different account numbers. 
function CLGAccCode() {
  document.getElementById("divPhotoSignature").style.display = 'none'
  if (window.document.frmTrans.txtCLGModId.value == "") {
    alert("Select Module Id")
    return;
  }

  stacc = "retCLGAccno";
  brchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase();
  ModId = window.document.frmTrans.txtCLGModId.value.toUpperCase();
  GlCd = window.document.frmTrans.txtCLGGLcode.value.toUpperCase();
  crCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase();
  kstr = stacc + "|" + brchCd + "|" + ModId + "|" + GlCd + "|" + crCd
  if ((brchCd.length > 0) && (GlCd.length > 0) && (ModId.length > 0) && (crCd.length > 0)) {
    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
      "DialogWidth:460px;DialogHeight:200px;DialogLeft:340px;DialogTop:80px")
  }
}
//---------------------------------------------------------------------------------- 
//This function is used to assign account number and name to the respective textboxes and
//clears off lower level fields.
function CLGAccountId(kstr) {

  var strval;

  var strnew = new String()
  strnew = kstr.split("-----")
  window.document.frmTrans.txtCLGAccNo.value = strnew[1]
  window.document.frmTrans.txtCLGAccNm.value = strnew[0]
  window.document.frmTrans.hdnCLGcustid.value = strnew[2]
  window.document.frmTrans.hidClgRetRcpName.value = strnew[0]
  //alert(strnew[2])
  //alert(window.document.frmTrans.hdnCLGcustid.value)
  ClgRsnClear()
  cntrlOnblurret('txtCLGAccNo')
  balanceDet()

  st = "PPhotocust|" + window.document.frmTrans.hdnCLGcustid.value

  window.document.frmTrans.Photo1.src = ""
  window.document.frmTrans.Photo2.src = ""
  window.document.frmTrans.Sign1.src = ""
  window.document.frmTrans.Sign2.src = ""

  window.document.all['iPhotoSign'].src = '<%="http://" & session("moduledir")& "/GENSBCA/"%>' + "GetPhotoSign.aspx?st=" + st

}

var strSignatureCount = 1

function Setphotosig(stri) {
  var randomnumber = Math.floor(Math.random() * 10001)

  var splstr = stri.split("~")

  if (window.document.frmTrans.txtServiceId.value == 8) {
    document.getElementById("divPhotoSignature").style.display = 'block';

    if (splstr[0] == "NOP") {
      document.getElementById("divPhoto").style.display = 'block';
      document.getElementById("divPht").style.display = 'none';
    }
    else {
      splstr[0] = splstr[0] + "?state=" + randomnumber
      document.getElementById("divPhoto").style.display = 'none';
      document.getElementById("divPht").style.display = 'block';
      document.getElementById("Photo1").src = splstr[0]
      document.getElementById("Photo2").src = splstr[0]
    }

    if (splstr[1] == "NOS") {
      document.getElementById("divSign").style.display = 'block';
      document.getElementById("divSgn").style.display = 'none';
    }
    else {
      splstr[1] = splstr[1] + "?state=" + randomnumber
      document.getElementById("divSign").style.display = 'none';
      document.getElementById("divSgn").style.display = 'block';
      document.getElementById("Sign1").src = splstr[1]
      document.getElementById("Sign2").src = splstr[1]
    }
  }
  else {
    if ((window.document.frmTrans.tranmode(0).checked == true) && (window.document.frmTrans.txtModId.value == "REM")) {
      document.getElementById("divPhSign").style.display = 'block';

      if (strSignatureCount == 1) {
        if (splstr[1] == "NOS") {
          document.getElementById("divMPhoto1").style.display = 'none';
          document.getElementById("divMPhoto2").style.display = 'none';
        }
        else {
          splstr[1] = splstr[1] + "?state=" + randomnumber
          document.getElementById("divMPhoto1").style.display = 'none';
          document.getElementById("divMPhoto2").style.display = 'block';
          document.getElementById("imgPhoto1").src = splstr[1]
          document.getElementById("imgPhoto2").src = splstr[1]
        }
        strSignatureCount = 2

        var st = "PPhotocust|" + strApprCustId
        window.document.all['iPhotoSign'].src = '<%="http://" & session("moduledir")&"/GENSBCA/"%>' + "GetPhotoSign.aspx?st=" + st
      }
      else if (strSignatureCount == 2) {
        if (splstr[1] == "NOS") {
          document.getElementById("divMSign1").style.display = 'none';
          document.getElementById("divMSign2").style.display = 'none';
        }
        else {
          splstr[1] = splstr[1] + "?state=" + randomnumber
          document.getElementById("divMSign1").style.display = 'none';
          document.getElementById("divMSign2").style.display = 'block';
          document.getElementById("imgSign1").src = splstr[1]
          document.getElementById("imgSign2").src = splstr[1]
        }
        strSignatureCount = 1
      }
    }
    else {
      document.getElementById("divPhSign").style.display = 'block';
      if (splstr[0] == "NOP") {
        document.getElementById("divMPhoto1").style.display = 'block';
        document.getElementById("divMPhoto2").style.display = 'none';
      }
      else {
        splstr[0] = splstr[0] + "?state=" + randomnumber
        document.getElementById("divMPhoto1").style.display = 'none';
        document.getElementById("divMPhoto2").style.display = 'block';
        document.getElementById("imgPhoto1").src = splstr[0]
        document.getElementById("imgPhoto2").src = splstr[0]
      }

      if (splstr[1] == "NOS") {
        document.getElementById("divMSign1").style.display = 'block';
        document.getElementById("divMSign2").style.display = 'none';
      }
      else {
        splstr[1] = splstr[1] + "?state=" + randomnumber
        document.getElementById("divMSign1").style.display = 'none';
        document.getElementById("divMSign2").style.display = 'block';
        document.getElementById("imgSign1").src = splstr[1]
        document.getElementById("imgSign2").src = splstr[1]
      }
    }
  }

  if (window.document.frmTrans.txtModId.value.toUpperCase() == "SB" || window.document.frmTrans.txtModId.value.toUpperCase() == "CA") {
    SetDrCrLienYN()
  }
  else if (window.document.frmTrans.txtModId.value.toUpperCase() == "DEP" || window.document.frmTrans.txtModId.value.toUpperCase() == "CC" || window.document.frmTrans.txtModId.value.toUpperCase() == "LOAN" || window.document.frmTrans.txtModId.value.toUpperCase() == "LOCKER") {
    Check206AA206AB()
  }

}

//----------------------------------------------------------------------------------
// function is used to populate different bank codes.
function CLGBankCodeId() {
  if (window.document.frmTrans.txtCLGAccNo.value == "") {
    alert("Select Accno")
    return
  }
  var stacc, kstr
  stacc = "CLGBank";

  if (clgAbbimpyn == "Y") {
    kstr = stacc + "|" + "<%=session("branchcode")%>"
  }
  else {
    kstr = stacc + "|" + window.document.frmTrans.txtbranchcode.value.toUpperCase()
  }

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:80px")

}

//----------------------------------------------------------------------------------
//function is used to assign bank code to the vextbox. 
function CLGBankCode(kstr) {

  var strnew = new String()
  strnew = kstr.split("-----")
  window.document.frmTrans.txtCLGBankCode.value = strnew[1]
  ClgPBranchClear()

}
//----------------------------------------------------------------------------------
//this function is used for populating CLgBankBranches

function CLGBranchCodeId() {
  if (window.document.frmTrans.txtCLGBankCode.value == "") {
    alert("Select Bank Code")
    return
  }
  var stacc, kstr
  stacc = "CLGBranch";
  sBnk = window.document.frmTrans.txtCLGBankCode.value

  if (clgAbbimpyn == "Y") {
    kstr = stacc + "|" + sBnk + "|" + "<%=session("branchcode")%>"
  }
  else {
    kstr = stacc + "|" + sBnk + "|" + window.document.frmTrans.txtbranchcode.value.toUpperCase()
  }

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:80px")

}
//----------------------------------------------------------------------------------
//This function is used to assign branchcode to the textbox.
function CLGBranchCode(kstr) {
  var strnew = new String()
  strnew = kstr.split("-----")
  window.document.frmTrans.txtCLGBranch.value = strnew[1]
}
//----------------------------------------------------------------------------------
//function is used for reason codes population.
function CLGReasonCodeId() {

  var stacc, kstr
  stacc = "CLGReason";
  kstr = stacc + "|"

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:80px")
  ClgPBankClear()
}
//---------------------------------------------------------------------------------- 
//function is used to assign reason code and description to the text boxes. 
function CLGReasonCode(kstr) {
  var strnew = new String()
  strnew = kstr.split("-----")
  window.document.frmTrans.txtCLGReasoncode.value = strnew[0]
  window.document.frmTrans.txtCLGReason.value = strnew[1]

}


function cmdcleartype_OnChange() {
  var stralert

  //if(window.document.frmTrans.tranmode[2].checked==true){
  //deleting the rows if previous trnsactions are there which is other than inward clg
  if ((window.document.frmTrans.Mfgpaydt.Rows > 1)) //&&(mode!="MODIFY")
  {
    alert("First Post Transactions of Previous Selected Clearing Type")
    window.document.frmTrans.cmdcleartype.value =
      window.document.frmTrans.Mfgpaydt.TextMatrix(1, 28)

    return;
  }
  else {
    ModuleClear()
    //added by vinod on 28-mar-2014
    window.document.frmTrans.txtPayeeBank.value = "";
    window.document.frmTrans.txtPayBnkDesc.value = "";
    window.document.frmTrans.txtPayeeBranch.value = "";
    window.document.frmTrans.txtPayBrDesc.value = "";
    window.document.frmTrans.txtMICRCode.value = "";
  }
}

//----------------------------------------------------------------------------------
//function for displaying the parameter moduleid,glcode,accno for outward return
function paramAcc() {
  if (eval(window.document.frmTrans.txtServiceId.value == "8")) {
    window.document.frmTrans.cmdModId.disabled = true
    window.document.frmTrans.cmdGLCode.disabled = true
    window.document.frmTrans.cmdAccno.disabled = true
    if (clgAbbimpyn == "Y") {
      strpm = "CLGParam" + "~" + "<%=session("branchcode")%>" + "~" + window.document.frmTrans.txtcurrencycode.value
    }
    else {
      strpm = "CLGParam" + "~" + window.document.frmTrans.txtbranchcode.value + "~" + window.document.frmTrans.txtcurrencycode.value
    }
    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}
//----------------------------------------------------------------------------------
//function for diplaying parameter moduleid,glcode,accno whicg is returned by
///flypage

function CLGParam(ClearParam) {
  if (ClearParam != "") {
    var StrArrMain = new String()
    StrArrMain = ClearParam.split("*")
    window.document.frmTrans.txtModId.value = StrArrMain[0]
    window.document.frmTrans.txtGLcode.value = StrArrMain[1]
    window.document.frmTrans.txtAccNo.value = StrArrMain[2]
    window.document.frmTrans.txtAccNm.value = StrArrMain[3]
    window.document.frmTrans.txtModDesc.value = StrArrMain[4]
    window.document.frmTrans.txtGLDesc.value = StrArrMain[5]
  }
}
//----------------------------------------------------------------------------------
//This function is used to populate different clearing types in the combo box.
function CLGTypes(ClearType) {

  var StrArrMain = new String()
  var StrArrFld = new String()
  var StrArrFlds = new String()
  ///clearing the combo box

  window.document.frmTrans.cmdcleartype.length = 0
  StrArrMain = ClearType.split("~")
  StrArrFld = StrArrMain[0].split("|")

  ///adding "Select" as by default option in combo box
  var option0 = new Option("--Select--", "Select")
  eval("window.document.frmTrans.cmdcleartype.options[0]=option0")
  for (j = 0; j <= StrArrMain[1]; j++) {
    StrArrFlds = StrArrFld[j].split("*")
    //adding to clearing type combo box
    var option0 = new Option(StrArrFlds[1], StrArrFlds[0])
    eval("window.document.frmTrans.cmdcleartype.options[j+1]=option0")
  }

}

//----------------------------------------------------------------------------------	

//----------------------------------------------------------------------------------	

//----------------------------------------------------------------------------------
//function for displaying the clgreturn moduleid,glciode etc div tag
function CLGClearDiv() {
  window.document.all.loanintdtls.style.display = "none"
  window.document.all['divaccno'].style.display = "block";
  //window.document.all['divcat'].style.display="none";
  window.document.all['trnsfer'].style.display = "none";
  window.document.frmTrans.selloantrans.style.display = "none";
  window.document.all['loandtls'].style.display = "none";
  window.document.all['remdr'].style.display = "none";
  window.document.all['remcr'].style.display = "none";
  window.document.all['divcheque'].style.display = "block";
  window.document.all.divDepDtls.style.display = "none"
  window.document.all.divLnkMod.style.display = "none"
  window.document.all.divCLG.style.display = "block"
}
//----------------------------------------------------------------------------------
//checks whether the given cheque is valid one or not.i.e, cheque series, cheque number,
//cheque date,cheque favouring.

function CLGChqValid(Clearcheque) {
  var StrArrMain = new String()
  var cnfrm
  StrArrMain = Clearcheque.split("~")
  if (StrArrMain[0] == "NOTVALID") {
    //if(StrArrMain[1]=="txtChqSrs"){
    //cnfrm=confirm("Not a Valid Series"+"\n"+"Do you want to Continue ?")
    if (cnfrm == false) {
      //window.document.frmTrans.txtChqSrs.value=""
      //window.document.frmTrans.txtChqSrs.focus()
      return
    }
    //}
    if (StrArrMain[1] == "txtChqNo") {

      alert("Not a Valid Cheque No.")
      window.document.frmTrans.txtChqNo.value = ""
      window.document.frmTrans.txtChqNo.focus()
    }

    if (StrArrMain[1] == "txtChqDt") {
      alert("Cheque has been Expired")
      window.document.frmTrans.txtChqDt.value = ""
      //window.document.frmTrans.txtChqDt.focus()
      return
    }
  }

}

// account details
function AccDetails() {
  var strData

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Enter Branch Code")
    return
  }

  if (window.document.frmTrans.txtModId.value == "") {
    alert("Enter ModId Code")
    return
  }

  if (window.document.frmTrans.txtGLcode.value == "") {
    alert("Enter GLcode Code")
    return
  }
  if (window.document.frmTrans.txtAccNo.value == "") {
    alert("Enter AccNo Code")
    return
  }

  //Prepare A/C details data

  strData = window.document.frmTrans.txtbranchcode.value + "|" + window.document.frmTrans.txtbranchdesc.value + "|" +
    window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtcurrencydesc.value + "|" +
    window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtGLDesc.value + "|" + window.document.frmTrans.txtModId.value + "|" + "" + "|" +
    window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtAccNm.value

  window.open('<%="http://" & session("moduledir")& "/GenSBCA/"%>' + "accountdetails.aspx?strData=" + strData, "SB", "width=750%,height=600%,top=0,left=0,scrollbars=yes")

} //end of AccDetails() method

// account details
function AccDetails1() {
  var strData

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Enter Branch Code")
    return
  }

  if (window.document.frmTrans.txtCLGModId.value == "") {
    alert("Enter ModId Code")
    return
  }

  if (window.document.frmTrans.txtCLGGLcode.value == "") {
    alert("Enter GLcode Code")
    return
  }
  if (window.document.frmTrans.txtCLGAccNo.value == "") {
    alert("Enter AccNo Code")
    return
  }

  //Prepare A/C details data

  strData = window.document.frmTrans.txtbranchcode.value + "|" + window.document.frmTrans.txtbranchdesc.value + "|" +
    window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtcurrencydesc.value + "|" +
    window.document.frmTrans.txtCLGGLcode.value + "|" + window.document.frmTrans.txtCLGGLname.value + "|" + window.document.frmTrans.txtCLGModId.value + "|" + "" + "|" +
    window.document.frmTrans.txtCLGAccNo.value + "|" + window.document.frmTrans.txtCLGAccNm.value

  window.open('<%="http://" & session("moduledir")& "/GenSBCA/"%>' + "accountdetails.aspx?strData=" + strData, "SB", "width=750%,height=600%,top=0,left=0,scrollbars=yes")

} //end of AccDetails1() method
var blnNpaInt = false
var npaIntYN = "N"
function closeLoanAuto() {
  var brcodeclln
  brcodeclln
  if (window.document.frmTrans.chkABB.checked == false) {
    brcodeclln = window.document.frmTrans.txtbranchcode.value
  }
  else {
    brcodeclln = "ABB"
  }
  var sBatch = ""
  if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
    sBatch = window.document.frmTrans.Mfgpaydt.textmatrix(1, 0)
  }

  st = "POSTINTEREST|" + brcodeclln + "|" +
    window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtModId.value + "|" +
    window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value + "|" +
    window.document.frmTrans.txtAmt.value + "|" + vMode + "|" + npaIntYN + "|" + sBatch

  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
  return;
}

var popbatchNo
popbatchNo = ""
function populateInterest(str) {
  //alert(str)
  for (waitloop = 0; waitloop < 100000; waitloop++) {
    //alert("hi")
  }
  var strLoanBatchNonew
  //blnBatchLoanClose=true
  //strLoanBatchNonew = str.split('|') 

  var strArr = str.split("|")
  var strAppDt = "<%=session("applicationdate")%>".split("-")
  var intRows, intRowCnt
  var poptranNo, modId, modDesc, glcode, gldesc, accno, name, amount, customerid, modeoftran, stLaDat
  intRowCnt = 2
  if (npaIntYN == "Y") {
    //alert("hi")
    intRowCnt = 2
  }

  stLaDat = ""

  stLaDat = window.document.frmTrans.hdnLstcaldate.value

  strAppDt[1] = strAppDt[1].toUpperCase()

  if (strAppDt[1] == "JAN")
    strAppDt[1] = "01"
  else if (strAppDt[1] == "FEB")
    strAppDt[1] = "02"
  else if (strAppDt[1] == "MAR")
    strAppDt[1] = "03"
  else if (strAppDt[1] == "APR")
    strAppDt[1] = "04"
  else if (strAppDt[1] == "MAY")
    strAppDt[1] = "05"
  else if (strAppDt[1] == "JUN")
    strAppDt[1] = "06"
  else if (strAppDt[1] == "JUL")
    strAppDt[1] = "07"
  else if (strAppDt[1] == "AUG")
    strAppDt[1] = "08"
  else if (strAppDt[1] == "SEP")
    strAppDt[1] = "09"
  else if (strAppDt[1] == "OCT")
    strAppDt[1] = "10"
  else if (strAppDt[1] == "NOV")
    strAppDt[1] = "11"
  else if (strAppDt[1] == "DEC")
    strAppDt[1] = "12"

  for (waitloop = 0; waitloop < 50000; waitloop++) {
    //alert("hi")
  }

  if (((window.document.frmTrans.txtIntPendAmt.value == "") || eval(window.document.frmTrans.txtIntPendAmt.value == 0)) && ((window.document.frmTrans.txtNPAIntAmt.value == "") || eval(window.document.frmTrans.txtNPAIntAmt.value == 0))) {
    //alert("NPA Int Amount Zero/ Int Pend Amt")

  }
  else {

    for (iCnt = 0; iCnt < 2; iCnt++) {
      strnparemarks = ""
      intRows = window.document.frmTrans.Mfgpaydt.rows
      if (iCnt == 0) {
        popbatchNo = strArr[6]
        poptranNo = strArr[7]
        modId = window.document.frmTrans.txtModId.value
        modDesc = window.document.frmTrans.txtModDesc.value
        glcode = window.document.frmTrans.txtGLcode.value
        gldesc = window.document.frmTrans.txtGLDesc.value
        accno = window.document.frmTrans.txtAccNo.value
        name = window.document.frmTrans.txtAccNm.value

        if (parseFloat(window.document.frmTrans.txtAmt.value) <= parseFloat(window.document.frmTrans.txtNPAIntAmt.value)) {
          window.document.frames['iPost'].frmPost.hdnpstNpalstintcalcdt.value = ""
          strnparemarks = "NPA Int Adjusted"
        }
        else {
          window.document.frames['iPost'].frmPost.hdnpstNpalstintcalcdt.value = accno + "~" + glcode + "~" + window.document.frmTrans.txtbranchcode.value
          strnparemarks = "Interest Calculation Upto " + strAppDt[0] + strAppDt[1] + strAppDt[2]
        }


        if (parseFloat(window.document.frmTrans.txtAmt.value) <= parseFloat(window.document.frmTrans.txtNPAIntAmt.value))
          amount = "-" + window.document.frmTrans.txtAmt.value
        else
          amount = "-" + (parseFloat(window.document.frmTrans.txtIntPendAmt.value) + parseFloat(window.document.frmTrans.txtNPAIntAmt.value))
        customerid = ""
        modeoftran = "3"
        modeoftranDESC = "Dr Transfer"
        window.document.frmTrans.hidGSTval.value = window.document.frmTrans.txtGstin.value;
        window.document.frmTrans.hidCust.value = window.document.frmTrans.txtCustId.value;
        //window.document.frmTrans.hdnCloseLoan.value=accno+"|"+glcode+"|"+window.document.frmTrans.txtbranchcode.value
        if (blnBatchLoanClose == true) {
          window.document.frames['iPost'].frmPost.hdnCloseLoan.value = accno + "|" + glcode + "|" + window.document.frmTrans.txtbranchcode.value
        }
        else {
          window.document.frames['iPost'].frmPost.hdnCloseLoan.value = ""
        }

        if (npaIntYN == "Y") {
          var type = ""
          if (parseFloat(window.document.frmTrans.txtAmt.value) > (parseFloat(window.document.frmTrans.txtIntPendAmt.value) + parseFloat(window.document.frmTrans.txtNPAIntAmt.value)))
            type = "1"
          else if (parseFloat(window.document.frmTrans.txtAmt.value) <= parseFloat(window.document.frmTrans.txtNPAIntAmt.value))
            type = "2"
          else if (parseFloat(window.document.frmTrans.txtAmt.value) < (parseFloat(window.document.frmTrans.txtIntPendAmt.value) + parseFloat(window.document.frmTrans.txtNPAIntAmt.value)))
            type = "3"

          window.document.frames['iPost'].frmPost.hdnLoanNpaInt.value = npaIntYN + "~" + type + "~" + window.document.frmTrans.txtAmt.value + "~" + window.document.frmTrans.txtIntPendAmt.value + "~" + window.document.frmTrans.txtNPAIntAmt.value + "~" + accno + "~" + glcode + "~" + window.document.frmTrans.txtbranchcode.value

        }
        else {
          window.document.frames['iPost'].frmPost.hdnLoanNpaInt.value = ""
        }
      }
      else if (iCnt == 1) {
        popbatchNo = strArr[6]
        poptranNo = strArr[8]
        modId = strArr[0]
        modDesc = strArr[7]
        glcode = strArr[1]
        gldesc = strArr[2]
        accno = strArr[3]
        name = strArr[4]


        if (parseFloat(window.document.frmTrans.txtAmt.value) <= parseFloat(window.document.frmTrans.txtNPAIntAmt.value)) {
          amount = window.document.frmTrans.txtAmt.value
          strnparemarks = "NPA Int Adjusted"
        }
        else {
          amount = (parseFloat(window.document.frmTrans.txtIntPendAmt.value) + parseFloat(window.document.frmTrans.txtNPAIntAmt.value))
          strnparemarks = "Interest Calculation Upto " + strAppDt[0] + strAppDt[1] + strAppDt[2]
        }
        customerid = ""
        modeoftran = "4"
        modeoftranDESC = "Dr Transfer"
      }
      //alert("hi2")
      window.document.frmTrans.Mfgpaydt.rows = window.document.frmTrans.Mfgpaydt.rows + 1

      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 0) = popbatchNo
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 1) = poptranNo
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 2) = glcode
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 3) = gldesc
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 4) = accno
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 5) = name
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 6) = amount

      window.document.frmTrans.Mfgpaydt.Row = intRows
      window.document.frmTrans.Mfgpaydt.Col = 6

      if (iCnt == 0)
        window.document.frmTrans.Mfgpaydt.CellForeColor = 255
      else if (iCnt == 1)
        window.document.frmTrans.Mfgpaydt.CellForeColor = 16711680

      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 7) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 8) = "<%=session("applicationdate")%>"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 9) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 10) = modeoftran
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 11) = modeoftranDESC
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 12) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 13) = "P"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 14) = window.document.frmTrans.txtcurrencycode.value
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 15) = "<%=session("userid")%>"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 16) = "<%=session("machineid")%>"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 17) = modId
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 18) = window.document.frmTrans.txtbranchcode.value
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 19) = ""
      //window.document.frmTrans.Mfgpaydt.textmatrix(intRows,20)="Interest Calculation Upto "+strAppDt[0]+strAppDt[1]+strAppDt[2]
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 20) = strnparemarks
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 21) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 22) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 23) = "<%=session("applicationdate")%>"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 24) = "IC"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 25) = "N"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 26) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 27) = "<%=session("applicationdate")%>"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 28) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 29) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 30) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 31) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 32) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 33) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 34) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 35) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 36) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 37) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 38) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 39) = "1"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 40) = "TRANSACTION"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 41) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 42) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 43) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 44) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 45) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 46) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 47) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 48) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 49) = "N"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 50) = "N"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 51) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 52) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 53) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 54) = "N"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 55) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 56) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 57) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 58) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 59) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 60) = "0.00"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 61) = "0.00"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 62) = "0.00"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 67) = "0.00"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 68) = "0.00"
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 69) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 70) = stLaDat
      //window.document.frmTrans.Mfgpaydt.textmatrix(intRows,70)=""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 71) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 72) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 73) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 74) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 75) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 76) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 77) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 78) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 79) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 80) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 81) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 82) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 83) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 84) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 85) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 86) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 87) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 88) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 89) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 90) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 91) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 92) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 93) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 94) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 95) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 96) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 97) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 98) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 99) = ""
      window.document.frmTrans.Mfgpaydt.textmatrix(intRows, 100) = "N"
      if (window.document.frmTrans.chkABB.checked == false) {
        window.document.frmTrans.Mfgpaydt.TextMatrix(intRows, 8) = strsessionflds[1]; //Application Date
        window.document.frmTrans.Mfgpaydt.TextMatrix(intRows, 100) = "N"  //ABB Transaction Y/N = No		    
      }
      else {
        window.document.frmTrans.Mfgpaydt.TextMatrix(intRows, 100) = "Y"   //to identify that current Transaction is a ABB Transaction
        window.document.frmTrans.Mfgpaydt.TextMatrix(intRows, 45) = vBranchCode
        window.document.frmTrans.Mfgpaydt.TextMatrix(intRows, 46) = window.document.frmTrans.txtbranchdesc.value;
        window.document.frmTrans.Mfgpaydt.TextMatrix(intRows, 8) = abbApplDt;
        window.document.frmTrans.Mfgpaydt.TextMatrix(intRows, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt

      }
      sumDrCr(intRows, "ADD")
      alert("Once Posted Cannot Be Deleted")
      for (waitloop = 0; waitloop < 50000; waitloop++) {
        //alert("hi")
      }
      flexRowInsert(intRows, "N")
      // wait for certain period of time 
      for (waitloop = 0; waitloop < 50000; waitloop++) {
        //alert("hi")
      }
    }
  }    //(((window.document.frmTrans.txtIntPendAmt.value=="")||eval(window.document.frmTrans.txtIntPendAmt.value==0))&&((window.document.frmTrans.txtNPAIntAmt.value=="")||eval(window.document.frmTrans.txtIntPendAmt.value==0)))

  //// start  dattu code	
  //	alert("hi3")
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1
  strLoanBatchNo = strArr[6] + "~" + strArr[9] + "~" + strArr[10] + "~"
  Populate(strLoanBatchNo, flxRowCnt)

  var BatchNoAuto = strLoanBatchNo.split('~')
  with (window.document.frmTrans.Mfgpaydt) {
    TranMode()
    if (window.document.frmTrans.chkDispAccNo.checked == true) {
      TextMatrix(flxRowCnt, 25) = "Q"
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 37)//Rate Type
      TextMatrix(flxRowCnt, 29) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 40)//Rate
      TextMatrix(flxRowCnt, 30) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 42)//F Currrency Code
      TextMatrix(flxRowCnt, 31) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 43)//F Amount
      TextMatrix(flxRowCnt, 32) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 19)//lnkmoduleid
      TextMatrix(flxRowCnt, 33) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 20)//lnkmoduledesc
      TextMatrix(flxRowCnt, 34) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 21)//lnkglcode
      TextMatrix(flxRowCnt, 35) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 22)//lnkgldesc
      TextMatrix(flxRowCnt, 36) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 23)//lnkacctype
      TextMatrix(flxRowCnt, 37) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 24)//lnkaccno
      TextMatrix(flxRowCnt, 38) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)//lnkaccname  

      TextMatrix(flxRowCnt, 43) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 50)//Responding Section Code
      TextMatrix(flxRowCnt, 47) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 8)
      TextMatrix(flxRowCnt, 48) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 9)
      TextMatrix(flxRowCnt, 49) = "Y"
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 49)//Responding Bank Code
      TextMatrix(flxRowCnt, 58) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 38)//Rate Ref Code


      //TextMatrix(flxRowCnt,60)=window.document.frmTrans.mfgDisp.TextMatrix(Rselect,4)   
      TextMatrix(flxRowCnt, 80) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 4)
      TextMatrix(flxRowCnt, 81) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 10)
      TextMatrix(flxRowCnt, 82) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)
      TextMatrix(flxRowCnt, 83) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 27)
      TextMatrix(flxRowCnt, 84) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 28)
      TextMatrix(flxRowCnt, 85) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 29)

      TextMatrix(flxRowCnt, 86) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 35)
      TextMatrix(flxRowCnt, 87) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 36)

      TextMatrix(flxRowCnt, 88) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 39)//Ref No.
      TextMatrix(flxRowCnt, 89) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 41)//Ref Date
      TextMatrix(flxRowCnt, 90) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 44)//Corresponding Bank Code
      TextMatrix(flxRowCnt, 91) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 45)//Corresponding Branch Code
      TextMatrix(flxRowCnt, 92) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 46)//NOSTRO Debit Date
      TextMatrix(flxRowCnt, 93) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 47)//NOSTRO Credit Date
      TextMatrix(flxRowCnt, 94) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 48)//Charge Type

      TextMatrix(flxRowCnt, 95) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 51)//User Id.
      TextMatrix(flxRowCnt, 96) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 52)//Machine Id.
      TextMatrix(flxRowCnt, 97) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 55)//Approved By
      TextMatrix(flxRowCnt, 98) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 56)//Approved M/C                    
    }
    if (TextMatrix(flxRowCnt, 39) == "2") {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtAppName.value
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtAccCatCode.value
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtAccCatDesc.value
    }

    if (vSubMode == "TPAY") {
      TextMatrix(flxRowCnt, 79) = "TPAY"
    }
    //-------------------------------------------Remittance   
    else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "1") || (TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5"))) {
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtbybnkcode.value;
      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtbybnkdesc.value;
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtbybrcode.value;
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtbybrdesc.value;
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavgdr.value;
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtinstrno.value;

      TextMatrix(0, 64) = "Advice Rec"
      if (remtype != "ADD") {
        TextMatrix(flxRowCnt, 64) = natadv
        natadv = ""
        TextMatrix(flxRowCnt, 68) = remtype
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "Y"
        remtype = ""
        if (natinsdt != "") {
          TextMatrix(flxRowCnt, 67) = natinsdt
        }
        else {
          natinsdt = window.document.frmTrans.txtinstrdt.value;
        }
        TextMatrix(flxRowCnt, 67) = natinsdt
        natinsdt = ""
      }
      else {
        TextMatrix(flxRowCnt, 64) = remadv[0]
        TextMatrix(flxRowCnt, 65) = remadv[1]

        //TextMatrix(flxRowCnt,66)=remadv[2]
        TextMatrix(flxRowCnt, 66) = remadvdate
        TextMatrix(flxRowCnt, 68) = remtype
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "N"
        remtype = ""
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "N"
        if (advinstrdate != "") {

          TextMatrix(flxRowCnt, 67) = advinstrdate
        }
        else {
          advinstrdate = window.document.frmTrans.txtinstrdt.value;
        }
        TextMatrix(flxRowCnt, 67) = advinstrdate
        advinstrdate = ""
      }
    }

    //----------	
    //alert("YYY")
    else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "2") || (TextMatrix(flxRowCnt, 10) == "4"))) {
      //alert("1")
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
      window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtissbnkcode.value;
      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtissbnkdesc.value;

      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtissbrcode.value;
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtissbrdesc.value;
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavg.value;
      TextMatrix(flxRowCnt, 24) = window.document.frmTrans.txtfavg.value;
      //---63nr
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
      TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtcusn.value;


      //new code is 
      if ((eval(window.document.frmTrans.txtcomm.value) > 0) &&
        (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + "," + BatchNoAuto[3]
        TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value +
          "," + window.document.frmTrans.txtSerivceChrg.value
      }
      else if (eval(window.document.frmTrans.txtcomm.value) > 0) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + ",0"
        TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value + ",0"
      }
      else if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
        TextMatrix(flxRowCnt, 67) = "0," + BatchNoAuto[2]
        TextMatrix(flxRowCnt, 64) = "0," + window.document.frmTrans.txtSerivceChrg.value
      }
      TextMatrix(flxRowCnt, 68) = remtype
      remtype = ""

      TextMatrix(flxRowCnt, 69) = window.document.frmTrans.txtPanNo.value;
      TextMatrix(flxRowCnt, 70) = window.document.frmTrans.txtMobile.value;
      TextMatrix(flxRowCnt, 71) = window.document.frmTrans.txtAddress1.value;
      TextMatrix(flxRowCnt, 72) = window.document.frmTrans.txtAddress2.value;
      TextMatrix(flxRowCnt, 73) = window.document.frmTrans.txtAddress3.value;

    }
    //-------------------------------------------Deposits

    else if (TextMatrix(flxRowCnt, 17) == "DEP" &&
      window.document.frmTrans.txtServiceId.value != "2") {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtDOpAmt.value
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtDCurrAmt.value
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtDMatAmt.value
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtDIntAcc.value
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtDOpDate.value
      TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtDEffDt.value
      TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtDMatDt.value
      TextMatrix(flxRowCnt, 67) = window.document.frmTrans.txtDPaidupto.value
      TextMatrix(flxRowCnt, 68) = window.document.frmTrans.txtDROI.value

      if (flxRowCnt == 1 && window.document.frmTrans.txtServiceId.value != "2") {
        TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value
        TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value
        TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value
        TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value
        TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value
        TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value
        TextMatrix(flxRowCnt, 25) = "Y"
        TextMatrix(flxRowCnt, 26) = "Deposits"
      }

      if (window.document.frmTrans.Mfgpaydt.Rows > 1 && (servicecond == "RENEWAL" || servicecond == "CLOSING")) {

        TextMatrix(flxRowCnt, 32) = TextMatrix(1, 32)
        TextMatrix(flxRowCnt, 33) = TextMatrix(1, 33)
        TextMatrix(flxRowCnt, 34) = TextMatrix(1, 34)
        TextMatrix(flxRowCnt, 35) = TextMatrix(1, 35)
        TextMatrix(flxRowCnt, 37) = TextMatrix(1, 37)
        TextMatrix(flxRowCnt, 38) = TextMatrix(1, 38)
        TextMatrix(flxRowCnt, 25) = "Y"
        TextMatrix(flxRowCnt, 26) = "Deposits"
      }
    }
    //-------------------------------------------Suspense and Sundry 

    else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "3") ||
      (TextMatrix(flxRowCnt, 10) == "1"))) {
      var hidamt = window.document.frmTrans.hidscr.value
      var amt = window.document.frmTrans.txtAmt.value
      var diffamt = eval(hidamt) - eval(amt)
      TextMatrix(flxRowCnt, 79) = scrstr
      if (window.document.frmTrans.hidtrnno.value) {
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
        if (eval(diffamt) > 0) {
          TextMatrix(flxRowCnt, 71) = "P"
        }
        else {
          TextMatrix(flxRowCnt, 71) = "F"
        }

      }
      else {
        TextMatrix(flxRowCnt, 60) = ""
        TextMatrix(flxRowCnt, 61) = ""
        TextMatrix(flxRowCnt, 62) = ""
        TextMatrix(flxRowCnt, 71) = ""

      }
    }
    else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      var hidamt = window.document.frmTrans.hidscr.value
      var amt = window.document.frmTrans.txtAmt.value
      var diffamt = eval(hidamt) - eval(amt)
      TextMatrix(flxRowCnt, 79) = scrstr

      if (window.document.frmTrans.hidtrnno.value) {
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
        if (eval(diffamt) > 0) {
          TextMatrix(flxRowCnt, 71) = "P"
        }
        else {
          TextMatrix(flxRowCnt, 71) = "F"
        }
      }
      else {
        TextMatrix(flxRowCnt, 60) = ""
        TextMatrix(flxRowCnt, 61) = ""
        TextMatrix(flxRowCnt, 62) = ""
        TextMatrix(flxRowCnt, 71) = ""
      }
    }

    //-------------------------------------------Loans

    else if ((TextMatrix(flxRowCnt, 17) == "LOAN") &&
      ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      TextMatrix(flxRowCnt, 60) = window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value
      TextMatrix(flxRowCnt, 61) = window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value
      TextMatrix(flxRowCnt, 62) = window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value
      TextMatrix(flxRowCnt, 63) = window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value
      //window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value=""
      TextMatrix(flxRowCnt, 64) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value
      TextMatrix(flxRowCnt, 65) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value
    }
    else if ((TextMatrix(flxRowCnt, 17) == "LOAN") && ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "1"))) {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text

    }

    //-------------------------------------------Clearing

    // for inward clearing add clearingtype to CLG Rate Type column in grid

    else if (window.document.frmTrans.tranmode[2].checked == true) {
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.cmdcleartype.options
        (window.document.frmTrans.cmdcleartype.selectedIndex).text

      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {

        TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
        TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
        TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
        TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
        TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
        TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtCLGBankCode.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtCLGBranch.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtCLGReason.value
        TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtCLGReasoncode.value
        TextMatrix(flxRowCnt, 79) = "CLGOWRETURN"

      }
      TextMatrix(flxRowCnt, 92) = window.document.frmTrans.txtPayeeBank.value
      TextMatrix(flxRowCnt, 93) = window.document.frmTrans.txtPayeeBranch.value
    }

    else if ((TextMatrix(flxRowCnt, 17) == "FXREM") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
      window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 60) = "O"
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtfavg.value;
      //TextMatrix(flxRowCnt,62)=window.document.frmTrans.txtcomm.value; 
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtcusn.value;

      if (eval(window.document.frmTrans.txtcomm.value) > 0) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2]
      }
      TextMatrix(flxRowCnt, 65) = remtype
      remtype = ""

    }

    else {

    }

    PrecDrCr()

    if (window.document.frmTrans.txtModId.value != "DEP") {
      Depdivclear()
    }

    //------------------   

    if ((TextMatrix(flxRowCnt, 17) == "REM") || (TextMatrix(flxRowCnt, 17) == "FXREM")) {

      if (TextMatrix(flxRowCnt, 10) == "1") {
        FlexPopulateCash(strLoanBatchNo)
        flexRowInsert(flxRowCnt, "Y")
        PrecDrCr()
      }
      else if (TextMatrix(flxRowCnt, 10) == "2") {

        //New code is 
        if (eval(window.document.frmTrans.txtcomm.value) > 0)

          FlexPopulateComm(strLoanBatchNo)

        if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)

          FlexPopulateSrvCharge(strLoanBatchNo)

        FlexPopulateCash(strLoanBatchNo)
        flexRowInsert(flxRowCnt, "Y")
        PrecDrCr()
      }
      else if ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5")) {
        //alert(flxRowCnt + 'main')
        flexRowInsert(flxRowCnt, "N")
        PrecDrCr()
      }
      else if (TextMatrix(flxRowCnt, 10) == "4") {


        // New code is 
        if (eval(window.document.frmTrans.txtcomm.value) > 0)

          FlexPopulateComm(strLoanBatchNo)

        if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)

          FlexPopulateSrvCharge(strLoanBatchNo)

        if ((eval(window.document.frmTrans.txtcomm.value) > 0) ||
          (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
          flexRowInsert(flxRowCnt, "Y")
        }
        else {
          flexRowInsert(flxRowCnt, "N")
        }

        PrecDrCr()

      }


    }

    else if (vMode == "TRANS") {
      //alert( "flexRowInsert")         
      // alert(flxRowCnt)


      if ((window.document.frmTrans.tranmode[2].checked == true) && (eval(window.document.frmTrans.txtServiceId.value) == "8")) {

        if ((clgretchgsautoyn1 == 'Y') && (clgCommRetChrgsYN1 == 'Y')) {
          var confrmclg
          confrmclg = confirm("Do U Want To Post Clearing Return Charges Now  Y/N ? ")
          if (confrmclg == true) {
            var brCode1
            var strValues1
            var tranNosc
            var batchNoc
            var lnkmodid
            var lnkglcode
            batchNoc = ""
            brCode1 = window.document.frmTrans.txtbranchcode.value
            tranNosc = 5
            lnkmodid = window.document.frmTrans.txtCLGModId.value.toUpperCase()
            lnkglcode = window.document.frmTrans.txtCLGGLcode.value

            if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
              if (clgAbbimpyn == "Y") {
                if (window.document.frmTrans.txtbranchcode.value == "<%=session("branchcode")%>")
                {
                  strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "<%=session("branchcode")%>"
                }
								else
                {
                  strValues1 = "GEN~*~" + "<%=session("branchcode")%>" + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "ABB"
                }
              }
              else {
                strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "<%=session("branchcode")%>"
              }
            }

            //alert(strValues1)
            window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGenclgret.aspx?strVal=" + strValues1
            return
          }
          else {
            flexRowInsert(flxRowCnt, "N")
          }
        }
        else {
          flexRowInsert(flxRowCnt, "N")
        }
      }
      else {
        flexRowInsert(flxRowCnt, "N")
        //  PrecDrCr()
      }
    }
    else if ((vMode == "PAY") || (vMode == "REC")) {
      //		alert("cash gl = " + vCashGlCode)

      FlexPopulateCash(strLoanBatchNo)
      flexRowInsert(flxRowCnt, "Y")
      PrecDrCr()


    }
    //------------------  

    if (flexInsrtYN != "YES") {

      TempTranInsrt("Transaction Failed", flxRowCnt, "1")
    }
    //var strNarr=window.document.frmTrans.txtNarran.value
    if (strInsert == true) {
      if ((window.document.frmTrans.tranmode(1).checked == true) && (window.document.frmTrans.txtModId.value == "REM")) {
        okNarrSave1();
      }
      if ((window.document.frmTrans.tranmode(2).checked == true) && (window.document.frmTrans.txtModId.value != "REM")) {
        okNarrSave();
      }

    }


    window.document.frmTrans.txtPanNo.value = ""
    window.document.frmTrans.txtMobile.value = ""
    window.document.frmTrans.txtAddress1.value = ""
    window.document.frmTrans.txtAddress2.value = ""
    window.document.frmTrans.txtAddress3.value = ""

    window.document.frmTrans.txtPayeeBank.value = ""
    window.document.frmTrans.txtPayBnkDesc.value = ""
    window.document.frmTrans.txtPayeeBranch.value = ""
    window.document.frmTrans.txtPayBrDesc.value = ""
    window.document.frmTrans.txtMICRCode.value = ""

    //window.document.frmTrans.txtNarran.value=strNarr



    OkClear()

    mode = "ADD"
    //	alert("mode=ADD")
  }
}

function closeLoanAutoRevert() {
  alert("hi")
}

//----------------------------------------------------------------------------------
//This function checks for mandatory field values.
//inserts rows into gentemptranslog
//genrates batchno and tranno based on condition.

var blnFlagAutoClose, blnCloseLoan, blnBatchLoanClose, blnBatchLoancheck

blnFlagAutoClose = false
blnCloseLoan = false
blnBatchLoanClose = false
blnBatchLoancheck = false

function cmdOkClick() {

  var strValues
  var brCode
  blnFlagAutoClose = false
  blnBatchLoancheck = false

  //this code added by vinod for close loans where 0 balance in accounts

  if ((window.document.frmTrans.tranmode[1].checked == true) &&
    (window.document.frmTrans.txtModId.value == "LOAN")) {

    if (CashDenom == 'Y') {
      window.document.frmTrans.hdnMod.value = window.document.frmTrans.txtModId.value
    }

    if (Math.abs(window.document.frmTrans.txtloanaccbal.value) == Math.abs(window.document.frmTrans.txtAmt.value)) {
      blnBatchLoancheck = true
      blnCloseLoan = true
      window.document.frmTrans.hdnblnCloseLoan.value = ""
      window.document.frmTrans.hdnblnCloseLoan.value = "true1"
      var result = confirm("Do you Want to Close This Loan");
      if (result == true) {
        var resultConfirm = confirm("Are you Sure Want to Close This Loan");
        {
          if (resultConfirm == true) {
            blnFlagAutoClose = true
            //blnCloseLoan=true
            window.document.frames['iPost'].frmPost.hdnCloseLoan.value = window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtbranchcode.value

            /*if((window.document.frmTrans.txtIntPendAmt.value=="")||eval((window.document.frmTrans.txtIntPendAmt.value==0)))
            {
              blnBatchLoanClose=false
            }
            else
            {*/
            if (!((window.document.frmTrans.txtNPAIntAmt.value == "") || eval(window.document.frmTrans.txtNPAIntAmt.value == 0))) {
              blnNpaInt = true
              npaIntYN = "Y"
              if ((Math.abs(window.document.frmTrans.txtloanaccbal.value) == Math.abs(window.document.frmTrans.txtAmt.value)) || (parseFloat(window.document.frmTrans.txtAmt.value) > parseFloat(window.document.frmTrans.txtNPAIntAmt.value))) {
                alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount Adjusted to Loan")
              }
              if (parseFloat(window.document.frmTrans.txtAmt.value) <= parseFloat(window.document.frmTrans.txtNPAIntAmt.value)) {
                alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount " + window.document.frmTrans.txtAmt.value + " Adjusted to Loan")
              }
            }
            blnBatchLoanClose = true
            //alert("hi")
            closeLoanAuto()
            //}
          }
          else {
            window.document.frames['iPost'].frmPost.hdnCloseLoan.value = ""
            blnFlagAutoClose = false
            blnBatchLoanClose = false
            closeLoanAuto()
          }
        }
      }
      else {
        window.document.frames['iPost'].frmPost.hdnCloseLoan.value = ""
        blnFlagAutoClose = false
        blnBatchLoanClose = false
        closeLoanAuto()
      }
    }
    else if (Math.abs(window.document.frmTrans.txtAmt.value) > Math.abs(window.document.frmTrans.txtloanaccbal.value)) {
      var resultConfirm = confirm("Entered Amt Is Crossing A/c Bal , Do You Want To Continue ?");
      {
        if (resultConfirm == true) {
        }
        else {
          return
        }

      }
    }
    else {
      if (!((window.document.frmTrans.txtNPAIntAmt.value == "") || eval(window.document.frmTrans.txtNPAIntAmt.value == 0))) {
        blnNpaInt = true
        npaIntYN = "Y"
        if ((Math.abs(window.document.frmTrans.txtloanaccbal.value) == Math.abs(window.document.frmTrans.txtAmt.value)) || (parseFloat(window.document.frmTrans.txtAmt.value) > parseFloat(window.document.frmTrans.txtNPAIntAmt.value))) {
          alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount Adjusted to Loan")
        }
        if (parseFloat(window.document.frmTrans.txtAmt.value) <= parseFloat(window.document.frmTrans.txtNPAIntAmt.value)) {
          alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount " + window.document.frmTrans.txtAmt.value + " Adjusted to Loan")
        }
        blnBatchLoanClose = false
        closeLoanAuto()
      }
    }
  }

  //this code added by vinod for close loans where 0 balance in accounts ended here


  if (vSubMode == "TPAY" || vSubMode == "TREC") {

    exceptionCodes()
    if (excpYN == "Y" && "<%=TellerVerifyReqYN%>" == "N") {
      alert("Exceptional Transactions are not allowed")
      Cancel()
      return
    }
  }
  if (window.document.frmTrans.chkABB.checked == false) {
    brCode = window.document.frmTrans.txtbranchcode.value
  }
  else {
    brCode = "ABB"
  }
  var batchNo = ""
  if (((vMode == "REC") || (vMode == "PAY")) && (window.document.frmTrans.Mfgpaydt.Rows > 1) && (mode != "MODIFY")) {


    if (window.document.frmTrans.chkDispAccNo.checked == true) {
      //alert("Reddy2")
    }
    else {
      alert("Only one Cash Transaction allowed at a time." + "\n" +
        "Post already entered data.")
      return
    }
  }
  TranMode();
  modId = window.document.frmTrans.txtModId.value
  serId = window.document.frmTrans.txtServiceId.value

  checkNulls(modId, trnMode, serId)
  if (chkNull == "false") {
    return
  }
  if (OkValidations() == false) {
    return
  }
  excpTranCheck()
  //new code added by radhika on 25 nov 2008
  MinBalCheck_modify()
  //end of new code
  TotTranNos()
  var clgModId, clgGlCd2
  clgModId = window.document.frmTrans.txtCLGModId.value.toUpperCase();
  clgGlCd2 = window.document.frmTrans.txtCLGGLcode.value.toUpperCase();
  var overdraft2
  overdraft2 = "<%=ovrdrft%>"
  //-----------------------------ClearingBatch No Generation------------------ 
  if (window.document.frmTrans.tranmode[2].checked == true) {
    //-------- for clearing , serviceid ==8, clearbal < 0 
    if (window.document.frmTrans.txtServiceId.value == "8") {
      if (overdraft2 == "N") {
        if ((clgModId == "CC") || (clgModId == "LOAN") || (clgModId == "INV") || ((clgModId == "MISC") && (clgGlCd2.substr(0, 3) == "204"))) {
        }
        else {
          if (window.document.frmTrans.txtretclearbal.value < 0) {
            alert("Clearing Balance Is Less Than Zero , No Transaction Is Posted")
            window.document.frmTrans.txtAmt.value = "0.00"
            return;
          }
        } //((clgModId=="CC") || (clgModId=="LOAN") || (clgModId=="INV") || ((clgModId=="MISC") && (clgGlCd2.substr(0,3)=="204")))
      }
      else {
      }//(overdraft2 == 'N')
    } //(window.document.frmTrans.txtServiceId.value == "8")

    sCurCode = window.document.frmTrans.txtcurrencycode.value
    sClear = window.document.frmTrans.cmdcleartype.value
    sAppDate = "<%=session("applicationdate")%>";

    if (mode != "MODIFY") {
      if (window.document.frmTrans.Mfgpaydt.Rows == 1) {
        if (clgAbbimpyn == "Y") {
          strValues = "CLG~*~" + "<%=session("branchcode")%>" + "~" + batchNo + "~" + "" + "~" + sCurCode + "~" + sClear + "~" + sAppDate + "~" + tranNos + "~" + "ABB"
        }
        else {
          strValues = "CLG~*~" + brCode + "~" + batchNo + "~" + "" + "~" + sCurCode + "~" + sClear + "~" + sAppDate + "~" + tranNos + "~" + "<%=session("branchcode")%>"
        }
        //alert(" mahendr = "+strValues)

      }
      else if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
        batchNo = window.document.frmTrans.Mfgpaydt.TextMatrix(1, 0)

        if (clgAbbimpyn == "Y") {
          strValues = "CLG~*~" + "<%=session("branchcode")%>" + "~" + batchNo + "~" + "" + "~" + sCurCode + "~" + sClear + "~" + sAppDate + "~" + tranNos + "~" + "ABB"
        }
        else {
          strValues = "CLG~*~" + brCode + "~" + batchNo + "~" + "" + "~" + sCurCode + "~" + sClear + "~" + sAppDate + "~" + tranNos + "~" + "<%=session("branchcode")%>"
        }
        //alert(" reddy = "+strValues)
      }
    }
    else if (mode == "MODIFY") {
      batchNo = window.document.frmTrans.hdnBatchNo.value
      tranNo = window.document.frmTrans.hdnTranNo.value
      if (vMode == "TRANS") {
        bNo = batchNo + "~" + tranNo
        FlexPopulate(bNo)
        return
      }
    }
  }

  //-----------------------------Genaral Batch No genration  

  if ((window.document.frmTrans.tranmode[0].checked == true) ||
    (window.document.frmTrans.tranmode[1].checked == true))

    if (mode != "MODIFY") {

      if (window.document.frmTrans.Mfgpaydt.Rows == 1) {

        if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true')) {
          if (eval(window.document.frmTrans.hdn194Nfinaltds.value) != 0) {
            strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + 4
          }
          else {
            strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
          }
        }
        else {
          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
        }
      }
      else if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
        if ((window.document.frmTrans.hdnblnCloseLoan.value == "true1") && (window.document.frmTrans.tranmode[0].checked == true)) {
          //	alert("blnCloseLoan")
          batchNo = window.document.frmTrans.Mfgpaydt.TextMatrix(window.document.frmTrans.Mfgpaydt.rows - 1, 0)
          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
        }
        else {
          batchNo = window.document.frmTrans.Mfgpaydt.TextMatrix(1, 0)
          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
        }
      }

    }
    else if (mode == "MODIFY") {

      batchNo = window.document.frmTrans.hdnBatchNo.value
      tranNo = window.document.frmTrans.hdnTranNo.value
      var tranNo2 = window.document.frmTrans.hdnTranNo2.value
      var tranNo3 = window.document.frmTrans.hdnTranNo3.value
      var tranNo4 = window.document.frmTrans.hdnTranNo4.value
      var vModId = window.document.frmTrans.txtModId.value.toUpperCase()
      TranMode()

      if ((vModId == "REM") || (vModId == "FXREM")) {
        if (trnMode == "4") {
          /*if(eval(window.document.frmTrans.txtcomm.value)>0)
          { 
          bNo=batchNo+"~"+tranNo+"~"+tranNo2
          }
          else
          {
          bNo=batchNo+"~"+tranNo
          }*/

          //New code is 
          bNo = batchNo + "~" + tranNo

          if (eval(window.document.frmTrans.txtcomm.value) > 0)
            bNo = bNo + "~" + tranNo2

          if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
            bNo = bNo + "~" + tranNo3

          FlexPopulate(bNo)
        }
        else if (trnMode == "2") {
          /*if(eval(window.document.frmTrans.txtcomm.value)>0)
          { 
          bNo=batchNo+"~"+tranNo+"~"+tranNo2+"~"+tranNo3
          }
          else
          {
          bNo=batchNo+"~"+tranNo+"~"+tranNo2
          }*/

          // New Code is 
          bNo = batchNo + "~" + tranNo + "~" + tranNo2

          if (eval(window.document.frmTrans.txtcomm.value) > 0)
            bNo = bNo + "~" + tranNo3

          if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
            bNo = bNo + "~" + tranNo4

          FlexPopulate(bNo)
        }
        else if (trnMode == "3") {
          bNo = batchNo + "~" + tranNo
          FlexPopulate(bNo)
        }
        else if (trnMode == "1") {
          bNo = batchNo + "~" + tranNo + "~" + tranNo2
          FlexPopulate(bNo)
        }
      }
      else if (vMode == "TRANS") {

        bNo = batchNo + "~" + tranNo
        FlexPopulate(bNo)
      }
      else if ((vMode == "PAY") || (vMode == "REC")) {

        bNo = batchNo + "~" + tranNo + "~" + tranNo2
        FlexPopulate(bNo)
      }
      return
    }

  //clear denom tally
  window.document.frames("idenomtally").denomtallyclear()
  //----------------------------post to iframe page

  if ((window.document.frmTrans.tranmode(1).checked == true) && (window.document.frmTrans.txtModId.value == "REM") &&
    (window.document.frmTrans.chkRemRepeat.checked == true)) {
    if (window.document.frmTrans.txtNoOfRepeat.value == "") {
      alert("Please Enter Number of Repetitions.")
      window.document.frmTrans.txtNoOfRepeat.focus()
      return;
    }

    if ((vMode == "PAY") || (vMode == "REC")) {

      var st = "GETBATCHTRANNO|" + window.document.frmTrans.txtbranchcode.value + "*" + (window.document.frmTrans.txtNoOfRepeat.value) * 2
    }
    else {
      var stTnno

      stTnno = window.document.frmTrans.txtNoOfRepeat.value
      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
        stTnno = eval(stTnno) + 1

      if (eval(window.document.frmTrans.txtCessChrg.value) > 0)
        stTnno = eval(stTnno) + 1

      //var st="GETBATCHTRANNO|"+window.document.frmTrans.txtbranchcode.value+"*"+window.document.frmTrans.txtNoOfRepeat.value stTnno

      var st = "GETBATCHTRANNO|" + window.document.frmTrans.txtbranchcode.value + "*" + stTnno
    }
    //alert(" st = "+st)
    window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
  }
  else {
    if (blnBatchLoancheck == true) {
      //	alert("hi")
      //	strValues="GEN~*~"+brCode+"~"+strLoanBatchNo+"~"+""+"~"+tranNos
      //blnBatchLoanClose=false
      //window.document.all['iGeneral'].src='<%="http://" & session("moduledir")& "/GEN/"%>'+"batchNoGen.aspx?strVal="+strValues
    }
    else if ((window.document.frmTrans.tranmode[0].checked == true) && (window.document.frmTrans.txtServiceId.value == 9) && ("<%=strRemCancAutoChrgsYN%>" == "Y") && ("<%=strRemCancCommYN%>" == "Y") && (vMode == "TRANS")) {
      tranNos = 5
      strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
      //alert(strValues1)
      window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchnoGenRemCanc.aspx?strVal=" + strValues
    }
    else {
      //alert("Gen")
      //	alert("strValues " + strValues)
      //	alert("vMode " + vMode)
      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGen.aspx?strVal=" + strValues
    }
  }
}

function BatchTranNo(str) {
  strBatchTran = str
  var strArr = strBatchTran.split("|")
  var strVals = strArr[1].split("*")
  //alert(strArr)
  var noofDDs = eval(window.document.frmTrans.txtNoOfRepeat.value)
  var strBat
  var intCnt = 1

  if ((vMode == "PAY") || (vMode == "REC")) {
    noofDDs = noofDDs * 2
  }
  for (vCnt = 0; vCnt <= noofDDs - 1; vCnt++) {
    if ((vMode == "PAY") || (vMode == "REC")) {
      strBat = strArr[0] + "~" + strVals[vCnt + 1] + "~" + strVals[strVals.length - 2] + "~" + strVals[strVals.length - 1] + "~" + strVals[vCnt + 2]

      DDRepetition(strBat)
      vCnt = vCnt + 1
    }
    else {
      strBat = strArr[0] + "~" + strVals[vCnt + 1] + "~" + strVals[strVals.length - 2] + "~" + strVals[strVals.length - 1]
      DDRepetition(strBat)
    }
  }

  //service charge and commision
  var flxRowCnt
  var yCnt = 0
  if ((vMode == "PAY") || (vMode == "REC")) {
    yCnt = noofDDs / 2
    flxRowCnt = window.document.frmTrans.Mfgpaydt.rows - 2
  }
  else {
    yCnt = noofDDs
    flxRowCnt = window.document.frmTrans.Mfgpaydt.rows - 1
  }


  if ((window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 17) == "REM") ||
    (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 17) == "FXREM")) {
    if (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "1") {
      FlexPopulateCash(BatchNo)
      flexRowInsert(flxRowCnt, "Y")
      PrecDrCr()
    }
    else if (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "2") {
      if (eval(window.document.frmTrans.txtcomm.value) > 0) {
        window.document.frmTrans.txtcomm.value = eval(window.document.frmTrans.txtcomm.value) * yCnt
        FlexPopulateComm(strArr[0] + "~~" + strVals[noofDDs + 1])
      }

      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
        window.document.frmTrans.txtSerivceChrg.value = eval(window.document.frmTrans.txtSerivceChrg.value) * yCnt
        FlexPopulateSrvCharge(strArr[0] + "~~~" + strVals[noofDDs + 2] + "~" + strVals[noofDDs + 3])
      }
      if (eval(window.document.frmTrans.txtCessChrg.value) > 0) {
        window.document.frmTrans.txtCessChrg.value = eval(window.document.frmTrans.txtCessChrg.value)
        FlexPopulateCessCharge(strArr[0] + "~~~~~" + strVals[noofDDs + 4])
      }

      if ((vMode == "PAY") || (vMode == "REC")) {
        //FlexPopulateCash(BatchNo)
        flxRowCnt = window.document.frmTrans.Mfgpaydt.rows - 2
        flexRowInsert(flxRowCnt, "Y")
        PrecDrCr()
      }
      else {
        FlexPopulateCash(BatchNo)
        flexRowInsert(flxRowCnt, "Y")
        PrecDrCr()
      }

    }
    else if ((window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "3") ||
      (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "5")) {
      flexRowInsert(flxRowCnt, "N")
      PrecDrCr()
    }
    else if (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "4") {
      if (eval(window.document.frmTrans.txtcomm.value) > 0) {
        window.document.frmTrans.txtcomm.value = eval(window.document.frmTrans.txtcomm.value) * yCnt
        FlexPopulateComm(strArr[0] + "~~" + strVals[noofDDs + 1])
      }

      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
        //window.document.frmTrans.txtSerivceChrg.value=eval(window.document.frmTrans.txtSerivceChrg.value)*yCnt
        window.document.frmTrans.txtSerivceChrg.value = eval(window.document.frmTrans.txtSerivceChrg.value)
        FlexPopulateSrvCharge(strArr[0] + "~~~" + strVals[noofDDs + 2] + "~" + strVals[noofDDs + 3])
      }
      if (eval(window.document.frmTrans.txtCessChrg.value) > 0) {
        window.document.frmTrans.txtCessChrg.value = eval(window.document.frmTrans.txtCessChrg.value)
        FlexPopulateCessCharge(strArr[0] + "~~~~~" + strVals[noofDDs + 4])
      }

      if ((eval(window.document.frmTrans.txtcomm.value) > 0) || (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
        flexRowInsert(flxRowCnt + 1, "Y")
      }
      else {
        flexRowInsert(flxRowCnt + 1, "N")
      }

      PrecDrCr()
    }
  }
  //service charge and commision
  OkClear()
  window.document.frmTrans.txtNoOfRepeat.value = ""
  window.document.frmTrans.txtPanNo.value = ""
  window.document.frmTrans.txtMobile.value = ""
  window.document.frmTrans.txtAddress1.value = ""
  window.document.frmTrans.txtAddress2.value = ""
  window.document.frmTrans.txtAddress3.value = ""
}

//----------------------------------------------------------------------------------
function TotTranNos() {
  TranMode()
  if ((window.document.frmTrans.txtModId.value == "REM") ||
    (window.document.frmTrans.txtModId.value == "FXREM")) {
    if (trnMode == "4") {
      /*if(eval(window.document.frmTrans.txtcomm.value)>0)
      {
      tranNos="2"
      }
      else
      {
      tranNos="1"         
      }*/

      //new code is 
      tranNos = 1

      if (eval(window.document.frmTrans.txtcomm.value) > 0)
        tranNos = tranNos + 1

      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
        tranNos = tranNos + 2

      if (eval(window.document.frmTrans.txtCessChrg.value) > 0)
        tranNos = tranNos + 1

      tranNos = "" + tranNos
    }
    else if (trnMode == "2") {

      //new code is 
      tranNos = 2

      if (eval(window.document.frmTrans.txtcomm.value) > 0)
        tranNos = tranNos + 1

      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
        tranNos = tranNos + 2

      if (eval(window.document.frmTrans.txtCessChrg.value) > 0)
        tranNos = tranNos + 1

      tranNos = "" + tranNos
    }
    else if (trnMode == "3") {
      tranNos = "1"
    }
    else if (trnMode == "1") {
      tranNos = "2"
    }
    return
  }

  if (vMode == "TRANS") {
    tranNos = "1"
  }
  else if (vMode == "PAY") {
    tranNos = "2"
  }
  else if (vMode == "REC") {
    tranNos = "2"
  }

}

function SetWaitMethod() {
  var noofreap
  noofreap = 0
  var intmaxval
  intmaxval = 0


  if (window.document.frmTrans.txtNoOfRepeat.value > 0) {

    noofreap = eval(window.document.frmTrans.txtNoOfRepeat.value)

    intmaxval = 100000 * eval(noofreap)

    for (i = 1; i < intmaxval; i++) {
    }

  }

}

// this function added by vinod on 25--mar-2014 for repetition of DDs
function DDRepetition(BatchNo) {//alert(" Teddr ")

  flexInsrtYN = ""
  depIntacccond = true
  if (eval(window.document.frmTrans.txtAmt.value == 0)) {
    return
  }
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1

  Populate(BatchNo, flxRowCnt)

  var BatchNoAuto = BatchNo.split('~')
  with (window.document.frmTrans.Mfgpaydt) {
    TranMode()
    if (window.document.frmTrans.chkDispAccNo.checked == true) {
      TextMatrix(flxRowCnt, 25) = "Q"
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 37)//Rate Type
      TextMatrix(flxRowCnt, 29) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 40)//Rate
      TextMatrix(flxRowCnt, 30) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 42)//F Currrency Code
      TextMatrix(flxRowCnt, 31) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 43)//F Amount
      TextMatrix(flxRowCnt, 32) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 19)//lnkmoduleid
      TextMatrix(flxRowCnt, 33) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 20)//lnkmoduledesc
      TextMatrix(flxRowCnt, 34) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 21)//lnkglcode
      TextMatrix(flxRowCnt, 35) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 22)//lnkgldesc
      TextMatrix(flxRowCnt, 36) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 23)//lnkacctype
      TextMatrix(flxRowCnt, 37) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 24)//lnkaccno
      TextMatrix(flxRowCnt, 38) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)//lnkaccname  

      TextMatrix(flxRowCnt, 43) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 50)//Responding Section Code
      TextMatrix(flxRowCnt, 47) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 8)
      TextMatrix(flxRowCnt, 48) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 9)
      TextMatrix(flxRowCnt, 49) = "Y"
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 49)//Responding Bank Code
      TextMatrix(flxRowCnt, 58) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 38)//Rate Ref Code


      //TextMatrix(flxRowCnt,60)=window.document.frmTrans.mfgDisp.TextMatrix(Rselect,4)   
      TextMatrix(flxRowCnt, 80) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 4)
      TextMatrix(flxRowCnt, 81) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 10)
      TextMatrix(flxRowCnt, 82) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)
      TextMatrix(flxRowCnt, 83) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 27)
      TextMatrix(flxRowCnt, 84) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 28)
      TextMatrix(flxRowCnt, 85) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 29)

      TextMatrix(flxRowCnt, 86) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 35)
      TextMatrix(flxRowCnt, 87) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 36)

      TextMatrix(flxRowCnt, 88) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 39)//Ref No.
      TextMatrix(flxRowCnt, 89) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 41)//Ref Date
      TextMatrix(flxRowCnt, 90) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 44)//Corresponding Bank Code
      TextMatrix(flxRowCnt, 91) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 45)//Corresponding Branch Code
      TextMatrix(flxRowCnt, 92) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 46)//NOSTRO Debit Date
      TextMatrix(flxRowCnt, 93) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 47)//NOSTRO Credit Date
      TextMatrix(flxRowCnt, 94) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 48)//Charge Type

      TextMatrix(flxRowCnt, 95) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 51)//User Id.
      TextMatrix(flxRowCnt, 96) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 52)//Machine Id.
      TextMatrix(flxRowCnt, 97) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 55)//Approved By
      TextMatrix(flxRowCnt, 98) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 56)//Approved M/C                      
    }
    if (TextMatrix(flxRowCnt, 39) == "2") {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtAppName.value
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtAccCatCode.value
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtAccCatDesc.value
    }

    if (vSubMode == "TPAY") {
      TextMatrix(flxRowCnt, 79) = "TPAY"
    }
    //-------------------------------------------Remittance   
    else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "1") || (TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5"))) {
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtbybnkcode.value;
      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtbybnkdesc.value;
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtbybrcode.value;
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtbybrdesc.value;
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavgdr.value;
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtinstrno.value;

      TextMatrix(0, 64) = "Advice Rec"
      if (remtype != "ADD") {
        TextMatrix(flxRowCnt, 64) = natadv
        natadv = ""
        TextMatrix(flxRowCnt, 68) = remtype
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "Y"
        remtype = ""
        if (natinsdt != "") {
          TextMatrix(flxRowCnt, 67) = natinsdt
        }
        else {
          natinsdt = window.document.frmTrans.txtinstrdt.value;
        }
        TextMatrix(flxRowCnt, 67) = natinsdt
        natinsdt = ""
      }
      else {
        TextMatrix(flxRowCnt, 64) = remadv[0]
        TextMatrix(flxRowCnt, 65) = remadv[1]

        //TextMatrix(flxRowCnt,66)=remadv[2]
        TextMatrix(flxRowCnt, 66) = remadvdate
        TextMatrix(flxRowCnt, 68) = remtype
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "N"
        remtype = ""
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "N"
        if (advinstrdate != "") {

          TextMatrix(flxRowCnt, 67) = advinstrdate
        }
        else {
          advinstrdate = window.document.frmTrans.txtinstrdt.value;
        }
        TextMatrix(flxRowCnt, 67) = advinstrdate
        advinstrdate = ""
      }
    }

    //----------	
    //alert("YYY")
    else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "2") || (TextMatrix(flxRowCnt, 10) == "4"))) {
      //alert("1")
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
      window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtissbnkcode.value;
      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtissbnkdesc.value;

      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtissbrcode.value;
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtissbrdesc.value;
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavg.value;
      //---63nr
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
      TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtcusn.value;


      //new code is 
      if ((eval(window.document.frmTrans.txtcomm.value) > 0) &&
        (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + "," + BatchNoAuto[3]
        TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value +
          "," + window.document.frmTrans.txtSerivceChrg.value
      }
      else if (eval(window.document.frmTrans.txtcomm.value) > 0) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + ",0"
        TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value + ",0"
      }
      else if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
        TextMatrix(flxRowCnt, 67) = "0," + BatchNoAuto[2]
        TextMatrix(flxRowCnt, 64) = "0," + window.document.frmTrans.txtSerivceChrg.value
      }
      TextMatrix(flxRowCnt, 68) = remtype

      TextMatrix(flxRowCnt, 69) = window.document.frmTrans.txtPanNo.value;
      TextMatrix(flxRowCnt, 70) = window.document.frmTrans.txtMobile.value;
      TextMatrix(flxRowCnt, 71) = window.document.frmTrans.txtAddress1.value;
      TextMatrix(flxRowCnt, 72) = window.document.frmTrans.txtAddress2.value;
      TextMatrix(flxRowCnt, 73) = window.document.frmTrans.txtAddress3.value;

    }
    //-------------------------------------------Deposits

    else if (TextMatrix(flxRowCnt, 17) == "DEP" &&
      window.document.frmTrans.txtServiceId.value != "2") {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtDOpAmt.value
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtDCurrAmt.value
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtDMatAmt.value
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtDIntAcc.value
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtDOpDate.value
      TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtDEffDt.value
      TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtDMatDt.value
      TextMatrix(flxRowCnt, 67) = window.document.frmTrans.txtDPaidupto.value
      TextMatrix(flxRowCnt, 68) = window.document.frmTrans.txtDROI.value

      if (flxRowCnt == 1 && window.document.frmTrans.txtServiceId.value != "2") {
        TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value
        TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value
        TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value
        TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value
        TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value
        TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value
        TextMatrix(flxRowCnt, 25) = "Y"
        TextMatrix(flxRowCnt, 26) = "Deposits"
      }

      if (window.document.frmTrans.Mfgpaydt.Rows > 1 && (servicecond == "RENEWAL" || servicecond == "CLOSING")) {

        TextMatrix(flxRowCnt, 32) = TextMatrix(1, 32)
        TextMatrix(flxRowCnt, 33) = TextMatrix(1, 33)
        TextMatrix(flxRowCnt, 34) = TextMatrix(1, 34)
        TextMatrix(flxRowCnt, 35) = TextMatrix(1, 35)
        TextMatrix(flxRowCnt, 37) = TextMatrix(1, 37)
        TextMatrix(flxRowCnt, 38) = TextMatrix(1, 38)
        TextMatrix(flxRowCnt, 25) = "Y"
        TextMatrix(flxRowCnt, 26) = "Deposits"
      }
    }
    //-------------------------------------------Suspense and Sundry 

    else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "3") ||
      (TextMatrix(flxRowCnt, 10) == "1"))) {
      var hidamt = window.document.frmTrans.hidscr.value
      var amt = window.document.frmTrans.txtAmt.value
      var diffamt = eval(hidamt) - eval(amt)
      TextMatrix(flxRowCnt, 79) = scrstr
      if (window.document.frmTrans.hidtrnno.value) {
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
        if (eval(diffamt) > 0) {
          TextMatrix(flxRowCnt, 71) = "P"
        }
        else {
          TextMatrix(flxRowCnt, 71) = "F"
        }

      }
      else {
        TextMatrix(flxRowCnt, 60) = ""
        TextMatrix(flxRowCnt, 61) = ""
        TextMatrix(flxRowCnt, 62) = ""
        TextMatrix(flxRowCnt, 71) = ""

      }
    }
    else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      var hidamt = window.document.frmTrans.hidscr.value
      var amt = window.document.frmTrans.txtAmt.value
      var diffamt = eval(hidamt) - eval(amt)
      TextMatrix(flxRowCnt, 79) = scrstr

      if (window.document.frmTrans.hidtrnno.value) {
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
        if (eval(diffamt) > 0) {
          TextMatrix(flxRowCnt, 71) = "P"
        }
        else {
          TextMatrix(flxRowCnt, 71) = "F"
        }
      }
      else {
        TextMatrix(flxRowCnt, 60) = ""
        TextMatrix(flxRowCnt, 61) = ""
        TextMatrix(flxRowCnt, 62) = ""
        TextMatrix(flxRowCnt, 71) = ""
      }
    }

    //-------------------------------------------Loans

    else if ((TextMatrix(flxRowCnt, 17) == "LOAN") &&
      ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      TextMatrix(flxRowCnt, 60) = window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value
      TextMatrix(flxRowCnt, 61) = window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value
      TextMatrix(flxRowCnt, 62) = window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value
      TextMatrix(flxRowCnt, 63) = window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value
      //window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value=""
      TextMatrix(flxRowCnt, 64) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value
      TextMatrix(flxRowCnt, 65) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value
    }
    else if ((TextMatrix(flxRowCnt, 17) == "LOAN") && ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "1"))) {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text

    }

    //-------------------------------------------Clearing

    // for inward clearing add clearingtype to CLG Rate Type column in grid

    else if (window.document.frmTrans.tranmode[2].checked == true) {
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.cmdcleartype.options
        (window.document.frmTrans.cmdcleartype.selectedIndex).text

      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {

        TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
        TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
        TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
        TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
        TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
        TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtCLGBankCode.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtCLGBranch.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtCLGReason.value
        TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtCLGReasoncode.value
        TextMatrix(flxRowCnt, 79) = "CLGOWRETURN"

      }
    }

    else if ((TextMatrix(flxRowCnt, 17) == "FXREM") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
      window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 60) = "O"
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtfavg.value;
      //TextMatrix(flxRowCnt,62)=window.document.frmTrans.txtcomm.value; 
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtcusn.value;

      if (eval(window.document.frmTrans.txtcomm.value) > 0) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2]
      }
      TextMatrix(flxRowCnt, 65) = remtype
      remtype = ""

    }

    else {

    }


    PrecDrCr()

    if (window.document.frmTrans.txtModId.value != "DEP") {
      Depdivclear()
    }

    //------------------   

    if ((TextMatrix(flxRowCnt, 17) == "REM") || (TextMatrix(flxRowCnt, 17) == "FXREM")) {

      if (TextMatrix(flxRowCnt, 10) == "1") {
        FlexPopulateCash(BatchNo)
        flexRowInsert(flxRowCnt, "Y")
        PrecDrCr()
      }
      else if (TextMatrix(flxRowCnt, 10) == "2") {

        //New code is 
        if (eval(window.document.frmTrans.txtcomm.value) > 0)
          //FlexPopulateComm(BatchNo)

          if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
            //FlexPopulateSrvCharge(BatchNo)

            FlexPopulateCash(BatchNo)
        flexRowInsert(flxRowCnt, "Y")
        PrecDrCr()
      }
      else if ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5")) {
        //alert(flxRowCnt + 'main')
        flexRowInsert(flxRowCnt, "N")
        PrecDrCr()
      }
      else if (TextMatrix(flxRowCnt, 10) == "4") {

        // New code is 
        if (eval(window.document.frmTrans.txtcomm.value) > 0)
          //FlexPopulateComm(BatchNo)

          if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
            //FlexPopulateSrvCharge(BatchNo)

            if ((eval(window.document.frmTrans.txtcomm.value) > 0) ||
              (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
              //SetWaitMethod()

              if (window.document.frmTrans.txtNoOfRepeat.value > 0) {

                noofreap = eval(window.document.frmTrans.txtNoOfRepeat.value)

                intmaxval = 1000 * eval(noofreap)

                for (i = 1; i < intmaxval; i++) {
                }

              }

              flexRowInsert(flxRowCnt, "Y")

              if (window.document.frmTrans.txtNoOfRepeat.value > 0) {

                noofreap = eval(window.document.frmTrans.txtNoOfRepeat.value)

                intmaxval = 1000 * eval(noofreap)

                for (i = 1; i < intmaxval; i++) {
                }

              }
              //SetWaitMethod()
            }
            else {

              flexRowInsert(flxRowCnt, "N")
            }

        PrecDrCr()

      }


    }

    else if (vMode == "TRANS") {
      //alert( "flexRowInsert")         
      // alert(flxRowCnt)


      if ((window.document.frmTrans.tranmode[2].checked == true) && (eval(window.document.frmTrans.txtServiceId.value) == "8")) {

        if ((clgretchgsautoyn1 == 'Y') && (clgCommRetChrgsYN1 == 'Y')) {
          var confrmclg
          confrmclg = confirm("Do U Want To Post Clearing Return Charges Now  Y/N ? ")
          if (confrmclg == true) {
            var brCode1
            var strValues1
            var tranNosc
            var batchNoc
            var lnkmodid
            var lnkglcode
            batchNoc = ""
            brCode1 = window.document.frmTrans.txtbranchcode.value
            tranNosc = 5
            lnkmodid = window.document.frmTrans.txtCLGModId.value.toUpperCase()
            lnkglcode = window.document.frmTrans.txtCLGGLcode.value

            if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
              strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode
            }

            //alert(strValues1)
            window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGenclgret.aspx?strVal=" + strValues1
            return
          }
          else {
            flexRowInsert(flxRowCnt, "N")
          }
        }
        else {
          flexRowInsert(flxRowCnt, "N")
        }
      }
      else {
        flexRowInsert(flxRowCnt, "N")
        //  PrecDrCr()
      }
    }
    else if ((vMode == "PAY") || (vMode == "REC")) {
      //	alert("cash gl = " + vCashGlCode)
      FlexPopulateCash(BatchNo)
      flexRowInsert(flxRowCnt, "Y")
      PrecDrCr()
    }
    //------------------  

    if (flexInsrtYN != "YES") {

      TempTranInsrt("Transaction Failed", flxRowCnt, "1")
    }

    //OkClear()

    mode = "ADD"
  }

}


//----------------------------------------------------------------------------------
//This function is used to populate main flex grid based on different modules and 
//conditions with batchno and tranno.
function FlexPopulate(BatchNo) {

  flexInsrtYN = ""
  depIntacccond = true
  if (eval(window.document.frmTrans.txtAmt.value == 0)) {
    return
  }
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1
  //alert(flxRowCnt)
  //alert(window.document.frmTrans.Mfgpaydt.Rows)

  Populate(BatchNo, flxRowCnt)

  var BatchNoAuto = BatchNo.split('~')
  with (window.document.frmTrans.Mfgpaydt) {
    TranMode()
    if (window.document.frmTrans.chkDispAccNo.checked == true) {
      TextMatrix(flxRowCnt, 25) = "Y"
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 37)//Rate Type
      TextMatrix(flxRowCnt, 29) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 40)//Rate
      TextMatrix(flxRowCnt, 30) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 42)//F Currrency Code
      TextMatrix(flxRowCnt, 31) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 43)//F Amount
      TextMatrix(flxRowCnt, 32) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 19)//lnkmoduleid
      TextMatrix(flxRowCnt, 33) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 20)//lnkmoduledesc
      TextMatrix(flxRowCnt, 34) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 21)//lnkglcode
      TextMatrix(flxRowCnt, 35) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 22)//lnkgldesc
      TextMatrix(flxRowCnt, 36) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 23)//lnkacctype
      TextMatrix(flxRowCnt, 37) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 24)//lnkaccno
      TextMatrix(flxRowCnt, 38) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)//lnkaccname  

      TextMatrix(flxRowCnt, 43) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 50)//Responding Section Code
      TextMatrix(flxRowCnt, 47) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 8)
      TextMatrix(flxRowCnt, 48) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 9)
      TextMatrix(flxRowCnt, 49) = "Y"
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 49)//Responding Bank Code
      TextMatrix(flxRowCnt, 58) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 38)//Rate Ref Code


      //TextMatrix(flxRowCnt,60)=window.document.frmTrans.mfgDisp.TextMatrix(Rselect,4)   
      TextMatrix(flxRowCnt, 80) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 4)
      TextMatrix(flxRowCnt, 81) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 10)
      TextMatrix(flxRowCnt, 82) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)
      TextMatrix(flxRowCnt, 83) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 27)
      TextMatrix(flxRowCnt, 84) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 28)
      TextMatrix(flxRowCnt, 85) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 29)

      TextMatrix(flxRowCnt, 86) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 35)
      TextMatrix(flxRowCnt, 87) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 36)

      TextMatrix(flxRowCnt, 88) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 39)//Ref No.
      TextMatrix(flxRowCnt, 89) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 41)//Ref Date
      TextMatrix(flxRowCnt, 90) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 44)//Corresponding Bank Code
      TextMatrix(flxRowCnt, 91) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 45)//Corresponding Branch Code
      TextMatrix(flxRowCnt, 92) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 46)//NOSTRO Debit Date
      TextMatrix(flxRowCnt, 93) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 47)//NOSTRO Credit Date
      TextMatrix(flxRowCnt, 94) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 48)//Charge Type

      TextMatrix(flxRowCnt, 95) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 51)//User Id.
      TextMatrix(flxRowCnt, 96) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 52)//Machine Id.
      TextMatrix(flxRowCnt, 97) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 55)//Approved By
      TextMatrix(flxRowCnt, 98) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 56)//Approved M/C                      
    }
    if (TextMatrix(flxRowCnt, 39) == "2") {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtAppName.value
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtAccCatCode.value
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtAccCatDesc.value
    }

    if (vSubMode == "TPAY") {
      TextMatrix(flxRowCnt, 79) = "TPAY"
    }
    //-------------------------------------------Remittance   
    else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "1") || (TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5"))) {
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtbybnkcode.value;
      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtbybnkdesc.value;
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtbybrcode.value;
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtbybrdesc.value;
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavgdr.value;
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtinstrno.value;

      if (TextMatrix(flxRowCnt, 10) == "5") {
        TextMatrix(flxRowCnt, 8) = "<%=session("Applicationdate")%>";
        TextMatrix(flxRowCnt, 24) = window.document.frmTrans.txtfavgdr.value;
        TextMatrix(flxRowCnt, 22) = window.document.frmTrans.txtinstrno.value;
        TextMatrix(flxRowCnt, 23) = window.document.frmTrans.txtinstrdt.value;
        TextMatrix(flxRowCnt, 20) = "InWard Clearing"
      }

      TextMatrix(0, 64) = "Advice Rec"
      if (remtype != "ADD") {
        TextMatrix(flxRowCnt, 64) = natadv
        natadv = ""
        TextMatrix(flxRowCnt, 68) = remtype
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "Y"
        remtype = ""
        if (natinsdt != "") {
          TextMatrix(flxRowCnt, 67) = natinsdt
        }
        else {
          natinsdt = window.document.frmTrans.txtinstrdt.value;
        }
        TextMatrix(flxRowCnt, 67) = natinsdt
        natinsdt = ""
      }
      else {
        TextMatrix(flxRowCnt, 64) = remadv[0]
        TextMatrix(flxRowCnt, 65) = remadv[1]

        //TextMatrix(flxRowCnt,66)=remadv[2]
        TextMatrix(flxRowCnt, 66) = remadvdate
        TextMatrix(flxRowCnt, 68) = remtype
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "N"
        remtype = ""
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "N"
        if (advinstrdate != "") {

          TextMatrix(flxRowCnt, 67) = advinstrdate
        }
        else {
          advinstrdate = window.document.frmTrans.txtinstrdt.value;
        }
        TextMatrix(flxRowCnt, 67) = advinstrdate
        advinstrdate = ""
      }
    }

    //----------	
    //alert("YYY")
    else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "2") || (TextMatrix(flxRowCnt, 10) == "4"))) {
      //alert("1")
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
      window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtissbnkcode.value;
      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtissbnkdesc.value;

      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtissbrcode.value;
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtissbrdesc.value;
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavg.value;
      TextMatrix(flxRowCnt, 24) = window.document.frmTrans.txtfavg.value;
      //---63nr
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
      TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtcusn.value;

      //Code commented by Radhika on 16 may 2008
      /*if(eval(window.document.frmTrans.txtcomm.value)>0){
         TextMatrix(flxRowCnt,67)=BatchNoAuto[2]
      }*/

      //new code is 
      if ((eval(window.document.frmTrans.txtcomm.value) > 0) &&
        (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + "," + BatchNoAuto[3]
        TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value +
          "," + window.document.frmTrans.txtSerivceChrg.value
      }
      else if (eval(window.document.frmTrans.txtcomm.value) > 0) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + ",0"
        TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value + ",0"
      }
      else if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
        TextMatrix(flxRowCnt, 67) = "0," + BatchNoAuto[2]
        TextMatrix(flxRowCnt, 64) = "0," + window.document.frmTrans.txtSerivceChrg.value
      }
      TextMatrix(flxRowCnt, 68) = remtype
      remtype = ""

      TextMatrix(flxRowCnt, 69) = window.document.frmTrans.txtPanNo.value;
      TextMatrix(flxRowCnt, 70) = window.document.frmTrans.txtMobile.value;
      TextMatrix(flxRowCnt, 71) = window.document.frmTrans.txtAddress1.value;
      TextMatrix(flxRowCnt, 72) = window.document.frmTrans.txtAddress2.value;
      TextMatrix(flxRowCnt, 73) = window.document.frmTrans.txtAddress3.value;

    }
    //-------------------------------------------Deposits

    else if (TextMatrix(flxRowCnt, 17) == "DEP" &&
      window.document.frmTrans.txtServiceId.value != "2") {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtDOpAmt.value
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtDCurrAmt.value
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtDMatAmt.value
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtDIntAcc.value
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtDOpDate.value
      TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtDEffDt.value
      TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtDMatDt.value
      TextMatrix(flxRowCnt, 67) = window.document.frmTrans.txtDPaidupto.value
      TextMatrix(flxRowCnt, 68) = window.document.frmTrans.txtDROI.value

      if (flxRowCnt == 1 && window.document.frmTrans.txtServiceId.value != "2") {
        TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value.toUpperCase()
        TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value
        TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value
        TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value
        TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value
        TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value
        TextMatrix(flxRowCnt, 25) = "Y"
        TextMatrix(flxRowCnt, 26) = "Deposits"
      }

      if (window.document.frmTrans.Mfgpaydt.Rows > 1 && (servicecond == "RENEWAL" || servicecond == "CLOSING")) {

        TextMatrix(flxRowCnt, 32) = TextMatrix(1, 32)
        TextMatrix(flxRowCnt, 33) = TextMatrix(1, 33)
        TextMatrix(flxRowCnt, 34) = TextMatrix(1, 34)
        TextMatrix(flxRowCnt, 35) = TextMatrix(1, 35)
        TextMatrix(flxRowCnt, 37) = TextMatrix(1, 37)
        TextMatrix(flxRowCnt, 38) = TextMatrix(1, 38)
        TextMatrix(flxRowCnt, 25) = "Y"
        TextMatrix(flxRowCnt, 26) = "Deposits"
      }
    }
    //-------------------------------------------Suspense and Sundry 

    else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "3") ||
      (TextMatrix(flxRowCnt, 10) == "1"))) {
      var hidamt = window.document.frmTrans.hidscr.value
      var amt = window.document.frmTrans.txtAmt.value
      var diffamt = eval(hidamt) - eval(amt)
      TextMatrix(flxRowCnt, 79) = scrstr
      if (window.document.frmTrans.hidtrnno.value) {
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
        if (eval(diffamt) > 0) {
          TextMatrix(flxRowCnt, 71) = "P"
        }
        else {
          TextMatrix(flxRowCnt, 71) = "F"
        }

      }
      else {
        TextMatrix(flxRowCnt, 60) = ""
        TextMatrix(flxRowCnt, 61) = ""
        TextMatrix(flxRowCnt, 62) = ""
        TextMatrix(flxRowCnt, 71) = ""

      }
    }
    else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      var hidamt = window.document.frmTrans.hidscr.value
      var amt = window.document.frmTrans.txtAmt.value
      var diffamt = eval(hidamt) - eval(amt)
      TextMatrix(flxRowCnt, 79) = scrstr

      if (window.document.frmTrans.hidtrnno.value) {
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
        if (eval(diffamt) > 0) {
          TextMatrix(flxRowCnt, 71) = "P"
        }
        else {
          TextMatrix(flxRowCnt, 71) = "F"
        }
      }
      else {
        TextMatrix(flxRowCnt, 60) = ""
        TextMatrix(flxRowCnt, 61) = ""
        TextMatrix(flxRowCnt, 62) = ""
        TextMatrix(flxRowCnt, 71) = ""
      }
    }

    //-------------------------------------------Loans

    else if ((TextMatrix(flxRowCnt, 17) == "LOAN") &&
      ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      TextMatrix(flxRowCnt, 60) = window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value
      TextMatrix(flxRowCnt, 61) = window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value
      TextMatrix(flxRowCnt, 62) = window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value
      TextMatrix(flxRowCnt, 63) = window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value
      //window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value=""
      TextMatrix(flxRowCnt, 64) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value
      TextMatrix(flxRowCnt, 65) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value
    }
    else if ((TextMatrix(flxRowCnt, 17) == "LOAN") && ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "1"))) {
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text

    }

    //-------------------------------------------Clearing

    // for inward clearing add clearingtype to CLG Rate Type column in grid

    else if (window.document.frmTrans.tranmode[2].checked == true) {
      TextMatrix(flxRowCnt, 8) = "<%=session("Applicationdate")%>";
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.cmdcleartype.options
        (window.document.frmTrans.cmdcleartype.selectedIndex).text

      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {

        TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
        TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
        TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
        TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
        TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
        TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtCLGBankCode.value
        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtCLGBranch.value
        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtCLGReason.value
        TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtCLGReasoncode.value
        TextMatrix(flxRowCnt, 79) = "CLGOWRETURN"

      }
      TextMatrix(flxRowCnt, 92) = window.document.frmTrans.txtPayeeBank.value
      TextMatrix(flxRowCnt, 93) = window.document.frmTrans.txtPayeeBranch.value
    }

    else if ((TextMatrix(flxRowCnt, 17) == "FXREM") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
      window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
      TextMatrix(flxRowCnt, 60) = "O"
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtfavg.value;
      //TextMatrix(flxRowCnt,62)=window.document.frmTrans.txtcomm.value; 
      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtcusn.value;

      if (eval(window.document.frmTrans.txtcomm.value) > 0) {
        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2]
      }
      TextMatrix(flxRowCnt, 65) = remtype
      remtype = ""

    }

    else {

    }

    PrecDrCr()

    if (window.document.frmTrans.txtModId.value != "DEP") {
      Depdivclear()
    }

    //------------------   

    if ((TextMatrix(flxRowCnt, 17) == "REM") || (TextMatrix(flxRowCnt, 17) == "FXREM")) {

      if (TextMatrix(flxRowCnt, 10) == "1") {
        FlexPopulateCash(BatchNo)
        flexRowInsert(flxRowCnt, "Y")
        PrecDrCr()
      }
      else if (TextMatrix(flxRowCnt, 10) == "2") {

        //New code is 
        if (eval(window.document.frmTrans.txtcomm.value) > 0)

          FlexPopulateComm(BatchNo)

        if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)

          FlexPopulateSrvCharge(BatchNo)

        if (eval(window.document.frmTrans.txtCessChrg.value) > 0)

          FlexPopulateCessCharge(BatchNo)

        FlexPopulateCash(BatchNo)

        flexRowInsert(flxRowCnt, "Y")
        PrecDrCr()
      }
      else if ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5")) {
        //alert(flxRowCnt + 'main')
        flexRowInsert(flxRowCnt, "N")
        PrecDrCr()
      }
      else if (TextMatrix(flxRowCnt, 10) == "4") {

        // New code is 
        if (eval(window.document.frmTrans.txtcomm.value) > 0)

          FlexPopulateComm(BatchNo)

        if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)

          FlexPopulateSrvCharge(BatchNo)
        if (eval(window.document.frmTrans.txtCessChrg.value) > 0)

          FlexPopulateCessCharge(BatchNo)

        if ((eval(window.document.frmTrans.txtcomm.value) > 0) ||
          (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
          flexRowInsert(flxRowCnt, "Y")
        }
        else {
          flexRowInsert(flxRowCnt, "N")
        }

        PrecDrCr()

      }


    }

    else if (vMode == "TRANS") {
      //alert( "flexRowInsert")         
      // alert(flxRowCnt)


      if ((window.document.frmTrans.tranmode[2].checked == true) && (eval(window.document.frmTrans.txtServiceId.value) == "8")) {

        if ((clgretchgsautoyn1 == 'Y') && (clgCommRetChrgsYN1 == 'Y')) {
          var confrmclg
          confrmclg = confirm("Do U Want To Post Clearing Return Charges Now  Y/N ? ")
          if (confrmclg == true) {
            var brCode1
            var strValues1
            var tranNosc
            var batchNoc
            var lnkmodid
            var lnkglcode
            batchNoc = ""
            brCode1 = window.document.frmTrans.txtbranchcode.value
            tranNosc = 5
            lnkmodid = window.document.frmTrans.txtCLGModId.value.toUpperCase()
            lnkglcode = window.document.frmTrans.txtCLGGLcode.value

            if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
              if (clgAbbimpyn == "Y") {
                if (window.document.frmTrans.txtbranchcode.value == "<%=session("branchcode")%>")
                {
                  strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "<%=session("branchcode")%>"
                }
								else
                {
                  strValues1 = "GEN~*~" + "<%=session("branchcode")%>" + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "ABB"
                }
              }
              else {
                strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "<%=session("branchcode")%>"
              }
            }

            //alert(strValues1)
            window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGenclgret.aspx?strVal=" + strValues1
            return
          }
          else {
            flexRowInsert(flxRowCnt, "N")
          }
        }
        else {
          flexRowInsert(flxRowCnt, "N")
        }
      }
      else {
        flexRowInsert(flxRowCnt, "N")
        //  PrecDrCr()
      }
    }
    else if ((vMode == "PAY") || (vMode == "REC")) {
      //	alert("cash gl = " + vCashGlCode)
      //alert (" flxRowCnt = " + flxRowCnt)
      FlexPopulateCash(BatchNo)

      if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true')) {
        if (window.document.frmTrans.hdn194Nfinaltds.value == 0) { }
        else {
          FlexPopulate194NCust(BatchNo)
          FlexPopulate194N(BatchNo)
        }
      }
      flexRowInsert(flxRowCnt, "Y")
      PrecDrCr()


    }
    //------------------  

    if (flexInsrtYN != "YES") {

      TempTranInsrt("Transaction Failed", flxRowCnt, "1")
    }
    //var strNarr=window.document.frmTrans.txtNarran.value
    if (strInsert == true) {
      if ((window.document.frmTrans.tranmode(1).checked == true) && (window.document.frmTrans.txtModId.value == "REM")) {
        okNarrSave1();
      }
      if ((window.document.frmTrans.tranmode(2).checked == true) && (window.document.frmTrans.txtModId.value != "REM")) {
        okNarrSave();
      }

    }


    window.document.frmTrans.txtPanNo.value = ""
    window.document.frmTrans.txtMobile.value = ""
    window.document.frmTrans.txtAddress1.value = ""
    window.document.frmTrans.txtAddress2.value = ""
    window.document.frmTrans.txtAddress3.value = ""

    window.document.frmTrans.txtPayeeBank.value = ""
    window.document.frmTrans.txtPayBnkDesc.value = ""
    window.document.frmTrans.txtPayeeBranch.value = ""
    window.document.frmTrans.txtPayBrDesc.value = ""
    window.document.frmTrans.txtMICRCode.value = ""

    //window.document.frmTrans.txtNarran.value=strNarr



    OkClear()

    mode = "ADD"
    //	alert("mode=ADD")
    //	} blnBatchLoanClose

  }

}
/// end of function FlexPopulate

function FlexPopulate194NCust(BatchNo) {

  //depIntacccond=true
  if (eval(window.document.frmTrans.hdn194Nfinaltds.value == 0)) {
    return
  }
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1


  with (window.document.frmTrans.Mfgpaydt) {

    var BatchNo = BatchNo.split('~')

    TextMatrix(flxRowCnt, 0) = BatchNo[0];
    TextMatrix(flxRowCnt, 1) = BatchNo[3];

    TextMatrix(flxRowCnt, 2) = window.document.frmTrans.txtGLcode.value;
    TextMatrix(flxRowCnt, 3) = window.document.frmTrans.txtGLDesc.value;
    TextMatrix(flxRowCnt, 4) = window.document.frmTrans.txtAccNo.value;
    TextMatrix(flxRowCnt, 5) = window.document.frmTrans.txtAccNm.value;



    TextMatrix(flxRowCnt, 10) = "3"
    TextMatrix(flxRowCnt, 11) = "Dr Trasfer"
    TextMatrix(flxRowCnt, 6) = '-' + window.document.frmTrans.hdn194Nfinaltds.value;
    Col = 6;
    Row = flxRowCnt;
    CellForeColor = 255

    if ((window.document.frmTrans.txtCustId.value == "") || (window.document.frmTrans.txtCustId.value == "undefined")) {
      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
        TextMatrix(flxRowCnt, 9) = ""
      }
      else {
        TextMatrix(flxRowCnt, 9) = "1111111111"
      }

    }
    else {
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtCustId.value;
    }

    TextMatrix(flxRowCnt, 19) = window.document.frmTrans.txtTokenNo.value;

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = window.document.frmTrans.txtModId.value;//ModIdule Id value;
    //code commented by Radhika on 20 may 2008
    //Reason: Branch of commission entry should be logged in user branch
    //TextMatrix(flxRowCnt,18)=window.document.frmTrans.txtbranchcode.value;
    TextMatrix(flxRowCnt, 18) = vBranchCode
    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;
    TextMatrix(flxRowCnt, 24) = '194N';
    //---------------Code Modified by Monica(15-DEC-2009)--------------			
    if (window.document.frmTrans.txtModId.value == "REM") {
      TextMatrix(flxRowCnt, 25) = "N"  //System generated Y/N = "Y"
    }
    else {
      TextMatrix(flxRowCnt, 25) = "Y"  //System generated Y/N = "Y"
    }

    window.document.frmTrans.hdn194NBrcode.value = window.document.frmTrans.txtbranchcode.value;
    window.document.frmTrans.hdn194NCurcode.value = window.document.frmTrans.txtcurrencycode.value;
    window.document.frmTrans.hdn194NModID.value = window.document.frmTrans.txtModId.value;
    window.document.frmTrans.hdn194NGLCode.value = window.document.frmTrans.txtGLcode.value;
    window.document.frmTrans.hdn194NAccNo.value = window.document.frmTrans.txtAccNo.value;
    window.document.frmTrans.hdn194NName.value = window.document.frmTrans.txtAccNm.value;
    window.document.frmTrans.hdn194NBatchno.value = BatchNo[0];
    window.document.frmTrans.hdn194NTranno.value = BatchNo[3];
    window.document.frmTrans.hdn194NAmount.value = '-' + window.document.frmTrans.hdn194Nfinaltds.value;
    window.document.frmTrans.hdn194NModeOfTran.value = "3";
    window.document.frmTrans.hdn194NLnkModID.value = "<%=str194Nmodid%>";
    window.document.frmTrans.hdn194NLnkGlcode.value = "<%=str194Nglcode%>";
    window.document.frmTrans.hdn194NLnkAccno.value = "<%=str194Naccno%>";
    window.document.frmTrans.hdn194NRemarks.value = '194N Tax Ded  From ' + window.document.frmTrans.hdn194NFromDate.value + ' To  ' + window.document.frmTrans.hdn194NToDate.value

    TextMatrix(flxRowCnt, 26) = window.document.frmTrans.txtModDesc.value;// for Module Desc
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    //	TextMatrix(flxRowCnt,28)=window.document.frmTrans.cmdcleartype.value;//clearing type

    TextMatrix(flxRowCnt, 32) = "<%=str194Nmodid%>";//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = "<%=str194NModDesc%>";//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = "<%=str194Nglcode%>";//lnkglcode
    TextMatrix(flxRowCnt, 35) = "<%=str194Ngldesc%>";//lnkgldesc
    TextMatrix(flxRowCnt, 36) = ""//lnkacctype
    TextMatrix(flxRowCnt, 37) = "<%=str194Naccno%>";//lnkaccno
    TextMatrix(flxRowCnt, 38) = "<%=str194Naccname%>";//lnkaccname 

    TextMatrix(flxRowCnt, 39) = "1" //Service Id Value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y" //For ABB Trans, make sys generated y/n = Y
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e, Disposals YN.
    TextMatrix(flxRowCnt, 50) = excpYN // Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes// Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"//Standing Instructions YN.

    if ((vMode == "REC") || (vMode == "PAY")) {
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Should be replaced with Counter No.
      TextMatrix(flxRowCnt, 56) = vCashierId;//Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scroll No
    }
  }
  sumDrCr(flxRowCnt, "ADD")

}

function FlexPopulate194N(BatchNo) {

  //depIntacccond=true
  if (eval(window.document.frmTrans.hdn194Nfinaltds.value == 0)) {
    return
  }
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1


  with (window.document.frmTrans.Mfgpaydt) {

    var BatchNo = BatchNo.split('~')

    TextMatrix(flxRowCnt, 0) = BatchNo[0];
    TextMatrix(flxRowCnt, 1) = BatchNo[4];

    TextMatrix(flxRowCnt, 2) = "<%=str194Nglcode%>"
    TextMatrix(flxRowCnt, 3) = "<%=str194Ngldesc%>"
    TextMatrix(flxRowCnt, 4) = "<%=str194Naccno%>"
    TextMatrix(flxRowCnt, 5) = "<%=str194Naccname%>"


    TextMatrix(flxRowCnt, 10) = "4"
    TextMatrix(flxRowCnt, 11) = "Cr Trasfer"
    TextMatrix(flxRowCnt, 6) = window.document.frmTrans.hdn194Nfinaltds.value;
    Col = 6;
    Row = flxRowCnt;
    //CellForeColor="<%'=vbblue%>"
    CellForeColor = 16711680
    if ((window.document.frmTrans.txtCustId.value == "") || (window.document.frmTrans.txtCustId.value == "undefined")) {
      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
        TextMatrix(flxRowCnt, 9) = ""
      }
      else {
        TextMatrix(flxRowCnt, 9) = "1111111111"
      }

    }
    else {
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtCustId.value;
    }
    TextMatrix(flxRowCnt, 19) = window.document.frmTrans.txtTokenNo.value;

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = "<%=str194Nmodid%>"//ModIdule Id value;
    //code commented by Radhika on 20 may 2008
    //Reason: Branch of commission entry should be logged in user branch
    //TextMatrix(flxRowCnt,18)=window.document.frmTrans.txtbranchcode.value;
    TextMatrix(flxRowCnt, 18) = vBranchCode
    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;
    TextMatrix(flxRowCnt, 24) = '194N';
    //---------------Code Modified by Monica(15-DEC-2009)--------------			
    if (window.document.frmTrans.txtModId.value == "REM") {
      TextMatrix(flxRowCnt, 25) = "N"  //System generated Y/N = "Y"
    }
    else {
      TextMatrix(flxRowCnt, 25) = "Y"  //System generated Y/N = "Y"
    }



    TextMatrix(flxRowCnt, 26) = "<%=str194NModDesc%>"// for Module Desc
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    //	TextMatrix(flxRowCnt,28)=window.document.frmTrans.cmdcleartype.value;//clearing type

    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value;//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value;//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value;//lnkglcode
    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value;//lnkgldesc
    TextMatrix(flxRowCnt, 36) = ""//lnkacctype
    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value;//lnkaccno
    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value;//lnkaccname 

    TextMatrix(flxRowCnt, 39) = "1" //Service Id Value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y" //For ABB Trans, make sys generated y/n = Y
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e, Disposals YN.
    TextMatrix(flxRowCnt, 50) = excpYN // Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes// Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"//Standing Instructions YN.

    if ((vMode == "REC") || (vMode == "PAY")) {
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Should be replaced with Counter No.
      TextMatrix(flxRowCnt, 56) = vCashierId;//Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scroll No
    }
  }
  sumDrCr(flxRowCnt, "ADD")

}

function FlexPopulateclgret(BatchNo2) {

  if (eval(window.document.frmTrans.txtAmt.value == 0)) {
    return
  }


  var BatchNo1 = BatchNo2.split('~')
  var strarrbatchno = BatchNo1[0].split('*')  // for batchno and tranno
  var clgretval = BatchNo1[1].split('*') // for commission ,GST ,cess and totdramt 

  var strbatchno = strarrbatchno[0]
  var strtranno1 = strarrbatchno[1]
  var strtrancomm = strarrbatchno[2]
  var strtrancgst = strarrbatchno[3]
  var strtransgst = strarrbatchno[4]
  var strtrancess = strarrbatchno[5]

  var strcommaccno = clgretval[0]
  var strcommaccname = clgretval[1]
  var strcommglcode = clgretval[2]
  var strcommgldesc = clgretval[3]
  var strcommmodid = clgretval[4]
  var strcommmoddesc = clgretval[5]
  var strcommamt = clgretval[6]
  var strgstyn = clgretval[7]
  var strgstamt = clgretval[8]
  var strcessyn = clgretval[9]
  var strcessamt = clgretval[10]
  var strcommyn = clgretval[11]
  var strtotdtamt = clgretval[12]
  strtotdtamt = -1 * parseFloat(strtotdtamt)

  var strcgstmodesc1 = "<%=strcgstmoddesc%>"
  var strsgstmodesc1 = "<%=strsgstmoddesc%>"
  var strcessmodesc1 = "<%=strcessmoddesc%>"


  var strnoncustomerid = '1111111111'

  window.document.frmTrans.hidClgRetComm.value = strcommamt
  window.document.frmTrans.hidClgRetCgst.value = eval(eval(strgstamt) / 2)
  window.document.frmTrans.hidClgRetSgst.value = eval(eval(strgstamt) / 2)
  window.document.frmTrans.hidClgRetCess.value = strcessamt
  window.document.frmTrans.hidClgRetGSTTaxval.value = eval(strcommamt) + eval(window.document.frmTrans.hidClgRetCgst.value) + eval(window.document.frmTrans.hidClgRetSgst.value) + eval(strcessamt)
  window.document.frmTrans.hidClgRetCust.value = window.document.frmTrans.hdnCLGcustid.value
  window.document.frmTrans.hidClgRetGSTYN.value = strgstyn

  var strRemarksDr
  if (strgstyn == "Y") {
    strRemarksDr = 'Clearing Return Charges ChqNo ' + window.document.frmTrans.txtChqNo.value + ' Inclusive GST'
  }
  else {
    strRemarksDr = 'Clearing Return Charges ChqNo ' + window.document.frmTrans.txtChqNo.value
  }

  var strRemarksCr
  strRemarksCr = 'Clearing Return Charges ChqNo ' + window.document.frmTrans.txtChqNo.value

  // glcode
  if (clgretval[2] == "") {
    alert("Please Set Clearing Return Charges GL Code From System Control -> Wizards ")
    TempTranInsrtclgret("Transaction Failed", 1, "1")

    return
  }

  // Accno
  if (clgretval[0] == "") {
    alert("Please Set Clearing Return Charges Acc No From System Control -> Wizards ")
    TempTranInsrtclgret("Transaction Failed", 1, "1")
    return
  }


  // charges 
  if (clgretval[6] == "0") {
    alert("Please Set Clearing Return Charges Amount From System Control -> Wizards ")
    TempTranInsrtclgret("Transaction Failed", 1, "1")
    return
  }


  if (strcommyn == "Y") {

    with (window.document.frmTrans.Mfgpaydt) {
      //-------------------------------------------debit ---------	
      if (eval(strtotdtamt) != 0) {
        var flxRowCnt2 = window.document.frmTrans.Mfgpaydt.Rows
        window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt2 + 1

        TextMatrix(flxRowCnt2, 0) = strbatchno;
        TextMatrix(flxRowCnt2, 1) = strtranno1;
        TextMatrix(flxRowCnt2, 2) = window.document.frmTrans.txtCLGGLcode.value;
        TextMatrix(flxRowCnt2, 3) = window.document.frmTrans.txtCLGGLname.value;
        TextMatrix(flxRowCnt2, 4) = window.document.frmTrans.txtCLGAccNo.value;
        TextMatrix(flxRowCnt2, 5) = window.document.frmTrans.txtCLGAccNm.value;

        TextMatrix(flxRowCnt2, 6) = strtotdtamt;
        CellForeColor = 255
        TextMatrix(flxRowCnt2, 8) = "<%=session("Applicationdate")%>";
        TextMatrix(flxRowCnt2, 9) = window.document.frmTrans.hdnCLGcustid.value
        TextMatrix(flxRowCnt2, 10) = "3"
        TextMatrix(flxRowCnt2, 11) = "Dr"
        TextMatrix(flxRowCnt2, 13) = 'P';
        TextMatrix(flxRowCnt2, 14) = window.document.frmTrans.txtcurrencycode.value;
        TextMatrix(flxRowCnt2, 15) = strsessionflds[0];
        TextMatrix(flxRowCnt2, 16) = strsessionflds[8];
        TextMatrix(flxRowCnt2, 17) = window.document.frmTrans.txtCLGModId.value.toUpperCase();
        window.document.frmTrans.hidClgRetRemarks.value = window.document.frmTrans.txtCLGModId.value.toUpperCase() + ' Accno ' + window.document.frmTrans.txtCLGAccNo.value
        TextMatrix(flxRowCnt2, 18) = window.document.frmTrans.txtbranchcode.value;
        TextMatrix(flxRowCnt2, 20) = strRemarksDr;
        TextMatrix(flxRowCnt2, 24) = "IRC";
        TextMatrix(flxRowCnt2, 25) = "Y" //System generated Y/N = "Y"
        TextMatrix(flxRowCnt2, 26) = window.document.frmTrans.txtCLGModDesc.value;
        TextMatrix(flxRowCnt2, 27) = window.document.frmTrans.txtEffDate.value;
        TextMatrix(flxRowCnt2, 32) = strcommmodid//lnkmoduleid
        TextMatrix(flxRowCnt2, 33) = strcommmoddesc//lnkmoduledesc
        TextMatrix(flxRowCnt2, 34) = strcommglcode//lnkglcode
        TextMatrix(flxRowCnt2, 35) = strcommgldesc//lnkgldesc
        TextMatrix(flxRowCnt2, 37) = strcommaccno//lnkaccno
        TextMatrix(flxRowCnt2, 38) = strcommaccname//lnkaccname 
        TextMatrix(flxRowCnt2, 39) = "1"
        TextMatrix(flxRowCnt2, 40) = "TRANSACTION"
        if (window.document.frmTrans.chkABB.checked == false) {
          TextMatrix(flxRowCnt2, 8) = strsessionflds[1]; //Application Date
          TextMatrix(flxRowCnt2, 100) = "N"  //ABB Transaction Y/N = No	
          TextMatrix(flxRowCnt3, 18) = window.document.frmTrans.txtbranchcode.value;
        }
        else {
          if (clgAbbimpyn == "Y") {
            if (window.document.frmTrans.txtbranchcode.value == "<%=session("branchcode")%>")
            {
              TextMatrix(flxRowCnt2, 45) = ""
              TextMatrix(flxRowCnt2, 46) = window.document.frmTrans.txtbranchdesc.value;
              TextMatrix(flxRowCnt2, 8) = "<%=session("Applicationdate")%>"; //abbApplDt;
              TextMatrix(flxRowCnt2, 12) = "" //Application Date as ABB Appl Dt
              TextMatrix(flxRowCnt2, 100) = "N"  //to identify that current Transaction is a ABB Transaction
            }
				else
            {
              TextMatrix(flxRowCnt2, 45) = vBranchCode
              TextMatrix(flxRowCnt2, 46) = window.document.frmTrans.txtbranchdesc.value;
              TextMatrix(flxRowCnt2, 8) = "<%=session("Applicationdate")%>"; //abbApplDt;
              TextMatrix(flxRowCnt2, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
              TextMatrix(flxRowCnt2, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
            }
          }
          else {
            TextMatrix(flxRowCnt2, 45) = vBranchCode
            TextMatrix(flxRowCnt2, 46) = window.document.frmTrans.txtbranchdesc.value;
            TextMatrix(flxRowCnt2, 8) = "<%=session("Applicationdate")%>"; //abbApplDt;
            TextMatrix(flxRowCnt2, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
            TextMatrix(flxRowCnt2, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
          }

        }
        TextMatrix(flxRowCnt2, 49) = "N" //Account Check YN i.e Disposals.
        TextMatrix(flxRowCnt2, 50) = excpYN //Exception YN.
        TextMatrix(flxRowCnt2, 51) = excpCodes // Exception Codes.
        TextMatrix(flxRowCnt2, 54) = "N"  // Standing Instructions YN.
      } // strtotdtamt	

      if (eval(strcommamt) != 0) {
        //start----------------------------PL MODULE---------------Credit ---------	 commission

        var flxRowCnt3 = window.document.frmTrans.Mfgpaydt.Rows
        window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt3 + 1

        TextMatrix(flxRowCnt3, 0) = strbatchno;  // batchno 
        TextMatrix(flxRowCnt3, 1) = strtrancomm; // tranno
        TextMatrix(flxRowCnt3, 2) = strcommglcode; // glcode
        TextMatrix(flxRowCnt3, 3) = strcommgldesc; //gldescription
        TextMatrix(flxRowCnt3, 4) = strcommaccno; // accno
        TextMatrix(flxRowCnt3, 5) = strcommaccname; // accname
        TextMatrix(flxRowCnt3, 6) = strcommamt;	// amount	
        TextMatrix(flxRowCnt3, 8) = "<%=session("Applicationdate")%>";
        TextMatrix(flxRowCnt3, 9) = strnoncustomerid;	// non customerid 
        TextMatrix(flxRowCnt3, 10) = "4"
        TextMatrix(flxRowCnt3, 11) = "Cr"
        TextMatrix(flxRowCnt3, 13) = 'P';
        TextMatrix(flxRowCnt3, 14) = window.document.frmTrans.txtcurrencycode.value;
        TextMatrix(flxRowCnt3, 15) = strsessionflds[0];
        TextMatrix(flxRowCnt3, 16) = strsessionflds[8];
        TextMatrix(flxRowCnt3, 17) = strcommmodid;
        TextMatrix(flxRowCnt3, 18) = window.document.frmTrans.txtbranchcode.value;
        TextMatrix(flxRowCnt3, 20) = strRemarksCr;
        TextMatrix(flxRowCnt3, 24) = "IRC";
        TextMatrix(flxRowCnt3, 25) = "Y"  //System generated Y/N = "Y"
        TextMatrix(flxRowCnt3, 26) = strcommmoddesc; // module description
        TextMatrix(flxRowCnt3, 27) = window.document.frmTrans.txtEffDate.value;
        TextMatrix(flxRowCnt3, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
        TextMatrix(flxRowCnt3, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
        TextMatrix(flxRowCnt3, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
        TextMatrix(flxRowCnt3, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
        TextMatrix(flxRowCnt3, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
        TextMatrix(flxRowCnt3, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
        TextMatrix(flxRowCnt3, 39) = "1";
        TextMatrix(flxRowCnt3, 40) = "TRANSACTION";
        if (window.document.frmTrans.chkABB.checked == false) {
          TextMatrix(flxRowCnt3, 8) = strsessionflds[1]; //Application Date
          TextMatrix(flxRowCnt3, 100) = "N"  //ABB Transaction Y/N = No	
          TextMatrix(flxRowCnt3, 18) = window.document.frmTrans.txtbranchcode.value;
        }
        else {
          if (clgAbbimpyn == "Y") {
            if (window.document.frmTrans.txtbranchcode.value == "<%=session("branchcode")%>")
            {
              TextMatrix(flxRowCnt3, 18) = window.document.frmTrans.txtbranchcode.value;
              TextMatrix(flxRowCnt3, 45) = ""
              TextMatrix(flxRowCnt3, 46) = window.document.frmTrans.txtbranchdesc.value;
              TextMatrix(flxRowCnt3, 8) = "<%=session("Applicationdate")%>"; //abbApplDt;
              TextMatrix(flxRowCnt3, 12) = ""; //Application Date as ABB Appl Dt
              TextMatrix(flxRowCnt3, 100) = "N"  //to identify that current Transaction is a ABB Transaction
            }
				else
            {
              TextMatrix(flxRowCnt3, 18) = "<%=session("branchcode")%>";
              TextMatrix(flxRowCnt3, 45) = vBranchCode
              TextMatrix(flxRowCnt3, 46) = window.document.frmTrans.txtbranchdesc.value;
              TextMatrix(flxRowCnt3, 8) = "<%=session("Applicationdate")%>"; //abbApplDt;
              TextMatrix(flxRowCnt3, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
              TextMatrix(flxRowCnt3, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
            }
          }
          else {
            TextMatrix(flxRowCnt3, 18) = window.document.frmTrans.txtbranchcode.value;
            TextMatrix(flxRowCnt3, 45) = vBranchCode
            TextMatrix(flxRowCnt3, 46) = window.document.frmTrans.txtbranchdesc.value;
            TextMatrix(flxRowCnt3, 8) = "<%=session("Applicationdate")%>"; //abbApplDt;
            TextMatrix(flxRowCnt3, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
            TextMatrix(flxRowCnt3, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
          }


        }
        TextMatrix(flxRowCnt3, 49) = "N" //Account Check YN i.e Disposals.
        TextMatrix(flxRowCnt3, 50) = excpYN //Exception YN.
        TextMatrix(flxRowCnt3, 51) = excpCodes // Exception Codes.
        TextMatrix(flxRowCnt3, 54) = "N"  // Standing Instructions YN.

        //end ---------------------------PL MODULE---------------Credit ---------	 commission
      } // commamt 



      if (strgstyn == "Y") {
        if (eval(strgstamt) != 0) {
          // start ----------------------------MISC MODULE---------------Credit ---------	 CGST

          var strcgstmodid = "<%=cmod%>"
          var strcgstglcode = "<%=cgl%>"
          var strcgstgldesc = "<%=cgldes%>"
          var strcgstaccno = "<%=cacc%>"
          var strcgstaccname = "<%=caccnam%>"
          var strcgstamt = eval(eval(strgstamt) / 2)
          var flxRowCntcgst = window.document.frmTrans.Mfgpaydt.Rows
          window.document.frmTrans.Mfgpaydt.Rows = flxRowCntcgst + 1

          TextMatrix(flxRowCntcgst, 0) = strbatchno;  // batchno 
          TextMatrix(flxRowCntcgst, 1) = strtrancgst; // tranno
          TextMatrix(flxRowCntcgst, 2) = strcgstglcode; // glcode
          TextMatrix(flxRowCntcgst, 3) = strcgstgldesc; //gldescription
          TextMatrix(flxRowCntcgst, 4) = strcgstaccno; // accno
          TextMatrix(flxRowCntcgst, 5) = strcgstaccname; // accname
          TextMatrix(flxRowCntcgst, 6) = strcgstamt;	// amount
          TextMatrix(flxRowCntcgst, 8) = "<%=session("Applicationdate")%>";
          TextMatrix(flxRowCntcgst, 9) = strnoncustomerid;	// non customerid 
          TextMatrix(flxRowCntcgst, 10) = "4"
          TextMatrix(flxRowCntcgst, 11) = "Cr"
          TextMatrix(flxRowCntcgst, 13) = 'P';
          TextMatrix(flxRowCntcgst, 14) = window.document.frmTrans.txtcurrencycode.value;
          TextMatrix(flxRowCntcgst, 15) = strsessionflds[0];
          TextMatrix(flxRowCntcgst, 16) = strsessionflds[8];
          TextMatrix(flxRowCntcgst, 17) = strcgstmodid; // module id 
          //TextMatrix(flxRowCntcgst,18)=window.document.frmTrans.txtbranchcode.value;
          TextMatrix(flxRowCntcgst, 20) = strRemarksCr;
          TextMatrix(flxRowCntcgst, 24) = "CGST";
          TextMatrix(flxRowCntcgst, 25) = "Y"  //System generated Y/N = "Y"
          TextMatrix(flxRowCntcgst, 26) = strcgstmodesc1; // module description
          TextMatrix(flxRowCntcgst, 27) = window.document.frmTrans.txtEffDate.value;
          TextMatrix(flxRowCntcgst, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
          TextMatrix(flxRowCntcgst, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
          TextMatrix(flxRowCntcgst, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
          TextMatrix(flxRowCntcgst, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
          TextMatrix(flxRowCntcgst, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
          TextMatrix(flxRowCntcgst, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
          TextMatrix(flxRowCntcgst, 39) = "1";
          TextMatrix(flxRowCntcgst, 40) = "TRANSACTION";
          if (window.document.frmTrans.chkABB.checked == false) {
            TextMatrix(flxRowCntcgst, 8) = strsessionflds[1]; //Application Date
            TextMatrix(flxRowCntcgst, 100) = "N"  //ABB Transaction Y/N = No		    
          }
          else {

            if (clgAbbimpyn == "Y") {
              if (window.document.frmTrans.txtbranchcode.value == "<%=session("branchcode")%>")
              {
                TextMatrix(flxRowCntcgst, 18) = window.document.frmTrans.txtbranchcode.value;
                TextMatrix(flxRowCntcgst, 45) = ""
                TextMatrix(flxRowCntcgst, 46) = window.document.frmTrans.txtbranchdesc.value;
                TextMatrix(flxRowCntcgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntcgst,8)=abbApplDt;
                TextMatrix(flxRowCntcgst, 12) = ""; //Application Date as ABB Appl Dt
                TextMatrix(flxRowCntcgst, 100) = "N"  //to identify that current Transaction is a ABB Transaction
              }
				else
              {
                TextMatrix(flxRowCntcgst, 18) = "<%=session("branchcode")%>";
                TextMatrix(flxRowCntcgst, 45) = vBranchCode
                TextMatrix(flxRowCntcgst, 46) = window.document.frmTrans.txtbranchdesc.value;
                TextMatrix(flxRowCntcgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntcgst,8)=abbApplDt;
                TextMatrix(flxRowCntcgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
                TextMatrix(flxRowCntcgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
              }
            }
            else {
              TextMatrix(flxRowCntcgst, 18) = window.document.frmTrans.txtbranchcode.value;
              TextMatrix(flxRowCntcgst, 45) = vBranchCode
              TextMatrix(flxRowCntcgst, 46) = window.document.frmTrans.txtbranchdesc.value;
              TextMatrix(flxRowCntcgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntcgst,8)=abbApplDt;
              TextMatrix(flxRowCntcgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
              TextMatrix(flxRowCntcgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
            }

          }
          TextMatrix(flxRowCntcgst, 49) = "N" //Account Check YN i.e Disposals.
          TextMatrix(flxRowCntcgst, 50) = excpYN //Exception YN.
          TextMatrix(flxRowCntcgst, 51) = excpCodes // Exception Codes.
          TextMatrix(flxRowCntcgst, 54) = "N"  // Standing Instructions YN.

          // end ----------------------------MISC MODULE---------------Credit ---------	 CGST

          // start ----------------------------MISC MODULE---------------Credit ---------	 SGST


          var strsgstmodid = "<%=smod%>"
          var strsgstglcode = "<%=sgl%>"
          var strsgstgldesc = "<%=sgldes%>"
          var strsgstaccno = "<%=sacc%>"
          var strsgstaccname = "<%=saccnm%>"

          var strsgstamt = eval(eval(strgstamt) / 2)
          var flxRowCntsgst = window.document.frmTrans.Mfgpaydt.Rows
          window.document.frmTrans.Mfgpaydt.Rows = flxRowCntsgst + 1

          TextMatrix(flxRowCntsgst, 0) = strbatchno;  // batchno 
          TextMatrix(flxRowCntsgst, 1) = strtransgst; // tranno
          TextMatrix(flxRowCntsgst, 2) = strsgstglcode; // glcode
          TextMatrix(flxRowCntsgst, 3) = strsgstgldesc; //gldescription
          TextMatrix(flxRowCntsgst, 4) = strsgstaccno; // accno
          TextMatrix(flxRowCntsgst, 5) = strsgstaccname; // accname
          TextMatrix(flxRowCntsgst, 6) = strsgstamt;	// amount
          TextMatrix(flxRowCntsgst, 8) = "<%=session("Applicationdate")%>";
          TextMatrix(flxRowCntsgst, 9) = strnoncustomerid;	// non customerid 	
          TextMatrix(flxRowCntsgst, 10) = "4"
          TextMatrix(flxRowCntsgst, 11) = "Cr"
          TextMatrix(flxRowCntsgst, 13) = 'P';
          TextMatrix(flxRowCntsgst, 14) = window.document.frmTrans.txtcurrencycode.value;
          TextMatrix(flxRowCntsgst, 15) = strsessionflds[0];
          TextMatrix(flxRowCntsgst, 16) = strsessionflds[8];
          TextMatrix(flxRowCntsgst, 17) = strsgstmodid; // module id 
          //TextMatrix(flxRowCntsgst,18)=window.document.frmTrans.txtbranchcode.value;
          TextMatrix(flxRowCntsgst, 20) = strRemarksCr;
          TextMatrix(flxRowCntsgst, 24) = "SGST";
          TextMatrix(flxRowCntsgst, 25) = "Y"  //System generated Y/N = "Y"
          TextMatrix(flxRowCntsgst, 26) = strsgstmodesc1; // module description
          TextMatrix(flxRowCntsgst, 27) = window.document.frmTrans.txtEffDate.value;
          TextMatrix(flxRowCntsgst, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
          TextMatrix(flxRowCntsgst, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
          TextMatrix(flxRowCntsgst, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
          TextMatrix(flxRowCntsgst, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
          TextMatrix(flxRowCntsgst, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
          TextMatrix(flxRowCntsgst, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
          TextMatrix(flxRowCntsgst, 39) = "1";
          TextMatrix(flxRowCntsgst, 40) = "TRANSACTION";
          if (window.document.frmTrans.chkABB.checked == false) {
            TextMatrix(flxRowCntsgst, 8) = strsessionflds[1]; //Application Date
            TextMatrix(flxRowCntsgst, 100) = "N"  //ABB Transaction Y/N = No		    
          }
          else {
            if (clgAbbimpyn == "Y") {
              if (window.document.frmTrans.txtbranchcode.value == "<%=session("branchcode")%>")
              {
                TextMatrix(flxRowCntsgst, 18) = window.document.frmTrans.txtbranchcode.value;
                TextMatrix(flxRowCntsgst, 45) = ""
                TextMatrix(flxRowCntsgst, 46) = window.document.frmTrans.txtbranchdesc.value;
                TextMatrix(flxRowCntsgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntsgst,8)=abbApplDt;
                TextMatrix(flxRowCntsgst, 12) = ""; //Application Date as ABB Appl Dt
                TextMatrix(flxRowCntsgst, 100) = "N"  //to identify that current Transaction is a ABB Transaction
              }
				else
              {
                TextMatrix(flxRowCntsgst, 18) = "<%=session("branchcode")%>";
                TextMatrix(flxRowCntsgst, 45) = vBranchCode
                TextMatrix(flxRowCntsgst, 46) = window.document.frmTrans.txtbranchdesc.value;
                TextMatrix(flxRowCntsgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntsgst,8)=abbApplDt;
                TextMatrix(flxRowCntsgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
                TextMatrix(flxRowCntsgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
              }
            }
            else {
              TextMatrix(flxRowCntsgst, 18) = window.document.frmTrans.txtbranchcode.value;
              TextMatrix(flxRowCntsgst, 45) = vBranchCode
              TextMatrix(flxRowCntsgst, 46) = window.document.frmTrans.txtbranchdesc.value;
              TextMatrix(flxRowCntsgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntsgst,8)=abbApplDt;
              TextMatrix(flxRowCntsgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
              TextMatrix(flxRowCntsgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
            }

          }
          TextMatrix(flxRowCntsgst, 49) = "N" //Account Check YN i.e Disposals.
          TextMatrix(flxRowCntsgst, 50) = excpYN //Exception YN.
          TextMatrix(flxRowCntsgst, 51) = excpCodes // Exception Codes.
          TextMatrix(flxRowCntsgst, 54) = "N"  // Standing Instructions YN.

          // end ----------------------------MISC MODULE---------------Credit ---------	 SGST
        } // gstamt


        if (strcessyn == "Y") {
          if (eval(strcessamt) != 0) {
            // start ----------------------------MISC MODULE---------------Credit ---------	 CESS


            var strcessmodid = "<%=csmod%>"
            var strcessglcode = "<%=csgl%>"
            var strcessgldesc = "<%=csgldes%>"
            var stcessaccno = "<%=csacc%>"
            var strcessaccname = "<%=csaccnm%>"


            var flxRowCntsgst = window.document.frmTrans.Mfgpaydt.Rows
            window.document.frmTrans.Mfgpaydt.Rows = flxRowCntsgst + 1

            TextMatrix(flxRowCntsgst, 0) = strbatchno;  // batchno 
            TextMatrix(flxRowCntsgst, 1) = strtrancess; // tranno
            TextMatrix(flxRowCntsgst, 2) = strcessglcode; // glcode
            TextMatrix(flxRowCntsgst, 3) = strcessgldesc; //gldescription
            TextMatrix(flxRowCntsgst, 4) = stcessaccno; // accno
            TextMatrix(flxRowCntsgst, 5) = strcessaccname; // accname
            TextMatrix(flxRowCntsgst, 6) = strcessamt;	// amount	
            TextMatrix(flxRowCntsgst, 8) = "<%=session("Applicationdate")%>";
            TextMatrix(flxRowCntsgst, 9) = strnoncustomerid;	// non customerid 
            TextMatrix(flxRowCntsgst, 10) = "4"
            TextMatrix(flxRowCntsgst, 11) = "Cr"
            TextMatrix(flxRowCntsgst, 13) = 'P';
            TextMatrix(flxRowCntsgst, 14) = window.document.frmTrans.txtcurrencycode.value;
            TextMatrix(flxRowCntsgst, 15) = strsessionflds[0];
            TextMatrix(flxRowCntsgst, 16) = strsessionflds[8];
            TextMatrix(flxRowCntsgst, 17) = strcessmodid; // module id 
            //TextMatrix(flxRowCntsgst,18)=window.document.frmTrans.txtbranchcode.value;
            TextMatrix(flxRowCntsgst, 20) = strRemarksCr;
            TextMatrix(flxRowCntsgst, 24) = "CESS";
            TextMatrix(flxRowCntsgst, 25) = "Y"  //System generated Y/N = "Y"
            TextMatrix(flxRowCntsgst, 26) = strcessmodesc1; // module description
            TextMatrix(flxRowCntsgst, 27) = window.document.frmTrans.txtEffDate.value;
            TextMatrix(flxRowCntsgst, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
            TextMatrix(flxRowCntsgst, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
            TextMatrix(flxRowCntsgst, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
            TextMatrix(flxRowCntsgst, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
            TextMatrix(flxRowCntsgst, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
            TextMatrix(flxRowCntsgst, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
            TextMatrix(flxRowCntsgst, 39) = "1";
            TextMatrix(flxRowCntsgst, 40) = "TRANSACTION";
            if (window.document.frmTrans.chkABB.checked == false) {
              TextMatrix(flxRowCntsgst, 8) = strsessionflds[1]; //Application Date
              TextMatrix(flxRowCntsgst, 100) = "N"  //ABB Transaction Y/N = No		    
            }
            else {
              if (clgAbbimpyn == "Y") {
                if (window.document.frmTrans.txtbranchcode.value == "<%=session("branchcode")%>")
                {
                  TextMatrix(flxRowCntsgst, 18) = window.document.frmTrans.txtbranchcode.value;
                  TextMatrix(flxRowCntsgst, 45) = ""
                  TextMatrix(flxRowCntsgst, 46) = window.document.frmTrans.txtbranchdesc.value;
                  TextMatrix(flxRowCntsgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntsgst,8)=abbApplDt;
                  TextMatrix(flxRowCntsgst, 12) = ""; //Application Date as ABB Appl Dt
                  TextMatrix(flxRowCntsgst, 100) = "N"  //to identify that current Transaction is a ABB Transaction
                }
				else
                {
                  TextMatrix(flxRowCntsgst, 18) = "<%=session("branchcode")%>";
                  TextMatrix(flxRowCntsgst, 45) = vBranchCode
                  TextMatrix(flxRowCntsgst, 46) = window.document.frmTrans.txtbranchdesc.value;
                  TextMatrix(flxRowCntsgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntsgst,8)=abbApplDt;
                  TextMatrix(flxRowCntsgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
                  TextMatrix(flxRowCntsgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
                }
              }
              else {
                TextMatrix(flxRowCntsgst, 18) = window.document.frmTrans.txtbranchcode.value;
                TextMatrix(flxRowCntsgst, 45) = vBranchCode
                TextMatrix(flxRowCntsgst, 46) = window.document.frmTrans.txtbranchdesc.value;
                TextMatrix(flxRowCntsgst, 8) = "<%=session("Applicationdate")%>";	 //TextMatrix(flxRowCntsgst,8)=abbApplDt;
                TextMatrix(flxRowCntsgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
                TextMatrix(flxRowCntsgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
              }

            }
            TextMatrix(flxRowCntsgst, 49) = "N" //Account Check YN i.e Disposals.
            TextMatrix(flxRowCntsgst, 50) = excpYN //Exception YN.
            TextMatrix(flxRowCntsgst, 51) = excpCodes // Exception Codes.
            TextMatrix(flxRowCntsgst, 54) = "N"  // Standing Instructions YN.

            // end ----------------------------MISC MODULE---------------Credit ---------	 CESS
          } // cessamt
        } // cessyn	
      } //gstyn
    } // flex grid 
  }// commyn 
  // to insert in gentemptranslog

  flexRowInsert(1, "Y")

}

function FlexPopulateRemCanc(BatchNo2) {

  if (eval(window.document.frmTrans.txtAmt.value == 0)) {
    return
  }

  var BatchNo1 = BatchNo2.split('~')
  var strarrbatchno = BatchNo1[0].split('*')  // for batchno and tranno
  var clgretval = BatchNo1[1].split('*') // for commission ,GST ,cess 

  var strbatchno = strarrbatchno[0]
  var strtranno = strarrbatchno[1]
  var strtrancomm = strarrbatchno[2]
  var strtrancgst = strarrbatchno[3]
  var strtransgst = strarrbatchno[4]
  var strtrancess = strarrbatchno[5]

  var strcommaccno = clgretval[0]
  var strcommaccname = clgretval[1]
  var strcommglcode = clgretval[2]
  var strcommgldesc = clgretval[3]
  var strcommmodid = clgretval[4]
  var strcommmoddesc = clgretval[5]
  var strcommamt = window.document.frmTrans.txtremchgsamt.value
  var strgstyn = "<%= strRemCancGSTYN%>"
  var strgstamt = window.document.frmTrans.txtremgstamt.value
  var strcessyn = "<%= strRemCancCESSYN%>"
  var strcessamt = window.document.frmTrans.txtremcessamt.value
  var strcommyn = "<%= strRemCancCommYN%>"
  var strRemCancAutoChrgsYN1 = "<%=strRemCancAutoChrgsYN%>"
  var strcgstmodesc1 = "<%=strcgstmoddesc%>"
  var strsgstmodesc1 = "<%=strsgstmoddesc%>"
  var strcessmodesc1 = "<%=strcessmoddesc%>"



  var strnoncustomerid = '1111111111'

  window.document.frmTrans.hidRemCancComm.value = strcommamt
  window.document.frmTrans.hidRemCancCgst.value = eval(eval(strgstamt) / 2)
  window.document.frmTrans.hidRemCancSgst.value = eval(eval(strgstamt) / 2)
  window.document.frmTrans.hidRemCancCess.value = strcessamt
  window.document.frmTrans.hidRemCancGSTTaxval.value = eval(strcommamt) + eval(window.document.frmTrans.hidRemCancCgst.value) + eval(window.document.frmTrans.hidRemCancSgst.value) + eval(strcessamt)
  window.document.frmTrans.hidRemCancCust.value = ""
  window.document.frmTrans.hidRemCancGSTYN.value = strgstyn



  var strRemarksDr
  if (strgstyn == "Y") {
    strRemarksDr = 'Remittance Cancellation Charges Inclusive GST'
  }
  else {
    strRemarksDr = 'Remittance Cancellation Charges'
  }

  var strRemarksCr
  strRemarksCr = 'Remittance Cancellation Charges'

  // glcode
  if (clgretval[2] == "") {
    alert("Please Set Remitance Cancellation From System Control -> Wizards ")
    TempTranInsrtclgret("Transaction Failed", 1, "1")

    return
  }

  // Accno
  if (clgretval[0] == "") {
    alert("Please Set Remittance Cancellation Accno From System Control -> Wizards ")
    TempTranInsrtclgret("Transaction Failed", 1, "1")
    return
  }



  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1


  with (window.document.frmTrans.Mfgpaydt) {

    // --------------------debit remarks ---------------------------------

    TextMatrix(flxRowCnt, 0) = strbatchno;
    TextMatrix(flxRowCnt, 1) = strtranno;
    TextMatrix(flxRowCnt, 2) = window.document.frmTrans.txtGLcode.value;
    TextMatrix(flxRowCnt, 3) = window.document.frmTrans.txtGLDesc.value;
    TextMatrix(flxRowCnt, 4) = window.document.frmTrans.txtAccNo.value;
    TextMatrix(flxRowCnt, 5) = window.document.frmTrans.txtAccNm.value;
    window.document.frmTrans.hidRemCancRemarks.value = window.document.frmTrans.txtGLcode.value
    //alert(vMode)			
    if (vMode == "TRANS") {
      if (trnMode == "3" || trnMode == "5") {

        TextMatrix(flxRowCnt, 6) = '-' + window.document.frmTrans.txtAmt.value;
        Col = 6;
        Row = flxRowCnt;
        //CellForeColor="<%'=vbred%>"   
        CellForeColor = 255
      }
      else if (trnMode == "4") {
        TextMatrix(flxRowCnt, 6) = window.document.frmTrans.txtAmt.value;
        Col = 6;
        Row = flxRowCnt;
        //CellForeColor="<%'=vbblue%>"
        CellForeColor = 16711680
      }
    }
    else if (vMode == "REC") {
      TextMatrix(flxRowCnt, 6) = window.document.frmTrans.txtAmt.value;
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>"  
      CellForeColor = 16711680

    }
    else if (vMode == "PAY") {
      TextMatrix(flxRowCnt, 6) = "-" + window.document.frmTrans.txtAmt.value;
      TextMatrix(flxRowCnt, 19) = window.document.frmTrans.txtTokenNo.value;
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbred%>"   
      CellForeColor = 255

      window.document.frmTrans.hidGSTval.value = window.document.frmTrans.txtGstin.value;
    }

    TextMatrix(flxRowCnt, 7) = window.document.frmTrans.txtNetBal.value;
    TextMatrix(flxRowCnt, 8) = "<%=session("Applicationdate")%>";

    if (window.document.frmTrans.txtCustId.value == "") {
      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
        TextMatrix(flxRowCnt, 9) = ""
      }
      else {
        TextMatrix(flxRowCnt, 9) = strnoncustomerid
      }

    }
    else {
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtCustId.value;
    }
    TextMatrix(flxRowCnt, 10) = trnMode
    TextMatrix(flxRowCnt, 11) = trnDesc

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = window.document.frmTrans.txtModId.value;
    TextMatrix(flxRowCnt, 18) = window.document.frmTrans.txtbranchcode.value;
    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;
    //TextMatrix(flxRowCnt,21)=window.document.frmTrans.txtChqSrs.value;
    TextMatrix(flxRowCnt, 21) = ""
    TextMatrix(flxRowCnt, 22) = window.document.frmTrans.txtChqNo.value;
    TextMatrix(flxRowCnt, 23) = window.document.frmTrans.txtChqDt.value;
    TextMatrix(flxRowCnt, 24) = window.document.frmTrans.txtChqFVG.value;
    TextMatrix(flxRowCnt, 25) = "N"
    TextMatrix(flxRowCnt, 26) = window.document.frmTrans.txtModDesc.value;
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    if (TextMatrix(flxRowCnt, 17) == "REM") {
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
      TextMatrix(flxRowCnt, 5) = window.document.frmTrans.txtfavgdr.value;
    }

    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtLnkModId.value//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtLnkModDesc.value//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtLnkGLCode.value//lnkglcode
    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtLnkGLname.value//lnkgldesc
    TextMatrix(flxRowCnt, 36) = window.document.frmTrans.txtLnkAcctype.value//lnkacctype
    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtLnkAccNo.value//lnkaccno
    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtLnkAccNm.value//lnkaccname 

    TextMatrix(flxRowCnt, 39) = window.document.frmTrans.txtServiceId.value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;

    if (blnFlagAutoClose == true) {
      TextMatrix(flxRowCnt, 39) = "4";
      TextMatrix(flxRowCnt, 40) = "ACCOUNT CLOSING";
    }

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No		    
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y"  //System generated Y/N = "Y"
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e Disposals.
    TextMatrix(flxRowCnt, 50) = excpYN //Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes // Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"  // Standing Instructions YN.

    if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC")) {
      if (window.document.frmTrans.tranmode(0).checked == true) {
        if (window.document.frmTrans.chkCheque.checked == true) {


          if (scts == "Y") {
            TextMatrix(flxRowCnt, 63) = window.document.frmTrans.cboChqType.value
          }
          else {
            TextMatrix(flxRowCnt, 63) = ""
          }
        }
      }
    }
    if ("<%=session("module ")%>"== "CLG")
    {
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.cboChqType.value
    }
    if ((vMode == "REC") || (vMode == "PAY")) {
      //if(vMode=="REC"){
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Counter No. for that Cashier.
      TextMatrix(flxRowCnt, 56) = vCashierId; //Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scrollNo.
    }
    //for Forex Transactions

    if (fxTransYN == "Y") {
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmbFRateType.options
      [window.document.frmTrans.cmbFRateType.selectedIndex].value
      TextMatrix(flxRowCnt, 29) = window.document.frmTrans.txtFRate.value
      TextMatrix(flxRowCnt, 30) = window.document.frmTrans.txtFCurCode.value
      TextMatrix(flxRowCnt, 31) = window.document.frmTrans.txtFAmount.value
      TextMatrix(flxRowCnt, 58) = window.document.frmTrans.txtFRateRefCode.value
      TextMatrix(flxRowCnt, 59) = window.document.frmTrans.txtFRateRefDesc.value
    }
    TranMode()
    if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "1") || (TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5"))) {
      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtbybnkcode.value;
      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtbybnkdesc.value;
      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtbybrcode.value;
      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtbybrdesc.value;
      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavgdr.value;
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtinstrno.value;

      if (TextMatrix(flxRowCnt, 10) == "5") {
        TextMatrix(flxRowCnt, 8) = "<%=session("Applicationdate")%>";
        TextMatrix(flxRowCnt, 24) = window.document.frmTrans.txtfavgdr.value;
        TextMatrix(flxRowCnt, 22) = window.document.frmTrans.txtinstrno.value;
        TextMatrix(flxRowCnt, 23) = window.document.frmTrans.txtinstrdt.value;
        TextMatrix(flxRowCnt, 20) = "InWard Clearing"
      }

      TextMatrix(0, 64) = "Advice Rec"
      if (remtype != "ADD") {
        TextMatrix(flxRowCnt, 64) = natadv
        natadv = ""
        TextMatrix(flxRowCnt, 68) = remtype
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "Y"
        remtype = ""
        if (natinsdt != "") {
          TextMatrix(flxRowCnt, 67) = natinsdt
        }
        else {
          natinsdt = window.document.frmTrans.txtinstrdt.value;
        }
        TextMatrix(flxRowCnt, 67) = natinsdt
        natinsdt = ""
      }
      else {
        TextMatrix(flxRowCnt, 64) = remadv[0]
        TextMatrix(flxRowCnt, 65) = remadv[1]

        //TextMatrix(flxRowCnt,66)=remadv[2]
        TextMatrix(flxRowCnt, 66) = remadvdate
        TextMatrix(flxRowCnt, 68) = remtype
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "N"
        remtype = ""
        TextMatrix(0, 69) = "Native"
        TextMatrix(flxRowCnt, 69) = "N"
        if (advinstrdate != "") {

          TextMatrix(flxRowCnt, 67) = advinstrdate
        }
        else {
          advinstrdate = window.document.frmTrans.txtinstrdt.value;
        }
        TextMatrix(flxRowCnt, 67) = advinstrdate
        advinstrdate = ""
      }
    }

    sumDrCr(flxRowCnt, "ADD")
    OkClear()
    mode = "ADD"


    if ((strRemCancAutoChrgsYN1 == "Y") && (strcommyn == "Y")) {
      if (eval(strcommamt) != 0) {
        //start----------------------------PL MODULE---------------Credit ---------	 commission

        var flxRowCnt3 = window.document.frmTrans.Mfgpaydt.Rows
        window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt3 + 1

        TextMatrix(flxRowCnt3, 0) = strbatchno;  // batchno 
        TextMatrix(flxRowCnt3, 1) = strtrancomm; // tranno
        TextMatrix(flxRowCnt3, 2) = strcommglcode; // glcode
        TextMatrix(flxRowCnt3, 3) = strcommgldesc; //gldescription
        TextMatrix(flxRowCnt3, 4) = strcommaccno; // accno
        TextMatrix(flxRowCnt3, 5) = strcommaccname; // accname
        TextMatrix(flxRowCnt3, 6) = strcommamt;	// amount		
        TextMatrix(flxRowCnt3, 9) = strnoncustomerid;	// non customerid 
        TextMatrix(flxRowCnt3, 10) = "4"
        TextMatrix(flxRowCnt3, 11) = "Cr Transfer"
        TextMatrix(flxRowCnt3, 13) = 'P';
        TextMatrix(flxRowCnt3, 14) = window.document.frmTrans.txtcurrencycode.value;
        TextMatrix(flxRowCnt3, 15) = strsessionflds[0];
        TextMatrix(flxRowCnt3, 16) = strsessionflds[8];
        TextMatrix(flxRowCnt3, 17) = strcommmodid;
        TextMatrix(flxRowCnt3, 18) = window.document.frmTrans.txtbranchcode.value;
        TextMatrix(flxRowCnt3, 20) = strRemarksCr;
        TextMatrix(flxRowCnt3, 24) = "CANC";
        TextMatrix(flxRowCnt3, 25) = "Y"  //System generated Y/N = "Y"
        //TextMatrix(flxRowCnt3,26)=strcommmoddesc; // module description
        TextMatrix(flxRowCnt3, 27) = window.document.frmTrans.txtEffDate.value;
        TextMatrix(flxRowCnt3, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
        TextMatrix(flxRowCnt3, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
        TextMatrix(flxRowCnt3, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
        TextMatrix(flxRowCnt3, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
        TextMatrix(flxRowCnt3, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
        TextMatrix(flxRowCnt3, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
        TextMatrix(flxRowCnt3, 39) = "1";
        TextMatrix(flxRowCnt3, 40) = "TRANSACTION";
        if (window.document.frmTrans.chkABB.checked == false) {
          TextMatrix(flxRowCnt3, 8) = strsessionflds[1]; //Application Date
          TextMatrix(flxRowCnt3, 100) = "N"  //ABB Transaction Y/N = No		    
        }
        else {
          TextMatrix(flxRowCnt3, 45) = vBranchCode
          TextMatrix(flxRowCnt3, 46) = window.document.frmTrans.txtbranchdesc.value;
          TextMatrix(flxRowCnt3, 8) = abbApplDt;
          TextMatrix(flxRowCnt3, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
          TextMatrix(flxRowCnt3, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
        }
        TextMatrix(flxRowCnt3, 49) = "N" //Account Check YN i.e Disposals.
        TextMatrix(flxRowCnt3, 50) = excpYN //Exception YN.
        TextMatrix(flxRowCnt3, 51) = excpCodes // Exception Codes.
        TextMatrix(flxRowCnt3, 54) = "N"  // Standing Instructions YN.

        sumDrCr(flxRowCnt3, "ADD")
        //flexRowInsert(flxRowCnt3,"Y")
        //end ---------------------------PL MODULE---------------Credit ---------	 commission

      } // commamt 



      if (strgstyn == "Y") {
        if (eval(strgstamt) != 0) {
          // start ----------------------------MISC MODULE---------------Credit ---------	 CGST

          var strcgstmodid = "<%=cmod%>"
          var strcgstglcode = "<%=cgl%>"
          var strcgstgldesc = "<%=cgldes%>"
          var strcgstaccno = "<%=cacc%>"
          var strcgstaccname = "<%=caccnam%>"
          var strcgstamt = eval(eval(strgstamt) / 2)
          var flxRowCntcgst = window.document.frmTrans.Mfgpaydt.Rows
          window.document.frmTrans.Mfgpaydt.Rows = flxRowCntcgst + 1

          TextMatrix(flxRowCntcgst, 0) = strbatchno;  // batchno 
          TextMatrix(flxRowCntcgst, 1) = strtrancgst; // tranno
          TextMatrix(flxRowCntcgst, 2) = strcgstglcode; // glcode
          TextMatrix(flxRowCntcgst, 3) = strcgstgldesc; //gldescription
          TextMatrix(flxRowCntcgst, 4) = strcgstaccno; // accno
          TextMatrix(flxRowCntcgst, 5) = strcgstaccname; // accname
          TextMatrix(flxRowCntcgst, 6) = strcgstamt;	// amount		
          TextMatrix(flxRowCntcgst, 9) = strnoncustomerid;	// non customerid 
          TextMatrix(flxRowCntcgst, 10) = "4"
          TextMatrix(flxRowCntcgst, 11) = "Cr Transfer"
          TextMatrix(flxRowCntcgst, 13) = 'P';
          TextMatrix(flxRowCntcgst, 14) = window.document.frmTrans.txtcurrencycode.value;
          TextMatrix(flxRowCntcgst, 15) = strsessionflds[0];
          TextMatrix(flxRowCntcgst, 16) = strsessionflds[8];
          TextMatrix(flxRowCntcgst, 17) = strcgstmodid; // module id 
          TextMatrix(flxRowCntcgst, 18) = window.document.frmTrans.txtbranchcode.value;
          TextMatrix(flxRowCntcgst, 20) = strRemarksCr;
          TextMatrix(flxRowCntcgst, 24) = "CGST";
          TextMatrix(flxRowCntcgst, 25) = "Y"  //System generated Y/N = "Y"
          TextMatrix(flxRowCntcgst, 26) = strcgstmodesc1; // module description
          TextMatrix(flxRowCntcgst, 27) = window.document.frmTrans.txtEffDate.value;
          TextMatrix(flxRowCntcgst, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
          TextMatrix(flxRowCntcgst, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
          TextMatrix(flxRowCntcgst, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
          TextMatrix(flxRowCntcgst, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
          TextMatrix(flxRowCntcgst, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
          TextMatrix(flxRowCntcgst, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
          TextMatrix(flxRowCntcgst, 39) = "1";
          TextMatrix(flxRowCntcgst, 40) = "TRANSACTION";
          if (window.document.frmTrans.chkABB.checked == false) {
            TextMatrix(flxRowCntcgst, 8) = strsessionflds[1]; //Application Date
            TextMatrix(flxRowCntcgst, 100) = "N"  //ABB Transaction Y/N = No		    
          }
          else {
            TextMatrix(flxRowCntcgst, 45) = vBranchCode
            TextMatrix(flxRowCntcgst, 46) = window.document.frmTrans.txtbranchdesc.value;
            TextMatrix(flxRowCntcgst, 8) = abbApplDt;
            TextMatrix(flxRowCntcgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
            TextMatrix(flxRowCntcgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
          }
          TextMatrix(flxRowCntcgst, 49) = "N" //Account Check YN i.e Disposals.
          TextMatrix(flxRowCntcgst, 50) = excpYN //Exception YN.
          TextMatrix(flxRowCntcgst, 51) = excpCodes // Exception Codes.
          TextMatrix(flxRowCntcgst, 54) = "N"  // Standing Instructions YN.

          sumDrCr(flxRowCntcgst, "ADD")
          //	flexRowInsert(flxRowCntcgst,"Y")
          // end ----------------------------MISC MODULE---------------Credit ---------	 CGST

          // start ----------------------------MISC MODULE---------------Credit ---------	 SGST


          var strsgstmodid = "<%=smod%>"
          var strsgstglcode = "<%=sgl%>"
          var strsgstgldesc = "<%=sgldes%>"
          var strsgstaccno = "<%=sacc%>"
          var strsgstaccname = "<%=saccnm%>"

          var strsgstamt = eval(eval(strgstamt) / 2)
          var flxRowCntsgst = window.document.frmTrans.Mfgpaydt.Rows
          window.document.frmTrans.Mfgpaydt.Rows = flxRowCntsgst + 1

          TextMatrix(flxRowCntsgst, 0) = strbatchno;  // batchno 
          TextMatrix(flxRowCntsgst, 1) = strtransgst; // tranno
          TextMatrix(flxRowCntsgst, 2) = strsgstglcode; // glcode
          TextMatrix(flxRowCntsgst, 3) = strsgstgldesc; //gldescription
          TextMatrix(flxRowCntsgst, 4) = strsgstaccno; // accno
          TextMatrix(flxRowCntsgst, 5) = strsgstaccname; // accname
          TextMatrix(flxRowCntsgst, 6) = strsgstamt;	// amount	
          TextMatrix(flxRowCntsgst, 9) = strnoncustomerid;	// non customerid 	
          TextMatrix(flxRowCntsgst, 10) = "4"
          TextMatrix(flxRowCntsgst, 11) = "Cr Transfer"
          TextMatrix(flxRowCntsgst, 13) = 'P';
          TextMatrix(flxRowCntsgst, 14) = window.document.frmTrans.txtcurrencycode.value;
          TextMatrix(flxRowCntsgst, 15) = strsessionflds[0];
          TextMatrix(flxRowCntsgst, 16) = strsessionflds[8];
          TextMatrix(flxRowCntsgst, 17) = strsgstmodid; // module id 
          TextMatrix(flxRowCntsgst, 18) = window.document.frmTrans.txtbranchcode.value;
          TextMatrix(flxRowCntsgst, 20) = strRemarksCr;
          TextMatrix(flxRowCntsgst, 24) = "SGST";
          TextMatrix(flxRowCntsgst, 25) = "Y"  //System generated Y/N = "Y"
          TextMatrix(flxRowCntsgst, 26) = strsgstmodesc1; // module description
          TextMatrix(flxRowCntsgst, 27) = window.document.frmTrans.txtEffDate.value;
          TextMatrix(flxRowCntsgst, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
          TextMatrix(flxRowCntsgst, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
          TextMatrix(flxRowCntsgst, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
          TextMatrix(flxRowCntsgst, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
          TextMatrix(flxRowCntsgst, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
          TextMatrix(flxRowCntsgst, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
          TextMatrix(flxRowCntsgst, 39) = "1";
          TextMatrix(flxRowCntsgst, 40) = "TRANSACTION";
          if (window.document.frmTrans.chkABB.checked == false) {
            TextMatrix(flxRowCntsgst, 8) = strsessionflds[1]; //Application Date
            TextMatrix(flxRowCntsgst, 100) = "N"  //ABB Transaction Y/N = No		    
          }
          else {
            TextMatrix(flxRowCntsgst, 45) = vBranchCode
            TextMatrix(flxRowCntsgst, 46) = window.document.frmTrans.txtbranchdesc.value;
            TextMatrix(flxRowCntsgst, 8) = abbApplDt;
            TextMatrix(flxRowCntsgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
            TextMatrix(flxRowCntsgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
          }
          TextMatrix(flxRowCntsgst, 49) = "N" //Account Check YN i.e Disposals.
          TextMatrix(flxRowCntsgst, 50) = excpYN //Exception YN.
          TextMatrix(flxRowCntsgst, 51) = excpCodes // Exception Codes.
          TextMatrix(flxRowCntsgst, 54) = "N"  // Standing Instructions YN.

          sumDrCr(flxRowCntsgst, "ADD")
          //	flexRowInsert(flxRowCntsgst,"Y")
          // end ----------------------------MISC MODULE---------------Credit ---------	 SGST
        } // gstamt


        if (strcessyn == "Y") {
          if (eval(strcessamt) != 0) {
            // start ----------------------------MISC MODULE---------------Credit ---------	 CESS


            var strcessmodid = "<%=csmod%>"
            var strcessglcode = "<%=csgl%>"
            var strcessgldesc = "<%=csgldes%>"
            var stcessaccno = "<%=csacc%>"
            var strcessaccname = "<%=csaccnm%>"


            var flxRowCntsgst = window.document.frmTrans.Mfgpaydt.Rows
            window.document.frmTrans.Mfgpaydt.Rows = flxRowCntsgst + 1

            TextMatrix(flxRowCntsgst, 0) = strbatchno;  // batchno 
            TextMatrix(flxRowCntsgst, 1) = strtrancess; // tranno
            TextMatrix(flxRowCntsgst, 2) = strcessglcode; // glcode
            TextMatrix(flxRowCntsgst, 3) = strcessgldesc; //gldescription
            TextMatrix(flxRowCntsgst, 4) = stcessaccno; // accno
            TextMatrix(flxRowCntsgst, 5) = strcessaccname; // accname
            TextMatrix(flxRowCntsgst, 6) = strcessamt;	// amount		
            TextMatrix(flxRowCntsgst, 9) = strnoncustomerid;	// non customerid 
            TextMatrix(flxRowCntsgst, 10) = "4"
            TextMatrix(flxRowCntsgst, 11) = "Cr Transfer"
            TextMatrix(flxRowCntsgst, 13) = 'P';
            TextMatrix(flxRowCntsgst, 14) = window.document.frmTrans.txtcurrencycode.value;
            TextMatrix(flxRowCntsgst, 15) = strsessionflds[0];
            TextMatrix(flxRowCntsgst, 16) = strsessionflds[8];
            TextMatrix(flxRowCntsgst, 17) = strcessmodid; // module id 
            TextMatrix(flxRowCntsgst, 18) = window.document.frmTrans.txtbranchcode.value;
            TextMatrix(flxRowCntsgst, 20) = strRemarksCr;
            TextMatrix(flxRowCntsgst, 24) = "CESS";
            TextMatrix(flxRowCntsgst, 25) = "Y"  //System generated Y/N = "Y"
            TextMatrix(flxRowCntsgst, 26) = strcessmodesc1; // module description
            TextMatrix(flxRowCntsgst, 27) = window.document.frmTrans.txtEffDate.value;
            TextMatrix(flxRowCntsgst, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
            TextMatrix(flxRowCntsgst, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
            TextMatrix(flxRowCntsgst, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
            TextMatrix(flxRowCntsgst, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
            TextMatrix(flxRowCntsgst, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
            TextMatrix(flxRowCntsgst, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
            TextMatrix(flxRowCntsgst, 39) = "1";
            TextMatrix(flxRowCntsgst, 40) = "TRANSACTION";
            if (window.document.frmTrans.chkABB.checked == false) {
              TextMatrix(flxRowCntsgst, 8) = strsessionflds[1]; //Application Date
              TextMatrix(flxRowCntsgst, 100) = "N"  //ABB Transaction Y/N = No		    
            }
            else {
              TextMatrix(flxRowCntsgst, 45) = vBranchCode
              TextMatrix(flxRowCntsgst, 46) = window.document.frmTrans.txtbranchdesc.value;
              TextMatrix(flxRowCntsgst, 8) = abbApplDt;
              TextMatrix(flxRowCntsgst, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
              TextMatrix(flxRowCntsgst, 100) = "Y"  //to identify that current Transaction is a ABB Transaction
            }
            TextMatrix(flxRowCntsgst, 49) = "N" //Account Check YN i.e Disposals.
            TextMatrix(flxRowCntsgst, 50) = excpYN //Exception YN.
            TextMatrix(flxRowCntsgst, 51) = excpCodes // Exception Codes.
            TextMatrix(flxRowCntsgst, 54) = "N"  // Standing Instructions YN.

            sumDrCr(flxRowCntsgst, "ADD")

            // end ----------------------------MISC MODULE---------------Credit ---------	 CESS
          } // cessamt
        } // cessyn	
      } //gstyn
    } //((strRemCancAutoChrgsYN1 == "Y") && (strcommyn == "Y"))	

  } // MSFLEXGGRID 

  // precision
  PrecDrCr()
  // to insert in gentemptranslog
  //alert("flxRowCnt " + flxRowCnt)
  flexRowInsert(flxRowCnt, "Y")

}


//----------------------------------------------------------------------------------
function Populate(BatchNo, flxRowCnt) {
  depIntacccond = true
  //alert("populate" + BatchNo)
  branchCurrCode()

  var BatchNo = BatchNo.split('~')

  //-------------------------------------------General		
  with (window.document.frmTrans.Mfgpaydt) {
    TextMatrix(flxRowCnt, 0) = BatchNo[0];
    TextMatrix(flxRowCnt, 1) = BatchNo[1];
    TextMatrix(flxRowCnt, 2) = window.document.frmTrans.txtGLcode.value;
    TextMatrix(flxRowCnt, 3) = window.document.frmTrans.txtGLDesc.value;
    TextMatrix(flxRowCnt, 4) = window.document.frmTrans.txtAccNo.value;
    TextMatrix(flxRowCnt, 5) = window.document.frmTrans.txtAccNm.value;

    //alert(vMode)			
    if (vMode == "TRANS") {
      if (trnMode == "3" || trnMode == "5") {

        TextMatrix(flxRowCnt, 6) = '-' + window.document.frmTrans.txtAmt.value;
        Col = 6;
        Row = flxRowCnt;
        //CellForeColor="<%'=vbred%>"   
        CellForeColor = 255
      }
      else if (trnMode == "4") {
        TextMatrix(flxRowCnt, 6) = window.document.frmTrans.txtAmt.value;
        Col = 6;
        Row = flxRowCnt;
        //CellForeColor="<%'=vbblue%>"
        CellForeColor = 16711680
      }
    }
    else if (vMode == "REC") {
      TextMatrix(flxRowCnt, 6) = window.document.frmTrans.txtAmt.value;
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>"  
      CellForeColor = 16711680

    }
    else if (vMode == "PAY") {
      TextMatrix(flxRowCnt, 6) = "-" + window.document.frmTrans.txtAmt.value;
      TextMatrix(flxRowCnt, 19) = window.document.frmTrans.txtTokenNo.value;
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbred%>"   
      CellForeColor = 255

      window.document.frmTrans.hidGSTval.value = window.document.frmTrans.txtGstin.value;
    }

    TextMatrix(flxRowCnt, 7) = window.document.frmTrans.txtNetBal.value;


    if ((window.document.frmTrans.txtCustId.value == "") || (window.document.frmTrans.txtCustId.value == "undefined")) {
      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
        TextMatrix(flxRowCnt, 9) = ""
      }
      else {
        TextMatrix(flxRowCnt, 9) = "1111111111"
      }

    }
    else {
      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtCustId.value;
    }
    TextMatrix(flxRowCnt, 10) = trnMode
    TextMatrix(flxRowCnt, 11) = trnDesc

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = window.document.frmTrans.txtModId.value;
    if (clgAbbimpyn == "Y") {
      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
        TextMatrix(flxRowCnt, 18) = "<%=session("branchcode")%>"
      }
      else {
        TextMatrix(flxRowCnt, 18) = window.document.frmTrans.txtbranchcode.value;
      }
    }
    else {
      TextMatrix(flxRowCnt, 18) = window.document.frmTrans.txtbranchcode.value;
    }

    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;
    //TextMatrix(flxRowCnt,21)=window.document.frmTrans.txtChqSrs.value;
    TextMatrix(flxRowCnt, 21) = ""
    TextMatrix(flxRowCnt, 22) = window.document.frmTrans.txtChqNo.value;
    TextMatrix(flxRowCnt, 23) = window.document.frmTrans.txtChqDt.value;
    if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true') && (window.document.frmTrans.hdn194Nfinaltds.value != 0)) {
      TextMatrix(flxRowCnt, 24) = '194N';
    }
    else {
      TextMatrix(flxRowCnt, 24) = window.document.frmTrans.txtChqFVG.value;
    }

    TextMatrix(flxRowCnt, 25) = "N"
    TextMatrix(flxRowCnt, 26) = window.document.frmTrans.txtModDesc.value;
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    if (TextMatrix(flxRowCnt, 17) == "REM") {
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
      TextMatrix(flxRowCnt, 5) = window.document.frmTrans.txtfavgdr.value;
      window.document.frmTrans.hidRemRemarks.value = 'Remittance Charges ' + window.document.frmTrans.txtGLcode.value
    }

    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtLnkModId.value//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtLnkModDesc.value//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtLnkGLCode.value//lnkglcode
    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtLnkGLname.value//lnkgldesc
    TextMatrix(flxRowCnt, 36) = window.document.frmTrans.txtLnkAcctype.value//lnkacctype
    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtLnkAccNo.value//lnkaccno
    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtLnkAccNm.value//lnkaccname 

    TextMatrix(flxRowCnt, 39) = window.document.frmTrans.txtServiceId.value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;


    // threshold limit cross

    if ((window.document.frmTrans.tranmode(1).checked == true) && ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA")) && (window.document.frmTrans.hdnchkthreshlmt.value == "true")) {

      var st1
      window.document.frames['iPost'].frmPost.hdnthreslmtcrs.value = ""
      st1 = window.document.frmTrans.txtbranchcode.value + "|" + window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtModId.value + "|" + window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value + "|" + BatchNo[0] + "|" + BatchNo[1]

      window.document.frames['iPost'].frmPost.hdnthreslmtcrs.value = st1
    }


    // sb ca account closing

    if ((window.document.frmTrans.tranmode(0).checked == true) && (window.document.frmTrans.txtServiceId.value == "4") && ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA"))) {

      window.document.frames['iPost'].frmPost.hdnSBCAAccClose.value = ""
      var st1
      st1 = window.document.frmTrans.txtbranchcode.value + "|" + window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtModId.value + "|" + window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value

      window.document.frames['iPost'].frmPost.hdnSBCAAccClose.value = st1

    }






    if (blnFlagAutoClose == true) {
      TextMatrix(flxRowCnt, 39) = "4";
      TextMatrix(flxRowCnt, 40) = "ACCOUNT CLOSING";
    }

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No		    
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y"  //System generated Y/N = "Y"
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e Disposals.
    TextMatrix(flxRowCnt, 50) = excpYN //Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes // Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"  // Standing Instructions YN.

    if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC")) {
      if (window.document.frmTrans.tranmode(0).checked == true) {
        if (window.document.frmTrans.chkCheque.checked == true) {


          if (scts == "Y") {
            TextMatrix(flxRowCnt, 63) = window.document.frmTrans.cboChqType.value
          }
          else {
            TextMatrix(flxRowCnt, 63) = ""
          }
        }
      }
    }
    if ("<%=session("module ")%>"== "CLG")
    {
      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.cboChqType.value
    }
    if ((vMode == "REC") || (vMode == "PAY")) {
      //if(vMode=="REC"){
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Counter No. for that Cashier.
      TextMatrix(flxRowCnt, 56) = vCashierId; //Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scrollNo.
    }
    //for Forex Transactions

    if (fxTransYN == "Y") {
      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmbFRateType.options
      [window.document.frmTrans.cmbFRateType.selectedIndex].value
      TextMatrix(flxRowCnt, 29) = window.document.frmTrans.txtFRate.value
      TextMatrix(flxRowCnt, 30) = window.document.frmTrans.txtFCurCode.value
      TextMatrix(flxRowCnt, 31) = window.document.frmTrans.txtFAmount.value
      TextMatrix(flxRowCnt, 58) = window.document.frmTrans.txtFRateRefCode.value
      TextMatrix(flxRowCnt, 59) = window.document.frmTrans.txtFRateRefDesc.value
    }
  }

  sumDrCr(flxRowCnt, "ADD")

}

//----------------------------------------------------------------------------------	
function FlexPopulateCash(BatchNo) {

  if (eval(window.document.frmTrans.txtAmt.value == 0)) {
    return
  }
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1

  with (window.document.frmTrans.Mfgpaydt) {

    var BatchNo = BatchNo.split('~')

    TextMatrix(flxRowCnt, 0) = BatchNo[0];


    TextMatrix(flxRowCnt, 2) = vCashGlCode
    TextMatrix(flxRowCnt, 3) = vCashGldesc

    if (vMode == "REC") {
      TextMatrix(flxRowCnt, 10) = "1"
      TextMatrix(flxRowCnt, 11) = "Dr Cash"

      if (((window.document.frmTrans.txtModId.value == "REM") || (window.document.frmTrans.txtModId.value == "FXREM")) && (trnMode == "2")) {
        if ((eval(window.document.frmTrans.txtcomm.value) > 0) &&
          (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) &&
          (eval(window.document.frmTrans.txtCessChrg.value) > 0)) {
          //TextMatrix(flxRowCnt,1)=BatchNo[4];
          TextMatrix(flxRowCnt, 1) = BatchNo[6];
          TextMatrix(flxRowCnt, 6) = '-' +
            eval(eval(window.document.frmTrans.txtAmt.value) +
              eval(window.document.frmTrans.txtcomm.value) +
              eval(window.document.frmTrans.txtSerivceChrg.value) +
              eval(window.document.frmTrans.txtCessChrg.value));
        }
        else if ((eval(window.document.frmTrans.txtcomm.value) > 0) &&
          (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
          TextMatrix(flxRowCnt, 1) = BatchNo[5];
          TextMatrix(flxRowCnt, 6) = '-' +
            eval(eval(window.document.frmTrans.txtAmt.value) +
              eval(window.document.frmTrans.txtcomm.value) +
              eval(window.document.frmTrans.txtSerivceChrg.value));
        }
        else if (eval(window.document.frmTrans.txtcomm.value) > 0) {
          TextMatrix(flxRowCnt, 1) = BatchNo[3];
          TextMatrix(flxRowCnt, 6) = '-' + eval(eval(window.document.frmTrans.txtAmt.value) + eval(window.document.frmTrans.txtcomm.value));
        }
        else if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
          TextMatrix(flxRowCnt, 1) = BatchNo[3];
          TextMatrix(flxRowCnt, 6) = '-' + eval(eval(window.document.frmTrans.txtAmt.value) + eval(window.document.frmTrans.txtSerivceChrg.value));
        }
        else if (eval(window.document.frmTrans.txtCessChrg.value) > 0) {
          TextMatrix(flxRowCnt, 1) = BatchNo[3];
          TextMatrix(flxRowCnt, 6) = '-' + eval(eval(window.document.frmTrans.txtAmt.value) + eval(window.document.frmTrans.txtCessChrg.value));
        }
        else {
          TextMatrix(flxRowCnt, 1) = BatchNo[2];
          TextMatrix(flxRowCnt, 6) = '-' + window.document.frmTrans.txtAmt.value;
        }

        TextMatrix(flxRowCnt, 6) = gridprecision(TextMatrix(flxRowCnt, 6),
          window.document.frmTrans.hpr.value)
      }
      else {
        TextMatrix(flxRowCnt, 1) = BatchNo[2];
        TextMatrix(flxRowCnt, 6) = '-' + window.document.frmTrans.txtAmt.value;
      }

      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbred%>"  
      CellForeColor = 255
    }
    else if (vMode == "PAY") {
      TextMatrix(flxRowCnt, 1) = BatchNo[2];
      TextMatrix(flxRowCnt, 10) = "2"
      TextMatrix(flxRowCnt, 11) = "Cr Cash"
      TextMatrix(flxRowCnt, 6) = window.document.frmTrans.txtAmt.value;
      TextMatrix(flxRowCnt, 19) = window.document.frmTrans.txtTokenNo.value;
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>"   
    }

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = "CASH"
    //code commented by Radhika on 20 may 2008
    //Reason: Branch of cah entry should be logged in user branch
    //TextMatrix(flxRowCnt,18)=window.document.frmTrans.txtbranchcode.value;
    TextMatrix(flxRowCnt, 18) = vBranchCode;
    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;

    if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true') && (window.document.frmTrans.hdn194Nfinaltds.value != 0)) {
      TextMatrix(flxRowCnt, 24) = '194N';
    }
    TextMatrix(flxRowCnt, 25) = "Y"
    //}
    //--------Code Modified by Monica(14-DEC-09)---------------
    TextMatrix(flxRowCnt, 26) = "Cash"
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value;//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value;//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value;//lnkglcode
    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value;//lnkgldesc
    TextMatrix(flxRowCnt, 36) = ""//lnkacctype
    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value;//lnkaccno
    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value;//lnkaccname 

    TextMatrix(flxRowCnt, 39) = "1" //ServiceId value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y" //System Generated y/N = "YES"   
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e, Disposal Transaction YN.
    TextMatrix(flxRowCnt, 50) = excpYN // Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes //Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"//Standing Instructions YN.
    if (vMode == "REC") {
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Counter No. for that Cashier.
      TextMatrix(flxRowCnt, 56) = vCashierId;//Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scroll No.
    }
    if (vSubMode == "TPAY") {
      TextMatrix(flxRowCnt, 79) = "TPAY"
    }
  }

  sumDrCr(flxRowCnt, "ADD")

  if (window.document.frmTrans.mfgDisp.Rows > 1) {
    alert("hi7")
    PrecDrCr()
    flexRowInsert(flxRowCnt, "Y")
  }

}
//----------------------------------------------------------------------------------
function FlexPopulateComm(BatchNo) {

  //depIntacccond=true
  if (eval(window.document.frmTrans.txtAmt.value == 0)) {
    return
  }
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1


  with (window.document.frmTrans.Mfgpaydt) {

    var BatchNo = BatchNo.split('~')

    TextMatrix(flxRowCnt, 0) = BatchNo[0];
    TextMatrix(flxRowCnt, 1) = BatchNo[2];

    TextMatrix(flxRowCnt, 2) = comglcode
    TextMatrix(flxRowCnt, 3) = comgldesc
    TextMatrix(flxRowCnt, 4) = commaccno
    TextMatrix(flxRowCnt, 5) = SrvChrgAccname

    if (vMode == "TRANS") {
      TextMatrix(flxRowCnt, 10) = "4"
      TextMatrix(flxRowCnt, 11) = "Cr Trasfer"
      TextMatrix(flxRowCnt, 6) = window.document.frmTrans.txtcomm.value;
      window.document.frmTrans.hidComm.value = eval(window.document.frmTrans.hidComm.value) + eval(window.document.frmTrans.txtcomm.value);
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>"
      CellForeColor = 16711680
    }
    else if (vMode == "REC") {
      TextMatrix(flxRowCnt, 10) = "2"
      TextMatrix(flxRowCnt, 11) = "Cr Cash"
      TextMatrix(flxRowCnt, 6) = window.document.frmTrans.txtcomm.value//window.document.frmTrans.txtAmt.value;
      window.document.frmTrans.hidComm.value = eval(window.document.frmTrans.hidComm.value) + eval(window.document.frmTrans.txtcomm.value);
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>" 
      CellForeColor = 16711680
    }

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = commodid//ModIdule Id value;
    //code commented by Radhika on 20 may 2008
    //Reason: Branch of commission entry should be logged in user branch
    //TextMatrix(flxRowCnt,18)=window.document.frmTrans.txtbranchcode.value;
    TextMatrix(flxRowCnt, 18) = vBranchCode
    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;

    //---------------Code Modified by Monica(15-DEC-2009)--------------			
    if (window.document.frmTrans.txtModId.value == "REM") {
      TextMatrix(flxRowCnt, 25) = "N"  //System generated Y/N = "Y"
    }
    else {
      TextMatrix(flxRowCnt, 25) = "Y"  //System generated Y/N = "Y"
    }
    //---------------Code Modified by Monica(15-DEC-2009)--------------	
    //TextMatrix(flxRowCnt,25)="Y"


    TextMatrix(flxRowCnt, 26) = commodid//"Cash" for Module Desc
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    //	TextMatrix(flxRowCnt,28)=window.document.frmTrans.cmdcleartype.value;//clearing type

    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value;//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value;//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value;//lnkglcode
    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value;//lnkgldesc
    TextMatrix(flxRowCnt, 36) = ""//lnkacctype
    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value;//lnkaccno
    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value;//lnkaccname 

    TextMatrix(flxRowCnt, 39) = "1" //Service Id Value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y" //For ABB Trans, make sys generated y/n = Y
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e, Disposals YN.
    TextMatrix(flxRowCnt, 50) = excpYN // Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes// Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"//Standing Instructions YN.

    if ((vMode == "REC") || (vMode == "PAY")) {
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Should be replaced with Counter No.
      TextMatrix(flxRowCnt, 56) = vCashierId;//Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scroll No
    }
  }
  sumDrCr(flxRowCnt, "ADD")

}

//----------------------------------------------------------------------------------
function FlexPopulateSrvCharge(BatchNo) {

  //depIntacccond=true

  SrvChrgmodid = "<%=cmod%>"
  SrvChrgGLcode = "<%=cgl%>"
  SrvChrgGLdesc = "<%=cgldes%>"
  SrvChrgAccno = "<%=cacc%>"
  SrvChrgAccname = "<%=caccnam%>"

  if (eval(window.document.frmTrans.txtAmt.value == 0)) {
    return
  }
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1


  with (window.document.frmTrans.Mfgpaydt) {

    var BatchNo = BatchNo.split('~')

    TextMatrix(flxRowCnt, 0) = BatchNo[0];
    if (eval(window.document.frmTrans.txtcomm.value == 0))
      TextMatrix(flxRowCnt, 1) = BatchNo[2];
    else
      TextMatrix(flxRowCnt, 1) = BatchNo[3];

    TextMatrix(flxRowCnt, 2) = SrvChrgGLcode
    TextMatrix(flxRowCnt, 3) = SrvChrgGLdesc
    TextMatrix(flxRowCnt, 4) = SrvChrgAccno
    TextMatrix(flxRowCnt, 5) = SrvChrgAccname

    if (vMode == "TRANS") {
      TextMatrix(flxRowCnt, 10) = "4"
      TextMatrix(flxRowCnt, 11) = "Cr Trasfer"
      TextMatrix(flxRowCnt, 6) = eval(eval(window.document.frmTrans.txtSerivceChrg.value) / 2);
      window.document.frmTrans.hidCgst.value = eval(window.document.frmTrans.hidCgst.value) + eval(eval(window.document.frmTrans.txtSerivceChrg.value) / 2);
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>"
      CellForeColor = 16711680
    }
    else if (vMode == "REC") {
      TextMatrix(flxRowCnt, 10) = "2"
      TextMatrix(flxRowCnt, 11) = "Cr Cash"
      TextMatrix(flxRowCnt, 6) = eval(eval(window.document.frmTrans.txtSerivceChrg.value) / 2);
      window.document.frmTrans.hidCgst.value = eval(window.document.frmTrans.hidCgst.value) + eval(eval(window.document.frmTrans.txtSerivceChrg.value) / 2);
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>" 
      CellForeColor = 16711680
    }

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = SrvChrgmodid//ModIdule Id value;
    //code commented by Radhika on 20 may 2008
    //Reason: Branch of Service Charge entry should be logged in user branch
    //TextMatrix(flxRowCnt,18)=window.document.frmTrans.txtbranchcode.value;
    TextMatrix(flxRowCnt, 18) = vBranchCode;
    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;
    //---------------Code Modified by Monica(15-DEC-2009)--------------

    if (window.document.frmTrans.txtModId.value == "REM") {
      TextMatrix(flxRowCnt, 24) = "CGST";
      TextMatrix(flxRowCnt, 25) = "N"  //System generated Y/N = "Y"
    }
    else {
      TextMatrix(flxRowCnt, 25) = "Y"  //System generated Y/N = "Y"
    }
    //---------------Code Modified by Monica(15-DEC-2009)--------------	
    //TextMatrix(flxRowCnt,25)="Y"
    TextMatrix(flxRowCnt, 26) = SrvChrgmodid//"Cash" for Module Desc
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    //	TextMatrix(flxRowCnt,28)=window.document.frmTrans.cmdcleartype.value;//clearing type

    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value;//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value;//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value;//lnkglcode
    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value;//lnkgldesc
    TextMatrix(flxRowCnt, 36) = ""//lnkacctype
    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value;//lnkaccno
    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value;//lnkaccname 

    TextMatrix(flxRowCnt, 39) = "1" //Service Id Value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y" // system generated y/n = YES
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e, Disposals YN.
    TextMatrix(flxRowCnt, 50) = excpYN // Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes// Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"//Standing Instructions YN.

    if ((vMode == "REC") || (vMode == "PAY")) {
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Should be replaced with Counter No.
      TextMatrix(flxRowCnt, 56) = vCashierId;//Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scroll No
    }
  }

  sumDrCr(flxRowCnt, "ADD")

  SrvChrgmodid = "<%=smod%>"
  SrvChrgGLcode = "<%=sgl%>"
  SrvChrgGLdesc = "<%=sgldes%>"
  SrvChrgAccno = "<%=sacc%>"
  SrvChrgAccname = "<%=saccnm%>"

  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1


  with (window.document.frmTrans.Mfgpaydt) {

    ///var BatchNo=BatchNo.split('~') 

    TextMatrix(flxRowCnt, 0) = BatchNo[0];
    if (eval(window.document.frmTrans.txtcomm.value == 0))
      TextMatrix(flxRowCnt, 1) = BatchNo[2];
    else
      TextMatrix(flxRowCnt, 1) = BatchNo[4];

    TextMatrix(flxRowCnt, 2) = SrvChrgGLcode
    TextMatrix(flxRowCnt, 3) = SrvChrgGLdesc
    TextMatrix(flxRowCnt, 4) = SrvChrgAccno
    TextMatrix(flxRowCnt, 5) = SrvChrgAccname

    if (vMode == "TRANS") {
      TextMatrix(flxRowCnt, 10) = "4"
      TextMatrix(flxRowCnt, 11) = "Cr Trasfer"
      TextMatrix(flxRowCnt, 6) = eval(eval(window.document.frmTrans.txtSerivceChrg.value) / 2);
      window.document.frmTrans.hidSgst.value = eval(window.document.frmTrans.hidSgst.value) + eval(eval(window.document.frmTrans.txtSerivceChrg.value) / 2);
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>"
      CellForeColor = 16711680
    }
    else if (vMode == "REC") {
      TextMatrix(flxRowCnt, 10) = "2"
      TextMatrix(flxRowCnt, 11) = "Cr Cash"
      TextMatrix(flxRowCnt, 6) = eval(eval(window.document.frmTrans.txtSerivceChrg.value) / 2);
      window.document.frmTrans.hidSgst.value = eval(window.document.frmTrans.hidSgst.value) + eval(eval(window.document.frmTrans.txtSerivceChrg.value) / 2);
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>" 
      CellForeColor = 16711680
    }

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = SrvChrgmodid//ModIdule Id value;
    //code commented by Radhika on 20 may 2008
    //Reason: Branch of Service Charge entry should be logged in user branch
    //TextMatrix(flxRowCnt,18)=window.document.frmTrans.txtbranchcode.value;
    TextMatrix(flxRowCnt, 18) = vBranchCode;
    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;
    //---------------Code Modified by Monica(15-DEC-2009)--------------			
    if (window.document.frmTrans.txtModId.value == "REM") {
      TextMatrix(flxRowCnt, 24) = "SGST";
      TextMatrix(flxRowCnt, 25) = "N"  //System generated Y/N = "Y"
    }
    else {
      TextMatrix(flxRowCnt, 25) = "Y"  //System generated Y/N = "Y"
    }
    //---------------Code Modified by Monica(15-DEC-2009)--------------	
    //TextMatrix(flxRowCnt,25)="Y"
    TextMatrix(flxRowCnt, 26) = SrvChrgmodid//"Cash" for Module Desc
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    //	TextMatrix(flxRowCnt,28)=window.document.frmTrans.cmdcleartype.value;//clearing type

    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value;//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value;//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value;//lnkglcode
    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value;//lnkgldesc
    TextMatrix(flxRowCnt, 36) = ""//lnkacctype
    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value;//lnkaccno
    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value;//lnkaccname 

    TextMatrix(flxRowCnt, 39) = "1" //Service Id Value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y" // system generated y/n = YES
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e, Disposals YN.
    TextMatrix(flxRowCnt, 50) = excpYN // Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes// Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"//Standing Instructions YN.

    if ((vMode == "REC") || (vMode == "PAY")) {
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Should be replaced with Counter No.
      TextMatrix(flxRowCnt, 56) = vCashierId;//Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scroll No
    }
  }


  sumDrCr(flxRowCnt, "ADD")

}

//---------------------------------------------------------------------------------
// these function for cess charges

function FlexPopulateCessCharge(BatchNo) {

  //depIntacccond=true

  SrvChrgmodid = "<%=csmod%>"
  SrvChrgGLcode = "<%=csgl%>"
  SrvChrgGLdesc = "<%=csgldes%>"
  SrvChrgAccno = "<%=csacc%>"
  SrvChrgAccname = "<%=csaccnm%>"

  if (eval(window.document.frmTrans.txtAmt.value == 0)) {
    return
  }
  var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1


  with (window.document.frmTrans.Mfgpaydt) {

    var BatchNo = BatchNo.split('~')

    TextMatrix(flxRowCnt, 0) = BatchNo[0];
    TextMatrix(flxRowCnt, 1) = BatchNo[5];

    TextMatrix(flxRowCnt, 2) = SrvChrgGLcode
    TextMatrix(flxRowCnt, 3) = SrvChrgGLdesc
    TextMatrix(flxRowCnt, 4) = SrvChrgAccno
    TextMatrix(flxRowCnt, 5) = SrvChrgAccname

    if (vMode == "TRANS") {
      TextMatrix(flxRowCnt, 10) = "4"
      TextMatrix(flxRowCnt, 11) = "Cr Trasfer"
      TextMatrix(flxRowCnt, 6) = eval(window.document.frmTrans.txtCessChrg.value);
      window.document.frmTrans.hidCess.value = eval(window.document.frmTrans.hidCess.value) + eval(window.document.frmTrans.txtCessChrg.value);
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>"
      CellForeColor = 16711680
    }
    else if (vMode == "REC") {
      TextMatrix(flxRowCnt, 10) = "2"
      TextMatrix(flxRowCnt, 11) = "Cr Cash"
      TextMatrix(flxRowCnt, 6) = eval(window.document.frmTrans.txtCessChrg.value);
      window.document.frmTrans.hidCess.value = eval(window.document.frmTrans.hidCess.value) + eval(window.document.frmTrans.txtCessChrg.value);
      Col = 6;
      Row = flxRowCnt;
      //CellForeColor="<%'=vbblue%>" 
      CellForeColor = 16711680
    }

    TextMatrix(flxRowCnt, 13) = 'P';
    TextMatrix(flxRowCnt, 14) = window.document.frmTrans.txtcurrencycode.value;
    TextMatrix(flxRowCnt, 15) = strsessionflds[0];
    TextMatrix(flxRowCnt, 16) = strsessionflds[8];
    TextMatrix(flxRowCnt, 17) = SrvChrgmodid//ModIdule Id value;
    //code commented by Radhika on 20 may 2008
    //Reason: Branch of Service Charge entry should be logged in user branch
    //TextMatrix(flxRowCnt,18)=window.document.frmTrans.txtbranchcode.value;
    TextMatrix(flxRowCnt, 18) = vBranchCode;
    TextMatrix(flxRowCnt, 20) = window.document.frmTrans.txtNarran.value;
    //---------------Code Modified by Monica(15-DEC-2009)--------------			
    if (window.document.frmTrans.txtModId.value == "REM") {
      TextMatrix(flxRowCnt, 24) = "CESS";
      TextMatrix(flxRowCnt, 25) = "N"  //System generated Y/N = "Y"
    }
    else {
      TextMatrix(flxRowCnt, 25) = "Y"  //System generated Y/N = "Y"
    }
    //---------------Code Modified by Monica(15-DEC-2009)--------------	
    //TextMatrix(flxRowCnt,25)="Y"
    TextMatrix(flxRowCnt, 26) = SrvChrgmodid//"Cash" for Module Desc
    TextMatrix(flxRowCnt, 27) = window.document.frmTrans.txtEffDate.value;

    //	TextMatrix(flxRowCnt,28)=window.document.frmTrans.cmdcleartype.value;//clearing type

    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value;//lnkmoduleid
    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value;//lnkmoduledesc
    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value;//lnkglcode
    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value;//lnkgldesc
    TextMatrix(flxRowCnt, 36) = ""//lnkacctype
    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value;//lnkaccno
    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value;//lnkaccname 

    TextMatrix(flxRowCnt, 39) = "1" //Service Id Value;
    TextMatrix(flxRowCnt, 40) = window.document.frmTrans.txtServiceName.value;

    if (window.document.frmTrans.chkABB.checked == false) {
      TextMatrix(flxRowCnt, 8) = strsessionflds[1]; //Application Date
      TextMatrix(flxRowCnt, 100) = "N"  //ABB Transaction Y/N = No
    }
    else {
      TextMatrix(flxRowCnt, 45) = vBranchCode
      TextMatrix(flxRowCnt, 46) = window.document.frmTrans.txtbranchdesc.value;
      TextMatrix(flxRowCnt, 8) = abbApplDt;
      TextMatrix(flxRowCnt, 12) = strsessionflds[1]; //Application Date as ABB Appl Dt
      TextMatrix(flxRowCnt, 25) = "Y" // system generated y/n = YES
      TextMatrix(flxRowCnt, 100) = "Y"  //to identify that current Transaction is a ABB Transaction

    }
    exceptionCodes()
    TextMatrix(flxRowCnt, 49) = "N" //Account Check YN i.e, Disposals YN.
    TextMatrix(flxRowCnt, 50) = excpYN // Exception YN.
    TextMatrix(flxRowCnt, 51) = excpCodes// Exception Codes.
    TextMatrix(flxRowCnt, 54) = "N"//Standing Instructions YN.

    if ((vMode == "REC") || (vMode == "PAY")) {
      TextMatrix(flxRowCnt, 55) = vCounterNo;//Should be replaced with Counter No.
      TextMatrix(flxRowCnt, 56) = vCashierId;//Cashier Id by default UserId.
      TextMatrix(flxRowCnt, 57) = "1"; //scroll No
    }
  }
  sumDrCr(flxRowCnt, "ADD")

}


//----------------------------------------------------------------------------------		
//This function is used to insert row into gentemptranslog that was populated in the
//flexgrid.
function flexRowInsert(intRow, moreThanOneRowYN) {

  var ColCnt = ""
  var RowCnt = ""
  var ColStr = ""
  var DispYN = ""
  var strCnt = intRow

  if (window.document.frmTrans.Mfgpaydt.Rows >= 1) {
    ColCnt = window.document.frmTrans.Mfgpaydt.Cols
    RowCnt = window.document.frmTrans.Mfgpaydt.Rows - 1

    //forming string of values to insert into gentemptranslog    
    if (moreThanOneRowYN == "Y") {


      for (RCnt = intRow; RCnt <= RowCnt; RCnt++) {

        for (i = 0; i <= ColCnt - 1; i++) {
          ColStr = ColStr + "'" + window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, i) + "',"
        }

        intRow = intRow + 1
        ColStr = ColStr.substring(0, ColStr.length - 1)
        ColStr = ColStr + "|"

      }

    }
    else {
      for (i = 0; i <= ColCnt - 1; i++) {
        ColStr = ColStr + "'" + window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, i) + "',"

      }
    }

    //If Transaction is not Disposal one  
    if (window.document.frmTrans.chkDispAccNo.checked == false) {
      dispVals = ""
      ColStr = "GEN" + "~*~" + intRow + "~*~" + dispVals + "~*~" + ColStr.substring(0, ColStr.length - 1) + "~*~" + tranNos

    }
    //If Transaction is Disposal one    
    else if (window.document.frmTrans.chkDispAccNo.checked == true) {
      //alert(window.document.frmTrans.Mfgpaydt.Rows + ' rows' )

      //alert(window.document.frmTrans.Mfgpaydt.TextMatrix(intRow,0) +':0')
      //alert(window.document.frmTrans.Mfgpaydt.TextMatrix(intRow,48) + ':48')

      if (window.document.frmTrans.mfgDisp.TextMatrix(
        window.document.frmTrans.mfgDisp.row, 38) != "SI") {
        if ((vMode == "REC") && ((window.document.frmTrans.txtModId.value == "PL") || (window.document.frmTrans.txtModId.value == "MISC"))) {
          intRow = strCnt
        }

        dispVals = window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 0) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 1) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 18) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 14) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 47) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 48) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 17)
      }
      else {
        dispVals = window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 0) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 1) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 18) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 14) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 47) + "~" +
          window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 48) + "~" +
          window.document.frmTrans.mfgDisp.TextMatrix(
            window.document.frmTrans.mfgDisp.row, 38)

      }


      //alert(window.document.frmTrans.mfgDisp.row )
      //alert(window.document.frmTrans.mfgDisp.TextMatrix(window.document.frmTrans.mfgDisp.row,38))

      ColStr = "GEN" + "~*~" + intRow + "~*~" + dispVals + "~*~" + ColStr.substring(0, ColStr.length - 1) + "~*~" + tranNos

    }

    window.document.all['iOk'].src = "temptraninsrt.aspx"

    window.document.frames['iOk'].frmTempTran.hdnFlexVal.value = ColStr
    window.document.frames['iOk'].frmTempTran.action = "temptraninsrt.aspx"
    window.document.frames['iOk'].frmTempTran.method = "post"
    window.document.frames['iOk'].frmTempTran.submit()

    flexInsrtYN = "YES"

  }
}

//-----------------------------------------------------------------------------------
//This is the return function form server page after inserting row in gentemptranslog
//if it fails to insert row into gentemptranslog because of any reasons it will remove 
//that row from the flex grid.
function TempTranInsrtclgret(strRslt, flxRow, NoOfRows) {

  var rowCnt = ""
  var dbtAmt = 0
  var cdtAmt = 0
  var cdtAmtTemp = 0
  var dbtAmtTemp = 0
  var i

  if (strRslt != "Transaction Sucessful.") {
    alert(strRslt)
    if (NoOfRows == 1) {

      if (window.document.frmTrans.Mfgpaydt.Rows > 2) {
        sumDrCr(flxRow, "DEL")
        window.document.frmTrans.Mfgpaydt.RemoveItem(flxRow)
      }
      else {
        sumDrCr(1, "DELALL")
        window.document.frmTrans.Mfgpaydt.Rows = 1
      }
    }
  }

  OkClear()
  mode = "ADD"
  ChequeDetClear()

}


//-----------------------------------------------------------------------------------
//This is the return function form server page after inserting row in gentemptranslog
//if it fails to insert row into gentemptranslog because of any reasons it will remove 
//that row from the flex grid.
function TempTranInsrt(strRslt, flxRow, NoOfRows) {

  //alert(strRslt + " " + flxRow + " " + NoOfRows)
  var rowCnt = ""
  var dbtAmt = 0
  var cdtAmt = 0
  var cdtAmtTemp = 0
  var dbtAmtTemp = 0
  var i

  if (strRslt != "Transaction Sucessful.") {
    alert(strRslt)
    if (NoOfRows == 1) {

      if (window.document.frmTrans.Mfgpaydt.Rows > 2) {
        sumDrCr(flxRow, "DEL")
        window.document.frmTrans.Mfgpaydt.RemoveItem(flxRow)
      }
      else {
        sumDrCr(1, "DELALL")
        window.document.frmTrans.Mfgpaydt.Rows = 1
      }

      return

    }
    else {

      rowCnt = flxRow - 1
      for (i = rowCnt; i > 0; i--) {

        if (window.document.frmTrans.Mfgpaydt.Rows > 2) {

          sumDrCr(i, "DEL")
          window.document.frmTrans.Mfgpaydt.RemoveItem(rowCnt)
        }
        else {
          sumDrCr(1, "DELALL")
          window.document.frmTrans.Mfgpaydt.Rows = 1

        }
      }

    }

    PrecDrCr()


  }

  if ((window.document.frmTrans.tranmode[2].checked == true) && (eval(window.document.frmTrans.txtServiceId.value) == "8")) {

    OkClear()
    mode = "ADD"
    ChequeDetClear()
  }

}

//----------------------------------------------------------------------------------

//this function is used to clear the cheque related textboxes
function ChequeDetClear() {
  window.document.frmTrans.txtChqNo.value = "";
  window.document.frmTrans.txtChqDt.value = '<%=session("Applicationdate")%>';
  window.document.frmTrans.txtChqFVG.value = "";
}
//----------------------------------------------------------------------------------

//this function is used to clear all the field and to set default format field values
// to the flexgrid.
function Cancel() {
  window.document.frmTrans.txtbranchcode.value = "<%=session("branchcode")%>"
  window.document.frmTrans.txtbranchdesc.value = "<%=session("branchnarration")%>"
  formClear()
  NatBranch()

  window.document.frmTrans.Mfgpaydt.Rows = 1;
  window.document.frmTrans.cmdPost.disabled = false
  sumDrCrDefault()
  window.document.frmTrans.txtTotDebit.value = "0";
  window.document.frmTrans.txtTotCredit.value = "0";
  chkboxUnCheck()
  defaultValues()
  if (vMode == "REC") {
    GetCashierBalance()
  }


}
//----------------------------------------------------------------------------------


//----------------------------------------------------------------------------------
//this function is used to set default div visible true and others visible false.
function dispUncheck() {
  //window.document.frmTrans.tranmode(0).checked=true
  window.document.frmTrans.chkLnkMod.checked = false
  window.document.frmTrans.chkTransDet.checked = false

  window.document.all['divaccno'].style.display = "block";
  window.document.all.divLnkMod.style.display = "none"
  window.document.all.divTempTrans.style.display = "none"
  window.document.all.loanintdtls.style.display = "none";
  window.document.frmTrans.selloantrans.style.display = "none";
  window.document.frmTrans.cmdcleartype.style.display = "none";

}

//----------------------------------------------------------------------------------

function chqlen() {
  if ((window.document.frmTrans.txtChqNo.value).length > 14)
    event.keyCode = 0
}
//----------------------------------------------------------------------------------
function SubPost() {

  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
    var crDbDiff = eval(window.document.frmTrans.txtTotDebit.value) -
      Math.abs(eval(window.document.frmTrans.txtTotCredit.value));
    var actDiff = eval(window.document.frmTrans.txtDiff.value);
    var totCr = eval(window.document.frmTrans.txtTotCredit.value)
    var totDr = eval(window.document.frmTrans.txtTotDebit.value)

    var totDen = 0
    if (CashDenom == 'Y') {
      totDen = eval(window.document.frames("idenom").frmDenom.txtTotAmt.value)

      if ((window.document.frmTrans.tranmode[1].checked == true) && (window.document.frmTrans.hdnMod.value == "LOAN")) {
        totCr = "0"

        var RowCnt = window.document.frmTrans.Mfgpaydt.Rows;
        var ColCnt = window.document.frmTrans.Mfgpaydt.Cols;

        for (i = 1; i < RowCnt; i++) {
          strRow = ""
          for (j = 0; j < ColCnt; j++) {

            if ((window.document.frmTrans.Mfgpaydt.TextMatrix(i, 10) == "2") && (window.document.frmTrans.Mfgpaydt.TextMatrix(i, 11) == "Cr Cash")) {
              totCr = eval(window.document.frmTrans.Mfgpaydt.TextMatrix(i, 6))
            }

          }

          totCr = totCr
        }
      }

    }

    if (window.document.frmTrans.tranmode[2].checked == false) {
      if (crDbDiff == 0) {
        if (vMode != "REC") {
          gridvalues()
          return
        }
        if (CashDenom == 'Y') {
          if (vMode == "REC" && totCr == totDen) {
            //gridvalues()
            GetCashierScrlNo()
          }
          else {
            alert("Denominations not Tallied")
            divsDisplay('divDenom', 'M')
            return;
          }
        }
        else {
          if (vMode == "REC") {
            //gridvalues()

            if (window.document.frmTrans.mfgDisp.Rows > 1) {
              alert("Please complete remaining transaction part")
              return;
            }

            GetCashierScrlNo()
          }
        }
      }
      else {
        alert("Credit Amount and Debit Amount Should be Equal");
      }
    }
    //---for inward clearing
    else {
      gridvalues()
    }
  }

}
//----------------------------------------------------------------------------------
//// function for String grid values in array variables
function gridvalues() {

  var strRow = "";
  var strTot = "";
  RowCnt = window.document.frmTrans.Mfgpaydt.Rows;
  ColCnt = window.document.frmTrans.Mfgpaydt.Cols;
  //alert('ss')
  //  window.document.frmTrans.cmdPost.disabled=true;
  for (i = 1; i < RowCnt; i++) {
    strRow = ""
    for (j = 0; j < ColCnt; j++) {

      if ((window.document.frmTrans.Mfgpaydt.TextMatrix(i, j) == "SI") && (j == 58))
        window.document.frmTrans.Mfgpaydt.TextMatrix(i, j) = "Y"

      strRow = strRow + window.document.frmTrans.Mfgpaydt.TextMatrix(i, j) + "~";
    }

    strTot = strTot + strRow + "|";
  }

  if (vMode != "REC") {
    strTot = vMode + "~*~" + strTot;
  }
  else {
    denomStrForm();
    strTot = vMode + "~*~" + strTot + "^~^~^" + strDenom;
  }
  window.document.frmTrans.cmdPost.disabled = true
  //alert(strTot)


  if ((window.document.frmTrans.hidComm.value != "0") && (window.document.frmTrans.hidComm.value != "")) {
    if (window.document.frmTrans.hidCgst.value == "") {
      window.document.frmTrans.hidCgst.value = "0"
    }
    if (window.document.frmTrans.hidSgst.value == "") {
      window.document.frmTrans.hidSgst.value = "0"
    }
    if (window.document.frmTrans.hidCess.value == "") {
      window.document.frmTrans.hidCess.value = "0"
    }

    var st, stTxval

    stTxval = 0

    stTxval = eval(window.document.frmTrans.hidComm.value) + eval(window.document.frmTrans.hidCgst.value) + eval(window.document.frmTrans.hidSgst.value) + eval(window.document.frmTrans.hidCess.value)
    //st = window.document.frmTrans.hidComm.value +"|"+ window.document.frmTrans.hidCgst.value +"|"+ window.document.frmTrans.hidSgst.value +"|"+ window.document.frmTrans.hidCess.value +"|"+ "GSTR" +"|"+ "<%=session("branchcode")%>" +"|"+ "<%=srpos%>" +"|"+ "<%=srgst%>" +"|"+ "<%=srgtp%>" +"|"+ "Regular"

    st = window.document.frmTrans.hidComm.value + "|" + window.document.frmTrans.hidCgst.value + "|" + window.document.frmTrans.hidSgst.value + "|" + window.document.frmTrans.hidCess.value + "|" + "GSTR" + "|" + "<%=session("branchcode")%>" + "|" + "<%=srpos%>" + "|" + window.document.frmTrans.hidGSTval.value + "|" + "<%=srgtp%>" + "|" + "Regular" + "|" + window.document.frmTrans.hidCust.value + "|" + window.document.frmTrans.hidRecnam.value + "|" + stTxval + "|" + window.document.frmTrans.hidRemRemarks.value

    window.document.frmTrans.hidComm.value = 0
    window.document.frmTrans.hidCgst.value = 0
    window.document.frmTrans.hidSgst.value = 0
    window.document.frmTrans.hidCess.value = 0

    ///alert(" Str Mahender = "+st)
    window.document.frames['iPost'].frmPost.hdnSercesschg.value = st

  }

  // for clearing return charges 
  if ((window.document.frmTrans.hidClgRetComm.value != "0") && (window.document.frmTrans.hidClgRetComm.value != "")) {
    if (window.document.frmTrans.hidClgRetCgst.value == "") {
      window.document.frmTrans.hidClgRetCgst.value = "0"
    }
    if (window.document.frmTrans.hidClgRetSgst.value == "") {
      window.document.frmTrans.hidClgRetSgst.value = "0"
    }
    if (window.document.frmTrans.hidClgRetCess.value == "") {
      window.document.frmTrans.hidClgRetCess.value = "0"
    }

    var st
    st = window.document.frmTrans.hidClgRetComm.value + "|" + window.document.frmTrans.hidClgRetCgst.value + "|" + window.document.frmTrans.hidClgRetSgst.value + "|" + window.document.frmTrans.hidClgRetCess.value + "|" + "GSTR" + "|" + "<%=session("branchcode")%>" + "|" + "<%=srpos%>" + "|" + window.document.frmTrans.hidClgRetGSTTaxval.value + "|" + "<%=srgtp%>" + "|" + "Regular" + "|" + window.document.frmTrans.hidClgRetCust.value + "|" + window.document.frmTrans.hidClgRetRcpName.value
      + "|" + window.document.frmTrans.hidClgRetGSTYN.value + "|" + window.document.frmTrans.hidClgRetRemarks.value

    window.document.frames['iPost'].frmPost.hdnClgRetChrgs.value = st
  }


  // for Remttance Cancellation charges 
  if ((window.document.frmTrans.hidRemCancComm.value != "0") && (window.document.frmTrans.hidRemCancComm.value != "")) {
    if (window.document.frmTrans.hidRemCancCgst.value == "") {
      window.document.frmTrans.hidRemCancCgst.value = "0"
    }
    if (window.document.frmTrans.hidRemCancSgst.value == "") {
      window.document.frmTrans.hidRemCancSgst.value = "0"
    }
    if (window.document.frmTrans.hidRemCancCess.value == "") {
      window.document.frmTrans.hidRemCancCess.value = "0"
    }

    var st

    st = window.document.frmTrans.hidRemCancComm.value + "|" + window.document.frmTrans.hidRemCancCgst.value + "|" + window.document.frmTrans.hidRemCancSgst.value + "|" + window.document.frmTrans.hidRemCancCess.value + "|" + "GSTR" + "|" + "<%=session("branchcode")%>" + "|" + "<%=srpos%>" + "|" + window.document.frmTrans.hidRemCancGSTTaxval.value + "|" + "<%=srgtp%>" + "|" + "Regular" + "|" + window.document.frmTrans.hidCrCustomerID.value + "|" + window.document.frmTrans.hidCrRcpName.value + "|" + window.document.frmTrans.hidRemCancGSTYN.value + "|" + window.document.frmTrans.hidRemCancRemarks.value

    window.document.frames['iPost'].frmPost.hdnRemCancChrgs.value = st

  }

  if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true')) {
    if (eval(window.document.frmTrans.hdn194Nfinaltds.value) != 0) {
      var st1


      st1 = window.document.frmTrans.hdn194NBrcode.value + "|" + window.document.frmTrans.hdn194NCurcode.value + "|" + window.document.frmTrans.hdn194NModID.value + "|" + window.document.frmTrans.hdn194NGLCode.value + "|" + window.document.frmTrans.hdn194NAccNo.value + "|" + window.document.frmTrans.hdn194NName.value + "|" + window.document.frmTrans.hdn194NBatchno.value + "|" + window.document.frmTrans.hdn194NTranno.value + "|" + window.document.frmTrans.hdn194NAmount.value + "|" + window.document.frmTrans.hdn194NModeOfTran.value + "|" + window.document.frmTrans.hdn194NFromDate.value + "|" + window.document.frmTrans.hdn194NToDate.value + "|" + window.document.frmTrans.hdn194NLnkModID.value + "|" + window.document.frmTrans.hdn194NLnkGlcode.value + "|" + window.document.frmTrans.hdn194NLnkAccno.value + "|" + window.document.frmTrans.hdn194NRemarks.value + "|" + "A" + "|" + "R" + "|" + "<%=session("userid")%>" + "|" + "<%=session("machineid")%>" + "|SYSDATE|" + "<%=session("applicationdate")%>" + "|" + window.document.frmTrans.hid194NCustID.value + "|" + window.document.frmTrans.hid194NAssesyear.value + "|" + window.document.frmTrans.hid194Npanno.value + "|" + window.document.frmTrans.hid194NAmtPaid.value + "|" + window.document.frmTrans.hid194NCrossAmt.value + "|" + window.document.frmTrans.hid194TDSRate.value + "|" + window.document.frmTrans.hidPAN206AAYN.value + "|" + window.document.frmTrans.hidPAN206ABYN.value

      window.document.frames['iPost'].frmPost.hdn194NTDSDtls.value = st1
    }
  }
  window.document.frames['iPost'].frmPost.hdnFlexPost.value = strTot
  window.document.frames['iPost'].frmPost.action = '<%="http://" & session("moduledir")& "/GEN/"%>' + "TrnInsert.aspx"
  window.document.frames['iPost'].frmPost.method = "post"
  window.document.frames['iPost'].frmPost.submit()

  // location.replace('<%="http://" & session("moduledir")& "/GEN/"%>'+"TrnInsert.aspx?kstr="+strTot)
}

//----------------------------------------------------------------------------------
function DelTran() {

  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
    strpm = "";

    if (window.document.frmTrans.Mfgpaydt.TextMatrix(1, 45) == "") {
      var brCode = window.document.frmTrans.Mfgpaydt.TextMatrix(1, 18)
      abbYN = ""
    }
    else {
      var brCode = window.document.frmTrans.Mfgpaydt.TextMatrix(1, 45)
      abbYN = "Y"
    }

    var batchNo = window.document.frmTrans.Mfgpaydt.TextMatrix(1, 0)
    var accNoYN = window.document.frmTrans.Mfgpaydt.TextMatrix(
      window.document.frmTrans.Mfgpaydt.RowSel, 49)
    var standInstr = window.document.frmTrans.Mfgpaydt.TextMatrix(
      window.document.frmTrans.Mfgpaydt.RowSel, 54)

    if (standInstr == "Y") {
      alert("Standing Instructions Deletion is not allowed here")
      return
    }

    if (brCode == "" || batchNo == "") {
      return
    }

    if (standInstr != "Y") {
      confrm = confirm("Do you want to delete Batch No : " + batchNo + " ?")
      if (confrm == true) {

        strpm = "DELTR" + "~" + batchNo + "~" + "" + "~" + brCode + "~" + accNoYN + "~" + abbYN
        window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
        Cancel()
      }
      else if (confrm == false) {
        return
      }
    }

  }
}
//----------------------------------------------------------------------------------
function ABBCheck() {
  window.document.frmTrans.chkDispAccNo.disabled = true
  if (window.document.frmTrans.chkABB.checked == false) {
    window.document.frmTrans.chkDispAccNo.disabled = false
    if (mode != "MODIFY") {
      window.document.frmTrans.txtbranchcode.value = vBranchCode
      window.document.frmTrans.txtbranchdesc.value = vBrNarration
      ModuleClear();
    }
  }
  if ((window.document.frmTrans.Mfgpaydt.Rows > 1) ||
    ((window.document.frmTrans.Mfgpaydt.Rows == 1) && (mode == "MODIFY"))) {
    alert("Combination of ABB and Non ABB Transactions not allowed." + "\n\n" +
      "Post or Cancel already entered data...")
    window.document.frmTrans.chkABB.checked = true

  }
  AbbApplDt()
}
//----------------------------------------------------------------------------------

//code added by Radhika on 12 May 2008
//Desc: To select CheckBook Check box, when modules are CC,CA,SB in Debit Tran mode
function GetModDets() {
  var kstr = "";

  if (eval(window.document.frmTrans.txtServiceId.value != "1")) {
    return;
  }
  //if(vMode=="TRANS"){
  if (window.document.frmTrans.tranmode(0).checked != true)
    return;

  if ((window.document.frmTrans.txtModId.value.toUpperCase() != 'SB') &&
    (window.document.frmTrans.txtModId.value.toUpperCase() != 'CA') &&
    (window.document.frmTrans.txtModId.value.toUpperCase() != 'CC')) {
    return;
  }

  kstr = "CHQYESNO" + "~";
  kstr = kstr + window.document.frmTrans.txtModId.value + "~~~";
  kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
  kstr = kstr + window.document.frmTrans.txtbranchcode.value + "~~~";
  //alert(kstr)
  window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genParameters.aspx?strparam=" + kstr

}

//code added by Radhika on 12 May 2008
//Desc: To select CheckBook Check box, when accounts of modules CC,CA,SB in Debit Tran mode
function GetAccDets() {
  var kstr = "";

  if (eval(window.document.frmTrans.txtServiceId.value != "1")) {
    return;
  }
  //if(vMode=="TRANS"){
  if (window.document.frmTrans.tranmode(0).checked != true)
    return;

  if ((window.document.frmTrans.txtModId.value.toUpperCase() != 'SB') &&
    (window.document.frmTrans.txtModId.value.toUpperCase() != 'CA') &&
    (window.document.frmTrans.txtModId.value.toUpperCase() != 'CC')) {
    return;
  }

  kstr = "CHQACCYESNO" + "~";
  kstr = kstr + window.document.frmTrans.txtModId.value + "~" + window.document.frmTrans.txtGLcode.value + "~~";
  kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
  kstr = kstr + window.document.frmTrans.txtbranchcode.value + "~~~";
  kstr = kstr + window.document.frmTrans.txtAccNo.value + "~";
  //alert(kstr)
  window.document.all['getAccDet'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genParameters.aspx?strparam=" + kstr

}

function ModParamRtn(str) {	//alert("md param="+str)
  var vals = str.split("~")
  if (vals[0] == "CHQACCYESNO") {
    if (vals[1] == "Y") {
      window.document.frmTrans.chkCheque.checked = true
    }
    else {
      window.document.frmTrans.chkCheque.checked = false
    }
    Cheque();
  }
}

//----------------------------------------------------------------------------------
function balanceDet() {

  var kstr = "";
  if (eval(window.document.frmTrans.txtServiceId.value != "8")) {
    if (window.document.frmTrans.txtbranchcode.value.length > 0 &&
      window.document.frmTrans.txtcurrencycode.value.length > 0 &&
      window.document.frmTrans.txtModId.value.length > 0 &&
      window.document.frmTrans.txtGLcode.value.length > 0 &&
      window.document.frmTrans.txtAccNo.value.length > 0) {

      kstr = window.document.frmTrans.txtbranchcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
      kstr = kstr + window.document.frmTrans.txtModId.value + "~";
      kstr = kstr + window.document.frmTrans.txtGLcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtAccNo.value + "~";

      if (eval(window.document.frmTrans.txtServiceId.value != "2")) {
        //alert("fir" + kstr)
        window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplay.aspx?kstr=" + kstr
      }
    }
  }

  if (eval(window.document.frmTrans.txtServiceId.value == "8")) {
    if (window.document.frmTrans.txtbranchcode.value.length > 0 &&
      window.document.frmTrans.txtcurrencycode.value.length > 0 &&
      window.document.frmTrans.txtCLGModId.value.length > 0 &&
      window.document.frmTrans.txtCLGGLcode.value.length > 0 &&
      window.document.frmTrans.txtCLGAccNo.value.length > 0) {

      kstr = window.document.frmTrans.txtbranchcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
      kstr = kstr + window.document.frmTrans.txtCLGModId.value + "~";
      kstr = kstr + window.document.frmTrans.txtCLGGLcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtCLGAccNo.value + "~";
      //alert(kstr)
      window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplayret.aspx?kstr=" + kstr
    }
  }

}

//----------------------------------------------------------------------------------
function MinBalCheck() {
  if ((window.document.frmTrans.tranmode(0).checked == true) && (window.document.frmTrans.txtServiceId.value == "4") && ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA"))) {

    if (window.document.frmTrans.txtAmt.value <= 0) {
      return
    }

    if (eval(window.document.frmTrans.txtNetBal.value) == eval(window.document.frmTrans.txtAmt.value)) {
      conMsg = "Do You Want To close The A/C"
      confm = confirm(conMsg)
      if (confm == true) {
      }
      else {
        window.document.frmTrans.txtAmt.value = ""
      }
    }
    else {
      alert("Entered Amount Should Be Equal To A/c Bal")
      window.document.frmTrans.txtAmt.value = ""
      return
    }
  }
  else {
    var overdraft
    overdraft = "<%=ovrdrft%>"
    var strOlimpyn = "<%=Olimpyn%>";

    var modId = window.document.frmTrans.txtModId.value
    var clBal, wdAmt, Balance, confm, conMsg, LmtAmt, AvbAmt, minAmt
    excpMinBal = ""
    excpOverDraft = ""
    TranMode()

    if (window.document.frmTrans.txtAmt.value <= 0) {
      return
    }
    if ((vMode == "REC") || (vSubMode == "TPAY")) {
      RecPayLmtChk()
    }
    if ((trnMode != "1") && (trnMode != "3") && (trnMode != "5")) {
      return
    }
    if (modId != "SB" && modId != "CA" && modId != "CC" && modId != "DEP" && modId != "LOAN") {
      return
    }
    wdAmt = window.document.frmTrans.txtAmt.value;

    if (modId == "SB" || modId == "CA") {
      clBal = window.document.frmTrans.txtClrBal.value;
      Balance = clBal - wdAmt;
      minAmt = pMinAmt

      if (eval(Balance) < 0) {
        if (overdraft == 'N') {
          alert("Amount Is Greater Than Current Balance")
          window.document.frmTrans.txtAmt.value = ""
          window.document.frmTrans.txtAmt.focus()
          return
        }
        conMsg = "Amount less than Minimum Balance and also Creating " +
          "OverDraft. Do You want to continue ?"
      }
      else {
        conMsg = "Amount less than Minimum Balance. Do You want to continue ?"
      }
    }
    else if (modId == "DEP") {
      Balance = window.document.frmTrans.txtDCurrAmt.value;
      minAmt = wdAmt;
      conMsg = "Amount Greater than Current Balance. Do You want to continue ?"
    }
    else if (modId == "CC") {
      clBal = window.document.frmTrans.txtClrBal.value;
      //LmtAmt=window.document.frmTrans.txtLmtAmt.value;  //txttodlimit  txtavalimit
      LmtAmt = eval(window.document.frmTrans.txtLmtAmt.value) + eval(window.document.frmTrans.txttodlimit.value);  //txttodlimit
      if (eval(clBal) < 0) {
        Balance = eval(LmtAmt) - eval(Math.abs(clBal))
      }
      else if (eval(clBal) > 0) {
        Balance = eval(LmtAmt) + eval(clBal)
      }
      else {
        Balance = eval(LmtAmt)
      }
      if (window.document.frmTrans.hidCCDrYN.value == "Y") {
        //alert("hidCCDrYN")
        minAmt = eval(wdAmt) + eval(window.document.frmTrans.hidCCDrAmt.value);
      }
      else if (window.document.frmTrans.hidCCCrYN.value == "Y") {
        minAmt = eval(wdAmt) + eval(window.document.frmTrans.hidCCCrAmt.value);
      }
      else {
        minAmt = wdAmt;
      }

      if ("<%=Olimpyn%>" == "Y") {
        conMsg = "Amount Greater than Limit Amount. Do You want to continue ?"
      }
      else {
        conMsg = "Amount Greater than Limit Amount"
      }
    }
    else if (modId == "LOAN") {
      if (window.document.frmTrans.selloantrans.value == "Principle") {
        Balance = window.document.frmTrans.txtloanavailbal.value;
        minAmt = wdAmt;
        conMsg = "Amount Greater than Available Amount. Do You want to continue ?"
      }
      else {
        return
      }
    }

    if ((modId == "SB" || modId == "CA") && eval(Balance) < 0) {
      confm = confirm(conMsg)
      confm = confirm(conMsg)
      if (confm == true) {
        excpOverDraft = "6"
        excpMinBal = "1"
      }
      else {
        excpMinBal = ""
        excpOverDraft = ""
        window.document.frmTrans.txtAmt.value = ""
      }
      return;
    } //end of Overdraft & min bal check for SB/CA modules

    if (eval(Balance) < eval(minAmt)) {

      if ("<%=Olimpyn%>" == "Y") {
        confm = confirm(conMsg)
        if (confm == true) {
          excpMinBal = "1"
        }
        else {
          excpMinBal = ""
          excpOverDraft = ""
          window.document.frmTrans.txtAmt.value = ""
        }
      }
      else {
        alert(conMsg)
        excpMinBal = ""
        excpOverDraft = ""
        window.document.frmTrans.txtAmt.value = ""
      }

    }
  }

}

function MinBalCheck_modify() {

  var modId = window.document.frmTrans.txtModId.value
  var clBal, wdAmt, Balance, confm, conMsg, LmtAmt, AvbAmt, minAmt
  excpMinBal = ""
  excpOverDraft = ""

  if ((vMode == "REC") || (vSubMode == "TPAY")) {
    RecPayLmtChk()
  }
  if ((trnMode != "1") && (trnMode != "3")) {
    return
  }
  if (modId != "SB" && modId != "CA" && modId != "CC" && modId != "DEP" && modId != "LOAN") {
    return
  }

  wdAmt = window.document.frmTrans.txtAmt.value;

  if (modId == "SB" || modId == "CA") {
    clBal = window.document.frmTrans.txtClrBal.value;
    Balance = clBal - wdAmt;
    minAmt = pMinAmt
  }
  else if (modId == "DEP") {
    Balance = window.document.frmTrans.txtDCurrAmt.value;
    minAmt = wdAmt;
  }
  else if (modId == "CC") {
    clBal = window.document.frmTrans.txtClrBal.value;
    LmtAmt = window.document.frmTrans.txtLmtAmt.value;
    if (clBal < 0) {
      Balance = LmtAmt - Math.abs(clBal)
    }
    else {
      Balance = LmtAmt
    }
    minAmt = wdAmt;
  }
  else if (modId == "LOAN") {
    if (window.document.frmTrans.selloantrans.value == "principle") {
      Balance = window.document.frmTrans.txtloanavailbal.value;
      minAmt = wdAmt;
    }
    else { return }
  }

  if ((modId == "SB" || modId == "CA") && eval(Balance) < 0) {
    excpOverDraft = "6"
    excpMinBal = "1"
    return;
  }

  if (eval(Balance) < eval(minAmt)) {
    excpMinBal = "1"
  }

}//end of  MinBalCheck_modify() method

//----------------------------------------------------------------------------------
//Function for validating deposit details
function AccOpening() {

  var Amt, MultVal
  if ((window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") ||
    (window.document.frmTrans.txtModId.value == "") ||
    (window.document.frmTrans.txtGLcode.value == "") ||
    (window.document.frmTrans.txtAccCatCode.value == "") ||
    (eval(window.document.frmTrans.txtAmt.value) == 0)) {
    return
  }

  if (window.document.frmTrans.txtServiceId.value == "2") {
    if (eval(window.document.frmTrans.txtAmt.value) < eval(pMinAmt)) {
      alert("Minmum Amount to Open this type of Account is " + pMinAmt)
      window.document.frmTrans.txtAmt.value = ""
    }
    else if (eval(window.document.frmTrans.txtAmt.value) > eval(pMaxAmt)) {
      alert("Maximum Amount to Open this type of Account is " + pMaxAmt)
      window.document.frmTrans.txtAmt.value = ""
    }


    if (window.document.frmTrans.txtModId.value.toUpperCase() == "DEP") {

      if (eval(pMultplesOf) != "0") {
        MultVal = (eval(window.document.frmTrans.txtAmt.value) % (eval(pMultplesOf)))
        if (MultVal > 0) {
          alert("Deposit Amount should be Multiples of " + pMultplesOf)
          window.document.frmTrans.txtAmt.value = ""
          return
        }
      }
      if (pDUnitsYN == "Y") {
        Amt = eval(window.document.frmTrans.txtAmt.value)
        if (eval(window.document.frmTrans.txtAmt.value) % eval(pDUnitVal) != 0) {
          alert("Deposit Amount should be multiples of Unit Value.\n" + "\n" +
            "                     Unit Value is  : " + pDUnitVal)
          window.document.frmTrans.txtAmt.value = ""
          window.document.frmTrans.txtAmt.focus()
        }
      }
    }

    else if (window.document.frmTrans.txtServiceId.value == "4") {
      if (window.document.frmTrans.txtModId.value.toUpperCase() == "DEP") {
        if (eval(window.document.frmTrans.txtAmt.value) >
          eval(window.document.frmTrans.txtDMatAmt.value)) {
          alert("Closing amount should not be greaterthan Maturity Amount")
          window.document.frmTrans.txtAmt.value = ""
        }

      }
    }
  }

}


//-------------------------------------------------------------------------------------
//Closing,If deposit is of unit type
function DepUnitCheck() {
  if (window.document.frmTrans.txtUnits.value != "") {
    if (eval(window.document.frmTrans.txtUnits.value) > eval(depNoofUnits)) {
      alert("No of units should not be greater than  " + depNoofUnits)
      window.document.frmTrans.txtUnits.value = ""
      window.document.frmTrans.txtUnits.focus()
    }
  }
  else {
    alert("Enter no of units")
  }
}

function ChqOnFocus() {
  //alert("In ChqOnFocus")
  GetBranchParams(window.document.frmTrans.txtbranchcode.value)
  return
}

//---------------------------------------------------------------------------------- 
function ChqValidation() {

  if (window.document.frmTrans.txtChqNo.value.length == 0) {
    return
  }

  if (scts == "Y") {
    if (window.document.frmTrans.cboChqType.value == "Select") {
      alert("Select Cheque Type")
      window.document.frmTrans.cboChqType.focus()
      return
    }
  }
  if ((pChqLength != "") && (eval(pChqLength) != 0)) {
    if (window.document.frmTrans.txtChqNo.value.length > eval(pChqLength)) {
      alert("Cheque Length Should Be Less than or equal to " + pChqLength + " Characters")
      window.document.frmTrans.txtChqNo.value = ""
      window.document.frmTrans.txtChqNo.focus()
      return
    }
  }
  if ((window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") ||
    (window.document.frmTrans.txtModId.value == "") ||
    (window.document.frmTrans.txtGLcode.value == "") ||
    (window.document.frmTrans.txtAccNo.value == "") ||
    (window.document.frmTrans.txtAmt.value == "")) {

    if (window.document.frmTrans.txtbranchcode.value == "") {
      alert("Please enter Branch Code")
      window.document.frmTrans.txtbranchcode.focus()
    }

    if (window.document.frmTrans.txtcurrencycode.value == "") {
      alert("Please enter Currency Code")
      window.document.frmTrans.txtcurrencycode.focus()
    }

    if (window.document.frmTrans.txtModId.value == "") {
      alert("Please enter Module ID")
      window.document.frmTrans.txtModId.focus()
    }

    if (window.document.frmTrans.txtGLcode.value == "") {
      alert("Please enter GL Code")
      window.document.frmTrans.txtGLcode.focus()
    }

    if (window.document.frmTrans.txtAccNo.value == "") {
      alert("Please enter Account No: ")
      window.document.frmTrans.txtAccNo.focus()
    }

    if (window.document.frmTrans.txtAmt.value == "") {
      alert("Please enter Amount ")
      window.document.frmTrans.txtAmt.focus()
    }
    window.document.frmTrans.txtChqNo.value = ""
    return
  }

  kstr = "";








  if (window.document.frmTrans.tranmode(2).checked == true) // clearing
  {
    if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
      kstr = "CHQN" + "~" + window.document.frmTrans.txtbranchcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
      kstr = kstr + window.document.frmTrans.txtCLGModId.value + "~";
      kstr = kstr + window.document.frmTrans.txtCLGGLcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtCLGAccNo.value + "~";
      kstr = kstr + window.document.frmTrans.txtChqNo.value + "~";
      //kstr=kstr+window.document.frmTrans.txtChqSrs.value+"~";
      if (scts == "Y") {
        kstr = kstr + window.document.frmTrans.cboChqType.value + "~";
      }

      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' +
        "minBalChk.aspx?strparam=" + kstr
    }

    //writen by mahender for checking of clearing cheque number
    if (eval(window.document.frmTrans.txtServiceId.value) == "1") {
      kstr = "CHQN" + "~" + window.document.frmTrans.txtbranchcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
      kstr = kstr + window.document.frmTrans.txtModId.value + "~";
      kstr = kstr + window.document.frmTrans.txtGLcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtAccNo.value + "~";
      kstr = kstr + window.document.frmTrans.txtChqNo.value + "~";
      //kstr=kstr+window.document.frmTrans.txtChqSrs.value+"~";
      if (scts == "Y") {
        kstr = kstr + window.document.frmTrans.cboChqType.value + "~";
      }

      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' +
        "minBalChk.aspx?strparam=" + kstr
    }
  }
  else // debit and credit
  {
    if (eval(window.document.frmTrans.txtServiceId.value) != "8") {
      kstr = "CHQN" + "~" + window.document.frmTrans.txtbranchcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
      kstr = kstr + window.document.frmTrans.txtModId.value + "~";
      kstr = kstr + window.document.frmTrans.txtGLcode.value + "~";
      kstr = kstr + window.document.frmTrans.txtAccNo.value + "~";
      kstr = kstr + window.document.frmTrans.txtChqNo.value + "~";
      //kstr=kstr+window.document.frmTrans.txtChqSrs.value+"~";
      if (scts == "Y") {
        kstr = kstr + window.document.frmTrans.cboChqType.value + "~";
      }

      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' +
        "minBalChk.aspx?strparam=" + kstr
    }
  }
}
//----------------------------------------------------------------------------------
function ChqSerValidation() {
  window.document.frmTrans.txtChqNo.value = ""
  /* if(window.document.frmTrans.txtChqSrs.value.length==0){
     return
  } */
  if ((window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") ||
    (window.document.frmTrans.txtModId.value == "") ||
    (window.document.frmTrans.txtGLcode.value == "") ||
    (window.document.frmTrans.txtAccNo.value == "") ||
    eval(window.document.frmTrans.txtAmt.value) == "") {

    if (window.document.frmTrans.txtbranchcode.value == "") {
      alert("Please enter Branch Code")
      window.document.frmTrans.txtbranchcode.focus()
    }

    if (window.document.frmTrans.txtcurrencycode.value == "") {
      alert("Please enter Currency Code")
      window.document.frmTrans.txtcurrencycode.focus()
    }

    if (window.document.frmTrans.txtModId.value == "") {
      alert("Please enter Module ID")
      window.document.frmTrans.txtModId.focus()
    }

    if (window.document.frmTrans.txtGLcode.value == "") {
      alert("Please enter GL Code")
      window.document.frmTrans.txtGLcode.focus()
    }


    if (window.document.frmTrans.txtAccNo.value == "") {
      alert("Please enter Account No: ")
      window.document.frmTrans.txtAccNo.focus()
    }

    if (window.document.frmTrans.txtAmt.value == "") {
      alert("Please enter Amount")
      window.document.frmTrans.txtAmt.focus()
    }
    return
  }

  kstr = "";
  if (eval(window.document.frmTrans.txtServiceId.value) != "8") {
    kstr = "CHQS" + "~" + window.document.frmTrans.txtbranchcode.value + "~";
    kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
    kstr = kstr + window.document.frmTrans.txtModId.value + "~";
    kstr = kstr + window.document.frmTrans.txtGLcode.value + "~";
    kstr = kstr + window.document.frmTrans.txtAccNo.value + "~";
    //kstr=kstr+window.document.frmTrans.txtChqSrs.value+"~";
    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")&"/GEN/"%>' +
      "minBalChk.aspx?strparam=" + kstr
  }

}
//---------------------------------------------------------------------------------
function ChqVerification(ChqNo) {

  excpChqNo = ""
  excpChq = ""

  //   alert("ChqNo=" + ChqNo)

  var ChqVld = ChqNo.split("~")
  var stopPay = ChqVld[0]
  var chqStatus = ChqVld[1]

  if (stopPay == "S" || stopPay == "A" || stopPay == "P") {
    alert("Cheque has been marked for StopPayment")
    if (window.document.frmTrans.txtServiceId.value == "8")///changed by mahender for clearing inward return
    {
      if (confirm("Do You Want to continue ?") == true) {
        //alert("mahi")
      }
      else {
        window.document.frmTrans.txtChqNo.value = ""
        excpChqNo = ""
        return;
      }
    }
    else {
      window.document.frmTrans.txtChqNo.value = ""
      excpChqNo = ""
      return;
    }



  }
  if (chqStatus == "D") {
    alert("Cheque has been already Paid")
    window.document.frmTrans.txtChqNo.value = ""
    excpChqNo = ""
    return
  }
  if (ChqVld[0] == "NOTVALID") {
    if (ChqVld[1] == "ALREADYPAID") {
      alert("Cheque seems that it is already Paid. Try once again. If you got this message again, then given Cheque is a paid Cheque.")
      window.document.frmTrans.txtChqNo.value = ""
      window.document.frmTrans.txtChqNo.focus()
      excpChqNo = ""
      return
    }

    if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC")) {
      alert("Not a Valid Cheque No")
      window.document.frmTrans.txtChqNo.value = ""
      window.document.frmTrans.txtChqNo.focus()
      return
    }
    cnfrm = confirm("Not a Valid Cheque No. " + "\n\n" + "Do you want to continue ?")
    if (cnfrm == true) {
      cnfrm = confirm("Are You Sure")
      if (cnfrm == true) {
        excpChqNo = "4"
        //      excpYN="Y"
        if (ChqVld[1] == "ALREADYPAID") {
          alert("Cheque seems that it is already Paid. Try once again. If you got this message again, then given Cheque is a paid Cheque.")
          window.document.frmTrans.txtChqNo.value = ""
          excpChqNo = ""
          return
        }
      }
      else {
        window.document.frmTrans.txtChqNo.value = ""
        excpChqNo = ""
        window.document.frmTrans.txtChqNo.focus()
      }
    }
    else {
      window.document.frmTrans.txtChqNo.value = ""
      excpChqNo = ""
      window.document.frmTrans.txtChqNo.focus()
    }
  }
}
//----------------------------------------------------------------------------------
function ChqSerVerification(ChqSer) {
  excpChqSrs = ""
  excpChq = ""
  if (ChqSer == "NOTVALID") {
    cnfrm = confirm("Not a Valid Cheque Series. " + "\n\n" + "Do you want to continue ?")
    if (cnfrm == true) {
      excpChqSrs = "4"
      //     excpYN="Y"     
    }
    else {
      //window.document.frmTrans.txtChqSrs.value=""
      excpChqSrs = ""
      //window.document.frmTrans.txtChqSrs.focus()
    }
  }
}
//---------------------------------------------------------------------------------- 
function ClearAlert(code) {
  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
    var confm
    if (code == "Cur") {
      confm = confirm("Changing of Currency Code  at this stage will clear off already entered data..."
        + "\n" + "\n" + "Do you want to Continue ?")
      if (confm == true) {
        Cancel() // if(confm==false)
      }
      else {

        window.document.frmTrans.txtcurrencycode.value = curCode
        window.document.frmTrans.txtcurrencydesc.value = curDesc
      }
    } // vAbbuser.toUpperCase()!="Y"
    else if ((code == "Brn") && ((window.document.frmTrans.Mfgpaydt.Rows > 1) &&
      (window.document.frmTrans.Mfgpaydt.TextMatrix(1, 45) == ""))) {
      confm = confirm("Changing of Branch Code at this stage will clear off already entered data..."
        + "\n" + "\n" + "Do you want to Continue ?")
      if (confm == true) {
        Cancel()   //if(confm==false)
      }
      else {
        window.document.frmTrans.txtbranchcode.value = brCode
        window.document.frmTrans.txtbranchdesc.value = brDesc
      }
    }
  }
  else if (vAbbuser.toUpperCase() != "Y") {
    formClear()
  }
}

//----------------------------------------------------------------------------------
function TempTranslog() {
  var strprm = "";
  var modTrn = "";

  TranMode()

  window.document.frmTrans.mfgTranslog.Rows = 1
  if ((window.document.frmTrans.txtbranchcode.value.length > 0) &&
    (window.document.frmTrans.txtcurrencycode.value.length > 0)) {
    if (vMode == "TRANS") {
      if (window.document.frmTrans.tranmode(0).checked == true ||
        window.document.frmTrans.tranmode(1).checked == true) {
        modTrn = "('3','4')"
      }
      else if (window.document.frmTrans.tranmode(2).checked == true) {
        modTrn = "('5','6')"
      }
    }
    else if ((vMode == "REC") || (vMode == "PAY")) {
      modTrn = "('1','2')"
    }

    if (window.document.frmTrans.chkABB.checked == true) {
      abbYN = "Y"
    }
    else {
      abbYN = "N"
    }

    strprm = "TEMP" + "~*~" + window.document.frmTrans.txtbranchcode.value + "~";
    strprm = strprm + window.document.frmTrans.txtcurrencycode.value + "~";
    strprm = strprm + window.document.frmTrans.txtModId.value + "~";
    strprm = strprm + window.document.frmTrans.txtGLcode.value + "~";
    strprm = strprm + window.document.frmTrans.txtAccNo.value + "~";
    strprm = strprm + modTrn + "~" + abbYN + "~";

    window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "temptranpop.aspx?st=" + strprm
  }
}
//----------------------------------------------------------------------------------
function TempTranslogpop(strdata) {
  //alert(strdata)
  var K, i, m, b, pos, j, h, n, p, s
  for (m = 1; m <= 2; m++) {
    b = strdata.split("$")
  }
  st = b[0]
  strRecCnt = b[1]
  if (strRecCnt == 0) {
    return
  }
  window.document.frmTrans.mfgTranslog.Rows = eval(b[1]) + 1
  window.document.frmTrans.mfgTranslog.Cols = b[2]

  for (p = 1; p <= b[1]; p++) {
    n = st.split("|")
    if (b[1] > 0) {
      for (j = 0; j < b[2]; j++) {
        k = n[p - 1].split("~")

        if (k[j] != "Null") {
          window.document.frmTrans.mfgTranslog.TextMatrix(p, j) = k[j]
        }
        if (eval(j) == "5" || eval(j) == "6") {
          if (window.document.frmTrans.mfgTranslog.TextMatrix(p, j) != "") {
            window.document.frmTrans.mfgTranslog.TextMatrix(p, j) =
              gridprecision(window.document.frmTrans.mfgTranslog.TextMatrix(p, j),
                window.document.frmTrans.hpr.value)
          }
        }
        if (eval(j == "5") && k[j] >= 0) {
          window.document.frmTrans.mfgTranslog.Row = p
          window.document.frmTrans.mfgTranslog.Col = 5
          //window.document.frmTrans.mfgTranslog.CellForeColor="<%'=vbblue%>"
        }
        else if (eval(j == "5") && k[j] < 0) {
          window.document.frmTrans.mfgTranslog.Row = p
          window.document.frmTrans.mfgTranslog.Col = 5
          //window.document.frmTrans.mfgTranslog.CellForeColor="<%'=vbred%>"
          window.document.frmTrans.mfgTranslog.CellForeColor = 255
        }
      }
    }
  }
}

//----------------------------------------------------------------------------------
function disposal(prmVal) {

  var strprm = "";
  var cond = ""
  if ((window.document.frmTrans.txtbranchcode.value.length > 0) &&
    (window.document.frmTrans.txtcurrencycode.value.length > 0)) {


    strprm = "DISP" + "~*~" + prmVal + "~" + window.document.frmTrans.txtbranchcode.value + "~";
    strprm = strprm + window.document.frmTrans.txtcurrencycode.value + "~";
    strprm = strprm + window.document.frmTrans.txtModId.value + "~";
    strprm = strprm + window.document.frmTrans.txtGLcode.value + "~";
    strprm = strprm + window.document.frmTrans.txtAccNo.value + "~";
    strprm = strprm + window.document.frmTrans.txtServiceId.value + "~";


    window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "temptranpop.aspx?st=" + strprm
  }
}
//----------------------------------------------------------------------------------
function dispoalPop(strdata) {
  var K, i, m, b, pos, j, h, n, p, s
  for (m = 1; m <= 2; m++) {
    b = strdata.split("$")
  }
  st = b[0]
  strRecCnt = b[1]

  if (strRecCnt == 0) {
    window.document.frmTrans.mfgDisp.Rows = 1
    alert("No Records found")
    return
  }

  window.document.frmTrans.mfgDisp.Rows = eval(b[1]) + 1
  window.document.frmTrans.mfgDisp.Cols = b[2]

  for (p = 1; p <= b[1]; p++) {
    n = st.split("|")
    if (b[1] > 0) {
      for (j = 0; j < b[2]; j++) {
        k = n[p - 1].split("~")
        window.document.frmTrans.mfgDisp.TextMatrix(p, j) = k[j]
        if (eval(j) == "7") {
          window.document.frmTrans.mfgDisp.TextMatrix(p, j) = gridprecision(window.document.frmTrans.mfgDisp.TextMatrix(p, j),
            window.document.frmTrans.hpr.value)
        }
      }
    }
  }
}
//----------------------------------------------------------------------------------
function MainFlexPop(strdata) {

  branchCurrCode()
  var K, i, m, b, pos, j, h, n, p, s

  window.document.frmTrans.txtTotCredit.value = 0
  window.document.frmTrans.txtTotDebit.value = 0
  window.document.frmTrans.txtDiff.value = 0
  window.document.frmTrans.NoDrTrn.value = 0
  window.document.frmTrans.NoCrTrn.value = 0

  for (m = 1; m <= 2; m++) {
    b = strdata.split("$")
  }
  st = b[0]
  window.document.frmTrans.Mfgpaydt.Rows = eval(b[1]) + 1
  window.document.frmTrans.Mfgpaydt.Cols = b[2]

  for (p = 1; p <= b[1]; p++) {
    n = st.split("|")
    if (b[1] > 0) {
      for (j = 0; j < b[2]; j++) {
        k = n[p - 1].split("~")
        window.document.frmTrans.Mfgpaydt.TextMatrix(p, j) = k[j]
        if (j == 6) {
          if (k[j] >= 0) {
            window.document.frmTrans.Mfgpaydt.Row = p
            window.document.frmTrans.Mfgpaydt.Col = 6
            //window.document.frmTrans.Mfgpaydt.CellForeColor="<%=vbblue%>"
            window.document.frmTrans.Mfgpaydt.CellForeColor = 16711680
            sumDrCr(p, "ADD")
          }
          else if (k[j] < 0) {
            window.document.frmTrans.Mfgpaydt.Row = p
            window.document.frmTrans.Mfgpaydt.Col = 6
            // window.document.frmTrans.Mfgpaydt.CellForeColor="<%=vbred%>"
            window.document.frmTrans.Mfgpaydt.CellForeColor = 255
            sumDrCr(p, "ADD")
          }
        }
        if (j == 6 || j == 7) {
          if (window.document.frmTrans.Mfgpaydt.TextMatrix(p, j) != "") {
            window.document.frmTrans.Mfgpaydt.TextMatrix(p, j) =
              gridprecision(window.document.frmTrans.Mfgpaydt.TextMatrix(p, j),
                window.document.frmTrans.hpr.value)
          }
        }

      }
    }
  }
  if (window.document.frmTrans.Mfgpaydt.TextMatrix(1, 45) != "") {
    window.document.frmTrans.chkABB.checked = true
  }

  PrecDrCr()
}
//----------------------------------------------------------------------------------
function ChqDateVald() {

  if (window.document.frmTrans.txtChqDt.value.length == 0) {
    return;
  }

  if ((window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") ||
    (window.document.frmTrans.txtModId.value == "") ||
    (window.document.frmTrans.txtGLcode.value == "") ||
    (window.document.frmTrans.txtAccNo.value == "") ||
    eval(window.document.frmTrans.txtAmt.value == "") ||
    (window.document.frmTrans.txtChqNo.value == "")) {
    if (window.document.frmTrans.txtbranchcode.value == "") {
      alert("Please enter Branch Code")
      window.document.frmTrans.txtbranchcode.focus()
    }

    if (window.document.frmTrans.txtcurrencycode.value == "") {
      alert("Please enter Currency Code")
      window.document.frmTrans.txtcurrencycode.focus()
    }

    if (window.document.frmTrans.txtModId.value == "") {
      alert("Please enter Module ID")
      window.document.frmTrans.txtModId.focus()
    }

    if (window.document.frmTrans.txtGLcode.value == "") {
      alert("Please enter GL Code")
      window.document.frmTrans.txtGLcode.focus()
    }

    if (window.document.frmTrans.txtAccNo.value == "") {
      alert("Please enter Account No: ")
      window.document.frmTrans.txtAccNo.focus()
    }

    if (window.document.frmTrans.txtAmt.value == "") {
      alert("Please enter Amount")
      window.document.frmTrans.txtAmt.focus()
    }
    window.document.frmTrans.DtpChq.Value = ""
    window.document.frmTrans.txtChqDt.value = ""
    return
  }


  window.document.frmTrans.hdnAppDt.value = vAppDate
  //alert("2")
  if (DateCompare(window.document.frmTrans.txtChqDt, window.document.frmTrans.hdnAppDt) == false) {
    window.document.frmTrans.txtChqDt.value = ""

    window.document.frmTrans.DtpChq.Value = ""
    return
  }
  if (pChqVldPrd == "") {
    alert("Please set Cheque Validity Period")
    return
  }

  var kstr = "";
  //alert("3")
  if (eval(window.document.frmTrans.txtServiceId.value) != "8") {
    //alert("4")
    kstr = "DTVL" + "~" + window.document.frmTrans.txtChqDt.value + "~" + pChqVldPrd
    //alert(kstr)
    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + kstr
  }
}


function ChqDateVerify(chqVldDt) {
  if (chqVldDt == "INVALID") {
    alert("Cheque has been Expired");
    window.document.frmTrans.DtpChq.Value = null
    window.document.frmTrans.txtChqDt.value = ""

  }
  DateChk()
}
//----------------------------------------------------------------------------------

function DateChk() {
  if (window.document.frmTrans.txtChqDt.value.length == 0) {
    return
  }

  //alert("1")
  if ((window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") ||
    (window.document.frmTrans.txtModId.value == "") ||
    (window.document.frmTrans.txtGLcode.value == "") ||
    (window.document.frmTrans.txtAccNo.value == "") ||
    eval(window.document.frmTrans.txtAmt.value == "") ||
    (window.document.frmTrans.txtChqNo.value == "")) {
    if (window.document.frmTrans.txtbranchcode.value == "") {
      alert("Please enter Branch Code")
      window.document.frmTrans.txtbranchcode.focus()
    }

    if (window.document.frmTrans.txtcurrencycode.value == "") {
      alert("Please enter Currency Code")
      window.document.frmTrans.txtcurrencycode.focus()
    }

    if (window.document.frmTrans.txtModId.value == "") {
      alert("Please enter Module ID")
      window.document.frmTrans.txtModId.focus()
    }

    if (window.document.frmTrans.txtGLcode.value == "") {
      alert("Please enter GL Code")
      window.document.frmTrans.txtGLcode.focus()
    }

    if (window.document.frmTrans.txtAccNo.value == "") {
      alert("Please enter Account No: ")
      window.document.frmTrans.txtAccNo.focus()
    }

    if (window.document.frmTrans.txtAmt.value == "") {
      alert("Please enter Amount")
      window.document.frmTrans.txtAmt.focus()
    }
    window.document.frmTrans.DtpChq.Value = ""
    window.document.frmTrans.txtChqDt.value = ""
    return
  }


  window.document.frmTrans.hdnAppDt.value = vAppDate


  var kstr = "";

  if (eval(window.document.frmTrans.txtServiceId.value) != "8") {
    kstr = "OPDATECHK" + "~" + window.document.frmTrans.txtChqDt.value + "~" + pChqVldPrd + "~" + window.document.frmTrans.txtModId.value + "~" + window.document.frmTrans.txtGLcode.value + "~" + window.document.frmTrans.txtAccNo.value + "~" + window.document.frmTrans.txtbranchcode.value

    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + kstr
  }
}

function OpChkDate(OpDatChk) {
  if (OpDatChk == "INVALID") {
    alert("Cheque Date must be Greater then Open Date");
    window.document.frmTrans.DtpChq.Value = null
    window.document.frmTrans.txtChqDt.value = ""

  }
}

function BatchDel() {
  var batchno = ""
  var strpm = "";
  var cnfrm
  if (window.document.frmTrans.mfgTranslog.Rows > 1) {
    if ((window.document.frmTrans.mfgTranslog.TextMatrix
      (window.document.frmTrans.mfgTranslog.Row, 0) != "") &&
      (window.document.frmTrans.mfgTranslog.Rows > 1) &&
      (window.document.frmTrans.txtbranchcode.value != "")) {

      //brCode=window.document.frmTrans.txtbranchcode.value

      if (window.document.frmTrans.mfgTranslog.TextMatrix(
        window.document.frmTrans.mfgTranslog.RowSel, 14) == "") {
        var brCode = window.document.frmTrans.mfgTranslog.TextMatrix(
          window.document.frmTrans.mfgTranslog.RowSel, 17)
        abbYN = ""
      }
      else {
        var brCode = window.document.frmTrans.mfgTranslog.TextMatrix(
          window.document.frmTrans.mfgTranslog.RowSel, 14)
        abbYN = "Y"
      }

      batchno = window.document.frmTrans.mfgTranslog.TextMatrix
        (window.document.frmTrans.mfgTranslog.RowSel, 0)
      var accNoYN = window.document.frmTrans.mfgTranslog.TextMatrix
        (window.document.frmTrans.mfgTranslog.RowSel, 20)
      var standInstr = window.document.frmTrans.mfgTranslog.TextMatrix(
        window.document.frmTrans.mfgTranslog.RowSel, 21)
      if (standInstr == "Y") {
        alert("Standing Instructions Deletion is not allowed here")
        return
      }

      cnfrm = confirm("Do you want to Delete Batch No  " + batchno + " ?")
      if (cnfrm == true) {

        strpm = "DELTR" + "~" + batchno + "~" + "" + "~" + brCode + "~" + accNoYN + "~" + abbYN
        window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
      }
      else {
      }
    }
  }
}

function Trandel() {
  var batchno = ""
  var tranno = ""
  var strpm = "";
  var cnfrm
  if (window.document.frmTrans.mfgTranslog.Rows > 1) {
    if ((window.document.frmTrans.mfgTranslog.TextMatrix
      (window.document.frmTrans.mfgTranslog.Row, 0) != "") &&
      (window.document.frmTrans.mfgTranslog.Rows > 1) &&
      (window.document.frmTrans.txtbranchcode.value != "")) {
      if (window.document.frmTrans.mfgTranslog.TextMatrix(
        window.document.frmTrans.mfgTranslog.RowSel, 21) == "Y") {
        alert("Standing Instructions Deletion is not allowed here")
        return
      }

      // brCode=window.document.frmTrans.txtbranchcode.value
      if (window.document.frmTrans.mfgTranslog.TextMatrix(
        window.document.frmTrans.mfgTranslog.RowSel, 14) == "") {
        var brCode = window.document.frmTrans.mfgTranslog.TextMatrix(
          window.document.frmTrans.mfgTranslog.RowSel, 17)
        abbYN = ""
      }
      else {
        var brCode = window.document.frmTrans.mfgTranslog.TextMatrix(
          window.document.frmTrans.mfgTranslog.RowSel, 14)
        abbYN = "Y"
      }

      batchno = window.document.frmTrans.mfgTranslog.TextMatrix
        (window.document.frmTrans.mfgTranslog.RowSel, 0)
      tranno = window.document.frmTrans.mfgTranslog.TextMatrix
        (window.document.frmTrans.mfgTranslog.RowSel, 1)
      var accNoYN = window.document.frmTrans.mfgTranslog.TextMatrix
        (window.document.frmTrans.mfgTranslog.RowSel, 20)

      cnfrm = confirm("Do you want to Delete Tran No  " + tranno + " ?")
      if (cnfrm == true) {
        strpm = "DELTR" + "~" + batchno + "~" + tranno + "~" + brCode + "~" + accNoYN + "~" + abbYN
        window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
      }
      else {
      }
    }
  }
}
//----------------------------------------------------------------------------------
function dispData(batchNo) {

  var strpm = "";
  var cnfrm
  var modTrn = ""

  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
    alert("Post or Cancel already entered data...")
    return
  }

  if (window.document.frmTrans.txtbranchcode.value != "" &&
    window.document.frmTrans.txtcurrencycode.value != "") {

    if (batchNo != "") {

      if (window.document.frmTrans.tranmode(0).checked == true ||
        window.document.frmTrans.tranmode(1).checked == true) {
        modTrn = "('3','4')"
      }
      else if (window.document.frmTrans.tranmode(2).checked == true) {
        modTrn = "('5','6')"
      }

      if (window.document.frmTrans.chkABB.checked == true) {
        abbYN = "Y"
      }
      else {
        abbYN = "N"
      }

      strpm = "BATCH" + "~*~" + window.document.frmTrans.txtbranchcode.value + "~" +
        window.document.frmTrans.txtcurrencycode.value + "~" + batchNo + "~" +
        modTrn + "~" + abbYN

      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "temptranpop.aspx?st=" + strpm

    }
  }
}

//----------------------------------------------------------------------------------
function DepRenClose() {
  var modId = window.document.frmTrans.txtModId.value.toUpperCase()
  var glCode = window.document.frmTrans.txtGLcode.value.toUpperCase()
  var accNo = window.document.frmTrans.txtAccNo.value.toUpperCase()
  var serId = window.document.frmTrans.txtServiceId.value

  if ((window.document.frmTrans.txtbranchcode.value != "") &&
    (window.document.frmTrans.txtcurrencycode.value != "") &&
    (modId != "") && (glCode != "") && (accNo != "") && (serId != "")) {

    LockContAdd()
    strpm = "DEPCLOSEBATCH" + "~*~" + window.document.frmTrans.txtbranchcode.value + "~" +
      window.document.frmTrans.txtcurrencycode.value + "~" + modId + "~" +
      glCode + "~" + accNo + "~" + serId

    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "temptranpop.aspx?st=" + strpm


  }
}
//----------------------------------------------------------------------------------
function LockContAdd() {
  window.document.frmTrans.cmdModify.disabled = true
  window.document.frmTrans.cmdDelete.disabled = true
  //    window.document.frmTrans.cmdBatDel.disabled=true
  //    window.document.frmTrans.cmdTranDel.disabled=true
  //    window.document.frmTrans.cmdCont.disabled=true

}
//----------------------------------------------------------------------------------
function TempTransData() {
  var batchno = ""
  var strpm = "";
  var cnfrm
  var modTrn = ""
  var abbBr = ""

  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
    alert("Post or Cancel already entered data...")
    return
  }

  if (window.document.frmTrans.txtbranchcode.value != "" &&
    window.document.frmTrans.txtcurrencycode.value != "") {
    if (window.document.frmTrans.mfgTranslog.Rows > 1) {
      if ((window.document.frmTrans.mfgTranslog.TextMatrix
        (window.document.frmTrans.mfgTranslog.Row, 0) != "") &&
        (window.document.frmTrans.mfgTranslog.Rows > 1)) {
        batchno = window.document.frmTrans.mfgTranslog.TextMatrix
          (window.document.frmTrans.mfgTranslog.RowSel, 0)

        abbBr = window.document.frmTrans.mfgTranslog.TextMatrix
          (window.document.frmTrans.mfgTranslog.RowSel, 14)

        cnfrm = confirm("Do you want to Continue Batch No  " + batchno + " ?")
        if (cnfrm == true) {
          if (vMode == "TRANS") {
            if (window.document.frmTrans.tranmode(0).checked == true ||
              window.document.frmTrans.tranmode(1).checked == true) {
              modTrn = "('3','4')"
            }
            else if (window.document.frmTrans.tranmode(2).checked == true) {
              modTrn = "('5','6')"
            }
          }
          else if ((vMode == "PAY") || (vMode == "REC")) {
            modTrn = "('1','2')"

          }
          //if((abbBr!="") || (abbBr!="Null"))
          if (abbBr != "") {
            window.document.frmTrans.chkABB.checked == true
            abbYN = "Y"
          }
          else {
            abbYN = "N"
          }
          strpm = "BATCH" + "~*~" + window.document.frmTrans.txtbranchcode.value + "~" +
            window.document.frmTrans.txtcurrencycode.value + "~" + batchno +
            "~" + modTrn + "~" + abbYN
          window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "temptranpop.aspx?st=" + strpm

        }
        else {
        }
      }
    }
  }
}


//----------------------------------------------------------------------------------
function DelTempTranslog(Rst) {

  var balstr2 = new String();
  balstr2 = Rst.split("|")

  if (balstr2[0] == "DEL") {
    for (i = 1; i < window.document.frmTrans.Mfgpaydt.Rows; i++) {
      if (eval(window.document.frmTrans.Mfgpaydt.TextMatrix(i, 0)) > 0) {
        if (eval(window.document.frmTrans.Mfgpaydt.TextMatrix(i, 0)) == balstr2[1]) {
          Cancel();
        }
      }
    }
    if (balstr2[2] == "") {
      alert("Batch No : " + balstr2[1] + " is Deleted")
    }
    else if (balstr2[2] != "") {
      alert("Tran No : " + balstr2[2] + " is Deleted")
    }
    TempTranslog()
  }
  else {
    alert(balstr2[0])
  }
}
//----------------------------------------------------------------------------------


//----------------------------------------------------------------------------------



//----------------------------------------------------------------------------------
function dispGridRemove() {
  window.document.frmTrans.mfgTranslog.Clear();
  window.document.frmTrans.mfgTranslog.FormatString = ">Batch No  |>Tran No   |<GL Code        |<GL Description                   |>Acc No         |>Amount            |>Entered Time Bal |^Applicatin Date   |<Cust ID               |<Mode of Tran  |<Status  |>Currency Code     |<Entered By             |<Entered M/C             |<ABB Branch Code          |<Branch Desc                    |<Module ID         |<Branch Code            |>Token No   |<Remarks                           |<Disposals";
  window.document.frmTrans.mfgTranslog.Rows = 1;

  if (window.document.frmTrans.chkDispAccNo.checked == true) {
    if (window.document.frmTrans.mfgDisp.Rows > 2) {
      window.document.frmTrans.mfgDisp.RemoveItem(Rselect)
    }
    else {
      window.document.frmTrans.mfgDisp.Rows = 1
    }
  }
}

//----------------------------------------------------------------------------------	

//----------------------------------------------------------------------------------	
function OkClear() {

  ModuleClear();//clear module and 
  LnkModClear()
  hdnFldClear()
  Cls();
  defaultValues();
  forexClear()
  if ((window.document.frmTrans.chkDispAccNo.checked == false) &&
    (window.document.frmTrans.chkABB.checked == false)) {
    chkboxUnCheck();
  }

  if (mode != "MODIFY") {
    excpIntValues();
  }
  Remclear();
  if (mode != "MODIFY") {
    funloanclear();
  } ServiceId

  if (window.document.frmTrans.tranmode(2).checked == true) {
    ClgModClear()
    clearflds()
  }
  //ClgClear()

  Depdivclear()

  if (window.document.frmTrans.chkDispAccNo.checked == true) {
    dispUncheck()
  }
  dispGridRemove()

  if ((window.document.frmTrans.chkDispAccNo.checked == true) &&
    (window.document.frmTrans.mfgDisp.Rows == 1)) {
    UnlockControls()
  }

}

//----------------------------------------------------------------------------------	
function FlexModify(GridRowSel) {

  formClear()

  var flxRowCnt = window.document.frmTrans.Mfgpaydt.RowSel;
  {
    with (window.document.frmTrans.Mfgpaydt) {

      window.document.frmTrans.hdnBatchNo.value = TextMatrix(flxRowCnt, 0);
      window.document.frmTrans.hdnTranNo.value = TextMatrix(flxRowCnt, 1);
      var vModId = TextMatrix(flxRowCnt, 17).toUpperCase()

      //new code written on 16 may 2008
      if ((vModId == "REM") || (vModId == "FXREM")) {
        if ((TextMatrix(flxRowCnt, 10) == "2") || (TextMatrix(flxRowCnt, 10) == "4")) {
          alert("This type of Transactions can't be Modified. If You want," +
            " You can delete and post the same transaction again.")
          return
        }
      }




      if ((vModId == "REM") || (vModId == "FXREM")) {

        if ((TextMatrix(flxRowCnt, 10) == "1") || (TextMatrix(flxRowCnt, 10) == "4")) {

          //new code is 
          if (TextMatrix(flxRowCnt, 64) != "") {
            var strRem = TextMatrix(flxRowCnt, 67).split(",")
            if ((eval(strRem[0]) > 0) && (eval(strRem[1]) > 0)) {
              window.document.frmTrans.hdnTranNo2.value = strRem[0];
              window.document.frmTrans.hdnTranNo3.value = strRem[1];
            }
            else if (eval(strRem[0]) > 0) {
              window.document.frmTrans.hdnTranNo2.value = strRem[0];
            }
            else if (eval(strRem[1]) > 0) {
              window.document.frmTrans.hdnTranNo2.value = strRem[1];
              //window.document.frmTrans.hdnTranNo3.value=sreRem[1];
            }
          }//end of Dependant tran nos

        }
        else if (TextMatrix(flxRowCnt, 10) == "2") {

          // new code is 
          if (TextMatrix(flxRowCnt, 64) != "") {
            var strRem = TextMatrix(flxRowCnt, 67).split(",")
            if ((eval(strRem[0]) > 0) && (eval(strRem[1]) > 0)) {
              window.document.frmTrans.hdnTranNo2.value = strRem[0];
              window.document.frmTrans.hdnTranNo3.value = strRem[1];
              window.document.frmTrans.hdnTranNo4.value = TextMatrix(flxRowCnt + 3, 1);
            }
            else if (eval(strRem[0]) > 0) {
              window.document.frmTrans.hdnTranNo2.value = strRem[0];
              window.document.frmTrans.hdnTranNo3.value = TextMatrix(flxRowCnt + 2, 1);
            }
            else if (eval(strRem[1]) > 0) {
              window.document.frmTrans.hdnTranNo2.value = strRem[1];
              window.document.frmTrans.hdnTranNo3.value = TextMatrix(flxRowCnt + 2, 1);
            }
          }//end of Dependant tran nos

        }
      }
      else if ((vMode == "PAY") || (vMode == "REC")) {
        window.document.frmTrans.hdnTranNo2.value = TextMatrix(flxRowCnt + 1, 1);
      }

      window.document.frmTrans.txtGLcode.value = TextMatrix(flxRowCnt, 2);
      window.document.frmTrans.txtGLDesc.value = TextMatrix(flxRowCnt, 3);
      window.document.frmTrans.txtAccNo.value = TextMatrix(flxRowCnt, 4);
      window.document.frmTrans.txtAccNm.value = TextMatrix(flxRowCnt, 5);

      window.document.frmTrans.txtCustId.value = TextMatrix(flxRowCnt, 9)
      window.document.frmTrans.txtcurrencycode.value = TextMatrix(flxRowCnt, 14);
      window.document.frmTrans.txtModId.value = TextMatrix(flxRowCnt, 17);
      fxTransactionYN()
      window.document.frmTrans.txtAmt.value = Math.abs(TextMatrix(flxRowCnt, 6));
      precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)
      window.document.frmTrans.txtbranchcode.value = TextMatrix(flxRowCnt, 18);
      window.document.frmTrans.txtTokenNo.value = TextMatrix(flxRowCnt, 19);
      window.document.frmTrans.txtNarran.value = TextMatrix(flxRowCnt, 20);
      window.document.frmTrans.txtModDesc.value = TextMatrix(flxRowCnt, 26)
      window.document.frmTrans.txtEffDate.value = TextMatrix(flxRowCnt, 27);
      window.document.frmTrans.cmdcleartype.value = TextMatrix(flxRowCnt, 28);//clearing type
      window.document.frmTrans.txtServiceId.value = TextMatrix(flxRowCnt, 39);
      window.document.frmTrans.txtServiceName.value = TextMatrix(flxRowCnt, 40);
      if (TextMatrix(flxRowCnt, 46) != "") {
        window.document.frmTrans.txtbranchdesc.value = TextMatrix(flxRowCnt, 46);
      }
      masterTabYN()
      TranMode()

      if (vMode == "TRANS") {
        if (eval(TextMatrix(flxRowCnt, 10)) == 3) {
          window.document.frmTrans.tranmode(0).checked = true
        }
        else if (eval(TextMatrix(flxRowCnt, 10)) == 4) {
          window.document.frmTrans.tranmode(1).checked = true
        }
        ///for clearing
        else if ((eval(TextMatrix(flxRowCnt, 10)) == 5) ||
          (eval(TextMatrix(flxRowCnt, 10)) == 6)) {
          window.document.frmTrans.tranmode(2).checked = true
          clgDivCrDr()
        }
      }
      else if (vMode == "REC") {
        window.document.frmTrans.tranmode(1).checked = true
      }
      else if (vMode == "PAY") {
        window.document.frmTrans.tranmode(0).checked = true

      }
      //code commented by Radhika on 24-sep-2007
      //Reason: Cheque series number is not a mandatory field. So consider Cheque Number.
      //if(TextMatrix(flxRowCnt,21)!=""){
      if (TextMatrix(flxRowCnt, 22) != "") {
        window.document.frmTrans.chkCheque.checked = true
        window.document.all['ChqDtl'].style.display = "block"
        //window.document.frmTrans.txtChqSrs.value=TextMatrix(flxRowCnt,21);
        window.document.frmTrans.txtChqNo.value = TextMatrix(flxRowCnt, 22);
        window.document.frmTrans.txtChqDt.value = TextMatrix(flxRowCnt, 23);
        window.document.frmTrans.DtpChq.Value = window.document.frmTrans.txtChqDt.value
        window.document.frmTrans.txtChqFVG.value = TextMatrix(flxRowCnt, 24);
      }
      if ((TextMatrix(flxRowCnt, 32) != "" && eval(TextMatrix(flxRowCnt, 39)) != 8)) {
        window.document.frmTrans.chkLnkMod.checked = true
        window.document.all['trnsfer'].style.display = "none";
        window.document.all.divLnkMod.style.display = "block"
        window.document.frmTrans.txtLnkModId.value = TextMatrix(flxRowCnt, 32);//lnkmoduleid
        window.document.frmTrans.txtLnkModDesc.value = TextMatrix(flxRowCnt, 33)//lnkmoduledesc
        window.document.frmTrans.txtLnkGLCode.value = TextMatrix(flxRowCnt, 34)//lnkglcode
        window.document.frmTrans.txtLnkGLname.value = TextMatrix(flxRowCnt, 35)//lnkgldesc
        window.document.frmTrans.txtLnkAcctype.value = TextMatrix(flxRowCnt, 36)//lnkacctype
        window.document.frmTrans.txtLnkAccNo.value = TextMatrix(flxRowCnt, 37)//lnkaccno
        window.document.frmTrans.txtLnkAccNm.value = TextMatrix(flxRowCnt, 38)//lnkaccname 
      }

      if (TextMatrix(flxRowCnt, 39) == "2") {
        window.document.frmTrans.txtAppName.value = TextMatrix(flxRowCnt, 60)
        window.document.frmTrans.txtAccCatCode.value = TextMatrix(flxRowCnt, 61)
        window.document.frmTrans.txtAccCatDesc.value = TextMatrix(flxRowCnt, 62)
      }
      //// for outward returns marking-----
      if (window.document.frmTrans.tranmode[2].checked == true) {
        if (TextMatrix(flxRowCnt, 39) == "8") {
          window.document.frmTrans.all.divCLG.style.display = "Block"
          window.document.all['trnsfer'].style.display = "none";

          window.document.frmTrans.txtCLGModId.value = TextMatrix(flxRowCnt, 32)
          window.document.frmTrans.txtCLGModDesc.value = TextMatrix(flxRowCnt, 33)
          window.document.frmTrans.txtCLGGLcode.value = TextMatrix(flxRowCnt, 34)
          window.document.frmTrans.txtCLGGLname.value = TextMatrix(flxRowCnt, 35)
          window.document.frmTrans.txtCLGAccNo.value = TextMatrix(flxRowCnt, 37)
          window.document.frmTrans.txtCLGAccNm.value = TextMatrix(flxRowCnt, 38)
          window.document.frmTrans.txtCLGBankCode.value = TextMatrix(flxRowCnt, 60)
          window.document.frmTrans.txtCLGBranch.value = TextMatrix(flxRowCnt, 61)
          window.document.frmTrans.txtCLGReasoncode.value = TextMatrix(flxRowCnt, 62)
          window.document.frmTrans.txtCLGReason.value = TextMatrix(flxRowCnt, 63)
        }
        else if (TextMatrix(flxRowCnt, 39) == "1") {
          window.document.frmTrans.cmdcleartype.value = TextMatrix(flxRowCnt, 28)
          window.document.frmTrans.cmdcleartype.options
            (window.document.frmTrans.cmdcleartype.selectedIndex).text = TextMatrix(flxRowCnt, 60)
        }
      }
      //for Forex Transactions
      if ((TextMatrix(flxRowCnt, 30) != "") || (TextMatrix(flxRowCnt, 31) != "")) {

        divsDisplay('divFxRate', 'A')
        if (TextMatrix(flxRowCnt, 28) != "") {
          for (i = 0; i < window.document.frmTrans.cmbFRateType.length; i++) {
            if (window.document.frmTrans.cmbFRateType.options[i].value.toUpperCase() ==
              TextMatrix(flxRowCnt, 28).toUpperCase()) {
              window.document.frmTrans.cmbFRateType.options[i].selected = true
              break;
            }
          }
        }
        window.document.frmTrans.txtFRate.value = TextMatrix(flxRowCnt, 29)
        window.document.frmTrans.txtFCurCode.value = TextMatrix(flxRowCnt, 30)
        window.document.frmTrans.txtFAmount.value = TextMatrix(flxRowCnt, 31)
        window.document.frmTrans.txtFRateRefCode.value = TextMatrix(flxRowCnt, 58)
        window.document.frmTrans.txtFRateRefDesc.value = TextMatrix(flxRowCnt, 59)
      }

      //-----------------------------------------prsem	
      if ((window.document.frmTrans.txtModId.value == "REM") && (eval(TextMatrix(flxRowCnt, 6)) < 0)) {

        divsDisplay("remdr", "M")
        window.document.all['divaccno'].style.display = "none";

        window.document.frmTrans.txtbybnkcode.value = TextMatrix(flxRowCnt, 52);
        window.document.frmTrans.txtbybnkdesc.value = TextMatrix(flxRowCnt, 53);

        window.document.frmTrans.txtbybrcode.value = TextMatrix(flxRowCnt, 60);
        window.document.frmTrans.txtbybrdesc.value = TextMatrix(flxRowCnt, 61);
        window.document.frmTrans.txtfavgdr.value = TextMatrix(flxRowCnt, 62);
        window.document.frmTrans.txtinstrno.value = TextMatrix(flxRowCnt, 63);
        window.document.frmTrans.txtinstrdt.value = TextMatrix(flxRowCnt, 67);

        if (TextMatrix(flxRowCnt, 68) != "ADD") {
          natadv = TextMatrix(flxRowCnt, 64)
          remtype = TextMatrix(flxRowCnt, 68)
          natinsdt = TextMatrix(flxRowCnt, 67)
        }
        else {
          advrecyn = TextMatrix(flxRowCnt, 64)
          remadvno = TextMatrix(flxRowCnt, 65)
          remadvdate = TextMatrix(flxRowCnt, 66)
          remtype = TextMatrix(flxRowCnt, 68)
          advinstrdate = TextMatrix(flxRowCnt, 67)
        }



      }
      else if ((window.document.frmTrans.txtModId.value == "REM") && (eval(TextMatrix(flxRowCnt, 6)) >= 0)) {

        divsDisplay("remcr", "M")
        window.document.all['divaccno'].style.display = "none";
        window.document.all['divfxRem'].style.display = "block";
        window.document.all['divrembank'].style.display = "block";


        window.document.frmTrans.txtissbnkcode.value = TextMatrix(flxRowCnt, 52);
        window.document.frmTrans.txtissbnkdesc.value = TextMatrix(flxRowCnt, 53);
        window.document.frmTrans.txtissbrcode.value = TextMatrix(flxRowCnt, 60);
        window.document.frmTrans.txtissbrdesc.value = TextMatrix(flxRowCnt, 61);
        window.document.frmTrans.txtfavg.value = TextMatrix(flxRowCnt, 62);
        //window.document.frmTrans.txtcomm.value=TextMatrix(flxRowCnt,64); 
        if (TextMatrix(flxRowCnt, 67) != "") {
          var strRem = TextMatrix(flxRowCnt, 64).split(",")
          window.document.frmTrans.txtcomm.value = eval(strRem[0]);
          window.document.frmTrans.txtSerivceChrg.value = eval(strRem[1]);
        }
        window.document.frmTrans.txtcustrid.value = TextMatrix(flxRowCnt, 65);
        window.document.frmTrans.txtcusn.value = TextMatrix(flxRowCnt, 66);

        commtranno = ""
        SrvChrgtranno = ""

        //if((TextMatrix(flxRowCnt,64)=="")||(eval(TextMatrix(flxRowCnt,64))==0)){
        if (TextMatrix(flxRowCnt, 67) == "") {
          window.document.all.divComm.style.display = "none"
        }
        else {

          //commtranno=TextMatrix(flxRowCnt+1,1); 
          var strRem = TextMatrix(flxRowCnt, 67).split(",")
          commtranno = strRem[0];
          SrvChrgtranno = strRem[1];
          window.document.all.divComm.style.display = "block"
        }
        remtype = TextMatrix(Rselect, 68)

      }

      //------------------------------Suspence start----------------------------------------
      else if ((window.document.frmTrans.txtModId.value == "SCR") && (eval(TextMatrix(flxRowCnt, 6)) < 0)) {

        divsDisplay("divaccno", "M")
        window.document.all['divAccCat'].style.display = "none";
        window.document.all['divcheque'].style.display = "none";

        TextMatrix(0, 60) = "Contra Date"
        TextMatrix(0, 61) = "Contra Batch No"

        scrstr = TextMatrix(flxRowCnt, 73);
      }
      else if ((window.document.frmTrans.txtModId.value == "SCR") &&
        (eval(TextMatrix(flxRowCnt, 6)) > 0)) {
        divsDisplay("divaccno", "M")
        window.document.all['divAccCat'].style.display = "none";
        window.document.all['divcheque'].style.display = "none";

        TextMatrix(0, 60) = "Contra Date"
        TextMatrix(0, 61) = "Contra Batch No"
        TextMatrix(0, 62) = "Contra Tran No"

        scrstr = TextMatrix(flxRowCnt, 79);
      }
      //-----------------------------------------Suspence end------------------------
      //-----------------LOANS  ynk
      else if ((window.document.frmTrans.txtModId.value == "LOAN") &&
        (eval(TextMatrix(flxRowCnt, 6)) < 0) && (TextMatrix(flxRowCnt, 10) == "3")) {
        var kstr

        divsDisplay("loandtls", "M")

        window.document.all['divaccno'].style.display = "block";
        window.document.all.loanintdtls.style.display = "block"
        window.document.frmTrans.selloantrans.style.display = "block";

        window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text = TextMatrix(flxRowCnt, 60)
        kstr = "frmtrans" + "~" + "loandetails" + "~" + window.document.frmTrans.txtbranchcode.value + "~" + window.document.frmTrans.txtcurrencycode.value + "~" + window.document.frmTrans.txtAccNo.value + "~" + window.document.frmTrans.txtGLcode.value
        window.document.all['iloandtls'].src = "loaninterestdetails.aspx?kstr=" + kstr;
        balanceDet()
      }
      else if ((window.document.frmTrans.txtModId.value == "LOAN")
        && (eval(TextMatrix(flxRowCnt, 6)) > 0) && (TextMatrix(flxRowCnt, 10) == "4")) {
        var kstr

        divsDisplay("loandtls", "M")

        window.document.all['divaccno'].style.display = "block";
        window.document.all.loanintdtls.style.display = "block"

        kstr = "frmtrans" + "~" + "loandetails" + "~" + window.document.frmTrans.txtbranchcode.value + "~" + window.document.frmTrans.txtcurrencycode.value + "~" + window.document.frmTrans.txtAccNo.value + "~" + window.document.frmTrans.txtGLcode.value
        window.document.all['iloandtls'].src = "loaninterestdetails.aspx?kstr=" + kstr;

        alert("Do you want to Modify this Record ?")
        funinsertintdtls()
        window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = TextMatrix(Rselect, 60)
        window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = TextMatrix(Rselect, 61)
        window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = TextMatrix(Rselect, 62)
        window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = TextMatrix(Rselect, 63)

        window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = TextMatrix(Rselect, 64)
        window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = TextMatrix(Rselect, 65)


      }

      else if (window.document.frmTrans.txtModId.value == "DEP") {
        divsDisplay("divDepDtls", "M")

        var flxRow = window.document.frmTrans.Mfgpaydt.RowSel;
        if (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRow, 38) == "2") {
          window.document.all['divaccno'].style.display = "none"
        }
      }
      //Forex Remittances  
      else if ((window.document.frmTrans.txtModId.value == "FXREM") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {

        divsDisplay("remcr", "M")
        window.document.all['divaccno'].style.display = "none";
        window.document.all['divfxRem'].style.display = "block";
        window.document.all['divrembank'].style.display = "none";

        window.document.frmTrans.txtcustrid.value = TextMatrix(flxRowCnt, 9)
        window.document.frmTrans.txtfavg.value = TextMatrix(flxRowCnt, 61)
        window.document.frmTrans.txtcomm.value = TextMatrix(flxRowCnt, 64)
        //window.document.frmTrans.txtcomm.value=TextMatrix(flxRowCnt,62)
        window.document.frmTrans.txtcusn.value = TextMatrix(flxRowCnt, 63)

        commtranno = ""
        //SrvChrgtranno=""
        if ((TextMatrix(flxRowCnt, 64) == "") || (eval(TextMatrix(flxRowCnt, 64)) == 0)) {
          window.document.all.divComm.style.display = "none"
        }
        else {
          commtranno = TextMatrix(flxRowCnt + 1, 1);
          window.document.all.divComm.style.display = "block"
        }
        remtype = TextMatrix(Rselect, 65)
      }
      else if (fxTransYN == "Y") {
        divsDisplay("trnsfer", "M")
        divsDisplay("divFxRate", "A")
      }

      else {
        /// DefDispaly(); ---- commented for link module 
      }

      Flexrowdelete()

    }

    ServiceIdDivs()
    //	NoofAcc(); 	

  }
}

//---------------------------------------------------------------------------------- 
function Flexrowdelete() {

  var rowno = window.document.frmTrans.Mfgpaydt.Row


  //brCode=window.document.frmTrans.Mfgpaydt.TextMatrix(1,18)
  if (window.document.frmTrans.Mfgpaydt.TextMatrix(
    window.document.frmTrans.Mfgpaydt.RowSel, 45) == "") {
    brCode = window.document.frmTrans.Mfgpaydt.TextMatrix(
      window.document.frmTrans.Mfgpaydt.RowSel, 18)
    abbYN = ""
  }
  else {
    brCode = window.document.frmTrans.Mfgpaydt.TextMatrix(
      window.document.frmTrans.Mfgpaydt.RowSel, 45)
    abbYN = "Y"
  }

  var accNoYN = window.document.frmTrans.Mfgpaydt.TextMatrix(
    window.document.frmTrans.Mfgpaydt.rowsel, 49)
  var hdnBatNo = window.document.frmTrans.hdnBatchNo.value
  var hdnTranNo = window.document.frmTrans.hdnTranNo.value
  var hdnTranNo2 = window.document.frmTrans.hdnTranNo2.value
  var hdnTranNo3 = window.document.frmTrans.hdnTranNo3.value
  var hdnTranNo4 = window.document.frmTrans.hdnTranNo4.value

  var TranNos = ""


  //New code is 
  TranNos = "tranno in(" + hdnTranNo
  if (hdnTranNo2 != "")
    TranNos = TranNos + "," + hdnTranNo2
  if (hdnTranNo3 != "")
    TranNos = TranNos + "," + hdnTranNo3
  if (hdnTranNo4 != "")
    TranNos = TranNos + "," + hdnTranNo4

  TranNos = TranNos + ")"

  TranMode()
  var vModId = window.document.frmTrans.txtModId.value.toUpperCase()

  if (((vModId == "REM") || (vModId == "FXREM")) && ((trnMode == "4") || (trnMode == "2"))) {
    strpm = "DELETEROW" + "~" + hdnBatNo + "~" + TranNos + "~" + brCode + "~" + accNoYN + "~" + abbYN

  }
  else if (vMode == "TRANS") {
    strpm = "DELETEROW" + "~" + hdnBatNo + "~" + TranNos + "~" + brCode + "~" + accNoYN + "~" + abbYN
  }
  else if (vMode == "REC" || vMode == "PAY") {
    strpm = "DELETEROW" + "~" + hdnBatNo + "~" + TranNos + "~" + brCode + "~" + accNoYN + "~" + abbYN
  }

  window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm

  if (window.document.frmTrans.Mfgpaydt.Rows > 2) {
    mode != "MODIFY"

    if ((vModId == "REM") || (vModId == "FXREM")) {
      if (trnMode == "4") {
        if (window.document.frmTrans.Mfgpaydt.Rows == 4) {
          sumDrCr(1, "DELALL")
          window.document.frmTrans.Mfgpaydt.Rows = 1

        }
        else if (window.document.frmTrans.Mfgpaydt.Rows == 3) {
          sumDrCr(1, "DELALL")
          window.document.frmTrans.Mfgpaydt.Rows = 1

        }
        else {
          sumDrCr(rowno, "DEL")
          sumDrCr(rowno + 1, "DEL")

          window.document.frmTrans.Mfgpaydt.RemoveItem(rowno)
          window.document.frmTrans.Mfgpaydt.RemoveItem(rowno)

        }
      }
      else if ((trnMode == "1") || (trnMode == "2")) {
        sumDrCr(1, "DELALL")
        window.document.frmTrans.Mfgpaydt.Rows = 1
      }
      else if (trnMode == "3") {
        sumDrCr(rowno, "DEL")
        window.document.frmTrans.Mfgpaydt.RemoveItem(rowno)

      }
    }
    else if (vMode == "TRANS") {
      sumDrCr(rowno, "DEL")
      window.document.frmTrans.Mfgpaydt.RemoveItem(rowno)
      Rselect = window.document.frmTrans.Mfgpaydt.Rows - 1
    }
    else if ((vMode == "PAY") || (vMode == "REC")) {
      sumDrCr(1, "DELALL")
      window.document.frmTrans.Mfgpaydt.Rows = 1
    }
  }
  else {
    sumDrCr(1, "DELALL")
    window.document.frmTrans.Mfgpaydt.Rows = 1
    Rselect = window.document.frmTrans.Mfgpaydt.Rows - 1
  }
}
//---------------------------------------------------------------------------------- 
function Flexrowdeleteid(st) {

  if (st == "Delete") {

  }
  else {
    alert(st)
  }
  balanceDet()
}
//----------------------------------------------------------------------------------
function GLParameters() {
  var strPrm = "";
  var appDt = "<%=vAppdate%>"
  if ((window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") || (appDt == "") ||
    (window.document.frmTrans.txtModId.value == "") || (strsessionflds[8] == "") ||
    (window.document.frmTrans.txtGLcode.value == "") || (strsessionflds[0] == "")) {
    return
  }

  strPrm = "GL" + "~" + window.document.frmTrans.txtModId.value + "~" +
    window.document.frmTrans.txtGLcode.value + "~" + appDt + "~" +
    window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtbranchcode.value + "~" + strsessionflds[0] + "~" +
    strsessionflds[8]

  window.document.all['iPrm'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genparameters.aspx?strparam=" + strPrm

}
//----------------------------------------------------------------------------------       
function AccParameters(AccNoOrCatCode, AccOrCat) {

  var strPrm = "";
  var modId = window.document.frmTrans.txtModId.value.toUpperCase();
  var appDt = "<%=vAppdate%>"

  if (modId != "SB" && modId != "CA" && modId != "DEP" && modId != "LOAN" && modId != "CC")
    return;

  if ((window.document.frmTrans.txtbranchcode.value == "") ||
    (window.document.frmTrans.txtcurrencycode.value == "") || (appDt == "") ||
    (window.document.frmTrans.txtModId.value == "") || (strsessionflds[8] == "") ||
    (window.document.frmTrans.txtGLcode.value == "") || (strsessionflds[0] == "") ||
    (AccNoOrCatCode == "")) {
    return
  }

  strPrm = "ACCOUNT" + "~" + window.document.frmTrans.txtModId.value + "~" +
    window.document.frmTrans.txtGLcode.value + "~" + appDt + "~" +
    window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtbranchcode.value + "~" + strsessionflds[0] + "~" +
    strsessionflds[8] + "~" + AccNoOrCatCode + "~" + AccOrCat

  window.document.all['iPrm'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genparameters.aspx?strparam=" + strPrm

}
//----------------------------------------------------------------------------------   
function GLParamRtn(strRslt) {

  var arrInd
  if (strRslt == "No Parameters") {
    alert("No Parameters Specified for this GL")
    return
  }

  var parmVal = strRslt.split("~")
  arrInd = parmVal.length

  if (arrInd == 0) {
    alert("No Parameters Specified for this GL")
    return
  }

  pIntDrGL = parmVal[1]; pIntCrGL = parmVal[2]; pIntAccrGL = parmVal[3];

  pCashDrYN = parmVal[arrInd - 7]; pCashCrYN = parmVal[arrInd - 6];
  pTransDrYN = parmVal[arrInd - 5]; pTransCrYN = parmVal[arrInd - 4];
  pClgDrYN = parmVal[arrInd - 3]; pClgCrYN = parmVal[arrInd - 2];

  if (parmVal[0] == "DEP") {
    pODGL = parmVal[4]; pIntPayMethod = parmVal[5]; pDRenOddAmtYN = parmVal[7];
    pIntCompYN = parmVal[8]; pDIntPayPrdcYN = parmVal[9]; pDIntPrdctyPymnt = parmVal[10];
    pDInstsYN = parmVal[11]; pDUnitsYN = parmVal[19]; pDUnitVal = parmVal[20];
    pDPreMatWDYN = parmVal[21]; pDIntRoundOffTo = parmVal[23]; pDLoanonDepYN = parmVal[26];

  }
  DRandCRCheck()
}
//----------------------------------------------------------------------------------        
function AccParamRtn(strRslt) {
  pMinAmt = ""; pMaxAmt = ""; pMinPrdYrs = ""; pMinPrdMons = "";
  pMinPrdDays = ""; pMaxPrdYrs = ""; pMaxPrdMons = ""; pMaxPrdDays = "";
  pMultplesOf = "";

  var arrInd
  if (strRslt == "No Parameters") {
    alert("No Parameters Specified ")
    return
  }

  var parmVal = strRslt.split("~")

  if (parmVal[0] == 0 || parmVal[1] == 0) {
    alert("No Parameters Specified ")
    return
  }

  pMinAmt = parmVal[0]; pMaxAmt = parmVal[1]; pMinPrdYrs = parmVal[2]; pMinPrdMons = parmVal[3];
  pMinPrdDays = parmVal[4]; pMaxPrdYrs = parmVal[5]; pMaxPrdMons = parmVal[6];
  pMaxPrdDays = parmVal[7];
  //pChqVldPrd=parmVal[46];pMultplesOf=parmVal[83];

  pMultplesOf = parmVal[83];
}
//----------------------------------------------------------------------------------  
function DRandCRCheck() {
  if (window.document.frmTrans.tranmode(0).checked == true) {
    if ((pTransDrYN == "N") && (vMode == "TRANS")) {
      alert("Debit Transfer not allowed on " + window.document.frmTrans.txtGLDesc.value)
      window.document.frmTrans.txtGLcode.value = ""
      window.document.frmTrans.txtGLDesc.value = ""
    }
    if ((pCashDrYN == "N") && (vMode == "PAY")) {
      alert("Cash Debits are not allowed on " + window.document.frmTrans.txtGLDesc.value)
      window.document.frmTrans.txtGLcode.value = ""
      window.document.frmTrans.txtGLDesc.value = ""
    }
  }
  else if (window.document.frmTrans.tranmode(1).checked == true) {
    if ((pTransCrYN == "N") && (vMode == "TRANS")) {
      alert("Credit Transfer not allowed on " + window.document.frmTrans.txtGLDesc.value)
      window.document.frmTrans.txtGLcode.value = ""
      window.document.frmTrans.txtGLDesc.value = ""
    }

    if ((pCashCrYN == "N") && (vMode == "REC")) {
      alert("Cash Credits are not allowed on " + window.document.frmTrans.txtGLDesc.value)
      window.document.frmTrans.txtGLcode.value = ""
      window.document.frmTrans.txtGLDesc.value = ""
    }
  }
  else if (window.document.frmTrans.tranmode(2).checked == true) {
    if (pClgDrYN == "N") {
      alert("Clearing Debits are not allowed on " + window.document.frmTrans.txtGLDesc.value)
      window.document.frmTrans.txtGLcode.value = ""
      window.document.frmTrans.txtGLDesc.value = ""
    }
  }
}
//----------------------------------------------------------------------------------        
//Assigning precision when  form is loading.
function precform(amount) {
  if (window.document.frmTrans.hpr.value == "") {
    window.document.frmTrans.hpr.value = "<%=prec%>"
  }
  if (amount.value == "") {
    amount.value = "0"
  }
  if (window.document.frmTrans.fxhpr.value == "") {
    window.document.frmTrans.fxhpr.value = "<%=prn%>"
  }
  if (window.document.frmTrans.txtFAmount.value == "") {
    window.document.frmTrans.txtFAmount.value = "0"
  }


}
//----------------------------------------------------------------------------------
function amtPrec() {
  precform(window.document.frmTrans.txtAmt)
  precision(window.document.frmTrans.txtAmt, eval(window.document.frmTrans.hpr.value))
}
//----------------------------------------------------------------------------------	
function fxAmtPrec() {
  precform(window.document.frmTrans.txtFAmount)
  precision(window.document.frmTrans.txtFAmount, eval(window.document.frmTrans.fxhpr.value))
}
//----------------------------------------------------------------------------------	

//------------------------------------------------------------------------------------	
function mfgPaydtMod() {

  if (window.document.frmTrans.txtModId.value != "") {
    alert("Modify already selected row")
    return false;
  }
  mode = "MODIFY";
  if (window.document.frmTrans.Mfgpaydt.RowSel > 0) {
    Rselect = window.document.frmTrans.Mfgpaydt.RowSel;
    oldAmt = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 6);
    FlexModify(window.document.frmTrans.Mfgpaydt.RowSel);
  }

}
//----------------------------------------------------------------------------------

function dispDetModify(Rselect) {
  ModuleClear()

  for (i = 1; i < window.document.frmTrans.mfgDisp.Rows; i++) {
    var modRowChk
    modRowChk = window.document.frmTrans.mfgDisp.TextMatrix(i, 34)

    if (modRowChk == "MODIFY") {
      mode = "MODIFY"
      alert("Modify already selected row")
      return
    }
  }


  // Rselect=window.document.frmTrans.Mfgpaydt.RowSel;
  oldAmt = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 6);
  window.document.frmTrans.hdnBatchNo.value = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 0)
  window.document.frmTrans.hdnTranNo.value = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 1)

  window.document.frmTrans.mfgDisp.Rows = window.document.frmTrans.mfgDisp.Rows + 1
  mfgDispRow = window.document.frmTrans.mfgDisp.Rows - 1

  with (window.document.frmTrans.mfgDisp) {

    TextMatrix(mfgDispRow, 0) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 17)
    TextMatrix(mfgDispRow, 1) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 26)
    TextMatrix(mfgDispRow, 2) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 2)
    TextMatrix(mfgDispRow, 3) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 3)

    TextMatrix(mfgDispRow, 4) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 80)
    TextMatrix(mfgDispRow, 5) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 4)
    TextMatrix(mfgDispRow, 7) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 6)
    TranMode()

    TextMatrix(mfgDispRow, 8) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 47)
    TextMatrix(mfgDispRow, 9) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 48)
    TextMatrix(mfgDispRow, 10) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 81)
    TextMatrix(mfgDispRow, 11) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 39)
    TextMatrix(mfgDispRow, 12) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 40)
    TextMatrix(mfgDispRow, 13) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 10)
    TextMatrix(mfgDispRow, 14) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 27)
    TextMatrix(mfgDispRow, 15) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 20)
    TextMatrix(mfgDispRow, 16) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 12)
    TextMatrix(mfgDispRow, 17) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 18)
    TextMatrix(mfgDispRow, 18) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 14)
    TextMatrix(mfgDispRow, 19) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 32)
    TextMatrix(mfgDispRow, 20) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 33)
    TextMatrix(mfgDispRow, 21) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 34)
    TextMatrix(mfgDispRow, 22) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 35)
    TextMatrix(mfgDispRow, 23) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 36)
    TextMatrix(mfgDispRow, 24) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 37)
    TextMatrix(mfgDispRow, 25) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 9)
    TextMatrix(mfgDispRow, 26) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 38)
    TextMatrix(mfgDispRow, 27) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 83)
    //TextMatrix(mfgDispRow,28)=window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect,64)
    TextMatrix(mfgDispRow, 29) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 85)

    TextMatrix(mfgDispRow, 30) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 21)
    TextMatrix(mfgDispRow, 31) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 22)
    TextMatrix(mfgDispRow, 32) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 23)
    TextMatrix(mfgDispRow, 33) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 24)
    TextMatrix(mfgDispRow, 34) = "MODIFY"

    TextMatrix(mfgDispRow, 35) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 86)
    TextMatrix(mfgDispRow, 36) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 87)

    TextMatrix(mfgDispRow, 37) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 28)//Rate Type
    TextMatrix(mfgDispRow, 38) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 58)//Rate Ref Code

    TextMatrix(mfgDispRow, 39) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 88)//Ref No.
    TextMatrix(mfgDispRow, 40) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 29)//Rate
    TextMatrix(mfgDispRow, 41) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 89)//Ref Date
    TextMatrix(mfgDispRow, 42) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 30)//F Currrency Code
    TextMatrix(mfgDispRow, 43) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 31)//F Amount

    TextMatrix(mfgDispRow, 44) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 90)//Corresponding Bank Code
    TextMatrix(mfgDispRow, 45) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 91)//Corresponding Branch Code
    TextMatrix(mfgDispRow, 46) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 92)//NOSTRO Debit Date
    TextMatrix(mfgDispRow, 47) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 93)//NOSTRO Credit Date
    TextMatrix(mfgDispRow, 48) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 94)//Charge Type

    TextMatrix(mfgDispRow, 49) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 52)//Responding Bank Code
    TextMatrix(mfgDispRow, 50) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 43)//Responding Section Code 

    TextMatrix(mfgDispRow, 51) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 95)//User Id.
    TextMatrix(mfgDispRow, 52) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 96)//Machine Id.
    TextMatrix(mfgDispRow, 55) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 97)//Approved By
    TextMatrix(mfgDispRow, 56) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 98)//Approved M/C

    //For Module Cell values
    TextMatrix(mfgDispRow, 57) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 53)
    //reserved for feature usage   
    TextMatrix(mfgDispRow, 58) = ""
    TextMatrix(mfgDispRow, 59) = ""
    /// reserve ends   
    TextMatrix(mfgDispRow, 60) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 60)
    TextMatrix(mfgDispRow, 61) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 61)

    TextMatrix(mfgDispRow, 62) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 62)
    TextMatrix(mfgDispRow, 63) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 63)
    TextMatrix(mfgDispRow, 64) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 64)
    TextMatrix(mfgDispRow, 65) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 65)
    TextMatrix(mfgDispRow, 66) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 66)

    TextMatrix(mfgDispRow, 67) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 67)
    TextMatrix(mfgDispRow, 68) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 68)
    TextMatrix(mfgDispRow, 69) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 69)
    TextMatrix(mfgDispRow, 70) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 70)
    TextMatrix(mfgDispRow, 71) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 71)

    TextMatrix(mfgDispRow, 72) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 72)
    TextMatrix(mfgDispRow, 73) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 73)
    TextMatrix(mfgDispRow, 74) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 74)
    TextMatrix(mfgDispRow, 75) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 75)
    TextMatrix(mfgDispRow, 76) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 76)

    TextMatrix(mfgDispRow, 77) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 77)
    TextMatrix(mfgDispRow, 78) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 78)
    TextMatrix(mfgDispRow, 79) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 79)
    TextMatrix(mfgDispRow, 80) = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 80)


    //-------------
    Flexrowdelete()
  }
}
//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
function lnkMod() {
  if (window.document.frmTrans.chkLnkMod.checked == true) {
    divsDisplay("divLnkMod", "M")
  }
  else if (window.document.frmTrans.chkLnkMod.checked == false) {
    if ((vMode == "REC") && (CashDenom == 'Y')) {
      divsDisplay("divDenom", "M")
    }
    else {
      divsDisplay("trnsfer", "M")
    }
  }

}
//----------------------------------------------------------------------------------
function tempTrans() {

  if (window.document.frmTrans.chkTransDet.checked == true) {
    if (vMode != "REC") {
      divsDisplay('divTempTrans', 'A')
    }
    else {
      divsDisplay('divTempTrans', 'A')
      divsDisplay('trnsfer', 'M')
    }
  }
  else {
    window.document.all.divTempTrans.style.display = "none"
    window.document.frmTrans.mfgTranslog.Rows = 1
    if (vMode == "REC") {
      if (CashDenom == 'Y')
        divsDisplay("divDenom", "M")
      else
        divsDisplay('trnsfer', 'M')
    }
  }


}
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
function txtAmt_onfocus() {
  // window.document.frmTrans.txtAmt.value=""
}
//----------------------------------------------------------------------------------

//----------------------------------------------------------------------------------
function txtChqFVG_onkeypress() {
  if ((window.document.frmTrans.txtChqFVG.value).length > 39)
    event.keyCode = 0
}
//----------------------------------------------------------------------------------
function UnclrDiv() {

  if (window.document.frmTrans.txtbranchcode.value != "" &&
    window.document.frmTrans.txtcurrencycode.value != "" &&
    window.document.frmTrans.txtModId.value != "" &&
    window.document.frmTrans.txtGLcode.value != "" &&
    window.document.frmTrans.txtAccNo.value != "") {
    strValues = window.document.frmTrans.txtbranchcode.value + "~" +
      window.document.frmTrans.txtcurrencycode.value + "~" +
      window.document.frmTrans.txtModId.value + "~" +
      window.document.frmTrans.txtGLcode.value + "~" +
      window.document.frmTrans.txtAccNo.value + "~" +
      window.document.frmTrans.hpr.value + "~"
    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "unClrBal.aspx?strparm=" + strValues
  }
}

function cntrlOnblurret(txtName) {
  if (txtName == "txtCLGAccNo") {
    var vBrCoder, vModIdr, vGLCoder, vAccNor

    vBrCoder = window.document.frmTrans.txtbranchcode.value.toUpperCase()

    vModIdr = window.document.frmTrans.txtCLGModId.value.toUpperCase()
    vGLCoder = window.document.frmTrans.txtCLGGLcode.value.toUpperCase()
    vAccNor = window.document.frmTrans.txtCLGAccNo.value.toUpperCase()
    if (vBrCoder != "" && vModIdr != "" && vGLCoder != "" && vAccNor != "") {
      strVal = "COMP" + "~!~" + "txtCLGAccNm" + "~!~" + vBrCoder + "~!~" + vModIdr + "~!~" + vGLCoder + "~!~" + vAccNor
    }
  }
  //for Suspense details 
  if (strVal != "") {
    strVal = txtName + "~!~" + strVal
    //alert(strVal)
    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genonblurret.aspx?strParam=" + strVal
  }

}
//----------------------------------------------------------------------------------
function cntrlOnblur(txtName) {

  var strVal
  var vUserid = "<%=session("userid")%>"
  var vBrCode = window.document.frmTrans.txtbranchcode.value.toUpperCase()
  var strWhr = ""
  if (window.document.frmTrans.item(txtName).value == "") {
    return
  }

  window.document.frmTrans.item(txtName).value =
    window.document.frmTrans.item(txtName).value.toUpperCase()
  strVal = ""

  //Lost Focus from Single recordset component
  Dataarrange(window.document.frmTrans.item(txtName))
  if (txtName == "txtcurrencycode") {
    strWhr = "upper(currencycode)='" + window.document.frmTrans.txtcurrencycode.value.toUpperCase() + "'"
    strVal = "GEN" + "~!~" + "txtcurrencydesc" + "~!~" + "GENCURRENCYTYPEMST" + "~!~" + "narration" + "~!~" + strWhr
  }
  else if (txtName == "txtServiceId") {
    document.getElementById("divPhSign").style.display = 'none';
    strWhr = "upper(code)='" + window.document.frmTrans.txtServiceId.value.toUpperCase() + "'"
    strVal = "GEN" + "~!~" + "txtServiceName" + "~!~" + "GENSERVICETYPESPMT" + "~!~" + "narration" + "~!~" + strWhr
    ServiceIdDivs()
  }
  else if (txtName == "txtCLGBankCode") {
    vBankCode = window.document.frmTrans.txtCLGBankCode.value.toUpperCase();

    if (vBankCode != "") {
      if (window.document.frmTrans.txtCLGReasoncode.value == "") {
        alert("Enter Reason Code")
        window.document.frmTrans.txtCLGBankCode.value = ""
        return;
      }
      strWhr = "upper(trim(BANKCODE))='" + vBankCode + "'"
      strVal = "GEN" + "~!~" + "hdnClg" + "~!~" + "GENOTHERBANKMST" + "~!~" + "BANKNAME" + "~!~" + strWhr

    }
  }
  else if (txtName == "txtCLGBranch") {
    vBankCode = window.document.frmTrans.txtCLGBankCode.value.toUpperCase();
    vBranchCode = window.document.frmTrans.txtCLGBranch.value.toUpperCase();
    if (window.document.frmTrans.txtCLGBankCode.value == "") {
      alert("Enter Bank Code")
      window.document.frmTrans.txtCLGBranch.value = ""
      return;
    }
    strWhr = "upper(trim(BANKCODE))='" + vBankCode + "' and " +
      "upper(trim(branchcode))='" + vBranchCode + "'"
    strVal = "GEN" + "~!~" + "hdnClg" + "~!~" + "GENOTHERBRANCHMST" + "~!~" + "BRANCHNAME" + "~!~" + strWhr


  }
  else if (txtName == "txtCLGReason") {
    vCode = window.document.frmTrans.txtCLGReason.value.toUpperCase();

    strWhr = "upper(trim(CODE))='" + vCode + "'"
    strVal = "GEN" + "~!~" + "txtCLGReasoncode" + "~!~" + "CLGRETURNREASONMST" + "~!~" + "DESCRIPTION" + "~!~" + strWhr
  }
  else if (txtName == "txtAccCatCode") {
    vCode = window.document.frmTrans.txtAccCatCode.value.toUpperCase();
    strWhr = "upper(trim(CATEGORYCODE))='" + vCode + "' and CATEGORYCODE<>'99'"
    strVal = "GEN" + "~!~" + "txtAccCatDesc" + "~!~" + "GENCATEGORYMST" + "~!~" + "NARRATION" + "~!~" + strWhr
  }
  //for Remittance Issue by Bank

  else if (txtName == "txtbybnkcode") {
    vCode = window.document.frmTrans.txtbybnkcode.value.toUpperCase();
    //old code commented on 26-sep-2007
    //Reason: Wrong branch codes are showing to the user    

    // New code written on 26-sep-2007
    BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
    CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
    //RemType=window.document.frmTrans.txtGLcode.value.toUpperCase()
    //alert("rem type=" + remtype)
    if ((remtype == "ADD") || (remtype == "TC")) {

      //CODE COMMENTED BY RADHIKA ON 14 MAY 2008
      //REASON: FOR AGENCY DD, WE SHOULD SHOW BANK CODES FROM CORRESPONDING BANKS

      /*strWhr="upper(trim(OURBRANCHCODE))=trim('" + BranchCd + "') AND status='R' " +
        " AND bankcode IN (SELECT DISTINCT OTHERBANKCODE  FROM REMISSUEBANKMST " +
        " WHERE upper(trim(BRANCHCODE))=trim('" + BranchCd + "') AND  " +
        " upper(trim(CURRENCYCODE))=trim('" + CurCd +  "') " +
        " AND upper(trim(REMTYPE))=trim('" + remtype + "') " +
        " AND upper(trim(OTHERBANKCODE))=trim('" + vCode + "') " +
        " AND status='R')"        
    
      strVal="GEN"+"~!~"+"txtbybnkdesc"+"~!~"+"GENOTHERBANKMST"+"~!~"+
      "BANKNAME"+"~!~"+strWhr
      */

      //NEW CODE WRITTEN ON 14 MAY 2008
      strWhr = "status='R' AND bankcode IN (SELECT DISTINCT OTHERBANKCODE" +
        " FROM REMISSUEBANKMST WHERE UPPER(trim(CURRENCYCODE))='" +
        CurCd + "' AND UPPER(trim(REMTYPE))='" +
        remtype + "' AND status='R')" +
        " and bankcode='" + vCode + "'"

      strVal = "GEN" + "~!~" + "txtbybnkdesc" + "~!~" + "GENCORRESPBANKSMST" + "~!~" +
        "BANKNAME" + "~!~" + strWhr

    }
    else if ((remtype == "DD") || (remtype == "TT") || (remtype == "MT") ||
      (remtype == "BC") || (remtype == "GC") || (remtype == "PO")) {

      strWhr = "upper(trim(BANKCODE))='" + vCode + "'"
      strVal = "GEN" + "~!~" + "txtbybnkdesc" + "~!~" + "GENBANKPARM" + "~!~" + "bankname" + "~!~" + strWhr
    }
    else {
      strWhr = "upper(trim(BANKCODE))='" + vCode + "'"
      strVal = "GEN" + "~!~" + "txtbybnkdesc" + "~!~" + "GENBANKPARM" + "~!~" + "bankname" + "~!~" + strWhr
    }

  }

  //
  else if (txtName == "txtissbnkcode") {
    vCode = window.document.frmTrans.txtissbnkcode.value.toUpperCase();
    //old code commented on 26-sep-2007
    //Reason: Wrong branch codes are showing to the user
    /*if(window.document.frmTrans.txtGLcode.value.toUpperCase()=="ADD"){
      strWhr="upper(trim(Bankcode))='"+vCode+"' and upper(status)='R'"
       strVal="GEN"+"~!~"+"txtissbnkdesc"+"~!~"+"GENOTHERBANKMST"+"~!~"+"BANKNAME"+"~!~"+strWhr
      }
      else{
      glcd=window.document.frmTrans.txtGLcode.value.toUpperCase()
      strWhr="upper(trim(ISSUEDONBANKCODE))='"+vCode+"' and upper(REMGLCODE)='"+glcd+"' and upper(status)='R'" 
       strVal="GEN"+"~!~"+"txtissbnkdesc"+"~!~"+"REMTYPEMST"+"~!~"+"ISSUEDONBANKDESC"+"~!~"+strWhr
     
      }	*/


    // New code written on 26-sep-2007
    BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
    CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()

    //alert("rem type=" + remtype)
    if ((remtype == "ADD") || (remtype == "TC")) {
      //CODE COMMENTED BY RADHIKA ON 14 MAY 2008
      //REASON: FOR AGENCY DD, WE SHOULD SHOW BANK CODES FROM CORRESPONDING BANKS
      /*strWhr="upper(trim(OURBRANCHCODE))=trim('" + BranchCd + "') AND status='R' " +
        " AND bankcode IN (SELECT DISTINCT OTHERBANKCODE  FROM REMISSUEBANKMST " +
        " WHERE upper(trim(BRANCHCODE))=trim('" + BranchCd + "') AND  " +
        " upper(trim(CURRENCYCODE))=trim('" + CurCd +  "') " +
        " AND upper(trim(REMTYPE))=trim('" + remtype + "') " +
        " AND upper(trim(OTHERBANKCODE))=trim('" + vCode + "') " +
        " AND status='R')"    
    
    
      strVal="GEN"+"~!~"+"txtissbnkdesc"+"~!~"+"GENOTHERBANKMST"+"~!~"+"BANKNAME"+
      "~!~"+strWhr*/

      //NEW CODE WRITTEN ON 14 MAY 2008
      strWhr = "status='R' AND bankcode IN (SELECT DISTINCT OTHERBANKCODE" +
        " FROM REMISSUEBANKMST WHERE UPPER(trim(CURRENCYCODE))='" +
        CurCd + "' AND UPPER(trim(REMTYPE))='" +
        remtype + "' AND status='R')" +
        " and bankcode='" + vCode + "'"

      strVal = "GEN" + "~!~" + "txtissbnkdesc" + "~!~" + "GENCORRESPBANKSMST" + "~!~" + "BANKNAME" +
        "~!~" + strWhr

    }
    else if ((remtype == "DD") || (remtype == "TT") || (remtype == "MT") ||
      (remtype == "BC") || (remtype == "GC") || (remtype == "PO")) {

      strWhr = "upper(trim(BANKCODE))='" + vCode + "'"
      strVal = "GEN" + "~!~" + "txtissbnkdesc" + "~!~" + "GENBANKPARM" + "~!~" + "bankname" + "~!~" + strWhr
    }
    else {
      strWhr = "upper(trim(BANKCODE))='" + vCode + "'"
      strVal = "GEN" + "~!~" + "txtissbnkdesc" + "~!~" + "GENBANKPARM" + "~!~" + "bankname" + "~!~" + strWhr
    }

  }

  //Issue by Branch
  else if (txtName == "txtbybrcode") {
    var vCode = window.document.frmTrans.txtbybnkcode.value.toUpperCase();
    var othBrCode = window.document.frmTrans.txtbybrcode.value.toUpperCase();

    //alert("remtype=" + remtype)
    if (othBrCode != "") {


      BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
      CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()

      if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") ||
        (remtype.toUpperCase() == "TT")) {
        if (BranchCd == othBrCode) {
          alert("Can't be respond to the Instrument of the same Branch")
          window.document.frmTrans.txtbybrcode.value = ""
          window.document.frmTrans.txtbybrcode.value = ""
          window.document.frmTrans.txtbybrcode.focus()
          return
        }
      }

      if ((remtype == "DD") || (remtype == "TT") || (remtype == "MT")) {

        strWhr = "upper(trim(BANKCODE))='" + vCode + "' and upper(trim(BranchCODE))='"
          + othBrCode + "'"
        strVal = "GEN" + "~!~" + "txtbybrdesc" + "~!~" + "GENBANKBRANCHMST" + "~!~" + "BRANCHNAME" +
          "~!~" + strWhr

      }
      else if ((remtype == "ADD") || (remtype == "TC")) {

        //CODE COMMENTED BY RADHIKA ON 14 MAY 2008
        //REASON: FOR AGENCY DD, WE SHOULD SHOW Branches of CORRESPONDING BANKS

        /*strWhr="upper(trim(OURBRANCHCODE))=trim('" + BranchCd + "') AND status='R' " +
            " AND upper(trim(BANKCODE))=trim('" + vCode + "')" +
            " AND upper(trim(BRANCHCODE))=trim('" + othBrCode + "')" +
            " AND BRANCHCODE IN (SELECT DISTINCT OTHERBRANCHCODE FROM REMISSUEBANKMST "+
            " WHERE upper(trim(BRANCHCODE))=trim('" + BranchCd + "') AND  " +
            " upper(trim(CURRENCYCODE))=trim('" + CurCd + "') " +
            " AND upper(trim(REMTYPE))='" + remtype + "'" +
            " AND upper(trim(OTHERBANKCODE))=trim('" + vCode + "')" +
            " AND upper(trim(OTHERBRANCHCODE))=trim('" + othBrCode + "')" +
            " AND status='R')"		
        
          
          strVal="GEN"+"~!~"+"txtbybrdesc"+"~!~"+"GENOTHERBRANCHMST"+"~!~"+"BRANCHNAME"+
          "~!~"+strWhr*/

        //new code written on 14 may 2008
        strWhr = "status='R' AND upper(trim(BANKCODE))='" + vCode + "'" +
          " and BRANCHCODE='" + othBrCode + "'"

        strVal = "GEN" + "~!~" + "txtbybrdesc" + "~!~" + "GENCORRESPBANKBRANCHESMST" +
          "~!~" + "BRANCHNAME" + "~!~" + strWhr

      }
    }

  }
  //  window.document.frmTrans.txtissbrdesc 
  //------
  else if (txtName == "txtissbrcode") {
    var vCode = window.document.frmTrans.txtissbnkcode.value.toUpperCase();
    var othBrCode = window.document.frmTrans.txtissbrcode.value.toUpperCase();

    if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") || (remtype.toUpperCase() == "TT")) {
      if (vBrCode == othBrCode) {
        alert("Instrument can't be issued on the same Branch")
        window.document.frmTrans.txtissbrcode.value = ""
        window.document.frmTrans.txtissbrdesc.value = ""
        window.document.frmTrans.txtissbrcode.focus()
        return
      }
    }

    if ((vCode != "") && (othBrCode != "")) {
      BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
      CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()

      if ((remtype == "DD") || (remtype == "TT") || (remtype == "MT")) {

        strWhr = "upper(trim(BANKCODE))='" + vCode + "' and upper(trim(BranchCODE))='"
          + othBrCode + "'"
        strVal = "GEN" + "~!~" + "txtissbrdesc" + "~!~" + "GENBANKBRANCHMST" + "~!~" + "BRANCHNAME" +
          "~!~" + strWhr

      }
      else if ((remtype == "ADD") || (remtype == "TC")) {

        //CODE COMMENTED BY RADHIKA ON 14 MAY 2008
        //REASON: FOR AGENCY DD, WE SHOULD SHOW Branches of CORRESPONDING BANKS
        /*
        strWhr="upper(trim(OURBRANCHCODE))=trim('" + BranchCd + "') AND status='R' " +
            " AND upper(trim(BANKCODE))=trim('" + vCode + "')" +
            " AND upper(trim(BRANCHCODE))=trim('" + othBrCode + "')" +
            " AND BRANCHCODE IN (SELECT DISTINCT OTHERBRANCHCODE FROM REMISSUEBANKMST "+
            " WHERE upper(trim(BRANCHCODE))=trim('" + BranchCd + "') AND  " +
            " upper(trim(CURRENCYCODE))=trim('" + CurCd + "') " +
            " AND upper(trim(REMTYPE))='" + remtype + "'" +
            " AND upper(trim(OTHERBANKCODE))=trim('" + vCode + "')" +
            " AND upper(trim(OTHERBRANCHCODE))=trim('" + othBrCode + "')" +
            " AND status='R')"		
        
          
          strVal="GEN"+"~!~"+"txtissbrdesc"+"~!~"+"GENOTHERBRANCHMST"+"~!~"+"BRANCHNAME"+
          "~!~"+strWhr */

        //new code written on 14 may 2008
        strWhr = "status='R' AND upper(trim(BANKCODE))='" + vCode + "'" +
          " and BRANCHCODE='" + othBrCode + "'"

        strVal = "GEN" + "~!~" + "txtissbrdesc" + "~!~" + "GENCORRESPBANKBRANCHESMST" +
          "~!~" + "BRANCHNAME" + "~!~" + strWhr

      }
    }
  }


  //------
  else if (txtName == "txtFRateRefCode") {

    var RateType = window.document.frmTrans.cmbFRateType.options
    [window.document.frmTrans.cmbFRateType.selectedIndex].value

    if (RateType == "") {
      window.document.frmTrans.txtFRateRefCode.value = ""
      return
    }
    var vCode = window.document.frmTrans.txtFRateRefCode.value.toUpperCase()

    strWhr = "upper(CODE)='" + vCode + "' and upper(status)='R'"
    if (RateType == "C") {
      strVal = "GEN" + "~!~" + "txtFRateRefDesc" + "~!~" + "FXGENCARDRATECATEGORIESPMT" + "~!~" + "NARRATION" + "~!~" + strWhr
    }
    else if (RateType == "D") {
      strVal = "GEN" + "~!~" + "txtFRateRefDesc" + "~!~" + "FXDEALINGROOMMST" + "~!~" + "NARRATION" + "~!~" + strWhr
    }
    else if (RateType == "N") {
      strWhr = "upper(CATEGORY)='" + vCode + "' and upper(status)='R'"
      strVal = "GEN" + "~!~" + "txtFRateRefDesc" + "~!~" + "FXGENRATECATEGORIESPMT" + "~!~" + "NARRATION" + "~!~" + strWhr
    }
    else if (RateType == "F") {
      strWhr = "upper(ACCNO)='" + vCode + "' and upper(status)='R' and upper(transtatus)='A'"
      strVal = "GEN" + "~!~" + "txtFRateRefDesc" + "~!~" + "FXFCMST" + "~!~" + "NAME" + "~!~" + strWhr
    }
  }


  //Lost focus from Component


  if (txtName == "txtbranchcode") {
    vUserid = "<%=session("userid")%>"
    if (vUserid != "" && vBrCode != "") {
      strVal = "COMP" + "~!~" + "txtbranchdesc" + "~!~" + vBrCode + "~!~" + vUserid
    }
    var aBrCode
    aBrCode = "<%=session("branchcode")%>"
    if ((window.document.frmTrans.txtbranchcode.value.toUpperCase() !=
      aBrCode.toUpperCase()) && (window.document.frmTrans.Mfgpaydt.Rows == 1)) {
      window.document.frmTrans.chkABB.checked = true
      window.document.frmTrans.chkDispAccNo.disabled = true
    }
    else if ((window.document.frmTrans.txtbranchcode.value.toUpperCase() ==
      aBrCode.toUpperCase()) && (window.document.frmTrans.Mfgpaydt.Rows == 1)) {
      window.document.frmTrans.chkABB.checked = false
      window.document.frmTrans.chkDispAccNo.disabled = true
    }
    //AbbApplDt()      
    AbbApplDtBr()
  }


  else if (txtName == "txtModId") {
    //alert("fs")
    document.getElementById("divPhSign").style.display = 'none';
    window.document.frmTrans.txtModId.value = window.document.frmTrans.txtModId.value.toUpperCase()
    var vModId = window.document.frmTrans.txtModId.value.toUpperCase()

    if (vBrCode != "" && vModId != "") {
      strVal = "COMP" + "~!~" + "txtModDesc" + "~!~" + vBrCode + "~!~" + vModId

      parm = window.document.frmTrans.txtModDesc.value +
        "-----" + window.document.frmTrans.txtModId.value.toUpperCase()
      if ((vModId == "REM") && ((window.document.frmTrans.tranmode(0).checked == true) ||
        (window.document.frmTrans.tranmode(2).checked == true))) {
        divsDisplay("remdr", "M")
        divsDisplay("remdr", "M")
        window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"
      }
      else if ((vModId == "REM") && (window.document.frmTrans.tranmode(1).checked == true)) {
        divsDisplay("remcr", "M")
        window.document.all.divComm.style.display = "block";
        window.document.all['divfxRem'].style.display = "block";
        window.document.all['divrembank'].style.display = "block";
      }

      window.document.all.divaccno.style.display = "none"
    }

    if (window.document.frmTrans.tranmode(2).checked == true) {
      if (vModId == "REM") {
        window.document.frmTrans.chkCheque.checked = false;
      }
      else {
        window.document.frmTrans.chkCheque.checked = true;
      }
      Cheque()
    }

  }

  else if (txtName == "txtGLcode") {
    document.getElementById("divPhSign").style.display = 'none';
    window.document.frmTrans.txtGLcode.value = window.document.frmTrans.txtGLcode.value.toUpperCase()
    vModId = window.document.frmTrans.txtModId.value.toUpperCase()
    vGLCode = window.document.frmTrans.txtGLcode.value.toUpperCase()

    if (vBrCode != "" && vModId != "" && vGLCode != "") {
      strVal = "COMP" + "~!~" + "txtGLDesc" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode
      /*if((window.document.frmTrans.txtModId.value=="REM")||(window.document.frmTrans.txtModId.value=="FXREM")){
       Remclear()
       getremtype()
        
      } */
      parm = window.document.frmTrans.txtGLDesc.value + "-----" +
        window.document.frmTrans.txtGLcode.value

    }
  }
  else if (txtName == "txtAccNo") {
    document.getElementById("divPhotoSignature").style.display = 'none';
    window.document.frmTrans.txtAccNo.value = window.document.frmTrans.txtAccNo.value.toUpperCase()
    vModId = window.document.frmTrans.txtModId.value.toUpperCase()
    vGLCode = window.document.frmTrans.txtGLcode.value.toUpperCase()
    vAccNo = window.document.frmTrans.txtAccNo.value.toUpperCase()
    vCurCode = window.document.frmTrans.txtcurrencycode.value.toUpperCase()

    if (vBrCode != "" && vModId != "" && vGLCode != "" && vAccNo != "") {
      strVal = "COMP" + "~!~" + "txtAccNm" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode + "~!~" + vAccNo

      if (vModId == 'SCR')
        strVal = strVal + "~!~" + vCurCode

    }
    if (vModId == "SCR") {
      SuspenseDtls()
    }
    // checking for chequebookYN
    if (vModId == "SB" || vModId == "CA" || vModId == "CC") {
      GetAccDets()
    }
  }

  //for Link details
  else if (txtName == "txtLnkModId") {
    if (vBrCode != "") {
      var vModId = window.document.frmTrans.txtLnkModId.value.toUpperCase()

      if (vBrCode != "" && vModId != "") {
        strVal = "COMP" + "~!~" + "txtLnkModDesc" + "~!~" + vBrCode + "~!~" + vModId
      }
    }
  }
  else if (txtName == "txtLnkGLCode") {
    vModId = window.document.frmTrans.txtLnkModId.value.toUpperCase()
    vGLCode = window.document.frmTrans.txtLnkGLCode.value.toUpperCase()

    if (vBrCode != "" && vModId != "" && vGLCode != "") {
      strVal = "COMP" + "~!~" + "txtLnkGLname" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode
    }

  }
  else if (txtName == "txtLnkAccNo") {
    vModId = window.document.frmTrans.txtLnkModId.value.toUpperCase()
    vGLCode = window.document.frmTrans.txtLnkGLCode.value.toUpperCase()
    vAccNo = window.document.frmTrans.txtLnkAccNo.value.toUpperCase()
    if (vBrCode != "" && vModId != "" && vGLCode != "" && vAccNo != "") {
      strVal = "COMP" + "~!~" + "txtLnkAccNm" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode + "~!~" + vAccNo

    }
  }


  //for Clearing details

  else if (txtName == "txtCLGModId") {
    document.getElementById("divPhotoSignature").style.display = 'none';
    if (vBrCode != "") {
      var vModId = window.document.frmTrans.txtCLGModId.value.toUpperCase()

      if (vBrCode != "" && vModId != "") {
        strVal = "COMP" + "~!~" + "txtCLGModDesc" + "~!~" + vBrCode + "~!~" + vModId
      }
    }

  }
  else if (txtName == "txtCLGGLcode") {
    document.getElementById("divPhotoSignature").style.display = 'none';
    vModId = window.document.frmTrans.txtCLGModId.value.toUpperCase()
    vGLCode = window.document.frmTrans.txtCLGGLcode.value.toUpperCase()

    if (vBrCode != "" && vModId != "" && vGLCode != "") {
      strVal = "COMP" + "~!~" + "txtCLGGLName" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode
    }

  }
  else if (txtName == "txtCLGAccNo") {
    vModId = window.document.frmTrans.txtCLGModId.value.toUpperCase()
    vGLCode = window.document.frmTrans.txtCLGGLcode.value.toUpperCase()
    vAccNo = window.document.frmTrans.txtCLGAccNo.value.toUpperCase()
    if (vBrCode != "" && vModId != "" && vGLCode != "" && vAccNo != "") {
      strVal = "COMP" + "~!~" + "txtCLGAccNm" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode + "~!~" + vAccNo

    }
  }
  //for Suspense details 
  if (strVal != "") {
    strVal = txtName + "~!~" + strVal
    //alert(strVal)
    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genonblur.aspx?strParam=" + strVal
  }


}

function ReturnedBack(str) {
  if (str == "txtServiceId") {
    if (window.document.frmTrans.txtServiceName.value != "") {
      window.document.frmTrans.txtModId.focus()
    }
  }
  else if (str == "txtModId") {
    if (window.document.frmTrans.txtModDesc.value != "") {
      window.document.frmTrans.txtGLcode.focus()
    }
  }
  else if (str == "txtGLcode") {
    if (window.document.frmTrans.tranmode[2].checked == true) {
      if (window.document.frmTrans.txtModId.value == "REM") {
        window.document.frmTrans.txtinstrno.focus()
      }
    }
    else {
      if (window.document.frmTrans.txtModId.value == "REM") {
        if (window.document.frmTrans.txtGLDesc.value != "") {
          window.document.frmTrans.txtAmt.focus()
          window.document.frmTrans.txtAmt.value = "0.00"
          window.document.frmTrans.txtAmt.select()
        }
      }
      else {
        if (window.document.frmTrans.txtGLDesc.value != "") {
          window.document.frmTrans.txtAccNo.focus()
        }
      }
    }

  }
  else if (str == "txtAccNo") {
    if (window.document.frmTrans.txtAccNm.value != "") {
      window.document.frmTrans.txtAmt.focus()
      window.document.frmTrans.txtAmt.value = "0.00"
      window.document.frmTrans.txtAmt.select()
    }
  }
}

//----------------------------------------------------------------------------------
function dispDetails() {
  if (window.document.frmTrans.chkDispDtls.checked == true) {
    // window.document.all.divTempTrans.style.display="none"
    // window.document.all.divDisp.style.display="block"
    divsDisplay("divDisp", "A")
  }
  else {
    window.document.all.divDisp.style.display = "none"
    window.document.frmTrans.mfgDisp.Rows = 1
  }
}

//----------------------------------------------------------------------------------
function DispAccNo() {

  AccountClear()
  DispGrid()
}
//----------------------------------------------------------------------------------
function DispGrid() {
  if (window.document.frmTrans.chkDispAccNo.checked == true) {
    window.document.frmTrans.chkDispDtls.checked = true
    //  window.document.all.divDisp.style.display="block"
    //  window.document.all.divTempTrans.style.display="none"
    divsDisplay("divDisp", "A")

  }
  else {
    window.document.frmTrans.chkDispDtls.checked = false
    window.document.all.divDisp.style.display = "none"
    window.document.frmTrans.mfgDisp.Rows = 1
  }
}
//----------------------------------------------------------------------------------
function dispAccDetails(Rsel) {
  if (mode == "MODIFY" && window.document.frmTrans.mfgDisp.TextMatrix(Rsel, 34) != "MODIFY") {
    alert("Modify already selected row")

    return
  }

  if (window.document.frmTrans.mfgDisp.TextMatrix(Rsel, 34) == "MODIFY") {
    mode = "MODIFY"
  }

  with (window.document.frmTrans.mfgDisp) {
    if (eval(TextMatrix(Rsel, 13)) == "4") {
      window.document.frmTrans.tranmode(1).checked = true
    }
    else if (eval(TextMatrix(Rsel, 13)) == "3") {
      window.document.frmTrans.tranmode(0).checked = true
    }

    window.document.frmTrans.txtModId.value = TextMatrix(Rsel, 0).toUpperCase()
    masterTabYN()
    window.document.frmTrans.txtModDesc.value = TextMatrix(Rsel, 1)
    var strMod = ""
    strMod = window.document.frmTrans.txtModDesc.value + "-----" +
      window.document.frmTrans.txtModId.value

    TranMode()
    modulecode(strMod)
    window.document.frmTrans.cmdOk.focus()
    window.document.frmTrans.txtGLcode.value = TextMatrix(Rsel, 2).toUpperCase()
    window.document.frmTrans.txtGLDesc.value = TextMatrix(Rsel, 3)
    window.document.frmTrans.txtAccNo.value = TextMatrix(Rsel, 5).toUpperCase()
    window.document.frmTrans.txtAccNm.value = TextMatrix(Rsel, 6).toUpperCase()


    window.document.frmTrans.chkDispAccNo.checked = true
    balanceDet()

    //window.document.frmTrans.hidtempAmt.value=Math.abs(TextMatrix(Rsel,7))
    //precision(window.document.frmTrans.hidtempAmt,window.document.frmTrans.hpr.value)
    //window.document.frmTrans.txtAmt.value=window.document.frmTrans.hidtempAmt.value
    window.document.frmTrans.txtAmt.value = Math.abs(TextMatrix(Rsel, 7))
    //alert(Math.abs(TextMatrix(Rsel,7)))
    precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)
    window.document.frmTrans.txtServiceId.value = TextMatrix(Rsel, 11)
    window.document.frmTrans.txtServiceName.value = TextMatrix(Rsel, 12)
    window.document.frmTrans.dtpEffDate.Value = TextMatrix(Rsel, 14)
    if (TextMatrix(Rsel, 14) != "") {
      window.document.frmTrans.txtEffDate.value = TextMatrix(Rsel, 14)
    }
    else if (TextMatrix(Rsel, 14) == "") {
      window.document.frmTrans.txtEffDate.value = "<%=session("applicationdate")%>"
    }

    if (TextMatrix(Rsel, 15) == "") {
      window.document.frmTrans.txtNarran.value = TextMatrix(Rsel, 19) + " Rent for Acc no " + TextMatrix(Rsel, 24)
    }
    else {
      window.document.frmTrans.txtNarran.value = TextMatrix(Rsel, 15)
    }
    //      window.document.frmTrans.txtAccNm.value=TextMatrix(Rsel,26)
    window.document.frmTrans.txtAccNm.value = TextMatrix(Rsel, 6)

    if (window.document.frmTrans.mfgDisp.TextMatrix(Rsel, 30).length > 0) {
      window.document.frmTrans.chkCheque.checked = true
      window.document.all['ChqDtl'].style.display = "block"

      //window.document.frmTrans.txtChqSrs.value=TextMatrix(Rsel,30)
      window.document.frmTrans.txtChqNo.value = TextMatrix(Rsel, 31)
      window.document.frmTrans.txtChqDt.value = TextMatrix(Rsel, 32)
      window.document.frmTrans.txtChqFVG.value = TextMatrix(Rsel, 33)
    }

    dispValidations(Rsel)
    lockControls()
  }

}
//----------------------------------------------------------------------------------
function dispValidations(Rsel) {
  var modId = window.document.frmTrans.txtModId.value.toUpperCase()
  with (window.document.frmTrans.mfgDisp) {
    if (modId == "SCR") {
      SuspenseDtls()
    }
    else if (((modId == "REM") || (modId == "FXREM")) &&
      ((window.document.frmTrans.mfgDisp.TextMatrix(Rsel, 13) == "4"))) {
      getremtype()
      window.document.all.divComm.style.display = "none"
      if (modId == "REM") {
        window.document.frmTrans.txtissbnkcode.value = TextMatrix(Rsel, 49)
        window.document.frmTrans.txtissbnkdesc.value = TextMatrix(Rsel, 57)

        window.document.frmTrans.txtissbrcode.value = TextMatrix(Rsel, 60)
        window.document.frmTrans.txtissbrdesc.value = TextMatrix(Rsel, 61)
        window.document.frmTrans.txtfavg.value = TextMatrix(Rsel, 62)
        //window.document.frmTrans.txtcomm.value=TextMatrix(Rsel,64)
        //new code is
        if (TextMatrix(Rsel, 64) != "") {
          var strRem = TextMatrix(Rsel, 64).split(",")
          window.document.frmTrans.txtcomm.value = strRem[0]
          window.document.frmTrans.txtSerivceChrg.value = strRem[1]
        }
        window.document.frmTrans.txtcustrid.value = TextMatrix(Rsel, 65)
        window.document.frmTrans.txtcusn.value = TextMatrix(Rsel, 66)
      }
    }


  }
}

//----------------------------------------------------------------------------------
function masterTabYN() {
  if (window.document.frmTrans.txtModId.value != "") {
    strpm = "MASTTAB" + "~" + window.document.frmTrans.txtModId.value.toUpperCase()

    window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm

  }

}
//----------------------------------------------------------------------------------
function masterTabRtn(strMstTab) {

  mstTab = "YES"

  if ((strMstTab == "N") || (window.document.frmTrans.txtServiceId.value == 2)) {
    window.document.all['divaccno'].style.display = "none";
    mstTab = "NO"
  }
  else {
    window.document.all['divaccno'].style.display = "block";
    mstTab = "YES"
  }

}
//----------------------------------------------------------------------------------
function lockControls() {

  window.document.frmTrans.txtServiceId.readOnly = true
  window.document.frmTrans.cmdServiceId.disabled = true

  window.document.frmTrans.txtModId.readOnly = true
  window.document.frmTrans.cmdModId.disabled = true

  window.document.frmTrans.txtGLcode.readOnly = true
  window.document.frmTrans.cmdGLCode.disabled = true

  window.document.frmTrans.txtAccNo.readOnly = true
  window.document.frmTrans.cmdAccno.disabled = true

  window.document.frmTrans.txtAmt.disabled = true

  if (window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 14) == "") {
    window.document.frmTrans.dtpEffDate.Enabled = true
  }
  else if (window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 14) != "") {
    window.document.frmTrans.dtpEffDate.Enabled = false
  }

  window.document.frmTrans.chkDispAccNo.disabled = true
  window.document.frmTrans.cmdOk.focus()
}



//----------------------------------------------------------------------------------
function branchCurrCode() {
  curCode = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
  curDesc = window.document.frmTrans.txtcurrencydesc.value
  brCode = window.document.frmTrans.txtbranchcode.value.toUpperCase()
  brDesc = window.document.frmTrans.txtbranchdesc.value
}

//----------------------------------------------------------------------------------
function ModuleMandChk(MandFld, OrgFld) {
  if (MandFld.value == "") {
    alert("Branch Code should not be Null")
    window.document.frmTrans.txtbranchcode.focus()
    OrgFld.value = ""
  }
}
//----------------------------------------------------------------------------------
function GLMandChk(MandFld, OrgFld) {
  if (MandFld.value == "") {
    alert("Module id should not be Null")
    window.document.frmTrans.txtModId.focus()
    OrgFld.value = ""
  }
}
//----------------------------------------------------------------------------------
function AccMandChk(MandFld, OrgFld) {
  if (MandFld.value == "") {
    alert("GL Code should not be Null")
    window.document.frmTrans.txtGLcode.focus()
    OrgFld.value = ""
  }
}
//---------------------------------------------------------------------------------- 
function LstMandChk(MandFld, OrgFld, Message) {
  if (MandFld.value == "") {
    alert(Message)
    OrgFld.value = ""
  }
}
//----------------------------------------------------------------------------------
function ModifyClick() {
  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
    Rselect = window.document.frmTrans.Mfgpaydt.RowSel

    if (window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 25) != "Y") {
      trNo = window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 1)
      cnfrm = confirm("Do you want to Modify Tran No : " + trNo)
      if (cnfrm == true) {
        Mfgpaydt_DblClick()
      }
    }
    else {
      alert("Machine Generated Entry Cannot Modifiy")
    }

  }

}

//----------------------------------------------------------------------------------
// Checks wether the transaction is exceptional one or not.
function exceptionCodes() {
  excpCodes = ""
  excpYN = "N"
  if (excpMinBal != "") {
    excpCodes = excpMinBal + "^"
    excpYN = "Y"
  }
  if (excpLmtAmt != "") {
    excpCodes = excpCodes + excpLmtAmt + "^"
    excpYN = "Y"
  }
  if (excpParmAmt != "") {
    excpCodes = excpCodes + excpParmAmt + "^"
    excpYN = "Y"
  }
  excpChq = ""
  if (excpChqSrs != "" || excpChqNo != "") {
    excpChq = "4"
    excpCodes = excpCodes + excpChq + "^"
    excpYN = "Y"
  }
  if (excpEffDt != "") {
    excpCodes = excpCodes + excpEffDt + "^"
    excpYN = "Y"
  }
  if (excpOverDraft != "") {
    excpCodes = excpCodes + excpOverDraft + "^"
    excpYN = "Y"
  }

}

//----------------------------------------------------------------------------------
function excpTranCheck() {
  if (mode == "MODIFY") {
    excptionAmt()
  }
  //alert(Amt)
  //alert(excpAmt)
  //for Parameter Amount  
  if (Math.abs(eval(Amt)) > eval(excpAmt)) {
    excpParmAmt = "3"
    //         excpYN="Y"
  }
  else {
    excpParmAmt = ""
  }
  //for Application Date   
  var applDt = "<%=vAppdate%>"
  if (window.document.frmTrans.txtEffDate.value == applDt) {
    excpEffDt = ""
  }
  else {
    excpEffDt = "5"
    //      excpYN="Y"
  }

}
//----------------------------------------------------------------------------------
function excptionAmt() {
  TranMode()

  strpm = "EXCPAMT" + "~" + window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtModId.value + "~" +
    window.document.frmTrans.txtGLcode.value + "~" + trnMode
  window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
}
//----------------------------------------------------------------------------------
function exceptionAmtRtn(amtRtn) {

  if (amtRtn == "NODATA") {
    excpParmAmt = ""
  }
  else {
    excpAmt = amtRtn
  }
}

function validateSpecialCharacters(txt) {
  var spclChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?"; // specify special characters
  var content = txt.value;
  for (var i = 0; i < content.length; i++) {
    if (spclChars.indexOf(content.charAt(i)) != -1) {
      alert("Special characters are not allowed.");
      txt.value = "";
      txt.focus();
      return false;
    }
  }
  window.document.frmTrans.txtNarran.value = window.document.frmTrans.txtNarran.value.toUpperCase()
}


//*********************************************************************************


//----------------------------------------------------------------------------------  
//This function was written to form denomination values,no of pieces,available amount,
//exchange amount array values.
function denomStrForm() {

  var DValStr = ""
  var DVal = ""
  var DExamtStr = ""
  var DExamt = ""
  var DTypStr = ""
  var DTyp = ""
  var DPayamtStr = ""
  var DPayamt = ""
  var DPayRecAmt = ""
  //to form denom value string	 

  for (i = 1; i < window.document.frames("idenom").frmDenom.mfgDenom.Rows; i++) {

    DVal = window.document.frames("idenom").frmDenom.mfgDenom.TextMatrix(i, 3)
    DValStr = DValStr + DVal + "~"

    DTyp = window.document.frames("idenom").frmDenom.mfgDenom.TextMatrix(i, 1)
    DTypStr = DTypStr + DTyp + "~";

    DPayRecAmt = window.document.frames("idenom").frmDenom.mfgDenom.TextMatrix(i, 5)
    DPayamt = window.document.frames("idenom").frmDenom.mfgDenom.TextMatrix(i, 4)

    if (eval(DPayRecAmt) >= 0) {
      DPayamtStr = DPayamtStr + DPayamt + "~";
    }
    else {
      DPayamt = ""
      DPayamtStr = DPayamtStr + DPayamt + "~";
    }

    DExamt = window.document.frames("idenom").frmDenom.mfgDenom.TextMatrix(i, 4)
    if (eval(DPayRecAmt) < 0) {
      DExamtStr = DExamtStr + DExamt + "~"
    }
    else {
      DExamt = ""
      DExamtStr = DExamtStr + DExamt + "~"
    }

  }

  strDenom = DValStr + "|" + DPayamtStr + "|" + DExamtStr + "|" + DTypStr;
}

//----------------------------------------------------------------------------------
function PostRslt(vRslt) {

  window.document.frmTrans.cmdPost.disabled = false
  if (vRslt == "") {
    return
  }
  if ((vRslt.substr(0, 11)) == "Batch No : ") {
    if (vSubMode != "TPAY") {
      alert(vRslt)
    }
    //  Cancel()
    if (vMode == "REC") {
      Denom()
    }
    if (vSubMode == "TPAY") {
      tellerPayments()
      //alert(vRslt)
    }
    Cancel()
  }
  else {
    alert(vRslt)
  }
  strLoanBatchNo = window.document.frames['iPost'].frmPost.hdnBatch.value
}
//----------------------------------------------------------------------------------    
function tellerPayments() {

  var kstr = vBranchCode + "~" +
    vBrNarration + "~" +
    window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtcurrencydesc.value + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 0) + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 1) + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 17) + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 3) + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 4) + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 5) + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(2, 6) + "~" +
    "" + "~" + "" + "~" + "" + "~" + "" + "~" + "" + "~" + "" + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 2) + "~" +
    "1" + "~" + window.document.frmTrans.Mfgpaydt.TextMatrix(1, 26) + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 18) + "~" +
    window.document.frmTrans.Mfgpaydt.TextMatrix(1, 46) + "~"

  kstr = kstr + window.document.frmTrans.hpr.value + "~" + vSubMode + "~~" +
    '<%=vTotAmt%>'

  //window.document.frmTrans.Mfgpaydt.TextMatrix(1,7)
  //document.write(kstr)

  window.open('<%="http://" & session("moduledir")& "/" & session("moddir") & "/"%>' +
    "cashpaymentdetails.aspx?kstr=" + kstr, "fdsa", "width=900%,height=700% left=1 top=1")

  // window.showModalDialog('<%="http://" & session("moduledir")& "/" & session("moddir") & "/"%>'+
  //"cashpaymentdetails.aspx?kstr="+kstr,window,
  //"status:no;dialogWidth:800	%;dialogHeight:600%;diaglogleft=90;diaglogtop=170")
}

function TranRslt(vRslt) {
  if ((vRslt.length) > 0) {
    window.location.replace('<%="http://" & session("moduledir")& "/" %>' + "GEN/transfertransactions.aspx?st=TPAY.aspx")
  }
}

//----------------------------------------------------------------------------------    
//FOREX functions 
//----------------------------------------------------------------------------------   
function fxTransactionYN() {
  var fxText = window.document.frmTrans.txtModId.value.substr(0, 2)
  if ((fxText == "FX") && (window.document.frmTrans.chkDispAccNo.checked == false)) {
    divsDisplay("divFxRate", "A")
    window.document.frmTrans.chkFRateDtls.checked = true
    fxTransYN = "Y"
    fxRateDtls()
    //fxRateTypes()
  }
  else {
    window.document.all['divFxRate'].style.display = "none";
    window.document.frmTrans.chkFRateDtls.checked = false
    window.document.frmTrans.txtAmt.disabled = false
    fxTransYN = "N"
  }

}

function TrnDeleteTrn(kstr) {
  Cancel()
}



//----------------------------------------------------------------------------------
//This function is used to populate different Rate types in the combo box.
function fxRateTypesRtn(fxRateType) {
  var StrArrMain = new String()
  var StrArrFld = new String()
  var StrArrFlds = new String()
  ///clearing the combo box

  window.document.frmTrans.cmbFRateType.length = 0

  StrArrMain = fxRateType.split("~")
  StrArrFld = StrArrMain[0].split("|")

  ///adding "Select" as by default option in combo box
  var option0 = new Option("--Select--", "")
  eval("window.document.frmTrans.cmbFRateType.options[0]=option0")
  for (j = 0; j <= StrArrMain[1]; j++) {
    StrArrFlds = StrArrFld[j].split("*")
    //adding to clearing type combo box
    var option0 = new Option(StrArrFlds[1], StrArrFlds[0])
    eval("window.document.frmTrans.cmbFRateType.options[j+1]=option0")
  }

}
//----------------------------------------------------------------------------------  
function fxRateTypeCodes() {
  if (window.document.frmTrans.cmbFRateType.options
  [window.document.frmTrans.cmbFRateType.selectedIndex].value == "") {
    return
  }
  var st = "fxratecodes" + "|" +
    window.document.frmTrans.cmbFRateType.options
    [window.document.frmTrans.cmbFRateType.selectedIndex].value + "|" +
    window.document.frmTrans.txtFCurCode.value


  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + st, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:470px;DialogTop:170px")

}
//----------------------------------------------------------------------------------  
function fxRateTypeCodesRtn(strValue) {
  var strRate
  strRate = strValue.split("-----")
  window.document.frmTrans.txtFRateRefCode.value = strRate[1]
  window.document.frmTrans.txtFRateRefDesc.value = strRate[0]
}
//---------------------------------------------------------------------------------- 
function fxcurr() {
  st = "FxCurr"

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + st, window, "status:no;" +
    "DialogWidth:270px;DialogHeight:170px;DialogLeft:370px;DialogTop:170px")
}
//---------------------------------------------------------------------------------- 
function Fxcurrency(kstr) {
  var k
  k = kstr.split("-----")
  window.document.frmTrans.txtFCurCode.value = k[1]
  prn = k[2].length - 1
  window.document.frmTrans.fxhpr.value = prn
  precision(window.document.frmTrans.txtFAmount, window.document.frmTrans.fxhpr.value)

}
//---------------------------------------------------------------------------------- 	
function fxRateDtls() {
  if (window.document.frmTrans.chkFRateDtls.checked == true) {
    window.document.all['divFxRate'].style.display = "block"
    window.document.frmTrans.txtAmt.disabled = true
    window.document.frmTrans.txtAmt.value = ""
  }
  else {
    forexClear()
    window.document.frmTrans.cmbFRateType.options[0].selected = true
    window.document.all['divFxRate'].style.display = "none"
    window.document.frmTrans.txtAmt.disabled = false
    window.document.frmTrans.txtAmt.value = ""
  }

}

//---------------------------------------------------------------------------------- 	
function chkDenomTally() {
  if (window.document.frmTrans.chkdenomtally.checked == true) {
    window.document.all['divDenomtally'].style.display = "block"

  }
  else {

    window.document.all['divDenomtally'].style.display = "none"

  }

}


//---------------------------------------------------------------------------------- 	
function fxAmount() {
  window.document.frmTrans.txtAmt.value = ""
  if ((eval(window.document.frmTrans.txtFRate.value) > 0) &&
    (eval(window.document.frmTrans.txtFAmount.value) > 0)) {
    window.document.frmTrans.txtAmt.value =
      window.document.frmTrans.txtFAmount.value * window.document.frmTrans.txtFRate.value
    precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)

  }

}
//---------------------------------------------------------------------------------- 	

//----------------------------------------------------------------------------------        
function txtcurrencycode_onkeyup() {
  ModuleClear()
  ClearAlert('Cur')
  window.document.frmTrans.txtcurrencydesc.value = ""
}
//----------------------------------------------------------------------------------        
function txtServiceId_onkeyup() {
  ModuleClear()
  window.document.frmTrans.txtServiceName.value = ""
}
//----------------------------------------------------------------------------------        
function txtModId_onkeyup() {

  ModuleMandChk(window.document.frmTrans.txtbranchcode, window.document.frmTrans.txtModId)
  GLClear()
  window.document.frmTrans.txtModDesc.value = ""

}

//----------------------------------------------------------------------------------        
function txtGLcode_onkeyup() {
  GLMandChk(window.document.frmTrans.txtModId, window.document.frmTrans.txtGLcode)
  AccountClear()
  window.document.frmTrans.txtGLDesc.value = ""
}
//----------------------------------------------------------------------------------        
function txtLnkModId_onkeyup() {
  ModuleMandChk(window.document.frmTrans.txtbranchcode, window.document.frmTrans.txtLnkModId)
  LnkGLClear()
  window.document.frmTrans.txtLnkModDesc.value = ""
}

function txtLnkGLCode_onkeyup() {
  GLMandChk(window.document.frmTrans.txtLnkModId, window.document.frmTrans.txtLnkGLCode)
  LnkAccountClear()
  window.document.frmTrans.txtLnkGLname.value = ""
}

function txtLnkAccNo_onkeyup() {
  AccMandChk(window.document.frmTrans.txtLnkGLCode, window.document.frmTrans.txtLnkAccNo)
  LnkAddClear()
  window.document.frmTrans.txtLnkAccNm.value = ""
}

function txtCLGModId_onkeyup() {
  ModuleMandChk(window.document.frmTrans.txtbranchcode, window.document.frmTrans.txtCLGModId)
  ClgGLClear()
  window.document.frmTrans.txtCLGModDesc.value = ""
}

function txtCLGAccNo_onkeyup() {
  AccMandChk(window.document.frmTrans.txtCLGGLcode, window.document.frmTrans.txtCLGAccNo)
  ClgRsnClear()
  window.document.frmTrans.txtCLGAccNm.value = ""
}

function txtCLGBankCode_onkeyup() {
  ClgPBranchClear()
  window.document.frmTrans.hdnClg.value = ""
}

function txtCLGBranch_onkeyup() {
  window.document.frmTrans.hdnClg.value = ""
}

function txtCLGGLcode_onkeyup() {
  GLMandChk(window.document.frmTrans.txtCLGModId, window.document.frmTrans.txtCLGGLcode)
  ClgAccountClear()
  window.document.frmTrans.txtCLGGLname.value = ""
}

function txtCLGReasoncode_onkeyup() {
  ClgPBankClear()
  // window.document.frmTrans.txtCLGReason.value=""
}

function Mfgpaydt_DblClick() {

  /*if(window.document.frmTrans.txtModId.value!=""){
    alert("Modify already selected row")
    return;
    }*/



  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
    Rselect = window.document.frmTrans.Mfgpaydt.Row
    if (window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 25) != "Y") {
      if (window.document.frmTrans.Mfgpaydt.TextMatrix(Rselect, 49) == "Y") {
        dispDetModify(Rselect)
      }
      else {
        var result
        result = mfgPaydtMod()
        if (result == false)
          return;
      }
    }
    else {
      alert("Machine Generated Entry Cannot Modifiy")
    }
  }
  //alert("on blur")

  //clear all exceptional variables
  excpMinBal = ""
  excpLmtAmt = ""
  excpParmAmt = ""
  excpChqSrs = ""
  excpChqNo = ""
  excpChq = ""
  excpEffDt = ""
  excpOverDraft = ""

  cntrlOnblur('txtAccNo');
  AccParameters(window.document.frmTrans.txtAccNo.value, "ACCNO")
  balanceDet()

  if (window.document.frmTrans.txtModId.value.toUpperCase() == "LOAN") {
    funinsertintdtls()
    alert("out")
  }

  if (window.document.frmTrans.txtChqNo.value != "") {
    //ChqVerification(window.document.frmTrans.txtChqNo.value)
    ChqValidation()
  }

}

function txtAccNo_onkeyup() {
  AccMandChk(window.document.frmTrans.txtGLcode, window.document.frmTrans.txtAccNo)
  AmtNarrClear()
  window.document.frmTrans.txtAccNm.value = ""
  BalanceClear()

}

function chkCheque_onchange() {
  excpChqSrs = ""
  excpChqNo = ""
}

function dtpinstDate_CloseUp() {
  Datepick(window.document.frmTrans.dtpinstDate, window.document.frmTrans.txtinstrdt)
  window.document.frmTrans.txtinstrdt.focus()
  Remcheck()
}


function dtpinstDate_Change() {
  Datepick(window.document.frmTrans.dtpinstDate, window.document.frmTrans.txtinstrdt)
  window.document.frmTrans.txtinstrdt.focus()
}

function txtinstrno_onkeyup() {
  window.document.frmTrans.txtinstrdt.value = ""
  window.document.frmTrans.txtfavgdr.value = ""
  window.document.frmTrans.txtAmt.value = ""
  window.document.frmTrans.txtremchgsamt.value = ""
  window.document.frmTrans.txtremgstamt.value = ""
  window.document.frmTrans.txtremcessamt.value = ""
}

function txtbybnkcode_onkeyup() {
  window.document.frmTrans.txtbybnkdesc.value = ""
  window.document.frmTrans.txtbybrcode.value = ""
  window.document.frmTrans.txtbybrdesc.value = ""
}

function txtbybrcode_onkeyup() {
  LstMandChk(window.document.frmTrans.txtbybnkcode, window.document.frmTrans.txtbybrcode, "Bank Code Should not be Null")
  window.document.frmTrans.txtbybrdesc.value = ""
}



function mfgDisp_DblClick() {

  if (window.document.frmTrans.mfgDisp.Rows > 1) {
    Rselect = window.document.frmTrans.mfgDisp.RowSel
    if (window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 38) != "XX") {
      dispAccDetails(Rselect)
    }
    else {
      alert("Machine Generated Entry Cannot Modifiy")
    }
  }
}


function DtpChq_CloseUp() {
  Datepick(window.document.frmTrans.DtpChq, window.document.frmTrans.txtChqDt)
  window.document.frmTrans.txtChqDt.focus()
}


function dtpEffDate_CloseUp() {
  Datepick(window.document.frmTrans.dtpEffDate, window.document.frmTrans.txtEffDate)
  window.document.frmTrans.txtEffDate.focus()
}

function dtpEffDate_Change() {
  Datepick(window.document.frmTrans.dtpEffDate, window.document.frmTrans.txtEffDate)
  window.document.frmTrans.txtEffDate.focus()
}

function DtpChq_Change() {
  // Datepick(window.document.frmTrans.DtpChq,window.document.frmTrans.txtChqDt)
  //  window.document.frmTrans.txtChqDt.focus()
}


function cmbFRateType_onchange() {
  window.document.frmTrans.txtFRateRefCode.value = ""
  window.document.frmTrans.txtFRateRefDesc.value = ""
  if ((window.document.frmTrans.cmbFRateType.options
  [window.document.frmTrans.cmbFRateType.selectedIndex].value == "C") ||
    (window.document.frmTrans.cmbFRateType.options
    [window.document.frmTrans.cmbFRateType.selectedIndex].value == "N")) {
    window.lblFxRateType.innerHTML = "Category"
  }
  else if (window.document.frmTrans.cmbFRateType.options
  [window.document.frmTrans.cmbFRateType.selectedIndex].value == "D") {
    window.lblFxRateType.innerHTML = "Code"
  }
  else if (window.document.frmTrans.cmbFRateType.options
  [window.document.frmTrans.cmbFRateType.selectedIndex].value == "F") {
    window.lblFxRateType.innerHTML = "F C No."
  }

}

function txtFRateRefCode_onkeyup() {
  window.document.frmTrans.txtFRateRefDesc.value = ""
}

function getServiceTax(str) {
  var noofRp

  noofRp = 1

  if (window.document.frmTrans.chkRemRepeat.checked == true) {
    if (eval(window.document.frmTrans.txtNoOfRepeat.value) != "") {
      noofRp = eval(window.document.frmTrans.txtNoOfRepeat.value)
    }
  }
  else {
    noofRp = 1
  }

  var st = "GETSERVICETAX|" + window.document.frmTrans.txtissbnkcode.value + "*" + window.document.frmTrans.txtissbrcode.value + "*" + window.document.frmTrans.txtGLcode.value + "*" + window.document.frmTrans.txtcomm.value * noofRp


  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st

}

function getResult(str) {
  //window.document.frmTrans.txtSerivceChrg.value=parseFloat(str).toFixed(2)
  //alert("str "  +  str)
  if (str == "No Records") {
    window.document.frmTrans.txtSerivceChrg.value = "0"
    window.document.frmTrans.txtCessChrg.value = "0"

  }
  else {
    var CsStr = str.split("~")

    if (CsStr[0] != "No Records") {
      window.document.frmTrans.txtSerivceChrg.disabled = false
      if (CsStr[0] == "0") {
        alert("Please Set GSTR Rate in Parameter")

      }
      else {
        window.document.frmTrans.txtSerivceChrg.value = parseFloat(CsStr[0]).toFixed(2)
      }
    }
    else {
      window.document.frmTrans.txtSerivceChrg.disabled = true
    }


    if (CsStr[1] != "No Records") {
      window.document.frmTrans.txtCessChrg.disabled = false
      if (CsStr[1] == "0") {
        alert("Please Set CESS Rate in Parameter")
      }
      else {
        window.document.frmTrans.txtCessChrg.value = parseFloat(CsStr[1]).toFixed(2)
      }
    }
    else {
      window.document.frmTrans.txtCessChrg.disabled = true
    }


  }

}

function txtFRate_onkeyup() {
  fxAmount()
}

function txtFAmount_onkeyup() {
  fxAmount()
}


function selloantrans_onchange() {

  MinBalCheck()
}


/// code for Transaction Position Screen
function getMenu() {
  var menuyn = '<%=menuyn%>'
  var modid = '<%=modid%>'
  if (menuyn != "N")
    GetMenu('<%=session("menustring")%>')

}


function AlphaNumVin() {
  if (!((event.keyCode > 47) && (event.keyCode < 58)) &&
    !((event.keyCode > 96) && (event.keyCode < 123)) &&
    !((event.keyCode > 64) && (event.keyCode < 91)) &&
    !((event.keyCode > 31) && (event.keyCode < 33))) {
    event.keyCode = 0;
  }
}

function Exit() {

  var menuyn = '<%=menuyn%>'

  if (menuyn != "N")
    window.parent.window.location.href = '<%=exitdir%>'
  else {
    var callerWindowObj = dialogArguments;
    callerWindowObj.Refresh();
    window.close()

  }

}

///value on change

function onrepchng() {
  var stNum

  stNum = window.document.frmTrans.txtNoOfRepeat.value

  if (stNum <= 25) {

  }
  else {
    alert(" Repeat Number not greater then 25 ")
    window.document.frmTrans.txtNoOfRepeat.value = ""
    window.document.frmTrans.txtNoOfRepeat.focus();
  }
}

///Added code is here oNly



function sumDrCr(flxRowCnt1, AddorDel1) {

  var v1, Prec
  //alert("AddorDel1" + AddorDel1)
  if (AddorDel1 == "ADD") {

    if (eval(window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt1, 6)) >= 0) {
      window.document.frmTrans.txtTotCredit.value = eval(window.document.frmTrans.txtTotCredit.value) + eval(window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt1, 6))
      window.document.frmTrans.NoCrTrn.value = eval(window.document.frmTrans.NoCrTrn.value) + 1
    }
    else {
      window.document.frmTrans.txtTotDebit.value = eval(window.document.frmTrans.txtTotDebit.value) + Math.abs(eval(window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt1, 6)))
      window.document.frmTrans.NoDrTrn.value = eval(window.document.frmTrans.NoDrTrn.value) + 1
    }

    Prec = eval(window.document.frmTrans.hpr.value)

    v1 = eval(window.document.frmTrans.txtTotCredit.value)
    window.document.frmTrans.txtTotCredit.value = v1.toFixed(Prec)

    v1 = eval(window.document.frmTrans.txtTotDebit.value)
    window.document.frmTrans.txtTotDebit.value = v1.toFixed(Prec)


  }
  else if (AddorDel1 == "DEL") {
    if (eval(window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt1, 6)) >= 0) {
      window.document.frmTrans.txtTotCredit.value = eval(window.document.frmTrans.txtTotCredit.value) - eval(window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt1, 6))
      window.document.frmTrans.NoCrTrn.value = eval(window.document.frmTrans.NoCrTrn.value) - 1
    }
    else {
      window.document.frmTrans.txtTotDebit.value = (eval(window.document.frmTrans.txtTotDebit.value) - Math.abs(eval(window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt1, 6))))
      window.document.frmTrans.NoDrTrn.value = eval(window.document.frmTrans.NoDrTrn.value) - 1
    }

    Prec = eval(window.document.frmTrans.hpr.value)

    v1 = eval(window.document.frmTrans.txtTotCredit.value)
    window.document.frmTrans.txtTotCredit.value = v1.toFixed(Prec)

    v1 = eval(window.document.frmTrans.txtTotDebit.value)
    window.document.frmTrans.txtTotDebit.value = v1.toFixed(Prec)

  }

  else if (AddorDel1 == "DELALL") {

    window.document.frmTrans.txtTotDebit.value = "0";
    window.document.frmTrans.txtTotCredit.value = "0";
    sumDrCrDefault()
    PrecDrCr()
  }

}

function genLimitValidation() {

}


function remLimitValidation() {
  if (window.document.frmTrans.txtAmt.value == "") {
    alert("Please Enter Amount.")
    window.document.frmTrans.txtAmt.focus()
  }
}


function getPendInt() {
  if ((window.document.frmTrans.txtModId.value == "LOAN") && (window.document.frmTrans.tranmode[1].checked == true)) {
    st = window.document.frmTrans.txtbranchcode.value + "|" +
      window.document.frmTrans.txtcurrencycode.value + "|LOAN|" +
      window.document.frmTrans.txtGLcode.value + "|" +
      window.document.frmTrans.txtAccNo.value

    window.document.all['idetails'].src = '<%="http://" & session("moduledir")& "/Loan/"%>' + "loanrenewintcalc.aspx?st=" + st;
  }
}

function JointHolderValidation() {

  if (window.document.frmTrans.tranmode(0).checked == true) {
    var st = "GETJOINTHOLDER|" + window.document.frmTrans.txtbranchcode.value + "|" +
      window.document.frmTrans.txtcurrencycode.value + "|" +
      window.document.frmTrans.txtGLcode.value + "|" +
      window.document.frmTrans.txtAccNo.value + "|" +
      window.document.frmTrans.txtModId.value
    //alert(st)
    window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
  }
}


function GetJointHolderVal(str) {
  if (str == "") {
  }
  else {
    alert("This Is " + str + " Pls Verify Photo And Signature")
  }
}

function TDSDetails() {

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Enter Branchcode")
    return
  }

  if (window.document.frmTrans.txtcurrencycode.value == "") {
    alert("Enter currency code")
    return
  }

  if (window.document.frmTrans.txtModId.value == "") {
    alert("Enter Glcode ")
    return
  }

  if (window.document.frmTrans.txtGLcode.value == "") {
    alert("Enter Glcode ")
    return
  }
  if (window.document.frmTrans.txtAccNo.value == "") {
    alert("Enter Accno ")
    return
  }
  var st = "TDSDetails~" + window.document.frmTrans.txtbranchcode.value + "~" +
    window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtGLcode.value + "~" +
    window.document.frmTrans.txtAccNo.value + "~" +
    window.document.frmTrans.txtModId.value + "~" + "<%=vAppdate%>" + "~" + window.document.frmTrans.txtAmt.value

  window.showModalDialog("TDSDetails.aspx" + "?" + "st=" + st, window, "status:no;dialogWidth:500px;dialogHeight:350px");


}

function Check194N() {
  window.document.frmTrans.hdnchk194N.value = 'false'
  if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY')) {

    if (eval(window.document.frmTrans.txtAmt.value) != 0) {
      if ((window.document.frmTrans.tranmode(0).checked == true) && ((window.document.frmTrans.txtModId.value == 'SB') || (window.document.frmTrans.txtModId.value == 'CA') || (window.document.frmTrans.txtModId.value == 'CC') || (window.document.frmTrans.txtModId.value == 'LOAN'))) {
        var st = "Check194N|" + window.document.frmTrans.txtbranchcode.value + "|" +
          window.document.frmTrans.txtcurrencycode.value + "|" +
          window.document.frmTrans.txtGLcode.value + "|" +
          window.document.frmTrans.txtAccNo.value + "|" +
          window.document.frmTrans.txtModId.value + "|" + "<%=vAppdate%>" + "|" + window.document.frmTrans.txtAmt.value
        //alert(st)
        window.document.all['iGetDtls1'].src = "getDtls1.aspx?st=" + st
      }
    } // txtAmt
  }	//"<%=str194NYN%>" == 'Y'
}

function Get194Ndtls(str) {
  var kStr = str.split("|")
  // kStr[0] -- balance
  // kStr[1] -- final tds

  var dblbalance
  dblbalance = 0
  var dblcummamt
  dblcummamt = 0
  var dblfinaltds
  dblfinaltds = 0
  var dbltransamt
  var dblFrmAmt
  dblFrmAmt = ""
  var dblFrmAmt1
  dblFrmAmt1 = 0
  dbltransamt = 0
  var dbltdsrate
  dbltdsrate = 0
  var strMesssage
  strMesssage = ''

  if (kStr[0] == "No Panno") {
    alert("No Panno For This Accno")
    window.document.frmTrans.txtAmt.value = ""
    window.document.frmTrans.txtTokenNo.focus()
    return
  }

  Clear194NhdnFields()
  dblbalance = kStr[0]
  dblfinaltds = kStr[1]
  window.document.frmTrans.hdn194Nfinaltds.value = kStr[1]
  if (eval(dblfinaltds) == 0) {
    return
  }
  dbltransamt = eval(window.document.frmTrans.txtAmt.value) + eval(kStr[1])

  if (eval(kStr[2]) < 0)
    dblFrmAmt1 = 0
  else
    dblFrmAmt1 = kStr[2]

  dblFrmAmt = amtInWords(dblFrmAmt1)

  //	dblFrmAmt= kStr[2]
  dbltdsrate = kStr[3]
  window.document.frmTrans.hid194NCrossAmt.value = dblFrmAmt1
  window.document.frmTrans.hid194TDSRate.value = kStr[3]
  dblcummamt = eval(window.document.frmTrans.txtAmt.value) + eval(Math.abs(kStr[4]))
  window.document.frmTrans.hdn194NFromDate.value = kStr[5]
  window.document.frmTrans.hdn194NToDate.value = kStr[6]
  window.document.frmTrans.hid194NAssesyear.value = kStr[7]
  window.document.frmTrans.hid194Npanno.value = kStr[8]
  window.document.frmTrans.hid194NAmtPaid.value = kStr[9]
  window.document.frmTrans.hidPAN206AAYN.value = kStr[10]
  window.document.frmTrans.hidPAN206ABYN.value = kStr[11]

  var strCummMessage
  strCummMessage = ''
  if (eval(dblcummamt) > 10000000) {
    strCummMessage = dblcummamt
  }
  else {
    //strCummMessage = window.document.frmTrans.txtAmt.value
    strCummMessage = dblcummamt
  }

  if (eval(dblbalance) < eval(dbltransamt)) {
    strMesssage = ' Total Cash Payment is Crossing Rs. ' + dblFrmAmt + '/-  TDS @' + dbltdsrate + '%  on ' + strCummMessage + '/-,  TDSAmt = ' + dblfinaltds + '/- is applicable and Account balance is not sufficient.  Transaction will be not allowed.'
    alert(strMesssage)
    window.document.frmTrans.txtAmt.value = ""
  }
  else {
    strMesssage = ' Total Cash Payment is Crossing Rs. ' + dblFrmAmt + '/-  TDS @' + dbltdsrate + '%  on ' + strCummMessage + '/-,  TDSAmt = ' + dblfinaltds + '/- is applicable . Do you want to continue Y/N?  '
    var result = confirm(strMesssage)
    if (result == true) {
      var result1 = confirm("Are you sure do you want to continue Y/N?")
      if (result1 == true) {
        window.document.frmTrans.hdnchk194N.value = 'true'
        window.document.frmTrans.txtTokenNo.focus()
      }
      else {
        window.document.frmTrans.txtAmt.value = ""
        window.document.frmTrans.hdnchk194N.value = 'false'
        return
      }
    }
    else {
      window.document.frmTrans.txtAmt.value = ""
      window.document.frmTrans.hdnchk194N.value = 'false'
      return
    }
  }
}

function Clear194NhdnFields() {
  window.document.frmTrans.hdn194Nfinaltds.value = ""
  window.document.frmTrans.hdn194NBrcode.value = ""
  window.document.frmTrans.hdn194NCurcode.value = ""
  window.document.frmTrans.hdn194NModID.value = ""
  window.document.frmTrans.hdn194NGLCode.value = ""
  window.document.frmTrans.hdn194NAccNo.value = ""
  window.document.frmTrans.hdn194NName.value = ""
  window.document.frmTrans.hdn194NBatchno.value = ""
  window.document.frmTrans.hdn194NTranno.value = ""
  window.document.frmTrans.hdn194NAmount.value = ""
  window.document.frmTrans.hdn194NModeOfTran.value = ""
  window.document.frmTrans.hdn194NFromDate.value = ""
  window.document.frmTrans.hdn194NToDate.value = ""
  window.document.frmTrans.hdn194NLnkModID.value = ""
  window.document.frmTrans.hdn194NLnkGlcode.value = ""
  window.document.frmTrans.hdn194NLnkAccno.value = ""
  window.document.frmTrans.hdn194NRemarks.value = ""
  window.document.frmTrans.hid194NAssesyear.value = ""
  window.document.frmTrans.hid194Npanno.value = ""
  window.document.frmTrans.hid194NAmtPaid.value = ""
}

function CheckThreshHoldLimit() {
  window.document.frmTrans.hdnchkthreshlmt.value = "false"
  if ("<%=strThrLmt%>" == 'Y') {
    // credit and sb/ca
    if ((window.document.frmTrans.tranmode(1).checked == true) && ((window.document.frmTrans.txtModId.value == 'SB') || (window.document.frmTrans.txtModId.value == 'CA'))) {
      var st = "CheckThreshHoldLimit|" + window.document.frmTrans.txtbranchcode.value + "|" +
        window.document.frmTrans.txtcurrencycode.value + "|" +
        window.document.frmTrans.txtGLcode.value + "|" +
        window.document.frmTrans.txtAccNo.value + "|" +
        window.document.frmTrans.txtModId.value + "|" + "<%=vAppdate%>" + "|" + window.document.frmTrans.txtAmt.value
      //alert(st)
      window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
    }
  }	//"<%=strThrLmt%>" == 'Y'
}

function GetThreshHoldLimit(str) {
  window.document.frmTrans.hdnchkthreshlmt.value = "false"
  if (str == "true") {
    var result = confirm("Threshhold limit crossing ? Do You Want To Continue ")
    if (result == true) {
      window.document.frmTrans.hdnchkthreshlmt.value = "true"
      window.document.frmTrans.txtEffDate.focus()
    }
    else {
      window.document.frmTrans.txtAmt.value = "0"
      window.document.frmTrans.txtEffDate.focus()
    }
  }
  else {
    window.document.frmTrans.hdnchkthreshlmt.value = "false"
  }
}
function SetCCDrCrLienYN() {
  var strAppDate1 = "<%= session("applicationdate")%>"
  var strModeDrCr


  var strmodid1 = window.document.frmTrans.txtModId.value.toUpperCase()

  if ((strmodid1 == "CC")) {
  }
  else {
    return
  }

  var st = "GETCCDRCRLIENYN|" + window.document.frmTrans.txtbranchcode.value + "|" + window.document.frmTrans.txtcurrencycode.value + "|" + strmodid1 + "|" +
    window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value + "|" + strAppDate1

  //alert(st)
  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
}

function GETCCDRCRLIENYN1(str) {
  var kStr = str.split("|")
  // kStr[0] -- DR Lien YN
  // kStr[1] -- DR Lien amount
  // kStr[2] -- CR Lien YN
  // kStr[3] -- CR Lien amount

  window.document.frmTrans.hidCCDrYN.value = kStr[0]
  window.document.frmTrans.hidCCDrAmt.value = kStr[1]
  window.document.frmTrans.hidCCCrYN.value = kStr[2]
  window.document.frmTrans.hidCCCrAmt.value = kStr[3]
}

function SetDrCrLienYN() {
  var strAppDate1 = "<%= session("applicationdate")%>"
  var strModeDrCr


  var strmodid1 = window.document.frmTrans.txtModId.value.toUpperCase()

  if ((strmodid1 == "SB") || (strmodid1 == "CA")) {
  }
  else {
    return
  }

  if (window.document.frmTrans.tranmode(0).checked == true) {
    strModeDrCr = "Dr"
  }
  else if (window.document.frmTrans.tranmode(1).checked == true) {
    strModeDrCr = "Cr"
  }
  if (window.document.all.divRadClg.style.display == "block") {
    if (window.document.frmTrans.tranmode(2).checked == true) {
      strModeDrCr = "Dr"
    }
  }

  var st = "GETDRCRLIENYN|" + strModeDrCr + "|" + window.document.frmTrans.txtbranchcode.value + "|" +
    window.document.frmTrans.txtcurrencycode.value + "|" +
    strmodid1 + "|" +
    window.document.frmTrans.txtGLcode.value + "|" +
    window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtAmt.value + "|" + strAppDate1

  //alert(st)
  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st

}


function GETDRCRLIENYN1(str) {
  var kStr = str.split("|")
  // kStr[0] -- Allow YN
  // kStr[1] -- Debit Credit Lien YN
  // kStr[2] -- Amount
  if (kStr[1] == "Y") {

    if (window.document.frmTrans.tranmode(0).checked == true) {
      alert("This A/c is marked for debit Lien Rs :" + kStr[2])
    }
    else if (window.document.frmTrans.tranmode(1).checked == true) {
      alert("This A/c is marked for Credit Lien")
    }
  }

  Check206AA206AB()
}

function SetDrCrLienAmt() {
  var strAppDate1 = "<%= session("applicationdate")%>"
  var strModeDrCr
  var strTransAmt
  strTransAmt = window.document.frmTrans.txtAmt.value

  if (eval(strTransAmt) == 0 || strTransAmt == "") {
    return
  }

  var strmodid1 = window.document.frmTrans.txtModId.value.toUpperCase()

  if ((strmodid1 == "SB") || (strmodid1 == "CA")) {
  }
  else {
    return
  }

  if (window.document.frmTrans.tranmode(0).checked == true) {
    strModeDrCr = "Dr"
  }
  else if (window.document.frmTrans.tranmode(1).checked == true) {
    strModeDrCr = "Cr"
  }
  if (window.document.all.divRadClg.style.display == "block") {
    if (window.document.frmTrans.tranmode(2).checked == true) {
      strModeDrCr = "Dr"
    }
  }

  var st = "GETDRCRLIENAMT|" + strModeDrCr + "|" + window.document.frmTrans.txtbranchcode.value + "|" +
    window.document.frmTrans.txtcurrencycode.value + "|" + strmodid1 + "|" +
    window.document.frmTrans.txtGLcode.value + "|" +
    window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtAmt.value + "|" + strAppDate1

  //alert(st)
  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st

}

function GETDRCRLIENAMT1(str) {
  var kStr = str.split("|")
  // kStr[0] -- Allow YN
  // kStr[1] -- Debit Credit Lien YN
  // kStr[2] -- Amount
  if (kStr[0] == "Y") {
  }
  else {

    if (window.document.frmTrans.tranmode(0).checked == true) {
      alert("A/C Marked Dr Lien Rs " + kStr[2] + ", Please Contact HO / Br Manager")
    }

    if (window.document.frmTrans.tranmode(1).checked == true) {
      alert("A/C Marked Cr Lien , Please Contact HO / Br Manager")
    }

    window.document.frmTrans.txtAmt.value = ""

  }
}

function getATMCardDetails() {

  if (window.document.frmTrans.tranmode(0).checked == true) {

    if (window.document.frmTrans.txtServiceId.value == 4) {
      var strmodid1 = window.document.frmTrans.txtModId.value.toUpperCase()

      if ((strmodid1 == "SB") || (strmodid1 == "CA")) {

        var brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase();
        var glcode = window.document.frmTrans.txtGLcode.value.toUpperCase();
        var accno = window.document.frmTrans.txtAccNo.value.toUpperCase();
        var st = ""

        st = "ATMCardDet|" + brcode + "|" + glcode + "|" + accno
        window.document.all['iGetDtls'].src = "../GENSBCA/GetAccDetails.aspx?st=" + st

      }		//((strmodid1 == "SB") || (strmodid1 == "CA") )
    }		//(window.document.frmTrans.txtServiceId.value == 4)						
  }  //(window.document.frmTrans.tranmode(0).checked==true)
}  //getATMCardDetails()

function DisplayATMCardDetails(kstr) {
  //alert("hi")
  k = kstr.split("|")
  if (k[1] == "C") {
    alert("Your Concerned ATM Card Has Already Closed")
  }
  else if (k[1] == "R") {
    alert("Your Concerned ATM Card IS Running Close It First")
  }
  else if (k[1] == "E") {
    alert("Your Concerned ATM Card IS Expired")
  }
  else if (k[1] == "L") {
    alert("Your Concerned ATM Card IS Lost")
  }
  else if (k[1] == "B") {
    alert("Your Concerned ATM Card Is Blocked")
  }
}

function MinPeriodValidation() {
  if ((window.document.frmTrans.txtModId.value == "LOAN") && (window.document.frmTrans.tranmode[1].checked == true)) {
    var st = "GETMINPERIOD|" + window.document.frmTrans.txtbranchcode.value + "|" +
      window.document.frmTrans.txtcurrencycode.value + "|" +
      window.document.frmTrans.txtGLcode.value + "|" +
      window.document.frmTrans.txtAccNo.value

    window.document.all['iQryDtls'].src = "querydisplay.aspx?st=" + st
  }
}

function minPeriod(str) {
  var kStr = str.split("|")
  if (parseInt(kStr[0]) < 0) {
    var blnCPreClose
    blnCPreClose = false
    blnCPreClose = confirm("Do You Want to Pre Close the Loan!");
    if (blnCPreClose == true) {
      kStr[1] = Math.round(parseFloat(window.document.frmTrans.txtloansancamt.value) * parseFloat(kStr[1]))
      if (isNaN(parseFloat(window.document.frmTrans.txtIntPendAmt.value)) == false) {
        window.document.frmTrans.txtloanaccbal.value = parseFloat(window.document.frmTrans.txtloanaccbal.value) + parseFloat(window.document.frmTrans.txtIntPendAmt.value)
        //alert("accbal is "+window.document.frmTrans.txtloanaccbal.value)
        window.document.frmTrans.txtIntPendAmt.value = parseFloat(kStr[1]) + parseFloat(kStr[2])
        window.document.frmTrans.txtloanaccbal.value = parseFloat(window.document.frmTrans.txtloanaccbal.value) - parseFloat(window.document.frmTrans.txtIntPendAmt.value)
        precision(window.document.frmTrans.txtIntPendAmt, window.document.frmTrans.hpr.value)
        precision(window.document.frmTrans.txtloanaccbal, window.document.frmTrans.hpr.value)
      }
      else {
        window.document.frmTrans.txtIntPendAmt.value = parseFloat(kStr[1]) + parseFloat(kStr[2])

        if (isNaN(parseFloat(window.document.frmTrans.txtIntPendAmt.value)) == false) {
          window.document.frmTrans.txtloanaccbal.value = parseFloat(window.document.frmTrans.txtloanaccbal.value) - parseFloat(window.document.frmTrans.txtIntPendAmt.value)
        }
        else {
          window.document.frmTrans.txtloanaccbal.value =
            window.document.frmTrans.txtloanaccbal.value
          window.document.frmTrans.txtIntPendAmt.value = 0
          precision(window.document.frmTrans.txtIntPendAmt, window.document.frmTrans.hpr.value)
        }
      }
      window.document.frmTrans.txtIntPendAmt.value = parseFloat(window.document.frmTrans.txtIntPendAmt.value)
    }
  }
}

function PrecDrCr() {


  window.document.frmTrans.txtDiff.value = Math.abs(window.document.frmTrans.txtTotCredit.value - window.document.frmTrans.txtTotDebit.value)

  var v1, Prec

  Prec = eval(window.document.frmTrans.hpr.value)

  v1 = eval(window.document.frmTrans.txtTotCredit.value)
  window.document.frmTrans.txtTotCredit.value = v1.toFixed(Prec)

  v1 = eval(window.document.frmTrans.txtTotDebit.value)
  window.document.frmTrans.txtTotDebit.value = v1.toFixed(Prec)

  v1 = eval(window.document.frmTrans.txtDiff.value)
  window.document.frmTrans.txtDiff.value = v1.toFixed(Prec)

  precision(window.document.frmTrans.txtTotDebit, window.document.frmTrans.hpr.value)
  precision(window.document.frmTrans.txtTotCredit, window.document.frmTrans.hpr.value)
  precision(window.document.frmTrans.txtDiff, window.document.frmTrans.hpr.value)
}

function amtInWords(decAmount) {
  //var decAmount=document.getElementById("sAmount2").value;
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
            sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[6] + " "
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



function PPSDetails() {

  if (window.document.frmTrans.txtbranchcode.value == "") {
    alert("Enter Branchcode")
    return
  }

  if (window.document.frmTrans.txtcurrencycode.value == "") {
    alert("Enter currency code")
    return
  }

  if (window.document.frmTrans.txtModId.value == "") {
    alert("Enter Glcode ")
    return
  }

  if (window.document.frmTrans.txtGLcode.value == "") {
    alert("Enter Glcode ")
    return
  }
  if (window.document.frmTrans.txtAccNo.value == "") {
    alert("Enter Accno ")
    return
  }
  if (window.document.frmTrans.txtChqNo.value == "") {
    alert("Enter Cheque No ")
    return
  }


  var st = "PPSDetails~" + window.document.frmTrans.txtbranchcode.value + "~" +
    window.document.frmTrans.txtcurrencycode.value + "~" +
    window.document.frmTrans.txtGLcode.value + "~" +
    window.document.frmTrans.txtAccNo.value + "~" +
    window.document.frmTrans.txtModId.value + "~" + window.document.frmTrans.txtChqNo.value
    + "~" + window.document.frmTrans.txtChqDt.value

  window.showModalDialog("PPSDetails.aspx" + "?" + "st=" + st, window, "status:no;dialogWidth:700px;dialogHeight:350px");


}


function Check206AA206AB() {
  var sBr, sMod, sGL, sAccno, sCur, st

  sBr = window.document.frmTrans.txtbranchcode.value.toUpperCase()
  sMod = window.document.frmTrans.txtModId.value.toUpperCase()
  sGL = window.document.frmTrans.txtGLcode.value.toUpperCase()
  sAccno = window.document.frmTrans.txtAccNo.value.toUpperCase()
  sCur = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
  st = "Check206AA206AB" + "|" + sBr + "|" + sMod + "|" + sGL + "|" + sAccno + "|" + sCur

  window.document.all["iBatch"].src = "../GENSBCA/querydisplay.aspx?st=" + st
}

function GetCheck206AA206AB(kstr) {
  var kstr1

  kstr1 = kstr.split("*")
  if (kstr1[0] == "N") {
    alert("This Customer Panno is Inactive")
  }
  else if (kstr1[1] == "Y") {
    alert(" This customer ITR is Applicable")
  }
  else if (kstr1[0] == "N" && kstr1[1] == "Y") {
    alert("This Customer Panno is Inactive And This customer ITR is Applicable")
  }

}

