
//function PubVariables() {
//  strSessionFld = window.document.frmTrans.txtSessionflds.value
//  strsessionflds = strSessionFld.split("~");
//  vUserId = strsessionflds[0]
//  vAppDate = strsessionflds[1]
//  vCounterNo = strsessionflds[2]
//  vCashierId = strsessionflds[3]
//  vBranchCode = strsessionflds[4]
//  vBrNarration = strsessionflds[5]
//  vCurCode = strsessionflds[6]
//  vCurNarration = strsessionflds[7]
//  vMachineId = strsessionflds[8]
//  fxRateTypes()
//}

//function ABBYesNo() {
//  vAbbuser = "<%=session("abbuser")%>"
//}

//function formClear() {
//  ModuleClear();
//  LnkModClear();
//  ClgModClear();
//  if (mode != "MODIFY") {
//    excpIntValues();
//  }
//  Remclear();
//  funloanclear();
//  Cls();
//  clearflds()
//  ClgClear()
//  hdnFldClear()
//  Depdivclear()
//  chkboxUnCheck()
//  grid()
//  UnlockControls()
//  CashMode()
//  forexClear()
//  UnLockContAdd()
//}

//function formLoad() {
//  TranMode()
//  formClear()
//  grid()
//  NatBranch()
//  //if ("<%=session("module ")%>"== "CLG")
//  //{
//  //  window.document.all['divRadDebit'].style.display = "none";
//  //  window.document.all['divRadCredit'].style.display = "none";
//  //  window.document.all['divRadClg'].style.display = "block";
//  //}
//}

////This function is used to clear all loan's related fields and divs
//function funloanclear() {
//  window.document.frmTrans.txtloanaccbal.value = ""
//  window.document.frmTrans.txtloanclearbal.value = ""
//  window.document.frmTrans.txtloanCustId.value = ""
//  window.document.frmTrans.txtloandisbamt.value = ""
//  window.document.frmTrans.txtloanOpaBy.value = ""
//  window.document.frmTrans.txtloansancamt.value = ""
//  window.document.frmTrans.txtloanunclear.value = ""
//  window.document.frmTrans.txtloanavailbal.value = ""
//  window.document.frmTrans.txtLpendbal.value = ""
//  window.document.frmTrans.txtIntPendAmt.value = ""
//  window.document.frmTrans.txtNPAIntAmt.value = ""
//  window.document.frmTrans.txtloanintsamt.value = ""
//  window.document.frmTrans.txtloanpendinst.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value = ""
//  window.document.frames("iloandtls").frmloaninterestdetails.txtprncexcess.value = ""
//}

//function Cls() {
//  window.document.all['ChqDtl'].style.display = "none";
//  // window.document.all['divDisp'].style.display="none"
//  //  window.document.all['divTempTrans'].style.display="none"
//  window.document.all['divFxRate'].style.display = "none"
//  if (window.document.frmTrans.chkABB.checked == false) {
//    abbApplDt = ""
//  }
//  window.document.frmTrans.txtAmt.disabled = false
//}

////for clearing all divs other than clgdiv if clearing option button is selected for clearing
//function clearflds() {
//  window.document.frmTrans.txtCLGModId.value = ""
//  window.document.frmTrans.txtCLGModDesc.value = ""
//  window.document.frmTrans.txtCLGGLcode.value = ""
//  window.document.frmTrans.txtCLGGLname.value = ""
//  window.document.frmTrans.txtAccNm.value = ""
//  window.document.frmTrans.txtCLGAccNo.value = ""
//  window.document.frmTrans.txtCLGReason.value = ""
//  window.document.frmTrans.txtCLGReasoncode.value = ""
//  window.document.frmTrans.txtCLGBankCode.value = ""
//  window.document.frmTrans.txtCLGBranch.value = ""
//  Cheque()
//  window.document.frmTrans.chkCheque.checked = true
//}

////this function is used to uncheck all the check boxes on the form and to make default div visible true and other divs visible false.
//function chkboxUnCheck() {
//  if ((window.document.frmTrans.tranmode(2).checked == false) && (vMode == "TRANS")) {
//    //window.document.frmTrans.tranmode(0).checked=true
//    window.document.frmTrans.cmdcleartype.style.display = "none";
//    window.document.frmTrans.chkDispDtls.disabled = false
//  }
//  window.document.frmTrans.chkLnkMod.checked = false
//  window.document.frmTrans.chkTransDet.checked = false
//  window.document.frmTrans.chkDispDtls.checked = false
//  window.document.frmTrans.chkDispAccNo.checked = false
//  window.document.frmTrans.chkFRateDtls.checked = false
//  // window.document.frmTrans.chkDispDtls.disabled=false
//  if ((window.document.frmTrans.mfgTranslog.Rows == 1) &&
//    (window.document.frmTrans.Mfgpaydt.Rows == 1)) {
//    window.document.frmTrans.chkABB.checked = false
//  }
//  if ((window.document.frmTrans.Mfgpaydt.Rows > 1) &&
//    (window.document.frmTrans.Mfgpaydt.TextMatrix(1, 45) == "")) {
//    window.document.frmTrans.chkABB.checked = false
//  }
//  divsDisplay("trnsfer", "M")
//  window.document.all['divaccno'].style.display = "block"
//  window.document.all['divAccCat'].style.display = "none"
//  window.document.all['divAppName'].style.display = "none"
//  // chequeClear()
//  window.document.frmTrans.txtChqDt.value = '<%=session("Applicationdate")%>'
//}

//function grid() {
//  window.document.frmTrans.mfgTranslog.Clear();
//  window.document.frmTrans.mfgTranslog.FormatString = ">Batch No  |>Tran No   |<GL Code        |<GL Description                   |>Acc No         |>Amount            |>Entered Time Bal |^Applicatin Date   |<Cust ID               |<Mode of Tran  |<Tran Status|>Currency Code     |<Entered By             |<Entered M/C             |<ABB Branch Code          |<Branch Desc                    |<Module ID         |<Branch Code            |>Token No   |<Remarks                           |<Disposals";
//  window.document.frmTrans.mfgTranslog.Rows = 1;
//  window.document.frmTrans.mfgDisp.Clear();
//  window.document.frmTrans.mfgDisp.FormatString = "<Disp Module ID|<Module Description|>Disp GL Code|<GL Description|<Disp Acc Type|<Disp Acc No  |<Name                    |>Amount            |>Disp Batch No|>Disp Tran No |>Link No        |<Disp Service ID|<Service Description|>Mode of Tran|^Effective Date |<Remarks           |<Tran Status|<Branch Code   |<Currency Code |<Module ID    |Module Description|<GL Code   |<GL Description    |<Account Type  |<Acc No       |<Customer ID          |<Name               |<Service ID  |<Transaction Type |<Remittance Type   |<Cheque Series       |>Cheque No.             |^Cheque Date     |<Favouring                         |<Modify      |^From Date            |^To Date              |<Rate Type|<Rate Ref Code    |<Ref No          |<Rate            |^Ref Date             |<F Currency Code|>Foreign Amount           |<Corr Bank Code  |<Corr Branch Code|^NOSTRO Debit Date    |^NOSTRO Credit Date     |<Charge Type        |<Resp Bank Code|<Resp Section Code|< User ID           |<Machine ID         |<Verified By          |<Verified Machine   |<Approved By           |<Approved Machine   "
//  window.document.frmTrans.mfgDisp.Rows = 1;
//}

//function UnlockControls() {
//  window.document.frmTrans.txtServiceId.readOnly = false
//  window.document.frmTrans.cmdServiceId.disabled = false
//  window.document.frmTrans.txtModId.readOnly = false
//  window.document.frmTrans.cmdModId.disabled = false
//  window.document.frmTrans.txtGLcode.readOnly = false
//  window.document.frmTrans.cmdGLCode.disabled = false
//  window.document.frmTrans.txtAccNo.readOnly = false
//  window.document.frmTrans.cmdAccno.disabled = false
//  window.document.frmTrans.txtAmt.disabled = false
//  window.document.frmTrans.dtpEffDate.Enabled = true
//  window.document.frmTrans.chkDispAccNo.disabled = false
//}

//function UnLockContAdd() {
//  window.document.frmTrans.cmdModify.disabled = false
//  window.document.frmTrans.cmdDelete.disabled = false
//}

//function SetDrCrLienYN() {
//  var strAppDate1 = "<%= session("applicationdate")%>"
//  var strModeDrCr
//  var strmodid1 = window.document.frmTrans.txtModId.value.toUpperCase()
//  if ((strmodid1 == "SB") || (strmodid1 == "CA")) {
//  }
//  else {
//    return
//  }
//  if (window.document.frmTrans.tranmode(0).checked == true) {
//    strModeDrCr = "Dr"
//  }
//  else if (window.document.frmTrans.tranmode(1).checked == true) {
//    strModeDrCr = "Cr"
//  }
//  if (window.document.all.divRadClg.style.display == "block") {
//    if (window.document.frmTrans.tranmode(2).checked == true) {
//      strModeDrCr = "Dr"
//    }
//  }
//  var st = "GETDRCRLIENYN|" + strModeDrCr + "|" + window.document.frmTrans.txtbranchcode.value + "|" +
//    window.document.frmTrans.txtcurrencycode.value + "|" +
//    strmodid1 + "|" +
//    window.document.frmTrans.txtGLcode.value + "|" +
//    window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtAmt.value + "|" + strAppDate1
//  //alert(st)
//  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
//}

//function SetCCDrCrLienYN() {
//  var strAppDate1 = "<%= session("applicationdate")%>"
//  var strModeDrCr
//  var strmodid1 = window.document.frmTrans.txtModId.value.toUpperCase()
//  if ((strmodid1 == "CC")) {
//  }
//  else {
//    return
//  }
//  var st = "GETCCDRCRLIENYN|" + window.document.frmTrans.txtbranchcode.value + "|" + window.document.frmTrans.txtcurrencycode.value + "|" + strmodid1 + "|" +
//    window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value + "|" + strAppDate1
//  //alert(st)
//  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
//}

//function getPendInt() {
//  if ((window.document.frmTrans.txtModId.value == "LOAN") && (window.document.frmTrans.tranmode[1].checked == true)) {
//    st = window.document.frmTrans.txtbranchcode.value + "|" +
//      window.document.frmTrans.txtcurrencycode.value + "|LOAN|" +
//      window.document.frmTrans.txtGLcode.value + "|" +
//      window.document.frmTrans.txtAccNo.value
//    window.document.all['idetails'].src = '<%="http://" & session("moduledir")& "/Loan/"%>' + "loanrenewintcalc.aspx?st=" + st;
//  }
//}

//function JointHolderValidation() {
//  if (window.document.frmTrans.tranmode(0).checked == true) {
//    var st = "GETJOINTHOLDER|" + window.document.frmTrans.txtbranchcode.value + "|" +
//      window.document.frmTrans.txtcurrencycode.value + "|" +
//      window.document.frmTrans.txtGLcode.value + "|" +
//      window.document.frmTrans.txtAccNo.value + "|" +
//      window.document.frmTrans.txtModId.value
//    //alert(st)
//    window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
//  }
//}

//function Check206AA206AB() {
//  var sBr, sMod, sGL, sAccno, sCur, st
//  sBr = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//  sMod = window.document.frmTrans.txtModId.value.toUpperCase()
//  sGL = window.document.frmTrans.txtGLcode.value.toUpperCase()
//  sAccno = window.document.frmTrans.txtAccNo.value.toUpperCase()
//  sCur = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
//  st = "Check206AA206AB" + "|" + sBr + "|" + sMod + "|" + sGL + "|" + sAccno + "|" + sCur
//  window.document.all["iBatch"].src = "../GENSBCA/querydisplay.aspx?st=" + st
//}

//function getATMCardDetails() {
//  if (window.document.frmTrans.tranmode(0).checked == true) {
//    if (window.document.frmTrans.txtServiceId.value == 4) {
//      var strmodid1 = window.document.frmTrans.txtModId.value.toUpperCase()
//      if ((strmodid1 == "SB") || (strmodid1 == "CA")) {
//        var brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase();
//        var glcode = window.document.frmTrans.txtGLcode.value.toUpperCase();
//        var accno = window.document.frmTrans.txtAccNo.value.toUpperCase();
//        var st = ""
//        st = "ATMCardDet|" + brcode + "|" + glcode + "|" + accno
//        window.document.all['iGetDtls'].src = "../GENSBCA/GetAccDetails.aspx?st=" + st
//      }		//((strmodid1 == "SB") || (strmodid1 == "CA") )
//    }		//(window.document.frmTrans.txtServiceId.value == 4)
//  }  //(window.document.frmTrans.tranmode(0).checked==true)
//}  //getATMCardDetails()
//function genLimitValidation() {
//}

