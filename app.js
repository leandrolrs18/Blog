//ARQUIVO PRINCIPAL RESPONSÁVEL POR REDIRECIONAR PARA OUTROS GUIAS. CONTÉM A INICIALIZAÇÃO DE FRAMEWORKS ETC

const express = require ('express')   // Express é um framework, ou seja uma ferramenta que facilita a programação(resumindo a original), que substitui o protocolo http
const handlebars = require ('express-handlebars')  // Adiciona novas funcionalidades a página httml, como a o IF, e consegue transmitir dados do back para o front-end
const bodyParser = require ('body-parser') // Adiciona ao express a possibilidade de pegar dados de formulário digitado pelo usuario e ultilizá-lo
const app = express(); //cria um constante do framework (?)
const admin = require('./Routes/admin') // Na page admin foi exportado a const "router", que agora será chamada neste arquivo de admin
const path = require('path')  //  módulo path fornece muitas funcionalidades muito úteis para acessar e interagir com o sistema de arquivos, como o dirname
const mongoose = require ('mongoose')    // banco de dados
const session = require("express-session") // O middleware express-session armazena os dados da sessão no servidor; ele salva apenas o ID da sessão no cookie, não os dados da sessão
const flash = require("connect-flash") //tipo de sessão q a msg por tempo curto

//Config

//sessao
   app.use(session({   // .use é usado para gerenciamento de middleware
     secret: "cursodenode",
     resave: true,
     saveUninitialized : true
    }
    ))
   app.use(flash())
    //middleware  : Funções de Middleware são funções que tem acesso ao objeto de solicitação (req), o objeto de resposta (res).
    // é usado extensivamente em aplicativos Express, para que as tarefas ofereçam arquivos estáticos ao tratamento de erros, a compressão de respostas HTTP.
    app.use((req, res, next) =>{
     res.locals.error_msg = req.flash("error_msg")
     res.locals.success_msg = req.flash("success_msg")  //variaveis globais

      next();
   })
  //Body Parser
    app.use(bodyParser.urlencoded({extended : true}))
    app.use(bodyParser.json())
  //Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars');
  //Mongoose
  mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogApp', { useUnifiedTopology: true , useNewUrlParser: true}).then(()=>{
      console.log("conectado ao mongo");
    })
  .catch((erro)=>{ console.log(" nao conectado ao mongo" + erro);
  })
  //Public
  app.use(express.static("public"))

  app.use((req, res, next) => {
    console.log(" qlqr coisa");
    next();}
)
//Rotas
  const urlencodedParse = bodyParser.urlencoded({extended: false})
    app.use("/admin", urlencodedParse, admin)  // cria a rota para a page admin
//Outros
const PORT = 8089;
app.listen(PORT, () => {
   console.log("Servidor rodando")
})
