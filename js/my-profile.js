document.addEventListener("DOMContentLoaded", function(){

    const profile = JSON.parse(localStorage.getItem("profile"))

    //-------------------------perfil-------------------------//
    if (profile) {
        let perfil = `
        <img src="${profile.picture}" class="imagen pt-5">
        <p class="text-dark"><strong>Nombre de usuario:</strong> ${profile.name}</p>
        <p class="text-dark"><strong>Email:</strong> ${profile.email}</p>
        `
    
        document.getElementById('perfil').innerHTML = perfil;
    }
});
