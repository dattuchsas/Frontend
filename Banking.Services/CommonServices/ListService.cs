using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using System.Data;
using System.Diagnostics.Eventing.Reader;

namespace Banking.Services
{
    public class ListService : IListService
    {
        private readonly IDatabaseService _databaseFactory;

        public ListService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        // SERVICEID
        public async Task<List<SelectListItem>> GetServiceList(string searchString = "")
        {
            string whereCond = string.Empty;
            string[] search = searchString.Split('|');

            if (search.Length > 1 && search[1] == TransactionModes.Debit.ToString())
                whereCond = "Code in ('1','3','4','7','8','9')";
            else if (search.Length > 1 && search[1] == TransactionModes.Credit.ToString())
                whereCond = "Code in('1','2','3','4','7')";
            else if (search.Length > 1 && search[1] == TransactionModes.Clearing.ToString())
                whereCond = "Code in('1','8')";
            else
                whereCond = "";

            DataTable dataTable = await _databaseFactory.SingleRecordSet("GENSERVICETYPESPMT", "CODE,NARRATION", whereCond, "CODE");

            return ReturnKeyValuePair(dataTable, "Service");
        }

        public async Task<string> GetModuleId(string searchString = "")
        {
            string whereCond = string.Empty;
            DataTable dataTable = null!;

            if (string.IsNullOrWhiteSpace(searchString))
                return searchString;

            if (searchString.Substring(0, 14).Equals("TellerModuleId") &&
                searchString.Substring(0, 17).Equals("MatTellerModuleId") &&
                searchString.Substring(0, 18).Equals("AutoTellerModuleId"))
            {
                string[] str = searchString.Split("|", StringSplitOptions.RemoveEmptyEntries);
                if (str.Length > 1 && str[2] == "1")
                {
                    whereCond = " gmt.MODULEID in ('SB','CA','LOAN','MISC','CC','INV','PL','REM')";
                    dataTable = await _databaseFactory.GetModuleId(str[1], "Y", "", "", whereCond);
                }
                else if (str.Length > 1 && str[2] == "1")
                {
                    whereCond = " MODULEID in ('SB','CA','DEP') ";
                    dataTable = await _databaseFactory.GetModuleId(str[1], "N", "", "", whereCond);
                }
            }
            else if (searchString.Substring(0, 12).Equals("TellerModule"))
            {
                string[] str = searchString.Split("|", StringSplitOptions.RemoveEmptyEntries);
                dataTable = await _databaseFactory.GetModuleId(str[1], "");
            }

            return "";
        }

        public async Task<List<SelectListItem>> GetModuleList(string whereCondition = "")
        {
            using DataTable dataTable = await _databaseFactory.SingleRecordSet("GENSERVICETYPESPMT", "CODE,NARRATION", whereCondition, "CODE");

            return ReturnKeyValuePair(dataTable, "Module");
        }

        // Tellerbranch, Tellerbranch, TellerVobranch, MatTellerVobranch, AutoTellerVobranch
        public void GetTellerBranchList()
        {
            //    obj = server.CreateObject("GeneralTranQueries.TransactionQueries")
            //    rs = obj.BranchCodes(cstr(session("userid")))
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
