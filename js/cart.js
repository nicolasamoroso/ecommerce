let productArray = []
let typeOfCurrency = "USD"

document.addEventListener("DOMContentLoaded", async () => {
    const productBuyArray = JSON.parse(localStorage.getItem("productBuyArray"))

    document.getElementById("subtotal-value").innerText = typeOfCurrency + " 0"
    document.getElementById("total-value").innerText = typeOfCurrency + " 0"

    if (productBuyArray && productBuyArray.length !== 0) {
        productArray = productBuyArray;
        showBuyList(productArray.length)  
    }
    else if (localStorage.getItem("hayJSONid") === "false") {
        const productJSON = await getJSONData(CART_INFO)
        if (productJSON.status === "ok") {
            productArray = productJSON.data.articles
            localStorage.setItem("productBuyArray", JSON.stringify(productArray));
            showBuyList(1)
        }
    }
    else document.getElementById("table").innerHTML = noHayProductos()
})

document.getElementById("premium").addEventListener("click", function () {
    document.getElementById("shipping-value").textContent = "15%"
    perccentage = 0.15
    updateTotalCosts(productArray)
})
document.getElementById("express").addEventListener("click", function () {
    document.getElementById("shipping-value").textContent = "7%"
    perccentage = 0.07
    updateTotalCosts(productArray)
})
document.getElementById("standard").addEventListener("click", function () {
    document.getElementById("shipping-value").textContent = "5%"
    perccentage = 0.05
    updateTotalCosts(productArray)
})
document.getElementById("free-shipping").addEventListener("click", function () {
    document.getElementById("shipping-value").textContent = "Gratis"
    perccentage = 0
    updateTotalCosts(productArray)
})
document.getElementById("usd").addEventListener("click", function () {
    typeOfCurrency = "USD"
    showBuyList(productArray.length)
    updateTotalCosts(productArray)
})
document.getElementById("uyu").addEventListener("click", function () {
    typeOfCurrency = "UYU"
    showBuyList(productArray.length)
    updateTotalCosts(productArray)
})

let creditCardName = "Ninguna"
document.getElementById("buy").addEventListener("click", function () {
    if (localStorage.getItem("productBuyArray") && JSON.parse(localStorage.getItem("productBuyArray")).length !== 0)
        document.getElementById("Modal").classList.add = "show"
    else return alert("No hay productos para comprar")

    document.getElementById("credit-card").addEventListener("keyup", function(e) {
        let credit = "Otra"
        if (e.target.value.startsWith("4")) 
            credit = "Visa"
        else if (e.target.value.startsWith("51") || e.target.value.startsWith("55")) 
            credit = "MasterCard"

        if (credit !== creditCardName) {
            creditCardName = credit;
            if (credit === "Visa")
                document.getElementById("creditCardID").src = "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
            else if (credit === "MasterCard")
                document.getElementById("creditCardID").src = "https://www.svgrepo.com/show/328141/mastercard.svg"
            else
                document.getElementById("creditCardID").src = "https://www.svgrepo.com/show/400136/creditcard.svg"
        }
    })
})

function showBuyList(lenght) {
    document.getElementById("table").innerHTML = `
    <div class="card-body card">
        <h4 class="card-title">Mi Carrito (${lenght} Artículos)</h4>
        <hr>
        <div id="items"></div>
        <a href="products.html" class="prev"> <i class="fa-solid fa-arrow-left"></i> Continuar comprando </a>    
    </div>
    `

    if (productArray && productArray.length !== 0) {
        updateTotalCosts(productArray)

        for (let i = 0; i < productArray.length; i++) {
            let {image, id, name, currency, unitCost, description, count} = productArray[i];
            document.getElementById("items").innerHTML += `
            <div class="row">
                <div class="col-4">
                    <img src="${image}" class="p-0 img-thumbnail cursor-active imgProductCart" onclick="goBack(${id})" width="200px">
                </div>
                <div class="col-8">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title cursor-active" onclick="goBack(${id})">${name}</h5>
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
                    </div>
                    <div class="d-flex justify-content-end align-items-end">
                        <h5 class="card-title fw-bold" id="totalPerProduct-${i}">Subtotal: ${typeOfCurrency} ${verifyCurrency(currency, unitCost, i) * count}</h5>
                    </div>
                </div>
            </div>
            <hr>
            `
        }
    }
    else document.getElementById("table").innerHTML = noHayProductos()
}

function verifyCurrency(currency, unitCost) {
    if (currency === "UYU") {
        if (typeOfCurrency === "USD") return `${Math.trunc(unitCost / 42)}`
        else return `${unitCost}`
    }
    else {
        if (typeOfCurrency === "UYU") return `${Math.trunc(unitCost * 42)}`
        else return `${unitCost}`
    }
}

function goBack(id) {
    localStorage.setItem("product-info", id)
    window.location.href = "product-info.html"
}

function remove(id) {
    if (confirm("¿Está seguro que desea eliminar el producto?")) {
        productArray = productArray.filter(product => {
            if (product.id === id) localStorage.setItem("hayJSONid", true)
            return product.id !== id
        });
        localStorage.setItem("productBuyArray", JSON.stringify(productArray))
        showBuyList(productArray.length)
        return true
    }
    return false
}

