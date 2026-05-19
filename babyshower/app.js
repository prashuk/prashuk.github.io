// Paste your Google Apps Script Web App URL here (see README.md)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwei97Rlz-H-JT7070PiL_40xbvB8Lzt_0vGfP8CS92H2yi-_QN6KVI7TpJzZxtAB8kXw/exec";

(function () {
  const form = document.getElementById("rsvpForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnSpinner = submitBtn.querySelector(".btn-spinner");
  const formStatus = document.getElementById("formStatus");
  const modal = document.getElementById("rsvpModal");
  const openBtn = document.getElementById("openRsvpBtn");
  const closeBtn = document.getElementById("closeRsvpBtn");
  const backdrop = document.getElementById("modalBackdrop");
  const modalDialog = modal.querySelector(".modal-dialog");

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.hidden = loading;
    btnSpinner.hidden = !loading;
  }

  function setStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = "form-status" + (type ? " " + type : "");
  }

  function openModal() {
    setStatus("");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    openBtn.focus();
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  modalDialog.addEventListener("click", function (e) {
    e.stopPropagation();
  });

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
      phone: formData.get("phone")?.trim() || "",
      attending: formData.get("attending") || "",
      guestCount: formData.get("guestCount") || "",
      message: formData.get("message")?.trim() || "",
    };

    if (!payload.fullName || !payload.attending) {
      setStatus("Please fill in all required fields.", "error");
      return;
    }

    setLoading(true);

    try {
      const body = new URLSearchParams({ payload: JSON.stringify(payload) });
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      form.reset();
      setStatus("Thank you! Your RSVP has been received.", "success");
      setTimeout(closeModal, 2200);
    } catch (err) {
      setStatus("Something went wrong. Please try again or contact the host.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  });
})();
