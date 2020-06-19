<template>

  <div class="Documentation">

    <div class="NavContainer">

      <div class="greyBg" :style="{ width: docsNavWidth + 'px' }"></div>
      <nest-nav />

    </div>

    <div class="DocsContent">

      <div class="DocsNav" ref="docsNav">

        <div class="DocsNavContent">

          <a href="/docs" class="Title">Documentation</a>

          <ul>

            <li v-for="topicItem in topics" :key="topicItem.id">

              <router-link :to="'/docs#' + topicItem.id" :class="{ active: topicItem.id === activeTopic }">{{ topicItem.innerText | removeHash }}</router-link>

            </li>

          </ul>

        </div>

      </div>

      <div class="DocsContainer">

        <vue-markdown :source="docsData" :toc="true" :toc-anchor-link-space="false" ref="docsContent" class="Markdown" />

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
    data () {

      return {

        docsNavWidth: 0,
        activeTopic: '',
        topics: []

      }

    },
    computed: {

      docsData () {

        return docsData

      }

    },
    filters: {

      removeHash (val) {

        return val.replace('#', '')

      }

    },
    methods: {

      updateDocsNavWidth () {

        this.docsNavWidth = this.$refs.docsNav.offsetWidth

      },
      scroll () {

        for (const el of this.$refs.docsContent.$el.childNodes)
          if(el.tagName !== undefined && el.tagName.toLowerCase() === 'h1') {

            const { top, left, right, bottom } = el.getBoundingClientRect()

            if(
              top >= 0 &&
              left >= 0 &&
              right <= (window.innerWidth || document.documentElement.clientWidth) &&
              bottom <= (window.innerHeight || document.documentElement.clientHeight)
            ) {

              this.activeTopic = el.id
              break

            }

          }

      }

    },
    created () {

      window.addEventListener('resize', this.updateDocsNavWidth)
      window.addEventListener('scroll', this.scroll)

    },
    destroyed () {

      window.removeEventListener('resize', this.updateDocsNavWidth)
      window.removeEventListener('scroll', this.scroll)

    },
    mounted () {

      //update the grey part of the nav overlay on resize
      this.updateDocsNavWidth()
      this.scroll()
      this.topics = Array.from(this.$refs.docsContent.$el.childNodes).filter(el => {

        return (el.tagName !== undefined && el.tagName.toLowerCase() === 'h1')

      })

    }

  }

</script>

<style lang="sass" scoped>

  .Documentation
    .NavContainer
      position: relative

      .greyBg
        position: absolute
        z-index: 1;
        background-color: #f5f5f5
        height: 100%

      .navbar
        z-index: 10;
        background-color: transparent

    .DocsContent
      $topPadding: 35px
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

          .Title
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

                &.active
                  color: #00947e

                  &::before
                    width: 4px
                    background-color: #00947e

      .DocsContainer
        width: 70vw
        padding: $topPadding 3.5%

        .Markdown::v-deep

          h1, h2, h3, h4, h5, h6
            position: relative
            display: block

          .toc-anchor
            color: #cccccc
            position: absolute
            left: -30px
            transition: all .3s

            &:hover
              color: #00947e

          a
            color: #00947e

          h1
            font-size: 2em
            margin: .67em 0

          h2
            font-size: 1.5em
            margin: .83em 0

          h3
            font-size: 1.17em
            margin: 1em 0

          h4
            font-size: 1em
            margin: 1.33em 0
            font-weight: 600

          h5
            font-size: .83em
            margin: 1.67em 0

          h6
            font-size: .67em
            margin: 2.33em 0

          p
            margin: 1em 0

          blockquote
            padding: .67em 14px
            border-left: 4px solid rgba(#00947e, .65)
            margin: .67em 0
            background-color: rgba(#f5f5f5, .6)

            p
              margin: 0
              opacity: .9

          table
            border-collapse: collapse
            border-style: hidden
            margin-bottom: 20px

            td, th
              border: 1px solid #dbdbdb
              padding: 6px 20px

          code
            color: #4a4a4a

          pre
            margin: 10px 0

            code.language-shell
              padding-left: 25px
              position: relative
              color: currentColor

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