////----------------------------------------------------------------------------------
//function cntrlOnblur(txtName) {
//  var strVal
//  var vUserid = "<%=session("userid")%>"
//  var vBrCode = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//  var strWhr = ""
//  if (window.document.frmTrans.item(txtName).value == "") {
//    return
//  }
//  window.document.frmTrans.item(txtName).value =
//    window.document.frmTrans.item(txtName).value.toUpperCase()
//  strVal = ""
//  //Lost Focus from Single recordset component
//  Dataarrange(window.document.frmTrans.item(txtName))
//  if (txtName == "txtcurrencycode") {
//    strWhr = "upper(currencycode)='" + window.document.frmTrans.txtcurrencycode.value.toUpperCase() + "'"
//    strVal = "GEN" + "~!~" + "txtcurrencydesc" + "~!~" + "GENCURRENCYTYPEMST" + "~!~" + "narration" + "~!~" + strWhr
//  }
//  else if (txtName == "txtServiceId") {
//    document.getElementById("divPhSign").style.display = 'none';
//    strWhr = "upper(code)='" + window.document.frmTrans.txtServiceId.value.toUpperCase() + "'"
//    strVal = "GEN" + "~!~" + "txtServiceName" + "~!~" + "GENSERVICETYPESPMT" + "~!~" + "narration" + "~!~" + strWhr
//    ServiceIdDivs()
//  }
//  else if (txtName == "txtCLGBankCode") {
//    vBankCode = window.document.frmTrans.txtCLGBankCode.value.toUpperCase();
//    if (vBankCode != "") {
//      if (window.document.frmTrans.txtCLGReasoncode.value == "") {
//        alert("Enter Reason Code")
//        window.document.frmTrans.txtCLGBankCode.value = ""
//        return;
//      }
//      strWhr = "upper(trim(BANKCODE))='" + vBankCode + "'"
//      strVal = "GEN" + "~!~" + "hdnClg" + "~!~" + "GENOTHERBANKMST" + "~!~" + "BANKNAME" + "~!~" + strWhr
//    }
//  }
//  else if (txtName == "txtCLGBranch") {
//    vBankCode = window.document.frmTrans.txtCLGBankCode.value.toUpperCase();
//    vBranchCode = window.document.frmTrans.txtCLGBranch.value.toUpperCase();
//    if (window.document.frmTrans.txtCLGBankCode.value == "") {
//      alert("Enter Bank Code")
//      window.document.frmTrans.txtCLGBranch.value = ""
//      return;
//    }
//    strWhr = "upper(trim(BANKCODE))='" + vBankCode + "' and " +
//      "upper(trim(branchcode))='" + vBranchCode + "'"
//    strVal = "GEN" + "~!~" + "hdnClg" + "~!~" + "GENOTHERBRANCHMST" + "~!~" + "BRANCHNAME" + "~!~" + strWhr
//  }
//  else if (txtName == "txtCLGReason") {
//    vCode = window.document.frmTrans.txtCLGReason.value.toUpperCase();
//    strWhr = "upper(trim(CODE))='" + vCode + "'"
//    strVal = "GEN" + "~!~" + "txtCLGReasoncode" + "~!~" + "CLGRETURNREASONMST" + "~!~" + "DESCRIPTION" + "~!~" + strWhr
//  }
//  else if (txtName == "txtAccCatCode") {
//    vCode = window.document.frmTrans.txtAccCatCode.value.toUpperCase();
//    strWhr = "upper(trim(CATEGORYCODE))='" + vCode + "' and CATEGORYCODE<>'99'"
//    strVal = "GEN" + "~!~" + "txtAccCatDesc" + "~!~" + "GENCATEGORYMST" + "~!~" + "NARRATION" + "~!~" + strWhr
//  }
//  //for Remittance Issue by Bank
//  else if (txtName == "txtbybnkcode") {
//    vCode = window.document.frmTrans.txtbybnkcode.value.toUpperCase();
//    //old code commented on 26-sep-2007
//    //Reason: Wrong branch codes are showing to the user
//    // New code written on 26-sep-2007
//    BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//    CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
//    //RemType=window.document.frmTrans.txtGLcode.value.toUpperCase()
//    //alert("rem type=" + remtype)
//    if ((remtype == "ADD") || (remtype == "TC")) {
//      //CODE COMMENTED BY RADHIKA ON 14 MAY 2008
//      //REASON: FOR AGENCY DD, WE SHOULD SHOW BANK CODES FROM CORRESPONDING BANKS
//      /*strWhr="upper(trim(OURBRANCHCODE))=trim('" + BranchCd + "') AND status='R' " +
//        " AND bankcode IN (SELECT DISTINCT OTHERBANKCODE  FROM REMISSUEBANKMST " +
//        " WHERE upper(trim(BRANCHCODE))=trim('" + BranchCd + "') AND  " +
//        " upper(trim(CURRENCYCODE))=trim('" + CurCd +  "') " +
//        " AND upper(trim(REMTYPE))=trim('" + remtype + "') " +
//        " AND upper(trim(OTHERBANKCODE))=trim('" + vCode + "') " +
//        " AND status='R')"
//      strVal="GEN"+"~!~"+"txtbybnkdesc"+"~!~"+"GENOTHERBANKMST"+"~!~"+
//      "BANKNAME"+"~!~"+strWhr
//      */
//      //NEW CODE WRITTEN ON 14 MAY 2008
//      strWhr = "status='R' AND bankcode IN (SELECT DISTINCT OTHERBANKCODE" +
//        " FROM REMISSUEBANKMST WHERE UPPER(trim(CURRENCYCODE))='" +
//        CurCd + "' AND UPPER(trim(REMTYPE))='" +
//        remtype + "' AND status='R')" +
//        " and bankcode='" + vCode + "'"
//      strVal = "GEN" + "~!~" + "txtbybnkdesc" + "~!~" + "GENCORRESPBANKSMST" + "~!~" +
//        "BANKNAME" + "~!~" + strWhr
//    }
//    else if ((remtype == "DD") || (remtype == "TT") || (remtype == "MT") ||
//      (remtype == "BC") || (remtype == "GC") || (remtype == "PO")) {
//      strWhr = "upper(trim(BANKCODE))='" + vCode + "'"
//      strVal = "GEN" + "~!~" + "txtbybnkdesc" + "~!~" + "GENBANKPARM" + "~!~" + "bankname" + "~!~" + strWhr
//    }
//    else {
//      strWhr = "upper(trim(BANKCODE))='" + vCode + "'"
//      strVal = "GEN" + "~!~" + "txtbybnkdesc" + "~!~" + "GENBANKPARM" + "~!~" + "bankname" + "~!~" + strWhr
//    }
//  }
//  //
//  else if (txtName == "txtissbnkcode") {
//    vCode = window.document.frmTrans.txtissbnkcode.value.toUpperCase();
//    //old code commented on 26-sep-2007
//    //Reason: Wrong branch codes are showing to the user
//    /*if(window.document.frmTrans.txtGLcode.value.toUpperCase()=="ADD"){
//      strWhr="upper(trim(Bankcode))='"+vCode+"' and upper(status)='R'"
//       strVal="GEN"+"~!~"+"txtissbnkdesc"+"~!~"+"GENOTHERBANKMST"+"~!~"+"BANKNAME"+"~!~"+strWhr
//      }
//      else{
//      glcd=window.document.frmTrans.txtGLcode.value.toUpperCase()
//      strWhr="upper(trim(ISSUEDONBANKCODE))='"+vCode+"' and upper(REMGLCODE)='"+glcd+"' and upper(status)='R'"
//       strVal="GEN"+"~!~"+"txtissbnkdesc"+"~!~"+"REMTYPEMST"+"~!~"+"ISSUEDONBANKDESC"+"~!~"+strWhr
//      }	*/
//    // New code written on 26-sep-2007
//    BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//    CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
//    //alert("rem type=" + remtype)
//    if ((remtype == "ADD") || (remtype == "TC")) {
//      //CODE COMMENTED BY RADHIKA ON 14 MAY 2008
//      //REASON: FOR AGENCY DD, WE SHOULD SHOW BANK CODES FROM CORRESPONDING BANKS
//      /*strWhr="upper(trim(OURBRANCHCODE))=trim('" + BranchCd + "') AND status='R' " +
//        " AND bankcode IN (SELECT DISTINCT OTHERBANKCODE  FROM REMISSUEBANKMST " +
//        " WHERE upper(trim(BRANCHCODE))=trim('" + BranchCd + "') AND  " +
//        " upper(trim(CURRENCYCODE))=trim('" + CurCd +  "') " +
//        " AND upper(trim(REMTYPE))=trim('" + remtype + "') " +
//        " AND upper(trim(OTHERBANKCODE))=trim('" + vCode + "') " +
//        " AND status='R')"
//      strVal="GEN"+"~!~"+"txtissbnkdesc"+"~!~"+"GENOTHERBANKMST"+"~!~"+"BANKNAME"+
//      "~!~"+strWhr*/
//      //NEW CODE WRITTEN ON 14 MAY 2008
//      strWhr = "status='R' AND bankcode IN (SELECT DISTINCT OTHERBANKCODE" +
//        " FROM REMISSUEBANKMST WHERE UPPER(trim(CURRENCYCODE))='" +
//        CurCd + "' AND UPPER(trim(REMTYPE))='" +
//        remtype + "' AND status='R')" +
//        " and bankcode='" + vCode + "'"
//      strVal = "GEN" + "~!~" + "txtissbnkdesc" + "~!~" + "GENCORRESPBANKSMST" + "~!~" + "BANKNAME" +
//        "~!~" + strWhr
//    }
//    else if ((remtype == "DD") || (remtype == "TT") || (remtype == "MT") ||
//      (remtype == "BC") || (remtype == "GC") || (remtype == "PO")) {
//      strWhr = "upper(trim(BANKCODE))='" + vCode + "'"
//      strVal = "GEN" + "~!~" + "txtissbnkdesc" + "~!~" + "GENBANKPARM" + "~!~" + "bankname" + "~!~" + strWhr
//    }
//    else {
//      strWhr = "upper(trim(BANKCODE))='" + vCode + "'"
//      strVal = "GEN" + "~!~" + "txtissbnkdesc" + "~!~" + "GENBANKPARM" + "~!~" + "bankname" + "~!~" + strWhr
//    }
//  }
//  //Issue by Branch
//  else if (txtName == "txtbybrcode") {
//    var vCode = window.document.frmTrans.txtbybnkcode.value.toUpperCase();
//    var othBrCode = window.document.frmTrans.txtbybrcode.value.toUpperCase();
//    //alert("remtype=" + remtype)
//    if (othBrCode != "") {
//      BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//      CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
//      if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") ||
//        (remtype.toUpperCase() == "TT")) {
//        if (BranchCd == othBrCode) {
//          alert("Can't be respond to the Instrument of the same Branch")
//          window.document.frmTrans.txtbybrcode.value = ""
//          window.document.frmTrans.txtbybrcode.value = ""
//          window.document.frmTrans.txtbybrcode.focus()
//          return
//        }
//      }
//      if ((remtype == "DD") || (remtype == "TT") || (remtype == "MT")) {
//        strWhr = "upper(trim(BANKCODE))='" + vCode + "' and upper(trim(BranchCODE))='"
//          + othBrCode + "'"
//        strVal = "GEN" + "~!~" + "txtbybrdesc" + "~!~" + "GENBANKBRANCHMST" + "~!~" + "BRANCHNAME" +
//          "~!~" + strWhr
//      }
//      else if ((remtype == "ADD") || (remtype == "TC")) {
//        //CODE COMMENTED BY RADHIKA ON 14 MAY 2008
//        //REASON: FOR AGENCY DD, WE SHOULD SHOW Branches of CORRESPONDING BANKS
//        /*strWhr="upper(trim(OURBRANCHCODE))=trim('" + BranchCd + "') AND status='R' " +
//            " AND upper(trim(BANKCODE))=trim('" + vCode + "')" +
//            " AND upper(trim(BRANCHCODE))=trim('" + othBrCode + "')" +
//            " AND BRANCHCODE IN (SELECT DISTINCT OTHERBRANCHCODE FROM REMISSUEBANKMST "+
//            " WHERE upper(trim(BRANCHCODE))=trim('" + BranchCd + "') AND  " +
//            " upper(trim(CURRENCYCODE))=trim('" + CurCd + "') " +
//            " AND upper(trim(REMTYPE))='" + remtype + "'" +
//            " AND upper(trim(OTHERBANKCODE))=trim('" + vCode + "')" +
//            " AND upper(trim(OTHERBRANCHCODE))=trim('" + othBrCode + "')" +
//            " AND status='R')"
//          strVal="GEN"+"~!~"+"txtbybrdesc"+"~!~"+"GENOTHERBRANCHMST"+"~!~"+"BRANCHNAME"+
//          "~!~"+strWhr*/
//        //new code written on 14 may 2008
//        strWhr = "status='R' AND upper(trim(BANKCODE))='" + vCode + "'" +
//          " and BRANCHCODE='" + othBrCode + "'"
//        strVal = "GEN" + "~!~" + "txtbybrdesc" + "~!~" + "GENCORRESPBANKBRANCHESMST" +
//          "~!~" + "BRANCHNAME" + "~!~" + strWhr
//      }
//    }
//  }
//  //  window.document.frmTrans.txtissbrdesc
//  else if (txtName == "txtissbrcode") {
//    var vCode = window.document.frmTrans.txtissbnkcode.value.toUpperCase();
//    var othBrCode = window.document.frmTrans.txtissbrcode.value.toUpperCase();
//    if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") || (remtype.toUpperCase() == "TT")) {
//      if (vBrCode == othBrCode) {
//        alert("Instrument can't be issued on the same Branch")
//        window.document.frmTrans.txtissbrcode.value = ""
//        window.document.frmTrans.txtissbrdesc.value = ""
//        window.document.frmTrans.txtissbrcode.focus()
//        return
//      }
//    }
//    if ((vCode != "") && (othBrCode != "")) {
//      BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//      CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
//      if ((remtype == "DD") || (remtype == "TT") || (remtype == "MT")) {
//        strWhr = "upper(trim(BANKCODE))='" + vCode + "' and upper(trim(BranchCODE))='"
//          + othBrCode + "'"
//        strVal = "GEN" + "~!~" + "txtissbrdesc" + "~!~" + "GENBANKBRANCHMST" + "~!~" + "BRANCHNAME" +
//          "~!~" + strWhr
//      }
//      else if ((remtype == "ADD") || (remtype == "TC")) {
//        //CODE COMMENTED BY RADHIKA ON 14 MAY 2008
//        //REASON: FOR AGENCY DD, WE SHOULD SHOW Branches of CORRESPONDING BANKS
//        /*
//        strWhr="upper(trim(OURBRANCHCODE))=trim('" + BranchCd + "') AND status='R' " +
//            " AND upper(trim(BANKCODE))=trim('" + vCode + "')" +
//            " AND upper(trim(BRANCHCODE))=trim('" + othBrCode + "')" +
//            " AND BRANCHCODE IN (SELECT DISTINCT OTHERBRANCHCODE FROM REMISSUEBANKMST "+
//            " WHERE upper(trim(BRANCHCODE))=trim('" + BranchCd + "') AND  " +
//            " upper(trim(CURRENCYCODE))=trim('" + CurCd + "') " +
//            " AND upper(trim(REMTYPE))='" + remtype + "'" +
//            " AND upper(trim(OTHERBANKCODE))=trim('" + vCode + "')" +
//            " AND upper(trim(OTHERBRANCHCODE))=trim('" + othBrCode + "')" +
//            " AND status='R')"
//          strVal="GEN"+"~!~"+"txtissbrdesc"+"~!~"+"GENOTHERBRANCHMST"+"~!~"+"BRANCHNAME"+
//          "~!~"+strWhr */
//        //new code written on 14 may 2008
//        strWhr = "status='R' AND upper(trim(BANKCODE))='" + vCode + "'" +
//          " and BRANCHCODE='" + othBrCode + "'"
//        strVal = "GEN" + "~!~" + "txtissbrdesc" + "~!~" + "GENCORRESPBANKBRANCHESMST" +
//          "~!~" + "BRANCHNAME" + "~!~" + strWhr
//      }
//    }
//  }
//  else if (txtName == "txtFRateRefCode") {
//    var RateType = window.document.frmTrans.cmbFRateType.options
//    [window.document.frmTrans.cmbFRateType.selectedIndex].value
//    if (RateType == "") {
//      window.document.frmTrans.txtFRateRefCode.value = ""
//      return
//    }
//    var vCode = window.document.frmTrans.txtFRateRefCode.value.toUpperCase()
//    strWhr = "upper(CODE)='" + vCode + "' and upper(status)='R'"
//    if (RateType == "C") {
//      strVal = "GEN" + "~!~" + "txtFRateRefDesc" + "~!~" + "FXGENCARDRATECATEGORIESPMT" + "~!~" + "NARRATION" + "~!~" + strWhr
//    }
//    else if (RateType == "D") {
//      strVal = "GEN" + "~!~" + "txtFRateRefDesc" + "~!~" + "FXDEALINGROOMMST" + "~!~" + "NARRATION" + "~!~" + strWhr
//    }
//    else if (RateType == "N") {
//      strWhr = "upper(CATEGORY)='" + vCode + "' and upper(status)='R'"
//      strVal = "GEN" + "~!~" + "txtFRateRefDesc" + "~!~" + "FXGENRATECATEGORIESPMT" + "~!~" + "NARRATION" + "~!~" + strWhr
//    }
//    else if (RateType == "F") {
//      strWhr = "upper(ACCNO)='" + vCode + "' and upper(status)='R' and upper(transtatus)='A'"
//      strVal = "GEN" + "~!~" + "txtFRateRefDesc" + "~!~" + "FXFCMST" + "~!~" + "NAME" + "~!~" + strWhr
//    }
//  }
//  //Lost focus from Component
//  if (txtName == "txtbranchcode") {
//    vUserid = "<%=session("userid")%>"
//    if (vUserid != "" && vBrCode != "") {
//      strVal = "COMP" + "~!~" + "txtbranchdesc" + "~!~" + vBrCode + "~!~" + vUserid
//    }
//    var aBrCode
//    aBrCode = "<%=session("branchcode")%>"
//    if ((window.document.frmTrans.txtbranchcode.value.toUpperCase() !=
//      aBrCode.toUpperCase()) && (window.document.frmTrans.Mfgpaydt.Rows == 1)) {
//      window.document.frmTrans.chkABB.checked = true
//      window.document.frmTrans.chkDispAccNo.disabled = true
//    }
//    else if ((window.document.frmTrans.txtbranchcode.value.toUpperCase() ==
//      aBrCode.toUpperCase()) && (window.document.frmTrans.Mfgpaydt.Rows == 1)) {
//      window.document.frmTrans.chkABB.checked = false
//      window.document.frmTrans.chkDispAccNo.disabled = true
//    }
//    //AbbApplDt()
//    AbbApplDtBr()
//  }
//  else if (txtName == "txtModId") {
//    //alert("fs")
//    document.getElementById("divPhSign").style.display = 'none';
//    window.document.frmTrans.txtModId.value = window.document.frmTrans.txtModId.value.toUpperCase()
//    var vModId = window.document.frmTrans.txtModId.value.toUpperCase()
//    if (vBrCode != "" && vModId != "") {
//      strVal = "COMP" + "~!~" + "txtModDesc" + "~!~" + vBrCode + "~!~" + vModId
//      parm = window.document.frmTrans.txtModDesc.value +
//        "-----" + window.document.frmTrans.txtModId.value.toUpperCase()
//      if ((vModId == "REM") && ((window.document.frmTrans.tranmode(0).checked == true) ||
//        (window.document.frmTrans.tranmode(2).checked == true))) {
//        divsDisplay("remdr", "M")
//        divsDisplay("remdr", "M")
//        window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"
//      }
//      else if ((vModId == "REM") && (window.document.frmTrans.tranmode(1).checked == true)) {
//        divsDisplay("remcr", "M")
//        window.document.all.divComm.style.display = "block";
//        window.document.all['divfxRem'].style.display = "block";
//        window.document.all['divrembank'].style.display = "block";
//      }
//      window.document.all.divaccno.style.display = "none"
//    }
//    if (window.document.frmTrans.tranmode(2).checked == true) {
//      if (vModId == "REM") {
//        window.document.frmTrans.chkCheque.checked = false;
//      }
//      else {
//        window.document.frmTrans.chkCheque.checked = true;
//      }
//      Cheque()
//    }
//  }
//  else if (txtName == "txtGLcode") {
//    document.getElementById("divPhSign").style.display = 'none';
//    window.document.frmTrans.txtGLcode.value = window.document.frmTrans.txtGLcode.value.toUpperCase()
//    vModId = window.document.frmTrans.txtModId.value.toUpperCase()
//    vGLCode = window.document.frmTrans.txtGLcode.value.toUpperCase()
//    if (vBrCode != "" && vModId != "" && vGLCode != "") {
//      strVal = "COMP" + "~!~" + "txtGLDesc" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode
//      /*if((window.document.frmTrans.txtModId.value=="REM")||(window.document.frmTrans.txtModId.value=="FXREM")){
//       Remclear()
//       getremtype()
//      } */
//      parm = window.document.frmTrans.txtGLDesc.value + "-----" +
//        window.document.frmTrans.txtGLcode.value
//    }
//  }
//  else if (txtName == "txtAccNo") {
//    document.getElementById("divPhotoSignature").style.display = 'none';
//    window.document.frmTrans.txtAccNo.value = window.document.frmTrans.txtAccNo.value.toUpperCase()
//    vModId = window.document.frmTrans.txtModId.value.toUpperCase()
//    vGLCode = window.document.frmTrans.txtGLcode.value.toUpperCase()
//    vAccNo = window.document.frmTrans.txtAccNo.value.toUpperCase()
//    vCurCode = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
//    if (vBrCode != "" && vModId != "" && vGLCode != "" && vAccNo != "") {
//      strVal = "COMP" + "~!~" + "txtAccNm" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode + "~!~" + vAccNo
//      if (vModId == 'SCR')
//        strVal = strVal + "~!~" + vCurCode
//    }
//    if (vModId == "SCR") {
//      SuspenseDtls()
//    }
//    // checking for chequebookYN
//    if (vModId == "SB" || vModId == "CA" || vModId == "CC") {
//      GetAccDets()
//    }
//  }
//  //for Link details
//  else if (txtName == "txtLnkModId") {
//    if (vBrCode != "") {
//      var vModId = window.document.frmTrans.txtLnkModId.value.toUpperCase()
//      if (vBrCode != "" && vModId != "") {
//        strVal = "COMP" + "~!~" + "txtLnkModDesc" + "~!~" + vBrCode + "~!~" + vModId
//      }
//    }
//  }
//  else if (txtName == "txtLnkGLCode") {
//    vModId = window.document.frmTrans.txtLnkModId.value.toUpperCase()
//    vGLCode = window.document.frmTrans.txtLnkGLCode.value.toUpperCase()
//    if (vBrCode != "" && vModId != "" && vGLCode != "") {
//      strVal = "COMP" + "~!~" + "txtLnkGLname" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode
//    }
//  }
//  else if (txtName == "txtLnkAccNo") {
//    vModId = window.document.frmTrans.txtLnkModId.value.toUpperCase()
//    vGLCode = window.document.frmTrans.txtLnkGLCode.value.toUpperCase()
//    vAccNo = window.document.frmTrans.txtLnkAccNo.value.toUpperCase()
//    if (vBrCode != "" && vModId != "" && vGLCode != "" && vAccNo != "") {
//      strVal = "COMP" + "~!~" + "txtLnkAccNm" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode + "~!~" + vAccNo
//    }
//  }
//  //for Clearing details
//  else if (txtName == "txtCLGModId") {
//    document.getElementById("divPhotoSignature").style.display = 'none';
//    if (vBrCode != "") {
//      var vModId = window.document.frmTrans.txtCLGModId.value.toUpperCase()
//      if (vBrCode != "" && vModId != "") {
//        strVal = "COMP" + "~!~" + "txtCLGModDesc" + "~!~" + vBrCode + "~!~" + vModId
//      }
//    }
//  }
//  else if (txtName == "txtCLGGLcode") {
//    document.getElementById("divPhotoSignature").style.display = 'none';
//    vModId = window.document.frmTrans.txtCLGModId.value.toUpperCase()
//    vGLCode = window.document.frmTrans.txtCLGGLcode.value.toUpperCase()
//    if (vBrCode != "" && vModId != "" && vGLCode != "") {
//      strVal = "COMP" + "~!~" + "txtCLGGLName" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode
//    }
//  }
//  else if (txtName == "txtCLGAccNo") {
//    vModId = window.document.frmTrans.txtCLGModId.value.toUpperCase()
//    vGLCode = window.document.frmTrans.txtCLGGLcode.value.toUpperCase()
//    vAccNo = window.document.frmTrans.txtCLGAccNo.value.toUpperCase()
//    if (vBrCode != "" && vModId != "" && vGLCode != "" && vAccNo != "") {
//      strVal = "COMP" + "~!~" + "txtCLGAccNm" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode + "~!~" + vAccNo
//    }
//  }
//  //for Suspense details
//  if (strVal != "") {
//    strVal = txtName + "~!~" + strVal
//    //alert(strVal)
//    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genonblur.aspx?strParam=" + strVal
//  }
//}

