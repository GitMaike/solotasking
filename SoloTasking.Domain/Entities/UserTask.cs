namespace SoloTasking.Domain.Entities;

public class UserTask
{
    public string Title { get; private set; }
    public string Description { get; private set; }
    public DateTime DueDate { get; private set; }
    public int Xp { get; private set; }
    public bool IsCompleted { get; private set; }
    public string? RewardItem { get; private set; }

    public UserTask(string title, string description, DateTime dueDate, int xp, string? rewardItem = null)
    {
        Title = title;
        Description = description;
        DueDate = dueDate;
        Xp = xp;
        RewardItem = rewardItem;
        IsCompleted = false;
    }

    public void Conclude()
    {
        IsCompleted = true;
    }

    public bool IsLate()
    {
        return !IsCompleted && DateTime.Now > DueDate;
    }
}
