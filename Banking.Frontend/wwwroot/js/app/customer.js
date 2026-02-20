
$(function () {

  let documents = [];
  let familyMembers = [];

  //$('input, textarea, select').prop('disabled', true);
  //$("input[type='submit']").prop('disabled', true);
  //$("#viewCustomer").addClass('active');
  //$("#CustomerId").prop('disabled', false);

  //$("#modifyCustomer").on('click', function () {
  //  $('input, textarea, select').prop('disabled', false);
  //  $("#viewCustomer").removeClass('active');
  //  $("#modifyCustomer").addClass('active');
  //  $("input[type='submit']").prop('disabled', false);
  //});

  $("#MembershipNumber, #memberNoLabel").hide();
  $("#MembershipName, #memberNameLabel").hide();

  $("#CustomerId").on('change', function () {
    var stcond = " and status='R'";
    var st = $(this).val();
    if (st != "") {
      st = st + "|Main" + "|" + stcond
    }
    $("#hiddenCustId").val(st);
    window.location.href = '/Customer/Index?custId=' + encodeURIComponent(EncodeInput(st));
  });

  $("#Personal_PANNo").on('blur', function () {
    PANCheck();
  });

  $("#Personal_DOB").on('change', function () {
    DisplayDOBDate();
  });

  $("#Cancel").on('click', function () {
    location.reload();
  });

  $("#KYCClear").on('click', function () {
    $("#KYCType").val('');
    $("#KYCNumber").val('');
    $("#KYCFile").val('');
  });

  $("#AddToGrid").on("click", function () {
    debugger;
    let fileInput = document.getElementById("KYCFile");
    let file = fileInput.files[0];

    let id = $("#KYCType").val();
    let description = $("#KYCType option:selected").text();
    let kycNo = $("#KYCNumber").val();

    if (id != "" && kycNo == "") {
      $("#mandatoryFieldsAlert").text('Please KYC Number.');
      $("#mandatoryFieldsAlert").removeClass('d-none');
      window.scrollTo(0, 0);
      return;
    }

    let serialNumber = $("#kycDetails tr").length + 1;

    documents.push({
      serialNo: serialNumber,
      id: id,
      file: file,
      description: description,
      kycNo: kycNo
    });

    $("#kycDetails").append(`
        <tr>
            <td scope="row">${id}</td>
            <td>${description}</td>
            <td>${kycNo}</td>
        </tr>
    `);

    $("#HiddenField").val(documents);

    $("#KYCType").val('');
    $("#KYCNumber").val('');
    $("#KYCFile").val('');
  });

  $("#AddToFamilyGrid").on("click", function () {
    debugger;
    let name = $("#Relation_Name").val();
    let dob = $("#Relation_DOB").val();
    let relationType = $("#Relation_Type").val();
    let relationText = $("#Relation_Type option:selected").text();

    let serialNumber = $("#familyDetails tr").length + 1;

    let member = {
      serialNo: serialNumber,
      name: name,
      dob: dob,
      relationType: relationType
    };

    familyMembers.push(member);

    $("#familyDetails").append(`
        <tr>
            <td>${serialNumber}</td>
            <td>${name}</td>
            <td>${dob}</td>
            <td>${relationText}</td>
        </tr>
    `);

    $("#HiddenFamilyField").val(familyMembers);

    $("#Relation_Name").val('');
    $("#Relation_Type").val('');
    $("#Relation_DOB").val('');
  });

  $("#ClearFamilyDetails").on('click', function () {
    $("#Relation_Name").val('');
    $("#Relation_Type").val('');
    $("#Relation_DOB").val('');
  });

  $("#MembershipNumber").on('blur', function () {
    debugger;
    if ($("#MemberId").is(':checked') == false) {
      bankingAlert("Member Id should be checked.");
      $("#MembershipNumber").trigger('focus');
      return;
    }
    if ($("#MemberId").is(':checked') == true && $(this).val() == "") {
      bankingAlert("Please enter the Member Id.");
      return;
    }
    var st = $("#MembershipNumber").val() + "|Member";
    $.ajax({
      url: '/Customer/GetMemberNameById?memberId=' + encodeURIComponent(st),
      type: 'GET',
      success: function (response) {
        debugger;
        var result = response.split("|");
        if (result[1] != "")
          $("#MembershipName").val(result[1]);
      },
      error: function (err) {
        console.log(err);
      }
    });
  });

  $("#Age").on('blur', function () {
    DisplayDate();
    IsMinor();
    IsSenior();
  });

  $("#MemberId").on('blur', function () {
    IsMemberField();
  });

  $("#Personal_Aadhaar").on('blur', function () {
    ValidateAadhaarId();
  });

  $("#Personal_Email").on("blur", function () {
    debugger;
    ValidateEmail($(this).val());
  });

  $("#Personal_DOB").on('change', function () {
    DisplayDOBDate();
  });

  $('#customerForm').on('submit', function (event) {
    event.preventDefault();
    debugger;

    if ($("#Salutation").val() == "" || $("#CustomerType").val() == "" || $("#Personal_DOB").val() == "" || $("#Mailing_FlatNo").val() == "" ||
      $("#Mailing_Building").val() == "" || $("#Mailing_Pincode").val() == "" || $("#Personal_Gender").val() == "" ||
      $("#Personal_MaritalStatus").val() == "" || $("#Personal_Mobile").val() == "") {
      $("#mandatoryFieldsAlert").text('Please fill all the mandatory or fields with * marks.');
      $("#mandatoryFieldsAlert").removeClass('d-none');
      window.scrollTo(0, 0);
      return;
    }
    else {
      $("#mandatoryFieldsAlert").addClass('d-none');
    }

    if ($("#KYCType").val() != "" && $("#KYCNumber").val() == "") {
      $("#mandatoryFieldsAlert").text('Please KYC Number.');
      $("#mandatoryFieldsAlert").removeClass('d-none');
      window.scrollTo(0, 0);
      return;
    }
    else {
      $("#mandatoryFieldsAlert").addClass('d-none');
    }

    if (eval($("#Mailing_Pincode").val()) == "0") {
      bankingAlert("Invalid Pincode");
      return;
    }
    if (eval($("#Mailing_Phone").val()) == "0") {
      bankingAlert("Invalid Phone No.");
      return;
    }
    if (eval($("#Personal_Mobile").val()) == "0") {
      bankingAlert("Invalid Mobile No.");
      return;
    }
    if ($("#Personal_CKYCID").val() != "") {
      if ($("#Personal_CKYCEnrollDate").val() == "") {
        bankingAlert("CKYC Enroll Date should not be null.");
        return;
      }
    }
    if ($("#Personal_PANNo").val() != "") {
      if ($("#Personal_PANAAYN").is(':checked') == false) {
        bankingAlert("PAN206AAYN should be checked compulsory");
        return;
      }
    }
    if ($("#CustomerName").val() == "") {
      bankingAlert("Name cannot be null..");
      return;
    }
    if ($("#CustomerType").val() == "") {
      bankingAlert("Customer Type cannot be null..");
      return;
    }
    if ($("#Personal_RelationName").val() == "") {
      bankingAlert("Father Name cannot be null..");
      return;
    }

    let form = document.getElementById("customerForm");
    let formData = new FormData(form);

    // Append KYC documents to form
    documents.forEach((doc, index) => {
      formData.append(`kycDocuments[${index}].KYCId`, doc.id);
      formData.append(`kycDocuments[${index}].KYCNo`, doc.kycNo);
      formData.append(`kycDocuments[${index}].File`, doc.file);
    });

    // Append Family Details to form
    familyMembers.forEach((docs, index) => {
      formData.append(`relations[${index}].Name`, docs.name);
      formData.append(`relations[${index}].DOB`, docs.dob);
      formData.append(`relations[${index}].RelationType`, docs.relationType);
    });

    debugger;

    $.ajax({
      type: "POST",
      url: form.action,
      data: formData,
      async: true,
      processData: false, // REQUIRED
      contentType: false, // REQUIRED
      success: function (response) {
        bankingAlert(result);
        window.scrollTo(0, 0);
      },
      error: function (err) {
        console.error(err);
      }
    });
  });

});

