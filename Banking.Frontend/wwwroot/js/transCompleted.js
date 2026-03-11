
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
