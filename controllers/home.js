module.exports = {
  index: (req, res) => {
      res.render('home/index');
  },

    homepage: (req, res) => {
        res.render('homepage/homepage');
    }
};