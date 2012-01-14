using System;
using System.Linq;
using System.Linq.Expressions;
using System.Data.Entity;
using System.Data;

namespace SocialManager.Mvc4.Models.Core
{
  public class GenericRepository<TModel> : IRepository<TModel> where TModel: ModelBase
  {
    private readonly AppDbContext _dbContext = new AppDbContext();

    public IQueryable<TModel> All
    {
      get { return _dbContext.Set<TModel>(); }
    }

    public IQueryable<TModel> AllIncluding(params Expression<Func<TModel, object>>[] includeProperties)
    {
      IQueryable<TModel> query = _dbContext.Set<TModel>();
      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }
      return query;
    }

    public TModel Find(int id)
    {
      return _dbContext.Set<TModel>().Find(id);
    }

    public void InsertOrUpdate(TModel entity)
    {
      entity.ModifyDate = DateTime.Now;
      if (entity.Id == default(int))
      {
        // New entity
        _dbContext.Set<TModel>().Add(entity);
      }
      else
      {
        // Existing entity
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

  public interface IRepository<T>
  {
     IQueryable<T> All { get; }
     IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties);
     T Find(int id);
     void InsertOrUpdate(T contact);
     void Delete(int id);
     void Save();
  }
}