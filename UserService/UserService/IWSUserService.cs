using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Threading.Tasks;
using DataAccess.Dto;
using UserWeb.Dto;

namespace UserService
{
    // NOTA: puede usar el comando "Rename" del menú "Refactorizar" para cambiar el nombre de interfaz "IService1" en el código y en el archivo de configuración a la vez.
    [ServiceContract]
    public interface IWSUserService
    {

        [OperationContract]
        Task<List<User>> GetUser();

        [OperationContract]
        Task<ResponseService> InsertUser(UserDto user);

        [OperationContract]
        Task<ResponseService> UpdateUser(UserDto user);

        [OperationContract]
        Task<ResponseService> DeleteUser(UserDto user);

        // TODO: agregue aquí sus operaciones de servicio
    }

    [DataContract]
    public class User
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Nombre { get; set; }
        [DataMember]
        public DateTime FechaNacimiento { get; set; }
        [DataMember]
        public string Sexo { get; set; }

    }

}
