
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