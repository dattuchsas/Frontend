
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
    var str, st;

    if ($("#idSearch").val() == "PAN") {
      if ($("#idSearchValue").val().length != "10") {
          bankingAlert("Not a valid PAN Number")
          $("#idSearchValue").val('');
          $("#idSearchValue").trigger("focus");
          return;
        }
      if (($("#idSearchValue").val().length == "10") && ($("#idSearchValue").val().substring(0, 10)).match("[(/).]+")) {
          bankingAlert("Not a valid PAN Number")
          $("#idSearchValue").val('');
          $("#idSearchValue").trigger("focus");
          return;
        }
      str = " (UPPER(PANNO) LIKE '" + $("#idSearchValue").val().toUpperCase() + "' ) "
    }

    if ($("#idSearch").val() == "AADHAR") {
      if ($("#idSearchValue").val().length != "12") {
        bankingAlert("Not a valid Aadhar")
        $("#idSearchValue").val('');
        $("#idSearchValue").trigger("focus");
        return;
      }
      if (($("#idSearchValue").val().length == "12") && ($("#idSearchValue").val().substring(0, 12)).match("[(/).]+")) {
        bankingAlert("Not a valid Aadhar")
        $("#idSearchValue").val('');
        $("#idSearchValue").trigger("focus");
        return;
      }
      str = " (UPPER(AADHARUID) LIKE '" + $("#idSearchValue").val().toUpperCase() + "' ) "
    }

    st = "SERCHCUST" + "|" + str;
    // window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
  });

  $("#MembershipNumber").on('blur', function () {
    if ($(this).val() == "") {
      bankingAlert("Please enter the Member Id.");
      $(this).val('');
      $(this).trigger("focus");
      return;
    }
    else {
        // window.document.all['iBatch'].src = "Customerfly.aspx?st=" + $(this).val() + "|Member";
    }
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
      processData: false, // REQUIRED
      contentType: false, // REQUIRED
      success: function (response) {
        bankingAlert(response);
      },
      error: function (err) {
        console.error(err);
      }
    });
  });


  //$('#newCustomerForm').on('submit', function (event) {
  //  debugger;
  //  // Prevent default form submission
  //  event.preventDefault();

  //  // Customer Type, DOB, Salutation, Gender, Marital Status, Mobile

  //  var formData = $(this);
  //  var url = formData.attr('action');

  //  documents.forEach((doc, index) => {
  //    formData.append(`files[${index}]`, doc.file);
  //  });

  //  $.ajax({
  //    type: 'POST',
  //    url: url,
  //    data: formData.serialize(), // Serializes the form data into a URL-encoded string
  //    success: function (response) {
  //      // Handle the success response
  //      bankingAlert(response);
  //      //$('#responseMessage').html('<p style="color: green;">Form submitted successfully!</p>');
  //    }
  //  });
  //});



});

function DisplayDate() {
  var d = new Date();
  var n = d.getFullYear();
  $("#Personal_DOB").val('01-Jan-' + eval(n - eval($("#Age").val())));
}

