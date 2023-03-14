using System.Data;
using System.Data.SqlClient;
using System;
using System.Threading.Tasks;

namespace ConnectionManagement.Data
{
    public class InfoObjetoConexion
    {
        public string NombreServidor;
        public string NombreBaseDatos;
        public string CadenaConexion;
        public int TiempoEspera;
        public string NombreUsuario;
        public string Password;
    }
    public class Connection : System.IDisposable
    {
        #region "Attributes"
        private bool disposing;
        private SqlConnection conexion;
        private SqlCommand comando;
        private SqlTransaction transaccion;
        private SqlBulkCopy myBulkCopy;
        private InfoObjetoConexion infoConexion;
        private SqlDataReader reader;
        private readonly string _ConnectionString;
        #endregion

        #region "Propierties"
        //<summary>
        //indica el estado de la conexion
        //</summary>
        public System.Data.ConnectionState EstadoConexion
        {
            get { return conexion.State; }
        }
        //<summary>
        //flag que indica si el comando de la clase esta en modo transaccional
        //</summary>
        //<value></value>
        //<returns> true si se inicio la tasaccion, de lo contrario false</return>
        public bool EstadoTransaccional
        {
            get
            {
                if (transaccion == null || transaccion.Connection == null ||
                    (transaccion.Connection.State != ConnectionState.Open &&
                    transaccion.Connection.State != ConnectionState.Executing &&
                    transaccion.Connection.State != ConnectionState.Fetching))
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }
        public SqlBulkCopy BulkCopy
        {
            get { return this.myBulkCopy; }
        }
        public SqlTransaction TransaccionSQL
        {
            get { return transaccion; }
        }
        public SqlConnection ConexionSQL
        {
            get { return conexion; }
        }
        public SqlParameterCollection SQLParametros
        {
            get { return comando.Parameters; }
        }
        //<summary>
        //obtiene o establece un parametro de la lista de parametos del comando
        //</summary>
        //<param name="index">indexación de base cero: indice a retornar de la lista de parametros del comando</param>
        //<value></value>
        //<returns>SqlClient.SqlParameter</returns>
        //<remarks>se puede utilizar para acceder directamente los paremetros establecidos al command de la clase</remarks>
        public SqlParameter SqlParametros(int index, SqlParameter value = null)
        {
            if (comando.Parameters.Count < 0)
            {
                throw new System.ArgumentOutOfRangeException();
            }
            else
            {
                if (value != null) { comando.Parameters[index] = value; }
                return comando.Parameters[index];
            }
        }
        //<summary>
        //obtiene o establece un parametro de la lista de parametos del comando
        //</summary>
        //<param name="Nombre">Nombre del parametro</param>
        //<value></value>
        //<returns>SqlClient.SqlParameter</returns>
        //<remarks>se puede utilizar para acceder directamente los paremetros establecidos al command de la clase</remarks>
        public SqlParameter SqlParametros(string nombre, SqlParameter value = null)
        {
            if (comando.Parameters.Count < 0)
            {
                throw new System.ArgumentOutOfRangeException();
            }
            else
            {
                if (value != null) { comando.Parameters[nombre] = value; }
                return comando.Parameters[nombre] = value;
            }
        }
        //<summary>
        //Obtiene o etablece el tiempo de espera antes de finalizar el intento de ejecutar el comando y lanzar un error
        //</summary>
        public int TiempoEsperaComando
        {
            get { return comando.CommandTimeout; }
            set
            {
                comando.CommandTimeout = value;
                if (myBulkCopy != null)
                {
                    myBulkCopy.BulkCopyTimeout = value;
                }
            }
        }
        //<summary>
        //Obtiene la información asociada a la Conexión actual
        //</summary>
        public InfoObjetoConexion InformacionDeConexion
        {
            get
            {
                SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(conexion.ConnectionString);
                this.infoConexion = new InfoObjetoConexion()
                {
                    CadenaConexion = conexion.ConnectionString,
                    NombreBaseDatos = conexion.Database,
                    TiempoEspera = conexion.ConnectionTimeout,
                    NombreUsuario = builder.UserID,
                    Password = builder.Password
                };
                builder.Clear();
                return infoConexion;
            }
        }
        //<summary>
        //Permite manejar un objeto de tipo SqlDataReader creado mediante la ejecución previa
        //de un script utilizando el método EjecutarReader
        //</summary>
        public SqlDataReader Reader
        {
            get { return reader; }
        }
        #endregion

        #region "constructors and destructors"
        //''' <summary>
        //''' inicializa una conexión a una base de datos externa a la aplicación
        //''' </summary>
        //''' <param name="cadenaConexion">Cadena de conexión a la base de datos con credenciales</param>
        public Connection(string cadenaConexion)
        {
            _ConnectionString = cadenaConexion;
            //pSql.Assert();
            conexion = new SqlConnection(_ConnectionString);
            comando = conexion.CreateCommand();
            comando.Connection = conexion;
        }

        public Connection(SqlTransaction transaccion)
        {
            this.transaccion = transaccion;
        }

        //''' <summary>
        //'''   Inicializa el objeto con la cadena de coneccion que esta configurada en el webconfig
        //''' </summary>
        //''' <remarks>Buscar en el archivo de configuración (Web.config),la llave (CadenaConexion) la cadena de conexión a la base de datos
        //''' </remarks>


        public void Dispose()
        {
            if (reader != null) { if (!reader.IsClosed) { reader.Close(); } }
            if (comando != null) { comando.Dispose(); }
            if (transaccion != null) { transaccion.Dispose(); }
            if (myBulkCopy != null) { myBulkCopy.Close(); }
            CcerrarConexion(true);
            if (conexion != null) { conexion.Dispose(); }
            infoConexion = null;
            GC.Collect();
            this.Dispose(true);
        }
        public void Dispose(bool b)
        {
            if (!disposing)
            {
                disposing = true;
                GC.SuppressFinalize(this);
            }
        }
        #endregion

        #region "Open and Close connection"
        //''' <summary>
        //''' Abre conexión a la base de datos 
        //''' </summary>
        //''' <returns>Retorna true solamente si la conexión está abierta</returns>
        //''' <remarks></remarks>
        public bool AbrirConexion()
        {
            try
            {
                if (conexion.State == ConnectionState.Closed)
                {
                    conexion.Open();
                }
                else if (conexion.State == ConnectionState.Broken)
                {
                    conexion.Close();
                    conexion.Open();
                }
            }
            catch (SqlException ex)
            {
                throw new Exception("Imposible abrir la conexion a la BD" + ex.Message);
            }
            return Convert.ToBoolean(conexion.State);

        }
        //''' <summary>
        //''' Cierra la conexión a la base de datos solo si no hay una transaccion pendiente
        //''' </summary>
        //''' <returns></returns>
        //''' <remarks>Si hay una transacción por confirmar deja la conexoón en el estado que la encuentra</remarks>
        public bool CerrarConexion()
        {
            if (comando.Transaction == null)
            {
                if (conexion.State != ConnectionState.Closed)
                {
                    conexion.Close();
                }
                return true;
            }
            return false;
        }
        public async Task<bool> AbrirConexionAsync()
        {
            try
            {
                if (this.ConexionSQL.State == ConnectionState.Closed)
                {
                    await this.ConexionSQL.OpenAsync();
                }
                else if (this.ConexionSQL.State == ConnectionState.Broken)
                {
                    this.ConexionSQL.Close();
                    await this.ConexionSQL.OpenAsync();
                }
            }
            catch (SqlException ex)
            {
                throw new Exception("Imposible abrir la conexion a la BD. " + ex.Message);
            }
            return Convert.ToBoolean(this.ConexionSQL.State);

        }
        //''' <summary>
        //''' realiza Cierre de la conexión a la base de datos de manera forzada
        //''' </summary>
        //''' <param name="forzar">si el parametro es true forza el cierre de la conexión 
        //''' sin importar las transacciones pendientes; si es false tiene en cuenta las transacciones
        //''' </param>
        //''' <returns></returns>
        //''' <remarks></remarks>
        private bool CcerrarConexion(bool forzar)
        {
            if (forzar)
            {
                if (conexion.State != ConnectionState.Closed)
                {
                    if (comando.Transaction == null)
                    {
                        conexion.Close();
                        return true;
                    }
                }
            }
            else
            {
                if (comando.Transaction == null)
                {
                    if (conexion.State != ConnectionState.Closed)
                    {
                        conexion.Close();
                        return true;
                    }
                }
            }
            return false;
        }
        #endregion

        #region "Queries and transactions"
        //''' <summary>
        //''' Ejecuta una  sentencia SQL la cual  no retorna filas
        //''' </summary>
        //''' <param name="sentencia">sentencia SQL insert,update,delete...</param>
        //''' <param name="tipoComando">Variable de tipo CommandType,Por defecto su valor es tipo Tex</param>
        //''' <returns>True cuando pudo ejecutar la sentenia</returns>
        //''' <remarks>si la clase está en modo transaccional solo se efectuaran los cambios al
        //''' confirmar la transacción.
        //''' si desea ejecutar procedimientos almacenados debe enviar en el parametro tipoComando = CommandType.StoredProcedure
        //'''</remarks>
        public async Task<int> EjecutarNonQuery(string sentencia, CommandType tipoComando = CommandType.Text)
        {
            if (AbrirConexion())
            {
                comando.CommandType = tipoComando;
                comando.CommandText = sentencia;
                try
                {
                    return await comando.ExecuteNonQueryAsync();
                }
                finally
                {
                    this.CerrarConexion();
                }
            }
            return -1;
        }
        //''' <summary>
        //''' establece la clase en modo transaccional
        //''' </summary>
        //''' <remarks>La conección permanece abierta hasta terminar o abortar la transacción. 
        //</remarks>
        public void IniciarTransaccion()
        {
            if (AbrirConexion())
            {
                comando.Connection = conexion;
                transaccion = conexion.BeginTransaction();
                comando.Transaction = transaccion;
            }
        }
        // ''' <summary>
        //''' Finaliza de manera satisfactoria la transacción
        //''' </summary>
        //''' <remarks>termina el modo transaccional de la clase y cierra la conección</remarks>
        //''' <returns>Retorna True si la transacción fué realizada con exito</returns>
        public bool ConfirmarTransaccion()
        {
            try
            {
                transaccion.Commit();
                return true;
            }
            finally
            {
                CcerrarConexion(true);
                transaccion.Dispose();
                transaccion = null;
            }
        }
        //''' <summary>
        //''' Revierte las sentencias ejecutadas dentro de la transacción
        //''' </summary>
        //''' <remarks>termina el modo transaccional de la clase y cierra la conección</remarks>
        public bool AbortarTransaccion()
        {
            if (EstadoTransaccional)
            {
                if (reader != null && reader.IsClosed)
                { reader.Close(); }
                try
                {
                    transaccion.Rollback();
                    CcerrarConexion(true);
                    return true;
                }
                finally
                {
                    transaccion.Dispose();
                    transaccion = null;
                }
            }
            return false;
        }
        //''' <summary>
        //''' Abre la conección e Inicializa el opjeto BulkCopy en la capa de datos.
        //''' Cuando la capa de datos no está en modo transaccional se debe cerrar la connección despues de implementar el BulkCopy
        //''' </summary>
        //''' <param name="CopyOptions"></param>
        //''' <remarks>Se de  cerrar la connección despues de implementar el BulkCopy</remarks>
        public void InicializarBulkCopy(SqlBulkCopyOptions CopyOptions = SqlBulkCopyOptions.Default)
        {
            if (transaccion == null)
            {
                if (AbrirConexion())
                { myBulkCopy = new SqlBulkCopy(conexion); }
            }
            else
            {
                myBulkCopy = new SqlBulkCopy(conexion, CopyOptions, transaccion);
            }
        }
        public void InicializarBulkCopy(string cadenaConexion)
        {
            myBulkCopy = new SqlBulkCopy(cadenaConexion);
        }
        public void InicializarBulkCopy(string cadenaConexion, SqlBulkCopyOptions CopyOptions)
        {
            myBulkCopy = new SqlBulkCopy(cadenaConexion, CopyOptions);
        }
        #endregion

        #region "Queries"
        // ''' <summary>
        //''' ejecuta una sentencia y retorna un datareader con los datos leidos;  este debe ser cerrado despues de su implementacion junto con la conexión
        //''' </summary>
        //''' <param name="sentencia">Consulta SQL</param>
        //''' <param name="tipoComando">Para metro opcional que especifica el commandtype; por defecto toma como valor text</param>
        //''' <remarks>Es responsabilidad de la persona que llama a cerrar la conexión y el lector cuando haya terminado.</remarks>
        //''' <returns>retorna un SqlDataReader listo para ser leido en la capa de negocio</returns>
        public SqlDataReader EjecutarReader(string sentencia, CommandType tipoComando = CommandType.Text)
        {
            comando.CommandType = tipoComando;
            comando.CommandText = sentencia;
            AbrirConexion();
            reader = comando.ExecuteReader();
            return reader;
        }
        public async Task<SqlDataReader> EjecutarReaderAsync(string sentencia, CommandType tipoComando = CommandType.Text)
        {
            comando.CommandType = tipoComando;
            comando.CommandText = sentencia;
            await AbrirConexionAsync();
            reader = await comando.ExecuteReaderAsync();
            return reader;
        }

        //''' <summary>
        //''' Ejecuta una consulta SQL y retorna un unico valor; Se omiten todas las demás columnas y filas 
        //''' de más generadas por la consulta
        //''' </summary>
        //''' <param name="sentencia">consulta SQL</param>
        //''' <param name="tipoComando">Para metro opcional que especifica el commandtype; por defecto toma como valor text </param>
        //''' <remarks>Utilice el método EjecutarScalar para recuperar un único valor</remarks>
        //''' <returns>devuelve la primera columna de la primera fila del conjunto de resultados de una sentencia sql</returns>
        public object EjecutarScalar(string sentencia, CommandType tipoComando = CommandType.Text)
        {
            comando.CommandType = tipoComando;
            comando.CommandText = sentencia;
            if (AbrirConexion())
            {
                try
                {
                    return comando.ExecuteScalar();
                }
                finally
                { CerrarConexion(); }
            }
            return null;
        }
        //''' <summary>
        //''' carga un Datable con una consulta SQL
        //''' </summary>
        //''' <param name="sentencia">sentencia SQL tipo texto o procedimiento almacenado</param>
        //''' <param name="tipoComando">Para metro opcional que especifica el commandtype; por defecto toma como valor text</param>
        //''' <returns>devuelve un DataTable con el resultado de la consulta</returns>
        //''' <remarks></remarks>
        public DataTable EjecutarDataTable(string sentencia, CommandType tipoComando = CommandType.Text)
        {
            DataTable dt = new DataTable();
            SqlDataAdapter adaptador;
            comando.CommandType = tipoComando;
            if (AbrirConexion())
            {
                try
                {
                    comando.CommandText = sentencia;
                    adaptador = new SqlDataAdapter(comando);
                    adaptador.Fill(dt);
                }
                finally
                {
                    this.CerrarConexion();
                }
            }
            return dt;
        }
        //''' <summary>
        //''' carga un Datable con una consulta SQL, si el DataTable ya tiene datos, los nuevos serán adicionados al final del mismo
        //''' </summary>
        //''' <param name="dt" >DataTable que se llenará con los datos del resultado de la consulta</param>
        //''' <param name="sentencia">sentencia SQL tipo texto o procedimiento almacenado</param>
        //''' <param name="tipoComando">Para metro opcional que especifica el commandtype; por defecto toma como valor text</param>
        //''' <remarks></remarks>
        public void LlenarDataTable(ref DataTable dt, string sentencia, CommandType tipoComando = CommandType.Text)
        {
            if (dt == null) { dt = new DataTable(); }
            SqlDataAdapter adaptador;
            comando.CommandType = tipoComando;
            try
            {
                comando.CommandText = sentencia;
                adaptador = new SqlDataAdapter(comando);
                adaptador.Fill(dt);
            }
            finally
            {
                if (conexion != null)
                {
                    if (conexion.State == ConnectionState.Open)
                    { CerrarConexion(); }
                }
            }
        }
        // ''' <summary>
        //''' Carga un DataSet a parti del resultado de ejecutar una consulta SQL o un procedimiento almacenado
        //''' </summary>
        //''' <param name="sentencia">sentencia SQL tipo texto o procedimiento almacenado</param>
        //''' <param name="tipoComando">Parámetro opcional que especifica el commandtype; por defecto toma como valor text</param>
        //''' <param name="nombreTabla">Parámetro opcional que especifica npmbre de la tabla que se va a llenar con el resultado de la consulta</param>
        //''' <returns>devuelve un DataTable con el resultado de la consulta</returns>
        //''' <remarks></remarks>
        public DataSet EjecutarDataSet(string sentencia, CommandType tipoComando = CommandType.Text, string nombreTabla = "")
        {
            DataSet ds = new DataSet();
            SqlDataAdapter adaptador;
            comando.CommandType = tipoComando;
            if (AbrirConexion())
            {
                comando.CommandText = sentencia;
                adaptador = new SqlDataAdapter(comando);
                if (!string.IsNullOrEmpty(nombreTabla))
                { adaptador.Fill(ds.Tables[nombreTabla]); }
                else { adaptador.Fill(ds); }
            }
            return ds;
        }
        // ''' <summary>
        //''' Carga un DataSet con el resultado de la ejecución de una consulta una consulta SQL
        //''' </summary>
        //''' <param name="ds" >DataSet que se llenará con los datos del resultado de la consulta</param>
        //''' <param name="sentencia">sentencia SQL tipo texto o procedimiento almacenado</param>
        //''' <param name="tipoComando">Para metro opcional que especifica el commandtype; por defecto toma como valor text</param>
        //''' <remarks></remarks>
        public void LlenarDataSet(ref DataSet ds, string sentencia, CommandType tipoComando = CommandType.Text)
        {
            if (ds == null) { ds = new DataSet(); }
            try
            {
                comando.CommandType = tipoComando;
                comando.CommandText = sentencia;
                using (SqlDataAdapter adaptador = new SqlDataAdapter(comando))
                {
                    adaptador.Fill(ds);
                };
            }
            finally
            {
                if (conexion != null)
                {
                    if (conexion.State == ConnectionState.Open)
                    { CerrarConexion(); }
                }
            }
        }
        //''' <summary>
        //''' Carga una tabla específica de un DataSet con el resultado de la ejecución de una consulta una consulta SQL
        //''' </summary>
        //''' <param name="ds" >DataSet que se llenará con los datos del resultado de la consulta</param>
        //''' <param name="nombreTabla" >Nombre de la tabla contenida en el DataSet que se llenará con los datos del resultado de la consulta</param>
        //''' <param name="sentencia">sentencia SQL tipo texto o procedimiento almacenado</param>
        //''' <param name="tipoComando">Para metro opcional que especifica el commandtype; por defecto toma como valor text</param>
        //''' <remarks></remarks>
        public void LlenarDataSet(ref DataSet ds, string nombreTabla, string sentencia, CommandType tipoComando = CommandType.Text)
        {
            if (ds == null) { ds = new DataSet(); }
            try
            {
                comando.CommandText = sentencia;
                comando.CommandType = tipoComando;
                using (SqlDataAdapter adaptador = new SqlDataAdapter(comando))
                {
                    adaptador.Fill(ds, nombreTabla);
                }
            }
            finally
            {
                if (conexion != null)
                {
                    if (conexion.State == ConnectionState.Open)
                    { CerrarConexion(); }
                }
            }
        }
        #endregion

        #region "Methods"
        //''' <summary>
        //''' carga un parametro SQL tipo al comand de la clase
        //''' </summary>
        //''' <param name="nombre">nombre del parametro SQL ej: @miparametro</param>
        //''' <param name="valor">valor que tomará em parametro</param>
        //''' <remarks>Si se agrega un parametro sin valor este tomará su valor por defecto NULL</remarks>
        public void AgregarParametroObjetoSQl(string nombre, object valor)
        {
            comando.Parameters.AddWithValue(nombre, valor);
            comando.Parameters[nombre].IsNullable = true;
        }
        //''' <summary>
        //''' carga un parametro SQL al comand de la clase
        //''' </summary>
        //''' <param name="nombre">nombre del parametro SQL ej: @miparametro</param>
        //''' <param name="valor">valor que tomará em parametro</param>
        //''' <param name="tipo"> opcional es eltipo de dato que tomara el valor si no se establece quedará como string</param>
        //''' <remarks>Si se agrega un parametro sin valor este tomará su valor por defecto NULL</remarks>
        public void AgregarParametroSQL(string nombre, object valor, SqlDbType tipo = SqlDbType.VarChar)
        {
            comando.Parameters.Add(nombre, tipo).Value = valor;
            comando.Parameters[nombre].IsNullable = true;
        }
        //''' <summary>
        //''' Carga un parametro SQL al comand de la clase, especificando obligatoriamente el tipo de dato y la longitud del mismo
        //''' </summary>
        //''' <param name="nombre">nombre del parametro SQL ej: @miparametro</param>
        //''' <param name="valor">valor que tomará em parametro</param>
        //''' <param name="tipo"> opcional es eltipo de dato que tomara el valor si no se establece quedará como string</param>
        //''' <remarks>Si se agrega un parametro sin valor este tomará su valor por defecto NULL</remarks>
        public void AgregarParametroSQL(string nombre, object valor, SqlDbType? tipo, int longitud)
        {
            if (tipo == null)
            { comando.Parameters.Add(nombre, SqlDbType.VarChar).Value = valor; }
            else { comando.Parameters.Add(nombre, (SqlDbType)tipo, longitud).Value = valor; }
            comando.Parameters[nombre].IsNullable = true;
        }
        //  ''' <summary>
        //''' Obtiene la cadena de conexión
        //''' </summary>
        //''' <returns>cadena de conexión con credenciales</returns>
        //''' <remarks></remarks>
        public string GetConexion()
        {
            return conexion.ConnectionString;
        }
        //''' <summary>
        //''' Obtiene la información asociada a la Conexión, a partir de la Cadena de Conexión configurada actualmente
        //''' </summary>
        #endregion


    }
}
