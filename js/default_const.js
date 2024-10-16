function gen_years() {
    const aktualnyRok = new Date().getFullYear();
    const lata = [];
    for (let rok = aktualnyRok; rok >= 2010; rok--) {
        lata.push(rok.toString());
    }
    return lata;
}
var checkboxes_years = gen_years();



var checked_nazwa_zamierzenia_bud = [
    "budowa nowego/nowych obiektów budowlanych", 
    "nadbudowa istniejącego/istniejących obiektów budowlanych", 
    "rozbiórka istniejącego obiektu budowlanego", 
    "rozbudowa istniejącego/istniejących obiektów budowlanych", 
    "wykonanie robót budowlanych innych niż wymienione powyżej"
]
var posible_categories = [
    "I","II","III","IV","V","VI","VII","VIII","IX","X",
    "XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX",
    "XXI","XXII","XXIII","XXIV","XXV","XXVI","XXVII","XXVIII","XXIX","XXX"
]
var posible_organs = {
    "dolnośląskie": [
      "Prezydent Miasta Jelenia Góra",
      "Prezydent Miasta Legnica",
      "Prezydent Miasta Wałbrzych",
      "Prezydent Miasta Wrocław",
      "Starosta Lubiński",
      "Starosta Powiatu Bolesławiec",
      "Starosta Powiatu Dzierżoniów",
      "Starosta Powiatu Głogów",
      "Starosta Powiatu Góra",
      "Starosta Powiatu Jawor",
      "Starosta Powiatu Jelenia Góra",
      "Starosta Powiatu Kamienna Góra",
      "Starosta Powiatu Kłodzko",
      "Starosta Powiatu Legnica",
      "Starosta Powiatu Lubań",
      "Starosta Powiatu Lwówek Śląski",
      "Starosta Powiatu Milicz",
      "Starosta Powiatu Oława",
      "Starosta Powiatu Oleśnica",
      "Starosta Powiatu Polkowice",
      "Starosta Powiatu Środa Śląska",
      "Starosta Powiatu Strzelin",
      "Starosta Powiatu Świdnica",
      "Starosta Powiatu Trzebnica",
      "Starosta Powiatu Wałbrzych",
      "Starosta Powiatu Wołów",
      "Starosta Powiatu Wrocław",
      "Starosta Powiatu Ząbkowice Śląskie",
      "Starosta Powiatu Zgorzelec",
      "Starosta Powiatu Złotoryia",
      "Wojewoda Dolnośląski"
    ],
    "kujawsko-pomorskie": [
      "Prezydent Miasta Bydgoszcz",
      "Prezydent Miasta Grudziądz",
      "Prezydent Miasta Toruń",
      "Prezydent Miasta Włocławek",
      "Starosta Powiatu Aleksandrów Kujawski",
      "Starosta Powiatu Brodnica",
      "Starosta Powiatu Bydgoszcz",
      "Starosta Powiatu Chełmno",
      "Starosta Powiatu Golub-Dobrzyń",
      "Starosta Powiatu Grudziądz",
      "Starosta Powiatu Inowrocław",
      "Starosta Powiatu Lipno",
      "Starosta Powiatu Mogilno",
      "Starosta Powiatu Nakło",
      "Starosta Powiatu Radziejów",
      "Starosta Powiatu Rypin",
      "Starosta Powiatu Sępólno Krajeńskie",
      "Starosta Powiatu Świecie",
      "Starosta Powiatu Toruń",
      "Starosta Powiatu Tuchola",
      "Starosta Powiatu Wąbrzeźno",
      "Starosta Powiatu Włocławek",
      "Starosta Powiatu Żnin",
      "Wojewoda Kujawsko - Pomorski",
      "Wojewoda Kujawsko - Pomorski - Delegatura we Włocławku",
      "Wojewoda Kujawsko - Pomorski - Delegatura w Toruniu"
    ],
    "łódzkie": [
      "Prezydent Miasta Łódź",
      "Prezydent Miasta Piotrków Trybunalski",
      "Prezydent Miasta Skieniewice",
      "Starosta Powiatu Bełchatów",
      "Starosta Powiatu Brzeziny",
      "Starosta Powiatu Kutno",
      "Starosta Powiatu Łask",
      "Starosta Powiatu Łęczyca",
      "Starosta Powiatu Łódź",
      "Starosta Powiatu Łowicz",
      "Starosta Powiatu Opoczno",
      "Starosta Powiatu Pabianice",
      "Starosta Powiatu Pajęczno",
      "Starosta Powiatu Piotrków Trybunalski",
      "Starosta Powiatu Poddębice",
      "Starosta Powiatu Radomsko",
      "Starosta Powiatu Rawa",
      "Starosta Powiatu Sieradz",
      "Starosta Powiatu Tomaszów Mazowiecki",
      "Starosta Powiatu Wieluń",
      "Starosta Powiatu Wieruszów",
      "Starosta Powiatu Zduńska Wola",
      "Starosta Powiatu Zgierz",
      "Starostwa Powiatu Pabianice oddział Konstantynów Łódzki",
      "Starostwo Powiatowe w Skierniewicach",
      "Wojewoda Łódzki"
    ],
    "lubelskie": [
      "Prezydent Miasta Biała Podlaska",
      "Prezydent Miasta Chełm",
      "Prezydent Miasta Lublin",
      "Prezydent Miasta Zamość",
      "Starosta Powiatu Biała Podlaska",
      "Starosta Powiatu Biłgoraj",
      "Starosta Powiatu Chełm",
      "Starosta Powiatu Hrubieszów",
      "Starosta Powiatu Janów Lubelski",
      "Starosta Powiatu Kraśnik",
      "Starosta Powiatu Krasnystaw",
      "Starosta Powiatu Łęczna",
      "Starosta Powiatu Lubartów",
      "Starosta Powiatu Lublin",
      "Starosta Powiatu Łuków",
      "Starosta Powiatu Parczew",
      "Starosta Powiatu Puławy",
      "Starosta Powiatu Radzyń Podlaski",
      "Starosta Powiatu Ryki",
      "Starosta Powiatu Świdnik",
      "Starosta Powiatu Tomaszów Lubelski",
      "Starosta Powiatu Włodawa",
      "Starosta Powiatu Zamość",
      "Starostwo Powiatowe w Opolu Lubelskim",
      "Wojewoda Lubelski",
      "Wojewoda Lubelski - Delegatura w Chełmie"
    ],
    "lubuskie": [
      "Prezydent Miasta Gorzów Wielkopolski",
      "Prezydent Miasta Zielona Góra",
      "Starosta Powiatu Gorzów Wielkopolski",
      "Starosta Powiatu Krosno Odrzańskie",
      "Starosta Powiatu Międzyrzecz",
      "Starosta Powiatu Nowa Sól",
      "Starosta Powiatu Słubice",
      "Starosta Powiatu Strzelce Krajeńskie",
      "Starosta Powiatu Sulęcin",
      "Starosta Powiatu Świebodzin",
      "Starosta Powiatu Wschowa",
      "Starosta Powiatu Żagań",
      "Starosta Powiatu Żary",
      "Starosta Powiatu Zielona Góra",
      "Wojewoda Lubuski"
    ],
    "małopolskie": [
      "Prezydent Miasta Kraków ",
      "Prezydent Miasta Nowy Sącz",
      "Prezydent Miasta Tarnów",
      "Starosta Powiatu Bochnia",
      "Starosta Powiatu Brzesko",
      "Starosta Powiatu Chrzanów",
      "Starosta Powiatu Dąbrowa Tarnowska",
      "Starosta Powiatu Gorlice",
      "Starosta Powiatu Kraków",
      "Starosta Powiatu Limanowa",
      "Starosta Powiatu Miechów",
      "Starosta Powiatu Myślenice",
      "Starosta Powiatu Nowy Sącz",
      "Starosta Powiatu Nowy Targ",
      "Starosta Powiatu Olkusz",
      "Starosta Powiatu Oświęcim",
      "Starosta Powiatu Proszowice",
      "Starosta Powiatu Sucha Beskidzka",
      "Starosta Powiatu Tarnów",
      "Starosta Powiatu Wadowice",
      "Starosta Powiatu Wieliczka",
      "Starosta Powiatu Zakopane",
      "Wojewoda Małopolski",
      "Wojewoda Małopolski - Delegatura w Nowym Sączu",
      "Wojewoda Małopolski - Delegatura w Tarnowie"
    ],
    "mazowieckie": [
      "Prezydent Miasta Ostrołęka",
      "Prezydent Miasta Płock",
      "Prezydent Miasta Radom",
      "Prezydent Miasta Siedlce",
      "Prezydent Miasta Warszawa",
      "Prezydent Miasta Warszawa - Bemowo",
      "Prezydent Miasta Warszawa - Białołęka",
      "Prezydent Miasta Warszawa - Bielany",
      "Prezydent Miasta Warszawa - Mokotów",
      "Prezydent Miasta Warszawa - Ochota",
      "Prezydent Miasta Warszawa - Praga Płd.",
      "Prezydent Miasta Warszawa - Praga Pn.",
      "Prezydent Miasta Warszawa - Rembertów",
      "Prezydent Miasta Warszawa - Śródmieście",
      "Prezydent Miasta Warszawa - Targówek",
      "Prezydent Miasta Warszawa - Ursus",
      "Prezydent Miasta Warszawa - Ursynów",
      "Prezydent Miasta Warszawa - Wawer",
      "Prezydent Miasta Warszawa - Wesoła",
      "Prezydent Miasta Warszawa - Wilanów",
      "Prezydent Miasta Warszawa - Włochy",
      "Prezydent Miasta Warszawa - Wola",
      "Prezydent Miasta Warszawa - Żoliborz",
      "Starosta Powiatu Białobrzegi",
      "Starosta Powiatu Ciechanów",
      "Starosta Powiatu Garwolin",
      "Starosta Powiatu Gostynin",
      "Starosta Powiatu Grodzisk Mazowiecki",
      "Starosta Powiatu Grójec",
      "Starosta Powiatu Kozienice",
      "Starosta Powiatu Legionowo",
      "Starosta Powiatu Lipsko",
      "Starosta Powiatu Łosice",
      "Starosta Powiatu Maków Mazowiecki",
      "Starosta Powiatu Mińsk Mazowiecki",
      "Starosta Powiatu Mława",
      "Starosta Powiatu Nowy Dwór Mazowiecki",
      "Starosta Powiatu Ostrołęka",
      "Starosta Powiatu Ostrowia Mazowiecka",
      "Starosta Powiatu Otwock",
      "Starosta Powiatu Piaseczno",
      "Starosta Powiatu Płock",
      "Starosta Powiatu Płońsk",
      "Starosta Powiatu Pruszków",
      "Starosta Powiatu Przasnysz",
      "Starosta Powiatu Przysucha",
      "Starosta Powiatu Pułtusk",
      "Starosta Powiatu Radom",
      "Starosta Powiatu Siedlce",
      "Starosta Powiatu Sierpc",
      "Starosta Powiatu Sochaczew",
      "Starosta Powiatu Sokołów",
      "Starosta Powiatu Szydłowiec",
      "Starosta Powiatu Warszawa Zachodnia",
      "Starosta Powiatu Węgrów",
      "Starosta Powiatu Wołomin",
      "Starosta Powiatu Wyszków",
      "Starosta Powiatu Żuromin",
      "Starosta Powiatu Zwoleń",
      "Starosta Powiatu Żyrardów",
      "Wojewoda Mazowiecki",
      "Wojewoda Mazowiecki - Delegatura w Ostrołęce",
      "Wojewoda Mazowiecki - Delegatura w Płocku",
      "Wojewoda Mazowiecki - Delegatura w Radomiu",
      "Wojewoda Mazowiecki - Delegatura w Siedlcach",
      "Wojewoda Mazowiecki - Delegaura w Ciechanowie"
    ],
    "opolskie": [
      "Prezydent Miasta Opole",
      "Starosta Powiatu Brzeg",
      "Starosta Powiatu Głubczyce",
      "Starosta Powiatu Kędzierzyn-Koźle \t ",
      "Starosta Powiatu Kluczbork",
      "Starosta Powiatu Krapkowice",
      "Starosta Powiatu Namysłów",
      "Starosta Powiatu Nysa",
      "Starosta Powiatu Olesno",
      "Starosta Powiatu Opole",
      "Starosta Powiatu Prudnik",
      "Starosta Powiatu Strzelce Opolskie",
      "Wojewoda Opolski"
    ],
    "podkarpackie": [
      "Agencja Rozwoju Przemysłu S.A. oddział w Mielcu",
      "Prezydent Miasta Krosno",
      "Prezydent Miasta Przemyśl",
      "Prezydent Miasta Rzeszów",
      "Prezydent Miasta Tarnobrzeg",
      "Starosta Powiatu Brzozów",
      "Starosta Powiatu Dębica",
      "Starosta Powiatu Jarosław",
      "Starosta Powiatu Jasło",
      "Starosta Powiatu Kolbuszowa",
      "Starosta Powiatu Krosno",
      "Starosta Powiatu Łańcut",
      "Starosta Powiatu Lesko",
      "Starosta Powiatu Leżajsk",
      "Starosta Powiatu Lubaczów",
      "Starosta Powiatu Mielec",
      "Starosta Powiatu Nisko",
      "Starosta Powiatu Przemyśl",
      "Starosta Powiatu Przeworsk",
      "Starosta Powiatu Ropczyce",
      "Starosta Powiatu Rzeszów",
      "Starosta Powiatu Sanok",
      "Starosta Powiatu Stalowa Wola",
      "Starosta Powiatu Strzyżów",
      "Starosta Powiatu Tarnobrzeg",
      "Starosta Powiatu Ustrzyki Dolne",
      "Wojewoda Podkarpacki",
      "Wojewoda Podkarpacki - Delegatura w Krośnie",
      "Wojewoda Podkarpacki - Delegatura w Przemyślu",
      "Wojewoda Podkarpacki - Delegatura w Tarnobrzegu"
    ],
    "podlaskie": [
      "Prezydent Miasta Białegostoku",
      "Prezydent Miasta Łomża",
      "Prezydent Miasta Suwałki",
      "Starosta Powiatu Augustów",
      "Starosta Powiatu Białystok",
      "Starosta Powiatu Bielsk Podlaski",
      "Starosta Powiatu Grajewo",
      "Starosta Powiatu Hajnówka",
      "Starosta Powiatu Kolno",
      "Starosta Powiatu Łomża",
      "Starosta Powiatu Mońki",
      "Starosta Powiatu Sejny",
      "Starosta Powiatu Siemiatycze",
      "Starosta Powiatu Sokółka",
      "Starosta Powiatu Suwałki",
      "Starosta Powiatu Wysokie Mazowieckie",
      "Starosta Powiatu Zambrów",
      "Wojewoda Podlaski",
      "Wojewoda Podlaski - Delegatura w Łomży"
    ],
    "pomorskie": [
      "Pomorska Specjalna Strefa Ekonomiczna sp. z o.o.",
      "Prezydent Miasta Gdańsk",
      "Prezydent Miasta Gdynia",
      "Prezydent Miasta Słupsk",
      "Prezydent Miasta Sopotu",
      "Starosta Powiatu Bytów",
      "Starosta Powiatu Chojnice",
      "Starosta Powiatu Człuchów",
      "Starosta Powiatu Kartuzy",
      "Starosta Powiatu Kościerzyna",
      "Starosta Powiatu Kwidzyn",
      "Starosta Powiatu Lębork",
      "Starosta Powiatu Malbork",
      "Starosta Powiatu Nowy Dwór Gdański",
      "Starosta Powiatu Pruszcz Gdański",
      "Starosta Powiatu Puck",
      "Starosta Powiatu Słupsk",
      "Starosta Powiatu Starogard Gdański",
      "Starosta Powiatu Sztum",
      "Starosta Powiatu Tczew",
      "Starosta Powiatu Wejherowo",
      "Wojewoda Pomorski",
      "Wojewoda Pomorski - Delegatura w Słupsku"
    ],
    "śląskie": [
      "Prezydent Miasta Bielsko-Biała",
      "Prezydent Miasta Bytom",
      "Prezydent Miasta Chorzów (Powiat grodzki)",
      "Prezydent Miasta Częstochowa",
      "Prezydent Miasta Dąbrowa Górnicza (Powiat grodzki)",
      "Prezydent Miasta Gliwice",
      "Prezydent Miasta Jastrzębie Zdrój",
      "Prezydent Miasta Jaworzno",
      "Prezydent Miasta Katowice",
      "Prezydent Miasta Mysłowice",
      "Prezydent Miasta Piekary Śląskie",
      "Prezydent Miasta Piekary Śląskie - old",
      "Prezydent Miasta Ruda Śląska",
      "Prezydent Miasta Rybnik",
      "Prezydent Miasta Siemianowice Śląskie",
      "Prezydent Miasta Sosnowiec",
      "Prezydent Miasta Świętochłowice",
      "Prezydent miasta Tychy",
      "Prezydent Miasta Zabrze",
      "Prezydent Miasta Żory",
      "Starosta Powiatu Będzin (Powiat ziemski)",
      "Starosta Powiatu Bielsko-Biała",
      "Starosta Powiatu Bieruń",
      "Starosta Powiatu Cieszyn",
      "Starosta Powiatu Częstochowa",
      "Starosta Powiatu Gliwice",
      "Starosta Powiatu Kłobuck",
      "Starosta Powiatu Lubliniec",
      "Starosta Powiatu Mikołów",
      "Starosta Powiatu Myszków",
      "Starosta Powiatu Pszczyna",
      "Starosta Powiatu Racibórz",
      "Starosta Powiatu Rybnik",
      "Starosta Powiatu Tarnowskie Góry",
      "Starosta Powiatu Wodzisław Śląski",
      "Starosta Powiatu Zawiercie",
      "Starosta Powiatu Żywiec",
      "Wojewoda Śląski",
      "Wojewoda Śląski - Delegatura w Bielsko-Białej",
      "Wojewoda Śląski - Delegatura w Częstochowie"
    ],
    "świętokrzyskie": [
      "Prezydent Miasta Kielce",
      "Starosta Powiatu Busko-Zdrój",
      "Starosta Powiatu Jędrzejów",
      "Starosta Powiatu Kazimierza Wielka",
      "Starosta Powiatu Kielce",
      "Starosta Powiatu Końskie",
      "Starosta Powiatu Opatów",
      "Starosta Powiatu Ostrowiec Świętokrzyski",
      "Starosta Powiatu Pińczów",
      "Starosta Powiatu Sandomierz",
      "Starosta Powiatu Skarżysko-Kamienna",
      "Starosta Powiatu Starachowice",
      "Starosta Powiatu Staszów",
      "Starosta Powiatu Włoszczowa",
      "Wojewoda Świętokrzyski"
    ],
    "warmińsko-mazurskie": [
      "Prezydent Miasta Elbląg",
      "Prezydent Miasta Olsztyn",
      "Starosta Powiatu Bartoszyce",
      "Starosta Powiatu Braniewo",
      "Starosta Powiatu Działdowo",
      "Starosta Powiatu Elbląg",
      "Starosta Powiatu Ełk",
      "Starosta Powiatu Giżycko",
      "Starosta Powiatu Gołdap",
      "Starosta Powiatu Iława",
      "Starosta Powiatu Kętrzyn",
      "Starosta Powiatu Lidzbark Warmiński",
      "Starosta Powiatu Mrągowo",
      "Starosta Powiatu Nidzica",
      "Starosta Powiatu Nowe Miasto Lubawskie",
      "Starosta Powiatu Olecko",
      "Starosta Powiatu Olsztyn",
      "Starosta Powiatu Ostróda",
      "Starosta Powiatu Pisz",
      "Starosta Powiatu Szczytno",
      "Starosta Powiatu Węgorzewo",
      "Wojewoda Warmińsko-Mazurski",
      "Wojewoda Warmińsko-Mazurski - Delegatura w Elblągu"
    ],
    "wielkopolskie": [
      "Prezydent Miasta Kalisz",
      "Prezydent Miasta Konin",
      "Prezydent Miasta Leszno",
      "Prezydent Miasta Poznań",
      "Starosta Powiatu Chodzież",
      "Starosta Powiatu Czarnków",
      "Starosta Powiatu Gniezno",
      "Starosta Powiatu Gostyń",
      "Starosta Powiatu Grodzisk Wielkopolski",
      "Starosta Powiatu Jarocin",
      "Starosta Powiatu Kalisz",
      "Starosta Powiatu Kępno",
      "Starosta Powiatu Koło",
      "Starosta Powiatu Konin",
      "Starosta Powiatu Kościan",
      "Starosta Powiatu Krotoszyn",
      "Starosta Powiatu Leszno",
      "Starosta Powiatu Międzychód",
      "Starosta Powiatu Nowy Tomyśl",
      "Starosta Powiatu Oborniki Wielkopolskie",
      "Starosta Powiatu Ostrów Wielkopolski",
      "Starosta Powiatu Ostrzeszów",
      "Starosta Powiatu Piła",
      "Starosta Powiatu Pleszew",
      "Starosta Powiatu Poznań",
      "Starosta Powiatu Rawicz",
      "Starosta Powiatu Słupca",
      "Starosta Powiatu Śrem",
      "Starosta Powiatu Środa Wielkopolska",
      "Starosta Powiatu Szamotuły",
      "Starosta Powiatu Turek",
      "Starosta Powiatu Wągrowiec",
      "Starosta Powiatu Wolsztyn",
      "Starosta Powiatu Września",
      "Starosta Powiatu Złotów",
      "Wojewoda Wielkopolski",
      "Wojewoda Wielkopolski - Delegatura w Kaliszu",
      "Wojewoda Wielkopolski - Delegatura w Koninie",
      "Wojewoda Wielkopolski - Delegatura w Lesznie",
      "Wojewoda Wielkopolski - Delegatura w Pile"
    ],
    "zachodniopomorskie": [
      "Prezydent Miasta Koszalin",
      "Prezydent Miasta Świnoujście",
      "Prezydent Miasta Szczecin",
      "Starosta Powiatu Białogard",
      "Starosta Powiatu Choszczno",
      "Starosta Powiatu Drawsko Pomorskie",
      "Starosta Powiatu Goleniów",
      "Starosta Powiatu Gryfice",
      "Starosta Powiatu Gryfino",
      "Starosta Powiatu Kamień Pomorski",
      "Starosta Powiatu Kołobrzeg",
      "Starosta Powiatu Koszalin",
      "Starosta Powiatu Łobez",
      "Starosta Powiatu Myślibórz",
      "Starosta Powiatu Police",
      "Starosta Powiatu Pyrzyce",
      "Starosta Powiatu Sławno",
      "Starosta Powiatu Stargard Szczeciński",
      "Starosta Powiatu Świdwin",
      "Starosta Powiatu Szczecinek",
      "Starosta Powiatu Wałcz",
      "Wojewoda Zachodniopomorski",
      "Wojewoda Zachodniopomorski - Delegatura w Koszalinie"
    ]
}
