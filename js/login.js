function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
}

function initGoogleAuth (clientId = '51387124380-ntmebd3np4jqgmps0flvm63vn08ooau5.apps.googleusercontent.com') {
    gapi.auth2.init({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/userinfo.email'
    }).then(() => {
      document.getElementById('sign-in-btn').disabled = false;
    }).catch(err => {
      console.log(err);
    });
}

function sendSampleRequest (projectId = 'proyecto-de-jap-358721') {
    var user = gapi.auth2.getAuthInstance().currentUser.get();
    var idToken = user.getAuthResponse().id_token;
    var endpoint = `https://${projectId}.appspot.com/_ah/api/echo/v1/email`;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', endpoint + '?access_token=' + encodeURIComponent(idToken));
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        window.alert(xhr.responseText);
      }
    };
    xhr.send();
}



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