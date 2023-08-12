import Web3 from 'web3'
import {useEffect} from 'react'
import {createContext, useState, useContext} from 'react'
import { AuthContext } from './AuthContext'
import Utils from '../utils'

export const ContractContext = createContext()

function ContractContextProvider(props){

    const {account, updateAuth, authenticate} = useContext(AuthContext)

    const [state, setState] = useState({
        DeQuora: null,
        Questions: []
    })

    const getUpdatedContracts = () => state

    const updateContract = (data)=>{
        setState({...state,...data})
    }

    const Services = {
        get_user: async(address) => {
            try{                
                console.log(state)
                //check if address is not empty
                if(!address) throw new Error("Address is empty")

                //get the user to see if he/she exist or not
                const response = await state.DeQuora.methods.users(address).call()
                
                // Return error if user does not exist
                if (Web3.utils.toBN(response.account).isZero()) throw new Error("User is not registered")
                return { success: true, data: response }

            }catch(err){
                console.log("Error in getting user: ",err)
                return { success: false, message: err.message }
            }
        },
        register: async(name, account) => {
            try {
                console.log(`Registering ${name} on ${account}`)
                console.log('Main contract: ', state.MainContract)
                const response =
                    await state.DeQuora.methods.create_user(name).send({
                        gas: 3000000,
                        from: account
                    })
                return { success: true, data: response }
            } catch (err) {
                console.log("Error in registeration:", err)
                return { success: false, message: err.message }
            }
        },
        get_user_details: async(userAddress) => {
            try {
                console.log('Getting user for address:', userAddress)
                const userResponse = await state.DeQuora.methods.get_user_details(userAddress).call()
                const questionResponse = await state.DeQuora.methods.get_all_questions().call()
                const data = {
                    user: userResponse,
                    questions: questionResponse.filter(question => question.author_address == userAddress),
                }
                return { success: true, data }
            } catch (err) {
                console.log("Error in fetching user details: \n", err)
                return { success: false, message: err.message }
            }
        },
        add_question: async(_question) => {
            try{
                const response = await state.DeQuora.methods.add_question(_question).send({
                    gas: 3000000,
                    from: account
                })
                return { success: true, data: response }
            }catch (err) {
                console.log("Error in creating question: \n", err)
                return { success: false, message: err.message}
            }
        },
        get_all_questions: async()=>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                const allQuestions = await state.DeQuora.methods.get_all_questions().call()
                return { success: true, data:{questions: allQuestions} }
            }catch (err) {
                console.log("Error in getting all questions: \n", err)
                return { success: false, message: err.message }
            }
        },
        get_questions: async() => {
            try{
                if(!state.DeQuora) return {success: true, data:{}}
                const totalQuestions = await state.DeQuora.methods.total_questions().call()
                console.log('Response of getting total questions: ',totalQuestions)

                let questions = [];
                for(let i = 0; i < totalQuestions; i++){
                    const questionResponse = await state.DeQuora.methods.questions(i).call()
                    console.log(`Question ${i}: `, questionResponse)
                    questions.push(questionResponse)
                }
                return { success:true, data: {questions}}
            }catch (err) {
                console.log("Error in getting questions: \n", err)
                return { success: false, message: err.message }
            }
        },
        get_question: async(_question_id) => {
            try{
                if(!state.DeQuora) return { success:true, data: {}}
                const response = await state.DeQuora.methods.get_question(_question_id).call();
                console.log(`Response of getting question of id ${_question_id}: `, response)
                return { success: true, data: {question: response[0], answers: response[1]} }

            }catch (err) {
                console.log(`Error in getting question of id ${_question_id}: \n`, err)
                return { success: false, message: err.message }
            }
        },
        add_answer: async(_question_id, _answer) =>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                console.log(`Adding answer ${_answer} for question ${_question_id}`)
                const addAnswerResponse = await state.DeQuora.methods.add_answer(_question_id, _answer).send({
                    from: account,
                    gas: 3000000
                })
                console.log(addAnswerResponse)
                return { success: true, data:{answers: addAnswerResponse}}
            }catch(err){
                console.log('Error in adding answer: ', err)
                return { success: false, message: err.message }
            }
        },

        like_answer: async(_question_id, _answer_id) =>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                console.log(`Like answer ${_answer_id} for question ${_question_id}`)
                const likeAnswerResponse = await state.DeQuora.methods.like_answer(_question_id, _answer_id).send({
                    from: account,
                    gas: 3000000
                })
                console.log(likeAnswerResponse)
                return { success: true, data:likeAnswerResponse}
            }catch(err){
                console.log('Error in like answer: ', err)
                return { success: false, message: err.message }
            }
        },

        like_question: async(_question_id) =>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                console.log(`Like question ${_question_id}`)
                const likeQuestionResponse = await state.DeQuora.methods.like_question(_question_id).send({
                    from: account,
                    gas: 3000000
                })
                console.log(likeQuestionResponse)
                return { success: true, data:likeQuestionResponse}
            }catch(err){
                console.log('Error in like question: ', err)
                return { success: false, message: err.message }
            }
        },

        tip_answer :async(_question_id, _answer_id) =>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                console.log(`Tip answer ${_question_id, _answer_id}`)
                const tipAnswerResponse = await state.DeQuora.methods.tip_answer(_question_id,_answer_id).send({
                    from: account,
                    gas: 3000000,
                    value: 10000
                })
                console.log(tipAnswerResponse)
                return { success: true, data:tipAnswerResponse}
            }catch(err){
                console.log('Error in tip answer: ', err)
                return { success: false, message: err.message }
            }
        },

        tip_question :async(_question_id) =>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                console.log(`Tip question ${_question_id}`)
                const tipQuestionResponse = await state.DeQuora.methods.tip_question(_question_id).send({
                    from: account,
                    gas: 3000000,
                    value: 10000
                })
                console.log(tipQuestionResponse)
                return { success: true, data:tipQuestionResponse}
            }catch(err){
                console.log('Error in tip question: ', err)
                return { success: false, message: err.message }
            }
        },

        dividing_question_bonus_pool:async(_question_id) =>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                console.log(`Dividing question bonus pool${_question_id}`)
                const dividingQuestionBonusPoolResponse = await state.DeQuora.methods.dividing_question_bonus_pool(_question_id).send({
                    from: account,
                    gas: 3000000
                })
                console.log(dividingQuestionBonusPoolResponse)
                return { success: true, data:dividingQuestionBonusPoolResponse}
            }catch(err){
                console.log('Error in dividing question bonus pool: ', err)
                return { success: false, message: err.message }
            }
        },

        clean : async() =>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                console.log(`clean`)
                const cleanResponse = await state.DeQuora.methods.clean().send({
                    from: account,
                    gas: 3000000
                })
                console.log(cleanResponse)
                return { success: true, data:cleanResponse}
            }catch(err){
                console.log('Error in clean ', err)
                return { success: false, message: err.message }
            }
        },

        transfer :async(_to, _tokenId) =>{
            try{
                if(!state.DeQuora) return { success:true, data:{}}
                console.log(`transfer ${_to, _tokenId}`)
                const transferResponse = await state.DeQuora.methods.transfer(_to, _tokenId).send({
                    from: account,
                    gas: 3000000
                })
                console.log(transferResponse)
                return { success: true, data:transferResponse}
            }catch(err){
                console.log('Error in transfer: ', err)
                return { success: false, message: err.message }
            }
        }

    }

    useEffect(async () => {
        //Get the info from the contracts
        const contractResult = Utils.GetContracts()
        updateContract(contractResult.data)  
        
        // Get the account of the user
        const accountResponse = await Utils.Connect()
        updateAuth({account: accountResponse.data.account})

    },[])
    
    useEffect(async()=>{
        if(!account) return
        
        const userResponse = await Services.get_user(account)
        if(userResponse.success){
            authenticate(account)
        }else{
            if(window.location.pathname !== "/") window.location.href = "/"
        }
        
    }, [account])

    return(
        <ContractContext.Provider 
            value={{...state,...{
                updateContract,
                getUpdatedContracts,
                Services,
            }        
        }}>
            {props.children}
        </ContractContext.Provider>
    )
}

export default ContractContextProvider
