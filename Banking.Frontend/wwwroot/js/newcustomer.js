
function Searchcustomer() {
  var stPan, str, st

  if (window.document.frmNewCustomer.selSercust.value == "PAN") {
    stPan = window.document.frmNewCustomer.txtSerch.value

    if (stPan.length != "10") {
      alert("Not a valid PanNumber")
      window.document.frmNewCustomer.txtSerch.value = ""
      return;
    }
    if ((stPan.length == "10") && (stPan.substring(0, 10)).match("[(/).]+")) {
      alert("Not a valid PanNumber")
      window.document.frmNewCustomer.txtSerch.value = ""
      return;
    }

    str = " (UPPER(PANNO) LIKE '" + window.document.frmNewCustomer.txtSerch.value.toUpperCase() + "' ) "
  }
  if (window.document.frmNewCustomer.selSercust.value == "AADHAR") {
    stPan = window.document.frmNewCustomer.txtSerch.value

    if (stPan.length != "12") {
      alert("Not a valid Aadhar")
      window.document.frmNewCustomer.txtSerch.value = ""
      return;
    }
    if ((stPan.length == "12") && (stPan.substring(0, 12)).match("[(/).]+")) {
      alert("Not a valid Aadhar")
      window.document.frmNewCustomer.txtSerch.value = ""
      return;
    }

    str = " (UPPER(AADHARUID) LIKE '" + window.document.frmNewCustomer.txtSerch.value.toUpperCase() + "' ) "
  }

  st = "SERCHCUST" + "|" + str
  //alert("MAhnder = "+st)
  window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st
}

function Onsearch() {
  var stname1 = window.document.frmNewCustomer.txtName.value
  //alert("hello")
  if (stname1 == "") {
    alert("Please enter the name")
    window.document.frmNewCustomer.txtName.focus()
    return
  }
  else {
    //alert('<%="http://" & session("moduledir")& "/CUSTOMER/"%>'+"frmSearchTerroristList.aspx")
    window.open('<%="http://" & session("moduledir")& "/customer/"%>' + "frmSearchTerroristList.aspx?txtCustName=" + stname1, "terrorist", "width=500%,height=600%,left=150,top=120")
    //alert("hi")
    //	window.showModalDialog('<%="http://" & session("moduledir")& "/customer/"%>'+"frmSearchTerroristList.aspx",window,"status:no;dialogwidth:300px;dialogheight:500px; dialogleft:200px; dialogtop:260px")
  }
}

function getMemberName() {
  if (window.document.frmNewCustomer.txtMemId.value == "") {
    alert("Please Enter The Member Id.")
  }
  else {
    var st
    st = window.document.frmNewCustomer.txtMemId.value + "|Member"
    window.document.all['iBatch'].src = "Customerfly.aspx?st=" + st
  }
}

// Age
function DspDate1() {
  var d = new Date();
  var n = d.getFullYear();
  window.document.frmNewCustomer.txtDob.value = "01-Jan-" + eval(n - eval(window.document.frmNewCustomer.txtAge.value))
}

