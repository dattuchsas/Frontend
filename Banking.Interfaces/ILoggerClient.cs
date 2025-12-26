namespace Banking.Interfaces
{
    public interface ILoggerClient
    {
        Task<string[,]> ErrorProcess(string ErrNumber, string ErrDesc, string ErrClientDesc, string ComponentName = "",
            string Branchode = "", string UserId = "", string MachineID = "");

        Task LogError(string ApplName, string ProcName, long ErrNum, string ErrorMsg);
    }
}