function changeTotal(type, id) {
    const i = productArray.findIndex(product => product.id === id)
    let count = type === "positive" ? productArray[i].count + 1 : productArray[i].count - 1

    if (count < 1) {
        const removed = remove(id)
        if (!removed) count = 1
    }

    if (productArray.length !== 0) {
        if (!productArray[i].stock) productArray[i].stock = 99
        if (productArray[i].stock >= count) {
            productArray[i].count = count
            localStorage.setItem("productBuyArray", JSON.stringify(productArray))
            document.getElementById(`countProduct-${i}`).innerText = count
            updateTotalCosts(productArray)
            changeProductTotal(productArray[i].unitCost, count, i)
        }
    }
}

function changeProductTotal(unitCost, count, i) {
    document.getElementById(`totalPerProduct-${i}`).innerText = `Total: ${typeOfCurrency} ${
        verifyCurrency(productArray[i].currency, unitCost, i) * count
    }
    `
}

let perccentage = 0
function updateTotalCosts(productA){
    let subtotal = 0
    for (let i = 0; i < productA.length; i++) {
        const product = productA[i]
        subtotal = subtotal + (verifyCurrency(product.currency, product.unitCost) * product.count)
    }
    document.getElementById("subtotal-value").innerHTML = `${typeOfCurrency} ${subtotal}`

    let shipping = 0
    if (perccentage !== 0) shipping = subtotal * perccentage
    document.getElementById("total-value").innerHTML = `${typeOfCurrency} ${Math.round(subtotal + shipping, -1)}`
}

function diaDeHoy() {
    const split_day = new Date().toISOString().slice(0, 10).split("-")
    return split_day[0] + "-" + split_day[1]
}

function validateEmail(email) {
    const emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    return !emailReg.test(email)
}

function validateNumber(number) {
    const numberReg = /^([0-9]{3,4})$/
    return !numberReg.test(number)
}

function validatePhone(phone) {
    const phoneReg = /^([0]{1})+([9]{1})+([0-9]{1})+([0-9]{3})+([0-9]{3})$/
    return !phoneReg.test(phone)
}

function validateCreditCard(creditCard) {
    const creditCardReg = /^([0-9]{4})+([0-9]{4})+([0-9]{4})+([0-9]{4})$/;
    return !creditCardReg.test(creditCard)
}

function validateCVV(cvv) {
    const cvvReg = /^([0-9]{3})$/
    return !cvvReg.test(cvv)
}

function confirmBuy() {

    const name = document.getElementById("name").value
    const surname = document.getElementById("surname").value
    const phone = document.getElementById("phone").value
    const email = document.getElementById("email").value
    const street = document.getElementById("street").value
    const number = document.getElementById("number").value
    const floor = document.getElementById("floor").value
    const corner = document.getElementById("corner").value
    const city = document.getElementById("city").value
    const creditCard = document.getElementById("credit-card").value
    const cvv = document.getElementById("cvv").value
    const date = document.getElementById("date").value
    
    if (!name) alert("Ingrese un nombre valido")
    else if (!surname) alert("Ingrese un apellido valido")
    else if (!phone || validatePhone(phone)) alert("Ingrese un número de teléfono valido (ej: 099999999)")
    else if (!email || validateEmail(email)) alert("Ingrese un email valido (ej: jane@example.com)")
    else if (!street) alert("Ingrese una calle valida")
    else if (!number || validateNumber(number)) alert("Ingrese un número valido")
    else if (!floor || floor.lenght > 15) alert("Ingrese un piso valido")
    else if (!corner) alert("Ingrese un esquina valida")
    else if (!city) alert("Ingrese una ciudad valida")
    else if (!creditCard || validateCreditCard(creditCard)) alert("Ingrese un número de tarjeta de crédito valido (ej: 9999999999999999)")
    else if (!cvv || validateCVV(cvv)) alert("Ingrese un número de CVV valido (ej: 999)")
    else if (!date) alert("Ingrese una fecha de vencimiento valida")
    else {
        localStorage.setItem("productBuyArray", JSON.stringify([]))
        localStorage.setItem("hayJSONid", true)

        document.getElementById("Modal").classList.remove("show")
        document.querySelector(".modal-backdrop").remove()
        
        const d = new Date()
        let day = d.getDay()
        let date = d.getDate()
        
        const dia = {
            0: "Domingo",
            1: "Lunes",
            2: "Martes",
            3: "Miércoles",
            4: "Jueves",
            5: "Viernes",
            6: "Sábado"
        }

        const envio = {
            0.15 : [2, 5],
            0.07 : [5, 8],
            0.05 : [12, 15],
            0 : [0]
        }

        document.getElementById("days").innerText = DiaDeLlegada(dia, envio, day, date)
        const modal2 = document.getElementById("Modal2");
        modal2.classList.add("show")

        setTimeout(() => {
            modal2.classList.remove("show")
            document.querySelector(".modal-backdrop").remove()
        }, 4000)

        document.getElementById("table").innerHTML = noHayProductos()
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

function DiaDeLlegada(dia, envio, day, date) {
    if (envio[perccentage][0] === 0)
        return `Su compra se puede retirar en el local a las 12:00hs del ${dia[day+1]}`

    let dayOfArrival = {
        0: day + envio[perccentage][0],
        1: day + envio[perccentage][1]
    }

    let dateOfArrival = {
        0: date + envio[perccentage][0],
        1: date + envio[perccentage][1]
    }

    if (dayOfArrival[0] > 6) 
        while (dayOfArrival[0] > 6) 
            dayOfArrival[0] -= 7
        
    if (dayOfArrival[1] > 6) 
        while (dayOfArrival[1] > 6) 
            dayOfArrival[1] -= 7
        
    return `Su compra llegará entre los días ${dia[dayOfArrival[0]]} ${dateOfArrival[0]} y ${dia[dayOfArrival[1]]} ${dateOfArrival[1]}`
}