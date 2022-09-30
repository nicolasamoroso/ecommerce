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
            localStorage.setItem("productBuyArray", JSON.stringify(productArray));
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

let creditCardName = "Ninguna"

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
    else if (!phone || validatePhone(phone)) alert("Ingrese un número de teléfono valido");
    else if (!email || validateEmail(email)) alert("Ingrese un email valido");
    else if (!address) alert("Ingrese una dirección valida");
    else if (!creditCard || validateCreditCard(creditCard)) alert("Ingrese un número de tarjeta de crédito valido");
    else if (!cvv || validateCVV(cvv)) alert("Ingrese un número de CVV valido");
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