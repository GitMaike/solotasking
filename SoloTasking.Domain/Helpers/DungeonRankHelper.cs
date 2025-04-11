using SoloTasking.Domain.Enums;

namespace SoloTasking.Domain.Helpers;

public static class DungeonRankHelper
{
    public static DungeonRank GetRankForLevel(int level)
    {
        if (level >= 51)
            return DungeonRank.S;
        if (level >= 41)
            return DungeonRank.A;
        if (level >= 31)
            return DungeonRank.B;
        if (level >= 21)
            return DungeonRank.C;
        if (level >= 11)
            return DungeonRank.D;

        return DungeonRank.E;
    }

public static int GetMinimumLevelForRank(DungeonRank rank)
{
    return rank switch
    {
        DungeonRank.E => 1,
        DungeonRank.D => 11,
        DungeonRank.C => 21,
        DungeonRank.B => 31,
        DungeonRank.A => 41,
        DungeonRank.S => 51,
        _ => throw new ArgumentOutOfRangeException(nameof(rank), "Invalid dungeon rank")
    };
}

}