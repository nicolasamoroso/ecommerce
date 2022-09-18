const profileArray = JSON.parse(localStorage.getItem("profile"));
const profile = JSON.parse(localStorage.getItem("profile")).find(function({logged}) {
    return logged === true;
})

document.addEventListener("DOMContentLoaded", async (e) => {

    pic();
    info();
    
    //guarda la ubicación actual por si llega a ir a un lugar no permitido.
    const location = window.location.href;
    localStorage.setItem("prev_location", JSON.stringify(location));

    //boton para cancelar la foto de perfil
    document.getElementById("cancel-pic").addEventListener("click", function (e) {
        document.getElementById("profile_img").src = profile.picture;
    })

    const inputImage = document.getElementById('image');
    const editor = document.getElementById('editor');
    const miCanvas = document.getElementById('preview');
    const contexto = miCanvas.getContext('2d');
    let urlImage = undefined;
    inputImage.addEventListener('change', abrirEditor, false);
    
    //Función que abre el editor con la imagen seleccionada
    function abrirEditor(e) {
        
        if(!e.target.files[0]) {
            document.getElementById("Modal").classList.add("d-none");
            document.querySelector(".modal-backdrop").remove();
            alert('No se seleccionó ninguna imagen');
            return;
        }

        //Obtiene la imagen si existe "e.target.files[0]"
        urlImage = URL.createObjectURL(e.target.files[0]);
    
        //Borra editor en caso que existiera una imagen previa
        editor.innerHTML = '';
        let cropprImg = document.createElement('img');
        cropprImg.setAttribute('id', 'croppr');
        editor.appendChild(cropprImg);
    
        //Limpia la previa en caso que existiera algún elemento previo
        contexto.clearRect(0, 0, miCanvas.width, miCanvas.height);
    
        //Envia la imagen al editor para su recorte
        document.getElementById('croppr').setAttribute('src', urlImage);
    
        //Crea el editor
        new Croppr('#croppr', {
            aspectRatio: 1,
            startSize: [70, 70],
            onCropEnd: recortarImagen
        })
    }
    
    //Función que recorta la imagen con las coordenadas proporcionadas con croppr.js
    function recortarImagen(data) {

        const inicioX = data.x;
        const inicioY = data.y;
        const nuevoAncho = data.width;
        const nuevaAltura = data.height;
        const zoom = 1;
        let imagenEn64 = '';

        miCanvas.width = nuevoAncho;
        miCanvas.height = nuevaAltura;

        let miNuevaImagenTemp = new Image();

        
        // Cuando la imagen se cargue se procederá al recorte
        miNuevaImagenTemp.onload = function() {

            //Recorta
            contexto.drawImage(miNuevaImagenTemp, inicioX, inicioY, nuevoAncho * zoom, nuevaAltura * zoom, 0, 0, nuevoAncho, nuevaAltura);

            //Se transforma a base64
            imagenEn64 = miCanvas.toDataURL("image/png");
            
            if(imagenEn64.includes("data:image/")) {
                document.getElementById("profile_img").src = imagenEn64;
            }
        }

        //Agrega y elimina sino se bugea
        miNuevaImagenTemp.src = urlImage;
        document.querySelector("#preview").remove();
    }

});

function pic() {
    let htmlContentToAppend = `

    <div class="row mb-2">
        <div class="text-center">
            <img id="profile_img" src="${profile.picture}" alt="${profile.name}" class="mb-2 shadow">
            <canvas id="preview" class="d-none" width="0"></canvas>
            <!-- boton para editar foto de perfil -->
            <div class="d-flex justify-content-center mb-2">
            <label class="d-none btn btn-primary mt-1" id="image" data-toggle="modal" data-target="#Modal">
                Editar
                <input class="d-none" type="file" name="image">
            </label>
            </div>
        </div>
    </div>

    <div class="modal fade" id="Modal" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Editar imagen de perfil</h5>
        </div>
        <div class="modal-body">
            <p class="text-muted">
                Para cambiar la imagen de perfil, ajuste el tamaño.
                <small class="text-muted">(Sino no se cambiará)</small>
            </p>
            <div id="editor"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal" id="cancel-pic" onclick="cancel_pic">Close</button>
          <button type="button" class="btn btn-primary" data-dismiss="modal" id="save-pic">Save changes</button>
        </div>
      </div>    
    </div>
  </div>
    `

    document.getElementById("img").innerHTML = htmlContentToAppend;
}

