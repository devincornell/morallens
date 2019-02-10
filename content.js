










mfdurl = 'https://www.moralfoundations.org/sites/default/files/files/downloads/moral%20foundations%20dictionary.dic'

function convertRegex(str) {
    return str.replace('*','\\w*');
}

function parsedicttext(dtext) {
    lines = dtext.split('\n');
    var catcodemap = {}
    var wordcats = {}
    var defmode = false;
    for (var i = 0; i < lines.length; i++) {
        var tl = lines[i].trim().split(/\s+/i);
        tl = tl.filter(function (w) { return w != '' })

        if (tl.length > 0 && tl[0] == '%') {
            defmode = !defmode;
        } else if (tl.length > 0) {
            if (defmode) {
                catcodemap[tl[0]] = tl.slice(1,tl.length).join(' ');
            } else {

                // search from right for first non-code entry
                var ind = null;
                for (var j = tl.length-1; j >= 0; j--) {
                    if (tl[j] in catcodemap) {
                        ind = j;
                    }
                }
                //console.log('fuck')
                //console.log(ind)
                //console.log(catcodemap)
                if (!(tl[tl.length-1] in catcodemap) || ind == null) {
                    console.log(lines[i])
                    console.log(tl)
                    throw('dictionary line ' + i.toString() + ' has undefined/no value: ' + lines[i]);
                }

                // combine word/phrase for dict entry
                var wordkey = convertRegex(tl.slice(0,ind).join(' '));
                if (!(wordkey in wordcats)) {
                    wordcats[wordkey] = [];
                }

                // add each category assigned on the given line
                for (var j = ind; j < tl.length; j++) {
                    wordcats[wordkey].push(catcodemap[tl[j]]);
                }
            }
        }
    }
    return wordcats;
}

// for parsing dict (later should be in "on install" event handler)
var xhr = new XMLHttpRequest();
xhr.open("GET", mfdurl, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // JSON.parse does not evaluate the attacker's scripts.
    //var resp = JSON.parse(xhr.responseText);
    var dict = parsedicttext(xhr.responseText);
    chrome.storage.sync.set({'dictionary': dict}, function() {
      console.log('dict is set to ' + dict);
    });
  }
}
xhr.send();
var dict = chrome.storage.sync.get('dictionary', function (r) {
    return r;
})
console.log(dict)


var hltext = '<span style="background-color: #{}">$1</span>';
var matchcolors = [
    {'color':'FFFF00', 'words':['education', 'bilingual', 'playtime']},
    {'color':'00FF00', 'words':['weekly', 'day', 'children']},
]

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}


var textobj = document.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6');
for (var i = 0; i < textobj.length; i++)
{
    var text = textobj[i].innerHTML;
    console.log(text)
    for (var j = 0; j < matchcolors.length; j++) {
        var color = matchcolors[j]['color']
        var words = matchcolors[j]['words']
        hlcolortag = hltext.replace('{}',color)
        for (var k = 0; k < words.length; k++) {
            // this regex should be better - doesn't work exactly right.
            re = new RegExp('(?![^<]*>)(' + escapeRegExp(words[k]) + ')','i');
            text = text.replace(re, hlcolortag);
        }
    }
    textobj[i].innerHTML = text;
}
