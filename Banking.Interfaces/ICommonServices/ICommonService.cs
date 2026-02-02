using Microsoft.AspNetCore.Mvc.Rendering;
using System.Data;

namespace Banking.Interfaces
{
    public interface ICommonService
    {
        Task<List<SelectListItem>> GetSalutationList();
        Task<List<SelectListItem>> GetRelationList(string whereCondition = "");
        Task<List<SelectListItem>> GetReligionList();
        Task<List<SelectListItem>> GetOccupationList();
        Task<List<SelectListItem>> GetEducationList();
        Task<List<SelectListItem>> GetIncomeList(string type = "");
        Task<List<SelectListItem>> GetKYCList();
        Task<List<SelectListItem>> GetBranchList();
        Task<List<SelectListItem>> GetQualificationList(string type = "");
        Task<List<SelectListItem>> GetCardLength();
        Task<List<SelectListItem>> GetCategoryList(string type = "");

        List<SelectListItem> GetGenderList();
        List<SelectListItem> GetMaritalStatusList();
        List<SelectListItem> GetRiskCategoryList();
    }
}
