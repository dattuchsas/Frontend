
var vUserId = $("#UserId").val();
var vMachineId = $("#MachineId").val();
var bdt = $("#Hidden_BDT").val();
var vMode = $("#Hidden_Mode").val();
var vAppDate = $("#ApplicationDate").val();
var vCurrencyCode = $("#CurrencyCode").val();
var vSelectedModule = $("#SelectedModule").val();

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

var trnMode = "", trnDesc = "", mstTab = "NO", chkNull = true, Amount = 0, mode = '', fxTransYN = "", blnCloseLoan, abbYN;
var transTable, npaIntYN, strNPARemarks = "", strLoanBatchNo, flexInsrtYN = "", depIntacccond = true, abbApplDt, scts, blnFlagAutoClose, blnBatchLoancheck;
var excpAmt = 0, excpParmAmt = 0, excpChq, excpChqSrs, excpChqNo, excpEffDt, excpYN, excpOverDraft, excpLmtAmt, excpCodes = "";

// strsessionflds[0] - vUserId
// strsessionflds[1] - vAppdate
// strsessionflds[2] - vCounterno
// strsessionflds[3] - vCashierid
// strsessionflds[4] - vBranchCode
// strsessionflds[5] - vBrnarration
// strsessionflds[6] - vCurCode
// strsessionflds[7] - vCurnarration
// strsessionflds[8] - vMachineId

