
// Initialize the form when DOM is loaded
$(document).ready(function () {

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

    documents.push({
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
        var result = response.split('|');
        if (result[1] != "")
          bankingAlert("Member Name: " + result[1]);
        //$("#MembershipNumber").val();
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

  $("#Personal_DOB").on('blur', function () {
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
      var result = response.Split('~');
        if (eval(result[0]) >= 0) {
          bankingAlert("DOB should Be Less Than Application Date..")
          $("#").val();
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
            $('#Personal_Minor').prop('checked', false);
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
    $("#Personal_DOB").val(yr);
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
    $("#MembershipNumber").val('');
    $("#MembershipName").val('');
  }
}

function checkDiv() {
  var prasad = "SAS Enterprises"
}

function GetType() {
  st = "CustType|Cust"
  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "ListCustomer.aspx" + "?" + "st=" + st, window, "status:no;dialogwidth:350px;dialogheight:170px; dialogleft:200px; dialogtop:260px")
}

function GetMemberName() {
  debugger;
}

function Onsearch() {
  var stname1 = window.document.frmNewCustomer.txtName.value;
  if (stname1 == "") {
    alert("Please enter the name");
    window.document.frmNewCustomer.txtName.focus();
    return;
  }
  else {
    window.open('<%="http://" & session("moduledir")& "/customer/"%>' + "frmSearchTerroristList.aspx?txtCustName=" + stname1, "terrorist", "width=500%,height=600%,left=150,top=120");
  }
}


//function dispOccCode(str) {
//  if (str != "No Data Found..") {
//    str = str.split("-----")
//    window.document.frmNewCustomer.txtCustType.value = str[1]
//    window.document.frmNewCustomer.txtCustTypedesc.value = str[0]
//    if (window.document.frmNewCustomer.txtCustType.value == "1") {
//      window.document.frmNewCustomer.chkMinor.disabled = false
//    }
//    else {
//      window.document.frmNewCustomer.chkMinor.checked = false
//      window.document.frmNewCustomer.chkMinor.disabled = true
//    }
//  }
//}

//function CheckResult() {
//  window.document.frmNewCustomer.txtckycenrollDt.value = "<%=session("applicationdate")%>"
//  window.document.frmNewCustomer.MfgKYC.Rows = 1
//  var appdat = "<%=session("applicationdate")%>"

//  var yr = appdat.substring(7) - 1

//  window.document.frmNewCustomer.txtName.focus()

//  var strresult = ""
//  var strcon = "nothing"
//  var record = ""
//  record = "<%=record%>"

//  strresult = "<%=strresult%>"
//  custid = "<%=custid%>"

//  if (custid.length > 0) {
//    st = custid
//    window.document.frmNewCustomer.txtName.disabled = true
//    window.document.frmNewCustomer.slcrelation.disabled = true
//    window.document.frmNewCustomer.txtfathername.disabled = true
//    window.document.frmNewCustomer.cmdCustType.disabled = true
//    window.document.frmNewCustomer.txtAddress1.disabled = true
//    window.document.frmNewCustomer.txtAddress2.disabled = true
//    window.document.frmNewCustomer.txtAddress3.disabled = true
//    window.document.frmNewCustomer.txtAddress4.disabled = true
//    window.document.frmNewCustomer.txtAddress5.disabled = true
//    window.document.frmNewCustomer.txtMail.disabled = true
//    window.document.frmNewCustomer.txtphone1.disabled = true
//    window.document.frmNewCustomer.txtphone2.disabled = true
//    window.document.frmNewCustomer.txtphone3.disabled = true
//    window.document.frmNewCustomer.txtMobile.disabled = true
//    window.document.frmNewCustomer.txtFax.disabled = true
//    window.document.frmNewCustomer.txtPan.disabled = true
//    window.document.frmNewCustomer.txtAdharID.disabled = true
//    window.document.frmNewCustomer.chkMinor.disabled = true
//    window.document.frmNewCustomer.chkGlobal.disabled = true
//    window.document.frmNewCustomer.chkGlobal.checked = false
//    window.document.frmNewCustomer.txtCustType.disabled = true
//    window.document.frmNewCustomer.txtCustTypedesc.disabled = true
//    window.document.frmNewCustomer.slctRiskcat.disabled = true
//    window.document.frmNewCustomer.txtgstin.disabled = true
//    window.document.frmNewCustomer.txtckycid.disabled = true
//    window.document.frmNewCustomer.slckyctype.disabled = true
//    window.document.frmNewCustomer.txtKYCNo.disabled = true

//    st = "DTLS~" + st

//    window.document.all['iBatch'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "customerfly.aspx?st=" + st

//    return
//  }
//  if (record.length > 0) {
//    if (record.substring(0, 14) == "GENCUSTINFOMST") {
//      return;
//    }

//    var str, str1
//    var stmain = record.split("|")
//    window.attachEvent(window.opener.NewCustDisplay(record.toUpperCase()))

//    if (stmain[6] != "yes") {
//      strcon = window.confirm("Do you want to enter more Customer details....")
//      if (strcon == true) {
//        window.open('<%="http://" & session("moduledir")& "/GEN/"%>' + "customer.aspx" + "?" + "record=" + record, "CustomerDetails", "width=800,height=600,left=0,top=0")
//      }
//    }
//    window.close()
//  }
//}

//function Display(str1) {
//  var StrArrFld = new String()
//  var StrArrFlds = new String()
//  if (str1.length > 0) {
//    if (str1 == "") {
//      window.close()
//      return
//    }
//    str2 = str1.split(">>")
//    str = str2[0].split("|")
//    StrArrFld = str2[1].split("|")
//    if (str[0] == "MemberName") {
//      if (str[1] == "NoMember") {
//        bankingAlert("Invalid Member Id.")
//        window.document.frmNewCustomer.txtMemId.value = ""
//        return;
//      }
//      else {
//        window.document.frmNewCustomer.txtMembName.value = str[1]
//        window.document.frmNewCustomer.txtMembName.readOnly = true
//        return;
//      }
//    }
//    window.document.frmNewCustomer.txtName.value = str[15]
//    window.document.frmNewCustomer.txtCustType.value = str[14]

//    if (str[14].length > 0)
//      if (StrArrFld != "") {
//        // kyc details
//        for (jcnt = 0; jcnt <= StrArrFld.length - 1; jcnt++) {
//          StrArrFlds = StrArrFld[jcnt].split("*")
//          window.document.frmNewCustomer.MfgKYC.Rows =
//            window.document.frmNewCustomer.MfgKYC.Rows + 1
//          window.document.frmNewCustomer.MfgKYC.TextMatrix(jcnt + 1, 0) = jcnt + 1 // s no
//          window.document.frmNewCustomer.MfgKYC.TextMatrix(jcnt + 1, 1) = StrArrFlds[0]//kyc id 
//          window.document.frmNewCustomer.MfgKYC.TextMatrix(jcnt + 1, 2) = StrArrFlds[1]// kyc description
//          window.document.frmNewCustomer.MfgKYC.TextMatrix(jcnt + 1, 3) = StrArrFlds[2]// kyc no
//        }
//      }
//    //	kyc details	

//    window.document.frmNewCustomer.txtCustTypedesc.value = str[16]
//    window.document.frmNewCustomer.txtPan.value = str[17]
//    window.document.frmNewCustomer.txtAdharID.value = str[22]
//    window.document.frmNewCustomer.txtAddress1.value = str[1]
//    window.document.frmNewCustomer.txtAddress2.value = str[2]
//    window.document.frmNewCustomer.txtAddress3.value = str[3]
//    window.document.frmNewCustomer.txtAddress4.value = str[4]
//    window.document.frmNewCustomer.txtAddress5.value = str[5]
//    window.document.frmNewCustomer.txtMail.value = str[6]
//    window.document.frmNewCustomer.txtphone1.value = str[7]
//    window.document.frmNewCustomer.txtphone2.value = str[8]
//    window.document.frmNewCustomer.txtphone3.value = str[9]
//    window.document.frmNewCustomer.txtMobile.value = str[10]
//    window.document.frmNewCustomer.txtFax.value = str[11]
//    window.document.frmNewCustomer.txtDob.value = str[12]

//    if (str[18] != "") {
//      window.document.frmNewCustomer.slctRiskcat.value = str[18]
//    }

//    if (str[19] != "") {
//      window.document.frmNewCustomer.txtMemId.value = str[19]
//    }

//    if (str[20] != "") {
//      window.document.frmNewCustomer.txtfathername.value = str[20]
//    }

//    if (str[21] != "") {
//      window.document.frmNewCustomer.slcrelation.value = str[21]
//    }

//    if (str[23] != "") {
//      window.document.frmNewCustomer.slcreligion.value = str[23]
//    }

//    if (str[24] != "") {
//      window.document.frmNewCustomer.slckyctype.value = str[24]
//    }

//    if (str[13] == "Y") {
//      window.document.frmNewCustomer.chkMinor.checked = true
//    }
//    else {
//      window.document.frmNewCustomer.chkMinor.checked = false
//    }
//    if (str[25] == "Y")
//      window.document.frmNewCustomer.chkGlobal.checked = true
//    else
//      window.document.frmNewCustomer.chkGlobal.checked = false

//    window.document.frmNewCustomer.txtgstin.value = str[26]
//    window.document.frmNewCustomer.txtckycid.value = str[27]

//    if (str[28] == "M") {
//      window.document.frmNewCustomer.optGender(0).checked = true
//    }
//    else {
//      window.document.frmNewCustomer.optGender(1).checked = true
//    }
//  }
//}

//function Checksymbols() {
//  var indx
//  var indy

//  if (window.document.frmNewCustomer.txtMail.value != "") {
//    indx = window.document.frmNewCustomer.txtMail.value.split("@")
//    if (indx.length > 2) {
//      bankingAlert("Enter valid mailid...!")
//      window.document.frmNewCustomer.txtMail.focus()
//      return
//    }
//    indy = window.document.frmNewCustomer.txtMail.value.split(".")
//    if (indy.length > 3) {
//      bankingAlert("Enter valid mailid...!")
//      window.document.frmNewCustomer.txtMail.focus()
//      return
//    }
//    indy = window.document.frmNewCustomer.txtMail.value.lastIndexOf(".")
//    indx = window.document.frmNewCustomer.txtMail.value.length
//    if (indy == indx - 1) {
//      bankingAlert("Enter valid mailid...!")
//      window.document.frmNewCustomer.txtMail.focus()
//      return
//    }
//    indx = window.document.frmNewCustomer.txtMail.value.indexOf("@") // Take the index of "@"
//    if ((indx == -1) || (indx == 0))  // if "@" is not found
//    {
//      bankingAlert("Enter valid mailid...!")
//      window.document.frmNewCustomer.txtMail.focus()
//      return
//    }
//    indy = window.document.frmNewCustomer.txtMail.value.indexOf(".") // Take the index of "."

//    if ((indx == -1) || (indx == 0))  // if "." is not found
//    {
//      bankingAlert("Enter valid Mail Id...!")
//      window.document.frmNewCustomer.txtMail.focus()
//      return
//    }
//    if ((indy == indx + 1) || (indy < indx)) {
//      bankingAlert("Enter valid Mail Id...!")
//      window.document.frmNewCustomer.txtMail.focus()
//      return
//    }
//  }
//}
