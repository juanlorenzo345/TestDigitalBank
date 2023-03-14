// Módulo que debería contener todas las funciones de utilidad
var modulo_utilidades = (function () {
    function ceroOVacioANulo(valor) {
        if (valor === 0 || valor === '0' || valor?.trim() === '') {
            return null;
        }
        return valor;
    }

    function menosUnoOVacioANulo(valor) {
        if (valor === -1 || valor === '-1' || valor?.trim() === '') {
            return null;
        }
        return valor;
    }

    function dataURIToBlob(dataURI) {
        var binStr = atob(dataURI.split(',')[1]),
            len = binStr.length,
            arr = new Uint8Array(len),
            mimeString = dataURI.split(';')[0].split(':')[1];

        for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }

        return new Blob([arr], {
            type: mimeString
        });
    }
    
    function validarCorreo(email) {
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email) ? true : false;
    }

    return {
        ceroOVacioANulo: ceroOVacioANulo,
        menosUnoOVacioANulo: menosUnoOVacioANulo,
        dataURIToBlob: dataURIToBlob,
        validarCorreo: validarCorreo
    };
})();

// Confirma cierre de modal
var confirmarCerrarModal = function ($modal) {
    Utilities2.Notification.MessageBox.Show(
        "<p>¿Cerrar? No se guardarán cambios.</p>"
        , "Descartar"
        , _resources.MessageBoxButton.YesNo
        , _resources.MessageBoxType.Warning
        , function () {
            Utilities2.Notification.MessageBox.Close();

            // Cerrar modal
            $modal.modal('hide');
        }
        , function () {
            Utilities2.Notification.MessageBox.Close();
        }
    );
};

// Devuelve un tipo buscando por su id en un arreglo de tipos (ej: tipos de documento)
var buscarTipo = function (arregloTipos, idTipo) {
    if (arregloTipos.length === undefined) {
        return {};
    }
    var tipo = arregloTipos.find(m => m.Id === parseInt(idTipo) || m.id === parseInt(idTipo));
    return tipo !== undefined ? tipo : {};
};

// Lee un archivo desde un control file
var leerArchivo = function ($file) {
    return new Promise((resolver, rechazar) => {
        var file = $file.get(0).files[0];
        var reader = new FileReader();
        reader.onload = function () {
            resolver({
                contenido: reader.result.split("base64,")[1],
                tipo: file.type
            });
        };
        reader.onerror = function () {
            rechazar();
        };
        reader.readAsDataURL(file);
    });
};

// Consulta el documento indicado por la propiedad valor del elemento actual. Puede recibir un campo oculto donde guardar el archivo localmente.
function descargarDocumento($btn, $hdnArchivo) {
    if ($hdnArchivo && $hdnArchivo.val() !== '') {
        var archivo = JSON.parse($hdnArchivo.val());
        if (archivo.ContenidoBase64) {
            modulo_manejo_documentos.descargarArchivo(archivo.ContenidoBase64, archivo.tipoMime, archivo.documento.nombre);
            return Promise.resolve('Documento almacenado localmente.');
        }
    }

    var idDocumento = $btn.val();
    if (idDocumento === '') {
        return Promise.reject('No hay documento disponible.');
    }

    Master.ShowLoading();

    return new Promise((resolver, rechazar) => {
        PageMethods.ConsultarDocumento(
            idDocumento,
            function (resultado) {
                Master.PageMethodResponse(
                    resultado,
                    function () {
                        respuestaConsultaDocumento(resultado, resolver, $hdnArchivo);
                    },
                    _context,
                    'ConsultarDocumento'
                );
            },
            rechazar
        );
    }).finally(() => { Master.HideLoading(); });
}

