require('chai').should()

const { hasRole } = require('../')

/* eslint-disable no-unused-expressions */

describe('roles', () => {
  describe('#hasRole', () => {
    it('hasRole is not undefined', () => {
      hasRole.should.not.to.be.undefined
    })

    it('hasRole returns true when the same role is found', () => {
      hasRole('0x0000000000000000000000000000000000000000000000000000000000000002',
        '0x0000000000000000000000000000000000000000000000000000000000000002').should.be.true
    })

    it('hasRole returns true when entity roles contains the roles to check', () => {
      hasRole('0x0000000000000000000000000000000000000000000000000000000000000003',
        '0x0000000000000000000000000000000000000000000000000000000000000001').should.be.true
    })

    it('hasRole returns false when entity roles does not contains the roles to check', () => {
      hasRole('0x0000000000000000000000000000000000000000000000000000000000000002',
        '0x0000000000000000000000000000000000000000000000000000000000000001').should.not.be.true
    })

    it('hasRole returns false when entity roles does not contains one of the roles to check', () => {
      hasRole('0x0000000000000000000000000000000000000000000000000000000000000005',
        '0x0000000000000000000000000000000000000000000000000000000000000003').should.not.be.true
    })
  })
})
