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
        
        var player = new Player(name, 10);

        player.Name.Should().Be(name);
        player.Level.Should().Be(1);
        player.CurrentXp.Should().Be(0);
        player.XpToNextLevel.Should().Be(100);
    }

[Fact]
    public void GainXp_ShouldIncreaseXpAndLevelWhenThresholdIsReached()
    {
        var player = new Player("name", 10);

        player.GainXp(150);

        player.Level.Should().Be(2);
        player.CurrentXp.Should().Be(50);
        player.XpToNextLevel.Should().Be(150);
    }

[Fact]
    public void Should_GrantReward_WhenLevelUpOccurs()
    {
        var player = new Player("name", 10);
        int xpToLevelUp = player.XpToNextLevel;

        player.GainXp(xpToLevelUp);

        player.Rewards.Should().Contain("Healing Potion");

    }

}