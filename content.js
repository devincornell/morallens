

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
