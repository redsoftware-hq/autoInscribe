# Copyright (c) 2024, RedSoft Solutions Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
import base64
import requests
from openai import OpenAI
from google.cloud import vision
from google.oauth2 import service_account

class AutoInscribeIntegration(Document):
	'''Encapsulates a set of methods used to make external calls to OpenAI API & Google Vision API'''

	def __init__(self, *args, **kwargs):
		super(AutoInscribeIntegration, self).__init__(*args, **kwargs)
		self.auto_inscribe_settings = frappe.get_single("AutoInscribe Settings")

	def get_openai_gpt_key(self):
		'''Returns decrypted OpenAI API key from AutoInscribe Settings'''
		
		return self.auto_inscribe_settings.get_password('openai_gpt_key')

	def get_vision_client_email(self):
		'''Returns Vision Client Email from AutoInscribe Settings'''
		
		return self.auto_inscribe_settings.as_dict()["vision_client_email"]

	def get_vision_project_id(self):
		'''Returns Vision Project ID from AutoInscribe Settings'''
		
		return self.auto_inscribe_settings.as_dict()["vision_project_id"]

	def get_vision_token_uri(self):
		'''Returns Vision Token URI from AutoInscribe Settings'''
		
		return self.auto_inscribe_settings.as_dict()["vision_token_uri"]
	
	def get_vision_private_key(self):
		'''Returns Vision Private Key from AutoInscribe Settings'''
		
		return self.auto_inscribe_settings.as_dict()["vision_private_key"]
	
	def ask_gpt(self, prompt):
		'''Returns response from OpenAI API given a prompt'''

		try:
			gpt_client = OpenAI(api_key=self.get_openai_gpt_key())
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
			frappe.throw(_("Please enter a valid OpenAI API key in AutoInscribe Settings"), title=_("Error"))

	def extract_text_from_img(self, img_url):
		'''Extracts and returns first_name, middle_name, last_name, gender, salutation, designation contact_numbers, email_ids, company_name, website, address, mobile_number, phone_number, city, state and country from an image given the image URL'''
		
		texts = None
		project_id = self.get_vision_project_id()
		private_key = self.get_vision_private_key().strip().replace('\\n', '\n')
		client_email = self.get_vision_client_email()
		token_uri = self.get_vision_token_uri()

		if not project_id or not private_key or not client_email or not token_uri:
			return frappe.throw(_("Missing required fields in AutoInscribe Settings"), title=_("Error"))

		response = requests.get(img_url)

		if response.status_code != 200:
			if response.status_code == 403:
				return frappe.throw(_("You don't have permission to access this file. Make sure you upload file with public access."), title=_("Error"))
			else:
				return frappe.throw(_("Failed to fetch image from URL"), title=_("Error"))
		
		try:
			credentials = service_account.Credentials.from_service_account_info({
				"type": "service_account",
				"project_id": project_id,
				"private_key": private_key,
				"client_email": client_email,
				"token_uri": token_uri,
			})

			client = vision.ImageAnnotatorClient(credentials=credentials)
			
			# Encode the image content to base64
			base64_img = base64.b64encode(response.content).decode('utf-8')
			img_data = base64.b64decode(base64_img)
			# Create an image object
			image = vision.Image(content=img_data)
			# Perform OCR on the image
			response = client.text_detection(image=image)
			texts = response.text_annotations
		except Exception as e:
			return frappe.throw(_("Invalid Google Vision credentials. Please check your AutoInscribe Settings and try again"), title=_("Error"))

		# Extracting detected text
		if texts:
			detected_text = texts[0].description
			prompt = f"From the following text, identify the first_name, middle_name, last_name, gender, salutation, designation contact_numbers, email_ids, company_name, website, address, mobile_number, phone_number, city, state, country: {detected_text}. Output must be a string containing one key-value pair per line and for absence of values use 'NULL' for value as placeholder. contact_numbers and email_ids must be comma-separated if there are multiple. Guess the salutation and gender. gender can be Male, Female, Transgender or Other. phone_number must be the telephone number whereas mobile_number must be the mobile number. country must have the value as full country name, e.g, US becomes United States, UK becomes United Kingdom."
			reply = self.ask_gpt(prompt)
			return reply
		else:
			return frappe.throw(_("No information extracted from image. Please try again with a different image"), title=_("Error"))
	
	def create_address(self, address):
		'''Given an address string, extract city, state, postal_code, country and create an address if country exists & return the inserted doc. Return None otherwise.'''
		
		prompt = f"From the following address text, identify city, state, country and postal_code: {address}. Output must be a string containing one key-value pair per line and for absence of values use 'NULL'. country must have the value as full country name, e.g, US becomes United States, UK becomes United Kingdom"
		reply = self.ask_gpt(prompt)
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
					"is_your_company_address": 0
			})
			doc.insert()
			return doc
		else:
			return None

@frappe.whitelist()
def extract_text_from_img(img_url):
	'''Calls extract_text_from_img method inside AutoInscribe Integration'''

	doc = frappe.get_single("AutoInscribe Integration")
	return doc.extract_text_from_img(img_url)


@frappe.whitelist()
def create_address(address):
	'''Calls create_address method inside AutoInscribe Integration'''

	doc = frappe.get_single("AutoInscribe Integration")
	return doc.create_address(address)