$(function () {

  $("#Branch").prop('disabled', true);
  $("#GLCode").prop('readonly', true);
  $("#Clearing").hide();

  // Add 40 empty columns
  for (var i = 0; i < 40; i++) {
    $('#transferTransactionTable thead tr').append('<th></th>');
  }

  // Mfgpaydt
  transTable = new DataTable('#transferTransactionTable', {
    responsive: true,
    autoWidth: true,
    paging: false,
    searching: false,
    info: false,
    select: true
  });

  // Row selection
  $('#myTable tbody').on('click', 'tr', function () {
    $(this).toggleClass('selected');
  });

  // var selectedData = table.row('.selected').data();

  //// Add empty cells to each row
  //$('#transferTransactionTable tbody tr').each(function () {
  //  for (var i = 0; i < 40; i++) {
  //    $(this).append('<td></td>');
  //  }
  //});

  ABBYesNo();
  TransMode(vMode, bdt);
  // NatBranch();
  DefaultValues(vAppDate, bdt);
  SumDrCrDefault();
  CashMode(vMode);
  Denom(vMode);
  OnFocus(vSelectedModule);

  // ServiceCode(vMode, mode);

  mode = "ADD";

  $("#ServiceCode").on('change', function () {
    ControlOnBlur('ServiceCode');
    ModuleList(bdt, vSelectedModule, vMode);
  });

  $("#ModuleCode").on('change', function () {
    GLCode();
    DisplayLabels(GetRadioButton(), $("#ModuleCode").val());
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

  // var mode = "ADD";

  $("#TransactionMode input[type='checkbox']:checked").on("change click", function () {
    TransMode(vMode, bdt);
    ModeChange(bdt);
    DisplayLabels(GetRadioButton(), $("#ModuleCode").val());
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
    debugger;
    if ($(this).is(':checked')) {
      $('#chequeDetails').removeClass('d-none');
    } else {
      $('#chequeDetails').addClass('d-none');
    }
  });

  $("#okBtn").on('click', function () {
    debugger;
    OkButtonClick();
  });

  $("#Amount").on('blur', function () {
    if ($("#AccountNumber").val() == '' || $("#AccountNumber").val() == '' ||
      $("#Amount").val() == '' || $("#Amount").val() == null)
      return;

    CashDrCrCheck();
    AmountCheck();
    MinBalCheck();
    AmountCheck();
    InsertIntDtls();
    AccountOpening();
    RDInstalmentCheck();
    RDAmountCheck();
    ValAmount();
    SetDrCrLienAmt();
    CheckThreshHoldLimit();
    Check194N();
  });
});

// Cash Debit Cash Credit
function CashDrCrCheck() {
  if (($("#ModuleCode").val() == "SB") || ($("#ModuleCode").val() == "CA") || ($("#ModuleCode").val() == "CC")) {
    var resmaxamt, resmaxamt1
    if ((eval($("#Amount").val()) + eval($("#TotalCashCredited").val())) > eval($("#Hidden_MaxAmount").val())) {
      resmaxamt = confirm("Total Cash Credit Is Crossing " + $("#Hidden_MaxAmount").val() + " , Do You Want To Continue Y/N");
      if (resmaxamt == true) { }
      else {
        $("#Amount").val('0.00');
        return;
      }
    }

    if ((eval($("#Amount").val()) + eval($("#TotalCashCredited").val())) > eval($("#Hidden_MaxAmount").val())) {
      resmaxamt1 = confirm("Total Cash Debit Is Crossing " + $("#Hidden_MaxAmount").val() + " , Do You Want To Continue Y/N")
      if (resmaxamt1 == true) { }
      else {
        $("#Amount").val('0.00');
        return;
      }
    }
  }
}

// To Check Amount should not be greater than balance amount
function AmountCheck() {
  if ($("#ModuleCode").val() == "SCR") {
    // var hidamt = $("#hidSCR").val();
    var scramt = $("#Amount").val();

    if (scramt) {
      if (((trnMode == "4") && (scrstr == "DR")) || ((trnMode == "3") && (scrstr == "CR"))
        || ((trnMode == "1") && (scrstr == "CR")) || ((trnMode == "2") && (scrstr == "DR"))) {
        if (eval(scramt) > eval(hidamt)) {
          bankingAlert("Amount should not be greater than : " + hidamt);
          $("#Amount").val(hidamt);
        }
      }
    }
  }

//  //-------- for clearing , serviceid ==8, clearbal < 0
//  if (GetRadioButton() == "Clearing") {
  //var clgGlCd2, clgModId
  //clgModId = window.document.frmTrans.txtCLGModId.value.toUpperCase();
  //clgGlCd2 = window.document.frmTrans.txtCLGGLcode.value.toUpperCase();

  // var overdraft2 = $("#Overdraft").val();

//    if (window.document.frmTrans.txtServiceId.value == "8") {

//      if (overdraft2 == "N") {
//        if ((clgModId == "CC") || (clgModId == "LOAN") || (clgModId == "INV") || ((clgModId == "MISC") && (clgGlCd2.substr(0, 3) == "204"))) {
//        }
//        else {

//          if (window.document.frmTrans.txtretclearbal.value < 0) {
//            alert("Clearing Balance Is Less Than Zero , No Transaction Is Posted")
//            $("#Amount").val() = "0.00"
//            return;
//          }
//        } //((clgModId=="CC") || (clgModId=="LOAN") || (clgModId=="INV") || ((clgModId=="MISC") && (clgGlCd2.substr(0,3)=="204")))
//      }
//      else {
//      } //(overdraft2 == 'N')	
//    } //(window.document.frmTrans.txtServiceId.value == "8")
//  } //(window.document.frmTrans.tranmode[2].checked==true)
}

function MinBalCheck() {
  if ((GetRadioButton() == "Debit") && ($("#ServiceCode").val() == "4") && (($("#ModuleCode").val() == "SB") || ($("#ModuleCode").val() == "CA"))) {

    if ($("#Amount").val() <= 0) {
      return;
    }

    if (eval($("#AccountBalance").val()) == eval($("#Amount").val())) {
      confm = confirm("Do You Want To close The A/C");
      if (confm == true) {
      }
      else {
        $("#Amount").val('');
      }
    }
    else {
      bankingAlert("Entered Amount Should Be Equal To A/c Bal");
      $("#Amount").val('');
      return;
    }
  }
  else {
    var overdraft = $("#Overdraft").val();
    var strOlimpyn = $("#Hidden_OlimpYN").val();

    var modId = $("#ModuleCode").val();
    var clBal, wdAmt, Balance, confm, conMsg, LmtAmt, AvbAmt, minAmt;
    var excpMinBal = "";
    var excpOverDraft = "";
    TransMode(vMode, bdt);

    if ($("#Amount").val() <= 0) {
      return;
    }
    if ((vMode == "REC") || (vSubMode == "TPAY")) {
      RecPayLmtChk();
    }
    if ((trnMode != "1") && (trnMode != "3") && (trnMode != "5")) {
      return
    }
    if (modId != "SB" && modId != "CA" && modId != "CC" && modId != "DEP" && modId != "LOAN") {
      return
    }
    wdAmt = $("#Amount").val();

    if (modId == "SB" || modId == "CA") {
      clBal = $("#ClearBalance").val();
      Balance = clBal - wdAmt;
      minAmt = pMinAmt;

      if (eval(Balance) < 0) {
        if (overdraft == 'N') {
          bankingAlert("Amount Is Greater Than Current Balance");
          $("#Amount").val('');
          return;
        }
        conMsg = "Amount less than Minimum Balance and also Creating OverDraft. Do You want to continue ?";
      }
      else {
        conMsg = "Amount less than Minimum Balance. Do You want to continue ?";
      }
    }
    else if (modId == "DEP") {
      Balance = $("#RD_CurrAmount").val();//  window.document.frmTrans.txtDCurrAmt.value;
      minAmt = wdAmt;
      conMsg = "Amount Greater than Current Balance. Do You want to continue ?";
    }
    else if (modId == "CC") {
      clBal = $("#ClearBalance").val();
      //LmtAmt=window.document.frmTrans.txtLmtAmt.value;  //txttodlimit  txtavalimit
      LmtAmt = eval($("#LimitAmount").val()) + eval($("#TODLimit").val());  //txttodlimit
      if (eval(clBal) < 0) {
        Balance = eval(LmtAmt) - eval(Math.abs(clBal));
      }
      else if (eval(clBal) > 0) {
        Balance = eval(LmtAmt) + eval(clBal);
      }
      else {
        Balance = eval(LmtAmt);
      }
      if ($("#hidCCDrYN").val() == "Y") {
        minAmt = eval(wdAmt) + eval($("#hidCCDrAmt").val());
      }
      else if ($("#hidCCCrYN").val() == "Y") {
        minAmt = eval(wdAmt) + eval($("#hidCCCrAmt").val());
      }
      else {
        minAmt = wdAmt;
      }

      if ($("#Hidden_OlimpYN").val() == "Y") {
        conMsg = "Amount Greater than Limit Amount. Do You want to continue ?";
      }
      else {
        conMsg = "Amount Greater than Limit Amount";
      }
    }
    else if (modId == "LOAN") {
      //if (window.document.frmTrans.selloantrans.value == "Principle") {
      //  Balance = window.document.frmTrans.txtloanavailbal.value;
      //  minAmt = wdAmt;
      //  conMsg = "Amount Greater than Available Amount. Do You want to continue ?";
      //}
      //else {
      //  return;
      //}
    }

    if ((modId == "SB" || modId == "CA") && eval(Balance) < 0) {
      // confm = confirm(conMsg);
      confm = confirm(conMsg);
      if (confm == true) {
        excpOverDraft = "6";
        excpMinBal = "1";
      }
      else {
        excpMinBal = "";
        excpOverDraft = "";
        $("#Amount").val('');
      }
      return;
    } //end of Overdraft & min bal check for SB/CA modules

    if (eval(Balance) < eval(minAmt)) {
      if ($("#Hidden_OlimpYN").val() == "Y") {
        confm = confirm(conMsg);
        if (confm == true) {
          excpMinBal = "1";
        }
        else {
          excpMinBal = "";
          excpOverDraft = "";
          $("#Amount").val('');
        }
      }
      else {
        bankingAlert(conMsg);
        excpMinBal = "";
        excpOverDraft = "";
        $("#Amount").val('');
      }
    }
  }
}

function AmountPrecision() {
  // precform($("#Amount").val());
  precision($("#Amount").val(), eval($("#Hidden_Precision").val()))
}

function InsertIntDtls() {
  if ($("#ModuleCode").val() != "LOAN") {
    return;
  }
  if (($("#ModuleCode").val() == "LOAN") && (GetRadioButton() == "Debit")) {
    return;
  }

  //var inttot = $("#Amount").val();
  //var strloansplit = (window.document.frmTrans.hdloandetails.value).split("|")
  //{
  //  window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = ""
  //  window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = ""
  //  window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = ""
  //  window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = ""
  //  window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = ""
  //  window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = ""
  //}
  //if (window.document.frmTrans.hdloandetails.value != "0" && window.document.frmTrans.hdloandetails.value.length > 0) {
  //  {

  //    for (var intcnt = 1; intcnt < 7; intcnt++) {
  //      {

  //        if (strloansplit[0] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value < 0) {
  //          {
  //            if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value))) {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtintpending.value)
  //              inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value)
  //            }
  //            else {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value = inttot
  //              inttot = eval(inttot) - eval(inttot)
  //            }
  //          }
  //        }
  //        else if (strloansplit[1] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value < 0) {
  //          {
  //            if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value))) {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgpending.value)
  //              inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value)
  //            }
  //            else {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value = inttot
  //              inttot = eval(inttot) - eval(inttot)
  //            }
  //          }
  //        }
  //        else if (strloansplit[2] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value < 0) {
  //          {
  //            if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value))) {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtinsurpending.value)
  //              inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value)
  //            }
  //            else {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value = inttot
  //              inttot = eval(inttot) - eval(inttot)
  //            }
  //          }
  //        }
  //        else if (strloansplit[3] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value < 0) {
  //          {
  //            if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value))) {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtnpapending.value)
  //              inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value)
  //            }
  //            else {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value = inttot
  //              inttot = eval(inttot) - eval(inttot)
  //            }
  //          }
  //        }
  //        else if (strloansplit[4] == (eval(intcnt) - 1) && eval(inttot) > 0 && window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value < 0) {

  //          {
  //            if (eval(inttot) > Math.abs(eval(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value))) {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = Math.abs(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpending.value)
  //              inttot = eval(inttot) - eval(window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value)
  //            }
  //            else {
  //              window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value = inttot
  //              inttot = eval(inttot) - eval(inttot)
  //            }
  //          }
  //        }
  //      }
  //    }
  //  }
  //  {
  //    if (eval(inttot) > 0) {
  //      window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value = inttot
  //    }
  //  }
  //  {
  //    precision(window.document.frames("iloandtls").frmloaninterestdetails.txtintamt, window.document.frmTrans.hpr.value)
  //    precision(window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt, window.document.frmTrans.hpr.value)
  //    precision(window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt, window.document.frmTrans.hpr.value)
  //    precision(window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt, window.document.frmTrans.hpr.value)
  //    precision(window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt, window.document.frmTrans.hpr.value)
  //    precision(window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt, window.document.frmTrans.hpr.value)
  //  }
  //}
}

function AccountOpening() {
  var MultVal;
  if ($("#Branch").val() == "" || $("#ModuleCode").val() == "" || $("#GLCode").val() == "" || $("#CategoryCode").val() == "" || eval($("#Amount").val()) == 0) {
    return;
  }

  if ($("#ServiceCode").val() == "2") {
    if (eval($("#Amount").val()) < eval(pMinAmt)) {
      bankingAlert("Minmum Amount to Open this type of Account is " + pMinAmt);
      $("#Amount").val('');
    }
    else if (eval($("#Amount").val()) > eval(pMaxAmt)) {
      bankingAlert("Maximum Amount to Open this type of Account is " + pMaxAmt)
      $("#Amount").val('');
    }

    if ($("#ModuleCode").val().toUpperCase() == "DEP") {
      if (eval(pMultplesOf) != "0") {
        MultVal = (eval($("#Amount").val()) % (eval(pMultplesOf)))
        if (MultVal > 0) {
          bankingAlert("Deposit Amount should be Multiples of " + pMultplesOf);
          $("#Amount").val('');
          return;
        }
      }
      if (pDUnitsYN == "Y") {
        Amount = eval($("#Amount").val());
        if (eval($("#Amount").val()) % eval(pDUnitVal) != 0) {
          bankingAlert("Deposit Amount should be multiples of Unit Value. Unit Value is : " + pDUnitVal)
          $("#Amount").val('');
          return;
        }
      }
    }

    else if ($("#SrviceCode").val() == "4") {
      if ($("#ModuleCode").val().toUpperCase() == "DEP") {
        if (eval($("#Amount").val()) > eval($("#RD_MaturityAmount").val())) {
          bankingAlert("Closing amount should not be greaterthan Maturity Amount");
          $("#Amount").val('');
        }
      }
    }
  }
}

function RDInstalmentCheck() {
  if ($("#ModuleCode").val() == "DEP" && $("#ServiceCode").val() == "1" && GetRadioButton() == "Credit") {
    if (eval($("#Amount").val()) % eval($("#UnclearBalance").val()) != 0) {
      bankingAlert("Credit Amount Should Be In Multipuls Of Instalment Amount (" + $("#UnclearBalance").val() + ") For RD")
      $("#Amount").val('0');
      precision($("#Amount").val(), $("#Hidden_Precision").val());
    }
    else {
      RDAmountCheck();
    }
  }
}

function RDAmountCheck() {
  if ($("#ModuleCode").val() == "DEP" &&
    $("#ServiceCode").val() == "1" &&
    GetRadioButton() == "Credit") {
    if (eval($("#Amount").val()) > 0) {
      st = "GETRDAMOUNTCHECK|" + $("#Branch").val() + "|INR|" + $("#ModuleCode").val() + "|" + $("#GLCode").val() + "|" + $("#AccountNumber").val() + "|" + $("#Amount").val();

      debugger;
      $.ajax({
        url: '/GetDetails/GetDetails',
        type: 'GET',
        data: {
          searchString: kstr
        },
        success: function (data) {
          popGETRDAMOUNTCHECK(data);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });

      // window.document.all['iGetDtls'].src = "getDtls1.aspx?st=" + st
    }
  }
}

function ValAmount() {
  var stWeekimpYN = $("#ImpYnWek").val();
  // var stDayimpYN = $("#ImpYnDay").val();

  if ((stWeekimpYN == "Y") && (vMode == "PAY")) {
    if ($("#ModuleCode").val() == "SB" || $("#ModuleCode").val() == "CA" || $("#ModuleCode").val() == "CC" || $("#ModuleCode").val() == "DEP" || $("#ModuleCode").val() == "LOAN") {
      //var vDayCashProced = "true";

      var strpm = "STWEKLMT" + "~" + $("#ModuleCode").val() + "~" + $("#GLCode").val() + "~" + $("#AccountNumber").val() + "~" + $("#Amount").val() + "~" +
        $("#Branch").val() + "~" + $("#ApplicationDate").val() + "~" + "N";

      debugger;
      $.ajax({
        url: '/GetDetails/MinimumBalanceCheck',
        type: 'GET',
        data: {
          searchString: strpm
        },
        success: function (data) {
          PopWeekpay(data);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });

      // DONE
      //window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
    }
  }
}

function SetDrCrLienAmt() {
  var strAppDate1 = $("#ApplicationDate").val();
  var strModeDrCr;
  var strTransAmt = $("#Amount").val();

  if (eval(strTransAmt) == 0 || strTransAmt == "") {
    return;
  }

  var strmodid1 = $("#ModuleCode").val().toUpperCase();

  if (strmodid1 != "SB" && strmodid1 != "CA") {
    return;
  }

  if (GetRadioButton() == "Debit") {
    strModeDrCr = "Dr";
  }
  else if (GetRadioButton() == "Credit") {
    strModeDrCr = "Cr";
  }
  //if (window.document.all.divRadClg.style.display == "block") {
  //  if (window.document.frmTrans.tranmode(2).checked == true) {
  //    strModeDrCr = "Dr"
  //  }
  //}

  var st = "GETDRCRLIENAMT|" + strModeDrCr + "|" + $("#Branch").val() + "|INR|" + strmodid1 + "|" + $("#GLCode").val() + "|" + $("#AccountNumber").val() + "|" +
    $("#Amount").val() + "|" + strAppDate1;

  debugger;
  $.ajax({
    url: '/GetDetails/GetDetails',
    type: 'GET',
    data: {
      searchString: st
    },
    success: function (data) {
      GETDRCRLIENAMT1(data);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });

  // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
}

function CheckThreshHoldLimit() {
  $("#Hidden_CheckThresholdLimit").val('false');
  if ($("#Hidden_ThrLmt").val() == 'Y') {
    // credit and sb/ca
    if ((GetRadioButton() == "Credit") && (($("#ModuleCode").val() == 'SB') || ($("#ModuleCode").val() == 'CA'))) {
      var st = "CheckThreshHoldLimit|" + $("#Branch").val() + "|INR|" + $("#GLCode").val() + "|" + $("#AccountNumber").val() + "|" +
        $("#ModuleCode").val() + "|" + $("#ApplicationDate").val() + "|" + $("#Amount").val();

      debugger;
      $.ajax({
        url: '/GetDetails/GetDetails',
        type: 'GET',
        data: {
          searchString: st
        },
        success: function (data) {
          GetThreshHoldLimit(data);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });

      // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
    }
  }
}

function Check194N() {
  $("#hdnCheck194N").val('false');
  if ($("#Hidden_194NYN").val() == 'Y' && vMode == 'PAY') {
    if (eval($("#Amount").val()) != 0) {
      if ((GetRadioButton() == "Debit") && (($("#ModuleCode").val() == 'SB') || ($("#ModuleCode").val() == 'CA') || ($("#ModuleCode").val() == 'CC') ||
        ($("#ModuleCode").val() == 'LOAN'))) {
        var st = "Check194N|" + $("#Branch").val() + "|INR|" + $("#GLCode").val() + "|" + $("#AccountNumber").val() + "|" +
          $("#ModuleCode").val() + "|" + vAppDate + "|" + $("#Amount").val();

        debugger;
        $.ajax({
          url: '/GetDetails/GetDetails',
          type: 'GET',
          data: {
            searchString: st
          },
          success: function (data) {
            Get194Ndtls(data);
          },
          error: function (err) {
            HandleAjaxError(err);
          }
        });

        // window.document.all['iGetDtls1'].src = "getDtls1.aspx?st=" + st
      }
    }
  }
}

function RecPayLmtChk() {
  if ($("#Branch").val().length > 0 && $("#ModuleCode").val().length > 0 && $("#GLCode").val().length > 0 && $("#AccountNumber").val().length > 0) {
    var LmtAmt = $("#Amount").val();
    if (eval(LmtAmt) > eval(pMaxRecPayAmt)) {
      pMaxRecPayAmt = gridPrecision(pMaxRecPayAmt, $("#Hidden_Precision").val());
      bankingAlert("User is not allowed to do " + $("#Hidden_Title").val() + "\n\n" + "Transactions above " + pMaxRecPayAmt);
      $("#Amount").val('');
      return;
    }
    if (vMode == "REC") {
      var cshTotAmt = $("#VtotalAmount").val() + eval($("#Amount").val())
      if (eval(cshTotAmt) > eval(MaxLimitAmt)) {
        bankingAlert("Cash Limit Exceeded");
      }
    }
  }
}

function GetRadioButton() {
  return $('input[name="TransactionMode"]:checked').val();
}

function ABBYesNo() {
  if ($("#ABBUser").val() == "Y") {
    $("#Branch").prop('disabled', false);
    $("#CheckABB").prop('disabled', false);
  }
}

function TransMode(vMode, bdt) {
  var selectedValue = $("input[name='TransactionMode']:checked").val();
  if (vMode == "TRANS") {
    if (selectedValue == "Debit") {
      trnMode = "3";
      trnDesc = "Dr Transfer";
      Amount = "-" + $("#Amount").val();
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

      Amount = $("#Amount").val();
      if (bdt.toUpperCase() == "TRUE") {
        $("#ModuleCode").val('INV');
        $("#ModuleCode").prop('disabled', true);
      }
    }
    else if (selectedValue == "Clearing") {
      trnMode = "5";
      trnDesc = "Dr Clearing";
      Amount = "-" + $("#Amount").val();
    }
  }
  else if (vMode == "REC") {
    trnMode = "2";
    trnDesc = "Cr Cash";
    Amount = $("#Amount").val();
  }
  else if (vMode == "PAY") {
    trnMode = "1";
    trnDesc = "Dr Cash";
    Amount = $("#Amount").val();

    // $("#Hidden_194NCustomerId").val($("#CustomerId").val());
    // window.document.frmTrans.hid194NCustID.value = window.document.frmTrans.txtCustId.value;
  }
}

function DefaultValues(vAppDate, bdt) {
  //$("#ServiceCode").val('1');
  $("#EffectiveDate").val(vAppDate);
  if (bdt.toUpperCase() == "TRUE") {
    $("#ModuleCode").val('INV');
    $("#ModuleCode").prop('disabled', true);
  }
}

function SumDrCrDefault() {
  $("#DebitTransactions").val(precision($("#DebitTotal").val(), $("#Hidden_Precision").val()));
  $("#CreditTransactions").val(precision($("#CreditTotal").val(), $("#Hidden_Precision").val()));
  $("#Difference").val(precision($("#Difference").val(), $("#Hidden_Precision").val()));
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

    var kstr = "REC" + "~" + $("#BranchCode").val() + "~" + vCurrencyCode + "~" + vUserId + "~" + $("#Hidden_Precision").val() + "~";

    // TODO
    // window.document.all['idenom'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "cashDenominations.aspx?kstr=" + kstr;
  }
}

function OnFocus(vSelectedModule) {
  if (vSelectedModule.toUpperCase() == "CLG") {
    $("input[name='TransactionMode'][value='Clearing']").prop('checked', true);
    //CLGDivCrDr();
  }
}

function ControlOnBlur(txtName) {
  debugger;
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
    if (vUserId != "" && vBrCode != "") {
      strVal = "COMP" + "~!~" + "txtbranchdesc" + "~!~" + vBrCode + "~!~" + vUserId;
    }
    var aBrCode = $("#BranchCode").val();
    if ((vBrCode.toUpperCase() != aBrCode.toUpperCase()) && (transTable.rows().count() == 1)) {
      $("#CheckABB").prop('checked', true);
      // window.document.frmTrans.chkDispAccNo.disabled = true
    }
    else if ((vBrCode.toUpperCase() == aBrCode.toUpperCase()) && (transTable.rows().count() == 1)) {
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
    //var r = transTable.rows().count();
    strWhr = "upper(code)='" + $("#ServiceCode").val().toUpperCase() + "'";
    strVal = "GEN" + "~!~" + "txtServiceName" + "~!~" + "GENSERVICETYPESPMT" + "~!~" + "narration" + "~!~" + strWhr;
    ServiceIdDivs();
  }

  if (strVal != "") {
    strVal = txtName + "~!~" + strVal;
    var ins = strVal.split("~!~");

    // window.document.all['iGeneral'].src = "http://GEN/genonblur.aspx?strParam=" + strVal;

    $.ajax({
      url: '/List/GenOnBlur',
      type: 'GET',
      data: {
        searchString: strVal
      },
      success: function (response) {
        GetOnBlur(response, ins[4]);
      },
      error: function (err) {
        HandleAjaxError(err);
      }
    });

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
  //    BranchCd = $("#Branch").val().toUpperCase()
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
  //    BranchCd = $("#Branch").val().toUpperCase()
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


  //      BranchCd = $("#Branch").val().toUpperCase()
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
  //      BranchCd = $("#Branch").val().toUpperCase()
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
  //    $("#ModuleCode").val() = $("#ModuleCode").val().toUpperCase()
  //    var vModId = $("#ModuleCode").val().toUpperCase()

  //    if (vBrCode != "" && vModId != "") {
  //      strVal = "COMP" + "~!~" + "txtModDesc" + "~!~" + vBrCode + "~!~" + vModId

  //      parm = window.document.frmTrans.txtModDesc.value +
  //        "-----" + $("#ModuleCode").val().toUpperCase()
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
  //    vModId = $("#ModuleCode").val().toUpperCase()
  //    vGLCode = window.document.frmTrans.txtGLcode.value.toUpperCase()

  //    if (vBrCode != "" && vModId != "" && vGLCode != "") {
  //      strVal = "COMP" + "~!~" + "txtGLDesc" + "~!~" + vBrCode + "~!~" + vModId + "~!~" + vGLCode
  //      /*if(($("#ModuleCode").val()=="REM")||($("#ModuleCode").val()=="FXREM")){
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

  var transMode = GetRadioButton();

  if (bdt.toUpperCase() == "TRUE")
    return;

  if ((selectedModule == "CLG") && (transMode == "Clearing")) {
    //if ((window.document.frmTrans.cmdcleartype.value == "Select") || (window.document.frmTrans.cmdcleartype.value == "")) {
    //    bankingAlert("Please select Clearing Type.")
    //    window.document.frmTrans.cmdcleartype.focus()
    //    return;
    //}
  }

  if (((vMode == "REC") || (vMode == "PAY")) && (mode != "MODIFY") && (transTable.rows().count() > 1)) {
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

    // DONE
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

    // DONE
    // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
  }
}

function ReturnedBack(str) {
  debugger;
  if (str == "txtGLcode") {
    if (GetRadioButton() == "Clearing") {
      if ($("#ModuleCode").val() == "REM") {
        // window.document.frmTrans.txtinstrno.focus();
      }
    }
    else {
      if ($("#ModuleCode").val() == "REM") {
        if ($("#GLCode").val() != "") {
          $("#Amount").val('0.00');
        }
      }
      else {
        if ($("#GLCode").val() != "") {
          // window.document.frmTrans.txtAccNo.focus();
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

function AccCode(vServiceId, vModuleId, vBrCode, vGLCode, vCUrrencyCode) {
  var stacc = "";
  if (vServiceId == "3" || vServiceId == "4") {
    if (transTable.rows().count() > 1) {
      bankingAlert("Post or Cancel already entered data...");
      return;
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
  if (GetRadioButton() == "Debit") {
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
  if (GetRadioButton() != "Debit")
    return;

  if (vModuleId.toUpperCase() != 'SB' && vModuleId.toUpperCase() != 'CA' && vModuleId.toUpperCase() != 'CC') {
    return;
  }

  var kstr = "CHQACCYESNO" + "~" + vModuleId + "~" + vGLCode + "~~" + "INR" + "~" + vBranchCode + "~~~" + vAccountNumber + "~";

  // DONE
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

  if (($("#Branch").val().length > 0) && ($("#Branch").val().length != aBrCode1) && (transTable.rows().count() > 1)) {
    if (transTable.cell(1, 100).data() == 'N') {
      var strpm = "ABBAPPLDATE" + "~" + $("#Branch").val();

      // DONE
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

function GetBranchParams(strBrCode) {
  var strpm = "";
  var strBrid = $("#ModuleCode").val().toUpperCase();
  if (strBrCode.length > 0) {
    strpm = "CHQVALIDPERIODLENDY" + "~" + strBrCode + "~" + strBrid;
    // TODO
    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function AccountParameters(AccNoOrCatCode, AccOrCat) {

  var vBrCode = $("#Branch").val();
  var vModuleId = $("#ModuleCode").val()?.toUpperCase();
  var vGLCode = $("#GLCode").val().toUpperCase().split(" - ")[0];
  var vAppDate = $("#ApplicationDate").val();
  var vMachineId = $("#MachineId").val();
  //var vAccNo = $("#AccountNumber").val();
  //var vServiceCode = $("#ServiceCode").val();

  if (vModuleId != "SB" && vModuleId != "CA" && vModuleId != "DEP" && vModuleId != "LOAN" && vModuleId != "CC")
    return;
  if ((vBrCode == "") || (vAppDate == "") || (vModuleId == "") || (vMachineId == "") || (vGLCode == "") || (vUserId == "") || (AccNoOrCatCode == "")) {
    return;
  }
  debugger;
  var strPrm = "ACCOUNT" + "~" + vModuleId + "~" + vGLCode + "~" + vAppDate + "~INR~" + vBrCode + "~" + vUserId + "~" + vMachineId + "~" + AccNoOrCatCode + "~" + AccOrCat;

  // DONE
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

function BalanceDetails(vServiceId, vBrCode, vModuleId, vGLCode, vAccNo, vCurrencyCode) {
  debugger;
  if (eval(vServiceId != "8")) {
    if (vBrCode.length > 0 && vCurrencyCode.length > 0 && vModuleId.length > 0 && vGLCode.length > 0 && vAccNo.length > 0) {
      var kstr = vBrCode + "~" + vCurrencyCode + "~" + vModuleId + "~" + vGLCode + "~" + vAccNo + "~";
      if (eval($("#ServiceCode").val() != "2")) {

        // DONE
        // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplay.aspx?kstr=" + kstr
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
  //    // TODO
  //    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "balDetDisplayret.aspx?kstr=" + kstr
  //  }
  //}
}

function GetPendingInterest(vModuleId, vBrCode, vGLCode, vAccNo) {
  debugger;
  if ((vModuleId == "LOAN") && (GetRadioButton() == "Credit")) {
    st = vBrCode + "|" + "INR" + "|LOAN|" + vGLCode + "|" + vAccNo;
    // TODO
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
      GetCheck206AA206AB(response);
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

function SetDrCrLienYN() {
  var strModeDrCr = "";

  if ($("#ModuleCode").val() != "SB" && $("#ModuleCode").val() != "CA") {
    return;
  }

  if (GetRadioButton() == "Debit") {
    strModeDrCr = "Dr";
  }
  else if (GetRadioButton() == "Credit") {
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
function Deppopaccnodetails(kstr) {

  var balstr = kstr.split("|");

  AssignAndShow('RD_OpAmount', precision(balstr[1], $("#Hidden_Precision").val()));
  AssignAndShow('RD_CurrAmount', precision(balstr[0], $("#Hidden_Precision").val()));
  AssignAndShow('RD_MaturityAmount', precision(balstr[2], $("#Hidden_Precision").val()));

  var deprendiffamt = eval($("#RD_MaturityAmount").val()) - eval($("#RD_OpAmount").val());

  AssignAndShow('CustomerId', balstr[3]);
  debugger;
  // alert(balstr[3]);
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

  // DONE
  // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "msgcnt.aspx?strVal=" + strValues

  $.ajax({
    url: '/GetDetails/GetMessageCount',
    type: 'GET',
    data: {
      searchString: balstr[3]
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

  var remCreditList = ["REMBank", "REMBranch", "REMFavouring", "REMCommission", "REMRecipientName", "REMGST", "REMCESS", "REMPAN", "REMMobile", "REMAddress1", "REMAddress2",
    "REMAddress3"];

  var listToHide = ["ClearBalance", "UnclearBalance", "AccountBalance", "OperationInstruction", "OperatedBy", "PendingBalance", "CustomerId", "LimitAmount", "TotalCashDebited",
    "TotalCashCredited", "LimitExpiryDate", "GSTIN", "TODLimit", "AvailableLimit", "SanctionAmount", "DisbursementAmount", "PendingIntAmount", "InterestAmount",
    "NPAIntAmount", "PendingInstallments", "RD_OpAmount", "RD_OpDate", "RD_ROI", "RD_CurrAmount", "RD_EffectiveDate", "", "RD_MaturityAmount", "RD_MaturityDate",
    "RD_IntAccr", "RD_IntPaidUpto", "REMBank", "REMBranch", "REMFavouring", "REMCommission", "REMRecipientName", "REMGST", "REMCESS", "REMPAN", "REMMobile",
    "REMAddress1", "REMAddress2", "REMAddress3"];

  if (vModuleCode == "SB" && (transMode == "Debit" || transMode == "Credit")) {
    HideAllLabels(listToHide);
    ShowLabels(sbDebitList);
  }

  if (vModuleCode == "LOAN" && (transMode == "Debit" || transMode == "Credit")) {
    HideAllLabels(listToHide);
    ShowLabels(loanDebitList);
  }

  if (vModuleCode == "CC" && (transMode == "Debit" || transMode == "Credit")) {
    HideAllLabels(listToHide);
    ShowLabels(ccDebitList);
  }

  if (vModuleCode == "DEP" && (transMode == "Credit")) {
    HideAllLabels(listToHide);
    ShowLabels(depCreditList);
  }

  if (vModuleCode == "REM" && (transMode == "Credit")) {
    debugger;
    HideAllLabels(listToHide);
    ShowLabels(remCreditList);
  }
}

function ShowLabels(divList) {
  debugger;
  divList.forEach(function (id) {
    $("." + id).removeClass("d-none");
  });
}

function HideAllLabels(divList) {
  if (!Array.isArray(divList)) return;

  const validClasses = divList.filter(
    cls => typeof cls === "string" && cls.trim() !== ""
  );

  if (validClasses.length === 0) return;

  $("." + validClasses.join(", .")).addClass("d-none");
}

function LoadPhotoAndSign(customerId) {
  // alert(customerId);
  // Photo Call
  $.ajax({
    url: '/GetDetails/GetCustomerPhoto',
    type: 'GET',
    data: {
      searchString: customerId
    },
    success: function (response) {
      debugger;
      alert(response);
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
      alert(response);
      $("#CustomerSign").attr("src", "data:image/jpg;base64, " + response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });
}

function excpTranCheck() {
  if (mode == "MODIFY") {
    excptionAmt();
  }
  // For Parameter Amount
  if (Math.abs(eval(Amount)) > eval(excpAmt)) {
    excpParmAmt = "3";
  }
  else {
    excpParmAmt = "";
  }
  // For Application Date
  if ($("#EffectiveDate").val() == $("#ApplicationDate").val()) {
    excpEffDt = "";
  }
  else {
    excpEffDt = "5";
  }
}

function excptionAmt() {
  TransMode(vMode, bdt);
  var strpm = "EXCPAMT" + "~INR~" + $("#ModuleCode").val() + "~" + $("#GLCode").val() + "~" + trnMode;

  // TODO
  // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
}

function MinBalCheck_modify() {
  var modId = $("#ModuleCode").val();
  var clBal, wdAmt, Balance, confm, conMsg, LmtAmt, AvbAmt, minAmt
  excpMinBal = "";
  excpOverDraft = "";

  if ((vMode == "REC") || (vSubMode == "TPAY")) {
    RecPayLmtChk();
  }
  if ((trnMode != "1") && (trnMode != "3")) {
    return
  }
  if (modId != "SB" && modId != "CA" && modId != "CC" && modId != "DEP" && modId != "LOAN") {
    return
  }

  wdAmt = $("#Amount").val();

  if (modId == "SB" || modId == "CA") {
    clBal = $("#ClearBalance").val();
    Balance = clBal - wdAmt;
    minAmt = pMinAmt;
  }
  else if (modId == "DEP") {
    Balance = $("#RD_CurrAmount").val();
    minAmt = wdAmt;
  }
  else if (modId == "CC") {
    clBal = $("#ClearBalance").val();
    LmtAmt = $("#LimitAmount").val();
    if (clBal < 0) {
      Balance = LmtAmt - Math.abs(clBal);
    }
    else {
      Balance = LmtAmt;
    }
    minAmt = wdAmt;
  }
  else if (modId == "LOAN") {
    //if (window.document.frmTrans.selloantrans.value == "principle") {
    //  Balance = window.document.frmTrans.txtloanavailbal.value;
    //  minAmt = wdAmt;
    //}
    //else { return }
  }

  if ((modId == "SB" || modId == "CA") && eval(Balance) < 0) {
    excpOverDraft = "6";
    excpMinBal = "1";
    return;
  }

  if (eval(Balance) < eval(minAmt)) {
    excpMinBal = "1";
  }
}

function TotTranNos() {
  TransMode(vMode, bdt);
  if (($("#ModuleCode").val() == "REM") || ($("#ModuleCode").val() == "FXREM")) {
    if (trnMode == "4") {
      //new code is 
      tranNos = 1;

      if (eval(window.document.frmTrans.txtcomm.value) > 0)
        tranNos = tranNos + 1;

      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
        tranNos = tranNos + 2;

      if (eval(window.document.frmTrans.txtCessChrg.value) > 0)
        tranNos = tranNos + 1;

      tranNos = "" + tranNos;
    }
    else if (trnMode == "2") {

      //new code is 
      tranNos = 2;

      if (eval(window.document.frmTrans.txtcomm.value) > 0)
        tranNos = tranNos + 1;

      if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
        tranNos = tranNos + 2;

      if (eval(window.document.frmTrans.txtCessChrg.value) > 0)
        tranNos = tranNos + 1;

      tranNos = "" + tranNos;
    }
    else if (trnMode == "3") {
      tranNos = "1";
    }
    else if (trnMode == "1") {
      tranNos = "2";
    }
    return;
  }

  if (vMode == "TRANS") {
    tranNos = "1";
  }
  else if (vMode == "PAY") {
    tranNos = "2";
  }
  else if (vMode == "REC") {
    tranNos = "2";
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


  if ((modId == "REM") && (GetRadioButton() == "Debit" || GetRadioButton() == "Clearing")) {
    //divsDisplay("remdr", "M")
    //window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Issued by Branch Code |< Issued by Branch Desc|< Favouring        |>Instrument No    |>Advice Recceived|>Advice No.   |^Advice Rec Date|^Instrument Date|<Instrument Type|<Native Y/N"
  }

  else if (modId == "REM" && GetRadioButton() == "Credit") {
    //divsDisplay("remcr", "M")
    //window.document.all.divComm.style.display = "block";
    //window.document.all['divfxRem'].style.display = "block";
    //window.document.all['divrembank'].style.display = "block";
    //window.document.all['divRemRep'].style.display = "block";

    if ((CashDenom == 'Y') && (vMode == "REC")) {
    //  window.document.frmTrans.chkRemRepeat.disabled = true
    //  window.document.frmTrans.txtNoOfRepeat.disabled = true
    }
    else {
    //  window.document.frmTrans.chkRemRepeat.disabled = false
    //  window.document.frmTrans.txtNoOfRepeat.disabled = false
    }
  }
  else if ((modId == "FXREM") && (GetRadioButton() == "Credit")) {
    //divsDisplay("remcr", "M")
    //window.document.all.divComm.style.display = "block";
    //window.document.all['divfxRem'].style.display = "block";
    //window.document.all['divrembank'].style.display = "none";
  }
  // suspence start
  else if (modId == "SCR") {
    //divsDisplay("divaccno", "M")

  //  window.document.all['divcheque'].style.display = "none";
  //  window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |^ Contra Date |>Contra Batch No       |>Contra Tran No       |>Appl's Name |>Cust Id      "
  }
  // Loan end
  else if ((modId == "LOAN") && (GetRadioButton() == "Debit")) {
    //divsDisplay("loandtls", "M")
    //window.document.all['divaccno'].style.display = "block";
    //window.document.all.loanintdtls.style.display = "block"
    //window.document.frmTrans.selloantrans.style.display = "block";
    LoanTransaction();
    InsertLoan();
    //  window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>                  |>             |>             |>               |>               |>             |>           "
    //  window.document.frmTrans.Mfgpaydt.TextMatrix(0, 44) = "Loan Trans"
  }
  else if ((modId == "LOAN") && (GetRadioButton() == "Credit")) {
    //divsDisplay("loandtls", "M")
    //window.document.all['divaccno'].style.display = "block";
    //window.document.all.loanintdtls.style.display = "block"
    LoanTransaction();
    InsertLoan();
    //window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Interest Amount |> Charges Amount |> Insurance Amount |>NPA Amount       |>Principalamount       |>Excessamount |>Cust ID      "
  }
  else if (modId == "DEP") {
    //divsDisplay("divDepDtls", "M")
    //  window.document.all['divaccno'].style.display = "block";
    //  window.document.frmTrans.Mfgpaydt.FormatString = ">Batch No     |>Tran No     |<GL Code       |<GL Description                       |>Acc No             |<Name                               |>Amount                     |>Entered Time Bal    |^Application Date   |<Cust ID                      |<Mode of Tran |<Mode of Tran Desc   |^ABB Application Date|<Tran Status  |>Currency Code   |<Entered By                    |<Entered M/C                  |<Module ID         |<Branch Code            |>Token No         |<Remarks                                  |<Cheque Series   |>Cheque No                 |^Cheque Date         |<Cheque Favouring              |<Sys Gen YN |<Module Description      |^ Effective Date        |<CLG Rate Type                |>Rate                   |<F Currency Code |>F Amount                   |<Link Module ID       |<Link Module Desc         |<Link GL Code   |<Link GL Desc            |>Link Account Type |>Link Account No |<Link Acc Name                   |>Service ID |<Service Desc  |<Resp Branch Code |<Resp Branch Desc          |<Resp Section Code |<Resp Section Desc        |<ABB Branch Code          |<Branch Desc                    |>Disposal Batch No |>Disposal Tran No  |<Acc Chk YN|Exception YN|Exception Codes|>Resp Bank Code|<Resp Bank Desc|<SI YN|>Counter No.|<Cashier Id               |>Scroll No.      |<Rate Ref Code     |<Rate Ref Desc     |>Opening Amount  |> Current Amount |> Maturity Amount |>Int Accrued       |>Opening Date       |>Effective Date |>Maturity Date  |>Int. Paid Upto |>ROI     "
  }
  else if (modId == "SI" && vMode != "REC") {
    var cnfrm = confirm("Do you want to Execute Standing Instructions ?");
    if (cnfrm == true) {
      SIGLCode();
    }
    else {
      $("#ModuleCode").val('');
    }
  }
  else {
    //alert("trnsfer")
    //divsDisplay("trnsfer", "M")
    AssignAndShow('PendingBalance', '');
    
    //window.document.all['divaccno'].style.display = "block";
    //window.document.all['divcheque'].style.display = "block";
    if ($("#ModuleCode").val() == "SB" || $("#ModuleCode").val() == "CA" || $("#ModuleCode").val() == "CC") {
      // window.document.frmTrans.all.trcctod.style.display = "block"
    }
    else {
      // window.document.frmTrans.all.trcctod.style.display = "none"
    }

    if ($("#ModuleCode").val() == "CC") {
      // window.document.frmTrans.all.trcctod1.style.display = "block"
    }
    else {
      // window.document.frmTrans.all.trcctod1.style.display = "none"
    }
  }
  ServiceIdDivs();
  //code added by Radhika on 12 May 2008
  GetModDets();

  if ((modId == "REM") && (GetRadioButton() == "Credit")) {
  }
}

// To select CheckBook Check box, when modules are CC,CA,SB in Debit Tran mode
function GetModDets() {
  if (eval($("#ServiceCode").val() != "1")) {
    return;
  }
  if (GetRadioButton() != "Debit")
    return;

  if ($("#ModuleCode").val().toUpperCase() != 'SB' && $("#ModuleCode").val().toUpperCase() != 'CA' && $("#ModuleCode").val().toUpperCase() != 'CC') {
    return;
  }

  var kstr = "CHQYESNO" + "~" + $("#ModuleCode").val() + "~~~INR~" + $("#Branch").val() + "~~~";

  // TODO
  // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genParameters.aspx?strparam=" + kstr
}

function LoanTransaction() {
  var strpm = "loantrantype";
  // TODO
  // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
}

function InsertLoan() {
  var strqry = "frmtrans" + "|" + "loanpreference";
  // TODO
  // window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "cashloangetdtls.aspx" + "?" + "strqry=" + strqry
}

function SIGLCode() {
  // lockControls()
  var strpm = "SIGLCODE" + "~" + $("#Branch").val().toUpperCase() + "~" + $("#ModuleCode").val().toUpperCase();
  // TODO
  // window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  //window.status="Executing Standing Instructions......"
}

//function to get cash balance of current user
function GetCashierBalance() {
  var strBrCode = $("#Branch").val();
  var strCurCode = "INR";
  if ((strBrCode.length > 0) && (strCurCode.length > 0)) {
    strBrCode = $("#BranchCode").val();
    var strpm = "BALANCEATCASHIER" + "~" + strBrCode + "~" + strCurCode + "~" + vUserId;
    // TODO
    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function CloseLoanAuto() {
  var brcodeclln
  brcodeclln
  if ($('#CheckABB').is(':checked') == false) {
    brcodeclln = $("#Branch").val();
  }
  else {
    brcodeclln = "ABB";
  }
  var sBatch = ""

  //if (transTable.row().count() >= 2) {
  //  sBatch = window.document.frmTrans.Mfgpaydt.textmatrix(1, 0)
  //}

  var st = "POSTINTEREST|" + brcodeclln + "|INR|" + $("#ModuleCode").val() + "|" + $("#GLCode").val() + "|" + $("#AccountNumber").val() + "|" +
    $("#Amount").val() + "|" + vMode + "|" + npaIntYN + "|" + sBatch;

  $.ajax({
    url: '/GetDetails/GetDetails',
    type: 'GET',
    data: {
      searchString: st
    },
    success: function (response) {
      debugger;
      populateInterest(response);
    },
    error: function (err) {
      HandleAjaxError(err);
    }
  });
  
  // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
  return;
}

// Checks wether the transaction is exceptional one or not.
function exceptionCodes() {
  excpYN = "N";
  if (excpMinBal != "") {
    excpCodes = excpMinBal + "^";
    excpYN = "Y";
  }
  if (excpLmtAmt != "") {
    excpCodes = excpCodes + excpLmtAmt + "^";
    excpYN = "Y";
  }
  if (excpParmAmt != "") {
    excpCodes = excpCodes + excpParmAmt + "^";
    excpYN = "Y";
  }
  excpChq = ""
  if (excpChqSrs != "" || excpChqNo != "") {
    excpChq = "4";
    excpCodes = excpCodes + excpChq + "^";
    excpYN = "Y";
  }
  if (excpEffDt != "") {
    excpCodes = excpCodes + excpEffDt + "^";
    excpYN = "Y";
  }
  if (excpOverDraft != "") {
    excpCodes = excpCodes + excpOverDraft + "^";
    excpYN = "Y";
  }
}

function Cancel() {
  $("#Branch").val($("#BranchCode").val());
  //formClear()
  //NatBranch()

  //transTable.row().count() = 1;
  //window.document.frmTrans.cmdPost.disabled = false
  SumDrCrDefault();

  AssignAndShow('DebitTotal', '0');
  AssignAndShow('CreditTotal', '0');
  //window.document.frmTrans.txtTotDebit.value = "0";
  //window.document.frmTrans.txtTotCredit.value = "0";
  chkboxUnCheck();
  DefaultValues()
  if (vMode == "REC") {
    GetCashierBalance()
  }
}

//This function is used to check for mandatory field values. 
function checkNulls(modId, modeval, serId) {
  //for General Mandatory fields
  chkNull = "true";

  //if ((window.document.frmTrans.tranmode[2].checked == true) &&
  //  (window.document.frmTrans.cmdcleartype.selectedIndex < 1)) {
  //  alert("Please Select Clearing Type")
  //  chkNull = "false"
  //  return
  //}

  if ($("#Branch").val() == "" || $("#ModuleCode").val() == "" || $("#GLCode").val() == "" || eval($("#Amount").val() == 0)) {
    chkNull = "false";

    if ($("#Branch").val() == "") {
      bankingAlert("Please enter Branch Code");
      return;
    }

    if ($("#ModuleCode").val() == "") {
      bankingAlert("Please enter Module id Code");
      return;
    }

    if ($("#Amount").val() == "") {
      bankingAlert("Please enter Amount");
      return;
    }
  }

  // for deposit opening categorycode,application name   new
  if (GetRadioButton() == "Credit" && serId == "2") {
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
  if (GetRadioButton() == "Clearing" || (serId == "2") || (mstTab == "NO") || (modId == "REM")) {
  }
  else {
    if ($("#AccountNumber").val() == "") {
      chkNull = "false";
      bankingAlert("Please enter the Accnount Number");
      return;
    }
  }

  // For Cheques
  if ($("#CheckCheque").is('checked')) {
    //if((window.document.frmTrans.txtChqSrs.value=="")||
    if ($("#ChequeNo").val() == "" || $("#ChequeDate").val() == "") {
      chkNull = "false";
      if ($("#ChequeNo").val() == "") {
        bankingAlert("Please enter Cheque number");
      }

      if ($("#ChequeDate").val() == "") {
        bankingAlert("Please enter Cheque Date");
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


  ////for Loans  
  //if ((modId == "LOAN") && (modeval == "3")) {
  //  if (window.document.frmTrans.selloantrans.value == "Select") {
  //    chkNull = "false";
  //    alert("Mandatory fields cannot be Null");
  //    return;
  //  }
  //}

  // Remittance 
  if (((modId == "REM") && (modeval == "4")) || ((modId == "REM") && (modeval == "2"))) {

    if ($("#Remm_IssuedOnBank").val() == "" || $("#Remm_IssuedOnBranch").val() == "" || $("#Remm_Favouring").val() == "") {
      chkNull = "false";

      if ($("#Remm_IssuedOnBank").val() == "") {
        bankingAlert("Please enter Issued Bank Code");
      }

      if ($("#Remm_IssuedOnBranch").val() == "") {
        bankingAlert("Please enter Issued Branch Code");
      }
      return;
    }

    //// Commision check
    //if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
    //  if (eval($("#Remm_Commission").val()) == 0 || $("#Remm_Commission").val() == "") {
    //    var confrm = confirm("Commission not entered.  Do you want to Continue? ");
    //    if (confrm == false) {
    //      chkNull = "false";
    //      return;
    //    }
    //  }
    //} 

    //// Service Charge check	     
    //if ((window.document.frmTrans.chkDispAccNo.checked == false) && (mode != "MODIFY")) {
    //  if ((eval(window.document.frmTrans.txtSerivceChrg.value) == 0) ||
    //    (window.document.frmTrans.txtSerivceChrg.value == "")) {
    //    var confrm = confirm("Service Charge not entered. Do you want" + " to Continue? ")
    //    if (confrm == false) {
    //      chkNull = "false";
    //      return;
    //    }
    //  }
    //}
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
      bankingAlert("Amount should be selected from Account Details Grid")
      //if (window.document.frmTrans.chkDispAccNo.checked == false) {
      //  $("#Amount").val() = ""
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
    // TODO
    // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

function MasterTabRtn(strMstTab) {
  mstTab = "YES";
  if ((strMstTab == "N") || (window.document.frmTrans.txtServiceId.value == 2)) {
    //window.document.all['divaccno'].style.display = "none";
    mstTab = "NO"
  }
  else {
    //window.document.all['divaccno'].style.display = "block";
    mstTab = "YES"
  }
}

function issbank() {
  if ($("#GLCode").val().length > 0) {
    var kstr = "issonbnk" + "~" + $("#GLCode").val() + "~" + $("#Branch").val() + "~INR";
    // TODO
    // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
  }
}

function issbrnch() {
  TransMode(vMode, bdt);
  if (issonbnk != "") {
    if ((trnMode == "4") || (trnMode == "2")) {
      bankCode = $("#REMBank").val();
    }
    else if ((trnMode == "3") || (trnMode == "1")) {
      // bankCode = window.document.frmTrans.txtbybnkcode.value;
    }
    else {
      bankCode = issonbnk;
    }
    var kstr = "issonbr" + "~" + remtype.toUpperCase() + "~" + bankCode;
    // TODO
    // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
  }
  else
    if ((remtype.toUpperCase() == "DD") || (remtype.toUpperCase() == "MT") || (remtype.toUpperCase() == "TT")) {
      if (trnMode == "4") {
        bankCode = $("#REMBank").val();
      }
      else if (trnMode == "3") {
        // bankCode = window.document.frmTrans.txtbybnkcode.value;
      }
      var kstr = "issonothbr" + "~~" + bankCode;
      // TODO
      // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
    }
    else if ((remtype.toUpperCase() == "ADD") || (remtype.toUpperCase() == "TC")) {
      if (trnMode == "4") {
        bankCode = $("#REMBank").val();
      }
      else if (trnMode == "3") {
        // bankCode = window.document.frmTrans.txtbybnkcode.value;
      }
      var kstr = "issonothbr" + "~" + remtype.toUpperCase() + "~" + bankCode + "~" + $("#Branch").val() + "~INR";

      // TODO
      // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
    }
}

function customerscreen(strbut) {
  var st = strbut + "~" + $("#Branch").val(); + "~" + "NON-CUST";
  // TODO
  // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "custlist.aspx" + "?" + "strbut=" + st)
}

// Repetition of DDs
function DDRepetition(BatchNo) {
  var flexInsrtYN = "";
  var depIntacccond = true;
  if (eval($("#Amount").val() == 0)) {
    return;
  }
  //var flxRowCnt = transTable.row().count()
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
  //      TextMatrix(flxRowCnt, 32) = $("#ModuleCode").val()
  //      TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value
  //      TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value
  //      TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value
  //      TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value
  //      TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value
  //      TextMatrix(flxRowCnt, 25) = "Y"
  //      TextMatrix(flxRowCnt, 26) = "Deposits"
  //    }

  //    if (transTable.row().count() > 1 && (servicecond == "RENEWAL" || servicecond == "CLOSING")) {

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
  //    var hidamt = $("#hidSCR").val();
  //    Amount = $("#Amount").val()
  //    var diffamt = eval(hidamt) - eval(Amount)
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
  //    var hidamt = $("#hidSCR").val();
  //    Amount = $("#Amount").val()
  //    var diffamt = eval(hidamt) - eval(Amount)
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

  //  if ($("#ModuleCode").val() != "DEP") {
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
  //          brCode1 = $("#Branch").val()
  //          tranNosc = 5
  //          lnkmodid = window.document.frmTrans.txtCLGModId.value.toUpperCase()
  //          lnkglcode = window.document.frmTrans.txtCLGGLcode.value

  //          if (transTable.row().count() >= 2) {
  //            strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode
  //          }

  //          //alert(strValues1)
  //          // TODO
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

function CashGLCode() {
  // DONE
  // window.document.all['iCommon'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm

  if ($("#Branch").val().length > 0) {
    var strpm = "CASHGL" + "~" + $("#Branch").val();
    $.ajax({
      url: '/GetDetails/MinimumBalanceCheck',
      type: 'GET',
      data: {
        searchString: strpm
      },
      success: function (data) {
        debugger;
        CashCode(data);
      }
    });
  }
}

function RecPayLmt() {
  var strpm = "RPLMT" + "~" + $("#Branch").val() + "~INR~" + vUserId;
  $.ajax({
    url: '/GetDetails/MinimumBalanceCheck',
    type: 'GET',
    data: {
      searchString: strpm
    },
    success: function (data) {
      debugger;
      RecLimit(data);
    }
  });
}

function TDSDetails() {
  if ($("#Branch").val() == "") {
    bankingAlert("Select Branch.");
    return;
  }
  if ($("#ModuleCode").val() == "") {
    bankingAlert("Select Module.");
    return;
  }
  if ($("#GLCode").val() == "") {
    bankingAlert("Select GL Code.");
    return;
  }
  if ($("#AccountNumber").val() == "") {
    bankingAlert("Enter Account Number.");
    return;
  }
  var st = "TDSDetails~" + $("#Branch").val() + "~INR~" + $("#GLCode").val() + "~" + $("#AccountNumber").val() + "~" + $("#ModuleCode").val() + "~" +
    $("#ApplicationDate").val() + "~" + $("#Amount").val();

  window.showModalDialog("TDSDetails.aspx?st=" + st);
}

function GETCCDRCRLIENYN1(str) {
  var kStr = str.split("|")
  $("#hidCCDrYN").val(kStr[0]);  // DR Lien YN
  $("#hidCCDrAmt").val(kStr[1]); // DR Lien amount
  $("#hidCCCrYN").val(kStr[2]);  // CR Lien YN
  $("#hidCCCrAmt").val(kStr[3]); // CR Lien amount
}

function ServiceIdDivs() {
  // For clearing outward returns
  //  window.document.frmTrans.cmdModId.disabled = false
  //  byBranch.innerHTML = "Issued by Branch"
  //  byBank.innerHTML = "Issued by Bank"

  if (eval($("#ServiceCode").val()) == "8") {
    debugger;
    // CLGClearDiv();
    // paramAcc();
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


/****************** Button Actions ********************/

function OkButtonClick() {
  debugger;
  var strValues;
  var brCode;
  blnFlagAutoClose = false
  blnBatchLoancheck = false

  //this code added by vinod for close loans where 0 balance in accounts
  if (GetRadioButton() == "Credit" && $("#ModuleCode").val() == "LOAN") {
    if (CashDenom == 'Y') {
      // window.document.frmTrans.hdnMod.value = $("#ModuleCode").val();
    }

    if (Math.abs($("#AccountBalance").val()) == Math.abs($("#Amount").val())) {
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

            if (!(($("#NAPIntAmount").val() == "") || eval($("#NAPIntAmount").val() == 0))) {
              blnNpaInt = true;
              npaIntYN = "Y";
              if ((Math.abs($("#AccountBalance").val()) == Math.abs($("#Amount").val())) || (parseFloat($("#Amount").val()) > parseFloat($("#NAPIntAmount").val()))) {
                bankingAlert("NPA Interest for This Account is " + $("#NAPIntAmount").val() + ", This Amount Adjusted to Loan");
              }
              if (parseFloat($("#Amount").val()) <= parseFloat($("#NAPIntAmount").val())) {
                bankingAlert("NPA Interest for This Account is " + $("#NAPIntAmount").val() + ", This Amount " + $("#Amount").val() + " Adjusted to Loan");
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
        blnFlagAutoClose = false;
        blnBatchLoanClose = false;
        CloseLoanAuto();
      }
    }
    else if (Math.abs($("#Amount").val()) > Math.abs($("#AccountBalance").val())) {
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
      if (!(($("#NPAIntAmount").val() == "") || eval($("#NPAIntAmount").val() == 0))) {
        blnNpaInt = true;
        npaIntYN = "Y";
        if ((Math.abs($("#AccountBalance").val()) == Math.abs($("#Amount").val())) || (parseFloat($("#Amount").val()) > parseFloat($("#NPAIntAmount").val()))) {
          bankingAlert("NPA Interest for This Account is " + $("#NPAIntAmount").val() + ", This Amount Adjusted to Loan");
        }
        if (parseFloat($("#Amount").val()) <= parseFloat($("#NPAIntAmount").val())) {
          bankingAlert("NPA Interest for This Account is " + $("#NPAIntAmount").val() + ", This Amount " + $("#Amount").val() + " Adjusted to Loan");
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
      bankingAlert("Exceptional Transactions are not allowed");
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

  if (((vMode == "REC") || (vMode == "PAY")) && (mode != "MODIFY") && (transTable.row().count() > 1)) {
    bankingAlert("Only one Cash Transaction allowed at a time." + "\n" + "Post already entered data.")
    return;
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
  //var clgModId, clgGlCd2
  //clgModId = window.document.frmTrans.txtCLGModId.value.toUpperCase();
  //clgGlCd2 = window.document.frmTrans.txtCLGGLcode.value.toUpperCase();
  //var overdraft2
  //overdraft2 = "<%=ovrdrft%>";

  var batchNo = "";

  // Genaral Batch No genration
  if (GetRadioButton() == "Debit" || GetRadioButton() == "Credit") {
    if (mode != "MODIFY") {
      debugger;
      if (transTable.row().count() == 0) {
        if (($("#Hidden_194NYN").val() == 'Y') && (vMode == 'PAY') && ($("#hdnCheck194N").val() == 'true')) {
          if (eval($("#hdn194NFinalTDS").val()) != 0) {
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
      else if (transTable.row().count() >= 2) {
        if (($("#hdnblnCloseLoan").val() == "true1") && (GetRadioButton() == "Debit")) {
          batchNo = ""; //window.document.frmTrans.Mfgpaydt.TextMatrix(transTable.row().count() - 1, 0)
          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos;
        }
        else {
          batchNo = ""; //window.document.frmTrans.Mfgpaydt.TextMatrix(1, 0)
          strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos;
        }
      }
    }
    else if (mode == "MODIFY") {
      //batchNo = window.document.frmTrans.hdnBatchNo.value
      //tranNo = window.document.frmTrans.hdnTranNo.value
      //var tranNo2 = window.document.frmTrans.hdnTranNo2.value
      //var tranNo3 = window.document.frmTrans.hdnTranNo3.value
      //var tranNo4 = window.document.frmTrans.hdnTranNo4.value
      var vModId = $("#ModuleCode").val().toUpperCase();
      TransMode(vMode, bdt);

      if ((vModId == "REM") || (vModId == "FXREM")) {
        if (trnMode == "4") {
          //New code is
          bNo = batchNo + "~" + tranNo

          if (eval(window.document.frmTrans.txtcomm.value) > 0)
            bNo = bNo + "~" + tranNo2

          if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)
            bNo = bNo + "~" + tranNo3

          FlexPopulate(bNo)
        }
        else if (trnMode == "2") {
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
      return;
    }
  }

  //clear denom tally
  //window.document.frames("idenomtally").denomtallyclear();

  if ((GetRadioButton() == "Credit") && ($("#ModuleCode").val() == "REM")) {  // && (window.document.frmTrans.chkRemRepeat.checked == true)) {
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
    if ((GetRadioButton() == "Debit") && ($("#ServiceCode").val() == 9) && ($("#Hidden_RemCanAutoChrgsYN").val() == "Y") &&
      ($("#Hidden_RemCanCommYN").val() == "Y") && (vMode == "TRANS")) {
      tranNos = 5;
      strValues = "GEN~*~" + brCode + "~" + batchNo + "~" + "" + "~" + tranNos;

      // DONE
      // window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchnoGenRemCanc.aspx?strVal=" + strValues
      $.ajax({
        url: '/TransferTransaction/GetBatchNoGenRemCan',
        type: 'GET',
        data: {
          searchString: strValues
        },
        success: function (response) {
          debugger;
          FlexPopulateRemCanc(response);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });
    }
    else {

      // DONE
      // window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGen.aspx?strVal=" + strValues
      $.ajax({
        url: '/TransferTransaction/GetBatchNoGen',
        type: 'GET',
        data: {
          searchString: strValues
        },
        success: function (response) {
          debugger;
          FlexPopulate(response);
        },
        error: function (err) {
          HandleAjaxError(err);
        }
      });
    }
  }
}

function DeleteTransaction() {
  var brCode = "";

  if (transTable.rows().count() >= 1) {
    if (GetValueFromRow(transTable, 1, 45) == "") {
      brCode = GetValueFromRow(transTable, 1, 18);
      abbYN = "";
    }
    else {
      brCode = GetValueFromRow(transTable, 1, 45);
      abbYN = "Y";
    }

    var batchNo = GetValueFromRow(transTable, 1, 0);
    var dt = table.rows({ selected: true }).data();
    var accNoYN = dt[49];
    var standInstr = dt[54];

    if (standInstr == "Y") {
      alert("Standing Instructions Deletion is not allowed here");
      return;
    }

    if (brCode == "" || batchNo == "") {
      return;
    }

    if (standInstr != "Y") {
      var confrm = confirm("Do you want to delete Batch No : " + batchNo + " ?");
      if (confrm == true) {
        var strpm = "DELTR" + "~" + batchNo + "~" + "" + "~" + brCode + "~" + accNoYN + "~" + abbYN;
        // TODO
        // window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
        Cancel();
      }
      else if (confrm == false) {
        return;
      }
    }
  }
}

function SubPost() {
  if (window.document.frmTrans.Mfgpaydt.Rows > 1) {
    var crDbDiff = eval(window.document.frmTrans.txtTotDebit.value) - Math.abs(eval(window.document.frmTrans.txtTotCredit.value));
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
          gridvalues();
          return;
        }
        if (CashDenom == 'Y') {
          if (vMode == "REC" && totCr == totDen) {
            GetCashierScrlNo();
          }
          else {
            alert("Denominations not Tallied")
            // divsDisplay('divDenom', 'M')
            return;
          }
        }
        else {
          if (vMode == "REC") {
            if (window.document.frmTrans.mfgDisp.Rows > 1) {
              alert("Please complete remaining transaction part");
              return;
            }
            GetCashierScrlNo();
          }
        }
      }
      else {
        alert("Credit Amount and Debit Amount Should be Equal");
      }
    }
    // Inward Clearing
    else {
      gridvalues();
    }
  }
}

// Function for String grid values in array variables
function gridvalues() {
  var strRow = "", strTot = "";
  var RowCnt = transTable.rows().count();
  var ColCnt = transTable.columns().count();

  for (i = 1; i < RowCnt; i++) {
    strRow = ""
    for (j = 0; j < ColCnt; j++) {
      if ((GetValueFromRow(transTable, i, j) == "SI") && (j == 58))
        GetValueFromRow(transTable, i, j) = "Y";
      strRow = strRow + GetValueFromRow(transTable, i, j) + "~";
    }
    strTot = strTot + strRow + "|";
  }

  if (vMode != "REC")
    strTot = vMode + "~*~" + strTot;
  else {
    denomStrForm();
    strTot = vMode + "~*~" + strTot + "^~^~^" + strDenom;
  }

  // window.document.frmTrans.cmdPost.disabled = true

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
    st = window.document.frmTrans.hidComm.value + "|" + window.document.frmTrans.hidCgst.value + "|" + window.document.frmTrans.hidSgst.value + "|" + window.document.frmTrans.hidCess.value + "|" +
      "GSTR" + "|" + $("#BranchCode").val() + "|" + $("#SRPOS").val() + "|" + window.document.frmTrans.hidGSTval.value + "|" + $("#SRGTP").val() + "|" + "Regular" + "|" +
      window.document.frmTrans.hidCust.value + "|" + window.document.frmTrans.hidRecnam.value + "|" + stTxval + "|" + window.document.frmTrans.hidRemRemarks.value

    window.document.frmTrans.hidComm.value = 0
    window.document.frmTrans.hidCgst.value = 0
    window.document.frmTrans.hidSgst.value = 0
    window.document.frmTrans.hidCess.value = 0

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

    var st = window.document.frmTrans.hidClgRetComm.value + "|" + window.document.frmTrans.hidClgRetCgst.value + "|" + window.document.frmTrans.hidClgRetSgst.value + "|" +
      window.document.frmTrans.hidClgRetCess.value + "|" + "GSTR" + "|" + $("#BranchCode").val() + "|" + $("#SRPOS").val() + "|" + window.document.frmTrans.hidClgRetGSTTaxval.value + "|" +
      $("#SRGTP").val() + "|" + "Regular" + "|" + window.document.frmTrans.hidClgRetCust.value + "|" + window.document.frmTrans.hidClgRetRcpName.value + "|" +
      window.document.frmTrans.hidClgRetGSTYN.value + "|" + window.document.frmTrans.hidClgRetRemarks.value

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

    var st = window.document.frmTrans.hidRemCancComm.value + "|" + window.document.frmTrans.hidRemCancCgst.value + "|" + window.document.frmTrans.hidRemCancSgst.value + "|" +
      window.document.frmTrans.hidRemCancCess.value + "|" + "GSTR" + "|" + $("#BranchCode").val() + "|" + $("#SRPOS").val() + "|" + window.document.frmTrans.hidRemCancGSTTaxval.value + "|" +
      $("#SRGTP").val() + "|" + "Regular" + "|" + window.document.frmTrans.hidCrCustomerID.value + "|" + window.document.frmTrans.hidCrRcpName.value + "|" +
      window.document.frmTrans.hidRemCancGSTYN.value + "|" + window.document.frmTrans.hidRemCancRemarks.value

    window.document.frames['iPost'].frmPost.hdnRemCancChrgs.value = st

  }

  if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true')) {
    if (eval(window.document.frmTrans.hdn194Nfinaltds.value) != 0) {

      var st1 = window.document.frmTrans.hdn194NBrcode.value + "|" + window.document.frmTrans.hdn194NCurcode.value + "|" + window.document.frmTrans.hdn194NModID.value + "|" +
        window.document.frmTrans.hdn194NGLCode.value + "|" + window.document.frmTrans.hdn194NAccNo.value + "|" + window.document.frmTrans.hdn194NName.value + "|" +
        window.document.frmTrans.hdn194NBatchno.value + "|" + window.document.frmTrans.hdn194NTranno.value + "|" + window.document.frmTrans.hdn194NAmount.value + "|" +
        window.document.frmTrans.hdn194NModeOfTran.value + "|" + window.document.frmTrans.hdn194NFromDate.value + "|" + window.document.frmTrans.hdn194NToDate.value + "|" +
        window.document.frmTrans.hdn194NLnkModID.value + "|" + window.document.frmTrans.hdn194NLnkGlcode.value + "|" + window.document.frmTrans.hdn194NLnkAccno.value + "|" +
        window.document.frmTrans.hdn194NRemarks.value + "|" + "A" + "|" + "R" + "|" + vUserId + "|" + vMachineId + "|SYSDATE|" + vAppDate + "|" + window.document.frmTrans.hid194NCustID.value + "|" +
        window.document.frmTrans.hid194NAssesyear.value + "|" + window.document.frmTrans.hid194Npanno.value + "|" + window.document.frmTrans.hid194NAmtPaid.value + "|" +
        window.document.frmTrans.hid194NCrossAmt.value + "|" + window.document.frmTrans.hid194TDSRate.value + "|" + window.document.frmTrans.hidPAN206AAYN.value + "|" +
        window.document.frmTrans.hidPAN206ABYN.value;

      window.document.frames['iPost'].frmPost.hdn194NTDSDtls.value = st1
    }
  }

  window.document.frames['iPost'].frmPost.hdnFlexPost.value = strTot
  window.document.frames['iPost'].frmPost.action = '<%="http://" & session("moduledir")& "/GEN/"%>' + "TrnInsert.aspx"
  window.document.frames['iPost'].frmPost.method = "post"
  window.document.frames['iPost'].frmPost.submit()
}

// Function to get next scroll number OF THE CASHIER to issue 
function GetCashierScrlNo() {
  var strpm = "";
  strBrCode = window.document.frmTrans.txtbranchcode.value
  strCurCode = window.document.frmTrans.txtcurrencycode.value
  if ((strBrCode.length > 0) && (strCurCode.length > 0)) {
    strpm = "CASHIERSCROLLNO" + "~" + strBrCode + "~" + strCurCode + "~" + vUserId + "~" + vMode
    // TODO
    // window.document.all['iCommon'].src = '<%="http://" & session("moduledir") & "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
  }
}

//This function was written to form denomination values,no of pieces,available amount, exchange amount array values.
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


/****************** Return Functions ********************/

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

function popGETRDAMOUNTCHECK(str) {
  if (str == "GREATER") {
    var strResult10 = confirm("Application Date Greater Than Maturity Date. Do you want to Continue? ");
    if (strResult10 == false) {
      return;
    }
  }
  else if (str == "NO") {
    bankingAlert("Current Amount Crossed Max Installment Amount");
    $("#Amount").val('0');
    return;
  }
}

function PopWeekpay(sWeekpay) {
  var stTotweek = "0";
  var stWeekVal = $("#WekLmt").val();
  if (sWeekpay != "No Amount") {
    var stPay = sWeekpay.split("|");
    for (aCnt = 0; aCnt <= stPay.length - 1; aCnt++) {
      stTotweek = eval(stTotweek) + eval(stPay[aCnt]);
    }
    if (stTotweek > stWeekVal) {
      stTotweek = stTotweek + eval($("#Amount").val());
      if (eval(stTotweek) > eval(stWeekVal)) {
        if (confirm("This customer has crossed Rs." + stWeekVal + "/- cash payment for the week. Do You Want continue Y/N?") == true) {
          if (confirm("Are You Sure") == true) {
            //showdat()
          }
          else {
            $("#Amount").val('');
            return;
          }
        }
        else {
          $("#Amount").val('');
          return;
        }
      }
      else {
        //showdat()
      }
    }

    if (stTotweek <= stWeekVal) {
      stTotweek = stTotweek + eval($("#Amount").val());
      if (eval(stTotweek) > eval(stWeekVal)) {
        if (confirm("This customer has crossing Rs." + stWeekVal + "/- cash payment for the week. Do You Want continue Y/N?") == true) {
          if (confirm("Are You Sure") == true) {
            //showdat()	
          }
          else {
            $("#Amount").val('');
            return;
          }
        }
        else {
          $("#Amount").val('');
          return;
        }
      }
      else {
        //ChkDayLmt()
        //showdat()
      }
    }
  }
}

function GETDRCRLIENAMT1(str) {
  var kStr = str.split("|");
  // kStr[0] -- Allow YN
  // kStr[1] -- Debit Credit Lien YN
  // kStr[2] -- Amount
  if (kStr[0] == "Y") {
  }
  else {
    if (GetRadioButton() == "Debit") {
      bankingAlert("A/C Marked Dr Lien Rs " + kStr[2] + ", Please Contact HO / Br Manager");
    }
    if (GetRadioButton() == "Credit") {
      bankingAlert("A/C Marked Cr Lien , Please Contact HO / Br Manager");
    }
    $("#Amount").val('');
  }
}

function GetThreshHoldLimit(str) {
  $("#Hidden_CheckThresholdLimit").val('false');
  if (str == "true") {
    var result = confirm("Threshhold limit crossing ? Do You Want To Continue ");
    if (result == true) {
      $("#Hidden_CheckThresholdLimit").val('true');
      // window.document.frmTrans.hdnchkthreshlmt.value = "true"
      // window.document.frmTrans.txtEffDate.focus()
    }
    else {
      $("#Amount").val('0');
      // window.document.frmTrans.txtEffDate.focus()
    }
  }
  else {
    $("#Hidden_CheckThresholdLimit").val('false');
  }
}

function Get194Ndtls(str) {
  var kStr = str.split("|");
  // kStr[0] -- balance
  // kStr[1] -- final tds

  var dblbalance = 0;
  var dblcummamt = 0;
  var dblfinaltds = 0;
  var dbltransamt = 0
  var dblFrmAmt = 0;
  var dblFrmAmt1 = 0;
  var dbltdsrate = 0;
  var strMesssage = '';

  if (kStr[0] == "No Panno") {
    bankingAlert("No Panno For This Accno");
    $("#Amount").val('');
    //window.document.frmTrans.txtTokenNo.focus()
    return;
  }

  // Clear194NhdnFields();
  dblbalance = kStr[0];
  dblfinaltds = kStr[1];
  $("#hdn194NFinalTDS").val(kStr[1]);
  if (eval(dblfinaltds) == 0) {
    return;
  }
  dbltransamt = eval($("#Amount").val()) + eval(kStr[1]);

  if (eval(kStr[2]) < 0)
    dblFrmAmt1 = 0;
  else
    dblFrmAmt1 = kStr[2];

  dblFrmAmt = AmountInWords(dblFrmAmt1);

  dbltdsrate = kStr[3];
  //window.document.frmTrans.hid194NCrossAmt.value = dblFrmAmt1;
  //window.document.frmTrans.hid194TDSRate.value = kStr[3];
  dblcummamt = eval($("#Amount").val()) + eval(Math.abs(kStr[4]));
  //window.document.frmTrans.hdn194NFromDate.value = kStr[5];
  //window.document.frmTrans.hdn194NToDate.value = kStr[6];
  //window.document.frmTrans.hid194NAssesyear.value = kStr[7];
  //window.document.frmTrans.hid194Npanno.value = kStr[8];
  //window.document.frmTrans.hid194NAmtPaid.value = kStr[9];
  //window.document.frmTrans.hidPAN206AAYN.value = kStr[10];
  //window.document.frmTrans.hidPAN206ABYN.value = kStr[11];

  var strCummMessage = '';
  if (eval(dblcummamt) > 10000000) {
    strCummMessage = dblcummamt;
  }
  else {
    //strCummMessage = $("#Amount").val();
    strCummMessage = dblcummamt;
  }

  if (eval(dblbalance) < eval(dbltransamt)) {
    strMesssage = ' Total Cash Payment is Crossing Rs. ' + dblFrmAmt + '/-  TDS @' + dbltdsrate + '%  on ' + strCummMessage + '/-,  TDSAmt = ' + dblfinaltds + '/- is applicable and Account balance is not sufficient.  Transaction will be not allowed.';
    bankingAlert(strMesssage);
    $("#Amount").val('');
  }
  else {
    strMesssage = ' Total Cash Payment is Crossing Rs. ' + dblFrmAmt + '/-  TDS @' + dbltdsrate + '%  on ' + strCummMessage + '/-,  TDSAmt = ' + dblfinaltds + '/- is applicable . Do you want to continue Y/N?  '
    var result = confirm(strMesssage)
    if (result == true) {
      var result1 = confirm("Are you sure do you want to continue Y/N?")
      if (result1 == true) {
        $("#hdnCheck194N").val('true');
        // window.document.frmTrans.txtTokenNo.focus()
      }
      else {
        $("#Amount").val('');
        $("#hdnCheck194N").val('false');
        return;
      }
    }
    else {
      $("#Amount").val('');
      $("#hdnCheck194N").val('false');
      return;
    }
  }
}

function SuspenceCallback(kstr) {
  var catdtls;
  var scrAmt = "";
  var strDisp = "";
  var prec = $("#Hidden_Precision").val();

  var Brcode = $("#Branch").val();
  var GlCd = $("#GLCode").val().split(" - ")[0];
  var Accno = $("#AccountNumber").val();

  $("#hidSCR").val('');

  TransMode(vMode, bdt);

  if (ModId == "SCR") {
    //if (window.document.frmTrans.chkDispAccNo.checked == true) {
    //  strDisp = "Disposals";
    //  scrAmt = $("#Amount").val();
    //}

    if (((kstr == "DR") && (trnMode == "4")) || ((kstr == "DR") && (trnMode == "2"))) {
      catdtls = GlCd + "~!~" + prec + "~!~" + Brcode + "~!~" + Curr + "~!~" + Accno + "~!~" + strDisp + "~!~" + scrAmt;
      scrgridYN = "YES";
      // DONE
      // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "scrflex.aspx" + "?" + "catdtls=" + catdtls)
      $.ajax({
        url: '/GetDetails/GetSCRFlex',
        type: 'GET',
        data: {
          searchString: catdtls
        },
        success: function (response) {
          debugger;
          bankingAlert(response);
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
      // DONE
      // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "scrflex.aspx" + "?" + "catdtls=" + catdtls);
      $.ajax({
        url: '/GetDetails/GetSCRFlex',
        type: 'GET',
        data: {
          searchString: catdtls
        },
        success: function (response) {
          debugger;
          bankingAlert(response);
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
      GetBranchParams($("#Branch").val());
    }
  }
  else {
    bankingAlert("No Application Date set for this Branch");
    $("#Branch").val('');
    $("#CheckABB").prop('checked', false);
  }
}

function AccountParameterReturn(strRslt) {
  pMinAmt = ""; pMaxAmt = ""; pMinPrdYrs = ""; pMinPrdMons = "";
  pMinPrdDays = ""; pMaxPrdYrs = ""; pMaxPrdMons = ""; pMaxPrdDays = "";
  pMultplesOf = "";

  var arrInd
  if (strRslt == "No Parameters") {
    bankingAlert("No Parameters Specified ")
    return
  }

  var parmVal = strRslt.split("~")

  if (parmVal[0] == 0 || parmVal[1] == 0) {
    bankingAlert("No Parameters Specified ")
    return
  }

  pMinAmt = parmVal[0]; pMaxAmt = parmVal[1]; pMinPrdYrs = parmVal[2]; pMinPrdMons = parmVal[3];
  pMinPrdDays = parmVal[4]; pMaxPrdYrs = parmVal[5]; pMaxPrdMons = parmVal[6];
  pMaxPrdDays = parmVal[7];
  pMultplesOf = parmVal[83];
}

//This function was written to display account holder details like Current Balance,... coming from server page
function Display(kstr) {
  debugger;
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
  // TODO
  // window.document.all['iMsg'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "msgcnt.aspx?strVal=" + strValues

  if ($("#ModuleCode").val().toUpperCase() == "LOAN") {

    AssignAndShow('AccountBalance', precision(balstr[0], $("#Hidden_Precision").val()));

    if (GetRadioButton() == "Credit") {
      if (isNaN(parseFloat($("#PendingIntAmount").val())) == false) {
        var loanAccBal = parseFloat(balstr[0]) - parseFloat($("#PendingIntAmount").val());
        AssignAndShow('AccountBalance', loanAccBal);
      }
      else {
        AssignAndShow('AccountBalance', $("#PendingIntAmount").val());
        AssignAndShow('PendingIntAmount', precision(0, $("#Hidden_Precision").val()));
      }
    }

    AssignAndShow('ClearBalance', precision(balstr[2], $("#Hidden_Precision").val()));
    AssignAndShow('CustomerId', balstr[3]);
    AssignAndShow('DisbursementAmount', precision(balstr[8], $("#Hidden_Precision").val()));
    AssignAndShow('OperatedBy', balstr[4]);
    AssignAndShow('SanctionAmount', precision(balstr[7], $("#Hidden_Precision").val()));
    AssignAndShow('UnclearBalance', precision(balstr[1], $("#Hidden_Precision").val()));

    if (eval($("#UnclearBalance").val()) > 0) {
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
    Deppopaccnodetails(balstr);
  }

  if (GetRadioButton() == "Credit") {
    if ($("#ModuleCode").val().toUpperCase() == "SB" || $("#ModuleCode").val().toUpperCase() == "CA") {
      SetDrCrLienYN();
    }
  }
}

function GETDRCRLIENYN1(str) {
  var kStr = str.split("|");
  if (kStr[1] == "Y") {
    if (GetRadioButton() == "Debit") {
      bankingAlert("This A/c is marked for debit Lien Rs :" + kStr[2]);
    }
    else if (GetRadioButton() == "Credit") {
      bankingAlert("This A/c is marked for Credit Lien");
    }
  }
  Check206AA206AB();
}

function GetCheck206AA206AB(kstr) {
  var kstr1 = kstr.split("*");
  if (kstr1[0] == "N") {
    bankingAlert("This Customer Panno is Inactive")
  }
  else if (kstr1[1] == "Y") {
    bankingAlert(" This customer ITR is Applicable")
  }
  else if (kstr1[0] == "N" && kstr1[1] == "Y") {
    bankingAlert("This Customer Panno is Inactive And This customer ITR is Applicable")
  }
}

function BatchTranNo(strBatchTran) {
  debugger;
  if (strBatchTran == "")
    return;

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
    //flxRowCnt = transTable.row().count() - 2;
  }
  else {
    yCnt = noofDDs;
    //flxRowCnt = transTable.row().count() - 1
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
  //      flxRowCnt = transTable.row().count() - 2
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

function populateInterest(str) {
  debugger;
  timeOut(100); // 100000

  var strLoanBatchNonew;
  //  //blnBatchLoanClose=true
  //  //strLoanBatchNonew = str.split('|') 

  var strArr = str.split("|");
  var strAppDt = $("#ApplicationDate").val().split("-");
  var intRows, intRowCnt = 2;
  var poptranNo, modId, modDesc, glcode, gldesc, accno, name, amount, customerid, modeoftran, stLaDat = "";

  if (npaIntYN == "Y") {
    intRowCnt = 2;
  }

  //stLaDat = window.document.frmTrans.hdnLstcaldate.value;
  strAppDt[1] = strAppDt[1].toUpperCase();

  if (strAppDt[1] == "JAN")
    strAppDt[1] = "01";
  else if (strAppDt[1] == "FEB")
    strAppDt[1] = "02";
  else if (strAppDt[1] == "MAR")
    strAppDt[1] = "03";
  else if (strAppDt[1] == "APR")
    strAppDt[1] = "04";
  else if (strAppDt[1] == "MAY")
    strAppDt[1] = "05";
  else if (strAppDt[1] == "JUN")
    strAppDt[1] = "06";
  else if (strAppDt[1] == "JUL")
    strAppDt[1] = "07";
  else if (strAppDt[1] == "AUG")
    strAppDt[1] = "08";
  else if (strAppDt[1] == "SEP")
    strAppDt[1] = "09";
  else if (strAppDt[1] == "OCT")
    strAppDt[1] = "10";
  else if (strAppDt[1] == "NOV")
    strAppDt[1] = "11";
  else if (strAppDt[1] == "DEC")
    strAppDt[1] = "12";

  timeOut(50); // 50000

  if ((($("#PendingIntAmount").val() == "") || eval($("#PendingIntAmount").val() == 0)) && (($("#NPAIntAmount").val() == "") || eval($("#NPAIntAmount").val() == 0))) {
    bankingAlert("NPA Int Amount Zero / Int Pend Amt");
  }
  else {
    debugger;
    for (var i = 0; i < 2; i++) {
      strNPARemarks = "";
      intRows = transTable.row().count();

      if (i == 0) {
        popbatchNo = strArr[6];
        poptranNo = strArr[7];
        modId = window.document.frmTrans.txtModId.value;
        modDesc = window.document.frmTrans.txtModDesc.value;
        glcode = window.document.frmTrans.txtGLcode.value;
        gldesc = window.document.frmTrans.txtGLDesc.value;
        accno = window.document.frmTrans.txtAccNo.value;
        name = window.document.frmTrans.txtAccNm.value;

        if (parseFloat($("#Amount").val()) <= parseFloat($("#NPAIntAmount").val())) {
          window.document.frames['iPost'].frmPost.hdnpstNpalstintcalcdt.value = "";
          strnparemarks = "NPA Int Adjusted";
        }
        else {
          window.document.frames['iPost'].frmPost.hdnpstNpalstintcalcdt.value = accno + "~" + glcode + "~" + $("#Branch").val();
          strnparemarks = "Interest Calculation Upto " + strAppDt[0] + strAppDt[1] + strAppDt[2];
        }

        if (parseFloat($("#Amount").val()) <= parseFloat($("#NPAIntAmount").val()))
          amount = "-" + $("#Amount").val();
        else
          amount = "-" + (parseFloat($("#PendingIntAmount").val()) + parseFloat($("#NPAIntAmount").val()));

        customerid = "";
        modeoftran = "3";
        modeoftranDESC = "Dr Transfer";

        //        window.document.frmTrans.hidGSTval.value = window.document.frmTrans.txtGstin.value;
        //        window.document.frmTrans.hidCust.value = window.document.frmTrans.txtCustId.value;
        //        //window.document.frmTrans.hdnCloseLoan.value=accno+"|"+glcode+"|"+$("#Branch").val()

        if (blnBatchLoanClose == true) {
          // window.document.frames['iPost'].frmPost.hdnCloseLoan.value = accno + "|" + glcode + "|" + $("#Branch").val();
        }
        else {
          // window.document.frames['iPost'].frmPost.hdnCloseLoan.value = "";
        }

        if (npaIntYN == "Y") {
          var type = "";
          if (parseFloat($("#Amount").val()) > (parseFloat($("#PendingIntAmount").val()) + parseFloat($("#NPAIntAmount").val())))
            type = "1";
          else if (parseFloat($("#Amount").val()) <= parseFloat($("#NPAIntAmount").val()))
            type = "2";
          else if (parseFloat($("#Amount").val()) < (parseFloat($("#PendingIntAmount").val()) + parseFloat($("#NPAIntAmount").val())))
            type = "3";

          // window.document.frames['iPost'].frmPost.hdnLoanNpaInt.value = npaIntYN + "~" + type + "~" + $("#Amount").val() + "~" + $("#PendingIntAmount").val() + "~" + 
          // $("#NPAIntAmount").val() + "~" + accno + "~" + glcode + "~" + $("#Branch").val();
        }
        else {
          // window.document.frames['iPost'].frmPost.hdnLoanNpaInt.value = "";
        }
      }
      else if (i == 1) {
        popbatchNo = strArr[6];
        poptranNo = strArr[8];
        modId = strArr[0];
        modDesc = strArr[7];
        glcode = strArr[1];
        gldesc = strArr[2];
        accno = strArr[3];
        name = strArr[4];

        if (parseFloat($("#Amount").val()) <= parseFloat($("#NPAIntAmount").val())) {
          amount = $("#Amount").val();
          strnparemarks = "NPA Int Adjusted";
        }
        else {
          amount = (parseFloat($("#PendingIntAmount").val()) + parseFloat($("#NPAIntAmount").val()));
          strnparemarks = "Interest Calculation Upto " + strAppDt[0] + strAppDt[1] + strAppDt[2];
        }
        customerid = "";
        modeoftran = "4";
        modeoftranDESC = "Dr Transfer";
      }

      transTable.row.add([]).draw();

      AssignValueToRow(transTable, intRows, 0, popbatchNo);
      AssignValueToRow(transTable, intRows, 1, poptranNo);
      AssignValueToRow(transTable, intRows, 2, glcode);
      AssignValueToRow(transTable, intRows, 3, gldesc);
      AssignValueToRow(transTable, intRows, 4, accno);
      AssignValueToRow(transTable, intRows, 5, name);
      AssignValueToRow(transTable, intRows, 6, amount);

      var cellData = table.cell(intRows, 6).data();

      AssignValueToRow(transTable, intRows, 7, "");
      AssignValueToRow(transTable, intRows, 8, $("#ApplicationDate").val());
      AssignValueToRow(transTable, intRows, 9, "");
      AssignValueToRow(transTable, intRows, 10, modeoftran);
      AssignValueToRow(transTable, intRows, 11, modeoftranDESC);
      AssignValueToRow(transTable, intRows, 12, "");
      AssignValueToRow(transTable, intRows, 13, "P");
      AssignValueToRow(transTable, intRows, 14, "INR");
      AssignValueToRow(transTable, intRows, 15, $("#UserId").val());
      AssignValueToRow(transTable, intRows, 16, $("#MachineId").val());
      AssignValueToRow(transTable, intRows, 17, modId);
      AssignValueToRow(transTable, intRows, 18, $("#Branch").val());
      AssignValueToRow(transTable, intRows, 19, "");
      AssignValueToRow(transTable, intRows, 20, strnparemarks);
      AssignValueToRow(transTable, intRows, 21, "");
      AssignValueToRow(transTable, intRows, 22, "");
      AssignValueToRow(transTable, intRows, 23, $("#ApplicationDate").val());
      AssignValueToRow(transTable, intRows, 24, "IC");
      AssignValueToRow(transTable, intRows, 25, "N");
      AssignValueToRow(transTable, intRows, 26, "");
      AssignValueToRow(transTable, intRows, 27, $("#ApplicationDate").val());
      AssignValueToRow(transTable, intRows, 28, "");
      AssignValueToRow(transTable, intRows, 29, "");
      AssignValueToRow(transTable, intRows, 30, "");
      AssignValueToRow(transTable, intRows, 31, "");
      AssignValueToRow(transTable, intRows, 32, "");
      AssignValueToRow(transTable, intRows, 33, "");
      AssignValueToRow(transTable, intRows, 34, "");
      AssignValueToRow(transTable, intRows, 35, "");
      AssignValueToRow(transTable, intRows, 36, "");
      AssignValueToRow(transTable, intRows, 37, "");
      AssignValueToRow(transTable, intRows, 38, "");

      AssignValueToRow(transTable, intRows, 39, "1");
      AssignValueToRow(transTable, intRows, 40, "TRANSACTION");
      AssignValueToRow(transTable, intRows, 41, "");
      AssignValueToRow(transTable, intRows, 42, "");
      AssignValueToRow(transTable, intRows, 43, "");
      AssignValueToRow(transTable, intRows, 44, "");
      AssignValueToRow(transTable, intRows, 45, "");
      AssignValueToRow(transTable, intRows, 46, "");
      AssignValueToRow(transTable, intRows, 47, "");
      AssignValueToRow(transTable, intRows, 48, "");
      AssignValueToRow(transTable, intRows, 49, "N");
      AssignValueToRow(transTable, intRows, 50, "N");
      AssignValueToRow(transTable, intRows, 51, "");
      AssignValueToRow(transTable, intRows, 52, "");
      AssignValueToRow(transTable, intRows, 53, "");
      AssignValueToRow(transTable, intRows, 54, "N");
      AssignValueToRow(transTable, intRows, 55, "");
      AssignValueToRow(transTable, intRows, 56, "");
      AssignValueToRow(transTable, intRows, 57, "");
      AssignValueToRow(transTable, intRows, 58, "");
      AssignValueToRow(transTable, intRows, 59, "");
      AssignValueToRow(transTable, intRows, 60, "0.00");
      AssignValueToRow(transTable, intRows, 61, "0.00");
      AssignValueToRow(transTable, intRows, 62, "0.00");
      AssignValueToRow(transTable, intRows, 67, "0.00");
      AssignValueToRow(transTable, intRows, 68, "0.00");
      AssignValueToRow(transTable, intRows, 69, "");
      AssignValueToRow(transTable, intRows, 70, stLaDat);
      AssignValueToRow(transTable, intRows, 71, "");
      AssignValueToRow(transTable, intRows, 72, "");
      AssignValueToRow(transTable, intRows, 73, "");
      AssignValueToRow(transTable, intRows, 74, "");
      AssignValueToRow(transTable, intRows, 75, "");
      AssignValueToRow(transTable, intRows, 76, "");
      AssignValueToRow(transTable, intRows, 77, "");
      AssignValueToRow(transTable, intRows, 78, "");
      AssignValueToRow(transTable, intRows, 79, "");
      AssignValueToRow(transTable, intRows, 80, "");
      AssignValueToRow(transTable, intRows, 81, "");
      AssignValueToRow(transTable, intRows, 82, "");
      AssignValueToRow(transTable, intRows, 83, "");
      AssignValueToRow(transTable, intRows, 84, "");
      AssignValueToRow(transTable, intRows, 85, "");
      AssignValueToRow(transTable, intRows, 86, "");
      AssignValueToRow(transTable, intRows, 87, "");
      AssignValueToRow(transTable, intRows, 88, "");
      AssignValueToRow(transTable, intRows, 89, "");
      AssignValueToRow(transTable, intRows, 90, "");
      AssignValueToRow(transTable, intRows, 91, "");
      AssignValueToRow(transTable, intRows, 92, "");
      AssignValueToRow(transTable, intRows, 93, "");
      AssignValueToRow(transTable, intRows, 94, "");
      AssignValueToRow(transTable, intRows, 95, "");
      AssignValueToRow(transTable, intRows, 96, "");
      AssignValueToRow(transTable, intRows, 97, "");
      AssignValueToRow(transTable, intRows, 98, "");
      AssignValueToRow(transTable, intRows, 99, "");
      AssignValueToRow(transTable, intRows, 100, "N");

      if ($("#CheckABB").is('checked') == false) {
        AssignValueToRow(transTable, intRows, 8, $("#ApplicationDate").val());
        AssignValueToRow(transTable, intRows, 100, "N"); //ABB Transaction Y/N = No
      }
      else {
        AssignValueToRow(transTable, intRows, 100, "Y"); // To identify that current Transaction is a ABB Transaction
        AssignValueToRow(transTable, intRows, 45, vBranchCode);
        AssignValueToRow(transTable, intRows, 46, ""); // Branch Desc
        AssignValueToRow(transTable, intRows, 8, abbApplDt);
        AssignValueToRow(transTable, intRows, 12, strsessionflds[1]);
      }

      SumDrCr(intRows, "ADD");
      timeOut(50); // 50000

      // flexRowInsert(intRows, "N");

      // wait for certain period of time
      timeOut(50); // 50000
    }
  }

  // start  dattu code
  var flxRowCnt = transTable.row().count();
  //  window.document.frmTrans.Mfgpaydt.Rows = flxRowCnt + 1
  strLoanBatchNo = strArr[6] + "~" + strArr[9] + "~" + strArr[10] + "~";
  //  Populate(strLoanBatchNo, flxRowCnt)

  //  var BatchNoAuto = strLoanBatchNo.split('~');

  //  with (window.document.frmTrans.Mfgpaydt) {
  TransMode(vMode, bdt);
  //    if (window.document.frmTrans.chkDispAccNo.checked == true) {
  //      TextMatrix(flxRowCnt, 25) = "Q"
  //      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 37)//Rate Type
  //      TextMatrix(flxRowCnt, 29) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 40)//Rate
  //      TextMatrix(flxRowCnt, 30) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 42)//F Currrency Code
  //      TextMatrix(flxRowCnt, 31) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 43)//F Amount
  //      TextMatrix(flxRowCnt, 32) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 19)//lnkmoduleid
  //      TextMatrix(flxRowCnt, 33) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 20)//lnkmoduledesc
  //      TextMatrix(flxRowCnt, 34) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 21)//lnkglcode
  //      TextMatrix(flxRowCnt, 35) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 22)//lnkgldesc
  //      TextMatrix(flxRowCnt, 36) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 23)//lnkacctype
  //      TextMatrix(flxRowCnt, 37) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 24)//lnkaccno
  //      TextMatrix(flxRowCnt, 38) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)//lnkaccname

  //      TextMatrix(flxRowCnt, 43) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 50)//Responding Section Code
  //      TextMatrix(flxRowCnt, 47) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 8)
  //      TextMatrix(flxRowCnt, 48) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 9)
  //      TextMatrix(flxRowCnt, 49) = "Y"
  //      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 49)//Responding Bank Code
  //      TextMatrix(flxRowCnt, 58) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 38)//Rate Ref Code


  //      //TextMatrix(flxRowCnt,60)=window.document.frmTrans.mfgDisp.TextMatrix(Rselect,4)
  //      TextMatrix(flxRowCnt, 80) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 4)
  //      TextMatrix(flxRowCnt, 81) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 10)
  //      TextMatrix(flxRowCnt, 82) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 26)
  //      TextMatrix(flxRowCnt, 83) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 27)
  //      TextMatrix(flxRowCnt, 84) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 28)
  //      TextMatrix(flxRowCnt, 85) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 29)

  //      TextMatrix(flxRowCnt, 86) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 35)
  //      TextMatrix(flxRowCnt, 87) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 36)

  //      TextMatrix(flxRowCnt, 88) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 39)//Ref No.
  //      TextMatrix(flxRowCnt, 89) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 41)//Ref Date
  //      TextMatrix(flxRowCnt, 90) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 44)//Corresponding Bank Code
  //      TextMatrix(flxRowCnt, 91) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 45)//Corresponding Branch Code
  //      TextMatrix(flxRowCnt, 92) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 46)//NOSTRO Debit Date
  //      TextMatrix(flxRowCnt, 93) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 47)//NOSTRO Credit Date
  //      TextMatrix(flxRowCnt, 94) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 48)//Charge Type

  //      TextMatrix(flxRowCnt, 95) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 51)//User Id.
  //      TextMatrix(flxRowCnt, 96) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 52)//Machine Id.
  //      TextMatrix(flxRowCnt, 97) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 55)//Approved By
  //      TextMatrix(flxRowCnt, 98) = window.document.frmTrans.mfgDisp.TextMatrix(Rselect, 56)//Approved M/C
  //    }
  //    if (TextMatrix(flxRowCnt, 39) == "2") {
  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtAppName.value
  //      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtAccCatCode.value
  //      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtAccCatDesc.value
  //    }

  //    if (vSubMode == "TPAY") {
  //      TextMatrix(flxRowCnt, 79) = "TPAY"
  //    }
  //    //-------------------------------------------Remittance
  //    else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "1") || (TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5"))) {
  //      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtbybnkcode.value;
  //      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtbybnkdesc.value;
  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtbybrcode.value;
  //      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtbybrdesc.value;
  //      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavgdr.value;
  //      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtinstrno.value;

  //      TextMatrix(0, 64) = "Advice Rec"
  //      if (remtype != "ADD") {
  //        TextMatrix(flxRowCnt, 64) = natadv
  //        natadv = ""
  //        TextMatrix(flxRowCnt, 68) = remtype
  //        TextMatrix(0, 69) = "Native"
  //        TextMatrix(flxRowCnt, 69) = "Y"
  //        remtype = ""
  //        if (natinsdt != "") {
  //          TextMatrix(flxRowCnt, 67) = natinsdt
  //        }
  //        else {
  //          natinsdt = window.document.frmTrans.txtinstrdt.value;
  //        }
  //        TextMatrix(flxRowCnt, 67) = natinsdt
  //        natinsdt = ""
  //      }
  //      else {
  //        TextMatrix(flxRowCnt, 64) = remadv[0]
  //        TextMatrix(flxRowCnt, 65) = remadv[1]

  //        //TextMatrix(flxRowCnt,66)=remadv[2]
  //        TextMatrix(flxRowCnt, 66) = remadvdate
  //        TextMatrix(flxRowCnt, 68) = remtype
  //        TextMatrix(0, 69) = "Native"
  //        TextMatrix(flxRowCnt, 69) = "N"
  //        remtype = ""
  //        TextMatrix(0, 69) = "Native"
  //        TextMatrix(flxRowCnt, 69) = "N"
  //        if (advinstrdate != "") {

  //          TextMatrix(flxRowCnt, 67) = advinstrdate
  //        }
  //        else {
  //          advinstrdate = window.document.frmTrans.txtinstrdt.value;
  //        }
  //        TextMatrix(flxRowCnt, 67) = advinstrdate
  //        advinstrdate = ""
  //      }
  //    }

  //    //----------
  //    //alert("YYY")
  //    else if ((TextMatrix(flxRowCnt, 17) == "REM") && ((TextMatrix(flxRowCnt, 10) == "2") || (TextMatrix(flxRowCnt, 10) == "4"))) {
  //      //alert("1")
  //      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
  //      window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
  //      TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtissbnkcode.value;
  //      TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtissbnkdesc.value;

  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtissbrcode.value;
  //      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtissbrdesc.value;
  //      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavg.value;
  //      TextMatrix(flxRowCnt, 24) = window.document.frmTrans.txtfavg.value;
  //      //---63nr
  //      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
  //      TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtcustrid.value;
  //      TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtcusn.value;


  //      //new code is
  //      if ((eval(window.document.frmTrans.txtcomm.value) > 0) &&
  //        (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
  //        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + "," + BatchNoAuto[3]
  //        TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value +
  //          "," + window.document.frmTrans.txtSerivceChrg.value
  //      }
  //      else if (eval(window.document.frmTrans.txtcomm.value) > 0) {
  //        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + ",0"
  //        TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value + ",0"
  //      }
  //      else if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
  //        TextMatrix(flxRowCnt, 67) = "0," + BatchNoAuto[2]
  //        TextMatrix(flxRowCnt, 64) = "0," + window.document.frmTrans.txtSerivceChrg.value
  //      }
  //      TextMatrix(flxRowCnt, 68) = remtype
  //      remtype = ""

  //      TextMatrix(flxRowCnt, 69) = window.document.frmTrans.txtPanNo.value;
  //      TextMatrix(flxRowCnt, 70) = window.document.frmTrans.txtMobile.value;
  //      TextMatrix(flxRowCnt, 71) = window.document.frmTrans.txtAddress1.value;
  //      TextMatrix(flxRowCnt, 72) = window.document.frmTrans.txtAddress2.value;
  //      TextMatrix(flxRowCnt, 73) = window.document.frmTrans.txtAddress3.value;

  //    }
  //    //-------------------------------------------Deposits

  //    else if (TextMatrix(flxRowCnt, 17) == "DEP" &&
  //      window.document.frmTrans.txtServiceId.value != "2") {
  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtDOpAmt.value
  //      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtDCurrAmt.value
  //      TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtDMatAmt.value
  //      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtDIntAcc.value
  //      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtDOpDate.value
  //      TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtDEffDt.value
  //      TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtDMatDt.value
  //      TextMatrix(flxRowCnt, 67) = window.document.frmTrans.txtDPaidupto.value
  //      TextMatrix(flxRowCnt, 68) = window.document.frmTrans.txtDROI.value

  //      if (flxRowCnt == 1 && window.document.frmTrans.txtServiceId.value != "2") {
  //        TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value
  //        TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value
  //        TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value
  //        TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value
  //        TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value
  //        TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value
  //        TextMatrix(flxRowCnt, 25) = "Y"
  //        TextMatrix(flxRowCnt, 26) = "Deposits"
  //      }

  //      if (transTable.row().count() > 1 && (servicecond == "RENEWAL" || servicecond == "CLOSING")) {

  //        TextMatrix(flxRowCnt, 32) = TextMatrix(1, 32)
  //        TextMatrix(flxRowCnt, 33) = TextMatrix(1, 33)
  //        TextMatrix(flxRowCnt, 34) = TextMatrix(1, 34)
  //        TextMatrix(flxRowCnt, 35) = TextMatrix(1, 35)
  //        TextMatrix(flxRowCnt, 37) = TextMatrix(1, 37)
  //        TextMatrix(flxRowCnt, 38) = TextMatrix(1, 38)
  //        TextMatrix(flxRowCnt, 25) = "Y"
  //        TextMatrix(flxRowCnt, 26) = "Deposits"
  //      }
  //    }
  //    //-------------------------------------------Suspense and Sundry

  //    else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "3") ||
  //      (TextMatrix(flxRowCnt, 10) == "1"))) {
  //      var hidamt = $("#hidSCR").val();
  //      var amt = $("#Amount").val()
  //      var diffamt = eval(hidamt) - eval(amt)
  //      TextMatrix(flxRowCnt, 79) = scrstr
  //      if (window.document.frmTrans.hidtrnno.value) {
  //        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
  //        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
  //        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
  //        if (eval(diffamt) > 0) {
  //          TextMatrix(flxRowCnt, 71) = "P"
  //        }
  //        else {
  //          TextMatrix(flxRowCnt, 71) = "F"
  //        }

  //      }
  //      else {
  //        TextMatrix(flxRowCnt, 60) = ""
  //        TextMatrix(flxRowCnt, 61) = ""
  //        TextMatrix(flxRowCnt, 62) = ""
  //        TextMatrix(flxRowCnt, 71) = ""

  //      }
  //    }
  //    else if ((TextMatrix(flxRowCnt, 17) == "SCR") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
  //      var hidamt = $("#hidSCR").val();
  //      var amt = $("#Amount").val()
  //      var diffamt = eval(hidamt) - eval(amt)
  //      TextMatrix(flxRowCnt, 79) = scrstr

  //      if (window.document.frmTrans.hidtrnno.value) {
  //        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
  //        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
  //        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
  //        if (eval(diffamt) > 0) {
  //          TextMatrix(flxRowCnt, 71) = "P"
  //        }
  //        else {
  //          TextMatrix(flxRowCnt, 71) = "F"
  //        }
  //      }
  //      else {
  //        TextMatrix(flxRowCnt, 60) = ""
  //        TextMatrix(flxRowCnt, 61) = ""
  //        TextMatrix(flxRowCnt, 62) = ""
  //        TextMatrix(flxRowCnt, 71) = ""
  //      }
  //    }

  //    //-------------------------------------------Loans

  //    else if ((TextMatrix(flxRowCnt, 17) == "LOAN") &&
  //      ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
  //      TextMatrix(flxRowCnt, 60) = window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value
  //      TextMatrix(flxRowCnt, 61) = window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value
  //      TextMatrix(flxRowCnt, 62) = window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value
  //      TextMatrix(flxRowCnt, 63) = window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value
  //      //window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value=""
  //      TextMatrix(flxRowCnt, 64) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value
  //      TextMatrix(flxRowCnt, 65) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value
  //    }
  //    else if ((TextMatrix(flxRowCnt, 17) == "LOAN") && ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "1"))) {
  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text

  //    }

  //    //-------------------------------------------Clearing

  //    // for inward clearing add clearingtype to CLG Rate Type column in grid

  //    else if (window.document.frmTrans.tranmode[2].checked == true) {
  //      TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
  //      TextMatrix(flxRowCnt, 60) = window.document.frmTrans.cmdcleartype.options
  //        (window.document.frmTrans.cmdcleartype.selectedIndex).text

  //      if (eval(window.document.frmTrans.txtServiceId.value) == "8") {

  //        TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
  //        TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
  //        TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
  //        TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
  //        TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
  //        TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
  //        TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtCLGBankCode.value
  //        TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtCLGBranch.value
  //        TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtCLGReason.value
  //        TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtCLGReasoncode.value
  //        TextMatrix(flxRowCnt, 79) = "CLGOWRETURN"

  //      }
  //      TextMatrix(flxRowCnt, 92) = window.document.frmTrans.txtPayeeBank.value
  //      TextMatrix(flxRowCnt, 93) = window.document.frmTrans.txtPayeeBranch.value
  //    }

  //    else if ((TextMatrix(flxRowCnt, 17) == "FXREM") && ((TextMatrix(flxRowCnt, 10) == "4") || (TextMatrix(flxRowCnt, 10) == "2"))) {
  //      TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
  //      window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
  //      TextMatrix(flxRowCnt, 60) = "O"
  //      TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtfavg.value;
  //      //TextMatrix(flxRowCnt,62)=window.document.frmTrans.txtcomm.value;
  //      TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
  //      TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtcusn.value;

  //      if (eval(window.document.frmTrans.txtcomm.value) > 0) {
  //        TextMatrix(flxRowCnt, 67) = BatchNoAuto[2]
  //      }
  //      TextMatrix(flxRowCnt, 65) = remtype
  //      remtype = ""

  //    }

  //    else {

  //    }

  //    PrecDrCr()

  //    if (window.document.frmTrans.txtModId.value != "DEP") {
  //      Depdivclear()
  //    }

  //    //------------------

  //    if ((TextMatrix(flxRowCnt, 17) == "REM") || (TextMatrix(flxRowCnt, 17) == "FXREM")) {

  //      if (TextMatrix(flxRowCnt, 10) == "1") {
  //        FlexPopulateCash(strLoanBatchNo)
  //        flexRowInsert(flxRowCnt, "Y")
  //        PrecDrCr()
  //      }
  //      else if (TextMatrix(flxRowCnt, 10) == "2") {

  //        //New code is
  //        if (eval(window.document.frmTrans.txtcomm.value) > 0)

  //          FlexPopulateComm(strLoanBatchNo)

  //        if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)

  //          FlexPopulateSrvCharge(strLoanBatchNo)

  //        FlexPopulateCash(strLoanBatchNo)
  //        flexRowInsert(flxRowCnt, "Y")
  //        PrecDrCr()
  //      }
  //      else if ((TextMatrix(flxRowCnt, 10) == "3") || (TextMatrix(flxRowCnt, 10) == "5")) {
  //        //alert(flxRowCnt + 'main')
  //        flexRowInsert(flxRowCnt, "N")
  //        PrecDrCr()
  //      }
  //      else if (TextMatrix(flxRowCnt, 10) == "4") {


  //        // New code is
  //        if (eval(window.document.frmTrans.txtcomm.value) > 0)

  //          FlexPopulateComm(strLoanBatchNo)

  //        if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)

  //          FlexPopulateSrvCharge(strLoanBatchNo)

  //        if ((eval(window.document.frmTrans.txtcomm.value) > 0) ||
  //          (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
  //          flexRowInsert(flxRowCnt, "Y")
  //        }
  //        else {
  //          flexRowInsert(flxRowCnt, "N")
  //        }

  //        PrecDrCr()

  //      }


  //    }

  //    else if (vMode == "TRANS") {
  //      //alert( "flexRowInsert")
  //      // alert(flxRowCnt)


  //      if ((window.document.frmTrans.tranmode[2].checked == true) && (eval(window.document.frmTrans.txtServiceId.value) == "8")) {

  //        if ((clgretchgsautoyn1 == 'Y') && (clgCommRetChrgsYN1 == 'Y')) {
  //          var confrmclg
  //          confrmclg = confirm("Do U Want To Post Clearing Return Charges Now  Y/N ? ")
  //          if (confrmclg == true) {
  //            var brCode1
  //            var strValues1
  //            var tranNosc
  //            var batchNoc
  //            var lnkmodid
  //            var lnkglcode
  //            batchNoc = ""
  //            brCode1 = $("#Branch").val()
  //            tranNosc = 5
  //            lnkmodid = window.document.frmTrans.txtCLGModId.value.toUpperCase()
  //            lnkglcode = window.document.frmTrans.txtCLGGLcode.value

  //            if (transTable.row().count() >= 2) {
  //              if (clgAbbimpyn == "Y") {
  //                if ($("#Branch").val() == "<%=session("branchcode")%>")
  //                {
  //                  strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "<%=session("branchcode")%>"
  //                }
  //								else
  //                {
  //                  strValues1 = "GEN~*~" + "<%=session("branchcode")%>" + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "ABB"
  //                }
  //              }
  //              else {
  //                strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "<%=session("branchcode")%>"
  //              }
  //            }

  //            // TODO
  //            window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGenclgret.aspx?strVal=" + strValues1
  //            return
  //          }
  //          else {
  //            flexRowInsert(flxRowCnt, "N")
  //          }
  //        }
  //        else {
  //          flexRowInsert(flxRowCnt, "N")
  //        }
  //      }
  //      else {
  //        flexRowInsert(flxRowCnt, "N")
  //        //  PrecDrCr()
  //      }
  //    }
  //    else if ((vMode == "PAY") || (vMode == "REC")) {
  //      //		alert("cash gl = " + vCashGlCode)

  //      FlexPopulateCash(strLoanBatchNo)
  //      flexRowInsert(flxRowCnt, "Y")
  //      PrecDrCr()


  //    }
  //    //------------------

  //    if (flexInsrtYN != "YES") {

  //      TempTranInsrt("Transaction Failed", flxRowCnt, "1")
  //    }
  //    //var strNarr=window.document.frmTrans.txtNarran.value
  //    if (strInsert == true) {
  //      if ((window.document.frmTrans.tranmode(1).checked == true) && (window.document.frmTrans.txtModId.value == "REM")) {
  //        okNarrSave1();
  //      }
  //      if ((window.document.frmTrans.tranmode(2).checked == true) && (window.document.frmTrans.txtModId.value != "REM")) {
  //        okNarrSave();
  //      }

  //    }


  //    window.document.frmTrans.txtPanNo.value = ""
  //    window.document.frmTrans.txtMobile.value = ""
  //    window.document.frmTrans.txtAddress1.value = ""
  //    window.document.frmTrans.txtAddress2.value = ""
  //    window.document.frmTrans.txtAddress3.value = ""

  //    window.document.frmTrans.txtPayeeBank.value = ""
  //    window.document.frmTrans.txtPayBnkDesc.value = ""
  //    window.document.frmTrans.txtPayeeBranch.value = ""
  //    window.document.frmTrans.txtPayBrDesc.value = ""
  //    window.document.frmTrans.txtMICRCode.value = ""

  //    //window.document.frmTrans.txtNarran.value=strNarr
  //    OkClear()
  //    mode = "ADD"
  //    //	alert("mode=ADD")
  //  }
}

function SumDrCr(flxRowCnt1, AddorDel1) {
  var v1, Prec;
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


//This function is used to insert row into gentemptranslog that was populated in the flexgrid.
function flexRowInsert(table, intRow, moreThanOneRowYN) {
  var ColCnt = "", RowCnt = "", ColStr = "", DispYN = "";
  var strCnt = intRow;

  if (table.rows().count() >= 1) {
    ColCnt = table.columns().count();
    RowCnt = table.rows().count() - 1;

    //forming string of values to insert into gentemptranslog
    if (moreThanOneRowYN == "Y") {
      for (var RCnt = intRow; RCnt <= RowCnt; RCnt++) {
        for (var i = 0; i <= ColCnt - 1; i++) {
          ColStr = ColStr + "'" + Mfgpaydt.TextMatrix(intRow, i) + "',";
        }
        intRow = intRow + 1;
        ColStr = ColStr.substring(0, ColStr.length - 1);
        ColStr = ColStr + "|";
      }
    }
    else {
      for (var i = 0; i <= ColCnt - 1; i++) {
        ColStr = ColStr + "'" + Mfgpaydt.TextMatrix(intRow, i) + "',";
      }
    }

    //If Transaction is not Disposal one  
    if (window.document.frmTrans.chkDispAccNo.checked == false) {
      dispVals = "";
      ColStr = "GEN" + "~*~" + intRow + "~*~" + dispVals + "~*~" + ColStr.substring(0, ColStr.length - 1) + "~*~" + tranNos;
    }
    ////If Transaction is Disposal one
    //else if (window.document.frmTrans.chkDispAccNo.checked == true) {
    //  if (window.document.frmTrans.mfgDisp.TextMatrix(
    //    window.document.frmTrans.mfgDisp.row, 38) != "SI") {
    //    if ((vMode == "REC") && ((window.document.frmTrans.txtModId.value == "PL") || (window.document.frmTrans.txtModId.value == "MISC"))) {
    //      intRow = strCnt
    //    }
    //    dispVals = window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 0) + "~" + Mfgpaydt.TextMatrix(intRow, 1) + "~" + Mfgpaydt.TextMatrix(intRow, 18) + "~" +
    //      Mfgpaydt.TextMatrix(intRow, 14) + "~" + Mfgpaydt.TextMatrix(intRow, 47) + "~" + Mfgpaydt.TextMatrix(intRow, 48) + "~" + Mfgpaydt.TextMatrix(intRow, 17);
    //  }
    //  else {
    //    dispVals = window.document.frmTrans.Mfgpaydt.TextMatrix(intRow, 0) + "~" + Mfgpaydt.TextMatrix(intRow, 1) + "~" + Mfgpaydt.TextMatrix(intRow, 18) + "~" +
    //      Mfgpaydt.TextMatrix(intRow, 14) + "~" + Mfgpaydt.TextMatrix(intRow, 47) + "~" + Mfgpaydt.TextMatrix(intRow, 48) + "~" + mfgDisp.TextMatrix(window.document.frmTrans.mfgDisp.row, 38);
    //  }
    //  ColStr = "GEN" + "~*~" + intRow + "~*~" + dispVals + "~*~" + ColStr.substring(0, ColStr.length - 1) + "~*~" + tranNos;
    //}

    //window.document.all['iOk'].src = "temptraninsrt.aspx";
    //window.document.frames['iOk'].frmTempTran.hdnFlexVal.value = ColStr;
    //window.document.frames['iOk'].frmTempTran.action = "temptraninsrt.aspx";
    //window.document.frames['iOk'].frmTempTran.method = "post";
    //window.document.frames['iOk'].frmTempTran.submit();
    flexInsrtYN = "YES";
  }
}

// This function is used to get Cash GL code.
function CashCode(code) {
  if (code == "NOGLCODE") {
    bankingAlert("No GL Code found for Cash" + "\n" + "Transactions cananot be Done");
  }
  else if (code !== "NOGLCODE") {
    var strVal = code.split("~");
    vCashGlCode = strVal[0];
    vCashGldesc = strVal[1];
  }
} 

// Receipt Limit
function RecLimit(vRLmt) {
  if (vRLmt == "")
    return;

  var RecPayAmt = vRLmt.split("~");

  if ((vMode == "REC") && (vSubMode == "")) {
    pMaxRecPayAmt = RecPayAmt[0];
  }
  else if ((vMode == "REC") && (vSubMode == "TREC")) {
    pMaxRecPayAmt = RecPayAmt[2];
  }
  else if (vSubMode == "TPAY") {
    pMaxRecPayAmt = RecPayAmt[3];
  }
  MaxLimitAmt = RecPayAmt[4];
}

// This function is used to populate main flex grid based on different modules and conditions with batchno and tranno.
function FlexPopulate(BatchNo) {
  flexInsrtYN = "";
  depIntacccond = true;
  if (eval($("#Amount").val()) == 0) {
    return;
  }

  var flxRowCnt = transTable.rows().count();

  AssignNewRow(transTable);

  Populate(BatchNo, flxRowCnt);
  debugger;
  var BatchNoAuto = BatchNo.split('~');

  TransMode(vMode, bdt);

  if (GetValueFromRow(transTable, flxRowCnt, 39) == "2") {
    AssignValueToRow(transTable, flxRowCnt, 60, ""); //window.document.frmTrans.txtAppName.value
    AssignValueToRow(transTable, flxRowCnt, 61, ""); //window.document.frmTrans.txtAccCatCode.value
    AssignValueToRow(transTable, flxRowCnt, 62, ""); //window.document.frmTrans.txtAccCatDesc.value
  }

  if (vSubMode == "TPAY") {
    AssignValueToRow(transTable, flxRowCnt, 79, "TPAY");
  }
  // Remittance
  else if ((GetValueFromRow(transTable, flxRowCnt, 17) == "REM") && ((GetValueFromRow(transTable, flxRowCnt, 10) == "1") ||
    (GetValueFromRow(transTable, flxRowCnt, 10) == "3") || (GetValueFromRow(transTable, flxRowCnt, 10) == "5"))) {
    AssignValueToRow(transTable, flxRowCnt, 52, ""); //window.document.frmTrans.txtbybnkcode.value
    AssignValueToRow(transTable, flxRowCnt, 53, ""); //window.document.frmTrans.txtbybnkdesc.value
    AssignValueToRow(transTable, flxRowCnt, 60, ""); //window.document.frmTrans.txtbybrcode.value
    AssignValueToRow(transTable, flxRowCnt, 61, ""); //window.document.frmTrans.txtbybrdesc.value
    AssignValueToRow(transTable, flxRowCnt, 62, ""); //window.document.frmTrans.txtfavgdr.value
    AssignValueToRow(transTable, flxRowCnt, 63, ""); //window.document.frmTrans.txtinstrno.value

    if (GetValueFromRow(transTable, flxRowCnt, 10) == "5") {
      AssignValueToRow(transTable, flxRowCnt, 8, $("#ApplicationDate").val());
      AssignValueToRow(transTable, flxRowCnt, 24, ""); //window.document.frmTrans.txtfavgdr.value
      AssignValueToRow(transTable, flxRowCnt, 22, ""); //window.document.frmTrans.txtinstrno.value
      AssignValueToRow(transTable, flxRowCnt, 23, ""); //window.document.frmTrans.txtinstrdt.value
      AssignValueToRow(transTable, flxRowCnt, 20, "InWard Clearing");
    }

    AssignValueToRow(transTable, flxRowCnt, 20, "Advice Rec");
    if (remtype != "ADD") {
      AssignValueToRow(transTable, flxRowCnt, 64) = natadv
      natadv = ""
      AssignValueToRow(transTable, flxRowCnt, 68) = remtype
      AssignValueToRow(transTable, 0, 69) = "Native"
      AssignValueToRow(transTable, flxRowCnt, 69) = "Y"
      remtype = ""
      if (natinsdt != "") {
        AssignValueToRow(transTable, flxRowCnt, 67) = natinsdt
      }
      else {
        natinsdt = window.document.frmTrans.txtinstrdt.value;
      }
      AssignValueToRow(transTable, flxRowCnt, 67) = natinsdt
      natinsdt = ""
    }
    else {
      AssignValueToRow(transTable, flxRowCnt, 64, remadv[0]);
      AssignValueToRow(transTable, flxRowCnt, 65, remadv[1]);
      //AssignValueToRow(transTable, flxRowCnt,66)=remadv[2]
      AssignValueToRow(transTable, flxRowCnt, 66, remadvdate);
      AssignValueToRow(transTable, flxRowCnt, 68, remtype);
      AssignValueToRow(transTable, 0, 69, "Native");
      AssignValueToRow(transTable, flxRowCnt, 69, "N");
      remtype = "";
      AssignValueToRow(transTable, 0, 69, "Native");
      AssignValueToRow(transTable, flxRowCnt, 69, "N");
      if (advinstrdate != "") {
        AssignValueToRow(transTable, flxRowCnt, 67, advinstrdate);
      }
      else {
        advinstrdate = window.document.frmTrans.txtinstrdt.value;
      }
      AssignValueToRow(transTable, flxRowCnt, 67, advinstrdate);
      advinstrdate = "";
    }
  }

  else if ((GetValueFromRow(transTable, flxRowCnt, 17) == "REM") && ((GetValueFromRow(transTable, flxRowCnt, 10) == "2") ||
    (GetValueFromRow(transTable, flxRowCnt, 10) == "4"))) {
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
    window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 52) = window.document.frmTrans.txtissbnkcode.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 53) = window.document.frmTrans.txtissbnkdesc.value;

    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtissbrcode.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtissbrdesc.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtfavg.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 24) = window.document.frmTrans.txtfavg.value;

    // 63nr
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtcustrid.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtcusn.value;

    //new code is
    if ((eval(window.document.frmTrans.txtcomm.value) > 0) &&
      (eval(window.document.frmTrans.txtSerivceChrg.value) > 0)) {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + "," + BatchNoAuto[3]
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value +
        "," + window.document.frmTrans.txtSerivceChrg.value
    }
    else if (eval(window.document.frmTrans.txtcomm.value) > 0) {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 67) = BatchNoAuto[2] + ",0"
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value + ",0"
    }
    else if (eval(window.document.frmTrans.txtSerivceChrg.value) > 0) {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 67) = "0," + BatchNoAuto[2]
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 64) = "0," + window.document.frmTrans.txtSerivceChrg.value
    }
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 68) = remtype
    remtype = ""
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 69) = window.document.frmTrans.txtPanNo.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 70) = window.document.frmTrans.txtMobile.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 71) = window.document.frmTrans.txtAddress1.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 72) = window.document.frmTrans.txtAddress2.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 73) = window.document.frmTrans.txtAddress3.value;
  }

  // Deposits
  else if (GetValueFromRow(transTable, flxRowCnt, 17) == "DEP" &&
    window.document.frmTrans.txtServiceId.value != "2") {
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtDOpAmt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtDCurrAmt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtDMatAmt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtDIntAcc.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtDOpDate.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 65) = window.document.frmTrans.txtDEffDt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 66) = window.document.frmTrans.txtDMatDt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 67) = window.document.frmTrans.txtDPaidupto.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 68) = window.document.frmTrans.txtDROI.value
    if (flxRowCnt == 1 && window.document.frmTrans.txtServiceId.value != "2") {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtModId.value.toUpperCase()
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtModDesc.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtGLcode.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtGLDesc.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtAccNo.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtAccNm.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 25) = "Y"
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 26) = "Deposits"
    }
    if (window.document.frmTrans.Mfgpaydt.Rows > 1 && (servicecond == "RENEWAL" || servicecond == "CLOSING")) {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 32) = TextMatrix(1, 32)
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 33) = TextMatrix(1, 33)
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 34) = TextMatrix(1, 34)
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 35) = TextMatrix(1, 35)
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 37) = TextMatrix(1, 37)
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 38) = TextMatrix(1, 38)
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 25) = "Y"
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 26) = "Deposits"
    }
  }

  // Suspense and Sundry
  else if ((GetValueFromRow(transTable, flxRowCnt, 17) == "SCR") && ((GetValueFromRow(transTable, flxRowCnt, 10) == "3") ||
    (GetValueFromRow(transTable, flxRowCnt, 10) == "1"))) {
    var hidamt = $("#hidSCR").val();
    var amt = window.document.frmTrans.txtAmt.value
    var diffamt = eval(hidamt) - eval(amt)
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 79) = scrstr
    if (window.document.frmTrans.hidtrnno.value) {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
      if (eval(diffamt) > 0) {
        window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 71) = "P"
      }
      else {
        window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 71) = "F"
      }
    }
    else {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = ""
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = ""
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 62) = ""
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 71) = ""
    }
  }

  else if ((GetValueFromRow(transTable, flxRowCnt, 17) == "SCR") && ((GetValueFromRow(transTable, flxRowCnt, 10) == "4") ||
    (GetValueFromRow(transTable, flxRowCnt, 10) == "2"))) {
    var hidamt = $("#hidSCR").val();
    var amt = window.document.frmTrans.txtAmt.value
    var diffamt = eval(hidamt) - eval(amt)
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 79) = scrstr

    if (window.document.frmTrans.hidtrnno.value) {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = window.document.frmTrans.hiddate.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = window.document.frmTrans.hidbatchno.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 62) = window.document.frmTrans.hidtrnno.value
      if (eval(diffamt) > 0) {
        window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 71) = "P"
      }
      else {
        window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 71) = "F"
      }
    }
    else {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = ""
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = ""
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 62) = ""
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 71) = ""
    }
  }

  // Loans
  else if ((GetValueFromRow(transTable, flxRowCnt, 17) == "LOAN") &&
    ((GetValueFromRow(transTable, flxRowCnt, 10) == "4") || (GetValueFromRow(transTable, flxRowCnt, 10) == "2"))) {
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = window.document.frames("iloandtls").frmloaninterestdetails.txtintamt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = window.document.frames("iloandtls").frmloaninterestdetails.txtchrgamt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 62) = window.document.frames("iloandtls").frmloaninterestdetails.txtinsuramt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 63) = window.document.frames("iloandtls").frmloaninterestdetails.txtnpaamt.value
    //window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value=""
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 64) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncamt.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 65) = window.document.frames("iloandtls").frmloaninterestdetails.txtprncpalamt.value
  }

  else if ((GetValueFromRow(transTable, flxRowCnt, 17) == "LOAN") && ((GetValueFromRow(transTable, flxRowCnt, 10) == "3") ||
    (GetValueFromRow(transTable, flxRowCnt, 10) == "1"))) {
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = window.document.frmTrans.selloantrans.options(window.document.frmTrans.selloantrans.selectedIndex).text
  }

  // Clearing
  // for inward clearing add clearingtype to CLG Rate Type column in grid
  else if (GetRadioButton() == "Clearing") {
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 8) = ''; //"<%=session("Applicationdate")%>";
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = window.document.frmTrans.cmdcleartype.options
      (window.document.frmTrans.cmdcleartype.selectedIndex).text
    if (eval(window.document.frmTrans.txtServiceId.value) == "8") {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 32) = window.document.frmTrans.txtCLGModId.value.toUpperCase()//lnkmoduleid
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 33) = window.document.frmTrans.txtCLGModDesc.value//lnkmoduledesc
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 34) = window.document.frmTrans.txtCLGGLcode.value//lnkglcode
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 35) = window.document.frmTrans.txtCLGGLname.value//lnkgldesc
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 37) = window.document.frmTrans.txtCLGAccNo.value//lnkaccno
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 38) = window.document.frmTrans.txtCLGAccNm.value//lnkaccname
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = window.document.frmTrans.txtCLGBankCode.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtCLGBranch.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 62) = window.document.frmTrans.txtCLGReason.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtCLGReasoncode.value
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 79) = "CLGOWRETURN"
    }
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 92) = window.document.frmTrans.txtPayeeBank.value
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 93) = window.document.frmTrans.txtPayeeBranch.value
  }

  else if ((GetValueFromRow(transTable, flxRowCnt, 17) == "FXREM") && ((GetValueFromRow(transTable, flxRowCnt, 10) == "4") || (GetValueFromRow(transTable, flxRowCnt, 10) == "2"))) {
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 9) = window.document.frmTrans.txtcustrid.value;
    window.document.frmTrans.hidRecnam.value = window.document.frmTrans.txtcustrid.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 60) = "O"
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 61) = window.document.frmTrans.txtfavg.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 64) = window.document.frmTrans.txtcomm.value;
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 63) = window.document.frmTrans.txtcusn.value;
    if (eval(window.document.frmTrans.txtcomm.value) > 0) {
      window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 67) = BatchNoAuto[2]
    }
    window.document.frmTrans.Mfgpaydt.TextMatrix(flxRowCnt, 65) = remtype
    remtype = ""
  }

  else {
  }

  PrecDrCr();

  if ($("#ModuleCode").val() != "DEP") {
    // Depdivclear()
  }

  if ((GetValueFromRow(transTable, flxRowCnt, 17) == "REM") || (GetValueFromRow(transTable, flxRowCnt, 17) == "FXREM")) {
    if (GetValueFromRow(transTable, flxRowCnt, 10) == "1") {
      FlexPopulateCash(BatchNo)
      flexRowInsert(flxRowCnt, "Y")
      PrecDrCr()
    }
    else if (GetValueFromRow(transTable, flxRowCnt, 10) == "2") {
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
    else if ((GetValueFromRow(transTable, flxRowCnt, 10) == "3") || (GetValueFromRow(transTable, flxRowCnt, 10) == "5")) {
      //alert(flxRowCnt + 'main')
      flexRowInsert(flxRowCnt, "N")
      PrecDrCr()
    }
    else if (GetValueFromRow(transTable, flxRowCnt, 10) == "4") {
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
    if ((window.document.frmTrans.tranmode[2].checked == true) && (eval(window.document.frmTrans.txtServiceId.value) == "8")) {
      if ((clgretchgsautoyn1 == 'Y') && (clgCommRetChrgsYN1 == 'Y')) {
        var confrmclg
        confrmclg = confirm("Do U Want To Post Clearing Return Charges Now  Y/N ? ")
        if (confrmclg == true) {
          var strValues1;
          var batchNoc = "";
          var brCode1 = window.document.frmTrans.txtbranchcode.value;
          var tranNosc = 5;
          var lnkmodid = window.document.frmTrans.txtCLGModId.value.toUpperCase();
          var lnkglcode = window.document.frmTrans.txtCLGGLcode.value;

          //   if (transTable.rows().count() >= 2) {
          //     if (clgAbbimpyn == "Y") {
          //       if (window.document.frmTrans.txtbranchcode.value == "<%=session("branchcode")%>")
          //         strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "<%=session("branchcode")%>";
					//       else
          //         strValues1 = "GEN~*~" + "<%=session("branchcode")%>" + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "ABB";
          //     }
          //     else
          //       strValues1 = "GEN~*~" + brCode1 + "~" + batchNoc + "~" + "" + "~" + tranNosc + "~" + lnkmodid + "~" + lnkglcode + "~" + "<%=session("branchcode")%>";
          //   }
          // window.document.all['iGeneral1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "batchNoGenclgret.aspx?strVal=" + strValues1
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
    }
  }
  else if ((vMode == "PAY") || (vMode == "REC")) {
    FlexPopulateCash(BatchNo)

    if (("<%=str194NYN%>" == 'Y') && (vMode == 'PAY') && (window.document.frmTrans.hdnchk194N.value == 'true')) {
      if (window.document.frmTrans.hdn194Nfinaltds.value == 0) { }
      else {
        FlexPopulate194NCust(BatchNo)
        FlexPopulate194N(BatchNo)
      }
    }
    flexRowInsert(flxRowCnt, "Y")
    PrecDrCr();
  }

  if (flexInsrtYN != "YES") {
    TempTranInsrt("Transaction Failed", flxRowCnt, "1")
  }

  if (strInsert == true) {
    if ((window.document.frmTrans.tranmode(1).checked == true) && (window.document.frmTrans.txtModId.value == "REM")) {
      okNarrSave1();
    }
    if ((window.document.frmTrans.tranmode(2).checked == true) && (window.document.frmTrans.txtModId.value != "REM")) {
      okNarrSave();
    }
  }

  //window.document.frmTrans.txtPanNo.value = ""
  //window.document.frmTrans.txtMobile.value = ""
  //window.document.frmTrans.txtAddress1.value = ""
  //window.document.frmTrans.txtAddress2.value = ""
  //window.document.frmTrans.txtAddress3.value = ""
  //window.document.frmTrans.txtPayeeBank.value = ""
  //window.document.frmTrans.txtPayBnkDesc.value = ""
  //window.document.frmTrans.txtPayeeBranch.value = ""
  //window.document.frmTrans.txtPayBrDesc.value = ""
  //window.document.frmTrans.txtMICRCode.value = ""

  //OkClear();
  mode = "ADD";
}

function Populate(BatchNo, flxRowCnt) {
  depIntacccond = true
  //alert("populate" + BatchNo)
  //branchCurrCode()

  var batchNo = BatchNo.split('~');
  var glCode = $("#GLCode option:selected").text().split(" - ");
  var moduleCode = $("#ModuleCode option:selected").text().split(" - ");
  var serviceCode = $("#ServiceCode option:selected").text().split(" - ");
  var branCode = $("#Branch option:selected").text().split(" - ");

  // General		
  AssignValueToRow(transTable, flxRowCnt, 0, batchNo[0]);
  AssignValueToRow(transTable, flxRowCnt, 1, batchNo[1]);
  AssignValueToRow(transTable, flxRowCnt, 2, glCode[0]);
  AssignValueToRow(transTable, flxRowCnt, 3, glCode[1]);
  AssignValueToRow(transTable, flxRowCnt, 4, $("#AccountNumber").val());
  AssignValueToRow(transTable, flxRowCnt, 5, $("#CustomerName").val());

  if (vMode == "TRANS") {
    if (trnMode == "3" || trnMode == "5") {
      AssignValueToRow(transTable, flxRowCnt, 6, "-" + $("#Amount").val());
      Col = 6;
      Row = flxRowCnt;
    }
    else if (trnMode == "4") {
      AssignValueToRow(transTable, flxRowCnt, 6, $("#Amount").val());
      Col = 6;
      Row = flxRowCnt;
    }
  }
  else if (vMode == "REC") {
    AssignValueToRow(transTable, flxRowCnt, 6, $("#Amount").val());
    Col = 6;
    Row = flxRowCnt;
  }
  else if (vMode == "PAY") {
    AssignValueToRow(transTable, flxRowCnt, 6, "-" + $("#Amount").val());
    AssignValueToRow(transTable, flxRowCnt, 19, $("#TokenNo").val());
    Col = 6;
    Row = flxRowCnt;
    //window.document.frmTrans.hidGSTval.value = window.document.frmTrans.txtGstin.value;
  }

  AssignValueToRow(transTable, flxRowCnt, 7, $("#AccountBalance").val());

  if ($("#CustomerId").val() == "" || $("#CustomerId").val() == "undefined") {
    if (eval($("#ServiceCode").val()) == "8") {
      AssignValueToRow(transTable, flxRowCnt, 9, "");
    }
    else {
      AssignValueToRow(transTable, flxRowCnt, 9, "1111111111");
    }
  }
  else {
    AssignValueToRow(transTable, flxRowCnt, 9, $("#CustomerId").val());
  }

  AssignValueToRow(transTable, flxRowCnt, 10, trnMode);
  AssignValueToRow(transTable, flxRowCnt, 11, trnDesc);

  AssignValueToRow(transTable, flxRowCnt, 13, "P");
  AssignValueToRow(transTable, flxRowCnt, 14, "INR");
  AssignValueToRow(transTable, flxRowCnt, 15, vUserId);
  AssignValueToRow(transTable, flxRowCnt, 16, vMachineId);
  AssignValueToRow(transTable, flxRowCnt, 17, moduleCode[0]);

  if ($("#ImpClgYN").val() == "Y") {
    if (eval($("#ServiceCode").val()) == "8") {
      AssignValueToRow(transTable, flxRowCnt, 18, $("#BranchCode").val());
    }
    else {
      AssignValueToRow(transTable, flxRowCnt, 18, branCode[0]);
    }
  }
  else {
    AssignValueToRow(transTable, flxRowCnt, 18, branCode[0]);
  }

  AssignValueToRow(transTable, flxRowCnt, 20, $("#Narration").val());
  AssignValueToRow(transTable, flxRowCnt, 21, "");
  AssignValueToRow(transTable, flxRowCnt, 22, $("#ChequeNo").val());
  AssignValueToRow(transTable, flxRowCnt, 23, $("#ChequeDate").val());

  if (($("#Hidden_194NYN").val() == 'Y') && (vMode == 'PAY') && ($("#hdnCheck194N").val() == 'true') && ($("#hdn194NFinalTDS").val() != 0)) {
    AssignValueToRow(transTable, flxRowCnt, 24, "194N");
  }
  else {
    AssignValueToRow(transTable, flxRowCnt, 24, $("#ChequeFavouring").val());
  }

  AssignValueToRow(transTable, flxRowCnt, 25, "N");
  AssignValueToRow(transTable, flxRowCnt, 26, moduleCode[1]);
  AssignValueToRow(transTable, flxRowCnt, 27, $("#EffectiveDate").val());

  if (GetValueFromRow(transTable, flxRowCnt, 17) == "REM") {
    // AssignValueToRow(transTable, flxRowCnt, 28) = window.document.frmTrans.cmdcleartype.value;//clearing type
    AssignValueToRow(transTable, flxRowCnt, 5, $("#REMFavouring").val());
    //window.document.frmTrans.hidRemRemarks.value = 'Remittance Charges ' + window.document.frmTrans.txtGLcode.value
  }

  AssignValueToRow(transTable, flxRowCnt, 32, ""); // = window.document.frmTrans.txtLnkModId.value//lnkmoduleid
  AssignValueToRow(transTable, flxRowCnt, 33, ""); // = window.document.frmTrans.txtLnkModDesc.value//lnkmoduledesc
  AssignValueToRow(transTable, flxRowCnt, 34, ""); // = window.document.frmTrans.txtLnkGLCode.value//lnkglcode
  AssignValueToRow(transTable, flxRowCnt, 35, ""); // = window.document.frmTrans.txtLnkGLname.value//lnkgldesc
  AssignValueToRow(transTable, flxRowCnt, 36, ""); // = window.document.frmTrans.txtLnkAcctype.value//lnkacctype
  AssignValueToRow(transTable, flxRowCnt, 37, ""); // = window.document.frmTrans.txtLnkAccNo.value//lnkaccno
  AssignValueToRow(transTable, flxRowCnt, 38, ""); // = window.document.frmTrans.txtLnkAccNm.value//lnkaccname

  AssignValueToRow(transTable, flxRowCnt, 39, serviceCode[0]);
  AssignValueToRow(transTable, flxRowCnt, 40, serviceCode[1]);

  // Threshold Limit Cross
  if ((GetRadioButton() == "Credit") && ((modulecode[0] == "SB") || (moduleCode[0] == "CA")) && ($("#Hidden_CheckThresholdLimit").val() == "true")) {
    $("#hdnThresLimitCRS").val('');
    var st1 = branCode[0] + "|INR|" + moduleCode[0] + "|" + glCode[0] + "|" + $("#AccountNumber").val() + "|" + batchNo[0] + "|" + batchNo[1];
    $("#hdnThresLimitCRS").val(st1);
  }

  // SB CA Account Closing
  if ((GetRadioButton() == "Debit") && (serviceCode[0] == "4") && ((moduleCode[0] == "SB") || (moduleCode[0] == "CA"))) {
    $("#hdnSBCAAccClose").val('');
    var st1 = branCode[0] + "|INR|" + moduleCode[0] + "|" + glCode[0] + "|" + $("#AccountNumber").val();
    $("#hdnSBCAAccClose").val(st1);
  }

  if (blnFlagAutoClose == true) {
    AssignValueToRow(transTable, flxRowCnt, 39, "4");
    AssignValueToRow(transTable, flxRowCnt, 40, "ACCOUNT CLOSING");
  }

  if ($("#CheckABB").is("checked") == false) {
    AssignValueToRow(transTable, flxRowCnt, 8, vAppDate); //Application Date
    AssignValueToRow(transTable, flxRowCnt, 100, "N"); //ABB Transaction Y/N = No		    
  }
  else {
    AssignValueToRow(transTable, flxRowCnt, 45, vBranchCode);
    AssignValueToRow(transTable, flxRowCnt, 46, branCode[1]);
    AssignValueToRow(transTable, flxRowCnt, 8, abbApplDt);
    AssignValueToRow(transTable, flxRowCnt, 12, vAppDate); //Application Date as ABB Appl Dt
    AssignValueToRow(transTable, flxRowCnt, 25, "Y");  //System generated Y/N = "Y"
    AssignValueToRow(transTable, flxRowCnt, 100, "Y");  //to identify that current Transaction is a ABB Transaction
  }

  exceptionCodes();

  AssignValueToRow(transTable, flxRowCnt, 49, "N"); //Account Check YN i.e Disposals.
  AssignValueToRow(transTable, flxRowCnt, 50, excpYN); //Exception YN.
  AssignValueToRow(transTable, flxRowCnt, 51, excpCodes); // Exception Codes.
  AssignValueToRow(transTable, flxRowCnt, 54, "N");  // Standing Instructions YN.

  if ((moduleCode[0] == "SB") || (moduleCode[0] == "CA") || (moduleCode[0] == "CC")) {
    if (GetRadioButton() == "Debit") {
      if ($("#CheckCheque").is("checked") == true) {
        if (scts == "Y") {
          AssignValueToRow(transTable, flxRowCnt, 63, ""); //window.document.frmTrans.cboChqType.value
        }
        else {
          AssignValueToRow(transTable, flxRowCnt, 63, "");
        }
      }
    }
  }

  //if ("<%=session("module ")%>"== "CLG")
  //{
  //  AssignValueToRow(transTable, flxRowCnt, 63) = window.document.frmTrans.cboChqType.value
  //}

  if ((vMode == "REC") || (vMode == "PAY")) {
    AssignValueToRow(transTable, flxRowCnt, 55, vCounterNo); //Counter No. for that Cashier.
    AssignValueToRow(transTable, flxRowCnt, 56, vCashierId); //Cashier Id by default UserId.
    AssignValueToRow(transTable, flxRowCnt, 57, "1");
  }

  // Forex Transactions
  if (fxTransYN == "Y") {
    //AssignValueToRow(transTable, flxRowCnt, 28) = window.document.frmTrans.cmbFRateType.options[window.document.frmTrans.cmbFRateType.selectedIndex].value
    //AssignValueToRow(transTable, flxRowCnt, 29) = window.document.frmTrans.txtFRate.value
    //AssignValueToRow(transTable, flxRowCnt, 30) = window.document.frmTrans.txtFCurCode.value
    //AssignValueToRow(transTable, flxRowCnt, 31) = window.document.frmTrans.txtFAmount.value
    //AssignValueToRow(transTable, flxRowCnt, 58) = window.document.frmTrans.txtFRateRefCode.value
    //AssignValueToRow(transTable, flxRowCnt, 59) = window.document.frmTrans.txtFRateRefDesc.value
  }

  // SumDrCr(flxRowCnt, "ADD");
}

function PrecDrCr() {
  $("#Difference").val(Math.abs($("#CreditTotal").val() - $("#DebitTotal").val()));

  var Prec = eval($("#Hidden_Precision").val());

  var v1 = eval($("#CreditTotal").val());
  $("#CreditTotal").val(v1.toFixed(Prec));

  v1 = eval($("#DebitTotal").val());
  $("#DebitTotal").val(v1.toFixed(Prec));

  v1 = eval($("#Difference").val());
  $("#Difference").val(v1.toFixed(Prec));

  precision($("#DebitTotal").val(), $("#Hidden_Precision").val());
  precision($("#CreditTotal").val(), $("#Hidden_Precision").val());
  precision($("#Difference").val(), $("#Hidden_Precision").val());
}

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


/****************** Assign Value Functions ********************/

function AssignValueToRow(table, row, col, value) {
  if (value == null || value == undefined)
    value = "";
  table.cell(row, col).data(value).draw();
}

function AssignAndShow(element, value) {
  $("." + element).removeClass('d-none');
  $("#" + element).val(value);
}

function AssignNewRow(table) {
  var emptyRow = Array(table.columns().count()).fill(null);
  table.row.add(emptyRow).draw();
}

function GetValueFromRow(table, row, col) {
  table.cell(row, col).data();
}


// CASHGL, RPLMT, SCRFlex