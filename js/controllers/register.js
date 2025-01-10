document.addEventListener("DOMContentLoaded", async function () {
  // Verificar si el usuario ya está logueado
  const userToken = localStorage.getItem("userToken");
  const userName = localStorage.getItem("userName");

  if (userToken && userName) {
    window.location.href = "comics.html";
    return;
  }

  let codigosPostales = {};
  let comunidadesData = {};

  // Agregar botón de validación de usuario
  const usuarioInput = document.getElementById("usuario");
  const usuarioGroup = usuarioInput.closest(".input-group");
  const checkUserButton = document.createElement("button");
  checkUserButton.type = "button";
  checkUserButton.className = "check-user-btn";
  checkUserButton.textContent = "Verificar";

  // Crear contenedor para el campo de usuario y sus elementos
  const usuarioField = document.querySelector(".input-group:has(#usuario)");
  const usuarioContainer = document.createElement("div");
  usuarioContainer.className = "usuario-container";

  // Crear wrapper para el input y el botón
  const inputWrapper = document.createElement("div");
  inputWrapper.className = "input-wrapper";

  // Crear contenedor para el mensaje de validación
  const validationMessage = document.createElement("div");
  validationMessage.className = "validation-message";
  validationMessage.id = "usuarioValidationMessage";

  // Mover elementos a la nueva estructura
  usuarioField.parentNode.insertBefore(usuarioContainer, usuarioField);
  usuarioContainer.appendChild(inputWrapper);
  inputWrapper.appendChild(usuarioField);
  inputWrapper.appendChild(checkUserButton);
  usuarioContainer.appendChild(validationMessage);

  // Agregar iconos de validación a los input groups
  document.querySelectorAll(".input-group").forEach((group) => {
    // Agregar iconos de validación
    const successIcon = document.createElement("i");
    successIcon.className = "fas fa-check validation-icon success-icon";
    const errorIcon = document.createElement("i");
    errorIcon.className = "fas fa-times validation-icon error-icon";

    group.appendChild(successIcon);
    group.appendChild(errorIcon);
  });

  // Agregar clase especial para el campo de contraseña
  const passwordGroup = document
    .querySelector("#password")
    .closest(".input-group");
  passwordGroup.classList.add("with-toggle");

  // Agregar clase especial para el campo de usuario
  usuarioGroup.classList.add("with-verification");

  // Función para verificar disponibilidad de usuario
  async function checkUserAvailability(username) {
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];
    return !registeredUsers.some((user) => user.usuario === username);
  }

  // Evento para detectar cambios en el campo de usuario
  usuarioInput.addEventListener("input", function () {
    checkUserButton.disabled = false;
    checkUserButton.textContent = "Verificar";
    const inputGroup = this.closest(".input-group");
    inputGroup.classList.remove("success", "error");
    document.getElementById("usuarioValidationMessage").className =
      "validation-message";
    document.getElementById("usuarioValidationMessage").innerHTML = "";
  });

  // Evento para el botón de verificación de usuario
  checkUserButton.addEventListener("click", async function () {
    const username = usuarioInput.value.trim();
    const inputGroup = usuarioInput.closest(".input-group");
    const validationMessage = document.getElementById(
      "usuarioValidationMessage"
    );

    if (!username) {
      inputGroup.classList.remove("success");
      inputGroup.classList.add("error");
      validationMessage.className = "validation-message error";
      validationMessage.innerHTML =
        '<i class="fas fa-times"></i> Ingresa un nombre de usuario';
      return;
    }

    const isAvailable = await checkUserAvailability(username);

    inputGroup.classList.remove("error", "success");
    validationMessage.className = "validation-message";

    if (isAvailable) {
      inputGroup.classList.add("success");
      validationMessage.className = "validation-message success";
      validationMessage.innerHTML =
        '<i class="fas fa-check"></i> Usuario disponible';
      this.disabled = true;
      this.textContent = "Verificado";
    } else {
      inputGroup.classList.add("error");
      validationMessage.className = "validation-message error";
      validationMessage.innerHTML =
        '<i class="fas fa-times"></i> Este nombre de usuario ya está en uso';
    }
  });

  // Botón de usuario de prueba
  const testUserButton = document.getElementById("testUserButton");
  if (testUserButton) {
    testUserButton.addEventListener("click", function () {
      try {
        const testUser = Config.MOCK_DATA.testUser;

        // Rellenar los campos con los datos de prueba
        document.getElementById("nombre").value = testUser.nombre;
        document.getElementById("apellidos").value = testUser.apellidos;
        document.getElementById("pais").value = testUser.pais;
        document.getElementById("comunidadAutonoma").value =
          testUser.comunidadAutonoma;
        document.getElementById("codigoPostal").value = testUser.codigoPostal;
        document.getElementById("direccion").value = testUser.direccion;
        document.getElementById("email").value = testUser.email;
        document.getElementById("usuario").value = testUser.usuario;
        document.getElementById("password").value = testUser.password;

        // Disparar eventos para validar los campos
        [
          "nombre",
          "apellidos",
          "pais",
          "comunidadAutonoma",
          "codigoPostal",
          "direccion",
          "email",
          "usuario",
          "password",
        ].forEach((fieldId) => {
          const input = document.getElementById(fieldId);
          const event =
            input.tagName === "SELECT"
              ? new Event("change")
              : new Event("input");
          input.dispatchEvent(event);
        });

        showToast("Datos de prueba cargados", "success");
      } catch (error) {
        console.error("Error cargando usuario de prueba:", error);
        showToast("Error cargando datos de prueba", "error");
      }
    });
  }

  // Cargar todos los datos necesarios
  try {
    // Usar datos directamente desde Config.MOCK_DATA.location.spain
    const comunidadesData = Config.MOCK_DATA.location.spain.comunidades;
    const select = document.getElementById("comunidadAutonoma");

    comunidadesData.forEach((comunidad) => {
      const option = document.createElement("option");
      option.value = comunidad.nombreComunidad;
      option.textContent = comunidad.nombreComunidad;
      select.appendChild(option);
    });

    // Evento para autocompletar código postal cuando se selecciona comunidad
    select.addEventListener("change", function () {
      const codigoPostalInput = document.getElementById("codigoPostal");
      const comunidadSeleccionada = this.value;
      const comunidad = comunidadesData.find(
        (c) => c.nombreComunidad === comunidadSeleccionada
      );

      if (comunidad) {
        codigoPostalInput.value = comunidad.codigoPostalPrincipal;
        validarCodigoPostal(codigoPostalInput);
      }
    });

    // Función para validar código postal
    function validarCodigoPostal(input) {
      const cp = input.value;
      const inputGroup = input.closest(".input-group");
      const cpValidationMessage = document.getElementById(
        "cpValidationMessage"
      );

      // Limpiar estados previos
      inputGroup.classList.remove("error", "success");
      cpValidationMessage.textContent = "";
      cpValidationMessage.className = "validation-message";

      if (cp.length === 5) {
        if (validarCodigoPostalEspanol(cp)) {
          const resultado = encontrarComunidadYProvinciaPorCP(cp);
          if (resultado) {
            select.value = resultado.comunidad;
            inputGroup.classList.add("success");
            cpValidationMessage.className = "validation-message success";
            cpValidationMessage.innerHTML =
              '<i class="fas fa-check"></i> Provincia: ' + resultado.provincia;
          } else {
            inputGroup.classList.add("error");
            cpValidationMessage.className = "validation-message error";
            cpValidationMessage.innerHTML =
              '<i class="fas fa-times"></i> El código postal no corresponde a ninguna comunidad autónoma';
          }
        } else {
          inputGroup.classList.add("error");
          cpValidationMessage.className = "validation-message error";
          cpValidationMessage.innerHTML =
            '<i class="fas fa-times"></i> Código postal inválido para España';
        }
      } else if (cp.length > 0) {
        inputGroup.classList.add("error");
        cpValidationMessage.className = "validation-message error";
        cpValidationMessage.innerHTML =
          '<i class="fas fa-times"></i> El código postal debe tener 5 dígitos';
      }
    }

    // Evento para validar código postal
    const codigoPostalInput = document.getElementById("codigoPostal");
    codigoPostalInput.addEventListener("input", function () {
      // Validar que solo se ingresen números
      if (!/^\d*$/.test(this.value)) {
        this.value = this.value.replace(/\D/g, "");
        return;
      }
      validarCodigoPostal(this);
    });

    // Función para encontrar comunidad y provincia por CP
    function encontrarComunidadYProvinciaPorCP(cp) {
      const cpNum = parseInt(cp, 10);

      for (const comunidad of comunidadesData) {
        for (const provincia of comunidad.provincias) {
          if (cpNum >= provincia.minCP && cpNum <= provincia.maxCP) {
            return {
              comunidad: comunidad.nombreComunidad,
              provincia: provincia.nombreProvincia,
            };
          }
        }
      }
      return null;
    }

    // Validación de contraseña en tiempo real
    const passwordInput = document.getElementById("password");
    const passwordValidationMessage = document.getElementById(
      "passwordValidationMessage"
    );

    passwordInput.addEventListener("input", function () {
      const password = this.value;
      const inputGroup = this.closest(".input-group");
      // Nueva expresión regular que requiere 8 caracteres, letras, números y carácter especial
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

      // Limpiar estados previos
      inputGroup.classList.remove("error", "success");
      passwordValidationMessage.textContent = "";

      if (password.length > 0) {
        if (passwordRegex.test(password)) {
          inputGroup.classList.add("success");
        } else {
          inputGroup.classList.add("error");
          passwordValidationMessage.textContent =
            "La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y un carácter especial";
          passwordValidationMessage.style.color = "var(--error-color)";
        }
      }
    });

    // Validación en tiempo real para campos obligatorios
    const requiredFields = [
      "nombre",
      "apellidos",
      "direccion",
      "usuario",
      "pais",
      "comunidadAutonoma",
    ];
    requiredFields.forEach((fieldId) => {
      const input = document.getElementById(fieldId);
      const validationMessage = document.getElementById(
        `${fieldId}ValidationMessage`
      );

      if (!validationMessage) return; // Skip if validation message element doesn't exist

      input.addEventListener("input", function () {
        const inputGroup = this.closest(".input-group");
        inputGroup.classList.remove("error", "success");
        validationMessage.className = "validation-message";
        validationMessage.innerHTML = "";

        if (this.value.trim() === "") {
          inputGroup.classList.add("error");
          validationMessage.className = "validation-message error";
          validationMessage.innerHTML =
            '<i class="fas fa-times"></i> Este campo es obligatorio';
        } else {
          inputGroup.classList.add("success");
          validationMessage.className = "validation-message success";
          validationMessage.innerHTML =
            '<i class="fas fa-check"></i> Campo válido';
        }
      });

      // Validación al perder el foco
      input.addEventListener("blur", function () {
        if (this.value.trim() === "") {
          const inputGroup = this.closest(".input-group");
          inputGroup.classList.add("error");
          validationMessage.className = "validation-message error";
          validationMessage.innerHTML =
            '<i class="fas fa-times"></i> Este campo es obligatorio';
        }
      });
    });

    // Validación del select de Comunidad Autónoma
    const comunidadSelect = document.getElementById("comunidadAutonoma");
    const comunidadValidationMessage = document.getElementById(
      "comunidadValidationMessage"
    );

    comunidadSelect.addEventListener("change", function () {
      const inputGroup = this.closest(".input-group");
      inputGroup.classList.remove("error", "success");
      comunidadValidationMessage.className = "validation-message";
      comunidadValidationMessage.innerHTML = "";

      if (this.value === "") {
        inputGroup.classList.add("error");
        comunidadValidationMessage.className = "validation-message error";
        comunidadValidationMessage.innerHTML =
          '<i class="fas fa-times"></i> Debes seleccionar una Comunidad Autónoma';
      } else {
        inputGroup.classList.add("success");
        comunidadValidationMessage.className = "validation-message success";
        comunidadValidationMessage.innerHTML =
          '<i class="fas fa-check"></i> Comunidad Autónoma válida';
      }
    });

    // Manejar click en labels para enfocar inputs
    document.querySelectorAll(".form-label").forEach((label) => {
      label.addEventListener("click", function () {
        const formGroup = this.closest(".form-group");
        const input = formGroup.querySelector("input, select");
        if (input && !input.hasAttribute("readonly")) {
          input.focus();
        }
      });
    });

    // Validación y autorelleno del email
    const emailInput = document.getElementById("email");
    const emailValidationMessage = document.getElementById(
      "emailValidationMessage"
    );

    emailInput.addEventListener("input", function (e) {
      const inputGroup = this.closest(".input-group");
      inputGroup.classList.remove("error", "success");
      emailValidationMessage.className = "validation-message";
      emailValidationMessage.innerHTML = "";

      if (e.data === "@") {
        this.value = this.value.slice(0, -1) + "@uoc.edu";
      }

      if (this.value) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(this.value)) {
          if (this.value.endsWith("@uoc.edu")) {
            inputGroup.classList.add("success");
            emailValidationMessage.className = "validation-message success";
            emailValidationMessage.innerHTML =
              '<i class="fas fa-check"></i> Email válido';
          } else {
            inputGroup.classList.add("error");
            emailValidationMessage.className = "validation-message error";
            emailValidationMessage.innerHTML =
              '<i class="fas fa-times"></i> El email debe terminar en @uoc.edu';
          }
        } else {
          inputGroup.classList.add("error");
          emailValidationMessage.className = "validation-message error";
          emailValidationMessage.innerHTML =
            '<i class="fas fa-times"></i> Por favor, introduce un email válido';
        }
      }
    });

    // Validación del select de País
    const paisSelect = document.getElementById("pais");
    const paisValidationMessage = document.getElementById(
      "paisValidationMessage"
    );

    paisSelect.addEventListener("change", function () {
      const inputGroup = this.closest(".input-group");
      inputGroup.classList.remove("error", "success");
      paisValidationMessage.className = "validation-message";
      paisValidationMessage.innerHTML = "";

      if (this.value === "") {
        inputGroup.classList.add("error");
        paisValidationMessage.className = "validation-message error";
        paisValidationMessage.innerHTML =
          '<i class="fas fa-times"></i> Debes seleccionar un país';
      } else {
        inputGroup.classList.add("success");
        paisValidationMessage.className = "validation-message success";
        paisValidationMessage.innerHTML =
          '<i class="fas fa-check"></i> País válido';
      }
    });
  } catch (error) {
    console.error("Error cargando datos:", error);
    showToast("Error cargando datos necesarios", "error");
  }

  // Toggle password visibility
  const togglePassword = document.querySelector(".toggle-password");
  const passwordInput = document.querySelector("#password");

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

  // Handle registration form submission
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const userData = {
      nombre: document.getElementById("nombre").value,
      apellidos: document.getElementById("apellidos").value,
      pais: document.getElementById("pais").value,
      comunidadAutonoma: document.getElementById("comunidadAutonoma").value,
      codigoPostal: document.getElementById("codigoPostal").value,
      direccion: document.getElementById("direccion").value,
      email: document.getElementById("email").value,
      usuario: document.getElementById("usuario").value,
      password: document.getElementById("password").value,
    };

    try {
      // Validar todos los campos requeridos
      if (Object.values(userData).some((value) => !value)) {
        showToast("Por favor, completa todos los campos", "error");
        return;
      }

      // Validar email
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(userData.email)) {
        showToast("Por favor, introduce un email válido", "error");
        return;
      }

      if (!userData.email.endsWith("@uoc.edu")) {
        showToast("El email debe terminar en @uoc.edu", "error");
        return;
      }

      // Validar contraseña
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(userData.password)) {
        showToast(
          "La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y un carácter especial",
          "error"
        );
        return;
      }

      // Verificar disponibilidad de usuario
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];
      if (registeredUsers.some((user) => user.usuario === userData.usuario)) {
        showToast("El nombre de usuario ya está en uso", "error");
        return;
      }

      // Validar código postal
      if (!validarCodigoPostalEspanol(userData.codigoPostal)) {
        showToast("El código postal no es válido para España", "error");
        return;
      }

      // Guardar nuevo usuario
      registeredUsers.push(userData);
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

      // Crear lista de colecciones vacía
      const userCollections = {
        mock: {
          wishlist: [],
          toread: [],
          reading: [],
          read: [],
          collections: [],
        },
        api: {
          wishlist: [],
          toread: [],
          reading: [],
          read: [],
          collections: [],
        },
      };
      localStorage.setItem(
        `collections_${userData.usuario}`,
        JSON.stringify(userCollections)
      );

      // Guardar token y nombre de usuario
      const token = generateToken();
      localStorage.setItem("userToken", token);
      localStorage.setItem("userName", userData.usuario);

      // Mostrar mensaje de éxito y redirigir
      showToast("¡Registro exitoso!", "success");

      // Redirigir después de un breve delay
      setTimeout(() => {
        window.location.href = "comics.html";
      }, 1500);
    } catch (error) {
      console.error("Error en el registro:", error);
      showToast("Error al procesar el registro", "error");
    }
  });
});

function showToast(message, type = "info") {
  const backgroundColor =
    type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#17a2b8";

  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    style: {
      background: backgroundColor,
    },
    stopOnFocus: true,
  }).showToast();
}

// Función para validar código postal español
function validarCodigoPostalEspanol(codigoPostal) {
  const pattern = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;
  return pattern.test(codigoPostal);
}

// Función para generar un token aleatorio
function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
