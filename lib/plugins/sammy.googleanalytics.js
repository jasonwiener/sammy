(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'sammy'], factory);
  } else {
    (window.Sammy = window.Sammy || {}).GoogleAnalytics = factory(window.jQuery, window.Sammy);
  }
}(function ($, Sammy) {

  // A simple plugin that pings Google Analytics tracker
  // every time a route is triggered. Originally by Brit Gardner (britg),
  // with updates from Aaron Quint (quirkey).
  //
  // ### Arguments
  //
  // +tracker+:: the Google Analytics pageTracker object.  Defaults to
  // the default object defined by the GA snippet, or pass your own if you
  // have a custom install
  //
  // ### Example
  //
  // Install Google Analytics to your site as you normally would. Be sure that
  // the 'pageTracker' global variable exists.
  //
  // Then, simply add the plugin to your Sammy App and it will automatically
  // track all of your routes in Google Analytics.
  // They will appear as page views to the route's path.
  //
  //      $.sammy(function() {
  //        this.use('GoogleAnalytics');
  //
  //        ...
  //      });
  //
  // If you have routes that you do not want to track, simply call `noTrack`
  // within the route.
  //
  //      $.sammy(function() {
  //        this.use('GoogleAnalytics')
  //
  //        this.get('#/dont/track/me', function() {
  //          this.noTrack();  // This route will not be tracked
  //        });
  //      });
  //
  Sammy.GoogleAnalytics = function(app, tracker) {
    var _tracker = tracker || window.pageTracker,
      shouldTrack = true;

    function disableTracking() {
      shouldTrack = false;
    }

    function enableTracking() {
      shouldTrack = true;
    }

    function trackPageview(path) {
      if (typeof _tracker != 'undefined') {
        _tracker._trackPageview(path);
      } else if (typeof _gaq != 'undefined') {
        _gaq.push(['_trackPageview', path]);
      }
    }

    this.helpers({
      // Disable tracking for the current route. Put at the begining of the
      // route's callback
      noTrack: function() {
        disableTracking();
      },
      // send a page view to the tracker with `path`
      track: function(path) {
        if((typeof _tracker != 'undefined' || typeof _gaq != "undefined") && shouldTrack) {
          this.log('tracking', path);
          trackPageview(path);
        }
      }
    });

    this.bind('event-context-after', function() {
      this.track(this.path);
      enableTracking();
    });
  };

  return Sammy.GoogleAnalytics;

}));