function IsMinor() {
  st = $("#Personal_DOB").val() + "|" + "txtDob"
  // window.document.all['iBatch'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "datecheck.aspx?strVal=" + st
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
  var dtval = $("#Personal_DOB").val()
  if (dtval == "") { return false; }
  var appdate = $("#ApplicationDate").val();
  if (eval(dtval.length) != 11) {
    formatDate($("#Personal_DOB").val(), appdate);
    dtval = $("#Personal_DOB").val()
    if (dtval == "") {
      $("#Age").val('');
      $("#Personal_Minor").val('checked');
      return;
    }
  }
  var yrval1 = dtval.substring(7);
  var yrval2 = appdate.substring(7);
  var yr = yrval2 - yrval1
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

function ok() {
  if (eval(window.document.frmNewCustomer.txtAddress5.value) == "0") {
    bankingAlert("Invalid Pin No.")
    window.document.frmNewCustomer.txtAddress5.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtphone1.value) == "0") {
    bankingAlert("Invalid Phone No.")
    window.document.frmNewCustomer.txtphone1.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtphone2.value) == "0") {
    bankingAlert("Invalid Phone No.")
    window.document.frmNewCustomer.txtphone2.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtphone3.value) == "0") {
    bankingAlert("Invalid Phone No.")
    window.document.frmNewCustomer.txtphone3.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtMobile.value) == "0") {
    bankingAlert("Invalid Mobile No.")
    window.document.frmNewCustomer.txtMobile.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtFax.value) == "0") {
    bankingAlert("Invalid Fax No.")
    window.document.frmNewCustomer.txtFax.select()
    return
  }

  if (window.document.frmNewCustomer.txtName.disabled == true) {
    window.close()
    return
  }

  if (window.document.frmNewCustomer.chkbMember.checked == true) {
    if (window.document.frmNewCustomer.txtMemId.value == "") {
      bankingAlert("Member Id Should not be null.")
      window.document.frmNewCustomer.txtMemId.focus()
      return
    }
  }

  if (window.document.frmNewCustomer.txtckycid.value != "") {
    if (window.document.frmNewCustomer.txtckycenrollDt.value == "") {
      bankingAlert("CKYC Enroll Date Should not be null.")
      window.document.frmNewCustomer.txtckycenrollDt.focus()
      return
    }
  }

  var code = "<%=code%>"

  code = code.split("@@")

  var brcode = "'" + code[0] + "'"
  var crcode = "'" + code[1] + "'"

  window.document.frmNewCustomer.hidbrcrcode.value = code[0] + "~~" + code[1] + "~~" + code[2] + "~~" + code[3] + "~~" + code[4]

  //var stname = window.document.frmNewCustomer.txtName.value
  //var address = window.document.frmNewCustomer.txtAddress1.value
  //var dob = window.document.frmNewCustomer.txtDob.value
  //var fathername = window.document.frmNewCustomer.txtfathername.value
  //var gender
  //if (window.document.frmNewCustomer.optGender(0).checked == true)
  //  gender = "M"
  //else
  //  gender = "F"

  //var address2 = "'" + window.document.frmNewCustomer.txtAddress2.value + "'"
  //var address3 = "'" + window.document.frmNewCustomer.txtAddress3.value + "'"
  //var address4 = "'" + window.document.frmNewCustomer.txtAddress4.value + "'"
  //var address5 = "'" + window.document.frmNewCustomer.txtAddress5.value + "'"
  //var emailid = "'" + window.document.frmNewCustomer.txtMail.value + "'"
  //var phone1 = "'" + window.document.frmNewCustomer.txtphone1.value + "'"
  //var phone2 = "'" + window.document.frmNewCustomer.txtphone2.value + "'"
  //var phone3 = "'" + window.document.frmNewCustomer.txtphone3.value + "'"
  //var mobile = "'" + window.document.frmNewCustomer.txtMobile.value + "'"
  //var fax = "'" + window.document.frmNewCustomer.txtFax.value + "'"
  //var typeid = window.document.frmNewCustomer.txtCustType.value
  //var panno = "'" + window.document.frmNewCustomer.txtPan.value + "'"
  //var riskcategory = window.document.frmNewCustomer.slctRiskcat.selectedIndex
  //var memId = window.document.frmNewCustomer.txtMemId.value
  //var gstin = "'" + window.document.frmNewCustomer.txtgstin.value + "'"
  //var ckycid = "'" + window.document.frmNewCustomer.txtckycid.value + "'"



  //if (window.document.frmNewCustomer.chkMinor.checked == false)
  //  var minoryn = "'N'"
  //else
  //  var minoryn = "'Y'"
  //if ((minoryn == "'Y'") && (dob == "")) {
  //  bankingAlert("DOB can not be null..")
  //  return
  //}

  if (window.document.frmNewCustomer.txtPan.value != "") {
    if (window.document.frmNewCustomer.chkpan206aayn.checked == false) {
      bankingAlert("pan 206AAYN Should Be Checked Compulsory")
      return
    }
  }

  if (window.document.frmNewCustomer.txtName.value == "") {
    bankingAlert("Name Cannot be null..")
    window.document.frmNewCustomer.txtName.focus()
    return
  }

  if (window.document.frmNewCustomer.txtCustType.value == "") {
    bankingAlert("Customer Type Cannot be null..")
    window.document.frmNewCustomer.cmdCustType.focus()
    return
  }

  if (window.document.frmNewCustomer.txtfathername.value == "") {
    bankingAlert("Father Name Cannot be null..")
    window.document.frmNewCustomer.txtfathername.focus()
    return
  }

  if (window.document.frmNewCustomer.txtAddress1.value == "") {
    bankingAlert("Address Cannot be null..")
    window.document.frmNewCustomer.txtAddress1.focus()
    return
  }

  // Values for KYC 
  var kot = "'"
  var kycvals = ""

  var rows = window.document.frmNewCustomer.MfgKYC.Rows

  if (rows > 1) {
    for (icnt = 1; icnt < rows; icnt++) {
      var kycid = window.document.frmNewCustomer.MfgKYC.TextMatrix(icnt, 1)
      var kycno = window.document.frmNewCustomer.MfgKYC.TextMatrix(icnt, 3)


      var kyclnk = kycid + "," + kycno
      kycvals = kycvals + "|" + kyclnk
    }
    kycvals = kycvals.substr(1)
  }
  var strOccupation = window.document.frmNewCustomer.cmboccupation.selectedIndex
  var strAnualInc = window.document.frmNewCustomer.cmbannincome.selectedIndex

  var mainstr = "'" + stname + "','" + fathername + "','" + gender + "','" + address + "'," + address2 + "," + address3 + "," + address4 + "," + address5 + "," + emailid + "," + phone1 + ", " + phone2 + "," + phone3 + "," + mobile + "," + fax + ",'" + dob + "'," + minoryn + "," + typeid + "," + brcode + "," + crcode + "," + panno + "," + gstin + "," + ckycid + "," + strOccupation + "," + strAnualInc

  window.document.frmNewCustomer.hidkycid.value = kycvals
  window.document.frmNewCustomer.hidDOB.value = dob
  window.document.frmNewCustomer.hidMinor.value = minoryn

  window.document.frmNewCustomer.hidcustvals.value = mainstr

  window.document.frmNewCustomer.action = "newcustomerinsert.aspx?main=" + main
  window.document.frmNewCustomer.method = "POST"
  window.document.frmNewCustomer.submit()
}


