"use strict";

class Contact {
  #name;
  #city;
  #email;

  constructor(name, city, email) {
    this.#name = name;
    this.#city = city;
    this.#email = email;
  }

  set name(name) {
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Error('Name must be a non-empty string');
    }
    this.#name = name;
  }
  
  set city(city) {
    if (typeof city !== 'string' || city.trim() === '') {
      throw new Error('City must be a non-empty string');
    }
    this.#city = city;
  }

  set email(email) {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email");
    }
    this.#email = email;
  }
  get name() {
    return this.#name;
  }

  get city() {
    return this.#city;
  }

  get email() {
    return this.#email;
  }

  toString() {
    return `Name: ${this.#name}, City: ${this.#city}, Email: ${this.#email}`;
  }

  equals(other) {
    if (!(other instanceof Contact)) {
      return false;
    }
    return this.#name.toLowerCase() === other.name.toLowerCase()
      || this.#email.toLowerCase() === other.email.toLowerCase();
  }
}

export { Contact }; // Export the Contact class