//function ReturnedBack(str) {
//  if (str == "txtServiceId") {
//    if (window.document.frmTrans.txtServiceName.value != "") {
//      window.document.frmTrans.txtModId.focus()
//    }
//  }
//  else if (str == "txtModId") {
//    if (window.document.frmTrans.txtModDesc.value != "") {
//      window.document.frmTrans.txtGLcode.focus()
//    }
//  }
//  else if (str == "txtGLcode") {
//    if (window.document.frmTrans.tranmode[2].checked == true) {
//      if (window.document.frmTrans.txtModId.value == "REM") {
//        window.document.frmTrans.txtinstrno.focus()
//      }
//    }
//    else {
//      if (window.document.frmTrans.txtModId.value == "REM") {
//        if (window.document.frmTrans.txtGLDesc.value != "") {
//          window.document.frmTrans.txtAmt.focus()
//          window.document.frmTrans.txtAmt.value = "0.00"
//          window.document.frmTrans.txtAmt.select()
//        }
//      }
//      else {
//        if (window.document.frmTrans.txtGLDesc.value != "") {
//          window.document.frmTrans.txtAccNo.focus()
//        }
//      }
//    }
//  }
//  else if (str == "txtAccNo") {
//    if (window.document.frmTrans.txtAccNm.value != "") {
//      window.document.frmTrans.txtAmt.focus()
//      window.document.frmTrans.txtAmt.value = "0.00"
//      window.document.frmTrans.txtAmt.select()
//    }
//  }
//}

//function AccParamRtn(strRslt) {
//  pMinAmt = ""; pMaxAmt = ""; pMinPrdYrs = ""; pMinPrdMons = "";
//  pMinPrdDays = ""; pMaxPrdYrs = ""; pMaxPrdMons = ""; pMaxPrdDays = "";
//  pMultplesOf = "";
//  var arrInd
//  if (strRslt == "No Parameters") {
//    alert("No Parameters Specified ")
//    return
//  }
//  var parmVal = strRslt.split("~")
//  if (parmVal[0] == 0 || parmVal[1] == 0) {
//    alert("No Parameters Specified ")
//    return
//  }
//  pMinAmt = parmVal[0]; pMaxAmt = parmVal[1]; pMinPrdYrs = parmVal[2]; pMinPrdMons = parmVal[3];
//  pMinPrdDays = parmVal[4]; pMaxPrdYrs = parmVal[5]; pMaxPrdMons = parmVal[6];
//  pMaxPrdDays = parmVal[7];
//  //pChqVldPrd=parmVal[46];pMultplesOf=parmVal[83];
//  pMultplesOf = parmVal[83];
//}

//function AccParameters(AccNoOrCatCode, AccOrCat) {
//  var strPrm = "";
//  var modId = window.document.frmTrans.txtModId.value.toUpperCase();
//  var appDt = "<%=vAppdate%>"
//  if (modId != "SB" && modId != "CA" && modId != "DEP" && modId != "LOAN" && modId != "CC")
//    return;
//  if ((window.document.frmTrans.txtbranchcode.value == "") ||
//    (window.document.frmTrans.txtcurrencycode.value == "") || (appDt == "") ||
//    (window.document.frmTrans.txtModId.value == "") || (strsessionflds[8] == "") ||
//    (window.document.frmTrans.txtGLcode.value == "") || (strsessionflds[0] == "") ||
//    (AccNoOrCatCode == "")) {
//    return
//  }
//  strPrm = "ACCOUNT" + "~" + window.document.frmTrans.txtModId.value + "~" +
//    window.document.frmTrans.txtGLcode.value + "~" + appDt + "~" +
//    window.document.frmTrans.txtcurrencycode.value + "~" +
//    window.document.frmTrans.txtbranchcode.value + "~" + strsessionflds[0] + "~" +
//    strsessionflds[8] + "~" + AccNoOrCatCode + "~" + AccOrCat
//  window.document.all['iPrm'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genparameters.aspx?strparam=" + strPrm
//}

//function ClearAlert(code) {
//  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
//    var confm
//    if (code == "Cur") {
//      confm = confirm("Changing of Currency Code  at this stage will clear off already entered data..."
//        + "\n" + "\n" + "Do you want to Continue ?")
//      if (confm == true) {
//        Cancel() // if(confm==false)
//      }
//      else {
//        window.document.frmTrans.txtcurrencycode.value = curCode
//        window.document.frmTrans.txtcurrencydesc.value = curDesc
//      }
//    } // vAbbuser.toUpperCase()!="Y"
//    else if ((code == "Brn") && ((window.document.frmTrans.Mfgpaydt.Rows > 1) &&
//      (window.document.frmTrans.Mfgpaydt.TextMatrix(1, 45) == ""))) {
//      confm = confirm("Changing of Branch Code at this stage will clear off already entered data..."
//        + "\n" + "\n" + "Do you want to Continue ?")
//      if (confm == true) {
//        Cancel()   //if(confm==false)
//      }
//      else {
//        window.document.frmTrans.txtbranchcode.value = brCode
//        window.document.frmTrans.txtbranchdesc.value = brDesc
//      }
//    }
//  }
//  else if (vAbbuser.toUpperCase() != "Y") {
//    formClear()
//  }
//}

//function balanceDet() {
//  var kstr = "";
//  if (eval(window.document.frmTrans.txtServiceId.value != "8")) {
//    if (window.document.frmTrans.txtbranchcode.value.length > 0 &&
//      window.document.frmTrans.txtcurrencycode.value.length > 0 &&
//      window.document.frmTrans.txtModId.value.length > 0 &&
//      window.document.frmTrans.txtGLcode.value.length > 0 &&
//      window.document.frmTrans.txtAccNo.value.length > 0) {
//      kstr = window.document.frmTrans.txtbranchcode.value + "~";
//      kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
//      kstr = kstr + window.document.frmTrans.txtModId.value + "~";
//      kstr = kstr + window.document.frmTrans.txtGLcode.value + "~";
//      kstr = kstr + window.document.frmTrans.txtAccNo.value + "~";
//      if (eval(window.document.frmTrans.txtServiceId.value != "2")) {
//        //alert("fir" + kstr)
//        window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplay.aspx?kstr=" + kstr
//      }
//    }
//  }
//  if (eval(window.document.frmTrans.txtServiceId.value == "8")) {
//    if (window.document.frmTrans.txtbranchcode.value.length > 0 &&
//      window.document.frmTrans.txtcurrencycode.value.length > 0 &&
//      window.document.frmTrans.txtCLGModId.value.length > 0 &&
//      window.document.frmTrans.txtCLGGLcode.value.length > 0 &&
//      window.document.frmTrans.txtCLGAccNo.value.length > 0) {
//      kstr = window.document.frmTrans.txtbranchcode.value + "~";
//      kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
//      kstr = kstr + window.document.frmTrans.txtCLGModId.value + "~";
//      kstr = kstr + window.document.frmTrans.txtCLGGLcode.value + "~";
//      kstr = kstr + window.document.frmTrans.txtCLGAccNo.value + "~";
//      //alert(kstr)
//      window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplayret.aspx?kstr=" + kstr
//    }
//  }
//}

////code added by Radhika on 12 May 2008
////Desc: To select CheckBook Check box, when accounts of modules CC,CA,SB in Debit Tran mode
//function GetAccDets() {
//  var kstr = "";
//  if (eval(window.document.frmTrans.txtServiceId.value != "1")) {
//    return;
//  }
//  //if(vMode=="TRANS"){
//  if (window.document.frmTrans.tranmode(0).checked != true)
//    return;
//  if ((window.document.frmTrans.txtModId.value.toUpperCase() != 'SB') &&
//    (window.document.frmTrans.txtModId.value.toUpperCase() != 'CA') &&
//    (window.document.frmTrans.txtModId.value.toUpperCase() != 'CC')) {
//    return;
//  }
//  kstr = "CHQACCYESNO" + "~";
//  kstr = kstr + window.document.frmTrans.txtModId.value + "~" + window.document.frmTrans.txtGLcode.value + "~~";
//  kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
//  kstr = kstr + window.document.frmTrans.txtbranchcode.value + "~~~";
//  kstr = kstr + window.document.frmTrans.txtAccNo.value + "~";
//  //alert(kstr)
//  window.document.all['getAccDet'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genParameters.aspx?strparam=" + kstr
//}

//// account details
//function AccDetails() {
//  var strData
//  if (window.document.frmTrans.txtbranchcode.value == "") {
//    alert("Enter Branch Code")
//    return
//  }
//  if (window.document.frmTrans.txtModId.value == "") {
//    alert("Enter ModId Code")
//    return
//  }
//  if (window.document.frmTrans.txtGLcode.value == "") {
//    alert("Enter GLcode Code")
//    return
//  }
//  if (window.document.frmTrans.txtAccNo.value == "") {
//    alert("Enter AccNo Code")
//    return
//  }
//  //Prepare A/C details data
//  strData = window.document.frmTrans.txtbranchcode.value + "|" + window.document.frmTrans.txtbranchdesc.value + "|" +
//    window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtcurrencydesc.value + "|" +
//    window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtGLDesc.value + "|" + window.document.frmTrans.txtModId.value + "|" + "" + "|" +
//    window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtAccNm.value
//  window.open('<%="http://" & session("moduledir")& "/GenSBCA/"%>' + "accountdetails.aspx?strData=" + strData, "SB", "width=750%,height=600%,top=0,left=0,scrollbars=yes")
//} //end of AccDetails() method

////This function was written to display account holder details like Current Balance,... coming from server page
//function display(kstr) {
//  //alert("hi = " +kstr )
//  if (kstr == "") {
//    return
//  }
//  balstr = kstr.split("|");
//  if (window.document.frmTrans.txtModId.value.toUpperCase() == "SCR") {
//  }
//  else {
//    window.document.frmTrans.txtClrBal.value = balstr[2];
//  }
//  if (balstr[11] != "0") {
//    window.document.frmTrans.txtGstin.value = balstr[11];
//  }
//  else {
//    window.document.frmTrans.txtGstin.value = ""
//  }
//  precision(window.document.frmTrans.txtClrBal, window.document.frmTrans.hpr.value)
//  window.document.frmTrans.txtUnClrBal.value = balstr[1];
//  if (eval(window.document.frmTrans.txtUnClrBal.value) > 0) {
//    lblUnclrbal.href = "#"
//  }
//  else {
//    lblUnclrbal
//  }
//  precision(window.document.frmTrans.txtUnClrBal, window.document.frmTrans.hpr.value)
//  window.document.frmTrans.txtNetBal.value = balstr[0];
//  precision(window.document.frmTrans.txtNetBal, window.document.frmTrans.hpr.value)
//  window.document.frmTrans.txtCustId.value = balstr[3];
//  window.document.frmTrans.txtOpaBy.value = balstr[4];
//  window.document.frmTrans.txtOpInstr.value = balstr[5];
//  //alert("hi1")
//  if ((window.document.frmTrans.txtModId.value.toUpperCase() == "SB") || (window.document.frmTrans.txtModId.value.toUpperCase() == "CA")) {
//    window.document.frmTrans.txtpendbal.value = balstr[7];
//    precision(window.document.frmTrans.txtpendbal, window.document.frmTrans.hpr.value)
//    window.document.frmTrans.txttotcashdr.value = parseFloat(balstr[8]).toFixed(2);  //cash dr
//    window.document.frmTrans.txttotcashcr.value = parseFloat(balstr[9]).toFixed(2);  // cash cr
//    window.document.frmTrans.hdnmaxamt.value = parseFloat(balstr[10]).toFixed(2);   //max amt
//  }
//  if ((window.document.frmTrans.txtModId.value.toUpperCase() == "PL") || (window.document.frmTrans.txtModId.value.toUpperCase() == "MISC") || (window.document.frmTrans.txtModId.value.toUpperCase() == "BILLS")) {
//    window.document.frmTrans.txtpendbal.value = balstr[6];
//    precision(window.document.frmTrans.txtpendbal, window.document.frmTrans.hpr.value)
//  }
//  if (window.document.frmTrans.txtModId.value.toUpperCase() == "CC") {
//    window.document.frmTrans.txtpendbal.value = balstr[9];
//    precision(window.document.frmTrans.txtpendbal, window.document.frmTrans.hpr.value)
//    window.document.frmTrans.txttotcashdr.value = parseFloat(balstr[10]).toFixed(2);
//    window.document.frmTrans.txttotcashcr.value = parseFloat(balstr[11]).toFixed(2);
//    window.document.frmTrans.hdnmaxamt.value = parseFloat(balstr[12]).toFixed(2);//maxamt
//  }
//  if (window.document.frmTrans.txtModId.value.toUpperCase() == "CC") {
//    //	window.document.frmTrans.txtLmtAmt.value=eval(balstr[7]) + eval(balstr[13]);
//    window.document.frmTrans.txtLmtAmt.value = eval(balstr[7])
//    precision(window.document.frmTrans.txtLmtAmt, window.document.frmTrans.hpr.value)
//    window.document.frmTrans.txttodlimit.value = balstr[13];
//    //window.document.frmTrans.txtavalimit.value=parseFloat(window.document.frmTrans.txtLmtAmt.value)+parseFloat(window.document.frmTrans.txtClrBal.value)
//    window.document.frmTrans.txtavalimit.value = parseFloat(parseFloat(window.document.frmTrans.txtLmtAmt.value) + parseFloat(window.document.frmTrans.txttodlimit.value) + parseFloat(window.document.frmTrans.txtClrBal.value)).toFixed(2);
//    window.document.frmTrans.txtLimitExpDt.value = balstr[14];
//    if (balstr[15] == "P") {
//      window.document.frmTrans.all.spannpadispmsg.innerHTML = ""
//    }
//    else {
//      window.document.frmTrans.all.spannpadispmsg.innerHTML = "Account Is NPA";
//    }
//  }
//  strValues = balstr[3]
//  //	alert("hi1")
//  window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "msgcnt.aspx?strVal=" + strValues
//  {
//    if (window.document.frmTrans.txtModId.value.toUpperCase() == "LOAN") {
//      window.document.frmTrans.txtloanaccbal.value = balstr[0]
//      //alert(window.document.frmTrans.txtloanaccbal.value)
//      //alert(window.document.frmTrans.txtIntPendAmt.value)
//      if (window.document.frmTrans.tranmode[1].checked == true) {
//        if (isNaN(parseFloat(window.document.frmTrans.txtIntPendAmt.value)) == false) {
//          window.document.frmTrans.txtloanaccbal.value = parseFloat(window.document.frmTrans.txtloanaccbal.value) - parseFloat(window.document.frmTrans.txtIntPendAmt.value)
//        }
//        else {
//          window.document.frmTrans.txtloanaccbal.value = window.document.frmTrans.txtloanaccbal.value
//          window.document.frmTrans.txtIntPendAmt.value = 0
//          precision(window.document.frmTrans.txtIntPendAmt, window.document.frmTrans.hpr.value)
//        }
//        //MinPeriodValidation()
//      }
//      precision(window.document.frmTrans.txtloanaccbal, window.document.frmTrans.hpr.value)
//      window.document.frmTrans.txtloanclearbal.value = balstr[2]
//      precision(window.document.frmTrans.txtloanclearbal, window.document.frmTrans.hpr.value)
//      window.document.frmTrans.txtloanCustId.value = balstr[3]
//      //precision(window.document.frmTrans.txtloanCustId,window.document.frmTrans.hpr.value)
//      window.document.frmTrans.txtloandisbamt.value = balstr[8]
//      precision(window.document.frmTrans.txtloandisbamt, window.document.frmTrans.hpr.value)
//      window.document.frmTrans.txtloanOpaBy.value = balstr[4]
//      window.document.frmTrans.txtloansancamt.value = balstr[7]
//      precision(window.document.frmTrans.txtloansancamt, window.document.frmTrans.hpr.value)
//      window.document.frmTrans.txtloanunclear.value = balstr[1]
//      if (eval(window.document.frmTrans.txtloanunclear.value) > 0) {
//        lblLoanUnclrbal.href = "#"
//      }
//      else {
//        lblLoanUnclrbal
//      }
//      precision(window.document.frmTrans.txtloanunclear, window.document.frmTrans.hpr.value)
//      window.document.frmTrans.txtloanavailbal.value = balstr[7] - balstr[8]
//      precision(window.document.frmTrans.txtloanavailbal, window.document.frmTrans.hpr.value)
//      window.document.frmTrans.txtLpendbal.value = balstr[11]
//      precision(window.document.frmTrans.txtLpendbal, window.document.frmTrans.hpr.value)
//      if (balstr[12] == "P") {
//        window.document.frmTrans.all.spannpadispmsg.innerHTML = ""
//      }
//      else {
//        window.document.frmTrans.all.spannpadispmsg.innerHTML = "Account Is NPA";
//      }
//      window.document.frmTrans.txtloanintsamt.value = balstr[13]
//      precision(window.document.frmTrans.txtloanintsamt, window.document.frmTrans.hpr.value)
//      window.document.frmTrans.txtloanpendinst.value = balstr[14]
//    }
//    else if (window.document.frmTrans.txtModId.value == "DEP" &&
//      window.document.frmTrans.txtServiceId != "2") {
//      Deppopaccnodetails()
//    }
//  }
//  if ((window.document.frmTrans.tranmode(0).checked == true) || (window.document.frmTrans.tranmode(2).checked == true)) {
//    var st = "PPhotocust|" + window.document.frmTrans.txtCustId.value
//    window.document.all['iPhotoSign'].src = '<%="http://" & session("moduledir")&"/GENSBCA/"%>' + "GetPhotoSign.aspx?st=" + st
//  }
//  else if (window.document.frmTrans.tranmode(1).checked == true) {
//    if (window.document.frmTrans.txtModId.value.toUpperCase() == "SB" || window.document.frmTrans.txtModId.value.toUpperCase() == "CA") {
//      SetDrCrLienYN()
//    }
//  }
//}

