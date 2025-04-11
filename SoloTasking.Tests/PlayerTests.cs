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
}