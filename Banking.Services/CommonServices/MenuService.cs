using System.Data;
using Banking.Models;
using Banking.Interfaces;
using Microsoft.Extensions.Options;
using Banking.Framework;
using System.Threading.Tasks;

namespace Banking.Services
{
    public class MenuService : IMenuService
    {
        private readonly IDatabaseService _databaseFactory;

        public MenuService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        public async Task GetUserModules(string userId, string branchCode)
        {
            try 
            {
                string sqlQuery = "SELECT DISTINCT(c.moduleid), INITCAP(c.narration), moduleorder FROM genmodulemst c, genmoduletypesmst d WHERE c.moduleid IN " +
                    "(SELECT moduleid FROM gengroupformsmst WHERE groupcode = (SELECT groupid FROM genusermst WHERE UPPER(userid)='" + userId + "' ) " +
                    "UNION SELECT DISTINCT moduleid FROM genuseridformsmst WHERE addoreliminate='A' AND UPPER(userid)='" + userId + "') AND d.implementedyn='Y' AND " +
                    "d.moduleid=c.moduleid AND d.branchcode='" + branchCode + "' AND c.parentmoduleid IS NULL ORDER BY moduleorder";

                DataTable dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();

                foreach (DataRow row in dataTable.Rows)
                {
                    string moduleId = Conversions.ToString(row[0]);
                    string narration = Conversions.ToString(row[1]);
                    keyValuePairs[moduleId] = narration;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions
                throw;
            }
        
        }

        public async Task<List<Menu>> GetUserMenu(string userId, string moduleId, string groupCode)
        {
            try 
            {
                string sqlQuery = $"SELECT DISTINCT a.menutitle,a.narration,a.formsid,a.menuorder,a.FORMSORDER,a.controllername,a.actionname FROM " +
                    "genmoduleidformsmst a WHERE (a.formsid IN (SELECT formsid FROM gengroupformsmst WHERE groupcode='" + groupCode + "' AND a.moduleid='" + moduleId + 
                    "' AND status='R') OR a.formsid IN (SELECT formsid FROM genuseridformsmst WHERE  userid='" + userId + "' AND  a.moduleid='" + moduleId + 
                    "' AND status='R' AND addoreliminate='A')) AND a.formsid NOT IN( SELECT formsid FROM genuseridformsmst WHERE moduleid='" + moduleId + 
                    "' AND status='R' AND addoreliminate='E' AND userid='" + userId + "') ORDER BY a.menuorder,a.FORMSORDER";

                DataTable dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

                Dictionary<string, List<string>> userMenu = [];

                List<MenuModel> menuModels = new List<MenuModel>();
                foreach (DataRow row in dataTable.Rows)
                {
                    MenuModel menuModel = new MenuModel();
                    menuModel.Menu = Conversions.ToString(row.ItemArray[0]);
                    menuModel.SubMenu = Conversions.ToString(row.ItemArray[1]);
                    menuModel.FormId = Conversions.ToInt(row.ItemArray[2]);
                    menuModel.MenuOrder = Conversions.ToInt(row.ItemArray[3]);
                    menuModel.FormOrder = Conversions.ToInt(row.ItemArray[4]);
                    menuModel.ControllerName = Conversions.ToString(row.ItemArray[5]);
                    menuModel.ActionName = Conversions.ToString(row.ItemArray[6]);
                    menuModels.Add(menuModel);
                }

                List<Menu> menus = [];
                List<string?> list = menuModels.Select(x => x.Menu).Distinct().ToList();

                foreach (var item in list)
                {
                    Menu menu = new()
                    {
                        Text = item,
                        SubMenu = []
                    };
                    foreach (MenuModel innerItem in menuModels.Where(x => x.Menu!.Equals(item)).ToList())
                    {
                        Menu subMenu = new()
                        {
                            Text = innerItem.SubMenu,
                            ControllerName = innerItem.ControllerName,
                            ActionName = innerItem.ActionName,
                        };
                        menu.SubMenu.Add(subMenu);
                    }
                    menus.Add(menu);
                }

                return menus;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
