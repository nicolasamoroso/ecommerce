
//-------------------------------info de cada producto-------------------------------//

//agarra la id del url, esta url modificada fue creada en products.js > product_info(id)
const id = localStorage.getItem("product-info");

//te envía a product-info con un id en el URL para diferenciar
//cada producto diferente
function product_info(id) {
    localStorage.setItem("product-info", id);
    window.location.href = "product-info.html?related?id=" + id;
}

//-----------------------------------------------------------------------------------//


//---------------------------------------URLs----------------------------------------//

const PRODUCT_INFO = PRODUCT_INFO_URL + id + EXT_TYPE;

const PRODUCT_INFO_COMMENTS = PRODUCT_INFO_COMMENTS_URL + id + EXT_TYPE;

//-----------------------------------------------------------------------------------//


//----------------------------------DOMContentLoaded---------------------------------//

document.addEventListener("DOMContentLoaded", async (e) => {

    //------------------getJSONData en orden------------------//

    const product = await getJSONData(PRODUCT_INFO);
    if (product.status === "ok") {
      showProductInfo(product.data);
    }

    const comments = await getJSONData(PRODUCT_INFO_COMMENTS);
    if (comments.status === "ok") {
        showProductInfoComments(comments.data);
    }

    if (product.status === "ok") {
        showProductRelated(product.data.relatedProducts);
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
function showProductInfo(product) {

//  #-----------------------------Info básica-----------------------------#

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
    
    //Agrega los slide para cada número de imagen
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


//  #-----------------------------Comentarios-----------------------------#

/* Muestra los comentarios del producto "id".
Si no hay comentarios, cambia el texto a "Se el primero en comentar" */
function showProductInfoComments(productComment) {

    let htmlContentToAppend = "";

    /* Si hay comentarios entra */
    if(productComment.length !== 0) {

        /* Si no tiene imagen, le agrega una */
        if (!productComment.profile_pic) {

            htmlContentToAppend += `
            <h1 class="text-center mt-5 mb-5">Comentarios</h1>
            <hr>
            `

            for (let i = 0; i < productComment.length; i++) {
                let product = productComment[i];
                product.profile_pic = "../img/img_perfil.png";
            }
        }

        /* Agrega cada comentario, además de mostrar el score (estrellas) y 
        la fecha en la q se comentó. */
        for (let i = 0; i < productComment.length; i++) {
            let product = productComment[i];
            htmlContentToAppend += comentarios(product, true)
        }
    }
    else htmlContentToAppend = `
    <h1 class="text-center mt-5 mb-5">Se el primero en agregar un comentario</h1>
    <hr>
    `

    document.getElementById('comments').innerHTML += htmlContentToAppend;
}

function comentarios(product, se_puede) {
    let htmlContentToAppend = `
    <div class="comments">
        <div class="d-flex justify-content-between">
            <h6>
                <img id="profile_pic_comments" src="${product.profile_pic}" alt="">
                ${product.user}
            </h6>
            <small>${se_puede ? changeDayFormat(convertDateForIos(product.dateTime)) : changeDayFormat(new Date(product.dateTime))}</small>
        </div>
        <div class="d-flex justify-content-between pt-2">
            <p >${product.description}</p>
            <div> ${ScoreToStars(product.score)} </div>
        </div>
    </div>
    <hr>
    `
    return htmlContentToAppend;
}


/* Muestra el score como estrellas en vez de números */
function ScoreToStars(score) {

    let htmlContentToAppend = "";
    for (i = 1; i <= 5; i++) {
        if (i <= score) htmlContentToAppend += `<i class="fa fa-star checked"></i>`;
        else htmlContentToAppend += `<i class="fa fa-star"></i>`;
    }
    return htmlContentToAppend;
}

/* Cambia el formato de la fecha para que sea "hh:mm - dd/mm/aa" */
function changeDayFormat(date) {
    const day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
    const month = (date.getMonth() + 1) <= 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = (date.getHours() <= 9) ? "0" + date.getHours() : date.getHours();
    const minute = (date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes();
    return `${hour}:${minute} - ${day}/${month}/${year}`
}

function convertDateForIos(date) {
    var arr = date.toString().split(/[- :]/);    
    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);    
    return date;
}


//  #-----------------------------Enviar Comentarios-----------------------------#

            //------------------Score------------------//

const ratingStars = [...document.getElementsByClassName("ratingStar")];

function executeRating(stars) {
  const starClassActive = "ratingStar fa fa-star checked";
  const starClassInactive = "ratingStar fa fa-star";
  const starsLength = stars.length;
  let i;
  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star);

      if (star.className === starClassInactive)
        for (i; i >= 0; --i) stars[i].className = starClassActive;
      else
        for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
    };
  });
}

executeRating(ratingStars);

/* Checkea cuanto score dió el usuario */
function checkScore() {
    let j = 0;
    for (let i = 0; i < 5; i++) {
        if (ratingStars[i].classList.contains("checked"))
            j++
    }
    return j;
}


function Comentar() {
    
    const comment = document.getElementById("productComment").value;
    if (comment.length !== 0) {
        const score = checkScore();
        const date = new Date();
        const profile = JSON.parse(localStorage.getItem("profile"));
        const name = profile.name;
        const img = profile.picture;

        const comentario = {
            user : name,
            description : comment,
            score : score,
            dateTime : date,
            profile_pic : img
        }

        localStorage.setItem("comment", JSON.stringify(comentario));

        let htmlContentToAppend = comentarios(comentario, false)

        document.getElementById('comments').innerHTML += htmlContentToAppend;

        document.getElementById("productComment").value = "";
    }
    else {
        showAlertError()
    }
}

/* Alerta de contraseña menor a 8 carácteres agrega show del id "alert-danger"
hace timeout a la alerta después de 4 segundos */
function showAlertError() {
    document.getElementById("alert-danger").classList.add("show");
    setTimeout(removeAlertError, 3000);
}
  
/* remueve show del id "alert-danger" */
function removeAlertError() {
    document.getElementById("alert-danger").classList.remove("show")
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



