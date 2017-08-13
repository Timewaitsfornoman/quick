/**
 * @desc    返回顶部
 * @date    2014-09-04
 */

module.exports = function (thresholdTop) {
    var thresholdTop  = thresholdTop || window.innerHeight * 2 + 100,
    selector = '.backtop',
    $win = $(window),
    backtop = $('<a href="javascript:;" class="backtop"></a>'),
    imgBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAkBAMAAADx8p7SAAAAKlBMVEUAAAD+/v7//f7//f7+/f3//////v///////v///////v///P3//v7///8rNLtqAAAADXRSTlMA/NocCb9OcbXoz4VlIaFugwAAAIlJREFUKM/tyrENg1AMRVFLKdKmSpcR0mSCDJEBskikjMAQtEi0bEAJBaLyLoDvt54EK/Aq++pY2eVZ224vn95cQu6fPfLChEYvTOjuM0zo68MvmJD5cA0mtCYLJrQlWKJIsEQkGIgUTIgEA5FgIFKyZkMk2N8CkWCV9aBM/ErsTIf0uB1S1+a1AEa7aZ7PHZ7sAAAAAElFTkSuQmCC';

    backtop.css({
        'display': 'none',
        'position': 'fixed',
        'width': '1.6rem',
        'height': '1.6rem',
        'right': '0.67rem',
        'border-radius' : '50%',
        'bottom': '2.9rem',
        'z-index' : '0',
        'background': 'rgba(0, 0, 0, 0.4) url('+imgBase64+') no-repeat center',
        'background-size' : '40% 40%'
    });

    $('body').append(backtop);

    $win.on('scroll', function(){
        if ($win.scrollTop() < thresholdTop) {
            backtop.css('display', 'none');
        } else{
            backtop.css('display', 'block');
        }
    });

    $(document).on('click', selector, function(){
        $win.scrollTop(0);
        backtop.css('display', 'none');
    });
} ;
