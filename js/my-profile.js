const perfil = JSON.parse(localStorage.getItem("profile"));

document.addEventListener("DOMContentLoaded", function (e) {

    pic();
    info();
    
    //guarda la ubicación actual por si llega a ir a un lugar no permitido.
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));
});

function pic() {
    let htmlContentToAppend = `
    <div class="row mb-2">
        <div class="text-center">
            <img id="image" src="${perfil.picture}" alt="${perfil.name}" class="img-circle mb-2"">
            <!-- boton para editar foto de perfil -->
            <div class="d-flex justify-content-center mb-2">
                <label id="edit-pic" class="d-none btn btn-primary mt-1">
                    Editar
                    <input class="d-none" type="file" onclick="editImg()"id="imagen" name="image">
                </label>
            </div>
        </div>
    </div>
    `

    document.getElementById("img").innerHTML = htmlContentToAppend;
}

function info() {
    const profile = JSON.parse(localStorage.getItem("profile"));

    let htmlContentToAppend = `
    <form class="row mb-4 card-body row ">
        <p class="mb-0 col-sm-5"><strong>Nombre de usuario</strong></p>
        <p class="col-sm-7" id="username" >${profile.name}</p>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Email</strong></p>
        <p class="col-sm-7" id="email">${profile.email}</p>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Celular</strong></p>
        <p class="col-sm-7" id="celular">${profile.phone}</p>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Dirección</strong></p>
        <p class="col-sm-7" id="direccion">${profile.address}</p>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Edad</strong></p>
        <p class="col-sm-7" id="edad">${profile.age}</p>
        <hr>

        <button type="button" onclick="modifyInfo()" id="modificarD" class="btn btn-dark">Modificar mis datos</button>
    </form>
  `

  document.getElementById("info-perfil").innerHTML = htmlContentToAppend;
}



function modifyInfo() {

    document.getElementById("edit-pic").classList.remove("d-none")


    let htmlContentToAppend = `

    <form class="row mb-4 card-body row ">
        <p class="mb-0 col-sm-5"><strong>Nombre de usuario</strong></p>
        <div class="form-group col-sm-7">
            <input type="text" class="form-control form-focus" id="nombre" placeholder="username">
        </div>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Email</strong></p>
        <div class="form-group col-sm-7">
            <input type="email" class="form-control form-focus"  id="email" placeholder="name@example.com" required>
        </div>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Celular</strong></p>
        <div class="form-group col-sm-7">
            <input type="number" class="form-control form-focus" id="celular" min="0" placeholder="+598 99 999 999">
        </div>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Dirección</strong></p>
        <div class="form-group col-sm-7">
            <input type="text" class="form-control form-focus " id="direccion" placeholder="City, Country">
        </div>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Edad</strong></p>
        <div class="form-group col-sm-7">
            <input type="number" class="form-control form-focus " id="edad" min="0" placeholder="18">
        </div>
        <hr>

        <button type="button" onclick="saveInfo()" id="actualizarD" class="btn btn-success">Actualizar mis datos</button>
        <button type="button" onclick="cancel()" id="actualizarD" class="btn btn-danger mt-2">Cancelar</button>
        
    </form>
    
    `

    document.getElementById("info-perfil").innerHTML = htmlContentToAppend;


    const perfil = JSON.parse(localStorage.getItem("profile"));

    document.getElementById("nombre").value = perfil.name;
    document.getElementById("email").value = perfil.email;
    document.getElementById("celular").value = parseInt(perfil.phone);
    document.getElementById("direccion").value = perfil.address === "Debe completar este campo" ? "" : perfil.address;
    document.getElementById("edad").value = parseInt(perfil.age);

}

function saveInfo() {
    let name = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;
    let picture = document.getElementById("image").src;
    let phone = document.getElementById("celular").value;
    let address = document.getElementById("direccion").value;
    let age = document.getElementById("edad").value;

    if (name && email && email.includes("@") && email.includes(".com") && phone && address && age) {
        let profile = {
            name: name,
            email: email,
            picture: picture,
            phone: phone,
            address: address,
            age: age
        }
    
        localStorage.setItem("profile", JSON.stringify(profile));
        info();
        document.getElementById("edit-pic").classList.add("d-none")
        document.getElementById("profile_pic").src = profile.picture;
    }
    else {
        alert("Por favor complete todos los campos");
    }

}

function cancel() {
    document.getElementById("edit-pic").classList.add("d-none")
    info();
}

document.addEventListener("keypress", (event) => {
  if (event.code == "Enter") {
    saveInfo();
  }
});


function editImg() {
  let inputFile = document.getElementById("imagen");
  inputFile.addEventListener("change", (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
        let img = document.getElementById("image");
        if (e.target.result.includes("data:image/")) {
            img.src = e.target.result;
        }
        else {
            img.src = perfil.picture;
            console.log("Error");
        }
    }
    reader.readAsDataURL(file);
  }, false);
}
