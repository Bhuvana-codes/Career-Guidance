// --- Cozy Modal Function (if not already defined globally) ---
function showCozyModal(title, message) {
  // Remove any existing modal
  const existing = document.querySelector('.popup-modal-bg');
  if (existing) existing.remove();

  const bg = document.createElement('div');
  bg.className = 'popup-modal-bg';

  const box = document.createElement('div');
  box.className = 'popup-modal';

  const t = document.createElement('div');
  t.className = 'modal-title';
  t.textContent = title;
  box.appendChild(t);

  const msg = document.createElement('div');
  msg.innerHTML = message;
  box.appendChild(msg);

  const btn = document.createElement('button');
  btn.className = 'modal-btn';
  btn.textContent = 'Okay!';
  btn.onclick = () => bg.remove();
  box.appendChild(btn);

  bg.appendChild(box);
  document.body.appendChild(bg);
}

// --- Main Submit Handler ---
document.getElementById('recommendationForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Get checked interests/skills (for checkboxes)
  const interests = Array.from(document.querySelectorAll('input[name="interests_skills"]:checked')).map(cb => cb.value);

  if (interests.length === 0) {
    showCozyModal(
      "Oops! 🌰",
      "Please select <b>at least one</b> interest or skill before getting a recommendation.<br><span style='font-size:1.1em;color:#a47551;'>Let us know what you like—your career genie is listening!</span>"
    );
    return;
  }

  const interests_skills = interests.join(', ');
  const education_level = document.getElementById('education_level').value;

  try {
    const response = await fetch('/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ interests_skills, education_level })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    if (data.recommendations && data.recommendations.length > 0) {
      // Pass the entire recommendations array as a JSON string in the URL (encoded)
      const encodedData = encodeURIComponent(JSON.stringify(data.recommendations));
      window.location.href = `result.html?data=${encodedData}`;
    } else {
      window.location.href = `result.html?data=none`;
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    window.location.href = `result.html?data=error`;
  }
});