'''Responsible for calling methods in doctype class "AutoInscribe Integration"'''

import frappe

doc = frappe.get_single("AutoInscribe Integration")

@frappe.whitelist()
def extract_text_from_img(img_url):
    return doc.extract_text_from_img(img_url)


@frappe.whitelist()
def create_address(address):
    return doc.create_address(address)

