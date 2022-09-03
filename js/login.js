//-------------------------------Desafiate Entrega 1-------------------------------//

//-------------------------------google oauth-------------------------------//


//obtiene el perfil de google, lo guarda en localStorage y te manda a inicio
function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);

  signIn(responsePayload.email, responsePayload.name, responsePayload.picture);
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

//----------------------------Fin Desafiate Entrega 1----------------------------//


function signIn(n_email, name = undefined, picture = undefined) {

  const profileArray = JSON.parse(localStorage.getItem("profile"));

  if (profileArray) {
    const catchProfile = profileArray.find(function({email}) {
      return email === n_email
    })

    if (catchProfile) {

      const profile = {
        name: catchProfile.name,
        email: catchProfile.email,
        picture: catchProfile.picture,
        phone: catchProfile.phone,
        address: catchProfile.address,
        age: catchProfile.age,
        name_lastname: catchProfile.name_lastnme,
        logged : true
      }

      profileArray.splice(profileArray.findIndex(function({email}) {
        return email === n_email
      }), 1, profile);
      localStorage.setItem("profile", JSON.stringify(profileArray));
      localStorage.setItem("hayJSONid", false)
      redirect();
      return;
    }
  }

  name = name ? name : n_email.split("@")[0];
  const profile = {
    name,
    email: n_email,
    picture: picture ? picture : "img/img_perfil.png",
    phone: null,
    address: null,
    age: null,
    name_lastname: null,
    logged : true
  }

  if (profileArray) {

    profileArray.push(profile);
    localStorage.setItem("profile", JSON.stringify(profileArray));
    localStorage.setItem("hayJSONid", false)
    redirect();
    return;
  }

  const profileArray2 = [profile];
  localStorage.setItem("profile", JSON.stringify(profileArray2));
  redirect();
  return;
}



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
  const n_email = document.getElementById("email").value
  const password = document.getElementById("password").value
  if (n_email && password) {
    if (password.length >= 8) {
      signIn(n_email);
      return
    }
    showAlertError();
  }
});

/* 
Alerta de contraseña menor a 8 carácteres
agrega show del id "alert-danger"
hace timeout a la alerta después de 3 segundos 
*/
function showAlertError() {
  document.getElementById("alert-danger").classList.add("show");
  setTimeout(removeAlertError, 3000);
}

//remueve show del id "alert-danger"
function removeAlertError() {
  document.getElementById("alert-danger").classList.remove("show")
}

//si el perfil existe (se validó el login), te envía al inicio
document.addEventListener("DOMContentLoaded", function() {
  redirect();
});

function redirect() {
  const profile = JSON.parse(localStorage.getItem("profile"));
  if (profile) {
    const catchProfile = JSON.parse(localStorage.getItem("profile")).find(function({logged}) {
      return logged === true
    })
    if (catchProfile) {
      const location = JSON.parse(localStorage.getItem("prev_location"));
      if (location) {
        window.location.href = location;
      }
      else
        window.location.href = "index.html";
    }
  }
}