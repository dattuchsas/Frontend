using Oracle.ManagedDataAccess.Client;

namespace Banking.Backend
{
    public static class OracleErrorMapper
    {
        private static readonly Dictionary<int, string> ErrorMap = new()
        {
            // Connection / Network
            [12154] = "Please enter correct connect string in TNS names or TNS: could not resolve service name.",
            [12514] = "The listener does not currently know of the service requested.",
            [12541] = "No listener. Check the Oracle listener service.",
            [12545] = "Could not resolve the host or service.",
            [12170] = "TNS: Connect timeout",
            [12560] = "TNS: Protocol adapter error",
            [12537] = "Connection closed",
            [17002] = "Network adapter error",
            [3113] = "End-of-file on communication channel — the DB may have crashed or disconnected.",

            // Authentication
            [1017] = "Invalid username or password.",
            [1045] = "User lacks CREATE SESSION privilege.",
            [28000] = "The account is locked.",
            [28001] = "Password has expired.",

            // SQL Parsing
            [904] = "Invalid identifier — check column or table names.",
            [933] = "SQL command not properly ended.",
            [936] = "Missing expression.",
            [942] = "Table or view does not exist.",

            // Data constraints
            [1] = "Unique constraint violated.",
            [1400] = "Cannot insert NULL into required field.",
            [2291] = "Foreign key violation — parent key not found.",
            [2292] = "Foreign key violation — child record exists.",
            [1722] = "Invalid number.",
            [1830] = "Invalid date format.",

            // PL/SQL
            [6502] = "PL/SQL: numeric or value error.",
            [6550] = "PL/SQL compilation error.",

            // Resource / Performance
            [1555] = "Snapshot too old — try increasing undo retention.",
            [1653] = "Unable to extend table — out of space in tablespace.",
            [54] = "Resource busy — try using NOWAIT or retry.",
            [4031] = "Memory allocation error in shared pool."
        };

        public static string GetFriendlyMessage(OracleException ex)
        {
            string messageWithCode = string.Empty;

            if (ErrorMap.TryGetValue(ex.Number, out var message) && message is not null)
                // messageWithCode = $"{message} (ORA-{ex.Number})"
                return message;

            if (ex.Number >= 20000 && ex.Number <= 20999)
                // messageWithCode = $"Application error: {ex.Message} (ORA-{ex.Number})"
                return $"Application Error Details: {ex.Message}";

            // return messageWithCode = $"Oracle error ORA-{ex.Number}: {ex.Message}";
            return $"Error Details: {ex.Message}";
        }
    }
}
