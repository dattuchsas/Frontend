
function GenOnBlur(strdt, insstr) {

	var txtName = strdt.split("~|");

	if ((txtName[2] == "C") || (txtName[2] == "T") || (txtName[2] == "J") || (txtName[2] == "F")) {

		var pmodid = insstr; // '<%=insstr(4)%>'

		if ((pmodid == "SB") || (pmodid == "CA") || (pmodid == "CC") || (pmodid == "LOAN") || (pmodid == "DEP")) {
			var statusdes, statusdesc1;
			if (txtName[2] == "C") {
				statusdesc = "Closed";
			}
			else if (txtName[2] == "T") {
				statusdesc = "Inoperative";
			}
			else if (txtName[2] == "J") {
				statusdesc = "Rejected";
			}
			else if (txtName[2] == "F") {
				statusdesc = "Frozen";
			}
			statusdesc1 = "Acc No Is " + statusdesc;
			window.parent.window.document.frmTrans.item(txtName[0]).value = "";
			window.parent.window.document.frmTrans.item(txtName[1]).value = "";
			return;
		}
	}

	if (txtName[2] == "P") {
		alert("Master Approval Is Pending");
		window.parent.window.document.frmTrans.item(txtName[0]).value = "";
		window.parent.window.document.frmTrans.item(txtName[1]).value = "";
		return;
	}
	if (txtName[2] != "NoRecords") {
		if (txtName[0] == "txtModId")
			window.parent.window.document.frmTrans.txtModDesc.value = txtName[2];
		else
			window.parent.window.document.frmTrans.item(txtName[1]).value = txtName[2];
	}

	else {
		alert("No Records Found");
		window.parent.window.document.frmTrans.item(txtName[0]).value = "";
		window.parent.window.document.frmTrans.item(txtName[1]).value = "";
		window.parent.window.document.frmTrans.item(txtName[0]).focus();
	}
	window.attachEvent(window.parent.ReturnedBack(txtName[0]));
}

function BindDropdown(element, list) {
	element.empty();
	//dropdown.append('<option value="">Select</option>');

	$.each(list, function (i, item) {
		element.append('<option value="' + item.value + '">' + item.text + '</option>');
	});
}

function HandleAjaxError(error) {
	console.log(error);
}
