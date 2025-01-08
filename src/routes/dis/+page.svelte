<script>
    import { page } from "$app/stores";
    import { encodeLan, loadKeywords } from "$lib/utils.js"
    import { onMount } from "svelte";

    let ui_state = -10, words;
    let fish = {}
    onMount(async () => {
        words = await loadKeywords();
        ui_state = 0;

        let res = await fetch(encodeLan("/diseases.txt"));
        res = await res.text();
        res = res.replaceAll("-", "").replaceAll(":", "").split("*").map(x => x.trim()).filter(x => x);
        console.log(res);

        const fish_index = Number($page.url.searchParams.get("index")) * 11 + 5;
        fish.name = res[fish_index];
        fish.precautions = res.slice(0,5);
        fish.diseases = [];
        for (let i = 0; i < 5; i++) {
            fish.diseases.push({
                name: res[i * 2 + fish_index + 1],
                des: res[i * 2 + fish_index + 2]
            })
        }
        ui_state = 1;
    })
</script>

<main>
    {#if  ui_state == -10}
        <div></div>
    {:else if ui_state == 0}
        <h2>{words[19]} ...</h2>
    {:else if ui_state == 1}
        <div></div>
        <section>
            <h1> {fish.name} </h1>
            {#each fish.diseases as dis, i}
                <h3>{i + 1}. {dis.name}</h3>
                <p>{dis.des}</p>
            {/each}
            <br>
            <h2> {words[41]} </h2>
            {#each fish.precautions as precaution, i}
                <p> {i + 1}. {precaution} </p>
            {/each}
            <h3>  </h3>
        </section>
    {/if}
</main>

<style lang="scss">
    main {
        @include section(auto, 100vw);
        @include absolute;
        @include sans;
        @include flex(column);
        @include flex-center;
        @include gradient;
        color: #fff;
        min-height: 100vh;
    }
    section {
        @include section(auto, 95vw);
    }
    div {
        @include section(20vh, 100vw);
    }
    h1,h2 {
        border-bottom: 1px solid $hl;
    }
</style>