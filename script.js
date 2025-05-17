const app = document.getElementById("app");

function renderLoginPage() {
  app.innerHTML = `
    <h1>${translations["en"].welcome}</h1>
    <form id="loginForm">
      <label for="email">Email:</label>
      <input type="email" id="email" required>
      <label for="password">Password:</label>
      <input type="password" id="password" required>
      <button type="submit">Login</button>
    </form>
    <div id="message"></div>
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
  const languageSelect = document.getElementById("language");

  languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    document.querySelector("h1").innerText = translations[lang]?.welcome || translations["en"].welcome;
  });

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const lang = languageSelect.value;

    message.innerHTML = "<span>🔄 Logging in...</span>";
    setTimeout(() => {
      if (
        (email === "test@example.com" || email === "admin@example.com") &&
        password.length >= 8
      ) {
        const role = email === "admin@example.com" ? "admin" : "citizen";
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", role);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("language", lang);
        renderServicesPage(role);
      } else {
        message.innerText = translations[lang]?.loginFail || translations["en"].loginFail;
        message.style.color = "red";
      }
    }, 1000);
  });
}

function renderServicesPage(role) {
  const storedLang = localStorage.getItem("language");
  const lang = translations[storedLang] ? storedLang : "en";
  const isAdmin = role === "admin";

  app.innerHTML = `
    <div class="header">
      <h1>${translations[lang].welcome} (${role.toUpperCase()})</h1>
      <button id="logoutBtn">Logout</button>
    </div>
    ${isAdmin
      ? `<h2>Citizen Applications</h2><div id="adminData"></div>`
      : `
      <div id="servicesSection" >
        <h2>Apply for Services</h2>
        <select id="services" >
          <option value="Water Connection">Water Connection</option>
          <option value="Electricity Connection">Electricity Connection</option>
          <option value="House Construction Permission">House Construction Permission</option>
          <option value="Property Tax Payment">Property Tax Payment</option>
          <option value="Birth Certificate Request">Birth Certificate Request</option>
          <option value="Death Certificate Request">Death Certificate Request</option>
          <option value="Marriage Registration">Marriage Registration</option>
          <option value="Income Certificate">Income Certificate</option>
          <option value="Caste Certificate">Caste Certificate</option>
          <option value="Domicile Certificate">Domicile Certificate</option>
          <option value="Ration Card Application">Ration Card Application</option>
          <option value="Pension Scheme Enrollment">Pension Scheme Enrollment</option>
          <option value="Aadhar Card Update Request">Aadhar Card Update Request</option>
          <option value="Grievance Submission">Grievance Submission</option>
          <option value="Sanitation Service Request">Sanitation Service Request</option>
          <option value="Road Damage Complaint">Road Damage Complaint</option>
          <option value="Waste Collection Request">Waste Collection Request</option>
          <option value="Street Light Complaint">Street Light Complaint</option>
          <option value="New Land Registration">New Land Registration</option>
          <option value="Agricultural Subsidy Application">Agricultural Subsidy Application</option>
        </select>
        <button id="applyButton">Apply</button>
        <div id="applicationMessage"></div>
        <h3>Application History</h3>
        <ul id="applicationHistory"></ul>
        <button id="downloadBtn">⬇️ Download as PDF</button>
      </div>`
    }
  `;

  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("language");

    renderLoginPage();
  });

  const allApps = JSON.parse(localStorage.getItem("allApplications")) || {};

  if (!isAdmin) {
    const email = localStorage.getItem("userEmail");
    const applyButton = document.getElementById("applyButton");
    const applicationMessage = document.getElementById("applicationMessage");
    const appHistoryList = document.getElementById("applicationHistory");
    const downloadBtn = document.getElementById("downloadBtn");

    if (!allApps[email]) allApps[email] = [];

    allApps[email].forEach(app => {
      const li = document.createElement("li");
      li.textContent = `${app.service} - ${app.time} [${app.status}]`;
      appHistoryList.appendChild(li);
    });

    applyButton.addEventListener("click", function () {
      const selectedService = document.getElementById("services").value;
      const entry = {
        service: selectedService,
        time: new Date().toLocaleString(),
        status: "Pending"
      };

      allApps[email].push(entry);
      localStorage.setItem("allApplications", JSON.stringify(allApps));

      const li = document.createElement("li");
      li.textContent = `${entry.service} - ${entry.time} [${entry.status}]`;
      appHistoryList.appendChild(li);
      applicationMessage.textContent = translations[lang].applicationSubmitted(entry.service);
    });

    downloadBtn.addEventListener("click", async function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("E-Gram Panchayat - Application History", 20, 20);

      let y = 30;
      allApps[email].forEach((entry, i) => {
        doc.text(`${i + 1}. ${entry.service} - ${entry.time} [${entry.status}]`, 20, y);
        y += 10;
      });

      doc.save("My_Applications.pdf");
    });
  } else {
    const adminDataDiv = document.getElementById("adminData");
    adminDataDiv.innerHTML = "";

    for (const user in allApps) {
      const section = document.createElement("div");
      section.style.marginBottom = "1.5rem";

      const title = document.createElement("h3");
      title.textContent = `👤 ${user}`;
      section.appendChild(title);

      const ul = document.createElement("ul");
      ul.style.listStyle = "none";
      ul.style.paddingLeft = "0";

      allApps[user].forEach((app, index) => {
        const li = document.createElement("li");
        li.textContent = `${app.service} - ${app.time} [${app.status}]`;
        li.style.background = "#ecf0f1";
        li.style.marginBottom = "5px";
        li.style.padding = "0.5rem";
        li.style.borderRadius = "5px";
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";

        if (app.status === "Pending") {
          const btn = document.createElement("button");
          btn.textContent = "Approve ✅";
          btn.style.marginLeft = "1rem";
          btn.style.padding = "0.2rem 0.5rem";
          btn.onclick = () => {
            allApps[user][index].status = "Approved";
            localStorage.setItem("allApplications", JSON.stringify(allApps));
            renderServicesPage("admin");
          };
          li.appendChild(btn);
        }

        ul.appendChild(li);
      });

      section.appendChild(ul);
      adminDataDiv.appendChild(section);
    }
  }
}

const translations = {
  en: {
    welcome: "Welcome to Digital E Gram Panchayat",
    loginSuccess: "✅ Login Successful!",
    loginFail: "❌ Invalid Credentials!",
    applicationSubmitted: (service) => `✅ Application for ${service} submitted!`,
  },
  te: {
    welcome: "డిజిటల్ ఈ గ్రామ పంచాయతీకి స్వాగతం",
    loginSuccess: "✅ లాగిన్ విజయవంతం!",
    loginFail: "❌ లాగిన్ విఫలమైంది!",
    applicationSubmitted: (service) => `✅ ${service} కొరకు దరఖాస్తు సమర్పించబడింది!`,
  },
  hi: {
    welcome: "डिजिटल ई ग्राम पंचायत में आपका स्वागत है",
    loginSuccess: "✅ लॉगिन सफल!",
    loginFail: "❌ लॉगिन विफल!",
    applicationSubmitted: (service) => `✅ ${service} के लिए आवेदन सबमिट किया गया!`,
  },
};

window.onload = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("userRole");
  if (isLoggedIn && role) {
    renderServicesPage(role);
  } else {
    renderLoginPage();
  }
};

window.addEventListener("beforeunload", () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("language");
});
