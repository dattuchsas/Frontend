using Microsoft.VisualBasic;

namespace Banking.Framework
{
    public static class Extensions
    {
        //public static string EncodePWD(object strPwd, object stUserid)
        //{
        //    object EncodePWDRet = default;
        //    object intcnt, strNpwd = default, strNuser = default;

        //    // stUserid = UCase(Left(stUserid, 3))
        //    var loopTo = Strings.Len(strPwd);
        //    for (intcnt = 1; intcnt <= loopTo; intcnt++)
        //        strNpwd = Operators.ConcatenateObject(strNpwd, ChartoNum(Strings.Mid(Conversions.ToString(strPwd), Conversions.ToInteger(intcnt), 1)));
        //    var loopTo1 = Strings.Len(Strings.UCase(Strings.Left(Conversions.ToString(stUserid), 3)));
        //    for (intcnt = 1; intcnt <= loopTo1; intcnt++)
        //        strNuser = Operators.ConcatenateObject(strNuser, ChartoNum(Strings.Mid(Strings.UCase(Strings.Left(Conversions.ToString(stUserid), 3)), Conversions.ToInteger(intcnt), 1)));
        //    EncodePWDRet = Operators.ConcatenateObject(Operators.ConcatenateObject(strNuser, Strings.StrReverse(Strings.Mid(Conversions.ToString(strNpwd), 1, (int)Math.Round(Strings.Len(strNpwd) / 2d)))), Strings.Mid(Conversions.ToString(strNpwd), (int)Math.Round(Strings.Len(strNpwd) / 2d + 1d)));
        //    return EncodePWDRet;
        //}

        public static string DecodePassword(string strPwd, string stUserid)
        {
            string strNpwd = string.Empty, strNuser, strSUser = string.Empty;

            // First 6 characters
            strNuser = strPwd.Substring(0, 6);

            // Remove first 6 characters
            strPwd = strPwd.Substring(6);

            // Reverse first half and append second half
            int halfLength = (int)Math.Round(strPwd.Length / 2.0);

            string firstHalf = strPwd.Substring(0, halfLength);
            char[] chars = firstHalf.ToCharArray();
            Array.Reverse(chars);

            strPwd = new string(chars) + strPwd.Substring(halfLength);

            stUserid = stUserid.Substring(0, 3);

            int loopTo = strPwd.Length;

            for (int cnt = 0; cnt < strPwd.Length; cnt += 2) // Step by 2
            {
                string twoChars = strPwd.Substring(cnt, Math.Min(2, strPwd.Length - cnt));
                strNpwd += CharToNumber(twoChars);
            }

            int loopTo1 = strNuser.Length;

            for (int cnt = 0; cnt < loopTo1; cnt += 2) // Step by 2
            {
                string twoChars = strNuser.Substring(cnt, Math.Min(2, strNuser.Length - cnt));
                strSUser += CharToNumber(twoChars);
            }

            return string.Concat(strSUser, strNpwd);
        }

        private static int CharToNumber(string str)
        {
            return Extensions.CharacterMap.TryGetValue(Convert.ToChar(str.Substring(0, 1)), out var result) ? result : '\0';
        }

        private static char NumberToChar(int intNumber)
        {
            return Extensions.NumberMap.TryGetValue(intNumber, out var result) ? result : '\0';
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
