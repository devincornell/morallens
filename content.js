
COLORS = ['6b5b95', 'feb236', 'd64161', 'ff7b25', 'a2b9bc', 'b2ad7f', '878f99', '6b5b95', 'd6cbd3', 'eca1a6', 'bdcebe', 'ada397', 'd5e1df', 'e3eaa7', 'b5e7a0', '86af49']

function assignColors(codemap) {
    colormap = {};
    i = 0;
    for (var c in codemap) {
        colormap[codemap[c]] = COLORS[i];
        i++;
    }
    return colormap;
}

var HLTAGTEXT = '<span title="{title}" style="background-color: #{color}">$1</span>';
function highlightPage(dictobj) {
    //console.log(dictobj);
    var dict = dictobj['dict'];
    var colormap = assignColors(dictobj['codemap']);

    var textobj = document.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6');

    for (var i = 0; i < textobj.length; i++) // over each dom element
    {
        var text = textobj[i].innerHTML;
        for (w in dict) {
            // for now just highlight according to first category
            var cat = dict[w][0];
            var color = colormap[cat];
            var hlcolortag = HLTAGTEXT.replace('{color}',color);
            hlcolortag = hlcolortag.replace('{title}',cat);
            re = new RegExp('(?![^<]*>)(' + w + ')','i');
            text = text.replace(re, hlcolortag);
        };
        textobj[i].innerHTML = text;
        //console.log(text)
    }

}

chrome.storage.local.get('dictionary', function(dict) {
    highlightPage(dict['dictionary']);
});







