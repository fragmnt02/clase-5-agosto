const db = require('../database/models');
const sequelize = db.sequelize;

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        res.render('moviesAdd');
    },
    create: async function (req, res) {
       const {title, rating, awards, release_date, length} = req.body;
       await db.Movie.create({title, rating, awards, release_date, length});
        res.redirect('/movies');
    },
    edit: async function(req, res) {
        const {id} = req.params;
        const Movie = await db.Movie.findByPk(id);
        res.render('moviesEdit', {Movie});
    },
    update: async function (req,res) {
        const {id} = req.params;
        const {title, rating, awards, release_date, length} = req.body;
       await db.Movie.update({title, rating, awards, release_date, length}, { where: { id }});
        res.redirect('/movies');
    },
    delete: async function (req, res) {
        const {id} = req.params;
        const Movie = await db.Movie.findByPk(id);
        res.render('moviesDelete', {Movie});
    },
    destroy: async function (req, res) {
        const {id} = req.params;
        await db.Movie.destroy({ where: { id }});
        res.redirect('/movies');
    }

}

module.exports = moviesController;