//function panCheck() {
//  var code = "<%=code%>"

//  code = code.split("@@")
//  var brcode = code[0]

//  var panNum
//  panNum = window.document.frmNewCustomer.txtPan.value

//  //if(document.frmNewCustomer.slckyctype.selectedIndex=="2")
//  //{
//  if (window.document.frmNewCustomer.txtPan.value == "") {
//    bankingAlert("Please Enter Pan Number")
//    //	document.frmNewCustomer.slckyctype.selectedIndex.focus()
//    return;
//  }
//  else {
//    if ((panNum.length == "10") && (panNum.substring(0, 10)).match("[(/).]+")) {
//      bankingAlert("Not a valid PanNumber")
//      window.document.frmNewCustomer.txtPan.value = ""
//    }
//    else {
//      if (panNum.length == "10") {

//        //if((panNum.substring(0,5)).match("[A-Za-z]+")&&(panNum.substring(5,9)).match("[0-9]+")&&(panNum.substring(9,10)).match("[A-Za-z]+"))
//        if ((panNum.substring(0, 5)).match(/^[a-zA-Z]+$/) && (panNum.substring(5, 9)).match(/^[0-9]+$/) && (panNum.substring(9, 10)).match(/^[a-zA-Z]+$/)) {
//          var st = "GETPANDTLS" + "|" + panNum.toUpperCase() + "|" + brcode
//          //bankingAlert(st)
//          window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st

