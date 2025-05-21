const app = document.getElementById("app");


const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'style.css';
document.head.appendChild(link);

function renderLoginPage() {
  app.innerHTML = `
    <div class="login-container" role="main">
      <h1>${translations["en"].citizenWelcome}</h1>
      
      <div class="login-tabs" role="tablist">
        <button class="tab-btn active" data-tab="user" role="tab" aria-selected="true" aria-controls="userLoginForm">
          Citizen Login
        </button>
        <button class="tab-btn" data-tab="admin" role="tab" aria-selected="false" aria-controls="adminLoginForm">
          Admin Login
        </button>
      </div>
      
      <div id="userLoginForm" class="login-form active" role="tabpanel" aria-labelledby="userTab">
        <form id="userLogin" novalidate>
          <div class="form-group">
            <label for="userEmail">Email Address</label>
            <input 
              type="email" 
              id="userEmail" 
              name="email" 
              required 
              autocomplete="email"
              placeholder="Enter name@example.com"
              aria-required="true"
            >
            <div class="error-message" id="userEmailError"></div>
          </div>
          <div class="form-group">
            <label for="userPassword">Password</label>
            <input 
              type="password" 
              id="userPassword" 
              name="password" 
              required 
              autocomplete="current-password"
              placeholder="min. 6 characters"
              aria-required="true"
              minlength="6"
            >
            <div class="error-message" id="userPasswordError"></div>
          </div>
          <button type="submit" aria-label="Login as Citizen">
            Login as Citizen
          </button>
        </form>
      </div>

      <div id="adminLoginForm" class="login-form" role="tabpanel" aria-labelledby="adminTab" hidden>
        <form id="adminLogin" novalidate>
          <div class="form-group">
            <label for="adminEmail">Admin Email</label>
            <input 
              type="email" 
              id="adminEmail" 
              name="email" 
              required 
              autocomplete="email"
              placeholder="Enter admin@grampanchayat.gov.in"
              aria-required="true"
            >
            <div class="error-message" id="adminEmailError"></div>
          </div>
          <div class="form-group">
            <label for="adminPassword">Admin Password</label>
            <input 
              type="password" 
              id="adminPassword" 
              name="password" 
              required 
              autocomplete="current-password"
              placeholder="min. 6 characters"
              aria-required="true"
              minlength="6"
            >
            <div class="error-message" id="adminPasswordError"></div>
          </div>
          <button type="submit" aria-label="Login as Admin">
            Login as Admin
          </button>
        </form>
      </div>

      <div id="message" role="alert" aria-live="polite"></div>
      
      <div class="language-selector">
        <label for="language">Select Language</label>
        <select id="language" aria-label="Select your preferred language">
          <option value="en">English</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
      </div>
    </div>
  `;

  const message = document.getElementById("message");
  const languageSelect = document.getElementById("language");
  const tabButtons = document.querySelectorAll('.tab-btn');
  const loginForms = document.querySelectorAll('.login-form');

  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.dataset.tab;
      tabButtons.forEach(btn => btn.classList.remove('active'));
      loginForms.forEach(form => {
        form.classList.remove('active');
        form.hidden = true;
      });
      button.classList.add('active');
      const activeForm = document.getElementById(`${tab}LoginForm`);
      activeForm.classList.add('active');
      activeForm.hidden = false;
    });
  });

  
  function validateEmail(email, isAdmin = false) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    if (isAdmin && !email.endsWith('@grampanchayat.gov.in')) {
      return false;
    }
    return true;
  }

  function showError(element, message) {
    const formGroup = element.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    formGroup.classList.add('error');
    errorElement.textContent = message;
    element.focus();
  }

  function clearError(element) {
    const formGroup = element.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    formGroup.classList.remove('error');
    errorElement.textContent = '';
  }

  
  const userForm = document.getElementById("userLogin");
  const userEmail = document.getElementById("userEmail");
  const userPassword = document.getElementById("userPassword");

  userForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const lang = languageSelect.value;
    let isValid = true;

    
    clearError(userEmail);
    clearError(userPassword);

    
    if (!userEmail.value.trim()) {
      showError(userEmail, translations[lang]?.requiredEmail || "Email is required");
      isValid = false;
    } else if (!validateEmail(userEmail.value)) {
      showError(userEmail, translations[lang]?.invalidEmail);
      isValid = false;
    }

    
    if (!userPassword.value.trim()) {
      showError(userPassword, translations[lang]?.requiredPassword || "Password is required");
      isValid = false;
    } else if (userPassword.value.length < 6) {
      showError(userPassword, translations[lang]?.invalidPassword);
      isValid = false;
    }

    if (isValid) {
      message.innerHTML = "<span>🔄 Logging in...</span>";
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "citizen");
        localStorage.setItem("userEmail", userEmail.value);
        localStorage.setItem("language", lang);
        renderServicesPage("citizen");
      }, 1000);
    }
  });

  
  const adminForm = document.getElementById("adminLogin");
  const adminEmail = document.getElementById("adminEmail");
  const adminPassword = document.getElementById("adminPassword");

  adminForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const lang = languageSelect.value;
    let isValid = true;

    
    clearError(adminEmail);
    clearError(adminPassword);

    
    if (!adminEmail.value.trim()) {
      showError(adminEmail, translations[lang]?.requiredEmail || "Email is required");
      isValid = false;
    } else if (!validateEmail(adminEmail.value, true)) {
      showError(adminEmail, translations[lang]?.invalidAdminEmail);
      isValid = false;
    }

    
    if (!adminPassword.value.trim()) {
      showError(adminPassword, translations[lang]?.requiredPassword || "Password is required");
      isValid = false;
    } else if (adminPassword.value.length < 6) {
      showError(adminPassword, translations[lang]?.invalidPassword);
      isValid = false;
    }

    if (isValid) {
      message.innerHTML = "<span>🔄 Logging in...</span>";
      setTimeout(() => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", adminEmail.value);
        localStorage.setItem("language", lang);
        renderServicesPage("admin");
      }, 1000);
    }
  });

  
  [userEmail, userPassword, adminEmail, adminPassword].forEach(input => {
    input.addEventListener('input', function () {
      clearError(this);
    });
  });

  
  languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;

    
    const heading = document.querySelector('.login-container h1');
    const activeForm = document.querySelector('.login-form.active');
    heading.innerText = activeForm.id === 'userLoginForm'
      ? translations[lang]?.citizenWelcome || translations["en"].citizenWelcome
      : translations[lang]?.adminWelcome || translations["en"].adminWelcome;


    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons[0].textContent = translations[lang]?.citizenTab || "Citizen Login";
    tabButtons[1].textContent = translations[lang]?.adminTab || "Admin Login";

    
    const userForm = document.getElementById("userLogin");
    const adminForm = document.getElementById("adminLogin");

    
    userForm.querySelector('label[for="userEmail"]').textContent = translations[lang]?.emailLabel || "Email Address";
    userForm.querySelector('label[for="userPassword"]').textContent = translations[lang]?.passwordLabel || "Password";
    userForm.querySelector('#userEmail').placeholder = translations[lang]?.emailPlaceholder || "Enter name@example.com";
    userForm.querySelector('#userPassword').placeholder = translations[lang]?.passwordPlaceholder || "min. 6 characters";
    userForm.querySelector('button[type="submit"]').textContent = translations[lang]?.citizenLoginButton || "Login as Citizen";

    
    adminForm.querySelector('label[for="adminEmail"]').textContent = translations[lang]?.adminEmailLabel || "Admin Email";
    adminForm.querySelector('label[for="adminPassword"]').textContent = translations[lang]?.adminPasswordLabel || "Admin Password";
    adminForm.querySelector('#adminEmail').placeholder = translations[lang]?.adminEmailPlaceholder || "Enter admin@grampanchayat.gov.in";
    adminForm.querySelector('#adminPassword').placeholder = translations[lang]?.passwordPlaceholder || "min. 6 characters";
    adminForm.querySelector('button[type="submit"]').textContent = translations[lang]?.adminLoginButton || "Login as Admin";

    
    document.querySelector('.language-selector label').textContent = translations[lang]?.languageLabel || "Select Language";

    
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
      if (error.textContent) {
        const field = error.id.replace('Error', '');
        if (field.includes('Email')) {
          error.textContent = translations[lang]?.invalidEmail || translations["en"].invalidEmail;
        } else if (field.includes('Password')) {
          error.textContent = translations[lang]?.invalidPassword || translations["en"].invalidPassword;
        }
      }
    });

    
    const messageDiv = document.getElementById('message');
    if (messageDiv.textContent) {
      if (messageDiv.textContent.includes('✅')) {
        messageDiv.textContent = translations[lang]?.loginSuccess || translations["en"].loginSuccess;
      } else if (messageDiv.textContent.includes('❌')) {
        messageDiv.textContent = translations[lang]?.loginFail || translations["en"].loginFail;
      }
    }
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
      ? `<div class="admin-section">
          <h2>Citizen Applications</h2>
          <div id="adminUserList"></div>
          <div id="adminData"></div>
        </div>`
      : `<div class="services-container">
          <div class="services-section">
            <h2>Apply for Services</h2>
            <div class="services-dropdown">
              <select id="services">
                <option value="" disabled selected>Select a service</option>
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
            </div>
            <button id="applyButton">Apply</button>
            <div id="applicationMessage"></div>
          </div>
          <div class="history-section">
            <h3>Application History</h3>
            <ul id="applicationHistory"></ul>
            <button id="downloadBtn">⬇️ Download as PDF</button>
          </div>
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
      li.setAttribute("data-status", app.status);
      li.innerHTML = `
        <div class="application-info">
          <strong>${app.service}</strong>
          <span class="application-time">${app.time}</span>
        </div>
        <span class="application-status">${app.status}</span>
      `;
      appHistoryList.appendChild(li);
    });

    applyButton.addEventListener("click", function () {
      const selectedService = document.getElementById("services").value;
      if (!selectedService) {
        applicationMessage.textContent = "Please select a service first";
        return;
      }

      const entry = {
        service: selectedService,
        time: new Date().toLocaleString(),
        status: "Pending"
      };

      allApps[email].push(entry);
      localStorage.setItem("allApplications", JSON.stringify(allApps));

      const li = document.createElement("li");
      li.setAttribute("data-status", entry.status);
      li.innerHTML = `
        <div class="application-info">
          <strong>${entry.service}</strong>
          <span class="application-time">${entry.time}</span>
        </div>
        <span class="application-status">${entry.status}</span>
      `;
      appHistoryList.appendChild(li);
      applicationMessage.textContent = translations[lang].applicationSubmitted(entry.service);

      
      document.getElementById("services").value = "";
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
    const adminUserList = document.getElementById("adminUserList");
    const adminDataDiv = document.getElementById("adminData");
    adminUserList.innerHTML = "";
    adminDataDiv.innerHTML = "";
    
    Object.keys(allApps).forEach(user => {
      const btn = document.createElement("button");
      btn.className = "admin-user-btn";
      btn.textContent = user;
      btn.onclick = () => {
        
        document.querySelectorAll('.admin-user-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      
        adminDataDiv.innerHTML = '';
        if (!allApps[user] || allApps[user].length === 0) {
          adminDataDiv.innerHTML = '<div style="padding:1.5rem; color:#888;">No applications found for this user.</div>';
          return;
        }
        const section = document.createElement("div");
        section.className = "admin-applications-faq";
        allApps[user].forEach((app, index) => {
          
          const faqItem = document.createElement("div");
          faqItem.className = "faq-item";
          const question = document.createElement("button");
          question.className = "faq-question";
          
          let statusBadge;
          if (app.status === "Pending") {
            statusBadge = document.createElement("button");
            statusBadge.className = "faq-status pending faq-status-btn";
            statusBadge.textContent = "Pending (Click to Approve)";
            statusBadge.onclick = (e) => {
              e.stopPropagation();
              allApps[user][index].status = "Approved";
              localStorage.setItem("allApplications", JSON.stringify(allApps));
              statusBadge.textContent = "Approved";
              statusBadge.className = "faq-status approved";
              statusBadge.disabled = true;
            };
          } else {
            statusBadge = document.createElement("span");
            statusBadge.className = `faq-status ${app.status.toLowerCase()}`;
            statusBadge.textContent = app.status;
          }
          question.innerHTML = `<span><strong>${app.service}</strong></span>`;
          question.appendChild(statusBadge);
          const answer = document.createElement("div");
          answer.className = "faq-answer";
          answer.innerHTML = `<div><strong>Applied On:</strong> ${app.time}</div>`;
          answer.style.display = "none";
          question.onclick = (e) => {
            
            if (e.target === statusBadge && app.status === "Pending") return;
            answer.style.display = answer.style.display === "none" ? "block" : "none";
          };
          faqItem.appendChild(question);
          faqItem.appendChild(answer);
          section.appendChild(faqItem);
        });
        adminDataDiv.appendChild(section);
      };
      adminUserList.appendChild(btn);
    });
  }
}

const translations = {
  en: {
    welcome: "Welcome to Digital E Gram Panchayat",
    citizenWelcome: "Welcome to Digital E Gram Panchayat - Citizen Portal",
    adminWelcome: "Welcome to Digital E Gram Panchayat - Admin Portal",
    loginSuccess: "✅ Login Successful!",
    loginFail: "❌ Invalid Credentials!",
    applicationSubmitted: (service) => `✅ Application for ${service} submitted!`,
    invalidEmail: "Please enter a valid email address",
    invalidAdminEmail: "Please enter a valid admin email address",
    invalidPassword: "Password must be at least 6 characters long",
    requiredEmail: "Email address is required",
    requiredPassword: "Password is required",
    citizenTab: "Citizen Login",
    adminTab: "Admin Login",
    emailLabel: "Email Address",
    passwordLabel: "Password",
    emailPlaceholder: "Enter name@example.com",
    passwordPlaceholder: "min. 6 characters",
    citizenLoginButton: "Login as Citizen",
    adminEmailLabel: "Admin Email",
    adminPasswordLabel: "Admin Password",
    adminEmailPlaceholder: "Enter admin@grampanchayat.gov.in",
    adminLoginButton: "Login as Admin",
    languageLabel: "Select Language"
  },
  te: {
    welcome: "డిజిటల్ ఈ గ్రామ పంచాయతీకి స్వాగతం",
    citizenWelcome: "డిజిటల్ ఈ గ్రామ పంచాయతీకి స్వాగతం - పౌర పోర్టల్",
    adminWelcome: "డిజిటల్ ఈ గ్రామ పంచాయతీకి స్వాగతం - అడ్మిన్ పోర్టల్",
    loginSuccess: "✅ లాగిన్ విజయవంతం!",
    loginFail: "❌ లాగిన్ విఫలమైంది!",
    applicationSubmitted: (service) => `✅ ${service} కొరకు దరఖాస్తు సమర్పించబడింది!`,
    invalidEmail: "దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను నమోదు చేయండి",
    invalidAdminEmail: "దయచేసి చెల్లుబాటు అయ్యే అడ్మిన్ ఇమెయిల్ చిరునామాను నమోదు చేయండి",
    invalidPassword: "పాస్‌వర్డ్ కనీసం 6 అక్షరాల పొడవు ఉండాలి",
    requiredEmail: "ఇమెయిల్ చిరునామా అవసరం",
    requiredPassword: "పాస్‌వర్డ్ అవసరం",
    citizenTab: "పౌర లాగిన్",
    adminTab: "అడ్మిన్ లాగిన్",
    emailLabel: "ఇమెయిల్ చిరునామా",
    passwordLabel: "పాస్‌వర్డ్",
    emailPlaceholder: "ఇమెయిల్ చిరునామాను నమోదు చేయండి",
    passwordPlaceholder: "కనీసం 6 అక్షరాలు",
    citizenLoginButton: "పౌరునిగా లాగిన్",
    adminEmailLabel: "అడ్మిన్ ఇమెయిల్",
    adminPasswordLabel: "అడ్మిన్ పాస్‌వర్డ్",
    adminEmailPlaceholder: "అడ్మిన్ ఇమెయిల్ చిరునామాను నమోదు చేయండి",
    adminLoginButton: "అడ్మిన్‌గా లాగిన్",
    languageLabel: "భాషను ఎంచుకోండి"
  },
  hi: {
    welcome: "डिजिटल ई ग्राम पंचायत में आपका स्वागत है",
    citizenWelcome: "डिजिटल ई ग्राम पंचायत में आपका स्वागत है - नागरिक पोर्टल",
    adminWelcome: "डिजिटल ई ग्राम पंचायत में आपका स्वागत है - प्रशासक पोर्टल",
    loginSuccess: "✅ लॉगिन सफल!",
    loginFail: "❌ लॉगिन विफल!",
    applicationSubmitted: (service) => `✅ ${service} के लिए आवेदन सबमिट किया गया!`,
    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
    invalidAdminEmail: "कृपया एक वैध प्रशासक ईमेल पता दर्ज करें",
    invalidPassword: "पासवर्ड कम से कम 6 अक्षर लंबा होना चाहिए",
    requiredEmail: "ईमेल पता आवश्यक है",
    requiredPassword: "पासवर्ड आवश्यक है",
    citizenTab: "नागरिक लॉगिन",
    adminTab: "प्रशासक लॉगिन",
    emailLabel: "ईमेल पता",
    passwordLabel: "पासवर्ड",
    emailPlaceholder: "ईमेल पता दर्ज करें",
    passwordPlaceholder: "कम से कम 6 अक्षर",
    citizenLoginButton: "नागरिक के रूप में लॉगिन",
    adminEmailLabel: "प्रशासक ईमेल",
    adminPasswordLabel: "प्रशासक पासवर्ड",
    adminEmailPlaceholder: "प्रशासक ईमेल पता दर्ज करें",
    adminLoginButton: "प्रशासक के रूप में लॉगिन",
    languageLabel: "भाषा चुनें"
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
