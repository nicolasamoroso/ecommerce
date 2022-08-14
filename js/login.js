//-------------------------------google oauth-------------------------------//

//obtiene el perfil de google, lo guarda en localStorage y te manda a inicio
function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);
  localStorage.setItem("profile", JSON.stringify(responsePayload));
  window.location.href = "index.html";
}

//Puede validar y decodificar la credencial JWT
function decodeJwtResponse (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

//-------------------------------login-------------------------------//

//animación de login para cuando los datos no son correctos
(function () {
  'use strict'
  let forms = document.querySelectorAll('.needs-validation')
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
})()


//validación del login y en el caso de que el login sea valido
//crea un perfil para guardar en localStorage (nombre, email e imágen).
//También muestra un cartel (alerta de boostrap) si la contraseña tiene menos de 8 carácteres
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  if (email && password) {
    if (password.length >= 8) {
      const name = email.split("@")[0];
      const profile = {
        name: name,
        email: email,
        picture: "../img/img_perfil.png"
      }
      localStorage.setItem("profile", JSON.stringify(profile));
      window.location.href = "index.html";
    }
    else {
      showAlertError();
    }
  }
});

//si el perfil existe (se validó el login), te envía al inicio
document.addEventListener("DOMContentLoaded", function() {

  const profile = JSON.parse(localStorage.getItem("profile"));
  if (profile) window.location.href = "index.html"

});

//Alerta de contraseña menor a 8 carácteres
//agrega show del id "alert-danger"
//hace timeout a la alerta después de 4 segundos
function showAlertError() {
  document.getElementById("alert-danger").classList.add("show");
  setTimeout(removeAlertError, 4000);
}

//remueve show del id "alert-danger"
function removeAlertError() {
  document.getElementById("alert-danger").classList.remove("show")
}