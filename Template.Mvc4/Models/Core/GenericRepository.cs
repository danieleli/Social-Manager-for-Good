using System;
using System.Linq;
using System.Linq.Expressions;
using System.Data.Entity;
using System.Data;

namespace SocialManager.Mvc4.Models.Core
{
  public class GenericRepository<T> : IRepository<T> where T: ModelBase
  {
    private readonly SocialManagerMvc4Context _context = new SocialManagerMvc4Context();

    public virtual IQueryable<T> All
    {
      get { return _context.Set<T>(); }
    }

    public virtual IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties)
    {
      IQueryable<T> query = _context.Set<T>();
      foreach (var includeProperty in includeProperties)
      {
        query = query.Include(includeProperty);
      }
      return query;
    }

    public virtual T Find(int id)
    {
      return _context.Set<T>().Find(id);
    }

    public virtual void InsertOrUpdate(T entity)
    {
      entity.ModifyDate = DateTime.Now;
      if (entity.Id == default(int))
      {
        // New entity
        _context.Set<T>().Add(entity);
      }
      else
      {
        // Existing entity
        _context.Entry(entity).State = EntityState.Modified;
      }
    }

    public virtual void Delete(int id)
    {
      var entity = _context.Set<T>().Find(id);
      _context.Set<T>().Remove(entity);
    }

    public virtual void Save()
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