var Utilities = function Utilities() {
    var _this = this;
    //Información interna de la clase.
    var _context = { name: "Utilities", description: "Controlador para los métodos Utilitarios del Aplicativo." };
    //Información expuesta de la Aplicación.
    _this.Application = { name: "Matrix", description: "Aplicativo - Matrix" };

    // <summary>Función para crear una notificación de tipo alerta flotante.</summary>
    // <param name="_message" type="String">Mensaje para la alerta.</param>
    // <param name="_title" type="String">Texto que representa un titulo que acompaña al mensaje de la alerta.</param>
    // <param name="_type" type="Object">Objeto que debe incluir el icono y el tipo de alerta que se desea mostrar.</param>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.Alert = function FloatingAlert(_message, _title, _type) {
        try {
            if (_this.ValidationText("vacio", _message)) {
                if ($.isPlainObject(_type) && _type.hasOwnProperty("icon") && _type.hasOwnProperty("type")) {
                    _title = _this.ValidationText("vacio", _title) ? "<strong>" + _title + "</strong> " : null;
                    $.notifyClose();
                    $.notify({ icon: _type.icon, title: _title, message: _message }, {
                        element: 'body', position: null, type: _type.type, allow_dismiss: true, newest_on_top: true,
                        placement: { from: "top", align: "right" },
                        offset: 10, spacing: 10, z_index: 9000, delay: 6000, timer: 1000,
                        mouse_over: 'pause',
                        template: '<div data-notify="container" class="col-xs-11 col-md-5 alert alert-{0}" role="alert"><button type="button" class="close" aria-hidden="true" data-notify="dismiss"><i class="fa fa-times-circle"></i></button><span data-notify="icon"></span> <span data-notify="title">{1}</span><span data-notify="message">{2}</span><a data-notify="dismiss" data-notify="url"></a></div>'
                    });
                } else {
                    throw new SaeExcepcion(_context, _this.Alert.name, "Para visualizar la alerta deseada, se requiere el tipo un tipo de alerta que la identifique.", _this.warning, true);
                }
            } else {
                throw new SaeExcepcion(_context, _this.Alert.name, "El mensaje para la alerta que no debe ser vacio.", _this.warning, true);
            }
        } catch (ex) {
            throw ex;
        }
    };

    // <summary>Función para obtener el parametro que viene incluido en la url.</summary>
    // <param name="_param" type="String">Identificador del parametro.</param>
    // <return>Cadena de texto con el valor asignado al parametro en la url</return>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.GetParametroURL = function GetParametroURL(_param) {
        try {
            if (_this.ValidationText("vacio", _param)) {
                return decodeURIComponent((new RegExp('[?|&]' + _param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
            } else {
                throw new SaeExcepcion(_context, "GetParametroURL", "El identificador del parámetro de la url que desea consultar no debe ser un valor nulo o vacío.", _this.warning, true);
            }
        } catch (ex) {
            throw ex;
        }
    };

    // <summary>Función para obtener la raíz del sevidor del sitio.</summary>
    // <return>Cadena de texto con la raíz del sitio</return>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.GetPathRaiz = function GetPathRaiz() {
        try {
            switch (location.host) {
                case "181.59.190.184:19470":
                    //return location.protocol + "//" + location.host + "/"; //break;
                    return location.protocol + "//" + [location.host, location.pathname.split("/")[1]].join("/") + "/";
                ////break;
                case "localhost": return location.protocol + "//" + [location.host, location.pathname.split("/")[1]].join("/") + "/";
                ////break;
            }
        } catch (ex) {
            throw ex;
        }
    };

    // <summary>Función para registrar una función o método en el cargue inicial de la página.</summary>
    // <param name="_function" type="Function">Función a registrar.</param>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.AddPageLoaded = function AddPageLoaded(_function) {
        try {
            if (_function instanceof Function) {
                Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(_function);
            } else {
                console.log("No fue posible registrar la función requerida: " + JSON.stringify(_function));
            }
        } catch (ex) {
            throw ex;
        }
    };

    // <summary>Función para eliminar una función o método del cargue inicial de la página.</summary>
    // <param name="_function" type="Function">Función a eliminar.</param>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.RemovePageLoaded = function RemovePageLoaded(_function) {
        try {
            if (_function instanceof Function) {
                Sys.WebForms.PageRequestManager.getInstance().remove_pageLoaded(_function);
            } else {
                console.log("No fue posible remover la función requerida: " + JSON.stringify(_function));
            }
        } catch (ex) {
            throw ex;
        }
    };

    // <summary>Función para mostrar un mensaje de que la sesión ha caducado una función.</summary>
    // <param name="_button" type="Function">Objeto tipo MessageBoxButton.</param>
    // <param name="_button" type="_icon">Objeto tipo MessageBoxType.</param>
    // <remarks>Diego Tique 2017-11-22 </remarks>
    _this.NoSessionTrue = function NoSessionTrue(_button, _icon) {
        Utilities2.Notification.MessageBox.Show("Su sesión <strong>ha caducado</strong> será redirigido para que ingrese al sistema, Gracias.", "Sesión Caducada", _button, _icon, function () {
            var urlBase = window.location.protocol + "//" + window.location.host;
            Utilities2.Notification.MessageBox.Close();
            window.location.href = urlBase + "/Login.aspx";
        });
    };

    // <summary>Función para agregar un evento a un elemento.</summary>
    // <param name="_control" type="Object">Elemento al cual se le agregará el evento.</param>
    // <param name="_event" type="Object">Nombre del evento.</param>
    // <param name="_function" type="Function">Función a ejecutar por el evento.</param>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.AddEventListener = function AddEventListenerControl(_control, _event, _function) {
        try {
            if (!$.isEmptyObject(_control) && typeof _control === "object") {
                if (_this.ValidationText("vacio", _event)) {
                    _control.bind(_event, _function);
                } else {
                    throw new SaeExcepcion(_context, _this.AddEventListener.name, "No es posible agregar el evento al control deseado, ya que el identificador del evento recibido no es válido.", _this.warning, true);
                }
            } else {
                throw new SaeExcepcion(_context, _this.AddEventListener.name, "No es posible agregar el evento al control deseado, ya que el control no es válido.", _this.warning, true);
            }
        } catch (ex) {
            throw ex;
        }
    };

    // <summary>Función para quitar un evento a un elemento.</summary>
    // <param name="_control" type="Object">Elemento al cual se le quitará el evento.</param>
    // <param name="_event" type="Object">Nombre del evento.</param>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.RemoveEventListener = function RemoveEventListenerControl(_control, _event) {
        try {
            if (!$.isEmptyObject(_control) && typeof _control === "object") {
                if (_this.ValidationText("vacio", _event)) {
                    _control.unbind(_event);
                } else {
                    throw new SaeExcepcion(_context, _this.RemoveEventListener.name, "No es posible quitar el evento al control deseado, ya que el identificador del evento recibido no es válido.", _this.warning, true);
                }
            } else {
                throw new SaeExcepcion(_context, _this.RemoveEventListener.name, "No es posible quitar el evento al control deseado, ya que el control no es válido.", _this.warning, true);
            }
        }
        catch (ex) {
            throw ex;
        }
    };

    // <summary>Función validar una cadena de texto de acuerdo con un tipo de validación.</summary>
    // <param name="_typeText" type="String">Tipo de validación que identifica a la cadena.</param>
    // <param name="_text" type="String">Cadena de texto de texto que se desea validar.</param>
    // <return type="Boolean">Indicador reultado de la validación.</return>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.ValidationText = function ValidationText(_typeText, _text) {
        try {
            var RegEx;
            switch (_typeText) {
                case "vacio":
                    return (_text !== null && _text !== '' && !/^\s+$/.test(_text)) ? true : false;
                //break;
                case "numerico":
                    return (_this.ValidationText("vacio", _text) && /^\d*$/.test(_text)) ? true : false;
                //break;
                case "cero":
                    return _text !== 0 ? true : false;
                //break;
                case "moneda":
                    return (_this.ValidationText("vacio", _text) && $.isNumeric(_text)) ? true : false;
                //break;
                case "nombres_apellidos":
                    RegEx = /^[ A-Za-záéíóúÁÉÍÓÚ]*$/;
                    return (_text !== '' && RegEx.test(_text) && !/^\s+$/.test(_text)) ? true : false;
                //if (_text != '' && RegEx.test(_text) && !/^\s+$/.test(_text)) {
                //    return true;
                //}
                //break;
                case "direccion":
                    RegEx = /^[ A-Za-z0-9-_#/ñÑáéíóúÁÉÍÓÚ.,]*$/;
                    return (_text !== '' && RegEx.test(_text) && !/^\s+$/.test(_text)) ? true : false;
                //if (_text != '' && RegEx.test(_text) && !/^\s+$/.test(_text)) {
                //    return true;
                //}
                //break;
                case "email":
                    RegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return (_this.ValidationText("vacio", _text) && RegEx.test(_text)) ? true : false;
                //break;
                case "alfanumerico":
                    RegEx = /^[ A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]*$/;
                    return (_text !== '' && RegEx.test(_text) && !/^\s+$/.test(_text)) ? true : false;
                //if (_text != '' && RegEx.test(_text) && !/^\s+$/.test(_text)) {
                //    return true;
                //}
                //break;
                case "abierta":
                    RegEx = /^[ A-Za-z0-9_#/ñÑáéíóúÁÉÍÓÚ.,-]*$/;
                    return (_this.ValidationText("vacio", _text) && RegEx.test(_text)) ? true : false;
                //break;
                case "ciudad":
                    RegEx = /^[ A-Za-zñÑáéíóúÁÉÍÓÚ.]*$/;
                    return (_text !== '' && RegEx.test(_text) && !/^\s+$/.test(_text)) ? true : false;
                //if (_text != '' && RegEx.test(_text) && !/^\s+$/.test(_text)) {
                //    return true;
                //}
                //break;
                case "usuario":
                    return (_text !== null && _text !== '' && /^[A-Za-z]*$/.test(_text) && !/^\s+$/.test(_text)) ? true : false;
                //break;
                default:
                    throw new SaeExcepcion(_context, _this.ValidationText.name, "No se tiene el tipo de validación solicitada: " + _typeText + ".", _this.info, true);
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  1. Solo permite números y tecla de retroceso
    _this.ValidacionNumeros = function ValidacionNumeros(e) {
        try {
            if (e.keyCode === 8 || e.keyCode >= 48 && e.keyCode <= 57) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  2. Calcula la cantidad de meses entre fechas
    _this.restafechasmeses = function restafechasmeses(f1, f2) {
        try {
            //Divide una cadena en una matriz de subcadenas
            var aFecha1 = f1.split('-');
            var aFecha2 = f2.split('-');
            //Devuelve el número de milisegundos entre la media noche y una fecha especificada (dd,mm,yyyy)
            var fFecha1 = Date.UTC(aFecha1[0], aFecha1[1] - 1, aFecha1[2]);
            var fFecha2 = Date.UTC(aFecha2[0], aFecha2[1] - 1, aFecha2[2]);
            var dif = fFecha2 - fFecha1;
            //milisegundos, segundos, minutos, horas, días (para devolver los meses)
            var meses = Math.floor(dif / (1000 * 60 * 60 * 24 * 30));
            return meses;
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  3. Comparar si una fecha es mayor o igual que otra (True = Fecha inicial mayor; False = Fecha final mayor)
    _this.validarfechaMayorQue = function validarfechaMayorQue(fechainicial, fechafinal) {
        try {
            var inicio = new Date(fechainicial);

            var final = new Date(fechafinal);

            if (inicio >= final) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  4. Devuelve una fecha en formato yyyy-mm-dd de acuerdo a una fecha enviada
    _this.obtenerfechaAnioMesDia = function obtenerfechaAnioMesDia(fecha) {
        try {            
            if (fecha === null) {
                fecha = new Date();
            }
            var year = fecha.getFullYear();
            var month = (1 + fecha.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = fecha.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return year + '-' + month + '-' + day;
        } catch (ex) {
            throw ex;
        }
    };

    //Variante de obtenerfechaAnioMesDia, si la fecha llega null, retorna cadena vacia - Pablo Castrillon - 2019-01-23
    _this.obtenerfechaAnioMesDiaNull = function obtenerfechaAnioMesDiaNull(fecha) {
        try {
            
            if (fecha === null) {
                return "";
            }
            var year = fecha.getFullYear();
            var month = (1 + fecha.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = fecha.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return year + '-' + month + '-' + day;
        } catch (ex) {
            throw ex;
        }
    };

    _this.obtenerfechaDiaMesAnioNull = function obtenerfechaDiaMesAnioNull(fecha) {
        try {

            if (fecha === null) {
                return "";
            }
            var year = fecha.getFullYear();
            var month = (1 + fecha.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = fecha.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            //return year + '-' + month + '-' + day;
            return day + '/' + month + '/' + year;
        } catch (ex) {
            throw ex;
        }
    };
    //Validaciones generales Matrix  5. Comparar si una fecha es mayor a la fecha actual (True = Fecha comparación mayor a hoy; False = Fecha comparación menor a hoy)
    _this.validarfechaMayorActual = function validarfechaMayorActual(fecha) {
        try {
            var hoy = new Date();
            var fechacomparacion = new Date(fecha);

            if (fechacomparacion > hoy) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  6. Identifica el evento de la tecla enter
    _this.teclaEnter = function teclaEnter(e) {
        try {
            if (e.keyCode === 13) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  7. Solo permite números, punto y tecla de retroceso
    _this.ValidacionNumerosPunto = function ValidacionNumerosPunto(e) {
        try {
            if (e.keyCode === 8 || e.keyCode === 46 || e.keyCode >= 48 && e.keyCode <= 57) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  8. Devuelve un texto con la primera letra en mayúscula y las demás en minúscula
    _this.LetraTipoOracion = function LetraTipoOracion(texto) {
        try {
            var nuevoTexto = texto.toLowerCase();
            nuevoTexto = nuevoTexto.charAt(0).toUpperCase() + nuevoTexto.slice(1);
            return nuevoTexto;
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  9. Suma un año de acuerdo a una fecha enviada
    _this.sumarAnio = function sumarAnio(fecha) {
        try {
            var year = fecha.getFullYear() + 1; //aquí se suma 1 año a la fecha dada
            var month = (1 + fecha.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var day = fecha.getDate().toString();
            day = day.length > 1 ? day : '0' + day;
            return year + '-' + month + '-' + day;
        } catch (ex) {
            throw ex;
        }
    };

    //validaciones general Matrix 10. Formato moneda
    _this.FormatoMoneda = function FormatoMoneda(amount, decimals) {
        try {
            amount += ''; // por si pasan un numero en vez de un string
            amount = parseFloat(amount.replace(/[^0-9\.\-]/g, '')); // elimino cualquier cosa que no sea numero o punto o signo menos

            decimals = decimals || 0; // por si la variable no fue fue pasada

            // si no es un numero o es igual a cero retorno el mismo cero
            if (isNaN(amount) || amount === 0)
                return parseFloat(0).toFixed(decimals);

            // si es mayor o menor que cero retorno el valor formateado como numero
            amount = '' + amount.toFixed(decimals);

            //separo los decimales del entero ["3566", "00"]
            var amount_parts = amount.split('.'), regexp = /(\d+)(\d{3})/;
            //console.log(amount_parts, regexp);

            while (regexp.test(amount_parts[0])) {
                amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
            }

            return "$" + amount_parts.join('.');
        } catch (ex) {
            throw ex;
        }
    };

    //validaciones general Matrix 11. Retira signos y mantiene el decimal
    _this.RetirarSigno = function RetirarSigno(monto) {
        try {
            monto = monto.replace(/[^0-9\.]/g, '');
            return parseFloat(monto);
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  12. Función que permite letras, números, guion (-) y tecla de retroceso
    _this.ValidaLetrasNumerosGuion = function ValidaLetrasNumerosGuion(e) {
        try {
            if ((e.keyCode >= 97 && e.keyCode <= 122) || //Letras Minúsculas
                (e.keyCode >= 65 && e.keyCode <= 90) || //Letras Mayúsculas
                (e.keyCode >= 48 && e.keyCode <= 57) || //Números
                e.keyCode === 45 || e.keyCode === 8) { //Guión y Tecla retroceso
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  13. Calcula la cantidad de días entre fechas
    _this.restafechasdias = function restafechasdias(f1, f2) {
        try {

            var dia = (1000 * 60 * 60 * 24);

            aFecha1 = f1.split('-');
            aFecha2 = f2.split('-');

            var fFecha1 = new Date(aFecha1);
            var fFecha2 = new Date(aFecha2);

            var Dias = Math.ceil((fFecha1.getTime() - fFecha2.getTime()) / (dia));
            var Final = (Dias * -1);
            return Final;

        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  14. Calcula la diferencia de días entre dos fechas teniendo en cuenta el número de meses ej; 01/01/2016 - 15/02/2016 mese 1 - días 15
    _this.restamesesdias = function restamesesdias(Dias) {
        try {

            var anoCalendario = 365;
            var anoComercial = 360;
            var mesComercial = 30;
            var Diferencia = 0;
            var DiferenciaTotal = 0;
            var cantidadAnos = 0;

            if (Dias > anoComercial) {
                cantidadAnos = Math.floor(Dias / anoComercial);
                Diferencia = Math.floor(Dias % anoComercial);
                if (Diferencia > mesComercial) {
                    DiferenciaTotal = (anoCalendario * cantidadAnos) - (anoComercial * cantidadAnos) - Math.floor(Diferencia % mesComercial);
                    if (DiferenciaTotal < 0) {
                        DiferenciaTotal = DiferenciaTotal * -1;
                    }
                } else {
                    if (Dias <= anoCalendario) {
                        DiferenciaTotal = Math.floor(Dias - (anoComercial * cantidadAnos) - Diferencia);
                    } else {
                        DiferenciaTotal = Math.floor(Dias - (anoCalendario * cantidadAnos));
                    }
                }
            } else {
                Diferencia = Math.floor(Dias % mesComercial);
                DiferenciaTotal = Math.floor(Diferencia - 1);
            }

            return DiferenciaTotal;

        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  15. Que una fecha ses estrictamente mayor que otra 
    _this.validarfechaMayorNoIgual = function validarfechaMayorNoIgual(fechainicial, fechafinal) {
        try {
            var inicio = new Date(fechainicial);

            var final = new Date(fechafinal);

            if (inicio > final) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  16. Comparar si una fecha es mayor o igual que otra (True = Fecha inicial menor; False = Fecha final menor)
    _this.validarfechaMenorNoIgual = function validarfechaMenorNoIgual(fechainicial, fechafinal) {
        try {
            var inicio = new Date(fechainicial);

            var final = new Date(fechafinal);

            if (inicio < final) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  17. Obtiene el nombre del día actual
    _this.obtieneNombreDia = function obtieneNombreDia() {
        try {
            var diasSemana = new Array("Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
            var f = new Date();
            return diasSemana[f.getDay()];
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  18. Obtiene el nombre del mes actual
    _this.obtieneNombreMes = function obtieneNombreMes() {
        try {
            var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
            var f = new Date();
            return meses[f.getMonth()];
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  19. Solo permite números, signo menos y tecla de retroceso
    _this.ValidacionNumerosSignoMenos = function ValidacionNumerosSignoMenos(e) {
        try {
            if (e.keyCode === 8 || e.keyCode === 45 || e.keyCode >= 48 && e.keyCode <= 57) {
                return true;
            } else {
                return false;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //validaciones general Matrix 11. Retira signos y mantiene el decimal
    _this.RetirarSignoPesosNegativo = function RetirarSignoPesosNegativo(monto) {
        try {
            monto = monto.replace(/[^0-9\.\-]/g, '');
            return parseFloat(monto);
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  20. Comparar si una fecha es mayor O Igual a la fecha actual (True = Fecha comparación menor a hoy; False = Fecha comparación mayor o Igual a hoy)
    _this.validarFechaMenorActual = function validarFechaMenorActual(fecha) {
        try {
            var hoy = new Date();
            var fechacomparacion = new Date();
            fecha = fecha.split("-");
            fechacomparacion.setFullYear(fecha[0], fecha[1] - 1, fecha[2]);

            if (fechacomparacion >= hoy) {
                return false;
            } else {
                return true;
            }
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones generales Matrix  21. Valiar email tipo nombre@servidor.dominio (True=si el email es valido, false=si no cumple las condiciones de email.)
    _this.ValidarMail = function ValidarMail(mail) {
        try {
            return /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
        } catch (ex) {
            throw ex;
        }
    };

    //validaciones general Matrix 22. Formato de miles y decimales
    _this.FormatoMiles = function FormatoMiles(amount, decimals) {
        try {
            amount += ''; // por si pasan un numero en vez de un string
            amount = parseFloat(amount.replace(/[^0-9\.\-]/g, '')); // elimino cualquier cosa que no sea numero o punto o signo menos

            decimals = decimals || 0; // por si la variable no fue fue pasada

            // si no es un numero o es igual a cero retorno el mismo cero
            if (isNaN(amount) || amount === 0)
                return parseFloat(0).toFixed(decimals);

            // si es mayor o menor que cero retorno el valor formateado como numero
            amount = '' + amount.toFixed(decimals);

            //separo los decimales del entero ["3566", "00"]
            var amount_parts = amount.split('.'), regexp = /(\d+)(\d{3})/;
            //console.log(amount_parts, regexp);

            while (regexp.test(amount_parts[0])) {
                amount_parts[0] = amount_parts[0].replace(regexp, '$1' + ',' + '$2');
            }

            return amount_parts.join('.');
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones general Matrix 23. Limpia un combo y lo deja inactivo
    _this.LimpiaInhabilitaCombobox = function LimpiaInhabilitaCombobox(nombreCombo) {
        try {
            $("#" + nombreCombo).html("");
            $("#" + nombreCombo).prop("disabled", true);
        } catch (ex) {
            throw ex;
        }
    };

    //Validaciones general Matrix 24. Genera la adaptación de campos tipos fecha para cualquier explorador
    _this.DatePickerExplorers = function DatePickerExplorers(controlDatePicker) {
        try {
            var _DatoFechaSel = null;
            $('#' + controlDatePicker).daterangepicker({ singleDatePicker: true, showDropdowns: true }, function () {
                _DatoFechaSel = $("#" + controlDatePicker).data('daterangepicker').endDate;
            });
            //return _DatoFechaSel.format('YYYY-MM-DD');
        } catch (ex) {
            throw ex;
        }
    };

    //Fin Validaciones generales Matrix

    _this.Confirmation = function Confirmation(titulo, mensaje, funSuccess, funCancel) {
        try {
            $dialog = _this.CreateElement("div", [{ name: "id", value: "k-window" }]);
            $message = _this.CreateElement("p", [{ name: "class", value: "k-tittle" }, { name: "style", value: "font-weight: 700;" }]);
            $message.appendChild(document.createTextNode(mensaje));
            $buttons = _this.CreateElement("div", [{ name: "class", value: "text-right" }]);
            $btnSuccess = _this.CreateElement("button", [{ name: "id", value: "btnWindowSuccess" }, { name: "type", value: "button" }, { name: "class", value: "btn btn-labeled btn-primary btn-sm" }]);
            $btnLabel = _this.CreateElement("span", [{ name: "class", value: "btn-label" }]);
            $btnLabel.appendChild(_this.CreateElement("i", [{ name: "class", value: "glyphicon glyphicon-ok" }]));
            $btnSuccess.appendChild($btnLabel);
            $btnSuccess.appendChild(document.createTextNode("Aceptar"));
            if (funSuccess) {
                _this.AddEventListener($($btnSuccess), "click", funSuccess);
            } else {
                _this.AddEventListener($($btnSuccess), "click", function () {
                    $("#k-window").data("kendoWindow").close();
                });
            }
            $btnCancel = _this.CreateElement("button", [{ name: "id", value: "btnWindowCancel" }, { name: "type", value: "button" }, { name: "class", value: "btn btn-labeled btn-danger btn-sm" }, { name: "style", value: "margin-left: 3px;" }]);
            $btnLabel = _this.CreateElement("span", [{ name: "class", value: "btn-label" }]);
            $btnLabel.appendChild(_this.CreateElement("i", [{ name: "class", value: "glyphicon glyphicon-remove" }]));
            $btnCancel.appendChild($btnLabel);
            $btnCancel.appendChild(document.createTextNode("Cancelar"));
            if (funCancel) {
                _this.AddEventListener($($btnCancel), "click", funCancel);
            } else {
                _this.AddEventListener($($btnCancel), "click", function () {
                    $("#k-window").data("kendoWindow").close();
                });
            }
            $buttons.appendChild($btnSuccess); $buttons.appendChild($btnCancel);
            $dialog.appendChild($message); $dialog.appendChild($buttons);
            document.body.appendChild($dialog);
            if ($("#k-window")) {
                var window = $("#k-window").kendoWindow({
                    title: titulo,
                    visible: false,
                    width: "280px",
                    resizable: false,
                    actions: [],
                    modal: true,
                    draggable: false,
                    pinned: true,
                    position: { top: 100 },
                    close: function (e) {
                        var interval = setInterval(function () {
                            e.preventDefault(); e.sender.destroy(); clearInterval(interval);
                        }, 300);
                    },
                    animation: {
                        open: {
                            effects: "fade:in"
                        },
                        close: {
                            effects: "fade:out"
                        }
                    }
                }).data("kendoWindow");
                window.open().center();
            } else {
                throw new SaeExcepcion(_context, "Confirmation", "No fue posible crear la notificación solicitada.", _this.danger, true);
            }
        } catch (ex) {
            throw ex;
        }
    };

    _this.NewWindow = function NewWindow(page, left, top, toolbar, target) {
        window.open(page, "", "width=900,height=500,left=150,top=100,toolbar=0,location=0, directories=0, scrollbars=1, resizable=1");
    };

    // <summary>Función para mostrar los mensajes de alerta para los errors de tipo SaeExcepcion o controlados.</summary>
    // <param name="_error" type="Object">Objeto que recibe el mensaje del error y un titulo opcional para mostrarlo en la alerta.</param>
    // <param name="_displayInConsole" type="Boolean">Indicador que define si el error se presenta en consola o como alerta.</param>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.SaeExcepcion = function SaeExcepcionOfSAE(_error, _displayInConsole) {
        try {
            Master.HideLoading();
            _displayInConsole = (_displayInConsole === true) ? true : false;
            if (_displayInConsole) {
                console.log(_error.message + " <br> Tipo: " + _error.name + ". <br> Function: " + _error.function + ". <br> Clase: " + _error.class.name + "]");
            } else {
                _this.Alert(_error.message, null, _error.type);
            }
        } catch (ex) {
            throw ex;
        }
    };

    // <summary>Función para mostrar los mensajes de alerta para los errores no controlados (los de tipo Error), por defecto la alerta es tipo "danger".</summary>
    // <param name="_function" type="String">Cadena de texto de texto con el nombre de la método donde se controló el error.</param>
    // <param name="_class" type="String">Cadena de texto de texto con el nombre de la clase donde se controló el error.</param>
    // <param name="_error" type="Object">Objeto que recibe el mensaje del error y un titulo opcional para mostrarlo en la alerta.</param>
    // <param name="_displayInConsole" type="Boolean">Indicador que define si el error se presenta en consola o como alerta.</param>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.Exception = function ExceptionOfSAE(_function, _class, _error, _displayInConsole) {
        try {
            var msjError = "Ha ocurrido un error no esperado en el Aplicativo desde el método: <i>" + _function + "</i>. <br> <strong>Error:</strong> <i>" + _error.message + "</i>. <br> <strong>Tipo:</strong> <i>" + _error.name + "</i>. <br> <strong>Clase:</strong> <i>" + _class.name + "</i>";
            _displayInConsole = (_displayInConsole === true) ? true : false;
            if (_displayInConsole) {
                console.log("!Error no esperado!: " + msjError);
            } else {
                _this.Alert(msjError, "!Error no esperado!", _this.danger);
            }
        } catch (ex) {
            console.log("Ha ocurrido un error no esperado en el Aplicativo desde el método: " + _this.Exception.name + ". <br> <strong>Error:</strong> <i>" + ex.message + "</i>. <br> <strong>Tipo:</strong> <i>" + ex.name + "</i>. <br> <strong>Clase:</strong> <i>" + _context.name + ".");
        }
    };

    // <summary>Función Crear un control de Kendo.</summary>
    // <param name="_control" type="Object">Objeto con todas las propiedades para construir el control incluyendo el elemento sobre el cual contruirá.</param>
    // <return type="Object">Data completa sobre el control.</return>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.CreateControlKendo = function CreateControlKendoUI(_control) {
        try {
            if (typeof _control.element === "object" && $.isEmptyObject(_control.element) && _control[0] === undefined) {
                throw new SaeExcepcion(_context, "CreateControlKendo", "No es posible llevar a cabo la construcción del control, ya que el control recibido no es válido.", _this.danger, true);
            } else if (!_this.ValidationText("vacio", _control.type)) {
                throw new SaeExcepcion(_context, "CreateControlKendo", "No es posible llevar a cabo la construcción del control, ya que no fue posible identificar el <strong>tipo de control</strong> deseado.", _this.danger, true);
            } else if ($.isEmptyObject(_control.attributes) || !$.isPlainObject(_control.attributes) || Object.keys(_control.attributes).length === 0) {
                throw new SaeExcepcion(_context, "CreateControlKendo", "No es posible llevar a cabo la construcción del control ya que no se recibieron las respectivas propiedades para crearlo.", _this.danger, true);
            } else {


                switch (_control.type.toLowerCase()) {
                    case "dropdownlist":
                        return _control.element.kendoDropDownList(_control.attributes).data(_control.kendoType); //break;
                    case "grid":
                        return _control.element.kendoGrid(_control.attributes).data(_control.kendoType); //break;
                    case "datepicker":
                        return _control.element.kendoDatePicker(_control.attributes).data(_control.kendoType); //break;
                    case "numerictextbox":
                        return _control.element.kendoNumericTextBox(_control.attributes).data(_control.kendoType); //break;
                    default:
                        throw new SaeExcepcion(_context, "CreateControlKendo", "No se encontro el tipo de control solicitado: <strong>" + _control.type + "</strong>.", _this.danger, true);
                }
            }
        } catch (ex) {
            throw ex;
        }
    };

    // <summary>Función para crear una notificación de tipo alerta flotante.</summary>
    // <param name="_error" type="Object">Objeto que recibe el error.</param>
    // <param name="_context" type="Object">Información de la clase donde se produce el error.</param>
    // <param name="_function" type="String">Nombre de la método donde se produce el error.</param>
    // <remarks>Diego Tique 2017-10-12 </remarks>
    _this.FailedMethod = function FailedMethod(_error, _context, _function) {
        try {
            throw new SaeExcepcion(_context, _function, _error, _this.danger, false);
        } catch (ex) {
            if (ex instanceof SaeExcepcion) {
                _this.SaeExcepcion(ex, false);
            } else if (ex instanceof Error) {
                _this.Exception(_this.Constructor.name, _context, ex, true);
            }
        }
    };

    _this.CreateElement = function CreateElement(_elementType, _attribute) {
        try {
            if (!_this.ValidationText("vacio", _elementType)) {
                throw new SaeExcepcion(_context, "CreateElement", "No es posible crear el elemento ya que se requiere el identificador del tipo de elemento.", _this.danger, true);
            } else if ($.isEmptyObject(_attribute) && _attribute.length <= 0) {
                throw new SaeExcepcion(_context, "CreateElement", "No es posible crear el elemento ya que se requiere los atributos o propiedades.", _this.danger, true);
            } else {
                element = document.createElement(_elementType);
                $.each(_attribute, function (index, attr) {
                    element.setAttribute(attr.name, attr.value);
                });
                return element;
            }
        } catch (ex) {
            throw ex;
        }
    };

    _this.SetDataSourceGrid = function SetDataSourceGrid(_collection, _grid) {
        try {
            var dataSource = new kendo.data.DataSource({
                data: _collection,
                pageSize: 10
            });
            dataSource.read();
            _grid.setDataSource(dataSource);
            _grid.dataSource.read();
            _grid.refresh();
            return _grid;
        } catch (ex) {
            throw ex;
        }
    };

    _this.SetDataSourceSelect = function SetDataSourceSelect(_collection, _select) {
        try {
            var datasource = new kendo.data.DataSource({ data: _collection });
            datasource.read();
            _select.setDataSource(datasource);
            _select.refresh();
            _select.enable(false);
            _select.select(0);
            return _select;
        } catch (ex) {
            throw ex;
        }
    };

    _this.GetEventsByIdControl = function GetEventsByControl(_idControl) {
        try {
            return $._data($get(_idControl), "events");
        } catch (ex) {
            throw ex;
        }
    };

    _this.GetValueFormatCurrency = function GetValueFormatCurrency(_value) {
        try {
            return Number(_value.replace(/[^0-9\.]+/g, ""));
        } catch (ex) {
            throw ex;
        }
    };

    // Procesa una respuesta de un llamado a PageMethods, ejecutando su función de éxito si todo sale bien.
    _this.PageMethodResponse = function PageMethodResponse(res, success, className, functionName) {
        try {
            if (res && $.isPlainObject(res) && Object.keys(res).length > 0) {
                if (res.Respuesta === null && res.Excepcion !== null && res.Excepcion.Tipo !== null) {
                    throw new SaeExcepcion(className, functionName, "<strong>" + res.Excepcion.Tipo + "</strong>" + res.Excepcion.Mensaje, Master.info, true);
                }
                else if (res.Respuesta === null && res.Excepcion !== null) {
                    throw new SaeExcepcion(className, functionName, res.Excepcion.Mensaje, Master.info, true);
                }
                else if (res.Respuesta === null && res.Estado === false) {
                    throw new SaeExcepcion(className, functionName, "<strong>Error en respuesta.</strong>", Master.info, true);
                }
                else if (res.Estado === true) {
                    // Si hay función de respuesta exitosa, ejecutarla
                    if (success !== null) {
                        success(res);
                    }

                    // Si hay alerta, mostrarla
                    if (res.Excepcion !== null) {
                        throw new SaeExcepcion(className, functionName, res.Excepcion.Mensaje, Master.info, true);
                    }
                }
                else if (res.Respuesta === "NoSession" && res.Estado === false) {
                    _this.NoSessionTrue("ok", "info");
                }
                else {
                    throw new SaeExcepcion(className, functionName, "Error en lectura de respuesta.", Master.info, true);
                }
            } else {
                throw new SaeExcepcion(className, functionName, "Error en validación de respuesta.", Master.info, true);
            }
        } catch (ex) {
            _this.DialogLoading.hide();
            if (ex instanceof SaeExcepcion) {
                _this.SaeExcepcion(ex, false);
            } else if (ex instanceof Error) {
                _this.Exception(functionName, className, ex, false);
            }
        }
    }

    // Muestra indicador de carga
    _this.ShowLoading = function () {
        //$('#loader').modal('show');
        $('#loader').css({ "display": "block" });
        $('#blockPanel').css({ "display": "block" });
       
    };

    // Oculta indicador de carga
    _this.HideLoading = function () {
        //$('#loader').modal('hide');
        $('#loader').css({ "display": "none" });
        $('#blockPanel').css({ "display": "none" });
    };

    // Elimina controles a los que el usuario no tiene permiso por demanda
    _this.OcultarControlesForma = function () {
        debugger;
        var resform = $('#hdnFormControlesOcultos').val();  
        controlesOcultos = JSON.parse(resform);
        controlesOcultos.forEach(function (valor, index) {
            if (valor.AccionSelector.indexOf('.') === 0 || valor.AccionSelector.indexOf('#') === 0) {
                // Es una clase o id
                $(valor.AccionSelector).remove();
            }
            else {
                // No es una clase
                $("[" + valor.AccionSelector + "]").remove();
            }
        });
    };

    _this.DialogLoading = (function ($) {
        try {
            return {
                show: function () {
                    $("#DialogLoading").modal();
                },
                hide: function () {
                    $("#DialogLoading").modal('hide');
                }
            };
        } catch (ex) {
            throw ex;
        }
    })(jQuery);

    _this.DialogLoading2 = (function ($) {
        try {
            return {
                show: function (_title, _message) {
                    $('#TextoTitulo').text(_title);
                    $('#TextoMensaje').text(_message);
                    $("#DialogLoading2").modal();
                },
                hide: function () {
                    $("#DialogLoading2").modal('hide');
                }
            };
        } catch (ex) {
            throw ex;
        }
    })(jQuery);
};

// <summary>Función que se creará como tipo de error para manejar las excepciones controladas.</summary>
// <param name="_class" type="String">Cadena de texto con el nombre de la clase donde se controló el error.</param>
// <param name="_function" type="String">Cadena de texto de texto con el nombre de la método donde se controló el error.</param>
// <param name="_message" type="String">Cadena de texto con el mensaje del error.</param>
// <param name="_type" type="Object">Objeto con los datos del tipo de error</param>
// <param name="_isControlled" type="Boolean">Indicador que se usa para definir si el error es controlado, por defecto es false.</param>
// <remarks>Diego Tique 2017-10-12 </remarks>
function SaeExcepcion(_class, _function, _message, _type, _isControlled) {
    this.name = "SaeExcepcion";
    this.message = _message || "";
    this.application = Master.Application || null;
    this.class = _class || "";
    this.function = _function || "";
    this.type = _type || null;
    this.isControlled = _isControlled || false;
}
SaeExcepcion.prototype = new Error;

// Objetos con las propiedades de los tipos de propiedades que se agregan a la clase Utilities para su control general.
Utilities.prototype = {
    warning: { icon: "glyphicon glyphicon-warning-sign", type: "warning" },
    danger: { icon: "glyphicon glyphicon-exclamation-sign", type: "danger" },
    success: { icon: "glyphicon glyphicon-thumbs-up", type: "success" },
    info: { icon: "glyphicon glyphicon-info-sign", type: "info" },
    control: {
        dropdownlist: {
            type: "dropdownlist",
            kendoType: "kendoDropDownList",
            element: null,
            attributes: {
                dataTextField: null,
                dataValueField: null,
                dataSource: [],
                suggest: false,
                enabled: false,
                change: null
            }
        },
        datepicker: {
            type: "datepicker",
            kendoType: "kendoDatePicker",
            element: null,
            attributes: {
                culture: "es-CO",
                format: "dd/MM/yyyy"
            }
        },
        grid: {
            type: "grid",
            kendoType: "kendoGrid",
            element: null,
            attributes: {
                change: null,
                scrollable: true,
                groupable: true,
                selectable: "row",
                filterable: false,
                sortable: true,
                dataSource: {
                    data: null,
                    pageSize: 10
                },
                pageable: {
                    refresh: false,
                    pageSizes: false,
                    buttonCount: 10
                },
                columns: []
            }
        },
        numerictextbox: {
            type: "numerictextbox",
            kendoType: "kendoNumericTextBox",
            element: null,
            attributes: {
                format: "c"
            }
        }
    }
};

// Se instancia la clase Utilities.
var Master = new Utilities();

// Interceptar todas las respuestas a peticiones. Ver https://stackoverflow.com/q/25335648/1863970.
//(function (open) {
//    XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
//        this.addEventListener("readystatechange", function () {
//            // Verificar si viene encabezado que indica que la sesión está inactiva
//            if (this.getResponseHeader("NOAUTH") === "1") {
//                // Recargar sitio: intentar mostrar un popup con el login que se cierre para que el usuario pueda ingresar sin perder su trabajo
//                var strWindowFeatures = 'resizable=no,width=800,height=620,left=0,top=0';
//                var urlBase = $('.hdn-url-base').val();
//                var ventanaCreada = window.open(urlBase + 'Login.aspx?c=1', 'Login - Reconexión', strWindowFeatures);
//                // Dar unos segundos a usuario para habilitar popups
//                setTimeout(function () {
//                    if (!ventanaCreada) {
//                        // No hay popups habilitados, recargar página actual
//                        window.location.reload();
//                    }    
//                }, 10000);
//            }
//        }, false);

//        open.call(this, method, url, async, user, pass);
//    };
//})(XMLHttpRequest.prototype.open);

Master.AddPageLoaded(function () {
    function CenterModalLoaging() {
        $(this).css('display', 'block');
        var $dialog = $(this).find(".modal-dialog-load");
        var offset = ($(window).height() - $dialog.height()) / 2;
        $dialog.css("margin-top", offset);
    }

    $('.modal-loading').on('show.bs.modal', CenterModalLoaging);
    $(window).on("resize", function () {
        $('.modal-loading:visible').each(CenterModalLoaging);
    });
});

Master.AddPageLoaded(
    function () {
        function toggleAccordion(e) {
            $(e.target)
                .prev('.panel-heading')
                .find("i.indicator")
                .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
        }
        $('#accordion').on('hidden.bs.collapse', toggleAccordion);
        $('#accordion').on('shown.bs.collapse', toggleAccordion);
    }
);

Master.AddPageLoaded(
    function () {
        $("input[class*='money']").blur(function () {
            $(this).formatCurrency({ colorize: false, negativeFormat: '-%s%n', roundToDecimalPlace: 2 });
        })
            .keyup(function (e) {
                e = window.event || e;
                var keyUnicode = e.charCode || e.keyCode;
                if (e !== undefined) {
                    switch (keyUnicode) {
                        case 16: break;
                        case 17: break;
                        case 18: break;
                        case 27: return this.value = ''; //break;
                        case 35: break;
                        case 36: break;
                        case 37: break;
                        case 38: break;
                        case 39: break;
                        case 40: break;
                        case 78: break;
                        case 110: break;
                        case 190: break;
                        default: $(this).formatCurrency({ colorize: false, negativeFormat: '-%s%n', roundToDecimalPlace: -1, eventOnDecimalsEntered: true });
                    }
                }
            });
    }
);


Master.AddPageLoaded(
    function () {
        var userAgent = navigator.userAgent;
    });


//Validaciones generales Matrix  15. FUNCION QUE DESABILITA EL BOTON BACK DEL NAVEGADOR
//Se comentarea 28-11-2016 Luis Tejedor, para realizar pruebas de envio de parametros encriptados por URL
function nobackbutton() {
    window.location.hash = "no-back-button";
    window.location.hash = "Again-No-back-button"; //chrome
    window.onhashchange = function () { window.location.hash = "no-back-button"; };
};

Master.AddPageLoaded(
    function () {
        $('[data-toggle="tooltip"]').tooltip();
    }
);

//Deshabilita click contrario del Mouse
$(document).bind("contextmenu", function (e) {
    return false;
});

// Eliminar controles a los que no tiene permiso este usuario
//Master.AddPageLoaded(
    
//);

$(document).ready(function () {
    CheckToKeepSessionAlive();
    habilitarModalesMultiples();

    destruirControlesOcultos();
});

// Eliminar controles a los que no tiene permiso este usuario
function destruirControlesOcultos() {
    var res = $('.hdn-controles-ocultos').val();
    if (!res) {
        return false;
    }
    var controlesOcultos = JSON.parse(res);
    controlesOcultos.forEach(function (valor, index) {
        if (valor.AccionSelector.indexOf('.') === 0 || valor.AccionSelector.indexOf('#') === 0) {
            // Es una clase o id
            $(valor.AccionSelector).remove();
        }
        else {
            // No es una clase
            $("[" + valor.AccionSelector + "]").remove();
        }
    });

    var resform = $('#hdnFormControlesOcultos').val();
    controlesOcultos = JSON.parse(resform);
    controlesOcultos.forEach(function (valor, index) {
        if (valor.AccionSelector.indexOf('.') === 0 || valor.AccionSelector.indexOf('#') === 0) {
            // Es una clase o id
            $(valor.AccionSelector).remove();
        }
        else {
            // No es una clase
            $("[" + valor.AccionSelector + "]").remove();
        }
    });
}

function CheckToKeepSessionAlive() {

    setTimeout(function () { KeepSessionAlive(); }, 180000);
    //setTimeout(KeepSessionAlive(), 300000);
}

function KeepSessionAlive() {

    var urlRelativa = "/Matrix/Default.aspx/KeepAlive";

    if (window.location.href.indexOf("localhost") > -1) {
        urlRelativa = "/Default.aspx/KeepAlive";
    }

    $.ajax({
        type: "POST",
        url: urlRelativa,
        data: "{'i':'1'}",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (message) {
         //   alert(message);//will alert 'true'
            //DO what you want to do on client side
        },
        error: function (message) {
           // alert(message);//will alert 'false'
            //DO what you want to do on client side
        }
    });

  
    CheckToKeepSessionAlive();
}

function habilitarModalesMultiples() {
    // Hack to enable multiple modals by making sure the .modal-open class
    // is set to the <body> when there is at least one modal open left
    $('body').on('hidden.bs.modal', function () {
        if ($('.modal.in').length > 0) {
            $('body').addClass('modal-open');
        }
    });
}

function response_keep_alive(res) {


}

//123 es el keyCode F12 que impide que se abra la pantalla Inspección del elemento en el navegador. En KeyDown devuelve falso que no abre la pantalla Inspeccionar elemento.
//$(document).keydown(function (event) {
//    if (event.keyCode == 123) {
//        return false;
//    }
//    else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
//        return false;  //Prevent from Ctrl + Shift + i
//    }
//});