function minorCheck() {
  st = window.document.frmNewCustomer.txtDob.value + "|" + "txtDob"
  var dtval = window.document.frmNewCustomer.txtDob.value
  window.document.all['iBatch'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "datecheck.aspx?strVal=" + st

}

function chkSnior() {
  if (eval(window.document.frmNewCustomer.txtAge.value) >= "60") {
    window.document.frmNewCustomer.txtCustType.value = "2"
    window.document.frmNewCustomer.txtCustTypedesc.value = "Senior Citizen"
  }
  else {
    window.document.frmNewCustomer.txtCustType.value = "1"
    window.document.frmNewCustomer.txtCustTypedesc.value = "Individual"
  }
}

// DOB
function DspDate2() {
  var dtval = window.document.frmNewCustomer.txtDob.value
  if (dtval == "") { return false; }
  var appdate = "<%=session("applicationdate")%>"
  if (eval(dtval.length) != 11) {
    formatDate(window.document.frmNewCustomer.txtDob, appdate);
    dtval = window.document.frmNewCustomer.txtDob.value
    if (dtval == "") {
      window.document.frmNewCustomer.txtAge.value = ""
      window.document.frmNewCustomer.chkMinor.checked = false
      return
    }
  }
  var yrval1 = dtval.substring(7);
  var yrval2 = appdate.substring(7);
  var yr = yrval2 - yrval1
  if (yr > 0) {
    window.document.frmNewCustomer.txtAge.value = yr;
    minorCheck()
    chkSnior()
  }
  else {
    alert("select valid DOB")
    window.document.frmNewCustomer.txtDob.value = ""
    window.document.frmNewCustomer.txtAge.value = ""
    window.document.frmNewCustomer.chkMinor.checked = false
  }
}

function validateEmail(emailField) {
  if (emailField.value != "") {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;


    if (reg.test(emailField.value) == false) {
      alert('Enter Valid Email Address');
      emailField.focus();
      emailField.value = "";
      return false;
    }

    return true;
  }
}

function validategstin() {
  if (window.document.frmNewCustomer.txtgstin.value != "") {
    if (eval(window.document.frmNewCustomer.txtgstin.value.length) != 15) {
      alert("Enter Valid GST IN");
      window.document.frmNewCustomer.txtgstin.value = "";
      window.document.frmNewCustomer.txtgstin.focus();
    }
  }
}

function validateckycid() {
  if (window.document.frmNewCustomer.txtckycid.value != "") {
    if (eval(window.document.frmNewCustomer.txtckycid.value.length) != 14) {
      alert("Enter Valid CKYCID");
      window.document.frmNewCustomer.txtckycid.value = "";
      window.document.frmNewCustomer.txtckycid.focus();
    }
  }
}

function panCheck() {
  var code = "<%=code%>"

  code = code.split("@@")
  var brcode = code[0]

  var panNum
  panNum = window.document.frmNewCustomer.txtPan.value

  //if(document.frmNewCustomer.slckyctype.selectedIndex=="2")
  //{
  if (window.document.frmNewCustomer.txtPan.value == "") {
    alert("Please Enter Pan Number")
    //	document.frmNewCustomer.slckyctype.selectedIndex.focus()
    return;
  }
  else {
    if ((panNum.length == "10") && (panNum.substring(0, 10)).match("[(/).]+")) {
      alert("Not a valid PanNumber")
      window.document.frmNewCustomer.txtPan.value = ""
    }
    else {
      if (panNum.length == "10") {

        //if((panNum.substring(0,5)).match("[A-Za-z]+")&&(panNum.substring(5,9)).match("[0-9]+")&&(panNum.substring(9,10)).match("[A-Za-z]+"))
        if ((panNum.substring(0, 5)).match(/^[a-zA-Z]+$/) && (panNum.substring(5, 9)).match(/^[0-9]+$/) && (panNum.substring(9, 10)).match(/^[a-zA-Z]+$/)) {
          var st = "GETPANDTLS" + "|" + panNum.toUpperCase() + "|" + brcode
          //alert(st)
          window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st

        }
        else {
          alert("Not a valid PanNumber")
          window.document.frmNewCustomer.txtPan.value = ""
          window.document.frmNewCustomer.txtPan.focus()
          return;
        }
      }
      else {
        alert("Not a valid PanNumber")
        window.document.frmNewCustomer.txtPan.value = ""
        window.document.frmNewCustomer.txtPan.focus()
        return;
      }
    }
  }
  //}
}

function validateaadharid() {
  var code = "<%=code%>"

  code = code.split("@@")
  var brcode = code[0]

  if (window.document.frmNewCustomer.txtAdharID.value != "") {
    if (eval(window.document.frmNewCustomer.txtAdharID.value.length) != 12) {
      alert("Enter Valid Aadhar ID");
      window.document.frmNewCustomer.txtAdharID.value = "";
      window.document.frmNewCustomer.txtAdharID.focus();
    }


    var st = "GETAADHARUIDTLS" + "|" + window.document.frmNewCustomer.txtAdharID.value + "|" + brcode

    window.document.all['iGetDtls'].src = "getDtls.aspx?st=" + st

  }
}


function AddToGrid() {
  var kycid = document.frmNewCustomer.slckyctype.options[document.frmNewCustomer.slckyctype.selectedIndex].value
  var kycdata = document.frmNewCustomer.slckyctype.options[document.frmNewCustomer.slckyctype.selectedIndex].text
  var kycNo = window.document.frmNewCustomer.txtKYCNo.value
  if (kycdata == "Select") {
    alert("Please Select KYC ID")
    return;
  }

  if (kycdata != "Select") {
    if (window.document.frmNewCustomer.txtKYCNo.value == "") {
      alert(kycdata + "Should not be null.")
      window.document.frmNewCustomer.txtKYCNo.focus()
      return

    }
  }

  jhcnt = window.document.frmNewCustomer.MfgKYC.Rows
  for (i = 0; i < jhcnt - 1; i++) {

    if (window.document.frmNewCustomer.MfgKYC.TextMatrix(i + 1, 1) == kycid) {
      alert("This KYC Was Already Added")
      return;
    }
  }


  window.document.frmNewCustomer.MfgKYC.Rows = jhcnt + 1
  window.document.frmNewCustomer.MfgKYC.TextMatrix(jhcnt, 0) = jhcnt
  window.document.frmNewCustomer.MfgKYC.TextMatrix(jhcnt, 1) = kycid
  window.document.frmNewCustomer.MfgKYC.TextMatrix(jhcnt, 2) = kycdata
  window.document.frmNewCustomer.MfgKYC.TextMatrix(jhcnt, 3) = kycNo.toUpperCase()

  kycclear()
}

function ok() {
  if (eval(window.document.frmNewCustomer.txtAddress5.value) == "0") {
    alert("Invalid Pin No.")
    window.document.frmNewCustomer.txtAddress5.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtphone1.value) == "0") {
    alert("Invalid Phone No.")
    window.document.frmNewCustomer.txtphone1.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtphone2.value) == "0") {
    alert("Invalid Phone No.")
    window.document.frmNewCustomer.txtphone2.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtphone3.value) == "0") {
    alert("Invalid Phone No.")
    window.document.frmNewCustomer.txtphone3.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtMobile.value) == "0") {
    alert("Invalid Phone No.")
    window.document.frmNewCustomer.txtMobile.select()
    return
  }
  if (eval(window.document.frmNewCustomer.txtFax.value) == "0") {
    alert("Invalid Fax No.")
    window.document.frmNewCustomer.txtFax.select()
    return
  }

  if (window.document.frmNewCustomer.txtName.disabled == true) {
    window.close()
    return
  }

  if (window.document.frmNewCustomer.chkbMember.checked == true) {
    if (window.document.frmNewCustomer.txtMemId.value == "") {
      alert("Member Id Should not be null.")
      window.document.frmNewCustomer.txtMemId.focus()
      return
    }
  }

  if (window.document.frmNewCustomer.txtckycid.value != "") {
    if (window.document.frmNewCustomer.txtckycenrollDt.value == "") {
      alert("CKYC Enroll Date Should not be null.")
      window.document.frmNewCustomer.txtckycenrollDt.focus()
      return
    }
  }


  /*var kycdata =document.frmNewCustomer.slckyctype.options[document.frmNewCustomer.slckyctype.selectedIndex].text
  
  if (kycdata !="Select")
  {
    if (window.document.frmNewCustomer.txtPan.value=="")
    {
      alert(kycdata + "Should not be null.")
      window.document.frmNewCustomer.txtPan.focus()
      return
    	
    }
  }*/
  /*
  Here DOB required field need to validate based on the database table 
    "SELECT IMPYN FROM GENCONFIGMST WHERE CODE='DOB'"
    IF IMPYN ="y " then validate other wise no need to validate the DOB
  */
  var code = "<%=code%>"

  code = code.split("@@")

  var brcode = "'" + code[0] + "'"
  var crcode = "'" + code[1] + "'"

  window.document.frmNewCustomer.hidbrcrcode.value = code[0] + "~~" + code[1] + "~~" + code[2] + "~~" + code[3] + "~~" + code[4]
  //alert("brcrcode="+window.document.frmNewCustomer.hidbrcrcode.value)
  //var stname1=window.document.frmNewCustomer.txtName.value
  var stname = window.document.frmNewCustomer.txtName.value
  var address = window.document.frmNewCustomer.txtAddress1.value
  var dob = window.document.frmNewCustomer.txtDob.value
  var fathername = window.document.frmNewCustomer.txtfathername.value
  var gender
  if (window.document.frmNewCustomer.optGender(0).checked == true)
    gender = "M"
  else
    gender = "F"



  var address2 = "'" + window.document.frmNewCustomer.txtAddress2.value + "'"
  var address3 = "'" + window.document.frmNewCustomer.txtAddress3.value + "'"
  var address4 = "'" + window.document.frmNewCustomer.txtAddress4.value + "'"
  var address5 = "'" + window.document.frmNewCustomer.txtAddress5.value + "'"
  var emailid = "'" + window.document.frmNewCustomer.txtMail.value + "'"
  var phone1 = "'" + window.document.frmNewCustomer.txtphone1.value + "'"
  var phone2 = "'" + window.document.frmNewCustomer.txtphone2.value + "'"
  var phone3 = "'" + window.document.frmNewCustomer.txtphone3.value + "'"
  var mobile = "'" + window.document.frmNewCustomer.txtMobile.value + "'"
  var fax = "'" + window.document.frmNewCustomer.txtFax.value + "'"
  var typeid = window.document.frmNewCustomer.txtCustType.value
  var panno = "'" + window.document.frmNewCustomer.txtPan.value + "'"
  var riskcategory = window.document.frmNewCustomer.slctRiskcat.selectedIndex
  var memId = window.document.frmNewCustomer.txtMemId.value
  var gstin = "'" + window.document.frmNewCustomer.txtgstin.value + "'"
  var ckycid = "'" + window.document.frmNewCustomer.txtckycid.value + "'"




  if (window.document.frmNewCustomer.txtPan.value == "") {
    window.document.frmNewCustomer.hidpankycid.value = ""
  }
  else {
    window.document.frmNewCustomer.hidpankycid.value = "2"
  }

  if (window.document.frmNewCustomer.txtAdharID.value == "") {
    window.document.frmNewCustomer.hidadharkycid.value = ""
  }
  else {
    window.document.frmNewCustomer.hidadharkycid.value = "12"
  }

  if (window.document.frmNewCustomer.txtgstin.value == "") {
    window.document.frmNewCustomer.hidgstinkycid.value = ""
  }
  else {
    window.document.frmNewCustomer.hidgstinkycid.value = "13"
  }


  if (window.document.frmNewCustomer.chkMinor.checked == false)
    var minoryn = "'N'"
  else
    var minoryn = "'Y'"
  if ((minoryn == "'Y'") && (dob == "")) {
    alert("DOB can not be null..")
    return
  }

  if (window.document.frmNewCustomer.chksmsyn.checked == true)
    window.document.frmNewCustomer.hidsmsyn.value = "Y"
  else
    window.document.frmNewCustomer.hidsmsyn.value = "N"


  if (window.document.frmNewCustomer.chkmobaccyn.checked == true)
    window.document.frmNewCustomer.hidmobaccyn.value = "Y"
  else
    window.document.frmNewCustomer.hidmobaccyn.value = "N"

  if (window.document.frmNewCustomer.chkpan206aayn.checked == true) {
    window.document.frmNewCustomer.hidpan206aayn.value = "Y" //Active
  }
  else {
    window.document.frmNewCustomer.hidpan206aayn.value = "N"  // inactive

  }

  if (window.document.frmNewCustomer.txtPan.value != "") {
    if (window.document.frmNewCustomer.chkpan206aayn.checked == false) {
      alert("pan 206AAYN Should Be Checked Compulsory")
      return
    }
  }

  if (window.document.frmNewCustomer.chkpan206abyn.checked == true)
    window.document.frmNewCustomer.hidpan206abyn.value = "Y"  //applicable
  else
    window.document.frmNewCustomer.hidpan206abyn.value = "N"  // Not Applicable



  if (window.document.frmNewCustomer.chkGlobal.checked == true)
    window.document.frmNewCustomer.hidGlobal.value = "Y"
  else
    window.document.frmNewCustomer.hidGlobal.value = "N"

  if (window.document.frmNewCustomer.txtName.value == "") {
    alert("Name Cannot be null..")
    window.document.frmNewCustomer.txtName.focus()
    return
  }

  if (window.document.frmNewCustomer.txtCustType.value == "") {
    alert("Customer Type Cannot be null..")
    window.document.frmNewCustomer.cmdCustType.focus()
    return
  }

  if (window.document.frmNewCustomer.txtfathername.value == "") {
    alert("Father Name Cannot be null..")
    window.document.frmNewCustomer.txtfathername.focus()
    return
  }

  if (window.document.frmNewCustomer.txtAddress1.value == "") {
    alert("Address Cannot be null..")
    window.document.frmNewCustomer.txtAddress1.focus()
    return
  }

  /*if(window.document.frmNewCustomer.slctRiskcat.selectedIndex =="0")
  {
      alert("Risk Category should be selected")
      window.document.frmNewCustomer.slctRiskcat.focus()
      return
  }
  */



  /*if((stname.length==0) || (address.length==0) || (typeid.length=0))
  {
    alert("Mandatory fields should not be null...")
  	
  	
  	
    return
  }*/

  //'''''''''''''' Values for KYC 
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

  var mainstr = "'" + stname + "','" + fathername + "','" + gender + "','" + address + "'," + address2 + "," + address3 + "," + address4 + "," + address5 + "," + emailid + "," + phone1 + ", " +
    phone2 + "," + phone3 + "," + mobile + "," + fax + ",'" + dob + "'," + minoryn +
    "," + typeid + "," + brcode + "," + crcode + "," + panno + "," + gstin + "," + ckycid + "," + strOccupation + "," + strAnualInc

  //alert(mainstr)
  //alert(main)
  //alert(window.document.frmNewCustomer.hidbrcrcode.value)
  //alert(mainstr)
  window.document.frmNewCustomer.hidkycid.value = kycvals
  window.document.frmNewCustomer.hidDOB.value = dob
  window.document.frmNewCustomer.hidMinor.value = minoryn

  window.document.frmNewCustomer.hidcustvals.value = mainstr
  window.document.frmNewCustomer.action = "newcustomerinsert.aspx?main=" + main
  window.document.frmNewCustomer.method = "POST"
  window.document.frmNewCustomer.submit()
}


























