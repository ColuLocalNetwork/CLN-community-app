require('chai').should()

const { hasRoles } = require('../')

/* eslint-disable no-unused-expressions */

describe('roles', () => {
  describe('#hasRoles', () => {
    it('hasRoles is not undefined', () => {
      hasRoles.should.not.to.be.undefined
    })

    it('hasRoles returns true when the same role is found', () => {
      hasRoles('0x0000000000000000000000000000000000000000000000000000000000000002',
        '0x0000000000000000000000000000000000000000000000000000000000000002').should.be.true
    })

    it('hasRoles returns true when entity roles contains the roles to check', () => {
      hasRoles('0x0000000000000000000000000000000000000000000000000000000000000003',
        '0x0000000000000000000000000000000000000000000000000000000000000001').should.be.true
    })

    it('hasRoles returns false when entity roles does not contains the roles to check', () => {
      hasRoles('0x0000000000000000000000000000000000000000000000000000000000000002',
        '0x0000000000000000000000000000000000000000000000000000000000000001').should.not.be.true
    })

    it('hasRoles returns false when entity roles does not contains one of the roles to check', () => {
      hasRoles('0x0000000000000000000000000000000000000000000000000000000000000005',
        '0x0000000000000000000000000000000000000000000000000000000000000003').should.not.be.true
    })
  })
})
