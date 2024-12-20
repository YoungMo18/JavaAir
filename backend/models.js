import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")

await mongoose.connect('mongodb+srv://info441_user:info441_user@cluster0.pajam.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

console.log("successfully connected to mongodb!")

const postSchema = new mongoose.Schema({
    username: String,
    url: String,
    description: String,
    created_date: Date,
    likes: [String]
})

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    created_date: Date
})

const userInfoSchema = new mongoose.Schema({
    username: String,
    email: String,
    personalWebsite: String
});

models.Post = mongoose.model('Post', postSchema)
models.Comment = mongoose.model('Comment', commentSchema)
models.UserInfo = mongoose.model('UserInfo', userInfoSchema)

console.log("mongoose models created")

export default models