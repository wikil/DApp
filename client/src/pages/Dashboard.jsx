import React,{useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Grid, Container, Typography, Link} from '@mui/material'
import {AuthContext} from '../context/AuthContext'
import {ContractContext} from '../context/ContractContext'
import QuestionList from '../components/QuestionList'
import Button from '@mui/material/Button'
import {ReactComponent as DashboardTopVector} from '../static/assets/Dashboard_Top.svg'
import '../static/styles/Dashboard.scss'

function Dashboard() {

  const {account, authenticated} = React.useContext(AuthContext)
  const {Services} = React.useContext(ContractContext)
  const navigate = useNavigate()

  const [name, setName] = useState()
  const [loading, setLoading] = useState(false)
  
  const getDetails = async()=>{
    if(!Services || !account) return

    const response = await Services.get_user_details(account)   
    setName(response.data.user.name)
  }

  useEffect(() => {
    setLoading(true)
    getDetails();
    setLoading(false)
  },[account, Services])

  return (
    loading? <p>Loading...</p>:
  <>
    <Container maxWidth={false} className='dashboard'>
      <Grid container spacing={8} className="dashboard-top" justifyContent="center">
        <Grid item lg={8.5} sm={8.5}>
          <Typography variant="h3" className="dashboard-top-text">欢迎： <strong>{name}</strong> </Typography>
          {/* <Typography variant="p" fontSize="large">
          "信息就是力量。但就像所有力量一样，有些人只想占为己有。世界上所有的科学和文化遗产，已在书籍和期刊上发布了数个世纪，正渐渐地被少数私有的公司数字化并上锁。那些能够获取这些资源的人，你有责任将它与世界分享"
          </Typography> */}
          <Typography variant="p" fontSize="large">
          这是一个去中心化的问答社区，每个人都拥有创作的真正所有权, 你的点赞和打赏将会决定内容的生命期哦！
          </Typography>
          {/* <Typography variant="p" fontSize="large">
          "书写出来并不是为了藏在高墙之后，而是为了向世界传播，激励和启发世人"
          </Typography> */}
        </Grid>
        {/* <Grid item lg={4} sm={12}> <DashboardTopVector className="dashboard-top-vector"></DashboardTopVector> </Grid> */}
      </Grid>
      <Container justifyContent='center' className='dashboard-mid' maxWidth="md">
        <Typography variant='h5' textAlign='center'>
          {/* 有疑惑吗? */}
          <Button href="/new" fontSize='1.5em' variant='contained' underline="none" fontWeight="bold" className="dashboard-mid-link" > 发布问题</Button>
          {/* <Link href="/new" underline="none" fontWeight="bold" className="dashboard-mid-link"> 发起你的问题</Link> */}
          {/* <br/> */}
          {/* 或者贡献你的智慧！ */}
        </Typography>
      </Container>
      <QuestionList></QuestionList>
    </Container>
  </>
  )
}

export default Dashboard