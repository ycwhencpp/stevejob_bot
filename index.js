require ('dotenv').config()
const app = require('express')()
const bodyParser = require('body-parser')
const OpenAI = require('openai-api');
const openai_api_key= process.env.OPENAI_API_KEY;
const openai = new OpenAI(openai_api_key);


const PORT= process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false }))


const accountSid = process.env.SID 
const authToken = process.env.AUTH
const client = require('twilio')(accountSid,authToken); 

const MessagingResponse = require('twilio').twiml.MessagingResponse 


app.get("/",(req,res)=>{

    res.json({
        sucess:true
    })
})

let prompt = `The following is a conversation with steve jobs The steve jobs is  helpful, creative, clever and very friendly.\n\n
ME: hello, who  are you ?\n steve jobs:I am steve jobs ,how can i help you ?\n `

        

app.post("/sms",(req, res) => {

    prompt += `Me:${req.body.Body}\nsteve jobs:`

        const gptResponse = await openai.complete({
            engine:'davinci',
            prompt,
            MaxTokens:100,
            temprature:0.8,
            frequencyPenalty:0,
            presencePenalty:0,
            n:1,
            stream:false,
            stop:["steve jobs" ,"Me"],
        });

        let output  =`${gptResponse.data.choices[0].text}`

        prompt += `steve jobs: ${output}\n`


        const twiml = new MessagingResponse();
    
        const msg = twiml.message(output);
    
        res.writeHead(200,{ 'Content-Type': 'text/xml' })
    
        res.end(twiml.toString())
   

})


app.get("/send-message", async (req,res) => {

    let response = await client.messages.create({
        body:"i am testing ",
        from:"+17608535318",
        to:"+918368991155",
    })
    res.json({
        sucess:true,
        messages:response
    })
    
})

app.listen(PORT,() => {

    console.log('server listening on port '+ PORT)
})