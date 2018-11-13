import React, {Component} from 'react'
import FontAwesome from 'react-fontawesome'
import classNames from 'classnames'
import Modal from 'components/Modal'
import {connect} from 'react-redux'
import { Chart } from 'react-google-charts'
import Loader from 'components/Loader'
import {predictClnPrices} from 'actions/marketMaker'
import TextInput from 'components/elements/TextInput'
import CommunityLogo from 'components/elements/CommunityLogo'

class CalculatorModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      initialClnReserve: 100,
      amountOfTransactions: 100,
      averageTransactionInUsd: 10,
      gainRatio: 0.1,
      iterations: 12
    }
  }
  componentDidMount () {
    setTimeout(() => {
      this.props.predictClnPrices(this.props.token.address, {
        initialClnReserve: this.state.initialClnReserve,
        amountOfTransactions: this.state.amountOfTransactions,
        averageTransactionInUsd: this.state.averageTransactionInUsd,
        gainRatio: this.state.gainRatio,
        iterations: this.state.iterations
      })
    }, 500)
  }
  renderChartData (prices) {
    let data = [['', 'CLN', 'USD']]
    const fiatCurrencyPrice = this.props.fiat.USD && this.props.fiat.USD.price
    const hAxis = ['Time', '', '3 Months', '', '', '6 Months', '', '', '9 Months', '', '', '1 Year']
    let priceArr = prices.sort((a, b) => a - b)
    priceArr.forEach((price, key) => {
      data.push([hAxis[key], parseInt(price), price / fiatCurrencyPrice])
    })
    return data
  }

  reRenderChart = () => {
    this.props.predictClnPrices(this.props.token.address, {
      initialClnReserve: parseInt(this.state.initialClnReserve),
      amountOfTransactions: parseInt(this.state.amountOfTransactions),
      averageTransactionInUsd: parseInt(this.state.averageTransactionInUsd),
      gainRatio: this.state.gainRatio,
      iterations: this.state.iterations
    })
  }

  handleChangeInitialClnReserve = (event) => {
    this.setState({initialClnReserve: event.target.value})
  }

  handleChangeAmountOfTransactions = (event) => {
    this.setState({amountOfTransactions: event.target.value})
  }

  handleChangeAverageTransactionInUsd = (event) => {
    this.setState({averageTransactionInUsd: event.target.value})
  }

  handleChangeGainRatio = (event) => {
    this.setState({gainRatio: event.target.value / 100})
  }

  render () {
    const coinStatusClassStyle = classNames({
      'coin-status': true,
      'coin-status-active': this.props.marketMaker.isOpenForPublic,
      'coin-status-close': !this.props.marketMaker.isOpenForPublic
    })
    const options = {
      chart: {
        title: { position: 'none' }
      },
      colors: ['#5fddbb', '#c095ff'],
      width: 550,
      height: 350,
      series: {
        0: {axis: 'Temps'},
        1: {axis: 'Daylight'}
      },
      legend: {position: 'none'},
      axes: {
        y: {
          Temps: {label: ''},
          Daylight: {label: ''}
        }
      }
    }

    return (
      <Modal className='calculator' onClose={this.props.hideModal}>
        <div className='metamask-popup-close' onClick={this.props.hideModal}>
          <FontAwesome name='times' />
        </div>
        <div className='calculator-sidebar'>
          <div className='calculator-header'>
            <div className='calculator-header-content'>
              <CommunityLogo token={this.props.token} />
              <div className='calculator-logo-content'>
                <h3 className='calculator-title'>{this.props.token.name}</h3>
                <div className={coinStatusClassStyle}>
                  <span className='coin-status-indicator' /> <span className='coin-status-text'>{this.props.marketMaker.isOpenForPublic ? 'open' : 'close'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className='calculator-sidebar-container'>
            <div className='calculator-sidebar-content'>
              <p className='calculator-sidebar-label'>
                Initial CLN input
              </p>
              <TextInput
                className='calculator-sidebar-input'
                id='initialClnReserve'
                type='number'
                value={this.state.initialClnReserve}
                onChange={this.handleChangeInitialClnReserve}
              />
            </div>
            <div className='calculator-sidebar-content'>
              <p className='calculator-sidebar-label'>
                Monthly Transactions
              </p>
              <TextInput
                className='calculator-sidebar-input'
                id='amountOfTransactions'
                type='number'
                value={this.state.amountOfTransactions}
                onChange={this.handleChangeAmountOfTransactions}
              />
            </div>
            <div className='calculator-sidebar-content'>
              <p className='calculator-sidebar-label'>
                USD Price Per transaction
              </p>
              <TextInput
                className='calculator-sidebar-input'
                id='averageTransactionInUsd'
                type='number'
                value={this.state.averageTransactionInUsd}
                onChange={this.handleChangeAverageTransactionInUsd}
              />
            </div>
            <div className='calculator-sidebar-content'>
              <p className='calculator-sidebar-label'>
                % from transaction
              </p>
              <TextInput
                className='calculator-sidebar-input'
                id='gainRatio'
                type='number'
                value={this.state.gainRatio * 100}
                onChange={this.handleChangeGainRatio}
              />
            </div>
            <button
              className='calculator-sidebar-btn'
              disabled={
                !this.state.initialClnReserve || !this.state.initialClnReserve || !this.state.amountOfTransactions ||
                !this.state.averageTransactionInUsd || !this.state.gainRatio
              }
              onClick={() => this.reRenderChart()}
            >Calculate</button>
          </div>
        </div>
        <div className='calculator-chart'>
          <div className='calculator-chart-legend'>
            <div className='calculator-chart-legend-point point-usd'>
              USD Value
            </div>
            <div className='calculator-chart-legend-point point-cc'>
              CC Value
            </div>
          </div>
          <div className='calculator-chart-content'>
            {this.props.calculatorPrices.length ? [
              <div className='calculator-chart-point point-usd'>
                USD
              </div>,
              <div className='calculator-chart-point point-cc'>
                CC
              </div>,
              <Chart
                className='calculator-graph'
                chartType='Line'
                data={this.renderChartData(this.props.calculatorPrices)}
                options={options}
              />]
              : <Loader color='#3a3269' className='calculator-logo-img calculator-chart-loader' />
            }
          </div>
          <div className='calculator-chart-footer'>
            <a href='' className='calculator-chart-link'>
              <FontAwesome name='play' /> Learn more about it
            </a>
            <button className='btn-adding'>
              <FontAwesome name='plus' className='top-nav-issuance-plus' /> Add CLN
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

const mapStateToProps = state => {
  return {
    fiat: state.fiat,
    calculatorPrices: state.screens.calculator.prices
  }
}
const mapDispatchToProps = {
  predictClnPrices
}
export default connect(mapStateToProps, mapDispatchToProps)(CalculatorModal)
