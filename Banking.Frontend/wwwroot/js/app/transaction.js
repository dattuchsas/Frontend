
$(function () {

  var bdt = $("#Hidden_BDT").val();
  var vMode = $("#Hidden_Mode").val();
  var vAppDate = $("#ApplicationDate").val();
  var vCurrencyCode = $("#CurrencyCode").val();
  var vSelectedModule = $("#SelectedModule").val();

  var vUserId = $("#UserId").val();
  var vCounterNo = $("#CounterNo").val();
  var vCashierId = $("#CashierId").val();
  var vBranchCode = $("#BranchCode").val();
  var vBrNarration = $("#BranchNarration").val();
  var vCurNarration = $("#CurrencyNarration").val();
  var vMachineId = $("#MachineId").val();
  var vABBUser = $("#ABBUser").val();
  var vSubMode = $("#Hidden_SubMode").val();
  var pChqVldPrd = $("#Hidden_ChequeValidPeriod").val();
  var pChqLength = $("#Hidden_ChequeLength").val();
  var vPrecision = $("#Hidden_Precision").val();

  $("#Branch").prop('disabled', true);
  $("#GLCode").prop('readonly', true);
  $("#Clearing").hide();

  ABBYesNo();
  TransMode(vMode, bdt);
  // NatBranch();
  // DefaultValues(vAppDate, bdt);
  SumDrCrDefault();
  CashMode(vMode);
  Denom(vMode);
  OnFocus(vSelectedModule);

  // ServiceCode(vMode, mode);

  var mode = "ADD";

  $("#ServiceCode").on('change', function () {
    debugger;
    ControlOnBlur('ServiceCode');
    //ModuleList(bdt, vSelectedModule, vMode);
  });

  $("#CheckDenoms").prop('disabled', true);

  $("#Clearing").addClass('d-none');

  $("#AccountNumber").on("blur", function () {
    var vBrCode = $("#Branch").val();
    var vModuleId = $("#Module").val().toUpperCase();
    var vGLCode = $("#GLCode").val().toUpperCase();
    var vAccNo = $("#AccountNumber").val();
    var vServiceId = $("#ServiceCode").val();

    ControlOnBlur('AccountNumber');
    AccountParameters(vAccNo, 'ACCNO', vModuleId, vAppDate, vBrCode);

    BalanceDetails(vServiceId, vBrCode, vModuleId, vGLCode, vAccNo, vCurrencyCode);
    GetPendingInterest(vModuleId, vBrCode, vGLCode, vAccNo);
    JointHolderValidation(vBrCode, vAccNo, vModuleId);
    Check206AA206AB(vBrCode, vModuleId, vAccNo, vGLCode);
    SetCCDrCrLienYN(vModuleId, vBrCode, vAccNo, vAppDate, vGLCode);
    GetATMCardDetails(vServiceCode, vBrCode, vModuleId, vAccNo, vGLCode);
  });

  $("#accountNumberSearch").on('click', function () {
    var vServiceId = $("#ServiceCode").val();
    var vModuleId = $("#Module").val().toUpperCase();
    var vGLCode = st[1];
    var vBrCode = $("#Branch").val();

    AccCode(vServiceId, vModuleId, vBrCode, vGLCode, vCurrencyCode);
    JointHolderValidation(vBrCode, vAccNo, vModuleId);
    GetATMCardDetails(vServiceCode, vBrCode, vModuleId, vAccNo, vGLCode);
  });

  // Account Details();

  //var mode = "ADD";
  //var chkNull = "true";

  //if (vModule == "CLG")
  //{
  //  window.document.all['divRadDebit'].style.display = "none";
  //  window.document.all['divRadCredit'].style.display = "none";
  //  window.document.all['divRadClg'].style.display = "block";
  //}

  //$("#TransactionMode input[type='checkbox']:checked").on("change click", function () {
  //  TranMode(vMode, bdt);
  //  ModeChange(bdt);
  //});

  // window.document.frames['iPost'].frmPost.hdnSBCAAccClose.value = "";

  //if (mode != "MODIFY") {
  //  excpIntValues();
  //}

  $(".glcode").on('click', function () {
    debugger;
    GLCode();
  });

  $("#searchValue").on('blur', function () {
    debugger;
    var kstr = "TellGlaccno|" + $("#ModuleCode").val() + "|" + $("#Branch").val();

    $.ajax({
      url: '/List/ListGLQuery',
      type: 'GET',
      data: {
        searchString: kstr,
        hidsearch: $("#searchOptions option:selected").val() + "|" + $("#searchValue").val()
      },
      success: function (response) {
        debugger;
        var str = response[0].value + " - " + response[0].text;
        $('#GLCode').val(str);
        $('#GLCodeListPopup').modal('hide');
        $("#GLCodeListPopup").fadeOut();
        $('#myModal').modal('hide');
        $('.modal-backdrop').remove();
      },
      error: function (err) {
        HandleAjaxError(err);
      }
    });
  });
});

function ABBYesNo() {
  debugger;
  if ($("#ABBUser").val() == "Y") {
    $("#Branch").prop('disabled', false);
    $("#CheckABB").prop('disabled', false);
  }
}

