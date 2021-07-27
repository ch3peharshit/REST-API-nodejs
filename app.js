const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')
const app = express()

app.set('view engine',ejs)
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB",{useUnifiedTopology:true,useNewUrlParser:true})
const ArticleSchema = mongoose.Schema({
    title:String,
    content:String
})
const Article = mongoose.model("article",ArticleSchema)
// app.get('articles',)

//app.get('/articles/:title')
//app.post('/articles',)
//app.delete("/articles",)
app.route("/articles/:title")
.get(function(req,res){
    const reqTitle = req.params.title
    Article.findOne({title:reqTitle},function(err,articlesFound){
        if(!err){
            if(articlesFound){
                res.send(articlesFound)
            } else {
                console.log('requested article not found')
            }
        } else {
            console.log("error fetching")
        }
    })
})

.delete(function(req,res){
    const reqTitle = req.params.title;
    Article.deleteOne({title:reqTitle},function(err){
        if(!err){
            console.log("deketed one")
            res.send("deleted one")
        } else {
            console.log("couldnt delete one")
            res.send("couldnt deleted one")
        }
    })
})
.put(function(req,res){
    const reqTitle = req.params.title
    const newTitle = req.body.title
    const newContent = req.body.content

    Article.replaceOne(
        {title:reqTitle},
        {title:newTitle,content:newContent},
        function(err){
            if(!err){
                res.send("no error")
            } else {
                res.send(err)
            }
        }
        )
})
.patch(function(req,res){
    const reqTitle = req.params.title;
    const newTitle = req.body.title
    Article.updateOne({title:reqTitle},{title:newTitle},function(err){
        if(!err){
            res.send("patched one ")
        } else {
            res.send("couldnbt patch")
        }
    })
})
app.route("/articles")

.get(function(req,res){
    Article.find({},function(err,articlesFound){
        if(!err){
            if(articlesFound){
               res.send(articlesFound)
            } else {
                console.log("Can't fetch all articles")
            }
        } else {
            console.log("error in finding"+err)
        }
    })
})

.post(function(req,res){
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    })
    newArticle.save((err)=>{
        if(!err){
            res.send("Successfully added a new article")
        } else {
            res.send(err)
        }
    })
})

.delete(function(req,res){
    //  const deleteCondition = req.body.article
      Article.deleteMany({},function(err){
          if(!err){
          res.send("Success in deleting all")
          } else  {
              res.send(err)
          }
      })
  })

app.listen(3000,()=>{
    console.log("running on 3000")
})
