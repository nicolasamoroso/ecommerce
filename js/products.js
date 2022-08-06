let categoriesArray = [];

function showCategoriesList(array, cat_name){
    let htmlContentToAppend = "";

    let htmlContentToAppend2 = "";
    htmlContentToAppend2 += `
        <p class="mb-4">Verás aquí todos los productos de la categoría ${cat_name}</p>
    `
    for(let i = 0; i < array.length; i++){ 
        let category = array[i];
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src=" ${category.image} " alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                        <h4> ${category.name} - ${category.currency} ${category.cost} </h4> 
                        <p> ${category.description} </p> 
                        </div>
                        <small class="text-muted"> ${category.soldCount} artículos</small> 
                    </div>

                </div>
            </div>
        </div>
        `
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
        document.getElementById("subtitulo").innerHTML = htmlContentToAppend2;
    }
}

    
document.addEventListener("DOMContentLoaded", async (e) => {
    const product = await getJSONData(LIST_URL);
    if (product.status === "ok") {
      categoriesArray = product.data.products;
      showCategoriesList(categoriesArray, product.data.catName);
    }
});