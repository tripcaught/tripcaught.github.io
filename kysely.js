var nytkysytaan;
var alakysymys;
var moodi;
var language;
var errnoaudios;
var alttext;

function play(tiedosto)
{
  if (document.getElementById("displayaudio").checked == true) {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', tiedosto);
    audioElement.play();
  }
}

function playagain()
{
  var audiofile = audiopath;

  if (localStorage.getItem("showtext") && !kysaudiot[nytkysytaan][alakysymys]) {
    document.getElementById("virhe").innerHTML = viestit["noqaudio"];
  }
  else {
    audiofile = audiopath+kysaudiot[nytkysytaan][alakysymys]+".ogg";
    play (audiofile);
  }
}

function hideaudio()
{
  if (document.getElementById("displayaudio").checked == false) {
    localStorage.setItem("showaudio",0);
    // Mikäli audio poistetaan käytöstä, laitetaan automaattisesti päälle teksti, jos se ei sitä ole jo
    if (document.getElementById("displaytext").checked == false && (!alttext || document.getElementById("displayalttext").checked == false)) {
      document.getElementById("displaytext").checked = true;
      hidetext();
    }
  }
  else {
    localStorage.setItem("showaudio",1);
  }
}

function hidetext()
{
  document.getElementById("virhe").innerHTML = "";
  if (document.getElementById("displaytext").checked == false) {
    document.getElementById("kysymys").style.display = "none";
    document.getElementById("vastaus").style.display = "none";
    localStorage.setItem("showtext",0);
    // Mikäli teksti poistetaan käytöstä, laitetaan automaattisesti päälle audio, jos se ei sitä ole jo
    if (document.getElementById("displayaudio").checked == false && (!alttext || document.getElementById("displayalttext").checked == false)) {
      document.getElementById("displayaudio").checked = true;
      hideaudio();
    }
  }
  else {
    document.getElementById("kysymys").style.display = "block";
    document.getElementById("vastaus").style.display = "block";
    localStorage.setItem("showtext",1);
    if (errnoaudios) { // Aiemmin ei voitu kysellä audioiden puutteesta; nyt kysytään
      document.getElementById("vastaus").innerHTML = "";
      arvo();
      errnoaudios = 0;
    }
  }
}

function hidealttext()
{
  document.getElementById("virhe").innerHTML = "";
  if (document.getElementById("displayalttext").checked == false) {
    document.getElementById("altkysymys").style.display = "none";
    document.getElementById("altvastaus").style.display = "none";
    localStorage.setItem("showalttext",0);
    // Mikäli teksti poistetaan käytöstä, laitetaan automaattisesti päälle audio, jos se ei sitä ole jo
    if (document.getElementById("displayaudio").checked == false && document.getElementById("displaytext").checked == false) {
      document.getElementById("displayaudio").checked = true;
      hideaudio();
    }
  }
  else {
    document.getElementById("altkysymys").style.display = "block";
    document.getElementById("altvastaus").style.display = "block";
    localStorage.setItem("showalttext",1);
    if (errnoaudios) { // Aiemmin ei voitu kysellä audioiden puutteesta; nyt kysytään
      document.getElementById("altvastaus").innerHTML = "";
      arvo();
      errnoaudios = 0;
    }
  }
}

function vaihdamoodi()
{
   document.getElementById("virhe").innerHTML = "";
   if (moodi == 1) {
     moodi = 2; // kysely
     document.getElementById("button-moodi").innerHTML = viestit["learn"];
     document.getElementById("kysymys").innerHTML = "";
     if (localStorage.getItem("showtext") == 0 && (!alttext || localStorage.getItem("showalttext") == 0) && audiolkm == 0) {
       document.getElementById("virhe").innerHTML = viestit["noaudios"];
       errnoaudios = 1;
     }
     else {
       arvo();
     }
   }
   else {
     moodi = 1; // opettelu
     document.getElementById("button-moodi").innerHTML = viestit["ask"];
     document.getElementById("kysymys").innerHTML = "";
     document.getElementById("vastaus").innerHTML = "";
     nytkysytaan = -1; alakysymys = -1;
     if (localStorage.getItem("showtext") == 0) {
       document.getElementById("displaytext").checked = false;
       hidetext();
     }
     else { // oletusarvoisesti näytetään kaikki
       document.getElementById("displaytext").checked = true;
       localStorage.setItem("showtext",1);
     }
     if (alttext) {
       document.getElementById("altkysymys").innerHTML = "";
       document.getElementById("altvastaus").innerHTML = "";
       if (localStorage.getItem("showalttext") == 0) {
         document.getElementById("displayalttext").checked = false;
         hidealttext();
       }
       else {
         document.getElementById("displayalttext").checked = true;
         localStorage.setItem("showalttext",1);
       }
     }
     if (localStorage.getItem("showaudio") == 0) {
       document.getElementById("displayaudio").checked = false;
     }
     else {
       document.getElementById("displayaudio").checked = true;
       localStorage.setItem("showaudio",1);
     }
   }
}

