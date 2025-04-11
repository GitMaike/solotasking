using SoloTasking.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace SoloTasking.Tests;

public class UserTaskTests
{
    [Fact]
    public void Create_ShouldInstantiateTaskWithCorrectValues()
    {
        var title = "Train";
        var description = "Do 10 push-ups";
        var dueDate = DateTime.Today.AddDays(1);
        var xp = 100;

        var task = new UserTask(title, description, dueDate, xp);

        task.Title.Should().Be(title);
        task.Description.Should().Be(description);
        task.DueDate.Should().Be(dueDate);
        task.Xp.Should().Be(xp);
        task.IsCompleted.Should().BeFalse();
    }

    [Fact]
    public void Conclude_ShouldSetTaskAsCompleted()
    {
        var task = new UserTask("Complete assignment", "Finish the report", DateTime.Now.AddDays(1), 50);
        task.Conclude();
        task.IsCompleted.Should().BeTrue();
    }

    [Fact]
    public void IsLate_ShouldReturnTrue_WhenDueDatePassedAndTaskNotCompleted()
    {
        var title = "Study";
        var description = "Read chapter 5";
        var dueDate = DateTime.Today.AddDays(-1);
        var xp = 50;

        var task = new UserTask(title, description, dueDate, xp);

        var result = task.IsLate();

        result.Should().BeTrue();
    }

}