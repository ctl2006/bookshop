import axios from 'axios'

const request = axios.create({
  baseURL: 'https://personal-project.cloud:8080/homework' 
})
export default request // 导出，其他组件能用到