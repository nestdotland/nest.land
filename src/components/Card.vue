<template>
    <div class="card">
        <header class="card-header">
            <p class="card-header-title">
                <span>
                    {{ item.packageTitle }}
                </span>
            </p>
        </header>
        <div class="card-content">
            <div class="content">
                <p>
                    {{ item.packageInfo.description }}
                </p>
                <p>
                    By: {{ item.packageInfo.author }}
                </p>
            </div>
        </div>
        <footer class="card-footer">
            <a :href="item.packageURL" class="card-footer-item">Package URL</a>
            <a :href="item.packageInfo.docsLink" class="card-footer-item">Docs</a>
        </footer>
    </div>
</template>

<script>
    export default {
        name: "Card",
        props: [
            'item'
        ]
    }
</script>

<style scoped>
    .card {
        border-radius: 20px;
        box-shadow: lightgray 0 0 15px;
        transition: transform 0.2s;
    }
    .card:hover {
        transform: translateY(-10px);
        transition: transform 0.2s;
    }
    .card-header {
        border-radius: 20px 20px 0 0;
    }
    .card-header-title span {
        margin: auto;
    }
</style>