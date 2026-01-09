namespace Banking.Models
{
    public class OracleQueryModel
    {
        public string TableName { get; set; } = null!;
        public string FieldNames { get; set; } = null!;
        public string Condition { get; set; } = null!;
        public string[] ArrValues { get; set; } = null!;
        public string BranchCode { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public string MachineID { get; set; } = null!;
        public string ApplicationDate { get; set; } = null!;
        public string DayBeginEndStatusCheckYN { get; set; } = null!;
        public OracleQueryType QueryType { get; set; }
    }

    public enum OracleQueryType
    {
        Insert,
        Update,
        Delete,
        Reject
    }
}
