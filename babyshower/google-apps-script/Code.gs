/**
 * Baby Shower RSVP → Google Sheets
 *
 * Setup:
 * 1. Create a new Google Sheet
 * 2. Extensions → Apps Script → paste this file
 * 3. Run setupSheet once (authorize when prompted)
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL into config.js on your website
 */

const SHEET_NAME = "RSVP Responses";

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  const headers = [
    "Timestamp",
    "Full Name",
    "Phone",
    "Attending",
    "Guest Count",
    "Message",
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
  SpreadsheetApp.flush();
}

function doPost(e) {
  try {
    const raw = e.parameter.payload || (e.postData && e.postData.contents);
    if (!raw) {
      return jsonResponse({ ok: false, error: "Missing payload" });
    }

    const data = JSON.parse(raw);
    appendRow(data);
    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput("Baby Shower RSVP endpoint is running.");
}

function appendRow(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    setupSheet();
    sheet = ss.getSheetByName(SHEET_NAME);
  }

  const row = [
    data.timestamp || new Date().toISOString(),
    data.fullName || "",
    data.phone || "",
    data.attending || "",
    data.guestCount || "",
    data.message || "",
  ];

  sheet.appendRow(row);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
