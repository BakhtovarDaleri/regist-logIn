// Переключение между вкладками (Телефон / Email)

function switchTab(tab) {
  console.log("Switching tab to:", tab);

  // Скрываем все секции в форме регистрации
  document.getElementById("phoneSection").classList.add("hidden");
  document.getElementById("emailSection").classList.add("hidden");

  // Скрываем все секции в форме входа
  document.getElementById("authPhoneSection").classList.add("hidden");
  document.getElementById("authEmailSection").classList.add("hidden");

  // Убираем активный класс у всех вкладок
  document
    .querySelectorAll(".tab")
    .forEach((tabElement) => tabElement.classList.remove("active"));

  // Показываем нужную секцию и активируем вкладку
  if (tab === "phone") {
    document.getElementById("phoneSection").classList.remove("hidden");
    document.getElementById("authPhoneSection").classList.remove("hidden");
    document
      .querySelector(".tab[onclick=\"switchTab('phone')\"]")
      .classList.add("active");
    document.getElementById("phone").setAttribute("required", "true");
    document.getElementById("email").removeAttribute("required");
    document.getElementById("authPhone").setAttribute("required", "true");
    document.getElementById("authEmail").removeAttribute("required");
  } else if (tab === "email") {
    document.getElementById("emailSection").classList.remove("hidden");
    document.getElementById("authEmailSection").classList.remove("hidden");
    document
      .querySelector(".tab[onclick=\"switchTab('email')\"]")
      .classList.add("active");
    document.getElementById("email").setAttribute("required", "true");
    document.getElementById("phone").removeAttribute("required");
    document.getElementById("authEmail").setAttribute("required", "true");
    document.getElementById("authPhone").removeAttribute("required");
  }
}

// Функция для отображения или скрытия пароля
function togglePassword(event) {
  const passwordField = event.target.previousElementSibling; // Получаем инпут перед иконкой 👁

  if (passwordField.type === "password") {
    passwordField.type = "text";
    event.target.textContent = "👁"; // Глаз открыт
  } else {
    passwordField.type = "password";
    event.target.textContent = "👁"; // Глаз закрыт
  }
}

// Валидация пароля (не менее 6 латинских букв)
document.getElementById("password").addEventListener("input", function () {
  const passwordField = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");
  const passwordValue = passwordField.value;
  const regex = /^[A-Za-z]{6,}$/;

  if (!regex.test(passwordValue)) {
    errorMessage.style.display = "block";
    passwordField.setCustomValidity(
      "Пароль должен содержать не менее 6 латинских букв."
    );
  } else {
    errorMessage.style.display = "none";
    passwordField.setCustomValidity("");
  }
});

// Функция для регистрации
function register(event) {
  event.preventDefault(); // Предотвращаем отправку формы, если она есть

  const phoneField = document.getElementById("phone");
  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");
  const currencySelect = document.getElementById("currencySelect");
  const agreementField = document.getElementById("agreement");
  const activeTabElement = document.querySelector(".tab.active");

  // Проверяем, что активная вкладка существует
  if (!activeTabElement) {
    alert("Пожалуйста, выберите способ регистрации.");
    return;
  }

  const activeTab = activeTabElement.textContent.trim(); // Получаем текст активной вкладки

  // Сбрасываем атрибут required перед проверкой
  phoneField.removeAttribute("required");
  emailField.removeAttribute("required");

  // Добавляем required только к активному полю
  if (activeTab === "Телефон") {
    phoneField.setAttribute("required", "true");

    // Получаем код страны
    const countryCode = document.querySelector("select").value; // Или другой способ получения кода

    // Добавляем код страны, если его нет в поле ввода
    let fullPhoneNumber = phoneField.value.trim();
    if (!fullPhoneNumber.startsWith("+")) {
      fullPhoneNumber = countryCode + fullPhoneNumber;
    }

    // Регулярное выражение для проверки телефона
    const phonePattern =
      /^\+?\d{1,4}[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

    if (!phonePattern.test(fullPhoneNumber)) {
      alert("Пожалуйста, введите правильный номер телефона.");
      return;
    }
  }

  // Проверяем валидность пароля
  if (!passwordField.checkValidity()) {
    alert("Исправьте ошибки перед регистрацией!");
    return;
  }

  // Проверяем, что поле выбора валюты и соглашение с условиями пройдены
  if (!currencySelect.value || !agreementField.checked) {
    alert("Пожалуйста, выберите валюту и примите условия.");
    return;
  }

  // Создаем объект с данными
  const formData = {
    method: activeTab,
    contact: activeTab === "Телефон" ? phoneField.value : emailField.value,
    password: passwordField.value,
    currency: currencySelect.value,
    agreement: agreementField.checked,
  };

  // Выводим данные в консоль в формате JSON
  console.log(JSON.stringify(formData));

  alert("Регистрация успешна!");

  // Очищаем только видимое поле (телефон или email)
  if (activeTab === "Телефон") {
    phoneField.value = "";
  } else if (activeTab === "Email") {
    emailField.value = "";
  }

  passwordField.value = "";
  currencySelect.selectedIndex = 0; // Очищаем выбор валюты
  agreementField.checked = false;
}

// Функция для авторизации
function auth(event) {
  event.preventDefault(); // Предотвращаем отправку формы

  const phoneField = document.getElementById("authPhone");
  const emailField = document.getElementById("authEmail");
  const passwordField = document.getElementById("authPassword");

  if (!phoneField.value && !emailField.value) {
    alert("Пожалуйста, введите телефон или email.");
    return;
  }

  if (!passwordField.checkValidity()) {
    alert("Пароль неверный.");
    return;
  }

  // Создаем объект с данными для авторизации
  const authData = {
    contact: phoneField.value || emailField.value, // Выбираем телефон или email
    password: passwordField.value,
  };

  // Выводим данные в консоль в формате JSON
  console.log(JSON.stringify(authData));

  alert("Вы успешно авторизованы!");

  // Очистить поля
  phoneField.value = "";
  emailField.value = "";
  passwordField.value = "";
}

// Привязка к кнопке для регистрации
document.getElementById("registerBtn").addEventListener("click", register);

// Привязка к кнопке для входа
document.getElementById("authBtn").addEventListener("click", auth);

// Функции для отображения формы регистрации и формы входа
function showRegisterForm() {
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("authForm").classList.add("hidden");
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelector(".tab[onclick='switchTab('phone')']")
    .classList.add("active");
  document.getElementById("phoneSection").classList.remove("hidden");
  document.getElementById("emailSection").classList.add("hidden");
}

function showAuthForm() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("authForm").classList.remove("hidden");
  document.getElementById("authPhone").value = "";
  document.getElementById("authEmail").value = "";
  document.getElementById("authPassword").value = "";
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelector(".tab[onclick=\"switchTab('phone')\"]")
    .classList.add("active");
  document.getElementById("authPhoneSection").classList.remove("hidden");
  document.getElementById("authEmailSection").classList.add("hidden");
}

// Функция для переключения между формами регистрации и входа
document.querySelectorAll(".login-link a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    showAuthForm();
  });
});

document.querySelectorAll(".register-link a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    showRegisterForm();
  });
});
