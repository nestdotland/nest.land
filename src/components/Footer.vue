<template>
    <footer class="footer has-background-dark">
        <div class="content has-text-centered has-text-white">
            <p>
                <b>Nest.land</b> by <a href="https://github.com/tbaumer22">Tate Berenbaum</a> and Oscar Davies.<br>
                Made with <font-awesome-icon :icon="['fa', 'heart']" />, Arweave, Vue, and Bulma for Deno.
            </p>
            <p>
                The <a href="https://github.com/tbaumer22/dpm">source code</a> is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
            </p>
            <p>
                <a href="https://github.com/tbaumer22/nest.land">
                    <font-awesome-icon :icon="['fab', 'github']" />
                </a>
                <span class="footer-icon-separator"></span>
                <a href="">
                    <font-awesome-icon :icon="['fab', 'discord']" />
                </a>
            </p>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "NestFooter"
    }
</script>

<style scoped>
    a, a:hover {
        color: white;
    }

    .footer-icon-separator {
        margin-left: 15px;
    }
</style>