function PANCheck() {
  var panNum = $("#Personal_PANNo").val().toUpperCase();

  if (panNum == "") {
    bankingAlert("Please enter PAN Number");
    return;
  }
  else {
    if ((panNum.length == "10") && (panNum.substring(0, 10)).match("[(/).]+")) {
      bankingAlert("Not a valid PAN Number");
      $("#Personal_PANNo").val('');
    }
    else {
      if (panNum.length == "10") {
        if ((panNum.substring(0, 5)).match(/^[a-zA-Z]+$/) && (panNum.substring(5, 9)).match(/^[0-9]+$/) && (panNum.substring(9, 10)).match(/^[a-zA-Z]+$/)) {
          var st = "GETMODCUSTPANDTLS" + "|" + panNum.toUpperCase() + "|" + $("#CustomerId").val();

          $.ajax({
            url: '/GetDetails/GetModifiedCustomerPANDetails?searchString=' + encodeURIComponent(st),
            type: 'GET',
            success: function (response) {
              debugger;
              if (response != "") {
                if (response != "0") {
                  var stVal = str.split("|");
                  var stCus = stVal[0].split("~");
                  bankingAlert("This Pan card have already Customerid :" + stCus[0] + " and Name :" + stCus[1]);
                  $("#Personal_PANNo").val('');
                  $("#Personal_PANNo").trigger('focus');
                  return;
                }
              }
            },
            error: function (err) {
              console.log(err);
            }
          });
        }
        else {
          bankingAlert("Not a valid PAN Number")
          $("#Personal_PANNo").val('');
          $("#Personal_PANNo").trigger('focus');
          return;
        }
      }
      else {
        bankingAlert("Not a valid PAN Number")
        $("#Personal_PANNo").val('');
        $("#Personal_PANNo").trigger('focus');
        return;
      }
    }
  }
}

