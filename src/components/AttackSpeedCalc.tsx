import React, {useCallback} from "react";
import {CacheContext} from "../CacheSystem.tsx";
import BigNumber from "bignumber.js";
import {PokemonNameMap} from "../data/PokemonNameMap.tsx";
import {AttackSpeedModifier} from "./AttackSpeedModifier.tsx";
import {AttackSpeedModifiers} from "./AttackSpeedModifiers.tsx";

const AttackSpeedCalc: React.FC = () => {

    const [pokemon, setPokemon] = React.useState<string>("")
    const [cache] = React.useContext(CacheContext)

    const attackFrameMap = new Map<number, number>([
        [376, 16],
        [301, 20],
        [251, 24],
        [215, 28],
        [188, 32],
        [168, 36],
        [151, 40],
        [139, 44],
        [126, 48],
        [116, 52],
        [109, 56],
        [100, 60]
    ])


    const interpolateColor = (value: number, minValue: number, maxValue: number): string => {
        const startColor = { h: 0, s: 100, l: 50 };
        const endColor = { h: 100, s: 100, l: 50 };

        const h = (endColor.h - startColor.h) * (value - minValue) / (maxValue - minValue) + startColor.h;
        const s = (endColor.s - startColor.s) * (value - minValue) / (maxValue - minValue) + startColor.s;
        const l = (endColor.l - startColor.l) * (value - minValue) / (maxValue - minValue) + startColor.l;

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    const bundle = 7.5
    const scarf = 9
    const scarfActive = 30
    const medalMap = new Map<number, number>([
        [0, 0],
        [3, 2],
        [5, 4],
        [7, 8]
    ])

    class Options {
        bundle: boolean = false
        scarf: boolean = false
        scarfActive: boolean = false
        constructor(prev?: Options, init?: Partial<Options>) {
            Object.assign(this, prev, init)
        }
    }

    const [options, setOptions] = React.useState<Options>(new Options())
    const [modifiers, setModifiers] = React.useState<AttackSpeedModifier[]>([])
    const atkSpd = React.useMemo(() => {
        const array: number[] = []
        const stat = cache.getStatCache(pokemon)
        if (!stat) {
            return array
        }
        for (let level = 1; level <= 15; level++) {
            const levelStat = stat.level.find((levelStat) => levelStat.level === level)
            if (!levelStat) {
                return array
            }
            array.push(BigNumber(levelStat.attack_speed).plus(100).toNumber())
        }
        return array
    }, [cache, pokemon])

    const calculateAttackSpeed = useCallback((pokemon: string, level: number, options: Options): number[] => {
        if (!pokemon) {
            return []
        }
        const stat = cache.getStatCache(pokemon)
        if (!stat) {
            return []
        }
        const levelStat = stat.level.find((levelStat) => levelStat.level === level)
        if (!levelStat) {
            return []
        }
        let attackSpeed = BigNumber(levelStat.attack_speed).plus(100).toNumber()

        options.bundle && (attackSpeed += bundle)
        options.scarf && (attackSpeed += scarf)
        options.scarfActive && (attackSpeed += scarfActive)

        modifiers.forEach((modifier) => {
            if (modifier.specificPokemon && modifier.specificPokemon !== pokemon) {
                return
            }
            attackSpeed += modifier.amount(level)
        })


        const array: number[] = []
        for (const [, value] of medalMap) {
            const attackSpeedCopy = attackSpeed + value
            for (const [key, frame] of attackFrameMap) {
                if (attackSpeedCopy >= key) {
                    array.push(frame)
                    break
                }
            }
        }

        return calculateIrregular(pokemon, level, options, array)
    }, [pokemon, modifiers])

    const calculateIrregular = useCallback((pokemon: string, level: number, options: Options, baseValues: number[]): number[] => {
        if (!pokemon) {
            return []
        }

        switch (pokemon) {
            case "Charizard":
                return baseValues.map(() => 60)
        }

        return baseValues
    }, [pokemon])

    const onPokemonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPokemon(event.target.value)
        setModifiers((prev) => prev.filter((modifier) => !modifier.specificPokemon || modifier.specificPokemon === event.target.value))
    }

    const data = React.useMemo(() => {
        const array: number[][] = []

        for (let level = 1; level <= 15; level++) {
            const levelArray: number[] = []
            levelArray.push(...calculateAttackSpeed(pokemon, level, new Options(options)))
            levelArray.push(...calculateAttackSpeed(pokemon, level, new Options(options, {
                bundle: true
            })))
            levelArray.push(...calculateAttackSpeed(pokemon, level, new Options(options, {
                scarf: true
            })))
            levelArray.push(...calculateAttackSpeed(pokemon, level, new Options(options, {
                scarf: true,
                scarfActive: true
            })))
            levelArray.push(...calculateAttackSpeed(pokemon, level, new Options(options, {
                bundle: true,
                scarf: true
            })))
            levelArray.push(...calculateAttackSpeed(pokemon, level, new Options(options, {
                bundle: true,
                scarf: true,
                scarfActive: true
            })))

            array.push(levelArray)
        }

        return array
    }, [pokemon, options, modifiers])

    const onModifierSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const modifier = AttackSpeedModifiers.find((modifier) => modifier.displayName === event.target.value)
        if (modifier) {
            setModifiers([...modifiers, modifier])
        }
    }

    const onModifierClick = (event: React.MouseEvent<HTMLParagraphElement>) => {
        const modifier = AttackSpeedModifiers.find((modifier) => modifier.displayName === event.currentTarget.innerText)
        if (modifier) {
            setModifiers(modifiers.filter((m) => m !== modifier))
        }
    }

    return (
        <div>
            <h1>Attack Speed Calculator</h1>
            <p>Calculate your attack speed</p>
            <p>60で1秒に1回攻撃する</p>
            <select onChange={onPokemonChange}>
                <option value="">選択してください</option>
                {cache.getStatCaches().map((stat) => (
                    <option key={stat.name} value={stat.name}>{PokemonNameMap.get(stat.name) || stat.name}</option>
                ))}
            </select>
            <table border={1}>
                <thead>
                  <tr>
                      <th colSpan={2}>{PokemonNameMap.get(pokemon)}</th>
                      <th colSpan={4}>通常</th>
                      <th colSpan={4}>力のはちまき</th>
                      <th colSpan={4}>れんだスカーフ</th>
                      <th colSpan={4}>れんだスカーフ(発動)</th>
                      <th colSpan={4}>力+スカーフ</th>
                      <th colSpan={4}>力+スカーフ(発動)</th>
                  </tr>
                  <tr>
                      <th>Level</th>
                      <th>Atk Spd</th>
                      {
                          Array(6).fill(0).map(() => (
                              <>
                                  <th>赤0</th>
                                  <th>赤3</th>
                                  <th>赤5</th>
                                  <th>赤7</th>
                              </>
                          ))
                      }
                  </tr>
                </thead>
                <tbody>
                {
                    Array(15).fill(0).map((_, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{atkSpd[index]}</td>
                            {
                                data[index].map((value) => (
                                    <td style={{ backgroundColor: interpolateColor(value, 16, 60) }}>
                                        {value}
                                    </td>
                                ))
                            }
                        </tr>
                    ))
                }
                </tbody>
            </table>

            <h2>Modifiers</h2>
            {
                modifiers.map((modifier) => (
                    <div>
                        <p onClick={onModifierClick}>{modifier.displayName}</p>
                    </div>
                ))
            }
            <select onChange={onModifierSelect}>
                <option value="">選択してください</option>
                {
                    AttackSpeedModifiers.map((modifier) => (
                        (modifiers.includes(modifier) || (modifier.specificPokemon && modifier.specificPokemon !== pokemon)) ? null : <option value={modifier.displayName}>{modifier.displayName}</option>
                    ))
                }
            </select>
        </div>
    )
}

export default AttackSpeedCalc
