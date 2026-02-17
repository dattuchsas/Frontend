
//This function was written to send values to list form for Branch details display, and used to store already selected brach code and description for later use. 
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

















function PubVariables() {
  strSessionFld = window.document.frmTrans.txtSessionflds.value
  strsessionflds = strSessionFld.split("~");
  vUserId = strsessionflds[0]
  vAppDate = strsessionflds[1]
  vCounterNo = strsessionflds[2]
  vCashierId = strsessionflds[3]
  vBranchCode = strsessionflds[4]
  vBrNarration = strsessionflds[5]
  vCurCode = strsessionflds[6]
  vCurNarration = strsessionflds[7]
  vMachineId = strsessionflds[8]
  fxRateTypes()
}

function fxRateTypes() {
  strpm = "FXRATETYPES"
  // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
}

function ABBYesNo() {
  vAbbuser = "<%=session("abbuser")%>"

  if (vAbbuser == "Y") {
    window.document.frmTrans.txtbranchcode.readOnly = false
    window.document.frmTrans.cmdBrCode.disabled = false
    window.document.frmTrans.chkABB.disabled = false
  }
}

// This function is used to set default values to the form at the time of loading 		
function formLoad() {

  window.document.frames['iPost'].frmPost.hdnSBCAAccClose.value = "";
  mode = "ADD";
  chkNull = "true"
  TranMode()
  formClear()
  grid()
  NatBranch()
  defaultValues()
  sumDrCrDefault()
  CashMode()

  if ("<%=session("module ")%>"== "CLG")
  {
    window.document.all['divRadDebit'].style.display = "none";
    window.document.all['divRadCredit'].style.display = "none";
    window.document.all['divRadClg'].style.display = "block";
  }
}

function CashMode() {
  if (vMode == "TRANS") {
    window.document.all['divDenom'].style.display = "none";
    window.document.all['divToken'].style.display = "none";
    window.document.frmTrans.chkDenomDtls.disabled = true
    window.document.frmTrans.cmdTranDel.disabled = false

  }
  else if (vMode == "PAY") {
    window.document.all['divDenom'].style.display = "none";
    window.document.all['divToken'].style.display = "block";
    window.document.frmTrans.chkDenomDtls.disabled = true
    window.document.frmTrans.chkDispDtls.disabled = true
    window.document.frmTrans.tranmode[0].checked = true
    window.document.frmTrans.chkDispAccNo.disabled = true
    window.document.frmTrans.tranmode[1].disabled = true
    window.document.frmTrans.tranmode[2].disabled = true
    window.document.frmTrans.cmdTranDel.disabled = true
    cashGlCode()
    if (vSubMode == "TPAY") {
      window.document.all['divToken'].style.display = "none";
      RecPayLmt()
    }
  }
  else if (vMode == "REC") {
    window.document.all['divDenom'].style.display = "block";
    window.document.all['divToken'].style.display = "none";
    window.document.all['divTempTrans'].style.display = "none";
    divsDisplay("divDenom", "M")
    window.document.frmTrans.chkDispAccNo.disabled = true
    window.document.frmTrans.tranmode[0].disabled = true
    window.document.frmTrans.tranmode[2].disabled = true
    window.document.frmTrans.tranmode[1].checked = true
    window.document.frmTrans.chkCheque.disabled = true
    window.document.frmTrans.chkDispDtls.disabled = true
    window.document.frmTrans.cmdTranDel.disabled = true
    if (mode != "MODIFY") {
      window.document.frmTrans.chkDenomDtls.checked = false
      window.document.frames("idenom").DenomClear("R")
    }
    window.document.frames("idenomtally").denomtallyclear()
    cashGlCode()
    RecPayLmt()
  }
}

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

function defaultValues() {
  window.document.frmTrans.txtServiceId.value = "1"
  window.document.frmTrans.txtServiceName.value = "TRANSACTION"
  window.document.frmTrans.txtEffDate.value = vAppDate;
  window.document.frmTrans.dtpEffDate.value = vAppDate;

  vMode = "<%=strMode%>"
  vSubMode = "<%=strSubMode%>"
  pChqVldPrd = '<%=session("ChequeValidPeriod")%>'
  pChqLength = '<%=session("ChequeLength")%>'

  if (bdt.toUpperCase() == "TRUE") {
    window.document.frmTrans.txtModId.value = "INV"
    window.document.frmTrans.txtModDesc.value = "Investments"
    window.document.frmTrans.cmdModId.Enabled = false
    window.document.frmTrans.txtModId.readOnly = true
    window.document.frmTrans.txtModDesc.readOnly = true
    window.document.frmTrans.txtModId.disabled = true
    window.document.frmTrans.txtModDesc.disabled = true
  }
}

