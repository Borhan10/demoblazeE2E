/**
 * Returns today's date in DD/MM/YYYY format
 * e.g., "30/09/2025"
 */
export function getTodayDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = today.getFullYear();
  return `${day}/${month}/${year}`;
}

export function interceptrequest(type, path, alias) {
  cy.intercept(type, `**/${path}`).as(alias);
}
