$(document).on("change", 'input[type="file"]', function () {
  $(".btn.btn-secondary.btn-sm.btn-modal-secondary").click();
});

const mapFieldValue = (frm, response, field, json_field = null) => {
  const value = response[json_field || field];
  if (value !== "NULL") {
    frm.set_value(field, value);
  }
};

frappe.ui.form.on("Contact", {
  custom_upload_image(frm) {
    if (frm.selected_doc.custom_upload_image) {
      frappe.call({
        method:
          "autoinscribe.autoinscribe.doctype.autoinscribe_integration.autoinscribe_integration.extract_text_from_img",
        args: {
          img_url:
            window.location.href.split("/app")[0] +
            frm.selected_doc.custom_upload_image,
        },
        freeze: true,
        freeze_message: "Transmuting Pixels into Insights... Hold Tight!",
        callback(res) {
          const data = res.message;

          mapFieldValue(frm, data, "first_name");
          mapFieldValue(frm, data, "middle_name");
          mapFieldValue(frm, data, "last_name");
          mapFieldValue(frm, data, "company_name");
          mapFieldValue(frm, data, "designation");

          const email_ids = data.email_ids;
          email_ids.forEach((email) => {
            email.trim() !== "NULL" &&
              frm.add_child("email_ids", {
                email_id: email.trim(),
              });
          });
          frm.refresh_field("email_ids");
          const contact_numbers = data.contact_numbers;
          contact_numbers.forEach((phone_no) => {
            phone_no.trim() !== "NULL" &&
              frm.add_child("phone_nos", {
                phone: phone_no.trim(),
              });
          });
          frm.refresh_field("phone_nos");

          let gender = data.gender;
          gender = gender.charAt(0).toUpperCase() + gender.slice(1);
          frappe.db.exists("Gender", gender).then((gender_exists) => {
            if (gender_exists) {
              frm.set_value("gender", gender);
            }
          });
          frm.refresh_field("gender");
          let salutation = data.salutation;
          salutation =
            salutation.charAt(0).toUpperCase() +
            salutation.slice(
              1,
              salutation[salutation.length - 1] === "."
                ? salutation.length - 1
                : salutation.length
            );
          frappe.db
            .exists("Salutation", salutation)
            .then((salutation_exists) => {
              if (salutation_exists) {
                frm.set_value("salutation", salutation);
              }
            });
          frm.refresh_field("salutation");

          const address = data.address;
          if (address !== "NULL") {
            frappe.call({
              method:
                "autoinscribe.autoinscribe.doctype.autoinscribe_integration.autoinscribe_integration.create_address",
              args: {
                address: address,
              },
              freeze: true,
              callback(res) {
                if (res.message) {
                  frm.set_value("address", `${address}-Office`);
                }
              },
            });
          }
        },
      });
    }
  },
  validate(frm) {
    if (frm.selected_doc.custom_upload_image && !frm.selected_doc.first_name) {
      frappe.validated = false;
    } else {
      frappe.validated = true;
    }
  },
});
