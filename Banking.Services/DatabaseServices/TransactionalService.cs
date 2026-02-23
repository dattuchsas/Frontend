using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Humanizer;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;
using System.Data;
using System.Threading.Tasks;

namespace Banking.Services
{
    public class TransactionalService : ITransactionalService
    {
        private string dataLink = ""; // "@DBLINK"; // TODO: Move to settings if needed
        private readonly IDatabaseService _databaseFactory;

        public TransactionalService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        // For retrieving Branch Code based On UserID
        public async Task<List<SelectListItem>> GetBranchCodesByUserId(string userId)
        {
            string strUser = userId.Trim().ToUpper();

            string strQuery = "select distinct(a.Branchcode) BranchCode, a.Narration Narration from genbankbranchmst" + dataLink + " a, GenUserMst " + dataLink + 
                " b, GENBRANCHPMT c where ((upper(trim(b.userid))='" + strUser + "' and upper(trim(b.ABBUSERYN))='Y') or a.branchcode = " +
                "(select branchcode from genusermst " + dataLink + " where upper(trim(userid))='" + strUser + "')) AND a.Branchcode= c.Branchcode order by BranchCode";

            DataTable dataTable = await _databaseFactory.ProcessQueryAsync(strQuery);

            return ReturnKeyValuePair(dataTable, "Branch");
        }

        private List<SelectListItem> ReturnKeyValuePair(DataTable dataTable, string type = "")
        {
            List<string> list = new List<string>
            {
                "Branch", "Category"
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
