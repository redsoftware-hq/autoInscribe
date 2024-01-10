$(document).on('change', 'input[type="file"]', function() {
  $(".btn.btn-secondary.btn-sm.btn-modal-secondary").click()
});

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
          designation !== "NULL" && frm.set_value("job_title", designation);
          const email_ids = resArr[7].split(":")[1].trim().split(",");
          frm.set_value("email_id", email_ids[0] || "");

          const mobile_no = resArr[11].split(":")[1].trim();
          mobile_no !== "NULL" && frm.set_value("mobile_no", mobile_no);
          const phone = resArr[12].split(":")[1].trim();
          phone !== "NULL" && frm.set_value("phone", phone);

          const possibleGenders = [
            "Male",
            "Female",
            "Prefer not to say",
            "Non-Conforming",
            "Genderqueer",
            "Transgender",
            "Other",
          ];
          let gender = resArr[3].split(":")[1].trim();
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
          let salutation = resArr[4].split(":")[1].trim();
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

          let website = resArr[9].split(":")[1].trim();
          frm.set_value("website", website);

          const city = resArr[13].split(":")[1].trim();
          city !== "NULL" && frm.set_value("city", city);

          const state = resArr[14].split(":")[1].trim();
          state !== "NULL" && frm.set_value("state", state);

          const country = resArr[15].split(":")[1].trim();
          frappe.db.exists("Country", country).then((country_exists) => {
            if (country_exists) {
              frm.set_value("country", country);
            } else {
              frm.set_value("country", "");
            }
          });
          frm.refresh_field("country");
        },
      });
    }
  },
});
