
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

    if (((vMode == "REC") || (vMode == "PAY")) && (mode != "MODIFY") && (window.document.frmTrans.Mfgpaydt.Rows > 1)) {
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
    window.document.frmTrans.cmdModId.disabled = false
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

function TransMode(vMode, bdt) {
    if (vMode == "TRANS") {
        if ($("#TransactionMode").val() == "Debit") {
            trnMode = "3"
            trnDesc = "Dr Transfer"
            Amt = "-" + window.document.frmTrans.txtAmt.value
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

            trnMode = "4"
            trnDesc = "Cr Transfer"

            Amt = $("#Amount").val()

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
        else if ($("#TransactionMode").val() == "Clearing") {
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
