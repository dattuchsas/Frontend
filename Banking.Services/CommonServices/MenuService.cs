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
                string sqlQuery = $"SELECT DISTINCT a.menutitle,a.narration,a.forms,a.gendir,a.mainmenu,a.menuorder,a.FORMSORDER FROM genmoduleidformsmst a WHERE " +
                    "(a.formsid IN (SELECT formsid FROM gengroupformsmst WHERE groupcode='" + groupCode + "' AND a.moduleid='" + moduleId + "' AND status='R') OR " +
                    "a.formsid IN (SELECT formsid FROM genuseridformsmst WHERE  userid='" + userId + "' AND  a.moduleid='" + moduleId + "' AND status='R' AND " +
                    "addoreliminate='A')) AND a.formsid NOT IN( SELECT formsid FROM genuseridformsmst WHERE moduleid='" + moduleId + "' AND status='R' AND " +
                    "addoreliminate='E' AND userid='" + userId + "') ORDER BY a.menuorder,a.FORMSORDER";

                DataTable dataTable = await _databaseFactory.ProcessQueryAsync(sqlQuery);

                Dictionary<string, List<string>> userMenu = [];

                foreach (DataRow row in dataTable.Rows)
                {
                    string category = Conversions.ToString(row[0]);
                    string subcategory = Conversions.ToString(row[1]);

                    if (!userMenu.ContainsKey(category))
                    {
                        userMenu[category] = new List<string>();
                    }

                    userMenu[category].Add(subcategory);
                }

                List<Menu> menus = [];
                foreach (var item in userMenu.Keys)
                {
                    Menu menu = new()
                    {
                        Text = item,
                        SubMenu = []
                    };
                    foreach (var innerItem in userMenu[item].ToList())
                    {
                        Menu subMenu = new()
                        {
                            Text = innerItem
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
