<script>
  import { loadKeywords } from "$lib/utils.js";
  import { onMount } from "svelte";

  let ui_state = -10,
    words = [],
    land_input,
    cost_per_kg,
    revenue;
  let costs = [];
  const calculatedCosts = [];
  function calcCosts({ key }) {
    if (key != "Enter") return;
    land_input = Number(land_input);
    for (let i = 0; i < costs.length; i += 2) {
      calculatedCosts[i / 2] = Math.round(land_input * costs[i + 1]);
    }
    ui_state = 1;
  }
  function calcRevenue({ key }) {
    if (key != "Enter") return;
    revenue = Math.round(cost_per_kg * 1.2 * calculatedCosts[0]);
    ui_state = 2;
  }

  onMount(async () => {
    words = await loadKeywords();
    costs = [
      words[26],
      0.5,
      words[27],
      14.5,
      words[28],
      7.575,
      words[29],
      4,
      words[30],
      14.4,
      words[31],
      1.2,
      words[32],
      7.85,
    ];
    ui_state = 0;
  });
</script>

<main>
  <div class="padding"></div>
  <section>
    {#if ui_state == -10}
      <div />
    {:else if ui_state == 0}
      <h3>{words[32]}</h3>
      <input bind:value={land_input} on:keyup={calcCosts} type="number" />
    {:else}
      <table>
        {#each calculatedCosts as cost, i}
          <tr>
            <td>
              {costs[i * 2]}
            </td>
            <td>
              ₹{cost}
            </td>
          </tr>
        {/each}
        <tr>
          <td> {words[33]} </td>
          <td> ₹{calculatedCosts.reduce((a, b) => a + b)} </td>
        </tr>
        <tr>
          <td> {words[34]} </td>
          <td> {Math.round(1.2 * calculatedCosts[0])}Kg </td>
        </tr>
      </table>
      {#if ui_state == 2}
        <table>
          <tr>
            <td> {words[35]}</td>
            <td> ₹{revenue} </td>
          </tr>
          <tr>
            <td> {words[36]} </td>
            <td> ₹{revenue - calculatedCosts.reduce((a, b) => a + b)} </td>
          </tr>
        </table>
      {:else}
        <h3>{words[37]}</h3>
        <input bind:value={cost_per_kg} on:keyup={calcRevenue} type="number" />
      {/if}
    {/if}
  </section>
  <div class="padding"></div>
</main>

<style lang="scss">
  main {
    @include section(auto, 100vw);
    @include absolute;
    @include sans;
    @include gradient;
    @include flex(column);
    @include flex-center;
    color: #fff;
    min-height: 100vh;
  }
  .padding {
    @include section(20vh, 100vw);
  }
  section {
    @include section(auto, 80vw);
    @include flex(column);
    @include flex-center;
    @include shadow;
    background-color: $pri;
    border: 1px solid $tri;
    min-height: 70vh;
    padding-bottom: 5vh;
  }
  table {
    width: 70vw;
    height: 40vh;
    max-width: 1100px;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }

  table tr:nth-child(odd) {
    background-color: $pri;
  }

  table tr:nth-child(even) {
    background-color: $sec;
  }
  th,
  td {
    padding: 10px;
  }
  input {
    border: 1px solid $light;
    color: $light;
    background-color: $pri;
    border-bottom: 1px solid $light;
    padding: 10px;
  }
</style>
