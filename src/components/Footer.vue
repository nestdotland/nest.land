<template>
  <footer class="footer has-background-dark" id="symmetric-footer">
    <div class="content has-text-white">
      <div class="container">
        <div class="is-hidden-tablet">
          <figure class="image is-64x64" style="margin: 0 auto;">
            <img src="/images/nest.land/logo_dark.svg" />
          </figure>
        </div>
        <div class="columns">
          <div class="column is-8 footer-left is-hidden-mobile">
            <figure class="image is-64x64">
              <img src="/images/nest.land/logo_dark.svg" />
            </figure>
            <p class="subtitle is-6 has-text-white">
              A platform by
              <a href="https://github.com/t8"> <b>t8</b> </a>,
              <a href="https://github.com/zorbyte"> <b>zorbyte</b> </a>,
              <a href="https://github.com/justablob"> <b>blob</b> </a>, &
              <a href="https://github.com/nestdotland/nest.land#credits">
                <b>friends</b>
              </a>
              .
            </p>
            <p class="subtitle is-6 has-text-white">
              Made with
              <font-awesome-icon
                :icon="['fa', 'heart']"
                v-show="!isCheese"
                @click="isCheese = !isCheese"
              />
              <span v-show="isCheese">🧀</span>
              &nbsp; for the Deno community.
            </p>
          </div>
          <div class="column is-4 footer-right">
            <div class="vercel-container">
              <div id="powered-by">Powered by</div>
              <a href="https://vercel.com?utm_source=nest-land">
                <svg
                  width="283"
                  height="34"
                  viewBox="0 0 283 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
                    fill="#fff"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <hr class="is-hidden-mobile" />
        <p class="subtitle is-6 has-text-white has-text-centered">
          nest.land is licensed under the
          <a href="http://opensource.org/licenses/mit-license.php">
            <b>MIT License</b>
          </a>
          .
        </p>
        <p class="has-text-centered">
          <a
            href="https://github.com/nestdotland/nest.land"
            class="footer-icon"
          >
            <font-awesome-icon :icon="['fab', 'github']" />
          </a>
          <span class="footer-icon-separator"></span>
          <a href="https://twitter.com/nestdotland" class="footer-icon">
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </a>
          <span class="footer-icon-separator"></span>
          <a
            href="https://viewblock.io/arweave/address/tySYSW93nDky1sbCO56PmyEyspbyYx7x9ZXMNueKOOg"
            class="footer-icon"
          >
            <font-awesome-icon :icon="['fas', 'cubes']" />
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "NestFooter",
  data() {
    return {
      isCheese: false
    };
  }
};
</script>

<style lang="sass" scoped>

#symmetric-footer
  padding: 3rem 1.5rem

a, a:hover
  color: white

.footer-left

  .image
    float: left
    margin: 0 25px 0 0

  p:not(:first-child)
    margin-bottom: 5px
    margin-top: 3px

.footer-right

  .vercel-container
    float: right
    display: flex
    align-items: center
    justify-content: center

    #powered-by
      text-align: right
      margin-right: 10px
      margin-top: 10px

    svg
      width: 100px
      float: right

    @media screen and (max-width: $mobileScreenMaxWidth)
      float: none
      margin: 0 auto

      svg
        float: none

hr
  width: 5%
  min-width: 30px
  margin: 25px auto
  background: rgb(34, 193, 195)
  background: -moz-linear-gradient(90deg, rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%)
  background: -webkit-linear-gradient(90deg, rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%)
  background: linear-gradient(90deg, rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%)

.footer-icon
  font-size: 1.5em

.footer-icon-separator
  margin-left: 15px
</style>
