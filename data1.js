// Lift The Cup — squad data, part 1: 1990, 1994, 1998
// Player format: [name, positions ("/"-separated: GK RB CB LB CDM CM CAM RM LM RW LW ST), rating 0-99]
const WC_DATA = [];
function T(name, flag, players) { return { name, flag, players }; }

WC_DATA.push({
  year: 1990, host: "Italy",
  teams: [
    T("West Germany","🇩🇪",[
      ["Bodo Illgner","GK",85],["Andreas Brehme","LB/RB",90],["Jürgen Kohler","CB",88],["Guido Buchwald","CB",87],["Klaus Augenthaler","CB",84],
      ["Lothar Matthäus","CM/CDM",95],["Pierre Littbarski","RW/CAM",84],["Thomas Häßler","CAM/RW",85],["Olaf Thon","CM/CAM",81],
      ["Jürgen Klinsmann","ST",90],["Rudi Völler","ST",89]
    ]),
    T("Argentina","🇦🇷",[
      ["Sergio Goycochea","GK",89],["Oscar Ruggeri","CB",86],["José Serrizuela","CB",77],["Juan Simón","CB",76],
      ["Diego Maradona","CAM",92],["Jorge Burruchaga","CM/CAM",84],["Pedro Troglio","CM/RW",77],
      ["Claudio Caniggia","ST/LW",87],["Gustavo Dezotti","ST",75],["Abel Balbo","ST",77]
    ]),
    T("Italy","🇮🇹",[
      ["Walter Zenga","GK",90],["Franco Baresi","CB",93],["Paolo Maldini","LB/CB",90],["Giuseppe Bergomi","RB/CB",87],["Riccardo Ferri","CB",83],
      ["Giuseppe Giannini","CAM/CM",84],["Roberto Donadoni","RW/LW",85],["Nicola Berti","CM",81],
      ["Salvatore Schillaci","ST",91],["Roberto Baggio","ST/CAM",88],["Gianluca Vialli","ST",83]
    ]),
    T("England","🏴󠁧󠁢󠁥󠁮󠁧󠁿",[
      ["Peter Shilton","GK",87],["Des Walker","CB",86],["Terry Butcher","CB",84],["Stuart Pearce","LB",85],["Paul Parker","RB/CB",81],
      ["Paul Gascoigne","CM/CAM",89],["David Platt","CM/CAM",86],["Chris Waddle","LW/RW",85],["John Barnes","LW",84],
      ["Gary Lineker","ST",90],["Peter Beardsley","ST/CAM",82]
    ]),
    T("Brazil","🇧🇷",[
      ["Cláudio Taffarel","GK",86],["Jorginho","RB",83],["Branco","LB",83],["Ricardo Gomes","CB",84],["Mauro Galvão","CB",80],
      ["Dunga","CDM/CM",84],["Alemão","CM/CDM",83],["Valdo","CAM/CM",80],
      ["Careca","ST",88],["Müller","RW/ST",83],["Romário","ST",85]
    ]),
    T("Netherlands","🇳🇱",[
      ["Hans van Breukelen","GK",85],["Ronald Koeman","CB",89],["Berry van Aerle","RB",78],["Adri van Tiggelen","LB/CB",79],
      ["Ruud Gullit","CAM/ST",90],["Frank Rijkaard","CDM/CB",91],["Jan Wouters","CDM/CM",81],
      ["Marco van Basten","ST",92],["Wim Kieft","ST",79]
    ]),
    T("Cameroon","🇨🇲",[
      ["Thomas N'Kono","GK",87],["Benjamin Massing","CB",76],["Emmanuel Kundé","CB",78],["Stephen Tataw","RB",74],
      ["Cyrille Makanaky","RW/CAM",78],["Louis Paul Mfédé","CM/LW",75],["André Kana-Biyik","CDM/CB",76],
      ["Roger Milla","ST",90],["François Omam-Biyik","ST",82]
    ]),
    T("Yugoslavia","🏳️",[
      ["Tomislav Ivković","GK",78],["Faruk Hadžibegić","CB",80],["Predrag Spasić","CB",76],["Refik Šabanadžović","RB/CDM",74],
      ["Dragan Stojković","CAM/RW",89],["Robert Prosinečki","CM/CAM",86],["Safet Sušić","CAM",85],["Srečko Katanec","CDM/CM",79],
      ["Darko Pančev","ST",84],["Davor Šuker","ST",79]
    ]),
    T("Romania","🇷🇴",[
      ["Silviu Lung","GK",80],["Ioan Andone","CB",78],["Michael Klein","LB",76],["Gheorghe Popescu","CB/CDM",84],
      ["Gheorghe Hagi","CAM/RW",89],["Ioan Sabău","CM/CAM",77],["Iosif Rotariu","CDM/CM",75],
      ["Marius Lăcătuș","RW/ST",82],["Florin Răducioiu","ST",79],["Gavril Balint","ST",77]
    ]),
    T("Colombia","🇨🇴",[
      ["René Higuita","GK",85],["Andrés Escobar","CB",82],["Luis Carlos Perea","CB",79],["Luis Fernando Herrera","RB",77],
      ["Carlos Valderrama","CAM/CM",89],["Freddy Rincón","CM/RW",84],["Leonel Álvarez","CDM",79],["Bernardo Redín","CAM/LW",76],
      ["Arnoldo Iguarán","ST",78],["Rubén Darío Hernández","ST",73]
    ]),
    T("Ireland","🇮🇪",[
      ["Packie Bonner","GK",84],["Paul McGrath","CB/CDM",87],["Mick McCarthy","CB",79],["Steve Staunton","LB",81],["Chris Morris","RB",75],
      ["Ray Houghton","RW/CM",82],["Andy Townsend","CM",80],["Kevin Sheedy","LW/CM",80],
      ["John Aldridge","ST",81],["Niall Quinn","ST",79],["Tony Cascarino","ST",77]
    ]),
    T("United States","🇺🇸",[
      ["Tony Meola","GK",75],["Marcelo Balboa","CB",75],["Paul Caligiuri","LB/CM",73],["Desmond Armstrong","RB/CB",69],
      ["Tab Ramos","CM/CAM",76],["John Harkes","CM",75],["Chris Henderson","RW/CM",70],
      ["Eric Wynalda","ST/LW",74],["Bruce Murray","ST",71],["Peter Vermes","ST",72]
    ]),
    T("Costa Rica","🇨🇷",[
      ["Luis Gabelo Conejo","GK",84],["Rónald González","CB",75],["Mauricio Montero","CB",73],["Róger Flores","CB/RB",72],
      ["Juan Cayasso","CAM/CM",78],["Óscar Ramírez","CM",76],["Marvin Obando","CM/LW",71],
      ["Hernán Medford","RW/ST",77],["Claudio Jara","ST",71]
    ]),
    T("Scotland","🏴󠁧󠁢󠁳󠁣󠁴󠁿",[
      ["Jim Leighton","GK",80],["Richard Gough","CB/RB",82],["Alex McLeish","CB",79],["Maurice Malpas","LB",76],
      ["Paul McStay","CM/CAM",80],["Roy Aitken","CDM/CM",77],["Jim Bett","CM/CAM",73],
      ["Mo Johnston","ST",79],["Ally McCoist","ST",80],["Robert Fleck","ST",72]
    ])
  ]
});

