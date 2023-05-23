import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Container} from '@mui/material'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {ContractContext} from '../context/ContractContext'

function AddQuestion() {

    const navigate = useNavigate()
    const {Services} = React.useContext(ContractContext)
    const [questionText, setQuestionText] = React.useState('')

    const addQuestion = async()=>{
        const response = await Services.add_question(questionText)
        console.log(response)
        if(!response.success) alert(response.message)

        navigate('/dashboard',{replace:true})
    }

    return (
    <Container maxWidth={false} padding={0}>
        <TextField 
            fullWidth 
            label="在这里编辑问题" 
            id="fullWidth" 
            margin="normal" 
            multiline 
            minRows={4} 
            onChange={(e)=>{setQuestionText(e.target.value)}} 
            value={questionText} 
            helperText="请注意提问的艺术"
            fontSize="large"
            InputProps={{
                style:{
                    fontSize: '1.2em'
                }
            }}
            InputLabelProps={{
                style:{
                    fontSize: '1.2em'
                }
            }}
        />
        <Button variant="contained" onClick={addQuestion}>点击发布</Button>
    </Container>
    )
}

export default AddQuestion