//function GetBranchParams(strBrCode) {
//  var strpm = "";
//  var strBrid
//  strBrid = window.document.frmTrans.txtModId.value.toUpperCase()
//  //alert("strBrCode=" + strBrCode)
//  if (strBrCode.length > 0) {
//    strpm = "CHQVALIDPERIODLENDY" + "~" + strBrCode + "~" + strBrid
//    //alert(strpm)
//    window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
//  }
//}

//function AbbApplDtRtn(appDt) {
//  if ((appDt != "NOAPPLDT") || (appDt != "")) {
//    if (appDt != vAppDate) {
//      alert("Application date of selected Branch should same as " +
//        "Application date of Logged in User's Branch")
//      window.document.frmTrans.txtbranchcode.value = ""
//      window.document.frmTrans.txtbranchdesc.value = ""
//      window.document.frmTrans.chkABB.checked = false
//      window.document.frmTrans.chkDispAccNo.disabled = false
//    }
//    else {
//      abbApplDt = appDt
//      window.document.frmTrans.txtEffDate.value = abbApplDt
//      //code copied from Branchcode(str) method by Radhika on 19 may 2008
//      //Reason: Without fetching ABB appl date execution is going on
//      ClearAlert("Brn")
//      GetBranchParams(window.document.frmTrans.txtbranchcode.value)
//    }
//  }
//  else {
//    alert("No Application Date set for this Branch")
//    window.document.frmTrans.txtbranchcode.value = ""
//    window.document.frmTrans.txtbranchdesc.value = ""
//    window.document.frmTrans.chkABB.checked = false
//    window.document.frmTrans.chkDispAccNo.disabled = false
//  }
//}

//function AbbApplDtBr() {
//  var aBrCode1
//  aBrCode1 = "<%=session("branchcode")%>"
//  if ((window.document.frmTrans.txtbranchcode.value.length > 0) && (window.document.frmTrans.txtbranchcode.value != aBrCode1) && (window.document.frmTrans.Mfgpaydt.Rows > 1)) {
//    if (window.document.frmTrans.Mfgpaydt.TextMatrix(1, 100) == 'N') {
//      strpm = "ABBAPPLDATE" + "~" + window.document.frmTrans.txtbranchcode.value
//      window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
//    }
//  }
//}

//function is used to populate account no name in list based on module id,glcode and makes visible true or flase of different divs based on conditions
//function AccCode() {
//  //alert("AccCode()")
//  window.document.all['divunits'].style.display = "none"
//  window.document.frmTrans.txtUnits.value = ""
//  if (window.document.frmTrans.chkDispAccNo.checked == false) {
//    if ((window.document.frmTrans.txtServiceId.value == "3") ||
//      (window.document.frmTrans.txtServiceId.value == "4")) {
//      if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
//        alert("Post or Cancel already entered data...")
//        return
//      }
//      if ((window.document.frmTrans.txtModId.value.toUpperCase() == "SB") || (window.document.frmTrans.txtModId.value.toUpperCase() == "CA")) {
//        stacc = "Telleraccno";
//      }
//      else {
//        stacc = "DepRenCloseAccno";
//      }
//    }
//    else {
//      stacc = "Telleraccno";
//    }
//  }
//  else {
//    stacc = "DispAccNo"
//  }
//  brchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase();
//  ModId = window.document.frmTrans.txtModId.value.toUpperCase();
//  GlCd = window.document.frmTrans.txtGLcode.value.toUpperCase();
//  crCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase();
//  serId = window.document.frmTrans.txtServiceId.value
//  kstr = stacc + "|" + brchCd + "|" + ModId + "|" + GlCd + "|" + crCd + "|" + serId
//  //alert(kstr)
//  if ((brchCd.length > 0) && (GlCd.length > 0) && (ModId.length > 0) && (crCd.length > 0))
//    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
//      "DialogWidth:470px;DialogHeight:200px;DialogLeft:140px;DialogTop:120px")
//}

////------- Cash Debit Cash Credit ---------------------
//function CatCode() {
//  kstr = "catcode"
//  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx?st=" + kstr)
//}

////This function is used to populate different category codes and descriptions for suspense and sundry.
//function SuspenseDtls() {
//  var Modid, GlCd, prec, catdtls, kstr, Accno, strDisp, scrAmt
//  ModId = window.document.frmTrans.txtModId.value.toUpperCase();
//  GlCd = window.document.frmTrans.txtGLcode.value.toUpperCase();
//  Brcode = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//  Curr = window.document.frmTrans.txtcurrencycode.value.toUpperCase()
//  Accno = window.document.frmTrans.txtAccNo.value.toUpperCase();
//  scrgridYN = ""
//  prec = window.document.frmTrans.hpr.value
//  //alert("vMode=" + vMode + ", Modid=" + ModId)
//  if ((vMode == "TRANS") || (vMode == "PAY")) {
//    if ((ModId == "SCR") && (GlCd != "") && (Brcode != "")) {
//      kstr = "SUSPENCE"
//      catdtls = kstr + "~!~" + ModId + "~!~" + GlCd + "~!~" + Brcode
//      //alert("catdtls=" + catdtls)
//      window.document.all['iDisp'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "querydisplay.aspx?st=" + catdtls
//    }
//  }
//  else if (vMode == "REC") {
//    kstr = "SUSPENCE"
//    catdtls = kstr + "~!~" + ModId + "~!~" + GlCd + "~!~" + Brcode
//    //alert("catdtls=" + catdtls)
//    window.document.all['iDisp'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "querydisplay.aspx?st=" + catdtls
//  }
//}

//function ServiceIdDivs() {
//  //for clearing outward returns
//  //alert("hi")
//  window.document.frmTrans.cmdModId.disabled = false
//  byBranch.innerHTML = "Issued by Branch"
//  byBank.innerHTML = "Issued by Bank"
//  if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
//    CLGClearDiv()
//    paramAcc()
//  }
//  else if (eval(window.document.frmTrans.txtServiceId.value) == "9") {
//    window.document.frmTrans.cmdModId.disabled = true
//    window.document.frmTrans.txtModId.value = "REM"
//    //if(window.document.frmTrans.tranmode(0).checked==true)
//    cntrlOnblur('txtModId')
//    divsDisplay("remdr", "M")
//    window.document.all.divaccno.style.display = "none"
//    byBranch.innerHTML = "Issued on Branch"
//    byBank.innerHTML = "Issued on Bank"
//    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"
//    // RemCanc for DD and BC
//    var st = "REMCANCCHARGES"
//    window.document.all['iGetDtls'].src = "../GEN/getDtls.aspx?st=" + st
//  }
//  else if (eval(window.document.frmTrans.txtServiceId.value) != "2" &&
//    window.document.frmTrans.txtModId.value != "SCR") {
//    window.document.all.divaccno.style.display = "block"
//    window.document.all['divAppName'].style.display = "none";
//    window.document.all['divAccCat'].style.display = "none"
//  }
//  else if (eval(window.document.frmTrans.txtServiceId.value) == "2") {
//    window.document.all['divaccno'].style.display = "none";
//    window.document.all['divAppName'].style.display = "block";
//    window.document.all['divAccCat'].style.display = "block"
//    Depdivclear()
//  }
//}


//function is used to clear deposits div fields
//function Depdivclear() {
//  window.document.frmTrans.txtDOpAmt.value = ""
//  window.document.frmTrans.txtDCurrAmt.value = ""
//  window.document.frmTrans.txtDMatAmt.value = ""
//  window.document.frmTrans.txtDCustId.value = ""
//  window.document.frmTrans.txtDOpDate.value = ""
//  window.document.frmTrans.txtDEffDt.value = ""
//  window.document.frmTrans.txtDMatDt.value = ""
//  window.document.frmTrans.txtDOpBy.value = ""
//  window.document.frmTrans.txtDROI.value = ""
//  window.document.frmTrans.txtDOpInstr.value = ""
//  window.document.frmTrans.txtDIntAcc.value = ""
//  window.document.frmTrans.txtDPaidupto.value = ""
//}

//function GETDRCRLIENYN1(str) {
//  var kStr = str.split("|")
//  // kStr[0] -- Allow YN
//  // kStr[1] -- Debit Credit Lien YN
//  // kStr[2] -- Amount
//  if (kStr[1] == "Y") {
//    if (window.document.frmTrans.tranmode(0).checked == true) {
//      alert("This A/c is marked for debit Lien Rs :" + kStr[2])
//    }
//    else if (window.document.frmTrans.tranmode(1).checked == true) {
//      alert("This A/c is marked for Credit Lien")
//    }
//  }
//  Check206AA206AB()
//}

////This function is used to display deposit account details like current amount,maturity amount
//function Deppopaccnodetails() {
//  //alert("dep")
//  window.document.frmTrans.txtDOpAmt.value = balstr[1]
//  precision(window.document.frmTrans.txtDOpAmt, window.document.frmTrans.hpr.value)
//  window.document.frmTrans.txtDCurrAmt.value = balstr[0]
//  precision(window.document.frmTrans.txtDCurrAmt, window.document.frmTrans.hpr.value)
//  window.document.frmTrans.txtDMatAmt.value = balstr[2]
//  deprendiffamt = eval(window.document.frmTrans.txtDMatAmt.value) -
//    eval(window.document.frmTrans.txtDOpAmt.value)
//  precision(window.document.frmTrans.txtDMatAmt, window.document.frmTrans.hpr.value)
//  window.document.frmTrans.txtDCustId.value = balstr[3]
//  window.document.frmTrans.txtDOpDate.value = balstr[4]
//  window.document.frmTrans.txtDEffDt.value = balstr[5]
//  window.document.frmTrans.txtDMatDt.value = balstr[6]
//  window.document.frmTrans.txtDOpBy.value = balstr[7]
//  window.document.frmTrans.txtDROI.value = balstr[8]
//  window.document.frmTrans.txtDOpInstr.value = balstr[9]
//  window.document.frmTrans.txtDIntAcc.value = balstr[10]
//  precision(window.document.frmTrans.txtDIntAcc, window.document.frmTrans.hpr.value)
//  window.document.frmTrans.txtDPaidupto.value = balstr[11]
//  window.document.frmTrans.txtDpendbal.value = balstr[12]
//  precision(window.document.frmTrans.txtDpendbal, window.document.frmTrans.hpr.value)
//  var strValues = balstr[3]
//  window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "msgcnt.aspx?strVal=" + strValues
//}

// This function is used to populate different service IDs and descriptions.
// Making visible true or false based on service id selected.
//function ServiceCode(kstr) {
//  var strSer
//  strSer = kstr.split("-----")
//  window.document.frmTrans.txtServiceId.value = strSer[1]
//  window.document.frmTrans.txtServiceName.value = strSer[0]
//  ServiceIdDivs()
//}

// This function was written to send parameters values to List form to get various modules and it displays modules only when Mfgpaydt(flexgrid) rows <2 or if the mode is MODIFY.

//function cmdOkClick() {

//  var strValues
//  var brCode
//  blnFlagAutoClose = false
//  blnBatchLoancheck = false

//  //this code added by vinod for close loans where 0 balance in accounts

//  if ((window.document.frmTrans.tranmode[1].checked == true) &&
//    (window.document.frmTrans.txtModId.value == "LOAN")) {

//    if (CashDenom == 'Y') {
//      window.document.frmTrans.hdnMod.value = window.document.frmTrans.txtModId.value
//    }

//    if (Math.abs(window.document.frmTrans.txtloanaccbal.value) == Math.abs(window.document.frmTrans.txtAmt.value)) {
//      blnBatchLoancheck = true
//      blnCloseLoan = true
//      window.document.frmTrans.hdnblnCloseLoan.value = ""
//      window.document.frmTrans.hdnblnCloseLoan.value = "true1"
//      var result = confirm("Do you Want to Close This Loan");
//      if (result == true) {
//        var resultConfirm = confirm("Are you Sure Want to Close This Loan");
//        {
//          if (resultConfirm == true) {
//            blnFlagAutoClose = true
//            //blnCloseLoan=true
//            window.document.frames['iPost'].frmPost.hdnCloseLoan.value = window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtbranchcode.value

//            /*if((window.document.frmTrans.txtIntPendAmt.value=="")||eval((window.document.frmTrans.txtIntPendAmt.value==0)))
//            {
//              blnBatchLoanClose=false
//            }
//            else
//            {*/
//            if (!((window.document.frmTrans.txtNPAIntAmt.value == "") || eval(window.document.frmTrans.txtNPAIntAmt.value == 0))) {
//              blnNpaInt = true
//              npaIntYN = "Y"
//              if ((Math.abs(window.document.frmTrans.txtloanaccbal.value) == Math.abs(window.document.frmTrans.txtAmt.value)) || (parseFloat(window.document.frmTrans.txtAmt.value) > parseFloat(window.document.frmTrans.txtNPAIntAmt.value))) {
//                alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount Adjusted to Loan")
//              }
//              if (parseFloat(window.document.frmTrans.txtAmt.value) <= parseFloat(window.document.frmTrans.txtNPAIntAmt.value)) {
//                alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount " + window.document.frmTrans.txtAmt.value + " Adjusted to Loan")
//              }
//            }
//            blnBatchLoanClose = true
//            //alert("hi")
//            closeLoanAuto()
//            //}
//          }
//          else {
//            window.document.frames['iPost'].frmPost.hdnCloseLoan.value = ""
//            blnFlagAutoClose = false
//            blnBatchLoanClose = false
//            closeLoanAuto()
//          }
//        }
//      }
//      else {
//        window.document.frames['iPost'].frmPost.hdnCloseLoan.value = ""
//        blnFlagAutoClose = false
//        blnBatchLoanClose = false
//        closeLoanAuto()
//      }
//    }
//    else if (Math.abs(window.document.frmTrans.txtAmt.value) > Math.abs(window.document.frmTrans.txtloanaccbal.value)) {
//      var resultConfirm = confirm("Entered Amt Is Crossing A/c Bal , Do You Want To Continue ?");
//      {
//        if (resultConfirm == true) {
//        }
//        else {
//          return
//        }