function TransMode(vMode, bdt) {
  debugger;
  var trnMode = "", trnDesc = "", Amt;
  var selectedValue = $("input[name='TransactionMode']:checked").val();
  if (vMode == "TRANS") {
    if (selectedValue == "Debit") {
      trnMode = "3";
      trnDesc = "Dr Transfer";
      Amt = "-" + $("#Amount").val();
      $("#Hidden_GST").val($("#GSTIN").val());
      $("#Hidden_Cust").val($("#CustomerId").val());
      if (bdt.toUpperCase() == "TRUE") {
        $("#ModuleCode").val('INV');
        $("#ModuleCode").prop('disabled', true);
      }
    }
    else if (selectedValue == "Credit") {
      $("#Hidden_CustomerId").val($("#CustomerId").val());
      $("#Hidden_ReceipientName").val($("#AccountNumber").val());

      trnMode = "4";
      trnDesc = "Cr Transfer";

      Amt = $("#Amount").val();
      if (bdt.toUpperCase() == "TRUE") {
        $("#ModuleCode").val('INV');
        $("#ModuleCode").prop('disabled', true);
      }
    }
    else if (selectedValue == "Clearing") {
      trnMode = "5";
      trnDesc = "Dr Clearing";
      Amt = "-" + $("#Amount").val();
    }
  }
  else if (vMode == "REC") {
    trnMode = "2";
    trnDesc = "Cr Cash";
    Amt = $("#Amount").val();
  }
  else if (vMode == "PAY") {
    trnMode = "1";
    trnDesc = "Dr Cash";
    Amt = $("#Amount").val();

    // $("#Hidden_194NCustomerId").val($("#CustomerId").val());
    // window.document.frmTrans.hid194NCustID.value = window.document.frmTrans.txtCustId.value;
  }
}

function DefaultValues(vAppDate, bdt) {
  $("#ServiceCode").val('1');
  $("#EffectiveDate").val(vAppDate);
  if (bdt.toUpperCase() == "TRUE") {
    $("#ModuleCode").val('INV');
    $("#ModuleCode").prop('disabled', true);
  }
}

function SumDrCrDefault() {
  $("#Difference").val('0');
  // precision(window.document.frmTrans.txtTotDebit, window.document.frmTrans.hpr.value);
  // precision(window.document.frmTrans.txtTotCredit, window.document.frmTrans.hpr.value);
  // precision(window.document.frmTrans.txtDiff, window.document.frmTrans.hpr.value);
  $("#DebitTransactions").val('0');
  $("#CreditTransactions").val('0');
}

function CashMode(vMode) {
  if (vMode == "TRANS") {
    // window.document.all['divDenom'].style.display = "none";
    // window.document.all['divToken'].style.display = "none";
    $("#CheckDenoms").prop('disabled', true);

    // window.document.frmTrans.cmdTranDel.disabled = false
  }
  else if (vMode == "PAY") {
    // window.document.all['divDenom'].style.display = "none";
    // window.document.all['divToken'].style.display = "block";
    $("#CheckDenoms").prop('disabled', true);

    // window.document.frmTrans.chkDispDtls.disabled = true

    $("input[name='TransactionMode'][value='Debit']").prop('checked', true);
    $("input[name='TransactionMode'][value='Credit']").prop('disabled', true);
    $("input[name='TransactionMode'][value='Clearing']").prop('disabled', true);

    // window.document.frmTrans.chkDispAccNo.disabled = true
    // window.document.frmTrans.cmdTranDel.disabled = true

    CashGLCode();
    if (vSubMode == "TPAY") {
      // window.document.all['divToken'].style.display = "none";
      RecPayLmt();
    }
  }
  else if (vMode == "REC") {
    // window.document.all['divDenom'].style.display = "block";
    // window.document.all['divToken'].style.display = "none";
    // window.document.all['divTempTrans'].style.display = "none";
    // divsDisplay("divDenom", "M")

    $("input[name='TransactionMode'][value='Debit']").prop('disabled', true);
    $("input[name='TransactionMode'][value='Credit']").prop('disabled', true);
    $("input[name='TransactionMode'][value='Clearing']").prop('checked', true);

    // window.document.frmTrans.chkDispAccNo.disabled = true

    $("#CheckCheque").prop('disabled', true);

    // window.document.frmTrans.chkDispDtls.disabled = true

    // window.document.frmTrans.cmdTranDel.disabled = true

    if (mode != "MODIFY") {
      $("#CheckDenoms").prop('checked', false);
      // window.document.frmTrans.chkDenomDtls.checked = false
      // window.document.frames("idenom").DenomClear("R")
    }
    // window.document.frames("idenomtally").denomtallyclear();
    CashGLCode();
    RecPayLmt();
  }
}

