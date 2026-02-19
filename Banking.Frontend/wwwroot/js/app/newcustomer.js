
// Initialize the form when DOM is loaded
$(function () {

  $("#MembershipNumber, #memberNoLabel").hide();
  $("#MembershipName, #memberNameLabel").hide();

  let documents = [];

  $("#Personal_Email").on("blur", function () {
    debugger;
    ValidateEmail($(this).val());
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
            <td scope="row">${serialNumber}</td>
            <td>${description}</td>
            <td>${kycNo}</td>
        </tr>
    `);

    $("#KYCType").val('');
    $("#KYCNumber").val('');
    $("#KYCFile").val('');
  });

  $("#KYCClear").on('click', function () {
    $("#KYCType").val('');
    $("#KYCNumber").val('');
    $("#KYCFile").val('');
  });

  $("#searchByNameModal").on('click', function () {
    $('#nameSearchModal').modal('show');
  });

  $("#searchClick").on('click', function () {
    var name = $("#searchByName").val();
    if (name == "") {
      bankingAlert("Please enter the name");
      $("#searchByName").trigger("focus");
      return;
    }
    else {
      $.ajax({
        url: '/Customer/GetCustomerListByName',
        type: 'GET',
        data: {
          customerName: $("#searchByName").val()
        },
        success: function (response) {
          var namesTable = '<table class="table"><thead><tr><th scope="col">#</th><th scope="col">Name</th></tr></thead><tbody>';
          var parts = response.split(";");
          for (var i = 0; i < parts.length - 1; i++) {
            var segments = parts[i].split("~");
            namesTable = namesTable + '<tr><th scope="row">' + (i + 1) + '</th><td><a style="text-decoration: none">' + segments[1] + '<a></td></tr>';
          }
          namesTable = namesTable + '</tbody></table>';
          $("#namesList").html(namesTable);
        },
        error: function (err) {
          debugger;
          bankingAlert(err);
        }
      });
    }
  });

  $("#searchById").on('click', function () {
    var searchType = $("#idSearch").val();
    var searchString = $("#idSearchValue").val();

    if (searchType == "") {
      bankingAlert('Search Customer Type is mandatory.');
      return;
    }

    if (searchType != "" && searchString == "") {
      if (searchType == "PAN") {
        bankingAlert('Customer PAN Number is mandatory.');
        return;
      }
      else {
        bankingAlert('Customer Aadhaar Card number is mandatory.');
        return;
      }
    }

    SearchCustomer();
  });

  $("#MembershipNumber").on('blur', function () {
    debugger;
    if ($("#MemberId").is(':checked') == false) {
      bankingAlert("Member Id should be checked.");
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

  $("#MemberId").on('change', function () {
    IsMemberField();
  });

  $("#Personal_DOB").on('change', function () {
    DisplayDOBDate();
  });

  $('#newCustomerForm').on('submit', function (event) {
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

    let form = document.getElementById("newCustomerForm");
    let formData = new FormData(form);

    // Append KYC documents to form
    documents.forEach((doc, index) => {
      formData.append(`kycDocuments[${index}].KYCId`, doc.id);
      formData.append(`kycDocuments[${index}].KYCNo`, doc.kycNo);
      formData.append(`kycDocuments[${index}].File`, doc.file);
    });

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

  $("#Personal_Aadhaar").on('blur', function () {
    ValidateAadhaarId();
  });

});

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

function SearchCustomer() {
  debugger;
  var stPan, str, st;
  if ($("#idSearch").val() == "PAN") {
    stPan = $("#idSearchValue").val();
    if (stPan.length != "10") {
      bankingAlert("Not a valid PAN Number.")
      return;
    }
    if ((stPan.length == "10") && (stPan.substring(0, 10)).match("[(/).]+")) {
      bankingAlert("Not a valid PAN Number");
      return;
    }
    str = " (UPPER(PANNO) LIKE '" + $("#idSearchValue").val().toUpperCase() + "' ) "
  }

  if ($("#idSearch").val() == "AADHAAR") {
    stPan = $("#idSearchValue").val();
    if (stPan.length != "12") {
      bankingAlert("Not a valid Aadhaar Number");
      return;
    }
    if ((stPan.length == "12") && (stPan.substring(0, 12)).match("[(/).]+")) {
      bankingAlert("Not a valid Aadhaar Number");
      return;
    }
    str = " (UPPER(AADHARUID) LIKE '" + $("#idSearchValue").val().toUpperCase() + "' ) "
  }

  st = "SERCHCUST" + "|" + str

  $.ajax({
    url: '/GetDetails/SearchCustomer?searchString=' + encodeURIComponent(st),
    type: 'GET',
    success: function (response) {
      debugger;
      if (response == "No Records") {
        bankingAlert("No Customer Id found with this " + $("#idSearchValue").val());
        return;
      }
      else {
        var stmain1 = response.Split('~');
        bankingAlert("Customer ID: " + stmain1[0]);
        if (stmain1[1] == "N") {
          bankingAlert("This PAN Card is Inactive");
          return;
        }
        var st;
        if ($("#idSearch").val() == "PAN") {
          st = "SERINDEFUNCTINFO" + "|" + $("#idSearchValue").val();

          $.ajax({
            url: '/GetDetails/GetPANDefunctInfo?searchString=' + encodeURIComponent(st),
            type: 'GET',
            success: function (checkResponse) {
              debugger;
              if (checkResponse == "YES") {
                bankingAlert("This PAN No marked as Defunct");
                return;
              }
            },
            error: function (err) {
              console.log(err);
            }
          });
        }
        return;
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
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

function ValidateAadhaarId() {
  if (window.document.frmCustomer.opttransmod(1).checked == true) {
    if (window.document.frmCustomer.txtCustid.value == "") {
      bankingAlert("Enter Customer ID");
      window.document.frmCustomer.txtCustid.focus();
      return
    }
  }
  if (window.document.frmCustomer.txtadharid.value != "") {
    if (eval(window.document.frmCustomer.txtadharid.value.length) != 12) {
      bankingAlert("Enter Valid Aadhar ID");
      window.document.frmCustomer.txtadharid.value = "";
      window.document.frmCustomer.txtadharid.focus();
    }

    var st = "GETMODCUSTAADHARUIDTLS" + "|" + window.document.frmCustomer.txtadharid.value + "|" + window.document.frmCustomer.txtCustid.value
    window.document.all['iGetDtls1'].src = "../GEN/getDtls1.aspx?st=" + st

    popAADHARUIDDtls();
  }
}

function popAADHARUIDDtls(str) {
  if (str == "") { }
  else {
    if (str == "0") {
    }
    else {
      var stVal = str.split("|")

      var stCus = stVal[0].split("~")

      bankingAlert("This AADHAR card have already Customerid :" + stCus[0] + " and Name :" + stCus[1])
      window.document.frmCustomer.txtadharid.value = "";
      window.document.frmCustomer.txtadharid.focus();
    }
  }
}


//function GetType() {
//  st = "CustType|Cust"
//  // window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "ListCustomer.aspx" + "?" + "st=" + st)
//}

//function GetMemberName() {
//  debugger;
//}

//function Onsearch() {
//  var stname1 = window.document.frmNewCustomer.txtName.value;
//  if (stname1 == "") {
//    alert("Please enter the name");
//    window.document.frmNewCustomer.txtName.focus();
//    return;
//  }
//  else {
//    window.open('<%="http://" & session("moduledir")& "/customer/"%>' + "frmSearchTerroristList.aspx?txtCustName=" + stname1, "terrorist");
//  }
//}
