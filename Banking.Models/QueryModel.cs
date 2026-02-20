using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Banking.Models
{
    public class QueryModel
    {
        public string QueryType { get; set; } = string.Empty;
        public string TableName { get; set; } = string.Empty;
        public string ColumnNames { get; set; } = string.Empty;
        public string Values { get; set; } = string.Empty;
        public string WhereClause { get; set; } = string.Empty;
    }
}
