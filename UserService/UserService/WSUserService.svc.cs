using ConnectionManagement.Data;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Threading.Tasks;
using DataAccess.Dto;
using UserWeb.UserService;
using UserWeb.Dto;

namespace UserService
{
    // NOTA: puede usar el comando "Rename" del menú "Refactorizar" para cambiar el nombre de clase "Service1" en el código, en svc y en el archivo de configuración.
    // NOTE: para iniciar el Cliente de prueba WCF para probar este servicio, seleccione Service1.svc o Service1.svc.cs en el Explorador de soluciones e inicie la depuración.
    public class WSUserService : IWSUserService
    {
        public string connectionString = ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString;

        public async Task<List<User>> GetUser()
        {
            int IdConsulta = 1;
            List<User> result = new List<User>();
            Connection db = new Connection(connectionString);
            try
            {
                db.SQLParametros.Clear();
                if (!Convert.IsDBNull(IdConsulta) && IdConsulta != 0) { db.SQLParametros.Add("@idConsulta", SqlDbType.Int).Value = IdConsulta; }
                var reader = await db.EjecutarReaderAsync("SP_USUARIOS", CommandType.StoredProcedure);
                if (reader != null)
                {
                    while (reader.Read())
                    {
                        var Dto = new User();
                        Dto.Id = Convert.ToInt32(reader["id"]);
                        if (!Convert.IsDBNull(reader["nombre"])) { Dto.Nombre = reader["nombre"].ToString(); }
                        if (!Convert.IsDBNull(reader["fechaNacimiento"])) { Dto.FechaNacimiento = Convert.ToDateTime(reader["fechaNacimiento"]); }
                        if (!Convert.IsDBNull(reader["sexo"])) { Dto.Sexo = reader["sexo"].ToString(); }

                        result.Add(Dto);
                    }
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Se generó un error al consultar los registros " + ex.Message);
            }
            finally { }
            if (db != null) 
            {
                db.Dispose();
            }

            return result;
        }

        public async Task<UserWeb.Dto.ResponseService> InsertUser(UserDto user)
        {
            UserWeb.Dto.ResponseService result = new UserWeb.Dto.ResponseService();
            int IdConsulta = 2;
            Connection db = new Connection(connectionString);
            db.IniciarTransaccion();
            try
            {
                db.SQLParametros.Clear();
                db.TiempoEsperaComando = 0;
                if (!Convert.IsDBNull(IdConsulta) && IdConsulta != 0) { db.SQLParametros.Add("@idConsulta", SqlDbType.Int).Value = IdConsulta; }
                if (!string.IsNullOrWhiteSpace(user.Nombre)) { db.SQLParametros.Add("@nombre", SqlDbType.VarChar, 100).Value = user.Nombre; }
                if (!string.IsNullOrWhiteSpace(user.FechaNacimiento.ToString())) { db.SQLParametros.Add("@fechaNacimiento", SqlDbType.DateTime).Value = user.FechaNacimiento; }
                if (!string.IsNullOrWhiteSpace(user.Sexo)) { db.SQLParametros.Add("@sexo", SqlDbType.VarChar, 1).Value = user.Sexo; }

                db.SQLParametros.Add("@resultado", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;

                var reader = await db.EjecutarNonQuery("SP_USUARIOS", CommandType.StoredProcedure);
                int resul = Convert.ToInt16(db.SQLParametros["@resultado"].Value);
                if (resul == 0)
                {
                    result.Code = "400";
                    db.AbortarTransaccion();
                    result.Message = "Error al insertar el registro";
                    return result;
                }
                else
                {
                    db.ConfirmarTransaccion();
                    result.Code = "200";
                    result.Message = "Registro grabado exitosamente";
                    result.Value = Convert.ToInt32(db.SQLParametros["@resultado"].Value);
                    return result;
                }
            }
            catch (Exception ex)
            {
                db.AbortarTransaccion();
                result.Message = "500";
                result.Message = ex.Message;
            }
            finally { }
            if (db != null)
            {
                db.Dispose();
            }

            return result;
        }

        public async Task<UserWeb.Dto.ResponseService> UpdateUser(UserDto user)
        {
            UserWeb.Dto.ResponseService result = new UserWeb.Dto.ResponseService();
            int IdConsulta = 3;
            Connection db = new Connection(connectionString);
            db.IniciarTransaccion();
            try
            {
                db.SQLParametros.Clear();
                if (!Convert.IsDBNull(user.Id) && user.Id != 0) { db.SQLParametros.Add("@id", SqlDbType.Int).Value = user.Id; }
                if (!Convert.IsDBNull(IdConsulta) && IdConsulta != 0) { db.SQLParametros.Add("@idConsulta", SqlDbType.Int).Value = IdConsulta; }
                if (!string.IsNullOrWhiteSpace(user.Nombre)) { db.SQLParametros.Add("@nombre", SqlDbType.VarChar, 100).Value = user.Nombre; }
                if (!string.IsNullOrWhiteSpace(user.FechaNacimiento.ToString())) { db.SQLParametros.Add("@fechaNacimiento", SqlDbType.DateTime).Value = user.FechaNacimiento; }
                if (!string.IsNullOrWhiteSpace(user.Sexo)) { db.SQLParametros.Add("@sexo", SqlDbType.VarChar, 1).Value = user.Sexo; }

                db.SQLParametros.Add("@resultado", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;

                var reader = await db.EjecutarNonQuery("SP_USUARIOS", CommandType.StoredProcedure);
                int resul = Convert.ToInt16(db.SQLParametros["@resultado"].Value);
                if (resul == 0)
                {
                    result.Code = "400";
                    db.AbortarTransaccion();
                    result.Message = "Error al actualizar el registro";
                    return result;
                }
                else
                {
                    db.ConfirmarTransaccion();
                    result.Code = "200";
                    result.Message = "Registro actualizado exitosamente";
                    result.Value = Convert.ToInt32(db.SQLParametros["@resultado"].Value);
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Se generó un error al actualizar el registro " + ex.Message);
            }
        }

        public async Task<UserWeb.Dto.ResponseService> DeleteUser(UserDto user)
        {
            UserWeb.Dto.ResponseService result = new UserWeb.Dto.ResponseService();
            int IdConsulta = 4;
            Connection db = new Connection(connectionString);
            db.IniciarTransaccion();
            try
            {
                db.SQLParametros.Clear();
                if (!Convert.IsDBNull(user.Id) && user.Id != 0) { db.SQLParametros.Add("@id", SqlDbType.Int).Value = user.Id; }
                if (!Convert.IsDBNull(IdConsulta) && IdConsulta != 0) { db.SQLParametros.Add("@idConsulta", SqlDbType.Int).Value = IdConsulta; }
                db.SQLParametros.Add("@resultado", SqlDbType.VarChar, 500).Direction = ParameterDirection.Output;

                var reader = await db.EjecutarNonQuery("SP_USUARIOS", CommandType.StoredProcedure);
                int resul = Convert.ToInt16(db.SQLParametros["@resultado"].Value);
                if (resul == 0)
                {
                    result.Code = "400";
                    db.AbortarTransaccion();
                    result.Message = "Error al eliminar el registro";
                    return result;
                }
                else
                {
                    db.ConfirmarTransaccion();
                    result.Code = "200";
                    result.Message = "Registro eliminado exitosamente";
                    result.Value = Convert.ToInt32(db.SQLParametros["@resultado"].Value);
                    return result;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Se generó un error al eliminar el registro " + ex.Message);
            }
        }
    }
}