function cancel_pic() {
    document.getElementById("profile_img").src = profile.picture;
}


function info() {

    let htmlContentToAppend = `
    <form class="row mb-4 card-body row">
        <p class="mb-0 col-sm-5"><strong>Nombre de usuario</strong></p>
        <small class="col-sm-7" id="username" >${profile.name}</small>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Email</strong></p>
        <small class="col-sm-7" id="email">${profile.email}</small>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Nombre y Apellido</strong></p>
        <small class="col-sm-7" id="nombre-apellido">${profile.name_lastname ? profile.name_lastname : "Debe completar este campo"}</small>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Celular</strong></p>
        <small class="col-sm-7" id="celular">${profile.phone ? profile.phone : "Debe completar este campo"}</small>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Dirección</strong></p>
        <small class="col-sm-7" id="direccion">${profile.address ? profile.address : "Debe completar este campo"}</small>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Edad</strong></p>
        <small class="col-sm-7" id="edad">${profile.age ? profile.age : "Debe completar este campo"}</small>
        <hr>

        <button type="button" onclick="modifyInfo()" id="modificarD" class="btn btn-dark">Modificar mis datos</button>
    </form>
    `
    
    document.getElementById("info-perfil").innerHTML = htmlContentToAppend;
}



function modifyInfo() {

    document.getElementById("image").classList.remove("d-none")


    let htmlContentToAppend = `

    <form class="row mb-4 card-body row ">
        <p class="mb-0 col-sm-5"><strong>Nombre de usuario</strong></p>
        <div class="form-group col-sm-7">
            <input type="text" class="form-control form-focus" id="nombre" placeholder="Username">
        </div>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Email</strong></p>
        <small class="col-sm-7" id="email">${profile.email}</small>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Nombre y Apellido</strong></p>
        <div class="form-group col-sm-7">
            <input type="text" class="form-control form-focus" id="nombre-apellido" placeholder="Jane Doe">
        </div>
        <hr>

        <p class="mb-0 col-sm-5"><strong>Celular</strong></p>
        <div class="form-group col-sm-7">
            <input type="number" class="form-control form-focus" id="celular" min="0" placeholder="099999999">
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

    document.getElementById("nombre").value = profile.name;
    document.getElementById("nombre-apellido").value = profile.name_lastname ? profile.name_lastname : "";
    document.getElementById("celular").value = parseInt(profile.phone);
    document.getElementById("direccion").value = profile.address ? profile.address : "";
    document.getElementById("edad").value = parseInt(profile.age);

}

function saveInfo() {
    let name = document.getElementById("nombre").value;
    let picture = document.getElementById("profile_img").src;
    let name_lastname = document.getElementById("nombre-apellido").value
    let phone = document.getElementById("celular").value;
    let address = document.getElementById("direccion").value;
    let age = document.getElementById("edad").value;

    if (name && name_lastname && phone && address && age) {

        if(name.length > 20) {
            alert("El nombre es muy largo");
            return;
        }
        if(phone.length > 10) {
            alert("El celular es muy largo");
            return;
        }
        if(address.length > 30) {
            alert("La dirección es muy larga");
            return;
        }
        if(age.length > 3 && age > 120) {
            alert("La edad es muy larga");
            return;
        }
        if(age < 0) {
            alert("La edad no puede ser negativa");
            return;
        }
        if (name_lastname.length > 33) {
            alert("El nombre y apellido es muy largo");
            return;
        }


        const catchProfile = JSON.parse(localStorage.getItem("profile")).find(function({email}) {
            return email === profile.email;
        })

        if (catchProfile) {
            const newProfile = {
                name,
                email: catchProfile.email,
                name_lastname,
                picture,
                phone,
                address,
                age,
                logged : catchProfile.logged
            }
            profileArray.splice(profileArray.findIndex(function({logged}) {
                return logged === true
            }), 1, newProfile);

            localStorage.setItem("profile", JSON.stringify(profileArray));
            window.location.href = "my-profile.html";
        }
    }
    else {
        alert("Por favor complete todos los campos");
    }

}

function cancel() {
    document.getElementById("image").classList.add("d-none")
    document.getElementById("profile_img").src = profile.picture;
    info()
}

document.addEventListener("keypress", (event) => {
  if (event.code == "Enter") {
    saveInfo();
  }
});