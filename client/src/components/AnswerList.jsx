import React from 'react'
import {Container, Grid, Typography, Avatar, Link, Button} from '@mui/material'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Utils from '../utils'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import {ContractContext} from '../context/ContractContext'

function Answer({answer}){
  const {DeQuora, Services} = React.useContext(ContractContext)
    const likeAnswer = async() =>{
        if(!Services) return
        const response = await Services.like_answer(answer.question_id, answer.id)
    }

    const tipAnswer = async() =>{
      if(!Services) return
      const response = await Services.tip_answer(answer.question_id, answer.id)
    }

    const date = new Date(answer.created_on * 1000);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;


  return(
    <Container className='answer'>
      <Grid container spacing={2}>
        <Grid item lg={12} className='answer-author'>
          <Avatar 
            src={`https://robohash.org/${answer.author_address}`}
            sx={{ width: 27, height: 27 }}
            className='avatar'
          ></Avatar>
          <Link href={`/profile/${answer.author_address}`} underline='none'>
            <Typography variant='p' fontSize='1.2em' className='name'>{answer.author_name}</Typography>
          </Link>
        </Grid>
        <Grid item lg={12} className='answer-body' fontSize='1.2em'>
          {answer.answer}
        </Grid>
        <Grid item container lg={12} className='answer-info'>
          <Grid item lg={2} style={{marginTop:'10px'}}> <Button onClick={likeAnswer}><ArrowCircleUpIcon/></Button>  {answer.likes}</Grid>  
          <Grid item lg={9} style={{marginTop:'10px'}} fontSize='1.0em' ><CalendarMonthIcon /> {formattedDate}</Grid>
          <Grid item lg={1}>
            <Button variant='contained' fontSize='1.2em' onClick={tipAnswer}>{answer.bonus/100000} ETH</Button>
          </Grid>  
        </Grid>
      </Grid>
    </Container>
  )
}


function AnswerList({answers}) {
  return (
    <Container maxWidth={false} className='question-answer-list'>
      <Typography variant='h5' fontWeight='bold'>{answers && answers.length} 回答数</Typography>
      <hr />
      {answers && answers.length? answers.map(answer => <Answer answer={answer}/>) : <p>还没有回答</p>}
    </Container>
  )
}

export default AnswerList