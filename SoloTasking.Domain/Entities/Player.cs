namespace SoloTasking.Domain.Entities;

public class Player
{
    public string Name { get; private set; }
    public int Level { get; private set; }
    public int CurrentXp { get; private set; }
    public int XpToNextLevel { get; private set; }
    public int Energy { get; private set; }
    public List<string> Rewards { get; private set; } = new List<string>(); 

    public Player(string name, int energy)
    {
        Name = name;
        Level = 1;
        CurrentXp = 0;
        XpToNextLevel = CalculateXpToNextLevel();
        Energy = energy;
        Rewards = new List<string>();
    }

    public void GainXp(int xpAmount)
    {
        CurrentXp += xpAmount;

        while (CurrentXp >= XpToNextLevel)
        {
            CurrentXp -= XpToNextLevel;
            Level++;
            XpToNextLevel = CalculateXpToNextLevel();

            GrantRewardForLevel(Level);
        }
    }

    public void ReduceEnergy(int amount)
{
    if (amount > Energy)
        throw new InvalidOperationException("Not enough energy.");

    Energy -= amount;
}

    private int CalculateXpToNextLevel()
    {
        return 100 + (Level - 1) * 50;
    }

    private void GrantRewardForLevel(int level)
    {
        switch (level)
        {
            case 2:
                Rewards.Add("Healing Potion");
                break;
            case 3:
                Rewards.Add("Inventory Expansion");
                break;
            case 5:
                Rewards.Add("Bronze Sword");
                break;
            case 10:
                Rewards.Add("Mystery Chest");
                break;
        }
    }
    
}