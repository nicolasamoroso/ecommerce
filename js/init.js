const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

//-------------------------------Lista de productos-------------------------------//
const id = localStorage.getItem("product-info");

const LIST_URL = PRODUCTS_URL + localStorage.catID + EXT_TYPE;

const PRODUCT_INFO = PRODUCT_INFO_URL + id + EXT_TYPE;

const PRODUCT_INFO_COMMENTS = PRODUCT_INFO_COMMENTS_URL + id + EXT_TYPE;

const CART_INFO = CART_INFO_URL + 25801 + EXT_TYPE;

//-------------------------------media-------------------------------//
var media = window.matchMedia("(max-width: 700px)")

//-------------------------------"fecth"-------------------------------//

function showSpinner(){
  document.getElementById("spinner-wrapper").style.display = "block"; 
}

function hideSpinner(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

const getJSONData = async (url) => {
    let result = {};
    showSpinner(); 
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner(); 
      return result;
    })
    .catch(function(error) {
      result.status = 'error';
      result.data = error;
      hideSpinner(); 
      return result;
    });
}

//-------------------------------verificación profile-------------------------------//

document.addEventListener("DOMContentLoaded", function(){

  const profile = JSON.parse(localStorage.getItem("profile"))
  
  // redirect si profile no existe
  if (!profile) {
    window.location.href = "login.html"
    return
  }
  const catchProfile = profile.find(function({logged}) {
    return logged === true
  })
  if (!catchProfile) {
    window.location.href = "login.html"
    return
  }

  const perfil = catchProfile;

  //-------------------------dropdown-------------------------//


  let dropdown = ` 
  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <img src="${perfil.picture}" alt="user" class="img-fluid rounded-circle imagen-nav" width="30">
    <span class="ml-2">${perfil.name}</span>
  </a>
  <div class="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDropdown">
    <a class="dropdown-item" href="my-profile.html">Mi Perfil</a>
    <a class="dropdown-item" href="cart.html">Ver Carrito</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item text-danger cursor-active" onclick="signOut()">Cerrar Sesión</a>
  </div>
  `

  document.getElementById('dropdown').innerHTML = dropdown;

});

//-------------------------------Cerrar Sesión-------------------------------//
function signOut() {
  if (localStorage.getItem("profile")) {
    const profileArray = JSON.parse(localStorage.getItem("profile"))
    const catchProfile = profileArray.find(function({logged}) {
      return logged === true
    })
    if (catchProfile) {
      const newProfile = {
        name: catchProfile.name,
        email: catchProfile.email,
        picture: catchProfile.picture,
        phone: catchProfile.phone,
        address: catchProfile.address,
        age: catchProfile.age,
        logged : false
      }
      profileArray.splice(profileArray.findIndex(function({logged}) {
        return logged === true
      }), 1, newProfile);

      localStorage.setItem("profile", JSON.stringify(profileArray));
    }
  }
  window.location.href = "index.html"
} 