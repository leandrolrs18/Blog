const express = require ('express')
const router = express.Router()
const mongoose = require ('mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias");
require("../models/Postagem")
const Postagem = mongoose.model("postagens")
const {eAdmin} = require ("../helpers/eAdmin")  //pegou a função eAdmin desse arquivo



router.get('/',  eAdmin, (req, res) =>{
  res.render("admin/index")
})

router.get('/posts',  (req, res) =>{
  res.send("Página de posts")
})
router.get('/categorias', eAdmin, (req, res) =>{
  Categoria.find().sort({date: 'desc'}).then((categorias) =>{
      res.render("admin/categorias", {categorias: categorias})
  }).catch((erro)=>{
      req.flash("error_msg", "houve um erro ao listar categorias")
      res.redirect("/admin")
  })

})

router.get('/categorias/add', eAdmin, (req, res) =>{
  res.render("admin/addcategorias")
})

router.post('/categorias/nova', eAdmin, (req, res) =>{
  var erros = []
  if (!req.body.nome && typeof req.body.nome == undefined || req.body.nome == null) {
    erros.push({texto: "Nome Invalido"})    //coloca um dado no array
  }
  if (!req.body.slug && typeof req.body.slug == undefined || req.body.slug == null) {
    erros.push({texto: "Slug Invalido"})    //coloca um dado no array
  }
  if (req.body.nome.length < 2) {
    erros.push({texto: "Nome pequeno"})
  }
  if(erros.length > 0){
    res.render("./admin/addcategorias", {erros: erros})
  }else {

   const novaCategoria = {
    nome: req.body.nome,
    slug: req.body.slug
   }
   new Categoria(novaCategoria).save().then(()=>{
     req.flash("success_msg", "Categoria criada com sucesso")
     res.redirect("/admin/categorias")
     console.log("Categoria salva");
   }).catch((erro)=>{
     req.flash("error_msg", "houve um erro ao salvar a categoria. Tente novamente")
     console.log(" nao salva a categoria" + erro);
     res.redirect("/admin")
   })
  }
})



  router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({_id : req.params.id}).then((categoria)=>{

    res.render("admin/editcategorias", {categoria : categoria})}).catch((erro)=>{
      req.flash("error_msg", "categoria nao existe")
      res.redirect("/admin/categorias")

    })
  })


router.post("/categorias/edit", eAdmin, (req, res) => {

    Categoria.findOne({ _id: req.body.id }).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(()=>{
          req.flash("success_msg", "categoria editada")
        res.redirect("/admin/categorias")
      }).catch((erro)=>{
            req.flash("error_msg", "houve um erro ao salvar a edição")
            res.redirect("/admin/categorias")
            console.log( "categoria editada")
          })
    }).catch((erro)=>{
        req.flash("error_msg", "houve um erro ao editar categoria")
        res.redirect("/admin/categorias")
        console.log( "categoria n editada")
})
})

  router.post("/categoria/deletar", eAdmin,  (req, res) => {
      Categoria.deleteOne({_id: req.body.id}).then(() =>{
        req.flash("success_msg", "Categoria deletada")
        res.redirect("/admin/categorias")
      }).catch((erro) => {
        req.flash("error_msg", "Categoria nao deletada")
        res.redirect("/admin/categorias")
      })
   })

   router.get("/postagens", eAdmin, (req,res) => {
      Postagem.find().populate("categoria").sort({data : "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
        console.log(" foi achado pela categoria")
      }).catch((error) =>{
         req.flash("error_msg", "Erro ao carregar formulario")
            res.redirect("/admin")
      })

   })
   router.get("/postagens/add", eAdmin, (req,res) => {
     Categoria.find().then((categorias) => {
       res.render("admin/addpostagem", {categorias: categorias})
     }).catch((error) =>{
        req.flash("error_msg", "Erro ao carregar formulario")
           res.render("/admin")
     })

   })

  router.post("/postagens/nova", eAdmin, (req, res) =>{
    var erros = []
      if (req.body.categoria == '0') {
        erros.push({ texto : "categoria invalida, registre uma categoria"})
      }
      if (erros.length > 0) {
            res.render("admin/addpostagens", {erros: erros})
      }else {
          const novaPostagem = {
             titulo : req.body.titulo,
              descricao : req.body.descricao,
             conteudo : req.body.conteudo,
             categoria : req.body.categoria,
             slug : req.body.slug
          }
          new Postagem(novaPostagem).save().then(() =>
        {
          req.flash("success_msg", " Postagem criada")
          res.redirect("/admin/postagens")
          console.log("Postagem salva");
        }).catch((erro) => {
          req.flash("error_msg", " Erro ao criar postagem ")
          res.redirect("/admin/postagens")
          console.log("Postagem n salva" + erro);
        })
      }
         })

        router.get("/postagens/edit/:id", eAdmin,  (req, res) => {

             Postagem.findOne({ _id: req.params.id }).then((postagem) => {

                 Categoria.find().then((categorias) => {
                     res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })
                 }).catch((err) => {
                     req.flash("error_msg", "Houve um erro ao listar as categorias")
                     res.redirect("/admin/postagens")
                 })

             }).catch((err) => {
                 req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
                 res.redirect("/admin/postagens")
             })


         })

         router.post("/postagem/edit", eAdmin,  (req, res) => {

             Postagem.findOne({ _id: req.body.id }).then((postagem) => {

                 postagem.titulo = req.body.titulo
                 postagem.slug = req.body.slug
                 postagem.descricao = req.body.descricao
                 postagem.conteudo = req.body.conteudo
                 postagem.categoria = req.body.categoria

                 postagem.save().then(() => {
                     req.flash("sucess_msg", "Postagem editada com sucesso!")
                     res.redirect("/admin/postagens")
                 }).catch((err) => {
                     req.flash("error_msg", "Erro interno")
                     res.redirect("/admin/postagens")
                 })

             }).catch((err) => {
                 console.log(err)
                 req.flash("error_msg", "Houve um erro ao salvar a edição")
                 res.redirect("/admin/postagens")
             })

         })

         router.post("/postagens/deletar/", eAdmin, (req, res) => {
             Postagem.remove({ _id: req.body.id }).then(() => {
                 req.flash("success_msg", "Postagem deletada com sucesso!")
                 res.redirect("/admin/postagens")
             }).catch((err) => {
                 req.flash("error_msg", "Houve um erro ao deletar a postagem")
                 res.redirect("/admin/postagens")
             })
         })

module.exports = router;
