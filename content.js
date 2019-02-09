

//alert("Hello! I am an alert box!!");
var hlb = '<span style="background-color: #FFFF00">';
var hle = '</span>';
var matchwords = ['work',]


function get_nontag_ind(itext) {
    // this assumes we have balanced html, finds ind of tag beginning/ends
    var tagind = [];
    var tagstack = [];
    for (var i = 0; i < itext.length; i++) {
        if (itext[i] == '<') {
            tagstack.push(i);
        } else if (itext[i] == '>') { 
            var lastind = tagstack.pop();
            if (tagstack.length == 0) {
                tagind.push([lastind,i]);
            }
        }
        //console.log(tagstack);
    }
    
    //var nontagind = [];
    //for (var i = 0; i < tagind.length-1; i++) {
    //    nontagind.push([tagind
    //}

    return tagind;
}
    



var paragraphs = document.getElementsByTagName("p");
for (var i = 0; i < paragraphs.length; i++)
{
    var text = paragraphs[i].innerHTML;
    //console.log(text);
    //console.log(text.indexOf('<'));
    if (text.indexOf('<') > -1) {
        console.log(text);
        //console.log(text);
        //alert(text);
        var tagind = get_nontag_ind(text);
        console.log(tagind)
        //alert(tagind);
    }
    //for (var j = 0; j < text.length; j++)
    //{
    //   text[i]

    //}
    //var mw = 'work';
    
    //paragraphs[i].innerHTML = text.replace(mw, hlb + mw + hle)
}
