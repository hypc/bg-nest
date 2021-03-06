var BgNest = function(options){
    options = options || {};
    this.options = {
        zindex: options['zindex'] || '-1',
        opacity: options['opacity'] || 0.5,
        color: options['color'] || '0,0,0',
        count: options['count'] || 150
    };
    this.init();
};

var frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame
    || function(func) { setTimeout(func, 1000 / 60); };

BgNest.prototype = {
    init: function(){
        var self = this;
        var config = self.options;

        // canvas
        var canvas = document.createElement('canvas');
        self.canvas = canvas;
        canvas.id = 'bgnest_' + new Date().getTime();
        canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:' + config.zindex + ';opacity:' + config.opacity;
        self.set_canvas_size();
        window.onresize = function(){ self.set_canvas_size(); };
        document.body.appendChild(canvas);

        // mouse point
        var mouse_point = { x: null, y: null, r: 20000 };
        window.onmousemove = function(e){
            e = e || window.event;
            mouse_point.x = e.clientX;
            mouse_point.y = e.clientY;
        };
        window.onmouseout = function(){ mouse_point.x = mouse_point.y = null; };
        self.mouse_point = mouse_point;

        // random points
        var random_points = [], random = Math.random;
        for(var i = 0; i < config.count; i++){
            random_points.push({
                x: random() * self.width,
                y: random() * self.height,
                xa: random() * 2 - 1,
                ya: random() * 2 - 1,
                r: 6000
            });
        }
        self.random_points = random_points;

        // all points
        self.all_points = random_points.concat([mouse_point]);

        return self;
    },
    set_canvas_size: function(){
        var self = this;
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        self.width = self.canvas.width = width;
        self.height = self.canvas.height = height;
    },
    draw: function(){
        var self = this;
        var context = self.canvas.getContext('2d');
        context.clearRect(0, 0, self.width, self.height);

        self.random_points.forEach(function(point, idx) {
            point.x += point.xa;
            point.y += point.ya;
            point.xa *= point.x > self.width || point.x < 0 ? -1 : 1;
            point.ya *= point.y > self.height || point.y < 0 ? -1 : 1;
            context.fillRect(point.x - 0.5, point.y - 0.5, 1, 1);

            for(var i = idx + 1; i < self.all_points.length; i++) {
                var e = self.all_points[i];
                if(null !== e.x && null !== e.y) {
                    var x_dist = point.x - e.x;
                    var y_dist = point.y - e.y;
                    var dist = x_dist * x_dist + y_dist * y_dist;

                    if(dist < e.r){
                        e === self.mouse_point && dist >= e.r / 2 && (point.x -= 0.03 * x_dist, point.y -= 0.03 * y_dist);
                        var d = (e.r - dist) / e.r;
                        context.beginPath();
                        context.lineWidth = d / 2;
                        context.strokeStyle = 'rgb(' + self.options.color + ',' + (d + 0.2) + ')';
                        context.moveTo(point.x, point.y);
                        context.lineTo(e.x, e.y);
                        context.stroke();
                    }
                }
            }
        });

        frame_func(function(){ self.draw(); });
        return self;
    }
};

module.exports = BgNest;
