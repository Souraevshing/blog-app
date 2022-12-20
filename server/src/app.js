import express from 'express'
import { MongoClient } from 'mongodb'
import admin from 'firebase-admin'
import 'dotenv/config'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 5000

const credentials = JSON.parse(fs.readFileSync('./credentials.json'))

//connecting firebase to nodejs server
admin.initializeApp({ credential: admin.credential.cert(credentials) })

const app = express()
app.use(express.json())

//providing express to use build folder generated from react-frontend to serve as static assets
app.use(express.static(path.join(__dirname, '../build')))

//using regEx to tell express when it is serving any other url other than /api, then serve this build file
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})

//middleware to prevent user from commenting or voting without signing in
app.use(async (req, res, next) => {
  const { authtoken } = req.headers

  if (authtoken) {
    try {
      req.user = await admin.auth().verifyIdToken(authtoken)
    } catch (e) {
      return res.sendStatus(400)
    }
  }

  req.user = req.user || {}

  next()
})

// let articles = [
//   {
//     name: 'react',
//     upvotes: 0,
//     comments: [],
//   },
//   {
//     name: 'nodejs',
//     upvotes: 0,
//     comments: [],
//   },
// ]

app.get('/api/articles/:name', async (req, res) => {
  const { name } = req.params
  const { uid } = req.user

  const client = new MongoClient(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ddfompi.mongodb.net/?retryWrites=true&w=majority`
  )
  await client.connect()
  console.log('connected to MONGODB server')

  const db = client.db('blog-app')
  const article = await db.collection('articles').findOne({ name })
  if (article) {
    const upvoteIds = article.upvoteIds || []
    article.canUpvote = uid && !upvoteIds.includes(uid)
    res.json(article)
  } else {
    res.sendStatus(404)
  }
})

//middleware to prevent user from commenting or voting without signing in
app.use((req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.sendStatus(401)
  }
})

app.put('/api/articles/:name/upvote', async (req, res) => {
  const { name } = req.params
  const { uid } = req.user

  const client = new MongoClient(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ddfompi.mongodb.net/?retryWrites=true&w=majority`
  )
  await client.connect()
  console.log('connected to MONGODB server')

  const db = client.db('blog-app')

  const article = await db.collection('articles').findOne({ name })

  if (article) {
    const upvoteIds = article.upvoteIds || []
    const canUpvote = uid && !upvoteIds.includes(uid)

    if (canUpvote) {
      await db
        .collection('articles')
        .updateOne(
          { name },
          { $inc: { upvotes: 1 }, $push: { upvoteIds: uid } }
        )
    }

    const updatedArticle = await db.collection('articles').findOne({ name })

    res.json(updatedArticle)
  } else {
    res.send('No articles found!')
  }
})

app.post('/api/articles/:name/comments', async (req, res) => {
  const { name } = req.params
  const { text } = req.body
  const { email } = req.user

  const client = new MongoClient(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.ddfompi.mongodb.net/?retryWrites=true&w=majority`
  )
  await client.connect()
  console.log('connected to MONGODB server')

  const db = client.db('blog-app')
  await db
    .collection('articles')
    .updateOne({ name }, { $push: { comments: { postedBy: email, text } } })
  const article = db.collection('articles').findOne({ name })

  if (article) {
    res.json(article)
  } else {
    res.send('Article not found!')
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
