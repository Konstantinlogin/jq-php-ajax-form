/**
 * Created with JetBrains PhpStorm.
 * User: Vitaly
 * Date: 06.06.13
 * Time: 20:22
 * To change this template use File | Settings | File Templates.
 */
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(typeof haystack[i] == 'object') {
            if(arrayCompare(haystack[i], needle)) return true;
        } else {
            if(haystack[i] == needle) return true;
        }
    }
    return false;
}
window.isset = function (v) {
    if (typeof(v) == 'object' && v == 'undefined') {
        return false;
    } else  if (arguments.length === 0) {
        return false;
    } else {
        var buff = arguments[0];
        for (var i = 0; i < arguments.length; i++){
            if (typeof(buff) === 'undefined' || buff === null) return false;
            buff = buff[arguments[i+1]];
        }
    }
    return true;
}

function myconf() {
    var cf = $.Deferred();
        $.ajax({
            type: 'POST',
            url: 'feedback/',
            dataType: 'json',
            data: 'act=cfg',
            success: function(answer) {
                cf.resolve(answer.configs);
            }
        });
    return cf;
}

var mcf = myconf();

mcf.done(function(conf) {

// $(document).ready(function() {
// (function() {
//            var fb = $('.js-feedback');
//            if(fb.length > 0) {
//                 fb.each(function(){
//                     var form = $(this).closest('form'), name = form.attr('name');
//                     //console.log(form);
//                     if(isset(conf[name]) && isset(conf[name].cfg.antispamjs)) {
//                       $(form).prepend('<input type="text" name="'+ conf[name].cfg.antispamjs +'" value="tesby" style="display:none;">');
//                     }
//                 });
//             }
//   })();
// });


/**
 * Отправка форм.
 *
 */

function feedback(vars) {
    var bt = $(vars.form).find('.js-feedback');
    var btc = bt.clone();
    var bvc = bt.val();
    var cfg = conf[vars.act].cfg;

    $.ajax({
        type: 'POST',
        url: 'feedback/',
        cache: false,
        dataType: 'json',
        data: 'act=' + vars.act + '&' + vars.data,
        beforeSend: function() {
            //Состояние кнопки в процессе отправки формы
            $(bt).prop("disabled", true);
            $(bt).addClass('is-button-loading');
            $(bt).val("Отправка...")
        },
        success: function(answer) {

            // console.log(vars.form);

        var infoBlock = $(vars.form).find(".js-form__info-messages");

        infoBlock.each(function(){
            $(this).append("<ul class='info-block_error'></ul>"); //Создаем блок для вывод ошибок
            $(this).append("<ul class='info-block_info'></ul>"); // Создаем блок для сообщений ответа сервера
        });

        
            //console.log(cfg);
          if(isset(cfg.notify) && !/none/i.test(cfg.notify)) {

             if(/textbox/i.test(cfg.notify)) {

                    if(isset(answer.errors)) {
                        $.each(answer.errors, function(k,val) {

                            infoBlock.find(".info-block_error").each(function(){
                                $(this).prev().remove();
                                $(this).parent().find(".info-block_info").remove();
                                $(this).prepend("<li>" + val + "</li>");
                            })
                            
                        });
                    } if(isset(answer.infos)) {
                        $.each(answer.infos, function(k,val) {
                            infoBlock.find(".info-block_info").each(function(){
                                $(this).parent().find(".info-block_error").remove();
                                $(this).prev().remove(); 
                                $(this).prepend("<li>" + val + "</li>");
                                

                            })
                        });
                    }

            }  
        
            if(/color/i.test(cfg.notify)) {
                //  $(vars.form).find('input[type=text]:visible, textarea:visible, select:visible').css({'border': '1px solid green'}, 300);
                $(vars.form).find('input[type=text]:visible, textarea:visible, select:visible').addClass("is-input-success").removeClass("is-input-error");
                 if(isset(answer.errors)) {
                     $.each(answer.errors, function(k,val) {
                         var reg = /[a-z]/i;
                         if(reg.test(k)) {
                          var e = $(vars.form).find('[name='+ k +']');
                          if(e.length == 1) {
                            // $(e).css({'border': '1px solid red'}, 100);
                            $(e).addClass("is-input-error").removeClass("is-input-success");
                          }
                        }
                     });
                 }
            }
            
            
            //++ Выпиливаем работу с arctic modal
            // if(isset(answer.infos)) {
            //           var li='', $inf = $('<ul>', {id:'feedback-infolist'});
            //            $.each(answer.infos, function(k,val) {
            //               li += '<li>'+ val +'</li>';
            //            });

            //           $inf.html(li);

            //           $.arcticmodal('close');

            //           if(/modal/i.test(cfg.notify)) {
            //               var m = $('<div class="box-modal" id="feedback-modal-box" />');
            //               m.html($inf);
            //               m.prepend('<div class="modal-close arcticmodal-close">X</div>');
            //               $.arcticmodal({content: m});
                    //   }
                       //bt.replaceWith($inf);

                     /* setInterval(function(){
                        //$('#feedback-inf-box').replaceWith(btc);
                        $('#feedback-modal-box').arcticmodal('close');
                      }, 4000);*/
                //   }

            // }
          }
            $(bt).prop("disabled", false);
            $(bt).removeClass('is-button-loading');
            $(bt).val(bvc);

            if(isset(answer.ok) && answer.ok == 1) {
                $(vars.form).find(".info-block_info").addClass("is-server-success-message");
                $(vars.form).find(".info-block_info").removeClass("is-server-error-message");
                $(vars.form)[0].reset();      
            }
            else {
                $(vars.form).find(".info-block_info").addClass("is-server-error-message");
                $(vars.form).find(".info-block_info").removeClass("is-server-success-message");

            }
        }
    });

}

    $(document).on('mouseenter mouseover', '.feedback', function(){
        var form = $(this).closest('form'), name = form.attr('name');
        if(isset(conf[name]) && isset(conf[name].cfg.antispamjs)) {
            $('input[name='+ conf[name].cfg.antispamjs +']').val('');
        }
    });


/**
 * Обработчик кнопки форм.
 * Кнопка должна быть внутри тегов <form> c классом .js-feedback
 * будет отправлено любое кол-во полей, кроме файлов
 *
 */

$(document).on('click', '.js-feedback', function(){
   var form = $(this).closest('form'), name = form.attr('name'), obj = {};
       obj.form = form;
       obj.act = name;
       obj.data = $(form).serialize();

      feedback(obj);

    return false;
});

}); // done