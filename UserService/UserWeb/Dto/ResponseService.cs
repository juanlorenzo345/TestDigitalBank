using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UserWeb.Dto
{
    public class ResponseService
    {
        public string Code { get; set; }
        public string Message { get; set; }

        public decimal Value { get; set; }
        public ResponseService()
        {
            Code = "200";

        }
    }
}