function Denom(vMode) {
  if (vMode == "REC") {
    if (CashDenom == 'Y') {
      // window.document.all.divDenom.style.display = "block"
      // window.document.all.divDenomtally.style.display = "none"
      $("#CheckDenoms").prop('checked', false);
      $("#CheckDenomsTally").prop('checked', true);
    }
    else if ((CashDenom == 'N') && (cashdenomtally == 'Y')) {
      // window.document.all.divDenomtally.style.display = "block"
      // window.document.all.divDenom.style.display = "none"
      $("#CheckDenoms").prop('disabled', true);
      $("#CheckDenomsTally").prop('disabled', false);
      $("#CheckDenomsTally").prop('checked', true);
    }
    else {
      //window.document.all.divDenom.style.display = "none"
      //window.document.all.divDenomtally.style.display = "none"
      $("#CheckDenoms").prop('disabled', true);
      $("#CheckDenomsTally").prop('disabled', true);
    }

    var kstr = "REC" + "~" + $("#BranchCode").val() + "~" + vCurrencyCode + "~" + strsessionflds[0] + "~" + $("#Hidden_Precision").val() + "~";
    // window.document.all['idenom'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "cashDenominations.aspx?kstr=" + kstr;
  }
}

function OnFocus(vSelectedModule) {
  if (vSelectedModule.toUpperCase() == "CLG") {
    $("input[name='TransactionMode'][value='Clearing']").prop('checked', true);
    CLGDivCrDr();
  }
}

function ControlOnBlur(txtName) { // , vUserid, vModuleCode, vGLCode, vAccNo, vCurrencyCode, vBrCode) {
  var strVal = "", strWhr = "";
  debugger;

  var vBranchCode = $("#Branch").val();
  var vModuleCode = $("#ModuleCode").val().toUpperCase();
  var vGLCode = $("#GLCode").val().split("-")[0];
  var vAccNo = $("#AccountNumber").val();
  var vServiceCode = $("#ServiceCode").val();

  if ($("#" + txtName + "").val() == "") {
    return;
  }
  if (txtName == "Branch") {
    if (vUserid != "" && vBrCode != "") {
      strVal = "COMP" + "~!~" + "txtbranchdesc" + "~!~" + vBrCode + "~!~" + vUserid;
    }
    var aBrCode = $("#BranchCode").val();
    if ((vBrCode.toUpperCase() != aBrCode.toUpperCase())) { // && (window.document.frmTrans.Mfgpaydt.Rows == 1)) {
      $("#CheckABB").prop('checked', true);
      // window.document.frmTrans.chkDispAccNo.disabled = true
    }
    else if ((vBrCode.toUpperCase() == aBrCode.toUpperCase())) {  // && (window.document.frmTrans.Mfgpaydt.Rows == 1)) {
      $("#CheckABB").prop('checked', false);
      // window.document.frmTrans.chkDispAccNo.disabled = true
    }
    AbbApplDtBr()
  }
  else if (txtName == "AccountNumber") {
    if (vBranchCode != "" && vModuleCode != "" && vGLCode.trim() != "" && vAccNo != "") {
      strVal = "COMP" + "~!~" + "txtAccNm" + "~!~" + vBranchCode + "~!~" + vModuleCode + "~!~" + vGLCode + "~!~" + vAccNo;
      if (vModuleCode == 'SCR')
        strVal = strVal + "~!~" + vCurrencyCode;
    }
    if (vModuleCode == "SCR") {
      SuspenseDetails(st[1], vModuleCode, vBranchCode, vMode);
    }
    // Checking for ChequeBookYN
    if (vModuleCode == "SB" || vModuleCode == "CA" || vModuleCode == "CC") {
      GetAccountDetails(vModuleCode, vBranchCode, st[2]);
    }
  }
  else if (txtName == "ServiceCode") {
    strWhr = "upper(code)='" + $("#ServiceCode").val().toUpperCase() + "'";
    strVal = "GEN" + "~!~" + "txtServiceName" + "~!~" + "GENSERVICETYPESPMT" + "~!~" + "narration" + "~!~" + strWhr;
    ServiceIdDivs();
  }

  if (strVal != "") {
    strVal = txtName + "~!~" + strVal;
    var ins = strVal.split("~!~");
    debugger;
    $.ajax({
      url: '/List/GenOnBlur?searchString=' + encodeURIComponent(strVal),
      type: 'GET',
      success: function (response) {
        debugger;
        GetOnBlur(response, ins[4]);
      },
      error: function (err) {
        HandleAjaxError(err);
      }
    });

    //$.ajax({
    //  url: '/List/GenOnBlur?searchString=' + encodeURIComponent(strVal),
    //  type: 'GET',
    //  success: function (data) {
    //    debugger;
    //    alert(data);
    //    //  var dropdown = $('#ServiceCode');
    //    //  dropdown.empty();
    //    //  dropdown.append('<option value="">Select</option>');

    //    //  $.each(data, function (i, item) {
    //    //    dropdown.append('<option value="' + item.value + '">' + item.text + '</option>');
    //    //  });
    //  },
    //  error: function (err) {
    //    HandleAjaxError(err);
    //  }
    //});

    // window.document.all['iGeneral'].src = "http://GEN/genonblur.aspx?strParam=" + strVal;
  }

  //  else if (txtName == "txtcurrencycode") {
  //    strWhr = "upper(currencycode)='" + window.document.frmTrans.txtcurrencycode.value.toUpperCase() + "'"
  //    strVal = "GEN" + "~!~" + "txtcurrencydesc" + "~!~" + "GENCURRENCYTYPEMST" + "~!~" + "narration" + "~!~" + strWhr
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
  //  //------
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


  //  //------
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
}

