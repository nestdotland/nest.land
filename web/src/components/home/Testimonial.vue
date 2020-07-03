<template>
  <div class="hero is-medium nest-dots-hero">
    <div class="hero-body">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div class="card testimonial-card">
              <div class="card-content">
                <img class="quotes" src="../../assets/quotes.png" alt="Quotes" />
                <p
                  class="title is-3"
                >Nest.land's approach to solving a critical piece of the ecosystem is well thought out, and a pleasure to watch unfold.</p>
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img class="is-rounded" src="../../assets/noehr.jpg" alt="Jesper" />
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-4">Jesper Noehr</p>
                    <p class="subtitle is-6">Founder of Bitbucket</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="column">
            <div class="card testimonial-card">
              <div class="card-content">
                <img class="quotes" src="../../assets/quotes.png" alt="Quotes" />
                <p
                  class="title is-3"
                >Blockchains are the only way we know of to enable fully decentralized package registries, a concept long overdue for some proper exploration with nest.land.</p>
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-48x48">
                      <img class="is-rounded" src="../../assets/bedford.webp" alt="Jesper" />
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-4">Guy Bedford</p>
                    <p class="subtitle is-6">Founder of jspm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.testimonial-card {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;

  .card-content {
    padding: 60px;

    .quotes {
      width: 70px;
      position: absolute;
      left: -15px;
      top: -15px;
    }

    .title.is-3 {
      line-height: 1.5;
      font-family: "PT Serif", Georgia, serif;
      font-style: italic;
      font-weight: 400;
      color: #616161;

      @media only screen and (max-width: 768px) {
        font-size: 1.6em;
        line-height: 1.3;
      }
    }

    .media-content {
      overflow: hidden;
      @media only screen and (max-width: 768px) {
        .title.is-4 {
          font-size: 1em;
          margin-top: 5px;
        }

        .subtitle.is-6 {
          font-size: 0.8em;
        }
      }
    }
  }
}
</style>
