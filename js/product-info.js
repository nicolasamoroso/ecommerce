//-------------------------------info de cada producto-------------------------------//
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

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

    const images = product.images;

    let htmlContentToAppend = `
        <h1 class="text-center mb-3">${product.name}</h1>
        <p><strong>Descripción:</strong> ${product.description}</p>
        <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
        <p><strong>Vendidos:</strong> ${product.soldCount}</p>
        <p><strong>Categoría:</strong> ${product.category}</p>
    
        <div id="carouselExampleDark" class="carousel carousel-dark slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div class="carousel-inner">
                <div class="carousel-item active" data-bs-interval="10000">
                    <img src="${images[0]}" class="d-block w-100">
                </div>
                <div class="carousel-item" data-bs-interval="2000">
                    <img src="${images[1]}" class="d-block w-100">
                </div>
                <div class="carousel-item">
                    <img src="${images[2]}" class="d-block w-100">
                </div>
                <div class="carousel-item">
                    <img src="${images[3]}" class="d-block w-100">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    `

    document.getElementById('product').innerHTML = htmlContentToAppend;
}


function stars(score) {

    let htmlContentToAppend = "";
    for (i = 1; i <= 5; i++) {
        if (i <= score) htmlContentToAppend += `<i class="fa fa-star checked"></i>`;
        else htmlContentToAppend += `<i class="fa fa-star"></i>`;
    }
    return htmlContentToAppend;
}

function showProductInfoComments(productInfo) {

    let htmlContentToAppend = "";

    if(productInfo.length !== 0) {
        htmlContentToAppend += `
        <h1 class="text-center mt-5 mb-5">Comentarios</h1>
        <hr>
        `
        for (let i = 0; i < productInfo.length; i++) {
            let product = productInfo[i];
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
                    <p class="pt-2">${product.description}</p>
                    <div> ${stars(product.score)} </div>
                </div>
            </div>
            <hr>
            `
        }
    }
    else {
        htmlContentToAppend = `<h1 class="text-center mt-5 mb-5">Se el primero en agregar un comentario</h1>`
    }
    document.getElementById('comments').innerHTML = htmlContentToAppend;
}


function showProductRelated (related) {

    let htmlContentToAppend = `
    <div class="container">
        <h3 class="text-center mt-5"><strong>Productos relacionados</strong></h3>
        <div class="row mt-5 justify-content-center">
            <div class="col-md-4" onclick="product_info(${related[0].id})">
                <div class="card mb-4 shadow-sm custom-card cursor-active card_hover">
                    <img class="bd-placeholder-img card-img-top" src="${related[0].image}">
                    <h3 class="m-3 text-center">${related[0].name}</h3>
                </div>
            </div>
            <div class="col-md-4" onclick="product_info(${related[1].id})">
                <div class="card mb-4 shadow-sm custom-card cursor-active card_hover">
                    <img class="bd-placeholder-img card-img-top" src="${related[1].image}">
                    <h3 class="m-3 text-center">${related[1].name}</h3>
                </div>
            </div>
        </div>
    </div>
    `
    document.getElementById('related').innerHTML = htmlContentToAppend;
    
}

//te envía a product-info con un id en el URL para diferenciar
//cada producto diferente
function product_info(id) {
    window.location.href = "product-info.html?id=" + id;
}
