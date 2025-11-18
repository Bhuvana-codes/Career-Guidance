// Paste this file in your project folder and include it in your HTML (see instructions below)

const faqPairs = [
  { q: "How do I deactivate a user?", a: "Click the 'Deactivate' button in the Actions column for the user you want to deactivate." },
  { q: "How do I delete a user?", a: "Click the 'Delete' button in the Actions column. Confirm the popup to delete the user permanently." },
  { q: "How can I log out?", a: "Click the 'Logout' button at the bottom of the dashboard and confirm the popup." },
  { q: "What do the stats mean?", a: "Total Users is the number of users in the system, New (7d) is those who joined in the last week, and Active is the currently active users." },
  { q: "How do I add a new user?", a: "Currently, users can register themselves using the registration page." }
];

function createFAQChatbot() {
  // Chatbot button
  const chatBtn = document.createElement('button');
  chatBtn.innerText = '💬 FAQ';
  chatBtn.id = 'chatbot-btn';
  chatBtn.style.position = 'fixed';
  chatBtn.style.bottom = '28px';
  chatBtn.style.right = '34px';
  chatBtn.style.background = '#e0c9b1';
  chatBtn.style.color = '#5d432c';
  chatBtn.style.border = 'none';
  chatBtn.style.borderRadius = '18px';
  chatBtn.style.padding = '0.9em 2.2em';
  chatBtn.style.fontSize = '1.18em';
  chatBtn.style.fontWeight = 'bold';
  chatBtn.style.boxShadow = '0 4px 20px #7d5a4e22';
  chatBtn.style.cursor = 'pointer';
  chatBtn.style.zIndex = '9999';
  chatBtn.style.transition = 'background 0.18s, color 0.18s, box-shadow 0.18s';
  chatBtn.onmouseover = () => {
    chatBtn.style.background = '#bca89f';
    chatBtn.style.color = '#4e2e1e';
  };
  chatBtn.onmouseout = () => {
    chatBtn.style.background = '#e0c9b1';
    chatBtn.style.color = '#5d432c';
  };

  // Chatbot window
  const chatWin = document.createElement('div');
  chatWin.id = 'chatbot-window';
  chatWin.style.position = 'fixed';
  chatWin.style.bottom = '84px';
  chatWin.style.right = '38px';
  chatWin.style.width = '320px';
  chatWin.style.maxWidth = '95vw';
  chatWin.style.background = '#fffdf9';
  chatWin.style.border = '2px solid #bca89f';
  chatWin.style.borderRadius = '20px';
  chatWin.style.boxShadow = '0 6px 32px #bca89f60';
  chatWin.style.display = 'none';
  chatWin.style.flexDirection = 'column';
  chatWin.style.zIndex = '10000';
  chatWin.style.fontFamily = "'Segoe UI', 'Roboto', sans-serif";

  // Header
  const chatHeader = document.createElement('div');
  chatHeader.innerText = 'Cozy FAQ Chatbot';
  chatHeader.style.background = 'linear-gradient(90deg, #f9f6f1 70%, #f2c299)';
  chatHeader.style.color = '#7d5a4e';
  chatHeader.style.fontWeight = 'bold';
  chatHeader.style.fontSize = '1.15em';
  chatHeader.style.padding = '1em';
  chatHeader.style.borderTopLeftRadius = '18px';
  chatHeader.style.borderTopRightRadius = '18px';
  chatHeader.style.textAlign = 'center';

  // FAQ list
  const faqWrap = document.createElement('div');
  faqWrap.style.padding = '1em';
  faqWrap.style.flex = '1 1 auto';
  faqWrap.style.overflowY = 'auto';
  faqWrap.style.maxHeight = '270px';

  faqPairs.forEach((pair, idx) => {
    const qBtn = document.createElement('button');
    qBtn.innerText = pair.q;
    qBtn.style.background = '#f5ede6';
    qBtn.style.color = '#7d5a4e';
    qBtn.style.padding = '0.7em 1em';
    qBtn.style.margin = '0.2em 0';
    qBtn.style.width = '100%';
    qBtn.style.textAlign = 'left';
    qBtn.style.border = 'none';
    qBtn.style.borderRadius = '8px';
    qBtn.style.fontSize = '1em';
    qBtn.style.cursor = 'pointer';
    qBtn.style.transition = 'background 0.16s';
    qBtn.onmouseover = () => qBtn.style.background = '#f2c299';
    qBtn.onmouseout = () => qBtn.style.background = '#f5ede6';
    qBtn.onclick = () => {
      chatAnswer.innerHTML = `<b>Q:</b> ${pair.q}<br><b>A:</b> ${pair.a}`;
      chatAnswer.style.display = 'block';
    };
    faqWrap.appendChild(qBtn);
  });

  // Answer area
  const chatAnswer = document.createElement('div');
  chatAnswer.id = 'chatbot-answer';
  chatAnswer.style.background = '#f9f6f1';
  chatAnswer.style.color = '#4e2e1e';
  chatAnswer.style.margin = '1em';
  chatAnswer.style.padding = '0.8em 1em';
  chatAnswer.style.borderRadius = '12px';
  chatAnswer.style.fontSize = '1.05em';
  chatAnswer.style.boxShadow = '0 2px 6px #bca89f33';
  chatAnswer.style.display = 'none';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerText = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '16px';
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '1.5em';
  closeBtn.style.color = '#7d5a4e';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => {
    chatWin.style.display = 'none';
    chatAnswer.style.display = 'none';
  };

  chatWin.appendChild(chatHeader);
  chatWin.appendChild(closeBtn);
  chatWin.appendChild(faqWrap);
  chatWin.appendChild(chatAnswer);
  document.body.appendChild(chatBtn);
  document.body.appendChild(chatWin);

  chatBtn.onclick = () => {
    chatWin.style.display = chatWin.style.display === 'none' ? 'flex' : 'none';
    chatAnswer.style.display = 'none';
  };
}

window.addEventListener('DOMContentLoaded', createFAQChatbot);