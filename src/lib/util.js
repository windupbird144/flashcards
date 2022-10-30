/**
 * Takes an HTML form and returns its form values
 * as an object.
 * 
 * @param {HTMLFormElement} form A form element
 * @returns An object representing the form values
 */
export function getFormValues(form) {
    // Create a FormData object
    const fd = new FormData(form)
    // Collect entries into an array
    const entries = [...fd.entries()]
    // return the object
    const object = Object.fromEntries(entries)
    return object
}