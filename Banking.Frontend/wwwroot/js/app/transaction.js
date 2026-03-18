
$(function () {

  var bdt = $("#Hidden_BDT").val();
  var vMode = $("#Hidden_Mode").val();
  var vAppDate = $("#ApplicationDate").val();
  var vCurrencyCode = $("#CurrencyCode").val();
  var vSelectedModule = $("#SelectedModule").val();
  var vUserId = $("#UserId").val();
  var vMachineId = $("#MachineId").val();

  var vCounterNo = $("#CounterNo").val();
  var vCashierId = $("#CashierId").val();
  var vBranchCode = $("#BranchCode").val();
  var vBrNarration = $("#BranchNarration").val();
  var vCurNarration = $("#CurrencyNarration").val();
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
    ControlOnBlur('ServiceCode');
    ModuleList(bdt, vSelectedModule, vMode);
  });

  $("#ModuleCode").on('change', function () {
    GLCode();
  });

  $("#CheckDenoms").prop('disabled', true);

  $("#Clearing").addClass('d-none');

  $("#AccountNumber").on("blur", function () {

    if ($(this).val() == "")
      return;

    var vBrCode = $("#Branch").val();
    var vModuleId = $("#ModuleCode").val()?.toUpperCase();
    var vGLCode = $("#GLCode").val().toUpperCase().split(" - ")[0];
    var vAccNo = $("#AccountNumber").val();
    var vServiceCode = $("#ServiceCode").val();

    ControlOnBlur('AccountNumber');
    AccountParameters(vAccNo, 'ACCNO');
    BalanceDetails(vServiceCode, vBrCode, vModuleId, vGLCode, vAccNo, vCurrencyCode);
    GetPendingInterest(vModuleId, vBrCode, vGLCode, vAccNo);
    JointHolderValidation(vBrCode, vAccNo, vModuleId, vGLCode);
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

  $("#ModuleCode").on('change', function () {
    debugger;
    DisplayLabels($("#TransactionMode").val(), $("#ModuleCode").val());
  });

  $("#TransactionMode input[type='checkbox']:checked").on("change click", function () {
    TransMode(vMode, bdt);
    ModeChange(bdt);
    DisplayLabels($("#TransactionMode").val(), $("#ModuleCode").val());
  });

  // window.document.frames['iPost'].frmPost.hdnSBCAAccClose.value = "";

  //if (mode != "MODIFY") {
  //  excpIntValues();
  //}

  $(".glcode").on('click', function () {
    GLCode();
  });

  $("#searchValue").on('blur', function () {
    var kstr = "TellGlaccno|" + $("#ModuleCode").val() + "|" + $("#Branch").val();

    $.ajax({
      url: '/List/ListGLQuery',
      type: 'GET',
      data: {
        searchString: kstr,
        hidsearch: $("#searchOptions option:selected").val() + "|" + $("#searchValue").val()
      },
      success: function (response) {
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

  // event listener
  $(document).on('change', '#CheckCheque', function () {
    if ($(this).is(':checked')) {
      $('#chequeDetails').removeClass('d-none');
    } else {
      $('#chequeDetails').addClass('d-none');
    }
  });

  $("#okBtn").on('click', function () {
    OkButtonClick();
  });
});

function ABBYesNo() {
  if ($("#ABBUser").val() == "Y") {
    $("#Branch").prop('disabled', false);
    $("#CheckABB").prop('disabled', false);
  }
}

function TransMode(vMode, bdt) {
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
  var vBranchCode = $("#Branch").val();
  var vModuleCode = $("#ModuleCode").val()?.toUpperCase();
  var vGLCode = $("#GLCode").val();//.split(" - ")[0];
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
    AbbApplDtBr();
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
      GetAccountDetails(vModuleCode, vBranchCode, vGLCode, vAccNo);
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
    $.ajax({
      url: '/List/GenOnBlur?searchString=' + encodeURIComponent(strVal),
      type: 'GET',
      success: function (response) {
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

    $.ajax({
      url: '/List/GetModuleIdList?searchString=' + encodeURIComponent(kstr),
      type: 'GET',
      success: function (data) {
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
        BindDropdown($('#ModuleCode'), response);
      },
      error: function (err) {
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
      bankingAlert(statusdesc1);
      //window.parent.window.document.frmTrans.item(txtName[0]).value = "";
      //window.parent.window.document.frmTrans.item(txtName[1]).value = "";
      return;
    }
  }
  if (txtName[2] == "P") {
    bankingAlert("Master Approval Is Pending");
    //window.parent.window.document.frmTrans.item(txtName[0]).value = "";
    //window.parent.window.document.frmTrans.item(txtName[1]).value = "";
    return;
  }
  if (txtName[2] != "NoRecords") {
    //  if (txtName[0] == "txtModId")
    //    window.parent.window.document.frmTrans.txtModDesc.value = txtName[2];
    //  else
    //    window.parent.window.document.frmTrans.item(txtName[1]).value = txtName[2];
  }
  else {
    bankingAlert("No Records Found");
    //  window.parent.window.document.frmTrans.item(txtName[0]).value = "";
    //  window.parent.window.document.frmTrans.item(txtName[1]).value = "";
  }
  ReturnedBack(txtName[0]);
}

function ReturnedBack(str) {
  debugger;
  if (str == "txtGLcode") {
    if (window.document.frmTrans.tranmode[2].checked == true) {
      if (window.document.frmTrans.txtModId.value == "REM") {
        // window.document.frmTrans.txtinstrno.focus();
      }
    }
    else {
      if (window.document.frmTrans.txtModId.value == "REM") {
        if (window.document.frmTrans.txtGLDesc.value != "") {
          $("#Amount").val('0.00');
        }
      }
      else {
        if (window.document.frmTrans.txtGLDesc.value != "") {
          window.document.frmTrans.txtAccNo.focus();
        }
      }
    }
  }
  else if (str == "AccountNumber") {
    if ($("#CustomerName").val() != "") {
      $("#Amount").val('0.00');
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

  // LoadGLCodeDropdown(kstr);

  $.ajax({
    url: '/List/ListGLQuery',
    type: 'GET',
    data: {
      searchString: kstr
    },
    success: function (response) {
      debugger;
      BindDropdown($('#GLCode'), response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });

  // window.showModalDialog("../gensbca/ListGlQuery.aspx?st=" + kstr)
}

function LoadGLCodeDropdown(kstr) {
  if (kstr.substring(0, 11) == "TellGlaccno" || kstr.substring(0, 11) == "chargesaccno" || kstr.substring(0, 11) == "CreTellGlno") {
    $("#searchOptions").empty();
    $("#searchOptions").append('<option value="name">GL Name</option>');
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

function JointHolderValidation(vBrCode, vAccNo, vModuleId, vGLCode) {
  debugger;
  if ($(TransactionMode).val() == "Debit") {
    var st = "GETJOINTHOLDER|" + vBrCode + "|INR|" + vGLCode + "|" + vAccNo + "|" + vModuleId;
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
  debugger;
  if ($("#TransactionMode:checked").val() == "Debit") {
    if (vServiceCode == 4) {
      var strmodid1 = vModuleId.toUpperCase()
      if ((strmodid1 == "SB") || (strmodid1 == "CA")) {
        var st = "ATMCardDet|" + vBrCode.toUpperCase() + "|" + vGLCode.toUpperCase() + "|" + vAccNo;
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
function GetAccountDetails(vModuleId, vBranchCode, vGLCode, vAccountNumber) {
  debugger;

  if (eval($("#ServiceCode").val() != "1")) {
    return;
  }
  if ($("#TransactionMode").val() != "Debit")
    return;

  if (vModuleId.toUpperCase() != 'SB' && vModuleId.toUpperCase() != 'CA' && vModuleId.toUpperCase() != 'CC') {
    return;
  }

  var kstr = "CHQACCYESNO" + "~" + vModuleId + "~" + vGLCode + "~~" + "INR" + "~" + vBranchCode + "~~~" + vAccountNumber + "~";
  // window.document.all['getAccDet'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genParameters.aspx?strparam=" + kstr

  $.ajax({
    url: '/GetDetails/GetGenParameter',
    type: 'GET',
    data: {
      searchString: kstr
    },
    success: function (response) {
      ModParamReturn(response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });
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

function ModParamReturn(str) {	//alert("md param="+str)
  var vals = str.split("~");
  if (vals[0] == "CHQACCYESNO") {
    if (vals[1] == "Y") {
      // programmatically check checkbox
      $("#CheckCheque").prop("checked", true).trigger('change');
    }
    else
      $("#CheckCheque").prop("checked", false).trigger('change');
    Cheque();
  }
}

function Cheque() {
  if ($("#CheckCheque").is(":checked") == true) {
    // window.document.all['ChqDtl'].style.display = "block";
  }

  if ($("#CheckCheque").is(":checked") == false) {
    $("#ChequeDate").val($("#ApplicationDate").val());

    if (mode != "MODIFY") {
      excpChqSrs = "";
      excpChqNo = "";
    }
  }
}

function AbbApplDtBr() {
  var aBrCode1 = $("#BranchCode").val();

  if (($("#Branch").val().length > 0) && ($("#Branch").val().length != aBrCode1)) { //&& (window.document.frmTrans.Mfgpaydt.Rows > 1)) {
    if (true) { //window.document.frmTrans.Mfgpaydt.TextMatrix(1, 100) == 'N') {
      var strpm = "ABBAPPLDATE" + "~" + $("#Branch").val();
      // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm

      $.ajax({
        url: '/GetDetails/MinimumBalanceCheck',
        type: 'GET',
        data: {
          searchString: strpm
        },
        success: function (response) {
          debugger;
          AbbApplDtRtn(response);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });

    }
  }
}

function AbbApplDtRtn(appDt) {

  if ((appDt != "NOAPPLDT") || (appDt != "")) {
    if (appDt != vAppDate) {
      bankingAlert("Application date of selected Branch should same as Application date of Logged in User's Branch");
      $("#Branch").val('');
      $("#CheckABB").prop('checked', false);
    }
    else {
      $("#EffectiveDate").val(appDt);

      //code copied from Branchcode(str) method by Radhika on 19 may 2008 
      //Reason: Without fetching ABB appl date execution is going on 
      ClearAlert("Brn");
      GetBranchParams(window.document.frmTrans.txtbranchcode.value);
    }
  }
  else {
    bankingAlert("No Application Date set for this Branch");
    $("#Branch").val('');
    $("#CheckABB").prop('checked', false);
  }
}

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

function GetBranchParams(strBrCode) {
  var strpm = "";
  var strBrid = window.document.frmTrans.txtModId.value.toUpperCase();
  if (strBrCode.length > 0) {
    strpm = "CHQVALIDPERIODLENDY" + "~" + strBrCode + "~" + strBrid;
    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function AccountParameters(AccNoOrCatCode, AccOrCat) {

  var vBrCode = $("#Branch").val();
  var vModuleId = $("#ModuleCode").val()?.toUpperCase();
  var vGLCode = $("#GLCode").val().toUpperCase().split(" - ")[0];
  //var vAccNo = $("#AccountNumber").val();
  //var vServiceCode = $("#ServiceCode").val();

  if (vModuleId != "SB" && vModuleId != "CA" && vModuleId != "DEP" && vModuleId != "LOAN" && vModuleId != "CC")
    return;
  if ((vBrCode == "") || (vAppDate == "") || (vModuleId == "") || (vMachineId == "") || (vGLCode == "") || (vUserId == "") || (AccNoOrCatCode == "")) {
    return;
  }
  debugger;
  var strPrm = "ACCOUNT" + "~" + vModuleId + "~" + vGLCode + "~" + vAppDate + "~INR~" + vBrCode + "~" + vUserId + "~" + vMachineId + "~" + AccNoOrCatCode + "~" + AccOrCat;

  // window.document.all['iPrm'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genparameters.aspx?strparam=" + strPrm

  $.ajax({
    url: '/GetDetails/GetGenParameter',
    type: 'GET',
    data: {
      searchString: strPrm
    },
    success: function (response) {
      debugger;
      AccountParameterReturn(response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });
}

function AccountParameterReturn(strRslt) {
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
  pMultplesOf = parmVal[83];
}

function BalanceDetails(vServiceId, vBrCode, vModuleId, vGLCode, vAccNo, vCurrencyCode) {
  debugger;
  if (eval(vServiceId != "8")) {
    if (vBrCode.length > 0 && vCurrencyCode.length > 0 && vModuleId.length > 0 && vGLCode.length > 0 && vAccNo.length > 0) {
      var kstr = vBrCode + "~" + vCurrencyCode + "~" + vModuleId + "~" + vGLCode + "~" + vAccNo + "~";
      if (eval($("#ServiceCode").val() != "2")) {
        // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplay.aspx?kstr=" + kstr
        alert("Load Parameters");
        $.ajax({
          url: '/GetDetails/GetBalanceDetails',
          type: 'GET',
          data: {
            searchString: kstr
          },
          success: function (response) {
            debugger;
            Display(response);
          },
          error: function (err) {
            HandleAjaxError(err);
          }
        });

      }
    }
  }

  //if (eval(vServiceId == "8")) {
  //  if (vBrCode > 0 && vCurrencyCode > 0 && frmTrans.txtCLGModId.value.length > 0 && frmTrans.txtCLGGLcode.value.length > 0 && frmTrans.txtCLGAccNo.value.length > 0) {
  //    kstr = vBrCode + "~" + vCurrencyCode + "~" + txtCLGModId.value + "~" + txtCLGGLcode.value + "~" + txtCLGAccNo.value + "~";
  //    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplayret.aspx?kstr=" + kstr
  //  }
  //}
}

function GetPendingInterest(vModuleId, vBrCode, vGLCode, vAccNo) {
  debugger;
  if ((vModuleId == "LOAN") && ($("#TransactionMode").val() == "Credit")) {
    st = vBrCode + "|" + "INR" + "|LOAN|" + vGLCode + "|" + vAccNo;

    // window.document.all['idetails'].src = '<%="http://" & session("moduledir")& "/Loan/"%>' + "loanrenewintcalc.aspx?st=" + st;
  }
}

function Check206AA206AB(vBrCode, vModuleId, vAccNo, vGLCode) {
  debugger;
  var st = "Check206AA206AB" + "|" + vBrCode + "|" + vModuleId + "|" + vGLCode + "|" + vAccNo + "|INR";
  // window.document.all["iBatch"].src = "../GENSBCA/querydisplay.aspx?st=" + st

  $.ajax({
    url: '/GetDetails/GetQueryDisplay',
    type: 'GET',
    data: {
      searchString: st
    },
    success: function (response) {
      debugger;
      //GETDRCRLIENYN1(response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });
}

function SetCCDrCrLienYN(vModuleId, vBrCode, vAccNo, vAppDate, vGLCode) {
  debugger;
  if ((vModuleId.toUpperCase() != "CC")) {
    return;
  }
  var st = "GETCCDRCRLIENYN|" + vBrCode + "|INR|" + vModuleId.toUpperCase() + "|" + vGLCode + "|" + vAccNo + "|" + vAppDate;
  // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
}

//This function was written to display account holder details like Current Balance,... coming from server page
function Display(kstr) {
  debugger;
  alert("Display");
  if (kstr == "") {
    return;
  }
  alert(kstr);
  balstr = kstr.split("|");

  if ($("#ModuleCode").val().toUpperCase() != "SCR") {
    AssignAndShow('ClearBalance', precision(balstr[2], $("#Hidden_Precision").val()));
  }

  AssignAndShow('GSTIN', (balstr.length > 11 && balstr[11] != "0") ? balstr[11] : '');
  AssignAndShow('UnclearBalance', precision(balstr[1], $("#Hidden_Precision").val()));

  if (eval(balstr[1]) > 0) {
    //lblUnclrbal.href = "#";
  }
  else {
    //lblUnclrbal;
  }

  $("#CustomerPhoto").attr("src", "data:image/jpg;base64, " + balstr[balstr.length - 1]);
  $("#CustomerSign").attr("src", "data:image/jpg;base64, " + balstr[balstr.length - 2]);

  AssignAndShow('AccountBalance', precision(balstr[0], $("#Hidden_Precision").val()));
  AssignAndShow('CustomerId', balstr[3]);
  AssignAndShow('OperatedBy', balstr[4]);
  $("#CustomerName").val(balstr[4]);
  AssignAndShow('OperationInstruction', balstr[5]);

  if (($("#ModuleCode").val().toUpperCase() == "SB") || ($("#ModuleCode").val().toUpperCase() == "CA")) {
    AssignAndShow('PendingBalance', precision(balstr[7], $("#Hidden_Precision").val()));
    AssignAndShow('TotalCashDebited', parseFloat(balstr[8]).toFixed(2));
    AssignAndShow('TotalCashCredited', parseFloat(balstr[9]).toFixed(2));
    $("#Hidden_MaxAmount").val(parseFloat(balstr[10]).toFixed(2));
  }

  if ($("#ModuleCode").val().toUpperCase() == "PL" || $("#ModuleCode").val().toUpperCase() == "MISC" || $("#ModuleCode").val().toUpperCase() == "BILLS") {
    AssignAndShow('PendingBalance', precision(balstr[6], $("#Hidden_Precision").val()));
  }

  if ($("#ModuleCode").val().toUpperCase() == "CC") {
    AssignAndShow('PendingBalance', precision(balstr[9], $("#Hidden_Precision").val()));
    AssignAndShow('TotalCashDebited', parseFloat(balstr[10]).toFixed(2));
    AssignAndShow('TotalCashCredited', parseFloat(balstr[11]).toFixed(2));
    $("#Hidden_MaxAmount").val(parseFloat(balstr[12]).toFixed(2));
  }

  if ($("#ModuleCode").val().toUpperCase() == "CC") {
    AssignAndShow('LimitAmount', precision(balstr[7], $("#Hidden_Precision").val()));
    AssignAndShow('TODLimit', balstr[13]);

    var avalLmt = parseFloat(parseFloat(balstr[7]) + parseFloat(balstr[13]) + parseFloat(balstr[2])).toFixed(2);
    AssignAndShow('AvailableLimit', avalLmt);

    AssignAndShow('LimitExpiryDate', balstr[14]);

    if (balstr[15] == "P") {
      // spannpadispmsg.innerHTML = ""
    }
    else {
      // spannpadispmsg.innerHTML = "Account Is NPA";
    }
  }

  strValues = balstr[3];

  // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "msgcnt.aspx?strVal=" + strValues

  if ($("#ModuleCode").val().toUpperCase() == "LOAN") {

    AssignAndShow('AccountBalance', precision(balstr[0], $("#Hidden_Precision").val()));

    if ($("#TransactionMode").val() == "Credit") {
      if (isNaN(parseFloat(window.document.frmTrans.txtIntPendAmt.value)) == false) {
        var loanAccBal = parseFloat(balstr[0]) - parseFloat($("#PendingIntAmount").text());
        AssignAndShow('AccountBalance', loanAccBal);
      }
      else {
        AssignAndShow('AccountBalance', $("#PendingIntAmount").text());
        AssignAndShow('PendingIntAmount', precision(0, $("#Hidden_Precision").val()));
      }
    }

    AssignAndShow('ClearBalance', precision(balstr[2], $("#Hidden_Precision").val()));
    AssignAndShow('CustomerId', balstr[3]);
    AssignAndShow('DisbursementAmount', precision(balstr[8], $("#Hidden_Precision").val()));
    AssignAndShow('OperatedBy', balstr[4]);
    AssignAndShow('SanctionAmount', precision(balstr[7], $("#Hidden_Precision").val()));
    AssignAndShow('UnclearBalance', precision(balstr[1], $("#Hidden_Precision").val()));

    if (eval($("#UnclearBalance").text()) > 0) {
      lblLoanUnclrbal.href = "#"
    }
    else {
      lblLoanUnclrbal
    }

    AssignAndShow('AvailableLimit', precision((balstr[7] - balstr[8]), $("#Hidden_Precision").val()));
    AssignAndShow('PendingBalance', precision(balstr[11], $("#Hidden_Precision").val()));

    if (balstr[12] == "P") {
      // spannpadispmsg.innerHTML = ""
    }
    else {
      // spannpadispmsg.innerHTML = "Account Is NPA";
    }

    AssignAndShow('InterestAmount', precision(balstr[13], $("#Hidden_Precision").val()));
    AssignAndShow('PendingInstallments', balstr[14]);
  }
  else if ($("#ModuleCode").val() == "DEP" && $("#ServiceCode").val() != "2") {
    Deppopaccnodetails();
  }

  if ($("#TransactionMode").val() == "Credit") {
    if ($("#ModuleCode").val().toUpperCase() == "SB" || $("#ModuleCode").val().toUpperCase() == "CA") {
      SetDrCrLienYN();
    }
  }
}

function SetDrCrLienYN() {
  var strModeDrCr = "";

  if ($("#ModuleCode").val() != "SB" && $("#ModuleCode").val() != "CA") {
    return;
  }

  if ($("#TransactionMode").val() == "Debit") {
    strModeDrCr = "Dr";
  }
  else if ($("#TransactionMode").val() == "Credit") {
    strModeDrCr = "Cr";
  }

  var st = "GETDRCRLIENYN|" + strModeDrCr + "|" + $("#Branch").val() + "|INR|" + $("#ModuleCode").val() + "|" + $("#GLCode").val() + "|" + $("#AccountNumber").val() + "|" + $("#Amount").val() + "|" + $("#ApplicationDate").val();
  // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st

  $.ajax({
    url: '/GetDetails/GetDetails',
    type: 'GET',
    data: {
      searchString: st
    },
    success: function (response) {
      debugger;
      GETDRCRLIENYN1(response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });

}

// This function is used to display deposit account details like current amount,maturity amount
function Deppopaccnodetails() {

  AssignAndShow('RD_OpAmount', precision(balstr[1], $("#Hidden_Precision").val()));
  AssignAndShow('RD_CurrAmount', precision(balstr[0], $("#Hidden_Precision").val()));
  AssignAndShow('RD_MaturityAmount', precision(balstr[2], $("#Hidden_Precision").val()));

  var deprendiffamt = eval(window.document.frmTrans.txtDMatAmt.value) - eval(window.document.frmTrans.txtDOpAmt.value);

  AssignAndShow('CustomerId', balstr[3]);
  debugger;
  alert(balstr[3]);
  LoadPhotoAndSign(balstr[3]);

  AssignAndShow('RD_OpDate', balstr[4]);

  AssignAndShow('RD_EffectiveDate', balstr[5]);
  AssignAndShow('RD_MaturityDate', balstr[6]);
  AssignAndShow('OperatedBy', balstr[7]);
  AssignAndShow('RD_ROI', balstr[8]);
  AssignAndShow('OperationInstruction', balstr[9]);

  AssignAndShow('RD_IntAccr', precision(balstr[10], $("#Hidden_Precision").val()));
  AssignAndShow('RD_IntPaidUpto', balstr[10]);

  AssignAndShow('PendingBalance', precision(balstr[12], $("#Hidden_Precision").val()));

  // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "msgcnt.aspx?strVal=" + strValues

  $.ajax({
    url: '/GetDetails/GetMessageCount',
    type: 'GET',
    data: {
      searchString: balstr[3]
    },
    success: function (response) {
      debugger;
      // GETDRCRLIENYN1(response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });

}

function GETDRCRLIENYN1(str) {
  var kStr = str.split("|");
  if (kStr[1] == "Y") {
    if ($("#TransactionMode").val() == "Debit") {
      bankingAlert("This A/c is marked for debit Lien Rs :" + kStr[2]);
    }
    else if ($("#TransactionMode").val() == "Credit") {
      bankingAlert("This A/c is marked for Credit Lien");
    }
  }
  Check206AA206AB();
}

function AssignAndShow(element, value) {
  $("." + element).removeClass('d-none');
  $("#" + element).text(value);
}




function DisplayLabels(transMode, vModuleCode) {
  debugger;
  var sbDebitList = ["ClearBalance", "UnclearBalance", "AccountBalance", "OperationInstruction", "OperatedBy", "PendingBalance", "CustomerId", "LimitAmount", "TotalCashDebited",
    "TotalCashCredited", "LimitExpiryDate", "GSTIN"];

  var loanDebitList = ["SanctionAmount", "AccountBalance", "DisbursementAmount", "ClearBalance", "UnclearBalance", "AvailableLimit", "OperatedBy", "PendingBalance",
    "CustomerId", "PendingIntAmount", "InterestAmount", "NPAIntAmount", "PendingInstallments"];

  var ccDebitList = ["ClearBalance", "UnclearBalance", "AccountBalance", "OperationInstruction", "OperatedBy", "PendingBalance", "CustomerId", "LimitAmount", "TotalCashDebited",
    "TotalCashCredited", "TODLimit", "AvailableLimit", "LimitExpiryDate", "GSTIN"];

  var depCreditList = ["RD_OpAmount", "RD_OpDate", "RD_ROI", "RD_CurrAmount", "RD_EffectiveDate", "OperationInstruction", "RD_MaturityAmount", "RD_MaturityDate",
    "PendingBalance", "RD_IntAccr", "RD_IntPaidUpto", "CustomerId", "OperatedBy"];

  var remCreditList = ["Remm_IssuedOnBank", "Remm_IssuedOnBranch", "Remm_Favouring", "Remm_Commission", "Remm_RecipientName", "Remm_GST", "Remm_CESS", "Remm_PAN", "Remm_Mobile",
    "Remm_Address1", "Remm_Address2", "Remm_Address3"];

  if (vModuleCode == "SB" && (transMode == "Debit" || transMode == "Credit"))
    ShowLabels(sbDebitList);

  if (vModuleCode == "LOAN" && (transMode == "Debit" || transMode == "Credit"))
    ShowLabels(loanDebitList);

  if (vModuleCode == "CC" && (transMode == "Debit" || transMode == "Credit"))
    ShowLabels(ccDebitList);

  if (vModuleCode == "DEP" && (transMode == "Credit"))
    ShowLabels(depCreditList);

  if (vModuleCode == "REM" && (transMode == "Credit")) {
    $("#rem").removeClass('d-none');
    ShowLabels(remCreditList);
  }
}

function ShowLabels(divList) {
  divList.forEach(function (id) {
    $("." + id).removeClass("d-none");
  });
}

function HideLabels(divList) {
  divList.forEach(function (id) {
    $("." + id).addClass("d-none");
  });
}

function LoadPhotoAndSign(customerId) {
  alert(customerId);
  // Photo Call
  $.ajax({
    url: '/GetDetails/GetCustomerPhoto',
    type: 'GET',
    data: {
      searchString: customerId
    },
    success: function (response) {
      debugger;
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });

  // Signature Call
  $.ajax({
    url: '/GetDetails/GetCustomerSignature',
    type: 'GET',
    data: {
      searchString: customerId
    },
    success: function (response) {
      debugger;
      $("#CustomerSign").attr("src", "data:image/jpg;base64, " + response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });
}

function OkButtonClick() {

  var strValues;
  var brCode;
  var blnFlagAutoClose = false
  var blnBatchLoancheck = false
  var blnCloseLoan;

  //this code added by vinod for close loans where 0 balance in accounts
  if ($("#TransactionMode").val() == "Credit" && $("#ModuleCode").val() == "LOAN") {
    if (CashDenom == 'Y') {
      // window.document.frmTrans.hdnMod.value = $("#ModuleCode").val();
    }

    if (Math.abs($("#AccountBalance").text()) == Math.abs($("#Amount").val())) {
      blnBatchLoancheck = true;
      blnCloseLoan = true;
      $("#hdnblnCloseLoan").val('');
      $("#hdnblnCloseLoan").val('true1');
      var result = confirm("Do you Want to Close This Loan");
      if (result == true) {
        var resultConfirm = confirm("Are you Sure Want to Close This Loan");
        {
          if (resultConfirm == true) {
            blnFlagAutoClose = true;
            var ab = $("#AccountNumber").val() + "|" + $("#GLCode").val() + "|" + $("#Branch").val();
            $("#hdnCloseLoan").val(ab);

            if (!(($("#NAPIntAmount").text() == "") || eval($("#NAPIntAmount").text() == 0))) {
              blnNpaInt = true;
              npaIntYN = "Y";
              if ((Math.abs($("#AccountBalance").text()) == Math.abs($("#Amount").val())) || (parseFloat($("#Amount").val()) > parseFloat($("#NAPIntAmount").text()))) {
                alert("NPA Interest for This Account is " + $("#NAPIntAmount").text() + ", This Amount Adjusted to Loan");
              }
              if (parseFloat($("#Amount").val()) <= parseFloat($("#NAPIntAmount").text())) {
                alert("NPA Interest for This Account is " + $("#NAPIntAmount").text() + ", This Amount " + $("#Amount").val() + " Adjusted to Loan");
              }
            }
            blnBatchLoanClose = true;
            CloseLoanAuto();
          }
          else {
            $("#hdnCloseLoan").val('');
            blnFlagAutoClose = false;
            blnBatchLoanClose = false;
            CloseLoanAuto();
          }
        }
      }
      else {
        $("#hdnCloseLoan").val('');
        blnFlagAutoClose = false
        blnBatchLoanClose = false
        CloseLoanAuto();
      }
    }
    else if (Math.abs($("#Amount").val()) > Math.abs($("#AccountBalance").text())) {
      var resultConfirm = confirm("Entered Amt Is Crossing A/c Bal , Do You Want To Continue ?");
      {
        if (resultConfirm == true) {
        }
        else {
          return;
        }
      }
    }
    else {
      if (!(($("#NPAIntAmount").text() == "") || eval($("#NPAIntAmount").text() == 0))) {
        blnNpaInt = true;
        npaIntYN = "Y";
        if ((Math.abs($("#AccountBalance").text()) == Math.abs($("#Amount").val())) || (parseFloat($("#Amount").val()) > parseFloat($("#NPAIntAmount").text()))) {
          alert("NPA Interest for This Account is " + window.document.frmTrans.txtNPAIntAmt.value + ", This Amount Adjusted to Loan");
        }
        if (parseFloat($("#Amount").val()) <= parseFloat($("#NPAIntAmount").text())) {
          alert("NPA Interest for This Account is " + $("#NPAIntAmount").text() + ", This Amount " + $("#Amount").val() + " Adjusted to Loan");
        }
        blnBatchLoanClose = false;
        CloseLoanAuto();
      }
    }
  }

  //this code added by vinod for close loans where 0 balance in accounts ended here
  if (vSubMode == "TPAY" || vSubMode == "TREC") {

    exceptionCodes();
    if (excpYN == "Y" && $("#Hidden_TellerVerifyReqYN").val() == "N") {
      alert("Exceptional Transactions are not allowed");
      Cancel();
      return;
    }
  }
  if ($("#CheckABB").is('checked') == false) {
    brCode = $("#Branch").val();
  }
  else {
    brCode = "ABB";
  }
  var batchNo = "";
  if (((vMode == "REC") || (vMode == "PAY")) && (mode != "MODIFY")) { // && (window.document.frmTrans.Mfgpaydt.Rows > 1)) {
    if (false) {//window.document.frmTrans.chkDispAccNo.checked == true) {
      //alert("Reddy2")
    }
    else {
      alert("Only one Cash Transaction allowed at a time." + "\n" +
        "Post already entered data.")
      return
    }
  }
  TransMode(vMode, bdt);
  modId = $("#ModuleCode").val();
  serId = $("#ServiceCode").val();

  checkNulls(modId, trnMode, serId);
  if (chkNull == "false") {
    return;
  }
  if (OkValidations() == false) {
    return;
  }
  excpTranCheck();
  //new code added by radhika on 25 nov 2008
  MinBalCheck_modify();
  //end of new code
  TotTranNos();
  var overdraft2
  overdraft2 = "<%=ovrdrft%>";

  // Genaral Batch No genration  

  if ($("TransactionMode").val() == "Debit" || $("TransactionMode").val() == "Credit")
    if (mode != "MODIFY") {
      if (window.document.frmTrans.Mfgpaydt.Rows == 1) {
        if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true')) {
          if (eval(window.document.frmTrans.hdn194Nfinaltds.value) != 0) {
            strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + 4;
          }
          else {
            strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos;
          }
        }
        else {
          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos;
        }
      }
      else if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
        if (($("#hdnblnCloseLoan").val() == "true1") && ($("TransactionMode").val() == "Debit")) {
          batchNo = ""; //window.document.frmTrans.Mfgpaydt.TextMatrix(window.document.frmTrans.Mfgpaydt.rows - 1, 0)
          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos;
        }
        else {
          batchNo = ""; //window.document.frmTrans.Mfgpaydt.TextMatrix(1, 0)
          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos;
        }
      }

    }
  //else if (mode == "MODIFY") {
  //  //batchNo = window.document.frmTrans.hdnBatchNo.value
  //  //tranNo = window.document.frmTrans.hdnTranNo.value
  //  //var tranNo2 = window.document.frmTrans.hdnTranNo2.value
  //  //var tranNo3 = window.document.frmTrans.hdnTranNo3.value
  //  //var tranNo4 = window.document.frmTrans.hdnTranNo4.value
  //  var vModId = $("#ModuleCode").val().toUpperCase();
  //  TransMode(vMode, bdt);

  //  if ((vModId == "REM") || (vModId == "FXREM")) {
  //    if (trnMode == "4") {
  //      //New code is 
  //      bNo = batchNo + "~" + tranNo

  //      if (eval(window.document.frmTrans.txtcomm.value) > 0)
  //        bNo = bNo + "~" + tranNo2

  //      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
  //        bNo = bNo + "~" + tranNo3

  //      FlexPopulate(bNo)
  //    }
  //    else if (trnMode == "2") {
  //      // New Code is 
  //      bNo = batchNo + "~" + tranNo + "~" + tranNo2

  //      if (eval(window.document.frmTrans.txtcomm.value) > 0)
  //        bNo = bNo + "~" + tranNo3

  //      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
  //        bNo = bNo + "~" + tranNo4

  //      FlexPopulate(bNo)
  //    }
  //    else if (trnMode == "3") {
  //      bNo = batchNo + "~" + tranNo
  //      FlexPopulate(bNo)
  //    }
  //    else if (trnMode == "1") {
  //      bNo = batchNo + "~" + tranNo + "~" + tranNo2
  //      FlexPopulate(bNo)
  //    }
  //  }
  //  else if (vMode == "TRANS") {

  //    bNo = batchNo + "~" + tranNo
  //    FlexPopulate(bNo)
  //  }
  //  else if ((vMode == "PAY") || (vMode == "REC")) {

  //    bNo = batchNo + "~" + tranNo + "~" + tranNo2
  //    FlexPopulate(bNo)
  //  }
  //  return
  //}

  //clear denom tally
  window.document.frames("idenomtally").denomtallyclear();
  // post to iframe page

  if (($("#TransactionMode").val() == "Credit") && ($("#ModuleCode").val() == "REM")) {  // && (window.document.frmTrans.chkRemRepeat.checked == true)) {
    //if (window.document.frmTrans.txtNoOfRepeat.value == "") {
    //  alert("Please Enter Number of Repetitions.")
    //  window.document.frmTrans.txtNoOfRepeat.focus()
    //  return;
    //}

    if ((vMode == "PAY") || (vMode == "REC")) {
      var st = "GETBATCHTRANNO|" + $("#Branch").val() + "*" + $("#NoofRepeat").val() * 2;
    }
    else {
      var stTnno = $("#NoofRepeat").val();
      if (eval($("#ServiceCharge").val()) > 0)
        stTnno = eval(stTnno) + 1;

      if (eval($("#CESSCharge").val()) > 0)
        stTnno = eval(stTnno) + 1;

      var st = "GETBATCHTRANNO|" + $("#Branch").val() + "*" + stTnno;
    }

    //window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
    $.ajax({
      url: '/GetDetails/GetDetails',
      type: 'GET',
      data: {
        searchString: st
      },
      success: function (response) {
        debugger;
        BatchTranNo(response);
      },
      error: function (err) {
        HandleAjaxError(err);
      }
    });
  }
  else {
    if (blnBatchLoancheck == true) {
    }
    else if (($("#TransactionMode").val() == "Debit") && ($("#ServiceCode").val() == 9) && ($("#Hidden_RemCanAutoChrgsYN").val() == "Y") &&
      ($("#Hidden_RemCanCommYN").val() == "Y") && (vMode == "TRANS")) {
      tranNos = 5;
      strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos;
      // window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchnoGenRemCanc.aspx?strVal=" + strValues
    }
    else {
      // window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGen.aspx?strVal=" + strValues
    }
  }
}

function ClearTranFields() {
  $("#ModuleCode").val('');

  modulecode($("#ModuleCode").val());

  $("#ChequeNo").val('');
  $("#ChequeDate").val('');
  $("#ChequeFavouring").val('');
}

//This function displays various moduleids and descriptions,it also clear all lower level fields. And makes different divs visible true and false based on condition
function modulecode(kstr) {

  if (bdt.toUpperCase() == "TRUE")
    return;
  var strMod = kstr;
  $("#ModuleCode").val(strMod);

  // window.document.all['divRemRep'].style.display = "none";

  var modId = $("#ModuleCode").val().toUpperCase();
  masterTabYN();
  GLClear();
  funloanclear();

  //make ChequeBook check box false and hide respective Division
  $("#CheckCheque").prop('checked', false);
  Cheque();

  // Below code will work when service id <> 8 i.e other than clearing
  if (eval($("#ServiceCode").val()) == "8") {
    return;
  }

  // fxTransactionYN();
  //if (window.document.frmTrans.tranmode(2).checked == true) {
  //  if (modId == "REM") {
  //    window.document.frmTrans.chkCheque.checked = false;
  //  }
  //  else {
  //    window.document.frmTrans.chkCheque.checked = true;
  //  }
  //  Cheque()
  //}


  if ((modId == "REM") && ($("#TransactionMode").val() == "Debit" || $("#TransactionMode").val() == "Clearing")) {
    //divsDisplay("remdr", "M")
    //window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"
  }

  else if ((modId == "REM") &&
    (window.document.frmTrans.tranmode(1).checked == true)) {
    //divsDisplay("remcr", "M")
    //window.document.all.divComm.style.display = "block";
    //window.document.all['divfxRem'].style.display = "block";
    //window.document.all['divrembank'].style.display = "block";
    //window.document.all['divRemRep'].style.display = "block";

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

  //  window.document.all['divcheque'].style.display = "none";
  //  window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |^ Contra Date |>Contra Batch No       |>Contra Tran No       |>Appl's Name |>Cust Id      "
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
  //  window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>                  |>             |>             |>               |>               |>             |>           "
  //  window.document.frmTrans.Mfgpaydt.TextMatrix(0, 44) = "Loan Trans"
  }
  else if ((modId == "LOAN") &&
    (window.document.frmTrans.tranmode(1).checked == true)) {
    divsDisplay("loandtls", "M")

    window.document.all['divaccno'].style.display = "block";
    window.document.all.loanintdtls.style.display = "block"
    funloantran()
    funinsertloan()
    //window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Interest Amount |> Charges Amount |> Insurance Amount |>NPA Amount       |>Principalamount       |>Excessamount |>Cust ID      "
  }
  else if (modId == "DEP") {
    divsDisplay("divDepDtls", "M")
  //  window.document.all['divaccno'].style.display = "block";
  //  window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Opening Amount  |> Current Amount |> Maturity Amount |>Int Accrued       |>Opening Date       |>Effective Date |>Maturity Date  |>Int. Paid Upto |>ROI     "
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

function CloseLoanAuto() {
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

//This function is used to check for mandatory field values. 
function checkNulls(modId, modeval, serId) {
  //for General Mandatory fields
  var chkNull = "true";

  //if ((window.document.frmTrans.tranmode[2].checked == true) &&
  //  (window.document.frmTrans.cmdcleartype.selectedIndex < 1)) {
  //  alert("Please Select Clearing Type")
  //  chkNull = "false"
  //  return
  //}

  if ($("#Branch").val() == "" || $("#ModuleCode").val() == "" || $("#GLCode").val() == "" || eval($("#Amount").val() == 0)) {
    chkNull = "false";

    if ($("#Branch").val() == "") {
      alert("Please enter Branch Code");
      return;
    }

    if ($("#ModuleCode").val() == "") {
      alert("Please enter Module id Code");
      return;
    }

    if ($("#Amount").val() == "") {
      alert("Please enter Amount");
      return;
    }
  }

  // for deposit opening categorycode,application name   new
  if ($("#TransactinoMode").val() == "Credit" && serId == "2") {
    // var str1 = window.document.frmTrans.txtAppName.value;
    //if ((window.document.frmTrans.txtAccCatCode.value == "") ||
    //  (trim(str1) == "")) {
    //  chkNull = "false"
    //  alert("Please enter Category code")
    //  window.document.frmTrans.txtAccCatCode.focus()
    //  return
    //}
  }
  // end of new

  // For Account Number
  if ($("#TransactionMode").val() == "Clearing" || (serId == "2") || (mstTab == "NO") || (modId == "REM")) {
  }
  else {
    if ($("#AccountNumber").val() == "") {
      chkNull = "false";
      alert("Please enter the Accnount Number");
      return;
    }
  }

  // For Cheques
  if ($("#CheckCheque").is('checked')) {
    //if((window.document.frmTrans.txtChqSrs.value=="")||
    if ($("#ChequeNo").val() == "" || $("#ChequeDate").val() == "") {
      chkNull = "false";
      if ($("#ChequeNo").val() == "") {
        alert("Please enter Cheque number");
      }

      if ($("#ChequeDate").val() == "") {
        alert("Please enter Cheque Date");
      }
      return;
    }
  }

  ////for outward returns clearing Mandatory fields 
  //if ((window.document.frmTrans.tranmode[2].checked == true) &&
  //  (window.document.frmTrans.txtServiceId.value == "8")) {

  //  if ((window.document.frmTrans.txtCLGModId.value == "") ||
  //    (window.document.frmTrans.txtCLGGLcode.value == "") ||
  //    (window.document.frmTrans.txtCLGBranch.value == "") ||
  //    (window.document.frmTrans.txtCLGReasoncode.value == "") ||
  //    (window.document.frmTrans.txtCLGBankCode.value == "")) {
  //    chkNull = "false"

  //    if (window.document.frmTrans.txtCLGModId.value == "") {
  //      alert("Please enter Clearing Module ID")
  //      window.document.frmTrans.txtCLGModId.focus()
  //    }

  //    if (window.document.frmTrans.txtCLGGLcode.value == "") {
  //      alert("Please enter Clearing GL Code")
  //      window.document.frmTrans.txtCLGGLcode.focus()
  //    }

  //    if (window.document.frmTrans.txtCLGBranch.value == "") {
  //      alert("Please enter Clearing Branch Code")
  //      window.document.frmTrans.txtCLGBranch.focus()
  //    }

  //    if (window.document.frmTrans.txtCLGReasoncode.value == "") {
  //      alert("Please enter Clearing Outward Return Reasond code")
  //      window.document.frmTrans.txtCLGReasoncode.focus()
  //    }

  //    if (window.document.frmTrans.txtCLGBankCode.value == "") {
  //      alert("Please enter Clearing Bank code")
  //      window.document.frmTrans.txtCLGBankCode.focus()
  //    }
  //    return
  //  }
  //}


  //for Loans  
  if ((modId == "LOAN") && (modeval == "3")) {
    if (window.document.frmTrans.selloantrans.value == "Select") {
      chkNull = "false";
      alert("Mandatory fields cannot be Null");
      return;
    }
  }

  // Remittance 
  if (((modId == "REM") && (modeval == "4")) || ((modId == "REM") && (modeval == "2"))) {

    if ($("#Remm_IssuedOnBank").val() == "" || $("#Remm_IssuedOnBranch").val() == "" || $("#Remm_Favouring").val() == "") {
      chkNull = "false";

      if ($("#Remm_IssuedOnBank").val() == "") {
        alert("Please enter Issued Bank Code");
      }

      if ($("#Remm_IssuedOnBranch").val() == "") {
        alert("Please enter Issued Branch Code");
      }
      return;
    }

    // Commision check
    if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
      if (eval($("#Remm_Commission").val()) == 0 || $("#Remm_Commission").val() == "") {
        var confrm = confirm("Commission not entered.  Do you want to Continue? ");
        if (confrm == false) {
          chkNull = "false";
          return;
        }
      }
    } 

    // Service Charge check	     
    if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
      if ((eval(window.document.frmTrans.txtSerivceChrg.value) == 0) ||
        (window.document.frmTrans.txtSerivceChrg.value == "")) {
        var confrm = confirm("Service Charge not entered. Do you want" + " to Continue? ")
        if (confrm == false) {
          chkNull = "false";
          return;
        }
      }
    }
  }
  //else if (((modId == "REM") && (modeval == "3")) || ((modId == "REM") && (modeval == "1"))) {
  //  if ((window.document.frmTrans.txtbybnkcode.value == "") ||
  //    (window.document.frmTrans.txtbybrcode.value == "") ||
  //    (window.document.frmTrans.txtinstrno.value == "") ||
  //    (window.document.frmTrans.txtinstrdt.value == "") ||
  //    (window.document.frmTrans.txtfavgdr.value == "")) {
  //    chkNull = "false";

  //    if (window.document.frmTrans.txtbybnkcode.value == "") {
  //      alert("Please enter By Bank code");
  //    }

  //    if (window.document.frmTrans.txtbybrcode.value == "") {
  //      alert("Please enter By Branch code");
  //    }

  //    if (window.document.frmTrans.txtinstrno.value == "") {
  //      alert("Please enter By Instrument no:");
  //    }

  //    if (window.document.frmTrans.txtfavgdr.value == "") {
  //      alert("Please enter By Favoring");
  //    }
  //    return;
  //  }
  //}

  //// Forex
  //if ((fxTransYN == "Y") && (window.document.frmTrans.chkDispAccNo.checked == false) &&
  //  (window.document.frmTrans.chkFRateDtls == true)) {

  //  if ((window.document.frmTrans.txtFCurCode.value == "") ||
  //    (eval(window.document.frmTrans.txtFAmount.value == 0)) ||
  //    (eval(window.document.frmTrans.txtFRate.value == 0)) ||
  //    (window.document.frmTrans.txtFRateRefCode.value == "") ||
  //    (window.document.frmTrans.cmbFRateType.options
  //    [window.document.frmTrans.cmbFRateType.selectedIndex].value == "")) {
  //    chkNull = "false"
  //    alert("Mandatory fields cannot be Null")
  //    return
  //  }
  //}

  //if ((modId == "FXREM") && ((modeval == "4") || (modeval == "2"))) {
  //  if ((window.document.frmTrans.txtfavg.value == "")) {
  //    chkNull = "false";
  //    alert("Mandatory fields cannot be Null");
  //    return;
  //  }

  //  // Commission check
  //  if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
  //    if ((eval(window.document.frmTrans.txtcomm.value) == 0) ||
  //      (window.document.frmTrans.txtcomm.value == "")) {
  //      var confrm = confirm("Commission not entered.  Do you want to Continue? ")
  //      if (confrm == false) {
  //        chkNull = "false"
  //        return
  //      }
  //    }
  //  }

  //  // Service Charge check
  //  if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
  //    if ((eval(window.document.frmTrans.txtSerivceChrg.value) == 0) ||
  //      (window.document.frmTrans.txtSerivceChrg.value == "")) {
  //      var confrm = confirm("Service Charge not entered.  Do you want" +
  //        " to Continue? ")
  //      if (confrm == false) {
  //        chkNull = "false"
  //        return
  //      }
  //    }
  //  }
  //}

//  if ((vMode == "PAY") && (vSubMode == "")) {
//    if (window.document.frmTrans.txtTokenNo.value == "") {
//      chkNull = "false"
//      if (window.document.frmTrans.txtTokenNo.value == "") {
//        alert("Please enter TokenNo")
//        window.document.frmTrans.txtTokenNo.focus()
//      }
//      return
//    }
//  }
}

function OkValidations() {
  if ($("#ModuleCode").val().toUpperCase() == "SCR") {
    if (scrgridYN == "YES") {
      alert("Amount should be selected from Account Details Grid")
      //if (window.document.frmTrans.chkDispAccNo.checked == false) {
      //  window.document.frmTrans.txtAmt.value = ""
      //}
      return false;
    }
    else if (scrgridYN == "GRIDYES") {
      okValid = true;
      return true;
    }
  }
}

function MasterTabYN() {
  if ($("#ModuleCode").val() != "") {
    var strpm = "MASTTAB" + "~" + $("#ModuleCode").val().toUpperCase();

    // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function issbank() {
  if ($("#GLCode").val().length > 0) {
    var kstr = "issonbnk" + "~" + $("#GLCode").val() + "~" + $("#Branch").val() + "~INR";
    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
  }
}

function issbrnch() {
  TransMode();
  if (issonbnk != "") {
    var kstr = "issonbr";
    if ((trnMode == "4") || (trnMode == "2")) { bankCode = window.document.frmTrans.txtissbnkcode.value; }
    else if ((trnMode == "3") || (trnMode == "1")) { bankCode = window.document.frmTrans.txtbybnkcode.value; }
    else { bankCode = issonbnk; }
    kstr = kstr + "~" + remtype.toUpperCase() + "~" + bankCode;
    window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
  }
  else
    if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") || (remtype.toUpperCase() == "TT")) {
      if (trnMode == "4") { bankCode = window.document.frmTrans.txtissbnkcode.value; }
      else if (trnMode == "3") { bankCode = window.document.frmTrans.txtbybnkcode.value; }
      kstr = "issonothbr" + "~~" + bankCode;
      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
    }
    else if ((remtype.toUpperCase() == "ADD") || (remtype.toUpperCase() == "TC")) {
      if (trnMode == "4") { bankCode = window.document.frmTrans.txtissbnkcode.value; }
      else if (trnMode == "3") { bankCode = window.document.frmTrans.txtbybnkcode.value; }
      kstr = "issonothbr" + "~" + remtype.toUpperCase() + "~" + bankCode + "~" + $("#Branch").val() + "~INR";
      window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
    }
}

function customerscreen(strbut) {
  var st = strbut + "~" + window.document.frmTrans.txtbranchcode.value + "~" + "NON-CUST"

  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "custlist.aspx" + "?" + "strbut=" + st)
}

function CatCodeRtn(results) {
  window.document.frmTrans.txtAccCatCode.value = result[1];
  window.document.frmTrans.txtAccCatDesc.value = result[0];
  AccountParameters(window.document.frmTrans.txtAccCatCode.value, "CATCODE");
}

function BatchTranNo(strBatchTran) {
  var strArr = strBatchTran.split("|");
  var strVals = strArr[1].split("*");

  var noofDDs = eval($("#NoOfRepeat").val());
  var strBat;
  var intCnt = 1;

  if ((vMode == "PAY") || (vMode == "REC")) {
    noofDDs = noofDDs * 2;
  }
  for (vCnt = 0; vCnt <= noofDDs - 1; vCnt++) {
    if ((vMode == "PAY") || (vMode == "REC")) {
      strBat = strArr[0] + "~" + strVals[vCnt + 1] + "~" + strVals[strVals.length - 2] + "~" + strVals[strVals.length - 1] + "~" + strVals[vCnt + 2];
      DDRepetition(strBat);
      vCnt = vCnt + 1;
    }
    else {
      strBat = strArr[0] + "~" + strVals[vCnt + 1] + "~" + strVals[strVals.length - 2] + "~" + strVals[strVals.length - 1];
      DDRepetition(strBat);
    }
  }

  // Service Charge and Commision
  var flxRowCnt;
  var yCnt = 0;
  if ((vMode == "PAY") || (vMode == "REC")) {
    yCnt = noofDDs / 2;
    //flxRowCnt = window.document.frmTrans.Mfgpaydt.rows - 2;
  }
  else {
    yCnt = noofDDs;
    //flxRowCnt = window.document.frmTrans.Mfgpaydt.rows - 1
  }

  //if ((window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 17) == "REM") || (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 17) == "FXREM")) {
  //  if (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "1") {
  //    FlexPopulateCash(BatchNo)
  //    flexRowInsert(flxRowCnt, "Y")
  //    PrecDrCr()
  //  }
  //  else if (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "2") {
  //    if (eval(window.document.frmTrans.txtcomm.value) > 0) {
  //      window.document.frmTrans.txtcomm.value = eval(window.document.frmTrans.txtcomm.value) * yCnt
  //      FlexPopulateComm(strArr[0] + "~~" + strVals[noofDDs + 1])
  //    }
  //    if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
  //      window.document.frmTrans.txtSerivceChrg.value = eval(window.document.frmTrans.txtSerivceChrg.value) * yCnt
  //      FlexPopulateSrvCharge(strArr[0] + "~~~" + strVals[noofDDs + 2] + "~" + strVals[noofDDs + 3])
  //    }
  //    if (eval(window.document.frmTrans.txtCessChrg.value) > 0) {
  //      window.document.frmTrans.txtCessChrg.value = eval(window.document.frmTrans.txtCessChrg.value)
  //      FlexPopulateCessCharge(strArr[0] + "~~~~~" + strVals[noofDDs + 4])
  //    }
  //    if ((vMode == "PAY") || (vMode == "REC")) {
  //      //FlexPopulateCash(BatchNo)
  //      flxRowCnt = window.document.frmTrans.Mfgpaydt.rows - 2
  //      flexRowInsert(flxRowCnt, "Y")
  //      PrecDrCr()
  //    }
  //    else {
  //      FlexPopulateCash(BatchNo)
  //      flexRowInsert(flxRowCnt, "Y")
  //      PrecDrCr()
  //    }
  //  }
  //  else if ((window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "3") ||
  //    (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "5")) {
  //    flexRowInsert(flxRowCnt, "N")
  //    PrecDrCr()
  //  }
  //  else if (window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 10) == "4") {
  //    if (eval(window.document.frmTrans.txtcomm.value) > 0) {
  //      window.document.frmTrans.txtcomm.value = eval(window.document.frmTrans.txtcomm.value) * yCnt
  //      FlexPopulateComm(strArr[0] + "~~" + strVals[noofDDs + 1])
  //    }
  //    if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
  //      //window.document.frmTrans.txtSerivceChrg.value=eval(window.document.frmTrans.txtSerivceChrg.value)*yCnt
  //      window.document.frmTrans.txtSerivceChrg.value = eval(window.document.frmTrans.txtSerivceChrg.value)
  //      FlexPopulateSrvCharge(strArr[0] + "~~~" + strVals[noofDDs + 2] + "~" + strVals[noofDDs + 3])
  //    }
  //    if (eval(window.document.frmTrans.txtCessChrg.value) > 0) {
  //      window.document.frmTrans.txtCessChrg.value = eval(window.document.frmTrans.txtCessChrg.value)
  //      FlexPopulateCessCharge(strArr[0] + "~~~~~" + strVals[noofDDs + 4])
  //    }
  //    if ((eval(window.document.frmTrans.txtcomm.value) > 0) || (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
  //      flexRowInsert(flxRowCnt + 1, "Y")
  //    }
  //    else {
  //      flexRowInsert(flxRowCnt + 1, "N")
  //    }
  //    PrecDrCr()
  //  }
  //}

  //service charge and commision
  //OkClear()

  $("#NoofRepeat").val('');
  $("#REMPAN").val('');
  $("#REMMobile").val('');
  $("#REMAddress1").val('');
  $("#REMAddress2").val('');
  $("#REMAddress3").val('');
}

// Repetition of DDs
function DDRepetition(BatchNo) {
  var flexInsrtYN = "";
  var depIntacccond = true;
  if (eval($("#Amount").val() == 0)) {
    return;
  }
  //var flxRowCnt = window.document.frmTrans.Mfgpaydt.Rows
  //window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1

  //Populate(BatchNo, flxRowCnt)

  var BatchNoAuto = BatchNo.split("~");

  //with (window.document.frmTrans.Mfgpaydt) {
  //  TranMode()
  //  if (window.document.frmTrans.chkDispAccNo.checked == true) {
  //    TextMatrix(flxRowCnt, 25) = "Q"
  //    TextMatrix(flxRowCnt, 28) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 37)//Rate Type
  //    TextMatrix(flxRowCnt, 29) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 40)//Rate
  //    TextMatrix(flxRowCnt, 30) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 42)//F Currrency Code
  //    TextMatrix(flxRowCnt, 31) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 43)//F Amount
  //    TextMatrix(flxRowCnt, 32) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 19)//lnkmoduleid
  //    TextMatrix(flxRowCnt, 33) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 20)//lnkmoduledesc
  //    TextMatrix(flxRowCnt, 34) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 21)//lnkglcode
  //    TextMatrix(flxRowCnt, 35) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 22)//lnkgldesc
  //    TextMatrix(flxRowCnt, 36) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 23)//lnkacctype
  //    TextMatrix(flxRowCnt, 37) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 24)//lnkaccno
  //    TextMatrix(flxRowCnt, 38) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)//lnkaccname  

  //    TextMatrix(flxRowCnt, 43) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 50)//Responding Section Code
  //    TextMatrix(flxRowCnt, 47) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 8)
  //    TextMatrix(flxRowCnt, 48) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 9)
  //    TextMatrix(flxRowCnt, 49) = "Y"
  //    TextMatrix(flxRowCnt, 52) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 49)//Responding Bank Code
  //    TextMatrix(flxRowCnt, 58) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 38)//Rate Ref Code


  //    //TextMatrix(flxRowCnt,60)=window.document.frmTrans.mfgDisp.TextMatrix(Rselect,4)   
  //    TextMatrix(flxRowCnt, 80) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 4)
  //    TextMatrix(flxRowCnt, 81) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 10)
  //    TextMatrix(flxRowCnt, 82) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)
  //    TextMatrix(flxRowCnt, 83) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 27)
  //    TextMatrix(flxRowCnt, 84) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 28)
  //    TextMatrix(flxRowCnt, 85) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 29)

  //    TextMatrix(flxRowCnt, 86) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 35)
  //    TextMatrix(flxRowCnt, 87) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 36)

  //    TextMatrix(flxRowCnt, 88) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 39)//Ref No.
  //    TextMatrix(flxRowCnt, 89) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 41)//Ref Date
  //    TextMatrix(flxRowCnt, 90) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 44)//Corresponding Bank Code
  //    TextMatrix(flxRowCnt, 91) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 45)//Corresponding Branch Code
  //    TextMatrix(flxRowCnt, 92) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 46)//NOSTRO Debit Date
  //    TextMatrix(flxRowCnt, 93) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 47)//NOSTRO Credit Date
  //    TextMatrix(flxRowCnt, 94) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 48)//Charge Type

  //    TextMatrix(flxRowCnt, 95) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 51)//User Id.
  //    TextMatrix(flxRowCnt, 96) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 52)//Machine Id.
  //    TextMatrix(flxRowCnt, 97) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 55)//Approved By
  //    TextMatrix(flxRowCnt, 98) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 56)//Approved M/C                      
  //  }
  //  if (TextMatrix(flxRowCnt, 39) == "2") {
  //    TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtAppName.value
  //    TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtAccCatCode.value
  //    TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtAccCatDesc.value
  //  }

  //  if (vSubMode == "TPAY") {
  //    TextMatrix(flxRowCnt, 79) = "TPAY"
  //  }
  //  //-------------------------------------------Remittance   
  //  else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "1") || (TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5"))) {
  //    TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtbybnkcode.value;
  //    TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtbybnkdesc.value;
  //    TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtbybrcode.value;
  //    TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtbybrdesc.value;
  //    TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavgdr.value;
  //    TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtinstrno.value;

  //    TextMatrix(0, 64) = "Advice Rec"
  //    if (remtype != "ADD") {
  //      TextMatrix(flxRowCnt, 64) = natadv
  //      natadv = ""
  //      TextMatrix(flxRowCnt, 68) = remtype
  //      TextMatrix(0, 69) = "Native"
  //      TextMatrix(flxRowCnt, 69) = "Y"
  //      remtype = ""
  //      if (natinsdt != "") {
  //        TextMatrix(flxRowCnt, 67) = natinsdt
  //      }
  //      else {
  //        natinsdt = window.document.frmTrans.txtinstrdt.value;
  //      }
  //      TextMatrix(flxRowCnt, 67) = natinsdt
  //      natinsdt = ""
  //    }
  //    else {
  //      TextMatrix(flxRowCnt, 64) = remadv[0]
  //      TextMatrix(flxRowCnt, 65) = remadv[1]

  //      //TextMatrix(flxRowCnt,66)=remadv[2]
  //      TextMatrix(flxRowCnt, 66) = remadvdate
  //      TextMatrix(flxRowCnt, 68) = remtype
  //      TextMatrix(0, 69) = "Native"
  //      TextMatrix(flxRowCnt, 69) = "N"
  //      remtype = ""
  //      TextMatrix(0, 69) = "Native"
  //      TextMatrix(flxRowCnt, 69) = "N"
  //      if (advinstrdate != "") {

  //        TextMatrix(flxRowCnt, 67) = advinstrdate
  //      }
  //      else {
  //        advinstrdate = window.document.frmTrans.txtinstrdt.value;
  //      }
  //      TextMatrix(flxRowCnt, 67) = advinstrdate
  //      advinstrdate = ""
  //    }
  //  }

  //  //----------	
  //  //alert("YYY")
  //  else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "2") || (TextMatrix(flxRowCnt, 10) == "4"))) {
  //    //alert("1")
  //    TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
  //    window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
  //    TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtissbnkcode.value;
  //    TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtissbnkdesc.value;

  //    TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtissbrcode.value;
  //    TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtissbrdesc.value;
  //    TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavg.value;
  //    //---63nr
  //    TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
  //    TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtcustrid.value;
  //    TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtcusn.value;


  //    //new code is 
  //    if ((eval(window.document.frmTrans.txtcomm.value) > 0) &&
  //      (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
  //      TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + "," + BatchNoAuto[3]
  //      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value +
  //        "," + window.document.frmTrans.txtSerivceChrg.value
  //    }
  //    else if (eval(window.document.frmTrans.txtcomm.value) > 0) {
  //      TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + ",0"
  //      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value + ",0"
  //    }
  //    else if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
  //      TextMatrix(flxRowCnt, 67) = "0," + BatchNoAuto[2]
  //      TextMatrix(flxRowCnt, 64) = "0," + window.document.frmTrans.txtSerivceChrg.value
  //    }
  //    TextMatrix(flxRowCnt, 68) = remtype

  //    TextMatrix(flxRowCnt, 69) = window.document.frmTrans.txtPanNo.value;
  //    TextMatrix(flxRowCnt, 70) = window.document.frmTrans.txtMobile.value;
  //    TextMatrix(flxRowCnt, 71) = window.document.frmTrans.txtAddress1.value;
  //    TextMatrix(flxRowCnt, 72) = window.document.frmTrans.txtAddress2.value;
  //    TextMatrix(flxRowCnt, 73) = window.document.frmTrans.txtAddress3.value;

  //  }
  //  //-------------------------------------------Deposits

  //  else if (TextMatrix(flxRowCnt, 17) == "DEP" &&
  //    window.document.frmTrans.txtServiceId.value != "2") {
  //    TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtDOpAmt.value
  //    TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtDCurrAmt.value
  //    TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtDMatAmt.value
  //    TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtDIntAcc.value
  //    TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtDOpDate.value
  //    TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtDEffDt.value
  //    TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtDMatDt.value
  //    TextMatrix(flxRowCnt, 67) = window.document.frmTrans.txtDPaidupto.value
  //    TextMatrix(flxRowCnt, 68) = window.document.frmTrans.txtDROI.value

  //    if (flxRowCnt == 1 && window.document.frmTrans.txtServiceId.value != "2") {
  //      TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value
  //      TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value
  //      TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value
  //      TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value
  //      TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value
  //      TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value
  //      TextMatrix(flxRowCnt, 25) = "Y"
  //      TextMatrix(flxRowCnt, 26) = "Deposits"
  //    }

  //    if (window.document.frmTrans.Mfgpaydt.Rows > 1 && (servicecond == "RENEWAL" || servicecond == "CLOSING")) {

  //      TextMatrix(flxRowCnt, 32) = TextMatrix(1, 32)
  //      TextMatrix(flxRowCnt, 33) = TextMatrix(1, 33)
  //      TextMatrix(flxRowCnt, 34) = TextMatrix(1, 34)
  //      TextMatrix(flxRowCnt, 35) = TextMatrix(1, 35)
  //      TextMatrix(flxRowCnt, 37) = TextMatrix(1, 37)
  //      TextMatrix(flxRowCnt, 38) = TextMatrix(1, 38)
  //      TextMatrix(flxRowCnt, 25) = "Y"
  //      TextMatrix(flxRowCnt, 26) = "Deposits"
  //    }
  //  }
  //  //-------------------------------------------Suspense and Sundry 

  //  else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "3") ||
  //    (TextMatrix(flxRowCnt, 10) == "1"))) {
  //    var hidamt = window.document.frmTrans.hidscr.value
  //    var amt = window.document.frmTrans.txtAmt.value
  //    var diffamt = eval(hidamt) - eval(amt)
  //    TextMatrix(flxRowCnt, 79) = scrstr
  //    if (window.document.frmTrans.hidtrnno.value) {
  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
  //      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
  //      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
  //      if (eval(diffamt) > 0) {
  //        TextMatrix(flxRowCnt, 71) = "P"
  //      }
  //      else {
  //        TextMatrix(flxRowCnt, 71) = "F"
  //      }

  //    }
  //    else {
  //      TextMatrix(flxRowCnt, 60) = ""
  //      TextMatrix(flxRowCnt, 61) = ""
  //      TextMatrix(flxRowCnt, 62) = ""
  //      TextMatrix(flxRowCnt, 71) = ""

  //    }
  //  }
  //  else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
  //    var hidamt = window.document.frmTrans.hidscr.value
  //    var amt = window.document.frmTrans.txtAmt.value
  //    var diffamt = eval(hidamt) - eval(amt)
  //    TextMatrix(flxRowCnt, 79) = scrstr

  //    if (window.document.frmTrans.hidtrnno.value) {
  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
  //      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
  //      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
  //      if (eval(diffamt) > 0) {
  //        TextMatrix(flxRowCnt, 71) = "P"
  //      }
  //      else {
  //        TextMatrix(flxRowCnt, 71) = "F"
  //      }
  //    }
  //    else {
  //      TextMatrix(flxRowCnt, 60) = ""
  //      TextMatrix(flxRowCnt, 61) = ""
  //      TextMatrix(flxRowCnt, 62) = ""
  //      TextMatrix(flxRowCnt, 71) = ""
  //    }
  //  }

  //  //-------------------------------------------Loans

  //  else if ((TextMatrix(flxRowCnt, 17) == "LOAN") &&
  //    ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
  //    TextMatrix(flxRowCnt, 60) = window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value
  //    TextMatrix(flxRowCnt, 61) = window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value
  //    TextMatrix(flxRowCnt, 62) = window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value
  //    TextMatrix(flxRowCnt, 63) = window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value
  //    //window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value=""
  //    TextMatrix(flxRowCnt, 64) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value
  //    TextMatrix(flxRowCnt, 65) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value
  //  }
  //  else if ((TextMatrix(flxRowCnt, 17) == "LOAN") && ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "1"))) {
  //    TextMatrix(flxRowCnt, 60) = window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text

  //  }

  //  //-------------------------------------------Clearing

  //  // for inward clearing add clearingtype to CLG Rate Type column in grid

  //  else if (window.document.frmTrans.tranmode[2].checked == true) {
  //    TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
  //    TextMatrix(flxRowCnt, 60) = window.document.frmTrans.cmdcleartype.options
  //      (window.document.frmTrans.cmdcleartype.selectedIndex).text

  //    if (eval(window.document.frmTrans.txtServiceId.value) == "8") {

  //      TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
  //      TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
  //      TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
  //      TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
  //      TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
  //      TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtCLGBankCode.value
  //      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtCLGBranch.value
  //      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtCLGReason.value
  //      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtCLGReasoncode.value
  //      TextMatrix(flxRowCnt, 79) = "CLGOWRETURN"

  //    }
  //  }

  //  else if ((TextMatrix(flxRowCnt, 17) == "FXREM") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
  //    TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
  //    window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
  //    TextMatrix(flxRowCnt, 60) = "O"
  //    TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtfavg.value;
  //    //TextMatrix(flxRowCnt,62)=window.document.frmTrans.txtcomm.value; 
  //    TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
  //    TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtcusn.value;

  //    if (eval(window.document.frmTrans.txtcomm.value) > 0) {
  //      TextMatrix(flxRowCnt, 67) = BatchNoAuto[2]
  //    }
  //    TextMatrix(flxRowCnt, 65) = remtype
  //    remtype = ""

  //  }

  //  else {

  //  }


  //  PrecDrCr()

  //  if (window.document.frmTrans.txtModId.value != "DEP") {
  //    Depdivclear()
  //  }

  //  //------------------   

  //  if ((TextMatrix(flxRowCnt, 17) == "REM") || (TextMatrix(flxRowCnt, 17) == "FXREM")) {

  //    if (TextMatrix(flxRowCnt, 10) == "1") {
  //      FlexPopulateCash(BatchNo)
  //      flexRowInsert(flxRowCnt, "Y")
  //      PrecDrCr()
  //    }
  //    else if (TextMatrix(flxRowCnt, 10) == "2") {

  //      //New code is 
  //      if (eval(window.document.frmTrans.txtcomm.value) > 0)
  //        //FlexPopulateComm(BatchNo)

  //        if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
  //          //FlexPopulateSrvCharge(BatchNo)

  //          FlexPopulateCash(BatchNo)
  //      flexRowInsert(flxRowCnt, "Y")
  //      PrecDrCr()
  //    }
  //    else if ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5")) {
  //      //alert(flxRowCnt + 'main')
  //      flexRowInsert(flxRowCnt, "N")
  //      PrecDrCr()
  //    }
  //    else if (TextMatrix(flxRowCnt, 10) == "4") {

  //      // New code is 
  //      if (eval(window.document.frmTrans.txtcomm.value) > 0)
  //        //FlexPopulateComm(BatchNo)

  //        if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
  //          //FlexPopulateSrvCharge(BatchNo)

  //          if ((eval(window.document.frmTrans.txtcomm.value) > 0) ||
  //            (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
  //            //SetWaitMethod()

  //            if (window.document.frmTrans.txtNoOfRepeat.value > 0) {

  //              noofreap = eval(window.document.frmTrans.txtNoOfRepeat.value)

  //              intmaxval = 1000 * eval(noofreap)

  //              for (i = 1; i < intmaxval; i++) {
  //              }

  //            }

  //            flexRowInsert(flxRowCnt, "Y")

  //            if (window.document.frmTrans.txtNoOfRepeat.value > 0) {

  //              noofreap = eval(window.document.frmTrans.txtNoOfRepeat.value)

  //              intmaxval = 1000 * eval(noofreap)

  //              for (i = 1; i < intmaxval; i++) {
  //              }

  //            }
  //            //SetWaitMethod()
  //          }
  //          else {

  //            flexRowInsert(flxRowCnt, "N")
  //          }

  //      PrecDrCr()

  //    }


  //  }

  //  else if (vMode == "TRANS") {
  //    //alert( "flexRowInsert")         
  //    // alert(flxRowCnt)


  //    if ((window.document.frmTrans.tranmode[2].checked == true) && (eval(window.document.frmTrans.txtServiceId.value) == "8")) {

  //      if ((clgretchgsautoyn1 == 'Y') && (clgCommRetChrgsYN1 == 'Y')) {
  //        var confrmclg
  //        confrmclg = confirm("Do U Want To Post Clearing Return Charges Now  Y/N ? ")
  //        if (confrmclg == true) {
  //          var brCode1
  //          var strValues1
  //          var tranNosc
  //          var batchNoc
  //          var lnkmodid
  //          var lnkglcode
  //          batchNoc = ""
  //          brCode1 = window.document.frmTrans.txtbranchcode.value
  //          tranNosc = 5
  //          lnkmodid = window.document.frmTrans.txtCLGModId.value.toUpperCase()
  //          lnkglcode = window.document.frmTrans.txtCLGGLcode.value

  //          if (window.document.frmTrans.Mfgpaydt.Rows >= 2) {
  //            strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode
  //          }

  //          //alert(strValues1)
  //          window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGenclgret.aspx?strVal=" + strValues1
  //          return
  //        }
  //        else {
  //          flexRowInsert(flxRowCnt, "N")
  //        }
  //      }
  //      else {
  //        flexRowInsert(flxRowCnt, "N")
  //      }
  //    }
  //    else {
  //      flexRowInsert(flxRowCnt, "N")
  //      //  PrecDrCr()
  //    }
  //  }
  //  else if ((vMode == "PAY") || (vMode == "REC")) {
  //    //	alert("cash gl = " + vCashGlCode)
  //    FlexPopulateCash(BatchNo)
  //    flexRowInsert(flxRowCnt, "Y")
  //    PrecDrCr()
  //  }
  //  //------------------  

  //  if (flexInsrtYN != "YES") {

  //    TempTranInsrt("Transaction Failed", flxRowCnt, "1")
  //  }

  //  //OkClear()

  //  mode = "ADD"
  //}
}


















/****************** Unused Functions ********************/

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
