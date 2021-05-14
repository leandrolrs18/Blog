if (process.env.NODE_ENV == "production") {
    module.exports = {
        mongoURI: "mongodb+srv://weskermatrix:wesley3001@cluster0-cgemx.mongodb.net/test?retryWrites=true&w=majority"
    }
} else {
    module.exports = { mongoURI: "mongodb://localhost/blogapp" }

}
