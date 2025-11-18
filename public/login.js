function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function isStrongPassword(password) {
  return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
}

// Unique/cute messages
const cuteMessages = {
  email: "📧 Oopsie! This email portal isn’t open yet. Try a real one like star@example.com ✨",
  password: "🗝️ Secret key needs to be at least 6 characters, with a blend of letters and numbers!"
};

function showFieldError(fieldId, message) {
  const errorDiv = document.getElementById(fieldId + "Error");
  const prevMsg = errorDiv.getAttribute("data-last") || "";
  errorDiv.innerHTML = `<span class="input-error"><i class="fa fa-star"></i> ${message}</span>`;
  errorDiv.setAttribute("data-last", message);

  // Shake only on new error
  const errorEl = errorDiv.querySelector('.input-error');
  if (prevMsg !== message && errorEl) {
    errorEl.classList.add("shake");
    errorEl.addEventListener("animationend", () => errorEl.classList.remove("shake"), { once: true });
  }
}
function clearFieldError(fieldId) {
  const errorDiv = document.getElementById(fieldId + "Error");
  errorDiv.innerHTML = "";
  errorDiv.setAttribute("data-last", "");
}

document.getElementById("email").addEventListener("blur", function() {
  if (this.value.trim().length > 0 && !isValidEmail(this.value.trim())) {
    showFieldError("email", cuteMessages.email);
  } else {
    clearFieldError("email");
  }
});
document.getElementById("password").addEventListener("blur", function() {
  if (this.value.trim().length > 0 && !isStrongPassword(this.value)) {
    showFieldError("password", cuteMessages.password);
  } else {
    clearFieldError("password");
  }
});
document.getElementById("email").addEventListener("input", function() {
  if (isValidEmail(this.value.trim())) clearFieldError("email");
});
document.getElementById("password").addEventListener("input", function() {
  if (isStrongPassword(this.value)) clearFieldError("password");
});

// Form submit handler
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  let valid = true;
  if (email.length === 0 || !isValidEmail(email)) {
    showFieldError("email", cuteMessages.email);
    document.getElementById("email").focus();
    valid = false;
  }
  if (!isStrongPassword(password)) {
    showFieldError("password", cuteMessages.password);
    if (valid) document.getElementById("password").focus();
    valid = false;
  }
  if (!valid) return;

  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = '';

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.status === 200) {
      messageDiv.innerHTML = `<div class="success-message"> Welcome back, <b>${data.name}</b>! Redirecting to your journey...</div>`;
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1500);
    } else {
      messageDiv.innerHTML = `<div class="error-message">${data.error || "Login failed."}</div>`;
    }
  } catch (err) {
    messageDiv.innerHTML = '<div class="error-message">Something went wrong. Please try again.</div>';
  }
});