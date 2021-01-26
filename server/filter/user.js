//  check user log in or not
function userLoginFilter(req, res, next) {
  var url = req.url;

  if (url != '/login' && !req.signedCookies.user && url != '/') {
    res.redirect('/login')
    return
  }

  next();
}

module.exports = userLoginFilter;