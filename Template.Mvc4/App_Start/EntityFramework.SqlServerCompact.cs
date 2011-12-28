using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using SocialManager.Mvc4.App_Start;

[assembly: WebActivator.PreApplicationStartMethod(typeof(EntityFramework_SqlServerCompact), "Start")]

namespace SocialManager.Mvc4.App_Start {
    public static class EntityFramework_SqlServerCompact {
        public static void Start() {
            Database.DefaultConnectionFactory = new SqlCeConnectionFactory("System.Data.SqlServerCe.4.0");
        }
    }
}