function ValidateAadhaarId() {
  if (Personal_Aadhaar != "") {
    if (eval($("#Personal_Aadhaar").val().length) != 12) {
      bankingAlert("Enter Valid Aadhar ID");
      $("#Personal_Aadhaar").val('');
      return;
    }

    var st = "GETMODCUSTAADHARUIDTLS" + "|" + $("#Personal_Aadhaar").val() + "|";

    $.ajax({
      url: '/GetDetails/GetModifiedCustomerAadhaarDetails?searchString=' + encodeURIComponent(st),
      type: 'GET',
      success: function (response) {
        debugger;
        if (response != "") {
          if (response != "0") {
            var stVal = str.split("|");
            var stCus = stVal[0].split("~");
            bankingAlert("This Aadhaar Card have already Customerid: " + stCus[0] + " and Name:" + stCus[1])
            $("#Personal_Aadhaar").val('');
            return;
          }
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  }
}

function IsMemberField() {
  debugger;
  if ($("#MemberId").is(':checked') == true) {
    $("#MembershipNumber, #memberNoLabel").show();
    $("#MembershipNumber").val('');
    $("#MembershipName, #memberNameLabel").show();
    $("#MembershipName").val('');
  }
  else {
    $("#MembershipNumber, #memberNoLabel").hide();
    $("#MembershipNumber").val('');
    $("#MembershipName, #memberNameLabel").hide();
    $("#MembershipName").val('');
  }
}

function DisplayDate() {
  var d = new Date();
  var n = d.getFullYear();
  $("#Personal_DOB").val('01-Jan-' + eval(n - eval($("#Age").val())));
}

function IsMinor() {
  var st = $("#Personal_DOB").val() + "|" + "txtDob";

  $.ajax({
    url: '/GetDetails/GetDateDifference?searchString=' + encodeURIComponent(st),
    type: 'GET',
    success: function (response) {
      debugger;
      var result = response.split("~");
      if (eval(result[0]) >= 0) {
        bankingAlert("DOB should Be Less Than Application Date..")
        $("#Personal_DOB").val();
        $('#Personal_Minor').prop('checked', false);
        return;
      }
      if ($('#Personal_Minor').is('checked') == true) {
        if ((eval(result[1]) / 365) > 18) {
          $('#Personal_Minor').prop('checked', false);
          return;
        }
      }
      else {
        if ((eval(result[1]) / 365) > 18) {
          $('#Personal_Minor').prop('checked', false);
          return;
        }
        else {
          $('#Personal_Minor').prop('checked', true);
          return;
        }
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function IsSenior() {
  if (eval($("#Age").val()) >= "60") {
    $("#CustomerType").val('2');
  }
  else {
    $("#CustomerType").val('1');
  }
}

function DisplayDOBDate() {
  debugger;
  var dtval = $("#Personal_DOB").val();
  if (dtval == "") { return false; }
  var appdate = $("#ApplicationDate").val();
  if (eval(dtval.length) != 11) {
    formatDate($("#Personal_DOB").val(), appdate);
    dtval = $("#Personal_DOB").val();
    if (dtval == "") {
      $("#Age").val('');
      $("#Personal_Minor").val('checked');
      return;
    }
  }
  var yrval1 = dtval.substring(7);
  var yrval2 = appdate.substring(7);
  var yr = yrval2 - yrval1;
  if (yr > 0) {
    $("#Age").val(yr);
    IsMinor();
    IsSenior();
  }
  else {
    bankingAlert("Select valid DOB");
    $("#Personal_DOB").val('');
    $("#Age").val('');
    $("#Personal_Minor").val('unchecked');
  }
}



//function GetMode() {

//  if (window.document.frmCustomer.opttransmod(1).checked == true) {
//    window.document.frmCustomer.hidmode.value = "Modify"
//    window.document.frmCustomer.cmdCustomer.style.visibility = "visible"
//    EnableCtls()
//    window.document.frmCustomer.txtCustname.disabled = false
//    window.document.frmCustomer.txtCustid.readOnly = false
//    window.document.frmCustomer.radclick(6).disabled = false
//    window.document.frmCustomer.slctRiskcat.disabled = false
//  }
//  else if (window.document.frmCustomer.opttransmod(2).checked == true) {
//    window.document.frmCustomer.hidmode.value = "Delete"
//    window.document.frmCustomer.cmdCustomer.style.visibility = "visible"
//    EnableCtls()
//    DisableCtls()
//    window.document.frmCustomer.txtCustname.disabled = true
//    window.document.frmCustomer.radclick(6).disabled = false
//  }
//  else if (window.document.frmCustomer.opttransmod(3).checked == true) {
//    window.document.frmCustomer.hidmode.value = "View"
//    window.document.frmCustomer.cmdCustomer.style.visibility = "visible"
//    EnableCtls()
//    DisableCtls()
//    window.document.frmCustomer.txtCustid.readOnly = false
//    window.document.frmCustomer.txtCustname.disabled = true
//    window.document.frmCustomer.radclick(6).disabled = false
//    window.document.frmCustomer.cmdOk.disabled = true
//    window.document.frmCustomer.slctRiskcat.disabled = true
//    window.document.frmCustomer.slcsalutation.disabled = true
//    window.document.frmCustomer.slcrelation.disabled = true
//    window.document.frmCustomer.slcreligion.disabled = true
//  }
//}

//function GetNewCust() {
//  record = "<%=record%>" //
//  result = "<%=result%>" //
//  if (result.length > 1)
//    record = result
//  record = record.split("|")
//  if (record.length > 1) {
//    $("#CustomerId").val(record[0]);
//    $("#CustomerName").val(record[1]);
//    if (record.length > 2) {
//      $("#CustomerId").val(record[2]);
//    }
//    st = record[0] + "|Main"
//    $("#modifyCustomer").addClass('active');
//  }
//}













// for Date checking



//function Datecheck(fdate, tdate) {
//  var frdt = fdate.value
//  var todt = tdate.value
//  var fmdate = new String()
//  var tmdate = new String()
//  fmdate = frdt.split("-")
//  tmdate = todt.split("-")
//  var frmdate = fmdate[0] + "" + fmdate[1] + "" + fmdate[2]
//  var trodate = tmdate[0] + "" + tmdate[1] + "" + tmdate[2]
//  var fromdate = Date.parse(frmdate)
//  var todate = Date.parse(trodate)
//  var diff = todate - fromdate
//  if (eval(diff) >= 0) {
//    retrnval = "FALSE"
//  }
//  else {
//    retrnval = "TRUE"
//  }
//}

//function Datecheck1(fdate, tdate) {
//  var frdt = fdate.value
//  var todt = tdate.value
//  var fmdate = new String()
//  var tmdate = new String()
//  fmdate = frdt.split("-")
//  tmdate = todt.split("-")
//  var frmdate = fmdate[0] + "" + fmdate[1] + "" + fmdate[2]
//  var trodate = tmdate[0] + "" + tmdate[1] + "" + tmdate[2]
//  var fromdate = Date.parse(frmdate)
//  var todate = Date.parse(trodate)
//  var diff = todate - fromdate
//  if (eval(diff) > 0) {
//    retrnval = "FALSE"
//  }
//  else {
//    retrnval = "TRUE"
//  }
//}

//function Datecheck2(fdate, tdate) {
//  var frdt = fdate
//  var todt = tdate.value
//  var fmdate = new String()
//  var tmdate = new String()
//  fmdate = frdt.split("-")
//  tmdate = todt.split("-")
//  var frmdate = fmdate[0] + "" + fmdate[1] + "" + fmdate[2]
//  var trodate = tmdate[0] + "" + tmdate[1] + "" + tmdate[2]
//  var fromdate = Date.parse(frmdate)
//  var todate = Date.parse(trodate)
//  var diff = todate - fromdate
//  if (eval(diff) > 0) {
//    bankingAlert("This Date Should Be Less Than Or Equal To ApplicationDate")
//    return false
//  }

//  else {
//    return true
//  }
//}

//function GetDateDif(kstr, str1, str2) {
//  if (window.document.frmCustomer.txtCustType.value == "") {
//    bankingAlert("Category Code Should Not Be Null")
//    window.document.frmCustomer.txtDob.value = ""
//    return
//  }
//  if (window.document.frmCustomer.txtCustType.value == "1") {

//    if ((eval(str2) / 365) < 18)
//      window.document.frmCustomer.chkMinor.checked = true
//    else
//      window.document.frmCustomer.chkMinor.checked = false
//  }
//  else {
//    if ((eval(str2) / 365) > 18)
//      window.document.frmCustomer.chkMinor.checked = false
//    else {
//      window.document.frmCustomer.chkMinor.checked = true
//      window.document.frmCustomer.chkMinor.disabled = true
//      return
//    }
//  }

//  if (eval(kstr) >= 0) {
//    bankingAlert("DOB Should Be Less Than Application Date..")
//    if (str1.length == 4)
//      window.document.frmCustomer.txtDob.value = ""
//    window.document.frmCustomer.chkMinor.checked = false
//    if (str1.length == 3)
//      window.document.frmCustomer.txtFamDob.value = ""
//  }
//}

//function Ok() {
//  if (eval(window.document.frmCustomer.txtFax.value) == "0") {
//    bankingAlert("Invalid Fax No.")
//    window.document.frmCustomer.radclick(0).checked = true
//    DispDivision("1")
//    window.document.frmCustomer.txtFax.select()
//    return;
//  }

//  if (eval(window.document.frmCustomer.txtMPin.value) == "0") {
//    bankingAlert("Invalid Pin No.")
//    window.document.frmCustomer.radclick(3).checked = true
//    DispDivision("4")
//    window.document.frmCustomer.txtMPin.select()
//    return;
//  }
//  if (eval(window.document.frmCustomer.txtOPin.value) == "0") {
//    bankingAlert("Invalid Pin No.")
//    window.document.frmCustomer.radclick(4).checked = true
//    DispDivision("5")
//    window.document.frmCustomer.txtOPin.select()
//    return;
//  }
//  if (eval(window.document.frmCustomer.txtPPin.value) == "0") {
//    bankingAlert("Invalid Pin No.")
//    window.document.frmCustomer.radclick(5).checked = true
//    DispDivision("6")
//    window.document.frmCustomer.txtPPin.select()
//    return;
//  }

//  if ((window.document.frmCustomer.txtCustType.value != "1") && (window.document.frmCustomer.chkMinor.checked == true)) {
//    bankingAlert("DOB Should Not Be A Minor DOB")
//    window.document.frmCustomer.txtDob.select()
//    return

//  }
//  if ((window.document.frmCustomer.chkMember.checked == true) && (window.document.frmCustomer.txtMemId.value == "")) {
//    bankingAlert("Member Id Should Not Be Null")
//    window.document.frmCustomer.txtMemId.focus()
//    return
//  }
//  if (window.document.frmCustomer.slctRiskcat.selectedIndex == "0") {
//    bankingAlert("Risk Category should be selected")
//    window.document.frmCustomer.slctRiskcat.select()
//    return
//  }
//  if (window.document.frmCustomer.txtBranchCode.value == "") {
//    bankingAlert("Select Branch code.")
//    window.document.frmCustomer.txtBranchCode.focus()
//    return;
//  }

//  if (window.document.frmCustomer.txtCurrencyCode.value == "") {
//    bankingAlert("Select Currency code.")
//    window.document.frmCustomer.txtCurrencyCode.focus()
//    return;
//  }

//  if (window.document.frmCustomer.txtCustname.value == "") {
//    bankingAlert("Select Customer Name.")
//    window.document.frmCustomer.txtCustname.focus()
//    return;
//  }

//  if (window.document.frmCustomer.txtCustType.value == "") {
//    bankingAlert("Select Customer Type.")
//    window.document.frmCustomer.txtCustType.focus()
//    return;
//  }

//  if (window.document.frmCustomer.txtMFlat.value == "") {
//    bankingAlert("Select Flat.")
//    window.document.frmCustomer.txtMFlat.focus()
//    return;
//  }

//  if (window.document.frmCustomer.slctRiskcat.selectedIndex == 0) {
//    bankingAlert("Select Risk Category.")
//    window.document.frmCustomer.slctRiskcat.focus()
//    return;
//  }

//  if ((window.document.frmCustomer.txtBranchCode.value == "") ||
//    (window.document.frmCustomer.txtCurrencyCode.value == "") ||
//    (window.document.frmCustomer.txtCustname.value == "") ||
//    (window.document.frmCustomer.txtCustType.value == "") ||
//    (window.document.frmCustomer.txtMFlat.value == "") ||
//    (window.document.frmCustomer.slctRiskcat.selectedIndex == "")) {
//    bankingAlert("Manditory Fields should not be null..")
//    return
//  }

//  var result = CheckVals()
//  if (window.document.frmCustomer.hidmode.value != "Modify")
//    result = ""
//  if (result == "Perm") {
//    bankingAlert("Please Fill Permanent Address...")
//    return
//  }
//  else if (result == "office") {
//    bankingAlert("Please Fill Office Address...")
//    return
//  }
//  else if (result == "Occupation") {
//    bankingAlert("Please Fill Occupation Details...")
//    return
//  }
//  else if (result == "family") {
//    bankingAlert("Please Fill Family Details...")
//    return
//  }
//  brcode = "'" + window.document.frmCustomer.txtBranchCode.value + "'"
//  custname = "'" + window.document.frmCustomer.txtCustname.value + "'"
//  typeid = window.document.frmCustomer.txtCustType.value
//  riskcategory = "'" + window.document.frmCustomer.slctRiskcat.selectedIndex + "'"
//  if (isNaN(typeid) == true)
//    typeid = 0
//  if (window.document.frmCustomer.chkMember.checked == false)
//    window.document.frmCustomer.txtMemId.value = ""
//  memid = "'" + window.document.frmCustomer.txtMemId.value + "'"

//  dob = "'" + window.document.frmCustomer.txtDob.value + "'"
//  mail = "'" + window.document.frmCustomer.txtEmail.value + "'"
//  mobile = "'" + window.document.frmCustomer.txtMobile.value + "'"
//  fax = "'" + window.document.frmCustomer.txtFax.value + "'"
//  if (window.document.frmCustomer.chkMinor.checked == true)
//    minor = "'" + "Y" + "'"
//  else
//    minor = "'" + "N" + "'"
//  if (window.document.frmCustomer.optMarital(0).checked == true)
//    marital = "'" + "Y" + "'"
//  else
//    marital = "'" + "N" + "'"
//  if (window.document.frmCustomer.optGender(0).checked == true)
//    gender = "'" + "M" + "'"
//  else
//    gender = "'" + "F" + "'"
//  occup = window.document.frmCustomer.cmbOccupation.options[
//    window.document.frmCustomer.cmbOccupation.selectedIndex].value

//  qual = window.document.frmCustomer.cmbEducation.options[
//    window.document.frmCustomer.cmbEducation.selectedIndex].value
//  income = window.document.frmCustomer.cmbIncome.options[
//    window.document.frmCustomer.cmbIncome.selectedIndex].value


//  phone1 = "'" + window.document.frmCustomer.txtPhone1.value + "'"
//  phone2 = "'" + window.document.frmCustomer.txtPhone2.value + "'"
//  phone3 = "'" + window.document.frmCustomer.txtPhone3.value + "'"

//  mail1 = "'" + window.document.frmCustomer.txtMFlat.value + "'"
//  mail2 = "'" + window.document.frmCustomer.txtMBldg.value + "'"
//  mail3 = "'" + window.document.frmCustomer.txtMArea.value + "'"
//  mail4 = "'" + window.document.frmCustomer.txtMCity.value + "'"
//  mail5 = "'" + window.document.frmCustomer.txtMPin.value + "'"

//  perm1 = "'" + window.document.frmCustomer.txtPFlat.value + "'"
//  perm2 = "'" + window.document.frmCustomer.txtPBldg.value + "'"
//  perm3 = "'" + window.document.frmCustomer.txtPArea.value + "'"
//  perm4 = "'" + window.document.frmCustomer.txtPCity.value + "'"
//  perm5 = "'" + window.document.frmCustomer.txtPPin.value + "'"

//  off1 = "'" + window.document.frmCustomer.txtOFlat.value + "'"
//  off2 = "'" + window.document.frmCustomer.txtOBldg.value + "'"
//  off3 = "'" + window.document.frmCustomer.txtOArea.value + "'"
//  off4 = "'" + window.document.frmCustomer.txtOCity.value + "'"
//  off5 = "'" + window.document.frmCustomer.txtOPin.value + "'"

//  if (window.document.frmCustomer.chksmsyn.checked == true)
//    window.document.frmCustomer.hidsmsyn.value = "Y"
//  else
//    window.document.frmCustomer.hidsmsyn.value = "N"

//  if (window.document.frmCustomer.chkmobaccyn.checked == true)
//    window.document.frmCustomer.hidmobaccyn.value = "Y"
//  else
//    window.document.frmCustomer.hidmobaccyn.value = "N"

//  if (window.document.frmCustomer.chkpan206aayn.checked == true)
//    window.document.frmCustomer.hdnpan206aayn.value = "Y"
//  else
//    window.document.frmCustomer.hdnpan206aayn.value = "N"

//  if (window.document.frmCustomer.chkpan206abyn.checked == true)
//    window.document.frmCustomer.hdnpan206abyn.value = "Y"
//  else
//    window.document.frmCustomer.hdnpan206abyn.value = "N"

//  if (window.document.frmCustomer.txtpan.value == "") {
//    window.document.frmCustomer.hidpankycid.value = ""
//  }
//  else {
//    window.document.frmCustomer.hidpankycid.value = "2"
//  }

//  if (window.document.frmCustomer.txtadharid.value == "") {
//    window.document.frmCustomer.hidadharkycid.value = ""
//  }
//  else {
//    window.document.frmCustomer.hidadharkycid.value = "12"
//  }

//  if (window.document.frmCustomer.txtgstin.value == "") {
//    window.document.frmCustomer.hidgstinkycid.value = ""
//  }
//  else {
//    window.document.frmCustomer.hidgstinkycid.value = "13"
//  }

//  if (window.document.frmCustomer.txtCustid.value == "")
//    sep = ","
//  else
//    sep = "~"
//  var dbvalues = brcode + sep + custname + sep + typeid + sep + memid + sep + dob + sep + mail + sep + fax + sep +
//    mobile + sep + minor + sep + marital + sep + gender + sep + occup + sep + qual + sep +
//    income + sep + phone1 + sep + phone2 + sep + phone3 + sep + mail1 + sep + mail2 + sep +
//    mail3 + sep + mail4 + sep + mail5 + sep + perm1 + sep + perm2 + sep + perm3 + sep +
//    perm4 + sep + perm5 + sep + off1 + sep + off2 + sep + off3 + sep + off4 + sep + off5

//  var famdtls = ""
//  for (i = 1; i < window.document.frmCustomer.mfgPenal.Rows; i++) {
//    fname = "'" + window.document.frmCustomer.mfgPenal.TextMatrix(i, 1) + "'"
//    fdob = "'" + window.document.frmCustomer.mfgPenal.TextMatrix(i, 2) + "'"
//    frel = "'" + window.document.frmCustomer.mfgPenal.TextMatrix(i, 3) + "'"
//    famdtls = famdtls + "#" + brcode + "," + fname + "," + fdob + "," + frel
//  }

//  if (window.document.frmCustomer.txtKYCNo.value != "") {
//    bankingAlert("Enter KYC Details")
//    return
//  }

//  var kycvals = ""
//  var rows = window.document.frmCustomer.MfgKYC.Rows

//  if (rows > 1) {
//    for (icnt = 1; icnt < rows; icnt++) {
//      var kycid = window.document.frmCustomer.MfgKYC.TextMatrix(icnt, 1)
//      var kycno = window.document.frmCustomer.MfgKYC.TextMatrix(icnt, 3)
//      var kyclnk = kycid + "," + kycno
//      kycvals = kycvals + "|" + kyclnk
//    }
//    kycvals = kycvals.substr(1)
//  }

//  if (window.document.frmCustomer.hidmode.value == "Delete") {
//    dbvalues = ""
//    famdtls = ""
//  }
//  var strallvalues = ""
//  if ((window.document.frmCustomer.mfgcarddtls.rows > 1) &&
//    (window.document.frmCustomer.mfgcarddtls.TextMatrix(1, 1))) {
//    for (var intcount = 1; intcount < window.document.frmCustomer.mfgcarddtls.Rows; intcount++) {
//      with (window.document.frmCustomer) {
//        strallvalues = strallvalues + "'" + (txtBranchCode.value).toUpperCase() + "'"
//        for (var i = 1; i < 15; i++) {
//          strallvalues = strallvalues + ",'" + (mfgcarddtls.TextMatrix(intcount, i)).toUpperCase() + "'"
//        }
//        strallvalues = strallvalues + ",'R'"
//        strallvalues = strallvalues + ",'P'"
//        strallvalues = strallvalues + ",'<%=session("Applicationdate")%>'"
//        strallvalues = strallvalues + ",'<%=session("userid")%>'"
//        strallvalues = strallvalues + ",'<%=session("Machineid")%>'"
//        strallvalues = strallvalues + ",sysdate"
//      }//WithClose
//      strallvalues = strallvalues + "|"
//    }//ForClose
//    window.document.frmCustomer.hdata.value = strallvalues
//  }//If Close

//  if (window.document.frmCustomer.hidmode.value != "View") {
//    window.document.frmCustomer.hidcustvals.value = dbvalues
//    //bankingAlert("dbvalues="+dbvalues)
//    window.document.frmCustomer.hidfamvals.value = famdtls

//    window.document.frmCustomer.hidkycid.value = kycvals

//    window.document.frmCustomer.txtCustid.disabled = false
//    window.document.frmCustomer.action = "customerinsert.aspx"
//    window.document.frmCustomer.method = "post"
//    window.document.frmCustomer.submit()
//  }
//}

//function CheckVals() {
//  if (window.document.frmCustomer.radclick(2).checked == true) {
//    val1 = window.document.frmCustomer.cmbEducation.options[window.document.frmCustomer.cmbEducation.selectedIndex].value
//    val2 = window.document.frmCustomer.cmbIncome.options[window.document.frmCustomer.cmbIncome.selectedIndex].value
//    val3 = window.document.frmCustomer.cmbOccupation.options[window.document.frmCustomer.cmbOccupation.selectedIndex].value

//    if ((val1 < 1) && (val2 < 1) && (val3 < 1))
//      return "Occupation"
//    else
//      return true
//  }
//  if (window.document.frmCustomer.radclick(5).checked == true) {
//    val1 = window.document.frmCustomer.txtPArea.value.length
//    val2 = window.document.frmCustomer.txtPBldg.value.length
//    val3 = window.document.frmCustomer.txtPCity.value.length
//    val4 = window.document.frmCustomer.txtPFlat.value.length
//    val5 = window.document.frmCustomer.txtPPin.value.length
//    val6 = window.document.frmCustomer.txtPhone3.value.length
//    if ((val1 < 1) && (val2 < 1) && (val3 < 1) && (val4 < 1) && (val5 < 1) && (val6 < 1))
//      return "Perm"
//    else
//      return true
//  }
//  if (window.document.frmCustomer.radclick(4).checked == true) {
//    val1 = window.document.frmCustomer.txtOArea.value.length
//    val2 = window.document.frmCustomer.txtOBldg.value.length
//    val3 = window.document.frmCustomer.txtOCity.value.length
//    val4 = window.document.frmCustomer.txtOFlat.value.length
//    val5 = window.document.frmCustomer.txtOPin.value.length
//    val6 = window.document.frmCustomer.txtPhone2.value.length
//    if ((val1 < 1) && (val2 < 1) && (val3 < 1) && (val4 < 1) && (val5 < 1) && (val6 < 1))
//      return "office"
//    else
//      return true
//  }
//}

//function FamilyDelete() {
//  window.document.frmCustomer.txtFamDob.value = ""
//  window.document.frmCustomer.txtFamName.value = ""
//  window.document.frmCustomer.cmbRelation.options[0].selected = true
//}

//function dtpDob_CloseUp() {
//  Datepick(window.document.frmCustomer.dtpDob, window.document.frmCustomer.txtDob)
//  strVal = window.document.frmCustomer.txtDob.value + "|" + "9999"
//  window.document.all['iBatch1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "datecheck.aspx?strVal=" + strVal
//}

//function dtpFamDob_CloseUp() {
//  Datepick(window.document.frmCustomer.dtpFamDob, window.document.frmCustomer.txtFamDob)
//  st = window.document.frmCustomer.txtFamDob.value + "|" + "999"
//  window.document.all['iBatch1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "datecheck.aspx?strVal=" + st
//}

//function getcustid(kstr) {
//  var stcond
//  stcond = ""
//  if (kstr != "No Data Found..") {
//    Clear()
//    kstr = kstr.split("~")
//    window.document.frmCustomer.txtCustid.value = kstr[1]
//    window.document.frmCustomer.txtCustname.value = kstr[2]

//    if (window.document.frmCustomer.hidmode.value == "Modify") {
//      stcond = " and status='R'"
//    }
//    else {
//      stcond = ""
//    }

//    st = kstr[1] + "|Main|" + stcond

//    window.document.all['iBatch'].src = "customerfly1.aspx?st=" + st
//  }
//}

//function GetCustomer() {
//  var butname = "butCustold"
//  st = butname + "~" + window.document.frmCustomer.txtBranchCode.value
//  // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "accnamecustlist.aspx" + "?" + "strbut=" + st)
//}

//function Onsearch() {
//  if (window.document.frmCustomer.txtCustname.value == "") {
//    bankingAlert("Name should not be Empty")
//  }
//  else {
//    strName = window.document.frmCustomer.txtCustname.value
//    // window.open('<%="http://" & session("moduledir")& "/customer/"%>' + "frmSearchTerroristList.aspx?txtCustName=" + strName, "terrorist")
//  }
//}


//// Selection: New - Modify - View - Delete
//function focus() {
//  window.document.frmCustomer.dtpDob.value = "<%=session("applicationdate")%>"
//  window.document.frmCustomer.dtpFamDob.value = "<%=session("applicationdate")%>"
//  window.document.frmCustomer.cmdOk.disabled = false
//  DisableCtls()
//  window.document.frmCustomer.txtCustname.disabled = true
//  window.document.frmCustomer.radclick(6).disabled = false
//  window.document.frmCustomer.cmdOk.disabled = false
//  DispDivision("1")
//}
