namespace Banking.Models.DTO
{
    public class AccountBalanceModel
    {
        public double dblFxTranBal { get; set; }
        public double dblClBal { get; set; }
        public double dblFxClBal { get; set; }
        public double dblTranBal { get; set; }
        public double dblTmpTrnBal { get; set; }
        public double dblFxTmpTrnBal { get; set; }
        public double dblClearBal { get; set; } = 0;
        public double dblFxClearBal { get; set; } = 0;
        public double dblUnclrBal { get; set; }
        public double dblNetBal { get; set; } = 0;
        public double dblTranBalp { get; set; }
        public double dblpendbalp { get; set; }
        public double dblpendamt { get; set; }
        public string GetBalance { get; set; }
        public string StrMstTable { get; set; }
        public string StrBalTable { get; set; }
    }
}
