using Microsoft.AspNetCore.Http;
using System.Data;
using System.Globalization;
using System.Xml;

namespace Banking.Framework
{
    public static class DictionaryExtensions
    {
        public static IDictionary<TKey, TValue> AddAndReturn<TKey, TValue>(
            this IDictionary<TKey, TValue> dict,
            TKey key,
            TValue value)
        {
            dict.Add(key, value);
            return dict;
        }
    }

    public static class Conversions
    {
        public static string ToString(this object? str)
        {
            return Convert.ToString(str) ?? string.Empty;
        }

        public static bool ToBoolean(this object? str)
        {
            return Convert.ToBoolean(str);
        }

        public static DateTime ToDateTime(this object? str)
        {
            return DateTime.ParseExact(ToString(str), "dd-MMM-yyyy", CultureInfo.InvariantCulture);
        }

        public static int ToInt(this object? str)
        {
            return Convert.ToInt32(str);
        }
    }

    public static class BankingExtensions
    {
        public static readonly Dictionary<string, string> GetModuleRoute = new()
        {
            { "SB", "SavingsAccount" },
            { "CA", "CurrentAccount" },
            { "DEP", "Deposits" },
            { "LOAN", "Loans" },
            { "CC", "CreditCard" },
            { "BILLS", "Bills" },
            { "REM", "Remittance" },
            { "CASH", "Cash" },
            { "CLG", "Clearing" },
            { "LOCKER", "Lockers" },
            { "GL", "GeneralLedger" },
            { "CUSTOMER", "Customer" },
            { "ADMIN", "Administration" },
            { "SHARES", "SharesManagement" },
            { "HO", "SystemControl" },
            { "INV", "Investments" },
            { "ATM", "ATM" },
            { "PAYROLL", "Payroll" }
        };

        public static void ReleaseMemory(DataTable source)
        {
            if (source != null)
            {
                source.Dispose();
                source = null!;
            }
        }

        public static string GetSessionId(this ISession session)
        {
            return session.Id.Replace("-", "").Substring(0, 30);
        }

        public static string EncodePassword(string strPwd, string stUserid)
        {
            string EncPassword = string.Empty;
            string strNpwd = string.Empty, strNuser = string.Empty;

            for (int intcnt = 0; intcnt < strPwd.Length; intcnt++)
            {
                strNpwd += CharToNumber(strPwd.Substring(intcnt, 1));
            }

            var loopTo = stUserid.Substring(0, 3).ToUpper().Length;

            string userPart = stUserid.Substring(0, Math.Min(3, stUserid.Length)).ToUpper();

            for (int intcnt = 0; intcnt < loopTo; intcnt++)
            {
                strNuser += CharToNumber(userPart.Substring(intcnt, 1));
            }

            EncPassword = strNuser + new string(strNpwd.Substring(0, strNpwd.Length / 2).Reverse().ToArray()) + strNpwd.Substring(strNpwd.Length / 2);

            return EncPassword;
        }

        public static string DecodePassword(string strPwd, ref string stUserid)
        {
            string strNpwd = string.Empty, strNuser = string.Empty, strSUser = string.Empty;

            strNuser = strPwd.Substring(0, 6);

            strPwd = strPwd.Substring(6);

            int halfLen = strPwd.Length / 2;
            char[] reversed = strPwd.Substring(0, halfLen).ToCharArray();
            Array.Reverse(reversed);

            strPwd = new string(reversed) + strPwd.Substring(halfLen);

            stUserid = stUserid.Substring(0, 3);

            for (int i = 0; i < strPwd.Length; i += 2)
            {
                strNpwd += NumberToChar(Convert.ToInt32(strPwd.Substring(i, 2)));
            }

            for (int i = 0; i < strNuser.Length; i += 2)
            {
                strSUser += NumberToChar(Convert.ToInt32(strNuser.Substring(i, 2)));
            }

            return strSUser + strNpwd;
        }

        public static DateTime ToDate(this string input)
        {
            DateTime date = DateTime.Parse(input);
            return DateTime.ParseExact(date.ToString("dd-MM-yyyy"), "dd-MM-yyyy", null);
        }

