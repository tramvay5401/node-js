const express = require('express')
const app = express()
const Handlebars = require('handlebars')
const exprhbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const User = require('./models/user')


const path = require('path')
const homeRoutes = require('./routs/home')
const addRoutes = require('./routs/add')
const coursesRoutes = require('./routs/courses')
const cardRoutes = require('./routs/card')
const ordersRoutes = require('./routs/orders')

const hbs = exprhbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})


app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5ed100440e487943c4934967')
        req.user = user
        next()
    } catch (e) {
        console.log(e)
    }

})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)

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
        const candidate = await User.findOne()
        if (!candidate) {
            const user = new User({
                email: 'test@mail.ru',
                name: 'Test',
                cart: {items: []}
            })
            await user.save()
        }
        app.listen(PORT, () => {
            console.log(`server has been started on ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()



