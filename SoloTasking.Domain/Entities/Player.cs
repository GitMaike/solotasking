namespace SoloTasking.Domain.Entities;

public class Player
{
    public string Name { get; private set; }
    public int Level { get; private set; }
    public int CurrentXp { get; private set; }
    public int XpToNextLevel { get; private set; }

    public Player(string name)
    {
        Name = name;
        Level = 1;
        CurrentXp = 0;
        XpToNextLevel = 100;
    }

    public void GainXp(int xpAmount)
    {
        CurrentXp += xpAmount;

        while (CurrentXp >= XpToNextLevel)
        {
            CurrentXp -= XpToNextLevel;
            Level++;
            XpToNextLevel = CalculateXpToNextLevel();
        }
    }

    private int CalculateXpToNextLevel()
    {
        return 100 + (Level - 1) * 50;
    }
}