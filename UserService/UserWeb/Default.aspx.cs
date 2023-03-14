using System;
using System.Web.UI;
using System.Web.Script.Services;
using System.Web.Services;
using UserWeb.Dto;
using UserWeb.UserService;
using DataAccess.Dto;

namespace UserWeb
{
    public partial class Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static JsonResponse InsertarUsuarios(UserDto user)
        {
            try
            {
                UserService.WSUserServiceClient client = new UserService.WSUserServiceClient();
                var respuesta = client.InsertUser(user);

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