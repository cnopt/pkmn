using PKHeX.Core;

// No namespace — accessible from top-level Program.cs statements

public record SaveDataDto(
    TrainerDto Trainer,
    PokemonDto[] Party,
    BoxDto[] Boxes)
{
    public static SaveDataDto From(SaveFile sav)
    {
        var strings = GameInfo.GetStrings("en");

        return new SaveDataDto(
            Trainer: TrainerDto.From(sav),
            Party: Enumerable.Range(0, sav.PartyCount)
                             .Select(i => PokemonDto.From(sav.GetPartySlotAtIndex(i), strings))
                             .ToArray(),
            Boxes: Enumerable.Range(0, sav.BoxCount)
                             .Select(b => BoxDto.From(sav, b, strings))
                             .ToArray()
        );
    }
}

public record TrainerDto(
    string Name,
    int Tid,
    int Sid,
    int Generation,
    string Game)
{
    public static TrainerDto From(SaveFile sav) => new(
        Name:       sav.OT,
        Tid:        sav.TID16,
        Sid:        sav.SID16,
        Generation: sav.Generation,
        Game:       sav.Version.ToString()
    );
}

public record BoxDto(string Name, PokemonDto[] Slots)
{
    public static BoxDto From(SaveFile sav, int boxIndex, GameStrings strings) => new(
        Name:  sav is IBoxDetailName n ? n.GetBoxName(boxIndex) : $"Box {boxIndex + 1}",
        Slots: Enumerable.Range(0, sav.BoxSlotCount)
                         .Select(s => PokemonDto.From(sav.GetBoxSlotAtIndex(boxIndex, s), strings))
                         .ToArray()
    );
}

public record PokemonDto(
    bool IsEmpty,
    int Species,
    string SpeciesName,
    string Nickname,
    int Level,
    string Gender,
    bool IsShiny,
    bool IsEgg,
    int HeldItem,
    string HeldItemName,
    int Nature,
    string NatureName,
    int Ability,
    string AbilityName,
    int Hp,
    int Attack,
    int Defense,
    int SpAttack,
    int SpDefense,
    int Speed,
    int MaxHp,
    MoveDto[] Moves,
    IvDto IVs,
    EvDto EVs,
    string OtName,
    int Form)
{
    private static readonly string[] GenderLabels = ["Male", "Female", "Genderless"];

    public static PokemonDto From(PKM pkm, GameStrings strings)
    {
        if (pkm.Species == 0)
        {
            return new PokemonDto(
                IsEmpty: true,
                Species: 0, SpeciesName: "", Nickname: "", Level: 0,
                Gender: "", IsShiny: false, IsEgg: false,
                HeldItem: 0, HeldItemName: "",
                Nature: 0, NatureName: "",
                Ability: 0, AbilityName: "",
                Hp: 0, Attack: 0, Defense: 0, SpAttack: 0, SpDefense: 0, Speed: 0, MaxHp: 0,
                Moves: [],
                IVs: new IvDto(0, 0, 0, 0, 0, 0),
                EVs: new EvDto(0, 0, 0, 0, 0, 0),
                OtName: "", Form: 0);
        }

        var genderIndex = pkm.Gender < GenderLabels.Length ? pkm.Gender : 2;
        var natureName   = SafeGet(strings.natures,     (int)pkm.Nature);
        var abilityName  = SafeGet(strings.abilitylist, pkm.Ability);
        var speciesName  = SafeGet(strings.specieslist, pkm.Species);
        var heldItemName = pkm.HeldItem > 0 ? SafeGet(strings.itemlist, pkm.HeldItem) : "";

        return new PokemonDto(
            IsEmpty:      false,
            Species:      pkm.Species,
            SpeciesName:  speciesName,
            Nickname:     pkm.Nickname,
            Level:        pkm.CurrentLevel,
            Gender:       GenderLabels[genderIndex],
            IsShiny:      pkm.IsShiny,
            IsEgg:        pkm.IsEgg,
            HeldItem:     pkm.HeldItem,
            HeldItemName: heldItemName,
            Nature:       (int)pkm.Nature,
            NatureName:   natureName,
            Ability:      pkm.Ability,
            AbilityName:  abilityName,
            Hp:           pkm.Stat_HPCurrent,
            Attack:       pkm.Stat_ATK,
            Defense:      pkm.Stat_DEF,
            SpAttack:     pkm.Stat_SPA,
            SpDefense:    pkm.Stat_SPD,
            Speed:        pkm.Stat_SPE,
            MaxHp:        pkm.Stat_HPMax,
            Moves:        BuildMoves(pkm, strings),
            IVs:          new IvDto(pkm.IV_HP, pkm.IV_ATK, pkm.IV_DEF, pkm.IV_SPA, pkm.IV_SPD, pkm.IV_SPE),
            EVs:          new EvDto(pkm.EV_HP, pkm.EV_ATK, pkm.EV_DEF, pkm.EV_SPA, pkm.EV_SPD, pkm.EV_SPE),
            OtName:       pkm.OriginalTrainerName,
            Form:         pkm.Form
        );
    }

    private static MoveDto[] BuildMoves(PKM pkm, GameStrings strings)
    {
        ushort[] moveIds = [pkm.Move1, pkm.Move2, pkm.Move3, pkm.Move4];
        var result = new List<MoveDto>(4);
        foreach (var id in moveIds)
        {
            if (id == 0) continue;
            result.Add(new MoveDto(id, SafeGet(strings.movelist, id)));
        }
        return [.. result];
    }

    private static string SafeGet(string[] arr, int index) =>
        (uint)index < (uint)arr.Length ? arr[index] : "";
}

public record MoveDto(int Id, string Name);
public record IvDto(int Hp, int Atk, int Def, int SpA, int SpD, int Spe);
public record EvDto(int Hp, int Atk, int Def, int SpA, int SpD, int Spe);
