let productArray = [];

document.addEventListener("DOMContentLoaded", async () => {

    const productBuyArray = JSON.parse(localStorage.getItem("productBuyArray"));

    const productJSON = await getJSONData(CART_INFO);
    if (productJSON.status === "ok") {
        productArray = productJSON.data.articles;
    }

    /* si existe productBuyArray, entonces se concatena con productsArray, si hay repetidos, se suma "count"*/
    if (productBuyArray) {
       /* Si hayID === false, el productJSON se concatena con productBuyArray. Si hayID === true, no se concatena */
        if (localStorage.getItem("hayJSONid") === "true") {
            productArray = productBuyArray;
        }
        /* Si hayID === true, se suma "count" */
        if (localStorage.getItem("hayJSONid") === "false") {
            productArray = productArray.map(product => {
                productBuyArray.forEach(productBuy => {
                    if (productBuy.id === product.id) {
                        product.count += productBuy.count;
                    }
                });
                return product;
            });

            productArray = productArray.concat(productBuyArray);

            /* si hay dos con la misma id, borra uno */
            productArray = productArray.filter((product, index, self) =>
                index === self.findIndex((t) => (
                    t.id === product.id
                ))
            )

        }

        showBuyList();
        
    }
    else if ((localStorage.getItem("hayJSONid") === "false")) {
        showBuyList();
    }
    else {
        document.getElementById("products-containers").innerHTML = `<p>No hay productos en el carrito</p>`;
    }

})

function showBuyList() {

    let htmlContentToAppend = "";
    
    if (productArray && productArray.length !== 0) {

        updateTotalCosts(productArray);

        for (let i = 0; i < productArray.length; i++) {
            const product = productArray[i];

            htmlContentToAppend += `
            <div class="list-group-item">
                <div class="row">
                <div class="col-3">
                    <img src="${product.image}" class="p-0 img-thumbnail cursor-active" onclick="tp(${product.id})">
                </div>
                <div class="col-4 d-flex">
                    <div class="d-flex w-100 justify-content-start align-items-center">
                    <div class="mb-1">
                        <h4>${product.name}</h4> 
                        <p class="mb-1">${product.currency} ${product.unitCost}</p> 
                    </div>
                    </div>
                </div>
                <div class="col-2 d-flex">
                    <div class="d-flex align-items-center justify-content-center">
                    <div class="input-group input-width">
                        <input onchange="changeTotal(event, productArray[${i}])" type="number" class="form-control" id="onchangeInput"
                        placeholder="1" min="0" max="${product.stock === null ? 9 : product.stock}" value="${product.count ? product.count : 1}">
                    </div>
                    </div>
                </div>
                <div class="col-3 d-flex justify-content-end">
                    <div class="d-flex align-items-center ">
                    <i class="fa fa-trash h1" onclick="remove(${product.id})"></i>
                    </div>
                </div>
                </div>
            </div>
            `
        }
    }
    else {
        htmlContentToAppend = `<p>No hay productos en el carrito</p>`;
    }

    document.getElementById("products-containers").innerHTML = htmlContentToAppend;
}

function tp(id) {
    localStorage.setItem("product-info", id);
    window.location.href = "product-info.html"
}

function remove(id) {
    if (confirm("¿Está seguro que desea eliminar el producto?")) {
        /* Remueve el producto que sea igual a "id", si es el primer elemento de la array, pone hayID en true */
        productArray = productArray.filter(product => {
            if (product.id === id) {
                localStorage.setItem("hayJSONid", true);
            }
            return product.id !== id;
        });
        if (localStorage.getItem("productBuyArray")) {
            localStorage.setItem("productBuyArray", JSON.stringify(productArray));
        }
        /* actualiza la pagina */
        showBuyList();
        return true;
    }
    else {
        return false;
    }
}


function changeTotal(e, info) {
    if (parseInt(e.target.value) === 0) {
        const removed = remove(info.id);
        if (!removed) {
            e.target.value = 1;
        }
    }
    else {
        /* agarra el total y lo suma a la multiplicacion del costo con e.target.value */
        let subtotalCost = document.getElementById("subtotal-value");

        const subtotal = parseInt(subtotalCost.innerHTML.split("U$S")[1]) + (info.unitCost * e.target.value);

        subtotalCost.innerHTML = `U$S ${subtotal}`;

        document.getElementById("total-value").innerHTML = `U$S ${subtotal}`;
    }
}

// (info.unitCost * info.count)

/* actualiza el precio cuando se agrega un item */
function updateTotalCosts(productA){

    let subtotal = 0;

    for (let i = 0; i < productA.length; i++) {
        const product = productA[i];
        subtotal = subtotal + (product.unitCost * product.count);
    }

    document.getElementById("subtotal-value").innerHTML = `U$S ${subtotal}`

    document.getElementById("total-value").innerHTML = `U$S ${subtotal}`;
}
