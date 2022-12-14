
//-------------------------------info de cada producto-------------------------------//

function product_info(id) {
    localStorage.setItem("product-info", id);
    window.location.href = "product-info.html";
}

//-----------------------------------------------------------------------------------//

let productInfoArray = [];
let productInfoCommentsArray = [];
let productInfoRelatedArray = [];

//----------------------------------DOMContentLoaded---------------------------------//

document.addEventListener("DOMContentLoaded", async () => {

    if (!localStorage.getItem("product-info")) {
        const location = JSON.parse(localStorage.getItem("prev_location"));
        window.location.href = location;
    }

    const start = JSON.parse(localStorage.getItem("productStart"));
    const end = JSON.parse(localStorage.getItem("productEnd"));

    document.getElementById("comments").innerHTML = `
    <h1 class="text-center mt-5 mb-5" id="se-el-primero-en-comentar">Se el primero en agregar un comentario</h1>
    <hr>
    `

    if (start || end) {
        if (start && start.length !== 0) {
            productInfoArray = start.find(product => product.id === parseInt(id));
            if (productInfoArray) {
                showPage()
                return
            }
        }
        if (end && end.length !== 0) {
            productInfoArray = end.find(product => product.id === parseInt(id));
            if (productInfoArray) {
                showPage()
                return
            }
        }
    }

    const product = await getJSONData(PRODUCT_INFO);
    if (product.status === "ok") {
        productInfoArray = product.data;
        showProductInfo();

        const comments = await getJSONData(PRODUCT_INFO_COMMENTS);
        if (comments.status === "ok") {
            productInfoCommentsArray = comments.data;
            productInfoCommentsArray.sort((a, b) => {
                let dateA = new Date(a.dateTime);
                let dateB = new Date(b.dateTime);
                return dateA - dateB
            })

            showProductInfoComments();
        }

        if (product.status === "ok") {
            productInfoRelatedArray = product.data.relatedProducts;
            showProductRelated();
        }

        if (localStorage.getItem(`product-${id}`)) {
            showUserComments(JSON.parse(localStorage.getItem(`product-${id}`)))
        }

        for (let i = 0; i < ratingStars.length; ++i) {
            ratingStars[i].className = "ratingStar fa fa-star checked";
        }
    }

    //--------------------------------------------------------//

    //guarda la ubicaci??n actual por si llega a ir a un lugar no permitido.
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});

//-----------------------------------------------------------------------------------//


//--------------------------------Muestra el producto--------------------------------//

function showPage() {
    if (localStorage.getItem(`product-${id}`)) {
        showUserComments(JSON.parse(localStorage.getItem(`product-${id}`)))
    }
    
    showProductInfo();

    document.getElementById("addComment").classList.add("show")

    for (let i = 0; i < ratingStars.length; ++i) {
        ratingStars[i].className = "ratingStar fa fa-star checked";
    }
}


/* Agrega con innerHTML los datos del JSON (nombre, descripci??n, costo,
cuantos quedan, categor??a, imagenes del producto y muestra productos
relacionados) */
function showProductInfo() {

//  #-----------------------------Info b??sica-----------------------------#

    document.getElementById('product').innerHTML  = `
    <div class="d-flex w-100 justify-content-between">
        <h1 class="">${productInfoArray.name}</h1>
        <div class="d-flex align-items-center">
            <button class="btn btn-success" onclick="addProduct(productInfoArray)">Comprar</button>
        </div>
    </div>
    
    <hr>
    <div class="d-flex justify-content-between">
        <strong>Precio:</strong>
        <a href="products.html" class="prev"> <i class="fa-solid fa-arrow-left"></i> Volver al listado </a>   
    </div>
        
    <p>${productInfoArray.currency} ${productInfoArray.cost}</p>
    <strong>Descripci??n:</strong>
    <p>${productInfoArray.description}</p>
    <strong>Categor??a:</strong>
    <p>${productInfoArray.category}</p>
    <strong>Cantidad de vendidos:</strong>
    <p>${productInfoArray.soldCount}</p>

    <h5 class="fw-bold mt-5">Im??genes ilustrativas</h5>
    <div id="carouselDark" class="carousel carousel-dark slide" data-bs-ride="carousel">   
    </div>
    `

//  #-----------------------------Carrusel de im??genes-----------------------------#

    document.getElementById('carouselDark').innerHTML = `
    <div id="c-indicators" class="carousel-indicators">
    </div>
    <div id="c-inner" class="carousel-inner">
    </div>
    `

    const images = productInfoArray.images ?? productInfoArray.image;

    if (images.length > 1) {
        document.getElementById('carouselDark').innerHTML += `
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselDark" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselDark" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>`
    
        //Botones del carrusel
        let htmlContentToAppend = `
        <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        `
        document.getElementById('c-indicators').innerHTML = htmlContentToAppend;
        
        for (let i = 1; i < images.length; i++) {
            document.getElementById('c-indicators').innerHTML +=`
            <button type="button" data-bs-target="#carouselDark" data-bs-slide-to="${i}" aria-label="Slide ${i+1}"></button>
            `
        }
    }

    //Imagenes del carrusel

    htmlContentToAppend = `
    <div class="carousel-item active">
        <img src="${images[0].dataURL ?? images[0]}" class="imgCarousel">
    </div>
    `
    document.getElementById('c-inner').innerHTML = htmlContentToAppend;

    //Agrega cada imagen que se encuentre para esa id en el JSON
    for (let i = 1; i < images.length; i++) {
        let img = images[i].dataURL ?? images[i];
        htmlContentToAppend += `
        <div class="carousel-item">
            <img src="${img}" class="imgCarousel">
        </div>
        `
    }
    document.getElementById('c-inner').innerHTML = htmlContentToAppend;

}

//  #-----------------------------Productos relacionados-----------------------------#

//Muestra los productos relacionados con el art??culo "id"
function showProductRelated () {
    document.getElementById('related').innerHTML = `
    <div class="container">
        <h3 class="text-center mt-5"><strong>Productos relacionados</strong></h3>
        <div id="container-related" class="row mt-5 justify-content-center">
        </div>
    </div>
    `
    
    //agrega cada articulo relacionado que se encuentre para esa id en el JSON
    for (let i = 0; i < productInfoRelatedArray.length; i++) {
        let p_related = productInfoRelatedArray[i];
        document.getElementById('container-related').innerHTML += `
        <div class="col-md-4 scale" onclick="product_info(${p_related.id})">
            <div class="card mb-4 shadow-sm custom-card cursor-active card_hover imgRelated">
                <img class="bd-placeholder-img card-img-top" src="${p_related.image}">
                <h4 class="m-3 text-center">${p_related.name}</h4>
            </div>
        </div>
        `
    }
}