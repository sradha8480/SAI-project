<script>
    import { loadKeywords, encodeLan } from "$lib/utils.js"
    import { onMount } from "svelte";

    let ui_state = -10, words = [];
    let fishes = [];
    onMount(async () => {
        words = await loadKeywords();
        ui_state = 0;
        let res = await fetch(encodeLan("/composite.txt"));
        res = await res.text();
        for (let line of res.split("\n")) {
            line = line.split(":").map(x => x.trim());
            fishes.push({ name: line[0], des: line[1] });
        }
        ui_state = 1;
    })
</script>

<main>
    {#if ui_state == -10}
        <div></div>
    {:else if ui_state == 0}
        <h2>{words[19]} ... </h2>
    {:else if ui_state == 1}
        <div class="padding"></div>
        <section>
            {#each fishes as fish}
                <div>
                    <h2> {fish.name} </h2>
                    <p> {fish.des} </p>
                </div>
            {/each}
        </section>
    {/if}
</main>

<style lang="scss">
    main {
        @include section(auto, 100vw);
        @include gradient;
        @include absolute;
        @include sans;
        @include flex(column);
        @include flex-center;

        color: #fff;
        min-height: 100vh;
    }
    section {
        @include section(auto, 90vw);
        display: flex;
        flex-direction: column;
    }
    h2 {
        border-bottom: 1px solid $hl;
    }
    .padding {
        @include section(20vh, 100vw);
        text-align: left;
    }
</style>