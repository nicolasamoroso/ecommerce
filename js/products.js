//Llama a la función "getJSONData" que está en init.js.
//Si el status es "ok" llama a la función "showProductsList"
//con la array con todas las categorías y el nombre de cada una
let productsArray = [];
    
document.addEventListener("DOMContentLoaded", async (e) => {
    const product = await getJSONData(LIST_URL);
    if (product.status === "ok") {
      productsArray = product.data.products;
      showProductsList(productsArray, product.data.catName);
    }

    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});

//Función que agrega mediante innerHTML los productos 
//relacionados (imagen, nombre, precio, descripcion y
//cantidad de articulos)
function showProductsList(array, cat_name){
    let htmlContentToAppend = "";
    if (array.length === 0) {
        document.getElementById("subtitulo").innerHTML = `<h3 class="mb-4 text-muted">No hay articulos para la categoría <span class="text-dark">${cat_name}</span></h3>`;
        return
    }
    
    document.getElementById("subtitulo").innerHTML = `<h3 class="mb-4 text-muted">Verás aquí todos los productos de la categoría <span class="text-dark">${cat_name}</span></h3>`;
    if (!media.matches) {
        for(let i = 0; i < array.length; i++){ 
            let product = array[i];
            htmlContentToAppend += ` 
            <div class="list-group-item list-group-item-action cursor-active" onclick="product_info(${product.id})">
                <div class="row">
                    <div class="col-3">
                        <img src=" ${product.image} " alt="${product.description}" class="p-0 img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="mb-1">
                                <h4> ${product.name} - ${product.currency} ${product.cost} </h4> 
                                <p mb-1> ${product.description} </p> 
                            </div>
                            <small class="text-muted"> ${product.soldCount} vendidos</small> 
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }
    else {
        for(let i = 0; i < array.length; i++){ 
            let product = array[i];
            htmlContentToAppend += ` 
            <div class="row d-flex justify-content-center">
                <div class="col-md-4" onclick="product_info(${product.id})">
                    <div class="card mb-4 shadow-sm custom-card cursor-active card_hover" id="autos">
                        <img class="bd-placeholder-img card-img-top" src="${product.image}" alt="${product.description}">
                        <h4 class="m-3">${product.name} - ${product.currency} ${product.cost}</h4>
                        <div class="card-body">
                            <p class="card-text">${product.description}</p>
                            <small class="text-muted"> ${product.soldCount} vendidos</small> 
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }
    document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
}

//te envía a product-info con un id en el URL para diferenciar
//cada producto diferente
function product_info(id) {
    localStorage.setItem("product-info", id);
    window.location.href = "product-info.html"
}