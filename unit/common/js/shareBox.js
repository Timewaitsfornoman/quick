
var shareBox = function(shareMenu) {

    var hide = true;
    var $J_sharebox = $('#J_sharebox');
    var $J_shareMask = $('#J_shareMask');
    var $J_sharecont = $('#J_sharecont');
    var $J_shareMenu = shareMenu || $('#J_shareMenu');

    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    $J_shareMenu.on('click', function(event) {

        var $this = $(this);

        $J_sharebox.css(
            'display', 'block'
        );

        setTimeout(function() {
            requestAnimationFrame(function() {

                $J_sharecont.css({
                    'transform': 'translate3d(0, 0, 0)'
                });

                $J_shareMask.css({
                    'opacity': 1
                });
            });
        }, 0)

        hide = false;
    });

    $J_sharebox.on('click', '.J_closeShare', function(event) {

        var $this = $(this);
        requestAnimationFrame(function() {
            $J_sharecont.css({
                'transform': 'translate3d(0px, 100%, 0px)'
            });

            $J_shareMask.css({
                'opacity': 0
            });
        });

        hide = true;
    });

    $J_shareMask.on('transitionend', function() {

        if (hide) {
            $J_sharebox.css('display', 'none');
        }

    });
};


module.exports = shareBox;