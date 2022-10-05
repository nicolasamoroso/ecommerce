let toggle = true

document.addEventListener("DOMContentLoaded", function () {
    toggle = media2.matches ? false : true
});

//  #-----------------------------Comentarios-----------------------------#

/* Muestra los comentarios del producto "id".
Si no hay comentarios, cambia el texto a "Se el primero en comentar" */
function showProductInfoComments() {
    let htmlContentToAppend = ""
    /* Si hay comentarios entra */
    if(productInfoCommentsArray.length !== 0) {
        if (document.getElementById('se-el-primero-en-comentar'))
                document.getElementById('se-el-primero-en-comentar').innerHTML = "Comentarios"
                
        /* Si no tiene imagen, le agrega una */
        if (!productInfoCommentsArray.profile_pic) {
            for (let i = 0; i < productInfoCommentsArray.length; i++) {
                let product = productInfoCommentsArray[i]
                product.profile_pic = "img/img_perfil.png"
            }
        }

        /* Agrega cada comentario, además de mostrar el score (estrellas) y 
        la fecha en la q se comentó. */
        for (let i = 0; i < productInfoCommentsArray.length; i++) {
            let product = productInfoCommentsArray[i]
            htmlContentToAppend += comentarios(product)
        }
    }

    document.getElementById('comments').innerHTML += htmlContentToAppend
}

function comentarios(product) {
    let htmlContentToAppend = ""
    if (toggle === true) {
        htmlContentToAppend = `
        <div class="comments">
            <div class="d-flex justify-content-between">
                <h6>
                    <img id="profile_pic_comments" class="rounded-circle" src="${product.profile_pic}">
                    ${product.user}
                </h6>
                <small>${changeDayFormat(new Date(product.dateTime))}</small>
            </div>
            <div class="d-flex justify-content-between pt-2">
                <p class="text-break box">${product.description}</p>
                <div> ${ScoreToStars(product.score)} </div>
            </div>
        </div>
        <hr>
        `
    }
    else {
        htmlContentToAppend = `
        <div class="comments">
            <div class="py-2"> ${ScoreToStars(product.score)} </div>
            <div class="d-flex justify-content-between titleAndDate">
                <h6>
                    <img id="profile_pic_comments" class="rounded-circle" src="${product.profile_pic }">
                    ${product.user}
                </h6>
                <small>${changeDayFormat(new Date(product.dateTime))}</small>
            </div>
            <div class="d-flex justify-content-between pt-2">
                <p class="text-break box">${product.description}</p>
            </div>
        </div>
        <hr>
        `
    }
    return htmlContentToAppend
}

/* Muestra el score como estrellas en vez de números */
function ScoreToStars(score) {

    let htmlContentToAppend = ""
    for (i = 1; i <= 5; i++) {
        if (i <= score) htmlContentToAppend += `<i class="fa fa-star checked"></i>`
        else htmlContentToAppend += `<i class="fa fa-star"></i>`
    }
    return htmlContentToAppend
}

/* Cambia el formato de la fecha para que sea "hh:mm - dd/mm/aa" */
function changeDayFormat(date) {
    const day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate()
    const month = (date.getMonth() + 1) <= 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)
    const year = date.getFullYear()
    const hour = (date.getHours() <= 9) ? "0" + date.getHours() : date.getHours()
    const minute = (date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes()
    return `${hour}:${minute} - ${day}/${month}/${year}`
}

function convertDateForIos(date) {
    var arr = date.toString().split(/[- :]/)
    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5])
    return date
}


//  #-----------------------------Enviar Comentarios-----------------------------#

            //------------------Score------------------//

const ratingStars = [...document.getElementsByClassName("ratingStar")]

function executeRating(stars) {
  const starClassActive = "ratingStar fa fa-star checked"
  const starClassInactive = "ratingStar fa fa-star"
  const starsLength = stars.length
  let i
  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star)

      if (star.className === starClassInactive)
        for (i; i >= 0; --i) stars[i].className = starClassActive
      else
        for (i; i < starsLength; ++i) stars[i].className = starClassInactive
    };
  });
}

executeRating(ratingStars)

/* Checkea cuanto score dió el usuario */
function checkScore() {
    let j = 0
    for (let i = 0; i < 5; i++) {
        if (ratingStars[i].classList.contains("checked"))
            j++
    }
    return j
}

