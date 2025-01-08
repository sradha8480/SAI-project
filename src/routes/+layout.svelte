<script>
  let display_settings_popup = false;
  let language_names = ["English", "Hindi", "Odia"];
  function handleBackClick() {
    window.history.back();
  }
  function handleSettingClick() {
    display_settings_popup = display_settings_popup ? false : true;
  }
  function handleLanChange({ srcElement }) {
    display_settings_popup = false;
    localStorage.setItem("lan", language_names[srcElement.id]);
    location.reload();
  }
  function goHome() {
    location.href = "/";
  }
</script>

<main>
  <p class="Heading" on:click={goHome}>
    <strong> SAI </strong> <br /> <span class="heading">
      Smart Aquaculture Intelligence
    </span>
  </p>
  <div />
  <p on:click={handleSettingClick}>
    <span class="material-symbols-outlined"> settings </span>
  </p>
</main>

{#if display_settings_popup}
  <section>
    <p>Choose Language:</p>
    {#each language_names as lan, i}
      <p id={i} on:click={handleLanChange}>{lan}</p>
    {/each}
  </section>
{/if}
<slot />

<button on:click={handleBackClick}>
  <span class="material-symbols-outlined"> arrow_back_ios </span>
</button>

<style lang="scss">
  main {
    @include fixed(0, 0);
    @include section(10vh, 100vw);
    @include sans;
    @include grid(1fr 3fr 1fr, 10vh);
    align-items: center;
    background-color: $pri;
    border: 1px solid $light;
    z-index: 100;
    color: #fff;
    text-align: center;
    font-size: 2vh;
  }
  @media screen and (max-width: 1200px) {
    main {
      font-size: 15px;
    }
    .heading {
      display: none;
    }
  }
  section {
    @include section(auto, 15vw);
    @include shadow;
    @include flex(column);
    @include flex-center;
    @include sans;

    position: fixed;
    right: 5vw;
    top: 5vh;
    border: 1px solid $light;
    background-color: $pri;
    z-index: 1000;
    color: $light;
    border-radius: 10px;
    min-width: 300px;
    max-width: 600px;
  }
  button {
    @include shadow;
    position: fixed;
    right: 5vw;
    bottom: 5vh;
    color: $light;
    border: 1px solid $tri;
    background-color: $sec;
    z-index: 1000;
    border-radius: 50%;
    text-align: center;
  }
  .Heading {
    cursor: pointer;
    &:hover {
      color: $hl;
    }
  }
</style>
