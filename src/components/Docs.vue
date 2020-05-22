<template>
    <div class="hero is-medium">
        <div class="hero-body">
            <div class="container">
                <h1 class="title" id="start">Getting Started</h1>
                <div class="columns is-multiline">
                    <div class="column is-half">
                        <p>
                            It's very easy to begin using DPM when pushing new Deno packages! You can install DPM with
                            Homebrew.
                        </p>
                    </div>
                    <div class="column is-half">
                        <pre><code>$ brew install dpm</code></pre>
                    </div>
                    <div class="column is-half">
                        <p>
                            Following installation, just navigate to the root of your package and use the command shown!
                        </p>
                    </div>
                    <div class="column is-half">
                        <pre><code>$ dpm publish [package name] [index file] [version] [password]</code></pre>
                    </div>
                </div>
                <p>
                    And that's it! After this, you'll be returned a link that you can use directly in your Deno projects! Your package
                    will also be added to the package lists on our servers, so other users will be able to find it!
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Docs"
    }
</script>

<style scoped>

</style>