<script lang="ts">
    import type { Monster } from "index";
    import type { LayoutSettings, SavesItem } from "types/layout";
    import { toTitleCase } from "src/util/util";
    import { getAllContexts, getContext } from "svelte";
    import TextContentHolder from "./TextContentHolder.svelte";

    export let monster: Monster;
    export let item: SavesItem;


    const settings = getContext<LayoutSettings>("layoutSettings");
    
    function getMod(value: string | number) {
        let mod;

        let func;
        let modifier = item.modifier;
        if (
            item.modifier == null ||
            !item.modifier.length ||
            item.modifier == ""
        ) {
            modifier = settings.defaultSavesModifier
        }else {
            modifier = item.modifier
        }

        func = modifier.contains("return")
            ? modifier
            : `return ${modifier}`;
        const customMod = new Function("value", func);
        const argument = isNaN(Number(value)) ? value : Number(value);
        mod = customMod(argument);

        if(typeof mod == "number"){
            return `${mod >= 0 ? "+" : "-"}${Math.abs(mod)}`;
        }else {
            return `${mod}`;
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

            // type check item.calculate allow a default to true
            return `${toTitleCase(key)} ${item.calculate === false ? '' : getMod(value as (string | number))}`;
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
