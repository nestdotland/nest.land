<template>
    <div class="hero is-medium">
        <div class="hero-body" id="intro">
            <div class="container">
                <h1 class="title">What is DPM?</h1>
                <div class="columns">
                    <div class="column is-5">
                        <figure class="image is-128x128" id="deno-img">
                            <a href="https://deno.land/">
                                <img src="../assets/deno.png">
                            </a>
                        </figure>
                    </div>
                    <div class="column is-2 has-text-centered">
                        <h1 class="title is-1" id="plus">+</h1>
                    </div>
                    <div class="column is-5">
                        <figure class="image is-128x128" id="arweave-img">
                            <a href="https://www.arweave.org/">
                                <img src="../assets/arweave.png">
                            </a>
                        </figure>
                    </div>
                </div>
                <hr>
                <div class="columns">
                    <div class="column is-half">
                        <p>
                            DPM combines the best of Node.js and TypeScript with the Arweave Permaweb. With DPM, you can
                            push Deno packages to the permaweb, where they can never be deleted. This avoids a major pitfall
                            for web-based package imports while allowing the developer to maximize on the potential of Deno.
                        </p>
                    </div>
                    <div class="column is-half">
                        <ul>
                            <li class="subtitle">
                                <span>🚯</span>Impossible to delete or remove
                            </li>
                            <li class="subtitle">
                                <span>🔓</span>Easily accessible
                            </li>
                            <li class="subtitle">
                                <span>☁️</span>Easy to push packages
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Intro"
    }
</script>

<style scoped>
    .tools-images {
        width: 10%;
    }
    #plus {
        padding-top: 30px;
    }
    #deno-img {
        float: right;
        transition: transform 0.2s;
    }
    #arweave-img {
        float: left;
        transition: transform 0.2s;
    }
    #deno-img:hover, #arweave-img:hover {
        transition: transform 0.2s;
        transform: translateY(-15px);
    }
    .subtitle span {
        font-size: 1.2em;
        padding-right: 10px;
    }
    #intro {
        margin-bottom: 0;
        padding-bottom: 0;
    }
</style>