async function cambioArchivo($file, nombrePorDefecto, fechaDocumento) {
    // Armar información base de objeto archivo
    var archivo = {};
    var $hdnIdGestor = $file.closest('.row').find('.hdn-id-gestor');
    var $hdnArchivo = $file.closest('.row').find('.hdn-archivo');
    var $btnVerArchivo = $file.closest('.row').find('.btn-ver-archivo');

    if ($file.get(0).files.length) {
        var nombreArchivo = $file.val().replace(/\\/g, '/').replace(/.*\//, '');
        var $txtNombre = $file.closest('.input-group').find(':text');
        if ($txtNombre.length) {
            $txtNombre.val(nombreArchivo);
        }

        // Armar objeto de documento
        nombrePorDefecto += $txtNombre.val().slice($txtNombre.val().lastIndexOf('.'));

        archivo = {
            id: $hdnIdGestor.val() || 0,
            documento: {
                id: $btnVerArchivo.val() || 0,
                nombre: nombrePorDefecto,
                fechaDocumento: fechaDocumento || null
            },
            radicadoGestor: {}
        };

        // Completar objeto de documento
        var infoArchivo = await leerArchivo($file);
        archivo.ContenidoBase64 = infoArchivo.contenido;
        archivo.tipoMime = infoArchivo.tipo;
    }
    else {
        archivo = {
            id: $hdnIdGestor.val(),
            documento: {
                id: $btnVerArchivo.val()
            }
        };
    }

    $hdnArchivo.val(JSON.stringify(archivo));
}

var respuestaConsultaDocumento = function (resultado, resolver, $hdnArchivo) {
    var archivo = resultado.Respuesta;
    if ($hdnArchivo) {
        $hdnArchivo.val(JSON.stringify(archivo));
    }

    modulo_manejo_documentos.descargarArchivo(archivo.ContenidoBase64, archivo.tipoMime, archivo.documento.nombre);

    resolver();
};

// Módulo que contiene operaciones con archivos anexos
var modulo_archivo_anexo = (function () {
	let _archivosContext = typeof _context !== 'undefined' ? _context : { name: "Archivos" };

    var CumpleValidacionMinimos = false;

    // Valida condiciones generales de un archivo anexo
    var validarArchivo = function ($fleArchivo, $ddlTipoDocumento, extensionesPermitidas) {
        
        try {
            if ($ddlTipoDocumento.val() === null || $ddlTipoDocumento.val() === "0") {
                $ddlTipoDocumento.focus();
                throw new SaeExcepcion(_archivosContext, "Agregar archivo", "El campo <strong>Tipo de documento</strong> es obligatorio.", Master.warning, true);
            }

            if ($fleArchivo[0].files.length === 0) {
                $fleArchivo.focus();
                throw new SaeExcepcion(_archivosContext, "Agregar archivo", "El campo <strong>Archivo</strong> es obligatorio.", Master.warning, true);
            }

            if ($fleArchivo[0].files[0].size > 104857600) {
                $fleArchivo.focus();
                throw new SaeExcepcion(_archivosContext, "Agregar archivo", "El archivo seleccionado debe tener un tamaño menor a <strong>10 Mb</strong>.", Master.warning, true);
            }

            if (extensionesPermitidas !== undefined && extensionesPermitidas !== null && !extensionesPermitidas.exec($fleArchivo[0].files[0].name)) {
                $fleArchivo.focus();
                throw new SaeExcepcion(_archivosContext, "Agregar archivo", "El archivo seleccionado <strong>debe ser un archivo de imagen.</strong>", Master.warning, true);
            }

            return true;
        }
        catch (ex) {
            if (ex instanceof SaeExcepcion) {
                Master.SaeExcepcion(ex, false);
            } else if (ex instanceof Error) {
                Master.Exception("ValidaAgregarDocumento", _archivosContext, ex, false);
            }
        }
    };

    var agregarArchivoADiccionario = function (diccionarioArchivos, $fleArchivo, $ddlTipoDocumento, asunto, descripcion, idActivo, contadorDeArchivos, actualizarInterfaz, extensionesPermitidas) {
        extensionesPermitidas = extensionesPermitidas || null;
        if (validarArchivo($fleArchivo, $ddlTipoDocumento, extensionesPermitidas)) {
            var contenido = $fleArchivo.get(0).files[0];

            var archivo = {
                Radicado: {
                    IdTipoDocumento: $ddlTipoDocumento.val(),
                    Asunto: asunto
                },
                Id: undefined,
                Asunto: descripcion,
                TipoMime: contenido.type,
                Extension: undefined,
                Nombre: contenido.name,
                Ruta: undefined,
                IdActivo: idActivo,
                Numero: contadorDeArchivos
            };

            var reader = new FileReader();
            reader.onload = function () {
                // Leer archivo y guardar en diccionario
                archivo.ContenidoBase64 = reader.result.split("base64,")[1];
                diccionarioArchivos[archivo.Numero] = {
                    archivo: archivo,
                    eliminado: false
                };

                // Actualizar interfaz
                actualizarInterfaz(contenido.name, contadorDeArchivos);
                contadorDeArchivos++;
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };

            reader.readAsDataURL(contenido);
        }
    };

    // Graba un diccionario temporal: incluye agregar nuevos archivos y borrar los que ya no están
    var grabarDiccionarioArchivos = function (idPadre, diccionarioArchivos, reemplazarMismoTipo) {
        // Filtrar archivos para insertar
        var insertados = $.map(diccionarioArchivos, function (item, key) {
            if (item.archivo.Id === undefined && !item.eliminado) {
                return item.archivo;
            }
            return null;
        });

        // Filtrar archivos para eliminar
        var eliminados = $.map(diccionarioArchivos, function (item, key) {
            var idArchivo = item.archivo.Id || item.archivo.id;
            if (idArchivo > 0 && item.eliminado) {
                return item.archivo;
            }
            return null;
        });

        // Enviar archivos a servidor para eliminación
        return eliminarArchivos(
            idPadre,
            eliminados
        ).then(function () {
            return insertarArchivos(idPadre, insertados, reemplazarMismoTipo);
        });
    };

    // Graba un diccionario temporal: incluye agregar nuevos archivos y borrar los que ya no están
    var grabarDiccionarioArchivosSociedadLiquidacion = function (idPadre, diccionarioArchivos, idSociedadLiquidacion, idSociedadLiquidacionTipoSoporte, grupoDocumental) {
        // Filtrar archivos para insertar
        var insertados = $.map(diccionarioArchivos, function (item, key) {
            if (item.archivo.Id === undefined && !item.eliminado) {
                return item.archivo;
            }
            return null;
        });

        // Filtrar archivos para eliminar
        var eliminados = $.map(diccionarioArchivos, function (item, key) {
            var idArchivo = item.archivo.Id || item.archivo.id;
            if (idArchivo > 0 && item.eliminado) {
                return item.archivo;
            }
            return null;
        });

        // Enviar archivos a servidor para eliminación
        return eliminarArchivosSociedadLiquidacion(
            idPadre,
            eliminados,
            idSociedadLiquidacion,
            idSociedadLiquidacionTipoSoporte
        ).then(function () {
            return insertarArchivosSociedadLiquidacion(idPadre, insertados, idSociedadLiquidacion, idSociedadLiquidacionTipoSoporte, grupoDocumental);
        });
    };

    function EliminarArchivo(idPadre, archivos) {
        return eliminarArchivos(
            idPadre,
            archivos
        ).then(function () {
            Master.Alert(" Archivo eliminado Exitosamente!", null, Master.success);
        });
    }

    function EliminarArchivoSociedadLiquidacion(idPadre, archivos, idSociedadLiquidacion, idSociedadLiquidacionTipoSoporte) {
        return eliminarArchivosSociedadLiquidacion(
            idPadre,
            archivos,
            idSociedadLiquidacion,
            idSociedadLiquidacionTipoSoporte
        ).then(function () {
            Master.Alert(" Archivo eliminado Exitosamente!", null, Master.success);
        });
    }

    // Envia arreglo de archivos a servidor para eliminación
    var eliminarArchivos = function (idPadre, archivos) {
        return new Promise((resolver, rechazar) => {
            PageMethods.EliminarArchivos(
                idPadre,
                archivos,
                function (res) {
                    Master.PageMethodResponse(res, resolver, _archivosContext, 'Eliminar archivos');
                },
                rechazar
            );
        });
    };

    var eliminarArchivosSociedadLiquidacion = function (idPadre, archivos, idSociedadLiquidacion, idSociedadLiquidacionTipoSoporte) {
        return new Promise((resolver, rechazar) => {
            PageMethods.EliminarArchivos(
                idPadre,
                archivos,
                idSociedadLiquidacion,
                idSociedadLiquidacionTipoSoporte,
                function (res) {
                    Master.PageMethodResponse(res, resolver, _archivosContext, 'Eliminar archivos');
                },
                rechazar
            );
        });
    };

    // Envia arreglo de archivos a servidor para inserción
    var insertarArchivos = function (idPadre, archivos, reemplazarMismoTipo) {
        return new Promise((resolver, rechazar) => {
            PageMethods.InsertarArchivos(
                idPadre,
                archivos,
                reemplazarMismoTipo,
                function (res) {
                    Master.PageMethodResponse(
                        res,
                        function () {
                            resolver(res);
                        },
                        _archivosContext,
                        'Insertar archivos'
                    );
                },
                rechazar
            );
        });
    };

    var insertarArchivosSociedadLiquidacion = function (idPadre, archivos, idSociedadLiquidacion, idSociedadLiquidacionTipoSoporte, grupoDocumental) {
        return new Promise((resolver, rechazar) => {
            PageMethods.InsertarArchivos(
                idPadre,
                archivos,
                idSociedadLiquidacion,
                idSociedadLiquidacionTipoSoporte,
                grupoDocumental,
                function (res) {
                    Master.PageMethodResponse(
                        res,
                        function () {
                            resolver(res);
                        },
                        _archivosContext,
                        'Insertar archivos'
                    );
                },
                rechazar
            );
        });
    };

    // Consulta un archivo desde el diccionario de archivos o desde el servidor
    function consultarArchivo(diccionarioArchivos, numeroArchivo, idArchivo) {
        debugger;
        return new Promise((resolver, rechazar) => {
            // Consultar localmente primero, usando el número del archivo en el diccionario (archivos aún no guardados)
            if (Object.keys(diccionarioArchivos).indexOf(String(numeroArchivo)) > -1
                && diccionarioArchivos[numeroArchivo].archivo["ContenidoBase64"] !== null) {
                leerArchivo(diccionarioArchivos[numeroArchivo].archivo);
                resolver();
            }
            else {
                // Consultar en servidor
                try {
                    PageMethods.ConsultarArchivo(
                        idArchivo,
                        function (res) {
                            Master.PageMethodResponse(
                                res,
                                function (res) {
                                    respuestaConsultarArchivo(res, diccionarioArchivos[numeroArchivo]);
                                    resolver();
                                },
                                _archivosContext,
                                'ConsultarArchivo'
                            );
                        },
                        Master.PageMethods_Error
                    );
                } catch (ex) {
                    if (ex instanceof SaeExcepcion) {
                        Master.SaeExcepcion(ex, false);
                    } else if (ex instanceof Error) {
                        Master.Exception("Consulta servicios", _archivosContext, ex, false);
                    }
                }
            }
        });
    }

    // Ejecuta acciones luego de consultar un archivo en el servidor
    var respuestaConsultarArchivo = function (res, archivoEnDiccionario) {
        var archivo = res.Respuesta;
        leerArchivo(archivo);

        // Guardar archivo consultado en diccionario para ahorrar posteriores llamados a servidor
        archivoEnDiccionario.archivo["ContenidoBase64"] = archivo["ContenidoBase64"];
    };

    // Convierte un dataURI a un Blob
    var dataURIToBlob = function (dataURI) {
        var binStr = atob(dataURI.split(',')[1]),
            len = binStr.length,
            arr = new Uint8Array(len),
            mimeString = dataURI.split(';')[0].split(':')[1];

        for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }

        return new Blob([arr], {
            type: mimeString
        });
    };

    // Lee el contenido de un archivo en base 64 y lo descarga
    var leerArchivo = function (archivo) {
        // Crear data URI con el tipo y contenido
        var tipoMime = archivo["TipoMime"] || archivo["tipoMime"];
        var dataURI = 'data:' + tipoMime + ';base64,' + archivo["ContenidoBase64"];
        // Convertir a blob para evitar límite de Chrome
        var blob = dataURIToBlob(dataURI);
        // Crear una object URL con el blob
        var url = URL.createObjectURL(blob);

        // Ahora crear un link invisible apuntando al archivo
        var element = document.createElement('a');
        element.setAttribute('href', url);
        var nombre = archivo["Nombre"] || archivo.documento.nombre;
        element.setAttribute('download', nombre);
        element.style.display = 'none';
        document.body.appendChild(element);
        // Hacer clic en el link recién creado y luego borrarlo
        element.click();
        document.body.removeChild(element);
    };

    var validarAgregarDocumento = function validarAgregarDocumento(idSeleccionado, tiposDocumento, tablaDocumento) {
        try {
            var tipoDocumentoSeleccionado = $.grep(JSON.parse(tiposDocumento.val()), function (elemento) {
                return elemento.id.toString() === idSeleccionado.toString();
            });

            if (tipoDocumentoSeleccionado[0].obligatorio) {
                var tiposDocumentoSeleccionado = $.grep(tablaDocumento.rows.all, function (fila) {
                    return fila.value["documento.idGrupoDocumentalTipoDocumento"] === idSeleccionado;
                });

                if (tiposDocumentoSeleccionado.length >= tipoDocumentoSeleccionado[0].cantidadMaxima) {
                    throw new SaeExcepcion(_archivosContext, "Agregar archivo", "Ya se agregaron todos los documentos <strong>"
                        + tipoDocumentoSeleccionado[0].descripcion
                        + "</strong> obligatorios.", Master.warning, true);
                }
            }

            return true;
        }
        catch (ex) {
            if (ex instanceof SaeExcepcion) {
                Master.SaeExcepcion(ex, false);
            } else if (ex instanceof Error) {
                Master.Exception("ValidaAgregarDocumento", _archivosContext, ex, false);
            }
        }
    };

    var validarTablaDocumento = function validarTablaDocumento(tiposDocumento, tablaDocumento) {
        return new Promise((resolver, rechazar) => {
            try {
                $.each(JSON.parse(tiposDocumento.val()), function () {
                    var tipoDocumento = this;
                    CumpleValidacionMinimos = true;
                    if (tipoDocumento.obligatorio) {
                        var tiposDocumentoSeleccionado = $.grep(tablaDocumento.rows.all, function (fila) {
                            return fila.value["documento.idGrupoDocumentalTipoDocumento"] === tipoDocumento.id.toString();
                        });

                        if (tipoDocumento.cantidad > tiposDocumentoSeleccionado.length) {
                            tablaDocumento.$el.focus();
                            CumpleValidacionMinimos = false;
                            throw new SaeExcepcion(_archivosContext, "Agregar archivo", "El tipo de documento <strong>"
                                + tipoDocumento.descripcion
                                + "</strong> es obligatorio y debe contener al menos "
                                + tipoDocumento.cantidad + ".", Master.warning, true);
                        }

                        if (tipoDocumento.cantidadMaxima !== 0 && tipoDocumento.cantidad > tiposDocumentoSeleccionado.length && tipoDocumento.cantidad < tiposDocumentoSeleccionado.length) {
                            tablaDocumento.$el.focus();
                            CumpleValidacionMinimos = false;
                            throw new SaeExcepcion(_archivosContext, "Agregar archivo", "El tipo de documento <strong>"
                                + tipoDocumento.descripcion
                                + "</strong> es obligatorio y debe contener mínimo "
                                + tipoDocumento.cantidad
                                + " y máximo "
                                + tipoDocumento.cantidadMaxima, Master.warning, true);
                        }
                    }
                });

                return resolver();
            }
            catch (ex) {
                if (ex instanceof SaeExcepcion) {
                    Master.SaeExcepcion(ex, false);
                } else if (ex instanceof Error) {
                    Master.Exception("ValidaAgregarDocumento", _context, ex, false);
                }
            }
        });
    };

    return {
        validarArchivo: validarArchivo,
        agregarArchivoADiccionario: agregarArchivoADiccionario,
        grabarDiccionarioArchivos: grabarDiccionarioArchivos,
        consultarArchivo: consultarArchivo,
        validarAgregarDocumento: validarAgregarDocumento,
        validarTablaDocumento: validarTablaDocumento,
        CumpleValidacionMinimos: CumpleValidacionMinimos,
        leerArchivo: leerArchivo,
        EliminarArchivo: EliminarArchivo,
        grabarDiccionarioArchivosSociedadLiquidacion: grabarDiccionarioArchivosSociedadLiquidacion,
        EliminarArchivoSociedadLiquidacion: EliminarArchivoSociedadLiquidacion
    };
})();

