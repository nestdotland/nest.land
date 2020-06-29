<template>
  <div class="hero is-medium nest-dots-hero">
    <div class="hero-body">
      <div class="container">
        <div class="card" id="testimonial-card">
          <div class="card-content">
            <img class="quotes" src="../../assets/quotes.png" alt="Quotes" />
            <p
              class="title is-3"
            >Nest.land's approach to solving a critical piece of the ecosystem is well thought out, and a pleasure to watch unfold.</p>
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img class="is-rounded" src="../../assets/jesper.jpg" alt="Jesper" />
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
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#testimonial-card {
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
      font-family: "PT Serif";
      font-style: italic;
      font-weight: 400;
      color: #616161;
    }
  }
}
</style>