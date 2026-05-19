# Baby Shower RSVP (Pearl Theme)

A beautiful pearl-themed RSVP form with a hero photo, soft multi-color background, and automatic Google Sheets logging on submit.

## Quick start

1. Open `index.html` in a browser (or run a local server — see below).
2. Replace the photo: add your image as `assets/baby-shower-photo.jpg` (recommended 1200×800 or similar).
3. Connect Google Sheets (one-time setup below).
4. Paste your Web App URL at the top of `app.js`.

### Local preview

```bash
cd babyshower
python3 -m http.server 8080
```

Then open http://localhost:8080

### Live URL (GitHub Pages)

After you push this repo, the RSVP page is at **https://prashuk.co/babyshower** (folder name `babyshower` maps to that path).

## Customize

| What | Where |
|------|--------|
| Event date & title | `index.html` — `.event-date`, `h1`, `.subtitle` |
| RSVP deadline | `index.html` — `.form-intro` |
| Pearl colors | `styles.css` — `:root` variables |
| Google endpoint | `app.js` — `GOOGLE_SCRIPT_URL` |

## Google Sheets setup

### 1. Create the sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Name it something like **Baby Shower RSVP**.

### 2. Add the script

1. **Extensions → Apps Script**
2. Delete any default code and paste the contents of `google-apps-script/Code.gs`
3. Save the project (e.g. **Baby Shower RSVP**)

### 3. Initialize headers

1. In Apps Script, select the function **`setupSheet`** from the dropdown.
2. Click **Run** and approve permissions when asked.
3. Your sheet should get a tab **RSVP Responses** with column headers.

### 4. Deploy as web app

1. **Deploy → New deployment**
2. Type: **Web app**
3. **Execute as:** Me  
4. **Who has access:** Anyone  
5. Click **Deploy** and copy the **Web app URL** (ends with `/exec`).

### 5. Connect the form

Open `app.js` and set:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

Save and reload the RSVP page. Submit a test RSVP and confirm a new row appears in the sheet.

## Form fields saved to the sheet

| Column | Form field |
|--------|------------|
| Timestamp | Auto (submission time) |
| Full Name | Required |
| Phone | Optional |
| Attending | Yes / No / Maybe |
| Guest Count | Shown when attending “Yes” |
| Message | Optional |

## Notes

- The form uses `no-cors` when posting to Google Apps Script, so the browser cannot read the response body; if the request completes without a network error, the UI shows success. Verify with a test row in the sheet.
- For production, host the folder on GitHub Pages, Netlify, or any static host.
- Keep the Apps Script deployment URL private if you add rate limiting later; “Anyone” can only POST RSVP data, not read the sheet.

## Project structure

```
babyshower/
├── index.html      ← structure
├── styles.css      ← pearl theme design
├── app.js          ← form logic + Google Sheets
├── assets/
│   ├── baby-shower-photo.jpg   ← your photo (add this)
│   └── placeholder-photo.svg     ← shown until photo is added
├── google-apps-script/
│   └── Code.gs
└── README.md
```
