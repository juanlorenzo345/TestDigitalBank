// Personalización de plugins 
// Dependencias: Master.js

/**************** summernote ****************/

// Inicializar summernote con las opciones requeridas en la mayoría de las pantallas
function summernoteInit($div, options) {
    var defaults = {
        height: 300,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'italic', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            //['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'help']],// 'codeview',
            ['misc', ['undo', 'redo']]
        ],
        dialogsInBody: true,
        lang: 'es-ES',
        tableClassName: 'demo'
    }
    var options = $.extend(defaults, options);
    $div.summernote(options);
}

/**************** FooTable ****************/

// Da formato de fecha a columna de FooTable
var formatoFecha = function (value, options, rowData) {
    if (value) {
        return Master.obtenerfechaAnioMesDia(new Date(value));
    }
    else {
        return '';
    }

};
// formato fecha hora
var formatoFechahora = function (value, options, rowData) {
    
    if (value) {
        var d = new Date(value),
            dformat = [d.getMonth() + 1,
            d.getDate(),
                d.getFullYear()].join('/')
                + ' '
                +
                [d.getHours()    ,
                d.getMinutes(),
                    d.getSeconds()].join(':')
            ;
        var date = new Date(value);   
       
        var Month = date.getMonth() + 1;
        Month = Month >= 10 ? Month : '0' + Month;
        var dates = date.getDate();
        dates = dates >= 10 ? dates : '0' + dates;
        var Year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = dates + '/' + Month + '/' + Year + ' ' +hours + ':' + minutes + ' ' + ampm;


        return strTime ;
    }
    else {
        return '';
    }

};

// Da formato a la moneda de  columna de FooTable
var formatoMonedaTable= function (value, options, rowData) {
    if (value) {
        //return `<div class="text-right">${Master.FormatoMoneda(value, 2)}</div>`;
        return Master.FormatoMoneda(value, 2);
    }
    else {
        return '';
    }

};

// Carga datos en FooTable, creándola si no existe
var loadFooTableData = function ($table, data, append, events) {
    events = events || {};
    var fT = FooTable.get($table);
    if (fT) {
        fT.rows.load(data, append);
    }
    else {
        fT = FooTable.init($table, {
            rows: data,
            on: events,
            filtering: {
                placeholder: 'Buscar'
            }
        });
    }

    return fT;
};

// Obtiene una fila de FooTable (incluso si está en las filas de detalle)
function getFooTableRow(element) {
    var $detailsTable = $(element).closest('.footable-details');
    if ($detailsTable.length) {
        return FooTable.getRow($detailsTable);
    }
    else {
        return FooTable.getRow(element);
    }
}

// Cambia el valor de un atributo de una columna de FooTable
function changeFooTableColumnAttribute($table, columnName, name, value) {
    var ft = FooTable.get($table);
    if (ft) {
        var column = ft.columns.get(columnName);
        column[name] = value;
    }
    else {
        $table.find('[data-name="' + columnName + '"]').first().data(name, value);
    }
}

// Crea una cadena con un botón HTML
var botonHTML = function (nombre, clase, valor) {
    return '<button class="btn ' + clase + '" type="button" value="' + valor + '">' + nombre + '</button>';
};

// Obtiene las clases de una celda y las usa para crear un boton HTML
function botonConClasesDeCelda(celda, rowData) {
    var classes = celda.classes;
    var btnClasses = [];
    for (var i = 0; i < classes.length; i++) {
        btnClasses.push(classes[i].replace(/col-/i, ''));
    }
    return botonHTML(celda.name, btnClasses.join(' '), rowData["Id"] || rowData["id"]);
}

// Da formato de botón a una columna de FooTable usando clases definidas en encabezado
function formatoBoton(value, options, rowData) {
    var celda = this;
    return botonConClasesDeCelda(celda, rowData);
}

// Da formato a un valor buleano para mostrar Sí o No
function formatoBuleano(value, options, rowData) {
    var verdadero = String(value).toUpperCase() === 'TRUE';
    var htmlCelda = verdadero ? 'Sí' : 'No';
    return htmlCelda;
}

// Da formato a un valor buleano para mostrar Sí o No
function formatoBuleanoCheckBox(value, options, rowData) {
    var verdadero = String(value).toUpperCase() === 'TRUE';
    let checked = verdadero ? ' checked' : '';
    var htmlCelda = `<input type="checkbox" disabled${checked}>`;
    return htmlCelda;
}

