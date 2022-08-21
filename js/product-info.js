
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


//  #-----------------------------Comentarios-----------------------------#

/* Muestra los comentarios del producto "id".
Si no hay comentarios, cambia el texto a "Se el primero en comentar" */
function showProductInfoComments() {

    let htmlContentToAppend = "";

    /* Si hay comentarios entra */
    if(productInfoCommentsArray.length !== 0) {

        /* Si no tiene imagen, le agrega una */
        if (!productInfoCommentsArray.profile_pic) {

            htmlContentToAppend += `
            <h1 class="text-center mt-5 mb-5">Comentarios</h1>
            <hr>
            `

            for (let i = 0; i < productInfoCommentsArray.length; i++) {
                let product = productInfoCommentsArray[i];
                product.profile_pic = "../img/img_perfil.png";
            }
        }

        /* Agrega cada comentario, además de mostrar el score (estrellas) y 
        la fecha en la q se comentó. */
        for (let i = 0; i < productInfoCommentsArray.length; i++) {
            let product = productInfoCommentsArray[i];
            htmlContentToAppend += comentarios(product, true);
        }
    }
    else htmlContentToAppend = `
    <h1 class="text-center mt-5 mb-5" id="se-el-primero-en-comentar">Se el primero en agregar un comentario</h1>
    <hr>
    `

    document.getElementById('comments').innerHTML += htmlContentToAppend;
}

function comentarios(product, se_puede) {
    let htmlContentToAppend = `
    <div class="comments">
        <div class="d-flex justify-content-between">
            <h6>
                <img id="profile_pic_comments" src="${product.profile_pic }">
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

let commentsArray = [];

function addComment() {

    const profile = JSON.parse(localStorage.getItem("profile"));
    const comment = document.getElementById("productComment").value;

    if (comment.length !== 0) {

        const score = checkScore();
        const date = new Date();
        const name = profile.name;
        const img = profile.picture;

        const comentario = {
            user : name,
            description : comment,
            score : score,
            dateTime : date,
            profile_pic : img
        }

        if (localStorage.getItem(`product-${id}`)) {
            commentsArray = JSON.parse(localStorage.getItem(`product-${id}`));

            const existe_nombre = commentsArray.find(function({user}) {
                return user === JSON.parse(localStorage.getItem("profile")).name;
            });
            
            if (!existe_nombre) {
                
                commentsArray.push(comentario);
                
                localStorage.setItem(`product-${id}`, JSON.stringify(commentsArray));

                let htmlContentToAppend = comentarios(comentario, false)

                document.getElementById('comments').innerHTML += htmlContentToAppend;

            }
            else {
                showAlertError();
            }
        }
        else {
            
            commentsArray.push(comentario);
            
            localStorage.setItem(`product-${id}`, JSON.stringify(commentsArray));

            let htmlContentToAppend = comentarios(comentario, false)

            document.getElementById('comments').innerHTML += htmlContentToAppend;

            if (document.getElementById('se-el-primero-en-comentar'))
                document.getElementById('se-el-primero-en-comentar').innerHTML = "Comentarios";
            
        }
    }
    else {
        showAlertErrorVoid()
    }
    

    document.getElementById("productComment").value = "";
}


function showUserComments(array) {

    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        htmlContentToAppend += comentarios(element, false);
    }

    document.getElementById('comments').innerHTML += htmlContentToAppend;

    if (document.getElementById('se-el-primero-en-comentar'))
        document.getElementById('se-el-primero-en-comentar').innerHTML = "Comentarios";
}


/* Agrega show del id "alert-danger" si no escribío nada
hace timeout a la alerta después de 4 segundos */
function showAlertErrorVoid() {
    document.getElementById("alert-danger-vacio").classList.add("show");
    setTimeout(removeAlertErrorVoid, 3000);
}
  
/* remueve show del id "alert-danger" */
function removeAlertErrorVoid() {
    document.getElementById("alert-danger-vacio").classList.remove("show")
}

/*  */
function showAlertError() {
    document.getElementById("alert-danger").classList.add("show");
    setTimeout(removeAlertError, 3000);
}
  
/* remueve show del id "alert-danger" */
function removeAlertError() {
    document.getElementById("alert-danger").classList.remove("show")
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

function showTextArea() {
    let htmlContentToAppend = `
    <textarea name="productComment" class="form-control" id="productComment" cols="10" rows="7" placeholder="Agrega un comentario al producto"></textarea>
    <input id="btn-comment" class="mt-2 w-100" type="submit" onclick="addComment()"></input>
    `
    document.getElementById("comentario").innerHTML = htmlContentToAppend;
}