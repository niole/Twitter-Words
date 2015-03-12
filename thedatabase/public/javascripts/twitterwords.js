"use strict";
/*global React*/

var Displaytweet = React.createClass({
  loadChart: function() {
    this.setState({tweets: []});
    this.makeChart(this.itertweets());
  },
  getInitialState: function() {
    return {tweets: []};
  },
  componentDidMount: function() {
    this.loadChart();
  },
  itertweets: function() {
    var histolist = [];
    var tweetdict = {};
    if (this.state.tweets.length === 0) {
      return histolist;
    }
    else {
    _.forEach(this.state.tweets, function(val, i) {
    //  console.log(val);
    });
    _.forEach(this.state.tweets, function(val, i) {
     //console.log(val);
     //console.log(typeof(val));
      var splittweet = val.split(' ');
      _.forEach(splittweet, function(val, i) {
        if (val in tweetdict) {
          tweetdict[val]++;
        }
        else {
          tweetdict[val] = 1;
        }
      });
    });
    for (var k in tweetdict) {
      if (tweetdict[k] > 2) {
      histolist.push([k, tweetdict[k]]);
      }
    }
    return histolist;
    }
  },
  makeChart: function(histolist) {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'World\'s largest cities per 2014'
        },
        subtitle: {
            text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Population (millions)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>'
        },
        series: [{
            name: 'Population',
            data: this.itertweets(),
            //dataLabels: {
                //enabled: true,
                //rotation: -90,
                //color: '#FFFFFF',
                //align: 'right',
                //format: '{point.y:.1f}', // one decimal
                //y: 10, // 10 pixels down from the top
                //style: {
                    //fontSize: '13px',
                    //fontFamily: 'Verdana, sans-serif'
                //}
            //}
   }]
});
},
  _handleUpdateChart: function(data, customHistInput) {
    console.log('in handle update chart');
    console.log(customHistInput);
    console.log(data);
    var dataToSearch = [];
    if (customHistInput.length !== 0) {
      // TODO filter out tweets without any words in customHistInput
      _.forEach(data, function(tweetstring) {
        _.forEach(customHistInput, function(chosenword) {
          if (tweetstring.includes(chosenword)) {
            dataToSearch.push(chosenword);
          }
        });
      });
    this.setState({tweets: dataToSearch});
    this.makeChart(this.itertweets());
    }
    else {
    this.setState({tweets: data});
    this.makeChart(this.itertweets());
    }
  },
  render: function() {
    var divStyle = {
      'minWidth': '300px',
      height: '400px',
      margin: '0 auto'
    };
    return (
      <div>
        <SNform updateChart={this._handleUpdateChart}/>
        <div id="container" style={divStyle}/>
      </div>
    );
  }
});

var SNform = React.createClass({
  propTypes: {
    updateChart: React.PropTypes.func.isRequired,
  },
  render: function() {
    return (
      <form onSubmit={this.grabSN}>
        <input type="text" name="SN" placeholder="pick a screen name.."/>
        <input className="btn btn-primary" type="submit" value="submit"/>
      </form>
    );
  },
  grabSN: function(e) {
    e.preventDefault();
    var chosenSN = $(e.target).find("input[name=SN]").val();
    var splitSN = chosenSN.split(' ');
    console.log('sliced');
    console.log(splitSN.slice(0,1));
    var customHistInput = [];
    if (splitSN.length > 1) {
      customHistInput = splitSN.slice(1,splitSN.length);
    }
    console.log('chosenSN');
    console.log(chosenSN);
    $.ajax({
      url: '/statuses/setSN',
      dataType: 'json',
      type: 'POST',
      data: { 'screenName': splitSN.slice(0,1).toString() },
      success: function(data) {
        console.log('success');
        console.log('customhist');
        console.log(customHistInput);
        this.props.updateChart(data, customHistInput);
      }.bind(this),
      error: function(xhr,status,err) {
        console.error(this.props.url,status.err.toString());
      }.bind(this)
    });
   }
});

$(document).ready(function() {
  React.render(
    <Displaytweet/>,
    $('#displaytweet')[0]);
});