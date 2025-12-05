using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using podcasty.Enums;
using podcasty.Models; // Use your models namespace

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
    public DbSet<Notification> Notifications { get; set; }

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
         .WithMany(p => p.Episodes)  // ✅ Fixed: properly link to Podcast.Episodes collection
         .HasForeignKey(e => e.PodcastId)
         .OnDelete(DeleteBehavior.Restrict);

        // Notification relationships
        builder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany()
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Notification>()
            .HasOne(n => n.Podcast)
            .WithMany()
            .HasForeignKey(n => n.PodcastId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Notification>()
            .HasOne(n => n.Episode)
            .WithMany()
            .HasForeignKey(n => n.EpisodeId)
            .OnDelete(DeleteBehavior.Restrict);

        // Performance: Add indexes for frequently queried columns
        builder.Entity<Podcast>()
            .HasIndex(p => p.CreatorId)
            .HasDatabaseName("IX_Podcasts_CreatorId");
            
        builder.Entity<Podcast>()
            .HasIndex(p => p.CategoryId)
            .HasDatabaseName("IX_Podcasts_CategoryId");

        builder.Entity<Episode>()
            .HasIndex(e => e.PodcastId)
            .HasDatabaseName("IX_Episodes_PodcastId");

        builder.Entity<UserInteraction>()
            .HasIndex(ui => ui.PodcastId)
            .HasDatabaseName("IX_UserInteractions_PodcastId");
            
        builder.Entity<UserInteraction>()
            .HasIndex(ui => ui.UserId)
            .HasDatabaseName("IX_UserInteractions_UserId");

        builder.Entity<Notification>()
            .HasIndex(n => n.UserId)
            .HasDatabaseName("IX_Notifications_UserId");

        builder.Entity<PlayHistory>()
            .HasIndex(ph => ph.UserId)
            .HasDatabaseName("IX_PlayHistories_UserId");

    }
}
