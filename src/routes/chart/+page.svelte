<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { encodeLan, loadKeywords } from "$lib/utils.js";

  let ui_state = -10,
    words;
  let data;

  let suitable_fishes = [];
  const celcliusToFaraheit = (x) => (9 / 5) * x + 32;
  onMount(async () => {
    words = await loadKeywords();
    ui_state = 0;
    let res,
      coords = $page.url.searchParams.get("coords");
    if (coords) res = await fetch("/data?coords=" + coords);
    else res = await fetch("/data?loc=" + $page.url.searchParams.get("loc"));
    data = await res.json();
    console.log(data);

    res = await fetch(encodeLan("/fish_data.csv"));
    res = await res.text();

    const temp = data.days[0].temp,
      precip = data.days[0].precip;
    let point = 0,
      index = 0;
    for (let row of res.split("\n")) {
      row = row
        .split(",")
        .map((x) => (isNaN(Number(x)) ? x.trim() : Number(x)));
      if (row[2] == "varies") point += 1;
      else {
        let x = row[2].split("-").map(Number).map(celcliusToFaraheit);
        if (x[0] < temp && x[1] > temp) point += 1;
      }

      console.log(temp, precip);

      if (row[1] == "Adequate") {
        if (precip > 0.3) point += 1;
      } else if (precip >= 0.0) point += 1;

      if (point == 2)
        suitable_fishes.push({
          index,
          name: row[0],
          temp:
            row[2] == "varies"
              ? [words[13], words[13]]
              : row[2].split("-").map(Number).map(celcliusToFaraheit),
          precip: row[1],
        });
      point = 0;
      index++;
    }

    suitable_fishes = suitable_fishes;
    ui_state = 3;
    console.log("complete", ui_state, suitable_fishes);
  });

  function handleClick({ srcElement }) {
    console.log(srcElement.id);
    location.href = "/fish?index=" + srcElement.id;
  }
</script>

<main>
  <div class="header" />
  {#if ui_state == -10}
    <div />
  {:else if ui_state == 0}
    <p>{words[19]} ...</p>
  {:else}
    <h2>{words[15]}</h2>
    {#if suitable_fishes.length}
      <table>
        <tr>
          <td> {words[12]} </td>
          <td> {words[8]} {words[10]} </td>
          <td> {words[9]} {words[10]} </td>
          <td> {words[11]} </td>
        </tr>
        {#each suitable_fishes as fish}
          <tr on:click={handleClick} id={fish.index}>
            <td id={fish.index}> {fish.name} </td>
            <td id={fish.index}> {fish.temp[0]} </td>
            <td id={fish.index}> {fish.temp[1]} </td>
            <td id={fish.index}>
              {fish.precip == "Adequate" ? " < 200mm" : "< 100mm"}
            </td>
          </tr>
        {/each}
      </table>
    {:else}
      <h2>{words[24]}</h2>
    {/if}
    <button on:click={() => (location.href = "/")}> {words[3]} </button>
  {/if}

  <div class="header" />
</main>

<style lang="scss">
  table {
    @include shadow;
    width: 90vw;
    height: 40vh;
    max-width: 1100px;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    border: 1px solid $tri;
    font-size: x-small;
  }
  @media screen and (min-width: 1200px) {
    table {
       font-size: large;
    }
  }
  table tr:nth-child(odd) {
    background-color: $sec;
  }

  table tr:nth-child(even) {
    background-color: $tri;
  }
  th,
  td {
    padding: 10px;
  }
  main {
    @include absolute;
    @include flex(column);
    @include sans;
    @include gradient;

    height: auto;
    min-height: 100vh;
    width: 100vw;
    align-items: center;
    justify-content: center;
    overflow-x: hidden;
    overflow-y: auto;
    color: #fff;
    gap: 3vh;
  }

  .header {
    @include section(20vh, 100vw);
    background: transparent;
  }

  .canvas {
    @include flex(column);
    @include flex-center;
    width: 90vw;
    max-width: 600px;
  }

  button {
    @include section(20%, 80%);
    @include sans;
    max-width: 300px;
    min-width: 100px;
    border-radius: 5px;
    border: 1px solid $tri;
    background: $pri;
    max-height: 100px;
    color: $light;
    padding: 5px;

    &:hover {
      border: 1px solid $hl;
    }
  }

  h1,h2 {
    max-width: 80vw;
    text-align: center;
  }
  div {
    text-align: center;
  }
</style>
