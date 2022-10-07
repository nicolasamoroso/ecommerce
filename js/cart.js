let productArray = []
let typeOfCurrency = "USD"

document.addEventListener("DOMContentLoaded", async () => {
    const productBuyArray = JSON.parse(localStorage.getItem("productBuyArray"))

    document.getElementById("subtotal-value").innerText = typeOfCurrency + " 0"
    document.getElementById("total-value").innerText = typeOfCurrency + " 0"

    document.getElementById("date").min = diaDeHoy()

    if (productBuyArray && productBuyArray.length !== 0) {
        productArray = productBuyArray;
        showBuyList(productArray.length)  
    }
    else if (localStorage.getItem("hayJSONid") === "false") {
        const productJSON = await getJSONData(CART_INFO)
        if (productJSON.status === "ok") {
            productArray = productJSON.data.articles
            productArray[0].stock = Math.round(40000/productArray[0].unitCost) === 0 ? 1 : Math.round(40000/productArray[0].unitCost)
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
    const btnBuy = document.getElementById("buy")

    if (!localStorage.getItem("productBuyArray") || JSON.parse(localStorage.getItem("productBuyArray")).length === 0) {
        btnBuy.removeAttribute("data-toggle")
        btnBuy.removeAttribute("data-target")
        return alert("No hay productos para comprar")
    }

    document.getElementById("Modal").classList.add = "show"

    btnBuy.setAttribute("data-toggle", "modal")
    btnBuy.setAttribute("data-target", "#Modal")

    const profileArray = JSON.parse(localStorage.getItem("profile"))

    if (profileArray) {
        const profile = profileArray.find(({logged}) => {
            return  logged === true
        })

        if (profile) {
            const name_lastname = profile.name_lastname.split(" ")
            const name = name_lastname[0]
            const lastname = name_lastname[1]

            document.getElementById("name").value = name ?? ""
            document.getElementById("surname").value = lastname ?? ""
            document.getElementById("email").value = profile.email ?? ""
            document.getElementById("phone").value = profile.phone ?? ""
            document.getElementById("street").value = profile.street ?? ""
            document.getElementById("number").value = profile.number ?? ""
            document.getElementById("department").value = profile.department ?? ""
        }
    }

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
        <div class="col-3">
            <a href="products.html" class="prev"> <i class="fa-solid fa-arrow-left"></i> Continuar comprando </a>    
        </div>
    </div>
    `

    if (productArray && productArray.length !== 0) {
        updateTotalCosts(productArray)

        for (let i = 0; i < productArray.length; i++) {
            let {image, id, name, currency, unitCost, stock, count} = productArray[i];
            document.getElementById("items").innerHTML += `
            <div class="row">
                <div class="col-4">
                    <img src="${image}" class="p-0 img-thumbnail cursor-active imgProductCart" onclick="goBack(${id})" width="200px">
                </div>
                <div class="col-8">
                    <div class="d-flex justify-content-between">
                        <h5 class="card-title cursor-active" onclick="goBack(${id})">${name}</h5>
                        <h5 class="card-title fw-bold" id="totalPerProduct-${i}">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i) * count}</h5>
                    </div>
                    <h5 class="card-title text-muted">${typeOfCurrency} ${verifyCurrency(currency, unitCost, i)}</h5>
                    <p class="card-text text-success fw-bold">${stock} In Stock</p>
                    <div class="d-flex justify-content-between cartList align-items-end flex-column">
                        <div class="d-flex count_delete">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <button class="btn minus" type="button" onmouseup="mouseUp()" onmousedown="mouseDown('negative', ${id})">-</i></button>
                                </div>
                                <label class="cart_counter" id="countProduct-${i}">${count ?? 1}</label>
                                <div class="input-group-append">
                                    <button class="btn plus" type="button" onmouseup="mouseUp()" onmousedown="mouseDown('positive', ${id})">+</button>
                                </div>
                            </div>
                            <i class="fa-solid fa-trash h2 mt-2" onclick="remove(${id})"></i>
                        </div>
                    </div>
                </div>
            </div>
            <hr>        
            `
        }
    }
    else document.getElementById("table").innerHTML = noHayProductos()
}

let startTime = 0
let stepInterval = 1;
let intTime = "500"
let count = 0

function mouseUp() {
    clearTimeout(count)
    }

    function mouseDown(type, id) {
        startTime = new Date().getTime()
        const i = productArray.findIndex(product => product.id === id)

        stepInterval = () => {
            const newTime = new Date().getTime();
            const elapsedTime = newTime - startTime;
            if (productArray[i].count === 1 && type === "negative") {
                remove(id)
                return
            }
            
            if (elapsedTime < 1000) {
                productArray[i].count = type === "positive" ? productArray[i].count + 1 : productArray[i].count - 1
                intTime = "500"
            }
            else if (elapsedTime < 2000) {
                productArray[i].count = type === "positive" ? productArray[i].count + 2 : productArray[i].count - 2
            intTime = "250"
        }
        else if (elapsedTime < 3000) {
            productArray[i].count = type === "positive" ? productArray[i].count + 3 : productArray[i].count - 3
            intTime = "150"
        }
        else if (elapsedTime < 6000) {
            productArray[i].count = type === "positive" ? productArray[i].count + 5 : productArray[i].count - 5
            intTime = "70"
        }
        else if (elapsedTime > 6000) {
            console.log("entro")
            productArray[i].count = type === "positive" ? productArray[i].count + 10 : productArray[i].count - 10
            intTime = "40"
        }
        
        if (productArray[i].count < 1) productArray[i].count = 1
        if (!productArray[i].stock) productArray[i].stock = 99
        if (productArray[i].count > productArray[i].stock) productArray[i].count = productArray[i].stock

        document.getElementById(`countProduct-${i}`).innerText = productArray[i].count
        localStorage.setItem("productBuyArray", JSON.stringify(productArray))
        
        updateTotalCosts(productArray)
        changeProductTotal(productArray[i].unitCost, productArray[i].count, i)

        count = setTimeout(stepInterval, intTime);
    }
    stepInterval()
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
    document.getElementById(`totalPerProduct-${i}`).innerText = `${typeOfCurrency} ${
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
    const department = document.getElementById("department").value
    const creditCard = document.getElementById("credit-card").value
    const cvv = document.getElementById("cvv").value
    const date = document.getElementById("date").value

    if (!name) alert("Ingrese un nombre valido")
    else if (!surname) alert("Ingrese un apellido valido")
    else if (!phone || validatePhone(phone)) alert("Ingrese un número de teléfono valido (ej: 09XXXXXXXX)")
    else if (!email || validateEmail(email)) alert("Ingrese un email valido (ej: jane@example.com)")
    else if (!street) alert("Ingrese una calle valida")
    else if (!number || validateNumber(number)) alert("Ingrese un número valido")
    else if (!floor || floor.lenght > 15) alert("Ingrese un piso valido")
    else if (!corner) alert("Ingrese un esquina valida")
    else if (!department) alert("Ingrese una ciudad valida")
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

        document.getElementById("dayOfArrival").innerHTML = `
        <div class="modal fade show" id="Modal2" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Gracias por su compra!</h4>
                        <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p id="days"></p>
                    </div>
                </div>
            </div>
        </div>
        `

        document.getElementById("days").innerText = DiaDeLlegada(dia, envio, day, date)

        setTimeout(() => {
            modal2.classList.remove("show")
            document.querySelector(".modal-backdrop").remove()
        }, 4000)

        document.getElementById("table").innerHTML = noHayProductos()
        document.getElementById("subtotal-value").innerText = typeOfCurrency + " 0"
        document.getElementById("total-value").innerText = typeOfCurrency + " 0"
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