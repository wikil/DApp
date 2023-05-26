import React from 'react'
import { Container, Grid, Box, Typography, Button } from '@mui/material'
import { useParams } from 'react-router-dom'
import { ContractContext } from '../context/ContractContext'
import { AuthContext } from '../context/AuthContext'
import '../static/styles/Profile.scss'
import '../static/styles/Questions.scss'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EventIcon from '@mui/icons-material/Event';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import {Question} from '../components/QuestionList'
import Loader from '../components/Loader'
import AnswerList from '../components/AnswerList'

function UserQuestionList({questions}){
  return(
    questions && questions.length?
    questions.map(question=> <Question question={question} />):
    <Container className='no-questions'>看起来似乎还没什么东西</Container> 
    )
}

// function UserAnswerList({answers}){
//   return(
//     answers && answers.length?
//     answers.map(answer=> <Answer answer={answer} />):
//     <Container className='no-questions'>看起来似乎还没什么东西</Container> 
//     )
// }

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TabSection({questions}){

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="问题" {...a11yProps(0)} />
          <Tab label="回答" {...a11yProps(0)} />
          <Tab label="NFTs" {...a11yProps(0)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <UserQuestionList questions={questions} />
      </TabPanel>
    </Box>
  );
}

function Profile() {

  const params = useParams()
  const { DeQuora, Services } = React.useContext(ContractContext)
  const { account } = React.useContext(AuthContext)

  const [profile, setProfile] = React.useState({})
  const [questions, setQuestions] = React.useState([])
  // const [answers, setAnswers] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const getUserDetails = async (_account) => {
    if (!_account) return

    const userDetailsResponse = await Services.get_user_details(_account)
    if (!userDetailsResponse.success) return

    setProfile(userDetailsResponse.data.user)
    setQuestions(userDetailsResponse.data.questions)
    // setAnswers(userDetailsResponse.data.answers)

  }

  const transfer = async() =>{
    if(!Services) return
    const response = await Services.transfer(0, 0)
  }

  React.useEffect(async() => {
    setLoading(true)
    await getUserDetails(params.account)
    setLoading(false)
  }, [DeQuora])

  return (!loading?
    <Container maxWidth={false} className='profile'>
      <Container className='profile-details' maxWidth={false}>
        <Grid container>
          <Grid item lg={4} sm={12}>
            <Box 
              sx={{
                width: 'fit-content',
                height: 'auto',
                marginLeft: 'auto'
              }}
            >
              <img src={`https://www.robohash.org/${profile.account}`} className='profile-details-image'/>
            </Box>
          </Grid>
          <Grid item lg={8} sm={12} direction='column' justifyContent='center' className='profile-details-info'>
            <Box sx={{padding: '5em'}}>
              <Typography variant='h6' fontSize='1.3em'> <AccountCircleIcon/> {profile.name}</Typography>
              <Typography variant='h6' fontSize='1.3em'> <AccountBalanceWalletIcon/> {profile.account}</Typography>
              <Typography variant='h6' fontSize='1.3em'> <EventIcon/> {profile.joined_on}</Typography>
              <Button onClick={transfer} variant='contained' startIcon={<CurrencyRupeeIcon/>} fontSize='1.5em' style={{marginTop: '2em'}}>NFT TRANSFER</Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth='lg'>
        <TabSection questions={questions} ></TabSection>
      </Container>
    </Container>
    : <Loader></Loader>
  )
}

export default Profile;