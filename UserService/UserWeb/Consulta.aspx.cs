using DataAccess.Dto;
using System;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using UserWeb.Dto;

namespace UserWeb
{
    public partial class Consulta : Page
    {

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json, UseHttpGet = true)]
        public static JsonResponse ConsultarUsuarios()
        {
            try
            {
                UserService.WSUserServiceClient client = new UserService.WSUserServiceClient();
                var respuesta = client.GetUser(); 

                return new JsonResponse
                {
                    Estado = true,
                    Respuesta = respuesta,
                    Excepcion = null
                };
            }
            catch (Exception Ex)
            {
                return new JsonResponse
                {
                    Estado = false,
                    Respuesta = null,
                    Excepcion = new Excepcion
                    {
                        Tipo = Ex.GetType().ToString(),
                        Mensaje = Ex.Message.ToString()
                    }
                };
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static JsonResponse ActualizarUsuarios(UserDto user)
        {
            try
            {
                UserService.WSUserServiceClient client = new UserService.WSUserServiceClient();
                var respuesta = client.UpdateUser(user); 

                return new JsonResponse
                {
                    Estado = true,
                    Respuesta = respuesta,
                    Excepcion = null
                };
            }
            catch (Exception Ex)
            {
                return new JsonResponse
                {
                    Estado = false,
                    Respuesta = null,
                    Excepcion = new Excepcion
                    {
                        Tipo = Ex.GetType().ToString(),
                        Mensaje = Ex.Message.ToString()
                    }
                };
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static JsonResponse EliminarUsuarios(UserDto user)
        {
            try
            {
                UserService.WSUserServiceClient client = new UserService.WSUserServiceClient();
                var respuesta = client.DeleteUser(user);

                return new JsonResponse
                {
                    Estado = true,
                    Respuesta = respuesta,
                    Excepcion = null
                };
            }
            catch (Exception Ex)
            {
                return new JsonResponse
                {
                    Estado = false,
                    Respuesta = null,
                    Excepcion = new Excepcion
                    {
                        Tipo = Ex.GetType().ToString(),
                        Mensaje = Ex.Message.ToString()
                    }
                };
            }
        }
    }
}