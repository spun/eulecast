// resize by stepping down

var getChannelImage = function (channel) {
    var imageUrl = "";
    if (channel.hasOwnProperty('thumbnail')) {
        imageUrl = channel.thumbnail.url;
    } else {
        if (channel.image) {
            var urlImage = null;
            var hrefImage = null;
            if (Array.isArray && Array.isArray(channel.image)) {

                var numImage = channel.image.length;
                for (i = 0; i < numImage; i += 1) {
                    if (channel.image[i].hasOwnProperty('url')) {
                        urlImage = channel.image[i].url;
                    } else if (channel.image[i].hasOwnProperty('href')) {
                        hrefImage = channel.image[i].href;
                    }
                }
            } else if (channel.image[i].hasOwnProperty('url')) {
                urlImage = channel.image[i].url;
            } else if (channel.image[i].hasOwnProperty('href')) {
                hrefImage = channel.image[i].href;                            
            }
            imageUrl = hrefImage || urlImage;
        } 
    }
    return imageUrl;
}



var resizeImageSrc = function(src, width, height, quality) {

	var img = new Image();
	img .setAttribute('crossOrigin', 'anonymous');
	return new Promise(function(resolve, reject) {
		img.onload = function() {
			resizeImage(img, 50, 50).then(function(response) {
				resolve(response);
			})
		}
		img.src = src;
	});

}


var resizeImage = function (img, width, height, quality) {
    quality = quality || 1.0
 
    return new Promise(function(resolve, reject) {
	    var canvas  = document.createElement( 'canvas' )
	    var context = canvas.getContext('2d')
	 
	    context.imageSmoothingEnabled       = true
	    context.mozImageSmoothingEnabled    = true
	    context.oImageSmoothingEnabled      = true
	    context.webkitImageSmoothingEnabled = true
	    var type = "image/png"
	 
	    var cW = img.naturalWidth
	    var cH = img.naturalHeight
	 
	    var dst = new Image()
	    var tmp = null
	 
	    //resultD.resolve(img)
	    //return resultD.promise
	 
	    function stepDown () {
	      cW = Math.max(cW / 2, width) | 0
	      cH = Math.max(cH / 2, height) | 0
	 
	      canvas.width  = cW
	      canvas.height = cH
	 
	      context.drawImage(tmp || img, 0, 0, cW, cH)
	 
	      dst.src = canvas.toDataURL(type, quality)
	 
	      if (cW <= width || cH <= height) {
	        return resolve(dst.src)
	      }
	 
	      if (!tmp) {
	        tmp = new Image()
	        tmp.onload = stepDown
	      }
	 
	      tmp.src = dst.src
	    }
	 
	    if (cW <= width || cH <= height || cW / 2 < width || cH / 2 < height) {
	      canvas.width  = width
	      canvas.height = height
	      context.drawImage(img, 0, 0, width, height)
	      dst.src = canvas.toDataURL(type, quality)
	 
	      resolve(dst.src)
	    } else {
	      stepDown()
	    }
	 
    
    });

  }


module.exports = {
    'resizeImageSrc': resizeImageSrc,
    'getChannelImage': getChannelImage
};

