import React from 'react'
import {Typography, Container, Avatar,Link, Button} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShareIcon from '@mui/icons-material/Share';
import Utils from '../utils'
import { ContractContext } from '../context/ContractContext'

function QuestionBox({question}) {
  const date = new Date(question.created_on * 1000);
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  const expireDate = new Date(question.expire * 1000);
  const formattedExpireDate = `${expireDate.getFullYear()}-${(expireDate.getMonth() + 1).toString().padStart(2, '0')}-${expireDate.getDate().toString().padStart(2, '0')} ${expireDate.getHours().toString().padStart(2, '0')}:${expireDate.getMinutes().toString().padStart(2, '0')}:${expireDate.getSeconds().toString().padStart(2, '0')}`;

  
  const {DeQuora, Services} = React.useContext(ContractContext)
  const likeQuestion = async() =>{
    if(!Services) return

    const response = await Services.like_question(question.id)
  }
  const dividingQuestionBonusPool = async() =>{
    if(!Services) return

    const response = await Services.dividing_question_bonus_pool(question.id)
  }
  return (
    <Container maxWidth={false} className='question-box'>
      <Typography variant='h4' fontWeight='bold'>{question.question}</Typography>
      <Container maxWidth={false} className='info'>
        <span><Button onClick={likeQuestion}><ThumbUpIcon/></Button>  {question.likes}</span>
        {/* <span> <CalendarMonthIcon/> {Utils.DateConvertor(question.created_on)}</span> */}
        <span> <CalendarMonthIcon/>From {formattedDate} To {formattedExpireDate}</span>

        <span>
          <Avatar 
            src={`https://robohash.org/${question.author_address}`}
            sx={{ width: 24, height: 24 }}
            className='avatar'
          ></Avatar>
          <Link href={`/profile/${question.author_address}`} underline='none'>
            <Typography variant='p' fontSize='large' className='name'>{question.author_name}</Typography>
          </Link>
        </span>
        <span fontSize='1.5em'><Button onClick={dividingQuestionBonusPool}> <ShareIcon/>瓜分赏金 {question.bonus_pool /1000000}</Button></span>
      </Container>
    </Container>
  )
}

export default QuestionBox