let productArray = [];

document.addEventListener("DOMContentLoaded", async () => {

    const productBuyArray = JSON.parse(localStorage.getItem("productBuyArray"));

    if (productBuyArray && productBuyArray.length !== 0) {
        productArray = productBuyArray;
        showBuyList()  
    }
    else if (localStorage.getItem("hayJSONid") === "false") {
        const productJSON = await getJSONData(CART_INFO);
        if (productJSON.status === "ok") {
            productArray = productJSON.data.articles;
            for (let i = 0; i < productArray.length; i++) {
                const element = productArray[i];
                element.stock = 9;
            }
            showBuyList();
        }
    }
    else {
        document.getElementById("products-containers").innerHTML = `
        <p>No hay productos en el carrito</p>
        `
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
        updateTotalCosts(productArray);
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
        info.count = parseInt(e.target.value);
        updateTotalCosts(productArray);
    }
    
    productArray = productArray.map(product => {
        if (product.id === info.id) {
            product.count = e.target.value;
        }
        return product;
    });
    localStorage.setItem("productBuyArray", JSON.stringify(productArray));
}

let perccentage = 0;

/* actualiza el precio cuando se agrega un item */
function updateTotalCosts(productA){

    let subtotal = 0;

    for (let i = 0; i < productA.length; i++) {
        const product = productA[i];
        subtotal = subtotal + (product.unitCost * product.count);
    }

    document.getElementById("subtotal-value").innerHTML = `U$S ${subtotal}`

    let shipping = 0;

    if (perccentage !== 0) {
        shipping = subtotal * perccentage
    }
    
    document.getElementById("total-value").innerHTML = `U$S ${Math.round(subtotal + shipping, -1)}`;
}

document.getElementById("gold").addEventListener("click", function () {
    document.getElementById("shipping-value").textContent = "3%";
    perccentage = 0.03;
    updateTotalCosts(productArray);
})

document.getElementById("premium").addEventListener("click", function () {
    document.getElementById("shipping-value").textContent = "7%";
    perccentage = 0.07;
    updateTotalCosts(productArray);
})

document.getElementById("estandar").addEventListener("click", function () {
    document.getElementById("shipping-value").textContent = "13%";
    perccentage = 0.13;
    updateTotalCosts(productArray);
})

document.getElementById("free-shipping").addEventListener("click", function () {
    document.getElementById("shipping-value").textContent = "Gratis";
    perccentage = 0;
    updateTotalCosts(productArray);
})

/* add modal checkout when click in "Comprar" */
document.getElementById("buy").addEventListener("click", function () {
    if (localStorage.getItem("productBuyArray") && JSON.parse(localStorage.getItem("productBuyArray")).length !== 0) {
        document.getElementById("checkoutModal").innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Checkout</h4>
                <button type="button" class="close" data-dismiss="modal" onclick="refresh()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="name">Nombre</label>
                    <input type="text" class="form-control" id="name" placeholder="Ingrese su nombre">
                </div>
                <div class="form-group">
                    <label for="surname">Apellido</label>
                    <input type="text" class="form-control" id="surname" placeholder="Ingrese su apellido">
                </div>
                <div class="form-group">
                    <label for="phone">Teléfono</label>
                    <input type="number" class="form-control" id="phone" placeholder="Ingrese su número de teléfono">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Ingrese su email">
                </div>
                <div class="form-group">
                    <label for="address">Dirección</label>
                    <input type="text" class="form-control" id="address" placeholder="Ingrese su dirección">
                </div>
                <div class="form-group">
                    <label for="credit-card">Tarjeta de crédito</label>
                    <input type="number" class="form-control" id="credit-card" placeholder="Ingrese su número de tarjeta de crédito">
                </div>
                <div class="form-group">
                    <label for="credit-card">CVV</label>
                    <input type="number" class="form-control" id="cvv" placeholder="Ingrese su número de CVV">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="refresh()">Cancelar</button>
                <button type="button" class="btn btn-success" onclick="confirmBuy()">Comprar</button>
            </div>
            </div>
        </div>
        `
    }
    else {
        alert("No hay productos para comprar");
    }
})

function confirmBuy() {
    localStorage.setItem("productBuyArray", JSON.stringify([]));
    localStorage.setItem("hayJSONid", true);
    document.getElementById("checkoutModal").innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Resumen de compra</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="refresh()">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Gracias por su compra!</p>
                <p>Se le enviará un correo con los detalles de su compra.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="refresh()">Cerrar</button>
            </div>
        </div>
    </div>
    `
    document.getElementById("products-containers").innerHTML = `<p>No hay productos en el carrito</p>`;
}

function refresh() {
    location.reload();
}