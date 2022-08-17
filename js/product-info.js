
//-------------------------------info de cada producto-------------------------------//

//agarra la id del url, esta url modificada fue creada en products.js > product_info(id)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

//URLs
const PRODUCT_INFO = PRODUCT_INFO_URL + id + EXT_TYPE;

const PRODUCT_INFO_COMMENTS = PRODUCT_INFO_COMMENTS_URL + id + EXT_TYPE;

//----------------------------Muestra lo que está en el producto----------------------------//
document.addEventListener("DOMContentLoaded", async (e) => {

    const product = await getJSONData(PRODUCT_INFO);
    if (product.status === "ok") {
      showProductInfo(product.data);
      showProductRelated(product.data.relatedProducts);
    }

    const comments = await getJSONData(PRODUCT_INFO_COMMENTS);
    if (comments.status === "ok") {
        showProductInfoComments(comments.data);
    }

    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});

//Agrega con innerHTML los datos del JSON (nombre, descripción, costo,
//cuantos quedan, categoría, imagenes del producto y muestra productos
//relacionados)
function showProductInfo(product) {

    let htmlContentToAppend = `
    <h1 class="text-center mb-3">${product.name}</h1>
    <p><strong>Descripción:</strong> ${product.description}</p>
    <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
    <p><strong>Vendidos:</strong> ${product.soldCount}</p>
    <p><strong>Categoría:</strong> ${product.category}</p>

    <div id="carouselExampleDark" class="carousel carousel-dark slide" data-bs-ride="carousel">   
    </div>
    `

    document.getElementById('product').innerHTML = htmlContentToAppend;


//  #-----------------------------Carrusel de imágenes-----------------------------#

    const images = product.images;

    htmlContentToAppend = `
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
    document.getElementById('carouselExampleDark').innerHTML = htmlContentToAppend;


    //Botones del carrusel

    htmlContentToAppend = `
    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    `
    document.getElementById('c-indicators').innerHTML = htmlContentToAppend;
    
    //agrega los slide para cada número de imagen
    for (let i = 1; i < images.length; i++) {
        htmlContentToAppend +=`
        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="${i}" aria-label="Slide ${i+1}"></button>
        `
    }

    document.getElementById('c-indicators').innerHTML = htmlContentToAppend;


    //Imagenes del carrusel

    htmlContentToAppend = `
    <div class="carousel-item active">
        <img src="${images[0]}" class="d-block w-100">
    </div>
    `
    document.getElementById('c-inner').innerHTML = htmlContentToAppend;

    //agrega cada imagen que se encuentre para esa id en el JSON
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


//"cambia" el score numérico por estrellas
function ScoreToStars(score) {

    let htmlContentToAppend = "";
    for (i = 1; i <= 5; i++) {
        if (i <= score) htmlContentToAppend += `<i class="fa fa-star checked"></i>`;
        else htmlContentToAppend += `<i class="fa fa-star"></i>`;
    }
    return htmlContentToAppend;
}

//Muestra los comentarios del producto "id"
//Si no hay comentarios, cambia el texto a "Se el primero en comentar"
function showProductInfoComments(productComment) {

    let htmlContentToAppend = "";

    if(productComment.length !== 0) {

        htmlContentToAppend += `
        <h1 class="text-center mt-5 mb-5">Comentarios</h1>
        <hr>
        `

        //agrega cada comentario, además de mostrar el score (estrellas) y 
        //la fecha en la q se comentó.
        for (let i = 0; i < productComment.length; i++) {
            let product = productComment[i];
            htmlContentToAppend += `
            <div class="comments">
                <div class="d-flex justify-content-between">
                    <h6>
                        <img id="profile_pic_comments" src="../img/img_perfil.png" alt="">
                        ${product.user}
                    </h6>
                    <small>${product.dateTime}</small>
                </div>
                <div class="d-flex justify-content-between pt-2">
                    <p >${product.description}</p>
                    <div> ${ScoreToStars(product.score)} </div>
                </div>
            </div>
            <hr>
            `
        }
    }
    else htmlContentToAppend = `<h1 class="text-center mt-5 mb-5">Se el primero en agregar un comentario</h1>`

    document.getElementById('comments').innerHTML = htmlContentToAppend;
}

//Muestra los productos relacionados con el artículo "id"
function showProductRelated (related) {

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
    for (let i = 0; i < related.length; i++) {
        let p_related = related[i];
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

//te envía a product-info con un id en el URL para diferenciar
//cada producto diferente
function product_info(id) {
    window.location.href = "product-info.html?id=" + id;
}
