$(function () {
    $.isNullOrEmpty = function (args) { return (args == undefined || args == null || args == "" || /^\s+$/.test(args)) ? true : false; };
    $.isText = function (args) { return (!$.isNullOrEmpty(args) && /^[ A-ZÑa-zñáéíóúÁÉÍÓÚ]*$/.test(args)) ? true : false; };
    $.isAlphanumeric = function (args) { return (!$.isNullOrEmpty(args) && /^[ 0-9A-ZÑa-zñáéíóúÁÉÍÓÚ]*$/.test(args)) ? true : false; };
    $.isEmail = function (args) { return (!$.isNullOrEmpty(args) && /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(args)) ? true : false; };
    $.isCompanyName = function (args) { return (!$.isNullOrEmpty(args) && /^[ A-ZÑa-zñáéíóúÁÉÍÓÚ,.-]*$/.test(args)) ? true : false; };
    $.isAddress = function (args) { return (!$.isNullOrEmpty(args) && /^[ 0-9A-ZÑa-zñáéíóúÁÉÍÓÚ#_:,.-]*$/.test(args)) ? true : false; };
    $.fn.onEnter = function (func) {
        if ($.isFunction(func)) {
            this.bind('keypress', function (e) {
                if (e.keyCode == 13) func.apply(this, [e]);
            });
            return this;
        } else {
            this.unbind();
            return false;
        }
    };
    String.prototype.toCapitalize = function (all) {
        /// <param name="all" type="Boolean">Indica si aplica a todas las palabras o solo para la primera de la cadena.</param>
        var str = this.trim();
        if (all) {
            return str.split(' ').map(function (e) { return e.toCapitalize(); }).join(' ');
        } else {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
    String.prototype.getLongDateString = function () {
        /// <summary>Convierte la fecha en formato long a date.</summary>
        var s = this;
        var t = +s.substring(0, s.length - 4);
        var e = Date.UTC(1601, 0, 1);
        var dt = new Date(e + t);
        return dt;
    }
    String.format = function () {
        var s = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, arguments[i + 1]);
        }
        return s;
    }
    Array.prototype.clone = function () {
        /// <summary>Crea un clón (copia) del objeto.</summary>
        if ($.isPlainObject(this)) {
            return jQuery.extend(true, {}, this);
        } else if ($.isArray(this)) {
            return this.slice();
        } else {
            return null
        }
    };
});
//#region Recursos
// Objetos con las propiedades de los tipos de propiedades que se agregan a la clase Utilities para su control general.
Object.Resources = {
    warning: { icon: "glyphicon glyphicon-warning-sign", type: "warning" },
    danger: { icon: "glyphicon glyphicon-exclamation-sign", type: "danger" },
    success: { icon: "glyphicon glyphicon-thumbs-up", type: "success" },
    info: { icon: "glyphicon glyphicon-info-sign", type: "info" },
    question: { icon: "glyphicon glyphicon-question-sign", type: "question" },
    iconDocument: {
        pdf: "fa fa-file-pdf-o",
        doc: "fa fa-file-word-o",
        ppt: "fa fa-file-powerpoint-o",
        xsl: "fa fa-file-excel-o",
        text: "fa fa-file-text-o",
        img: "fa fa-file-image-o",
        zip: "fa fa-file-archive-o",
        file: "fa fa-file-o",
        audio: "fa fa-file-audio-o",
        video: "fa fa-file-video-o",
        code: "fa fa-file-code-o"
    },
    MessageBoxButton: {
        None: "none",
        Ok: "ok",
        OkCancel: "okcancel",
        YesNo: "yesno",
        SaveCancel: "savecancel",
        ContinueCancel: "continuecancel"
    },
    MessageBoxType: {
        None: "none",
        Load: "load",
        Warning: "warning",
        Information: "info",
        Error: "danger",
        Success: "success",
        Question: "question",
        HtmlGeneric: "html",
        Generic: "generic",
    },
    Control: {
        Dropdownlist: function () {
            this.type = "dropdownlist",
            this.kendoType = "kendoDropDownList",
            this.element = null,
            this.attributes = {
                dataTextField: null,
                dataValueField: null,
                dataSource: [],
                suggest: false,
                enabled: false,
                change: null,
            }
        },
        MoneyTextBox: function () {
            this.type = "moneytextbox",
            this.kendoType = "kendoNumericTextBox",
            this.element = null,
            this.attributes = {
                format: "c",
                spinners: true,
                step: 0.01,
                decimals: 2,
                value: "",
                min: 0,
                max: 999999999999.99,
                placeholder: null,
                maxlength: null,
            }
        },
        NumericTextBox: function () {
            this.type = "numerictextbox",
            this.kendoType = "kendoNumericTextBox",
            this.element = null,
            this.attributes = {
                spinners: false,
                step: 1,
                format: "0",
                decimals: 0,
                value: "",
                min: 0,
                placeholder: null,
                maxlength: null
            }
        },
        DatePicker: function () {
            this.type = "datepicker",
            this.kendoType = "kendoDatePicker",
            this.element = null,
            this.attributes = {
                culture: "es-CO",
                format: "dd/MM/yyyy",
                value: "",
                placeholder: null,
                min: new Date(1900, 0, 1),
                max: new Date(),
            }
        },
        Grid: function () {
            this.type = "grid",
            this.kendoType = "kendoGrid",
            this.element = null,
            this.attributes = {
                change: null,
                sortable: true,
                scrollable: true,
                groupable: true,
                selectable: "row",
                filterable: false,
                reorderable: true,
                resizable: true,
                dataSource: {
                    data: null,
                    pageSize: 10,
                },
                pageable: {
                    refresh: false,
                    pageSizes: true,
                    buttonCount: 10
                },
                columns: [],
            }
        },
        Window: function () {
            this.type = "window",
            this.kendoType = "kendoWindow",
            this.element = null,
            this.attributes = {
                title: "",
                modal: true,
                visible: false,
                resizable: false,
                minWidth: 320,
                maxWidth: 1100,
                minHeight: 100,
                pinned: true,
                scrollable: false,
                animation: {
                    open: false,
                    close: false
                },
                close: null,
                actions: {}
            }
        },
    },
    UI: {
        Popover: function () {
            this.type = "popover",
            this.element = null,
            this.attributes = {
                trigger: "hover",
                placement: "top",
                title: 'Titulo',
                content: "Contenido",
                html: true,
                container: "body",
            }
        },
        Panel: function () {
            this.type = "panel",
            this.attributes = {
                id: null,
                title: false,
                content: "Contenido",
                footer: false,
                tools: {
                    collapse: false,
                    close: {
                        visible: false,
                        event: null
                    }
                },
                width: null,
                animation: "fadeInRight"
            }
        },
    },
    ShowBy: {
        None: 0,
        Console: 1,
        Alert: 2,
        MessageBox: 3
    },
    size: { xsmall: "xs", small: "sm", medium: "md", large: "lg" },
};
//#endregion

var Utilities2 = (function () {

    var _context = { name: "Utilities2", description: "Controlador para los métodos Utilitarios del Aplicativo." };
    var _application = { name: "Matrix", description: "Sociedad de Activos Especiales S.A.S." };
    var _resources = Object.Resources;

    var _notification = {
        
        Alert: function (_message, _title, _type) {
            /// <summary>Función para crear una notificación de tipo alerta flotante.</summary>
            /// <param name="_message" type="String">Mensaje para la alerta.</param>
            /// <param name="_title" type="String" optional="true">Texto que representa un titulo que acompaña al mensaje de la alerta.</param>
            /// <param name="_type" type="Object">Objeto que debe incluir el icono y el tipo de alerta que se desea mostrar.</param>
            _nameFn = "Notification.Alert";
            try {
                if (!$.isNullOrEmpty(_message)) {
                    if ($.isPlainObject(_type) && _type.hasOwnProperty("icon") && _type.hasOwnProperty("type")) {
                        _title = (!$.isNullOrEmpty(_title)) ? "<strong>" + _title + "</strong> " : null;
                        $.notifyClose();
                        $.notify({ icon: _type.icon, title: _title, message: _message }, {
                            element: 'body', position: null, type: _type.type, allow_dismiss: true, newest_on_top: true,
                            placement: { from: "top", align: "right" },
                            offset: 10, spacing: 10, z_index: 9000, delay: 5000, timer: 1000,
                            mouse_over: 'pause',
                            template: '<div data-notify="container" class="col-xs-11 col-md-5 alert alert-{0}" role="alert"><button type="button" class="close" aria-hidden="true" data-notify="dismiss"><i class="fa fa-times-circle"></i></button><span data-notify="icon"></span> <span data-notify="title">{1}</span><span data-notify="message">{2}</span><a data-notify="dismiss" data-notify="url"></a></div>'
                        });
                    } else {
                        throw new SaeExcepcion(_context, _nameFn, "Para visualizar la alerta deseada, se requiere el tipo un tipo de alerta que la identifique.", _resources.warning, true);
                    }
                } else {
                    throw new SaeExcepcion(_context, _nameFn, "El mensaje para la alerta que no debe ser vacio.", _resources.warning, true);
                }
            } catch (ex) {
                throw ex;
            }
        },
        MessageBox: {
            Show: function (_message, _title, _buttons, _type, _onSuccess, _onCancel, _imageUrl) {
                /// <summary>Función que muestra un mensaje a modo de notificación.</summary>
                /// <param name="_message" type="String">Texto que representa la información que se desea mostrar en el mensaje.</param>
                /// <param name="_title" type="String">Texto que representa un titulo que acompaña al mensaje..</param>
                /// <param name="_buttons" type="Resources.MessageBoxButton">Objeto que representa el tipo de botón que se incluirá en el mensaje.</param>
                /// <param name="_type" type="Resources.MessageBoxType">Objeto que representa el tipo de mensaje que se desea desplegar.</param>
                /// <param name="_onSuccess" type="Function" Optional="true">Función a ejecutar en caso de recibir una respuesta de a tipo 'Aceptar'.</param>
                /// <param name="_onCancel" type="Function" Optional="true">Función a ejecutar en caso de recibir una respuesta de a tipo 'Cancelar'.</param>
                /// <param name="_imageUrl" type="String" Optional="true">Ruta de la imagen para el mensaje en caso de elegir como tipo: Resources.MessageBoxButton.Generic</param>
                try {
                    _message = _message || "Información del Aplicativo.";
                    _title = _title || "Matrix";
                    var configuration = {
                        title: _title,
                        text: _message,
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Cancelar",
                        allowEscapeKey: true,
                        allowOutsideClick: true,
                        animation: null,
                        html: true
                    };
                    switch (_type) {
                        case "load":
                            configuration.type = null;
                            configuration.allowEscapeKey = false;
                            configuration.allowOutsideClick = false;
                            break;
                        case "warning":
                            configuration.type = _type;
                            break;
                        case "info":
                            configuration.type = _type;
                            break;
                        case "danger":
                            configuration.type = "error";
                            break;
                        case "success":
                            configuration.type = _type;
                            break;
                        case "question":
                            configuration.type = _type;
                            break;
                        case "html":
                            configuration.type = null;
                            break;
                        case "generic":
                            if (!$.isNullOrEmpty(_imageUrl)) {
                                configuration.imageUrl = _imageUrl;
                            } else {
                                configuration.type = null;
                            }
                            break;
                        default:
                            configuration.type = null,
                            configuration.timer = 5000;
                            break;
                    };
                    switch (_buttons) {
                        case "ok":
                            configuration.showConfirmButton = true;
                            configuration.showCancelButton = false;
                            if ($.isFunction(_onSuccess)) {
                                configuration.allowEscapeKey = false;
                                configuration.allowOutsideClick = false;
                                configuration.closeOnConfirm = false;
                            } else {
                                configuration.allowEscapeKey = true;
                                configuration.allowOutsideClick = true
                                configuration.closeOnConfirm = true;
                            }
                            break;
                        case "okcancel":
                            configuration.showConfirmButton = true;
                            configuration.showCancelButton = true;
                            configuration.allowEscapeKey = false;
                            configuration.allowOutsideClick = false;
                            configuration.closeOnConfirm = ($.isFunction(_onSuccess)) ? false : true;
                            configuration.closeOnCancel = ($.isFunction(_onCancel)) ? false : true;
                            break;
                        case "yesno":
                            configuration.showConfirmButton = true;
                            configuration.showCancelButton = true;
                            configuration.confirmButtonText = "Si";
                            configuration.cancelButtonText = "No";
                            configuration.allowEscapeKey = false;
                            configuration.allowOutsideClick = false;
                            configuration.closeOnConfirm = ($.isFunction(_onSuccess)) ? false : true;
                            configuration.closeOnCancel = ($.isFunction(_onCancel)) ? false : true;
                            break;
                        case "savecancel":
                            configuration.showConfirmButton = true;
                            configuration.showCancelButton = true;
                            configuration.confirmButtonText = "Guardar";
                            configuration.allowEscapeKey = false;
                            configuration.allowOutsideClick = false;
                            configuration.closeOnConfirm = ($.isFunction(_onSuccess)) ? false : true;
                            configuration.closeOnCancel = ($.isFunction(_onCancel)) ? false : true;
                            break;
                        case "continuecancel":
                            configuration.showConfirmButton = true;
                            configuration.showCancelButton = true;
                            configuration.confirmButtonText = "Continuar";
                            configuration.allowEscapeKey = false;
                            configuration.allowOutsideClick = false;
                            configuration.closeOnConfirm = ($.isFunction(_onSuccess)) ? false : true;
                            configuration.closeOnCancel = ($.isFunction(_onCancel)) ? false : true;
                            break;
                        default:
                            configuration.showConfirmButton = false;
                            configuration.showCancelButton = false;
                            break;
                    };
                    window.onkeydown = null;
                    window.onfocus = null;
                    switch (_buttons) {
                        case "ok":
                            swal(configuration, function (args) {
                                if (args) {
                                    if ($.isFunction(_onSuccess)) {
                                        _onSuccess();
                                    }
                                } else {
                                    if ($.isFunction(_onCancel)) {
                                        _onCancel();
                                    }
                                }
                            });
                            break;
                        case "okcancel":
                            swal(configuration, function (args) {
                                if (args) {
                                    if ($.isFunction(_onSuccess)) {
                                        _onSuccess();
                                    }
                                } else {
                                    if ($.isFunction(_onCancel)) {
                                        _onCancel();
                                    }
                                }
                            });
                            break;
                        case "yesno":
                            swal(configuration, function (args) {
                                if (args) {
                                    if ($.isFunction(_onSuccess)) {
                                        _onSuccess();
                                    }
                                } else {
                                    if ($.isFunction(_onCancel)) {
                                        _onCancel();
                                    }
                                }
                            });
                            break;
                        case "savecancel":
                            swal(configuration, function (args) {
                                if (args) {
                                    if ($.isFunction(_onSuccess)) {
                                        _onSuccess();
                                    }
                                } else {
                                    if ($.isFunction(_onCancel)) {
                                        _onCancel();
                                    }
                                }
                            });
                            break;
                        case "continuecancel":
                            swal(configuration, function (args) {
                                if (args) {
                                    if ($.isFunction(_onSuccess)) {
                                        _onSuccess();
                                    }
                                } else {
                                    if ($.isFunction(_onCancel)) {
                                        _onCancel();
                                    }
                                }
                            });
                            break;
                        default:
                            swal(configuration);
                            break;
                    };
                } catch (ex) {
                    throw ex;
                }
            },
            Close: function () {
                /// <summary>Función que cierra el mensaje a modo de notificación.</summary>
                try {
                    swal.close();
                } catch (ex) {
                    throw ex;
                }
            }
        },
        Modal: function (_message, _title, _size, _scroll, _heightbody) {
            /// <summary>Función para crear una notificación de tipo modal.</summary>
            /// <param name="_message" type="String">Mensaje para la notificación.</param>
            /// <param name="_title" type="String" optional="true">Texto que representa un titulo que acompaña al mensaje de la notificación.</param>
            /// <param name="_size" type="Resources.size" optional="true">Tipo de tamaño para la notificación. Por defecto es "small".</param>
            /// <param name="_scroll" type="Boolean" optional="true">Valor que indica que el contendio de la ventana modal tendrá scroll. Si es null o false, el cuerpo del contenido no tendra scroll.</param>
            /// <param name="_heightbody" type="Integer" optional="true">Valor que define el tamaño del contenedor del cuerpo de la ventana modal.</param>
            _nameFn = "Notification.Modal";
            try {
                if (!$.isNullOrEmpty(_message)) {
                    _size = ($.isNullOrEmpty(_size)) ? _resources.size.medium : _size;
                    _title = ($.isNullOrEmpty(_title)) ? "Cobra" : _title;
                    var $modal = _createElement("div", [{ name: "class", value: "modal inmodal fade" }, { name: "id", value: Date.now() }, { name: "role", value: "dialog" }, { name: "aria-hidden", value: true }, { name: "tabindex", value: -1 }]);
                    var $dialog = _createElement("div", [{ name: "class", value: "modal-dialog modal-" + _size }]);
                    var $content = _createElement("div", [{ name: "class", value: "modal-content animated flipInX" }]);
                    var $header = null; var $tittle = null;
                    $header = _createElement("div", [{ name: "class", value: "modal-header" }]);
                    var $close = _createElement("button", [{ name: "type", value: "button" }, { name: "class", value: "close" }, { name: "id", value: "btnClose" }, { name: "data-dismiss", value: "modal" }, { name: "data-notify", value: "dismiss" }]); $close.innerHTML = "<i class='fa fa-times-circle'></i>";
                    $header.appendChild($close);
                    $tittle = _createElement("h4", [{ name: "class", value: "modal-title" }]); $tittle.innerHTML = _title;
                    $header.appendChild($tittle);
                    $content.appendChild($header);
                    var $body = _createElement("div", [{ name: "class", value: "modal-body" }]);

                    var $scroll = null;
                    if (!$.isNullOrEmpty(_scroll) && _scroll === true) {
                        _heightbody = (!$.isNullOrEmpty(_heightbody) && $.isNumeric(_heightbody) && _heightbody > 0) ? _heightbody : 600;
                        $scroll = _createElement("div", [{ name: "id", value: "scroll_content_" + $modal.id }]);
                        $scroll.innerHTML = _message;
                        $body.appendChild($scroll);
                    } else if (!$.isNullOrEmpty(_heightbody) && $.isNumeric(_heightbody) && _heightbody > 0) {
                        $body.innerHTML = _message;
                        $($body).attr("style", String.format("height:{0}px", _heightbody));
                    } else {
                        $body.innerHTML = _message;
                    }

                    var $footer = _createElement("div", [{ name: "class", value: "modal-footer" }]);
                    var $button = _createElement("button", [{ name: "type", value: "button" }, { name: "class", value: "btn btn-primary" }, { name: "id", value: "btnCerrar" }, { name: "data-dismiss", value: "modal" }]); $button.appendChild(document.createTextNode("Cerrar"));
                    $footer.appendChild($button);
                    $content.appendChild($body);
                    $content.appendChild($footer);
                    $dialog.appendChild($content)
                    $modal.appendChild($dialog)
                    document.body.appendChild($modal);
                    function Destroy(e) {
                        var nodoModal = this;
                        var interval = setInterval(
                        function () {
                            if (nodoModal && document.getElementById(nodoModal.id).attributes["aria-hidden"].value == "true") {
                                document.body.removeChild(document.getElementById(nodoModal.id));
                                clearInterval(interval);
                            }
                        }, 200);
                        return true;
                    }
                    $($modal).on('hide.bs.modal', Destroy);
                    $($modal).on('show.bs.modal', _centerModal);


                    if (!$.isNullOrEmpty(_scroll) && _scroll === true && !$.isEmptyObject($scroll)) {
                        $($scroll).slimScroll({
                            height: String.format("{0}px", _heightbody)
                        });
                    }


                    $($modal).modal();
                } else {
                    throw new SaeExcepcion(_context, _nameFn, "El mensaje para la notificación que no debe ser vacio.", _resources.warning, true);
                }
            } catch (ex) {
                throw ex;
            }
        },
    };

    var _getParametroURL = function (_param) {
        /// <summary>Función para obtener el parametro que viene incluido en la url.</summary>
        /// <param name="_param" type="String">Identificador del parametro.</param>
        /// <return>Cadena de texto con el valor asignado al parametro en la url</return>
        _nameFn = "GetParametroURL";
        try {
            if (!$.isNullOrEmpty(_param)) {
                return decodeURIComponent((new RegExp('[?|&]' + _param + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
            } else {
                return null;
            }
        } catch (ex) {
            throw ex;
        }
    };

    var _getPathRaiz = function () {
        /// <summary>Función para obtener la raíz del sevidor del sitio.</summary>
        /// <return>Cadena de texto con la raíz del sitio</return>
        try {
            return location.protocol + "//" + [location.host, location.pathname.split("/")[1]].join("/") + "/";
        } catch (ex) {
            throw ex;
        }
    };

    var _addPageLoaded = function (_function) {
        /// <summary>Función para registrar una función o método en el cargue inicial de la página.</summary>
        /// <param name="_function" type="Function">Función a registrar.</param>
        try {
            if (_function instanceof Function) {
                Sys.WebForms.PageRequestManager.getInstance().add_pageLoaded(_function)
            } else {
                console.log("No fue posible registrar la función requerida: " + JSON.stringify(_function));
            }
        } catch (ex) {
            throw ex;
        }
    };

    var _removePageLoaded = function(_function) {
        /// <summary>Función para eliminar una función o método del cargue inicial de la página.</summary>
        /// <param name="_function" type="Function">Función a eliminar.</param>
        try {
            if (_function instanceof Function) {
                Sys.WebForms.PageRequestManager.getInstance().remove_pageLoaded(_function)
            } else {
                console.log("No fue posible remover la función requerida: " + JSON.stringify(_function));
            }
        } catch (ex) {
            throw ex;
        }
    };

    var _addEventListener = function (_control, _event, _function) {
        /// <summary>Función para agregar un evento a un elemento.</summary>
        /// <param name="_control" type="Object">Elemento al cual se le agregará el evento.</param>
        /// <param name="_event" type="String">Nombre del evento.</param>
        /// <param name="_function" type="Function">Función a ejecutar por el evento.</param>
        var _nameFn = "AddEventListener";
        try {
            if (!$.isEmptyObject(_control) && typeof _control === "object") {
                if (!$.isNullOrEmpty(_event)) {
                    _control.bind(_event, _function);
                } else {
                    throw new SaeExcepcion(_context, _nameFn, "No es posible agregar el evento al control deseado, ya que el identificador del evento recibido no es válido.", _resources.warning, true);
                }
            } else {
                throw new SaeExcepcion(_context, _nameFn, "No es posible agregar el evento al control deseado, ya que el control no es válido.", _resources.warning, true);
            }
        } catch (ex) {
            throw ex;
        }
    };

    var _removeEventListener = function (_control, _event) {
        /// <summary>Función para quitar un evento a un elemento.</summary>
        /// <param name="_control" type="Object">Elemento al cual se le quitará el evento.</param>
        /// <param name="_event" type="String">Nombre del evento.</param>
        var _nameFn = "RemoveEventListener";
        try {
            if (!$.isEmptyObject(_control) && typeof _control === "object") {
                if (!$.isNullOrEmpty(_event)) {
                    _control.unbind(_event);
                } else {
                    throw new SaeExcepcion(_context, _nameFn, "No es posible quitar el evento al control deseado, ya que el identificador del evento recibido no es válido.", _resources.warning, true);
                }
            } else {
                throw new SaeExcepcion(_context, _nameFn, "No es posible quitar el evento al control deseado, ya que el control no es válido.", _resources.warning, true);
            }
        }
        catch (ex) {
            throw ex;
        }
    };

    var _handledError = function (_error, _showby) {
        /// <summary>Función para mostrar los mensajes de alerta para los errores controlados y no controlados.</summary>
        /// <param name="_error" type="Object">La instancia del error ya sea de tipo SaeExcepcion o Error.</param>
        /// <param name="_showby" type="Resources.ShowBy" optional="true">Valor que define la modalidad para mostrar la información del error en presentación. Si no se define un tipo, por defectose muestra en consola.</param>
        var _nameFn = "HandledError";
        try {
            var _description = "Ha ocurrido un error inesperado en el Aplicativo";
            if (_error instanceof SaeExcepcion) {
                var defaultError = "Se ha presentado una incosistencia en el Aplicativo. <i><strong>Proceso: </strong> " + _error.function + " | <strong>Inconsistencia: </strong>" + _error.message + " | <strong>Clase:</strong> " + _error.class.name + "</i>. <br /><br />Si este mensaje sigue persistiendo, por favor comuníquese con el administrador.";
                switch (_showby) {
                    case 0: //return
                        return defaultError;
                        break;
                    case 1: //console
                        console.log("Se ha presentado una incosistencia en el Aplicativo. Proceso: " + _error.function + " | Inconsistencia: " + _error.message + " | Clase: " + _error.class.name);
                        break;
                    case 2: //alert
                        _notification.Alert(defaultError.replace(/(<br \/>)/g, ""), null, _error.type);
                        break;
                    case 3: //messagebox
                        _notification.MessageBox.Show(defaultError, "Inconsistencia en el Aplicativo", _resources.MessageBoxButton.Ok, _error.type.type);
                        break;
                    default:
                        console.log("Se ha presentado una incosistencia en el Aplicativo. Proceso: " + _error.function + " | Inconsistencia: " + _error.message + " | Clase: " + _error.class.name);
                        break;
                }
            } else if (_error instanceof Error) {
                var defaultError = "Se ha presentado un error inesperado en el Aplicativo. <i><strong>Error: </strong>" + _error.message + "</i>. <br /><br />Si este mensaje sigue persistiendo, por favor comuníquese con el administrador.";
                switch (_showby) {
                    case 0: //return
                        return defaultError;
                        break;
                    case 1: //console
                        console.log("Se ha presentado un error inesperado en el Aplicativo. Error: " + _error.message);
                        break;
                    case 2: //alert
                        _notification.Alert(defaultError.replace(/(<br \/>)/g, ""), null, _resources.danger);
                        break;
                    case 3: //messagebox
                        _notification.MessageBox.Show(defaultError, "Error en el Aplicativo", _resources.MessageBoxButton.Ok, _resources.MessageBoxType.Error);
                        break;
                    default:
                        console.log("Se ha presentado un error inesperado en el Aplicativo. Error: " + _error.message);
                        break;
                }
            }
        } catch (ex) {
            console.log("Ha ocurrido un error inesperado en el Aplicativo desde el método: " + _nameFn + ". [Error: " + ex.message + ", Clase: " + _context.name + "]");
        }
    };

    var _createControlKendo = function (_control) {
        /// <summary>Función Crear un control de Kendo.</summary>
        /// <param name="_control" type="Object">Objeto con todas las propiedades para construir el control incluyendo el elemento sobre el cual contruirá.</param>
        /// <return type="Object">Data completa sobre el control.</return>
        var _nameFn = "CreateControlKendo";
        try {
            if (typeof _control.element === "object" && $.isEmptyObject(_control.element) && _control[0] === undefined) {
                throw new SaeExcepcion(_context, _nameFn, "No es posible llevar a cabo la construcción del control, ya que el control recibido no es válido.", _resources.danger, true);
            } else if ($.isNullOrEmpty(_control.type)) {
                throw new SaeExcepcion(_context, _nameFn, "No es posible llevar a cabo la construcción del control, ya que no fue posible identificar el <strong>tipo de control</strong> deseado.", _resources.danger, true);
            } else if ($.isEmptyObject(_control.attributes) || !$.isPlainObject(_control.attributes) || Object.keys(_control.attributes).length == 0) {
                throw new SaeExcepcion(_context, _nameFn, "No es posible llevar a cabo la construcción del control ya que no se recibieron las respectivas propiedades para crearlo.", _resources.danger, true);
            } else {
                switch (_control.type.toLowerCase()) {
                    case "dropdownlist":
                        return _control.element.kendoDropDownList(_control.attributes).data(_control.kendoType); break;
                    case "grid":
                        return _control.element.kendoGrid(_control.attributes).data(_control.kendoType); break;
                    case "datepicker":
                        if (!$.isNullOrEmpty(_control.attributes.placeholder)) {
                            _control.element.attr('placeholder', _control.attributes.placeholder);
                        }
                        return _control.element.kendoDatePicker(_control.attributes).data(_control.kendoType); break;
                    case "moneytextbox":
                        _control.element.attr('maxlength', _control.attributes.maxlength);
                        return _control.element.kendoNumericTextBox(_control.attributes).data(_control.kendoType); break;
                    case "numerictextbox":
                        _control.element.attr('maxlength', _control.attributes.maxlength);
                        return _control.element.kendoNumericTextBox(_control.attributes).data(_control.kendoType); break;
                    case "window":
                        return _control.element.kendoWindow(_control.attributes).data(_control.kendoType); break;
                    default:
                        throw new SaeExcepcion(_context, _nameFn, "No se encontró el tipo de control solicitado: <strong>" + _control.type + "</strong>.", _resources.danger, true);
                }
            }
        } catch (ex) {
            throw ex
        }
    };

    var _createUIElement = function (_uiElement) {
        /// <summary>Rutina para crear un elemento de interfaz de usuario html para la aplicación.</summary>
        /// <param name="_uiElement" type="Resources.UI">Objeto con las caracteristicas del elemento de interfaz de usuario para construir.</param>
        /// <return>Cuerpo html del elemento.</return>
        var _nameFn = "CreateUIElement";
        try {
            switch (_uiElement.type.toLowerCase()) {
                case "panel":
                    var $ibox = _createElement("div", [{ name: "class", value: "ibox animated " + _uiElement.attributes.animation }]);
                    $ibox.id = ($.isNullOrEmpty(_uiElement.attributes.id)) ? "panel_" + Date.now() : _uiElement.attributes.id;
                    if (_uiElement.attributes.title == null || typeof _uiElement.attributes.title === "string") {
                        var $title = _createElement("div", [{ name: "class", value: "ibox-title" }]);
                        $h5 = _createElement("h5"); $h5.innerHTML = ($.isNullOrEmpty(_uiElement.attributes.title)) ? "" : _uiElement.attributes.title; $title.appendChild($h5);
                        if (typeof _uiElement.attributes.tools !== "boolean" || _uiElement.attributes.tools !== null) {
                            var $iboxtools = _createElement("div", [{ name: "class", value: "ibox-tools" }]);
                            var band = false;
                            if (_uiElement.attributes.tools.collapse === true) {
                                var $collapselink = _createElement("a", [{ name: "class", value: "collapse-link" }]);
                                $collapselink.innerHTML = "<i class='fa fa-chevron-up'></i>";
                                $iboxtools.appendChild($collapselink);
                                band = true;
                            }
                            if (_uiElement.attributes.tools.close === true) {
                                var $closelink = _createElement("a", [{ name: "class", value: "close-link" }]);
                                $closelink.innerHTML = "<i class='fa fa-times'></i>";
                                $iboxtools.appendChild($closelink);
                                band = true;
                            }
                            if ($.isPlainObject(_uiElement.attributes.tools.close) && _uiElement.attributes.tools.close.visible === true && !$.isFunction(_uiElement.attributes.tools.close.event)) {
                                var $closelink = _createElement("a", [{ name: "class", value: "close-link" }]);
                                $closelink.innerHTML = "<i class='fa fa-times'></i>";
                                $iboxtools.appendChild($closelink);
                                band = true;
                            }
                            if ($.isPlainObject(_uiElement.attributes.tools.close) && _uiElement.attributes.tools.close.visible === true && $.isFunction(_uiElement.attributes.tools.close.event)) {
                                var $closelink = _createElement("a", [{ name: "id", value: "closeLink_" + $ibox.id }]);
                                $closelink.innerHTML = "<i class='fa fa-times'></i>";
                                $(document).off('click', '#closeLink_' + $ibox.id);
                                $(document).on('click', '#closeLink_' + $ibox.id, function () {
                                    _uiElement.attributes.tools.close.event();
                                    var content = $(this).closest('div.ibox');
                                    content.remove();
                                });
                                $iboxtools.appendChild($closelink);
                                band = true;
                            }
                            if (band === true) {
                                $title.appendChild($iboxtools);
                            }
                        }
                        $ibox.appendChild($title);
                    }
                    var $iboxcontent = _createElement("div", [{ name: "class", value: "ibox-content" }]);
                    $iboxcontent.innerHTML = _uiElement.attributes.content;
                    $ibox.appendChild($iboxcontent);
                    if (typeof _uiElement.attributes.footer === "string") {
                        var $iboxfooter = _createElement("div", [{ name: "class", value: "ibox-footer" }]);
                        $iboxfooter.innerHTML = _uiElement.attributes.footer;
                        $ibox.appendChild($iboxfooter);
                    }
                    if (_uiElement.attributes.width != null) {
                        var $container = _createElement("div", [{ name: "class", value: _uiElement.attributes.width }]);
                        $container.appendChild($ibox);
                        return $container.outerHTML;
                    } else {
                        return $ibox.outerHTML;
                    }; break;
                default:
                    throw new SaeExcepcion(_context, _nameFn, "No se encontró el tipo de control solicitado: <strong>" + _control.type + "</strong>.", _resources.danger, true);
            }
        } catch (ex) {
            throw ex
        }
    };

    var _createElement = function (_elementType, _attribute) {
        /// <summary>Función Crear un elemento de html.</summary>
        /// <param name="_elementType" type="String">Cadena de texto con el tipo o identificador del elemento.</param>
        /// <param name="_attribute" type="Object" optional="true">Objeto con los atributos para el elemento.</param>
        /// <return type="Object">Data del elemento.</return>
        var _nameFn = "CreateElement";
        try {
            if ($.isNullOrEmpty(_elementType)) {
                throw new SaeExcepcion(_context, _nameFn, "No es posible crear el elemento ya que se requiere el identificador del tipo de elemento.", _resources.danger, true);
            } else {
                element = document.createElement(_elementType);
                if (!$.isEmptyObject(_attribute) && _attribute.length > 0) {
                    $.each(_attribute, function (index, attr) {
                        element.setAttribute(attr.name, attr.value)
                    });
                }
                return element;
            }
        } catch (ex) {
            throw ex;
        }
    };

    var _setDataSourceSelect = function (_collection, _select) {
        /// <summary>Función que actualiza el dataSource de un control kendoDropDownList.</summary>
        /// <param name="_collection" type="Object">Colección de registros.</param>
        /// <param name="_select" type="Object">Control kendoGrid.</param>
        try {
            var datasource = new kendo.data.DataSource({ data: _collection });
            datasource.read();
            _select.setDataSource(datasource);
            _select.refresh();
            _select.select(0);
            return _select;
        } catch (ex) {
            throw ex;
        }
    };

    var _setDataSourceGrid = function (_collection, _grid) {
        /// <summary>Función que actualiza el dataSource de un control kendoGrid.</summary>
        /// <param name="_collection" type="Object">Colección de registros.</param>
        /// <param name="_grid" type="Object">Control kendoGrid.</param>
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

    var _getNamePage = function () {
        /// <summary>Función que retorna el nombre de la Página actual.</summary>
        /// <return type="String">Nombre de la Página.</return>
        try {
            var sPath = window.location.pathname;
            var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
            return sPage;
        } catch (ex) {
            throw ex;
        }
    };

    var _stringToBoolean = function (string) {
        /// <summary>Función que convierte una cadena de texto a booleas si aplica.</summary>
        /// <return type="Boolean">Indicador resultante.</return>
        try {
            switch (string.toLowerCase()) {
                case "true": case "yes": case "1": return true;
                case "false": case "no": case "0": case null: return false;
                default: return Boolean(string);
            }
        } catch (ex) {
            throw ex;
        }
    };

    var _cookie = {
        /// <summary>Rutina para administrar las cookies del sitio.</summary>
        Create: function (_key, _value, _expireDate) {
            /// <summary>Función que crea una cookie.</summary>
            /// <param name="_key" type="String">Nombre (key) que identifica la cookie.</param>
            /// <param name="_value" type="String">Valor que se registrará en la cookie.</param>
            /// <param name="_expireDate" type="DateTime" Optional="true">Valor opcional. Fecha y hora en la cual expira la cookie. Si no se define por defecto la cookie expira al finalizar la sesión de navegación.</param>
            /// <param name="_secure" type="Boolean" Optional="true">Valor opcional. </param>
            /// <return type="String">Nombre (key) de la cookie.</param>
            try {
                //<nombre>=<valor>; expires=<fecha>; max-age=<segundos>; domain=<dominio>; secure;
                var cookie = "__cobra$" + _key.toString() + "=" + encodeURIComponent(_value);
                if (!$.isNullOrEmpty(_expireDate)) cookie += ";expires=" + _expireDate.toUTCString();
                //Indica que la cookie sólo es válida para conexiones encriptadas, por ejemplo mediante protocolo HTTPS.
                if (location.protocol.slice(0, -1) == "https") cookie += ";domain=secure";
                document.cookie = cookie;
                return "__cobra$" + _key.toString();
            } catch (ex) {
                throw ex;
            }
        },
        Get: function (_key) {
            /// <summary>Función que obtiene el valor de una cookie.</summary>
            /// <param name="_key" type="String">Nombre (key) que identifica la cookie.</param>
            /// <return type="String">Valor de la cookie.</param>
            try {
                var name = "__cobra$" + _key + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return null;
            } catch (ex) {
                throw ex;
            }
        },
        Update: function (_key, _value) {
            /// <summary>Función que modifica el valor de una cookie si existe.</summary>
            /// <param name="_key" type="String">Nombre (key) que identifica la cookie.</param>
            /// <param name="_value" type="String">Valor que se registrará en la cookie.</param>
            /// <return type="Boolean">Indicador que se modificó.</param>
            try {
                if (!$.isNullOrEmpty(_cookie.Get(_key))) {
                    _key = "__cobra$" + _key;
                    document.cookie = _key + "=" + _value;
                    if (_cookie.Get(_key) === _value) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (ex) {
                throw ex;
            }
        },
        Delete: function (_key) {
            /// <summary>Función que elimina una cookie.</summary>
            /// <param name="_key" type="String">Nombre (key) que identifica la cookie.</param>
            /// <return type="Boolean">Indicador que se eliminó la cookie.</param>
            try {
                _key = "__cobra$" + _key;
                if (!$.isNullOrEmpty(_cookie.Get(_key))) {
                    document.cookie = _key + "=; max-age=0";
                    if (_cookie.Get(_key) === null) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (ex) {
                throw ex;
            }
        }
    };

    var _disarray = function (_array) {
        var i = _array.length;
        while (i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = _array[i];
            _array[i] = _array[j];
            _array[j] = tmp;
        }
    }

    return {    
        Application: _application,
        Notification: _notification,
        GetParametroURL: _getParametroURL,
        GetPathRaiz: _getPathRaiz,
        AddPageLoaded: _addPageLoaded,
        AddEventListener: _addEventListener,
        RemoveEventListener: _removeEventListener,
        HandledError: _handledError,
        CreateControlKendo: _createControlKendo,
        CreateElement: _createElement,
        SetDataSourceSelect: _setDataSourceSelect,
        SetDataSourceGrid: _setDataSourceGrid,
        GetNamePage: _getNamePage,
        StringToBoolean: _stringToBoolean,
        CreateUIElement: _createUIElement,
        Disarray: _disarray,
        Cookie: _cookie,
        Resources: _resources
    };
})();

Object.Unscramble = function () {
    /// <summary>Función que sirve para enmascarar el nombre del llamado saeRequest.</summary>
    var reqName = {
        c6: 'i1', //ci
        s7: 'a2', //sa
        R8: 'e3', //Re
        q9: 'u4', //qu
        e10: 's5', //es
        t11: '' //t
    }
    var requestString = '';
    for (var property in reqName) {
        if (reqName.hasOwnProperty(property)) {
            requestString += property.charAt(0).toString() + reqName[property].charAt(0).toString();
        }
    }
    return requestString
};

Object[Object.Unscramble()] = function (_action, _parameters, _onComplete, _onError) {
    /// <summary>Función que sirve para realizar un llamado de objeto xhr(XMLHttpRequest) o más conocodo como Ajax Callback.</summary>
    /// <param name="_action" type="String">El nombre del método web.</param>
    /// <param name="_parameters" type="Object" Optional="true">El objeto con los parámetros del método.</param>
    /// <param name="_onComplete" type="Function">La función a ejecutar si el llamado es exitoso.</param>
    /// <param name="_onError" type="Function" Optional="true">La función de respuesta del servidor si el llamado tiene un error de petición o excepción no controlada.</param>
    /// <returns type="object">No retorna ningún elemento, si se asigna a una variable u objeto, la función es replicada a éste.</returns>
    try {
        var location = window.location.pathname + '/' + _action;
        var isAsync = true;
        _parameters = ($.isPlainObject(_parameters) && Object.keys(_parameters).length > 0) ? _parameters : {};
        var currentWindow = Utilities2.GetPathRaiz();
        switch (_action.toLowerCase()) {
            case "passwordchange":
                location = currentWindow + "Services/SesionUsuario.asmx/_setPasswordChange";
                break;
        }
        settings = {
            data: _parameters,
            method: _action
        };
        $.ajax({
            type: 'POST',
            url: location,
            dataType: 'json',
            async: isAsync,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(_parameters),
            success: function (retrieved) {
                if ($.isFunction(_onComplete)) {
                    _onComplete(retrieved.d, settings);
                }
            },
            error: function (ex) {
                if ($.isFunction(_onError)) {
                    _onError(ex.statusText + ". Service " + ex.state().toCapitalize() + ". " + "[Status: " + ex.status.toString() + "]", settings);
                } else {
                    console.log("[Status: " + ex.status.toString() + "] " + ex.statusText);
                }
            }
        });
    } catch (ex) {
        throw ex;
    }
};

Object.DisposeUtilities = function () {
    /// <summary>Función que sirve para limpiar los objetos y funciones generales de los archivos Javascript.</summary>
    delete Object.saeRequest;
    delete Object.Unscramble;
    delete Object.Resources;
    SwitchPassword = undefined;
    try {
        delete Object.DisposeUtilities;
    } catch (ex) {
        DisposeUtilities();
    }
}

Utilities2.AddPageLoaded(function () {
    Object.DisposeUtilities();
});