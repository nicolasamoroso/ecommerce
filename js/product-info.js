
//-------------------------------info de cada producto-------------------------------//

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const id = urlParams.get('id')


//agarra la id del url, esta url modificada fue creada en products.js > product_info(id)

//te envía a product-info con un id en el URL para diferenciar
//cada producto diferente
function product_info(id) {
    localStorage.setItem("product-info", id);
    window.location.href = "product-info.html?related?id=" + id;
}

//-----------------------------------------------------------------------------------//

let productInfoArray = [];
let productInfoCommentsArray = [];
let productInfoRelatedArray = [];

//----------------------------------DOMContentLoaded---------------------------------//

document.addEventListener("DOMContentLoaded", async (e) => {

    //------------------getJSONData en orden------------------//

    const product = await getJSONData(PRODUCT_INFO);
    if (product.status === "ok") {
        productInfoArray = product.data;
        showProductInfo();
    }

    const comments = await getJSONData(PRODUCT_INFO_COMMENTS);
    if (comments.status === "ok") {
        productInfoCommentsArray = comments.data;
        showProductInfoComments();
    }

    if (product.status === "ok") {
        productInfoRelatedArray = product.data.relatedProducts;
        showProductRelated();
    }

    if (localStorage.getItem(`product-${id}`)) {
        showUserComments(JSON.parse(localStorage.getItem(`product-${id}`)))
    }
    
    showTextArea();

    for (let i = 0; i < ratingStars.length; ++i) {
        ratingStars[i].className = "ratingStar fa fa-star checked";
    }
    
    //--------------------------------------------------------//

    //guarda la ubicación actual por si llega a ir a un lugar no permitido.
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});

//-----------------------------------------------------------------------------------//


//--------------------------------Muestra el producto--------------------------------//

/* Agrega con innerHTML los datos del JSON (nombre, descripción, costo,
cuantos quedan, categoría, imagenes del producto y muestra productos
relacionados) */
function showProductInfo() {

//  #-----------------------------Info básica-----------------------------#

    document.getElementById('product').innerHTML  = `
    <h1 class="text-center mb-3">${productInfoArray.name}</h1>
    <p><strong>Descripción:</strong> ${productInfoArray.description}</p>
    <p><strong>Precio:</strong> ${productInfoArray.currency} ${productInfoArray.cost}</p>
    <p><strong>Vendidos:</strong> ${productInfoArray.soldCount}</p>
    <p><strong>Categoría:</strong> ${productInfoArray.category}</p>

    <div id="carouselExampleDark" class="carousel carousel-dark slide" data-bs-ride="carousel">   
    </div>
    `

//  #-----------------------------Carrusel de imágenes-----------------------------#

    const images = productInfoArray.images;

    document.getElementById('carouselExampleDark').innerHTML = `
    <div id="c-indicators" class="carousel-indicators">
    </div>
    <div id="c-inner" class="carousel-inner">
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
    </button>
    `


    //Botones del carrusel

    let htmlContentToAppend = `
    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    `
    document.getElementById('c-indicators').innerHTML = htmlContentToAppend;
    
    //Agrega los slide para cada número de imagen
    for (let i = 1; i < images.length; i++) {
        document.getElementById('c-indicators').innerHTML +=`
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="${i}" aria-label="Slide ${i+1}"></button>
        `
    }

    //Imagenes del carrusel

    htmlContentToAppend = `
    <div class="carousel-item active">
        <img src="${images[0]}" class="d-block w-100">
    </div>
    `
    document.getElementById('c-inner').innerHTML = htmlContentToAppend;

    //Agrega cada imagen que se encuentre para esa id en el JSON
    for (let i = 1; i < images.length; i++) {
        let img = images[i];
        htmlContentToAppend += `
        <div class="carousel-item">
            <img src="${img}" class="d-block w-100">
        </div>
        `
    }
    document.getElementById('c-inner').innerHTML = htmlContentToAppend;

}


//  #-----------------------------Productos relacionados-----------------------------#

//Muestra los productos relacionados con el artículo "id"
function showProductRelated () {

    let htmlContentToAppend = `
    <div class="container">
        <h3 class="text-center mt-5"><strong>Productos relacionados</strong></h3>
        <div id="container-related" class="row mt-5 justify-content-center">
        </div>
    </div>
    `

    document.getElementById('related').innerHTML = htmlContentToAppend;
    
    htmlContentToAppend = "";

    //agrega cada articulo relacionado que se encuentre para esa id en el JSON
    for (let i = 0; i < productInfoRelatedArray.length; i++) {
        let p_related = productInfoRelatedArray[i];
        htmlContentToAppend += `
        <div class="col-md-4" onclick="product_info(${p_related.id})">
            <div class="card mb-4 shadow-sm custom-card cursor-active card_hover">
                <img class="bd-placeholder-img card-img-top" src="${p_related.image}">
                <h3 class="m-3 text-center">${p_related.name}</h3>
            </div>
        </div>
        `
    }
    
    document.getElementById('container-related').innerHTML = htmlContentToAppend;
}

