<script setup lang="ts">
import ExampleCode from "$components/ExampleCode.md";
</script>

<template>
    <div class="flex flex-col items-center my-8 gap-4">
        <p class="text-2xl text-center font-bold">Example Code</p>

        <div class="bg-[#2f2f2f] rounded-2xl p-4">
            <ExampleCode />
        </div>

        <a
            href="/introduction/examples"
            class="bg-gradient-to-br from-pink-200 to-pink-300 rounded-2xl p-4 text-neutral-800 hover:scale-105 transition-all"
        >
            More Examples
        </a>
    </div>
</template>