let commentsArray = []

function addComment() {

    const profileArray = JSON.parse(localStorage.getItem("profile"))
    const profile = profileArray.find(function({logged}) {
        return logged === true
    })

    const comment = document.getElementById("productComment").value
    if (comment.length !== 0) {
        const comentario = {
            user : profile.name,
            email : profile.email,
            description : comment,
            score : checkScore(),
            dateTime : new Date(),
            profile_pic : profile.picture
        }

        if (document.getElementById('se-el-primero-en-comentar'))
                document.getElementById('se-el-primero-en-comentar').innerHTML = "Comentarios"

        if (localStorage.getItem(`product-${id}`)) {
            commentsArray = JSON.parse(localStorage.getItem(`product-${id}`))

            const existe_nombre = commentsArray.find(function({email}) {
                return email === profile.email
            });
            
            if (!existe_nombre) {
                commentsArray.push(comentario)
                localStorage.setItem(`product-${id}`, JSON.stringify(commentsArray))
                let htmlContentToAppend = comentarios(comentario)
                document.getElementById('comments').innerHTML += htmlContentToAppend
            }
            else showAlertError()
        }
        else {
            commentsArray.push(comentario);
            localStorage.setItem(`product-${id}`, JSON.stringify(commentsArray))
            let htmlContentToAppend = comentarios(comentario)
            document.getElementById('comments').innerHTML += htmlContentToAppend
        }
    }
    else showAlertErrorVoid()

    document.getElementById("productComment").value = ""
}

function actualizar(array) {
    const profileArray = JSON.parse(localStorage.getItem("profile"))
    for (let i = 0; i < profileArray.length; i++) {
        const element1 = profileArray[i]
        let elem = array.find(function({email}) {
            return email === element1.email
        })

        if (elem) {
            elem.user = element1.name
            elem.profile_pic = element1.picture
        }
    }
}

/* Agrega show del id "alert-danger" si no escribío nada
hace timeout a la alerta después de 4 segundos */
function showAlertErrorVoid() {
    document.getElementById("alert-danger-vacio").classList.add("show")
    setTimeout(removeAlertErrorVoid, 3000)
}
  
/* remueve show del id "alert-danger" */
function removeAlertErrorVoid() {
    document.getElementById("alert-danger-vacio").classList.remove("show")
}

/*  */
function showAlertError() {
    document.getElementById("alert-danger").classList.add("show");
    setTimeout(removeAlertError, 3000)
}
  
/* remueve show del id "alert-danger" */
function removeAlertError() {
    document.getElementById("alert-danger").classList.remove("show")
}

function showUserComments(array) {

    const profileArray = JSON.parse(localStorage.getItem("profile"))
    for (let i = 0; i < profileArray.length; i++) {
        const element1 = profileArray[i]
        let elem = array.find(function({email}) {
            return email === element1.email
        })  
        if (elem) {
            elem.user = element1.name
            elem.profile_pic = element1.picture
        }
    }

    let htmlContentToAppend = ""

    for (let i = 0; i < array.length; i++) {
        const element = array[i]
        htmlContentToAppend += comentarios(element, false)
    }

    document.getElementById('comments').innerHTML += htmlContentToAppend

    if (document.getElementById('se-el-primero-en-comentar'))
        document.getElementById('se-el-primero-en-comentar').innerHTML = "Comentarios"
}

window.addEventListener("resize" , function() {
    if (this.window.innerWidth <= 990 && toggle === false) {
        document.getElementById("comments").innerHTML = `
        <h1 class="text-center mt-5 mb-5" id="se-el-primero-en-comentar">Se el primero en agregar un comentario</h1>
        <hr>
        `
        showProductInfoComments()
        if (localStorage.getItem(`product-${id}`)) {
            showUserComments(JSON.parse(localStorage.getItem(`product-${id}`)))
        }
        toggle = true;
    }
    else if (this.window.innerWidth > 990 && toggle === true) {
        document.getElementById("comments").innerHTML = `
        <h1 class="text-center mt-5 mb-5" id="se-el-primero-en-comentar">Se el primero en agregar un comentario</h1>
        <hr>
        `
        showProductInfoComments()
        if (localStorage.getItem(`product-${id}`)) {
            showUserComments(JSON.parse(localStorage.getItem(`product-${id}`)))
        }
        toggle = false
    }
})