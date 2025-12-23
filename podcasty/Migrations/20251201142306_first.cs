using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace podcasty.Migrations
{
    /// <inheritdoc />
    public partial class first : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
  IF COL_LENGTH('Podcasts', 'IsApproved') IS NULL
  BEGIN
      ALTER TABLE [Podcasts] ADD [IsApproved] bit NOT NULL DEFAULT(0);
  END
");


            migrationBuilder.AddColumn<int>(
                name: "PlayCount",
                table: "Podcasts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            

            migrationBuilder.AddColumn<bool>(
                name: "IsBanned",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Podcasts");

            migrationBuilder.DropColumn(
                name: "PlayCount",
                table: "Podcasts");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "IsBanned",
                table: "AspNetUsers");
        }
    }
}
