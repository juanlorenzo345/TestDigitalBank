namespace UserWeb.Dto
{

    public class JsonResponse
    {
        public object Respuesta { get; set; }
        public object ValorAdicional { get; set; }
        public bool Estado { get; set; }
        public Excepcion Excepcion { get; set; }

    }
    public class Excepcion
    {

        public string Tipo { get; set; }
        public string Mensaje { get; set; }

    }
}