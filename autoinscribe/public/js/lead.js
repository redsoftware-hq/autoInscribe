$(document).on("change", 'input[type="file"]', function () {
  $(".btn.btn-secondary.btn-sm.btn-modal-secondary").click();
});

const mapFieldValue = (frm, response, field, json_field = null) => {
  const value = response[json_field || field];
  if (value !== "NULL") {
    frm.set_value(field, value);
  }
};

frappe.ui.form.on("Lead", {
  custom_upload_business_card(frm) {
    if (frm.selected_doc.custom_upload_business_card) {
      frappe.call({
        method:
          "autoinscribe.autoinscribe.doctype.autoinscribe_integration.autoinscribe_integration.extract_text_from_img",
        args: {
          img_url:
            window.location.href.split("/app")[0] +
            frm.selected_doc.custom_upload_business_card,
        },
        freeze: true,
        freeze_message: "Transmuting Pixels into Insights... Hold Tight!",
        callback(res) {
          const data = res.message;

          mapFieldValue(frm, data, "first_name");
          mapFieldValue(frm, data, "middle_name");
          mapFieldValue(frm, data, "last_name");
          mapFieldValue(frm, data, "company_name");
          mapFieldValue(frm, data, "job_title", "designation");
          mapFieldValue(frm, data, "mobile_no", "mobile_number");
          mapFieldValue(frm, data, "phone", "phone_number");
          mapFieldValue(frm, data, "website");
          mapFieldValue(frm, data, "city");
          mapFieldValue(frm, data, "state");
          frm.set_value("email_id", data.email_ids[0] || "");

          const country = data.country;
          frappe.db.exists("Country", country).then((country_exists) => {
            if (country_exists) {
              frm.set_value("country", country);
            } else {
              frm.set_value("country", "");
            }
          });
          frm.refresh_field("country");
          const possibleGenders = [
            "Male",
            "Female",
            "Prefer not to say",
            "Non-Conforming",
            "Genderqueer",
            "Transgender",
            "Other",
          ];
          let gender = data.gender;
          gender = gender.charAt(0).toUpperCase() + gender.slice(1);
          gender !== "NULL" &&
            possibleGenders.includes(gender) &&
            frm.set_value("gender", gender);
          frm.refresh_field("gender");

          const possibleSalutations = [
            "Mr",
            "Ms",
            "Mx",
            "Dr",
            "Mrs",
            "Madam",
            "Miss",
            "Master",
            "Prof",
          ];
          let salutation = data.salutation;
          salutation =
            salutation.charAt(0).toUpperCase() +
            salutation.slice(
              1,
              salutation[salutation.length - 1] === "."
                ? salutation.length - 1
                : salutation.length
            );
          salutation !== "NULL" &&
            possibleSalutations.includes(salutation) &&
            frm.set_value("salutation", salutation);
          frm.refresh_field("salutation");
        },
      });
    }
  },
});
