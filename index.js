const express = require('express')
const app = express()
const Handlebars = require('handlebars')
const exprhbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session')
const mongoose = require('mongoose')
const User = require('./models/user')
const varMiddleware = require('./middellware/variables')


const path = require('path')
const homeRoutes = require('./routs/home')
const addRoutes = require('./routs/add')
const coursesRoutes = require('./routs/courses')
const cardRoutes = require('./routs/card')
const ordersRoutes = require('./routs/orders')
const authRoutes = require('./routs/auth')

const hbs = exprhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret:'some secret value',
    resave:false,
    saveUninitialized:false
}))
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000


async function start() {
    try {
        const password = 'kiR3HpxSPss71Vht'
        const url = `mongodb+srv://petr:${password}@cluster0-ssy3l.mongodb.net/shop&w=majority`
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        // const candidate = await User.findOne()
        // if (!candidate) {
        //     const user = new User({
        //         email: 'test@mail.ru',
        //         name: 'Test',
        //         cart: {items: []}
        //     })
        //     await user.save()
        // }
        app.listen(PORT, () => {
            console.log(`server has been started on ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()



