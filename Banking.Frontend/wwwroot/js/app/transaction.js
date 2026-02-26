
$(function () {

    var bdt = $("#Hidden_BDT").val();
    var vUserId = $("#UserId").val();
    var vAppDate = $("#ApplicationDate").val();
    var vCounterNo = $("#CounterNo").val();
    var vCashierId = $("#CashierId").val();
    var vBranchCode = $("#BranchCode").val();
    var vBrNarration = $("#BranchNarration").val();
    var vCurCode = $("#CurrencyCode").val();
    var vCurNarration = $("#CurrencyNarration").val();
    var vMachineId = $("#MachineId").val();
    var vAbbUser = $("#ABBUser").val();
    var vMode = $("#Hidden_Mode").val();
    var vModule = $("#SelectedModule").val();

    $("#CheckDenoms").prop('disabled', true);

    $("#Clearing").addClass('d-none');

    ServiceId();

    $("#AccountNumber").on("blur", function () {
      debugger;
      var accountNumber = $(this).val();
      var st = accountNumber.split("-");

      ControlOnBlur('AccountNumber');
      AccountParameters(st[2], 'ACCNO');

      BalanceDetails();
      GeneralLimitValidation();
      GetPendingInterest();
      JointHolderValidation();
      Check206AA206AB();
      SetCCDrCrLienYN();
      GetATMCardDetails()

    });

    var mode = "ADD";
    var chkNull = "true";

    if (vAbbUser == "Y") {
        $("#Branch").prop('readonly', false);
        $("#CheckABB").prop('disabled', false);
    }

    //if (vModule == "CLG")
    //{
    //  window.document.all['divRadDebit'].style.display = "none";
    //  window.document.all['divRadCredit'].style.display = "none";
    //  window.document.all['divRadClg'].style.display = "block";
    //}

    $("#TransactionMode").on("change click", function () {
        TranMode(vMode, bdt);
        ModeChange(bdt);
    });

    // window.document.frames['iPost'].frmPost.hdnSBCAAccClose.value = "";

    //TransMode(vMode, bdt);
    //NatBranch();
    //DefaultValues();
    //SumDrCrDefault();
    //CashMode();
    //Denom();
    //OnFocus();

    //if (mode != "MODIFY") {
    //  excpIntValues();
    //}


});

