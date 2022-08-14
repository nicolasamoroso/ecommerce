//Llama a la función "getJSONData" que está en init.js.
//Si el status es "ok" llama a la función "showCategoriesList"
//con la array con todas las categorías y el nombre de cada una
let categoriesArray = [];
    
document.addEventListener("DOMContentLoaded", async (e) => {
    const product = await getJSONData(LIST_URL);
    if (product.status === "ok") {
      categoriesArray = product.data.products;
      showCategoriesList(categoriesArray, product.data.catName);
    }
});

//Función que agrega mediante innerHTML los productos 
//relacionados (imagen, nombre, precio, descripcion y
//cantidad de articulos)
function showCategoriesList(array, cat_name){
    let htmlContentToAppend = "";
    if (array.length === 0) {
        document.getElementById("subtitulo").innerHTML = `<h3 class="mb-4 text-muted">No hay articulos para la categoría <span class="text-dark">${cat_name}</span></h3>`;
        return
    }
    document.getElementById("subtitulo").innerHTML = `<h3 class="mb-4 text-muted">Verás aquí todos los productos de la categoría <span class="text-dark">${cat_name}</span></h3>`;
    for(let i = 0; i < array.length; i++){ 
        let category = array[i];
        htmlContentToAppend += ` 
        <div class="list-group-item list-group-item-action cursor-active" onclick="product_info(${category.id})">
            <div class="row">
                <div class="col-3">
                    <img src=" ${category.image} " alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                            <h4> ${category.name} - ${category.currency} ${category.cost} </h4> 
                            <p mb-1> ${category.description} </p> 
                        </div>
                        <small class="text-muted"> ${category.soldCount} artículos</small> 
                    </div>
                </div>
            </div>
        </div>
        `
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

//te envía a product-info con un id en el URL para diferenciar
//cada producto diferente
function product_info(id) {
    window.location.href = "product-info.html?id=" + id;
}