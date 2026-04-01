using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Banking.Models
{
    public  class SBCAAccountOpeningModel : BaseModel 
    {

        public List<SelectListItem>? BranchList { get; set; }
        public string? AccountNumber { get; set; }

        public string? CustomerId { get; set; }
        public string? CustomerName { get; set; }
        public string? Module { get; set; }
        public List<SelectListItem>? ModuleList { get; set; }
        public string? AccountType { get; set; }
        public List<SelectListItem>? AccountTypeList { get; set; }
        public Int32? Tranno { get; set; }
        public string? Salutation { get; set; }
        public List<SelectListItem>? SalutationList { get; set; }
        public string? CategoryType { get; set; }
        public List<SelectListItem>? CategoryTypeList { get; set; }
        public DateTime? OpeningDate { get; set; }

        public bool CheckMinor { get; set; }

        public bool CheckBankStaff { get; set; }
        public bool CheckChequeBook { get; set; }

        public string? OperatingInstrs { get; set; }
        public List<SelectListItem>? OperatingInstrsList { get; set; }

        public string? OperatedBy { get; set; }

        public string? Status { get; set; }

        public string? Remarks { get; set; }

        public string? TDSOptions { get; set; }
     

        public string? Panno { get; set; }

        public string? Regno { get; set; }
        public string? Regplace { get; set; }
        public DateTime? dateofincorporation { get; set; }

        // Introducer Details
        public string? IntroCustId { get; set; }
        public string? IntroCustName { get; set; }

        public bool CheckIntroMinor { get; set; }

        public string? Intro_Relation { get; set; }
        public List<SelectListItem>? Intro_RelationList { get; set; }
        public string? Intro_RelationName { get; set; }
        public string? Intro_MinorDOB { get; set; }

        // Joint Account Details
        public string? JntCustId { get; set; }
        public string? JntCustName { get; set; }

        public bool CheckJntMinor { get; set; }

        public string? Jnt_Relation { get; set; }
        public List<SelectListItem>? Jnt_RelationList { get; set; }
        public string? Jnt_RelationName { get; set; }
        public string? Jnt_MinorDOB { get; set; }

        // Guardian Details
        public string? GuardCustId { get; set; }
        public string? GuardCustName { get; set; }

        public bool CheckGuardMinor { get; set; }

        public string? Guard_Relation { get; set; }
        public List<SelectListItem>? Guard_RelationList { get; set; }
        public string? Guard_RelationName { get; set; }
        public string? Guard_MinorDOB { get; set; }

        // Nominee Details
        public string? NomineeCustId { get; set; }
        public string? NomineeCustName { get; set; }

        public bool CheckNomineeMinor { get; set; }

        public string? Nominee_Relation { get; set; }
        public List<SelectListItem>? Nominee_RelationList { get; set; }
        public string? Nominee_RelationName { get; set; }
        public string? Nominee_MinorDOB { get; set; }

        public List<Introducer>? Introducerdtls { get; set; }
        public List<JntAcc>? JntAccdtls { get; set; }

        public List<Guardian>? Guardiandtls { get; set; }
        public List<Nominee>? Nomineedtls { get; set; }
       
    }

    public class Introducer
    {
        public string? IntCustId { get; set; }
        public string? IntCustName { get; set; }
        public bool CheckIntMinor { get; set; }
        public string? Int_MinorDOB { get; set; }
        public string? Int_Relation { get; set; }
    }
    public class JntAcc
    {
        public string? JntCustId { get; set; }
        public string? JntCustName { get; set; }
        public bool CheckJntMinor { get; set; }
        public string? Jnt_MinorDOB { get; set; }
        public string? Jnt_Relation { get; set; }
        public string? Jnt_RelationName { get; set; }
    }


    public class Guardian
    {
        public string? GuardCustId { get; set; }
        public string? GuardCustName { get; set; }
        public bool CheckGuardMinor { get; set; }
        public string? Guard_MinorDOB { get; set; }
        
        public string? Guard_Relation { get; set; }

        public string? Guard_RelationName { get; set; }
    }

    public class Nominee
    {
        public string? NomineeCustId { get; set; }
        public string? NomineeCustName { get; set; }
        public bool CheckNomineeMinor { get; set; }
        public string? Nominee_MinorDOB { get; set; }
        public string? Nominee_Relation { get; set; }
       
    }

}
