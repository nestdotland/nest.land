<template>
    <div class="hero is-medium">
        <div class="hero-body" id="featured">
            <div class="container">
                <h1 class="title">Featured Packages</h1>
                <div class="columns">
                    <div class="column is-3" v-for="item in items" v-bind:key="item.id">
                        <card v-bind:item="item"></card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Card from "./Card";

    export default {
        name: "FeaturedPackages",
        data() {
            return {
                items: [
                    {
                        packageTitle: 'Hello World',
                        packageURL: 'https://nest.land/x/bruh',
                        packageInfo: {
                            author: 'Nanny McFee',
                            docsLink: 'https://github.com/nannymcfee/helloworld',
                            description: 'A simple, easy to use hello world package!',
                            version: '1.0.1',
                            publishedDate: 'datetime object here'
                        }
                    },
                    {
                        packageTitle: 'Cheese',
                        packageURL: 'https://nest.land/x/bruh',
                        packageInfo: {
                            author: 'Oscar Davies',
                            docsLink: 'https://github.com/nannymcfee/helloworld',
                            description: 'A simple, easy to use hello world package!',
                            version: '1.0.1',
                            publishedDate: 'datetime object here'
                        }
                    },
                    {
                        packageTitle: 'a1',
                        packageURL: 'https://nest.land/x/bruh',
                        packageInfo: {
                            author: 'sauce',
                            docsLink: 'https://github.com/nannymcfee/helloworld',
                            description: 'A simple, easy to use hello world package!',
                            version: '1.0.1',
                            publishedDate: 'datetime object here'
                        }
                    },
                    {
                        packageTitle: 'yo',
                        packageURL: 'https://nest.land/x/bruh',
                        packageInfo: {
                            author: 'mama',
                            docsLink: 'https://github.com/nannymcfee/helloworld',
                            description: 'A simple, easy to use hello world package!',
                            version: '1.0.1',
                            publishedDate: 'datetime object here'
                        }
                    },
                ]
            }
        },
        components: {
            Card
        }
    }
</script>

<style scoped>
    #featured {
        margin-bottom: 0;
        padding-bottom: 0;
    }
</style>