//      }
//    }
//    else {
//      if (!((window.document.frmTrans.txtNPAIntAmt.value == "") || eval(window.document.frmTrans.txtNPAIntAmt.value == 0))) {
//        blnNpaInt = true
//        npaIntYN = "Y"
//        if ((Math.abs(window.document.frmTrans.txtloanaccbal.value) == Math.abs(window.document.frmTrans.txtAmt.value)) || (parseFloat(window.document.frmTrans.txtAmt.value) > parseFloat(window.document.frmTrans.txtNPAIntAmt.value))) {
//          alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount Adjusted to Loan")
//        }
//        if (parseFloat(window.document.frmTrans.txtAmt.value) <= parseFloat(window.document.frmTrans.txtNPAIntAmt.value)) {
//          alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount " + window.document.frmTrans.txtAmt.value + " Adjusted to Loan")
//        }
//        blnBatchLoanClose = false
//        closeLoanAuto()
//      }
//    }
//  }

//  //this code added by vinod for close loans where 0 balance in accounts ended here


//  if (vSubMode == "TPAY" || vSubMode == "TREC") {

//    exceptionCodes()
//    if (excpYN == "Y" && "<%=TellerVerifyReqYN%>" == "N") {
//      alert("Exceptional Transactions are not allowed")
//      Cancel()
//      return
//    }
//  }
//  if (window.document.frmTrans.chkABB.checked == false) {
//    brCode = window.document.frmTrans.txtbranchcode.value
//  }
//  else {
//    brCode = "ABB"
//  }
//  var batchNo = ""
//  if (((vMode == "REC") || (vMode == "PAY")) && (window.document.frmTrans.Mfgpaydt.Rows > 1) && (mode != "MODIFY")) {


//    if (window.document.frmTrans.chkDispAccNo.checked == true) {
//      //alert("Reddy2")
//    }
//    else {
//      alert("Only one Cash Transaction allowed at a time." + "\n" +
//        "Post already entered data.")
//      return
//    }
//  }
//  TranMode();
//  modId = window.document.frmTrans.txtModId.value
//  serId = window.document.frmTrans.txtServiceId.value

//  checkNulls(modId, trnMode, serId)
//  if (chkNull == "false") {
//    return
//  }
//  if (OkValidations() == false) {
//    return
//  }
//  excpTranCheck()
//  //new code added by radhika on 25 nov 2008
//  MinBalCheck_modify()
//  //end of new code
//  TotTranNos()
//  var clgModId, clgGlCd2
//  clgModId = window.document.frmTrans.txtCLGModId.value.toUpperCase();
//  clgGlCd2 = window.document.frmTrans.txtCLGGLcode.value.toUpperCase();
//  var overdraft2
//  overdraft2 = "<%=ovrdrft%>"
//  //-----------------------------ClearingBatch No Generation------------------
//  if (window.document.frmTrans.tranmode[2].checked == true) {
//    //-------- for clearing , serviceid ==8, clearbal < 0
//    if (window.document.frmTrans.txtServiceId.value == "8") {
//      if (overdraft2 == "N") {
//        if ((clgModId == "CC") || (clgModId == "LOAN") || (clgModId == "INV") || ((clgModId == "MISC") && (clgGlCd2.substr(0, 3) == "204"))) {
//        }
//        else {
//          if (window.document.frmTrans.txtretclearbal.value < 0) {
//            alert("Clearing Balance Is Less Than Zero , No Transaction Is Posted")
//            window.document.frmTrans.txtAmt.value = "0.00"
//            return;
//          }
//        } //((clgModId=="CC") || (clgModId=="LOAN") || (clgModId=="INV") || ((clgModId=="MISC") && (clgGlCd2.substr(0,3)=="204")))
//      }
//      else {
//      }//(overdraft2 == 'N')
//    } //(window.document.frmTrans.txtServiceId.value == "8")

//    sCurCode = window.document.frmTrans.txtcurrencycode.value
//    sClear = window.document.frmTrans.cmdcleartype.value
//    sAppDate = "<%=session("applicationdate")%>";

//    if (mode != "MODIFY") {
//      if (window.document.frmTrans.Mfgpaydt.Rows == 1) {
//        if (clgAbbimpyn == "Y") {
//          strValues = "CLG~*~" + "<%=session("branchcode")%>" + "~" + batchNo + "~" + "" + "~" + sCurCode + "~" + sClear + "~" + sAppDate + "~" + tranNos + "~" + "ABB"
//        }
//        else {
//          strValues = "CLG~*~" + brCode + "~" + batchNo + "~" + "" + "~" + sCurCode + "~" + sClear + "~" + sAppDate + "~" + tranNos + "~" + "<%=session("branchcode")%>"
//        }
//        //alert(" mahendr = "+strValues)

//      }
//      else if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
//        batchNo = window.document.frmTrans.Mfgpaydt.TextMatrix(1, 0)

//        if (clgAbbimpyn == "Y") {
//          strValues = "CLG~*~" + "<%=session("branchcode")%>" + "~" + batchNo + "~" + "" + "~" + sCurCode + "~" + sClear + "~" + sAppDate + "~" + tranNos + "~" + "ABB"
//        }
//        else {
//          strValues = "CLG~*~" + brCode + "~" + batchNo + "~" + "" + "~" + sCurCode + "~" + sClear + "~" + sAppDate + "~" + tranNos + "~" + "<%=session("branchcode")%>"
//        }
//        //alert(" reddy = "+strValues)
//      }
//    }
//    else if (mode == "MODIFY") {
//      batchNo = window.document.frmTrans.hdnBatchNo.value
//      tranNo = window.document.frmTrans.hdnTranNo.value
//      if (vMode == "TRANS") {
//        bNo = batchNo + "~" + tranNo
//        FlexPopulate(bNo)
//        return
//      }
//    }
//  }

//  //-----------------------------Genaral Batch No genration

//  if ((window.document.frmTrans.tranmode[0].checked == true) ||
//    (window.document.frmTrans.tranmode[1].checked == true))

//    if (mode != "MODIFY") {

//      if (window.document.frmTrans.Mfgpaydt.Rows == 1) {

//        if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true')) {
//          if (eval(window.document.frmTrans.hdn194Nfinaltds.value) != 0) {
//            strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + 4
//          }
//          else {
//            strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
//          }
//        }
//        else {
//          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
//        }
//      }
//      else if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
//        if ((window.document.frmTrans.hdnblnCloseLoan.value == "true1") && (window.document.frmTrans.tranmode[0].checked == true)) {
//          //	alert("blnCloseLoan")
//          batchNo = window.document.frmTrans.Mfgpaydt.TextMatrix(window.document.frmTrans.Mfgpaydt.rows - 1, 0)
//          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
//        }
//        else {
//          batchNo = window.document.frmTrans.Mfgpaydt.TextMatrix(1, 0)
//          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
//        }
//      }

//    }
//    else if (mode == "MODIFY") {

//      batchNo = window.document.frmTrans.hdnBatchNo.value
//      tranNo = window.document.frmTrans.hdnTranNo.value
//      var tranNo2 = window.document.frmTrans.hdnTranNo2.value
//      var tranNo3 = window.document.frmTrans.hdnTranNo3.value
//      var tranNo4 = window.document.frmTrans.hdnTranNo4.value
//      var vModId = window.document.frmTrans.txtModId.value.toUpperCase()
//      TranMode()

//      if ((vModId == "REM") || (vModId == "FXREM")) {
//        if (trnMode == "4") {
//          /*if(eval(window.document.frmTrans.txtcomm.value)>0)
//          {
//          bNo=batchNo+"~"+tranNo+"~"+tranNo2
//          }
//          else
//          {
//          bNo=batchNo+"~"+tranNo
//          }*/

//          //New code is
//          bNo = batchNo + "~" + tranNo

//          if (eval(window.document.frmTrans.txtcomm.value) > 0)
//            bNo = bNo + "~" + tranNo2

//          if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
//            bNo = bNo + "~" + tranNo3

//          FlexPopulate(bNo)
//        }
//        else if (trnMode == "2") {
//          /*if(eval(window.document.frmTrans.txtcomm.value)>0)
//          {
//          bNo=batchNo+"~"+tranNo+"~"+tranNo2+"~"+tranNo3
//          }
//          else
//          {
//          bNo=batchNo+"~"+tranNo+"~"+tranNo2
//          }*/

//          // New Code is
//          bNo = batchNo + "~" + tranNo + "~" + tranNo2

//          if (eval(window.document.frmTrans.txtcomm.value) > 0)
//            bNo = bNo + "~" + tranNo3

//          if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
//            bNo = bNo + "~" + tranNo4

//          FlexPopulate(bNo)
//        }
//        else if (trnMode == "3") {
//          bNo = batchNo + "~" + tranNo
//          FlexPopulate(bNo)
//        }
//        else if (trnMode == "1") {
//          bNo = batchNo + "~" + tranNo + "~" + tranNo2
//          FlexPopulate(bNo)
//        }
//      }
//      else if (vMode == "TRANS") {

//        bNo = batchNo + "~" + tranNo
//        FlexPopulate(bNo)
//      }
//      else if ((vMode == "PAY") || (vMode == "REC")) {

//        bNo = batchNo + "~" + tranNo + "~" + tranNo2
//        FlexPopulate(bNo)
//      }
//      return
//    }

//  //clear denom tally
//  window.document.frames("idenomtally").denomtallyclear()
//  //----------------------------post to iframe page

//  if ((window.document.frmTrans.tranmode(1).checked == true) && (window.document.frmTrans.txtModId.value == "REM") &&
//    (window.document.frmTrans.chkRemRepeat.checked == true)) {
//    if (window.document.frmTrans.txtNoOfRepeat.value == "") {
//      alert("Please Enter Number of Repetitions.")
//      window.document.frmTrans.txtNoOfRepeat.focus()
//      return;
//    }

//    if ((vMode == "PAY") || (vMode == "REC")) {

//      var st = "GETBATCHTRANNO|" + window.document.frmTrans.txtbranchcode.value + "*" + (window.document.frmTrans.txtNoOfRepeat.value) * 2
//    }
//    else {
//      var stTnno

//      stTnno = window.document.frmTrans.txtNoOfRepeat.value
//      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
//        stTnno = eval(stTnno) + 1

//      if (eval(window.document.frmTrans.txtCessChrg.value) > 0)
//        stTnno = eval(stTnno) + 1

//      //var st="GETBATCHTRANNO|"+window.document.frmTrans.txtbranchcode.value+"*"+window.document.frmTrans.txtNoOfRepeat.value stTnno

//      var st = "GETBATCHTRANNO|" + window.document.frmTrans.txtbranchcode.value + "*" + stTnno
//    }
//    //alert(" st = "+st)
//    window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
//  }
//  else {
//    if (blnBatchLoancheck == true) {
//      //	alert("hi")
//      //	strValues="GEN~*~"+brCode+"~"+strLoanBatchNo+"~"+""+"~"+tranNos
//      //blnBatchLoanClose=false
//      //window.document.all['iGeneral'].src='<%="http://" & session("moduledir")& "/GEN/"%>'+"batchNoGen.aspx?strVal="+strValues
//    }
//    else if ((window.document.frmTrans.tranmode[0].checked == true) && (window.document.frmTrans.txtServiceId.value == 9) && ("<%=strRemCancAutoChrgsYN%>" == "Y") && ("<%=strRemCancCommYN%>" == "Y") && (vMode == "TRANS")) {
//      tranNos = 5
//      strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos
//      //alert(strValues1)
//      window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchnoGenRemCanc.aspx?strVal=" + strValues
//    }
//    else {
//      //alert("Gen")
//      //	alert("strValues " + strValues)
//      //	alert("vMode " + vMode)
//      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGen.aspx?strVal=" + strValues
//    }
//  }
//}

//----------------------------------------------------------------------------------
////This function displays various moduleids and descriptions,it also clear all lower level
////fields.And makes different divs visible true and false based on condition
//function modulecode(kstr) {

//  if (bdt.toUpperCase() == "TRUE")
//    return
//  var strMod = kstr.split("-----")
//  window.document.frmTrans.txtModId.value = strMod[1]
//  window.document.frmTrans.txtModDesc.value = strMod[0]
//  /*if(strMod[0]!="")
//  {
//    window.document.frmTrans.txtGLcode.focus()
//  }*/
//  window.document.all['divRemRep'].style.display = "none";

//  var modId = window.document.frmTrans.txtModId.value.toUpperCase()
//  masterTabYN()
//  GLClear()
//  funloanclear()

//  //make ChequeBook check box false and hide respective Division
//  window.document.frmTrans.chkCheque.checked = false;
//  Cheque();

//  // Below code will work when service id <> 8 i.e other than clearing
//  if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
//    return
//  }

//  fxTransactionYN()
//  if (window.document.frmTrans.tranmode(2).checked == true) {
//    if (modId == "REM") {
//      window.document.frmTrans.chkCheque.checked = false;
//    }
//    else {
//      window.document.frmTrans.chkCheque.checked = true;
//    }
//    Cheque()
//  }


//  if ((modId == "REM") &&
//    ((window.document.frmTrans.tranmode(0).checked == true) ||
//      (window.document.frmTrans.tranmode(2).checked == true))) {
//    divsDisplay("remdr", "M")
//    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"
//  }

//  else if ((modId == "REM") &&
//    (window.document.frmTrans.tranmode(1).checked == true)) {
//    divsDisplay("remcr", "M")
//    window.document.all.divComm.style.display = "block";
//    window.document.all['divfxRem'].style.display = "block";
//    window.document.all['divrembank'].style.display = "block";
//    window.document.all['divRemRep'].style.display = "block";

//    if ((CashDenom == 'Y') && (vMode == "REC")) {
//      window.document.frmTrans.chkRemRepeat.disabled = true
//      window.document.frmTrans.txtNoOfRepeat.disabled = true
//    }
//    else {
//      window.document.frmTrans.chkRemRepeat.disabled = false
//      window.document.frmTrans.txtNoOfRepeat.disabled = false
//    }


//  }
//  else if ((modId == "FXREM") &&
//    (window.document.frmTrans.tranmode(1).checked == true)) {
//    divsDisplay("remcr", "M")
//    window.document.all.divComm.style.display = "block";
//    window.document.all['divfxRem'].style.display = "block";
//    window.document.all['divrembank'].style.display = "none";

//  }
//  // suspence start
//  else if (modId == "SCR") {
//    divsDisplay("divaccno", "M")

//    window.document.all['divcheque'].style.display = "none";
//    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |^ Contra Date |>Contra Batch No       |>Contra Tran No       |>Appl's Name |>Cust Id      "
//  }
//  // Loan end
//  else if ((modId == "LOAN") &&
//    (window.document.frmTrans.tranmode(0).checked == true)) {

//    divsDisplay("loandtls", "M")

//    window.document.all['divaccno'].style.display = "block";
//    window.document.all.loanintdtls.style.display = "block"
//    window.document.frmTrans.selloantrans.style.display = "block";
//    funloantran()
//    funinsertloan()
//    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>                  |>             |>             |>               |>               |>             |>           "
//    window.document.frmTrans.Mfgpaydt.TextMatrix(0, 44) = "Loan Trans"
//  }
//  else if ((modId == "LOAN") &&
//    (window.document.frmTrans.tranmode(1).checked == true)) {
//    divsDisplay("loandtls", "M")

//    window.document.all['divaccno'].style.display = "block";
//    window.document.all.loanintdtls.style.display = "block"
//    funloantran()
//    funinsertloan()
//    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Interest Amount |> Charges Amount |> Insurance Amount |>NPA Amount       |>Principalamount       |>Excessamount |>Cust ID      "
//  }
//  else if (modId == "DEP") {
//    divsDisplay("divDepDtls", "M")
//    window.document.all['divaccno'].style.display = "block";
//    window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Opening Amount  |> Current Amount |> Maturity Amount |>Int Accrued       |>Opening Date       |>Effective Date |>Maturity Date  |>Int. Paid Upto |>ROI     "
//  }
//  else if (modId == "SI" && vMode != "REC") {
//    cnfrm = confirm("Do you want to Execute Standing Instructions ?")
//    if (cnfrm == true) {
//      SIGlcode()
//    }
//    else {
//      window.document.frmTrans.txtModId.value = ""
//      window.document.frmTrans.txtModDesc.value = ""
//    }
//  }
//  else {
//    //alert("trnsfer")
//    divsDisplay("trnsfer", "M")
//    window.document.frmTrans.txtpendbal.value = ""
//    window.document.all['divaccno'].style.display = "block";
//    window.document.all['divcheque'].style.display = "block";
//    if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC")) {
//      window.document.frmTrans.all.trcctod.style.display = "block"
//    }
//    else {
//      window.document.frmTrans.all.trcctod.style.display = "none"
//    }

//    if (window.document.frmTrans.txtModId.value == "CC") {
//      window.document.frmTrans.all.trcctod1.style.display = "block"
//    }
//    else {
//      window.document.frmTrans.all.trcctod1.style.display = "none"
//    }

//  }
//  ServiceIdDivs()
//  //code added by Radhika on 12 May 2008
//  //GetModDets()

//  if ((modId == "REM") &&
//    (window.document.frmTrans.tranmode(1).checked == true)) {
//    //alert("1")
//  }

//}

//--------prsremit
//function issbank() {

//  if (window.document.frmTrans.txtGLcode.value.length > 0) {
//    gl = window.document.frmTrans.txtGLcode.value.toUpperCase()

//    BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//    CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()

//    kstr = "issonbnk" + "~" + gl + "~" + BranchCd + "~" + CurCd

//    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
//      "DialogWidth:270px;DialogHeight:180px;DialogLeft:340px;DialogTop:100px")
//  }
//  //if(issonbnk==""){
//  kstr = "issonbnk";

//  //	window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>'+"TranList.aspx" + "?"+"st="+kstr,window,"status:no;"+
//  //	"DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:100px")
//  //	}

//}

////This function is used to see addtional checks
//function OkValidations() {

