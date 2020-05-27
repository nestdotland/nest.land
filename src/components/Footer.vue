<template>
  <footer class="footer has-background-dark">
    <div class="content has-text-centered has-text-white">
      <p>
        <b>Nest.land</b> by
        <a href="https://github.com/tbaumer22">tbaumer22</a> and
        <a href="https://github.com/zorbyte">zorbyte</a>.
        <br />Made with
        <font-awesome-icon :icon="['fa', 'heart']" />, Arweave, Vue, and Bulma for Deno.
      </p>
      <p>
        The
        <a href="https://github.com/nestlandgh/nest.land">source code</a> is licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
      </p>
      <p>
        <a href="https://github.com/nestlandgh/nest.land" class="footer-icon">
          <font-awesome-icon :icon="['fab', 'github']" />
        </a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "NestFooter"
};
</script>

<style scoped>
a,
a:hover {
  color: white;
}

.footer-icon {
  font-size: 1.5em;
}

.footer-icon-separator {
  margin-left: 15px;
}
</style>