function ServiceId(vMode) {
    var DbCr;
    var modId;

    if (((vMode == "REC") || (vMode == "PAY")) && (mode != "MODIFY")) { //&& (window.document.frmTrans.Mfgpaydt.Rows > 1)
        alert("Only one Cash Transaction allowed at a time." + "\n" + " Post already entered data.")
        return;
    }

    if ($("#TransactionModes").val() == "Debit") {
        DbCr = "Debit"
    }
    else if ($("#TransactionModes").val() == "Credit") {
        DbCr = "Credit"
    }
    else if ($("#TransactionModes").val() == "Clearing") {
        // Checking for clearingtype - selected or not 
        //if ((window.document.frmTrans.cmdcleartype.value == "Select") ||
        //  (window.document.frmTrans.cmdcleartype.value == "")) {
        //  alert("Select ClearingType")
        //  return;
        //}
        DbCr = "Clearing"
    }
    modId = $("#Module").val().toUpperCase();

    st = "Service|" + DbCr + "|" + modId

    $.ajax({
        url: '/List/GetServiceIdList',
        type: 'GET',
        data: { searchString: encodeURIComponent(st) },
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

function Tellermodule() {
    var bdt = $("#Hidden_BDT").val();
    var selectedModule = $("#SelectedModule").val();
    var transMode = $("#TransactionMode").val();

    if (bdt.toUpperCase() == "TRUE")
        return;

    if ((selectedModule == 'CLG') && (transMode == 'Clearing')) {
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
        stmod = "TellermoduleID";
        stbr = $("#Branch").val().toUpperCase();
        var strServiceId = $("#ServiceCode").val();
        kstr = stmod + "|" + stbr + "|" + strServiceId

        if (transMode != "Clearing") {
            $("#CheckCheque").prop('checked', false);
        }
        // window.showModalDialog('<%="http://" & session("moduledir")& "/DEPOSITS/"%>' + "List.aspx" + "?" + "st=" + kstr)
    }
    else {
        stmod = "Tellermodule";
        stbr = $("#Branch").val().toUpperCase()
        kstr = stmod + "|" + stbr
        if (transMode != "Clearing") {
            $("#CheckCheque").prop('checked', false);
        }
        // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx" + "?" + "st=" + kstr)
    }
}

function ModeChange(bdt) {
    if (bdt.toUpperCase() == "TRUE")
        return;
    ModuleClear();
    Remclear();
    funloanclear();
    Cls();
    // window.document.frmTrans.cmdModId.disabled = false
}

// Cash Debit Cash Credit
function CategoryCode() {
  kstr = "catcode"
  // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "TranList.aspx?st=" + kstr)
}


function ControlOnBlur(txtName) {
  var strVal = "", strWhr = "";
  var vBrCode = $("#Branch").val();

  if ($("#" + txtName + "").val() == "") {
    return;
  }

  //  //Lost Focus from Single recordset component
  //  Dataarrange(window.document.frmTrans.item(txtName))

  if (txtName == "txtAccNo") {
    vModuleId = $("#Module").val();
    vGLCode = st[1];
    vAccNo = st[2];
    vCurrencyCode = "INR";

    if (vBrCode != "" && vModuleId != "" && vGLCode != "" && vAccNo != "") {
      strVal = "COMP" + "~!~" + "txtAccNm" + "~!~" + vBrCode + "~!~" + vModuleId + "~!~" + vGLCode + "~!~" + vAccNo
      if (vModuleId == 'SCR')
        strVal = strVal + "~!~" + vCurrencyCode
    }
    if (vModuleId == "SCR") {
      SuspenseDetails(st[1], vModuleId, vBranchCode, vMode);
    }
    // Checking for ChequeBookYN
    if (vModuleId == "SB" || vModuleId == "CA" || vModuleId == "CC") {
      GetAccountDetails(vModuleId, vBranchCode, st[2]);
    }
  }

  if (strVal != "") {
    strVal = txtName + "~!~" + strVal;
    // window.document.all['iGeneral'].src = "http://GEN/genonblur.aspx?strParam=" + strVal;
  }


//  else if (txtName == "txtcurrencycode") {
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

//function DefaultValues() {
//  window.document.frmTrans.txtServiceId.value = "1"
//  window.document.frmTrans.txtServiceName.value = "TRANSACTION"
//  window.document.frmTrans.txtEffDate.value = vAppDate;
//  window.document.frmTrans.dtpEffDate.value = vAppDate;

//  vMode = "<%=strMode%>"
//  vSubMode = "<%=strSubMode%>"
//  pChqVldPrd = '<%=session("ChequeValidPeriod")%>'
//  pChqLength = '<%=session("ChequeLength")%>'

//  if (bdt.toUpperCase() == "TRUE") {
//    window.document.frmTrans.txtModId.value = "INV"
//    window.document.frmTrans.txtModDesc.value = "Investments"
//    window.document.frmTrans.cmdModId.Enabled = false
//    window.document.frmTrans.txtModId.readOnly = true
//    window.document.frmTrans.txtModDesc.readOnly = true
//    window.document.frmTrans.txtModId.disabled = true
//    window.document.frmTrans.txtModDesc.disabled = true
//  }
//}

//function SumDrCrDefault() {
//  window.document.frmTrans.txtDiff.value = "0";
//  precision(window.document.frmTrans.txtTotDebit, window.document.frmTrans.hpr.value)
//  precision(window.document.frmTrans.txtTotCredit, window.document.frmTrans.hpr.value)
//  precision(window.document.frmTrans.txtDiff, window.document.frmTrans.hpr.value)
//  window.document.frmTrans.NoDrTrn.value = "0";
//  window.document.frmTrans.NoCrTrn.value = "0";
//}

//function CashMode() {
//  if (vMode == "TRANS") {
//    window.document.all['divDenom'].style.display = "none";
//    window.document.all['divToken'].style.display = "none";
//    window.document.frmTrans.chkDenomDtls.disabled = true
//    window.document.frmTrans.cmdTranDel.disabled = false

//  }
//  else if (vMode == "PAY") {
//    window.document.all['divDenom'].style.display = "none";
//    window.document.all['divToken'].style.display = "block";
//    window.document.frmTrans.chkDenomDtls.disabled = true
//    window.document.frmTrans.chkDispDtls.disabled = true
//    window.document.frmTrans.tranmode[0].checked = true
//    window.document.frmTrans.chkDispAccNo.disabled = true
//    window.document.frmTrans.tranmode[1].disabled = true
//    window.document.frmTrans.tranmode[2].disabled = true
//    window.document.frmTrans.cmdTranDel.disabled = true
//    cashGlCode()
//    if (vSubMode == "TPAY") {
//      window.document.all['divToken'].style.display = "none";
//      RecPayLmt()
//    }
//  }
//  else if (vMode == "REC") {
//    window.document.all['divDenom'].style.display = "block";
//    window.document.all['divToken'].style.display = "none";
//    window.document.all['divTempTrans'].style.display = "none";
//    divsDisplay("divDenom", "M")
//    window.document.frmTrans.chkDispAccNo.disabled = true
//    window.document.frmTrans.tranmode[0].disabled = true
//    window.document.frmTrans.tranmode[2].disabled = true
//    window.document.frmTrans.tranmode[1].checked = true
//    window.document.frmTrans.chkCheque.disabled = true
//    window.document.frmTrans.chkDispDtls.disabled = true
//    window.document.frmTrans.cmdTranDel.disabled = true
//    if (mode != "MODIFY") {
//      window.document.frmTrans.chkDenomDtls.checked = false
//      window.document.frames("idenom").DenomClear("R")
//    }
//    window.document.frames("idenomtally").denomtallyclear()
//    cashGlCode()
//    RecPayLmt()
//  }
//}

//function Denom() {
//  if (vMode == "REC") {
//    if (CashDenom == 'Y') {
//      window.document.all.divDenom.style.display = "block"
//      window.document.all.divDenomtally.style.display = "none"
//      window.document.frmTrans.chkDenomDtls.disabled = false;
//      window.document.frmTrans.chkdenomtally.disabled = true;
//    }
//    else if ((CashDenom == 'N') && (cashdenomtally == 'Y')) {
//      window.document.all.divDenomtally.style.display = "block"
//      window.document.all.divDenom.style.display = "none"
//      window.document.frmTrans.chkDenomDtls.disabled = true;
//      window.document.frmTrans.chkdenomtally.disabled = false;
//      window.document.frmTrans.chkdenomtally.checked = true;
//    }
//    else {
//      window.document.all.divDenom.style.display = "none"
//      window.document.all.divDenomtally.style.display = "none"
//      window.document.frmTrans.chkDenomDtls.disabled = true;
//      window.document.frmTrans.chkdenomtally.disabled = true;
//    }

//    var stBrcd = "<%=session("branchcode")%>"
//    var kstr = "REC" + "~" + stBrcd + "~" + window.document.frmTrans.txtcurrencycode.value + "~" + strsessionflds[0] + "~" + window.document.frmTrans.hpr.value + "~";
//    // window.document.all['idenom'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "cashDenominations.aspx?kstr=" + kstr;
//  }
//}

//function OnFocus() {
//  window.document.frmTrans.txtServiceId.focus()
//  if ("<%=session("module ")%>"== "CLG")
//  {
//    window.document.frmTrans.tranmode(2).checked = true
//    CLGDivCrDr()
//  }
//}

//// function for displaying the div "DIVDrCr" tag if service id is '5' - i.e inward clearing
//function CLGDivCrDr() {
//  var stralert
//  grid()
//  if (window.document.frmTrans.tranmode[2].checked == true) {
//    //deleting the rows if previous trnsactions are there which is other than inward clg
//    if ((window.document.frmTrans.Mfgpaydt.Rows > 1) && (mode != "MODIFY")) {
//      stralert = confirm("Are You Sure To Delete the transaction")

//      if (stralert == true) {
//        DelTran()
//        Cancel()
//      }
//    }

//    if (clgAbbimpyn == "Y") {
//      window.document.frmTrans.chkABB.checked = true
//      window.document.frmTrans.chkABB.disabled = true
//    }
//    else {
//      window.document.frmTrans.chkABB.checked = false
//      window.document.frmTrans.chkABB.disabled = false
//    }
//    window.document.all['divPhSign'].style.display = "none";
//    window.document.all['divPayeeDtls'].style.display = "block";
//    window.document.frmTrans.tranmode[2].checked = true
//    window.document.all.divCrDr.style.display = "none"
//    window.document.frmTrans.cmdcleartype.style.display = "block";
//    window.document.frmTrans.chkCheque.checked = true
//    window.document.frmTrans.chkCheque.disabled = true
//    window.document.frmTrans.tranmode[0].disabled = true
//    window.document.frmTrans.tranmode[1].disabled = true
//    window.document.frmTrans.chkLnkMod.disabled = true
//    window.document.frmTrans.chkLnkMod.checked = false
//    window.document.frmTrans.chkDispDtls.disabled = true

//    window.document.frmTrans.txtPayeeBank.value = ""
//    window.document.frmTrans.txtPayBnkDesc.value = ""
//    window.document.frmTrans.txtPayeeBranch.value = ""
//    window.document.frmTrans.txtPayBrDesc.value = ""
//    window.document.frmTrans.txtMICRCode.value = ""

//    Cheque()
//    strpm = "";
//    strpm = "CLGTypes" + "~" + window.document.frmTrans.txtbranchcode.value + "~" +
//      window.document.frmTrans.txtcurrencycode.value
//    // alert(strpm)
//    window.document.all['iGeneral'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "minBalChk.aspx?strparam=" + strpm
//  }
//  else {
//    window.document.all.divCrDr.style.display = "block"
//    window.document.frmTrans.chkCheque.disabled = false
//    window.document.frmTrans.chkCheque.checked = false
//    window.document.frmTrans.cmdcleartype.style.display = "none";
//    window.document.frmTrans.tranmode[0].disabled = false
//    window.document.frmTrans.tranmode[1].disabled = false
//    window.document.frmTrans.tranmode[0].checked = true
//    Cheque()
//    window.document.frmTrans.cmdModId.disabled = false
//    window.document.frmTrans.cmdGLCode.disabled = false
//    window.document.frmTrans.cmdAccno.disabled = false
//    window.document.frmTrans.chkDispDtls.disabled = false
//  }
//}


//function AccountParameters(AccNoOrCatCode, AccOrCat) {
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


//function BalanceDetails() {
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

function GetPendingInterest() {
  if (($("#Module").val() == "LOAN") && ($("#TransactionMode").is('checked') == true)) {
    st = $("#Branch").val() + "|" + "INR" + "|LOAN|" + st[1] + "|" + $("#AccountNumber").val();

    // window.document.all['idetails'].src = '<%="http://" & session("moduledir")& "/Loan/"%>' + "loanrenewintcalc.aspx?st=" + st;
  }
}

function JointHolderValidation() {
  if (window.document.frmTrans.tranmode(0).checked == true) {
    var st = "GETJOINTHOLDER|" + $("#Branch").val() + "|INR|" + st[1] + "|" + $("#AccountNumber").val() + "|" + $("#Module").val();
    // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
  }
}

function Check206AA206AB() {
  var sBr = $("#Branch").val().toUpperCase();
  var sMod = $("#Module").val().toUpperCase();
  var st = "Check206AA206AB" + "|" + sBr + "|" + sMod + "|" + st[1].toUpperCase() + "|" + $("#AccountNumber").val() + "|INR";

  // window.document.all["iBatch"].src = "../GENSBCA/querydisplay.aspx?st=" + st
}

function SetCCDrCrLienYN() {
  if (($("#Module").val().toUpperCase() != "CC")) {
    return;
  }
  var st = "GETCCDRCRLIENYN|" + $("#Branch").val() + "|INR|" + $("#Module").val().toUpperCase() + "|" + st[1] + "|" + $("#AccountNumber").val() + "|" + $("#ApplicationDate").val();
  // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
}

function GetATMCardDetails() {
  if ($("#TransactionMode").is('checked') == true) {
    if ($("#ServiceCode").val() == 4) {
      var strmodid1 = $("#Module").val().toUpperCase()
      if ((strmodid1 == "SB") || (strmodid1 == "CA")) {
        var brcode = $("#Branch").val().toUpperCase();
        var glcode = st[1].toUpperCase();
        var accno = $("#AccountNumber").val().toUpperCase();
        var st = "ATMCardDet|" + brcode + "|" + glcode + "|" + accno
        // window.document.all['iGetDtls'].src = "../GENSBCA/GetAccDetails.aspx?st=" + st
      }
    }						
  }
}

// Suspense Start
// This function is used to populate different category codes and descriptions for suspense and sundry.
function SuspenseDetails(GLCode, vModuleId, vBranchCode, vMode) {
  var catdtls = "";

  if ((vMode == "TRANS") || (vMode == "PAY")) {
    if ((vModuleId == "SCR") && (GLCode != "") && (vBranchCode != "")) {
      catdtls = "SUSPENCE~!~" + vModuleId + "~!~" + GLCode + "~!~" + vBranchCode;
      // window.document.all['iDisp'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "querydisplay.aspx?st=" + catdtls
    }
  }
  else if (vMode == "REC") {
    catdtls = "SUSPENCE~!~" + vModuleId + "~!~" + GLCode + "~!~" + vBranchCode;
    // window.document.all['iDisp'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "querydisplay.aspx?st=" + catdtls
  }
}

// Code added by Radhika on 12 May 2008
// Desc: To select CheckBook Check box, when accounts of modules CC,CA,SB in Debit Tran mode
function GetAccountDetails(vModuleId, vBranchCode, vAccountNumber) {
  if (eval($("#ServiceCode").val() != "1")) {
    return;
  }
  if ($("#TransactionMode").is('checked') != true)
    return;

  if (vModuleId.toUpperCase() != 'SB' && vModuleId.toUpperCase() != 'CA' && vModuleId.toUpperCase() != 'CC') {
    return;
  }

  var kstr = "CHQACCYESNO" + "~" + vModuleId + "~" + st[1] + "~~" + "INR" + "~" + vBranchCode + "~~~" + vAccountNumber + "~";
  // window.document.all['getAccDet'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "genParameters.aspx?strparam=" + kstr
}

function TransMode(vMode, bdt) {
    if (vMode == "TRANS") {
        if ($("#TransactionMode").val() == "Debit") {
          trnMode = "3";
          trnDesc = "Dr Transfer";
            Amt = "-" + $("#Amount").val();
            $("#Hidden_GST").val($("#GSTIN").val());
            $("#Hidden_Cust").val($("#CustomerId").val());
            if (bdt.toUpperCase() == "TRUE") {
                $("#Module").val('INV');
                $("#Module").prop("readonly", true);
                $("#Module").prop("disabled", true);
            }
        }
        else if ($("#TransactionMode").val() == "Credit") {
            $("#Hidden_CustomerId").val($("#CustomerId").val());
            $("#Hidden_ReceipientName").val($("#AccountNumber").val());

          trnMode = "4";
          trnDesc = "Cr Transfer";

          Amt = $("#Amount").val();
            if (bdt.toUpperCase() == "TRUE") {
              $("#Module").val('INV');
              $("#Module").prop('disabled', true);
              $("#Module").prop('readonly', true);
            }
        }
        else if ($("#TransactionMode").val() == "Clearing") {
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
      // window.document.frmTrans.hid194NCustID.value = window.document.frmTrans.txtCustId.value;
    }
}
