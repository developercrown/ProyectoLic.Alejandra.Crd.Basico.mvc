<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=utf-8');

    function connect(){
        $servername = "db";//localhost - server address
        $port = "3306"; //Mysql port server
        $username = "pedidosuser";//Mysql user
        $password = "usuario1234";//Mysql password for user
        $database = "pizzeria";//Mysql database to work

        // Create connection
        $conn = new mysqli($servername, $username, $password, $database, $port);

        // Check connection
        if ($conn->connect_errno) {
            echo "No se pudo conectar al servidor";
            http_response_code(500);
            die();
        }
        return $conn;
    }

    function enviarRespuesta($datos){
        echo json_encode($datos);
    }


    function getPedidos($database){
        $data = array();
        $query = "SELECT id, cliente, telefono, pedido from pedidos";
        $result = $database->query($query);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $current = [
                    'id' => $row["id"],
                    'cliente' => $row["cliente"],
                    'telefono' => $row["telefono"],
                    'pedido' => $row["pedido"]
                ];
                array_push($data, $current);
            }
            enviarRespuesta($data);
        } else {
            http_response_code(404);
            echo "no hay pedidos registrados en el sistema";
        }
        $database->close();
    }

    function storePedido($database, $cliente, $telefono, $pedido){
        $data = array();
        $query = "INSERT INTO pedidos (cliente, telefono, pedido) values('$cliente', '$telefono', '$pedido')";
        $result = $database->query($query);
        if($result === TRUE){
            $response = (object) array("status" => "correcto", "mensaje" => "Se ha registrado correctamente");
            enviarRespuesta($response);
        } else {
            $response = (object) array("status" => "error", "mensaje" => "No se pudo registrar");
            enviarRespuesta($response);
        }
        $database->close();
    }

    function cancelPedido($database, $id){
        $data = array();
        $query = "DELETE FROM pedidos WHERE id = $id";
        $result = $database->query($query);
        if($result === TRUE){
            $response = (object) array("status" => "correcto", "mensaje" => "Se ha cancelado el pedido correctamente");
            enviarRespuesta($response);
        } else {
            http_response_code(400);
            echo "No se pudo cancelar el pedido";
        }
        $database->close();
    }

    $database = connect();
    if($database){
        switch($_SERVER["REQUEST_METHOD"]){
            case "POST":
                //Acceder a los datos enviados

                $accion = $_POST["accion"];
                switch($accion){
                    case "cancelar":
                        $id = $_POST["id"];
                        if(isset($id)){
                            cancelPedido($database, $id);
                            return;
                        }
                        http_response_code(400);
                        echo "Faltan datos para completar la operacion";
                        break;

                    case "registrar":
                        $cliente = $_POST["cliente"];
                        $telefono = $_POST["telefono"];
                        $pedido = $_POST["pedido"];

                        if(isset($cliente) && isset($telefono) && isset($pedido)){
                            storePedido($database, $cliente, $telefono, $pedido);
                            return;
                        }
                    break;
                    default:
                        http_response_code(400);
                        echo "no se ha especificado el valor para la accion";
                }

                http_response_code(400);
                echo "Faltan datos para completar la operacion";
                break;
            case "GET":
            default:
                getPedidos($database);
                break;
        }
    }
?>