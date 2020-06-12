<template>
  <footer class="footer has-background-dark" id="symmetric-footer">
    <div class="content has-text-centered has-text-white">
      <p>
        <b>nest.land</b> by
        <a href="https://github.com/tbaumer22">tbaumer22</a>,&nbsp;
        <a href="https://github.com/zorbyte">zorbyte</a>,&nbsp; & &nbsp;
        <a href="https://github.com/justablob">blog</a>.
        <br />Made with
        <font-awesome-icon
          :icon="['fa', 'heart']"
          v-show="!isCheese"
          @click="isCheese = !isCheese"
        />
        <span v-show="isCheese">🧀</span>
        &nbsp; for Deno.
      </p>
      <p>
        nest.land is licensed under the
        <a
          href="http://opensource.org/licenses/mit-license.php"
        >MIT License</a>.
      </p>
      <p>
        <a href="https://github.com/nestlandofficial/nest.land" class="footer-icon">
          <font-awesome-icon :icon="['fab', 'github']" />
        </a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "NestFooter",
  data() {
    return {
      isCheese: false,
    };
  },
};
</script>

<style scoped>
#symmetric-footer {
  padding: 3rem 1.5rem;
}

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