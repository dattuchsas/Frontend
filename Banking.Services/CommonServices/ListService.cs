using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using System.Data;

namespace Banking.Services
{
    public class ListService : IListService
    {
        private readonly IDatabaseService _databaseFactory;

        public ListService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        public async Task<List<SelectListItem>> GetServiceList(string fieldNames = "", string whereCondition = "", string orderClause = "")
        {
            fieldNames = string.IsNullOrWhiteSpace(fieldNames) ? "CODE,NARRATION" : fieldNames;

            orderClause = string.IsNullOrWhiteSpace(orderClause) ? "CODE" : orderClause;

            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENSERVICETYPESPMT", fieldNames, whereCondition, orderClause);

            return ReturnKeyValuePair(dataTable, "Service");
        }

        public async Task<List<SelectListItem>> GetModuleList(string fieldNames = "", string whereCondition = "", string orderClause = "")
        {
            fieldNames = string.IsNullOrWhiteSpace(fieldNames) ? "CODE,NARRATION" : fieldNames;

            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENSERVICETYPESPMT", fieldNames, whereCondition, "CODE");

            return ReturnKeyValuePair(dataTable, "Module");
        }

        private List<SelectListItem> ReturnKeyValuePair(DataTable dataTable, string type = "")
        {
            List<string> list = new List<string>
            {
                "Branch", "Category", "Service", "Module"
            };
            var result = new List<SelectListItem>();
            result.Add(new SelectListItem { Value = "", Text = "Select" });
            foreach (DataRow row in dataTable.Rows)
            {
                var keyValuePair = new SelectListItem();
                if (list.Contains(type))
                    keyValuePair.Text = string.Concat(Conversions.ToString(row.ItemArray[0]), " - ", Conversions.ToString(row.ItemArray[1]).ToLower().Humanize(LetterCasing.Title));
                else
                    keyValuePair.Text = Conversions.ToString(row.ItemArray[1]).ToLower().Humanize(LetterCasing.Title);
                keyValuePair.Value = Conversions.ToString(row.ItemArray[0]);
                result.Add(keyValuePair);
            }
            return result;
        }
    }
}
