using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace Banking.Models
{
    public class CustomerModel : BaseModel
    {
        public List<SelectListItem>? BranchList { get; set; }

        public string? CustomerId { get; set; }

        public string? Salutation{ get; set; }
        public List<SelectListItem>? SalutationList { get; set; }
        public string? CustomerName { get; set; }

        public string? CustomerType { get; set; }
        public List<SelectListItem>? CustomerTypeList { get; set; }

        public bool MemberId { get; set; }
        public string? MembershipNumber { get; set; }
        public string? MembershipName { get; set; }

        public string? RiskCategory { get; set; }
        public List<SelectListItem>? RiskCategoryList { get; set; }

        public bool SMS_YesNo { get; set; }
        public bool MobileAccess_YesNo { get; set; }


        public string? Personal_Relation { get; set; }
        public List<SelectListItem>? Personal_RelationList { get; set; }
        public string? Personal_RelationName { get; set; }

        public string? Personal_MaritalStatus { get; set; }
        public List<SelectListItem>? Personal_MaritalStatusList { get; set; }

        public string? Personal_Gender { get; set; }
        public List<SelectListItem>? Personal_GenderList { get; set; }

        public string? Personal_DOB { get; set; }
        public int? Age { get; set; }
        public bool Personal_Minor { get; set; }
        
        public string? Personal_Religion { get; set; }
        public List<SelectListItem>? Personal_ReligionList { get; set; }
        
        public string? Personal_Mobile { get; set; }
        public string? Personal_PANNo { get; set; }
        public bool Personal_PANABYN { get; set; }
        public bool Personal_PANAAYN { get; set; }
        public string? Personal_Email { get; set; }
        public string? Personal_Aadhaar { get; set; }
        public string? Personal_CKYCID { get; set; }
        public string? Personal_CKYCEnrollDate { get; set; }
        public string? Personal_GSTIN { get; set; }


        public string? Mailing_FlatNo { get; set; }
        public string? Mailing_Building { get; set; }
        public string? Mailing_Area { get; set; }
        public string? Mailing_City { get; set; }
        public string? Mailing_Pincode { get; set; }
        public string? Mailing_Phone { get; set; }

        public bool IsMailingSameAsPermanent { get; set; }
        public bool IsGlobalCustomer { get; set; }

        public string? Permanent_FlatNo { get; set; }
        public string? Permanent_Building { get; set; }
        public string? Permanent_Area { get; set; }
        public string? Permanent_City { get; set; }
        public string? Permanent_Pincode { get; set; }
        public string? Permanent_Phone { get; set; }

        public string? Office_Company { get; set; }
        public string? Office_Building { get; set; }
        public string? Office_Area { get; set; }
        public string? Office_City { get; set; }
        public string? Office_Pincode { get; set; }
        public string? Office_Phone { get; set; }

        public string? KYCType { get; set; }
        public List<SelectListItem>? KYCTypeList { get; set; }
        public string? KYCNumber { get; set; }
        public IFormFile? KYCFile { get; set; }
        public List<KYC>? KYCDetails { get; set; }

        public string? Relation_Name { get; set; }
        public string? Relation_Type { get; set; }
        public List<SelectListItem>? Relation_List { get; set; }

        public string? Relation_DOB { get; set; }
        public List<Relation>? RelationDetails { get; set; }

        public string? Occupation_Id { get; set; }
        public List<SelectListItem>? Occupation_List { get; set; }
        public string? Occupation_Income { get; set; }
        public List<SelectListItem>? Occupation_IncomeList { get; set; }
        public string? Occupation_Educataion { get; set; }
        public List<SelectListItem>? Occupation_EducationList { get; set; }
    }

    public class KYC
    {
        public string? KYCId { get; set; }
        public string? KYCDescription { get; set; }
        public string? KYCNo { get; set; }
        public IFormFile? File { get;set; }
    }

    public class Relation
    {
        public string? Name { get; set; }
        public string? DOB { get; set; }
        public string? RelationType { get; set; }
    }
}
