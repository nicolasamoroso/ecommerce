document.addEventListener("DOMContentLoaded", function(){

    const profile = JSON.parse(localStorage.getItem("profile"))

    //-------------------------perfil-------------------------//
    if (profile) {
        let perfil = `
        <p class="text-dark mt-5"><strong>Nombre de usuario:</strong> ${profile.name}</p>
        <p class="text-dark"><strong>Email:</strong> ${profile.email}</p>
        <img src="${profile.picture}" class="imagen">
        `
    
        document.getElementById('perfil').innerHTML = perfil;
    }
    
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});
