
mfdurl = 'https://www.moralfoundations.org/sites/default/files/files/downloads/moral%20foundations%20dictionary.dic'

function convertRegex(str) {
    var nstr = str;
    nstr = nstr.replace('*','\\w*');
    nstr = nstr.replace(/\s+/,'\\ ');
    return nstr;
}

function parsedicttext(dtext) {
    lines = dtext.split('\n');
    var catcodemap = {};
    var wordcats = [];
    var dict = {}; // object version of wordcats
    var usedwords = [];
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
                
                // give exception if none of the entries match codemap
                if (!(tl[tl.length-1] in catcodemap) || ind == null) {
                    console.log(lines[i])
                    console.log(tl)
                    throw('dictionary line ' + i.toString() + ' has undefined/no value: ' + lines[i]);
                }

                // properties of entry
                var wordkey = convertRegex(tl.slice(0,ind).join(' '));
                var catkeys = tl.slice(ind,tl.length)
                var catvalues = [];
                catkeys.forEach(function(ck) {
                    catvalues.push(catcodemap[ck]);
                });
                //print(wordkey)
                // Dict entries based on list of word,cats pairs
                var wordind = usedwords.indexOf(wordkey);
                if (wordind < 0) {
                    // make new entry for word with cats
                    var rawword = tl.slice(0,ind).join(' ');

                    var wordobj = {};
                    wordobj['word'] = wordkey;
                    wordobj['rawword'] = rawword;
                    wordobj['cats'] = catvalues;
                    usedwords.push(wordkey);
                    wordcats.push(wordobj);
                } else {
                    // entry already exists, just add catss
                    wordcats[wordind]['cats'] = wordcats[wordind]['cats'].concat(catvalues);
                }

                // Dict entries based on object (redundant to wordcats creation)
                if (!(wordkey in dict)) {
                    dict[wordkey] = [];
                }
                dict[wordkey] = dict[wordkey].concat(catvalues);
            }
        }
    }

    return {'dict':dict, 'codemap':catcodemap, 'wordcats':wordcats, 'usedwords':usedwords};
}

COLORS = ['6b5b95', 'feb236', 'd64161', 'ff7b25', 'a2b9bc', 'b2ad7f', '878f99', '6b5b95', 'd6cbd3', 'eca1a6', 'bdcebe', 'ada397', 'd5e1df', 'e3eaa7', 'b5e7a0', '86af49']
var HLTAGTEXT = '<span style="background-color: #{}">$1</span>';

function assignColors(codemap) {
    colormap = {};
    i = 0;
    for (var c in codemap) {
        colormap[codemap[c]] = COLORS[i];
        i++;
    }
    return colormap;
}

function highlightPage(dictobj) {
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
            var hlcolortag = HLTAGTEXT.replace('{}',color);
            re = new RegExp('(?![^<]*>)(' + w + ')','i');
            text = text.replace(re, hlcolortag);
        };
        textobj[i].innerHTML = text;
        //console.log(text)
    }

}




// for parsing dict (later should be in "on install" event handler)
var xhr = new XMLHttpRequest();
xhr.open("GET", mfdurl, true);
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    // JSON.parse does not evaluate the attacker's scripts.
    //var resp = JSON.parse(xhr.responseText);
    var dict = parsedicttext(xhr.responseText);
    chrome.storage.local.set({'dictionary': dict}, function() {
      //console.log('dict is set to ' + dict);
      console.log(dict)
      highlightPage(dict)
    });
  }
}
xhr.send();

/*
chrome.storage.local.onChangedonChanged(function (changes, areaName) {
    chrome.storage.local.get('dictionary', function (r) {
        console.log('got dict ' + r);
        return r;
    });

});

console.log('idk what even ' + dict);
*/

var matchcolors = [
    {'color':'FFFF00', 'words':['education', 'bilingual', 'playtime']},
    {'color':'00FF00', 'words':['weekly', 'day', 'children']},
]

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}



