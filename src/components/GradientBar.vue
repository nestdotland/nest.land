<template>
    <hr>
</template>

<script>
    export default {
        name: "GradientBar"
    }
</script>

<style scoped>
    hr {
        background: linear-gradient(271deg, #22c1c3, #fdbb2d);
        background-size: 400% 400%;

        -webkit-animation: dpmGradient 6s ease infinite;
        -moz-animation: dpmGradient 6s ease infinite;
        animation: dpmGradient 6s ease infinite;
        height: 25px;
        margin: 0;
        padding: 0;
    }
    @-webkit-keyframes dpmGradient {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }
    @-moz-keyframes dpmGradient {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }
    @keyframes dpmGradient {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
    }
</style>