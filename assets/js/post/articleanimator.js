// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['jquery'], function($) {
    'use strict';
    var ArticleAnimator;
    return ArticleAnimator = (function() {
      function ArticleAnimator(articleSelector) {
        this.elementToTemplate = __bind(this.elementToTemplate, this);
        this.createArticleFromTemplate = __bind(this.createArticleFromTemplate, this);
        this.createTemplateFromArticle = __bind(this.createTemplateFromArticle, this);
        this.injectDataInArticle = __bind(this.injectDataInArticle, this);
        this.scrollTop = __bind(this.scrollTop, this);
        this.animatePage = __bind(this.animatePage, this);
        this.fetchPostThenExecuteCallback = __bind(this.fetchPostThenExecuteCallback, this);
        this.getPostUrlFromSlug = __bind(this.getPostUrlFromSlug, this);
        this.getCurrentArticleSlug = __bind(this.getCurrentArticleSlug, this);
        this.pushCurrentState = __bind(this.pushCurrentState, this);
        var eventname;
        this.canScroll = true;
        $(window).on('mousewheel', (function(_this) {
          return function(e) {
            if (!_this.canScroll) {
              return e.preventDefault();
            }
          };
        })(this));
        $(window).on('popstate', (function(_this) {
          return function(e) {
            console.log('LAAAAAAA', e.state);
            return console.log(history.state);

            /*
            self.currentPostIndex = history.state.index;
            self.$current.replaceWith( history.state.current );
            self.$next.replaceWith( history.state.next );
            
            self.refreshCurrentAndNextSelection();
            self.createPost({ type: 'next' });
            self.bindGotoNextClick();
             */
          };
        })(this));
        this.articleSelector = articleSelector;
        this.currentArticleSelector = this.articleSelector + '.current';
        this.followingArticleSelector = this.articleSelector + '.following';
        this.currentArticle = $(this.currentArticleSelector);
        this.followingArticle = $(this.followingArticleSelector);
        this.articleTemplate = this.createTemplateFromArticle(this.currentArticle);
        this.followingTemplate = this.createTemplateFromArticle(this.followingArticle);
        eventname = Modernizr.touch ? 'touchstart' : 'click';
        $('html').on(eventname, this.followingArticleSelector + ' .big-image', (function(_this) {
          return function(e) {
            e.preventDefault();
            return _this.animatePage();
          };
        })(this));
        this.pushCurrentState();
      }

      ArticleAnimator.prototype.pushCurrentState = function() {
        var currentArticleSlug, pagestate;
        currentArticleSlug = this.getCurrentArticleSlug();
        pagestate = {
          slug: currentArticleSlug
        };
        return history.pushState(pagestate, "", this.getPostUrlFromSlug(currentArticleSlug));
      };

      ArticleAnimator.prototype.getCurrentArticleSlug = function() {
        return this.currentArticle.attr('data:slug');
      };

      ArticleAnimator.prototype.getPostUrlFromSlug = function(slug) {
        return window.posturl.replace(/\=slug\=/, slug);
      };

      ArticleAnimator.prototype.fetchPostThenExecuteCallback = function(slug, cbk) {
        var jsonposturl;
        jsonposturl = window.jsonposturl.replace(/\=slug\=/, slug);
        return $.ajax(jsonposturl, {
          type: 'GET',
          success: cbk
        });
      };

      ArticleAnimator.prototype.animatePage = function() {
        var timeoutFunc, translationValue;
        this.canScroll = false;
        translationValue = this.followingArticle.get(0).getBoundingClientRect().top;
        this.currentArticle.addClass('fade-up-out');
        this.followingArticle.removeClass('content-hidden following').addClass('easing-upward').css({
          "transform": "translate3d(0, -" + translationValue + "px, 0)"
        });
        timeoutFunc = (function(_this) {
          return function() {
            var followingslug;
            _this.scrollTop();
            _this.followingArticle.removeClass('easing-upward');
            _this.currentArticle.remove();
            _this.followingArticle.css({
              "transform": ""
            });
            _this.followingArticle.addClass('current');
            _this.currentArticle = _this.followingArticle;
            _this.followingArticle = _this.followingTemplate.clone();
            _this.canScroll = true;
            _this.pushCurrentState();
            followingslug = _this.currentArticle.attr('data:followingslug');
            if (followingslug && followingslug !== 'null') {
              return _this.fetchPostThenExecuteCallback(followingslug, function(post) {
                _this.injectDataInArticle(_this.followingArticle, {
                  image: post.image,
                  title: post.title,
                  intro: post.intro,
                  content: post.content,
                  time: post.date_human,
                  author: post.author,
                  slug: post.slug,
                  followingslug: post.previous_slug
                });
                return _this.followingArticle.insertAfter(_this.currentArticle);
              });
            }
          };
        })(this);
        return window.setTimeout(timeoutFunc, 500);
      };

      ArticleAnimator.prototype.scrollTop = function() {
        return $(document.body).add($(window.html)).scrollTop(0);
      };

      ArticleAnimator.prototype.injectDataInArticle = function(article, data) {
        var bgimage;
        bgimage = data.image ? 'url(' + data.image + ')' : '';
        article.attr('data:slug', data.slug);
        article.attr('data:followingslug', data.followingslug);
        article.find('.big-image').css({
          backgroundImage: bgimage
        });
        article.find('h1.title').html(data.title || '');
        article.find('h2.description').html(data.intro || '');
        article.find('.content .text').html(data.content || '');
        article.find('h3.byline time').html(data.time || '');
        article.find('h3.byline .author').html(data.author || '');
        article.find('h3.byline .about').html(data.about || '');
        return article;
      };

      ArticleAnimator.prototype.createTemplateFromArticle = function(article) {
        var template;
        template = article.clone();
        return this.injectDataInArticle(template, {});
      };

      ArticleAnimator.prototype.createArticleFromTemplate = function(data) {
        var article;
        article = this.articleTemplate.clone();
        return this.injectDataInArticle(article, data);
      };

      ArticleAnimator.prototype.elementToTemplate = function(element) {
        return $(element).get(0).outerHTML;
      };

      return ArticleAnimator;

    })();
  });

}).call(this);
