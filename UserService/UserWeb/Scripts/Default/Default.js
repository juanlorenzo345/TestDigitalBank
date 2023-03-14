$(function () {
    modulo_default.inicializar();
});
var modulo_default = (function () {

    let $btnGuardarRegistro,
        $txtNombre,
        $txtFechaNacimiento,
        $DDSexo;

    function inicializar() {
        obtenerCampos();
        asociarEventos();
        accionesIniciales();
    }



    //#region  CONFIGURACION

    function obtenerCampos() {
        $btnGuardarRegistro = $('.btn-guardar-registro');
        $txtNombre = $('.txtNombreUsuario');
        $txtFechaNacimiento = $('.txtFechaNacimiento');
        $DDSexo = $('.DDSexo');
    }

    function asociarEventos() {
        $btnGuardarRegistro.click(btnGuardar_click);        
    }

    function accionesIniciales() {
        
    }


    //#region funciones

    function btnGuardar_click() {
        user = {
            Nombre: $txtNombre.val(),
            FechaNacimiento: $txtFechaNacimiento.val(),
            Sexo: $DDSexo.find('option:selected').val()
        };

        console.log(user);
        $.ajax({
            type: "POST",
            url: "Default.aspx/InsertarUsuarios",
            data: JSON.stringify({ user }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: OnSuccess,
            failure: function (response) {
                console.log(response.Excepcion.Mensaje);
            }
        });

    }
    function OnSuccess(response) {
        var items = response.d.Respuesta;
        //items.forEach(element => {
        //    element.FechaNacimiento = obtenerfechaDiaMesAnioNull(element.FechaNacimiento)
        //});
        limpiarCampos();
        Master.Alert("Grabado exitosamente", null, Master.success);
        modulo_consulta.cargarUsuarios();
    }

    function limpiarCampos() {
        $txtNombre.val('');
        $txtFechaNacimiento.val('');
        $DDSexo.val('F');
    }
    //#endregion

    return {
        inicializar: inicializar,
    };
})();