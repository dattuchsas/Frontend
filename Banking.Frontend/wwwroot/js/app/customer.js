
$(document).ready(function () {

  $("#CustomerId").on('blur', function () {
    var stcond = " and status='R'";
    var st = $(this).val();
    if (st != "") {
      st = st + "|Main" + "|" + stcond
    }
    $("#hiddenCustId").val(st);
    $("#loginForm").submit();
  });

});
