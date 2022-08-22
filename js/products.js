//Llama a la función "getJSONData" que está en init.js.
//Si el status es "ok" llama a la función "showProductsList"
//con la array con todas las categorías y el nombre de cada una
let productsArray = [];
let cat_name = "";
let ya_lo_hice = false;
const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT_MAX = "Cant. max";
const ORDER_BY_PROD_COUNT_MIN = "Cant. min";
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
    
document.addEventListener("DOMContentLoaded", async (e) => {
    const product = await getJSONData(LIST_URL);
    if (product.status === "ok") {
      productsArray = product.data.products;
      cat_name = product.data.catName;
      showProductsList(productsArray);
    }

    //Sort
    document.getElementById("sortAsc").addEventListener("click", () => {
        sortAndShowProducts(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", () => {
        sortAndShowProducts(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", () => {
        if (!ya_lo_hice) {
            document.getElementById("up-down").classList.remove("fa-sort-amount-down")
            document.getElementById("up-down").classList.add("fa-sort-amount-up")
            sortAndShowProducts(ORDER_BY_PROD_COUNT_MAX);
        }
        else {
            document.getElementById("up-down").classList.remove("fa-sort-amount-up")
            document.getElementById("up-down").classList.add("fa-sort-amount-down")
            sortAndShowProducts(ORDER_BY_PROD_COUNT_MIN);
        }
    });

    document.getElementById("clearRangeFilter").addEventListener("click", () => {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList(productsArray);
    });

    document.getElementById("rangeFilterCount").addEventListener("click", () => {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0)
            minCount = parseInt(minCount); 
        else
            minCount = undefined;

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0)
            maxCount = parseInt(maxCount);
        else
            maxCount = undefined;

        showProductsList(productsArray);
    });


    //guarda la ubicación actual por si llega a ir a un lugar no permitido.
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});

//Función que agrega mediante innerHTML los productos 
//relacionados (imagen, nombre, precio, descripcion y
//cantidad de articulos)
function showProductsList(productsArray) {
    let htmlContentToAppend = "";
    if (productsArray.length === 0) {
        document.getElementById("subtitulo").innerHTML = `<h4 class="mb-4 text-muted">No hay productos para la categoría <span class="text-dark">${cat_name}</span></h4>`;
        document.getElementById("product-list-container").innerHTML = "";
    }
    else {
        document.getElementById("subtitulo").innerHTML = `<h4 class="mb-4 text-muted">Verás aquí todos los productos de la categoría <span class="text-dark">${cat_name}</span></h4>`;
        if (!media.matches) {
            for(let i = 0; i < productsArray.length; i++){ 
                let product = productsArray[i];
                if (((minCount == undefined) || (minCount != undefined && parseInt(product.soldCount) >= minCount)) &&
                    ((maxCount == undefined) || (maxCount != undefined && parseInt(product.soldCount) <= maxCount))){
                    
                    htmlContentToAppend += ` 
                    <div class="list-group-item list-group-item-action cursor-active" onclick="product_info(${product.id})">
                        <div class="row">
                            <div class="col-3">
                                <img src="${product.image}" alt="${product.description}" class="p-0 img-thumbnail">
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
        }
        else {
            for(let i = 0; i < productsArray.length; i++){ 
                let product = productsArray[i];
                if (((minCount == undefined) || (minCount != undefined && parseInt(product.soldCount) >= minCount)) &&
                    ((maxCount == undefined) || (maxCount != undefined && parseInt(product.soldCount) <= maxCount))){
                    
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
        }
    
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend;
    }
}

//te envía a product-info con un id en el URL para diferenciar
//cada producto diferente
function product_info(id) {
    localStorage.setItem("product-info", id);
    window.location.href = "product-info.html"
}

// function product_info(id) {
//     window.location.href = "product-info.html?id=" + id;
// }

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }
    else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }
    else if (criteria === ORDER_BY_PROD_COUNT_MAX) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
        ya_lo_hice = true;
    }
    else if(criteria === ORDER_BY_PROD_COUNT_MIN) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
        ya_lo_hice = false;
    }

    return result;
}

function sortAndShowProducts(sortCriteria, productArray){
    currentSortCriteria = sortCriteria;

    if(productArray != undefined) {
        productsArray = productArray;
    }

    productsArray = sortProducts(currentSortCriteria, productsArray);

    //Muestro las categorías ordenadas
    showProductsList(productsArray);
}

const searchBar = document.getElementById("searchBar")

searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value;
    const filteredProductsArray = productsArray.filter(product => {
        return product.name.toLowerCase().includes(searchString.toLowerCase()) || 
               product.description.toLowerCase().includes(searchString.toLowerCase()) ||
               product.cost.toString().includes(searchString);
    })
    showProductsList(filteredProductsArray);
})

