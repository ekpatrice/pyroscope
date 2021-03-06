import React from 'react';
import { connect } from "react-redux";
import { setDateRange, receiveJSON, setFrom, setUntil} from "../redux/actions";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

import OutsideClickHandler from 'react-outside-click-handler';
import moment from 'moment';
import { bindActionCreators } from "redux";

const defaultPresets = [
  [
    { label: 'Last 5 minutes', from: 'now-5m', until: 'now'},
    { label: 'Last 15 minutes', from: 'now-15m', until: 'now'},
    { label: 'Last 30 minutes', from: 'now-30m', until: 'now'},
    { label: 'Last 1 hour', from: 'now-1h', until: 'now'},
    { label: 'Last 3 hours', from: 'now-3h', until: 'now'},
    { label: 'Last 6 hours', from: 'now-6h', until: 'now'},
    { label: 'Last 12 hours', from: 'now-12h', until: 'now'},
    { label: 'Last 24 hours', from: 'now-24h', until: 'now'},
  ],
  [
    { label: 'Last 2 days', from: 'now-2d', until: 'now'},
    { label: 'Last 7 days', from: 'now-7d', until: 'now'},
    { label: 'Last 30 days', from: 'now-30d', until: 'now'},
    { label: 'Last 90 days', from: 'now-90d', until: 'now'},
    { label: 'Last 6 months', from: 'now-6M', until: 'now'},
    { label: 'Last 1 year', from: 'now-1y', until: 'now'},
    { label: 'Last 2 years', from: 'now-2y', until: 'now'},
    { label: 'Last 5 years', from: 'now-5y', until: 'now'},
  ]
];

const multiplierMapping = {
  's': "second",
  'm': "minute",
  'h': "hour",
  'd': "day",
  'w': "week",
  'M': "month",
  'y': "year",
}

class DateRangePicker extends React.Component {
  constructor(props) {
    super(props);

    this.presets = defaultPresets;
    this.state = {
      // so the idea with this is that we don't want to send from and until back to the state
      //   until the user clicks some button. This is why these are stored in state here.
      from: props.from,
      until: props.until,
      opened: false
    };
  }

  componentDidMount() {
  }

  updateFrom = (from) => {
    this.setState({ from });
  }

  updateUntil = (until) => {
    this.setState({ until });
  }

  clickHandler = () => {
    this.props.actions.setDateRange(this.state.from, this.state.until);
  }

  humanReadableRange = () => {
    if (this.props.until == "now") {
      let m = this.props.from.match(/^now-(?<number>\d+)(?<multiplier>\D+)$/)
      if(m && multiplierMapping[m.groups.multiplier]) {
        let multiplier = multiplierMapping[m.groups.multiplier];
        if (m.groups.number > 1) {
          multiplier+="s"
        }
        return `Last ${m.groups.number} ${multiplier}`
      }
    }
    return moment(this.props.from*1000).format('lll') + " – " + moment(this.props.until*1000).format('lll');
    // return this.props.from + " to " +this.props.until;
  };

  showDropdown = () => {
    this.setState({
      opened: !this.state.opened
    })
  };

  selectPreset = ({label, from, until }) => {
    this.props.actions.setDateRange(from, until)
    this.hideDropdown();
  };

  hideDropdown = () => {
    this.setState({
      opened: false
    })
  };

  render() {
    return <div className={this.state.opened ? "drp-container opened" : "drp-container"}>
      <OutsideClickHandler onOutsideClick={this.hideDropdown}>
        <button className="btn drp-button" onClick={this.showDropdown}>
          <FontAwesomeIcon icon={faClock} />
          <span>{this.humanReadableRange()}</span>
        </button>
        <div className="drp-dropdown">
          <h4>Quick Presets</h4>
          <div className="drp-presets">
            {
              this.presets.map( (arr, i) => {
                return <div key={i} className="drp-preset-column">
                  {
                    arr.map( (x) => {
                      return <button className={`drp-preset ${x.label == this.humanReadableRange() ? "active" : ""}`} key={x.label} onClick={ () => this.selectPreset(x) }>{x.label}</button>;
                    })
                  }
                </div>
              })
            }
          </div>
          <h4>Custom Date Range</h4>
          <div className="drp-calendar-input-group">
            <input
              className="followed-by-btn"
              onChange={(e) => this.updateFrom(e.target.value)}
              onBlur={this.updateDateRange}
              value={this.state.from}
            /><button className="drp-calendar-btn btn" onClick={this.updateDateRange}>
              <FontAwesomeIcon icon={faClock} />
              Update
            </button>
          </div>
          <div className="drp-calendar-input-group">
            <input
              className="followed-by-btn"
              onChange={(e) => this.updateUntil(e.target.value)}
              onBlur={this.updateDateRange}
              value={this.state.until}
            /><button className="drp-calendar-btn btn" onClick={this.updateDateRange}>
              <FontAwesomeIcon icon={faClock} />
              Update
            </button>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  }
}

const mapStateToProps = state => ({
  ...state,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      setDateRange,
      receiveJSON,
      setFrom,
      setUntil,
    },
    dispatch,
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateRangePicker);
