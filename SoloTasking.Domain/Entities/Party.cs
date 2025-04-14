using System;
using System.Collections.Generic;

namespace SoloTasking.Domain.Entities
{
    public class Party
    {
        public Guid PartyID { get; private set; }
        public List<Player> Members { get; private set; }
        public Player Leader { get; private set; }

        public Party(Player leader)
        {
            if (leader == null)
                throw new ArgumentNullException(nameof(leader));

            PartyID = Guid.NewGuid();
            Leader = leader;
            Members = new List<Player> { leader };
        }

        public void AddMember(Player player)
        {
            if (player == null)
                throw new ArgumentNullException(nameof(player));

            if (Members.Contains(player))
                throw new InvalidOperationException("Player is already in the party.");

            Members.Add(player);
        }

        public void RemoveMembers(Player player)
        {
            if (player == null)
                throw new ArgumentNullException(nameof(player));

            if (player == Leader)
                throw new InvalidOperationException("Leader cannot be removed.");

            if (Members.Contains(player))
                Members.Remove(player);  
        }

        public void ChangeLeader(Player newLeader)
        {
            if (newLeader == null)
                throw new ArgumentNullException(nameof(newLeader));
            
            if(!Members.Contains(newLeader))
                throw new InvalidOperationException("New Leader must be a membem of the party.");

            Leader = newLeader;
        }
    }
}