namespace Banking.Models
{
    public class BaseModel : ErrorModel
    {
        public string? UserId { get; set; }
        public string? Branch { get; set; }
        public string? ApplicationDate { get; set; }
        public List<Menu>? MenuDetails { get; set; }
    }

    public class Menu
    {
        public string? Text { get; set; }
        public string? ControllerName { get; set; }
        public string? ActionName { get; set; }
        public List<Menu>? SubMenu { get; set; }
    }
}
