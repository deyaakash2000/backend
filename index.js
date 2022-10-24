const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')


connectToMongo()
const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Avaiable routs
// app.get('/',(res,req)=>{
//     res.send('hellow')
// })
app.use('/api/auth',require('./routes/auth'))
app.use('/api/user',require('./routes/user'))
app.listen(port,()=>{
    console.log(`mongodb://localhost:${port}`);
})