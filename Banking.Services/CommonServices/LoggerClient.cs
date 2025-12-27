using Banking.Models;
using Banking.Backend;

namespace Banking.Services.CommonServices
{
    public class LoggerClient
    {
        private DatabaseSettings _databaseSettings;
        private OracleErrorHelper _errorHelper;

        public LoggerClient(DatabaseSettings databaseSettings)
        {
            _databaseSettings = databaseSettings;
            _errorHelper = new OracleErrorHelper(_databaseSettings);
        }

        //public async Task<string[,]> ErrorProcess(string ErrNumber, string ErrDesc, string ErrClientDesc, string ComponentName = "",
        //    string Branchode = "", string UserId = "", string MachineID = "")
        //{
        //    return await _errorHelper.ErrorProcess(ErrNumber, ErrDesc, ErrClientDesc, ComponentName, Branchode, UserId, MachineID);
        //}

        //public async Task LogError(string ApplName, string ProcName, long ErrNum, string ErrorMsg)
        //{
        //    await _errorHelper.LogError(ApplName, ProcName, ErrNum, ErrorMsg);
        //}
    }
}
