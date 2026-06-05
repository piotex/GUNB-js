import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="page-container content-page">
      <h1>Instrukcja obsługi CzytnikCSV</h1>

      <div className="content-section">
        <h2>📊 Co robi ta aplikacja?</h2>
        <p>
          CzytnikCSV pozwala przeglądać i analizować dane z plików CSV, dzięki
          czemu możesz łatwo filtrować i szukać interesujących Cię danych.
        </p>
      </div>

      <div className="content-section">
        <h2>📥 Krok 1: Pobierz plik z danymi</h2>
        <ol className="detailed-steps">
          <li>
            <strong>Pobierz plik</strong>
          </li>
          <li>
            <strong>Jeżeli pobrałeś plik .zip - rozpakuj plik ZIP:</strong>
            <br />
            ⚠️ <em>To ważne!</em> Pobrany plik będzie miał rozszerzenie{" "}
            <code>.zip</code>. Musisz go najpierw rozpakować:
            <ul>
              <li>
                <strong>Windows:</strong> Kliknij prawym przyciskiem myszy na
                plik ZIP → wybierz "Wyodrębnij wszystko..." lub "Rozpakuj tutaj"
              </li>
              <li>
                <strong>Mac:</strong> Kliknij dwukrotnie na plik ZIP -
                automatycznie się rozpakuje
              </li>
            </ul>
          </li>
          <li>
            <strong>Znajdź plik CSV:</strong>
            <br />
            Po rozpakowaniu zobaczysz plik z rozszerzeniem <code>.csv</code>. To
            właśnie ten plik będziesz wczytywać do aplikacji!
          </li>
        </ol>
      </div>

      <div className="content-section">
        <h2>⚙️ Krok 2: Wybierz filtry przed wczytaniem</h2>
        <p>
          Zanim wczytasz plik, możesz wybrać, które dane Cię interesują. Dzięki
          temu aplikacja załaduje się szybciej!
        </p>
        <ol className="detailed-steps">
          <li>
            <strong>Wybierz lata:</strong>
            <br />
            Zaznacz ptaszkami lata, z których chcesz zobaczyć dane. Możesz
            wybrać jedno lub więcej lat. Domyślnie zaznaczony jest bieżący rok.
            <br />
            <em>
              Podpowiedź: Jeśli chcesz wszystkie lata, kliknij "Zaznacz
              wszystko".
            </em>
          </li>
          <li>
            <strong>Wybierz województwa:</strong>
            <br />
            Zaznacz województwa, które Cię interesują. Możesz wybrać jedno lub
            więcej. Domyślnie zaznaczone jest mazowieckie.
            <br />
            <em>
              Podpowiedź: Jeśli chcesz wszystkie województwa, kliknij "Zaznacz
              wszystko".
            </em>
          </li>
        </ol>
      </div>

      <div className="content-section">
        <h2>📂 Krok 3: Wczytaj plik CSV</h2>
        <ol className="detailed-steps">
          <li>
            <strong>Kliknij w duży żółty prostokąt:</strong>
            <br />
            Na stronie głównej aplikacji zobaczysz duży żółty obszar z napisem
            "Kliknij lub przeciągnij plik CSV tutaj".
          </li>
          <li>
            <strong>Wybierz plik:</strong>
            <br />
            Po kliknięciu otworzy się okno wyboru plików. Znajdź i wybierz
            rozpakowany wcześniej plik CSV (ten z Kroku 1).
          </li>
          <li>
            <strong>Poczekaj na wczytanie:</strong>
            <br />
            Pojawi się napis "Przetwarzanie pliku CSV...". W zależności od
            wielkości pliku może to potrwać od kilku sekund do minuty.
          </li>
          <li>
            <strong>Gotowe!</strong>
            <br />
            Gdy plik się wczyta, automatycznie przejdziesz do widoku z danymi.
          </li>
        </ol>
      </div>

      <div className="content-section">
        <h2>🔍 Krok 4: Przeglądaj i filtruj dane</h2>
        <p>Teraz widzisz swoje dane w tabeli! Oto co możesz zrobić:</p>

        <h3>Sortowanie kolumn</h3>
        <ul>
          <li>
            Kliknij na nazwę dowolnej kolumny (nagłówek tabeli), aby posortować
            dane alfabetycznie lub od najnowszych do najstarszych.
          </li>
          <li>Kliknij ponownie, aby odwrócić kolejność sortowania.</li>
          <li>Kliknij trzeci raz, aby wrócić do oryginalnej kolejności.</li>
        </ul>

        <h3>Wybieranie kolumn do wyświetlenia</h3>
        <ul>
          <li>
            W sekcji "Wybierz kolumny do wyświetlenia" możesz zaznaczyć lub
            odznaczyć różne pola.
          </li>
          <li>
            Dzięki temu w tabeli zobaczysz tylko informacje, które Cię
            interesują.
          </li>
        </ul>

        <h3>Filtrowanie po organie</h3>
        <ul>
          <li>
            Możesz wybrać konkretny urząd lub organ, który Cię interesuje.
          </li>
          <li>Aplikacja pokaże tylko dane związane z tym organem.</li>
        </ul>

        <h3>Filtrowanie po kategorii</h3>
        <ul>
          <li>
            Zaznacz kategorie budowlane, które Cię interesują (np. "budynki
            mieszkalne", "drogi").
          </li>
          <li>W tabeli zostaną tylko wpisy z tych kategorii.</li>
        </ul>

        <h3>Filtrowanie po nazwie zamierzenia</h3>
        <ul>
          <li>
            Możesz wybrać typ inwestycji (np. "budowa", "rozbudowa",
            "rozbiórka").
          </li>
        </ul>

        <h3>Wyszukiwanie zaawansowane</h3>
        <ul>
          <li>
            Użyj sekcji "Zaawansowane wyszukiwanie", aby szukać konkretnych słów
            w wybranej kolumnie.
          </li>
          <li>
            Przykład: Możesz wyszukać wszystkie wpisy, gdzie w adresie występuje
            słowo "Warszawa".
          </li>
        </ul>
      </div>

      <div className="content-section">
        <h2>📄 Krok 5: Nawigacja po stronach danych</h2>
        <p>
          Gdy masz dużo danych, aplikacja wyświetla je na stronach po 100
          wierszy:
        </p>
        <ul className="detailed-steps">
          <li>
            <strong>Przyciski zakresów:</strong> Nad tabelą zobaczysz przyciski
            typu "1-100", "101-200", "201-300" itd. Każdy przycisk pokazuje,
            które wiersze będą wyświetlone.
          </li>
          <li>
            <strong>Aktywna strona:</strong> Przycisk żółto-pomarańczowy
            pokazuje, którą stronę aktualnie przeglądasz.
          </li>
          <li>
            <strong>Nawigacja:</strong> Możesz użyć przycisków "Poprzednia" i
            "Następna" lub kliknąć bezpośrednio na zakres, który Cię interesuje.
          </li>
          <li>
            <strong>Informacja o zakresie:</strong> Na górze widzisz dokładnie,
            które wiersze są wyświetlane (np. "Wyświetlanie wierszy 101-200 z
            500").
          </li>
        </ul>
      </div>

      <div className="content-section">
        <h2>👁️ Krok 6: Zobacz szczegóły wiersza</h2>
        <ul className="detailed-steps">
          <li>
            <strong>Kliknij na dowolny wiersz w tabeli</strong>, aby zobaczyć
            okno ze wszystkimi szczegółowymi informacjami o tym wpisie.
          </li>
          <li>
            W oknie zobaczysz wszystkie dostępne pola - nawet te, które nie są
            widoczne w tabeli.
          </li>
          <li>
            Aby zamknąć okno, kliknij krzyżyk (X) w prawym górnym rogu lub
            kliknij poza oknem.
          </li>
        </ul>
      </div>

      <div className="content-section">
        <h2>🔄 Krok 7: Wczytaj nowy plik</h2>
        <p>Gdy chcesz wczytać nowy plik lub zacząć od nowa:</p>
        <ul>
          <li>
            Kliknij na logo aplikacji <strong>"CzytnikCSV"</strong> w lewym
            górnym rogu.
          </li>
          <li>Wrócisz na stronę główną i będziesz mógł wczytać nowy plik.</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>❓ Częste pytania</h2>

        <div className="faq-item">
          <h4>Nie widzę niektórych danych które są na stronie</h4>
          <p>
            Możliwe że te dane nie są zawarte w pliku który wczytałeś. W takim przypadku aplikacja sama ich nie doda. 
            Masz jednak możliwość dodania ich ręcznie do pliku CSV, wtedy aplikacja je wyświetli. 
          </p>
        </div>

        <div className="faq-item">
          <h4>Co to jest plik CSV?</h4>
          <p>
            CSV to format pliku tekstowego, w którym dane są zapisane w postaci
            tabeli. Można go otworzyć w Excelu, Google Sheets lub notatniku.
          </p>
        </div>

        <div className="faq-item">
          <h4>Dlaczego aplikacja nie wczytuje mojego pliku?</h4>
          <p>Upewnij się, że:</p>
          <ul>
            <li>Plik ma rozszerzenie .csv (nie .zip!)</li>
            <li>Plik nie jest uszkodzony</li>
          </ul>
        </div>

        <div className="faq-item">
          <h4>Czy moje dane są bezpieczne?</h4>
          <p>
            Tak! Całe przetwarzanie odbywa się w Twojej przeglądarce. Dane nie
            są wysyłane na żaden serwer. Gdy zamkniesz aplikację, dane znikają.
          </p>
        </div>

        <div className="faq-item">
          <h4>Dlaczego wczytywanie trwa tak długo?</h4>
          <p>
            Pliki z bazy GUNB mogą być bardzo duże (setki tysięcy wierszy).
            Dlatego ważne jest, aby przed wczytaniem wybrać tylko interesujące
            Cię lata i województwa - to znacznie przyspieszy działanie!
          </p>
        </div>

        <div className="faq-item">
          <h4>Aplikacja nie działa - co robić?</h4>
          <p>Spróbuj:</p>
          <ul>
            <li>Odświeżyć stronę (klawisz F5)</li>
            <li>
              Sprawdzić, czy używasz nowoczesnej przeglądarki (Chrome, Firefox,
              Edge)
            </li>
            <li>Wyczyścić pamięć podręczną przeglądarki</li>
          </ul>
        </div>
      </div>

      <div className="content-section">
        <h2>✨ Wskazówki i triki</h2>
        <ul>
          <li>
            🚀 <strong>Zacznij od małego wyszukiwania:</strong> Przy pierwszym użyciu wybierz
            tylko jeden rok i jedno województwo - zobaczysz jak aplikacja działa
            bez długiego czekania.
          </li>
          <li>
            🔎 <strong>Eksperymentuj z filtrami:</strong> Nie bój się klikać i
            testować różnych opcji - nic nie zepsujesz!
          </li>
          <li>
            📊 <strong>Użyj sortowania:</strong> Sortuj kolumny, aby szybko
            znaleźć najnowsze lub najstarsze wpisy. Po kliknięciu w nagłówek
            pojawi się strzałka wskazująca kierunek sortowania.
          </li>
          <li>
            📄 <strong>Przeglądaj strony:</strong> Jeśli masz setki lub tysiące
            wierszy, użyj przycisków stron, aby szybko przejść do interesującego
            Cię zakresu danych.
          </li>
          <li>
            🖱️ <strong>Kliknij wiersz:</strong> Zamiast przewijać tabelę w bok,
            kliknij wiersz, aby zobaczyć wszystkie szczegóły w przejrzystym
            oknie.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