WC_DATA.push({
  year: 1994, host: "United States",
  teams: [
    T("Brazil","🇧🇷",[
      ["Cláudio Taffarel","GK",87],["Jorginho","RB",84],["Branco","LB",84],["Márcio Santos","CB",84],["Aldair","CB",86],
      ["Dunga","CDM/CM",87],["Mauro Silva","CDM",84],["Raí","CAM/CM",82],["Zinho","LW/CM",82],
      ["Romário","ST",96],["Bebeto","ST",90],["Ronaldo","ST",81]
    ]),
    T("Italy","🇮🇹",[
      ["Gianluca Pagliuca","GK",87],["Franco Baresi","CB",92],["Paolo Maldini","LB/CB",92],["Alessandro Costacurta","CB",87],["Antonio Benarrivo","RB/LB",81],
      ["Dino Baggio","CM/CDM",84],["Demetrio Albertini","CM/CDM",85],["Roberto Donadoni","RW/LW",84],["Nicola Berti","CM",80],
      ["Roberto Baggio","CAM/ST",95],["Giuseppe Signori","ST/LW",84],["Daniele Massaro","ST",83]
    ]),
    T("Sweden","🇸🇪",[
      ["Thomas Ravelli","GK",87],["Patrik Andersson","CB",83],["Joachim Björklund","CB",79],["Roland Nilsson","RB",81],
      ["Jonas Thern","CM/CDM",83],["Stefan Schwarz","CM/CDM",82],["Klas Ingesson","CM",79],
      ["Tomas Brolin","CAM/ST",88],["Martin Dahlin","ST",85],["Kennet Andersson","ST",86],["Henrik Larsson","ST/RW",80]
    ]),
    T("Bulgaria","🇧🇬",[
      ["Borislav Mihaylov","GK",83],["Trifon Ivanov","CB",82],["Emil Kremenliev","RB",75],["Tsanko Tsvetanov","LB",74],
      ["Krasimir Balakov","CAM/CM",87],["Yordan Letchkov","CM/CAM",85],["Zlatko Yankov","CM/CDM",75],
      ["Hristo Stoichkov","ST/LW",94],["Emil Kostadinov","RW/ST",84],["Nasko Sirakov","ST",78]
    ]),
    T("Germany","🇩🇪",[
      ["Bodo Illgner","GK",85],["Jürgen Kohler","CB",87],["Thomas Helmer","CB",84],["Thomas Berthold","RB/CB",80],["Andreas Brehme","LB/RB",85],
      ["Lothar Matthäus","CDM/CB",89],["Thomas Häßler","CAM/RW",86],["Andreas Möller","CAM/CM",85],["Stefan Effenberg","CM",83],
      ["Jürgen Klinsmann","ST",91],["Rudi Völler","ST",85],["Karl-Heinz Riedle","ST",80]
    ]),
    T("Romania","🇷🇴",[
      ["Florin Prunea","GK",79],["Dan Petrescu","RB",84],["Daniel Prodan","CB",80],["Gheorghe Popescu","CB/CDM",86],["Miodrag Belodedici","CB",84],
      ["Gheorghe Hagi","CAM/RW",94],["Ilie Dumitrescu","LW/ST",87],["Dorinel Munteanu","CM/LW",79],
      ["Florin Răducioiu","ST",86],["Ion Vlădoiu","ST",71]
    ]),
    T("Netherlands","🇳🇱",[
      ["Ed de Goey","GK",82],["Frank de Boer","CB/LB",85],["Ronald Koeman","CB",88],["Stan Valckx","CB",76],
      ["Jan Wouters","CDM/CM",80],["Rob Witschge","CM/LW",77],["Wim Jonk","CM/CAM",81],["Marc Overmars","RW/LW",84],
      ["Dennis Bergkamp","ST/CAM",90],["Ronald de Boer","RW/ST",79],["Bryan Roy","LW/ST",79]
    ]),
    T("Argentina","🇦🇷",[
      ["Luis Islas","GK",78],["Oscar Ruggeri","CB",84],["Roberto Sensini","CB/RB",80],["José Chamot","LB/CB",80],
      ["Diego Simeone","CDM/CM",84],["Fernando Redondo","CDM/CM",87],["Ariel Ortega","CAM/RW",82],["Diego Maradona","CAM",90],
      ["Gabriel Batistuta","ST",91],["Claudio Caniggia","ST/RW",86],["Abel Balbo","ST",81]
    ]),
    T("Spain","🇪🇸",[
      ["Andoni Zubizarreta","GK",87],["Fernando Hierro","CB/CDM",88],["Abelardo","CB",80],["Sergi Barjuán","LB",80],["Miguel Ángel Nadal","CB/CDM",83],
      ["Pep Guardiola","CDM/CM",85],["José Luis Caminero","CM/CAM",83],["Luis Enrique","CM/RW",84],
      ["Julio Salinas","ST",80],["Jon Andoni Goikoetxea","RW",81]
    ]),
    T("Nigeria","🇳🇬",[
      ["Peter Rufai","GK",82],["Uche Okechukwu","CB",80],["Augustine Eguavoen","RB",77],["Ben Iroha","LB",75],
      ["Jay-Jay Okocha","CAM/CM",86],["Sunday Oliseh","CDM/CM",82],["Finidi George","RW",84],
      ["Rashidi Yekini","ST",86],["Daniel Amokachi","ST",84],["Emmanuel Amunike","LW",83]
    ]),
    T("United States","🇺🇸",[
      ["Tony Meola","GK",79],["Alexi Lalas","CB",80],["Marcelo Balboa","CB",81],["Paul Caligiuri","LB/CM",76],["Fernando Clavijo","RB",73],
      ["Tab Ramos","CM/CAM",81],["John Harkes","CM",80],["Cobi Jones","RW/LW",78],
      ["Eric Wynalda","ST",80],["Earnie Stewart","ST/RW",79],["Roy Wegerle","ST",75]
    ]),
    T("Ireland","🇮🇪",[
      ["Packie Bonner","GK",82],["Paul McGrath","CB",86],["Phil Babb","CB",80],["Denis Irwin","RB/LB",82],["Terry Phelan","LB",76],
      ["Roy Keane","CM/CDM",87],["Ray Houghton","RW/CM",82],["Andy Townsend","CM",79],["John Sheridan","CM/CAM",76],
      ["John Aldridge","ST",78],["Tommy Coyne","ST",73]
    ]),
    T("Colombia","🇨🇴",[
      ["Óscar Córdoba","GK",81],["Andrés Escobar","CB",83],["Luis Carlos Perea","CB",77],["Wilson Pérez","RB",73],
      ["Carlos Valderrama","CAM/CM",90],["Freddy Rincón","CM/RW",85],["Leonel Álvarez","CDM",78],["Gabriel Gómez","CM/CDM",75],
      ["Faustino Asprilla","ST/LW",87],["Adolfo Valencia","ST",80]
    ]),
    T("Saudi Arabia","🇸🇦",[
      ["Mohamed Al-Deayea","GK",80],["Mohammed Al-Khilaiwi","CB",72],["Abdullah Zubromawi","CB",71],["Ahmed Madani","CB/LB",72],
      ["Saeed Al-Owairan","RW/CAM",84],["Fuad Anwar","CM/CAM",74],["Khalid Al-Muwallid","CM/CAM",75],
      ["Sami Al-Jaber","ST",80],["Fahad Al-Bishi","ST/RW",73]
    ]),
    T("Mexico","🇲🇽",[
      ["Jorge Campos","GK",85],["Claudio Suárez","CB",82],["Ignacio Ambríz","CB/CDM",75],["Raúl Gutiérrez","CB/RB",73],
      ["Alberto García Aspe","CM/CAM",81],["Ramón Ramírez","LW/LB",80],["Benjamín Galindo","CM/CAM",77],["Marcelino Bernal","CM/CDM",75],
      ["Hugo Sánchez","ST",84],["Luis García","ST/CAM",82],["Zague","ST",77]
    ])
  ]
});