function alusta()
{
//   language = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage;
//   if (language.match(/^[a-z][a-z]-[A-Z][A-Z]/)) {
//     language = language.substr(0, 2);
//   }
   var i = document.getElementById("altkysymys");
   alttext = 1;
   if (i == null) {
     alttext = 0;
   }
   vaihdamoodi();
}

function arvo()
{
   var i = nytkysytaan; var j; var kysymys; var audiofile;
   while (i == nytkysytaan || !kysymys) { // Näin ei tule kahta samaa kysymystä peräkkäin
     i = Math.floor(Math.random() * kysymykset.length);
     // Varmistetaan, että kysymys on määritelty
     kysymys = kysymykset[i];
     j = Math.floor(Math.random() * kysymykset[i].length);
     // Hyväksytään vain kysymykset, joista löytyy kirjoitettu vastaus
     if (kysymykset[i][j] == "") {
       kysymys = undefined;
     }
     // Mikäli tekstiä ei näytetä, hyväksytään vain kysymykset, joista löytyy nauhoitettu audio
     if (kysaudiot[i][j] == undefined && localStorage.getItem("showtext") == 0 && (!alttext || localStorage.getItem("showalttext") == 0) && audiolkm > 0) {
       kysymys = undefined;
     }
     // Jos määriteltyjä audioita <= 1, voidaan toistaa sama kysymys
     if (localStorage.getItem("showtext") == 0 && (!alttext || localStorage.getItem("showalttext") == 0) && audiolkm <= 1) {
       nytkysytaan = -1;
     }
   }
   nytkysytaan = i;
   alakysymys = j;
   document.getElementById("kysymys").innerHTML = kysymykset[nytkysytaan][j];
   if (alttext) {
     document.getElementById("altkysymys").innerHTML = altkysymykset[nytkysytaan][j];
   }
   audiofile = audiopath+kysaudiot[i][j]+".ogg";
   play (audiofile);
//   document.getElementById("vastaus").innerHTML = " ";
}

function tarkista(numero)
{
   var i = numero.match(/-([0-9]+)/);
   i = i[1] - 1;
   document.getElementById("virhe").innerHTML = "";

   if (moodi == 1) {
     if (vasaudiot[i]) {
       play(audiopath+vasaudiot[i]+".ogg");
     }
     else if (localStorage.getItem("showtext") == 0 && localStorage.getItem("showalttext") == 0) {
       document.getElementById("virhe").innerHTML = viestit["noaudio"];
     }
     // voidaan aina merkitä kirjoitettu vastaus oikeisiin kenttiin; teksti ei ilmesty näkyviin, jos sitä
     // ei ole valittu, koska block-stylenä on none; mikäli käyttäjä haluaa audion kuultuaan nähdä
     // myös kirjoitetun muodon, se onnistuu helposti, koska kentässä on jo näkymättömänä oikea vastaus
     document.getElementById("kysymys").innerHTML = sanat[i];
     document.getElementById("altkysymys").innerHTML = altsanat[i];
   }
   else {
   // Muotoillaan näin, jotta vastaukseksi hyväksytään myös muut kysymykset, joilla on identtinen vastaus
     if (kysymykset[i].find(function(element) { return element == kysymykset[nytkysytaan][alakysymys] })) {
       play(audiopath+correctaudio+".ogg");
       document.getElementById("vastaus").innerHTML = "<b>"+correct+"</b>";
       setTimeout(function () {document.getElementById("kysymys").innerHTML = " ";}, 500);
       setTimeout(arvo, 1000);
       setTimeout(function() {document.getElementById("vastaus").innerHTML = " "}, 1000);
       if (alttext) {
         document.getElementById("altvastaus").innerHTML = "<b>"+altcorrect+"</b>";
         setTimeout(function () {document.getElementById("altkysymys").innerHTML = " ";}, 500);
         setTimeout(function() {document.getElementById("altvastaus").innerHTML = " "}, 1000);
       }
//       setTimeout(arvo, 2000);
//       arvo();
     }
     else {
       if (vasaudiot[i]) {
         play(audiopath+vasaudiot[i]+".ogg");
       }
       else {
         play(audiopath+incorrectaudio+".ogg");
       }
       document.getElementById("vastaus").innerHTML = "<b>"+incorrect+"</b>";
       if (alttext) {
         document.getElementById("altvastaus").innerHTML = "<b>"+altincorrect+"</b>";
       }
//       setTimeout(function() {document.getElementById("vastaus").innerHTML = " "}, 1500);
//       document.getElementById("vastaus").innerHTML = " ";
     }
   }
}

