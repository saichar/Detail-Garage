class DashboardController{
    dashboard(req, res){
        // console.log('dashboard');
        // console.log(req.session.admin);
        if (!req.session.admin) {
            // console.log('if session');
            res.redirect('/admin');
        }

        var render_options = {
            admin_details: req.session.admin,
            layout: 'layouts/after_login',
        };
       
        res.render('dashboard/dashboard', render_options);
    }
}

module.exports = DashboardController;