//        }
//        else {
//          bankingAlert("Not a valid PanNumber")
//          window.document.frmNewCustomer.txtPan.value = ""
//          window.document.frmNewCustomer.txtPan.focus()
//          return;
//        }
//      }
//      else {
//        bankingAlert("Not a valid PanNumber")
//        window.document.frmNewCustomer.txtPan.value = ""
//        window.document.frmNewCustomer.txtPan.focus()
//        return;
//      }
//    }
//  }
//  //}
//}

//function validateaadharid() {
//  var code = "<%=code%>"
//  code = code.split("@@")
//  var brcode = code[0]
//  if (window.document.frmNewCustomer.txtAdharID.value != "") {
//    if (eval(window.document.frmNewCustomer.txtAdharID.value.length) != 12) {
//      bankingAlert("Enter Valid Aadhar ID");
//      window.document.frmNewCustomer.txtAdharID.value = "";
//      window.document.frmNewCustomer.txtAdharID.focus();
//    }
//    var st = "GETAADHARUIDTLS" + "|" + window.document.frmNewCustomer.txtAdharID.value + "|" + brcode
//    window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
//  }
//}





























//var main = '<%=st%>'





//function GetDateDif(str, str1, str2) {
//  //window.document.frmNewCustomer.txtbox.value=eval(str)+" -- "+eval(str1)+" -- "+eval(str2))

//  if (eval(str) >= 0) {
//    bankingAlert("DOB should Be Less Than Application Date..")
//    //if(str1=="txtDob")
//    window.document.frmNewCustomer.txtDob.value = ""
//    window.document.frmNewCustomer.chkMinor.checked = false
//    return
//  }
//  //bankingAlert("raja")	
//  if (window.document.frmNewCustomer.chkMinor.checked == true) {
//    if ((eval(str2) / 365) > 18) {
//      //bankingAlert("Invalid Minor DOB")
//      window.document.frmNewCustomer.chkMinor.checked = false
//      //window.document.frmNewCustomer.txtDob.value=""
//      return
//    }
//    /*else{
//    window.document.frmNewCustomer.chkMinor.checked=false
//    return	
//    }*/

//  }
//  else {
//    if ((eval(str2) / 365) > 18) {
//      //bankingAlert("Invalid Minor DOB")
//      window.document.frmNewCustomer.chkMinor.checked = false
//      //window.document.frmNewCustomer.txtDob.value=""
//      return
//    }
//    else {
//      window.document.frmNewCustomer.chkMinor.checked = true
//      return
//    }
//  }


//}

//checkDiv()
//function checkDiv() {
//  var prasad = "SAS Enterprises"
//  /*
//  window.document.frmNewCustomer.txtDob.value=""
//  if(window.document.frmNewCustomer.chkMinor.checked==true)
//  {
//  window.document.frmNewCustomer.all.spdob.style.display="block"
//  window.document.frmNewCustomer.all.sptxtdob.style.display="block"
//  window.document.frmNewCustomer.txtDob.disabled=false
//  window.document.frmNewCustomer.dtpCustomer.Enabled=true 
//  }
//  else
//  {
//  window.document.frmNewCustomer.all.spdob.style.display="none"
//  window.document.frmNewCustomer.all.sptxtdob.style.display="none"
//  window.document.frmNewCustomer.txtDob.disabled=true
//  window.document.frmNewCustomer.dtpCustomer.Enabled=true 
//  }
//  */
//}

//function GetType() {
//  st = "CustType|Cust"
//  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "ListCustomer.aspx" + "?" + "st=" + st, window, "status:no;dialogwidth:350px;dialogheight:170px; dialogleft:200px; dialogtop:260px")
//}

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


//function popCustser(str) {
//  if (str == "No Records") {
//    bankingAlert("No CustId Found With This " + window.document.frmNewCustomer.selSercust.value) //
//    return;
//  }
//  else {
//    var stmain1 = str.split("~")
//    bankingAlert(" Customer ID = " + stmain1[0])
//    if (stmain1[1] == "N") {
//      bankingAlert("This PanCard IS Inactive")
//    }
//    var stPan, st
//    if (window.document.frmNewCustomer.selSercust.value == "PAN") {
//      stPan = window.document.frmNewCustomer.txtSerch.value
//      st = "SERINDEFUNCTINFO" + "|" + stPan
//      window.document.all['iGetDtls'].src = "getDtls1.aspx?st=" + st
//    }
//    return;
//  }
//}

