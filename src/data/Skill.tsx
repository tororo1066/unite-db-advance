export type Skill = {
    name: string;
    ability: string;
    description: string;
    rsb: RSB;
}

export type RSB = {
    name: string;
    code: string;
    label: string;
    ratio: number;
    dmg_type: string;
    slider: number;
    base: number;
    alert: string;
    true_desc: string;
    notes: string;
    add_rsb: AddRSB[];
}

export type AddRSB = {
    location: number;
    type: "add" | "enhanced";
    rsb: RSB;
}
