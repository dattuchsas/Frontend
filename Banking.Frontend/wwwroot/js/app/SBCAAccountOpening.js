$(function () {

    let IntroMembers = [];
    $("#IntroClear").on('click', function () {
        $("#IntroCustId").val('');
        $("#IntroCustName").val('');
        $("#Intro_Relation").val('');
        $("#CheckIntroMinor").val('N');
    });

    $("#IntroAddToGrid").on("click", function () {
        debugger;
        let introid = $("#IntroCustId").val();
        let introname = $("#IntroCustName").val();
        let relationType = $("#Intro_Relation").val();
        let relationText = $("#Intro_Relation option:selected").text();
        let introminordob = $("#Intro_MinorDOB").val();
        let introchkminor = $("#CheckIntroMinor").is(":checked");
        let serialNumber = $("#IntroDetails tr").length + 1;

        let member = {
            serialNo: serialNumber,
            introid: introid,
            introname: introname,
            introchkminor: introchkminor,
            introminordob: introminordob,
            relationType: relationType
        };

        IntroMembers.push(member);

        $("#IntroDetails").append(`
        <tr>
            <td>${serialNumber}</td>
            <td>${introid}</td>
            <td>${introname}</td>
            <td>${introchkminor}</td>
            <td>${introminordob}</td>
             <td>${relationText}</td>
        </tr>
    `);

        $("#HiddenIntroMemField").val(IntroMembers);

        $("#IntroCustId").val('');
        $("#IntroCustName").val('');
        $("#Intro_Relation").val('');
        $("#Intro_MinorDOB").val('');
        $("#CheckIntroMinor").prop('checked', false);
            
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
        let Jntchkminor = $("#CheckJntMinor").is(":checked");
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
         <td>${serialNumber}</td>
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

});