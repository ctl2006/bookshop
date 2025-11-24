<template lang="">
        <!-- 购书清单开始 -->
        <div class="mt-5">
          购书清单
          <el-table :data="pagedTableData" stripe style="width: 80%">
            <el-table-column prop="date" label="ID" width="180" />
            <el-table-column prop="name" label="书名" width="180" />
            <el-table-column prop="price" label="价格（元）" />
            <el-table-column prop="operation" label="操作" >
              <template #default="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleAdd"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-5">
              <el-pagination
                v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[5, 10, 20, 30]"
                :size="size"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
          </div>
        </div>
        
        <!-- 购书清单结束 -->

         <!-- 输入框开始 -->
        <div class="flex h-auto items-center mt-10">
          <span>用户预算：</span>
          <el-input class="ml-5" v-model="data.input" style="width: 240px" placeholder="输入用户预算" />
          <el-button class="mx-5" type="primary" @click="search" size="large">最佳购书计划</el-button>
        </div>
        <!-- 输入框结束 -->

        <!-- 最佳购书清单开始 -->
         <el-table :data="pagedTableData" stripe style="width: 80%">
            <el-table-column prop="date" label="ID" width="180" />
            <el-table-column prop="name" label="书名" width="180" />
            <el-table-column prop="price" label="价格（元）" />
          </el-table>

          <div class="mt-5">
              <el-pagination
                v-model:current-page="pagination.currentPage"
                v-model:page-size="pagination.pageSize"
                :page-sizes="[5, 10, 20, 30]"
                :size="size"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
          </div>

        <!-- 最佳购书清单结束 -->


        <!-- 底部开始 -->
        <div>
          <el-descriptions
            class="mt-10 w-[80%]"
            :column="3"
            :size="size"
            border
          >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <user />
                  </el-icon>
                  合计
                </div>
              </template>
              150元
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  <el-icon :style="iconStyle">
                    <iphone />
                  </el-icon>
                  书籍数量
                </div>
              </template>
              5
            </el-descriptions-item>
          </el-descriptions>
        </div>

</template>
<script setup>
import { ref, reactive, computed } from 'vue'


const data = reactive({
  input: '',
  radio1: '1',
  tableData: []
})

// 分页相关配置
const pagination = reactive({
  currentPage: 1,    // 当前页码
  pageSize: 5,     // 每页条数
  total: 0           // 总数据条数
})

onMounted(() => {
  // 调用“查购物车”接口
  request.get('/shopcart/get')
    .then(res => {
      if (res.data.code === 200) {
        // 把购物车数据放到tableData里
        data.tableData = res.data.data
        pagination.total = res.data.total
      } else {
        alert('系统异常，请稍后重试')
      }
    })
})


// 计算分页后的数据
const pagedTableData = computed(() => {
  // 计算起始索引和结束索引
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize
  const endIndex = startIndex + pagination.pageSize
  // 返回当前页的数据
  return data.tableData.slice(startIndex, endIndex)
})

// 初始化总条数
pagination.total = data.tableData.length

// 分页事件处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  // 页码重置为1
  pagination.currentPage = 1
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
}
</script>
<style lang="">
  
</style>