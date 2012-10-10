/**
 * JavaScript/Ajax Samples
 * @module jquery_ticker
 */

var jquery_ticker = {

  tickerCurrent: 0,
  tickerItems: 0,
  tickerInterval: undefined,

  onload: function() {
    jquery_ticker.tickerItems = $('#ticker li').length;
    jquery_ticker.makeCounter();
    $('#ticker li').hide();
    jquery_ticker.showTicker(0);
    jquery_ticker.tickerInterval = setInterval(jquery_ticker.ticker, 7000);
  },

  makeCounter: function() {
    $('#navi li').each(function(i) {
      $(this)
        .addClass('offCounter')
        .bind('click', jquery_ticker.clickCounter)
        .bind('mouseover', jquery_ticker.moverCounter)
        .bind('mouseout', jquery_ticker.moutCounter);
    });
  },

  clickCounter: function() {
    clearInterval(jquery_ticker.tickerInterval);
    jquery_ticker.hideTicker(jquery_ticker.tickerCurrent);
    jquery_ticker.tickerCurrent = $('#navi li').index(this);
    jquery_ticker.showTicker(jquery_ticker.tickerCurrent);
    $(this).removeClass('offCounter').addClass('onCounter');
  },

  moverCounter: function() {
    $(this).removeClass('offCounter').addClass('onCounter');
  },

  moutCounter: function() {
    $(this).removeClass('onCounter').addClass('offCounter');
    jquery_ticker.showTicker(jquery_ticker.tickerCurrent);
  },

  ticker: function() {
    jquery_ticker.hideTicker(jquery_ticker.tickerCurrent);
    jquery_ticker.tickerCurrent = ++jquery_ticker.tickerCurrent%jquery_ticker.tickerItems;
    jquery_ticker.showTicker(jquery_ticker.tickerCurrent);
  },

  showTicker: function(i) {
    $('#ticker li:eq(' + i + ')').fadeIn('fast');
    $('#navi li:eq(' + i + ')').removeClass('offCounter').addClass('onCounter');
  },

  hideTicker: function(i) {
    $('#ticker li').hide();
    $('#navi li:eq(' + i + ')').removeClass('onCounter').addClass('offCounter');
  }

}

$(function() { $('body').removeAttr('class'); });
$(function() { jquery_ticker.onload(); });
