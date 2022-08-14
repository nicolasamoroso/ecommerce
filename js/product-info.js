//-------------------------------info de cada producto-------------------------------//
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

const PRODUCT_INFO = PRODUCT_INFO_URL + id + EXT_TYPE;

//----------------------------Muestra lo que está en el producto----------------------------//
document.addEventListener("DOMContentLoaded", async (e) => {

    const product = await getJSONData(PRODUCT_INFO);
    if (product.status === "ok") {
      showProductInfo(product.data);
    }
});

//Agrega con innerHTML los datos del JSON (nombre, descripción, costo,
//cuantos quedan, categoría, imagenes del producto y muestra productos
//relacionados)
function showProductInfo(data) {

    const images = data.images;
    const relatedProducts = data.relatedProducts;

    let htmlContentToAppend = `
        <h1 class="text-center">${data.name}</h1>
        <strong>Descripción:</strong>
        <p>${data.description}</p>
        <strong>Cost:</strong>
        <p>${data.cost}</p>
        <strong>Sold Count:</strong>
        <p>${data.soldCount}</p>
        <strong>Category:</strong>
        <p>${data.category}</p>

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

        <div class="container">
            <h3 class="text-center mt-5"><strong>Productos relacionados</strong></h3>
            <div class="row mt-5">
                <div class="col-md-4" onclick="product_info(${relatedProducts[0].id})">
                    <div class="card mb-4 shadow-sm custom-card cursor-active card_hover">
                        <img class="bd-placeholder-img card-img-top" src="${relatedProducts[0].image}">
                        <h3 class="m-3 text-center">${relatedProducts[0].name}</h3>
                    </div>
                </div>
                <div class="col-md-4" onclick="product_info(${relatedProducts[1].id})">
                    <div class="card mb-4 shadow-sm custom-card cursor-active card_hover">
                        <img class="bd-placeholder-img card-img-top" src="${relatedProducts[1].image}">
                        <h3 class="m-3 text-center">${relatedProducts[1].name}</h3>
                    </div>
                </div>
            </div>
        </div>
    `

    document.getElementById('product').innerHTML = htmlContentToAppend;
}

//te envía a product-info con un id en el URL para diferenciar
//cada producto diferente
function product_info(id) {
    window.location.href = "product-info.html?id=" + id;
}
