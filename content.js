

//var hlb = '<span style="background-color: #FFFF00">';
//var hle = '</span>';
var hltext = '<span style="background-color: #FFFF00">$1</span>';
var matchwords = ['education', 'bilingual', 'playtime', 'a', 'am', 'parents', 'foundation'];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

var textobj = document.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6');
//textobj += document.getElementsByTagName("li");
//textobj += document.getElementsByTagName("h1");
//textobj += document.getElementsByTagName("h2");
//textobj += document.getElementsByTagName("h3");
//textobj += document.getElementsByTagName("h4");
console.log(textobj)
for (var i = 0; i < textobj.length; i++)
{
    var text = textobj[i].innerHTML;
    console.log(text)
    for (var j = 0; j < matchwords.length; j++) {
        // this should be better - doesn't work exactly right.
        re = new RegExp('(?![^<]*>)(' + escapeRegExp(matchwords[j]) + ')','i');
        text = text.replace(re, hltext);
    }
    textobj[i].innerHTML = text;
}


function applyhl(text) {
    for (var i = 0; i < matchwords.length; i++) {
        //var re = new RegExp('(\W|^)(' + matchwords[i] + ')(\W|$)');
        //var hlword = hlb + matchwords[i] + hle
        //text = text.replace(re,hlword)
        if (text.includes(matchwords[i])) {
            //re = new RegExp('(<.+?>[^<>]*?)(bilingual)([^<>]*?<.+?>)', 'i');
            re = new RegExp('(?![^<]*>)(education)','i')
            console.log(re.test(text));
            var nt = text.replace(re, hltext);
            //console.log(matchwords[i])
            console.log(text);
            console.log(nt);
        }
    }
    return text
}

function get_nontag_ind(itext) {
    // finds ind of both tag and nontag parts
    var tagind = [];
    var tagstack = [];
    for (var i = 0; i < itext.length; i++) {
        if (itext[i] == '<') {
            tagstack.push(i);
        } else if (itext[i] == '>') { 
            var lastind = tagstack.pop();
            if (tagstack.length == 0) {
                tagind.push([lastind,i+1]);
            }
        }
        //console.log(tagstack);
    }
    
    var nontagind = [];
    if (tagind.length > 0) {
        nontagind.push([0,tagind[0][0]]);
        for (var i = 0; i < tagind.length-1; i++) {
            nontagind.push([tagind[i][1],tagind[i+1][0]]);
        }
        nontagind.push([tagind[tagind.length-1][1], itext.length]);
    } else {
        nontagind.push([0,itext.length])
    }

    return {'tagind':tagind,'nontagind':nontagind};
}
    
/*
var paragraphs = document.getElementsByTagName("p");
for (var i = 0; i < paragraphs.length; i++)
{
    var text = paragraphs[i].innerHTML;
    var inds = get_nontag_ind(text);

    // build string serially
    var newtext = ''
    for (var j = 0; j < inds['tagind'].length; j++) {
        var ti = inds['tagind'][j]
        var nti = inds['nontagind'][j]
        newtext += applyhl(text.substring(nti[0],nti[1])) + text.substring(ti[0],ti[1])
    }
    if (inds['nontagind'].length > 0) {
        //console.log(inds)
        var nti = inds['nontagind'][inds['nontagind'].length-1]
        //console.log(nti)
        newtext += applyhl(text.substring(nti[0],nti[1]))
    }

    paragraphs[i].innerHTML = newtext
    //console.log(text)
    //console.log(newtext)


    // show text being picked up on
    //console.log(text);
    //for (var j = 0; j < inds['nontagind'].length; j++) {
    //    var nti = inds['nontagind'][j]
    //    console.log(text.substring(nti[0],nti[1]))
    //}
    //console.log(inds);
    //for (var j = 0; j < text.length; j++)
    //{
    //   text[i]

    //}
    //var mw = 'work';
    
    
}
*/

