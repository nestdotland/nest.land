<template>
  <div>
    <div class="hero is-dark is-bold">
      <div class="hero-head">
        <div class="notification is-dark" style="border-radius: 0">Coming soon...</div>
        <nav class="navbar">
          <router-link to="/" class="navbar-item back-arrow">
            <font-awesome-icon :icon="['fa', 'arrow-left']" />
          </router-link>
        </nav>
      </div>
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column">
              <h1 class="title is-1">
                Enter
                <span class="gradient-text currency">DNO</span>
              </h1>
              <p class="subtitle">
                a profit sharing token for
                <b>Deno</b>
              </p>
            </div>
            <div class="column is-5">
              <img
                src="https://raw.githubusercontent.com/nestdotland/nest.land/feat/pst-info/public/pst-diagram-dark.svg"
                alt="PST diagram"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <gradient-bar></gradient-bar>
    <div class="hero is-medium is-light">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column">
              <h1 class="title section-title">Whaaa?</h1>
              <p class="subtitle">
                <span class="currency">DNO</span> is a profit sharing token built on Arweave. These tokens behave like a normal cryptocurrency, and they will be used for a number of purposes...
              </p>
            </div>
            <div class="column is-1"></div>
            <div class="column">
              <ul>
                <li class="subtitle">
                  <font-awesome-icon :icon="['fas', 'users']" class="left-icon" />Paid out based on module usage
                </li>
                <li class="subtitle">
                  <font-awesome-icon :icon="['fas', 'exchange-alt']" class="left-icon" />Transferrable & tradeable
                </li>
                <li class="subtitle">
                  <font-awesome-icon :icon="['fas', 'gavel']" class="left-icon" />Used for platform governance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero is-medium">
      <div class="hero-body">
        <div class="container">
          <h1 class="title section-title has-text-centered">POC Token Metrics</h1>
          <div class="columns has-text-centered">
            <div class="column is-one-third">
              <p class="subtitle">
                <b>Initial supply</b>
              </p>
              <p class="subtitle currency">1,000,000</p>
            </div>
            <div class="column is-one-third">
              <p class="subtitle">
                <b>Minting price</b>
              </p>
              <p class="subtitle currency">0.01 AR / 1 DNO</p>
            </div>
            <div class="column is-one-third">
              <p class="subtitle">
                <b>Payout rate</b>
              </p>
              <p class="subtitle currency">1 DNO / 100 imports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero is-medium is-light">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered">
            <div class="column">
              <img
                src="https://raw.githubusercontent.com/nestdotland/nest.land/feat/pst-info/public/trade-diagram.svg"
                alt="World illustration"
              />
            </div>
            <div class="column">
              <h1 class="title section-title">Supported Exchanges</h1>
              <p class="subtitle">
                Anybody will be able to trade these tokens on
                <a
                  href="https://verto.exchange"
                  class="hyperlink"
                >Verto</a>, a new decentralized PST exchange.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GradientBar from "../components/GradientBar";

export default {
  components: {
    GradientBar,
  },
};
</script>

<style lang="sass" scoped>
@font-face
    font-family: 'JetBrainsMono'
    src: url('https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff2/JetBrainsMono-Regular.woff2') format('woff2'),
    url('https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/web/woff/JetBrainsMono-Regular.woff') format('woff'),
    url('https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono/ttf/JetBrainsMono-Regular.ttf') format('truetype')
    font-weight: 400
    font-style: normal

.gradient-text
    background: -webkit-linear-gradient(45deg, #22c1c3, #fdbb2d)
    background-clip: text
    -webkit-background-clip: text
    -webkit-text-fill-color: transparent

.back-arrow:hover
    background: none !important
    cursor: pointer !important

.currency
    font-family: "JetBrainsMono", sans-serif

.left-icon
    margin-right: 15px

li.subtitle
    font-family: "JetBrainsMono", sans-serif

.section-title
    margin-bottom: 35px !important

.verto-logo
    width: 25%
    max-width: 200px
    margin: 0 auto !important

.hyperlink
    color: #22c1c3 !important
    font-weight: 600
</style>