//  if (window.document.frmTrans.txtModId.value.toUpperCase() == "SCR") {
//    if (scrgridYN == "YES") {
//      alert("Amount should be selected from Account Details Grid")
//      if (window.document.frmTrans.chkDispAccNo.checked == false) {
//        window.document.frmTrans.txtAmt.value = ""
//      }
//      return false;
//    }
//    else if (scrgridYN == "GRIDYES") {
//      okValid = true
//      return true;
//    }
//  }
//}

//function issbrnch() {
//  TranMode()
//  // alert("trnmode="+trnMode+",  rem type="+ remtype+", issonbnk="+issonbnk)

//  BranchCd = window.document.frmTrans.txtbranchcode.value.toUpperCase()
//  CurCd = window.document.frmTrans.txtcurrencycode.value.toUpperCase()



//  if (issonbnk != "") {
//    kstr = "issonbr";
//    if ((trnMode == "4") || (trnMode == "2")) { bankCode = window.document.frmTrans.txtissbnkcode.value; }
//    else if ((trnMode == "3") || (trnMode == "1")) { bankCode = window.document.frmTrans.txtbybnkcode.value; }
//    else { bankCode = issonbnk; }

//    kstr = kstr + "~" + remtype.toUpperCase() + "~" + bankCode;

//    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
//      "DialogWidth:270px;DialogHeight:180px;DialogLeft:340px;DialogTop:100px")
//  }
//  else
//    //if ((trnMode=="4") && ( (remtype.toUpperCase()=="DD") || (remtype.toUpperCase()=="MT")|| (remtype.toUpperCase()=="TT") ))
//    if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") || (remtype.toUpperCase() == "TT")) {
//      if (trnMode == "4") { bankCode = window.document.frmTrans.txtissbnkcode.value; }
//      else if (trnMode == "3") { bankCode = window.document.frmTrans.txtbybnkcode.value; }

//      kstr = "issonothbr" + "~~" + bankCode;

//      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
//        "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:100px")
//    }
//    /*else if ((trnMode=="4") && ( (remtype.toUpperCase()=="ADD") ||
//    (remtype.toUpperCase()=="TC") ))*/
//    else if ((remtype.toUpperCase() == "ADD") || (remtype.toUpperCase() == "TC")) {

//      if (trnMode == "4") { bankCode = window.document.frmTrans.txtissbnkcode.value; }
//      else if (trnMode == "3") { bankCode = window.document.frmTrans.txtbybnkcode.value; }

//      //kstr="issonothbr"+"~ADD~"+bankCode;
//      kstr = "issonothbr" + "~" + remtype.toUpperCase() + "~" + bankCode + "~" + BranchCd + "~" + CurCd
//      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr, window, "status:no;" +
//        "DialogWidth:270px;DialogHeight:170px;DialogLeft:340px;DialogTop:100px")
//    }
//}

////Checks for cheques mandatory field values
//function Cheque() {

//  if (window.document.frmTrans.chkCheque.checked == true) {
//    //  window.document.frmTrans.txtChqDt.value=vAppDate;
//    //   window.document.frmTrans.DtpChq.value=vAppDate;
//    window.document.all['ChqDtl'].style.display = "block";
//  }

//  if (window.document.frmTrans.chkCheque.checked == false) {
//    window.document.all['ChqDtl'].style.display = "none";
//    chequeClear()
//    window.document.frmTrans.txtChqDt.value = '<%=session("Applicationdate")%>'

//    if (mode != "MODIFY") {
//      excpChqSrs = ""
//      excpChqNo = ""
//    }

//  }
//}

//function closeLoanAuto() {
//  var brcodeclln
//  brcodeclln
//  if (window.document.frmTrans.chkABB.checked == false) {
//    brcodeclln = window.document.frmTrans.txtbranchcode.value
//  }
//  else {
//    brcodeclln = "ABB"
//  }
//  var sBatch = ""
//  if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
//    sBatch = window.document.frmTrans.Mfgpaydt.textmatrix(1, 0)
//  }

//  st = "POSTINTEREST|" + brcodeclln + "|" +
//    window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtModId.value + "|" +
//    window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value + "|" +
//    window.document.frmTrans.txtAmt.value + "|" + vMode + "|" + npaIntYN + "|" + sBatch

//  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
//  return;
//}

//this function is used to clear all the field and to set default format field values to the flexgrid.
//function Cancel() {
//  window.document.frmTrans.txtbranchcode.value = "<%=session("branchcode")%>"
//  window.document.frmTrans.txtbranchdesc.value = "<%=session("branchnarration")%>"
//  formClear()
//  NatBranch()

//  window.document.frmTrans.Mfgpaydt.Rows = 1;
//  window.document.frmTrans.cmdPost.disabled = false
//  sumDrCrDefault()
//  window.document.frmTrans.txtTotDebit.value = "0";
//  window.document.frmTrans.txtTotCredit.value = "0";
//  chkboxUnCheck()
//  defaultValues()
//  if (vMode == "REC") {
//    GetCashierBalance()
//  }
//}

//function masterTabYN() {
//  if (window.document.frmTrans.txtModId.value != "") {
//    strpm = "MASTTAB" + "~" + window.document.frmTrans.txtModId.value.toUpperCase()

//    window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
//  }
//}

//// Checks wether the transaction is exceptional one or not.
//function exceptionCodes() {
//  excpCodes = ""
//  excpYN = "N"
//  if (excpMinBal != "") {
//    excpCodes = excpMinBal + "^"
//    excpYN = "Y"
//  }
//  if (excpLmtAmt != "") {
//    excpCodes = excpCodes + excpLmtAmt + "^"
//    excpYN = "Y"
//  }
//  if (excpParmAmt != "") {
//    excpCodes = excpCodes + excpParmAmt + "^"
//    excpYN = "Y"
//  }
//  excpChq = ""
//  if (excpChqSrs != "" || excpChqNo != "") {
//    excpChq = "4"
//    excpCodes = excpCodes + excpChq + "^"
//    excpYN = "Y"
//  }
//  if (excpEffDt != "") {
//    excpCodes = excpCodes + excpEffDt + "^"
//    excpYN = "Y"
//  }
//  if (excpOverDraft != "") {
//    excpCodes = excpCodes + excpOverDraft + "^"
//    excpYN = "Y"
//  }
//}

//function formClear() {
//  ModuleClear();//clear module and
//  LnkModClear();
//  ClgModClear();
//  if (mode != "MODIFY") {
//    excpIntValues();
//  }
//  Remclear();
//  funloanclear();
//  Cls();
//  clearflds()
//  ClgClear()
//  hdnFldClear()
//  Depdivclear()
//  chkboxUnCheck()
//  grid()
//  UnlockControls()
//  CashMode()
//  forexClear()
//  UnLockContAdd()
//}

//// To Check Amount should not be greater than balance amount
//function Amountcheck() {

//  var hidamt, scramt, ModId, clgGlCd2, clgModId
//  hidamt = window.document.frmTrans.hidscr.value
//  scramt = window.document.frmTrans.txtAmt.value
//  ModId = window.document.frmTrans.txtModId.value;
//  clgModId = window.document.frmTrans.txtCLGModId.value.toUpperCase();
//  clgGlCd2 = window.document.frmTrans.txtCLGGLcode.value.toUpperCase();

//  var overdraft2
//  overdraft2 = "<%=ovrdrft%>"

//  if (ModId == "SCR") {
//    if (scramt) {
//      if (((trnMode == "4") && (scrstr == "DR")) || ((trnMode == "3") && (scrstr == "CR"))
//        || ((trnMode == "1") && (scrstr == "CR")) || ((trnMode == "2") && (scrstr == "DR"))) {


//        if (eval(scramt) > eval(hidamt)) {

//          alert("Amount should not be greater than : " + hidamt)
//          window.document.frmTrans.txtAmt.value = hidamt
//        }

//      }
//    }
//  }
//  //-------- for clearing , serviceid ==8, clearbal < 0
//  if (window.document.frmTrans.tranmode[2].checked == true) {
//    if (window.document.frmTrans.txtServiceId.value == "8") {

//      if (overdraft2 == "N") {
//        if ((clgModId == "CC") || (clgModId == "LOAN") || (clgModId == "INV") || ((clgModId == "MISC") && (clgGlCd2.substr(0, 3) == "204"))) {
//        }
//        else {

//          if (window.document.frmTrans.txtretclearbal.value < 0) {
//            alert("Clearing Balance Is Less Than Zero , No Transaction Is Posted")
//            window.document.frmTrans.txtAmt.value = "0.00"
//            return;
//          }
//        } //((clgModId=="CC") || (clgModId=="LOAN") || (clgModId=="INV") || ((clgModId=="MISC") && (clgGlCd2.substr(0,3)=="204")))
//      }
//      else {
//      } //(overdraft2 == 'N')
//    } //(window.document.frmTrans.txtServiceId.value == "8")
//  } //(window.document.frmTrans.tranmode[2].checked==true)
//}

////------- Cash Debit Cash Credit ---------------------
//function cashdrcrcheck() {

//  if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC")) {
//    var resmaxamt, resmaxamt1
//    if ((eval(window.document.frmTrans.txtAmt.value) + eval(window.document.frmTrans.txttotcashcr.value)) > eval(window.document.frmTrans.hdnmaxamt.value)) {
//      resmaxamt = confirm("Total Cash Credit Is Crossing " + window.document.frmTrans.hdnmaxamt.value + " , Do You Want To Continue Y/N")
//      if (resmaxamt == true) { }
//      else {
//        window.document.frmTrans.txtAmt.value = "0.00"
//        return
//      }
//    }

//    if ((eval(window.document.frmTrans.txtAmt.value) + eval(window.document.frmTrans.txttotcashdr.value)) > eval(window.document.frmTrans.hdnmaxamt.value)) {
//      resmaxamt1 = confirm("Total Cash Debit Is Crossing " + window.document.frmTrans.hdnmaxamt.value + " , Do You Want To Continue Y/N")
//      if (resmaxamt1 == true) { }
//      else {
//        window.document.frmTrans.txtAmt.value = "0.00"
//        return
//      }
//    }
//  }
//}

//function CatCodeRtn(results) {
//  var result = results.split("-----")
//  window.document.frmTrans.txtAccCatCode.value = result[1]
//  window.document.frmTrans.txtAccCatDesc.value = result[0]
//  AmtNarrClear()
//  AccParameters(window.document.frmTrans.txtAccCatCode.value, "CATCODE")
//}

//function funinsertintdtls() {

//  {
//    if (window.document.frmTrans.txtModId.value != "LOAN") {
//      return
//    }
//  }

//  {
//    if ((window.document.frmTrans.txtModId.value == "LOAN") &&
//      (window.document.frmTrans.tranmode(0).checked == true)) {
//      return
//    }
//  }


//  var strloansplit
//  inttot = window.document.frmTrans.txtAmt.value

//  strloansplit = (window.document.frmTrans.hdloandetails.value).split("|")
//  {
//    window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = ""
//    window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = ""
//    window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = ""
//    window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = ""
//    window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = ""
//    window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = ""
//  }
//  {
//    if (window.document.frmTrans.hdloandetails.value != "0" && window.document.frmTrans.hdloandetails.value.length > 0) {
//      {

//        for (var intcnt = 1; intcnt < 7; intcnt++) {
//          {

//            if (strloansplit[0] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value < 0) {
//              {
//                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value))) {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value)
//                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value)
//                }
//                else {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = inttot
//                  inttot = eval(inttot) - eval(inttot)
//                }
//              }
//            }
//            else if (strloansplit[1] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value < 0) {
//              {
//                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value))) {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value)
//                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value)
//                }
//                else {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = inttot
//                  inttot = eval(inttot) - eval(inttot)
//                }
//              }
//            }
//            else if (strloansplit[2] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value < 0) {
//              {
//                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value))) {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value)
//                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value)
//                }
//                else {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = inttot
//                  inttot = eval(inttot) - eval(inttot)
//                }
//              }
//            }
//            else if (strloansplit[3] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value < 0) {
//              {
//                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value))) {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value)
//                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value)
//                }
//                else {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = inttot
//                  inttot = eval(inttot) - eval(inttot)
//                }
//              }
//            }
//            else if (strloansplit[4] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value < 0) {

//              {
//                if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value))) {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value)
//                  inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value)
//                }
//                else {
//                  window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = inttot
//                  inttot = eval(inttot) - eval(inttot)
//                }
//              }
//            }
//          }
//        }
//      }


//      {
//        if (eval(inttot) > 0) {
//          window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = inttot
//        }
//      }

//      {
//        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtintamt, window.document.frmTrans.hpr.value)
//        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt, window.document.frmTrans.hpr.value)
//        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt, window.document.frmTrans.hpr.value)
//        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt, window.document.frmTrans.hpr.value)
//        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt, window.document.frmTrans.hpr.value)
//        precision(window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt, window.document.frmTrans.hpr.value)

//      }

//    }
//  }

//}


//function funloantran() {
//  strpm = "loantrantype"
//  window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
//}

//function SIGlcode() {
//  lockControls()
//  strpm = "SIGLCODE" + "~" +
//    window.document.frmTrans.txtbranchcode.value.toUpperCase() + "~" +
//    window.document.frmTrans.txtModId.value.toUpperCase()

//  window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
//  //window.status="Executing Standing Instructions......"

//}


//function ClearTranFields() {
//  window.document.frmTrans.txtModId.value = "";
//  window.document.frmTrans.txtModDesc.value = "";

//  modulecode(window.document.frmTrans.txtModDesc.value + '-----' +
//    window.document.frmTrans.txtModId.value.toUpperCase() + '-----')

//  window.document.frmTrans.txtChqNo.value = ""
//  window.document.frmTrans.txtChqDt.value = ""
//  window.document.frmTrans.txtChqFVG.value = ""

//}

////function to get cash balance of current user
//function GetCashierBalance() {
//  var strpm = "";
//  strBrCode = window.document.frmTrans.txtbranchcode.value
//  strCurCode = window.document.frmTrans.txtcurrencycode.value
//  if ((strBrCode.length > 0) && (strCurCode.length > 0)) {
//    strBrCode = "<%=session("branchcode")%>"
//    strpm = "BALANCEATCASHIER" + "~" + strBrCode + "~" + strCurCode + "~" + vUserId
//    // strpm="BALANCEATCASHIER"+"~"+session("branchcode")+"~"+strCurCode+"~"+vUserId
//    //alert(strpm)
//    window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
//  }
//}


///start of weekly limit amount


//function ValAmount() {

//  var stDayimpYN, stWeekimpYN, stForm


//  stWeekimpYN = "<%=impYnWek%>"
//  stDayimpYN = "<%=impYnDay%>"

//  if ((stWeekimpYN == "Y") && (vMode == "PAY")) {
//    if ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA") || (window.document.frmTrans.txtModId.value == "CC") || (window.document.frmTrans.txtModId.value == "DEP") || (window.document.frmTrans.txtModId.value == "LOAN")) {
//      var kstr = "";
//      vDayCashProced = "true"

//      var strAppDt = "<%=session("applicationdate")%>"
//      /// module"~"glcode"~"accno"~"amount"~"branchcode"~"applicationdate"~"CashpaidYN
//      strpm = "STWEKLMT" + "~" + window.document.frmTrans.txtModId.value + "~" + window.document.frmTrans.txtGLcode.value + "~" + window.document.frmTrans.txtAccNo.value + "~" + window.document.frmTrans.txtAmt.value + "~" + window.document.frmTrans.txtbranchcode.value + "~" + strAppDt + "~" + "N"

//      window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm

//    }
//  }
//}

//function PopWeekpay(sWeekpay) {
//  var stPay, stTotweek, stWeekVal


//  stTotweek = "0"

//  stWeekVal = "<%=WekLmt%>"

//  if (sWeekpay != "No Amount") {
//    stPay = sWeekpay.split("|")

//    for (aCnt = 0; aCnt <= stPay.length - 1; aCnt++) {

//      stTotweek = eval(stTotweek) + eval(stPay[aCnt])

//    }

//    if (stTotweek > stWeekVal) {
//      stTotweek = stTotweek + eval(window.document.frmTrans.txtAmt.value)

//      if (eval(stTotweek) > eval(stWeekVal)) {
//        if (confirm("This customer has crossed Rs." + stWeekVal + "/- cash payment for the week. Do You Want continue Y/N?") == true) {
//          if (confirm("Are You Sure") == true) {
//            //showdat()
//          }
//          else {
//            window.document.frmTrans.txtAmt.value = ""
//            return;
//          }
//        }
//        else {
//          window.document.frmTrans.txtAmt.value = ""
//          return;
//        }
//      }
//      else {
//        //showdat()
//      }
//    }

//    if (stTotweek <= stWeekVal) {

//      stTotweek = stTotweek + eval(window.document.frmTrans.txtAmt.value)

//      if (eval(stTotweek) > eval(stWeekVal)) {
//        if (confirm("This customer has crossing Rs." + stWeekVal + "/- cash payment for the week. Do You Want continue Y/N?") == true) {
//          if (confirm("Are You Sure") == true) {
//            //showdat()
//          }
//          else {
//            window.document.frmTrans.txtAmt.value = ""
//            return;
//          }
//        }
//        else {
//          window.document.frmTrans.txtAmt.value = ""
//          return;
//        }
//      }
//      else {
//        //ChkDayLmt()
//        //showdat()
//      }
//    }
//    /*else
//    {
//        ChkDayLmt()
//    }
//    */
//  }
//}

/// end of weekly amount--


//function RDInstalmentCheck() {
//  //alert("hi 1 " + window.document.frmTrans.txtUnClrBal.value)
//  //alert("hi 2 " + window.document.frmTrans.txtAmt.value)
//  if (window.document.frmTrans.txtModId.value == "DEP" &&
//    window.document.frmTrans.txtServiceId.value == "1" &&
//    window.document.frmTrans.tranmode(1).checked == true) {

