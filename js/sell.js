let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = "$";
let DOLLAR_CURRENCY = "Dólares (USD)";
let PESO_CURRENCY = "Pesos Uruguayos (UYU)";
let DOLLAR_SYMBOL = "USD ";
let PESO_SYMBOL = "UYU ";
let PERCENTAGE_SYMBOL = '%';
let MSG = "NO SE HA PODIDO AGREGAR LA PUBLICACIÓN";
const GOLD = 0.13;
const PREMIUM = 0.07;
const ESTANDAR  = 0.03;
let imgArray = [];

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts(){
    let unitProductCostHTML = document.getElementById("productCostText");
    let comissionCostHTML = document.getElementById("comissionText");
    let totalCostHTML = document.getElementById("totalCostText");

    let unitCostToShow = MONEY_SYMBOL + productCost;
    let comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL;
    let totalCostToShow = MONEY_SYMBOL + ((Math.round(productCost * comissionPercentage * 100) / 100) + parseInt(productCost));

    unitProductCostHTML.innerHTML = unitCostToShow;
    comissionCostHTML.innerHTML = comissionToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    document.getElementById("productCountInput").addEventListener("change", function(){
        productCount = this.value;
        updateTotalCosts();
    });

    document.getElementById("productCostInput").addEventListener("change", function(){
        productCost = this.value;
        updateTotalCosts();
    });

    document.getElementById("goldradio").addEventListener("change", function(){
        comissionPercentage = GOLD;
        updateTotalCosts();
    });
    
    document.getElementById("premiumradio").addEventListener("change", function(){
        comissionPercentage = PREMIUM;
        updateTotalCosts();
    });

    document.getElementById("standardradio").addEventListener("change", function(){
        comissionPercentage = ESTANDAR;
        updateTotalCosts();
    });

    document.getElementById("productCurrency").addEventListener("change", function(){
        if (this.value == DOLLAR_CURRENCY) {
            MONEY_SYMBOL = DOLLAR_SYMBOL;
        } 
        else if (this.value == PESO_CURRENCY) {
            MONEY_SYMBOL = PESO_SYMBOL;
        }

        updateTotalCosts();
    });


    //Configuraciones para el elemento que sube archivos
    let dzoptions = {
        url:"/",
        autoQueue: false
    };
    let myDropzone = new Dropzone("div#file-upload", dzoptions);

    myDropzone.on('thumbnail', function(dataURL) {
        imgArray.push(dataURL);
        console.log(imgArray);
    });
    
    myDropzone.on("maxfilesexceeded", function(file)
    {
        this.removeAllFiles();
        this.addFile(file);
    });


    //Se obtiene el formulario de publicación de producto
    let sellForm = document.getElementById("sell-info");

    //Se agrega una escucha en el evento 'submit' que será
    //lanzado por el formulario cuando se seleccione 'Vender'.
    sellForm.addEventListener("submit", function(e){

        e.preventDefault(); 
        e.preventDefault();

        let productNameInput = document.getElementById("productName");
        let productFile = document.getElementById("file-upload");
        let productDesc = document.getElementById("productDescription");
        let productCurrency = document.getElementById("productCurrency");
        let productCategory = document.getElementById("productCategory");
        let productCost = document.getElementById("productCostInput");
        let productCount = document.getElementById("productCountInput");
        let infoMissing = false;

        //Quito las clases que marcan como inválidos
        productNameInput.classList.remove('is-invalid');
        productFile.classList.remove('is-invalid');
        productDesc.classList.remove('is-invalid');
        productCurrency.classList.remove('is-invalid');
        productCategory.classList.remove('is-invalid');
        productCost.classList.remove('is-invalid');
        productCount.classList.remove('is-invalid');

        //Se realizan los controles necesarios,
        //En este caso se controla que se haya ingresado el nombre y categoría.
        //Consulto por el nombre del producto
        if (productNameInput.value === "") {
            productNameInput.classList.add('is-invalid');
            infoMissing = true;
        } 
        else {
            productNameInput.classList.add('is-valid');
        }
        
        //Consulto por la categoría del producto
        if (productCategory.value === "") {
            productCategory.classList.add('is-invalid');
            infoMissing = true;
        } 
        else {
            productCategory.classList.add('is-valid');
        }

        //Consulto por el costo
        if (productCost.value <= 0) {
            productCost.classList.add('is-invalid');
            infoMissing = true;
        }
        else {
            productCost.classList.add('is-valid');
        }
        
        //Consulto por la imagen
        if (imgArray.length === 0) {
            productFile.classList.add('is-invalid');
            infoMissing = true;
        } 
        else {
            productFile.classList.add('is-valid');
        }

        //Consulto por la descripción
        if (productDesc.value === "") {
            productDesc.classList.add('is-invalid');
            infoMissing = true;
        } 
        else {
            productDesc.classList.add('is-valid');
        }

        //Consulto por la moneda
        if (productCurrency.value === "") {
            productCurrency.classList.add('is-invalid');
            infoMissing = true;
        } 
        else{ 
            productCurrency.classList.add('is-valid');
        }

        //Consulto por la cantidad
        if (productCount.value <= 0) {
            productCount.classList.add('is-invalid');
            infoMissing = true;
        } 
        else { 
            productCount.classList.add('is-valid');
        }

        if(!infoMissing) {
            //Aquí ingresa si pasó los controles, irá a enviar
            //la solicitud para crear la publicación.
            
            getJSONData(PUBLISH_PRODUCT_URL).then(function(resultObj){
                let msgToShowHTML = document.getElementById("resultSpan");
                let msgToShow = "";
    
                //Si la publicación fue exitosa, devolverá mensaje de éxito,
                //de lo contrario, devolverá mensaje de error.
                //FUNCIONALIDAD NO IMPLEMENTADA
                if (resultObj.status === 'ok')
     {
                    msgToShow = resultObj.data.msg.toUpperCase();
                    document.getElementById("alertResult").classList.add('alert-primary');
                    agregarPublicacion()
                    window.location.href = "categories.html";
                }
                else if (resultObj.status === 'error')
     {
                    msgToShow = MSG;
                    document.getElementById("alertResult").classList.add('alert-primary');
                }
    
                msgToShowHTML.innerHTML = msgToShow;
                document.getElementById("alertResult").classList.add("show");
            });
        }
    });

    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});


