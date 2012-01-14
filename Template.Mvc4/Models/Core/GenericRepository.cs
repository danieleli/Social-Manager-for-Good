using System;
using System.Linq;
using System.Linq.Expressions;
using System.Data.Entity;
using System.Data;

namespace SocialManager.Mvc4.Models.Core
{
  public class GenericRepository<TModel> : IRepository<TModel> where TModel : ModelBase
  {
    private readonly DbContext _dbContext;

    #region -- constructors --

    public GenericRepository() : this(new AppDbContext()) { }
    
    public GenericRepository(DbContext dbContext)
    {
      _dbContext = new AppDbContext();
    }
    
    public GenericRepository(string connectionString)
    {
      _dbContext = new DbContext(connectionString);
    }

    #endregion // -- constructors --

    public IQueryable<TModel> All
    {
      get { return _dbContext.Set<TModel>(); }
    }

    /// <param name="includeProperties">AllIncluding(model => model.ChildItemsProperty);</param>
    public IQueryable<TModel> AllIncluding(params Expression<Func<TModel, object>>[] includeProperties)
    {

      var query = _dbContext.Set<TModel>().AsQueryable();

      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }
      return query;

      // Alternate to foreach in Linq
      // return includeProperties.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));
    }

    public TModel Find(int id)
    {
      return _dbContext.Set<TModel>().Find(id);
    }

    public void InsertOrUpdate(TModel entity, string user)
    {
      entity.ModifyDate = DateTime.Now;
      entity.ModifyUser = user;
      
      if (entity.Id == default(int))                                            // New entity
      {
        _dbContext.Set<TModel>().Add(entity);
      }
      else                                                                      // Existing entity
      {
        _dbContext.Entry(entity).State = EntityState.Modified;
      }
    }

    public void Delete(int id)
    {
      var entity = _dbContext.Set<TModel>().Find(id);
      _dbContext.Set<TModel>().Remove(entity);
    }

    public void Save()
    {
      _dbContext.SaveChanges();
    }
  }

  public interface IRepository<TModel>
  {
    IQueryable<TModel> All { get; }
    IQueryable<TModel> AllIncluding(params Expression<Func<TModel, object>>[] includeProperties);
    TModel Find(int id);
    void InsertOrUpdate(TModel model, string user);
    void Delete(int id);
    void Save();
  }
}