//function popSERINDEFUNCTINFO(str) {
//  if (str == "YES") {
//    bankingAlert("This PAnno Marked As Defunct")
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
//  //bankingAlert("hoe u")
//  //bankingAlert(str1)
//  var StrArrFld = new String()
//  var StrArrFlds = new String()
//  if (str1.length > 0) {
//    if (str1 == "") {
//      //bankingAlert(str)
//      window.close()
//      return
//    }
//    //bankingAlert(str)
//    str2 = str1.split(">>")
//    str = str2[0].split("|")
//    StrArrFld = str2[1].split("|")
//    //bankingAlert(str.length)
//    //bankingAlert(str.join(","))
//    //bankingAlert(str[20])
//    //	bankingAlert(str[0] + " " + str[1])
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

//    //	bankingAlert(str)
//    //	bankingAlert(str[14])
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
//    /*	if(str[18]=="N")
//      {
//      window.document.frmNewCustomer.slctRiskcat.selectedIndex=4
//      }
//      else if(str[18]=="L")
//      {
//      window.document.frmNewCustomer.slctRiskcat.selectedIndex=1
//      }
//      else if(str[18]=="M")
//      {
//      window.document.frmNewCustomer.slctRiskcat.selectedIndex=2
//      }
//      else if(str[18]=="H")
//      {
//      window.document.frmNewCustomer.slctRiskcat.selectedIndex=3
//      }
//      */

//    if (str[18] != "") {
//      window.document.frmNewCustomer.slctRiskcat.value = str[18]
//    }

//    if (str[19] != "") {
//      //window.document.frmNewCustomer.chkbMember.checked=true
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
//      //window.document.frmNewCustomer.all.spdob.style.display="block"
//      //window.document.frmNewCustomer.all.sptxtdob.style.display="block"
//    }
//    else {
//      window.document.frmNewCustomer.chkMinor.checked = false
//    }
//    //bankingAlert(str[25])
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

//function showTooltip(div, desc) {
//  div.style.display = 'block';
//  //div.style.align = 'left';
//  div.style.position = 'absolute';
//  //div.style.width = '200';
//  div.style.backgroundColor = '#FFFACD';
//  div.style.border = 'thin solid';
//  div.style.padding = '1px';
//  div.innerHTML = '<div style="padding-left:10; padding-right:5">' + desc + '</div>';
//}

//function hideTooltip(div) {
//  div.style.display = 'none';
//}

function IsMemberField() {
  debugger;
  if ($("#MemberId").val() == 'checked') {
    // window.document.all.spanMember.style.visibility = "visible"
  }
  else {
    $("#MembershipNumber").val('');
    $("#MembershipName").val('');
  }
}

//function popAADHARUIDDtls(str) {
//  if (str == "0") {

//  }
//  else {
//    var stVal = str.split("|")

//    var stCus = stVal[0].split("~")

//    bankingAlert("This AADHAR card have already Customerid :" + stCus[0] + " and Name :" + stCus[1])
//    window.document.frmNewCustomer.txtAdharID.value = "";
//    window.document.frmNewCustomer.txtAdharID.focus();
//  }
//}

//function popPanDtls(str) {
//  if (str == "0") {

//  }
//  else {
//    var stVal = str.split("|")

//    var stCus = stVal[0].split("~")

//    bankingAlert("This Pan card have already Customerid :" + stCus[0] + " and Name :" + stCus[1])
//    window.document.frmNewCustomer.txtPan.value = ""
//    window.document.frmNewCustomer.txtPan.focus()
//  }
//}

//function kycclear() {
//  window.document.frmNewCustomer.txtKYCNo.value = ""
//  window.document.frmNewCustomer.slckyctype.options(0).selected = true
//}
