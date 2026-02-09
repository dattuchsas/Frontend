function GetNewcust() {
  record = "<%=record%>"
  result = "<%=result%>"
  if (result.length > 1)
    record = result
  record = record.split("|")
  if (record.length > 1) {
    window.document.frmCustomer.txtCustid.value = record[0]
    window.document.frmCustomer.txtCustname.value = record[1]
    if (record.length > 2) {
      window.document.frmCustomer.txtBranchCode.value = record[2]
      window.document.frmCustomer.txtCurrencyCode.value = record[3]
      window.document.frmCustomer.txtBranchDesc.value = record[4]
      window.document.frmCustomer.txtCurrrencyDesc.value = record[5]
    }
    st = record[0] + "|Main"
    window.document.all['iBatch'].src = "Customerfly1.aspx?st=" + st
    window.document.frmCustomer.hidmode.value = "Modify"
  }
}
function getMenu() {
  var menuyn = '<%=menuyn%>'
  var custid = '<%=custid%>'
  if (menuyn != "N")
    GetMenu('<%=session("menustring")%>')
  else {
    window.document.frmCustomer.hidmode.value = "View"
    window.document.frmCustomer.cmdCustomer.style.visibility = "hidden"
    window.document.frmCustomer.slctRiskcat.selectedIndex.disabled = true
    window.document.frmCustomer.txtCustname.disabled = true
    window.document.frmCustomer.cmdlstBranch.disabled = true
    window.document.frmCustomer.cmdlstCurrency.disabled = true
    window.document.frmCustomer.opttransmod(0).disabled = true
    window.document.frmCustomer.opttransmod(1).disabled = true
    window.document.frmCustomer.opttransmod(2).disabled = true
    window.document.frmCustomer.opttransmod(3).disabled = true
    window.document.frmCustomer.cmdCancel.disabled = true
    window.document.frmCustomer.cmdOk1.disabled = true
    window.document.frmCustomer.cmdOk2.disabled = true
    window.document.frmCustomer.cmdOk.disabled = true
    window.document.frmCustomer.dtpDob.enabled = false

    DisableCtls()

    DisableAll()
    window.document.frmCustomer.cmdlstBranch.disabled = true
    window.document.frmCustomer.cmdlstCurrency.disabled = true
    getcustid1(custid)
  }
}
function focus() {
  window.document.frmCustomer.dtpDob.value = "<%=session("applicationdate")%>"
  window.document.frmCustomer.dtpFamDob.value = "<%=session("applicationdate")%>"
  window.document.frmCustomer.cmdOk.disabled = false
  DisableCtls()
  window.document.frmCustomer.txtCustname.disabled = true
  window.document.frmCustomer.radclick(6).disabled = false
  window.document.frmCustomer.cmdOk.disabled = false
  DispDivision("1")
}

// Selection: New - Modify - View - Delete
function GetMode() {
  Clear()

  if (window.document.frmCustomer.opttransmod(0).checked == true) {
    window.document.frmCustomer.cmdCustomer.style.visibility = "hidden"
    clear1()
    EnableCtls()
    window.document.frmCustomer.cmdCustType.disabled = true
    window.document.frmCustomer.radclick(6).disabled = false
    var brcode = window.document.frmCustomer.txtBranchCode.value
    var brnar = window.document.frmCustomer.txtBranchDesc.value
    var crcode = window.document.frmCustomer.txtCurrencyCode.value
    var crnar = window.document.frmCustomer.txtCurrrencyDesc.value
    var queryst = brcode + "@@" + crcode + "@@" + brnar + "@@" + crnar + "@@" + "yes"
    window.open('<%="http://" & session("moduledir")& "/GEN/"%>' + "newcustomer.aspx?code=" + queryst, "Customer", "width=800,height=515 left=150 top=110")
  }
  else if (window.document.frmCustomer.opttransmod(1).checked == true) {
    window.document.frmCustomer.hidmode.value = "Modify"
    window.document.frmCustomer.cmdCustomer.style.visibility = "visible"
    EnableCtls()
    window.document.frmCustomer.txtCustname.disabled = false
    window.document.frmCustomer.txtCustid.readOnly = false
    window.document.frmCustomer.radclick(6).disabled = false
    window.document.frmCustomer.slctRiskcat.disabled = false
  }
  else if (window.document.frmCustomer.opttransmod(2).checked == true) {
    window.document.frmCustomer.hidmode.value = "Delete"
    window.document.frmCustomer.cmdCustomer.style.visibility = "visible"
    EnableCtls()
    DisableCtls()
    window.document.frmCustomer.txtCustname.disabled = true
    window.document.frmCustomer.radclick(6).disabled = false
  }
  else if (window.document.frmCustomer.opttransmod(3).checked == true) {
    window.document.frmCustomer.hidmode.value = "View"
    window.document.frmCustomer.cmdCustomer.style.visibility = "visible"
    EnableCtls()
    DisableCtls()
    window.document.frmCustomer.txtCustid.readOnly = false
    window.document.frmCustomer.txtCustname.disabled = true
    window.document.frmCustomer.radclick(6).disabled = false
    window.document.frmCustomer.cmdOk.disabled = true
    window.document.frmCustomer.slctRiskcat.disabled = true
    window.document.frmCustomer.slcsalutation.disabled = true
    window.document.frmCustomer.slcrelation.disabled = true
    window.document.frmCustomer.slcreligion.disabled = true
  }
}
function Getcustomerid() {
  var stcond
  if (window.document.frmCustomer.hidmode.value == "New") {
    return;
  }
  if (window.document.frmCustomer.hidmode.value == "Modify") {
    stcond = " and status='R'"
  }
  else {
    stcond = ""
  }

  st = window.document.frmCustomer.txtCustid.value
  Clear()
  if (st != "") {
    window.document.frmCustomer.txtCustid.value = st
    st = st + "|Main" + "|" + stcond
  }
  window.document.all['iBatch'].src = "Customerfly1.aspx?st=" + st
}
function GetCustomer() {
  var butname = "butCustold"
  st = butname + "~" + window.document.frmCustomer.txtBranchCode.value
  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "accnamecustlist.aspx" + "?" + "strbut=" + st, window, "status:no;dialogWidth:490px;dialogHeight:210px;DialogLeft:130px;DialogTop:335px")
}
function Onsearch() {
  if (window.document.frmCustomer.txtCustname.value == "") {
    bankingAlert("Name should not be Empty")
  }
  else {
    strName = window.document.frmCustomer.txtCustname.value
    window.open('<%="http://" & session("moduledir")& "/customer/"%>' + "frmSearchTerroristList.aspx?txtCustName=" + strName, "terrorist", "width=500%,height=600%,left=150,top=120")
  }
}
function validateaadharid() {
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
  }
}
function validategstin() {
  if (window.document.frmCustomer.txtgstin.value != "") {
    if (eval(window.document.frmCustomer.txtgstin.value.length) != 15) {
      bankingAlert("Enter Valid GST IN");
      window.document.frmCustomer.txtgstin.value = "";
      window.document.frmCustomer.txtgstin.focus();
    }
  }
}
function validateckycid() {
  if (window.document.frmCustomer.txtckycid.value != "") {
    if (eval(window.document.frmCustomer.txtckycid.value.length) != 14) {
      bankingAlert("Enter Valid CKYCID");
      window.document.frmCustomer.txtckycid.value = "";
      window.document.frmCustomer.txtckycid.focus();
    }
  }
}
function chkcust() {
  if (window.document.frmCustomer.txtCustid.value == "") {
    bankingAlert("Customer Id Should Not Be Null")
    return
  }
}
function AddtoGrid() {
  var rows = window.document.frmCustomer.mfgPenal.Rows
  var fname = window.document.frmCustomer.txtFamName.value
  var fdob = window.document.frmCustomer.txtFamDob.value
  var selind = window.document.frmCustomer.cmbRelation.selectedIndex
  var frel = window.document.frmCustomer.cmbRelation.options[selind].text

  if (fname == "") {
    bankingAlert("Name Should Not Be Null")
    window.document.frmCustomer.txtFamName.focus()
    return
  }
  if (frel == "--select--") {
    bankingAlert("Select Relation")
    window.document.frmCustomer.cmbRelation.focus()
    return
  }
  if ((fname.length < 1) || (eval(selind) < 0)) {
    return
  }
  window.document.frmCustomer.mfgPenal.Rows = rows + 1
  rowidx = window.document.frmCustomer.mfgPenal.rows - 1

  window.document.frmCustomer.mfgPenal.TextMatrix(rowidx, 0) = rowidx
  window.document.frmCustomer.mfgPenal.TextMatrix(rowidx, 1) = fname
  window.document.frmCustomer.mfgPenal.TextMatrix(rowidx, 2) = fdob
  window.document.frmCustomer.mfgPenal.TextMatrix(rowidx, 3) = frel
  window.document.frmCustomer.txtFamDob.value = ""
  window.document.frmCustomer.txtFamName.value = ""
  window.document.frmCustomer.cmbRelation.options[0].selected = true
}
function AddToKYCGrid() {
  var kycid = document.frmCustomer.slckyctypeall.options[document.frmCustomer.slckyctypeall.selectedIndex].value
  var kycdata = document.frmCustomer.slckyctypeall.options[document.frmCustomer.slckyctypeall.selectedIndex].text
  var kycNo = window.document.frmCustomer.txtKYCNo.value
  if (kycdata == "Select") {
    bankingAlert("Please Select KYC ID")
    return;
  }

  if (kycdata != "Select") {
    if (window.document.frmCustomer.txtKYCNo.value == "") {
      bankingAlert(kycdata + "Should not be null.")
      window.document.frmCustomer.txtKYCNo.focus()
      return

    }
  }

  jhcnt = window.document.frmCustomer.MfgKYC.Rows
  for (i = 0; i < jhcnt - 1; i++) {

    if (window.document.frmCustomer.MfgKYC.TextMatrix(i + 1, 1) == kycid) {
      bankingAlert("This KYC Was Already Added")
      return;
    }
  }

  window.document.frmCustomer.MfgKYC.Rows = jhcnt + 1
  for (i = 1; i < window.document.frmCustomer.MfgKYC.Rows; i++) {
    window.document.frmCustomer.MfgKYC.TextMatrix(i, 0) = i
  }

  window.document.frmCustomer.MfgKYC.TextMatrix(jhcnt, 1) = kycid
  window.document.frmCustomer.MfgKYC.TextMatrix(jhcnt, 2) = kycdata
  window.document.frmCustomer.MfgKYC.TextMatrix(jhcnt, 3) = kycNo.toUpperCase()

  kycclear()
}
function kycclear() {
  window.document.frmCustomer.txtKYCNo.value = ""
  window.document.frmCustomer.slckyctypeall.options(0).selected = true
}
function getMemberName() {
  if (window.document.frmCustomer.txtMemId.value == "") {
    bankingAlert("Please Enter The Member Id.")
  }
  else {
    var st
    st = window.document.frmCustomer.txtMemId.value + "|Member"
    window.document.all['iBatch'].src = "Customerfly1.aspx?st=" + st
  }
}
































