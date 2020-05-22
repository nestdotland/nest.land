<template>
    <footer class="footer has-background-dark">
        <div class="content has-text-centered has-text-white">
            <p>
                <b>DPM</b> by <a href="https://github.com/tbaumer22">Tate Berenbaum</a> and Oscar Davies.<br>
                Made with Vue, Arweave, and Bulma for Deno.
            </p>
            <p>
                The <a href="https://github.com/tbaumer22/dpm">source code</a> is licensed <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
            </p>
        </div>
    </footer>
</template>

<script>
    export default {
        name: "DPMFooter"
    }
</script>

<style scoped>
    a, a:hover {
        color: white;
    }
</style>