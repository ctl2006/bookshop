import axios from 'axios'

const request = axios.create({
  baseURL: 'http://129.204.4.160:8080/homework' 
})
export default request // 导出，其他组件能用到