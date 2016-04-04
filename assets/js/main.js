$(document)
  .ready(function () {
    $('footer')
      .removeClass('init');

    /**
     * Footer Expander
     */
    $('.content-inner')
      .waypoint(function (direction) {
        //console.info(direction);
        if (direction === 'down') {
          $('footer')
            .addClass('max');
          $('.footer-content')
            .fadeTo(0, 100, function () {
              Waypoint.refreshAll();
            })
            .slideDown();
        }
      }, {
        offset: 'bottom-in-view'
      });

    $('.content-inner')
      .waypoint(function (direction) {
        if (direction === 'up' && $('footer')
          .hasClass('max')) {
          //console.info('flup');

          $('.footer-content')
            .fadeTo(100, 0, function () {
              $(this)
                .hide();
              $('footer')
                .removeClass('max');
              Waypoint.refreshAll();

            });

        }
      }, {
        offset: 'bottom-in-view'
      });

    $('.contact-link')
      .click(function (e) {
        e.preventDefault();
        $('footer')
          .addClass('max');
        $('html, body')
          .animate({
              scrollTop: $(".footer-content")
                .show()
                .offset()
                .top
            },
            500,
            "linear"
          );
      });

    /**
     * Leaflet Map
     */
    if (!!$('#ovmap')
      .length) {
      var scale = 0.85;

      var map = L.map('ovmap', {
          minZoom: 0,
          maxZoom: 0,
          zoomControl: false,
          dragging: false,
          crs: L.CRS.Simple
        })
        .setView([-227 * scale, 276 * scale], 0);

      var w = 552 * scale, //1104,
        h = 454 * scale; //909;
      var southWest = map.unproject([0, h], map.getMaxZoom());
      var northEast = map.unproject([w, 0], map.getMaxZoom());

      map.setMaxBounds(new L.LatLngBounds(southWest, northEast));

      var imageUrl = 'assets/images/bm.jpg',
        imageBounds = [southWest, northEast];

      L.imageOverlay(imageUrl, imageBounds)
        .addTo(map);

      var lcc;
      var highlightFeature = function (e) {
        var layer = e.target;
        var id = layer._leaflet_id;
        var color = styles[id].color;
        var date = $('.thumbnail[data-mapid="' + id + '"]');

        layer.setStyle({
          weight: 5,
          stroke: true,
          fillOpacity: 0.7
        });

        date.css({
          border: '2px solid ' + color
        });

        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      };

      var resetHighlight = function (e) {
        var layer = e.target;
        var id = layer._leaflet_id;

        $('.thumbnail[data-mapid="' + id + '"]')
          .css({
            border: ''
          });

        lcc.resetStyle(e.target);
      };

      var styles = {
        'absi': {
          fillColor: "#FFEA00",
          stroke: true,
          weight: 3,
          color: "#FFF200",
          fillOpacity: 0.3
        },
        'arctic': {
          color: "#00ff00",
          fillColor: "#00ff00",
          stroke: false,
          fillOpacity: 0.3
        },
        'nwb': {
          color: "#EF0E40",
          fillColor: "#EF0E40",
          stroke: false,
          fillOpacity: 0.3
        },
        'wa': {
          color: "#FF7D00",
          fillColor: "#FF7D00",
          stroke: false,
          fillOpacity: 0.3
        },
        'np': {
          color: "#7D00FF",
          fillColor: "#7D00FF",
          stroke: false,
          fillOpacity: 0.3
        }
      };

      lcc = new L.geoJson(null, {
        fill: true,
        style: function (feature) {
          return styles[feature.properties.id];
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(feature.properties.name);
          layer._leaflet_id = feature.properties.id;
          layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
          });
          $('.thumbnail[data-mapid="' + layer._leaflet_id + '"]')
            .hover(function () {
              layer.fireEvent('mouseover', {
                target: layer
              });
            }, function () {
              layer.fireEvent('mouseout', {
                target: layer
              });
            });
        },
        coordsToLatLng: function (newcoords) {
          return (map.unproject([((newcoords[0] * scale)), (-(newcoords[
              1] *
            scale))], map.getMaxZoom()));
        }
      });

      lcc.addTo(map);

      $.ajax({
          dataType: "json",
          url: "assets/lcc_1.geojson",
          success: function (data) {
            $(data.features)
              .each(function (key, data) {
                lcc.addData(data);
              });
          }
        })
        .error(function () {});

      var myIcon = L.divIcon({
        className: 'my-div-icon'
      });
      var csc = $('.thumbnail[data-mapid="csc"]');

      var fg = L.featureGroup([L.marker([-273 * scale, 210 * scale], {
            icon: myIcon,
            text: 'AK CSC:  University of Alaska Anchorage',
            hint: 'left'
          }),
          //.bindPopup("<b>AK CSC:  University of Alaska Anchorage</b>"),
          L.marker([-283 * scale, 293 * scale], {
            icon: myIcon,
            text: 'AK CSC: University of Alaska Southeast',
            hint: 'right'
          }),
          //.bindPopup("<b>AK CSC: University of Alaska Southeast</b>"),
          L.marker([-230 * scale, 229 * scale], {
            icon: myIcon,
            text: 'AK CSC: University of Alaska Fairbanks',
            hint: 'top'
          }),
          //.bindPopup("<b>AK CSC: University of Alaska Fairbanks</b>")
        ])
        .on({
          mouseover: function () {
            csc.css({
              border: '2px solid ' + $('.my-div-icon')
                .css('backgroundColor')
            });
            $('.my-div-icon')
              .fadeTo(500, 1)
              .toggleClass('hint--always');
          },
          mouseout: function () {
            csc.css({
              border: ''
            });
            $('.my-div-icon')
              .fadeTo(500, 0.5)
              .toggleClass('hint--always');
          }
        })
        .addTo(map);

      fg.eachLayer(
        function (l) {
          $(l._icon)
            .attr({
              'data-hint': l.options.text,
            })
            .addClass('hint--' + l.options.hint +
              ' hint--medium hint--rounded hint--info');
        }
      );

      csc.hover(function () {
        fg.fireEvent('mouseover');
      }, function () {
        fg.fireEvent('mouseout');
      });
    }
  });
