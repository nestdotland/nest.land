<template>

  <div class="Documentation">

    <nest-nav />

    <div class="DocsContent">

      <div class="DocsNav">

        <div class="DocsNavContent">

          <h1>Documentation</h1>

          <ul>

            <li>

              <router-link to="/docs/" class="HomeLink" exact>Home</router-link>

            </li>

            <li>

              <router-link to="/docs/test">Test</router-link>

            </li>

          </ul>

        </div>

      </div>

      <div class="DocsContainer">

        <vue-markdown :source="docsData" :toc="true" :toc-anchor-link-space="false" class="Markdown" />

      </div>

    </div>

  </div>
  
</template>

<script>

  import VueMarkdown from 'vue-markdown'
  import NestNav from '../Nav'
  import docsData from '../../assets/docs/DOCUMENTATION.md'

  export default {

    name: 'Documentation',
    components: {

      NestNav,
      VueMarkdown

    },
    props: {

      page: {

        type: String

      }

    },
    computed: {

      docsData () {

        return docsData

      }

    },
    mounted () {

      console.log(this.$route.params)

    }

  }

</script>

<style lang="sass" scoped>

  .Documentation
    .navbar
      position: fixed
      background-color: transparent
      top: 0
      left: 0
      right: 0

    .DocsContent
      $topPadding: 65px
      display: flex
      align-items: stretch

      .DocsNav
        $width: 30vw
        width: $width
        position: relative
        padding: $topPadding 15px $topPadding $width / 4
        background-color: #f5f5f5

        .DocsNavContent
          position: fixed

          h1
            font-size: 1.8em
            color: rgba(0, 0, 0, .7)
            font-weight: 600
            margin-bottom: 35px

          ul
            li
              margin: 5px 0

              a
                position: relative
                font-size: 1em
                padding-left: 25px
                color: rgba(0, 0, 0, .7)
                transition: color .3s

                &::before
                  content: ''
                  position: absolute
                  top: 0
                  bottom: 0
                  left: 0
                  width: 0
                  transition: width .12s, color .3s

                &:hover
                  color: rgba(0, 0, 0, .9)

                &.router-link-active
                  color: #00947e

                  &::before
                    width: 4px
                    background-color: #00947e

      .DocsContainer
        width: 70vw
        padding: $topPadding 25px

        .Markdown::v-deep
          pre code.language-shell
            padding-left: 25px
            position: relative

            &::before
              content: '$'
              color: #00947e
              font-size: 1.2em
              font-weight: 500
              position: absolute
              top: 50%
              left: 0
              transform: translateY(-50%)

</style>