//    if (eval(window.document.frmTrans.txtAmt.value) % eval(window.document.frmTrans.txtUnClrBal.value) != 0) {
//      alert("Credit Amount Should Be In Multipuls Of Instalment Amount(" + window.document.frmTrans.txtUnClrBal.value + ") For RD")
//      window.document.frmTrans.txtAmt.value = 0
//      precision(window.document.frmTrans.txtAmt, window.document.frmTrans.hpr.value)
//    }
//    else {
//      RDAmountCheck()
//    }

//  }

//}

//function RDAmountCheck() {
//  if (window.document.frmTrans.txtModId.value == "DEP" &&
//    window.document.frmTrans.txtServiceId.value == "1" &&
//    window.document.frmTrans.tranmode(1).checked == true) {
//    if (eval(window.document.frmTrans.txtAmt.value) > 0) {
//      st = "GETRDAMOUNTCHECK|" + window.document.frmTrans.txtbranchcode.value + "|" +
//        window.document.frmTrans.txtcurrencycode.value + "|" + window.document.frmTrans.txtModId.value + "|" +
//        window.document.frmTrans.txtGLcode.value + "|" + window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtAmt.value

//      window.document.all['iGetDtls'].src = "getDtls1.aspx?st=" + st
//    }
//  }
//}


//function popGETRDAMOUNTCHECK(str) {
//  //alert(str)
//  var strResult10
//  if (str == "GREATER") {
//    strResult10 = confirm("Application Date Greater Than Maturity Date  Do you want to Continue? ")

//    if (confrm == true) {
//    }
//    else {
//      return
//    }
//  }
//  else if (str == "NO") {
//    alert("Current Amount Crossed Max Installment Amount")
//    window.document.frmTrans.txtAmt.value = "0"
//    return
//  }
//}

//function TotTranNos() {
//  TranMode()
//  if ((window.document.frmTrans.txtModId.value == "REM") ||
//    (window.document.frmTrans.txtModId.value == "FXREM")) {
//    if (trnMode == "4") {
//      /*if(eval(window.document.frmTrans.txtcomm.value)>0)
//      {
//      tranNos="2"
//      }
//      else
//      {
//      tranNos="1"
//      }*/

//      //new code is
//      tranNos = 1

//      if (eval(window.document.frmTrans.txtcomm.value) > 0)
//        tranNos = tranNos + 1

//      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
//        tranNos = tranNos + 2

//      if (eval(window.document.frmTrans.txtCessChrg.value) > 0)
//        tranNos = tranNos + 1

//      tranNos = "" + tranNos
//    }
//    else if (trnMode == "2") {

//      //new code is
//      tranNos = 2

//      if (eval(window.document.frmTrans.txtcomm.value) > 0)
//        tranNos = tranNos + 1

//      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
//        tranNos = tranNos + 2

//      if (eval(window.document.frmTrans.txtCessChrg.value) > 0)
//        tranNos = tranNos + 1

//      tranNos = "" + tranNos
//    }
//    else if (trnMode == "3") {
//      tranNos = "1"
//    }
//    else if (trnMode == "1") {
//      tranNos = "2"
//    }
//    return
//  }

//  if (vMode == "TRANS") {
//    tranNos = "1"
//  }
//  else if (vMode == "PAY") {
//    tranNos = "2"
//  }
//  else if (vMode == "REC") {
//    tranNos = "2"
//  }

//}


////code added by Radhika on 12 May 2008
////Desc: To select CheckBook Check box, when modules are CC,CA,SB in Debit Tran mode
//function GetModDets() {
//  var kstr = "";

//  if (eval(window.document.frmTrans.txtServiceId.value != "1")) {
//    return;
//  }
//  //if(vMode=="TRANS"){
//  if (window.document.frmTrans.tranmode(0).checked != true)
//    return;

//  if ((window.document.frmTrans.txtModId.value.toUpperCase() != 'SB') &&
//    (window.document.frmTrans.txtModId.value.toUpperCase() != 'CA') &&
//    (window.document.frmTrans.txtModId.value.toUpperCase() != 'CC')) {
//    return;
//  }

//  kstr = "CHQYESNO" + "~";
//  kstr = kstr + window.document.frmTrans.txtModId.value + "~~~";
//  kstr = kstr + window.document.frmTrans.txtcurrencycode.value + "~";
//  kstr = kstr + window.document.frmTrans.txtbranchcode.value + "~~~";
//  //alert(kstr)
//  window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genParameters.aspx?strparam=" + kstr

//}

//function MinBalCheck() {
//  if ((window.document.frmTrans.tranmode(0).checked == true) && (window.document.frmTrans.txtServiceId.value == "4") && ((window.document.frmTrans.txtModId.value == "SB") || (window.document.frmTrans.txtModId.value == "CA"))) {

//    if (window.document.frmTrans.txtAmt.value <= 0) {
//      return
//    }

//    if (eval(window.document.frmTrans.txtNetBal.value) == eval(window.document.frmTrans.txtAmt.value)) {
//      conMsg = "Do You Want To close The A/C"
//      confm = confirm(conMsg)
//      if (confm == true) {
//      }
//      else {
//        window.document.frmTrans.txtAmt.value = ""
//      }
//    }
//    else {
//      alert("Entered Amount Should Be Equal To A/c Bal")
//      window.document.frmTrans.txtAmt.value = ""
//      return
//    }
//  }
//  else {
//    var overdraft
//    overdraft = "<%=ovrdrft%>"
//    var strOlimpyn = "<%=Olimpyn%>";

//    var modId = window.document.frmTrans.txtModId.value
//    var clBal, wdAmt, Balance, confm, conMsg, LmtAmt, AvbAmt, minAmt
//    excpMinBal = ""
//    excpOverDraft = ""
//    TranMode()

//    if (window.document.frmTrans.txtAmt.value <= 0) {
//      return
//    }
//    if ((vMode == "REC") || (vSubMode == "TPAY")) {
//      RecPayLmtChk()
//    }
//    if ((trnMode != "1") && (trnMode != "3") && (trnMode != "5")) {
//      return
//    }
//    if (modId != "SB" && modId != "CA" && modId != "CC" && modId != "DEP" && modId != "LOAN") {
//      return
//    }
//    wdAmt = window.document.frmTrans.txtAmt.value;

//    if (modId == "SB" || modId == "CA") {
//      clBal = window.document.frmTrans.txtClrBal.value;
//      Balance = clBal - wdAmt;
//      minAmt = pMinAmt

//      if (eval(Balance) < 0) {
//        if (overdraft == 'N') {
//          alert("Amount Is Greater Than Current Balance")
//          window.document.frmTrans.txtAmt.value = ""
//          window.document.frmTrans.txtAmt.focus()
//          return
//        }
//        conMsg = "Amount less than Minimum Balance and also Creating " +
//          "OverDraft. Do You want to continue ?"
//      }
//      else {
//        conMsg = "Amount less than Minimum Balance. Do You want to continue ?"
//      }
//    }
//    else if (modId == "DEP") {
//      Balance = window.document.frmTrans.txtDCurrAmt.value;
//      minAmt = wdAmt;
//      conMsg = "Amount Greater than Current Balance. Do You want to continue ?"
//    }
//    else if (modId == "CC") {
//      clBal = window.document.frmTrans.txtClrBal.value;
//      //LmtAmt=window.document.frmTrans.txtLmtAmt.value;  //txttodlimit  txtavalimit
//      LmtAmt = eval(window.document.frmTrans.txtLmtAmt.value) + eval(window.document.frmTrans.txttodlimit.value);  //txttodlimit
//      if (eval(clBal) < 0) {
//        Balance = eval(LmtAmt) - eval(Math.abs(clBal))
//      }
//      else if (eval(clBal) > 0) {
//        Balance = eval(LmtAmt) + eval(clBal)
//      }
//      else {
//        Balance = eval(LmtAmt)
//      }
//      if (window.document.frmTrans.hidCCDrYN.value == "Y") {
//        //alert("hidCCDrYN")
//        minAmt = eval(wdAmt) + eval(window.document.frmTrans.hidCCDrAmt.value);
//      }
//      else if (window.document.frmTrans.hidCCCrYN.value == "Y") {
//        minAmt = eval(wdAmt) + eval(window.document.frmTrans.hidCCCrAmt.value);
//      }
//      else {
//        minAmt = wdAmt;
//      }

//      if ("<%=Olimpyn%>" == "Y") {
//        conMsg = "Amount Greater than Limit Amount. Do You want to continue ?"
//      }
//      else {
//        conMsg = "Amount Greater than Limit Amount"
//      }
//    }
//    else if (modId == "LOAN") {
//      if (window.document.frmTrans.selloantrans.value == "Principle") {
//        Balance = window.document.frmTrans.txtloanavailbal.value;
//        minAmt = wdAmt;
//        conMsg = "Amount Greater than Available Amount. Do You want to continue ?"
//      }
//      else {
//        return
//      }
//    }

//    if ((modId == "SB" || modId == "CA") && eval(Balance) < 0) {
//      confm = confirm(conMsg)
//      confm = confirm(conMsg)
//      if (confm == true) {
//        excpOverDraft = "6"
//        excpMinBal = "1"
//      }
//      else {
//        excpMinBal = ""
//        excpOverDraft = ""
//        window.document.frmTrans.txtAmt.value = ""
//      }
//      return;
//    } //end of Overdraft & min bal check for SB/CA modules

//    if (eval(Balance) < eval(minAmt)) {

//      if ("<%=Olimpyn%>" == "Y") {
//        confm = confirm(conMsg)
//        if (confm == true) {
//          excpMinBal = "1"
//        }
//        else {
//          excpMinBal = ""
//          excpOverDraft = ""
//          window.document.frmTrans.txtAmt.value = ""
//        }
//      }
//      else {
//        alert(conMsg)
//        excpMinBal = ""
//        excpOverDraft = ""
//        window.document.frmTrans.txtAmt.value = ""
//      }

//    }
//  }

//}

//function MinBalCheck_modify() {

//  var modId = window.document.frmTrans.txtModId.value
//  var clBal, wdAmt, Balance, confm, conMsg, LmtAmt, AvbAmt, minAmt
//  excpMinBal = ""
//  excpOverDraft = ""

//  if ((vMode == "REC") || (vSubMode == "TPAY")) {
//    RecPayLmtChk()
//  }
//  if ((trnMode != "1") && (trnMode != "3")) {
//    return
//  }
//  if (modId != "SB" && modId != "CA" && modId != "CC" && modId != "DEP" && modId != "LOAN") {
//    return
//  }

//  wdAmt = window.document.frmTrans.txtAmt.value;

//  if (modId == "SB" || modId == "CA") {
//    clBal = window.document.frmTrans.txtClrBal.value;
//    Balance = clBal - wdAmt;
//    minAmt = pMinAmt
//  }
//  else if (modId == "DEP") {
//    Balance = window.document.frmTrans.txtDCurrAmt.value;
//    minAmt = wdAmt;
//  }
//  else if (modId == "CC") {
//    clBal = window.document.frmTrans.txtClrBal.value;
//    LmtAmt = window.document.frmTrans.txtLmtAmt.value;
//    if (clBal < 0) {
//      Balance = LmtAmt - Math.abs(clBal)
//    }
//    else {
//      Balance = LmtAmt
//    }
//    minAmt = wdAmt;
//  }
//  else if (modId == "LOAN") {
//    if (window.document.frmTrans.selloantrans.value == "principle") {
//      Balance = window.document.frmTrans.txtloanavailbal.value;
//      minAmt = wdAmt;
//    }
//    else { return }
//  }

//  if ((modId == "SB" || modId == "CA") && eval(Balance) < 0) {
//    excpOverDraft = "6"
//    excpMinBal = "1"
//    return;
//  }

//  if (eval(Balance) < eval(minAmt)) {
//    excpMinBal = "1"
//  }

//}//end of  MinBalCheck_modify() method


//Function for validating deposit details
//function AccOpening() {

//  var Amt, MultVal
//  if ((window.document.frmTrans.txtbranchcode.value == "") ||
//    (window.document.frmTrans.txtcurrencycode.value == "") ||
//    (window.document.frmTrans.txtModId.value == "") ||
//    (window.document.frmTrans.txtGLcode.value == "") ||
//    (window.document.frmTrans.txtAccCatCode.value == "") ||
//    (eval(window.document.frmTrans.txtAmt.value) == 0)) {
//    return
//  }

//  if (window.document.frmTrans.txtServiceId.value == "2") {
//    if (eval(window.document.frmTrans.txtAmt.value) < eval(pMinAmt)) {
//      alert("Minmum Amount to Open this type of Account is " + pMinAmt)
//      window.document.frmTrans.txtAmt.value = ""
//    }
//    else if (eval(window.document.frmTrans.txtAmt.value) > eval(pMaxAmt)) {
//      alert("Maximum Amount to Open this type of Account is " + pMaxAmt)
//      window.document.frmTrans.txtAmt.value = ""
//    }


//    if (window.document.frmTrans.txtModId.value.toUpperCase() == "DEP") {

//      if (eval(pMultplesOf) != "0") {
//        MultVal = (eval(window.document.frmTrans.txtAmt.value) % (eval(pMultplesOf)))
//        if (MultVal > 0) {
//          alert("Deposit Amount should be Multiples of " + pMultplesOf)
//          window.document.frmTrans.txtAmt.value = ""
//          return
//        }
//      }
//      if (pDUnitsYN == "Y") {
//        Amt = eval(window.document.frmTrans.txtAmt.value)
//        if (eval(window.document.frmTrans.txtAmt.value) % eval(pDUnitVal) != 0) {
//          alert("Deposit Amount should be multiples of Unit Value.\n" + "\n" +
//            "                     Unit Value is  : " + pDUnitVal)
//          window.document.frmTrans.txtAmt.value = ""
//          window.document.frmTrans.txtAmt.focus()
//        }
//      }
//    }

//    else if (window.document.frmTrans.txtServiceId.value == "4") {
//      if (window.document.frmTrans.txtModId.value.toUpperCase() == "DEP") {
//        if (eval(window.document.frmTrans.txtAmt.value) >
//          eval(window.document.frmTrans.txtDMatAmt.value)) {
//          alert("Closing amount should not be greaterthan Maturity Amount")
//          window.document.frmTrans.txtAmt.value = ""
//        }

//      }
//    }
//  }

//}

//function OkClear() {

//  ModuleClear();//clear module and
//  LnkModClear()
//  hdnFldClear()
//  Cls();
//  defaultValues();
//  forexClear()
//  if ((window.document.frmTrans.chkDispAccNo.checked == false) &&
//    (window.document.frmTrans.chkABB.checked == false)) {
//    chkboxUnCheck();
//  }

//  if (mode != "MODIFY") {
//    excpIntValues();
//  }
//  Remclear();
//  if (mode != "MODIFY") {
//    funloanclear();
//  } ServiceId

//  if (window.document.frmTrans.tranmode(2).checked == true) {
//    ClgModClear()
//    clearflds()
//  }
//  //ClgClear()

//  Depdivclear()

//  if (window.document.frmTrans.chkDispAccNo.checked == true) {
//    dispUncheck()
//  }
//  dispGridRemove()

//  if ((window.document.frmTrans.chkDispAccNo.checked == true) &&
//    (window.document.frmTrans.mfgDisp.Rows == 1)) {
//    UnlockControls()
//  }
//}

//Assigning precision when  form is loading.

//function amtPrec() {
//  precform(window.document.frmTrans.txtAmt)
//  precision(window.document.frmTrans.txtAmt, eval(window.document.frmTrans.hpr.value))
//}


//function masterTabRtn(strMstTab) {
//  mstTab = "YES"
//  if ((strMstTab == "N") || (window.document.frmTrans.txtServiceId.value == 2)) {
//    window.document.all['divaccno'].style.display = "none";
//    mstTab = "NO"
//  }
//  else {
//    window.document.all['divaccno'].style.display = "block";
//    mstTab = "YES"
//  }
//}

//function excpTranCheck() {
//  if (mode == "MODIFY") {
//    excptionAmt()
//  }
//  //alert(Amt)
//  //alert(excpAmt)
//  //for Parameter Amount
//  if (Math.abs(eval(Amt)) > eval(excpAmt)) {
//    excpParmAmt = "3"
//    //         excpYN="Y"
//  }
//  else {
//    excpParmAmt = ""
//  }
//  //for Application Date
//  var applDt = "<%=vAppdate%>"
//  if (window.document.frmTrans.txtEffDate.value == applDt) {
//    excpEffDt = ""
//  }
//  else {
//    excpEffDt = "5"
//    //      excpYN="Y"
//  }

//}

//function excptionAmt() {
//  TranMode()

//  strpm = "EXCPAMT" + "~" + window.document.frmTrans.txtcurrencycode.value + "~" +
//    window.document.frmTrans.txtModId.value + "~" +
//    window.document.frmTrans.txtGLcode.value + "~" + trnMode
//  window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
//}

//function TDSDetails() {

//  if (window.document.frmTrans.txtbranchcode.value == "") {
//    alert("Enter Branchcode")
//    return
//  }

//  if (window.document.frmTrans.txtcurrencycode.value == "") {
//    alert("Enter currency code")
//    return
//  }

//  if (window.document.frmTrans.txtModId.value == "") {
//    alert("Enter Glcode ")
//    return
//  }