WC_DATA.push({
  year: 1998, host: "France",
  teams: [
    T("France","🇫🇷",[
      ["Fabien Barthez","GK",88],["Lilian Thuram","RB/CB",91],["Marcel Desailly","CB/CDM",90],["Laurent Blanc","CB",88],["Bixente Lizarazu","LB",87],
      ["Zinedine Zidane","CAM/CM",95],["Didier Deschamps","CDM/CM",86],["Emmanuel Petit","CM/CDM",86],["Youri Djorkaeff","CAM/ST",85],["Patrick Vieira","CM/CDM",82],
      ["Thierry Henry","LW/ST",85],["David Trezeguet","ST",81],["Stéphane Guivarc'h","ST",74]
    ]),
    T("Brazil","🇧🇷",[
      ["Cláudio Taffarel","GK",85],["Roberto Carlos","LB",90],["Cafu","RB",89],["Aldair","CB",85],["Júnior Baiano","CB",79],
      ["Dunga","CDM",84],["Rivaldo","CAM/LW",91],["Leonardo","CAM/LW",84],["César Sampaio","CDM/CM",80],
      ["Ronaldo","ST",94],["Bebeto","ST",85],["Denílson","LW",82]
    ]),
    T("Croatia","🇭🇷",[
      ["Dražen Ladić","GK",81],["Slaven Bilić","CB",83],["Igor Štimac","CB",82],["Dario Šimić","CB/RB",80],["Robert Jarni","LB",83],
      ["Zvonimir Boban","CAM/CM",87],["Robert Prosinečki","CM/CAM",85],["Aljoša Asanović","CAM/CM",82],
      ["Davor Šuker","ST",92],["Goran Vlaović","ST",78],["Mario Stanić","RW/ST",77]
    ]),
    T("Netherlands","🇳🇱",[
      ["Edwin van der Sar","GK",87],["Frank de Boer","CB",87],["Jaap Stam","CB",88],["Michael Reiziger","RB",81],["Arthur Numan","LB",79],
      ["Edgar Davids","CM/CDM",87],["Clarence Seedorf","CM/CAM",84],["Phillip Cocu","CM/CDM",83],["Ronald de Boer","RW/CM",81],["Marc Overmars","LW/RW",85],
      ["Dennis Bergkamp","ST/CAM",92],["Patrick Kluivert","ST",88]
    ]),
    T("Argentina","🇦🇷",[
      ["Carlos Roa","GK",84],["Roberto Ayala","CB",85],["Nelson Vivas","RB",77],["Javier Zanetti","RB/CM",87],["José Chamot","LB/CB",79],
      ["Juan Sebastián Verón","CM/CAM",86],["Diego Simeone","CDM/CM",85],["Ariel Ortega","CAM/RW",87],["Marcelo Gallardo","CAM",79],
      ["Gabriel Batistuta","ST",91],["Claudio López","LW/ST",82],["Hernán Crespo","ST",83]
    ]),
    T("Italy","🇮🇹",[
      ["Gianluca Pagliuca","GK",85],["Paolo Maldini","LB/CB",91],["Fabio Cannavaro","CB",87],["Alessandro Costacurta","CB",84],["Giuseppe Bergomi","RB/CB",80],
      ["Demetrio Albertini","CM/CDM",84],["Dino Baggio","CM/CDM",80],["Luigi Di Biagio","CDM/CM",79],
      ["Alessandro Del Piero","CAM/ST",86],["Roberto Baggio","CAM/ST",88],["Christian Vieri","ST",88],["Filippo Inzaghi","ST",81]
    ]),
    T("Germany","🇩🇪",[
      ["Andreas Köpke","GK",85],["Jürgen Kohler","CB",83],["Olaf Thon","CB/CDM",79],["Christian Wörns","CB",78],
      ["Lothar Matthäus","CDM/CB",84],["Dietmar Hamann","CDM/CM",80],["Andreas Möller","CAM",82],["Thomas Häßler","CAM/RW",80],
      ["Jürgen Klinsmann","ST",86],["Oliver Bierhoff","ST",87],["Ulf Kirsten","ST",79]
    ]),
    T("England","🏴󠁧󠁢󠁥󠁮󠁧󠁿",[
      ["David Seaman","GK",88],["Tony Adams","CB",86],["Sol Campbell","CB",85],["Gary Neville","RB/CB",82],["Graeme Le Saux","LB",79],
      ["David Beckham","RW/CM",87],["Paul Ince","CDM/CM",83],["Paul Scholes","CM/CAM",84],["Darren Anderton","RW",78],
      ["Alan Shearer","ST",89],["Michael Owen","ST",88],["Teddy Sheringham","ST/CAM",81]
    ]),
    T("Denmark","🇩🇰",[
      ["Peter Schmeichel","GK",91],["Jes Høgh","CB",77],["Marc Rieper","CB",78],["Jan Heintze","LB",76],
      ["Michael Laudrup","CAM/CM",89],["Thomas Helveg","RB/RW",79],["Martin Jørgensen","RW/CM",77],
      ["Brian Laudrup","RW/LW",88],["Ebbe Sand","ST",79],["Peter Møller","ST",74]
    ]),
    T("Nigeria","🇳🇬",[
      ["Peter Rufai","GK",78],["Taribo West","CB",81],["Uche Okechukwu","CB",78],["Celestine Babayaro","LB",80],
      ["Jay-Jay Okocha","CAM/CM",88],["Sunday Oliseh","CDM",83],["Finidi George","RW",82],["Mutiu Adepoju","CM/CAM",76],
      ["Nwankwo Kanu","ST",84],["Victor Ikpeba","ST/LW",79],["Rashidi Yekini","ST",77]
    ]),
    T("Chile","🇨🇱",[
      ["Nelson Tapia","GK",78],["Ronald Fuentes","CB",74],["Pedro Reyes","CB",74],["Javier Margas","CB/LB",76],
      ["José Luis Sierra","CAM",78],["Clarence Acuña","CM/CDM",76],["Fabián Estay","CM/CAM",75],
      ["Marcelo Salas","ST",89],["Iván Zamorano","ST",87]
    ]),
    T("Paraguay","🇵🇾",[
      ["José Luis Chilavert","GK",89],["Carlos Gamarra","CB",86],["Celso Ayala","CB",82],["Francisco Arce","RB",81],
      ["Roberto Acuña","CM/CDM",80],["Carlos Paredes","CM",77],["Julio César Enciso","CDM/CM",75],
      ["José Cardozo","ST",78],["Miguel Ángel Benítez","ST/LW",75],["Aristides Rojas","ST",72]
    ]),
    T("Jamaica","🇯🇲",[
      ["Warren Barrett","GK",71],["Ian Goodison","CB",73],["Frank Sinclair","CB/RB",75],["Ricardo Gardner","LB/LW",75],
      ["Theodore Whitmore","CM/CAM",77],["Robbie Earle","CM/CAM",76],["Fitzroy Simpson","CM/CDM",73],
      ["Deon Burton","ST",74],["Paul Hall","ST/RW",72],["Marcus Gayle","ST",73]
    ]),
    T("Mexico","🇲🇽",[
      ["Jorge Campos","GK",83],["Claudio Suárez","CB",82],["Duilio Davino","CB",75],["Salvador Carmona","RB",74],
      ["Alberto García Aspe","CM/CAM",80],["Pavel Pardo","CDM/CM",78],["Ramón Ramírez","LW/LB",78],
      ["Cuauhtémoc Blanco","CAM/ST",84],["Luis Hernández","ST",85],["Ricardo Peláez","ST",75]
    ])
  ]
});
