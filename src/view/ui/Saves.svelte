<script lang="ts">
    import type { Monster } from "index";
    import type { SavesItem } from "types/layout";
    import { toTitleCase } from "src/util/util";
    import { getContext } from "svelte";
    import TextContentHolder from "./TextContentHolder.svelte";

    export let monster: Monster;
    export let item: SavesItem;

    function getMod(value: string | number) {
        let mod;
        if (
            item.modifier == null ||
            !item.modifier.length ||
            item.modifier == ""
        ) {
            if(typeof value == "string" || isNaN(Number(value))){
                mod =  value;
            } else {
                mod = Math.floor(((Number(value) ?? 10) - 10) / 2);
            }
        } else {
            const func = item.modifier.contains("return")
                ? item.modifier
                : `return ${item.modifier}`;
            const customMod = new Function("value", func);
            mod = customMod(value);
            console.log('customMod', customMod)
            console.log('customModV', customMod(value))
            console.log("func", func)
        }
        console.log('mod', mod, 'value', value)

        if(typeof mod == "string" && isNaN(Number(mod))){
            return `${mod}`;
        }else {
            return `${mod >= 0 ? "+" : "-"}${Math.abs(mod)}`;
        }
    }

    let arr: any[] = monster[item.properties[0]] as any[];
    if (!Array.isArray(arr)) {
        arr = [];
    }

    const saves = arr
        .map((ability) => {
            if (typeof ability != "object" || ability == null) return null;
            let key = Object.keys(ability)[0];
            if (!key) return null;
            const value = Object.values(ability)[0];
            if (!value) return null;
            return `${toTitleCase(key)} ${item.calculate ? getMod(value as (string | number)) : ''}`;
        })
        .filter((m) => m)
        .join(", ");

    let canDice = getContext<boolean>("dice");
</script>

<div class="info">
    <div class="line">
        <span class="property-name"
            >{item.display ?? toTitleCase(item.properties[0])}</span
        >
        <div class="property-text">
            <TextContentHolder render={item.markdown} property={saves} />
        </div>
    </div>
</div>

<style>
    .line {
        line-height: var(--statblock-saves-line-height);
        display: block;
        color: var(--statblock-font-color);
    }
    .property-name {
        color: var(--statblock-property-name-font-color);
        margin: 0;
        margin-right: 0.25em;
        display: inline;
        font-weight: bold;
    }
    .property-text {
        display: inline;
        margin: 0;
    }
</style>
