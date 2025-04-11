using SoloTasking.Domain.Entities;
using SoloTasking.Domain.Enums;
using SoloTasking.Domain.Helpers;

namespace SoloTasking.Domain.Services;

public class DungeonService
{
    public bool CanEnterDungeon(Player player, DungeonRank requiredRank, int requiredEnergy)
    {
        if (player == null)
            throw new ArgumentNullException(nameof(player));

        if (player.Level < DungeonRankHelper.GetMinimumLevelForRank(requiredRank))
            return false;

        if (player.Energy < requiredEnergy)
            return false;

        return true;
    }

    public void EnterSoloDungeon(Player player, DungeonRank rank, int energyCost, int xpReward, string reward)
    {
        if(!CanEnterDungeon(player, rank, energyCost))
            throw new InvalidOperationException("Player cannot enter this dungeon.");

        player.ReduceEnergy(energyCost);
        player.GainXp(xpReward);
        player.Rewards.Add(reward);
    }
}