var main = '<%=st%>'





function GetDateDif(str, str1, str2) {
  //window.document.frmNewCustomer.txtbox.value=eval(str)+" -- "+eval(str1)+" -- "+eval(str2))

  if (eval(str) >= 0) {
    alert("DOB should Be Less Than Application Date..")
    //if(str1=="txtDob")
    window.document.frmNewCustomer.txtDob.value = ""
    window.document.frmNewCustomer.chkMinor.checked = false
    return
  }
  //alert("raja")	
  if (window.document.frmNewCustomer.chkMinor.checked == true) {
    if ((eval(str2) / 365) > 18) {
      //alert("Invalid Minor DOB")
      window.document.frmNewCustomer.chkMinor.checked = false
      //window.document.frmNewCustomer.txtDob.value=""
      return
    }
    /*else{
    window.document.frmNewCustomer.chkMinor.checked=false
    return	
    }*/

  }
  else {
    if ((eval(str2) / 365) > 18) {
      //alert("Invalid Minor DOB")
      window.document.frmNewCustomer.chkMinor.checked = false
      //window.document.frmNewCustomer.txtDob.value=""
      return
    }
    else {
      window.document.frmNewCustomer.chkMinor.checked = true
      return
    }
  }


}

checkDiv()
function checkDiv() {
  var prasad = "SAS Enterprises"
  /*
  window.document.frmNewCustomer.txtDob.value=""
  if(window.document.frmNewCustomer.chkMinor.checked==true)
  {
  window.document.frmNewCustomer.all.spdob.style.display="block"
  window.document.frmNewCustomer.all.sptxtdob.style.display="block"
  window.document.frmNewCustomer.txtDob.disabled=false
  window.document.frmNewCustomer.dtpCustomer.Enabled=true 
  }
  else
  {
  window.document.frmNewCustomer.all.spdob.style.display="none"
  window.document.frmNewCustomer.all.sptxtdob.style.display="none"
  window.document.frmNewCustomer.txtDob.disabled=true
  window.document.frmNewCustomer.dtpCustomer.Enabled=true 
  }
  */
}