// Modulo para el manejo de documentos
var modulo_manejo_documentos = (function () {
    let _documentosContext = typeof _context !== 'undefined' ? _context : { name: "Documentos" };

    var agregarDocumentoDiccionario = function agregarDocumentoDiccionario(diccionarioArchivos, $fleArchivo, $ddlTipoDocumento, asunto, descripcion, idActivo, contadorDeArchivos, actualizarInterfaz, extensionesPermitidas) {
        extensionesPermitidas = extensionesPermitidas || null;
        if (validarArchivo($fleArchivo, $ddlTipoDocumento, extensionesPermitidas)) {
            var contenido = $fleArchivo.get(0).files[0];

            var gestorDocumental = {
                id: undefined,
                rutaArchivo: undefined,
                tipoMime: contenido.type,
                extension: undefined,
                radicadoGestor: {
                    asunto: asunto,
                    expedienteGestor: {
                        idActivo: idActivo
                    }
                },
                documento: {
                    nombre: contenido.nombre,
                    descripcion: descripcion
                },
                Numero: contadorDeArchivos
            };

            var reader = new FileReader();
            reader.onload = function () {
                // Leer archivo y guardar en diccionario
                archivo.ContenidoBase64 = reader.result.split("base64,")[1];
                diccionarioArchivos[archivo.Numero] = {
                    archivo: archivo,
                    eliminado: false
                };

                // Actualizar interfaz
                actualizarInterfaz(contenido.name, contadorDeArchivos);
                contadorDeArchivos++;
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };

            reader.readAsDataURL(contenido);
        }
    };

    // Graba un diccionario temporal: incluye agregar nuevos archivos y borrar los que ya no están
    var grabarDiccionarioDocumentos = function grabarDiccionarioDocumentos(idPadre, diccionarioArchivos, tiposDocumento, tablaDocumento, validar = true) {

        // Filtrar archivos para insertar
        var insertados = $.map(diccionarioArchivos, function (item, key) {
            if (item.archivo.id === undefined && !item.eliminado) {
                return item.archivo;
            }
            return null;
        });


        // Filtrar archivos para eliminar
        var eliminados = $.map(diccionarioArchivos, function (item, key) {
            if (item.archivo.id > 0 && item.eliminado) {
                return item.archivo;
            }
            return null;
        });

        // Enviar archivos a servidor para eliminación
        return eliminarDocumentos(idPadre, eliminados)
            .then(function () {
                if (validar) {
                    return modulo_archivo_anexo.validarTablaDocumento(tiposDocumento, tablaDocumento);
                } else {
                    return Promise.resolve();
                }
            })
            .then(function () {
                return insertarDocumentos(idPadre, insertados);
            });

    };

    // Envía arreglo de archivos a servidor para eliminación
    var eliminarDocumentos = function eliminarDocumentos(idPadre, archivos) {
        return new Promise((resolver, rechazar) => {
            PageMethods.EliminarDocumentos(
                idPadre,
                archivos,
                function (res) {
                    Master.PageMethodResponse(res, resolver, _documentosContext, 'Eliminar archivos');
                },
                rechazar
            );
        });
    };

    // Envía arreglo de archivos a servidor para inserción
    var insertarDocumentos = function insertarDocumentos(idPadre, archivos) {
        return new Promise((resolver, rechazar) => {
            PageMethods.InsertarDocumentos(
                idPadre,
                archivos,
                function (res) {
                    Master.PageMethodResponse(
                        res,
                        function () {
                            resolver(res);
                        },
                        _documentosContext,
                        'Insertar archivos'
                    );
                },
                rechazar
            );
        });
    };

    // Consulta un archivo desde el diccionario de archivos o desde el servidor
    function consultarDocumento(diccionarioArchivos, numeroArchivo, idArchivo) {
        // Consultar localmente primero, usando el número del archivo en el diccionario (archivos aún no guardados)
        if (Object.keys(diccionarioArchivos).indexOf(String(numeroArchivo)) > -1
            && diccionarioArchivos[numeroArchivo].archivo["ContenidoBase64"] !== null) {
            leerArchivo(diccionarioArchivos[numeroArchivo].archivo);
        }
        else {
            // Consultar en servidor
            try {
                PageMethods.ConsultarDocumento(
                    idArchivo,
                    function (res) {
                        Master.PageMethodResponse(
                            res,
                            function (res) {
                                respuestaConsultarArchivo(res, diccionarioArchivos[numeroArchivo]);
                            },
                            _documentosContext,
                            'ConsultarArchivo'
                        );
                    },
                    Master.PageMethods_Error
                );
            } catch (ex) {
                if (ex instanceof SaeExcepcion) {
                    Master.SaeExcepcion(ex, false);
                } else if (ex instanceof Error) {
                    Master.Exception("Consulta servicios", _documentosContext, ex, false);
                }
            }
        }
    };

    // Ejecuta acciones luego de consultar un archivo en el servidor
    var respuestaConsultarArchivo = function (res, archivoEnDiccionario) {
        var archivo = res.Respuesta;
        leerArchivo(archivo);

        // Guardar archivo consultado en diccionario para ahorrar posteriores llamados a servidor
        archivoEnDiccionario.archivo["ContenidoBase64"] = archivo["ContenidoBase64"];
    };

    function consultaDocumento(diccionarioArchivos, numeroArchivo, idDocumento) {
        return new Promise((resolver, rechazar) => {
            if (Object.keys(diccionarioArchivos).indexOf(String(numeroArchivo)) > -1
                && diccionarioArchivos[numeroArchivo].archivo["ContenidoBase64"] !== null) {
                leerArchivo(diccionarioArchivos[numeroArchivo].archivo);
                resolver();
            }
            else {
                // Consultar en servidor
                Master.ShowLoading();

                PageMethods.ConsultaDocumento(
                    idDocumento,
                    function (resultado) {
                        Master.PageMethodResponse(
                            resultado,
                            function () {
                                resConsultaDocumento(resultado, resolver, diccionarioArchivos[numeroArchivo]);
                            },
                            _documentosContext,
                            'ConsultarDocumento'
                        );
                    },
                    rechazar
                );
            }
        }).finally(() => { Master.HideLoading(); });
    };

    var resConsultaDocumento = function resConsultaDocumento(res, resolver, archivoEnDiccionario) {
        var archivo = res.Respuesta;
        leerArchivo(archivo);

        // Guardar archivo consultado en diccionario para ahorrar posteriores llamados a servidor
        archivoEnDiccionario.archivo["ContenidoBase64"] = archivo["ContenidoBase64"];
        resolver();
    };

    // Convierte un dataURI a un Blob
    var dataURIToBlob = function (dataURI) {
        var binStr = atob(dataURI.split(',')[1]),
            len = binStr.length,
            arr = new Uint8Array(len),
            mimeString = dataURI.split(';')[0].split(':')[1];

        for (var i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }

        return new Blob([arr], {
            type: mimeString
        });
    };

    // Lee el contenido de un archivo en base 64 y lo descarga
    function leerArchivo(archivo) {
        // Crear data URI con el tipo y contenido
        var dataURI = 'data:' + archivo["tipoMime"] + ';base64,' + archivo["ContenidoBase64"];
        // Convertir a blob para evitar límite de Chrome
        var blob = dataURIToBlob(dataURI);
        // Crear una object URL con el blob
        var url = URL.createObjectURL(blob);

        // Ahora crear un link invisible apuntando al archivo
        var element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', archivo["Nombre"] || archivo.documento.nombre);
        element.style.display = 'none';
        document.body.appendChild(element);
        // Hacer clic en el link recién creado y luego borrarlo
        element.click();
        document.body.removeChild(element);
    }

    var descargarArchivo = function (base64, tipo, nombre) {
        // Crear data URI con el tipo y contenido
        var dataURI = 'data:' + tipo + ';base64,' + base64;
        // Convertir a blob para evitar límite de Chrome
        var blob = dataURIToBlob(dataURI);
        // Crear una object URL con el blob
        var url = URL.createObjectURL(blob);

        // Ahora crear un link invisible apuntando al archivo
        var element = document.createElement('a');
        element.setAttribute('href', url);
        element.setAttribute('download', nombre);
        element.style.display = 'none';
        document.body.appendChild(element);
        // Hacer clic en el link recién creado y luego borrarlo
        element.click();
        document.body.removeChild(element);
    };

    var insertarDocumento = function insertarDocumento(idPadre, $fleDocumento, idGrupoDocumentalTipo = null) {

        var contenido = $fleDocumento.get(0).files[0];

        var gestorDocumental = {
            id: undefined,
            rutaArchivo: undefined,
            tipoMime: contenido.type,
            extension: undefined,
            radicadoGestor: {},
            documento: {
                nombre: contenido.name,
                idGrupoDocumentalTipoDocumento: idGrupoDocumentalTipo
            }
        };

        var reader = new FileReader();
        reader.onload = function () {
            gestorDocumental.ContenidoBase64 = reader.result.split("base64,")[1];
            return insertarDocumentos(idPadre, [gestorDocumental]);
        };

        reader.onerror = function (error) {
            console.log('Error: ', error);
        };

        reader.readAsDataURL(contenido);
    };

    //Adicionado JDLEON , exponer el método para acceso externo
    var validar = function validar(tiposDocumento, tablaDocumento ) {
        return modulo_archivo_anexo.validarTablaDocumento(tiposDocumento, tablaDocumento);
    }

    return {
        agregarDocumentoDiccionario: agregarDocumentoDiccionario,
        grabarDiccionarioDocumentos: grabarDiccionarioDocumentos,
        consultarDocumento: consultarDocumento,
        consultaDocumento: consultaDocumento,
        descargarArchivo: descargarArchivo,
        insertarDocumento: insertarDocumento,
        leerArchivo: leerArchivo,
        validar: validar
    };
})();


//Retorna el index de una columna de acuerdo al texto que se visualiza
function ColumnaIndex(selectorTabla, textoColumnaEncabezado) {
    var indexResult;
    $(selectorTabla + " tr:nth-child(1) th").filter(
        function (index) {
            if ($(this).text() == textoColumnaEncabezado) {
                indexResult = index;
                return $(this);
            }

        });
    return indexResult;
}