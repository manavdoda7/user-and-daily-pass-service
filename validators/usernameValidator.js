function UsernameValidator(username) 
{
    return /^(\w|\d|\-|\.){5,}$/.test(username)
}

module.exports = UsernameValidator