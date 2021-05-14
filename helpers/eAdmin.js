//verficar se o usuario autenticado eh admin

module.exports = {
    eAdmin: function (req, res, next) {

        if (req.isAuthenticated() && req.user.eAdmin == 1) {  //usuario autenticado e administrador
            return next();

        }

        req.flash("error_msg", "Você precisa ser um Admin!")
        res.redirect("/")


    }
}