function ModuleList(bdt, selectedModule, vMode) {

  var transMode = $("#TransactionMode:checked").val();

  if (bdt.toUpperCase() == "TRUE")
    return;

  if ((selectedModule == "CLG") && (transMode == "Clearing")) {
    //if ((window.document.frmTrans.cmdcleartype.value == "Select") || (window.document.frmTrans.cmdcleartype.value == "")) {
    //    bankingAlert("Please select Clearing Type.")
    //    window.document.frmTrans.cmdcleartype.focus()
    //    return;
    //}
  }

  if (((vMode == "REC") || (vMode == "PAY")) && (mode != "MODIFY")) { //&& (window.document.frmTrans.Mfgpaydt.Rows > 1)) {
    bankingAlert("Only one Cash Transaction allowed at a time." + "\n" + "Post already entered data.")
    return;
  }

  if (($("#Branch").val() == "") || ($("#CurrencyCode").val() == "")) {
    return;
  }

  if (eval($("#ServiceCode").val()) == "2") {

    if (transMode != "Clearing") {
      $("#CheckCheque").prop('checked', false);
    }

    var kstr = "TellerModuleId|" + $("#Branch").val().toUpperCase() + "|" + $("#ServiceCode").val();

    debugger;

    $.ajax({
      url: '/List/GetModuleIdList?searchString=' + encodeURIComponent(kstr),
      type: 'GET',
      success: function (data) {
        debugger;
        BindDropdown($('#ModuleCode'), response);
      },
      error: function (err) {
        HandleAjaxError(err);
      }
    });

    // window.showModalDialog('<%="http://" & session("moduledir")& "/DEPOSITS/"%>' + "List.aspx" + "?" + "st=" + kstr)
  }
  else {
    var st = "TellerModule|" + $("#Branch").val()?.toUpperCase() || "";
    if (transMode != "Clearing") {
      $("#CheckCheque").prop('checked', false);
    }

    $.ajax({
      url: '/List/GetModuleIdList?searchString=' + encodeURIComponent(st),
      type: 'GET',
      success: function (response) {
        debugger;
        BindDropdown($('#ModuleCode'), response);
      },
      error: function (err) {
        debugger;
        bankingAlert(err);
      }
    });

    // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
  }
}

function GetOnBlur(strdt, pmodid) {
  var txtName = strdt.split("~|");

  if ((txtName[2] == "C") || (txtName[2] == "T") || (txtName[2] == "J") || (txtName[2] == "F")) {
    // var pmodid = '<%=insstr(4)%>';
    if ((pmodid == "SB") || (pmodid == "CA") || (pmodid == "CC") || (pmodid == "LOAN") || (pmodid == "DEP")) {
      var statusdes, statusdesc1;
      if (txtName[2] == "C") {
        statusdesc = "Closed";
      }
      else if (txtName[2] == "T") {
        statusdesc = "Inoperative";
      }
      else if (txtName[2] == "J") {
        statusdesc = "Rejected";
      }
      else if (txtName[2] == "F") {
        statusdesc = "Frozen";
      }
      statusdesc1 = "Acc No Is " + statusdesc;
      alert(statusdesc1);
      window.parent.window.document.frmTrans.item(txtName[0]).value = "";
      window.parent.window.document.frmTrans.item(txtName[1]).value = "";
      return;
    }
  }
  if (txtName[2] == "P") {
    alert("Master Approval Is Pending");
    window.parent.window.document.frmTrans.item(txtName[0]).value = "";
    window.parent.window.document.frmTrans.item(txtName[1]).value = "";
    return;
  }
  if (txtName[2] != "NoRecords") {
    if (txtName[0] == "txtModId")
      window.parent.window.document.frmTrans.txtModDesc.value = txtName[2];
    else
      window.parent.window.document.frmTrans.item(txtName[1]).value = txtName[2];
  }
  else {
    alert("No Records Found");
    window.parent.window.document.frmTrans.item(txtName[0]).value = "";
    window.parent.window.document.frmTrans.item(txtName[1]).value = "";
  }
  ReturnedBack(txtName[0]);
}

function ReturnedBack(str) {
  if (str == "txtGLcode") {
    if (window.document.frmTrans.tranmode[2].checked == true) {
      if (window.document.frmTrans.txtModId.value == "REM") {
        window.document.frmTrans.txtinstrno.focus();
      }
    }
    else {
      if (window.document.frmTrans.txtModId.value == "REM") {
        if (window.document.frmTrans.txtGLDesc.value != "") {
          window.document.frmTrans.txtAmt.focus();
          window.document.frmTrans.txtAmt.value = "0.00";
          window.document.frmTrans.txtAmt.select();
        }
      }
      else {
        if (window.document.frmTrans.txtGLDesc.value != "") {
          window.document.frmTrans.txtAccNo.focus();
        }
      }
    }
  }
  else if (str == "txtAccNo") {
    if (window.document.frmTrans.txtAccNm.value != "") {
      window.document.frmTrans.txtAmt.focus();
      window.document.frmTrans.txtAmt.value = "0.00";
      window.document.frmTrans.txtAmt.select();
    }
  }
}

