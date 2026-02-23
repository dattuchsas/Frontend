using Banking.Framework;
using Banking.Interfaces;
using Banking.Models;
using Microsoft.Extensions.Options;
using System.Data;
using System.Diagnostics;
using System.Threading.Tasks;

namespace Banking.Services
{
    public class SearchService : ISearchService
    {
        private string? strNameArr1;
        private string? strAllNames;
        private string? strCheck;
        private bool blncheck;
        DataTable resv = null!;

        private readonly IDatabaseService _databaseFactory;

        public SearchService(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseFactory = new DatabaseService(databaseSettings.Value);
        }

        public async Task<string> GetCustomerListByName(string strName)
        {
            string searchNameRet = string.Empty;
            string? strsql1, strsql2, strsql3;
            string strNameArr2 = "", strNameArr3 = "";

            string[] strNameArr = strName.ToString().Split(new[] { ' ' }, 3); // splitting the name into 3 parts
            strNameArr1 = strNameArr[0];

            if (!string.Equals(strNameArr[0], strName, StringComparison.OrdinalIgnoreCase))
            {
                strNameArr2 = strNameArr[1];

                if (!string.Equals(strName, strNameArr1 + " " + strNameArr2, StringComparison.OrdinalIgnoreCase))
                {
                    strNameArr3 = strNameArr[2];
                }
            }

            string strsql = "select * from GENTERRORISTLIST where (FIRSTNAME LIKE '%" + strName.ToUpper() + "%') OR (SECONDNAME LIKE '%" + strName.ToUpper() + "%') OR " +
                "(THIRDNAME LIKE '%" + strName.ToUpper() + "%') OR (FOURTHNAME LIKE '%" + strName.ToUpper() + "%')";

            resv = await _databaseFactory.ProcessQueryAsync(strsql);

            // alias name
            if (resv.Rows.Count == 0)
            {
                strCheck = Conversions.ToString(strName);
                await search(strCheck);
                if (blncheck == true)
                {
                    strAllNames = " " + "~" + " No Records Found;";
                    return strAllNames.ToUpper();
                }

                // it checks the names with first string in the name
                if (resv.Rows.Count == 0)
                {
                    strsql1 = "select * from GENTERRORISTLIST where (FIRSTNAME LIKE '%" + strNameArr1.ToUpper() + "%') OR (SECONDNAME LIKE '%" + strNameArr1.ToUpper() + "%') " +
                        "OR (THIRDNAME LIKE '%" + strNameArr1.ToUpper() + "%') OR (FOURTHNAME LIKE '%" + strNameArr1.ToUpper() + "%')";

                    resv = await _databaseFactory.ProcessQueryAsync(strsql1);

                    // it checks the alias names with first string in the name
                    if (resv.Rows.Count == 0)
                    {
                        strCheck = strNameArr1;
                        await search(strCheck);
                        if (blncheck == true)
                        {
                            strAllNames = " " + "~" + " No Records Found;";
                            return strAllNames.ToUpper();
                        }

                        // it checks the names with second string in the name
                        if ((resv.Rows.Count == 0) & !string.IsNullOrEmpty(strNameArr2))
                        {
                            strsql2 = "select * from GENTERRORISTLIST where " +
                                "(FIRSTNAME LIKE '%" + strNameArr2.ToUpper() + "%') OR " +
                                "(SECONDNAME LIKE '%" + strNameArr2.ToUpper() + "%') OR " +
                                "(THIRDNAME LIKE '%" + strNameArr2.ToUpper() + "%') OR " +
                                "(FOURTHNAME LIKE '%" + strNameArr2.ToUpper() + "%')";

                            resv = await _databaseFactory.ProcessQueryAsync(strsql2);

                            // it checks the alias names with second string in the name
                            if ((resv.Rows.Count == 0) & !string.IsNullOrEmpty(strNameArr2))
                            {
                                strCheck = strNameArr2;
                                await search(strCheck);
                                if (blncheck == true)
                                {
                                    strAllNames = " " + "~" + " No Records Found;";
                                    return strAllNames.ToUpper();
                                }

                                // it checks the name with third string in the name
                                if ((resv.Rows.Count == 0) & !string.IsNullOrEmpty(strNameArr3))
                                {
                                    strsql3 = "select * from GENTERRORISTLIST where (FIRSTNAME LIKE '%" + strNameArr3.ToUpper() + "%') OR (SECONDNAME LIKE '%" + strNameArr3.ToUpper() + "%') OR " +
                                        "(THIRDNAME LIKE '%" + strNameArr3.ToUpper() + "%') OR (FOURTHNAME LIKE '%" + strNameArr3.ToUpper() + "%')";

                                    resv = await _databaseFactory.ProcessQueryAsync(strsql3);

                                    // it checks the alias name with third string in the name
                                    if ((resv.Rows.Count == 0) & !string.IsNullOrEmpty(strNameArr3)) 
                                    {
                                        strCheck = strNameArr3;
                                        await search(strCheck);

                                        // it checks the alias names
                                        if (blncheck == true || resv.Rows.Count == 0)
                                        {
                                            strAllNames = " " + "~" + " No Records Found;";
                                            return strAllNames.ToUpper();
                                        }
                                    }
                                    else
                                    {
                                        // prints the names that are match to third string
                                        foreach (DataRow row in resv.Rows)
                                        {
                                            strAllNames +=
                                                row["DATEOFBIRTH"] + "~" +
                                                row["FIRSTNAME"] + " " +
                                                row["SECONDNAME"] + " " +
                                                row["THIRDNAME"] + " " +
                                                row["FOURTHNAME"] + ";";
                                        }
                                    } 
                                }
                            }
                            else
                            {
                                // prints the names that are match to second string
                                foreach (DataRow row in resv.Rows)
                                {
                                    strAllNames +=
                                        row["DATEOFBIRTH"] + "~" +
                                        row["FIRSTNAME"] + " " +
                                        row["SECONDNAME"] + " " +
                                        row["THIRDNAME"] + " " +
                                        row["FOURTHNAME"] + ";";
                                }
                            }
                        }
                    }
                    else
                    {
                        // prints the names that are match to first string
                        foreach (DataRow row in resv.Rows)
                        {
                            strAllNames +=
                                row["DATEOFBIRTH"] + "~" +
                                row["FIRSTNAME"] + " " +
                                row["SECONDNAME"] + " " +
                                row["THIRDNAME"] + " " +
                                row["FOURTHNAME"] + ";";
                        }
                    } // for first string
                }
            }
            else
            {
                // prints the names that are match to name
                foreach (DataRow row in resv.Rows)
                {
                    strAllNames +=
                        row["DATEOFBIRTH"] + "~" +
                        row["FIRSTNAME"] + " " +
                        row["SECONDNAME"] + " " +
                        row["THIRDNAME"] + " " +
                        row["FOURTHNAME"] + ";";
                }
            }

            return string.IsNullOrWhiteSpace(strAllNames) ? "~" + " No Records Found;" : strAllNames!.ToUpper();
        }

