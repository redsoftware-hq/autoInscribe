import frappe
import base64
import requests
from openai import OpenAI
from google.cloud import vision
from google.oauth2 import service_account
from frappe.utils.password import get_decrypted_password

autoinscribe_settings = frappe.get_doc("AutoInscribe Settings").as_dict()

def get_openai_gpt_key():
    return get_decrypted_password("AutoInscribe Settings", "AutoInscribe Settings", "openai_gpt_key")


def get_vision_client_email():
    return autoinscribe_settings["vision_client_email"]


def get_vision_project_id():
    return autoinscribe_settings["vision_project_id"]


def get_vision_token_uri():
    return autoinscribe_settings["vision_token_uri"]


gpt_client = OpenAI(api_key=get_openai_gpt_key())

credentials = service_account.Credentials.from_service_account_info({
  "type": "service_account",
  "project_id": get_vision_project_id(),
  "private_key": frappe.conf["vision_private_key"],
  "client_email": get_vision_client_email(),
  "token_uri": get_vision_token_uri(),
})


@frappe.whitelist()
def ask_gpt(prompt):
    try:
        chat_completion = gpt_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gpt-3.5-turbo-1106",
        )
        return chat_completion.choices[0].message.content.strip()
    except Exception as e:
        frappe.throw("Please enter a valid OpenAI API key in AutoInscribe Settings")


@frappe.whitelist()
def get_gpt_task(**args):
    task_details = args.get('task_details')
    prompt = f"You are an assistant that is responsible for generating the Subject and Details of the following task: {task_details}. Subject must be a string that gives an overview of the task. Details must be a formatted HTML body that describes that task."
    reply = ask_gpt(prompt)
    return reply


@frappe.whitelist()
def extract_text_from_img(img_url):
    response = requests.get(img_url)
    # Encode the image content to base64
    base64_img = base64.b64encode(response.content).decode('utf-8')
    client = vision.ImageAnnotatorClient(credentials=credentials)
    img_data = base64.b64decode(base64_img)
    # Create an image object
    image = vision.Image(content=img_data)
    # Perform OCR on the image
    response = client.text_detection(image=image)
    texts = response.text_annotations
    # Extracting detected text
    if texts:
        detected_text = texts[0].description
        prompt = f"From the following text, identify the first_name, middle_name, last_name, gender, salutation, designation contact_numbers, email_ids, company_name, website, address, mobile_number, phone_number, city, state, country: {detected_text}. Output must be a string containing one key-value pair per line and for absence of values use 'NULL' for value as placeholder. contact_numbers and email_ids must be comma-separated if there are multiple. Guess the salutation and gender. gender can be Male, Female, Transgender or Other. phone_number must be the telephone number whereas mobile_number must be the mobile number. country must have the value as full country name, e.g, US becomes United States, UK becomes United Kingdom."
        reply = ask_gpt(prompt)
        return reply
    else:
        return "No text detected"


@frappe.whitelist()
def create_address(address):
    prompt = f"From the following address text, identify city, state, country and postal_code: {address}. Output must be a string containing one key-value pair per line and for absence of values use 'NULL'. country must have the value as full country name, e.g, US becomes United States, UK becomes United Kingdom"
    reply = ask_gpt(prompt)
    addr_lines = reply.strip().splitlines()
    city = addr_lines[0].split(':')[1].strip()
    state = addr_lines[1].split(':')[1].strip()
    postal_code = addr_lines[3].split(':')[1].strip()
    country = addr_lines[2].split(':')[1].strip()
    country_exists = frappe.db.exists("Country", {"country_name": country})
    if country_exists:
        doc = frappe.get_doc({
                "doctype": "Address",
                "address_title": address,
                "address_type": "Office",
                "address_line1": address,
                "city": city if city != "NULL" else None,
                "state": state if state != "NULL" else None,
                "country": country,
                "pincode": postal_code if postal_code != "NULL" else None,
        })
        doc.insert()
        return doc
    else:
        return False
