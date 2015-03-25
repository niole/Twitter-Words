"use strict";
/*global React*/

var Displaytweet = React.createClass({
  getInitialState: function() {
    return {tweets: []};
  },
  itertweets: function() {
    var histolist = [];
    var tweetdict = {};
    if (this.state.tweets.length === 0) {
      return histolist;
    }
    else {
    _.forEach(this.state.tweets, function(val, i) {
    });
    _.forEach(this.state.tweets, function(val, i) {
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
  makeChart: function(histolist, screenname) {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Histogram of Words Tweeted by ' + screenname
        },
        subtitle: {
            text: 'Source: Twitter'// <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">Wikipedia</a>'
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
                text: ''
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'number of times tweeted: <b>{point.y:.1f}</b>'
        },
        series: [{
            name: 'Population',
            data: this.itertweets(),
   }]
});
},
  _handleUpdateChart: function(data, screenname) {
    this.setState({tweets: data});
    this.makeChart(this.itertweets(), screenname);
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
      <form onSubmit={this.grabSN} className="jumbotron">
        <input type="text" name="SN" placeholder="pick a screen name.."/>
        <input className="btn btn-primary" type="submit" value="submit"/>
      </form>
    );
  },
  grabSN: function(e) {
    e.preventDefault();
    var chosenSN = $(e.target).find("input[name=SN]").val();
    $.ajax({
      url: '/statuses/setSN',
      dataType: 'json',
      type: 'POST',
      data: { 'screenName': chosenSN },
      success: function(data) {
        this.props.updateChart(data, chosenSN);
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
