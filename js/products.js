let productsArray = [];
let cat_name = "";
const ORDER_BY_PROD_PRICE_MIN = "$ min";    
const ORDER_BY_PROD_PRICE_MAX = "$ max";
const ORDER_DESC_BY_REL = "Rel.";
let currentSort = undefined;
let minPrice = undefined;
let maxPrice = undefined;
    
document.addEventListener("DOMContentLoaded", async (e) => {
    
    //Llama a la función "getJSONData" que está en init.js.
    //Si el status es "ok" llama a la función "showProductsList"
    //con la array con todas las categorías y el nombre de cada una
    const product = await getJSONData(LIST_URL);

    if (product.status === "ok") {        
        cat_name = product.data.catName;
        productsArray = product.data.products;

        let start = JSON.parse(localStorage.getItem("productStart"));
        let end = JSON.parse(localStorage.getItem("productEnd"));   

        if (start) {

            start = start.filter(function (product) {
                return product.category === cat_name;
            });

            for (let i = 0; i < productsArray.length; i++) {
                for (let j = 0; j < start.length; j++) {
                    if (productsArray[i].name === start[j].name) {
                        productsArray.splice(i, 1);
                    }
                }
            }
        }

        if (end) {

            end = end.filter(function (product) {
                return product.category === cat_name;
            });
            
            for (let i = 0; i < productsArray.length; i++) {
                for (let j = 0; j < end.length; j++) {
                    if (productsArray[i].name === end[j].name) {
                        productsArray.splice(i, 1);
                    }
                }
            }
        }


        if (start && end) {
            productsArray = start.concat(productsArray.concat(end));
        }
        else if (start) {
            productsArray = start.concat(productsArray);
        }
        else if (end) {
            productsArray = productsArray.concat(end);
        }

        showProductsList(productsArray);
    }

    //Sort
    document.getElementById("sortRelDesc").addEventListener("click", () => {
        sortAndShowProducts(ORDER_DESC_BY_REL);

        changeColor("desc", "count-up", "count-down");
    });

    document.getElementById("sortByPriceDown").addEventListener("click", () => {
        sortAndShowProducts(ORDER_BY_PROD_PRICE_MAX);



        changeColor("count-down", "desc", "count-up");
    });

    document.getElementById("sortByPriceUp").addEventListener("click", () => {
        sortAndShowProducts(ORDER_BY_PROD_PRICE_MIN);

        changeColor("count-up", "desc", "count-down");
    });

    document.getElementById("clearRangeFilter").addEventListener("click", () => {
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProductsList(productsArray);
    });

    document.getElementById("rangeFilterPrice").addEventListener("click", () => {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por el precio
        //de productos.
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;

        if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0)
            minPrice = parseInt(minPrice); 
        else
            minPrice = undefined;

        if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0)
            maxPrice = parseInt(maxPrice);
        else
            maxPrice = undefined;

        showProductsList(productsArray);
    });


    //guarda la ubicación actual por si llega a ir a un lugar no permitido.
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});

//cambia el background color de los botones que ordenan los productos
function changeColor(a, b, c) {
    document.getElementById(a).classList.remove("bg-sort");
    document.getElementById(a).classList.add("bg-sort-active");
    if (document.getElementById(b).classList.contains("bg-sort-active")) {
        document.getElementById(b).classList.remove("bg-sort-active");
        document.getElementById(b).classList.add("bg-sort");
    }
    if (document.getElementById(c).classList.contains("bg-sort-active")) {
        document.getElementById(c).classList.remove("bg-sort-active");
        document.getElementById(c).classList.add("bg-sort");
    }
}

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
                if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) &&
                    ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice))){
                    
                    htmlContentToAppend += ` 
                    <div class="list-group-item list-group-item-action cursor-active" onclick="product_info(${product.id})">
                        <div class="row">
                            <div class="col-3">
                                <img src="${product.image[0].dataURL === undefined ? product.image : product.image[0].dataURL}" alt="${product.description}" class="p-0 img-thumbnail">
                            </div>
                            <div class="col">
                                <div class="d-flex w-100 justify-content-between">
                                    <div class="mb-1">
                                        <h4> ${product.name} - ${product.currency} ${product.cost} </h4> 
                                        <p mb-1> ${product.description} </p> 
                                    </div>
                                    <small class="text-muted"> ${product.soldCount === undefined ? 0 : product.soldCount} vendidos</small> 
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
                if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.soldCount) >= minPrice)) &&
                    ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.soldCount) <= maxPrice))){
                    
                    htmlContentToAppend += ` 
                    <div class="row d-flex justify-content-center">
                        <div class="col-md-4" onclick="product_info(${product.id})">
                            <div class="card mb-4 shadow-sm custom-card cursor-active card_hover" id="autos">
                                <img class="bd-placeholder-img card-img-top" src="${product.image[0].dataURL === undefined ? product.image : product.image[0].dataURL}" alt="${product.description}">
                                <h4 class="m-3">${product.name} - ${product.currency} ${product.cost}</h4>
                                <div class="card-body">
                                    <p class="card-text">${product.description}</p>
                                    <small class="text-muted"> ${product.soldCount === undefined ? 0 : product.soldCount} vendidos</small> 
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
    if (criteria === ORDER_DESC_BY_REL) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
    else if (criteria === ORDER_BY_PROD_PRICE_MAX) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
    else if(criteria === ORDER_BY_PROD_PRICE_MIN) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.cost);
            let bCount = parseInt(b.cost);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

function sortAndShowProducts(sort, productArray){

    currentSort = sort;
    if(productArray != undefined)
        productsArray = productArray;
    productsArray = sortProducts(currentSort, productsArray);

    showProductsList(productsArray);
}

const searchBar = document.getElementById("searchBar")

searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value;
    const filteredProductsArray = productsArray.filter(product => {
        return product.name.toLowerCase().includes(searchString.toLowerCase()) || 
               product.description.toLowerCase().includes(searchString.toLowerCase()) ||
               product.currency.toLowerCase().includes(searchString.toLowerCase()) ||
               product.cost.toString().includes(searchString) ;
    })
    showProductsList(filteredProductsArray);
    if (filteredProductsArray.length === 0) {
        document.getElementById("subtitulo").innerHTML = `
        <h4 class="mb-4 text-muted">No hay productos que coincidan con tu búsqueda para la categoría <span class="text-dark">${cat_name}</span></h4>
        `
        document.getElementById("product-list-container").innerHTML = "";
    }
})