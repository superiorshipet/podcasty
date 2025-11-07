using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using podcasty.Enums;
using podcasty.Models; 

public class AppDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    { }

    public DbSet<Podcast> Podcasts { get; set; }
    public DbSet<Episode> Episodes { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<UserInteraction> UserInteractions { get; set; }
    public DbSet<PlayHistory> PlayHistories { get; set; }
    public DbSet<ModerationLog> ModerationLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ModerationLog>()
       .HasOne(m => m.Podcast)
       .WithMany()
       .HasForeignKey(m => m.PodcastId)
       .OnDelete(DeleteBehavior.Restrict); // <- This breaks cascade loop

        builder.Entity<ModerationLog>()
            .HasOne(m => m.Admin)
            .WithMany()
            .HasForeignKey(m => m.AdminId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ModerationLog>()
      .HasOne(m => m.Podcast)
      .WithMany()
      .HasForeignKey(m => m.PodcastId)
      .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<UserInteraction>()
            .HasOne(ui => ui.Podcast)
            .WithMany()
            .HasForeignKey(ui => ui.PodcastId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<UserInteraction>()
       .HasOne(ui => ui.User)
       .WithMany()
       .HasForeignKey(ui => ui.UserId)
       .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<PlayHistory>()
       .HasOne(ph => ph.Episode)
       .WithMany()
       .HasForeignKey(ph => ph.EpisodeId)
       .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<PlayHistory>()
            .HasOne(ph => ph.User)
            .WithMany()
            .HasForeignKey(ph => ph.UserId)
            .OnDelete(DeleteBehavior.Restrict);

          builder.Entity<Episode>()
         .HasOne(e => e.Podcast)
         .WithMany()
         .HasForeignKey(e => e.PodcastId)
         .OnDelete(DeleteBehavior.Restrict);

    }
}
