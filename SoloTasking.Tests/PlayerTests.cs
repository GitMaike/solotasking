using SoloTasking.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace SoloTasking.Tests;

public class PlayerTests
{


[Fact]

    public void Create_ShouldInitializePlayerWithDefaultValues()
    {
        var name = "player 1";
        
        var player = new Player(name);

        player.Name.Should().Be(name);
        player.Level.Should().Be(1);
        player.CurrentXp.Should().Be(0);
        player.XpToNextLevel.Should().Be(100);
    }

[Fact]

    public void GainXp_ShouldIncreaseXpAndLevelWhenThresholdIsReached()
    {
        var player = new Player("name");

        player.GainXp(150);

        player.Level.Should().Be(2);
        player.CurrentXp.Should().Be(50);
        player.XpToNextLevel.Should().Be(150);
    }
}