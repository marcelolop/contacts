"use strict";

import { Contact } from "./classes/contacts.js";
import { onEvent, getElement, select } from "./utils/general.js";

//Dom Elements
const contactInput = getElement("contact-info");
const addContactBtn = select(".add-button");
const errorMessage = getElement("error-message");
const contactList = getElement("contact-list");
const contactCount = getElement("count");

let contacts = []; // Array of contacts

/**
 * Checks if a value matches a regex and has a minimum length
 * @param {*} value
 * @param {*} regex
 * @param {number} minLength
 * @param {string} errorMessage
 * @returns true if the value matches the regex and has a minimum length, false otherwise.
 */
function validateWithRegex(value, regex, minLength, errorMessage) {
  if (value.length < minLength || !regex.test(value)) {
    displayError(errorMessage);
    return false;
  }
  return true;
} // Utility function

function validateContactInfo(contactInputValue) {
  const contactInfo = contactInputValue.split(",");

  if (contactInfo.length !== 3) {
    let missingFields = "";
    if (!contactInfo[0]) missingFields += "Name, ";
    if (!contactInfo[1]) missingFields += "City, ";
    if (!contactInfo[2]) missingFields += "Email, ";

    missingFields = missingFields.slice(0, -2);

    return {
      error: `Please enter the following fields separated by commas: ${missingFields}`,
    };
  }

  const name = contactInfo[0].trim();
  const city = contactInfo[1].trim();
  let email = contactInfo[2].trim();

  const nameValid = validateWithRegex(
    name,
    /(^[A-Z][a-z]*)(\s[A-Z][a-z]*)*$/,
    2,
    "Each name must start with a capital letter, contain only letters and spaces, and be at least 3 characters long."
  );
  if (!nameValid) return { error: "Invalid name" };

  const cityValid = validateWithRegex(
    city,
    /(^[A-Z][a-z]*)(\s[A-Z][a-z]*)*$/,
    3,
    "Each city name must start with a capital letter, contain only letters and spaces, and be at least 3 characters long."
  );
  if (!cityValid) return { error: "Invalid city" };

  email = email.toLowerCase();
  const emailValid = validateWithRegex(
    email,
    /^[\w.-]+@[a-z_-]+?\.[a-z]{2,3}$/,
    3,
    "Please enter a valid email. Email should not contain uppercase letters and be at least 3 characters long."
  );
  if (!emailValid) return { error: "Invalid email" };

  return { name, city, email };
}

function displayError(message) {
  contactInput.classList.add("invalid");
  errorMessage.textContent = message;
  errorMessage.style.color = "red";

  setTimeout(() => {
    contactInput.classList.remove("invalid");
    errorMessage.textContent = "";
  }, 3000);
}

function createContactElement(contact, index) {
  const div = document.createElement("div");
  div.className = "contact-div";
  div.dataset.index = index;
  console.log(contact);
  // Add onclick event to delete the contact when clicked
  div.onclick = function () {
    deleteContact(index);
  };

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

/**
 * Checks if a contact already exists in the list of contacts
 * @param {[]} contacts
 * @param {string} name
 * @param {string} email
 * @returns an array of duplicate fields (name, email, or both)
 */
function contactExists(contacts, name, email) {
  const duplicateFields = [];
  contacts.forEach((contact) => {
    if (contact.name.toLowerCase() === name.toLowerCase()) {
      if (!duplicateFields.includes("Name")) {
        duplicateFields.push("Name");
      }
    }
    if (contact.email.toLowerCase() === email.toLowerCase()) {
      if (!duplicateFields.includes("Email")) {
        duplicateFields.push("Email");
      }
    }
  });
  return duplicateFields;
}

function updateContactCount() {
  contactCount.textContent = `Contacts Saved: ${contacts.length}`;
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
  const contactInfo = validateContactInfo(contactInput.value);

  console.log(contactInfo);

  if (!contactInfo.error) {
    const duplicateFields = contactExists(
      contacts,
      contactInfo.name,
      contactInfo.email
    );

    if (duplicateFields.length > 0) {
      errorMessage.textContent = `One or more fields already exist in other contacts on the list. The duplicate field(s) is/are: ${duplicateFields.join(
        ", "
      )}. `;
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
