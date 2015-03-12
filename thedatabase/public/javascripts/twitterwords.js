"use strict";
/*global React*/

var Displaytweet = React.createClass({
  loadTweet: function() {
    $.getJSON('/statuses/tweets', function(data) {
      this.setState({tweets: data});
      this.makeChart();
    }.bind(this));
  },
  getInitialState: function() {
    return {tweets: []};
  },
  componentDidMount: function() {
    this.loadTweet();
  },
  itertweets: function() {
    var histolist = [];
    var tweetdict = {};

    _.forEach(this.state.tweets, function(val, i) {
      console.log(val);
    });
    _.forEach(this.state.tweets, function(val, i) {
      console.log(val);
      console.log(typeof(val));
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
    console.log('hl');
    console.log(histolist);
    console.log('td');
    console.log(tweetdict);
    return histolist;
  },
  makeChart: function() {
    var histolist = this.itertweets();
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
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.1f}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
   }]
});
},
  render: function() {
    var divStyle = {
      'minWidth': '300px',
      height: '400px',
      margin: '0 auto'
    };
    return (
      <div>
        <SNform grabSN={this.load/>
        <div id="container" style={divStyle}/>
      </div>
    );

  }
});

var SNform = React.createClass({
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
    console.log('chosenSN');
    console.log(chosenSN);
    $.ajax({
      url: '/statuses/setSN',
      dataType: 'json',
      type: 'POST',
      data: chosenSN,
      success: function(data) {
        console.log('sn saved');
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