        public static int DateDifference<T>(string type, T fromDate, T toDate)
        {
            if (type.ToUpper().Equals("D"))
                return (Convert.ToDateTime(toDate) - Convert.ToDateTime(fromDate)).Days;
            else if (type.ToUpper().Equals("Y"))
                return Convert.ToDateTime(toDate).Year - Convert.ToDateTime(fromDate).Year;
            else //if (type.ToUpper().Equals('M'))
                return Convert.ToDateTime(toDate).Month - Convert.ToDateTime(fromDate).Month;
        }

        private static int CharToNumber(string str)
        {
            return CharacterMap.TryGetValue(Convert.ToChar(str.Substring(0, 1)), out var result) ? result : '\0';
        }

        private static char NumberToChar(int intNumber)
        {
            return NumberMap.TryGetValue(intNumber, out var result) ? result : '\0';
        }

        private static readonly Dictionary<int, char> NumberMap = new()
        {
            { 56, 'A' },
            { 18, 'B' },
            { 46, 'C' },
            { 42, 'D' },
            { 55, 'E' },
            { 17, 'F' },
            { 47, 'G' },
            { 57, 'H' },
            { 11, 'I' },
            { 31, 'J' },
            { 65, 'K' },
            { 34, 'L' },
            { 50, 'M' },
            { 23, 'N' },
            { 64, 'O' },
            { 45, 'P' },
            { 27, 'Q' },
            { 69, 'R' },
            { 52, 'S' },
            { 54, 'T' },
            { 19, 'U' },
            { 36, 'V' },
            { 35, 'W' },
            { 53, 'X' },
            { 13, 'Y' },
            { 14, 'Z' },

            { 28, 'a' },
            { 38, 'b' },
            { 39, 'c' },
            { 24, 'd' },
            { 58, 'e' },
            { 33, 'f' },
            { 60, 'g' },
            { 44, 'h' },
            { 16, 'i' },
            { 48, 'j' },
            { 15, 'k' },
            { 59, 'l' },
            { 30, 'm' },
            { 21, 'n' },
            { 32, 'o' },
            { 70, 'p' },
            { 72, 'q' },
            { 68, 'r' },
            { 29, 's' },
            { 61, 't' },
            { 37, 'u' },
            { 51, 'v' },
            { 25, 'w' },
            { 43, 'x' },
            { 67, 'y' },
            { 26, 'z' },

            { 62, '1' },
            { 20, '2' },
            { 63, '3' },
            { 40, '4' },
            { 66, '5' },
            { 22, '6' },
            { 12, '7' },
            { 49, '8' },
            { 71, '9' },
            { 41, '0' },

            { 73, '#' },
            { 75, '@' },
            { 77, '$' },
        };

        private static readonly Dictionary<char, int> CharacterMap = new()
        {
            { 'A', 56 },
            { 'B', 18 },
            { 'C', 46 },
            { 'D', 42 },
            { 'E', 55 },
            { 'F', 17 },
            { 'G', 47 },
            { 'H', 57 },
            { 'I', 11 },
            { 'J', 31 },
            { 'K', 65 },
            { 'L', 34 },
            { 'M', 50 },
            { 'N', 23 },
            { 'O', 64 },
            { 'P', 45 },
            { 'Q', 27 },
            { 'R', 69 },
            { 'S', 52 },
            { 'T', 54 },
            { 'U', 19 },
            { 'V', 36 },
            { 'W', 35 },
            { 'X', 53 },
            { 'Y', 13 },
            { 'Z', 14 },

            { 'a', 28 },
            { 'b', 38 },
            { 'c', 39 },
            { 'd', 24 },
            { 'e', 58 },
            { 'f', 33 },
            { 'g', 60 },
            { 'h', 44 },
            { 'i', 16 },
            { 'j', 48 },
            { 'k', 15 },
            { 'l', 59 },
            { 'm', 30 },
            { 'n', 21 },
            { 'o', 32 },
            { 'p', 70 },
            { 'q', 72 },
            { 'r', 68 },
            { 's', 29 },
            { 't', 61 },
            { 'u', 37 },
            { 'v', 51 },
            { 'w', 25 },
            { 'x', 43 },
            { 'y', 67 },
            { 'z', 26 },

            { '1', 62 },
            { '2', 20 },
            { '3', 63 },
            { '4', 40 },
            { '5', 66 },
            { '6', 22 },
            { '7', 12 },
            { '8', 49 },
            { '9', 71 },
            { '0', 41 },

            { '#', 73 },
            { '@', 75 },
            { '$', 77 }
        };
    }
}