function getcustid1(kstr) {
  if (kstr != "No Data Found..") {
    Clear()
    kstr = kstr.split("-----")
    window.document.frmCustomer.txtCustid.value = kstr[1]
    window.document.frmCustomer.txtCustname.value = kstr[0]
    st = kstr[1] + "|Main"
    window.document.all['iBatch'].src = "customerfly1.aspx?st=" + st
  }
}
function Clear() {
  splitString("window.document.frmCustomer", "txtCustType,txtCustTypeDesc,txtCustid,txtCustname,txtfathername,txtDob,txtEmail,txtFamName,txtFamDob,txtFax,txtMArea,txtMBldg,txtMCity,txtMemId,txtgstin,txtckycid," +
    "txtMFlat,txtMobile,txtMPin,txtOArea,txtOBldg,txtOCity,txtOFlat," +
    "txtOPin,txtPArea,txtPBldg,txtPCity,txtPFlat,txtPhone1,txtPhone2,txtPhone3," +
    "txtPPin,txtcardtype,txtcardno,txtcardcategory,txtcardscope," +
    "txtsponsorcode,txtcardcurrcode," +
    "txtissuedate,txtfromdate,txttodate,txtmaincardno,txtcarddesc," +
    "txtcategorydesc,txtscopedesc,txtsponsordesc,txtcardcurrdesc," +
    "txtmaincardname,txtpan,slctRiskcat,txtadharid")
  window.document.frmCustomer.txtcardlimit.value = "0.00"
  window.document.frmCustomer.txtcashlimit.value = "0.00"
  window.document.frmCustomer.mfgcarddtls.rows = 1
  window.document.frmCustomer.mfgPenal.Rows = 1
  window.document.frmCustomer.MfgKYC.Rows = 1
  window.document.frmCustomer.chkMinor.checked = false
  window.document.all.spMember.style.visibility = "hidden"
  window.document.frmCustomer.chkMinor.checked = false
  window.document.frmCustomer.chkMember.checked = false
  window.document.frmCustomer.cmbEducation.options[0].selected = true
  window.document.frmCustomer.cmbIncome.options[0].selected = true
  window.document.frmCustomer.cmbOccupation.options[0].selected = true
  window.document.frmCustomer.cmbRelation.options[0].selected = true
  window.document.frmCustomer.optGender(0).checked = false
  window.document.frmCustomer.optGender(1).checked = false
  window.document.frmCustomer.optMarital(0).checked = false
  window.document.frmCustomer.optMarital(1).checked = false
  window.document.frmCustomer.slctRiskcat.selectedIndex = false
  window.document.frmCustomer.txtmemName.value = ""
  window.document.frmCustomer.txtadharid.value = ""
}








