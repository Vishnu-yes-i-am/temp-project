$(document).ready(function () {
    jQuery('<div class="quantity-nav"><button class="quantity-button quantity-up">&#xf106;</button><button class="quantity-button quantity-down">&#xf107</button></div>').insertAfter('.quantity input');
    jQuery('.quantity').each(function () {
      var spinner = jQuery(this),
          input = spinner.find('input[type="number"]'),
          btnUp = spinner.find('.quantity-up'),
          btnDown = spinner.find('.quantity-down'),
          min = input.attr('min'),
          max = input.attr('max');
  
      btnUp.click(function () {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });
  
      btnDown.click(function () {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
          var newVal = oldValue;
        } else {
          var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
      });
  
    });
  });
  $('#settingShow').on('click', function () {
    if($('#settingshow').hasClass('settingFade'))
    {
      $('#settingshow').addClass('settingFadeout');
      $('#settingshow').removeClass('settingFade');
      $('#settingshow').css('left', '-400px');
    }
    else{
      $('#settingshow').addClass('settingFade');
      $('#settingshow').css('left', '0px');
    }


  });
  $("#searchUser").on('click', function () {
    $('.searchbar').css("display",'flex');
    $('.userText').css('display','none');
    $('.searchText').css('display', 'flex');
    $('#searchUser').css('display', 'none');
  });
  $("#back").on('click', function () {
    $('.searchbar').css("display",'none');
    $('.userText').css('display','initial');
    $('.searchText').css('display', 'none');
    $('#searchUser').css('display', 'initial');
  });
  $('#zoomHover').hover(function () {
      // over
      $('.detail').css('display', 'initial');
      $('.singleRecord').css('display', 'none');
      
    }, function () {
      // out
      $('.detail').css('display', 'none');
      $('.singleRecord').css('display', 'initial');
    }
  );