function GLCode() {
  if ($("#Branch").val() == "") {
    bankingAlert("Please select Branch");
    return;
  }
  if ($("#ServiceCode").val() == "") {
    bankingAlert("Please select Service id.");
    return;
  }
  if ($("#ModuleCode").val() == null || $("#ModuleCode").val() == "") {
    bankingAlert("Please select Module Id.");
    return;
  }

  var kstr = "TellGlaccno|" + $("#ModuleCode").val() + "|" + $("#Branch").val();

  LoadGLCodeDropdown(kstr);

  // window.showModalDialog("../gensbca/ListGlQuery.aspx?st=" + kstr)
}

function LoadGLCodeDropdown(kstr) {
  if (kstr.substring(0, 11) == "TellGlaccno" || kstr.substring(0, 11) == "chargesaccno" || kstr.substring(0, 11) == "CreTellGlno") {
    $("#searchOptions").empty();
    $("#searchOptions").append('<option value="name" selected>GL Name</option>');
    $("#searchOptions").append('<option value="num">GL Number</option>');
  }
  if (kstr.substring(0, 11) == "Telleraccno" || kstr.substring(0, 11) == "LnkCreAccno" || kstr.substring(0, 11) == "TelLockAcno") {
    $("#searchOptions").empty();
    $("#searchOptions").append('<option value="name" selected>Acc. Name</option>');
    $("#searchOptions").append('<option value="num">Acc. Number</option>');
  }
  if (kstr.substring(0, 11) == "batchnumber") {
    $("#searchOptions").empty();
    $("#searchOptions").append('<option value="bnumber" selected>Batch Number</option>');
    $("#searchOptions").append('<option value="tnumber">Tran Number</option>');
    $("#searchOptions").append('<option value="narr">Narration</option>');
  }
  $("#GLCodeListPopup").modal('show');
}

function AccCode(vServiceId, vModuleId, vBrCode, vGLCode, vCUrrencyCode) {
  var stacc = "";
  if (vServiceId == "3" || vServiceId == "4") {
    if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
      alert("Post or Cancel already entered data...")
      return
    }
    if (vModuleId.toUpperCase() == "SB" || vModuleId.toUpperCase() == "CA")
      stacc = "Telleraccno";
    else
      stacc = "DepRenCloseAccno";
  }
  else
    stacc = "Telleraccno";

  if ((vBrCode.length > 0) && (vGLCode.length > 0) && (vModuleId.length > 0) && (vCUrrencyCode.length > 0)) {
    var kstr = stacc + "|" + vBrCode + "|" + vModuleId + "|" + vGLCode + "|" + vCUrrencyCode + "|" + vServiceId;
    $.ajax({
      url: '/List/GetTransList',
      type: 'GET',
      data: {
        searchString: kstr
      },
      success: function (response) {
        debugger;
        alert(response);
        // BindDropdown($('#ModuleCode'), response);
      },
      error: function (err) {
        debugger;
        HandleAjaxError(err);
      }
    });
  }
}

function JointHolderValidation(vBrCode, vAccNo, vModuleId) {
  if ($(TransactionMode).val() == "Debit") {
    var st = "GETJOINTHOLDER|" + vBrCode + "|INR|" + st[1] + "|" + vAccNo + "|" + vModuleId;
    $.ajax({
      url: '/GetDetails/GetDetails',
      type: 'GET',
      data: {
        searchString: st
      },
      success: function (response) {
        debugger;
        alert(response);
        // BindDropdown($('#ModuleCode'), response);
      },
      error: function (err) {
        debugger;
        HandleAjaxError(err);
      }
    });
    // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
  }
}

function GetATMCardDetails(vServiceCode, vBrCode, vModuleId, vAccNo, vGLCode) {
  if ($("#TransactionMode:checked").val() == "Debit") {
    if (vServiceCode == 4) {
      var strmodid1 = vModuleId.toUpperCase()
      if ((strmodid1 == "SB") || (strmodid1 == "CA")) {
        var st = "ATMCardDet|" + vBrCode.toUpperCase() + "|" + vGLCode.toUpperCase() + "|" + vAccNo
        // window.document.all['iGetDtls'].src = "../GENSBCA/GetAccDetails.aspx?st=" + st
      }
    }
  }
}

