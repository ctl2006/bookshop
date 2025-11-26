<template lang="">
        <!-- 购书清单开始 -->
        <div class="mt-5">
          购书清单
          <div class="my-5">
            <el-select v-model="data.order" placeholder="Select" style="width: 240px">
              <el-option :value="0" label="默认排序">默认排序</el-option>
              <el-option :value="2" label="价格降序">价格降序</el-option>
              <el-option :value="1" label="价格升序">价格升序</el-option>
            </el-select>
          </div>
        
          <el-table :data="pagedTableData1" stripe style="width: 80%">
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="name" label="书名" width="180" />
            <el-table-column prop="price" label="价格（元）" />
            <el-table-column prop="operation" label="操作" >
              <template #default="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope)"
                >
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-5">
              <el-pagination
                v-model:current-page="pagination1.currentPage"
                v-model:page-size="pagination1.pageSize"
                :page-sizes="[5, 10, 20, 30]"
                :size="size"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination1.total"
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
              />
          </div>
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
                  合计
                </div>
              </template>
              {{totalPrice1}} 元
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  书籍数量
                </div>
              </template>
              {{ pagination1.total }} 本
            </el-descriptions-item>
          </el-descriptions>
        </div>
        </div>
        
        <!-- 购书清单结束 -->

        <!-- 分割线 -->
         <el-divider />

         <!-- 输入框开始 -->
        <div class="flex h-auto items-center mt-10">
          <span>用户预算：</span>
          <el-input class="ml-5" v-model="data.input" style="width: 240px" placeholder="输入用户预算" />
          <el-button class="mx-5" type="primary" @click="search" size="large">最佳购书计划</el-button>
        </div>
        <!-- 输入框结束 -->

        <!-- 最佳购书清单开始 -->
        <div class="w-[40%] mt-5">
          <div class="flex">
      <!-- 1. 未满足优惠条件 -->
      <div 
        class="mr-5"
        :style="data.discountType === 0 ? { color: '#409eff', fontWeight: 'bold' } : { color: '#303133' }"
      >
        • 未满足优惠条件
      </div>
      <!-- 2. 满200减20 -->
      <div 
        class="mr-5"
        :style="data.discountType === 1 ? { color: '#409eff', fontWeight: 'bold' } : { color: '#303133' }"
      >
        • 满200减20
      </div>
      <!-- 3. 满500减100 -->
      <div 
        class="mr-5"
        :style="data.discountType === 2 ? { color: '#409eff', fontWeight: 'bold' } : { color: '#303133' }"
      >
        • 满500减100
      </div>
      <!-- 4. 满1000减300 -->
      <div 
        class="mr-5"
        :style="data.discountType === 3 ? { color: '#409eff', fontWeight: 'bold' } : { color: '#303133' }"
      >
        • 满1000减300
      </div>
    </div>
        </div>  
         <el-table :data="pagedTableData2" stripe style="width: 80%">
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="name" label="书名" width="180" />
            <el-table-column prop="price" label="价格（元）" />
          </el-table>

          <div class="mt-5">
              <el-pagination
                v-model:current-page="pagination2.currentPage"
                v-model:page-size="pagination2.pageSize"
                :page-sizes="[5, 10, 20, 30]"
                :size="size"
                :disabled="disabled"
                :background="background"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination2.total"
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
              />
          </div>

        <!-- 最佳购书清单结束 -->
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
                  合计
                </div>
              </template>
              {{data.totalPrice2}} 元
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  书籍数量
                </div>
              </template>
              {{ pagination2.total }} 本
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 底部开始 -->
        

</template>
<script setup>
import { reactive, computed , onMounted , watch } from 'vue'
import request from '@/utils/request'


const data = reactive({
  input: '',
  radio1: '1',
  order: 0,
  discountType: 0,
  shopcart: [],
  bestplan: [],
  totalPrice2: 0,
})

// 分页相关配置
const pagination1 = reactive({
  currentPage: 1,    // 当前页码
  pageSize: 5,     // 每页条数
  total: 0           // 总数据条数
})

const pagination2 = reactive({
  currentPage: 1,    // 当前页码
  pageSize: 5,     // 每页条数
  total: 0           // 总数据条数
})



onMounted(() => {
  // 调用“查购物车”接口
  request.get(`/shopcart/get?sortType=${data.order}`)
    .then(res => {
      if (res.data.code === 200) {
        // 把购物车数据放到tableData里
        data.shopcart = res.data.data.books
        pagination1.total = res.data.data.total
      } else {
        alert('系统异常，请稍后重试')
      }
    })
})

// 使用 reduce 累加价格
// reduce((累加器, 当前元素) => 累加逻辑, 初始值)
const totalPrice1 = computed(() => {
  return data.shopcart.reduce((sum, book) => sum + book.price, 0);
});




// 最佳购书事件处理
const search = () => {

  const budget = data.input
  
  request.get(`/shopcart/buy?budget=${budget}`)
    .then(function(res) {
      if (res.data.code === 200) {
        // 成功：把查到的书放到tableData里
        data.bestplan = res.data.data.books
        // 更新分页总条数
        pagination2.total = res.data.data.total
        //获取优惠类型
        data.discountType = res.data.data.discountType
        // 根据优惠类型，更新最佳购书清单

        // 计算总价格
        data.totalPrice2 = res.data.data.cost
      } else {
        alert('系统异常，请稍后重试')
      }
    })
}

// 移除购物车事件处理
const handleDelete = (scope) => {

  const bookId = scope.row.id
  
  request.get(`/shopcart/delete/${bookId}`)
    .then(function(res) {
      if (res.data.code === 200) {
        alert('移除成功')
        // 刷新购物车数据
        request.get('/shopcart/get')
          .then(res => {
            if (res.data.code === 200) {
              // 把购物车数据放到shopcart里
              data.shopcart = res.data.data.books
              pagination1.total = res.data.data.total
              
            } else {
              alert('系统异常，请稍后重试')
            }
          })
      } else {
        alert('系统异常，请稍后重试')
      }
    })
}

// 计算分页后的数据
const pagedTableData1 = computed(() => {
  // 计算起始索引和结束索引
  const startIndex = (pagination1.currentPage - 1) * pagination1.pageSize
  const endIndex = startIndex + pagination1.pageSize
  // 返回当前页的数据
  return data.shopcart.slice(startIndex, endIndex)
})
const pagedTableData2 = computed(() => {
  // 计算起始索引和结束索引
  const startIndex = (pagination2.currentPage - 1) * pagination2.pageSize
  const endIndex = startIndex + pagination2.pageSize
  // 返回当前页的数据
  return data.bestplan.slice(startIndex, endIndex)
})



// 分页事件处理
const handleSizeChange1 = (val) => {
  pagination1.pageSize = val
  pagination1.currentPage = 1
}
const handleSizeChange2 = (val) => {
  pagination2.pageSize = val
  pagination2.currentPage = 1
}

const handleCurrentChange1 = (val) => {
  pagination1.currentPage = val
}
const handleCurrentChange2 = (val) => {
  pagination2.currentPage = val
}

watch(() => data.order, () => {
  // 重新加载购物车
  request.get(`/shopcart/get?sortType=${data.order}`).then(res => {
    if (res.data.code === 200) {
      data.shopcart = res.data.data.books
    }
  })
})
</script>
<style lang="">

</style>