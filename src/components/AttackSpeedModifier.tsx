export class AttackSpeedModifier {
    displayName: string;
    specificPokemon?: string;
    amount: (level: number) => number;

    constructor(displayName: string, amount: (level: number) => number, specificPokemon?: string) {
        this.displayName = displayName;
        this.amount = amount;
        this.specificPokemon = specificPokemon;
    }
}
