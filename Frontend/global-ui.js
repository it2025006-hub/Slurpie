document.addEventListener("DOMContentLoaded", () => {

    // 1. INJECT GLOBAL STYLESHEET IF NOT ALREADY THERE
    if (!document.querySelector('link[href="global-ui.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "global-ui.css";
        document.head.appendChild(link);
    }

    // 2. INJECT BACK BUTTON (Except on index and home)
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "index.html" && currentPage !== "home.html" && currentPage !== "") {
        const backBtn = document.createElement("button");
        backBtn.className = "global-back-btn";
        backBtn.innerHTML = "⬅️ Back";
        backBtn.onclick = () => window.history.back();
        document.body.appendChild(backBtn);
    }

    // 3. INJECT CHATBOT HTML
    const chatHtml = `
        <div class="ai-chat-btn" id="globalChatBtn">🤖</div>
        <div id="aiChat" class="ai-chatbox">
            <div class="ai-header">
                🤍 Slurpie Assistant
                <span id="closeChatBtn">✖</span>
            </div>
            <div id="aiMessages" class="ai-messages"></div>
            <div class="ai-input">
                <input type="text" id="aiInput" placeholder="Ask me anything..." onkeypress="handleChatEnter(event)">
                <button id="sendChatBtn">Send</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", chatHtml);

    // 4. CHAT HISTORY LOGIC
    const chatBtn = document.getElementById("globalChatBtn");
    const chatBox = document.getElementById("aiChat");
    const closeBtn = document.getElementById("closeChatBtn");
    const messagesDiv = document.getElementById("aiMessages");
    const inputField = document.getElementById("aiInput");
    const sendBtn = document.getElementById("sendChatBtn");

    let chatHistory = JSON.parse(localStorage.getItem("slurpieChatHistory")) || [
        { role: "bot", text: "Hi! 👋 How can I help you today?" }
    ];

    function renderHistory() {
        messagesDiv.innerHTML = "";
        chatHistory.forEach(msg => {
            const div = document.createElement("div");
            div.className = msg.role === "user" ? "ai-user" : "ai-bot";
            div.innerHTML = msg.text.replace(/\n/g, "<br>");
            messagesDiv.appendChild(div);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // Bind Toggle
    function toggleChat() {
        if (chatBox.style.display === "flex") {
            chatBox.style.display = "none";
        } else {
            chatBox.style.display = "flex";
            renderHistory();
        }
    }

    chatBtn.onclick = toggleChat;
    closeBtn.onclick = toggleChat;

    // Send logic
    window.handleChatEnter = function(e) {
        if (e.key === "Enter") sendMessage();
    }
    sendBtn.onclick = sendMessage;

    function sendMessage() {
        const msg = inputField.value.trim();
        if (!msg) return;

        // Save and render user message
        chatHistory.push({ role: "user", text: msg });
        localStorage.setItem("slurpieChatHistory", JSON.stringify(chatHistory));
        inputField.value = "";
        renderHistory();

        // Show typing indicator
        const typingDiv = document.createElement("div");
        typingDiv.className = "ai-bot";
        typingDiv.textContent = "typing...";
        messagesDiv.appendChild(typingDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Fetch API
        fetch("http://localhost:5000/api/chat/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        })
        .then(res => res.json())
        .then(data => {
            messagesDiv.removeChild(typingDiv);
            chatHistory.push({ role: "bot", text: data.reply });
            localStorage.setItem("slurpieChatHistory", JSON.stringify(chatHistory));
            renderHistory();
        })
        .catch(err => {
            messagesDiv.removeChild(typingDiv);
            chatHistory.push({ role: "bot", text: "Sorry, I lost connection! Please try again." });
            localStorage.setItem("slurpieChatHistory", JSON.stringify(chatHistory));
            renderHistory();
        });
    }

});
