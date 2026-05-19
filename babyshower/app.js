// Paste your Google Apps Script Web App URL here (see README.md)
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

(function () {
  const form = document.getElementById("rsvpForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");
  const formStatus = document.getElementById("formStatus");
  const guestCountField = document.getElementById("guestCountField");
  const attendingInputs = form.querySelectorAll('input[name="attending"]');

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.hidden = loading;
    btnSpinner.hidden = !loading;
  }

  function setStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = "form-status" + (type ? " " + type : "");
  }

  function toggleGuestCount() {
    const selected = form.querySelector('input[name="attending"]:checked');
    const show = selected && selected.value === "Yes";
    guestCountField.classList.toggle("hidden", !show);
  }

  attendingInputs.forEach(function (input) {
    input.addEventListener("change", toggleGuestCount);
  });
  toggleGuestCount();

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    setStatus("");

    if (typeof GOOGLE_SCRIPT_URL !== "string" || GOOGLE_SCRIPT_URL.includes("YOUR_GOOGLE")) {
      setStatus(
        "Google Sheets is not configured yet. Add your Web App URL at the top of app.js (see README).",
        "error"
      );
      return;
    }

    const formData = new FormData(form);
    const payload = {
      timestamp: new Date().toISOString(),
      fullName: formData.get("fullName")?.trim() || "",
      email: formData.get("email")?.trim() || "",
      phone: formData.get("phone")?.trim() || "",
      attending: formData.get("attending") || "",
      guestCount: formData.get("guestCount") || "",
      dietary: formData.get("dietary")?.trim() || "",
      message: formData.get("message")?.trim() || "",
    };

    if (!payload.fullName || !payload.email || !payload.attending) {
      setStatus("Please fill in all required fields.", "error");
      return;
    }

    setLoading(true);

    try {
      const body = new URLSearchParams({ payload: JSON.stringify(payload) });
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      // no-cors returns opaque response; treat as success if no network error
      form.reset();
      toggleGuestCount();
      setStatus("Thank you! Your RSVP has been received.", "success");
    } catch (err) {
      setStatus("Something went wrong. Please try again or contact the host.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  });
})();
