let once_refreshed = false
let error_message = ''

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
        callback(res) {
          const resArr = res.message.split("\n");

          const first_name = resArr[0].split(":")[1].trim();
          const middle_name = resArr[1].split(":")[1].trim();
          const last_name = resArr[2].split(":")[1].trim();
          first_name !== "NULL" && frm.set_value("first_name", first_name);
          middle_name !== "NULL" && frm.set_value("middle_name", middle_name);
          last_name !== "NULL" && frm.set_value("last_name", last_name);
          const company_name = resArr[8].split(":")[1].trim();
          company_name !== "NULL" &&
            frm.set_value("company_name", company_name);
          const designation = resArr[5].split(":")[1].trim();
          designation !== "NULL" && frm.set_value("designation", designation);
          const email_ids = resArr[7].split(":")[1].trim().split(",");
          email_ids.forEach((email) => {
            email.trim() !== "NULL" &&
              frm.add_child("email_ids", {
                email_id: email.trim(),
              });
          });
          frm.refresh_field("email_ids");
          const contact_numbers = resArr[6].split(":")[1].trim().split(",");
          contact_numbers.forEach((phone_no) => {
            phone_no.trim() !== "NULL" &&
              frm.add_child("phone_nos", {
                phone: phone_no.trim(),
              });
          });
          frm.refresh_field("phone_nos");

          let gender = resArr[3].split(":")[1].trim();
          gender = gender.charAt(0).toUpperCase() + gender.slice(1);
          frappe.db.exists("Gender", gender).then((gender_exists) => {
            if (gender_exists) {
              frm.set_value("gender", gender);
            }
          });
          frm.refresh_field("gender");
          let salutation = resArr[4].split(":")[1].trim();
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

          const address = resArr[10].split(":")[1].trim();
          if (address !== "NULL") {
            frappe.call({
              method:
                "autoinscribe.autoinscribe.doctype.autoinscribe_integration.autoinscribe_integration.create_address",
              args: {
                address: address,
              },
              callback(res) {
                if (res.message) {
                  frm.set_value("address", `${address}-Office`);
                }
              },
            });
          }
        },

        error: function(r) {
          console.log(r.exception.split(':')[1].trim())
          error_message = r.exception.split(':')[1].trim()
        }
      });
    }
  },

  refresh(frm) {
    if (error_message?.length > 0 && !once_refreshed) {
      frappe.throw(error_message, title="Error")
      once_refreshed = true
    }
  }
});
