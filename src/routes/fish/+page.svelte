<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { encodeLan, loadKeywords } from "$lib/utils.js";

  const randomArr = (x, c) => {
    const arr = new Array(x);
    for (let i = 0; i < x; i++) arr[i] = Math.random() * c;
    return arr;
  };
  
  let ui_state = -10, words;
  const fish_index = $page.url.searchParams.get("index");

  let data = {};
  onMount(async () => {
    words = await loadKeywords();
    ui_state = 0;
    if (!fish_index) return (ui_state = -1);
    let res = await fetch(encodeLan("/fish_description.txt"));
    res = await res.text();
    data.des = res.split("\n")[fish_index];

    res = await fetch(encodeLan("/fish_data.csv"));
    res = await res.text();
    res = res
      .split("\n")
      [fish_index].split(",")
      .map((x) => x.trim());
    data.name = res[0];
    data.rainfall = words[16] + 
      (res[1] == "Adequate" ? " 300mm" : " 100mm");
    data.temp = res[2] == "varies" ? words[20] : words[13];
    data.food = res[3];
    data.loc = res[6];
    data.size = res[8];

    ui_state = 1;
  });


  function handleCalcClick() {
    location.href = "/calc";
  }
  function handleDisClick() {
    location.href = "/dis?index=" + fish_index;
  }
</script>

<main>
  {#if ui_state == -10}
    <div></div>
  {:else if ui_state == -1}
    <h1>{words[21]}</h1>
  {:else if ui_state == 0}
    <h3>{words[19]}</h3>
  {:else}
    <div></div>
    <section>
      <img src={"/fish_images/" + fish_index + ".jpeg"} alt={data.name} />
      <h1>{data.name}</h1>
      <p>{data.des}</p>
      <p>
        {words[11]}: {data.rainfall} <br />
        {words[10]}: {data.temp} <br />
        {words[22]}: {data.food} <br />
        {words[23]}: {data.loc} <br />
        {words[18]}: {data.size}
      </p>
      <button on:click={handleCalcClick}> {words[38]} </button>
      <button on:click={handleDisClick}> {words[40]} </button>
    </section>
  {/if}
</main>

<style lang="scss">
  main {
    @include absolute;
    @include section(auto, 100vw);
    @include flex(column);
    @include flex-center;
    @include sans;
    @include gradient;

    color: #fff;
    height: auto;
    min-height: 100vh;
    padding-bottom: 5vh;
  }
  div {
    @include section(25vh, 100vw);
  }
  section {
    @include section(auto, 80vw);
    @include flex(column);
    align-items: left;
    justify-content: center;
    gap: 10px;
    min-height: 80vh;
  }

  img {
    @include shadow;
    border: 1px solid $pri;
    width: 40%;
    max-width: 500px;
    min-width: 250px;
    border-radius: 10px;
  }

  button {
    @include shadow;
    @include sans;
    border-radius: 10px;
    max-width: 200px;
    background-color: $pri;
    color: #fff;
    padding: 10px;
  }

  h1 {
    border-bottom: 1px solid $hl;
  }
</style>
