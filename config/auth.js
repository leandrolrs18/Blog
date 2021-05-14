const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de usuário
require("../models/usuario")
const Usuario = mongoose.model("usuarios")


module.exports = function (passport) {

    passport.use(new localStrategy({ usernameField: 'email', passwordField: "senha" }, (email, senha, done) => {

        Usuario.findOne({ email: email }).then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: "Esta conta não existe" }) //função de call back
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {  //sea conta existir, compare as senhas


                if (batem) {
                    return done(null, usuario)
                } else {
                    return done(null, false, { message: "Senha incorreta" })
                }
            })
        })

    }))


    passport.serializeUser((usuario, done) => { //passa os dados do usuario para uma sessao

        done(null, usuario.id)

    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {  //procurar um dado pelo id e salvar numa sessao
            done(err, usuario)
        })
    })




}
