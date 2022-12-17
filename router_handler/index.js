exports.index = (req, res) => {
    res.render('./index.html')
}

exports.register = (req, res) => {
    res.render('./register.html')
}

exports.account = (req, res) => {
    res.render('./account.html')
}

exports.contact = (req, res) => {
    res.render('./contact.html')
}
