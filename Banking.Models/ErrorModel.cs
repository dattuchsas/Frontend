using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Banking.Models
{
    public class ErrorModel
    {
        public string? ErrorCode { get; set; }
        public string? ErrorMessage { get; set; }
        public string? HiddenStatus { get; set; }
    }
}