function agregarPublicacion() {
    /* Agarra todos los datos del producto a vender y los guarda en un json para
    guardarlo en un json */

    const productCost = document.getElementById("productCostInput").value
    const productName = document.getElementById("productName");
    const productCategory = document.getElementById("productCategory");
    const productDescription = document.getElementById("productDescription");
    let productCurrency = document.getElementById("productCurrency").value;
    const productStock = document.getElementById("productCountInput").value;
    const photosArray = imgArray;
    imgArray = []

    if (productCurrency.includes("UYU"))
        productCurrency = "UYU";
    else
        productCurrency = "USD";

    const productAdded = {
        name : productName.value,
        description : productDescription.value,
        cost : productCost,
        currency : productCurrency,
        soldCount : 0,
        category : productCategory.value,
        photos : photosArray,
        stock : productStock.value,
        percentage : comissionPercentage
    }

    if (localStorage.getItem("productAdded")) {
        let productAddedArray = JSON.parse(localStorage.getItem("productAdded"));
        if (productAddedArray) {
            const a = productAddedArray.find(function({name, description, cost, currency, soldCount, category, stock}) {
                return name === productAdded.name && description === productAdded.description && cost === productAdded.cost && 
                currency === productAdded.currency && category === productAdded.category && stock === productAdded.stock;
            })
            if (!a) {
                productAddedArray.push(productAdded)
                localStorage.setItem("productAdded", JSON.stringify(productAddedArray));
            }
        }
    }
    else {
        const productAddedArray2 = [productAdded]
        localStorage.setItem("productAdded", JSON.stringify(productAddedArray2));
    }

}

