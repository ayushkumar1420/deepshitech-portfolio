/* =========================================================
   EMAIL OTP VERIFICATION  (shared by BOTH forms)
   - Side slider form : #dsProjectForm      (source: side-slider)
   - Center popup form: #dsAutoProjectForm  (source: center-popup)

   What it does for each form:
   1. Adds a "Send OTP" button + OTP box under the Email field
   2. Calls otp-send.php / otp-verify.php
   3. Exposes DSOtp.isVerified(form) so the submit handlers in
      popup.js and auto-popup.js can block submission until verified.

   Server-side checks in project-enquiry.php are the real lock;
   this file only provides the user interface.
========================================================= */

(function () {
  "use strict";

  var states = new WeakMap();

  function prefix() {
    return window.MIL_PATH_PREFIX || "";
  }

  function norm(email) {
    return String(email || "").trim().toLowerCase();
  }

  /* ---------- styles (matches existing dark / gold theme) ---------- */

  function injectStyles() {
    if (document.getElementById("dsOtpStyles")) return;

    var css = [
      ".ds-otp{margin-top:10px;display:flex;flex-direction:column;gap:8px;}",
      ".ds-otp .ds-otp-row{display:flex;gap:8px;align-items:stretch;}",
      ".ds-otp .ds-otp-input{flex:1;min-width:0;height:44px;padding:0 14px;border:1px solid rgba(255,255,255,.12);border-radius:7px;background:#181818;color:#fff;font-size:16px;letter-spacing:6px;text-align:center;outline:none;box-sizing:border-box;}",
      ".ds-otp .ds-otp-input::placeholder{letter-spacing:0;font-size:13px;color:rgba(255,255,255,.38);}",
      ".ds-otp .ds-otp-input:focus{border-color:#c78c24;background:#1b1b1b;}",
      ".ds-otp .ds-otp-btn{height:44px;padding:0 16px;border:1px solid #c78c24;border-radius:7px;background:transparent;color:#c78c24;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:.25s ease;}",
      ".ds-otp .ds-otp-btn:hover:not(:disabled){background:#c78c24;color:#000;}",
      ".ds-otp .ds-otp-btn:disabled{opacity:.5;cursor:not-allowed;}",
      ".ds-otp .ds-otp-btn.ds-otp-solid{background:#c78c24;color:#000;}",
      ".ds-otp .ds-otp-msg{display:none;font-size:12.5px;line-height:1.5;padding:8px 12px;border-radius:6px;}",
      ".ds-otp .ds-otp-msg.info,.ds-otp .ds-otp-msg.ok{display:block;color:#d1941f;border:1px solid rgba(209,148,31,.35);background:rgba(209,148,31,.08);}",
      ".ds-otp .ds-otp-msg.err{display:block;color:#ff8a8a;border:1px solid rgba(255,90,90,.3);background:rgba(255,90,90,.06);}",
      ".ds-otp[hidden],.ds-otp [hidden]{display:none !important;}",
      ".ds-otp.ds-otp-attention{animation:dsOtpShake .35s ease;}",
      "@keyframes dsOtpShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}"
    ].join("");

    var style = document.createElement("style");
    style.id = "dsOtpStyles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ---------- network helper ---------- */

  function post(url, data) {
    var body = new FormData();
    Object.keys(data).forEach(function (k) { body.append(k, data[k]); });

    return fetch(url, {
      method: "POST",
      body: body,
      credentials: "same-origin",
      headers: { "Accept": "application/json" }
    })
      .then(function (r) { return r.text().then(function (t) { return { r: r, t: t }; }); })
      .then(function (x) {
        var json;
        try { json = JSON.parse(x.t); }
        catch (e) { throw new Error("Server returned an invalid response (HTTP " + x.r.status + ")."); }
        return json;
      });
  }

  /* ---------- attach OTP UI to one form ---------- */

  function attach(form, source) {
    if (!form || states.has(form)) return;

    var emailInput = form.querySelector('input[name="email"]');
    if (!emailInput) return;

    var holder =
      emailInput.closest(".ds-field") ||
      emailInput.closest(".ds-auto-field") ||
      emailInput.parentNode;

    injectStyles();

    /* hidden fields posted with the lead (used for the Google Sheet) */
    function hidden(name, value) {
      var el = form.querySelector('input[name="' + name + '"]');
      if (!el) {
        el = document.createElement("input");
        el.type = "hidden";
        el.name = name;
        form.appendChild(el);
      }
      el.value = value;
      return el;
    }
    hidden("form_source", source);
    var pageUrlField = hidden("page_url", location.href);
    form.addEventListener("submit", function () { pageUrlField.value = location.href; }, true);

    /* UI */
    var box = document.createElement("div");
    box.className = "ds-otp";
    box.innerHTML =
      '<div class="ds-otp-row ds-otp-send-row">' +
        '<button type="button" class="ds-otp-btn ds-otp-send" style="flex:1">Send OTP to verify email</button>' +
      '</div>' +
      '<div class="ds-otp-row ds-otp-entry" hidden>' +
        '<input type="text" class="ds-otp-input" inputmode="numeric" autocomplete="one-time-code" ' +
          'maxlength="6" placeholder="Enter 6-digit OTP" aria-label="Email OTP">' +
        '<button type="button" class="ds-otp-btn ds-otp-solid ds-otp-verify">Verify</button>' +
      '</div>' +
      '<div class="ds-otp-msg" role="status" aria-live="polite"></div>';
    holder.appendChild(box);

    var sendRow = box.querySelector(".ds-otp-send-row");
    var sendBtn = box.querySelector(".ds-otp-send");
    var entry = box.querySelector(".ds-otp-entry");
    var otpInput = box.querySelector(".ds-otp-input");
    var verifyBtn = box.querySelector(".ds-otp-verify");
    var msg = box.querySelector(".ds-otp-msg");

    var state = {
      verified: false,
      email: "",          // the email an OTP was last sent to / verified for
      timer: null
    };
    states.set(form, state);

    function say(text, kind) {
      msg.textContent = text || "";
      msg.className = "ds-otp-msg" + (text ? " " + kind : "");
    }

    function stopTimer() {
      if (state.timer) { clearInterval(state.timer); state.timer = null; }
    }

    function startCooldown(seconds) {
      stopTimer();
      var left = seconds;
      sendBtn.disabled = true;
      sendBtn.textContent = "Resend OTP (" + left + "s)";
      state.timer = setInterval(function () {
        left--;
        if (left <= 0) {
          stopTimer();
          sendBtn.disabled = false;
          sendBtn.textContent = "Resend OTP";
        } else {
          sendBtn.textContent = "Resend OTP (" + left + "s)";
        }
      }, 1000);
    }

    function resetUi() {
      stopTimer();
      state.verified = false;
      state.email = "";
      otpInput.value = "";
      entry.hidden = true;
      sendRow.hidden = false;
      sendBtn.disabled = false;
      sendBtn.textContent = "Send OTP to verify email";
      say("");
    }

    /* user edits the email after sending/verifying -> start over */
    emailInput.addEventListener("input", function () {
      if (state.email && norm(emailInput.value) !== state.email) resetUi();
    });

    /* digits only in the OTP box */
    otpInput.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 6);
    });

    /* Enter inside the OTP box = Verify (never submits the whole form) */
    otpInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); verifyBtn.click(); }
    });

    /* ---- Send OTP ---- */
    sendBtn.addEventListener("click", function () {
      var email = emailInput.value.trim();

      if (!email || !emailInput.checkValidity()) {
        say("Please enter a valid email address first.", "err");
        emailInput.focus();
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = "Sending...";
      say("");

      post(prefix() + "otp-send.php", { email: email })
        .then(function (res) {
          if (!res.success) {
            say(res.message || "Could not send OTP.", "err");
            if (res.resend_after) { startCooldown(res.resend_after); }
            else { sendBtn.disabled = false; sendBtn.textContent = state.email ? "Resend OTP" : "Send OTP to verify email"; }
            return;
          }
          state.email = norm(email);
          state.verified = false;
          entry.hidden = false;
          otpInput.value = "";
          otpInput.focus();
          say(res.message || "OTP sent. Please check your inbox (and spam folder).", "info");
          startCooldown(res.resend_after || 30);
        })
        .catch(function (err) {
          say(err.message || "Network error. Please try again.", "err");
          sendBtn.disabled = false;
          sendBtn.textContent = state.email ? "Resend OTP" : "Send OTP to verify email";
        });
    });

    /* ---- Verify OTP ---- */
    verifyBtn.addEventListener("click", function () {
      var code = otpInput.value.trim();

      if (!/^\d{6}$/.test(code)) {
        say("Please enter the 6-digit OTP.", "err");
        otpInput.focus();
        return;
      }

      verifyBtn.disabled = true;
      verifyBtn.textContent = "Checking...";

      post(prefix() + "otp-verify.php", { email: state.email || emailInput.value.trim(), otp: code })
        .then(function (res) {
          if (res.success) {
            stopTimer();
            state.verified = true;
            entry.hidden = true;
            sendRow.hidden = true;
            say("\u2713 Email verified. You can now submit the form.", "ok");

            /* remove the stale "please verify" notice from the form's status bar */
            var st = form.querySelector(".ds-form-status, .ds-auto-form-status");
            if (st && /verify your email/i.test(st.textContent)) {
              st.textContent = "";
              st.classList.remove("error", "success");
            }
            return;
          }
          say(res.message || "Incorrect OTP.", "err");
          otpInput.value = "";
          if (res.reset) {            /* expired / too many attempts -> allow resend now */
            stopTimer();
            sendBtn.disabled = false;
            sendBtn.textContent = "Resend OTP";
          } else {
            otpInput.focus();
          }
        })
        .catch(function (err) {
          say(err.message || "Network error. Please try again.", "err");
        })
        .then(function () {
          verifyBtn.disabled = false;
          verifyBtn.textContent = "Verify";
        });
    });

    /* helpers used by the public API */
    state.reset = resetUi;
    state.say = say;
    state.box = box;
    state.emailInput = emailInput;
  }

  /* ---------- public API (used by popup.js and auto-popup.js) ---------- */

  window.DSOtp = {

    attach: attach,

    /* true only when THIS form's current email has been verified */
    isVerified: function (form) {
      var s = states.get(form);
      return !!(s && s.verified && norm(s.emailInput.value) === s.email);
    },

    /* shows the "please verify" hint inside the OTP box; returns the text */
    requireVerification: function (form) {
      var s = states.get(form);
      var text = "Please verify your email with the OTP before submitting.";
      if (s) {
        s.say(text, "err");
        s.box.classList.remove("ds-otp-attention");
        void s.box.offsetWidth;                 /* restart animation */
        s.box.classList.add("ds-otp-attention");
        if (s.box.scrollIntoView) s.box.scrollIntoView({ block: "center", behavior: "smooth" });
      }
      return text;
    },

    reset: function (form) {
      var s = states.get(form);
      if (s) s.reset();
    }
  };

  /* ---------- wire up both forms ---------- */

  function attachAll() {
    attach(document.getElementById("dsAutoProjectForm"), "center-popup");
    attach(document.getElementById("dsProjectForm"), "side-slider");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachAll);
  } else {
    attachAll();
  }

  /* the side form is injected later (components.js fetches side_form.html) */
  document.addEventListener("ds:sideform-ready", attachAll);

})();
