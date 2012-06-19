/*global window:true, document:true */
var $ = require('zquery');
exports.app = {
start: function() {
var locations, corrects;

function f(xs) {
    var result = [];
    for(var x in xs) {
        result.push([x, (xs[x].lng - 7.5) * 240, 960 - (xs[x].lat - 54) * 240]);
    }
    locations = result;
}

f({ 'Rødby': { lng: 11.39999961853027, lat: 54.70000076293945 },
  'Sønderborg': { lng: 9.783333778381348, lat: 54.90000152587891 },
  Svendborg: { lng: 10.60841369628906, lat: 55.0597038269043 },
  Aakirkeby: { lng: 14.91666698455811, lat: 55.070556640625 },
  'Nexø': { lng: 15.13194465637207, lat: 55.0625 },
  'Rønne': { lng: 14.70138931274414, lat: 55.09860992431641 },
  'Præstø': { lng: 12.05000019073486, lat: 55.11666488647461 },
  Glamsbjerg: { lng: 10.11666679382324, lat: 55.26666641235352 },
  Fuglebjerg: { lng: 11.56666660308838, lat: 55.29999923706055 },
  'Korsør': { lng: 11.14999961853027, lat: 55.33333206176758 },
  Langeskov: { lng: 10.58615875244141, lat: 55.35675430297852 },
  'Sorø': { lng: 11.56666660308838, lat: 55.43333435058594 },
  'Køge': { lng: 12.18333339691162, lat: 55.45000076293945 },
  Kerteminde: { lng: 10.66666698455811, lat: 55.45000076293945 },
  Middelfart: { lng: 9.75, lat: 55.5 },
  'Høng': { lng: 11.30000019073486, lat: 55.51666641235352 },
  'Gørlev': { lng: 11.23333358764648, lat: 55.53333282470703 },
  Fredericia: { lng: 9.766666412353516, lat: 55.58333206176758 },
  'Fløng': { lng: 12.18333339691162, lat: 55.66666793823242 },
  Frederiksberg: { lng: 12.53333377838135, lat: 55.66666793823242 },
  Kalundborg: { lng: 11.10000038146973, lat: 55.68333435058594 },
  Frederikssund: { lng: 12.05000019073486, lat: 55.83333206176758 },
  Slangerup: { lng: 12.18333339691162, lat: 55.84999847412109 },
  'Nivå': { lng: 12.51666641235352, lat: 55.93333435058594 },
  'Frederiksværk': { lng: 12.03333377838135, lat: 55.96666717529297 },
  Hundested: { lng: 11.86666679382324, lat: 55.96666717529297 },
  'Espergærde': { lng: 12.56666660308838, lat: 56 },
  'Helsingør': { lng: 12.61666679382324, lat: 56.03333282470703 },
  'Kibæk': { lng: 8.850000381469727, lat: 56.03333282470703 },
  Skanderborg: { lng: 9.933333396911621, lat: 56.03333282470703 },
  'Ringkøbing': { lng: 8.25, lat: 56.08333206176758 },
  Gilleleje: { lng: 12.31666660308838, lat: 56.11666488647461 },
  Silkeborg: { lng: 9.566666603088379, lat: 56.16666793823242 },
  'Rønde': { lng: 10.48333358764648, lat: 56.29999923706055 },
  Holstebro: { lng: 8.369999885559082, lat: 56.22000122070312 },
  'Grenå': { lng: 10.88333320617676, lat: 56.41666793823242 },
  Assentoft: { lng: 10.14999961853027, lat: 56.43333435058594 },
  'Nykøbing Mors': { lng: 8.859167098999023, lat: 56.7952766418457 },
  Dronninglund: { lng: 10.30000019073486, lat: 57.15000152587891 },
  'Sæby': { lng: 10.53233337402344, lat: 57.32952499389648 },
  Frederikshavn: { lng: 10.53972244262695, lat: 57.44111251831055 },
  Hirtshals: { lng: 9.949999809265137, lat: 57.58333206176758 },
  "København": { lng: 12.56833362579346, lat: 55.67610931396484 },
  'Langå': { lng: 9.894000053405762, lat: 56.39300155639648 },
  Them: { lng: 9.550000190734863, lat: 56.09999847412109 },
  'Birkerød': { lng: 12.43333339691162, lat: 55.83333206176758 },
  Ullerslev: { lng: 10.66666698455811, lat: 55.36333465576172 },
  'Farsø': { lng: 9.350000381469727, lat: 56.78333282470703 },
  'Ølgod': { lng: 8.616666793823242, lat: 55.81666564941406 },
  'Højer': { lng: 8.716666221618652, lat: 54.96666717529297 },
  'Hillerød': { lng: 12.31666660308838, lat: 55.93333435058594 },
  Aggersund: { lng: 9.300000190734863, lat: 57 },
  Hanstholm: { lng: 8.619999885559082, lat: 57.11999893188477 },
  Billund: { lng: 9.115278244018555, lat: 55.7308349609375 },
  Havrebjerg: { lng: 11.33333301544189, lat: 55.43333435058594 },
  'Ålsgårde': { lng: 12.53694438934326, lat: 56.07666778564453 },
  'Tjæreborg': { lng: 8.586999893188477, lat: 55.4630012512207 },
  'Låsby': { lng: 9.816666603088379, lat: 56.15000152587891 },
  'Søften': { lng: 10.10000038146973, lat: 56.23333358764648 },
  Struer: { lng: 8.616666793823242, lat: 56.48333358764648 },
  Skjern: { lng: 8.5, lat: 55.95000076293945 },
  Aalestrup: { lng: 9.5, lat: 56.70000076293945 },
  Blenstrup: { lng: 10, lat: 56.86666488647461 },
  'Bælum': { lng: 10.11666679382324, lat: 56.83333206176758 },
  Beder: { lng: 10.21666622161865, lat: 56.06666564941406 },
  'Kruså': { lng: 9.402222633361816, lat: 54.84916687011719 },
  Vestervig: { lng: 8.318611145019531, lat: 56.76361083984375 },
  'Veksø': { lng: 12.23944473266602, lat: 55.75416564941406 },
  'Tårs': { lng: 10.10000038146973, lat: 57.38333511352539 },
  'Ishøj': { lng: 12.35124969482422, lat: 55.6158332824707 },
  'Nærum': { lng: 12.55000019073486, lat: 55.81666564941406 },
  Hedensted: { lng: 9.683333396911621, lat: 55.76666641235352 },
  'Rødekro': { lng: 9.350000381469727, lat: 55.06666564941406 },
  'Næstved': { lng: 11.76666641235352, lat: 55.23333358764648 },
  Ringe: { lng: 10.48027801513672, lat: 55.23749923706055 },
  Ribe: { lng: 8.762177467346191, lat: 55.32837677001953 },
  Strib: { lng: 9.783333778381348, lat: 55.53333282470703 },
  'Holbæk': { lng: 11.71666622161865, lat: 55.71666717529297 },
  Farum: { lng: 12.39051818847656, lat: 55.81382369995117 },
  'Give': { lng: 9.237222671508789, lat: 55.84500122070312 },
  Odder: { lng: 10.16666698455811, lat: 55.96666717529297 },
  Gjern: { lng: 9.75, lat: 56.23333358764648 },
  Hobro: { lng: 9.800000190734863, lat: 56.63333511352539 },
  Aars: { lng: 9.533333778381348, lat: 56.79999923706055 },
  'Løgstør': { lng: 9.25, lat: 56.96666717529297 },
  Nibe: { lng: 9.633333206176758, lat: 56.98333358764648 },
  Aarup: { lng: 10.03333377838135, lat: 55.36666488647461 },
  Gudme: { lng: 10.71666622161865, lat: 55.15000152587891 },
  'Nørager': { lng: 9.616666793823242, lat: 56.70000076293945 },
  'Videbæk': { lng: 8.633333206176758, lat: 56.08333206176758 },
  'Hvalsø': { lng: 11.85000038146973, lat: 55.59999847412109 },
  'Løgumkloster': { lng: 8.949999809265137, lat: 55.04999923706055 },
  'Rønnede': { lng: 12, lat: 55.25 },
  Vejle: { lng: 9.533333778381348, lat: 55.71666717529297 },
  Borre: { lng: 12.43333339691162, lat: 54.98333358764648 },
  Lyne: { lng: 8.5, lat: 55.79999923706055 },
  Kvong: { lng: 8.449999809265137, lat: 55.76666641235352 },
  Virum: { lng: 12.46666622161865, lat: 55.79999923706055 },
  Sall: { lng: 9.824999809265137, lat: 56.27861022949219 },
  Ikast: { lng: 9.149999618530273, lat: 56.15000152587891 },
  Skive: { lng: 9.033333778381348, lat: 56.56666564941406 },
  'Dragør': { lng: 12.66666698455811, lat: 55.58333206176758 },
  'Store Magleby': { lng: 12.63527774810791, lat: 55.59611129760742 },
  Ranum: { lng: 9.233333587646484, lat: 56.90000152587891 },
  'Tommerup Stationsby': { lng: 10.18099975585938, lat: 55.35100173950195 },
  'Tønder': { lng: 8.86388874053955, lat: 54.94277954101562 },
  'Søllerød': { lng: 12.51666641235352, lat: 55.81666564941406 },
  'Rødbyhavn': { lng: 11.35000038146973, lat: 54.65000152587891 },
  Aulum: { lng: 8.800000190734863, lat: 56.26666641235352 },
  'Skælskør': { lng: 11.30000019073486, lat: 55.25 },
  'Vallensbæk': { lng: 12.36666679382324, lat: 55.63333511352539 },
  Faxe: { lng: 12.11944484710693, lat: 55.25527954101562 },
  'Tårnby': { lng: 12.60000038146973, lat: 55.63333511352539 },
  //'Nykøbing Falster': { lng: 11.88333320617676, lat: 56.15000152587891 },
  'Sakskøbing': { lng: 11.64999961853027, lat: 54.79999923706055 },
  Padborg: { lng: 9.355833053588867, lat: 54.82277679443359 },
  Nakskov: { lng: 11.14999961853027, lat: 54.83333206176758 },
  Marstal: { lng: 10.51666641235352, lat: 54.84999847412109 },
  Broager: { lng: 9.683333396911621, lat: 54.88333511352539 },
  'Rudkøbing': { lng: 10.71666622161865, lat: 54.93333435058594 },
  Aabenraa: { lng: 9.433333396911621, lat: 55.03333282470703 },
  Bredebro: { lng: 8.833333015441895, lat: 55.04999923706055 },
  Nordborg: { lng: 9.75, lat: 55.04999923706055 },
  Faaborg: { lng: 10.23333358764648, lat: 55.09999847412109 },
  Svaneke: { lng: 15.14305591583252, lat: 55.13666534423828 },
  Ryslinge: { lng: 10.55000019073486, lat: 55.25 },
  Christiansfeld: { lng: 9.483333587646484, lat: 55.34999847412109 },
  Slagelse: { lng: 11.37383365631104, lat: 55.40497207641602 },
  Munkebo: { lng: 10.56666660308838, lat: 55.45000076293945 },
  Ringsted: { lng: 11.81666660308838, lat: 55.45000076293945 },
  Bramming: { lng: 8.699999809265137, lat: 55.46666717529297 },
  Esbjerg: { lng: 8.449999809265137, lat: 55.48333358764648 },
  Kolding: { lng: 9.5, lat: 55.49166488647461 },
  Otterup: { lng: 10.39999961853027, lat: 55.51666641235352 },
  Bogense: { lng: 10.10000038146973, lat: 55.56666564941406 },
  Ballerup: { lng: 12.36666679382324, lat: 55.73333358764648 },
  Jelling: { lng: 9.42361068725586, lat: 55.76263427734375 },
  Jyllinge: { lng: 12.11666679382324, lat: 55.75 },
  Horsens: { lng: 9.833333015441895, lat: 55.86666488647461 },
  'Skævinge': { lng: 12.16666698455811, lat: 55.91666793823242 },
  'Nykøbing Sjælland': { lng: 11.66666698455811, lat: 55.92499923706055 },
  Herning: { lng: 8.983333587646484, lat: 56.15000152587891 },
  Ebeltoft: { lng: 10.67805576324463, lat: 56.19361114501953 },
  Hinnerup: { lng: 10.0649995803833, lat: 56.27249908447266 },
  Hadsten: { lng: 10.05000019073486, lat: 56.33333206176758 },
  Randers: { lng: 10.05000019073486, lat: 56.46666717529297 },
  Hadsund: { lng: 10.11666679382324, lat: 56.71666717529297 },
  Aalborg: { lng: 9.916666984558105, lat: 57.04999923706055 },
  Aabybro: { lng: 9.75, lat: 57.15000152587891 },
  'Brønderslev': { lng: 9.966666221618652, lat: 57.26666641235352 },
  'Hjørring': { lng: 9.999160766601562, lat: 57.47978210449219 },
  Roskilde: { lng: 12.08333301544189, lat: 55.65000152587891 },
  Mariager: { lng: 10, lat: 56.65000152587891 },
  'Hasle': { lng: 14.70416641235352, lat: 55.18333435058594 },
  'Ølstykke': { lng: 12.15582466125488, lat: 55.79203796386719 },
  'Årslev': { lng: 10.46033954620361, lat: 55.29671859741211 },
  'Ørbæk': { lng: 10.67027759552002, lat: 55.25722122192383 },
  Tommerup: { lng: 10.21278953552246, lat: 55.32120132446289 },
  Pandrup: { lng: 9.683333396911621, lat: 57.23333358764648 },
  'Skørping': { lng: 9.883333206176758, lat: 56.83333206176758 },
  Holsted: { lng: 8.917778015136719, lat: 55.51027679443359 },
  Augustenborg: { lng: 9.883333206176758, lat: 54.95000076293945 },
  'Skærbæk': { lng: 8.767999649047852, lat: 55.15700149536133 },
  Tinglev: { lng: 9.25, lat: 54.93333435058594 },
  'Langebæk': { lng: 12.10000038146973, lat: 55 },
  Jystrup: { lng: 11.88333320617676, lat: 55.51666641235352 },
  Hoven: { lng: 8.759166717529297, lat: 55.85083389282227 },
  Blokhus: { lng: 9.583333015441895, lat: 57.25 },
  Tune: { lng: 12.18333339691162, lat: 55.59999847412109 },
  Brabrand: { lng: 10.11666679382324, lat: 56.15000152587891 },
  'Nørre Nebel': { lng: 8.300000190734863, lat: 55.78333282470703 },
  Byrum: { lng: 10.98333358764648, lat: 57.25 },
  Tisvilde: { lng: 12.0847225189209, lat: 56.05222320556641 },
  Thisted: { lng: 8.699999809265137, lat: 56.95000076293945 },
  'Brøndbyvester': { lng: 12.41638851165771, lat: 55.65472412109375 },
  Vorbasse: { lng: 9.083333015441895, lat: 55.63333511352539 },
  'Ølsted': { lng: 12.07083320617676, lat: 55.92194366455078 },
  Gummerup: { lng: 10.13333320617676, lat: 55.25 },
  Kastrup: { lng: 12.64166641235352, lat: 55.63750076293945 },
  Bredsten: { lng: 9.381111145019531, lat: 55.70194625854492 },
  'Brønshøj': { lng: 12.49820518493652, lat: 55.70417404174805 },
  Givskud: { lng: 9.333333015441895, lat: 55.79999923706055 },
  Charlottenlund: { lng: 12.55194473266602, lat: 55.75055694580078 },
  Sulsted: { lng: 9.966666221618652, lat: 57.15000152587891 },
  'Vester Hassing': { lng: 10.125, lat: 57.06666564941406 },
  //Taastrup: { lng: 12.30000019073486, lat: 56.15000152587891 },
  Hornslet: { lng: 10.33333301544189, lat: 56.31666564941406 },
  Gandrup: { lng: 10.1783332824707, lat: 57.05833435058594 },
  'Særslev': { lng: 10.26666641235352, lat: 55.48333358764648 },
  'Møgeltønder': { lng: 8.816666603088379, lat: 54.93333435058594 },
  Kokkedal: { lng: 12.48999977111816, lat: 55.90800094604492 },
  Vamdrup: { lng: 9.283333778381348, lat: 55.41666793823242 },
  Hatting: { lng: 9.766666412353516, lat: 55.84999847412109 },
  Nysted: { lng: 11.75, lat: 54.66666793823242 },
  Holeby: { lng: 11.46666622161865, lat: 54.71666717529297 },
  Maribo: { lng: 11.51666641235352, lat: 54.76666641235352 },
  'Stubbekøbing': { lng: 12.05000019073486, lat: 54.88333511352539 },
  'Gråsten': { lng: 9.600000381469727, lat: 54.91666793823242 },
  Karise: { lng: 12.19777774810791, lat: 55.30694580078125 },
  Nyborg: { lng: 10.78333377838135, lat: 55.29999923706055 },
  Haslev: { lng: 11.96666622161865, lat: 55.33333206176758 },
  Odense: { lng: 10.38853645324707, lat: 55.39596557617188 },
  'Søndersø': { lng: 10.26666641235352, lat: 55.48333358764648 },
  Skibby: { lng: 11.95899963378906, lat: 55.74900054931641 },
  'Kongens Lyngby': { lng: 12.5, lat: 55.77000045776367 },
  'Jægerspris': { lng: 11.98333358764648, lat: 55.84999847412109 },
  Brande: { lng: 9.116666793823242, lat: 55.95000076293945 },
  'Rørvig': { lng: 11.76666641235352, lat: 55.95000076293945 },
  Aarhus: { lng: 10.21666622161865, lat: 56.15719985961914 },
  Skejby: { lng: 10.18333339691162, lat: 56.20000076293945 },
  Hammel: { lng: 9.866666793823242, lat: 56.25 },
  'Hjortshøj': { lng: 10.26666641235352, lat: 56.25 },
  Lemvig: { lng: 8.316666603088379, lat: 56.54999923706055 },
  'Støvring': { lng: 9.831000328063965, lat: 56.88899993896484 },
  Sindal: { lng: 10.21666622161865, lat: 57.46666717529297 },
  Skagen: { lng: 10.59786128997803, lat: 57.72312164306641 },
  'Hørning': { lng: 10.03555583953857, lat: 56.08499908447266 },
  'Stenløse': { lng: 12.19722175598145, lat: 55.7672233581543 },
  'Ærøskøbing': { lng: 10.41250038146973, lat: 54.89166641235352 },
  Assens: { lng: 9.899999618530273, lat: 55.26666641235352 },
  Haarby: { lng: 10.11666679382324, lat: 55.21666717529297 },
  Vissenbjerg: { lng: 10.13333320617676, lat: 55.38333511352539 },
  Brovst: { lng: 9.533333778381348, lat: 57.09999847412109 },
  Fjerritslev: { lng: 9.266666412353516, lat: 57.08333206176758 },
  'Arden': { lng: 9.858888626098633, lat: 56.76972198486328 },
  'Brørup': { lng: 9.01805591583252, lat: 55.48305511474609 },
  'Nørre Alslev': { lng: 11.89999961853027, lat: 54.90000152587891 },
  'Greve Strand': { lng: 12.30000019073486, lat: 55.56666564941406 },
  Viborg: { lng: 9.399999618530273, lat: 56.45000076293945 },
  'Snoghøj': { lng: 9.716666221618652, lat: 55.51666641235352 },
  //Vordingborg: { lng: 11.89999961853027, lat: 56.15000152587891 },
  Gedved: { lng: 9.850000381469727, lat: 55.93333435058594 },
  Stege: { lng: 12.30000019073486, lat: 54.98333358764648 },
  Malling: { lng: 10.18333339691162, lat: 56.03333282470703 },
  'Nørre Aaby': { lng: 9.899999618530273, lat: 55.45000076293945 },
  Egtved: { lng: 9.300000190734863, lat: 55.61666488647461 },
  Ry: { lng: 9.764100074768066, lat: 56.09177017211914 },
  Galten: { lng: 9.904999732971191, lat: 56.15638732910156 },
  Nordby: { lng: 8.399999618530273, lat: 55.43333435058594 },
  'Båring': { lng: 9.916666984558105, lat: 55.5 },
  Foulum: { lng: 9.583333015441895, lat: 56.5 },
  'Græsted': { lng: 12.28333377838135, lat: 56.06666564941406 },
  Fredensborg: { lng: 12.39999961853027, lat: 55.96666717529297 },
  Taulov: { lng: 9.616666793823242, lat: 55.54999923706055 },
  Dybvad: { lng: 10.36666679382324, lat: 57.28333282470703 },
  'Løsning': { lng: 9.699999809265137, lat: 55.79999923706055 },
  Skamby: { lng: 10.26666641235352, lat: 55.48333358764648 },
  'Vedbæk': { lng: 12.5649995803833, lat: 55.85300064086914 },
  Ortved: { lng: 11.85000038146973, lat: 55.48333358764648 },
  Outrup: { lng: 8.339166641235352, lat: 55.71888732910156 },
  'Trørød': { lng: 12.55000019073486, lat: 55.83333206176758 },
  'Thyborøn': { lng: 8.216666221618652, lat: 56.70000076293945 },
  Snekkersten: { lng: 12.60000038146973, lat: 56 },
  Tranebjerg: { lng: 10.60000038146973, lat: 55.83333206176758 },
  Tranbjerg: { lng: 8.699999809265137, lat: 55.58333206176758 },
  'Højby': { lng: 11.58333301544189, lat: 55.90000152587891 },
  Storvorde: { lng: 10.08333301544189, lat: 57 },
  'Lillerød': { lng: 12.35000038146973, lat: 55.86666488647461 },
  Skodsborg: { lng: 12.56666660308838, lat: 55.81666564941406 },
  Karlslunde: { lng: 12.23333358764648, lat: 55.56666564941406 },
  //'Store Heddinge': { lng: 12.38333320617676, lat: 56.15000152587891 },
  'Gjessø': { lng: 9.5, lat: 56.11666488647461 },
  'Faxe Ladeplads': { lng: 12.16666698455811, lat: 55.21666717529297 },
  Uggerslev: { lng: 10.33333301544189, lat: 55.48333358764648 },
  'Solrød Strand': { lng: 12.21666622161865, lat: 55.51666641235352 },
  Ravnkilde: { lng: 9.766666412353516, lat: 56.75 },
  Tarm: { lng: 8.519721984863281, lat: 55.90750122070312 },
  'Rødovre': { lng: 12.45499992370605, lat: 55.68138885498047 },
  Varde: { lng: 8.483333587646484, lat: 55.63333511352539 },
  'Ålbæk': { lng: 10.41666698455811, lat: 57.58333206176758 },
  'Hvide Sande': { lng: 8.133333206176758, lat: 55.98333358764648 },
  'Bagsværd': { lng: 12.45777797698975, lat: 55.76444625854492 },
  'Allinge-Sandvig': { lng: 14.80138874053955, lat: 55.27777862548828 },
  Tejn: { lng: 14.83333301544189, lat: 55.23333358764648 },
  Vemb: { lng: 8.333333015441895, lat: 56.33333206176758 },
  'Hornbæk': { lng: 12.44999980926514, lat: 56.09166717529297 },
  Hvorslev: { lng: 9.767000198364258, lat: 56.36600112915039 },
  Jyderup: { lng: 11.39999961853027, lat: 55.65000152587891 },
  'Sønderho': { lng: 8.466666221618652, lat: 55.34944534301758 },
  Birkende: { lng: 10.58333301544189, lat: 55.38333511352539 },
  'Smørumnedre': { lng: 12.30000019073486, lat: 55.73333358764648 },
  'Østermarie': { lng: 15, lat: 55.13333511352539 },
  Tirstrup: { lng: 10.68333339691162, lat: 56.29999923706055 },
  'Andkær': { lng: 9.633333206176758, lat: 55.66666793823242 },
  'Store Merløse': { lng: 11.71666622161865, lat: 55.54999923706055 },
  Gudhjem: { lng: 14.97194480895996, lat: 55.21027755737305 },
  Aarsdale: { lng: 15.14444446563721, lat: 55.1058349609375 },
  'Klitmøller': { lng: 8.5, lat: 57.03333282470703 },
  Hemmet: { lng: 8.516666412353516, lat: 55.90000152587891 },
  Skarrild: { lng: 8.897500038146973, lat: 55.97833251953125 } });
(function() {

// # Game data

// image name
var map = 'img/denmark.jpg';
// size of image
var norm = [1920, 960];
// locations to quiz
var locsrc = locations;
var zoomfactor = 3;
// normalise location position
(function() {
    for(var i = 0; i < locations.length; ++i) {
        locations[i][1] /= norm[0];
        locations[i][2] /= norm[1];
    }
})();

// # var decls
var quizvalue = 0;
var cursorDown = false;
var zoomedin = false;
var prevx, prevy;
var imposx, imposy;
var mapDom;
var imwidth, imheight, viewwidth, viewheight;
var logosz;
var clickx, clicky, clicktime;
var namesize = Math.round($(window).width() / 8);
var textsize = Math.round(namesize / 3);
var count = 7;
// # Location management

function shuffle() {
    var i, j, result = [];

    locations = [];
    for(i=0;i<count;++i) {
        var loc = locsrc[Math.floor(Math.random() * locsrc.length)];
        locations[i] = loc;
        for(j=0;j<i;++j) {
            if( Math.abs(loc[1]-locations[j][1]) + Math.abs(loc[2]-locations[j][2]) < 0.1) {
                j = --i;
            }
        }
    }
}

function imbounds() {
    if(imposx > 0) { imposx = 0; }
    if(imposy > 0) { imposy = 0; }
    if(imposx < viewwidth - imwidth) { imposx = viewwidth - imwidth; }
    if(imposy < viewheight- imheight) { imposy = viewheight- imheight; }
}

function downEvent(x,y) {
    if(cursorDown) {
        return;
    }
    cursorDown = true;

    viewwidth = $(window).width();
    viewheight = $(window).height();
    namesize = Math.round($(window).width() / 8);
    clickx = x;
    clicky = y;
    clicktime = (new Date()).getTime();

    if(!zoomedin) {
        zoomin(x, y);
    } else {
        prevx = x;
        prevy = y;
    }
}

function upEvent(x,y) {
    console.log('upevent');
    if(!cursorDown) {
        return;
    }
    cursorDown = false;
    if(!zoomedin) {
        return;
    }

    var clickduration = (new Date()).getTime()  - clicktime;
    var dx = prevx - clickx;
    var dy = prevy - clicky;
    var movement = Math.sqrt(dx*dx + dy*dy);


    // single click
    if(clickduration < 500 && movement < viewwidth / 10) {
        var result = nearest(
            (prevx-imposx)/imwidth,
            (prevy-imposy)/imheight);

        answer(result === quizvalue, quizvalue);

    }
}

function answer(ok, question) {
    var newquiz;

    corrects[question] = ok;
    console.log("question", locations[question]);
    var allok = true;
    for(var i = 0; i < count; ++i) {
        allok = allok && corrects[i];
    }
    if(allok) {
        shuffle();
    }

    do {
        newquiz = Math.floor(Math.random() * count);
        if(corrects[newquiz]) {
            newquiz = Math.floor(Math.random() * count);
        }
        if(corrects[newquiz]) {
            newquiz = Math.floor(Math.random() * count);
        }
    } while(newquiz === question);
    console.log("newquiz", locations[newquiz], corrects[newquiz]);

    quizvalue = newquiz;

    $('#cityname').css('color', ok ? '#44aa44' : '#cc3333');

    zoomout(function() {
        function slidein() {
            console.log(Date.now());
            $('#cityname')
                .text(locations[newquiz][0])
                .css('font-size', namesize)
                .css('color', 'white')
                .css('left', viewwidth)
                .css('width', viewwidth)
                .css('top', Math.round(viewheight/2 - namesize));
            setTimeout(function() {$('#cityname').animate({ left: 0 });}, 0);
        }
        console.log('ok', ok);

        if(ok) {
            console.log(Date.now());
            $('#cityname')
                .animate({
                    top: viewheight,
                    left: 0,
                    'font-size': namesize*2,
                    'width': viewwidth
                });
            setTimeout(slidein, 500);
        } else {
            console.log(Date.now(),question, locations[question]);
            $('#cityname')
                .animate({
                    top: locations[question][2] * viewheight,
                    left: locations[question][1] * viewwidth,
                    'font-size': 0,
                    'width': 0
                });
            setTimeout(slidein, 500);
    }
    });
}

var locationimgs;

function moveEvent(x,y) {
    if(!cursorDown) {
        return;
    }
    console.log("moveEvent " +  x + ", " + y);
    if(!zoomedin) {
        return;
    }

    imposx += x - prevx;
    imposy += y - prevy;
    prevx = x; prevy = y;
    imbounds();
    mapDom.style.top = imposy + 'px';
    mapDom.style.left = imposx + 'px';
    locationimgs = $("#locations")[0].children;
    for(var i = 0; i < count; ++i) {
        locationimgs[i].style.left = (0|(locations[i][1] * imwidth + imposx - 0.5 * logosz)) + "px";
        locationimgs[i].style.top = (0|(locations[i][2] * imheight + imposy- 0.5 * logosz)) + "px";
    }
}

function animate(fn) {
    $('#map').animate({
        left: imposx,
        top: imposy,
        width: imwidth,
        height: imheight
    });
    setTimeout(fn, 500);
    for(var i = 0; i < count; ++i) {
        $("#loc" + i)
            .attr("src", 'img/location.png')
            .css('z-index', -1)
            .css("position", 'fixed')
            .animate({
                'width': logosz,
                'height': logosz,
                "left": locations[i][1] * imwidth + imposx - 0.5 * logosz,
                "top": locations[i][2] * imheight + imposy - 0.5 * logosz
            });
    }
    $("#loc" + i).css("left", viewwidth);
}

function nearest(x, y) {
    var dist = 100;
    var result;
    for(var i = 0; i < count; ++i) {
        var loc = locations[i];
        var dist2 = (loc[1] - x)*(loc[1] - x) + (loc[2] - y)*(loc[2] - y);
        if(dist2 < dist) {
            result = i;
            dist = dist2;
        }
    }
    return result;
}

function zoomin(x, y) {
    imposy =  Math.round(viewheight / 2 - zoomfactor * y);
    imposx = Math.round(viewwidth / 2 - zoomfactor * x);
    imwidth = zoomfactor * viewwidth;
    imheight = zoomfactor * viewheight;
    imbounds();
    logosz = Math.round(viewwidth/10);
    animate( function() { zoomedin = true; });
    $('#cityname').animate({
        top: 0,
        'font-size': textsize,
    });
}

function zoomout(fn) {

    viewwidth = $(window).width();
    viewheight = $(window).height();
    imposy =  0;
    imposx = 0;
    imwidth = viewwidth;
    imheight = viewheight;
    logosz = Math.round(viewwidth/zoomfactor/10);

    animate(function() { zoomedin = false; });
    $('#cityname').animate({
        top: Math.round(viewheight/2 - namesize),
        'font-size': namesize,
        'width': $(window).width() - namesize
    });
    setTimeout(fn, 500);
}

function init() {
    var i;
    viewwidth = $(window).width();
    viewheight = $(window).height();
    corrects = [];
    for(i=0;i<count;++i) {
        corrects[i] = true;
    }
    shuffle();
    $('#content').html('<img src="img/denmark.jpg" id=map><div id="cityname"></div><div id="locations"></div>');
    var locstr = '';
    for(i = 0; i < count; ++i) {
        locstr += '<image id="loc' + i + '">';
    }
    $('#locations').html(locstr);
    $('#map').css('position', 'fixed')
             .css('user-select', 'none')
             .css('z-index', -2)
             .css('top', $(window).height()/2)
             .css('left', $(window).width()/2)
             .css('width', 0)
             .css('height', 0)
             ;
    mapDom = $('#map')[0];
    $('#cityname').css('position', 'fixed')
                  .css('text-align', 'center')
                 // .css('font-family', 'sans-serif')
                  .css('top', -namesize*1.5)
                  .css('font-size', namesize)
                  .css('width', $(window).width() - namesize)
                  .html('Danske&nbsp;byer')
                  .css('text-shadow', '0 0 .2ex black');
     answer(true, 0);
}

function main() {
    init();
    registerEvents();
    zoomout(function() { console.log('here') ;});
}

function registerEvents() {
    function xyWrapper(fn) {
        return function(e) {
            var clientY, clientX;
            try {
                clientY = e.originalEvent.touches[0].clientY;
                clientX = e.originalEvent.touches[0].clientX;
            } catch(e) {
            }
            clientY = clientY || e.clientY;
            clientX = clientX || e.clientX;

            fn(clientX, clientY);
            return false;
        };
    }

    if ('ontouchstart' in document.documentElement) {
        $('#content').bind('touchstart', xyWrapper(downEvent));
    } else {
        $('#content').bind('mousedown', xyWrapper(downEvent));
    }

    $('#content').bind('mouseout mouseup touchend', xyWrapper(upEvent));

    if ('ontouchmove' in document.documentElement) {
        $('#content').bind('touchmove', xyWrapper(moveEvent));
    } else {
        $('#content').bind('mousemove', xyWrapper(moveEvent));
    }
}


    $(main);

})();
}};
