// Generated by CoffeeScript 1.7.1
(function() {
  define(['jquery', 'post/articleanimator', 'menu/classie', 'menu/mlpushmenu'], function($, articleanimator, classie) {
    'use strict';
    new articleanimator('article.page');
    window.classie = classie;
    new mlPushMenu(document.getElementById('mp-menu'), document.getElementById('trigger'));
    return $('html').on('mozza:html5urlchange', function(e, data) {
      var a;
      if (window.ga && typeof window.ga === 'function') {
        a = $('<a>', {
          href: data.url
        })[0];
        return window.ga('send', 'pageview', a.pathname);
      }
    });
  });

}).call(this);
