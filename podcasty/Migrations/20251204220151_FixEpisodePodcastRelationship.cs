using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace podcasty.Migrations
{
    /// <inheritdoc />
    public partial class FixEpisodePodcastRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Episodes_Podcasts_PodcastId1",
                table: "Episodes");

            migrationBuilder.DropIndex(
                name: "IX_Episodes_PodcastId1",
                table: "Episodes");

            migrationBuilder.DropColumn(
                name: "PodcastId1",
                table: "Episodes");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PodcastId1",
                table: "Episodes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Episodes_PodcastId1",
                table: "Episodes",
                column: "PodcastId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Episodes_Podcasts_PodcastId1",
                table: "Episodes",
                column: "PodcastId1",
                principalTable: "Podcasts",
                principalColumn: "PodcastId");
        }
    }
}