function NewCustDisplay(kstr) {
  record = kstr
  if (record.length > 1) {

    record = record.split("|")

    if (record.length > 2)
      window.document.frmCustomer.hidch.value = record[2]

    window.document.frmCustomer.txtCustTypeDesc.value = record[8]
    window.document.frmCustomer.txtCustType.value = record[7]
    window.document.frmCustomer.txtCustid.value = record[0]
    window.document.frmCustomer.txtCustname.value = record[1]

    if (record[11] == "L")
      window.document.frmCustomer.slctRiskcat.selectedIndex = 3
    else if (record[11] == "H")
      window.document.frmCustomer.slctRiskcat.selectedIndex = 1
    else if (record[11] == "M")
      window.document.frmCustomer.slctRiskcat.selectedIndex = 2
    else if (record[11] == "N")
      window.document.frmCustomer.slctRiskcat.selectedIndex = 4
    else if (record[11] == "")
      window.document.frmCustomer.slctRiskcat.selectedIndex = 0

    st = record[0] + "|Main"
    window.document.all['iBatch'].src = "Customerfly1.aspx?st=" + st
  }
  window.document.frmCustomer.hidmode.value = "Modify"
}
// this function is called from list.aspx when currency code is selected
function Currencyid(kstr) {

  window.document.frmCustomer.hpr.value = ""
  kstr = kstr.split("-----")
  if ((kstr != "No Data Found..") && (strcurr == "")) {
    window.document.frmCustomer.txtCurrencyCode.value = kstr[1]
    window.document.frmCustomer.txtCurrrencyDesc.value = kstr[0]
  }
  else if ((kstr != "No Data Found..") && (strcurr == "MAIN")) {
    window.document.frmCustomer.txtcardcurrcode.value = kstr[1]
    window.document.frmCustomer.txtcardcurrdesc.value = kstr[0]
  }
  prn = kstr[2].length - 1
  window.document.frmCustomer.hpr.value = prn
  p = ""
  for (f = 1; f <= prn; f++) {
    p = p + "0"
  }
  pres = "0." + p
}
function getcustid(kstr) {
  var stcond
  stcond = ""
  if (kstr != "No Data Found..") {
    Clear()
    kstr = kstr.split("~")
    window.document.frmCustomer.txtCustid.value = kstr[1]
    window.document.frmCustomer.txtCustname.value = kstr[2]

    if (window.document.frmCustomer.hidmode.value == "Modify") {
      stcond = " and status='R'"
    }
    else {
      stcond = ""
    }

    st = kstr[1] + "|Main|" + stcond

    window.document.all['iBatch'].src = "customerfly1.aspx?st=" + st
  }
}
function Display(kstr) {
  if (kstr.substring(0, 10) == "MemberName") {
    var vstrarr = kstr.split("|")
    if (vstrarr[1] == "Norecords") {
      bankingAlert("Not A Valid MemberId")
      window.document.frmCustomer.txtMemId.value = ""
      window.document.frmCustomer.txtmemName.value = ""
    }
    else {
      window.document.frmCustomer.txtmemName.value = vstrarr[1]
    }
    return
  }
  if ((kstr == "Invalid Customer Id..") && (window.document.frmCustomer.hidmode.value != "New")) {
    bankingAlert(kstr)
    window.document.frmCustomer.txtCustid.value = ""
    return
  }

  str1 = kstr.split("!!")
  fstr = str1[0].split("~~")

  if ((window.document.frmCustomer.opttransmod(1).checked == true) || (window.document.frmCustomer.opttransmod(2).checked == true) || (window.document.frmCustomer.opttransmod(3).checked == true)) {
    var lcnt = 0
    window.document.frmCustomer.mfgcarddtls.Rows = 1
    if (str1[1] != "�norecords") {
      var strvalst = str1[1].split("�")

      for (cdtl = 0; cdtl < strvalst.length; cdtl++) {
        if (strvalst[cdtl]) {
          with (window.document.frmCustomer) {
            var code = strvalst[cdtl].split("�")

            radclick[6].checked = true
            var irow
            mfgcarddtls.Rows = mfgcarddtls.Rows + 1
            for (irow = 1; irow < code.length; irow++) {
              mfgcarddtls.TextMatrix(lcnt + 1, 0) = eval(lcnt) + 1
              mfgcarddtls.TextMatrix(lcnt + 1, eval(irow)) = code[irow]
            }

            if (mfgcarddtls.TextMatrix(lcnt + 1, 14)) {
              mfgcarddtls.TextMatrix(lcnt + 1, 20) = mfgcarddtls.TextMatrix(lcnt + 1, 2)
            }
            mfgcarddtls.TextMatrix(lcnt + 1, 9) = gridprecision(mfgcarddtls.TextMatrix(lcnt + 1, 9), hpr.value)
            mfgcarddtls.TextMatrix(lcnt + 1, 10) = gridprecision(mfgcarddtls.TextMatrix(lcnt + 1, 10), hpr.value)
            lcnt = lcnt + 1
          }// With Close
        }// If Close
      } // For Close
    }//if of first
  }

  kstrnew = str1[2].split("#$%")
  kstr = kstrnew[0].split("|")
  window.document.frmCustomer.txtCustname.value = kstr[33]
  window.document.frmCustomer.txtpan.value = kstr[34]
  window.document.frmCustomer.txtfathername.value = kstr[35]

  droplist = kstrnew[1].split("|")

  window.document.frmCustomer.txtadharid.value = droplist[0]
  window.document.frmCustomer.slcsalutation.selectedIndex = eval(droplist[1]) - eval(1)
  window.document.frmCustomer.slcrelation.selectedIndex = eval(droplist[2]) - eval(1)
  window.document.frmCustomer.slcreligion.selectedIndex = droplist[3]

  window.document.frmCustomer.txtgstin.value = droplist[5]
  window.document.frmCustomer.txtckycid.value = droplist[6]
  if (droplist[7] == "Y") {
    window.document.frmCustomer.chksmsyn.checked = true
  }
  else {
    window.document.frmCustomer.chksmsyn.checked = false
  }

  if (droplist[8] == "Y") {
    window.document.frmCustomer.chkmobaccyn.checked = true
  }
  else {
    window.document.frmCustomer.chkmobaccyn.checked = false
  }

  if (droplist[9] == "Y") {
    window.document.frmCustomer.chkpan206aayn.checked = true
  }
  else {
    window.document.frmCustomer.chkpan206aayn.checked = false
    bankingAlert("This Customer Panno is Inactive")
  }

  if (droplist[10] == "Y") {
    window.document.frmCustomer.chkpan206abyn.checked = true
  }
  else {
    window.document.frmCustomer.chkpan206abyn.checked = false
  }

  if (kstrnew[2] != "") {
    StrArrFld = kstrnew[2].split("|")

    if (StrArrFld != "") {
      // kyc details
      for (jcnt = 0; jcnt <= StrArrFld.length - 1; jcnt++) {
        StrArrFlds = StrArrFld[jcnt].split("*")
        window.document.frmCustomer.MfgKYC.Rows =
          window.document.frmCustomer.MfgKYC.Rows + 1
        window.document.frmCustomer.MfgKYC.TextMatrix(jcnt + 1, 0) = jcnt + 1 // s no
        window.document.frmCustomer.MfgKYC.TextMatrix(jcnt + 1, 1) = StrArrFlds[0]//kyc id 
        window.document.frmCustomer.MfgKYC.TextMatrix(jcnt + 1, 2) = StrArrFlds[1]// kyc description
        window.document.frmCustomer.MfgKYC.TextMatrix(jcnt + 1, 3) = StrArrFlds[2]// kyc no
      }
    }
    //	kyc details	
  }

  if (kstr[36] == "L")
    window.document.frmCustomer.slctRiskcat.selectedIndex = 3
  else if (kstr[36] == "H")
    window.document.frmCustomer.slctRiskcat.selectedIndex = 1
  else if (kstr[36] == "M")
    window.document.frmCustomer.slctRiskcat.selectedIndex = 2
  else if (kstr[36] == "N")
    window.document.frmCustomer.slctRiskcat.selectedIndex = 4
  else if (kstr[36] == "")
    window.document.frmCustomer.slctRiskcat.selectedIndex = 0

  if (fstr.length > 1) {
    window.document.frmCustomer.mfgPenal.Rows = fstr.length
    for (i = 1; i < fstr.length; i++) {
      dstr = fstr[i].split("|")
      window.document.frmCustomer.mfgPenal.TextMatrix(i, 0) = i
      window.document.frmCustomer.mfgPenal.TextMatrix(i, 1) = dstr[0]
      window.document.frmCustomer.mfgPenal.TextMatrix(i, 2) = dstr[1]
      window.document.frmCustomer.mfgPenal.TextMatrix(i, 3) = dstr[2]
    }
  }

  window.document.frmCustomer.txtCustTypeDesc.value = kstr[37]

  if (eval(kstr[1]) > 0)
    window.document.frmCustomer.txtCustType.value = kstr[1]
  if (kstr[2].length > 1) {
    window.document.all.spMember.style.visibility = "visible"
    window.document.frmCustomer.chkMember.checked = true
  }
  window.document.frmCustomer.txtMemId.value = kstr[2]
  if (kstr.length == 39)//37
  {
    window.document.frmCustomer.txtmemName.value = kstr[38]//36
  }
  else {
    window.document.frmCustomer.txtmemName.value == ""
  }
  window.document.frmCustomer.txtDob.value = kstr[3]
  window.document.frmCustomer.txtEmail.value = kstr[4]
  window.document.frmCustomer.txtFax.value = kstr[5]
  window.document.frmCustomer.txtMobile.value = kstr[6]
  if (kstr[7].length > 0) {
    if (kstr[7].toUpperCase() == "Y")
      window.document.frmCustomer.chkMinor.checked = true
    else
      window.document.frmCustomer.chkMinor.checked = false
  }
  if (kstr[8].length > 0) {
    if (kstr[8] == "Y")
      window.document.frmCustomer.optMarital(0).checked = true
    else if (kstr[8] == "N")
      window.document.frmCustomer.optMarital(1).checked = true
  }
  if (kstr[9].length > 0) {
    if (kstr[9] == "M")
      window.document.frmCustomer.optGender(0).checked = true
    else if (kstr[9] == "F")
      window.document.frmCustomer.optGender(1).checked = true
  }

  for (i = 0; i < window.document.frmCustomer.cmbOccupation.length; i++) {
    if (eval(window.document.frmCustomer.cmbOccupation.options[i].value) == eval(kstr[10])) {
      window.document.frmCustomer.cmbOccupation.options[i].selected = true

    }
  }
  for (i = 0; i < window.document.frmCustomer.cmbEducation.length; i++) {
    if (eval(window.document.frmCustomer.cmbEducation.options[i].value) == eval(kstr[11]))
      window.document.frmCustomer.cmbEducation.options[i].selected = true
  }
  for (i = 0; i < window.document.frmCustomer.cmbIncome.length; i++) {
    if (eval(window.document.frmCustomer.cmbIncome.options[i].value) == eval(kstr[12]))
      window.document.frmCustomer.cmbIncome.options[i].selected = true
  }

  window.document.frmCustomer.txtPhone1.value = kstr[13]
  window.document.frmCustomer.txtPhone2.value = kstr[14]
  window.document.frmCustomer.txtPhone3.value = kstr[15]

  window.document.frmCustomer.txtMFlat.value = kstr[16]
  window.document.frmCustomer.txtMBldg.value = kstr[17]
  window.document.frmCustomer.txtMArea.value = kstr[18]
  window.document.frmCustomer.txtMCity.value = kstr[19]
  window.document.frmCustomer.txtMPin.value = kstr[20]

  window.document.frmCustomer.txtPFlat.value = kstr[21]
  window.document.frmCustomer.txtPBldg.value = kstr[22]
  window.document.frmCustomer.txtPArea.value = kstr[23]
  window.document.frmCustomer.txtPCity.value = kstr[24]
  window.document.frmCustomer.txtPPin.value = kstr[25]

  window.document.frmCustomer.txtOFlat.value = kstr[26]
  window.document.frmCustomer.txtOBldg.value = kstr[27]
  window.document.frmCustomer.txtOArea.value = kstr[28]
  window.document.frmCustomer.txtOCity.value = kstr[29]
  window.document.frmCustomer.txtOPin.value = kstr[30]
}
function dtpDob_CloseUp() {
  Datepick(window.document.frmCustomer.dtpDob, window.document.frmCustomer.txtDob)
  strVal = window.document.frmCustomer.txtDob.value + "|" + "9999"
  window.document.all['iBatch1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "datecheck.aspx?strVal=" + strVal
}
function dtpFamDob_CloseUp() {
  Datepick(window.document.frmCustomer.dtpFamDob, window.document.frmCustomer.txtFamDob)
  st = window.document.frmCustomer.txtFamDob.value + "|" + "999"
  window.document.all['iBatch1'].src = '<%="http://" & session("moduledir")& "/GEN/"%>' + "datecheck.aspx?strVal=" + st
}
function FamilyDelete() {
  window.document.frmCustomer.txtFamDob.value = ""
  window.document.frmCustomer.txtFamName.value = ""
  window.document.frmCustomer.cmbRelation.options[0].selected = true
}
function mfgPenal_DblClick() {
  var row = window.document.frmCustomer.mfgPenal.Row
  var rows = window.document.frmCustomer.mfgPenal.Rows
  if (row < 1)
    return
  var selind = window.document.frmCustomer.cmbRelation.selectedIndex
  var frel = window.document.frmCustomer.cmbRelation.options[selind].text
  if ((window.document.frmCustomer.txtFamName.value == "") && (frel == "--select--")) {
    window.document.frmCustomer.txtFamDob.value =
      window.document.frmCustomer.mfgPenal.TextMatrix(row, 2)
    window.document.frmCustomer.txtFamName.value =
      window.document.frmCustomer.mfgPenal.TextMatrix(row, 1)
    for (icnt = 0; icnt < window.document.frmCustomer.cmbRelation.length; icnt++) {
      if (window.document.frmCustomer.cmbRelation.options[icnt].text ==
        window.document.frmCustomer.mfgPenal.TextMatrix(row, 3))
        window.document.frmCustomer.cmbRelation.options[icnt].selected = true
    }
    if ((row == 1) && (rows == 2))
      window.document.frmCustomer.mfgPenal.Rows = 1
    else
      window.document.frmCustomer.mfgPenal.RemoveItem(row)
  }
  else {
    bankingAlert("Already Data Is There In The Fields, Whether Insert It In To The Grid Or Delete It")
    return
  }

}
function MfgKYC_DblClick() {
  var row = window.document.frmCustomer.MfgKYC.Row
  var rows = window.document.frmCustomer.MfgKYC.Rows
  if (row < 1)
    return
  var selind = window.document.frmCustomer.slckyctypeall.selectedIndex
  var frel = window.document.frmCustomer.slckyctypeall.options[selind].text
  if ((window.document.frmCustomer.txtKYCNo.value == "") && (frel == "Select")) {

    window.document.frmCustomer.txtKYCNo.value = window.document.frmCustomer.MfgKYC.TextMatrix(row, 3)

    for (icnt = 0; icnt < window.document.frmCustomer.slckyctypeall.length; icnt++) {
      if (window.document.frmCustomer.slckyctypeall.options[icnt].text == window.document.frmCustomer.MfgKYC.TextMatrix(row, 2)) {
        window.document.frmCustomer.slckyctypeall.options[icnt].selected = true
      }
    }
    if ((row == 1) && (rows == 2))
      window.document.frmCustomer.MfgKYC.Rows = 1
    else
      window.document.frmCustomer.MfgKYC.RemoveItem(row)
  }
  else {
    bankingAlert("Already Data Is There In The Fields, Whether Insert It In To The Grid Or Delete It")
    return
  }
}
function dtpfromdate_CloseUp() {
  Datepick(window.document.frmCustomer.dtpfromdate, window.document.frmCustomer.txtfromdate)
  if (window.document.frmCustomer.txtissuedate) {
    Datecheck1(window.document.frmCustomer.txtfromdate, window.document.frmCustomer.txtissuedate)
    if (retrnval == "FALSE") {
      bankingAlert("From Date Cannot Be Less Than Issue Date")
      window.document.frmCustomer.txtfromdate.focus()
      window.document.frmCustomer.txtfromdate.value = ""
    }
  }
  if (window.document.frmCustomer.txttodate) {
    Datecheck(window.document.frmCustomer.txttodate, window.document.frmCustomer.txtfromdate)
    if (retrnval == "FALSE") {
      bankingAlert("From Date Cannot Be More Than To Date")
      window.document.frmCustomer.txtfromdate.focus()
      window.document.frmCustomer.txtfromdate.value = ""
    }
  }
}
function dtpissuedate_CloseUp() {
  Datepick(window.document.frmCustomer.dtpissuedate, window.document.frmCustomer.txtissuedate)
  if (window.document.frmCustomer.txtfromdate) {
    Datecheck1(window.document.frmCustomer.txtfromdate, window.document.frmCustomer.txtissuedate)
    if (retrnval == "FALSE") {
      bankingAlert("Issue Date Cannot Be More Than From Date")
      window.document.frmCustomer.txtissuedate.focus()
      window.document.frmCustomer.txtissuedate.value = ""
    }
  }
}
function dtptodate_CloseUp() {
  Datepick(window.document.frmCustomer.dtptodate, window.document.frmCustomer.txttodate)
  Datecheck(window.document.frmCustomer.txttodate, window.document.frmCustomer.txtfromdate)
  if (retrnval == "FALSE") {
    bankingAlert("To Date Cannot Be Less Than or Equal To From Date")
    window.document.frmCustomer.txttodate.focus()
    window.document.frmCustomer.txttodate.value = ""
  }
}
function mfgcarddtls_Click() {
  with (window.document.frmCustomer) {
    carddt(); ModifyGrid(mfgcarddtls, UObjArray)

  }
  var rowcount = window.document.frmCustomer.mfgcarddtls.Rows
  var ints = window.document.frmCustomer.mfgcarddtls.RowSel
  if (rowcount > 1) {
    if (window.document.frmCustomer.mfgcarddtls.Cols > 1) {
      if (window.document.frmCustomer.mfgcarddtls.TextMatrix(1, 1)) {
        if (window.document.frmCustomer.hidflex.value > 0) {
          if (rowcount > window.document.frmCustomer.hidflex.value) {
            window.document.frmCustomer.mfgcarddtls.Row = window.document.frmCustomer.hidflex.value
            for (d = 1; d < window.document.frmCustomer.mfgcarddtls.Cols; d++) {
              /*window.document.frmCustomer.mfgcarddtls.Col=d				
              window.document.frmCustomer.mfgcarddtls.CellBackColor="<%=vbWhite%>"*/
            }
          }
        }
        window.document.frmCustomer.mfgcarddtls.Row = ints
        for (d = 1; d < window.document.frmCustomer.mfgcarddtls.Cols; d++) {
          /*window.document.frmCustomer.mfgcarddtls.Col=d	
              window.document.frmCustomer.mfgcarddtls.CellBackColor="<%=vbYellow%>"*/
        }
        window.document.frmCustomer.hidflex.value = ints
        /*window.document.frmCustomer.mfgcarddtls.CellBackColor="<%=vbRED%>"*/
      }
    }
  }
}
// to check for "@" and "." symbols in email id
function DisplayMember() {
  if (window.document.frmCustomer.chkMember.checked == true)
    window.document.all.spMember.style.visibility = "visible"
  else
    window.document.all.spMember.style.visibility = "hidden"
  window.document.frmCustomer.txtMemId.value = ""

}
function Checksymbols() {
  var indx
  var indy
  window.document.frmCustomer.txtEmail
  if (window.document.frmCustomer.txtEmail.value != "") {
    indx = window.document.frmCustomer.txtEmail.value.split("@")
    if (indx.length > 2) {
      bankingAlert("Enter valid mailid...!")
      window.document.frmCustomer.txtEmail.focus()
      return
    }
    indy = window.document.frmCustomer.txtEmail.value.split(".")
    if (indy.length > 3) {
      bankingAlert("Enter valid mailid...!")
      window.document.frmCustomer.txtEmail.focus()
      return
    }
    indy = window.document.frmCustomer.txtEmail.value.lastIndexOf(".")
    indx = window.document.frmCustomer.txtEmail.value.length
    if (indy == indx - 1) {
      bankingAlert("Enter valid mailid...!")
      window.document.frmCustomer.txtEmail.focus()
      return
    }
    indx = window.document.frmCustomer.txtEmail.value.indexOf("@") // Take the index of "@"
    if ((indx == -1) || (indx == 0))  // if "@" is not found
    {
      bankingAlert("Enter valid mailid...!")
      window.document.frmCustomer.txtEmail.focus()
      return
    }
    indy = window.document.frmCustomer.txtEmail.value.indexOf(".") // Take the index of "."

    if ((indx == -1) || (indx == 0))  // if "." is not found
    {
      bankingAlert("Enter valid mailid...!")
      window.document.frmCustomer.txtEmail.focus()
      return
    }
    if ((indy == indx + 1) || (indy < indx)) {
      bankingAlert("Enter valid mailid...!")
      window.document.frmCustomer.txtEmail.focus()
      return
    }
  }
}

function CheckVals() {
  if (window.document.frmCustomer.radclick(2).checked == true) {
    val1 = window.document.frmCustomer.cmbEducation.options[window.document.frmCustomer.cmbEducation.selectedIndex].value
    val2 = window.document.frmCustomer.cmbIncome.options[window.document.frmCustomer.cmbIncome.selectedIndex].value
    val3 = window.document.frmCustomer.cmbOccupation.options[window.document.frmCustomer.cmbOccupation.selectedIndex].value

    if ((val1 < 1) && (val2 < 1) && (val3 < 1))
      return "Occupation"
    else
      return true
  }
  if (window.document.frmCustomer.radclick(5).checked == true) {
    val1 = window.document.frmCustomer.txtPArea.value.length
    val2 = window.document.frmCustomer.txtPBldg.value.length
    val3 = window.document.frmCustomer.txtPCity.value.length
    val4 = window.document.frmCustomer.txtPFlat.value.length
    val5 = window.document.frmCustomer.txtPPin.value.length
    val6 = window.document.frmCustomer.txtPhone3.value.length
    if ((val1 < 1) && (val2 < 1) && (val3 < 1) && (val4 < 1) && (val5 < 1) && (val6 < 1))
      return "Perm"
    else
      return true
  }
  if (window.document.frmCustomer.radclick(4).checked == true) {
    val1 = window.document.frmCustomer.txtOArea.value.length
    val2 = window.document.frmCustomer.txtOBldg.value.length
    val3 = window.document.frmCustomer.txtOCity.value.length
    val4 = window.document.frmCustomer.txtOFlat.value.length
    val5 = window.document.frmCustomer.txtOPin.value.length
    val6 = window.document.frmCustomer.txtPhone2.value.length
    if ((val1 < 1) && (val2 < 1) && (val3 < 1) && (val4 < 1) && (val5 < 1) && (val6 < 1))
      return "office"
    else
      return true
  }
}

function Ok() {
  if (eval(window.document.frmCustomer.txtFax.value) == "0") {
    bankingAlert("Invalid Fax No.")
    window.document.frmCustomer.radclick(0).checked = true
    DispDivision("1")
    window.document.frmCustomer.txtFax.select()
    return;
  }

  if (eval(window.document.frmCustomer.txtMPin.value) == "0") {
    bankingAlert("Invalid Pin No.")
    window.document.frmCustomer.radclick(3).checked = true
    DispDivision("4")
    window.document.frmCustomer.txtMPin.select()
    return;
  }
  if (eval(window.document.frmCustomer.txtOPin.value) == "0") {
    bankingAlert("Invalid Pin No.")
    window.document.frmCustomer.radclick(4).checked = true
    DispDivision("5")
    window.document.frmCustomer.txtOPin.select()
    return;
  }
  if (eval(window.document.frmCustomer.txtPPin.value) == "0") {
    bankingAlert("Invalid Pin No.")
    window.document.frmCustomer.radclick(5).checked = true
    DispDivision("6")
    window.document.frmCustomer.txtPPin.select()
    return;
  }

  if ((window.document.frmCustomer.txtCustType.value != "1") && (window.document.frmCustomer.chkMinor.checked == true)) {
    bankingAlert("DOB Should Not Be A Minor DOB")
    window.document.frmCustomer.txtDob.select()
    return

  }
  if ((window.document.frmCustomer.chkMember.checked == true) && (window.document.frmCustomer.txtMemId.value == "")) {
    bankingAlert("Member Id Should Not Be Null")
    window.document.frmCustomer.txtMemId.focus()
    return
  }
  if (window.document.frmCustomer.slctRiskcat.selectedIndex == "0") {
    bankingAlert("Risk Category should be selected")
    window.document.frmCustomer.slctRiskcat.select()
    return
  }
  if (window.document.frmCustomer.txtBranchCode.value == "") {
    bankingAlert("Select Branch code.")
    window.document.frmCustomer.txtBranchCode.focus()
    return;
  }

  if (window.document.frmCustomer.txtCurrencyCode.value == "") {
    bankingAlert("Select Currency code.")
    window.document.frmCustomer.txtCurrencyCode.focus()
    return;
  }

  if (window.document.frmCustomer.txtCustname.value == "") {
    bankingAlert("Select Customer Name.")
    window.document.frmCustomer.txtCustname.focus()
    return;
  }

  if (window.document.frmCustomer.txtCustType.value == "") {
    bankingAlert("Select Customer Type.")
    window.document.frmCustomer.txtCustType.focus()
    return;
  }

  if (window.document.frmCustomer.txtMFlat.value == "") {
    bankingAlert("Select Flat.")
    window.document.frmCustomer.txtMFlat.focus()
    return;
  }

  if (window.document.frmCustomer.slctRiskcat.selectedIndex == 0) {
    bankingAlert("Select Risk Category.")
    window.document.frmCustomer.slctRiskcat.focus()
    return;
  }

  if ((window.document.frmCustomer.txtBranchCode.value == "") ||
    (window.document.frmCustomer.txtCurrencyCode.value == "") ||
    (window.document.frmCustomer.txtCustname.value == "") ||
    (window.document.frmCustomer.txtCustType.value == "") ||
    (window.document.frmCustomer.txtMFlat.value == "") ||
    (window.document.frmCustomer.slctRiskcat.selectedIndex == "")) {
    bankingAlert("Manditory Fields should not be null..")
    return
  }

  var result = CheckVals()
  if (window.document.frmCustomer.hidmode.value != "Modify")
    result = ""
  if (result == "Perm") {
    bankingAlert("Please Fill Permanent Address...")
    return
  }
  else if (result == "office") {
    bankingAlert("Please Fill Office Address...")
    return
  }
  else if (result == "Occupation") {
    bankingAlert("Please Fill Occupation Details...")
    return
  }
  else if (result == "family") {
    bankingAlert("Please Fill Family Details...")
    return
  }
  brcode = "'" + window.document.frmCustomer.txtBranchCode.value + "'"
  custname = "'" + window.document.frmCustomer.txtCustname.value + "'"
  typeid = window.document.frmCustomer.txtCustType.value
  riskcategory = "'" + window.document.frmCustomer.slctRiskcat.selectedIndex + "'"
  if (isNaN(typeid) == true)
    typeid = 0
  if (window.document.frmCustomer.chkMember.checked == false)
    window.document.frmCustomer.txtMemId.value = ""
  memid = "'" + window.document.frmCustomer.txtMemId.value + "'"

  dob = "'" + window.document.frmCustomer.txtDob.value + "'"
  mail = "'" + window.document.frmCustomer.txtEmail.value + "'"
  mobile = "'" + window.document.frmCustomer.txtMobile.value + "'"
  fax = "'" + window.document.frmCustomer.txtFax.value + "'"
  if (window.document.frmCustomer.chkMinor.checked == true)
    minor = "'" + "Y" + "'"
  else
    minor = "'" + "N" + "'"
  if (window.document.frmCustomer.optMarital(0).checked == true)
    marital = "'" + "Y" + "'"
  else
    marital = "'" + "N" + "'"
  if (window.document.frmCustomer.optGender(0).checked == true)
    gender = "'" + "M" + "'"
  else
    gender = "'" + "F" + "'"
  occup = window.document.frmCustomer.cmbOccupation.options[
    window.document.frmCustomer.cmbOccupation.selectedIndex].value

  qual = window.document.frmCustomer.cmbEducation.options[
    window.document.frmCustomer.cmbEducation.selectedIndex].value
  income = window.document.frmCustomer.cmbIncome.options[
    window.document.frmCustomer.cmbIncome.selectedIndex].value


  phone1 = "'" + window.document.frmCustomer.txtPhone1.value + "'"
  phone2 = "'" + window.document.frmCustomer.txtPhone2.value + "'"
  phone3 = "'" + window.document.frmCustomer.txtPhone3.value + "'"

  mail1 = "'" + window.document.frmCustomer.txtMFlat.value + "'"
  mail2 = "'" + window.document.frmCustomer.txtMBldg.value + "'"
  mail3 = "'" + window.document.frmCustomer.txtMArea.value + "'"
  mail4 = "'" + window.document.frmCustomer.txtMCity.value + "'"
  mail5 = "'" + window.document.frmCustomer.txtMPin.value + "'"

  perm1 = "'" + window.document.frmCustomer.txtPFlat.value + "'"
  perm2 = "'" + window.document.frmCustomer.txtPBldg.value + "'"
  perm3 = "'" + window.document.frmCustomer.txtPArea.value + "'"
  perm4 = "'" + window.document.frmCustomer.txtPCity.value + "'"
  perm5 = "'" + window.document.frmCustomer.txtPPin.value + "'"

  off1 = "'" + window.document.frmCustomer.txtOFlat.value + "'"
  off2 = "'" + window.document.frmCustomer.txtOBldg.value + "'"
  off3 = "'" + window.document.frmCustomer.txtOArea.value + "'"
  off4 = "'" + window.document.frmCustomer.txtOCity.value + "'"
  off5 = "'" + window.document.frmCustomer.txtOPin.value + "'"

  if (window.document.frmCustomer.chksmsyn.checked == true)
    window.document.frmCustomer.hidsmsyn.value = "Y"
  else
    window.document.frmCustomer.hidsmsyn.value = "N"

  if (window.document.frmCustomer.chkmobaccyn.checked == true)
    window.document.frmCustomer.hidmobaccyn.value = "Y"
  else
    window.document.frmCustomer.hidmobaccyn.value = "N"

  if (window.document.frmCustomer.chkpan206aayn.checked == true)
    window.document.frmCustomer.hdnpan206aayn.value = "Y"
  else
    window.document.frmCustomer.hdnpan206aayn.value = "N"

  if (window.document.frmCustomer.chkpan206abyn.checked == true)
    window.document.frmCustomer.hdnpan206abyn.value = "Y"
  else
    window.document.frmCustomer.hdnpan206abyn.value = "N"

  if (window.document.frmCustomer.txtpan.value == "") {
    window.document.frmCustomer.hidpankycid.value = ""
  }
  else {
    window.document.frmCustomer.hidpankycid.value = "2"
  }

  if (window.document.frmCustomer.txtadharid.value == "") {
    window.document.frmCustomer.hidadharkycid.value = ""
  }
  else {
    window.document.frmCustomer.hidadharkycid.value = "12"
  }

  if (window.document.frmCustomer.txtgstin.value == "") {
    window.document.frmCustomer.hidgstinkycid.value = ""
  }
  else {
    window.document.frmCustomer.hidgstinkycid.value = "13"
  }

  if (window.document.frmCustomer.txtCustid.value == "")
    sep = ","
  else
    sep = "~"
  var dbvalues = brcode + sep + custname + sep + typeid + sep + memid + sep + dob + sep + mail + sep + fax + sep +
    mobile + sep + minor + sep + marital + sep + gender + sep + occup + sep + qual + sep +
    income + sep + phone1 + sep + phone2 + sep + phone3 + sep + mail1 + sep + mail2 + sep +
    mail3 + sep + mail4 + sep + mail5 + sep + perm1 + sep + perm2 + sep + perm3 + sep +
    perm4 + sep + perm5 + sep + off1 + sep + off2 + sep + off3 + sep + off4 + sep + off5

  var famdtls = ""
  for (i = 1; i < window.document.frmCustomer.mfgPenal.Rows; i++) {
    fname = "'" + window.document.frmCustomer.mfgPenal.TextMatrix(i, 1) + "'"
    fdob = "'" + window.document.frmCustomer.mfgPenal.TextMatrix(i, 2) + "'"
    frel = "'" + window.document.frmCustomer.mfgPenal.TextMatrix(i, 3) + "'"
    famdtls = famdtls + "#" + brcode + "," + fname + "," + fdob + "," + frel
  }

  if (window.document.frmCustomer.txtKYCNo.value != "") {
    bankingAlert("Enter KYC Details")
    return
  }

  var kycvals = ""
  var rows = window.document.frmCustomer.MfgKYC.Rows

  if (rows > 1) {
    for (icnt = 1; icnt < rows; icnt++) {
      var kycid = window.document.frmCustomer.MfgKYC.TextMatrix(icnt, 1)
      var kycno = window.document.frmCustomer.MfgKYC.TextMatrix(icnt, 3)
      var kyclnk = kycid + "," + kycno
      kycvals = kycvals + "|" + kyclnk
    }
    kycvals = kycvals.substr(1)
  }

  if (window.document.frmCustomer.hidmode.value == "Delete") {
    dbvalues = ""
    famdtls = ""
  }
  var strallvalues = ""
  if ((window.document.frmCustomer.mfgcarddtls.rows > 1) &&
    (window.document.frmCustomer.mfgcarddtls.TextMatrix(1, 1))) {
    for (var intcount = 1; intcount < window.document.frmCustomer.mfgcarddtls.Rows; intcount++) {
      with (window.document.frmCustomer) {
        strallvalues = strallvalues + "'" + (txtBranchCode.value).toUpperCase() + "'"
        for (var i = 1; i < 15; i++) {
          strallvalues = strallvalues + ",'" + (mfgcarddtls.TextMatrix(intcount, i)).toUpperCase() + "'"
        }
        strallvalues = strallvalues + ",'R'"
        strallvalues = strallvalues + ",'P'"
        strallvalues = strallvalues + ",'<%=session("Applicationdate")%>'"
        strallvalues = strallvalues + ",'<%=session("userid")%>'"
        strallvalues = strallvalues + ",'<%=session("Machineid")%>'"
        strallvalues = strallvalues + ",sysdate"
      }//WithClose
      strallvalues = strallvalues + "|"
    }//ForClose
    window.document.frmCustomer.hdata.value = strallvalues
  }//If Close

  if (window.document.frmCustomer.hidmode.value != "View") {
    window.document.frmCustomer.hidcustvals.value = dbvalues
    //bankingAlert("dbvalues="+dbvalues)
    window.document.frmCustomer.hidfamvals.value = famdtls

    window.document.frmCustomer.hidkycid.value = kycvals

    window.document.frmCustomer.txtCustid.disabled = false
    window.document.frmCustomer.action = "customerinsert.aspx"
    window.document.frmCustomer.method = "post"
    window.document.frmCustomer.submit()
  }
}

function clear1() {
  splitString("window.document.frmCustomer", "txtCustType,txtCustTypeDesc,txtCustid,txtCustname,txtfathername,txtDob,txtEmail,txtFamName,txtFamDob,txtFax,txtMArea,txtMBldg,txtMCity,txtMemId,txtgstin,txtckycid," +
    "txtMFlat,txtMobile,txtMPin,txtOArea,txtOBldg,txtOCity,txtOFlat," +
    "txtOPin,txtPArea,txtPBldg,txtPCity,txtPFlat,txtPhone1,txtPhone2,txtPhone3," +
    "txtPPin,txtcardtype,txtcardno,txtcardcategory,txtcardscope," +
    "txtsponsorcode,txtcardcurrcode," +
    "txtissuedate,txtfromdate,txttodate,txtmaincardno,txtcarddesc," +
    "txtcategorydesc,txtscopedesc,txtsponsordesc,txtcardcurrdesc," +
    "txtmaincardname,slctRiskcat")
  window.document.frmCustomer.txtcardlimit.value = "0.00"
  window.document.frmCustomer.txtcashlimit.value = "0.00"
  window.document.frmCustomer.mfgcarddtls.rows = 1
  window.document.frmCustomer.mfgPenal.Rows = 1
  window.document.frmCustomer.chkMinor.checked = false
  window.document.all.spMember.style.visibility = "hidden"
  window.document.frmCustomer.cmbIncome.options[0].selected = true
  window.document.frmCustomer.cmbOccupation.options[0].selected = true
  window.document.frmCustomer.cmbEducation.options[0].selected = true
  window.document.frmCustomer.cmbRelation.options[0].selected = true
  window.document.frmCustomer.optGender(0).checked = true
  window.document.frmCustomer.optGender(1).checked = false
  window.document.frmCustomer.optMarital(0).checked = false
  window.document.frmCustomer.optMarital(1).checked = true
}
function Cancel() {
  location.reload()
}
function GetDateDif(kstr, str1, str2) {
  if (window.document.frmCustomer.txtCustType.value == "") {
    bankingAlert("Category Code Should Not Be Null")
    window.document.frmCustomer.txtDob.value = ""
    return
  }
  if (window.document.frmCustomer.txtCustType.value == "1") {

    if ((eval(str2) / 365) < 18)
      window.document.frmCustomer.chkMinor.checked = true
    else
      window.document.frmCustomer.chkMinor.checked = false
  }
  else {
    if ((eval(str2) / 365) > 18)
      window.document.frmCustomer.chkMinor.checked = false
    else {
      window.document.frmCustomer.chkMinor.checked = true
      window.document.frmCustomer.chkMinor.disabled = true
      return
    }
  }

  if (eval(kstr) >= 0) {
    bankingAlert("DOB Should Be Less Than Application Date..")
    if (str1.length == 4)
      window.document.frmCustomer.txtDob.value = ""
    window.document.frmCustomer.chkMinor.checked = false
    if (str1.length == 3)
      window.document.frmCustomer.txtFamDob.value = ""
  }
}
/// code for Transaction Position Screen
function Exit() {
  var menuyn = '<%=menuyn%>'
  if (menuyn != "N")
    window.parent.window.location.href = '<%=exitdir%>'
  else {
    window.close()
  }
}







// for Date checking
function Datecheck(fdate, tdate) {
  var frdt = fdate.value
  var todt = tdate.value
  var fmdate = new String()
  var tmdate = new String()
  fmdate = frdt.split("-")
  tmdate = todt.split("-")
  var frmdate = fmdate[0] + "" + fmdate[1] + "" + fmdate[2]
  var trodate = tmdate[0] + "" + tmdate[1] + "" + tmdate[2]
  var fromdate = Date.parse(frmdate)
  var todate = Date.parse(trodate)
  var diff = todate - fromdate
  if (eval(diff) >= 0) {
    retrnval = "FALSE"
  }
  else {
    retrnval = "TRUE"
  }
}
function Datecheck1(fdate, tdate) {
  var frdt = fdate.value
  var todt = tdate.value
  var fmdate = new String()
  var tmdate = new String()
  fmdate = frdt.split("-")
  tmdate = todt.split("-")
  var frmdate = fmdate[0] + "" + fmdate[1] + "" + fmdate[2]
  var trodate = tmdate[0] + "" + tmdate[1] + "" + tmdate[2]
  var fromdate = Date.parse(frmdate)
  var todate = Date.parse(trodate)
  var diff = todate - fromdate
  if (eval(diff) > 0) {
    retrnval = "FALSE"
  }
  else {
    retrnval = "TRUE"
  }
}
function Datecheck2(fdate, tdate) {
  var frdt = fdate
  var todt = tdate.value
  var fmdate = new String()
  var tmdate = new String()
  fmdate = frdt.split("-")
  tmdate = todt.split("-")
  var frmdate = fmdate[0] + "" + fmdate[1] + "" + fmdate[2]
  var trodate = tmdate[0] + "" + tmdate[1] + "" + tmdate[2]
  var fromdate = Date.parse(frmdate)
  var todate = Date.parse(trodate)
  var diff = todate - fromdate
  if (eval(diff) > 0) {
    bankingAlert("This Date Should Be Less Than Or Equal To ApplicationDate")
    return false
  }

  else {
    return true
  }
}
function datetocheck() {
  datevalidate(window.document.frmCustomer.txttodate)
  Datecheck(window.document.frmCustomer.txttodate, window.document.frmCustomer.txtfromdate)
  if (retrnval == "FALSE") {
    bankingAlert("To Date Cannot Be Less Than or Equal To From Date")
    window.document.frmCustomer.txttodate.focus()
    window.document.frmCustomer.txttodate.value = ""
  }
}
function datefromcheck() {
  datevalidate(window.document.frmCustomer.txtfromdate)
  if (window.document.frmCustomer.txttodate) {
    Datecheck(window.document.frmCustomer.txttodate, window.document.frmCustomer.txtfromdate)
    if (retrnval == "FALSE") {
      bankingAlert("From Date Cannot Be More Than To Date")
      window.document.frmCustomer.txtfromdate.focus()
      window.document.frmCustomer.txtfromdate.value = ""
    }
  }
  if (window.document.frmCustomer.txtissuedate) {
    Datecheck1(window.document.frmCustomer.txtfromdate, window.document.frmCustomer.txtissuedate)
    if (retrnval == "FALSE") {
      bankingAlert("From Date Cannot Be Less Than Issue Date")
      window.document.frmCustomer.txtfromdate.focus()
      window.document.frmCustomer.txtfromdate.value = ""
    }
  }
}
function dateissuecheck() {
  datevalidate(window.document.frmCustomer.txtissuedate)
  if (window.document.frmCustomer.txtfromdate) {
    Datecheck1(window.document.frmCustomer.txtfromdate, window.document.frmCustomer.txtissuedate)
    if (retrnval == "FALSE") {
      bankingAlert("Issue Date Cannot Be More Than From Date")
      window.document.frmCustomer.txtissuedate.focus()
      window.document.frmCustomer.txtissuedate.value = ""
    }
  }
}
function checkamt() {
  with (window.document.frmCustomer) {
    if (eval(txtcardlimit.value) > 0) {
      if (eval(txtcashlimit.value) > eval(txtcardlimit.value)) {
        bankingAlert('CashLimit not more then Cardlimit')
        txtcashlimit.value = "0.00"
        txtcashlimit.focus()
      }
    }
  }
}



function popPanDtls(str) {

  if (str == "") { }
  else {

    if (str == "0") {

    }
    else {
      var stVal = str.split("|")

      var stCus = stVal[0].split("~")

      bankingAlert("This Pan card have already Customerid :" + stCus[0] + " and Name :" + stCus[1])
      window.document.frmCustomer.txtpan.value = ""
      window.document.frmCustomer.txtpan.focus()

    }
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

// Completed Code
function GetBranch() {
  clear1()
  st = "Branch"
  window.showModalDialog("List.aspx" + "?" + "st=" + st, window, "status:no;" + "DialogWidth:400px;DialogHeight:150px;DialogLeft:180px;DialogTop:190px")
}
function Branchid(kstr) {
  kstr = kstr.split("-----")
  window.document.frmCustomer.txtBranchCode.value = kstr[1]
  window.document.frmCustomer.txtBranchDesc.value = kstr[0]
}

function GetTypeCode() {
  st = "CustType|Cust"
  window.showModalDialog('<%="http://" & session("moduledir")& "/GEN/"%>' + "ListCustomer.aspx" + "?" + "st=" + st, window, "status:no;" +
    "DialogWidth:300px;DialogHeight:150px;DialogLeft:120px;DialogTop:320px")
}
function dispOccCode(kstr) {
  if (kstr != "No Data Found..") {
    kstr = kstr.split("-----")
    window.document.frmCustomer.txtCustType.value = kstr[1]
    window.document.frmCustomer.txtCustTypeDesc.value = kstr[0]
  }
}





// Validations
function panCheck() {
  if (window.document.frmCustomer.opttransmod(1).checked == true) {

    if (window.document.frmCustomer.txtCustid.value == "") {
      bankingAlert("Enter Customer ID");
      window.document.frmCustomer.txtCustid.focus();
      return
    }
  }
  var panNum
  panNum = window.document.frmCustomer.txtpan.value.toUpperCase()


  if (window.document.frmCustomer.txtpan.value == "") {
    bankingAlert("Please Enter Pan Number")

    return;
  }
  else {
    if ((panNum.length == "10") && (panNum.substring(0, 10)).match("[(/).]+")) {
      bankingAlert("Not a valid PanNumber")
      window.document.frmCustomer.txtpan.value = ""
    }
    else {
      if (panNum.length == "10") {
        if ((panNum.substring(0, 5)).match(/^[a-zA-Z]+$/) && (panNum.substring(5, 9)).match(/^[0-9]+$/) && (panNum.substring(9, 10)).match(/^[a-zA-Z]+$/)) {
          var st = "GETMODCUSTPANDTLS" + "|" + panNum.toUpperCase() + "|" + window.document.frmCustomer.txtCustid.value

          window.document.all['iGetDtls1'].src = "../GEN/getDtls1.aspx?st=" + st
        }
        else {
          bankingAlert("Not a valid PanNumber")
          window.document.frmCustomer.txtpan.value = ""
          window.document.frmCustomer.txtpan.focus()
          return;
        }
      }
      else {
        bankingAlert("Not a valid PanNumber")
        window.document.frmCustomer.txtpan.value = ""
        window.document.frmCustomer.txtpan.focus()
        return;
      }
    }
  }
}




//function DisableCtls() {
//  with (window.document.frmCustomer) {
//    SetQueryReadonly(window.document.frmCustomer, radclick(1), radclick(3), txtCustname, slctRiskcat,
//      radclick(2), radclick(4), radclick(5), radclick(0), radclick(7))
//    dtpfromdate.Enabled = false
//    dtptodate.Enabled = false
//    dtpissuedate.Enabled = false
//  }
//  window.document.frmCustomer.cmdCancel.disabled = false                                                                                                                                                                            window.document.frmCustomer.cmdCustomer.disabled = false
//  window.document.frmCustomer.cmdCustType.disabled = true
//  window.document.frmCustomer.cmdFamOk.disabled = true
//  window.document.frmCustomer.cmdDel.disabled = true
//  window.document.frmCustomer.cmdOk.disabled = false
//  window.document.frmCustomer.optGender(0).disabled = true
//  window.document.frmCustomer.optGender(1).disabled = true
//  window.document.frmCustomer.optMarital(0).disabled = true
//  window.document.frmCustomer.optMarital(1).disabled = true
//}
//function DisableAll() {

//  window.document.frmCustomer.txtCustType.disabled = true
//  window.document.frmCustomer.txtCustTypeDesc.disabled = true
//  window.document.frmCustomer.txtCustid.disabled = true
//  window.document.frmCustomer.txtCustname.disabled = true
//  window.document.frmCustomer.txtfathername.disabled = true
//  window.document.frmCustomer.txtDob.disabled = true
//  window.document.frmCustomer.txtEmail.disabled = true
//  window.document.frmCustomer.txtFamName.disabled = true
//  window.document.frmCustomer.txtFamDob.disabled = true
//  window.document.frmCustomer.txtFax.disabled = true
//  window.document.frmCustomer.txtMArea.disabled = true
//  window.document.frmCustomer.txtMBldg.disabled = true
//  window.document.frmCustomer.txtMCity.disabled = true
//  window.document.frmCustomer.txtMemId.disabled = true
//  window.document.frmCustomer.txtMFlat.disabled = true
//  window.document.frmCustomer.txtMobile.disabled = true
//  window.document.frmCustomer.txtMPin.disabled = true
//  window.document.frmCustomer.txtOArea.disabled = true
//  window.document.frmCustomer.txtOBldg.disabled = true
//  window.document.frmCustomer.txtOCity.disabled = true
//  window.document.frmCustomer.txtOFlat.disabled = true
//  window.document.frmCustomer.txtOPin.disabled = true
//  window.document.frmCustomer.txtPArea.disabled = true
//  window.document.frmCustomer.txtPBldg.disabled = true
//  window.document.frmCustomer.txtPCity.disabled = true
//  window.document.frmCustomer.txtPFlat.disabled = true
//  window.document.frmCustomer.txtPhone1.disabled = true
//  window.document.frmCustomer.txtPhone2.disabled = true
//  window.document.frmCustomer.txtPhone3.disabled = true
//  window.document.frmCustomer.txtPPin.disabled = true
//  window.document.frmCustomer.chkMinor.disabled = true
//  window.document.all.spMember.style.visibility = "visible"
//  window.document.frmCustomer.chkMember.disabled = true
//  window.document.frmCustomer.cmbEducation.disabled = true
//  window.document.frmCustomer.cmbIncome.disabled = true
//  window.document.frmCustomer.cmbOccupation.disabled = true
//  window.document.frmCustomer.cmbRelation.disabled = true
//  window.document.frmCustomer.optGender(0).disabled = true
//  window.document.frmCustomer.optGender(1).disabled = true
//  window.document.frmCustomer.optMarital(0).disabled = true
//  window.document.frmCustomer.optMarital(1).disabled = true
//}

//function EnableCtls() {
//  with (window.document.frmCustomer) {
//    SetQueryReadonly(window.document.frmCustomer, txtEmail, txtCustname, txtfathername, txtFamName, txtFax, txtMArea, txtMBldg, txtMCity, txtMemId,
//      txtMFlat, txtMobile, txtMPin, txtOArea, txtOBldg, txtOCity, txtOFlat,
//      txtOPin, txtgstin, txtckycid, txtPArea, txtPBldg, txtPCity, txtPFlat, txtPhone1, txtPhone2, txtPhone3,
//      txtPPin, txtpan, radclick(1), radclick(3), chkMember, radclick(2), radclick(4),
//      radclick(5), radclick(0), cmbEducation, cmbIncome, cmbOccupation, cmbRelation,
//      txtcardtype, txtcardno, txtcardcategory, txtcardscope,
//      txtsponsorcode, txtcardcurrcode, txtcardlimit, txtcashlimit, txtissuedate,
//      txtfromdate, txttodate, txtmaincardno, butgridcancel, butgriddelete,
//      butgridok, butcardtype, butcategory,
//      butsponsor, butscope, butcardcurr, slctRiskcat, txtadharid, radclick(7), slckyctypeall, txtKYCNo, cmdkycAdd, cmdkycClr)
//    dtpfromdate.Enabled = true
//    dtptodate.Enabled = true
//    dtpissuedate.Enabled = true
//  }
//  window.document.frmCustomer.chksmsyn.disabled = false
//  window.document.frmCustomer.chkmobaccyn.disabled = false
//  window.document.frmCustomer.chkpan206aayn.disabled = false
//  window.document.frmCustomer.chkpan206abyn.disabled = false
//  window.document.frmCustomer.cmdCancel.disabled = false
//  window.document.frmCustomer.cmdCustomer.disabled = false
//  window.document.frmCustomer.cmdCustType.disabled = false
//  window.document.frmCustomer.cmdFamOk.disabled = false
//  window.document.frmCustomer.cmdDel.disabled = false
//  window.document.frmCustomer.cmdlstBranch.disabled = false
//  window.document.frmCustomer.cmdlstCurrency.disabled = false
//  window.document.frmCustomer.cmdOk.disabled = false
//  window.document.frmCustomer.optGender(0).disabled = false
//  window.document.frmCustomer.optGender(1).disabled = false
//  window.document.frmCustomer.optMarital(0).disabled = false
//  window.document.frmCustomer.optMarital(1).disabled = false
//  window.document.frmCustomer.slctRiskcat.disabled = false
//  window.document.frmCustomer.slcsalutation.disabled = false
//  window.document.frmCustomer.slcrelation.disabled = false
//  window.document.frmCustomer.slcreligion.disabled = false
//}