/**
 * Bootstrap Feeds
 * Based on FeedEk jQuery RSS/ATOM Feed Plugin v3.0 with YQL API
 * https://github.com/enginkizil/FeedEk
 */
(function ($) {
  $.fn.FeedBS = function (opt) {
    var def = $.extend({
      maxCount: 5,
      showDesc: true,
      showPubDate: true,
      descCharacterLimit: 0,
      titleLinkTarget: "_blank",
      dateFormat: "",
      dateFormatLang: "en"
    }, opt);

    var id = '#' + $(this)
      .attr("id");

    if (def.feedUrls === undefined) {
      return;
    }

    /*$("#" + id)
      .append('<img src="loader.gif" />');*/

    var list = $(id + ' ul')
      .empty();
    var getFeed = function (feed) {

      var YQLstr =
        'SELECT channel.item FROM feednormalizer WHERE output="rss_2.0" AND url ="' +
        feed.url + '" LIMIT ' + def.maxCount;
      $('.feed-spinner')
        .fadeIn();
      $.ajax({
        url: "https://query.yahooapis.com/v1/public/yql?q=" +
          encodeURIComponent(YQLstr) +
          "&format=json&diagnostics=false&callback=?",
        dataType: "json",
        success: function (data) {
          if (!data.query.results) {
            return;
          }

          if (!(data.query.results.rss instanceof Array)) {
            data.query.results.rss = [data.query.results.rss];
          }

          $.each(data.query.results.rss, function (e, itm) {
            var el = '';
            el += ' <li class="list-group-item media">' +
              '<div class="media-left">' +
              '<a href="' + itm.channel
              .item.link + '">' +
              '<img class="media-object" src="' + feed.icon +
              '" alt="...">' +
              '</a></div><div class="media-body">';
            if (def.showPubDate) {
              var date = new Date(itm.channel.item.pubDate);
              el += '<span class="post-meta">';
              if ($.trim(def.dateFormat)
                .length > 0) {
                try {
                  moment.lang(def.dateFormatLang);
                  el += moment(date)
                    .format(def.dateFormat);
                } catch (err) {
                  el += date.toLocaleDateString();
                }
              } else {
                el += date.toLocaleDateString();
              }
              el +=
                ' </span><span class="fa fa-rss text-warning"></span>';
            }
            el +=
              '<h4 class="media-heading"><a class="post-link" href="' +
              itm.channel
              .item.link + '" target="' + def.titleLinkTarget +
              '" >' + itm.channel.item.title + '</a></h4>';

            if (def.showDesc) {
              var text = $('<div>' + itm.channel.item.description +
                  '</div>')
                .text();
              el += '<div class="post-description">';
              if (def.descCharacterLimit > 0) {
                el += text.succinct({
                  size: def.descCharacterLimit
                });
              } else {
                el += text;
              }
              el += '<a class="post-link" href="' +
                itm.channel
                .item.link + '" target="' + def.titleLinkTarget +
                '" >more</a>';
              el += '</div></li>';
            }

            $(el)
              .hide()
              .appendTo(list)
              .fadeIn();

            //sort
            list.find('.list-group-item')
              .sort(function (a, b) {
                return (new Date($(a)
                    .find('.post-meta')
                    .text())
                  .getTime() > new Date($(b)
                    .find('.post-meta')
                    .text())
                  .getTime() ? -1 : 1);

              })
              .appendTo(list);
          });

          $('.feed-spinner')
            .fadeOut();
          Waypoint.refreshAll();
        }
      });
    };

    def.feedUrls.forEach(function (url) {
      getFeed(url);
    });

    //$("#" + id).append(list);

  };
})(jQuery);

/*
 * Copyright (c) 2014 Mike King (@micjamking)
 *
 * jQuery Succinct plugin
 * Version 1.1.0 (October 2014)
 *
 * Licensed under the MIT License
 */

/*global jQuery*/
(function ($) {
  'use strict';

  String.prototype.succinct = function (options) {

    var settings = $.extend({
      size: 240,
      omission: '...',
      ignore: true
    }, options);
    var textTruncated;
    var textDefault = this;
    var regex = /[!-\/:-@\[-`{-~]$/;

    if (textDefault.length > settings.size) {
      textTruncated = $.trim(textDefault)
        .substring(0, settings.size)
        .split(' ')
        .slice(0, -1)
        .join(' ');

      if (settings.ignore) {
        textTruncated = textTruncated.replace(regex, '');
      }
      return textTruncated + settings.omission;

    }
    return textDefault;
  };
})(jQuery);
