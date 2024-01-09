# Copyright (c) 2024, RedSoft Solutions Pvt. Ltd. and Contributors
# See license.txt

import frappe
from frappe.tests.utils import FrappeTestCase
from autoinscribe.autoinscribe.doctype.autoinscribe_integration.autoinscribe_integration import extract_text_from_img, create_address


class TestAutoInscribeIntegration(FrappeTestCase):
	'''Tests methods of AutoInscribe Integration. 
	Note: Make sure AutoInscribe Settings is having correct values for all fields before testing'''

	def test_create_address_when_country_is_invalid(self):
		'''Test create_address method with an invalid value for country'''

		test_address = create_address("NULL")
		self.assertEqual(test_address, None)
	
	def test_create_address_when_country_is_valid(self):
		'''Test create_address method with a valid value for country'''

		test_address = create_address("26/C, Electronic City, Hosur Road, Bengaluru, India - 560 100")
		address_doc = frappe.get_doc("Address", test_address.name)
		self.assertEqual(address_doc.address_title, test_address.address_title)
	
	def test_extract_text_from_img(self):
		'''Test extract_text_from_img method with a dummy business card image'''

		extracted_text = extract_text_from_img('''https://gist.githubusercontent.com/deepak-redsoftware/91bce45c6034ab8f935017c91086dbc8/raw/35f2afb03bb677dc673b413c303881e7c58c76a7/bsc.jpg''')
		text_arr = extracted_text.split('\n')
		result_dict = {}
		for item in text_arr:
			key, value = item.split(':', 1)
			result_dict[key.lower()] = value.strip()
		self.assertEqual(result_dict['first_name'].lower(), 'alex')