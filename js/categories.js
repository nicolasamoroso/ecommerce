const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT_MAX = "Cant. max";
const ORDER_BY_PROD_COUNT_MIN = "Cant. min";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let ya_lo_hice = false;
let toggle = true;

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


function sortCategories(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME)
    {
        result = array.sort(function(a, b) {
            if ( a.name < b.name ){ return -1; }
            if ( a.name > b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_NAME){
        result = array.sort(function(a, b) {
            if ( a.name > b.name ){ return -1; }
            if ( a.name < b.name ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_COUNT_MAX) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
        ya_lo_hice = true;
    }
    else if(criteria === ORDER_BY_PROD_COUNT_MIN) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
        ya_lo_hice = false;
    }

    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList(currentCategoriesArray){

    if (currentCategoriesArray.length === 0) {
        document.getElementById("subtitulo-category").innerHTML = `<p class="lead">No hay categorías para este sitio.</p>`;
        document.getElementById("cat-list-container").innerHTML = "";
    }
    else {
        document.getElementById("subtitulo-category").innerHTML = `<p class="lead">Verás aquí todas las categorías del sitio.</p>`;
        
        let htmlContentToAppend = "";
        if (toggle === true) {
            for(let i = 0; i < currentCategoriesArray.length; i++){
                let category = currentCategoriesArray[i];
    
                if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
                    ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){
    
                    htmlContentToAppend += `
                    <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                        <div class="row">
                            <div class="col-3">
                                <img src="${category.imgSrc}" alt="${category.description}" class="p-0 img-thumbnail">
                            </div>
                            <div class="col">
                                <div class="d-flex w-100 justify-content-between">
                                    <h4 class="mb-1">${category.name}</h4>
                                    <small class="text-muted">${category.productCount} artículos</small>
                                </div>
                                <p class="mb-1">${category.description}</p>
                            </div>
                        </div>
                    </div>
                    `
                }
    
            }
        }
        else {
            for(let i = 0; i < currentCategoriesArray.length; i++){
                let category = currentCategoriesArray[i];
    
                if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
                    ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))){
    
                    htmlContentToAppend += `
                    <div class="col-md-3" onclick="setCatID(${category.id})">
                        <div class="card mb-4 shadow-sm custom-card cursor-active card_hover" id="autos">
                            <img class="bd-placeholder-img card-img-top" src="${category.imgSrc}" alt="${category.description}">
                            <h4 class="m-3">${category.name}</h4>
                            <div class="card-body">
                                <p class="card-text">${category.description}</p>
                                <small class="text-muted">${category.productCount}vendidos</small> 
                            </div>
                        </div>
                    </div> 
                    `
                }
    
            }
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList(currentCategoriesArray);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
const GOLD = 0.13;
document.addEventListener("DOMContentLoaded", async (e) =>{

    toggle = media.matches ? false : true;

    await getJSONData(CATEGORIES_URL).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentCategoriesArray = resultObj.data

            const start = JSON.parse(localStorage.getItem("productStart"));
            const end = JSON.parse(localStorage.getItem("productEnd"));
            if (start || end) {
                const concatCat = start.concat(end).filter((item) => item !== null);
                if (concatCat) {
                    currentCategoriesArray.forEach((cat) => {
                        const existe = concatCat.filter(({category, percentage}) =>
                            category === cat.name &&
                            percentage === GOLD);
                        if (existe && existe.length > 0) 
                            cat.imgSrc = existe[0].image[0].dataURL
                        const pCount = concatCat.filter(element => element.category === cat.name);
                        if (pCount.length > 0) 
                            cat.productCount = pCount.length + parseInt(cat.productCount);
                    });
                }
            }
            
            showCategoriesList(currentCategoriesArray)
            //sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_ASC_BY_NAME);

        changeColor("asc", "desc", "count");
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowCategories(ORDER_DESC_BY_NAME);

        changeColor("desc", "asc", "count");
    });

    document.getElementById("sortByCount").addEventListener("click", () => {
        if (!ya_lo_hice) {
            document.getElementById("up-down").classList.remove("fa-sort-amount-down")
            document.getElementById("up-down").classList.add("fa-sort-amount-up")
            sortAndShowCategories(ORDER_BY_PROD_COUNT_MAX);
        }
        else {
            document.getElementById("up-down").classList.remove("fa-sort-amount-up")
            document.getElementById("up-down").classList.add("fa-sort-amount-down")
            sortAndShowCategories(ORDER_BY_PROD_COUNT_MIN);
        }

        changeColor("count", "asc", "desc");
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showCategoriesList(currentCategoriesArray);
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showCategoriesList(currentCategoriesArray);
    });

    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});


const searchBar = document.getElementById("searchBar")

searchBar.addEventListener("keyup", (e) => {
    const searchString = e.target.value;
    const filteredCategoriesArray = currentCategoriesArray.filter(category => {
        return category.name.toLowerCase().includes(searchString.toLowerCase()) || 
        category.description.toLowerCase().includes(searchString.toLowerCase()) ||
        category.productCount.toString().includes(searchString);
    })
    showCategoriesList(filteredCategoriesArray);
    if (filteredCategoriesArray.length === 0) {
        document.getElementById("subtitulo-category").innerHTML = `
        <p class="lead">No hay categorías que coincidan con tu búsqueda.</p>
        `
        document.getElementById("cat-list-container").innerHTML = "";
    }
})


function X() {
    var searchString = document.getElementById("searchBar").value;
    if (searchString.length === 0) {
        showCategoriesList(currentCategoriesArray);
    }
}

window.addEventListener("resize" , function() {
    if (this.window.innerWidth <= 760 && toggle === false) {
        showCategoriesList(currentCategoriesArray);
        toggle = true;
    }
    else if (this.window.innerWidth > 760 && toggle === true) {
        showCategoriesList(currentCategoriesArray)
        toggle = false;
    }
})