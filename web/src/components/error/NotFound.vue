<template>

  <div class="NotFound">

    <div class="hero is-light nest-footprints-hero">

      <div class="hero-head">

        <nest-nav />

      </div>

      <div class="hero-body">

        <div class="container">

          <img :src="notFoundIcon" class="NotFoundIcon" alt="not found icon">
          <h1 class="title has-text-centered">404 Not found</h1>
          <p class="subtitle">This is not the page you're looking for. Maybe try our <router-link to="/docs">documentation</router-link>?</p>

        </div>

      </div>

    </div>

  </div>
  
</template>

<script>

  import notFoundIcon from '../../assets/nest_question.png'
  import NestNav from '../Nav'

  export default {

    name: 'NotFound',
    components: {

      NestNav

    },
    computed: {

      notFoundIcon: () => notFoundIcon

    }

  }

</script>

<style lang="sass" scoped>

  .NotFound
    height: 60em

    .hero
      height: 100%
      position: relative

    .hero-body
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)

      img.NotFoundIcon
        height: 75px
        margin: 0 auto 20px
        display: block

      p.subtitle
        text-align: center
        text-shadow: -1px 9px 8px rgba(50, 50, 93, 0.12), 0 5px 15px rgba(0, 0, 0, 0.18)

        a
          color: #00947e !important
          text-shadow: -1px 9px 8px rgba(0, 148, 126, 0.12), 0 5px 15px rgba(0, 148, 126, 0.18)

</style>