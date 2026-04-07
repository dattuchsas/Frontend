$(function () {

    $("#CustomerId").on('blur', function () {
        var radioValue = $("input[name='ModeOptions']:checked").val();
        if (radioValue == "Modify") {
            GetSBCAAccModDtls();
        }
        else if (radioValue == "New") {
            GetCustomerDetails();
        }
     });


    let JntMembers = [];
    $("#JntClear").on('click', function () {
        $("#JntCustId").val('');
        $("#JntCustName").val('');
        $("#Jnt_Relation").val('');
        $("#CheckJntMinor").val('N');
    });

    $("#JntAddToGrid").on("click", function () {
        debugger;
        let Jntid = $("#JntCustId").val();
        let Jntname = $("#JntCustName").val();
        let relationType = $("#Jnt_Relation").val();
        let relationText = $("#Jnt_Relation option:selected").text();
        let Jntminordob = $("#Jnt_MinorDOB").val();
        let Jntchkminor;
        if ($("#CheckJntMinor").is(":checked")) {
            Jntchkminor = "Y";
        }
        else { Jntchkminor = "N"; }
       
        let serialNumber = $("#JntDetails tr").length + 1;

        let member = {
            serialNo: serialNumber,
            Jntid: Jntid,
            Jntname: Jntname,
            Jntchkminor: Jntchkminor,
            Jntminordob: Jntminordob,
            relationType: relationType
        };

        JntMembers.push(member);

        $("#JntDetails").append(`
     <tr>
         <td scope = "row">${serialNumber}</td>
         <td>${Jntid}</td>
         <td>${Jntname}</td>
         <td>${Jntchkminor}</td>
         <td>${Jntminordob}</td>
          <td>${relationText}</td>
     </tr>
 `);

        $("#HiddenJntMemField").val(JntMembers);

        $("#JntCustId").val('');
        $("#JntCustName").val('');
        $("#Jnt_Relation").val('');
        $("#Jnt_MinorDOB").val('');
        $("#CheckJntMinor").prop('checked', false);

    });

    let GuardMembers = [];
    $("#GuardClear").on('click', function () {
        $("#GuardCustId").val('');
        $("#GuardCustName").val('');
        $("#Guard_Relation").val('');
        $("#CheckGuardMinor").val('N');
    });

    $("#GuardAddToGrid").on("click", function () {
        debugger;
        let Guardid = $("#GuardCustId").val();
        let Guardname = $("#GuardCustName").val();
        let relationType = $("#Guard_Relation").val();
        let relationText = $("#Guard_Relation option:selected").text();
        let Guardminordob = $("#Guard_MinorDOB").val();
        let Guardchkminor = $("#CheckGuardMinor").is(":checked");
        let serialNumber = $("#GuardDetails tr").length + 1;

        let member = {
            serialNo: serialNumber,
            Guardid: Guardid,
            Guardname: Guardname,
            Guardchkminor: Guardchkminor,
            Guardminordob: Guardminordob,
            relationType: relationType
        };

        GuardMembers.push(member);

        $("#GuardDetails").append(`
     <tr>
         <td>${serialNumber}</td>
         <td>${Guardid}</td>
         <td>${Guardname}</td>
         <td>${Guardchkminor}</td>
         <td>${Guardminordob}</td>
          <td>${relationText}</td>
     </tr>
 `);

        $("#HiddenGuardMemField").val(GuardMembers);

        $("#GuardCustId").val('');
        $("#GuardCustName").val('');
        $("#Guard_Relation").val('');
        $("#Guard_MinorDOB").val('');
        $("#CheckGuardMinor").prop('checked', false);

    });

    let NomineeMembers = [];
    $("#NomineeClear").on('click', function () {
        $("#NomineeCustId").val('');
        $("#NomineeCustName").val('');
        $("#Nominee_Relation").val('');
        $("#CheckNomineeMinor").val('N');
    });

    $("#NomineeAddToGrid").on("click", function () {
        debugger;
        let Nomineeid = $("#NomineeCustId").val();
        let Nomineename = $("#NomineeCustName").val();
        let relationType = $("#Nominee_Relation").val();
        let relationText = $("#Nominee_Relation option:selected").text();
        let Nomineeminordob = $("#Nominee_MinorDOB").val();
        let Nomineechkminor = $("#CheckNomineeMinor").is(":checked");
        let serialNumber = $("#NomineeDetails tr").length + 1;

        let member = {
            serialNo: serialNumber,
            Nomineeid: Nomineeid,
            Nomineename: Nomineename,
            Nomineechkminor: Nomineechkminor,
            Nomineeminordob: Nomineeminordob,
            relationType: relationType
        };

        NomineeMembers.push(member);

        $("#NomineeDetails").append(`
     <tr>
         <td>${serialNumber}</td>
         <td>${Nomineeid}</td>
         <td>${Nomineename}</td>
         <td>${Nomineechkminor}</td>
         <td>${Nomineeminordob}</td>
          <td>${relationText}</td>
     </tr>
 `);

        $("#HiddenNomineeMemField").val(NomineeMembers);

        $("#NomineeCustId").val('');
        $("#NomineeCustName").val('');
        $("#Nominee_Relation").val('');
        $("#Nominee_MinorDOB").val('');
        $("#CheckNomineeMinor").prop('checked', false);

    });

    $("#Panno").on('blur', function () {
        PANCheck();
    });
});

function PANCheck() {
    var panNum = $("#Panno").val().toUpperCase();

    if (panNum == "") {
        bankingAlert("Please enter PAN Number");
        return;
    }
    else {
        if ((panNum.length == "10") && (panNum.substring(0, 10)).match("[(/).]+")) {
            bankingAlert("Not a valid PAN Number");
            $("#Panno").val('');
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
                                    $("#Panno").val('');
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
                    $("#Panno").val('');
                    return;
                }
            }
            else {
                bankingAlert("Not a valid PAN Number")
                $("#Panno").val('');
                return;
            }
        }
    }
}

function GetCustomerDetails() {
 
    var st = $("#CustomerId").val();
 
    $.ajax({
        url: '/SBCAAccountOpening/GetSBCACustomerDetails?pCustomerid=' + encodeURIComponent(st),
        type: 'GET',
        success: function (response) {
            debugger;
            if (response != "") {
              
                var stVal = response.split("|");

                $("#CategoryType").val(stVal[0]);
                if (stVal[2] == "N") {
                    $('#CheckMinor').prop('checked', false);
                }
                else {
                    $('#CheckMinor').prop('checked', true);
                };
                $("#Panno").val(stVal[3]);
                $("#Status1").val('Active');
                
                return;
               
            }
        },
        error: function (err) {
            console.log(err);
        }
    });


   
}


function GetSBCAAccModDtls() {

    var st;
    var brcode = $("#Branch").val();
    var modcode = $("#Module").val();
    var glcode = $("#AccountType").val();
    var accno = $("#AccountNumber").val();
    

    st = brcode + "|" + modcode + "|" + glcode + "|" + accno;

    $.ajax({
        url: '/SBCAAccountOpening/GetSBCAModifyAccountDetails?searchString=' + encodeURIComponent(st),
        type: 'GET',
        success: function (response) {
            debugger;
            if (response != "") {

                var stVal = response.split("|");

                $("#CategoryType").val(stVal[0]);
                if (stVal[2] == "N") {
                    $('#CheckMinor').prop('checked', false);
                }
                else {
                    $('#CheckMinor').prop('checked', true);
                };
                $("#Panno").val(stVal[3]);
                $("#Status1").val('Active');

                return;

            }
        },
        error: function (err) {
            console.log(err);
        }
    });



}
