using System;
using System.Linq;
using System.Linq.Expressions;
using System.Data.Entity;
using System.Data;

namespace SocialManager.Mvc4.Models.Core
{
  public class GenericRepository<TModel> : IRepository<TModel> where TModel: ModelBase
  {
    private readonly SocialManagerMvc4Context _context = new SocialManagerMvc4Context();

    public IQueryable<TModel> All
    {
      get { return _context.Set<TModel>(); }
    }

    public IQueryable<TModel> AllIncluding(params Expression<Func<TModel, object>>[] includeProperties)
    {
      IQueryable<TModel> query = _context.Set<TModel>();
      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }
      return query;
    }

    public TModel Find(int id)
    {
      return _context.Set<TModel>().Find(id);
    }

    public void InsertOrUpdate(TModel entity)
    {
      entity.ModifyDate = DateTime.Now;
      if (entity.Id == default(int))
      {
        // New entity
        _context.Set<TModel>().Add(entity);
      }
      else
      {
        // Existing entity
        _context.Entry(entity).State = EntityState.Modified;
      }
    }

    public void Delete(int id)
    {
      var entity = _context.Set<TModel>().Find(id);
      _context.Set<TModel>().Remove(entity);
    }

    public void Save()
    {
      _context.SaveChanges();
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