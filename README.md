<p align="center">
  <img src="autoinscribe_logo.png" alt="autoinscribe logo" height="100" />
  <h1 align="center">AutoInscribe</h1>
  <p align="center">Seamless automatic data capture and integration solution</p>
</p>
<p align="center">
  <a href="https://github.com/The-Commit-Company/autoinscribe/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/badge/license-AGPLv3-blue">
  </a>
</p>

<br>

AutoInscribe is a tool for simplifying OCR that is built using [Frappe Framework](https://frappeframework.com) and requires a new or existing Frappe site (with ERPNext installed). It empowers users to streamline their workflow by seamlessly uploading business card photos for automatic extraction and storage of contact and lead information

<hr>

## Pre-Requisites to be installed

1. [Frappe Framework](https://frappeframework.com) - v15 or above
2. [ERPNext](https://erpnext.com/) - v14 or above

<hr>

## Features

1. Easily upload business card images directly into the system for automated data extraction
2. Leveraging the power of Google Vision API, AutoInscribe swiftly extracts text from uploaded images, ensuring accurate retrieval of contact details like name, phone numbers, email addresses, and more
3. Utilizing OpenAI's GPT technology, the app provides concise and comprehensive text summarization. This feature condenses extracted information into precise summaries, enhancing readability and usability
4. Once text is extracted and summarized, AutoInscribe autonomously populates and saves the relevant fields in the Contact or Lead doctype within Frappe. This automated process saves time and reduces manual data entry, ensuring data accuracy and consistency
5. User can configure the app settings using "AutoInscribe Settings" doctype

<hr>

<br>

<p align="center">
    <figure>
        <img width="1402" src="screenshots/autoinscribe-settings.png" alt="Private Channel" />
         <figcaption align="center">
            <b>Autoinscribe Settings</b>
        </figcaption>
    </figure>
</p>

<details>
  <summary>Show more screenshots</summary>
  

  <figure>
      <img width="1402" src="screenshots/upload-image-field.png" alt="Channel Members" />
      <figcaption align="center"><b>Upload Image Field</b></figcaption>
  </figure>
  
  <figure>
      <img width="1402" src="screenshots/autofilled-lead.png" alt="Adding Members to a channel" />
      <figcaption align="center"><b>Autofilled Lead</b></figcaption>
  </figure>
</details>

<hr>