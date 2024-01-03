// Copyright (c) 2023, RedSoft Solutions Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("AutoInscribe Settings", {
  refresh: function (frm) {
    hidePasswordStrengthElements(frm);
  },
});

function hidePasswordStrengthElements(frm) {
  $.each(frm.fields_dict, function (fieldname, field) {
    if (field.df && field.df.fieldtype === "Password") {
      field.$wrapper.find(".password-strength-indicator, .help-box").hide();
    }
  });
}
