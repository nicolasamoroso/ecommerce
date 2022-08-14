const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

//-------------------------------Lista de productos-------------------------------//
const LIST_URL = PRODUCTS_URL + localStorage.catID + EXT_TYPE;

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


  //-------------------------dropdown-------------------------//

  let dropdown = `
  <button class="btn nav-link dropdown-toggle dropdown-btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <img id="profile_pic" src="${profile.picture}">
    <a>${profile.name}</a>
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a class="dropdown-item" href="my-profile.html">Mi Perfil</a>
      <a class="dropdown-item" href="cart.html">Ver Carrito</a>
      <a class="dropdown-item link-danger cursor-active" onclick="signOut()" >Cerrar sesión</a>
  </div>
  `

  document.getElementById('dropdown').innerHTML = dropdown;

});

//-------------------------------Cerrar Sesión-------------------------------//
function signOut() {
  localStorage.setItem('profile', null);
  window.location.href = "login.html"
}