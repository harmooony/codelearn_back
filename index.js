const express = require('express')
const cors = require('cors');
const path = require('path');
const multer = require('multer');


require('dotenv').config()



const userRouter = require('./routes/user.routes')
const courseRouter = require('./routes/course.routes')
const codeRouter = require('./routes/code.routes')
const lessonRouter = require('./routes/lesson.routes')
const lessonContentRouter = require('./routes/lessonContent.routes')
const taskRouter = require('./routes/task.routes')
const taskTestRouter = require('./routes/taskTest.routes')
const authRouter = require('./routes/auth.routes')
const favoriteRouter = require('./routes/favorite.routes')
const subscriptionRouter = require('./routes/subscription.routes')


const PORT = process.env.PORT || 8080




const app = express()

app.use(cors({
  origin: 'http://127.0.0.1:5173',
  optionsSuccessStatus: 200
}));



app.use((err, req, res, next) => {
    console.error(err)

    res.status(500).json({
        message: err.message || 'Server error'
    })
})



app.use(express.json())
app.use('/api', userRouter)
app.use('/api', courseRouter)
app.use('/api', codeRouter)
app.use('/api', lessonRouter)
app.use('/api', lessonContentRouter)
app.use('/api', taskRouter)
app.use('/api', taskTestRouter)
app.use('/api', authRouter)
app.use('/api', favoriteRouter)
app.use('/api', subscriptionRouter)
app.use('/api', require('./routes/language.routes'));





app.listen(PORT, () => console.log(`server started on port ${PORT}`))