function sumDrCrDefault() {
  window.document.frmTrans.txtDiff.value = "0";
  precision(window.document.frmTrans.txtTotDebit, window.document.frmTrans.hpr.value)
  precision(window.document.frmTrans.txtTotCredit, window.document.frmTrans.hpr.value)
  precision(window.document.frmTrans.txtDiff, window.document.frmTrans.hpr.value)
  window.document.frmTrans.NoDrTrn.value = "0";
  window.document.frmTrans.NoCrTrn.value = "0";
}

function TranMode() {
  if (vMode == "TRANS") {
    if (window.document.frmTrans.tranmode(0).checked == true) {
      trnMode = "3"
      trnDesc = "Dr Transfer"
      Amt = "-" + window.document.frmTrans.txtAmt.value
      window.document.frmTrans.hidGSTval.value = window.document.frmTrans.txtGstin.value;
      window.document.frmTrans.hidCust.value = window.document.frmTrans.txtCustId.value;

      if (bdt.toUpperCase() == "TRUE") {
        window.document.frmTrans.txtModId.value = "INV"
        window.document.frmTrans.txtModDesc.value = "Investments"
        window.document.frmTrans.cmdModId.Enabled = false
        window.document.frmTrans.txtModId.readOnly = true
        window.document.frmTrans.txtModDesc.readOnly = true
        window.document.frmTrans.txtModId.disabled = true
        window.document.frmTrans.txtModDesc.disabled = true
      }
    }
    else if (window.document.frmTrans.tranmode(1).checked == true) {
      window.document.frmTrans.hidCrCustomerID.value = window.document.frmTrans.txtCustId.value;
      window.document.frmTrans.hidCrRcpName.value = window.document.frmTrans.txtAccNm.value;

      window.document.all['divPhSign'].style.display = "none";
      trnMode = "4"
      trnDesc = "Cr Transfer"
      Amt = (window.document.frmTrans.txtAmt.value)
      if (bdt.toUpperCase() == "TRUE") {

        window.document.frmTrans.txtModId.value = "INV"
        window.document.frmTrans.txtModDesc.value = "Investments"
        window.document.frmTrans.cmdModId.Enabled = false
        window.document.frmTrans.txtModId.readOnly = true
        window.document.frmTrans.txtModDesc.readOnly = true
        window.document.frmTrans.txtModId.disabled = true
        window.document.frmTrans.txtModDesc.disabled = true
      }
    }
    else if (window.document.frmTrans.tranmode(2).checked == true) {
      trnMode = "5"
      trnDesc = "Dr Clearing"
      Amt = "-" + window.document.frmTrans.txtAmt.value
    }
  }
  else if (vMode == "REC") {
    trnMode = "2"
    trnDesc = "Cr Cash"
    Amt = (window.document.frmTrans.txtAmt.value)
  }
  else if (vMode == "PAY") {
    trnMode = "1"
    trnDesc = "Dr Cash"
    Amt = (window.document.frmTrans.txtAmt.value)
    window.document.frmTrans.hid194NCustID.value = window.document.frmTrans.txtCustId.value;
  }
}

