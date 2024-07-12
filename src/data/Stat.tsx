export interface Stat {
    name: string;
    level: [
        {
            level: number;
            hp: number;
            attack: number;
            defense: number;
            sp_attack: number;
            sp_defense: number;
            crit: number;
            cdr: number;
            lifesteal: number;
            attack_speed: number;
            move_speed: number;
        }
    ]
}