using Banking.Interfaces;
using Banking.Models;
using Microsoft.Extensions.Options;

namespace Banking.Services
{
    public class AutoNumberService : IAutoNumberService
    {
        private readonly IDatabaseService _databaseFactory;

        public AutoNumberService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        //public async Task<string> GetAutoNumberAsync(string TabName, string AutoNumFldName, string WhereCondition = "", string InitialNum = "")
        //{
        //    return await _databaseFactory.GetAutoNumberAsync(TabName, AutoNumFldName, WhereCondition, InitialNum);
        //}

        //public async Task<string> GetAutoTextAsync(string TabName, string AutoNumFldName, string InitialAutoText, string WhereCondition = "")
        //{
        //    return await _databaseFactory.GetAutoTextAsync(TabName, AutoNumFldName, InitialAutoText, WhereCondition);
        //}

        //public async Task<string> GetMaxAccountNoAsync(string TabName, string AccFldName, string WhereCondition = "", string InitialAutoText = "")
        //{
        //    return await _databaseFactory.GetMaxAccountNoAsync(TabName, AccFldName, WhereCondition, InitialAutoText);
        //}
    }
}