//CASH RECEIPTS
function Denom() {
  if (vMode == "REC") {
    if (CashDenom == 'Y') {
      window.document.all.divDenom.style.display = "block"
      window.document.all.divDenomtally.style.display = "none"
      window.document.frmTrans.chkDenomDtls.disabled = false;
      window.document.frmTrans.chkdenomtally.disabled = true;
    }
    else if ((CashDenom == 'N') && (cashdenomtally == 'Y')) {
      window.document.all.divDenomtally.style.display = "block"
      window.document.all.divDenom.style.display = "none"
      window.document.frmTrans.chkDenomDtls.disabled = true;
      window.document.frmTrans.chkdenomtally.disabled = false;
      window.document.frmTrans.chkdenomtally.checked = true;
    }
    else {
      window.document.all.divDenom.style.display = "none"
      window.document.all.divDenomtally.style.display = "none"
      window.document.frmTrans.chkDenomDtls.disabled = true;
      window.document.frmTrans.chkdenomtally.disabled = true;
    }

    var stBrcd = "<%=session("branchcode")%>"
    var kstr = "REC" + "~" + stBrcd + "~" + window.document.frmTrans.txtcurrencycode.value + "~" + strsessionflds[0] + "~" + window.document.frmTrans.hpr.value + "~";
    // window.document.all['idenom'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "cashDenominations.aspx?kstr=" + kstr;
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

function grid() {
  window.document.frmTrans.mfgTranslog.Clear();
  window.document.frmTrans.mfgTranslog.FormatString = ">Batch No  |>Tran No   |<GL Code        |<GL Description                   |>Acc No         |>Amount            |>Entered Time Bal |^Applicatin Date   |<Cust ID               |<Mode of Tran  |<Tran Status|>Currency Code     |<Entered By             |<Entered M/C             |<ABB Branch Code          |<Branch Desc                    |<Module ID         |<Branch Code            |>Token No   |<Remarks                           |<Disposals";
  window.document.frmTrans.mfgTranslog.Rows = 1;

  window.document.frmTrans.mfgDisp.Clear();
  window.document.frmTrans.mfgDisp.FormatString = "<Disp Module ID|<Module Description|>Disp GL Code|<GL Description|<Disp Acc Type|<Disp Acc No  |<Name                    |>Amount            |>Disp Batch No|>Disp Tran No |>Link No        |<Disp Service ID|<Service Description|>Mode of Tran|^Effective Date |<Remarks           |<Tran Status|<Branch Code   |<Currency Code |<Module ID    |Module Description|<GL Code   |<GL Description    |<Account Type  |<Acc No       |<Customer ID          |<Name               |<Service ID  |<Transaction Type |<Remittance Type   |<Cheque Series       |>Cheque No.             |^Cheque Date     |<Favouring                         |<Modify      |^From Date            |^To Date              |<Rate Type|<Rate Ref Code    |<Ref No          |<Rate            |^Ref Date             |<F Currency Code|>Foreign Amount           |<Corr Bank Code  |<Corr Branch Code|^NOSTRO Debit Date    |^NOSTRO Credit Date     |<Charge Type        |<Resp Bank Code|<Resp Section Code|< User ID           |<Machine ID         |<Verified By          |<Verified Machine   |<Approved By           |<Approved Machine   "
  window.document.frmTrans.mfgDisp.Rows = 1;
}

function NatBranch() {
  with (window.document.frmTrans) {
    if (Mfgpaydt.Rows == 1) {
      txtbranchcode.value = strsessionflds[4];
      txtbranchdesc.value = strsessionflds[5];
      txtcurrencycode.value = strsessionflds[6];
      txtcurrencydesc.value = strsessionflds[7];
    }
  }
}

//This function is used to clear all loan's related fields and divs 
function funloanclear() {
  window.document.frmTrans.txtloanaccbal.value = ""
  window.document.frmTrans.txtloanclearbal.value = ""
  window.document.frmTrans.txtloanCustId.value = ""
  window.document.frmTrans.txtloandisbamt.value = ""
  window.document.frmTrans.txtloanOpaBy.value = ""
  window.document.frmTrans.txtloansancamt.value = ""
  window.document.frmTrans.txtloanunclear.value = ""
  window.document.frmTrans.txtloanavailbal.value = ""
  window.document.frmTrans.txtLpendbal.value = ""
  window.document.frmTrans.txtIntPendAmt.value = ""
  window.document.frmTrans.txtNPAIntAmt.value = ""
  window.document.frmTrans.txtloanintsamt.value = ""
  window.document.frmTrans.txtloanpendinst.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value = ""
  window.document.frames("iloandtls").frmloaninterestdetails.txtprncexcess.value = ""
  document.getElementById("divPhSign").style.display = 'none';
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

//this function is used to uncheck all the check boxes on the form and to make 
//default div visible true and other divs visible false.
function chkboxUnCheck() {
  if ((window.document.frmTrans.tranmode(2).checked == false) && (vMode == "TRANS")) {
    //window.document.frmTrans.tranmode(0).checked=true
    window.document.frmTrans.cmdcleartype.style.display = "none";
    window.document.frmTrans.chkDispDtls.disabled = false
  }
  window.document.frmTrans.chkLnkMod.checked = false
  window.document.frmTrans.chkTransDet.checked = false
  window.document.frmTrans.chkDispDtls.checked = false
  window.document.frmTrans.chkDispAccNo.checked = false
  window.document.frmTrans.chkFRateDtls.checked = false
  // window.document.frmTrans.chkDispDtls.disabled=false

  if ((window.document.frmTrans.mfgTranslog.Rows == 1) &&
    (window.document.frmTrans.Mfgpaydt.Rows == 1)) {
    window.document.frmTrans.chkABB.checked = false
  }
  if ((window.document.frmTrans.Mfgpaydt.Rows > 1) &&
    (window.document.frmTrans.Mfgpaydt.TextMatrix(1, 45) == "")) {
    window.document.frmTrans.chkABB.checked = false
  }

  divsDisplay("trnsfer", "M")

  window.document.all['divaccno'].style.display = "block"
  window.document.all['divAccCat'].style.display = "none"
  window.document.all['divAppName'].style.display = "none"
  // chequeClear() 
  window.document.frmTrans.txtChqDt.value = '<%=session("Applicationdate")%>'

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

//----------------------------------------------------------------------------------
function UnLockContAdd() {
  window.document.frmTrans.cmdModify.disabled = false
  window.document.frmTrans.cmdDelete.disabled = false
  //   window.document.frmTrans.cmdBatDel.disabled=false
  //   window.document.frmTrans.cmdTranDel.disabled=false
  //   window.document.frmTrans.cmdCont.disabled=false
}