function GetType() {
  st = "CustType|Cust"
  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "ListCustomer.aspx" + "?" + "st=" + st, window, "status:no;dialogwidth:350px;dialogheight:170px; dialogleft:200px; dialogtop:260px")
}

function dispOccCode(str) {
  if (str != "No Data Found..") {
    str = str.split("-----")
    window.document.frmNewCustomer.txtCustType.value = str[1]
    window.document.frmNewCustomer.txtCustTypedesc.value = str[0]
    if (window.document.frmNewCustomer.txtCustType.value == "1") {
      window.document.frmNewCustomer.chkMinor.disabled = false
    }
    else {
      window.document.frmNewCustomer.chkMinor.checked = false
      window.document.frmNewCustomer.chkMinor.disabled = true
    }
  }
}


function popCustser(str) {
  if (str == "No Records") {
    alert("No CustId Found With This " + window.document.frmNewCustomer.selSercust.value) //
    return;
  }
  else {
    var stmain1 = str.split("~")
    alert(" Customer ID = " + stmain1[0])
    if (stmain1[1] == "N") {
      alert("This PanCard IS Inactive")
    }
    var stPan, st
    if (window.document.frmNewCustomer.selSercust.value == "PAN") {
      stPan = window.document.frmNewCustomer.txtSerch.value
      st = "SERINDEFUNCTINFO" + "|" + stPan
      window.document.all['iGetDtls'].src = "getDtls1.aspx?st=" + st
    }
    return;
  }
}

