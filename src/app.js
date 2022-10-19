
const RegistroTemplate = `
    <div class="container">
        <div class="row">
            <div class="col-12 m-auto">
                <h1>Registro de pedido</h1>
            </div>
            <div class="col-6 m-auto text-left">
                <form onsubmit="registrar(event)">

                    <div class="form-group mt-4">
                        <label class="text-left" for="cliente"><strong>Nombre del cliente</strong></label>
                        <input type="text" class="form-control" id="cliente" placeholder="Ingresa el nombre del cliente" required/>
                    </div>

                    <div class="form-group mt-4 text-left">
                        <label for="telefono"><strong>Telefono del cliente</strong></label>
                        <input type="tel" class="form-control" id="telefono" placeholder="Ingresa el nombre del cliente" required/>
                    </div>

                    <div class="form-group mt-4 text-left">
                        <label for="pedido"><strong>Pedido del cliente</strong></label>
                        <select class="form-select" id="pedido">
                            <option selected value="Pizza Hawallana">Pizza Hawallana</option>
                            <option value="Pizza Peperoni">Pizza Peperoni</option>
                            <option value="Pizza Vegetariana">Pizza Vegetariana</option>
                            <option value="Pizza Mexicana">Pizza Mexicana</option>
                            <option value="Pizza de Aguacate">Pizza de Aguacate</option>
                            <option value="Pizza al Pastor">Pizza de Aguacate</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn-primary mt-5">Registrar</button>
                </form>
            </div>
        </div>
    </div>
`;


const PedidosTemplate = `
    <h1 class="mb-4">Listado de pedidos</h1>
    <table class="table table-striped table-hover text-center">
    <thead>
        <tr>
        <th scope="col">#</th>
        <th scope="col">Nombre del cliente</th>
        <th scope="col">Telefono del cliente</th>
        <th scope="col">Pedido</th>
        <th scope="col">Acciones</th>
        </tr>
    </thead>
    <tbody id="contenido-pedidos"></tbody>
    </table>
`;

const RowTemplate = `
    <tr>
        <th scope="row">@ID@</th>
        <td>@CLIENTE@</td>
        <td>@TELEFONO@</td>
        <td>@PEDIDO@</td>
        <td>
            <button class="btn btn-danger" onclick="cancelar(@ID@)">Cancelar pedido</button>
        </td>
    </tr>   
`;

function solicitud(method = "GET", params = {}, accionSuccess = () => {}, actionError = () => {}) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, "http://localhost:8000/php/server.php");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let data = xhr.responseText;
            let status = xhr.status;
            if (status == 200) {
                data = JSON.parse(data);
                accionSuccess(data, status);
                return
            } else {
                actionError(data, status)
            }
        }
    };
    xhr.send(params);
}

function registro() {
    document.getElementById("contenido").innerHTML = RegistroTemplate;
}

function listado() {
    document.getElementById("contenido").innerHTML = PedidosTemplate;
    cargarPedidos()
}

function cancelar(id) {
    var formData = new FormData();
    formData.append("id", id);
    formData.append("accion", "cancelar");
    solicitud("POST", formData, (data) => {;
        if(data.status === "correcto"){
            alert(data.mensaje)
            listado();
        }
    }, (data) => {
        alert(data);
    })
}

function cargarPedidos() {
    solicitud("GET", {}, (data) => {
        if (data.length > 0) {
            var pedidos = "";
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var row = RowTemplate;
                row = row.replaceAll("@ID@", item.id);
                row = row.replaceAll("@CLIENTE@", item.cliente);
                row = row.replaceAll("@TELEFONO@", item.telefono);
                row = row.replaceAll("@PEDIDO@", item.pedido);
                pedidos += row;
            }
            document.getElementById("contenido-pedidos").innerHTML = pedidos;
            return
        }
        alert("no hay pedidos registrados");
    }, (err) => {
        alert(err);
    })
}

function registrar(event){
    event.preventDefault();
    var cliente = document.getElementById("cliente").value;
    var telefono = document.getElementById("telefono").value;
    var pedido = document.getElementById("pedido").value;
    var formData = new FormData();
    formData.append("cliente", cliente);
    formData.append("telefono", telefono);
    formData.append("pedido", pedido);
    formData.append("accion", "registrar");

    solicitud("POST", formData, (data) => {;
        if(data.status === "correcto"){
            alert(data.mensaje)
            listado();
        }
    }, (data) => {
        alert(data.mensaje);
    })
}

document.addEventListener("DOMContentLoaded", function (event) {
    listado()
});