<template lang="">
 <!-- 输入框开始 -->
        <div class="flex">         
          <el-input class="mr-5" v-model="data.input" style="width: 240px" placeholder="输入书名查询" />
          <el-radio-group v-model="data.radio1">
            <el-radio value="0" size="large">精确</el-radio>
            <el-radio value="1" size="large">模糊</el-radio>
          </el-radio-group>
          <el-button class="mx-5" type="primary" @click="search" size="large">查询</el-button>
        </div>
        <!-- 输入框结束 -->

        <!-- 查询列表开始 -->
        <div class="mt-5">
        <el-select v-model="data.order" placeholder="Select" style="width: 240px">
          <el-option :value="0" label="默认排序">默认排序</el-option>
          <el-option :value="2" label="价格降序">价格降序</el-option>
          <el-option :value="1" label="价格升序">价格升序</el-option>
        </el-select>
          <el-table :data="pagedTableData" stripe style="width: 80%">
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="name" label="书名" width="180" />
            <el-table-column prop="price" label="价格（元）" />
            <el-table-column prop="operation" label="操作" >
              <template #default="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="handleAdd(scope)"
                  :disabled="isInShopcart(scope.row.id)"
                >
                  加入清单
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
        
        
        <!-- 查询列表结束 -->

</template>
<script setup>
import { ref, reactive, computed , onMounted , watch } from 'vue'
import request from '@/utils/request'
import { id } from 'element-plus/es/locales.mjs'


const data = reactive({
  input: '',
  budget: '',
  radio1: '0',
  order: 0,
  tableData: [],
  isSearching: false, // 标记是否正在搜索
  addedBookIds: [], // 购物车里的书的ID列表
})

// 分页相关配置
const pagination = reactive({
  currentPage: 1,    // 当前页码
  pageSize: 5,     // 每页条数
  total: 0           // 总数据条数
})

// 页面刚打开时，自动执行这个函数
onMounted(() => {
  // 先获取购物清单数据，提取已加入的书籍ID
  request.get(`/shopcart/get?sortType=${data.order}`)
    .then(shopcartRes => {
      if (shopcartRes.data.code === 200) {
        // 提取所有购物清单中书籍的ID
        data.addedBookIds = shopcartRes.data.data.books.map(book => book.id)
      }
    })
    .catch(err => {
      console.log('获取购物清单失败', err)
    })
    .finally(() => {
      // 无论购物清单是否获取成功，都加载所有书籍
      // 调用后端“查所有书”的接口
      request.get(`/get/all?sortType=${data.order}`)
        .then(function(res) {
          // 后端返回数据后，先看有没有成功
          if (res.data.code === 200) {
            // 成功了！把后端给的真实书数据，放到页面的tableData里（替换假数据）
            data.tableData = res.data.data.books
            // 把后端给的“总书数”，放到分页的total里（让分页显示正确页数）
            pagination.total = res.data.data.total  
            // 排序
            data.order
          } else {
            // 失败了，弹个提示
            alert('系统异常，请稍后重试')
          }
        })
    })
})

// 判断书籍是否已加入购物清单
const isInShopcart = (bookId) => {
  return data.addedBookIds.includes(bookId)
}


// 查询按钮点击事件
const search = () => {
  // 标记正在搜索
  data.isSearching = true
  // 1. 拿你输入的书名
  const bookName = data.input
  // 2. 拿你选的“精确/模糊”（0=精确→对应后端type=0；1=模糊→对应后端type=1）
  const searchType = data.radio1 === '0' ? 0 : 1
  const sortType = data.order
  request.get(`/find?name=${bookName}&type=${searchType}&sortType=${sortType}`)
    .then(function(res) {
      if (res.data.code === 200) {
        // 成功：把查到的书放到tableData里
        data.tableData = res.data.data.books
        // 更新分页总条数
        pagination.total = res.data.data.total
      } else {
        alert('系统异常，请稍后重试')
      }
    })
}

// 计算分页后的数据
const pagedTableData = computed(() => {
  // 计算起始索引和结束索引
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize
  const endIndex = startIndex + pagination.pageSize
  // 返回当前页的数据
  return data.tableData.slice(startIndex, endIndex)
})

// 加入清单按钮点击事件
const handleAdd = (scope) => {
  // 1. 拿当前点击那本书的ID（scope.row.id就是表格里这本书的ID，不用改）
  const bookId = scope.row.id
  // 2. 调用后端“加入购物车”的接口
  request.get(`/shopcart/add/${bookId}`)
    .then(function(res) {
      if (res.data.code === 200) {
        alert('加入清单成功')
        // 将刚加入的书籍ID添加到数组，实时禁用按钮
        data.addedBookIds.push(bookId)
      } else {
        alert('系统异常，请稍后重试')
      }
    })
}

// 分页事件处理
const handleSizeChange = (val) => {
  pagination.pageSize = val
  // 页码重置为1
  pagination.currentPage = 1
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
}

watch(() => data.order, () => {
  if (data.isSearching && data.input.trim()) {
    // 如果正在搜索，就重新执行搜索（带当前排序）
    search()
  } else {
    // 否则才是查全部
    request.get(`/get/all?sortType=${data.order}`).then(res => {
      if (res.data.code === 200) {
        data.tableData = res.data.data.books
        pagination.total = res.data.data.total
      }
    })
  }
})
</script>
<style lang="">
  
</style>