function SuspenseDetails(GLCode, vModuleId, vBranchCode, vMode) {
  debugger;
  var catdtls = "";
  if ((vMode == "TRANS") || (vMode == "PAY")) {
    if ((vModuleId == "SCR") && (GLCode != "") && (vBranchCode != "")) {
      catdtls = "SUSPENCE~!~" + vModuleId + "~!~" + GLCode + "~!~" + vBranchCode;

      $.ajax({
        url: '/GetDetails/GetQueryDisplay',
        type: 'GET',
        data: {
          searchString: catdtls
        },
        success: function (response) {
          debugger;
          SuspenceCallback(response);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });
    }
  }
  else if (vMode == "REC") {
    catdtls = "SUSPENCE~!~" + vModuleId + "~!~" + GLCode + "~!~" + vBranchCode;

    $.ajax({
      url: '/GetDetails/GetQueryDisplay',
      type: 'GET',
      data: {
        searchString: catdtls
      },
      success: function (response) {
        debugger;
        SuspenceCallback(response);
      },
      error: function (err) {
        HandleAjaxError(err);
      }
    });
  }
}

// Code added by Radhika on 12 May 2008 - Desc: To select CheckBook Check box, when accounts of modules CC,CA,SB in Debit Tran mode
function GetAccountDetails(vModuleId, vBranchCode, vAccountNumber) {
  debugger;

  if (eval($("#ServiceCode").val() != "1")) {
    return;
  }
  if ($("#TransactionMode input[type='checkbox']:checked").val() != "Debit")
    return;

  if (vModuleId.toUpperCase() != 'SB' && vModuleId.toUpperCase() != 'CA' && vModuleId.toUpperCase() != 'CC') {
    return;
  }

  var kstr = "CHQACCYESNO" + "~" + vModuleId + "~" + st[1] + "~~" + "INR" + "~" + vBranchCode + "~~~" + vAccountNumber + "~";
  // window.document.all['getAccDet'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genParameters.aspx?strparam=" + kstr
}

function SuspenceCallback(kstr) {
  var catdtls;
  var scrAmt = "";
  var strDisp = "";
  var prec = $("#Hidden_Precision").val();

  var Brcode = $("#Branch").val();
  var GlCd = $("#GLCode").val().split(" - ")[0];
  var Accno = $("#AccountNumber").val();

  // window.document.frmTrans.hidscr.value = "";

  TransMode(vMode, bdt);

  if (ModId == "SCR") {
    if (window.document.frmTrans.chkDispAccNo.checked == true) {
      strDisp = "Disposals";
      scrAmt = window.document.frmTrans.txtAmt.value;
    }

    if (((kstr == "DR") && (trnMode == "4")) || ((kstr == "DR") && (trnMode == "2"))) {
      catdtls = GlCd + "~!~" + prec + "~!~" + Brcode + "~!~" + Curr + "~!~" + Accno + "~!~" + strDisp + "~!~" + scrAmt;
      scrgridYN = "YES";

      // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "scrflex.aspx" + "?" + "catdtls=" + catdtls)
      $.ajax({
        url: '/GetDetails/GetSCRFlex',
        type: 'GET',
        data: {
          searchString: catdtls
        },
        success: function (response) {
          debugger;
          alert(response);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });
      return;
    }
    else if (((kstr == "CR") && (trnMode == "3")) || ((kstr == "CR") && (trnMode == "1"))) {
      catdtls = GlCd + "~!~" + prec + "~!~" + Brcode + "~!~" + Curr + "~!~" + Accno + "~!~" + strDisp + "~!~" + scrAmt
      scrgridYN = "YES"

      // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "scrflex.aspx" + "?" + "catdtls=" + catdtls);
      $.ajax({
        url: '/GetDetails/GetSCRFlex',
        type: 'GET',
        data: {
          searchString: catdtls
        },
        success: function (response) {
          debugger;
          alert(response);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });
      return;
    }
  }
}









































































/****************** Callback Functions ********************/


























// function for displaying the div "DIVDrCr" tag if service id is '5' - i.e inward clearing
function CLGDivCrDr() {
  // grid()
  if ($("input[name='TransactionMode'][value='Clearing']").prop('checked', true)) {
    ////deleting the rows if previous trnsactions are there which is other than inward clg
    //if ((window.document.frmTrans.Mfgpaydt.Rows > 1) && (mode != "MODIFY")) {
    //  var stralert = confirm("Are You Sure To Delete the transaction")
    //  if (stralert == true) {
    //    DelTran();
    //    Cancel();
    //  }
    //}

    //if (clgAbbimpyn == "Y") {
    //  $("#CheckABB").prop('checked', true);
    //  $("#CheckABB").prop('disabled', true);
    //}
    //else {
    //  $("#CheckABB").prop('checked', false);
    //  $("#CheckABB").prop('disabled', false);
    //}
    //window.document.all['divPhSign'].style.display = "none";
    //window.document.all['divPayeeDtls'].style.display = "block";
    //window.document.frmTrans.tranmode[2].checked = true
    //window.document.all.divCrDr.style.display = "none"
    //window.document.frmTrans.cmdcleartype.style.display = "block";
    //window.document.frmTrans.chkCheque.checked = true
    //window.document.frmTrans.chkCheque.disabled = true
    //window.document.frmTrans.tranmode[0].disabled = true
    //window.document.frmTrans.tranmode[1].disabled = true
    //window.document.frmTrans.chkLnkMod.disabled = true
    //window.document.frmTrans.chkLnkMod.checked = false
    //window.document.frmTrans.chkDispDtls.disabled = true

    //window.document.frmTrans.txtPayeeBank.value = ""
    //window.document.frmTrans.txtPayBnkDesc.value = ""
    //window.document.frmTrans.txtPayeeBranch.value = ""
    //window.document.frmTrans.txtPayBrDesc.value = ""
    //window.document.frmTrans.txtMICRCode.value = ""

    //Cheque();
    var strpm = "CLGTypes" + "~" + $("#Branch").val() + "~INR";
    //window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
  else {
    //  window.document.all.divCrDr.style.display = "block"
    //  window.document.frmTrans.chkCheque.disabled = false
    //  window.document.frmTrans.chkCheque.checked = false
    //  window.document.frmTrans.cmdcleartype.style.display = "none";
    //  window.document.frmTrans.tranmode[0].disabled = false
    //  window.document.frmTrans.tranmode[1].disabled = false
    //  window.document.frmTrans.tranmode[0].checked = true
    //  Cheque()
    //  window.document.frmTrans.cmdModId.disabled = false
    //  window.document.frmTrans.cmdGLCode.disabled = false
    //  window.document.frmTrans.cmdAccno.disabled = false
    //  window.document.frmTrans.chkDispDtls.disabled = false
  }
}

function CashGLCode() {
  if (window.document.frmTrans.txtbranchcode.value.length > 0) {
    var strpm = "CASHGL" + "~" + $("#Branch").val();
    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function RecPayLmt() {
  with (window.document.frmTrans) {
    var strpm = "RPLMT" + "~" + $("#Branch").val() + "~" + vCurrencyCode + "~" + strsessionflds[0];
    // window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

//function PubVariables() {
//  // <%=vUserid & "~" & vAppdate & "~" & vCounterno & "~" & vCashierid & "~" & vBranchCode & "~" & vBrnarration & "~" & vCurCode & "~" & vCurnarration & "~" & vMachineId & "~"%>
//  var strSessionFld = window.document.frmTrans.txtSessionflds.value
//  var strsessionflds = strSessionFld.split("~");
//  vUserId = strsessionflds[0];
//  vAppDate = strsessionflds[1];
//  vCounterNo = strsessionflds[2];
//  vCashierId = strsessionflds[3];
//  vBranchCode = strsessionflds[4];
//  vBrNarration = strsessionflds[5];
//  vCurCode = strsessionflds[6];
//  vCurNarration = strsessionflds[7];
//  vMachineId = strsessionflds[8];
//  fxRateTypes();
//}

// This function is used to send parameters to List form to display various Glcodes avialabe. It displays Glcodes based on branchcode and module id.  

function ModeChange(bdt) {
  if (bdt.toUpperCase() == "TRUE")
    return;
  // ModuleClear();
  // Remclear();
  // funloanclear();
  // Cls();
  // window.document.frmTrans.cmdModId.disabled = false
}

// Cash Debit Cash Credit
function CategoryCode() {
  // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx?st=catcode" + kstr)
}

function ServiceIdDivs() {
  // For clearing outward returns
  //  window.document.frmTrans.cmdModId.disabled = false
  //  byBranch.innerHTML = "Issued by Branch"
  //  byBank.innerHTML = "Issued by Bank"

  if (eval($("#ServiceCode").val()) == "8") {
    debugger;
    //  CLGClearDiv();
    //  paramAcc();
  }
  else if (eval($("#ServiceCode").val()) == "9") {
    debugger;
    // window.document.frmTrans.cmdModId.disabled = true
    // $("#ModeuleCode").val('REM');
    // ControlOnBlur('ModuleCode');
    // divsDisplay("remdr", "M");
    // window.document.all.divaccno.style.display = "none"
    // byBranch.innerHTML = "Issued on Branch"
    // byBank.innerHTML = "Issued on Bank"
    /*window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"*/

    // RemCanc for DD and BC		
    // window.document.all['iGetDtls'].src = "../GEN/getDtls.aspx?st=" + "REMCANCCHARGES";
  }
  else if (eval($("#ServiceCode").val()) != "2" && $("#ModuleCode").val() != "SCR") {
    debugger;
    //window.document.all.divaccno.style.display = "block"
    //window.document.all['divAppName'].style.display = "none";
    //window.document.all['divAccCat'].style.display = "none"
  }
  else if (eval($("#ServiceCode").val()) == "2") {
    debugger;
    //window.document.all['divaccno'].style.display = "none";
    //window.document.all['divAppName'].style.display = "block";
    //window.document.all['divAccCat'].style.display = "block"
    //DepDivClear();
  }
}

function DepDivClear() {
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
}

//function NatBranch() {
//  with (window.document.frmTrans) {
//    if (Mfgpaydt.Rows == 1) {
//      txtbranchcode.value = strsessionflds[4];
//      txtbranchdesc.value = strsessionflds[5];
//      txtcurrencycode.value = strsessionflds[6];
//      txtcurrencydesc.value = strsessionflds[7];
//    }
//  }
//}

function AccountParameters(AccNoOrCatCode, AccOrCat, vModuleId, vAppDate, vBrCode, vCurrencyCode, vGLCode) {
  debugger;

  var strPrm = "";
  if (vModuleId != "SB" && vModuleId != "CA" && vModuleId != "DEP" && vModuleId != "LOAN" && vModuleId != "CC")
    return;
  if ((vBrCode == "") || (vCurrencyCode == "") || (vAppDate == "") || (vModuleId == "") || (strsessionflds[8] == "") ||
    (vGLCode == "") || (strsessionflds[0] == "") || (AccNoOrCatCode == "")) {
    return;
  }
  strPrm = "ACCOUNT" + "~" + vModuleId + "~" + vGLCode + "~" + vAppDate + "~" + vCurrencyCode + "~" + vBrCode + "~" + strsessionflds[0] + "~" + strsessionflds[8] + "~" + AccNoOrCatCode + "~" + AccOrCat;
  // window.document.all['iPrm'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genparameters.aspx?strparam=" + strPrm
}

function BalanceDetails(vServiceId, vBrCode, vModuleId, vGLCode, vAccNo, vCurrencyCode) {
  if (eval(vServiceId != "8")) {
    if (vBrCode > 0 && vCurrencyCode > 0 && vModuleId > 0 && vGLCode > 0 && vAccNo > 0) {
      var kstr = vBrCode + "~" + vCurrencyCode + "~" + vModuleId + "~" + vGLCode + "~" + vAccNo + "~";
      if (eval(window.document.frmTrans.txtServiceId.value != "2")) {
        // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplay.aspx?kstr=" + kstr
      }
    }
  }

  //if (eval(vServiceId == "8")) {
  //  if (vBrCode > 0 &&
  //    vCurrencyCode > 0 &&
  //    window.document.frmTrans.txtCLGModId.value.length > 0 &&
  //    window.document.frmTrans.txtCLGGLcode.value.length > 0 &&
  //    window.document.frmTrans.txtCLGAccNo.value.length > 0) {

  //    kstr = vBrCode + "~" + vCurrencyCode + "~";
  //    kstr = kstr + window.document.frmTrans.txtCLGModId.value + "~";
  //    kstr = kstr + window.document.frmTrans.txtCLGGLcode.value + "~";
  //    kstr = kstr + window.document.frmTrans.txtCLGAccNo.value + "~";

  //    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplayret.aspx?kstr=" + kstr
  //  }
  //}
}

function GetPendingInterest(vModuleId, vBrCode, vGLCode, vAccNo) {
  if ((vModuleId == "LOAN") && ($("#TransactionMode input[type='checkbox']:checked").val() == "Credit")) {
    st = vBrCode + "|" + "INR" + "|LOAN|" + vGLCode + "|" + vAccNo;

    // window.document.all['idetails'].src = '<%="http://" & session("moduledir")& "/Loan/"%>' + "loanrenewintcalc.aspx?st=" + st;
  }
}



function Check206AA206AB(vBrCode, vModuleId, vAccNo, vGLCode) {
  var st = "Check206AA206AB" + "|" + vBrCode + "|" + vModuleId + "|" + vGLCode + "|" + vAccNo + "|INR";

  // window.document.all["iBatch"].src = "../GENSBCA/querydisplay.aspx?st=" + st
}

function SetCCDrCrLienYN(vModuleId, vBrCode, vAccNo, vAppDate, vGLCode) {
  if ((vModuleId.toUpperCase() != "CC")) {
    return;
  }
  var st = "GETCCDRCRLIENYN|" + vBrCode + "|INR|" + vModuleId.toUpperCase() + "|" + vGLCode + "|" + vAccNo + "|" + vAppDate;
  // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
}







// Account Details
function AccDetails(vBrCode, vModuleId, vGLCode, vAccNo) {
  if (vBrCode == "") {
    bankingAlert("Enter Branch Code");
    return;
  }
  if (vModuleId == "") {
    bankingAlert("Enter ModId Code");
    return;
  }
  if (vGLCode == "") {
    bankingAlert("Enter GLcode Code");
    return;
  }
  if (vAccNo == "") {
    bankingAlert("Enter AccNo Code");
    return;
  }

  // Prepare A/C details data
  var strData = vBrCode + "|" + $("#Branch option:selected").text().toUpperCase() + "|" + vCurrencyCode + "|INDIAN RUPEE|" + vGLCode + "|" +
    $("#GLCode option:selected").text().toUpperCase() + "|" + vModuleId + "|" + "" + "|" + vAccNo + "|" + $("#AccountName").val();

  // window.open('<%="http://" & session("moduledir")& "/GenSBCA/"%>' + "accountdetails.aspx?strData=" + strData, "SB");
}

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
//  document.getElementById("divPhSign").style.display = 'none';
//}




/*******************************************/

function ServiceCode(vMode, mode) {
  debugger;
  if (((vMode == "REC") || (vMode == "PAY")) && (mode != "MODIFY")) { //&& (window.document.frmTrans.Mfgpaydt.Rows > 1)
    bankingAlert("Only one Cash Transaction allowed at a time." + "\n" + "Post already entered data.")
    return;
  }

  var selectedValue = $("input[name='TransactionMode']:checked").val();

  if (selectedValue == "Clearing") {
    // Checking for clearingtype - selected or not 
    //if ((window.document.frmTrans.cmdcleartype.value == "Select") ||
    //  (window.document.frmTrans.cmdcleartype.value == "")) {
    //  alert("Select ClearingType")
    //  return;
    //}
  }

  var st = "Service|" + selectedValue + "|" + $("#ModuleCode").val()?.toUpperCase() || "";

  $.ajax({
    url: '/List/GetServiceIdList?searchString=' + encodeURIComponent(st),
    type: 'GET',
    success: function (data) {
      debugger;
      var dropdown = $('#ServiceCode');
      dropdown.empty();
      dropdown.append('<option value="">Select</option>');

      $.each(data, function (i, item) {
        dropdown.append('<option value="' + item.value + '">' + item.text + '</option>');
      });
    }
  });
}


