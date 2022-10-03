let productArray = [];

let typeOfCurrency = "USD";

document.addEventListener("DOMContentLoaded", async () => {

    const productBuyArray = JSON.parse(localStorage.getItem("productBuyArray"));

    SummaryOfPurchase()

    if (productBuyArray && productBuyArray.length !== 0) {
        productArray = productBuyArray;
        showBuyList(productArray.length)  
    }
    else if (localStorage.getItem("hayJSONid") === "false") {
        const productJSON = await getJSONData(CART_INFO);
        if (productJSON.status === "ok") {
            productArray = productJSON.data.articles;
            for (let i = 0; i < productArray.length; i++) {
                const element = productArray[i];
                element.stock = 9;
            }
            localStorage.setItem("productBuyArray", JSON.stringify(productArray));
            showBuyList(1);
        }
    }
    else {
        document.getElementById("table").innerHTML = noHayProductos()
    }
})

function SummaryOfPurchase() {
    document.getElementById("summary").innerHTML = `
    <div class="card-body card">
        <h4 class="card-title">Resumen de la compra</h4>
        <hr>
        <div>
            <div class="row">
                <div class="col-12">
                    <div class="row">
                        <div class="col-12">
                            <h6 class="card-subtitle mb-2">Tipo de moneda</h6>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="currency" id="usd" value="USD" checked>
                                <label class="form-check-label" for="usd">
                                    Dólares
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="currency" id="uyu" value="UYU">
                                <label class="form-check-label" for="uyu">
                                    Pesos Uruguayos
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-12">
                    <p class="card-text" id="subtotal">Subtotal
                        <span class="float-end" id="subtotal-value">0</span>
                    </p>
                </div>
                <div class="col-12">
                    <p class="card-text">Envío
                        <span class="float-end" id="shipping-value">Gratis</span>
                    </p>
                </div>
                <div class="col-12">
                    <p class="card-text">Total
                        <span class="float-end" id="total-value">0</span>
                    </p>
                </div>
            </div>
            <hr>
            <div class="row">
                <h3 class="mb-3">Tipo de envío</h3>
                <div class="col-12">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="shipping" id="free-shipping" checked>
                        <label class="form-check-label" for="free-shipping">
                            Retiro en el local (Gratis)
                        </label>
                    </div>
                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="shipping" id="premium">
                            <label class="form-check-label" for="premium">
                                Premium 2 a 5 días (15%)
                            </label>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="shipping" id="express">
                            <label class="form-check-label" for="express">
                                Express 5 a 8 días (7%)
                            </label>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="shipping" id="standard">
                            <label class="form-check-label" for="standard">
                                Standard 12 a 15 días (5%)
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <button id="buy" class="btn btn-success button_checkout mt-2">Checkout</button>
        </div>
    </div>
    `

    document.getElementById("premium").addEventListener("click", function () {
        document.getElementById("shipping-value").textContent = "15%";
        perccentage = 0.15;
        updateTotalCosts(productArray);
    })
    
    document.getElementById("express").addEventListener("click", function () {
        document.getElementById("shipping-value").textContent = "7%";
        perccentage = 0.07;
        updateTotalCosts(productArray);
    })
    
    document.getElementById("standard").addEventListener("click", function () {
        document.getElementById("shipping-value").textContent = "5%";
        perccentage = 0.05;
        updateTotalCosts(productArray);
    })
    
    document.getElementById("free-shipping").addEventListener("click", function () {
        document.getElementById("shipping-value").textContent = "Gratis";
        perccentage = 0;
        updateTotalCosts(productArray);
    })

    document.getElementById("usd").addEventListener("click", function () {
        typeOfCurrency = "USD"
        showBuyList(productArray.length)
    })

    document.getElementById("uyu").addEventListener("click", function () {
        typeOfCurrency = "UYU"
        showBuyList(productArray.length)
    })

    let creditCardName = "Ninguna"

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
                        <input type="text" class="form-control" id="name" placeholder="Jane" onkeydown="return /[a-z]/i.test(event.key)">
                    </div>
                    <div class="form-group">
                        <label for="surname">Apellido</label>
                        <input type="text" class="form-control" id="surname" placeholder="Doe" onkeydown="return /[a-z]/i.test(event.key)">
                    </div>
                    <div class="form-group">
                        <label for="phone">Teléfono</label>
                        <input type="number" class="form-control" id="phone" placeholder="099 999 999" min="0">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" placeholder="jane@example.com">
                    </div>
                    <div class="form-group">
                        <label for="address">Dirección</label>
                        <input type="text" class="form-control" id="address" placeholder="Ingrese su dirección">
                    </div>
                    <div class="form-group">
                        <label for="credit-card">Tarjeta de crédito</label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="credit-card" placeholder="xxxx xxxx xxxx xxxx" min="0">
                            <img src="https://www.svgrepo.com/show/400136/creditcard.svg" width="50px" id="creditCardID" class="imgCreditCard">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="credit-card">CVV</label>
                        <input type="number" class="form-control" id="cvv" placeholder="xxx" min="0">
                    </div>
                    <div class="form-group">
                        <label for="credit-card">Fecha de vencimiento</label>
                        <input type="month" class="form-control" id="date" placeholder="xx/xx" min="${diaDeHoy()}">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" onclick="confirmBuy()">Comprar</button>
                    <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="refresh()">Cancelar</button>
                </div>
                </div>
            </div>
            `
        }
        else {
            alert("No hay productos para comprar");
        }

        document.getElementById("credit-card").addEventListener("keyup", function(e) {
            let credit = "Otra"
            if (e.target.value.startsWith("4")) {
                credit = "Visa"
            }
            else if (e.target.value.startsWith("51") || e.target.value.startsWith("55")) {
                credit = "MasterCard"
            }
            else {
                credit = "Otra"
            }
            if (credit !== creditCardName) {
                creditCardName = credit;
                if (credit === "Visa") {
                    document.getElementById("creditCardID").src = "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                }
                else if (credit === "MasterCard") {
                    document.getElementById("creditCardID").src = "https://www.svgrepo.com/show/328141/mastercard.svg"
                }
                else  {
                    document.getElementById("creditCardID").src = "https://www.svgrepo.com/show/400136/creditcard.svg"
                }
            }
        })
    })
}

function showBuyList(lenght) {

    document.getElementById("table").innerHTML = `
    <div class="card-body card">
        <h4 class="card-title">Mi Carrito (${lenght} Artículos)</h4>
        <hr>
        <div id="items"></div>
        <a href="products.html" class="prev"> <i class="fa-solid fa-arrow-left"></i> Continuar comprando </a>
            
    </div>
    `

    let htmlContentToAppend = ""
    if (productArray && productArray.length !== 0) {

        updateTotalCosts(productArray)

        for (let i = 0; i < productArray.length; i++) {
            let {image, id, name, currency, unitCost, description, count} = productArray[i];

            htmlContentToAppend += `

            <div class="row mt-3">
                <div class="col-4">
                    <img src="${image}" class="p-0 img-thumbnail cursor-active" onclick="tp(${id})">
                </div>
                <div class="col-8">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title cursor-active" onclick="tp(${id})">${name}</h5>
                        <h5 class="card-title text-muted">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i)}</h5>
                    </div>
                    <p class="card-text text-muted">${description ?? 'El modelo de auto que se sigue renovando y manteniendo su prestigio en comodidad.'}</p>
                    <div class="d-flex justify-content-between align-items-end">
                        <div class="d-flex justify-content-start count_delete">
                            <div>
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <button class="btn" type="button" onclick="changeTotal('negative', ${id})">-</button>
                                    </div>
                                    <label class="cart_counter" id="countProduct-${i}">${count ?? 1}</label>
                                    <div class="input-group-append">
                                        <button class="btn" type="button" onclick="changeTotal('positive', ${id})">+</button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <i class="fa-solid fa-trash h2 mt-1" onclick="remove(${id})"></i>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end align-items-end">
                            <h5 class="card-title text-muted" id="totalPerProduct-${i}">Total: ${typeOfCurrency} ${verifyCurrency(currency, unitCost, i) * count}</h5>
                        </div>
                    </div>

                </div>
            </div>
            <hr>
            `
        }
    }
    else {
        document.getElementById("table").innerHTML = noHayProductos()
    }

    document.getElementById("items").innerHTML = htmlContentToAppend;
}

function verifyCurrency(currency, unitCost) {
    if (currency === "UYU") {
        if (typeOfCurrency === "USD") {
            return `${Math.trunc(unitCost / 42)}`
        }
        else
            return `${unitCost}`
    }
    else {
        if (typeOfCurrency === "USD")
            return `${unitCost}`
        else {
            return `${Math.trunc(unitCost * 42)}`
        }
    }
}

function tp(id) {
    localStorage.setItem("product-info", id);
    window.location.href = "product-info.html"
}

function remove(id) {
    if (confirm("¿Está seguro que desea eliminar el producto?")) {
        productArray = productArray.filter(product => {
            if (product.id === id) {
                localStorage.setItem("hayJSONid", true);
            }
            return product.id !== id;
        });
        if (localStorage.getItem("productBuyArray")) {
            localStorage.setItem("productBuyArray", JSON.stringify(productArray));
        }

        if (productArray.length === 0) 
            refresh()

        showBuyList(productArray.length);
        return true;
    }
    else {
        return false;
    }
}


function changeTotal(type, id) {
    
    const i = productArray.findIndex(product => product.id === id);
    let count = type === "positive" ? parseInt(productArray[i].count) + 1 : parseInt(productArray[i].count) - 1

    if (count < 1) {
        const removed = remove(id)
        if (!removed) count = 1
    }

    if (productArray.length !== 0) {
        if (!productArray[i].stock) productArray[i].stock = 99
        if (productArray[i].stock >= count) {
            productArray[i].count = count;
            localStorage.setItem("productBuyArray", JSON.stringify(productArray));
            document.getElementById(`countProduct-${i}`).innerText = count;
            updateTotalCosts(productArray);
            changeProductTotal(productArray[i].unitCost, count, i);
        }
    }

}

function changeProductTotal(unitCost, count, i) {
    
    document.getElementById(`totalPerProduct-${i}`).innerText = `Total: ${typeOfCurrency} ${
        verifyCurrency(productArray[i].currency, unitCost, i) * count
    }
    `
}

let perccentage = 0;

/* actualiza el precio cuando se agrega un item */
function updateTotalCosts(productA){

    let subtotal = 0;

    for (let i = 0; i < productA.length; i++) {
        const product = productA[i];
        subtotal = subtotal + (verifyCurrency(product.currency, product.unitCost) * product.count);
    }

    document.getElementById("subtotal-value").innerHTML = `${typeOfCurrency} ${subtotal}`

    let shipping = 0;

    if (perccentage !== 0) {
        shipping = subtotal * perccentage
    }
    
    document.getElementById("total-value").innerHTML = `${typeOfCurrency} ${Math.round(subtotal + shipping, -1)}`;
}

function diaDeHoy() {
    const split_day = new Date().toISOString().slice(0, 10).split("-")
    return split_day[0] + "-" + split_day[1];
    
}

function validateEmail(email) {
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    return !emailReg.test(email)
}

function validatePhone(phone) {
    const phoneReg = /^([0]{1})+([9]{1})+([0-9]{1})+([0-9]{3})+([0-9]{3})$/;
    return !phoneReg.test(phone)
}

function validateCreditCard(creditCard) {
    const creditCardReg = /^([0-9]{4})+([0-9]{4})+([0-9]{4})+([0-9]{4})$/;
    return !creditCardReg.test(creditCard)
}

function validateCVV(cvv) {
    const cvvReg = /^([0-9]{3})$/;
    return !cvvReg.test(cvv)
}

function confirmBuy() {
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const creditCard = document.getElementById("credit-card").value;
    const cvv = document.getElementById("cvv").value;
    const date = document.getElementById("date").value;

    
    if (!name) alert("Ingrese un nombre valido"); 
    else if (!surname) alert("Ingrese un apellido valido");
    else if (!phone || validatePhone(phone)) alert("Ingrese un número de teléfono valido (ej: 099999999)");
    else if (!email || validateEmail(email)) alert("Ingrese un email valido (ej: jane@example.com)");
    else if (!address) alert("Ingrese una dirección valida");
    else if (!creditCard || validateCreditCard(creditCard)) alert("Ingrese un número de tarjeta de crédito valido (ej: 9999999999999999)");
    else if (!cvv || validateCVV(cvv)) alert("Ingrese un número de CVV valido (ej: 999)");
    else if (!date) alert("Ingrese una fecha de vencimiento valida");
    else {
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
}

function refresh() {
    location.reload();
}

function noHayProductos() {
    return `
    <div class="card-body card">
        <h4 class="card-title">Mi Carrito (0 Artículos)</h4>
        <hr>
        <p>No hay productos en el carrito</p>
        <hr>
        <a href="products.html" class="prev"> <i class="fa-solid fa-arrow-left"></i> Continuar comprando </a>   
    </div>
    `
}