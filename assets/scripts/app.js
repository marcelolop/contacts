"use strict";

import { Contact } from "./contacts.js";
import { onEvent, getElement, select, selectAll } from "./utility-functions.js";

/*
Directions and requirements
• Create a web page with a form, a button, and a section for multiple contacts (see example).
• Validate the user input (commas, email, etc.), providing expected error messages.
• Create a class named Contact with 3 private data properties (name, city, email), a constructor,
and 3 getters. Use ES modules and a server, so both your utility functions and Contact class 
can be placed in separated files.
• Create a new ‘contact’ (an instance of Contact) using name, city, and email as arguments.
• Add the new contact object to an array.
• Call a function - listContacts() - to display the contacts on your page. listContacts() will: iterate 
through the array, create a div element, add the object’s data to three paragraphs, append 
these paragraphs to the div you just created, and add the div to the HTML document.
* New contacts must be added to the beginning of the list.
* Count and display the number of contacts added.
• Implement a function to allow users delete a contact by clicking it.
• You can use obtrusive JavaScript (onclick attribute) when adding your contacts to the page.
• Add a README file to your repository on GitHub with a link to your application (the web page
*/

//Dom Elements
const contactInput = getElement("contact-info");
const addContactBtn = select(".add-button");
const errorMessage = getElement("error-message");
const contactList = getElement("contact-list");
const contactCount = getElement("count");

let contacts = []; // Array of contacts

function validateFieldsLength(contactInfo) {
  const fields = contactInfo.split(",");

  for (const field of fields) {
    if (field.trim().length < 3) {
      return false;
    }
  }

  return true;
}

function validateContactInfo() {
  const contactInfo = contactInput.value.split(",");

  if (contactInfo.length !== 3) {
    displayError("Please enter name, city, and email separated by commas.");
    return null;
  }

  const name = contactInfo[0].trim();
  const city = contactInfo[1].trim();
  let email = contactInfo[2].trim();

  if (!/(^[A-Z][a-z]*)(\s[A-Z][a-z]*)*$/.test(name)) {
    displayError(
      "Each name must start with a capital letter and contain only letters and spaces."
    );
    return null;
  }

  if (!/(^[A-Z][a-z]*)(\s[A-Z][a-z]*)*$/.test(city)) {
    displayError(
      "Each city name must start with a capital letter and contain only letters and spaces."
    );
    return null;
  }

  email = email.toLowerCase();
  if (!/^[\w.-]+@[a-z_-]+?\.[a-z]{2,3}$/.test(email)) {
    displayError(
      "Please enter a valid email. Email should not contain uppercase letters."
    );
    return null;
  }

  return { name, city, email };
}

function displayError(message) {
  contactInput.classList.add("invalid");
  errorMessage.textContent = message;
  errorMessage.style.color = "red";

  setTimeout(() => {
    contactInput.classList.remove("invalid");
    errorMessage.textContent = "";
  }, 4000);
}

function createContactElement(contact, index) {
  const div = document.createElement("div");
  div.className = "contact-div";
  div.dataset.index = index;

  const contentDiv = document.createElement("div");
  contentDiv.className = "content";

  const nameP = document.createElement("p");
  nameP.className = "contact-name";
  nameP.textContent = `Name: ${contact.name}`;

  const cityP = document.createElement("p");
  cityP.className = "contact-city";
  cityP.textContent = `City: ${contact.city}`;

  const emailP = document.createElement("p");
  emailP.className = "contact-email";
  emailP.textContent = `Email: ${contact.email}`;

  div.appendChild(nameP);
  div.appendChild(cityP);
  div.appendChild(emailP);

  div.appendChild(contentDiv);

  return div;
}

function listContacts() {
  contactList.innerHTML = ""; // Clear the contact list

  for (let i = 0; i < contacts.length; i++) {
    const contactElement = createContactElement(contacts[i], i);
    contactList.appendChild(contactElement);
  }
}

function contactExists(name, city, email) {
  return contacts.some((contact) => {
    return contact.name.toLowerCase() === name.toLowerCase() &&
      contact.city.toLowerCase() === city.toLowerCase() &&
      contact.email.toLowerCase() === email.toLowerCase();
  });
}

function updateContactCount() {
  contactCount.textContent = `Contact count: ${contacts.length}`;
}

function deleteContact(event) {
  let element = event.target;
  while (element) {
    if (element.className === "contact-div") {
      contacts.splice(element.dataset.index, 1);
      element.remove();
      updateContactCount();
      return;
    }
    element = element.parentElement;
  }
}

onEvent("click", contactList, deleteContact);

onEvent("click", addContactBtn, function () {
  const contactInfo = validateContactInfo();

  if (contactInfo) {
    if (contactExists(contactInfo.name, contactInfo.city, contactInfo.email)) {
      errorMessage.textContent = "This contact already exists in the list.";
      errorMessage.style.color = "red";
      // Remove the error message after 3 seconds
      setTimeout(() => {
        errorMessage.textContent = "";
        contactInput.classList.remove("invalid");
      }, 4000);
    } else {
      const contact = new Contact(
        contactInfo.name,
        contactInfo.city,
        contactInfo.email
      );
      contacts.unshift(contact);
      listContacts();
      updateContactCount();
      errorMessage.textContent = "";
    }
  }
});

onEvent("click", contactList, function (event) {
  if (event.target.tagName === "LI") {
    contacts = contacts.filter(
      (contact) => createContactElement(contact) !== event.target
    );
    listContacts();
    updateContactCount();
  }
});