function popSERINDEFUNCTINFO(str) {
  if (str == "YES") {
    alert("This PAnno Marked As Defunct")
  }

}

function CheckResult() {
  window.document.frmNewCustomer.txtckycenrollDt.value = "<%=session("applicationdate")%>"
  window.document.frmNewCustomer.MfgKYC.Rows = 1
  var appdat = "<%=session("applicationdate")%>"

  var yr = appdat.substring(7) - 1

  window.document.frmNewCustomer.txtName.focus()

  var strresult = ""
  var strcon = "nothing"
  var record = ""
  record = "<%=record%>"

  strresult = "<%=strresult%>"
  custid = "<%=custid%>"

  if (custid.length > 0) {
    st = custid
    window.document.frmNewCustomer.txtName.disabled = true
    window.document.frmNewCustomer.slcrelation.disabled = true
    window.document.frmNewCustomer.txtfathername.disabled = true
    window.document.frmNewCustomer.cmdCustType.disabled = true
    window.document.frmNewCustomer.txtAddress1.disabled = true
    window.document.frmNewCustomer.txtAddress2.disabled = true
    window.document.frmNewCustomer.txtAddress3.disabled = true
    window.document.frmNewCustomer.txtAddress4.disabled = true
    window.document.frmNewCustomer.txtAddress5.disabled = true
    window.document.frmNewCustomer.txtMail.disabled = true
    window.document.frmNewCustomer.txtphone1.disabled = true
    window.document.frmNewCustomer.txtphone2.disabled = true
    window.document.frmNewCustomer.txtphone3.disabled = true
    window.document.frmNewCustomer.txtMobile.disabled = true
    window.document.frmNewCustomer.txtFax.disabled = true
    window.document.frmNewCustomer.txtPan.disabled = true
    window.document.frmNewCustomer.txtAdharID.disabled = true
    window.document.frmNewCustomer.chkMinor.disabled = true
    window.document.frmNewCustomer.chkGlobal.disabled = true
    window.document.frmNewCustomer.chkGlobal.checked = false
    window.document.frmNewCustomer.txtCustType.disabled = true
    window.document.frmNewCustomer.txtCustTypedesc.disabled = true
    window.document.frmNewCustomer.slctRiskcat.disabled = true
    window.document.frmNewCustomer.txtgstin.disabled = true
    window.document.frmNewCustomer.txtckycid.disabled = true
    window.document.frmNewCustomer.slckyctype.disabled = true
    window.document.frmNewCustomer.txtKYCNo.disabled = true

    st = "DTLS~" + st

    window.document.all['iBatch'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "customerfly.aspx?st=" + st

    return
  }
  if (record.length > 0) {
    if (record.substring(0, 14) == "GENCUSTINFOMST") {
      return;
    }

    var str, str1
    var stmain = record.split("|")
    window.attachEvent(window.opener.NewCustDisplay(record.toUpperCase()))

    if (stmain[6] != "yes") {
      strcon = window.confirm("Do you want to enter more Customer details....")
      if (strcon == true) {
        window.open('<%="http://" & session("moduledir")& "/GEN/"%>' + "customer.aspx" + "?" + "record=" + record, "CustomerDetails", "width=800,height=600,left=0,top=0")
      }
    }
    window.close()
  }
}

function Display(str1) {
  //alert("hoe u")
  //alert(str1)
  var StrArrFld = new String()
  var StrArrFlds = new String()
  if (str1.length > 0) {
    if (str1 == "") {
      //alert(str)
      window.close()
      return
    }
    //alert(str)
    str2 = str1.split(">>")
    str = str2[0].split("|")
    StrArrFld = str2[1].split("|")
    //alert(str.length)
    //alert(str.join(","))
    //alert(str[20])
    //	alert(str[0] + " " + str[1])
    if (str[0] == "MemberName") {
      if (str[1] == "NoMember") {
        alert("Invalid Member Id.")
        window.document.frmNewCustomer.txtMemId.value = ""
        return;
      }
      else {
        window.document.frmNewCustomer.txtMembName.value = str[1]
        window.document.frmNewCustomer.txtMembName.readOnly = true
        return;
      }
    }
    window.document.frmNewCustomer.txtName.value = str[15]
    window.document.frmNewCustomer.txtCustType.value = str[14]

    //	alert(str)
    //	alert(str[14])
    if (str[14].length > 0)

      if (StrArrFld != "") {
        // kyc details
        for (jcnt = 0; jcnt <= StrArrFld.length - 1; jcnt++) {
          StrArrFlds = StrArrFld[jcnt].split("*")
          window.document.frmNewCustomer.MfgKYC.Rows =
            window.document.frmNewCustomer.MfgKYC.Rows + 1
          window.document.frmNewCustomer.MfgKYC.TextMatrix(jcnt + 1, 0) = jcnt + 1 // s no
          window.document.frmNewCustomer.MfgKYC.TextMatrix(jcnt + 1, 1) = StrArrFlds[0]//kyc id 
          window.document.frmNewCustomer.MfgKYC.TextMatrix(jcnt + 1, 2) = StrArrFlds[1]// kyc description
          window.document.frmNewCustomer.MfgKYC.TextMatrix(jcnt + 1, 3) = StrArrFlds[2]// kyc no
        }
      }
    //	kyc details	

    window.document.frmNewCustomer.txtCustTypedesc.value = str[16]
    window.document.frmNewCustomer.txtPan.value = str[17]
    window.document.frmNewCustomer.txtAdharID.value = str[22]
    window.document.frmNewCustomer.txtAddress1.value = str[1]
    window.document.frmNewCustomer.txtAddress2.value = str[2]
    window.document.frmNewCustomer.txtAddress3.value = str[3]
    window.document.frmNewCustomer.txtAddress4.value = str[4]
    window.document.frmNewCustomer.txtAddress5.value = str[5]
    window.document.frmNewCustomer.txtMail.value = str[6]
    window.document.frmNewCustomer.txtphone1.value = str[7]
    window.document.frmNewCustomer.txtphone2.value = str[8]
    window.document.frmNewCustomer.txtphone3.value = str[9]
    window.document.frmNewCustomer.txtMobile.value = str[10]
    window.document.frmNewCustomer.txtFax.value = str[11]
    window.document.frmNewCustomer.txtDob.value = str[12]
    /*	if(str[18]=="N")
      {
      window.document.frmNewCustomer.slctRiskcat.selectedIndex=4
      }
      else if(str[18]=="L")
      {
      window.document.frmNewCustomer.slctRiskcat.selectedIndex=1
      }
      else if(str[18]=="M")
      {
      window.document.frmNewCustomer.slctRiskcat.selectedIndex=2
      }
      else if(str[18]=="H")
      {
      window.document.frmNewCustomer.slctRiskcat.selectedIndex=3
      }
      */

    if (str[18] != "") {
      window.document.frmNewCustomer.slctRiskcat.value = str[18]
    }

    if (str[19] != "") {
      //window.document.frmNewCustomer.chkbMember.checked=true
      window.document.frmNewCustomer.txtMemId.value = str[19]
    }

    if (str[20] != "") {
      window.document.frmNewCustomer.txtfathername.value = str[20]
    }

    if (str[21] != "") {
      window.document.frmNewCustomer.slcrelation.value = str[21]
    }

    if (str[23] != "") {
      window.document.frmNewCustomer.slcreligion.value = str[23]
    }

    if (str[24] != "") {
      window.document.frmNewCustomer.slckyctype.value = str[24]
    }

    if (str[13] == "Y") {
      window.document.frmNewCustomer.chkMinor.checked = true
      //window.document.frmNewCustomer.all.spdob.style.display="block"
      //window.document.frmNewCustomer.all.sptxtdob.style.display="block"
    }
    else {
      window.document.frmNewCustomer.chkMinor.checked = false
    }
    //alert(str[25])
    if (str[25] == "Y")
      window.document.frmNewCustomer.chkGlobal.checked = true
    else
      window.document.frmNewCustomer.chkGlobal.checked = false

    window.document.frmNewCustomer.txtgstin.value = str[26]
    window.document.frmNewCustomer.txtckycid.value = str[27]

    if (str[28] == "M") {
      window.document.frmNewCustomer.optGender(0).checked = true
    }
    else {
      window.document.frmNewCustomer.optGender(1).checked = true
    }
  }
}

function Checksymbols() {
  var indx
  var indy

  if (window.document.frmNewCustomer.txtMail.value != "") {
    indx = window.document.frmNewCustomer.txtMail.value.split("@")
    if (indx.length > 2) {
      alert("Enter valid mailid...!")
      window.document.frmNewCustomer.txtMail.focus()
      return
    }
    indy = window.document.frmNewCustomer.txtMail.value.split(".")
    if (indy.length > 3) {
      alert("Enter valid mailid...!")
      window.document.frmNewCustomer.txtMail.focus()
      return
    }
    indy = window.document.frmNewCustomer.txtMail.value.lastIndexOf(".")
    indx = window.document.frmNewCustomer.txtMail.value.length
    if (indy == indx - 1) {
      alert("Enter valid mailid...!")
      window.document.frmNewCustomer.txtMail.focus()
      return
    }
    indx = window.document.frmNewCustomer.txtMail.value.indexOf("@") // Take the index of "@"
    if ((indx == -1) || (indx == 0))  // if "@" is not found
    {
      alert("Enter valid mailid...!")
      window.document.frmNewCustomer.txtMail.focus()
      return
    }
    indy = window.document.frmNewCustomer.txtMail.value.indexOf(".") // Take the index of "."

    if ((indx == -1) || (indx == 0))  // if "." is not found
    {
      alert("Enter valid Mail Id...!")
      window.document.frmNewCustomer.txtMail.focus()
      return
    }
    if ((indy == indx + 1) || (indy < indx)) {
      alert("Enter valid Mail Id...!")
      window.document.frmNewCustomer.txtMail.focus()
      return
    }
  }
}

function showTooltip(div, desc) {
  div.style.display = 'block';
  //div.style.align = 'left';
  div.style.position = 'absolute';
  //div.style.width = '200';
  div.style.backgroundColor = '#FFFACD';
  div.style.border = 'thin solid';
  div.style.padding = '1px';
  div.innerHTML = '<div style="padding-left:10; padding-right:5">' + desc + '</div>';
}

function hideTooltip(div) {
  div.style.display = 'none';
}

function DisplayMemberFld() {
  if (window.document.frmNewCustomer.chkbMember.checked == true) {
    window.document.all.spanMember.style.visibility = "visible"
  }
  else {
    window.document.all.spanMember.style.visibility = "hidden"
    window.document.frmNewCustomer.txtMemId.value = ""
    window.document.frmNewCustomer.txtMembName.value = ""
  }
}

function popAADHARUIDDtls(str) {
  if (str == "0") {

  }
  else {
    var stVal = str.split("|")

    var stCus = stVal[0].split("~")

    alert("This AADHAR card have already Customerid :" + stCus[0] + " and Name :" + stCus[1])
    window.document.frmNewCustomer.txtAdharID.value = "";
    window.document.frmNewCustomer.txtAdharID.focus();
  }
}

function popPanDtls(str) {
  if (str == "0") {

  }
  else {
    var stVal = str.split("|")

    var stCus = stVal[0].split("~")

    alert("This Pan card have already Customerid :" + stCus[0] + " and Name :" + stCus[1])
    window.document.frmNewCustomer.txtPan.value = ""
    window.document.frmNewCustomer.txtPan.focus()
  }
}

function kycclear() {
  window.document.frmNewCustomer.txtKYCNo.value = ""
  window.document.frmNewCustomer.slckyctype.options(0).selected = true
}
