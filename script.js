const app = document.getElementById("app");
app.innerHTML = `
    <h1>Welcome to Digital E Gram Panchayat</h1>
    <form id="loginForm">
        <label for="email">Email:</label>
        <input type="email" id="email" required>
        <label for="password">Password:</label>
        <input type="password" id="password" required>
        <button type="submit">Login</button>
    </form>
    <div id="message"></div>
    <div id="servicesSection" style="display:none">
        <h2>Apply for Services</h2>
        <select id="services">
            <option value="Water Connection">Water Connection</option>
            <option value="Electricity Connection">Electricity Connection</option>
            <option value="House Construction Permission">House Construction Permission</option>
        </select>
        <button id="applyButton">Apply</button>
        <div id="applicationMessage"></div>
        <h3>Application History</h3>
        <ul id="applicationHistory"></ul>
    </div>
    <div>
        <label for="language">Choose Language:</label>
        <select id="language">
            <option value="en">English</option>
            <option value="te">Telugu</option>
            <option value="hi">Hindi</option>
        </select>
    </div>
`;

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const servicesSection = document.getElementById("servicesSection");
const languageSelect = document.getElementById("language");
const appHistoryList = document.getElementById("applicationHistory");

// Language support
const translations = {
    en: {
        welcome: "Welcome to Digital E Gram Panchayat",
        loginSuccess: "✅ Login Successful!",
        loginFail: "❌ Invalid Credentials!",
        applicationSubmitted: (service) => `✅ Application for ${service} submitted!`
    },
    te: {
        welcome: "డిజిటల్ ఈ గ్రామ పంచాయతీకి స్వాగతం",
        loginSuccess: "✅ లాగిన్ విజయవంతం!",
        loginFail: "❌ లాగిన్ విఫలమైంది!",
        applicationSubmitted: (service) => `✅ ${service} కొరకు దరఖాస్తు సమర్పించబడింది!`
    },
    hi: {
        welcome: "डिजिटल ई ग्राम पंचायत में आपका स्वागत है",
        loginSuccess: "✅ लॉगिन सफल!",
        loginFail: "❌ लॉगिन विफल!",
        applicationSubmitted: (service) => `✅ ${service} के लिए आवेदन सबमिट किया गया!`
    }
};

function updateLanguage(lang) {
    document.querySelector("h1").innerText = translations[lang].welcome;
    if (localStorage.getItem("isLoggedIn")) {
        message.innerText = translations[lang].loginSuccess;
    }
}

languageSelect.addEventListener("change", () => {
    updateLanguage(languageSelect.value);
});

// Login functionality with spinner and localStorage
loginForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const lang = languageSelect.value;

    message.innerHTML = "<span>🔄 Logging in...</span>";
    setTimeout(() => {
        if (email === "test@example.com" && password.length >= 8) {
            localStorage.setItem("isLoggedIn", "true");
            message.innerText = translations[lang].loginSuccess;
            message.style.color = "green";
            servicesSection.style.display = "block";
        } else {
            message.innerText = translations[lang].loginFail;
            message.style.color = "red";
        }
    }, 1000);
});

// Service application
const applyButton = document.getElementById("applyButton");
const applicationMessage = document.getElementById("applicationMessage");

applyButton.addEventListener("click", function() {
    const selectedService = document.getElementById("services").value;
    const lang = languageSelect.value;
    const msg = translations[lang].applicationSubmitted(selectedService);

    applicationMessage.innerText = msg;
    applicationMessage.style.color = "green";

    const li = document.createElement("li");
    li.innerText = `${selectedService} - ${new Date().toLocaleString()}`;
    appHistoryList.appendChild(li);
});

// Maintain login on refresh (mock)
window.onload = () => {
    const lang = languageSelect.value;
    if (localStorage.getItem("isLoggedIn")) {
        servicesSection.style.display = "block";
        message.innerText = translations[lang].loginSuccess;
        message.style.color = "green";
    }
};
