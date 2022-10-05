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
var media = window.matchMedia("(max-width: 760px)")
var media2 = window.matchMedia("(max-width: 990px)")

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

  showNavBarAndFooter();

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
  <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <img src="${perfil.picture}" alt="user" class="img-fluid rounded-circle imagen-nav" width="30">
    <span class="ml-2">${perfil.name}</span>
  </a>
  <div class="dropdown-menu dropdown-menu-dark m-left-dropdown" aria-labelledby="navbarDropdown">
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
  localStorage.removeItem("productBuyArray")
  window.location.href = "index.html"
} 



const addProduct = async (info) => {
  let cartArray = JSON.parse(localStorage.getItem("productBuyArray"));

  const img = info.images ? info.images[0] : info.image[0].dataURL ? info.image[0].dataURL : info.image;
  
  if (cartArray) {

    let newElement = undefined;
    
    let index = cartArray.findIndex(function({id}) {
      return id === info.id
    })

    if (index !== -1) {
      newElement = cartArray[index];
      if (newElement && 
        ((newElement.stock && parseInt(newElement.count) >= parseInt(newElement.stock)) || 
        (!newElement.stock && parseInt(newElement.count) >= 9))) {
        alert("No hay mas stock disponible")  
        return
      }
      cartArray.splice(index, 1);
    }

    const newProduct = {
      id: info.id,
      name: info.name,
      unitCost: info.cost,
      currency: info.currency,
      image: img,
      count: newElement === undefined ? 1 : parseInt(newElement.count) + 1,
      stock: info.stock ?? null,
      description: info.description
    }
    cartArray.push(newProduct);
    localStorage.setItem("productBuyArray", JSON.stringify(cartArray));
  }
  else {

    const newProduct = {
      id: info.id,
      name: info.name,
      unitCost: info.cost,
      currency: info.currency,
      image: img,
      count: 1,
      stock: info.stock ?? null,
      description: info.description
    }

    
    const productJSON = await getJSONData(CART_INFO);
    if (productJSON.status === "ok") {
      productArray = productJSON.data.articles;
      cartArray = [];
      productArray.forEach(function(product) {
        cartArray.push(product);
      });
      for (let i = 0; i < productArray.length; i++) {
        const element = productArray[i];
        element.stock = 99;
      }
      cartArray.push(newProduct);
    }
    localStorage.setItem("productBuyArray", JSON.stringify(cartArray));
  }

  window.location.href = "cart.html";
}


function showNavBarAndFooter() {
  const nav = document.getElementById("navbar")
  if (nav) {
    nav.innerHTML = `
    <div class="navbar navbar-expand-lg navbar-dark bg-dark p-1">
      <div class="container">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav w-100 justify-content-between">
            <li class="nav-item">
              <a class="nav-link" href="index.html" id="nav-index">Inicio</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="categories.html" id="nav-categories">Categorías</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="sell.html" id="nav-sell">Vender</a>
            </li>
            <li id="dropdown" class="nav-item dropdown"></li>
          </ul>
        </div>
      </div>
    </div>
    `
  }

  document.getElementById("footer").innerHTML = `
  <div class="text-muted">
    <div class="container">
      <p class="float-end">
        <a href="#">Volver arriba</a>
      </p>
      <p>Este sitio forma parte de <a href="https://jovenesaprogramar.edu.uy/" target="_blank">Jovenes a Programar</a> -
        2022</p>
      <p>Clickea <a target="_blank" href="Letra.pdf">aquí</a> para descargar la letra del obligatorio.</p>
    </div>
  </div>
  `
}