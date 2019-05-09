const roles = require('./roles')

const hasRoles = (entityRoles, rolesToCheck) => {
  const sameRoles = parseInt(entityRoles, 16) & parseInt(rolesToCheck, 16)
  return sameRoles === parseInt(rolesToCheck, 16)
}

module.exports = {
  roles,
  hasRoles
}
