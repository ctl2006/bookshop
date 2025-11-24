<template>
<div>
    <el-container>

      <!-- 网页标题开始 -->
      <el-header class=" h-60px text-center flex">
        <!-- logo开始 -->
        <div class= "bg-gray-200 text-xl flex items-center mr-10">二手书交易平台</div>
        <!-- logo结束 -->

        <!-- 头部导航栏开始 -->
        <div class="h-full">
          <el-menu
            :default-active="route.path"
            router
            :ellipsis="false"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            >
              <el-menu-item index="/">首页</el-menu-item>
              <el-menu-item index="/plan">购书计划</el-menu-item>
          </el-menu>
        </div>
        <!-- 头部导航栏结束 -->
        </el-header>
      <!-- 网页标题结束 -->

      <!-- 网页内容开始 -->
      <el-main class="flex-1">
        <router-view />
       
      </el-main>
      <!-- 网页内容结束 -->

    </el-container>
  </div>

</template>

<script setup>
import { reactive , computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()





</script>

<style scoped>

</style>
