const roles = require('./roles')

const hasRole = (roles, role) => {
  const sameRoles = parseInt(roles, 16) & parseInt(role, 16)
  return sameRoles === parseInt(role, 16)
}

module.exports = {
  roles,
  hasRole
}