//  if (window.document.frmTrans.txtGLcode.value == "") {
//    alert("Enter Glcode ")
//    return
//  }
//  if (window.document.frmTrans.txtAccNo.value == "") {
//    alert("Enter Accno ")
//    return
//  }
//  var st = "TDSDetails~" + window.document.frmTrans.txtbranchcode.value + "~" +
//    window.document.frmTrans.txtcurrencycode.value + "~" +
//    window.document.frmTrans.txtGLcode.value + "~" +
//    window.document.frmTrans.txtAccNo.value + "~" +
//    window.document.frmTrans.txtModId.value + "~" + "<%=vAppdate%>" + "~" + window.document.frmTrans.txtAmt.value

//  window.showModalDialog("TDSDetails.aspx" + "?" + "st=" + st, window, "status:no;dialogWidth:500px;dialogHeight:350px");


//}

//function Check194N() {
//  window.document.frmTrans.hdnchk194N.value = 'false'
//  if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY')) {

//    if (eval(window.document.frmTrans.txtAmt.value) != 0) {
//      if ((window.document.frmTrans.tranmode(0).checked == true) && ((window.document.frmTrans.txtModId.value == 'SB') || (window.document.frmTrans.txtModId.value == 'CA') || (window.document.frmTrans.txtModId.value == 'CC') || (window.document.frmTrans.txtModId.value == 'LOAN'))) {
//        var st = "Check194N|" + window.document.frmTrans.txtbranchcode.value + "|" +
//          window.document.frmTrans.txtcurrencycode.value + "|" +
//          window.document.frmTrans.txtGLcode.value + "|" +
//          window.document.frmTrans.txtAccNo.value + "|" +
//          window.document.frmTrans.txtModId.value + "|" + "<%=vAppdate%>" + "|" + window.document.frmTrans.txtAmt.value
//        //alert(st)
//        window.document.all['iGetDtls1'].src = "getDtls1.aspx?st=" + st
//      }
//    } // txtAmt
//  }	//"<%=str194NYN%>" == 'Y'
//}

//function Get194Ndtls(str) {
//  var kStr = str.split("|")
//  // kStr[0] -- balance
//  // kStr[1] -- final tds

//  var dblbalance
//  dblbalance = 0
//  var dblcummamt
//  dblcummamt = 0
//  var dblfinaltds
//  dblfinaltds = 0
//  var dbltransamt
//  var dblFrmAmt
//  dblFrmAmt = ""
//  var dblFrmAmt1
//  dblFrmAmt1 = 0
//  dbltransamt = 0
//  var dbltdsrate
//  dbltdsrate = 0
//  var strMesssage
//  strMesssage = ''

//  if (kStr[0] == "No Panno") {
//    alert("No Panno For This Accno")
//    window.document.frmTrans.txtAmt.value = ""
//    window.document.frmTrans.txtTokenNo.focus()
//    return
//  }

//  Clear194NhdnFields()
//  dblbalance = kStr[0]
//  dblfinaltds = kStr[1]
//  window.document.frmTrans.hdn194Nfinaltds.value = kStr[1]
//  if (eval(dblfinaltds) == 0) {
//    return
//  }
//  dbltransamt = eval(window.document.frmTrans.txtAmt.value) + eval(kStr[1])

//  if (eval(kStr[2]) < 0)
//    dblFrmAmt1 = 0
//  else
//    dblFrmAmt1 = kStr[2]

//  dblFrmAmt = amtInWords(dblFrmAmt1)

//  //	dblFrmAmt= kStr[2]
//  dbltdsrate = kStr[3]
//  window.document.frmTrans.hid194NCrossAmt.value = dblFrmAmt1
//  window.document.frmTrans.hid194TDSRate.value = kStr[3]
//  dblcummamt = eval(window.document.frmTrans.txtAmt.value) + eval(Math.abs(kStr[4]))
//  window.document.frmTrans.hdn194NFromDate.value = kStr[5]
//  window.document.frmTrans.hdn194NToDate.value = kStr[6]
//  window.document.frmTrans.hid194NAssesyear.value = kStr[7]
//  window.document.frmTrans.hid194Npanno.value = kStr[8]
//  window.document.frmTrans.hid194NAmtPaid.value = kStr[9]
//  window.document.frmTrans.hidPAN206AAYN.value = kStr[10]
//  window.document.frmTrans.hidPAN206ABYN.value = kStr[11]

//  var strCummMessage
//  strCummMessage = ''
//  if (eval(dblcummamt) > 10000000) {
//    strCummMessage = dblcummamt
//  }
//  else {
//    //strCummMessage = window.document.frmTrans.txtAmt.value
//    strCummMessage = dblcummamt
//  }

//  if (eval(dblbalance) < eval(dbltransamt)) {
//    strMesssage = ' Total Cash Payment is Crossing Rs. ' + dblFrmAmt + '/-  TDS @' + dbltdsrate + '%  on ' + strCummMessage + '/-,  TDSAmt = ' + dblfinaltds + '/- is applicable and Account balance is not sufficient.  Transaction will be not allowed.'
//    alert(strMesssage)
//    window.document.frmTrans.txtAmt.value = ""
//  }
//  else {
//    strMesssage = ' Total Cash Payment is Crossing Rs. ' + dblFrmAmt + '/-  TDS @' + dbltdsrate + '%  on ' + strCummMessage + '/-,  TDSAmt = ' + dblfinaltds + '/- is applicable . Do you want to continue Y/N?  '
//    var result = confirm(strMesssage)
//    if (result == true) {
//      var result1 = confirm("Are you sure do you want to continue Y/N?")
//      if (result1 == true) {
//        window.document.frmTrans.hdnchk194N.value = 'true'
//        window.document.frmTrans.txtTokenNo.focus()
//      }
//      else {
//        window.document.frmTrans.txtAmt.value = ""
//        window.document.frmTrans.hdnchk194N.value = 'false'
//        return
//      }
//    }
//    else {
//      window.document.frmTrans.txtAmt.value = ""
//      window.document.frmTrans.hdnchk194N.value = 'false'
//      return
//    }
//  }
//}

//function CheckThreshHoldLimit() {
//  window.document.frmTrans.hdnchkthreshlmt.value = "false"
//  if ("<%=strThrLmt%>" == 'Y') {
//    // credit and sb/ca
//    if ((window.document.frmTrans.tranmode(1).checked == true) && ((window.document.frmTrans.txtModId.value == 'SB') || (window.document.frmTrans.txtModId.value == 'CA'))) {
//      var st = "CheckThreshHoldLimit|" + window.document.frmTrans.txtbranchcode.value + "|" +
//        window.document.frmTrans.txtcurrencycode.value + "|" +
//        window.document.frmTrans.txtGLcode.value + "|" +
//        window.document.frmTrans.txtAccNo.value + "|" +
//        window.document.frmTrans.txtModId.value + "|" + "<%=vAppdate%>" + "|" + window.document.frmTrans.txtAmt.value
//      //alert(st)
//      window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
//    }
//  }	//"<%=strThrLmt%>" == 'Y'
//}

//function GetThreshHoldLimit(str) {
//  window.document.frmTrans.hdnchkthreshlmt.value = "false"
//  if (str == "true") {
//    var result = confirm("Threshhold limit crossing ? Do You Want To Continue ")
//    if (result == true) {
//      window.document.frmTrans.hdnchkthreshlmt.value = "true"
//      window.document.frmTrans.txtEffDate.focus()
//    }
//    else {
//      window.document.frmTrans.txtAmt.value = "0"
//      window.document.frmTrans.txtEffDate.focus()
//    }
//  }
//  else {
//    window.document.frmTrans.hdnchkthreshlmt.value = "false"
//  }
//}


//function SetDrCrLienAmt() {
//  var strAppDate1 = "<%= session("applicationdate")%>"
//  var strModeDrCr
//  var strTransAmt
//  strTransAmt = window.document.frmTrans.txtAmt.value

//  if (eval(strTransAmt) == 0 || strTransAmt == "") {
//    return
//  }

//  var strmodid1 = window.document.frmTrans.txtModId.value.toUpperCase()

//  if ((strmodid1 == "SB") || (strmodid1 == "CA")) {
//  }
//  else {
//    return
//  }

//  if (window.document.frmTrans.tranmode(0).checked == true) {
//    strModeDrCr = "Dr"
//  }
//  else if (window.document.frmTrans.tranmode(1).checked == true) {
//    strModeDrCr = "Cr"
//  }
//  if (window.document.all.divRadClg.style.display == "block") {
//    if (window.document.frmTrans.tranmode(2).checked == true) {
//      strModeDrCr = "Dr"
//    }
//  }

//  var st = "GETDRCRLIENAMT|" + strModeDrCr + "|" + window.document.frmTrans.txtbranchcode.value + "|" +
//    window.document.frmTrans.txtcurrencycode.value + "|" + strmodid1 + "|" +
//    window.document.frmTrans.txtGLcode.value + "|" +
//    window.document.frmTrans.txtAccNo.value + "|" + window.document.frmTrans.txtAmt.value + "|" + strAppDate1

//  //alert(st)
//  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st

//}

//function GETDRCRLIENAMT1(str) {
//  var kStr = str.split("|")
//  // kStr[0] -- Allow YN
//  // kStr[1] -- Debit Credit Lien YN
//  // kStr[2] -- Amount
//  if (kStr[0] == "Y") {
//  }
//  else {

//    if (window.document.frmTrans.tranmode(0).checked == true) {
//      alert("A/C Marked Dr Lien Rs " + kStr[2] + ", Please Contact HO / Br Manager")
//    }

//    if (window.document.frmTrans.tranmode(1).checked == true) {
//      alert("A/C Marked Cr Lien , Please Contact HO / Br Manager")
//    }

//    window.document.frmTrans.txtAmt.value = ""

//  }
//}


//function amtInWords(decAmount) {
//  //var decAmount=document.getElementById("sAmount2").value;
//  var sUnits = new Array(20);
//  var sTens = new Array(8);
//  var sHundreds = new Array(6);
//  var sAmount;
//  var i, iLenAmount, iDecPart, iIntegerPart;

//  sUnits[1] = '';
//  sUnits[2] = 'One';
//  sUnits[3] = 'Two';
//  sUnits[4] = 'Three';
//  sUnits[5] = 'Four';
//  sUnits[6] = 'Five';
//  sUnits[7] = 'Six';
//  sUnits[8] = 'Seven';
//  sUnits[9] = 'Eight';
//  sUnits[10] = 'Nine';
//  sUnits[11] = 'Ten';
//  sUnits[12] = 'Eleven';
//  sUnits[13] = 'Twelve';
//  sUnits[14] = 'Thirteen';
//  sUnits[15] = 'Fourteen';
//  sUnits[16] = 'Fifteen';
//  sUnits[17] = 'Sixteen';
//  sUnits[18] = 'Seventeen';
//  sUnits[19] = 'Eighteen';
//  sUnits[20] = 'Ninteen';
//  sTens[1] = 'Twenty';
//  sTens[2] = 'Thirty';
//  sTens[3] = 'Forty';
//  sTens[4] = 'Fifty';
//  sTens[5] = 'Sixty';
//  sTens[6] = 'Seventy';
//  sTens[7] = 'Eighty';
//  sTens[8] = 'Ninety';
//  sHundreds[1] = 'Hundred';
//  sHundreds[2] = 'Thousand';
//  sHundreds[3] = 'Lakh';
//  sHundreds[4] = 'Crore';
//  sHundreds[5] = 'Arab';
//  sHundreds[6] = 'Kharab';

//  if (decAmount == 10000000000000) {
//    decAmount = 9999999999999.99;
//  }
//  if (decAmount == 0) {
//    return "";
//  }

//  iDecPart = (decAmount - Math.round(decAmount)) * 100;
//  iDecPart = Math.round(iDecPart);

//  //Because Math.round results .50,.52,.53.......98,.99 in negative values

//  if (iDecPart < 0) {
//    iDecPart = 100 + iDecPart;
//  }

//  if (iDecPart == 0) {
//    decAmount = decAmount;
//  }
//  else {
//    decAmount = Math.round(decAmount - (iDecPart / 100));
//  }

//  iLenAmount = ((String)(decAmount)).length;

//  if (iLenAmount == 1) {
//    var index = parseInt(decAmount) + 1;
//    sAmount = sUnits[index];
//  }
//  else {
//    for (i = iLenAmount; i > 0; i--) {
//      if (i == 13 || i == 12) {
//        iIntegerPart = parseInt(decAmount / 100000000000);
//        decAmount = parseInt(decAmount % 100000000000);
//        if (iIntegerPart == 0) {
//          sAmount = sAmount;
//        }
//        else {
//          if (iIntegerPart < 20) {
//            sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[6] + " ";
//          }
//          else {
//            sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[6] + " "
//          }
//        }
//      }
//      else if (i == 11 || i == 10) {
//        iIntegerPart = parseInt(decAmount / 1000000000);
//        decAmount = parseInt(decAmount % 1000000000);
//        if (iIntegerPart == 0) {
//          sAmount = sAmount;
//        }
//        else {
//          if (iIntegerPart < 20) {
//            if (sAmount == null) {
//              sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[5] + " ";
//            }
//            else {
//              sAmount = sAmount + " " + sUnits[iIntegerPart + 1] + " " + sHundreds[5] + " ";
//            }
//          }
//          else {
//            if (sAmount == null) {
//              sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[5] + " ";
//            }
//            else {
//              sAmount = sAmount + " " + sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[5] + " ";
//            }
//          }
//        }
//      }
//      else if (i == 9 || i == 8) {
//        iIntegerPart = parseInt(decAmount / 10000000);
//        decAmount = parseInt(decAmount % 10000000);
//        if (iIntegerPart == 0) {
//          sAmount = sAmount;
//        }
//        else {
//          if (iIntegerPart < 20) {
//            if (sAmount == null) {
//              sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[4] + " ";
//            }
//            else {
//              sAmount = sAmount + " " + sUnits[iIntegerPart + 1] + " " + sHundreds[4] + " ";
//            }
//          }
//          else {
//            if (sAmount == null) {
//              sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[4] + " ";
//            }
//            else {
//              sAmount = sAmount + " " + sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[4] + " ";
//            }
//          }
//        }
//      }
//      else if (i == 7 || i == 6) {
//        iIntegerPart = parseInt(decAmount / 100000);
//        decAmount = (decAmount % 100000);
//        if (iIntegerPart == 0) {
//          sAmount = sAmount;
//        }
//        else {
//          if (iIntegerPart < 20) {
//            if (sAmount == null) {
//              sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[3] + " ";
//            }
//            else {
//              sAmount = sAmount + " " + sUnits[iIntegerPart + 1] + " " + sHundreds[3] + " ";
//            }
//          }
//          else {
//            if (sAmount == null) {
//              sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[3] + " ";
//            }
//            else {
//              sAmount = sAmount + " " + sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[3] + " ";
//            }
//          }
//        }
//      }
//      else if (i == 5 || i == 4) {
//        iIntegerPart = parseInt(decAmount / 1000);
//        decAmount = (decAmount % 1000);
//        if (iIntegerPart == 0) {
//          sAmount = sAmount;
//        }
//        else {
//          if (iIntegerPart < 20) {
//            if (sAmount == null) {
//              sAmount = sUnits[iIntegerPart + 1] + " " + sHundreds[2] + " ";
//            }
//            else {
//              sAmount = sAmount + " " + sUnits[iIntegerPart + 1] + " " + sHundreds[2] + " ";
//            }
//          }
//          else {
//            if (sAmount == null) {
//              sAmount = sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[2] + " ";
//            }
//            else {
//              sAmount = sAmount + " " + sTens[parseInt(iIntegerPart / 10) - 1] + " " + sUnits[(iIntegerPart - parseInt(iIntegerPart / 10) * 10) + 1] + " " + sHundreds[2] + " ";
//            }
//          }
//        }
//      }
//      else if (i == 3) {
//        iIntegerPart = parseInt(decAmount / 100);
//        decAmount = (decAmount % 100);
//        if (iIntegerPart == 0) {
//          sAmount = sAmount;
//        }
//        else {
//          var index;
//          index = parseInt(iIntegerPart) + 1;
//          if (sAmount == null) {
//            sAmount = sUnits[index] + " " + sHundreds[1] + " ";
//          }
//          else {
//            sAmount = sAmount + " " + sUnits[index] + " " + sHundreds[1] + " ";
//          }
//        }
//      }
//      else if (i == 2) {
//        decAmount = parseInt(eval(decAmount));
//        if (decAmount < 20) {
//          var index = parseInt(decAmount) + 1;
//          if (sAmount == null) {
//            sAmount = sUnits[index];
//          }
//          else {
//            sAmount = sAmount + " " + sUnits[index];
//          }
//        }
//        else {
//          var a = parseInt(((decAmount / 10) - 1));
//          var b = (decAmount % 10) + 1;
//          if (sAmount == null) {
//            sAmount = sTens[a] + " " + sUnits[b];
//          }
//          else {
//            sAmount = sAmount + " " + sTens[a] + " " + sUnits[b];
//          }
//        }
//      }
//    }
//  }
//  if (iDecPart == 0) {
//    //sAmount = "Rs. " + sAmount;
//    sAmount = sAmount;
//  }
//  else if (sAmount == "") {
//    sAmount = "Paise ";
//  }
//  else {
//    //sAmount = "Rs. "+sAmount+" And Paise";
//    sAmount = sAmount + " And Paise";
//  }

//  if (iDecPart < 20) {
//    sAmount = sAmount + " " + sUnits[iDecPart + 1] + " ";
//  }
//  else {
//    var fi = parseInt(((iDecPart / 10) - 1));
//    var fii = parseInt((iDecPart % 10)) + 1;
//    sAmount = sAmount + " " + sTens[fi] + " " + sUnits[fii] + " ";
//  }

//  sAmount = sAmount;

//  return sAmount;

//}


