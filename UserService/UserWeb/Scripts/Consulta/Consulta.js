$(function () {
    modulo_consulta.inicializar();
});
var modulo_consulta = (function () {
    var _resources = Object.Resources;
    let $tblListadoUsuarios;
        //$tblListadoUsuariosFootable;

    function inicializar() {
        obtenerCampos();
        asociarEventos();
        accionesIniciales();
    }


    //#region  CONFIGURACION

    function obtenerCampos() {
        $tblListadoUsuarios = $('.tbl-listado-usuarios');
        //$tblListadoUsuariosFootable = FooTable.init('.tbl-listado-usuarios');
    }

    function asociarEventos() {
        $tblListadoUsuarios.on('click', '.btn-editar-registro', btnEditar_click);
        $tblListadoUsuarios.on('click', '.btn-eliminar-registro', btnEliminar_click);
        
    }

    async function accionesIniciales() {
        await cargarUsuarios();
    }


    //#region funciones

    async function cargarUsuarios() {
        
        $.ajax({
            type: "GET",
            url: "Consulta.aspx/ConsultarUsuarios",
            data: '',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: async function (response) {
                item = response.d.Respuesta;
                
                await loadFooTableData($tblListadoUsuarios, item);
            },
            failure: async function (response) {
                console.log(response.Excepcion.Mensaje);
            }
        });

    }

    function btnEditar_click() {
        var id = $(this).val();
        var nombre = modulo_utilidades.ceroOVacioANulo($(this).closest('tr').children().eq(1).text());
        var fechaNacimiento = modulo_utilidades.ceroOVacioANulo($(this).closest('tr').children().eq(2).text());
        var sexo = modulo_utilidades.ceroOVacioANulo($(this).closest('tr').children().eq(3).text());
        var now = new Date(Date.now());
        user = {
            Id: id,
            Nombre: nombre,
            FechaNacimiento: now,
            Sexo: sexo
        };

        console.log(user);
        $.ajax({
            type: "POST",
            url: "Consulta.aspx/ActualizarUsuarios",
            data: JSON.stringify({ user }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                Master.Alert("Actualizado exitosamente", null, Master.success);
                cargarUsuarios();
            },
            failure: function (response) {
                console.log(response.Excepcion.Mensaje);
            }
        });

    }


    function btnEliminar_click() {
        var id = $(this).val();
        user = {
            Id: id,
            Nombre: '',
            FechaNacimiento: '',
            Sexo: ''
        };
        Utilities2.Notification.MessageBox.Show(
            "<p>¿Está seguro de eliminar el registro?</p>"
            , "Eliminar Registro"
            , _resources.MessageBoxButton.YesNo
            , _resources.MessageBoxType.Warning
            , function () {
                Utilities2.Notification.MessageBox.Close();
                $.ajax({
                    type: "POST",
                    url: "Consulta.aspx/EliminarUsuarios",
                    data: JSON.stringify({ user }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        Master.Alert("Eliminado exitosamente", null, Master.success);
                        cargarUsuarios();
                    },
                    failure: function (response) {
                        console.log(response.Excepcion.Mensaje);
                    }
                });
            }
            , function () {
                Utilities2.Notification.MessageBox.Close();
            }
        );

    }


    //#endregion


    //#region Botones
    function formatoBotonEditar(value, options, rowData) {
        return `<button class="btn btn-xs btn-warning btn-editar-registro" value="${rowData.Id}" style="font-size: 13px;" type="button">Editar</button>`;
    };

    function formatoBotonEliminar(value, options, rowData) {
        return `<button class="btn btn-xs btn-danger btn-eliminar-registro" value="${rowData.Id}" style="font-size: 13px;" type="button">Eliminar</button>`;
    };

    //#endregion Botones

    return {
        inicializar: inicializar,
        cargarUsuarios: cargarUsuarios,
        formatoBotonEditar: formatoBotonEditar,
        formatoBotonEliminar: formatoBotonEliminar,
    };
})();