        // For Searching the names from the table having four name and ten alias name columns
        private async Task<string> search(string strCheck)
        {
            string strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME1 LIKE '%" + strCheck + "%')";
            resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
            blncheck = false;
            if (resv.Rows.Count == 0)
            {
                strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME2 LIKE '%" + strCheck + "%')";
                resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                blncheck = false;
                if (resv.Rows.Count == 0)
                {
                    strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME3 LIKE '%" + strCheck + "%')";
                    resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                    blncheck = false;
                    if (resv.Rows.Count == 0)
                    {
                        strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME4 LIKE '%" + strCheck + "%')";
                        resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                        blncheck = false;
                        if (resv.Rows.Count == 0)
                        {
                            strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME5 LIKE '%" + strCheck + "%')" ;
                            resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                            blncheck = false;
                            if (resv.Rows.Count == 0)
                            {
                                strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME6 LIKE '%" + strCheck + "%')";
                                resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                                blncheck = false;
                                if (resv.Rows.Count == 0)
                                {
                                    strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME7 LIKE '%" + strCheck + "%')";
                                    resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                                    blncheck = false;
                                    if (resv.Rows.Count == 0)
                                    {
                                        strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME8 LIKE '%" + strCheck + "%')";
                                        resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                                        blncheck = false;
                                        if (resv.Rows.Count == 0)
                                        {
                                            strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME9 LIKE '%" + strCheck + "%')";
                                            resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                                            blncheck = false;
                                            if (resv.Rows.Count == 0)
                                            {
                                                strsqlAlias = "select * from GENTERRORISTLIST where (ALIASNAME10 LIKE '%" + strNameArr1 + "%')";
                                                resv = await _databaseFactory.ProcessQueryAsync(strsqlAlias);
                                                blncheck = false;
                                                if (resv.Rows.Count == 0)
                                                {
                                                }
                                                else
                                                {
                                                    foreach (DataRow row in resv.Rows)
                                                    {
                                                        strAllNames +=
                                                            row["DATEOFBIRTH"] + "~" + 
                                                            row["FIRSTNAME"] + " " + 
                                                            row["SECONDNAME"] + " " + 
                                                            row["THIRDNAME"] + " " + 
                                                            row["FOURTHNAME"] + "~" + 
                                                            row["ALIASNAME10"] + ";";
                                                    }
                                                    blncheck = true;
                                                }
                                            }
                                            else
                                            {
                                                foreach (DataRow row in resv.Rows)
                                                {
                                                    strAllNames +=
                                                        row["DATEOFBIRTH"] + "~" +
                                                        row["FIRSTNAME"] + " " +
                                                        row["SECONDNAME"] + " " +
                                                        row["THIRDNAME"] + " " +
                                                        row["FOURTHNAME"] + "~" +
                                                        row["ALIASNAME9"] + ";";
                                                }
                                                blncheck = true;
                                            }
                                        }
                                        else
                                        {
                                            foreach (DataRow row in resv.Rows)
                                            {
                                                strAllNames +=
                                                    row["DATEOFBIRTH"] + "~" +
                                                    row["FIRSTNAME"] + " " +
                                                    row["SECONDNAME"] + " " +
                                                    row["THIRDNAME"] + " " +
                                                    row["FOURTHNAME"] + "~" +
                                                    row["ALIASNAME8"] + ";";
                                            }
                                            blncheck = true;
                                        }
                                    }
                                    else
                                    {
                                        foreach (DataRow row in resv.Rows)
                                        {
                                            strAllNames +=
                                                row["DATEOFBIRTH"] + "~" +
                                                row["FIRSTNAME"] + " " +
                                                row["SECONDNAME"] + " " +
                                                row["THIRDNAME"] + " " +
                                                row["FOURTHNAME"] + "~" +
                                                row["ALIASNAME7"] + ";";
                                        }
                                        blncheck = true;
                                    }
                                }
                                else
                                {
                                    foreach (DataRow row in resv.Rows)
                                    {
                                        strAllNames +=
                                            row["DATEOFBIRTH"] + "~" +
                                            row["FIRSTNAME"] + " " +
                                            row["SECONDNAME"] + " " +
                                            row["THIRDNAME"] + " " +
                                            row["FOURTHNAME"] + "~" +
                                            row["ALIASNAME6"] + ";";
                                    }
                                    blncheck = true;
                                }
                            }
                            else
                            {
                                foreach (DataRow row in resv.Rows)
                                {
                                    strAllNames +=
                                        row["DATEOFBIRTH"] + "~" +
                                        row["FIRSTNAME"] + " " +
                                        row["SECONDNAME"] + " " +
                                        row["THIRDNAME"] + " " +
                                        row["FOURTHNAME"] + "~" +
                                        row["ALIASNAME5"] + ";";
                                }
                                blncheck = true;
                            }
                        }
                        else
                        {
                            foreach (DataRow row in resv.Rows)
                            {
                                strAllNames +=
                                    row["DATEOFBIRTH"] + "~" +
                                    row["FIRSTNAME"] + " " +
                                    row["SECONDNAME"] + " " +
                                    row["THIRDNAME"] + " " +
                                    row["FOURTHNAME"] + "~" +
                                    row["ALIASNAME4"] + ";";
                            }
                            blncheck = true;
                        }
                    }
                    else
                    {
                        foreach (DataRow row in resv.Rows)
                        {
                            strAllNames +=
                                row["DATEOFBIRTH"] + "~" +
                                row["FIRSTNAME"] + " " +
                                row["SECONDNAME"] + " " +
                                row["THIRDNAME"] + " " +
                                row["FOURTHNAME"] + "~" +
                                row["ALIASNAME3"] + ";";
                        }
                        blncheck = true;
                    }
                }
                else
                {
                    foreach (DataRow row in resv.Rows)
                    {
                        strAllNames +=
                            row["DATEOFBIRTH"] + "~" +
                            row["FIRSTNAME"] + " " +
                            row["SECONDNAME"] + " " +
                            row["THIRDNAME"] + " " +
                            row["FOURTHNAME"] + "~" +
                            row["ALIASNAME2"] + ";";
                    }
                    blncheck = true;
                }
            }
            else
            {
                foreach (DataRow row in resv.Rows)
                {
                    strAllNames +=
                        row["DATEOFBIRTH"] + "~" +
                        row["FIRSTNAME"] + " " +
                        row["SECONDNAME"] + " " +
                        row["THIRDNAME"] + " " +
                        row["FOURTHNAME"] + "~" +
                        row["ALIASNAME1"] + ";";
                }
                blncheck = true;
            }

            return string.Empty;
        }
    }
}
