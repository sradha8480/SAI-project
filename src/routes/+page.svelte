<script>
  import { encodeLan, loadKeywords } from "$lib/utils.js";
  import { onMount } from "svelte";

  let ui_state = -10, words;

  // GPS
  let state,
    district,
    annual,
    monthly_rainfall = [];
  // MANUAL
  let option_name_data, en_option_name_data;
  let selected = [],
    selection_index = 0,
    select_prompt = "",
    option_names = [];

  function useGPS() {
    ui_state = 1;
    if (navigator) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        location.href = `/chart?coords=${coords.latitude},${coords.longitude}`;
      });
    } else alert("navigator no supported");
  }

  async function useManual() {
    select_prompt = `${words[4]} ${words[5]}: `;
    ui_state = 2;
    let res = await fetch(encodeLan("/district_names.json"));
    if (localStorage.getItem("lan") != "English") {
      en_option_name_data = await fetch("/English/district_names.json");
      en_option_name_data = await en_option_name_data.json();
    }
    option_name_data = await res.json();
    option_names = Object.keys(option_name_data);
    ui_state = 4;
  }

  async function handleSelectChange() {
    if (selection_index == 0) {
      select_prompt = `${words[6]} ${words[5]}: ${
        option_names[selected[0]]
      }<br> ${words[4]} ${words[7]}: `;
      option_names = option_name_data[option_names[selected[0]]];
      selection_index = 1;
      return;
    }
    if (en_option_name_data) {
      selected[0] = Object.keys(en_option_name_data)[selected[0]];
      selected[1] = en_option_name_data[selected[0]][selected[1]];
    } else {
      selected[0] = Object.keys(option_name_data)[selected[0]];
      selected[1] = option_names[selected[1]];
    }
    console.log(selected);
    location.href = `/chart?loc=${selected[0]},${selected[1]}`;
  }

  function openCompositeFarming() {
    location.href = "/composite"
  }

  onMount(async () => {
    words = await loadKeywords();
    ui_state = 0;
  })
</script>

<main>
  {#if ui_state != -10}
  <section>
    <div>
      <h1>SAI</h1>
      <h3>Smart Aquaculture Intelligence</h3>
    </div>

    {#if ui_state == 0}
      <button on:click={useGPS}> {words[1]} </button>
      <button on:click={useManual}> {words[2]} </button>
      <button on:click={openCompositeFarming}>{words[39]}</button>
    {:else if ui_state == 1}
      <p> {words[14]} </p>
    {:else if ui_state == 2}
      <p>{words[19]}...</p>
    {:else if ui_state == 4}
      <p class="prompt">{@html select_prompt}</p>
      <select
        bind:value={selected[selection_index]}
        on:change={handleSelectChange}
      >
        {#each option_names as name, i}
          <option value={i}>
            {name}
          </option>
        {/each}
      </select>
    {/if}
  </section>
  {/if}
</main>

<style lang="scss">
  main {
    @include absolute;
    @include fullscreen;
    @include flex(column);
    @include flex-center;
    @include sans;
    @include gradient;

    color: #fff;
    height: 100vh;
  }

  section {
    @include section(90%, 100%);
    @include flex(column);
    @include flex-center;
    text-align: left;
    gap: 5vh;
    overflow-x: auto;
  }

  select > option {
    @include section(15%, 80%);
    @include sans;
    background: $pri;
    color: $light;
  }

  button,
  select {
    @include section(15%, 80%);
    @include sans;
    max-width: 300px;
    border-radius: 5px;
    border: 1px solid $sec;
    max-height: 100px;

    color: #fff;
    background: $pri;
    font-weight: bold;
    font-size: large;

    &:hover {
      border: 4px solid $hl;
    }
  }
  h1 {
    @include cursive;
  }
  div {
    text-align: center;
  }
  .prompt {
    text-align: center;
  }
</style>