// Limpia las filas de una tabla FooTable
function clearFooTableRows($table) {
    var ft = FooTable.get($table);
    if (ft) {
        $.each(ft.rows.all, function (i, row) {
            row.delete(false);
        });

        ft.draw();
    }
}

function getFooTableRows(ft) {
    let arr = [];
    for (let row of ft.rows.all) {
        arr.push(row.value);
    }
    return arr;
}

// Obtiene una propiedad de un objeto basándose en una cadena con notación de punto. Ej: getDescendantProp({ prop1: { a: 1, b: 2 }, prop2:"test" }, "prop1.b") devuelve 2
function getDescendantProp(obj, desc) {
    // Buscar en nivel inferior
    var arr = desc.split(".");
    while (arr.length && (obj = obj[arr.shift()]));
    // Si es fecha, transformarlo a cadena
    if (Object.prototype.toString.call(obj) === '[object Date]') {
        obj = Master.obtenerfechaAnioMesDia(obj);
    }
    return obj;
}

// Crea nuevo tipo de columna para habilitar mostrar propiedades internas de objeto (esto permite usar nombres como tipodocumento.descripcion en las columnas de footable)
(function ($, F) {

    // create a new column type called "descendant" that will use our custom cell class when creating cells
    F.DescendantColumn = F.Column.extend({
        // override the base constructor so we can specify the type as "descendant"
        construct: function (instance, definition) {
            // call the base constructor
            this._super(instance, definition, "descendant");
        },
        // Usar función de obtener propiedades
        createCell: function (row) {
            var element = F.is.jq(row.$el) ? row.$el.children('td,th').get(this.index) : null,
                data = F.is.hash(row.value) ? getDescendantProp(row.value, this.name) : null;
            return new F.Cell(this.ft, row, this, element || data);
        }
    });

    // register the "descendant" column so we can use it in our tables
    F.columns.register('descendant', F.DescendantColumn);

    // Sobreescribir función draw solamente para agregar un evento posterior a la carga de los nuevos elementos en el DOM.
    F.Table = F.Table.extend({
        draw: function () {
            var self = this;

            // Clone the current table and insert it into the original's place
            var $elCopy = self.$el.clone().insertBefore(self.$el);

            // Detach `self.$el` from the DOM, retaining its event handlers
            self.$el.detach();

            // when drawing the order that the components are executed is important so chain the methods but use promises to retain async safety.
            return self.execute(false, true, 'predraw').then(function () {
				/**
				 * The predraw.ft.table event is raised after all core components and add-ons have executed there predraw functions but before they execute there draw functions.
				 * @event FooTable.Table#"predraw.ft.table"
				 * @param {jQuery.Event} e - The jQuery.Event object for the event.
				 * @param {FooTable.Table} ft - The instance of the plugin raising the event.
				 */
                return self.raise('predraw.ft.table').then(function () {
                    return self.execute(false, true, 'draw').then(function () {
						/**
						 * The draw.ft.table event is raised after all core components and add-ons have executed there draw functions.
						 * @event FooTable.Table#"draw.ft.table"
						 * @param {jQuery.Event} e - The jQuery.Event object for the event.
						 * @param {FooTable.Table} ft - The instance of the plugin raising the event.
						 */
                        return self.raise('draw.ft.table').then(function () {
                            return self.execute(false, true, 'postdraw').then(function () {
								/**
								 * The postdraw.ft.table event is raised after all core components and add-ons have executed there postdraw functions.
								 * @event FooTable.Table#"postdraw.ft.table"
								 * @param {jQuery.Event} e - The jQuery.Event object for the event.
								 * @param {FooTable.Table} ft - The instance of the plugin raising the event.
								 */
                                return self.raise('postdraw.ft.table');
                            });
                        });
                    });
                });
            }).fail(function (err) {
                if (F.is.error(err)) {
                    console.error('FooTable: unhandled error thrown during a draw operation.', err);
                }
            }).always(function () {
                // Replace the copy that we added above with the modified `self.$el`
                $elCopy.replaceWith(self.$el);
                self.$loader.remove();
                self.raise('postload.ft.table'); // El nuevo evento
            });
        }
    });
})(jQuery, FooTable);
