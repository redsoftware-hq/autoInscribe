<p align="center">
  <img src="autoinscribe_logo.png" alt="autoinscribe logo" height="100" />
  <h1 align="center">AutoInscribe</h1>
  <p align="center">Seamless automatic data capture and integration solution</p>
</p>
<p align="center">
  <a href="https://github.com/redsoftware-hq/autoInscribe/blob/develop/LICENSE.txt">
    <img alt="license" src="https://img.shields.io/badge/license-AGPLv3-blue">
  </a>
</p>

<br>

AutoInscribe is a tool for simplifying OCR that is built using [Frappe Framework](https://frappeframework.com) and requires a new or existing Frappe site (with ERPNext installed). It empowers users to streamline their workflow by seamlessly uploading business card photos for automatic extraction and storage of contact and lead information

<hr>

## Pre-Requisites

1. [Frappe Framework](https://frappeframework.com) - v15 or above
2. [ERPNext](https://erpnext.com/) - v14 or above
3. [OpenAI Account](https://platform.openai.com/) - First, create an OpenAI account or sign in. Next, navigate to the API key page and "Create new secret key", optionally naming the key.
4. [Google Vision API](https://console.cloud.google.com/marketplace/product/google/vision.googleapis.com) - Login to your Google Cloud Console and create a new project or select the existing one from under the Project tab. When the project is opened, click Navigation Menu and select “API & Services > Dashboard”. Now you need to enable Cloud Vision API. To do this, click the “ENABLE APIS AND SERVICES” button. In the search bar, search for Cloud Vision API and click it to enable. Now you need to create Google Cloud Vision key. To do this, click Navigation menu, select “IAM & admin > Service accounts”. In the window that opens, click “Create Service Account”.
Set up the name, ID and optionally add the description. In the next step, set up a role or leave it by default and click “Continue”. In the last step, optionally grant users access to this service account and create the key. In the menu “Service accounts for project “Project Name”, click “Actions > Create key”. In the window that opens, select “JSON” as the key format and click “Create”. You will be prompted to automatically download the key.

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

## Installation for self-hosted users:

It can be installed via [frappe-bench](https://frappeframework.com/docs/v14/user/en/bench) on your local machine or on your production site.

Once you have [setup your bench](https://frappeframework.com/docs/v14/user/en/installation) and your [site](https://frappeframework.com/docs/v14/user/en/tutorial/install-and-setup-bench), you can install the app via the following commands:

```bash
# development install
$ bench get-app https://github.com/redsoftware-hq/autoInscribe --branch develop

# install on site
$ bench --site yoursite.name install-app autoinscribe
```

Post this, you can use autoinscribe on your Frappe site by searching for AutoInscribe settings and then entering your credentials there.

### Local development setup

To set up your local development environment, make sure that you have enabled [developer mode](https://frappeframework.com/how-to-enable-developer-mode-in-frappe) in your Frappe site config.

<hr>

## Usage

For now, we support only two doctypes: Contact & Lead.
<br>
After installing the app and providing all the secrets/keys, simply go to the "Add" screen of the supported doctype and you'll see an "Upload" field where you can upload the business card image of your choice, leave the default option to "Set all public" as we only support public files for now. Then click upload and wait for the fields to populate.

### Contributing

- Send PRs to `develop` branch only.

<hr>

## Reporting Bugs
If you find any bugs, feel free to report them here on [GitHub Issues](https://github.com/redsoftware-hq/autoInscribe/issues). Make sure you share enough information (app screenshots, browser console screenshots, stack traces, etc) for project maintainers to replicate your bug.

<hr>

## License

AGPLv3