document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});


//te da el "nombre" de perfil y agrega el nombre en el navbar
function perfil() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const name = urlParams.get('name'); 
    const email = urlParams.get('email');
    if (name || email) {
        let user = (email) ? email.split("@").shift() : name;
        let htmlinner = `<a href="my-profile.html" class="nav-link">Usuario: ${user} </a>`
        document.getElementById("perfil").innerHTML = htmlinner;
    }
    else {
        window.location.href = "login.html"
    }
}